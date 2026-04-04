import type { CodeRef } from '@/components/code/types';

export const lookupCodeRefs: Record<string, CodeRef> = {
  'lookup-sort': {
    path: 'plonk/lookup.rs — sorted merge + LookupTable',
    lang: 'rust',
    highlight: [1, 34],
    desc: 'f(조회값)와 T(테이블)를 T 순서로 정렬 후\nh1, h2로 분리 (1개 원소 중첩).',
    code: `/// Range 테이블: {0, 1, 2, ..., 2^n - 1}
pub fn range_table(n: u32) -> Self {
    let size = 1u64 << n;
    let values: Vec<Fr> = (0..size).map(Fr::from_u64).collect();
    LookupTable { values }
}

/// f ∪ T를 T의 순서로 정렬 → (h1, h2)
pub fn compute_sorted_list(
    f_values: &[Fr], table: &LookupTable,
) -> Result<(Vec<Fr>, Vec<Fr>), PlookupError> {
    // 빈도 맵: f의 각 값이 T에 있는지 + 등장 횟수
    let mut freq: Vec<(Fr, usize)> = Vec::new();
    for &fv in f_values {
        if !table.contains(&fv) {
            return Err(PlookupError::ValueNotInTable(fv));
        }
        // 빈도 카운트...
    }
    // T 순서대로 f 원소 삽입
    let mut sorted = Vec::new();
    for &tv in &table.values {
        sorted.push(tv);
        // f에서 tv와 같은 값 삽입...
    }
    // h1, h2 분리 (1개 중첩)
    let n = table.values.len();
    let h1 = sorted[..n].to_vec();
    let h2 = sorted[n-1..].to_vec();  // h1[last] = h2[0]
    Ok((h1, h2))
}`,
    annotations: [
      { lines: [1, 6], color: 'sky', note: 'range_table — n비트 범위 검증용 사전 테이블' },
      { lines: [14, 17], color: 'emerald', note: 'f의 값이 T에 없으면 즉시 에러 반환' },
      { lines: [22, 25], color: 'amber', note: 'T 순서 유지하며 f 삽입 — 인접 차이 패턴 보장' },
      { lines: [28, 30], color: 'violet', note: 'h1[last]=h2[0] 중첩 — grand product closure 필수 조건' },
    ],
  },
  'lookup-grand': {
    path: 'plonk/lookup.rs — lookup grand product',
    lang: 'rust',
    highlight: [1, 24],
    desc: 'Plookup grand product Z_lookup(x).\n(1+b)(g+f)(g(1+b)+t+b*t_next) / (h1 쌍)(h2 쌍).',
    code: `pub fn compute_lookup_grand_product(
    f: &[Fr], t: &[Fr], h1: &[Fr], h2: &[Fr],
    beta: Fr, gamma: Fr, domain: &Domain,
) -> Polynomial {
    let one_plus_beta = Fr::ONE + beta;
    let gamma_ob = gamma * one_plus_beta;

    let mut z_values = vec![Fr::ONE]; // Z(w^0) = 1
    for i in 0..n-1 {
        let num = one_plus_beta
            * (gamma + f[i])
            * (gamma_ob + t[i] + beta * t[i+1]);

        let den = (gamma_ob + h1[i] + beta * h1[i+1])
            * (gamma_ob + h2[i] + beta * h2[i+1]);

        z_values.push(z_values[i] * num * den.inv()?);
    }
    Polynomial::lagrange_interpolate(&points)
}`,
    annotations: [
      { lines: [5, 6], color: 'sky', note: '(1+b), g(1+b) — 연속 쌍을 랜덤 선형 결합으로 압축' },
      { lines: [10, 12], color: 'emerald', note: 'num: 원본 f, t의 연속 쌍 — 이 구조가 맞으면' },
      { lines: [14, 15], color: 'amber', note: 'den: 정렬된 h1, h2의 연속 쌍 — 이 구조도 동일해야' },
      { lines: [17, 17], color: 'violet', note: '누적곱 → Z(w^(n-1))=1이면 정렬 올바름 증명 완료' },
    ],
  },
};
