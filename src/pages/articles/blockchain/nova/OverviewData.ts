export const CRATE_CODE = `// nova-snark/src/
nova/
  mod.rs      // PublicParams, RecursiveSNARK — IVC 메인 API
  nifs.rs     // NIFS::prove / verify — 폴딩 코어
  circuit/    // NovaAugmentedCircuit — 폴딩 검증 회로
r1cs/         // R1CSShape, RelaxedR1CSInstance, RelaxedR1CSWitness
spartan/      // 최종 압축 SNARK (ppsnark / snark)
provider/     // 곡선 엔진 (Pallas/Vesta, BN256/Grumpkin, Secp256k1)
traits/       // Engine, ROTrait (랜덤 오라클), StepCircuit

// 기본 사용 패턴:
// 1. PublicParams::setup(&circuit, ..) → pp
// 2. RecursiveSNARK::new(&pp, &circuit, z0) → rs
// 3. rs.prove_step(&pp, &circuit)  (반복)
// 4. CompressedSNARK::prove(&pp, &pk, &rs) → 최종 증명 (수백 bytes)`;

export const RELAXED_CODE = `// 표준 R1CS: (A·z) ∘ (B·z) = C·z  (정확한 제약)
// Relaxed R1CS: (A·z) ∘ (B·z) = u·(C·z) + E
//   u: 스케일 인수 (처음에 1, 폴딩마다 업데이트)
//   E: 에러 벡터 (처음에 0, 폴딩마다 커밋)
//
// NIFS 폴딩 (도전값 r ∈ Fq):
//   U'  = U1  + r·U2    (인스턴스 선형 결합)
//   W'  = W1  + r·W2    (증인 선형 결합)
//   E'  = E1  + r·T + r²·E2  (교차항 T = A·W1 ∘ B·W2 + ...)
//   u'  = u1  + r·u2
//
// 핵심: U2가 표준 R1CS면 u2=1, E2=0 → 더 단순
// comm_T = Commit(T) 가 유일한 증거 → 증명 크기 O(1)!

// NovaAugmentedCircuit: 각 스텝마다 "이전 폴딩이 올바른지" 회로 내에서 검증
//   - Hash(U_prev) 확인 (RO 기반)
//   - comm_T 흡수 → 도전값 r 생성
//   - 폴딩 결과 U_next 계산 후 다음 스텝으로 전달`;

export const crateAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: 'nova/ — IVC + NIFS 핵심' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: 'R1CS + Spartan + 곡선 엔진' },
  { lines: [11, 15] as [number, number], color: 'amber' as const, note: '기본 사용 패턴 4단계' },
];

export const relaxedAnnotations = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: 'Relaxed R1CS — u·(C·z) + E 확장' },
  { lines: [6, 10] as [number, number], color: 'emerald' as const, note: 'NIFS 폴딩 — 선형 결합 규칙' },
  { lines: [12, 13] as [number, number], color: 'amber' as const, note: '핵심: comm_T만으로 O(1) 증명' },
  { lines: [15, 18] as [number, number], color: 'violet' as const, note: 'Augmented Circuit — 회로 내 검증' },
];
