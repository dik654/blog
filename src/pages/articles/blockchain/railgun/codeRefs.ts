import type { CodeRef } from '@/components/code/types';

import walletSol from './codebase/railgun/contracts/RailgunSmartWallet.sol?raw';
import commitmentSol from './codebase/railgun/contracts/Commitment.sol?raw';
import verifierSol from './codebase/railgun/contracts/Verifier.sol?raw';

export const codeRefs: Record<string, CodeRef> = {
  'rg-shield': {
    path: 'railgun/contracts/RailgunSmartWallet.sol',
    code: walletSol, lang: 'rust', highlight: [18, 33],
    desc: 'shield() — ERC-20 토큰을 RAILGUN에 입금. transferFrom → hashCommitment → insertLeaf → 이벤트 발행.',
    annotations: [
      { lines: [22, 25], color: 'sky', note: 'transferFrom — 사용자 → 컨트랙트 토큰 전송' },
      { lines: [27, 27], color: 'emerald', note: 'hashCommitment — Note를 Poseidon 해시' },
      { lines: [29, 29], color: 'amber', note: 'insertLeaf — Merkle tree에 삽입' },
      { lines: [31, 31], color: 'violet', note: 'emit Shield — commitment + root 기록' },
    ],
  },
  'rg-transact': {
    path: 'railgun/contracts/RailgunSmartWallet.sol',
    code: walletSol, lang: 'rust', highlight: [35, 52],
    desc: 'transact() — shielded 내부 전송. ZK 증명 검증 → nullifier 기록 → 새 commitment 삽입.',
    annotations: [
      { lines: [41, 41], color: 'sky', note: 'verifyProof — Groth16 검증' },
      { lines: [43, 46], color: 'emerald', note: 'nullifier 이중사용 방지 루프' },
      { lines: [48, 50], color: 'amber', note: '새 output commitment 삽입' },
    ],
  },
  'rg-unshield': {
    path: 'railgun/contracts/RailgunSmartWallet.sol',
    code: walletSol, lang: 'rust', highlight: [54, 70],
    desc: 'unshield() — 출금. ZK 증명으로 소유권 증명 → nullifier 기록 → ERC-20 transfer.',
    annotations: [
      { lines: [61, 61], color: 'sky', note: 'verifyProof — 소유권 증명' },
      { lines: [63, 64], color: 'emerald', note: 'nullifier 기록' },
      { lines: [66, 66], color: 'amber', note: 'ERC-20 transfer — 컨트랙트 → 수신자' },
    ],
  },
  'rg-commitment': {
    path: 'railgun/contracts/Commitment.sol',
    code: commitmentSol, lang: 'rust', highlight: [18, 23],
    desc: 'hashCommitment() — Note 4개 필드를 Poseidon 해시로 압축.',
    annotations: [
      { lines: [20, 22], color: 'sky', note: 'poseidon4(npk, token, value, random)' },
    ],
  },
  'rg-merkle': {
    path: 'railgun/contracts/Commitment.sol',
    code: commitmentSol, lang: 'rust', highlight: [32, 49],
    desc: 'insertLeaf + _recomputeRoot — leaf 삽입 후 Merkle root 재계산.',
    annotations: [
      { lines: [33, 37], color: 'sky', note: 'insertLeaf — leaves[idx] = leaf' },
      { lines: [39, 49], color: 'emerald', note: '_recomputeRoot — 형제 노드와 해시 반복' },
    ],
  },
  'rg-verifier': {
    path: 'railgun/contracts/Verifier.sol',
    code: verifierSol, lang: 'rust', highlight: [25, 41],
    desc: 'verifyProof() — Groth16 페어링 검증. vk_x 계산 → 4-pairing check.',
    annotations: [
      { lines: [30, 33], color: 'sky', note: 'vk_x = ic[0] + sum(input[i] * ic[i+1])' },
      { lines: [35, 41], color: 'emerald', note: 'pairingCheck — e(A,B) == e(α,β)·e(vk_x,γ)·e(C,δ)' },
    ],
  },
};
