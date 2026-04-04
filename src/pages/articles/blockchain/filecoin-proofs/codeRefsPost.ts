import type { CodeRef } from '@/components/code/types';
import windowPostRs from './codebase/rust-fil-proofs/filecoin-proofs/src/api/window_post.rs?raw';
import vanillaRs from './codebase/rust-fil-proofs/storage-proofs-post/src/fallback/vanilla.rs?raw';

export const postCodeRefs: Record<string, CodeRef> = {
  'window-post': {
    path: 'filecoin-proofs/src/api/window_post.rs',
    code: windowPostRs,
    lang: 'rust',
    highlight: [32, 100],
    annotations: [
      { lines: [32, 37], color: 'sky', note: 'generate_window_post_with_vanilla — 바닐라 증명 → SNARK' },
      { lines: [44, 47], color: 'emerald', note: 'randomness/prover_id를 Hasher::Domain으로 변환' },
      { lines: [60, 62], color: 'amber', note: 'FallbackPoStCompound::setup + Groth16 파라미터 로드' },
      { lines: [72, 77], color: 'violet', note: 'PublicInputs 조립 — randomness, prover_id, sectors' },
    ],
    desc: 'WindowPoSt SNARK 생성 함수입니다. 바닐라 증명(Merkle 포함 증명)을 받아 FallbackPoStCompound를 통해 Groth16 증명으로 변환합니다.',
  },

  'fallback-vanilla': {
    path: 'storage-proofs-post/src/fallback/vanilla.rs',
    code: vanillaRs,
    lang: 'rust',
    highlight: [28, 80],
    annotations: [
      { lines: [28, 36], color: 'sky', note: 'SetupParams — sector_size, challenge_count, sector_count, api_version' },
      { lines: [39, 47], color: 'emerald', note: 'PublicParams — PoSt 검증 파라미터' },
      { lines: [50, 53], color: 'amber', note: 'ChallengeRequirements — 최소 챌린지 수 (파티션 합산)' },
      { lines: [71, 80], color: 'violet', note: 'PublicInputs — randomness, prover_id, sectors, partition k' },
    ],
    desc: 'PoSt 바닐라 증명의 핵심 타입입니다. SetupParams로 섹터 크기/챌린지 수를 설정하고, PublicInputs가 체인 랜덤성과 섹터 목록을 전달합니다.',
  },
};
