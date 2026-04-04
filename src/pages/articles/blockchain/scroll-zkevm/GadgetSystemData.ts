export const IS_ZERO_CODE = `// IsZeroGadget — 값이 0인지 검증
// 제약: value * (1 - value * value_inv) == 0
// value == 0이면 is_zero == 1, value != 0이면 value_inv == 1/value

let is_zero_config = IsZeroChip::configure(
    meta,
    |meta| meta.query_selector(q_enable),
    |meta| meta.query_advice(value_column, Rotation::cur()),
    value_inv_column,
);

// 할당 시
chip.assign(region, offset, Value::known(value))?;`;

export const isZeroAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '제약 조건 — 0 판별 트릭' },
  { lines: [5, 9] as [number, number], color: 'emerald' as const, note: 'configure — 선택자 + 값 쿼리' },
  { lines: [12, 12] as [number, number], color: 'amber' as const, note: 'assign — 실제 값 기입' },
];

export const COMPARATOR_CODE = `// ComparatorGadget — LT와 EQ를 동시에 제공
// LtChip + IsEqualChip을 결합
pub struct ComparatorConfig<F, const N_BYTES: usize> {
    pub lt_chip: LtChip<F, N_BYTES>,
    pub eq_chip: IsEqualChip<F>,
}
// GT는 !lt && !eq로 간접 계산

// LtGadget — 대소 비교
// diff = lhs - rhs + (lt ? range : 0)
// 각 diff_byte가 u8 범위 내에 있는지 룩업 테이블로 검증
pub struct LtConfig<F, const N_BYTES: usize> {
    pub lt: Column<Advice>,                // 결과 (0 또는 1)
    pub diff: [Column<Advice>; N_BYTES],   // 차이의 바이트 표현
    pub u8_table: TableColumn,             // 범위 검증용 테이블
    pub range: F,                          // 2^(N_BYTES * 8)
}`;

export const comparatorAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'Comparator — LT + EQ 결합' },
  { lines: [9, 11] as [number, number], color: 'emerald' as const, note: 'LtGadget — 바이트 분해 비교' },
  { lines: [12, 16] as [number, number], color: 'amber' as const, note: 'LtConfig — 바이트 룩업 기반' },
];

export const MULADD_CODE = `// MulAddGadget — a * b + c == d (mod 2^256) 검증
// 256비트 곱셈과 덧셈을 64비트 limb로 분해
// 중간 carry 값들을 16비트 단위로 분해하여 범위 검증

// 회로 레이아웃 (8행 × 4열):
// | q_step | col0    | col1    | col2    | col3    |
// | 1      | a_limb0 | a_limb1 | a_limb2 | a_limb3 |
// | 0      | b_limb0 | b_limb1 | b_limb2 | b_limb3 |
// | 0      | c_lo    | c_hi    | d_lo    | d_hi    |
// | 0      | carry0  | carry1  | carry2  | carry3  |

// 제약: t0 = a[0]*b[0]
//       t1 = a[0]*b[1] + a[1]*b[0]
// check: t0 + t1*2^64 + c_lo == d_lo + carry*2^128`;

export const mulAddAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '64비트 limb 분해 + 16비트 carry' },
  { lines: [5, 10] as [number, number], color: 'emerald' as const, note: '회로 레이아웃 — 8행 × 4열' },
  { lines: [12, 14] as [number, number], color: 'amber' as const, note: '곱셈 전개 + carry 전파 제약' },
];

export const GADGET_OVERVIEW_CODE = `// 주요 Gadget 시스템 계층
// gadgets/ 크레이트 — 재사용 가능한 회로 컴포넌트

// 기본 검증:
//   IsZeroGadget      — value == 0 검증
//   IsEqualGadget     — lhs == rhs (IsZero(lhs-rhs))
//   LtGadget          — lhs < rhs (바이트 분해)
//   ComparatorGadget  — LT + EQ 동시 제공

// 산술 연산:
//   MulAddGadget      — a*b+c == d (mod 2^256)
//   AddWordsGadget    — 256비트 덧셈
//   BinaryNumberGadget — N비트 이진 표현

// 배치 처리:
//   BatchedIsZeroGadget — N개 값 동시 0 검증
//   SameContextGadget   — 오퍼코드 공통 상태 전환`;

export const gadgetOverviewAnnotations = [
  { lines: [4, 8] as [number, number], color: 'sky' as const, note: '기본 검증 — 0/동등/비교' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: '산술 — 곱셈/덧셈/이진' },
  { lines: [15, 17] as [number, number], color: 'amber' as const, note: '배치 — 다중 값 검증' },
];
