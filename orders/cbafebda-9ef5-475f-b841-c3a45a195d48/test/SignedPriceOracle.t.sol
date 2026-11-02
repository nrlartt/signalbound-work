// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {SignedPriceOracle} from "../src/SignedPriceOracle.sol";

contract SignedPriceOracleTest is Test {
    SignedPriceOracle internal oracle;
    uint256 internal signerKey = 0xA11CE;
    uint256 internal otherKey = 0xB0B;
    address internal signer;
    bytes32 internal constant ETH = keccak256("ETH/USD");

    function setUp() public {
        vm.warp(10 days);
        signer = vm.addr(signerKey);
        oracle = new SignedPriceOracle(address(this), signer, 1 hours);
    }

    function signature(uint256 key, address claimedSigner, bytes32 asset, uint256 price, uint256 timestamp, uint256 nonce) internal view returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, oracle.updateDigest(claimedSigner, asset, price, timestamp, nonce));
        return abi.encodePacked(r, s, v);
    }

    function test_validSignedUpdateAndRead() public {
        uint256 timestamp = block.timestamp;
        oracle.submitPrice(signer, ETH, 2_500e8, timestamp, 1, signature(signerKey, signer, ETH, 2_500e8, timestamp, 1));
        (uint256 price, uint256 updatedAt, address recovered) = oracle.latestPrice(ETH);
        assertEq(price, 2_500e8);
        assertEq(updatedAt, timestamp);
        assertEq(recovered, signer);
    }

    function test_rejectsUnauthorizedSignature() public {
        address other = vm.addr(otherKey);
        uint256 timestamp = block.timestamp;
        bytes memory proof = signature(otherKey, other, ETH, 1, timestamp, 1);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.UnauthorizedSigner.selector, other));
        oracle.submitPrice(other, ETH, 1, timestamp, 1, proof);
    }

    function test_rejectsMalformedSignature() public {
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.InvalidSignatureLength.selector, 0));
        oracle.submitPrice(signer, ETH, 1, block.timestamp, 1, "");
    }

    function test_rejectsReplay() public {
        uint256 timestamp = block.timestamp;
        bytes memory proof = signature(signerKey, signer, ETH, 1, timestamp, 7);
        oracle.submitPrice(signer, ETH, 1, timestamp, 7, proof);
        bytes32 btc = keccak256("BTC/USD");
        bytes memory replay = signature(signerKey, signer, btc, 1, timestamp, 7);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.NonceAlreadyUsed.selector, signer, 7));
        oracle.submitPrice(signer, btc, 1, timestamp, 7, replay);
    }

    function test_rejectsStaleAndFutureUpdates() public {
        uint256 stale = block.timestamp - 1 hours;
        bytes memory staleProof = signature(signerKey, signer, ETH, 1, stale, 1);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.StaleUpdate.selector, stale, block.timestamp));
        oracle.submitPrice(signer, ETH, 1, stale, 1, staleProof);
        uint256 future = block.timestamp + 1;
        bytes memory futureProof = signature(signerKey, signer, ETH, 1, future, 2);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.FutureTimestamp.selector, future, block.timestamp));
        oracle.submitPrice(signer, ETH, 1, future, 2, futureProof);
    }

    function test_rejectsZeroAndOlderValues() public {
        bytes memory zeroProof = signature(signerKey, signer, ETH, 0, block.timestamp, 1);
        vm.expectRevert(SignedPriceOracle.ZeroPrice.selector);
        oracle.submitPrice(signer, ETH, 0, block.timestamp, 1, zeroProof);
        uint256 timestamp = block.timestamp;
        oracle.submitPrice(signer, ETH, 1, timestamp, 2, signature(signerKey, signer, ETH, 1, timestamp, 2));
        bytes memory olderProof = signature(signerKey, signer, ETH, 2, timestamp, 3);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.UpdateNotNewer.selector, ETH, timestamp, timestamp));
        oracle.submitPrice(signer, ETH, 2, timestamp, 3, olderProof);
    }

    function test_readerRejectsUnsetAndExpiredValues() public {
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.PriceUnavailable.selector, ETH));
        oracle.latestPrice(ETH);
        uint256 timestamp = block.timestamp;
        oracle.submitPrice(signer, ETH, 1, timestamp, 1, signature(signerKey, signer, ETH, 1, timestamp, 1));
        vm.warp(timestamp + 1 hours);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.PriceExpired.selector, ETH, timestamp, block.timestamp));
        oracle.latestPrice(ETH);
    }

    function test_rejectsPricesAboveTheDocumentedBound() public {
        uint256 price = oracle.MAX_PRICE() + 1;
        bytes memory proof = signature(signerKey, signer, ETH, price, block.timestamp, 1);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.PriceTooLarge.selector, price, oracle.MAX_PRICE()));
        oracle.submitPrice(signer, ETH, price, block.timestamp, 1, proof);
    }

    function test_reauthorizationStartsANewNonceEpoch() public {
        uint256 timestamp = block.timestamp;
        oracle.submitPrice(signer, ETH, 1, timestamp, 9, signature(signerKey, signer, ETH, 1, timestamp, 9));
        oracle.setSigner(signer, false);
        oracle.setSigner(signer, true);
        vm.warp(timestamp + 1);
        oracle.submitPrice(signer, ETH, 2, block.timestamp, 9, signature(signerKey, signer, ETH, 2, block.timestamp, 9));
    }

    function testFuzz_acceptsNonZeroPrices(uint256 price, uint256 nonce) public {
        price = bound(price, 1, oracle.MAX_PRICE());
        uint256 timestamp = block.timestamp;
        oracle.submitPrice(signer, ETH, price, timestamp, nonce, signature(signerKey, signer, ETH, price, timestamp, nonce));
        (uint256 stored,,) = oracle.latestPrice(ETH);
        assertEq(stored, price);
    }
}
