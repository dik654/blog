export const PROVE_CODE = `// S-two Cairo: Circle STARKs 기반 증명 시스템
// cairo-prove CLI → stwo_cairo_prover 라이브러리

// 1. 프로그램 컴파일 & 실행
Cairo 소스 코드 → Scarb 빌드 → CASM 바이트코드 → 실행 가능한 JSON
실행 파일 + 입력 → Cairo VM 초기화 → 실행 → 추적 생성 → 메모리 상태

// 2. 어댑터 변환 (Cairo VM → S-two 입력)
pub fn adapter(runner: &CairoRunner) -> ProverInput {
  let relocatable_trace = runner.get_relocatable_trace()?;
  let relocatable_memory = runner.get_relocatable_memory();
  let relocator = Relocator::new(&relocatable_memory);
  let relocated_memory = relocator.relocate_memory(&relocatable_memory);
  let state_transitions = StateTransitions::from_slice_parallel(&trace);
  // → ProverInput { state_transitions, memory, builtin_segments }
}

// 3. 증명 생성
pub fn prove(input: ProverInput, pcs_config: PcsConfig) -> CairoProof {
  stwo_cairo_prover::prover::prove_cairo::<Blake2sMerkleChannel>(
    input, pcs_config, preprocessed_trace
  ).unwrap()
}`;

export const PROVE_ANNOTATIONS = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: '2단계: 컴파일+실행 → 추적 생성' },
  { lines: [8, 15] as [number, number], color: 'emerald' as const, note: '어댑터: Cairo VM 출력 → 재배치 → S-two 입력' },
  { lines: [18, 22] as [number, number], color: 'amber' as const, note: 'Circle STARK 증명 생성 (Blake2s)' },
];

export const VERIFY_CODE = `// 증명 검증 프로세스
// 증명 파일 → 역직렬화 → 전처리 설정 → Circle STARK 검증

// 보안 설정 (PcsConfig)
fn secure_pcs_config() -> PcsConfig {
  PcsConfig {
    pow_bits: 26,                     // 작업 증명 26비트 보안
    fri_config: FriConfig {
      log_last_layer_degree_bound: 0, // 마지막 레이어 차수
      log_blowup_factor: 1,          // 블로우업 팩터 (2배)
      n_queries: 70,                 // 쿼리 수 (보안 수준)
    },
  }
}

// 검증기 (stwo_cairo_verifier): Cairo로 작성된 온체인 검증
// → 가스 효율적인 검증 프로세스
// → Starknet L1에서 증명 검증 가능`;

export const VERIFY_ANNOTATIONS = [
  { lines: [5, 13] as [number, number], color: 'sky' as const, note: 'PcsConfig: PoW 26비트 + FRI 70쿼리' },
  { lines: [16, 18] as [number, number], color: 'emerald' as const, note: '온체인 검증기: Cairo로 작성, L1 검증 가능' },
];
