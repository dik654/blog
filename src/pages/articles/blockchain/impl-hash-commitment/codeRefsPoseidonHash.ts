import type { CodeRef } from '@/components/code/types';

export const poseidonHashCodeRefs: Record<string, CodeRef> = {
  'poseidon-hash': {
    path: 'hash/poseidon.rs — poseidon_hash (2-to-1)',
    lang: 'rust',
    highlight: [1, 18],
    desc: 'Sponge 구조의 2-to-1 해시.\nstate = [capacity=0, left, right] → permutation → state[1] 반환.',
    code: `/// 2-to-1 Poseidon 해시
///
/// Sponge 구조:
///   state = [capacity, rate₀, rate₁]
///         = [0,        left,  right ]
///
/// capacity = 0: 도메인 분리용
/// Permutation 적용 후 state[1] 반환
pub fn poseidon_hash_with_params(
    params: &PoseidonParams, left: Fr, right: Fr,
) -> Fr {
    // Sponge: [capacity=0, rate₀=left, rate₁=right]
    let mut state = [Fr::ZERO, left, right];
    poseidon_permutation(&mut state, params);
    state[1] // 첫 번째 rate 원소가 해시 출력
}`,
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'Sponge — capacity(비밀 영역) + rate(입력 영역)로 상태 분할' },
      { lines: [13, 14], color: 'emerald', note: '입력을 rate 위치에 배치 — capacity는 0 고정(도메인 분리)' },
      { lines: [16, 16], color: 'amber', note: '출력은 state[1] — rate의 첫 원소. squeeze 단계에 해당' },
    ],
  },
  'poseidon-params': {
    path: 'hash/poseidon.rs — PoseidonParams + 상수',
    lang: 'rust',
    highlight: [1, 22],
    desc: 'Poseidon 파라미터.\nwidth=3, α=5, RF=8, RP=57 — BN254 Fr 위의 표준 구성.',
    code: `/// 상태 너비: capacity(1) + rate(2) = 3
pub const T: usize = 3;
/// S-box 지수: x → x⁵ (gcd(5, r-1) = 1)
pub const ALPHA: u64 = 5;
/// Full rounds: 4 + 4 = 8
pub const RF: usize = 8;
/// Partial rounds: 57
pub const RP: usize = 57;
/// 총 라운드 수
pub const NUM_ROUNDS: usize = RF + RP; // 65

/// Poseidon 해시 파라미터
pub struct PoseidonParams {
    /// 라운드 상수: T × NUM_ROUNDS = 195개
    pub round_constants: Vec<Fr>,
    /// MDS 행렬: T × T (확산용)
    pub mds: [[Fr; T]; T],
}`,
    annotations: [
      { lines: [1, 2], color: 'sky', note: 'T=3 — Sponge rate=2, capacity=1. 2-to-1 해시에 최적' },
      { lines: [3, 4], color: 'emerald', note: 'α=5 — gcd(5, r-1)=1이어야 S-box가 역함수를 가짐' },
      { lines: [5, 8], color: 'amber', note: 'RF=8(보안), RP=57(효율) — full/partial 분리가 핵심 최적화' },
    ],
  },
};
