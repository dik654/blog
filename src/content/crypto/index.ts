import type { Category } from '../types';
import { zkpMathArticles } from '../blockchain/articlesZkpMath';
import { zkpMath2Articles } from '../blockchain/articlesZkpMath2';
import { zkpSystemsArticles } from '../blockchain/articlesZkpSystems';
import { zkpSystems2Articles } from '../blockchain/articlesZkpSystems2';
import { zkpVmArticles } from '../blockchain/articlesZkpVm';
import { zkpMath3Articles } from '../blockchain/articlesZkpMath3';
import { classicalArticles } from './articlesClassical';
import { walletKeyArticles } from './articlesWallet';

const crypto: Category = {
  slug: 'crypto',
  name: '암호학',
  description: '영지식 증명, 다자간 연산, 타원곡선, 페어링 등 암호학 학습 노트',
  group: 'foundation',
  subcategories: [
    {
      slug: 'wallet-key-management',
      name: '00 · 지갑 키 관리',
      description: '현재 wallet architecture에서 필요한 threshold signing과 복구 기반까지',
      icon: '🔏',
      children: [
        { slug: 'wallet-key-current', name: '00 · 현재 권한 지도', description: 'Custody, embedded, smart와 serverless를 권한으로 분해', icon: '🧭' },
        { slug: 'wallet-key-threshold', name: '01 · SSS → MPC/TSS', description: '복구와 원본 키 없는 공동 서명, DKG와 refresh', icon: '🤝' },
        { slug: 'wallet-key-browser', name: '02 · 브라우저·복구', description: 'OAuth, 결정론적 share, WASM과 recovery 위협 모델', icon: '🛡️' },
        { slug: 'mpc', name: '03 · 프로토콜 구현', description: 'Shamir·Paillier·threshold ECDSA 코드 경로', icon: '🧩' },
      ],
    },
    { slug: 'classical', name: 'Classical Cryptography', description: 'Diffie-Hellman, ElGamal 등 공개키 암호 기초', icon: '🔑' },
    {
      slug: 'zkp',
      name: 'Zero Knowledge Proof',
      description: '영지식 증명 수학, 증명 시스템, zkVM',
      icon: '🔐',
      children: [
        { slug: 'zkp-math', name: 'Math Foundations', description: '유한체, 타원곡선, 페어링, FFT/NTT', icon: '🔢' },
        {
          slug: 'zkp-groth16', name: 'Groth16', description: 'SNARK 개론, R1CS/QAP, Groth16 증명', icon: '📜',
          children: [
            { slug: 'zkp-groth16-concept', name: '01 · 원리와 계산 계약', description: 'SNARK 개론에서 R1CS·QAP·Groth16까지', icon: '📖' },
            { slug: 'zkp-groth16-impl', name: '02 · 구현과 코드 경로', description: 'Circom, snarkjs, bellperson으로 검증', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-plonk', name: 'PLONK', description: 'PLONK, FFLONK, HyperPLONK', icon: '🔗',
          children: [
            { slug: 'zkp-plonk-concept', name: '01 · 원리와 계산 계약', description: 'PLONKish, KZG, Plookup, FFLONK', icon: '📖' },
            { slug: 'zkp-plonk-impl', name: '02 · 구현과 코드 경로', description: 'Halo2와 Scroll zkEVM으로 검증', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-stark', name: 'STARK', description: 'STARK, FRI, AIR', icon: '🏗️',
          children: [
            { slug: 'zkp-stark-concept', name: '01 · 원리와 계산 계약', description: 'STARK 이론, FRI와 AIR 제약', icon: '📖' },
            { slug: 'zkp-stark-impl', name: '02 · 구현과 코드 경로', description: 'Plonky3, SP1, RISC Zero로 검증', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-nova', name: 'Nova (Folding)', description: 'NIFS 폴딩 기반 재귀 증명', icon: '🔄',
          children: [
            { slug: 'zkp-nova-concept', name: '01 · 원리와 계산 계약', description: 'IVC, NIFS와 폴딩 이론', icon: '📖' },
            { slug: 'zkp-nova-impl', name: '02 · 구현과 코드 경로', description: 'Nova와 SuperNova로 검증', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-bulletproofs', name: 'Bulletproofs', description: '투명 셋업 범위 증명', icon: '🎯',
          children: [
            { slug: 'zkp-bp-concept', name: '01 · 원리와 계산 계약', description: 'Inner Product Argument와 범위 증명', icon: '📖' },
            { slug: 'zkp-bp-impl', name: '02 · 구현과 코드 경로', description: 'dalek Bulletproofs로 검증', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-iop', name: 'IOP', description: 'Interactive Oracle Proofs', icon: '📡',
          children: [
            { slug: 'zkp-iop-concept', name: '01 · 원리와 계산 계약', description: 'Aurora, Ligero, Fractal과 BCS', icon: '📖' },
            { slug: 'zkp-iop-impl', name: '02 · 구현과 코드 경로', description: 'libiop와 Proof of SQL로 검증', icon: '🛠️' },
          ],
        },
        { slug: 'zkp-vm', name: 'zkVM', description: 'Jolt, Scroll zkEVM 등 VM 기반 프로젝트', icon: '💻' },
      ],
    },
  ],
  articles: [
    ...walletKeyArticles,
    ...classicalArticles,
    ...zkpMathArticles,
    ...zkpMath2Articles,
    ...zkpMath3Articles,
    ...zkpSystemsArticles,
    ...zkpSystems2Articles,
    ...zkpVmArticles,
  ],
};

export default crypto;
