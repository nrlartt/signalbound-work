// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract SignedPriceOracle is Ownable, EIP712 {
    struct PriceData { uint256 price; uint256 updatedAt; address signer; }

    bytes32 public constant PRICE_UPDATE_TYPEHASH = keccak256("PriceUpdate(address signer,bytes32 asset,uint256 price,uint256 timestamp,uint256 nonce,uint256 authorizationEpoch)");
    uint256 public constant MAX_PRICE = type(uint192).max;

    error ZeroPrice();
    error PriceTooLarge(uint256 price, uint256 maximum);
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
    mapping(address => uint256) public authorizationEpoch;
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) public usedNonce;
    mapping(bytes32 => PriceData) private prices;
    uint256 public freshnessWindow;

    event SignerAuthorizationChanged(address indexed signer, bool authorized);
    event FreshnessWindowChanged(uint256 freshnessWindow);
    event PriceUpdated(bytes32 indexed asset, uint256 price, uint256 timestamp, address indexed signer, uint256 nonce);

    constructor(address initialOwner, address initialSigner, uint256 initialFreshnessWindow)
        Ownable(initialOwner)
        EIP712("SignalboundSignedPriceOracle", "1")
    {
        if (initialFreshnessWindow == 0) revert InvalidFreshnessWindow();
        freshnessWindow = initialFreshnessWindow;
        authorizationEpoch[initialSigner] = 1;
        authorizedSigner[initialSigner] = true;
        emit SignerAuthorizationChanged(initialSigner, true);
        emit FreshnessWindowChanged(initialFreshnessWindow);
    }

    function setSigner(address signer, bool authorized) external onlyOwner {
        if (authorizedSigner[signer] != authorized) authorizationEpoch[signer] += 1;
        authorizedSigner[signer] = authorized;
        emit SignerAuthorizationChanged(signer, authorized);
    }

    function setFreshnessWindow(uint256 newWindow) external onlyOwner {
        if (newWindow == 0) revert InvalidFreshnessWindow();
        freshnessWindow = newWindow;
        emit FreshnessWindowChanged(newWindow);
    }

    function updateDigest(address signer, bytes32 asset, uint256 price, uint256 timestamp, uint256 nonce) public view returns (bytes32) {
        return _hashTypedDataV4(keccak256(abi.encode(
            PRICE_UPDATE_TYPEHASH,
            signer,
            asset,
            price,
            timestamp,
            nonce,
            authorizationEpoch[signer]
        )));
    }

    function submitPrice(address signer, bytes32 asset, uint256 price, uint256 timestamp, uint256 nonce, bytes calldata signature) external {
        if (price == 0) revert ZeroPrice();
        if (price > MAX_PRICE) revert PriceTooLarge(price, MAX_PRICE);
        if (timestamp > block.timestamp) revert FutureTimestamp(timestamp, block.timestamp);
        if (block.timestamp - timestamp >= freshnessWindow) revert StaleUpdate(timestamp, block.timestamp);
        if (signature.length != 65) revert InvalidSignatureLength(signature.length);
        if (!authorizedSigner[signer]) revert UnauthorizedSigner(signer);
        if (ECDSA.recover(updateDigest(signer, asset, price, timestamp, nonce), signature) != signer) revert UnauthorizedSigner(signer);
        uint256 epoch = authorizationEpoch[signer];
        if (usedNonce[signer][epoch][nonce]) revert NonceAlreadyUsed(signer, nonce);
        PriceData memory current = prices[asset];
        if (current.updatedAt != 0 && timestamp <= current.updatedAt) revert UpdateNotNewer(asset, timestamp, current.updatedAt);
        usedNonce[signer][epoch][nonce] = true;
        prices[asset] = PriceData({price: price, updatedAt: timestamp, signer: signer});
        emit PriceUpdated(asset, price, timestamp, signer, nonce);
    }

    function latestPrice(bytes32 asset) external view returns (uint256 price, uint256 updatedAt, address signer) {
        PriceData memory value = prices[asset];
        if (value.updatedAt == 0) revert PriceUnavailable(asset);
        if (block.timestamp - value.updatedAt >= freshnessWindow) revert PriceExpired(asset, value.updatedAt, block.timestamp);
        return (value.price, value.updatedAt, value.signer);
    }
}
