import type { CodeRef } from '@/components/code/types';

export const domainCodeRefs: Record<string, CodeRef> = {
  'plonk-domain': {
    path: 'plonk/mod.rs — Domain + 코셋 상수',
    lang: 'rust',
    highlight: [1, 36],
    desc: '평가 도메인 H = {1, w, w^2, ..., w^(n-1)}.\nn은 2의 거듭제곱, 단위근 w를 BN254 Fr에서 계산.',
    code: `/// 코셋 상수: Column A=1, B=K1, C=K2
pub const K1: u64 = 2;
pub const K2: u64 = 3;

/// 평가 도메인 H = {1, w, w^2, ..., w^(n-1)}
pub struct Domain {
    pub n: usize,        // 도메인 크기 (2의 거듭제곱)
    pub omega: Fr,       // n차 단위근
    pub omega_inv: Fr,   // w의 역원
    pub elements: Vec<Fr>, // [1, w, w^2, ...]
}

impl Domain {
    pub fn new(n: usize) -> Self {
        assert!(n.is_power_of_two());
        let log_n = n.trailing_zeros() as usize;
        // ROOT_2_28을 2^(28-log_n)번 제곱 → n차 단위근
        let root = Fr::from_raw(ROOT_OF_UNITY_2_28_RAW);
        let mut omega = root;
        for _ in 0..(28 - log_n) {
            omega = omega * omega;
        }
        let omega_inv = omega.inv().expect("invertible");

        // 도메인 원소 생성
        let mut elements = Vec::with_capacity(n);
        let mut current = Fr::ONE;
        for _ in 0..n {
            elements.push(current);
            current = current * omega;
        }
        debug_assert!(current == Fr::ONE); // w^n = 1
        Domain { n, omega, omega_inv, elements }
    }
}`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: 'K1=2, K2=3 — 3개 코셋이 서로소가 되는 최소 정수' },
      { lines: [6, 11], color: 'emerald', note: 'Domain: n차 단위근 w와 모든 거듭제곱을 캐시' },
      { lines: [17, 22], color: 'amber', note: '2^28차 원시근에서 제곱 반복으로 n차 단위근 도출' },
      { lines: [32, 32], color: 'violet', note: 'w^n = 1 검증 — 단위근의 핵심 성질' },
    ],
  },
};
