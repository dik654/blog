export const ADD_CHIP_CODE = `// AddSubChip::eval() — 덧셈/뺄셈 제약
fn eval(&self, builder: &mut AB) {
    let local: &AddSubCols<AB::Var> = main.row_slice(0).borrow();

    // 1. 선택자: 정확히 하나만 활성
    builder.assert_eq(local.is_add + local.is_sub, AB::F::one());

    // 2. 바이트 분해: 32비트 값을 4바이트로 분해
    for i in 0..4 {
        builder.assert_bool(local.carry[i]);  // carry는 0 또는 1
    }

    // 3. 덧셈 제약: a + b = result (mod 2^32)
    //    각 바이트: a[i] + b[i] + carry[i-1] = result[i] + carry[i]*256
    for i in 0..4 {
        let carry_in = if i == 0 { AB::F::zero() } else { local.carry[i-1] };
        builder.assert_eq(
            local.operand_1_bytes[i] + local.operand_2_bytes[i] + carry_in,
            local.result_bytes[i] + local.carry[i] * AB::F::from_canonical_u32(256),
        );
    }

    // 4. 뺄셈: a - b = a + (~b + 1) — 2의 보수
}`;

export const ALU_CHIPS = [
  { name: 'AddSubChip', desc: 'ADD/SUB — 4바이트 carry chain, 2의 보수 뺄셈',
    cols: 'operand_1_bytes[4], operand_2_bytes[4], result_bytes[4], carry[4], is_add, is_sub', color: '#10b981' },
  { name: 'BitwiseChip', desc: 'XOR/OR/AND — 비트 단위 룩업 테이블 (8비트 청크)',
    cols: 'op_a_bytes[4], op_b_bytes[4], result_bytes[4], is_xor, is_or, is_and', color: '#6366f1' },
  { name: 'MulChip', desc: 'MUL/MULH/MULHU/MULHSU — 64비트 결과 분할',
    cols: 'a[4], b[4], result_lo[4], result_hi[4], is_mul, is_mulh, carry[8]', color: '#f59e0b' },
  { name: 'DivRemChip', desc: 'DIV/DIVU/REM/REMU — quotient * divisor + remainder = dividend',
    cols: 'dividend[4], divisor[4], quotient[4], remainder[4], is_div, is_rem', color: '#8b5cf6' },
  { name: 'ShiftRightChip', desc: 'SRL/SRA — 비트 시프트 + 부호 확장',
    cols: 'value[4], shift_amount, result[4], is_srl, is_sra, sign_bit', color: '#ec4899' },
  { name: 'LtChip', desc: 'SLT/SLTU — 부호 있는/없는 비교',
    cols: 'op_a[4], op_b[4], result, is_slt, is_sltu, sign_a, sign_b', color: '#ef4444' },
];

export const addChipAnnotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: '선택자 제약: ADD xor SUB' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '바이트 분해 + carry 부울 제약' },
  { lines: [12, 20] as [number, number], color: 'amber' as const, note: '바이트별 덧셈 + carry 전파 제약' },
  { lines: [22, 22] as [number, number], color: 'violet' as const, note: '뺄셈 = 2의 보수 덧셈' },
];
