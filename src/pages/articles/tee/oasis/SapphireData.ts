export const contractCode = `// Solidity: 일반 EVM 컨트랙트와 동일한 문법
// Sapphire 위에 배포하면 자동으로 상태 암호화

pragma solidity ^0.8.0;
import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

contract SecretBallot {
    // 이 스토리지는 SGX 내에서만 복호화됨
    mapping(address => bytes32) private votes;
    uint256 private tallyCandidateA;
    uint256 private tallyCandidateB;

    function vote(bool candidateA) external {
        require(votes[msg.sender] == bytes32(0), "Already voted");
        votes[msg.sender] = bytes32(uint256(1));

        if (candidateA) tallyCandidateA++;
        else tallyCandidateB++;
    }

    // 기밀 난수 생성
    function generateRandom() external view returns (uint256) {
        bytes memory rand = Sapphire.randomBytes(32, "");
        return abi.decode(rand, (uint256));
    }

    // 집계 결과만 공개 (개별 투표는 비공개)
    function getTally() external view returns (uint256 a, uint256 b) {
        return (tallyCandidateA, tallyCandidateB);
    }
}`;

export const contractAnnotations = [
  { lines: [7, 11] as [number, number], color: 'sky' as const, note: 'SGX 내에서만 복호화되는 상태' },
  { lines: [22, 25] as [number, number], color: 'emerald' as const, note: 'SGX 기밀 난수 생성' },
  { lines: [28, 30] as [number, number], color: 'amber' as const, note: '집계만 공개, 개별 투표 비공개' },
];

export const keyDerivationCode = `// 키 파생 구조
KM Root Secret (SGX에 봉인)
+-- Runtime Key (runtime_id 기반 HKDF)
    +-- Contract Key (contract_address 기반 HKDF)
        +-- State Encryption Key  -> 스토리지 암호화
        +-- Tx Decryption Key     -> 트랜잭션 복호화

// 컨트랙트 실행 시
// 1. 클라이언트: calldata를 KM 공개키로 암호화
// 2. SGX: calldata 복호화 -> EVM 실행
// 3. 실행 결과도 암호화해서 응답
// 4. 상태 변경은 Contract Key로 암호화해서 저장`;

export const keyAnnotations = [
  { lines: [2, 6] as [number, number], color: 'sky' as const, note: 'HKDF 키 계층 구조' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: '기밀 실행 흐름' },
];

export const ethCompatCode = `// Sapphire는 ethers.js, viem, MetaMask와 호환됨
// 단, 기밀 트랜잭션은 sapphire-ethers 래퍼 사용 권장

import * as sapphire from '@oasisprotocol/sapphire-paratime';
import { ethers } from 'ethers';

// 기존 이더리움 지갑을 Sapphire 래퍼로 감쌈
const provider = sapphire.wrap(new ethers.BrowserProvider(window.ethereum));
const signer = await provider.getSigner();
// -> 모든 트랜잭션이 자동으로 암호화되어 전송됨

// RPC 엔드포인트
// Mainnet: https://sapphire.oasis.io
// Testnet: https://testnet.sapphire.oasis.io
// Chain ID: 0x5afe (23294)`;

export const ethCompatAnnotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: 'sapphire-paratime 패키지 임포트' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '래퍼로 자동 암호화' },
  { lines: [12, 15] as [number, number], color: 'amber' as const, note: 'RPC 엔드포인트 정보' },
];
