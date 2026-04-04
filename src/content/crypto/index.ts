import type { Category } from '../types';
import { zkpMathArticles } from '../blockchain/articlesZkpMath';
import { zkpMath2Articles } from '../blockchain/articlesZkpMath2';
import { zkpSystemsArticles } from '../blockchain/articlesZkpSystems';
import { zkpSystems2Articles } from '../blockchain/articlesZkpSystems2';
import { zkpVmArticles } from '../blockchain/articlesZkpVm';
import { zkpMath3Articles } from '../blockchain/articlesZkpMath3';
import { classicalArticles } from './articlesClassical';

const crypto: Category = {
  slug: 'crypto',
  name: 'Cryptography',
  description: '영지식 증명, 다자간 연산, 타원곡선, 페어링 등 암호학 학습 노트',
  subcategories: [
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
            { slug: 'zkp-groth16-concept', name: '개념', description: 'SNARK 개론, R1CS, QAP, Groth16 이론', icon: '📖' },
            { slug: 'zkp-groth16-impl', name: '구현체', description: 'Circom, snarkjs, bellperson', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-plonk', name: 'PLONK', description: 'PLONK, FFLONK, HyperPLONK', icon: '🔗',
          children: [
            { slug: 'zkp-plonk-concept', name: '개념', description: 'PLONKish, KZG, Plookup, FFLONK', icon: '📖' },
            { slug: 'zkp-plonk-impl', name: '구현체', description: 'Halo2, Scroll zkEVM', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-stark', name: 'STARK', description: 'STARK, FRI, AIR', icon: '🏗️',
          children: [
            { slug: 'zkp-stark-concept', name: '개념', description: 'STARK 이론, FRI, AIR 제약', icon: '📖' },
            { slug: 'zkp-stark-impl', name: '구현체', description: 'Plonky3, SP1, RISC Zero', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-nova', name: 'Nova (Folding)', description: 'NIFS 폴딩 기반 재귀 증명', icon: '🔄',
          children: [
            { slug: 'zkp-nova-concept', name: '개념', description: 'IVC, NIFS, 폴딩 이론', icon: '📖' },
            { slug: 'zkp-nova-impl', name: '구현체', description: 'Nova, SuperNova', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-bulletproofs', name: 'Bulletproofs', description: '투명 셋업 범위 증명', icon: '🎯',
          children: [
            { slug: 'zkp-bp-concept', name: '개념', description: 'Inner Product Argument, 범위 증명', icon: '📖' },
            { slug: 'zkp-bp-impl', name: '구현체', description: 'dalek Bulletproofs', icon: '🛠️' },
          ],
        },
        {
          slug: 'zkp-iop', name: 'IOP', description: 'Interactive Oracle Proofs', icon: '📡',
          children: [
            { slug: 'zkp-iop-concept', name: '개념', description: 'Aurora, Ligero, Fractal, BCS', icon: '📖' },
            { slug: 'zkp-iop-impl', name: '구현체', description: 'libiop, Proof of SQL', icon: '🛠️' },
          ],
        },
        { slug: 'zkp-vm', name: 'zkVM', description: 'Jolt, Scroll zkEVM 등 VM 기반 프로젝트', icon: '💻' },
      ],
    },
    { slug: 'mpc', name: 'MPC', description: '다자간 연산, 비밀 공유, 안전한 계산', icon: '🤝' },
  ],
  articles: [
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
