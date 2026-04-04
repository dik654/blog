// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Commitment.sol";
import "./Verifier.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RailgunSmartWallet {
    MerkleTree public merkleTree;
    Verifier public verifier;
    mapping(bytes32 => bool) public nullifiers;

    event Shield(bytes32 indexed commitment, bytes32 root);
    event Transact(bytes32[] inputNullifiers, bytes32[] outputCommitments);
    event Unshield(address indexed to, address token, uint256 amount);

    function shield(
        Note calldata note,
        TokenData calldata tokenData
    ) external {
        // Line 1: ERC-20 토큰을 컨트랙트로 전송
        IERC20(tokenData.token).transferFrom(
            msg.sender, address(this), tokenData.amount
        );
        // Line 2: Note → Poseidon commitment 해시
        bytes32 commitment = hashCommitment(note);
        // Line 3: Merkle tree에 commitment 삽입
        merkleTree.insertLeaf(commitment);
        // Line 4: 이벤트 발행 (commitment + 새 root)
        emit Shield(commitment, merkleTree.root());
    }

    function transact(
        Proof calldata proof,
        bytes32[] calldata inputNullifiers,
        bytes32[] calldata outputCommitments,
        AdaptParams calldata adaptParams
    ) external {
        // Line 1: ZK 증명 검증 (Groth16)
        require(verifier.verifyProof(proof, adaptParams.publicInputs), "Invalid proof");
        // Line 2: 각 input nullifier 이중사용 방지
        for (uint i = 0; i < inputNullifiers.length; i++) {
            require(!nullifiers[inputNullifiers[i]], "Already spent");
            nullifiers[inputNullifiers[i]] = true;
        }
        // Line 3: 새 output commitment를 Merkle에 삽입
        for (uint i = 0; i < outputCommitments.length; i++) {
            merkleTree.insertLeaf(outputCommitments[i]);
        }
        emit Transact(inputNullifiers, outputCommitments);
    }

    function unshield(
        Proof calldata proof,
        address to,
        address token,
        uint256 amount,
        bytes32 nullifier
    ) external {
        // Line 1: ZK 증명 검증
        require(verifier.verifyProof(proof, _buildUnshieldInputs(to, token, amount, nullifier)), "Invalid proof");
        // Line 2: nullifier 기록
        require(!nullifiers[nullifier], "Already spent");
        nullifiers[nullifier] = true;
        // Line 3: ERC-20 토큰 전송
        IERC20(token).transfer(to, amount);
        emit Unshield(to, token, amount);
    }
}
