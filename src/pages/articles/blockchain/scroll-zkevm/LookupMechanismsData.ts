export const LOOKUP_ANY_CODE = `// Halo2 lookup_any — 핵심 Lookup API
meta.lookup_any("keccak lookup", |meta| {
    // 입력 표현식: EVM Circuit 측
    let input_rlc = rlc::expr(&input_bytes, challenges.keccak_input());
    let output_rlc = rlc::expr(&output_bytes, challenges.keccak_input());

    // 4개 컬럼을 하나의 RLC로 압축
    let input_expr = rlc::expr(
        &[1.expr(), input_rlc, input_len.expr(), output_rlc],
        challenges.lookup_input(),
    );

    // 테이블 측도 동일한 challenge로 RLC 계산
    let table_expr = rlc::expr(
        &keccak_table.table_exprs(meta),
        challenges.lookup_input(),
    );

    vec![(input_expr, table_expr)]
});
// 동작: 모든 입력 값이 테이블에 존재함을 증명
// ∀ input ∈ Input: ∃ row ∈ Table: input = row`;

export const lookupAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '입력 RLC — 바이트를 필드 원소로 압축' },
  { lines: [7, 11] as [number, number], color: 'emerald' as const, note: '4개 컬럼 → 1개 RLC로 압축' },
  { lines: [13, 18] as [number, number], color: 'amber' as const, note: '테이블 측 RLC — 동일 challenge' },
  { lines: [22, 23] as [number, number], color: 'violet' as const, note: 'Plonk permutation으로 효율적 증명' },
];

export const RLC_CODE = `// RLC (Random Linear Combination) — 다중 컬럼 압축
// RLC(v₀, v₁, ..., vₙ) = v₀ + v₁·r + v₂·r² + ... + vₙ·rⁿ
// r은 verifier가 제공하는 무작위 challenge 값

// RLC 구현 (little endian)
pub fn expr<F: Field>(expressions: &[E], randomness: E) -> Expression<F> {
    let mut rlc = 0.expr();
    let mut multiplier = 1.expr();
    for expr in expressions.iter() {
        rlc = rlc + expr.expr() * multiplier.clone();
        multiplier = multiplier * randomness.expr();
    }
    rlc
}

// Challenges 구조체 — 여러 Phase에서 생성
pub struct Challenges<T = Challenge> {
    evm_word: T,     // EVM word RLC용
    keccak_input: T, // Keccak 입력 RLC용
    lookup_input: T, // Lookup 다중 컬럼 압축용
}`;

export const rlcAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'RLC 공식 — 다항식 평가' },
  { lines: [6, 13] as [number, number], color: 'emerald' as const, note: '구현 — 누적 곱셈으로 RLC 계산' },
  { lines: [16, 20] as [number, number], color: 'amber' as const, note: 'Challenges — Phase별 무작위 값' },
];

export const STACK_LOOKUP_CODE = `// EVM Circuit에서 스택 pop — RwTable Lookup 예시
pub(crate) fn stack_pop(&mut self, value: Expression<F>) {
    self.stack_lookup(false.expr(), self.stack_pointer_offset.clone(), value);
}

fn stack_lookup(&mut self, is_write, stack_pointer_offset, value) {
    // RW 테이블의 12개 컬럼을 RLC로 압축
    let input_expr = rlc::expr(&[
        rw_counter, is_write_expr, tag, id, address,
        field_tag, storage_key, value_expr, value_prev,
        aux1, aux2,
    ], self.challenges.lookup_input());

    let table_expr = rlc::expr(
        &self.rw_table.table_exprs(meta),
        self.challenges.lookup_input(),
    );
    self.add_lookup("stack lookup", vec![(input_expr, table_expr)]);
}`;

export const stackLookupAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'stack_pop → stack_lookup 호출' },
  { lines: [7, 11] as [number, number], color: 'emerald' as const, note: '12개 컬럼 → RLC 압축' },
  { lines: [13, 17] as [number, number], color: 'amber' as const, note: '테이블 측 RLC + lookup 등록' },
];
