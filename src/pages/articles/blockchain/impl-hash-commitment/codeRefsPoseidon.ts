import type { CodeRef } from '@/components/code/types';
import { poseidonHashCodeRefs } from './codeRefsPoseidonHash';

export const poseidonCodeRefs: Record<string, CodeRef> = {
  ...poseidonHashCodeRefs,
  'poseidon-sbox': {
    path: 'hash/poseidon.rs — S-box + MDS',
    lang: 'rust',
    highlight: [1, 22],
    desc: 'S-box: x→x⁵ (비선형).\nMDS 행렬: 최대 확산(diffusion) — 모든 부분행렬 역행렬 존재.',
    code: `/// S-box: x → x⁵
/// 곱셈 3회: x² → x⁴ → x⁵
pub fn sbox(x: Fr) -> Fr {
    let x2 = x.square();
    let x4 = x2.square();
    x4 * x // x⁴ · x = x⁵
}

/// MDS 행렬 곱: result = M · state
/// 한 원소의 변화가 모든 원소로 확산
fn mds_mix(state: &[Fr; T], mds: &[[Fr; T]; T]) -> [Fr; T] {
    let mut result = [Fr::ZERO; T];
    for i in 0..T {
        for j in 0..T {
            result[i] = result[i] + mds[i][j] * state[j];
        }
    }
    result
}`,
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'x⁵ = x²·x²·x — square 2회 + mul 1회로 최소 비용' },
      { lines: [11, 18], color: 'emerald', note: 'MDS 곱 — 선형 변환이므로 R1CS 제약 0개로 흡수 가능' },
    ],
  },
  'poseidon-permutation': {
    path: 'hash/poseidon.rs — poseidon_permutation',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'Poseidon 순열: 3단계 구조.\nfull → partial → full (SPN 구조).',
    code: `/// Poseidon 순열
/// 1. RF/2 full rounds  (모든 원소에 S-box)
/// 2. RP partial rounds (첫 번째 원소에만 S-box)
/// 3. RF/2 full rounds  (다시 모든 원소에 S-box)
pub fn poseidon_permutation(
    state: &mut [Fr; T], params: &PoseidonParams,
) {
    let half_rf = RF / 2; // 4

    // Phase 1: 4 full rounds
    for r in 0..half_rf {
        let offset = r * T;
        for i in 0..T { state[i] = state[i] + params.round_constants[offset + i]; }
        for i in 0..T { state[i] = sbox(state[i]); } // ALL
        *state = mds_mix(state, &params.mds);
    }

    // Phase 2: 57 partial rounds
    for r in 0..RP {
        let offset = (half_rf + r) * T;
        for i in 0..T { state[i] = state[i] + params.round_constants[offset + i]; }
        state[0] = sbox(state[0]); // FIRST ONLY
        *state = mds_mix(state, &params.mds);
    }

    // Phase 3: 4 full rounds
    for r in 0..half_rf {
        let offset = (half_rf + RP + r) * T;
        for i in 0..T { state[i] = state[i] + params.round_constants[offset + i]; }
        for i in 0..T { state[i] = sbox(state[i]); } // ALL
        *state = mds_mix(state, &params.mds);
    }
}`,
    annotations: [
      { lines: [10, 16], color: 'sky', note: 'Full round — S-box 3개 전부 적용. 혼란(confusion) 극대화' },
      { lines: [19, 24], color: 'emerald', note: 'Partial round — S-box 1개만. 보안은 유지하면서 제약 수 절감' },
      { lines: [22, 22], color: 'amber', note: '핵심 최적화: state[0]만 S-box → 제약 1/3로 감소' },
    ],
  },
};
