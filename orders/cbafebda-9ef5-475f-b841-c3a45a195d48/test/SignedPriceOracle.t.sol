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

    function signature(uint256 key, bytes32 asset, uint256 price, uint256 timestamp, uint256 nonce) internal view returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, oracle.updateDigest(asset, price, timestamp, nonce));
        return abi.encodePacked(r, s, v);
    }

    function test_validSignedUpdateAndRead() public {
        uint256 timestamp = block.timestamp;
        oracle.submitPrice(ETH, 2_500e8, timestamp, 1, signature(signerKey, ETH, 2_500e8, timestamp, 1));
        (uint256 price, uint256 updatedAt, address recovered) = oracle.latestPrice(ETH);
        assertEq(price, 2_500e8);
        assertEq(updatedAt, timestamp);
        assertEq(recovered, signer);
    }

    function test_rejectsUnauthorizedSignature() public {
        address other = vm.addr(otherKey);
        uint256 timestamp = block.timestamp;
        bytes memory proof = signature(otherKey, ETH, 1, timestamp, 1);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.UnauthorizedSigner.selector, other));
        oracle.submitPrice(ETH, 1, timestamp, 1, proof);
    }

    function test_rejectsMalformedSignature() public {
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.InvalidSignatureLength.selector, 0));
        oracle.submitPrice(ETH, 1, block.timestamp, 1, "");
    }

    function test_rejectsReplay() public {
        uint256 timestamp = block.timestamp;
        bytes memory proof = signature(signerKey, ETH, 1, timestamp, 7);
        oracle.submitPrice(ETH, 1, timestamp, 7, proof);
        bytes32 btc = keccak256("BTC/USD");
        bytes memory replay = signature(signerKey, btc, 1, timestamp, 7);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.NonceAlreadyUsed.selector, signer, 7));
        oracle.submitPrice(btc, 1, timestamp, 7, replay);
    }

    function test_rejectsStaleAndFutureUpdates() public {
        uint256 stale = block.timestamp - 1 hours - 1;
        bytes memory staleProof = signature(signerKey, ETH, 1, stale, 1);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.StaleUpdate.selector, stale, block.timestamp));
        oracle.submitPrice(ETH, 1, stale, 1, staleProof);
        uint256 future = block.timestamp + 1;
        bytes memory futureProof = signature(signerKey, ETH, 1, future, 2);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.FutureTimestamp.selector, future, block.timestamp));
        oracle.submitPrice(ETH, 1, future, 2, futureProof);
    }

    function test_rejectsZeroAndOlderValues() public {
        bytes memory zeroProof = signature(signerKey, ETH, 0, block.timestamp, 1);
        vm.expectRevert(SignedPriceOracle.ZeroPrice.selector);
        oracle.submitPrice(ETH, 0, block.timestamp, 1, zeroProof);
        uint256 timestamp = block.timestamp;
        oracle.submitPrice(ETH, 1, timestamp, 2, signature(signerKey, ETH, 1, timestamp, 2));
        bytes memory olderProof = signature(signerKey, ETH, 2, timestamp, 3);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.UpdateNotNewer.selector, ETH, timestamp, timestamp));
        oracle.submitPrice(ETH, 2, timestamp, 3, olderProof);
    }

    function test_readerRejectsUnsetAndExpiredValues() public {
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.PriceUnavailable.selector, ETH));
        oracle.latestPrice(ETH);
        uint256 timestamp = block.timestamp;
        oracle.submitPrice(ETH, 1, timestamp, 1, signature(signerKey, ETH, 1, timestamp, 1));
        vm.warp(timestamp + 1 hours + 1);
        vm.expectRevert(abi.encodeWithSelector(SignedPriceOracle.PriceExpired.selector, ETH, timestamp, block.timestamp));
        oracle.latestPrice(ETH);
    }

    function testFuzz_acceptsNonZeroPrices(uint256 price, uint256 nonce) public {
        vm.assume(price > 0);
        uint256 timestamp = block.timestamp;
        oracle.submitPrice(ETH, price, timestamp, nonce, signature(signerKey, ETH, price, timestamp, nonce));
        (uint256 stored,,) = oracle.latestPrice(ETH);
        assertEq(stored, price);
    }
}
