// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignedPriceOracle is Ownable {
    struct PriceData { uint256 price; uint256 updatedAt; address signer; }

    error ZeroPrice();
    error InvalidFreshnessWindow();
    error FutureTimestamp(uint256 timestamp, uint256 currentTime);
    error StaleUpdate(uint256 timestamp, uint256 currentTime);
    error UpdateNotNewer(bytes32 asset, uint256 timestamp, uint256 currentTimestamp);
    error UnauthorizedSigner(address signer);
    error NonceAlreadyUsed(address signer, uint256 nonce);
    error InvalidSignatureLength(uint256 length);
    error PriceUnavailable(bytes32 asset);
    error PriceExpired(bytes32 asset, uint256 updatedAt, uint256 currentTime);

    mapping(address => bool) public authorizedSigner;
    mapping(address => mapping(uint256 => bool)) public usedNonce;
    mapping(bytes32 => PriceData) private prices;
    uint256 public freshnessWindow;

    event SignerAuthorizationChanged(address indexed signer, bool authorized);
    event FreshnessWindowChanged(uint256 freshnessWindow);
    event PriceUpdated(bytes32 indexed asset, uint256 price, uint256 timestamp, address indexed signer, uint256 nonce);

    constructor(address initialOwner, address initialSigner, uint256 initialFreshnessWindow) Ownable(initialOwner) {
        if (initialFreshnessWindow == 0) revert InvalidFreshnessWindow();
        freshnessWindow = initialFreshnessWindow;
        authorizedSigner[initialSigner] = true;
        emit SignerAuthorizationChanged(initialSigner, true);
        emit FreshnessWindowChanged(initialFreshnessWindow);
    }

    function setSigner(address signer, bool authorized) external onlyOwner {
        authorizedSigner[signer] = authorized;
        emit SignerAuthorizationChanged(signer, authorized);
    }

    function setFreshnessWindow(uint256 newWindow) external onlyOwner {
        if (newWindow == 0) revert InvalidFreshnessWindow();
        freshnessWindow = newWindow;
        emit FreshnessWindowChanged(newWindow);
    }

    function updateDigest(bytes32 asset, uint256 price, uint256 timestamp, uint256 nonce) public view returns (bytes32) {
        return keccak256(abi.encode(address(this), block.chainid, asset, price, timestamp, nonce));
    }

    function submitPrice(bytes32 asset, uint256 price, uint256 timestamp, uint256 nonce, bytes calldata signature) external {
        if (price == 0) revert ZeroPrice();
        if (timestamp > block.timestamp) revert FutureTimestamp(timestamp, block.timestamp);
        if (block.timestamp - timestamp > freshnessWindow) revert StaleUpdate(timestamp, block.timestamp);
        if (signature.length != 65) revert InvalidSignatureLength(signature.length);
        address signer = ECDSA.recover(updateDigest(asset, price, timestamp, nonce), signature);
        if (!authorizedSigner[signer]) revert UnauthorizedSigner(signer);
        if (usedNonce[signer][nonce]) revert NonceAlreadyUsed(signer, nonce);
        PriceData memory current = prices[asset];
        if (current.updatedAt != 0 && timestamp <= current.updatedAt) revert UpdateNotNewer(asset, timestamp, current.updatedAt);
        usedNonce[signer][nonce] = true;
        prices[asset] = PriceData({price: price, updatedAt: timestamp, signer: signer});
        emit PriceUpdated(asset, price, timestamp, signer, nonce);
    }

    function latestPrice(bytes32 asset) external view returns (uint256 price, uint256 updatedAt, address signer) {
        PriceData memory value = prices[asset];
        if (value.updatedAt == 0) revert PriceUnavailable(asset);
        if (block.timestamp - value.updatedAt > freshnessWindow) revert PriceExpired(asset, value.updatedAt, block.timestamp);
        return (value.price, value.updatedAt, value.signer);
    }
}
