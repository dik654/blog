export const POSEIDON2_CODE = `// poseidon2/src/lib.rs — 실제 코드 구조
pub struct Poseidon2<F, ExternalPerm, InternalPerm,
    const WIDTH: usize, const D: u64> {
    external_layer: ExternalPerm,   // 외부 라운드 (Full S-box + MDS)
    internal_layer: InternalPerm,   // 내부 라운드 (Partial S-box)
}

// BabyBear WIDTH=16, D=7 설정
// S-box: x^7 (거듭제곱 연산으로 비선형성 확보)
// 역연산: x^{1/7} = x^{1725656503}
//
// 라운드 구조 (128-bit 보안):
//   외부 R_F/2=4 → 내부 R_P=13 → 외부 R_F/2=4
//   총 21 라운드 (BabyBear, WIDTH=16)`;

export const POSEIDON2_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '외부/내부 퍼뮤테이션 분리' },
  { lines: [12, 14] as [number, number], color: 'emerald' as const, note: '라운드 구성: Full → Partial → Full' },
];

export const SBOX_CODE = `// S-box 최적화: x^7 = x * x^2 * x^4
pub struct SBox<T, const DEGREE: u64, const REGISTERS: usize>(
    pub [T; REGISTERS]
);
// REGISTERS = 3: [x^2, x^4, x^6] 저장
// x^7 = x * x^6 (최소 곱셈 횟수)

// 외부 라운드: 모든 원소에 S-box 적용
// 내부 라운드: 첫 번째 원소만 S-box → 나머지는 선형
//
// Poseidon2 vs Poseidon1:
// 내부 라운드의 MDS를 대각 행렬로 교체 → ~30% 성능 향상`;

export const SBOX_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: 'S-box 중간 결과 캐싱' },
  { lines: [10, 12] as [number, number], color: 'emerald' as const, note: 'Poseidon2 핵심 개선점' },
];
