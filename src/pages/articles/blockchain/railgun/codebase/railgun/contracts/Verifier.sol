// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Proof {
    uint256[2] a; // G1 point
    uint256[2][2] b; // G2 point
    uint256[2] c; // G1 point
}

struct AdaptParams {
    uint256[] publicInputs;
}

contract Verifier {
    // Groth16 검증 키 (trusted setup 산출물)
    uint256[2] public alpha;
    uint256[2][2] public beta;
    uint256[2][2] public gamma;
    uint256[2][2] public delta;
    uint256[2][] public ic; // input commitment points

    /// @notice Groth16 페어링 검증
    function verifyProof(
        Proof calldata proof,
        uint256[] calldata input
    ) external view returns (bool) {
        // vk_x = ic[0] + sum(input[i] * ic[i+1])
        uint256[2] memory vk_x = ic[0];
        for (uint i = 0; i < input.length; i++) {
            vk_x = ecAdd(vk_x, ecMul(ic[i + 1], input[i]));
        }
        // 페어링 체크: e(A,B) == e(alpha,beta) * e(vk_x,gamma) * e(C,delta)
        return pairingCheck(
            proof.a, proof.b,
            alpha, beta,
            vk_x, gamma,
            proof.c, delta
        );
    }
}
