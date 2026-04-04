// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Note {
    bytes32 npk;    // poseidon(spendingKey) — 공개키 역할
    address token;  // ERC-20 컨트랙트 주소
    uint256 value;  // 토큰 수량
    bytes32 random; // 블라인딩 팩터
}

struct TokenData {
    address token;
    uint256 amount;
}

/// @notice Poseidon 해시로 Note commitment 계산
function hashCommitment(Note calldata note) pure returns (bytes32) {
    // poseidon([npk, token, value, random]) → 32바이트 해시
    return poseidon4(note.npk, bytes32(uint256(uint160(note.token))),
                     bytes32(note.value), note.random);
}

contract MerkleTree {
    uint256 public constant DEPTH = 16;
    uint256 public nextIndex;
    bytes32[65536] public leaves; // 2^16
    bytes32 public _root;

    function insertLeaf(bytes32 leaf) external {
        uint256 idx = nextIndex;
        leaves[idx] = leaf;
        nextIndex = idx + 1;
        _root = _recomputeRoot(idx, leaf);
    }

    function _recomputeRoot(uint256 idx, bytes32 current) internal view returns (bytes32) {
        for (uint256 d = 0; d < DEPTH; d++) {
            uint256 sibIdx = (idx % 2 == 0) ? idx + 1 : idx - 1;
            bytes32 sib = leaves[sibIdx];
            current = (idx % 2 == 0)
                ? poseidon2(current, sib)
                : poseidon2(sib, current);
            idx /= 2;
        }
        return current;
    }

    function root() external view returns (bytes32) { return _root; }
}
