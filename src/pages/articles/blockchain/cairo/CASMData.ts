export const CASM_CODE = `// CASM 생성: Sierra → Cairo Assembly 변환
// cairo-lang-sierra-to-casm crate

pub fn compile(
  program: &Program,
  program_info: &ProgramRegistryInfo,
  metadata: &Metadata,
  config: SierraToCasmConfig,
) -> Result<CairoProgram, Box<CompilationError>> {
  // 1. 메타데이터 검증
  validate_metadata(program, &program_info.registry, metadata)?;

  // 2. 각 Sierra 문장을 순회하며 CASM으로 변환
  for (statement_id, statement) in program.statements.iter().enumerate() {
    match statement {
      Statement::Return(ref_ids) => { /* ret 명령어 */ }
      Statement::Invocation(inv) => {
        let compiled = compile_invocation(program_info, inv, ...)?;
        instructions.extend(compiled.instructions);
      }
    }
  }
  // 3. 재배치(relocation) 적용 → 최종 CairoProgram
  relocate_instructions(&relocations, &statement_offsets, ...);
}`;

export const CASM_ANNOTATIONS = [
  { lines: [4, 9] as [number, number], color: 'sky' as const, note: 'compile() 진입점: 4개 파라미터' },
  { lines: [15, 22] as [number, number], color: 'emerald' as const, note: '문장별 변환: Return 또는 Invocation' },
  { lines: [24, 25] as [number, number] as [number, number], color: 'amber' as const, note: '재배치로 점프 주소 최종 해석' },
];

export const MAPPING_CODE = `// Sierra → CASM 매핑 규칙 예시

// 기본 연산:  felt252_add(a, b) → [ap] = [fp-3] + [fp-4]; ap++
// 메모리:    store_temp<T>(v) → AP 레지스터에 임시 값 저장
// 제어 흐름: branch_align() → NOP 또는 분기 정렬 점프
// 함수 호출: function_call(id, args) → call rel offset; (스택 프레임)

// Cairo VM 레지스터 모델
// AP (Allocation Pointer): 스택의 현재 위치
// FP (Frame Pointer): 현재 함수 프레임의 시작
// PC (Program Counter): 현재 실행 중인 명령어 위치

// 최적화 기법:
// - 인라인 상수: 작은 상수값은 즉시값으로 인라인
// - 레지스터 재사용: 동일한 값에 대한 중복 로드 제거
// - AP 증분 최적화: 연속된 메모리 접근 시 AP 증분 최소화`;

export const MAPPING_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '4가지 주요 매핑: 연산/메모리/제어/호출' },
  { lines: [8, 10] as [number, number], color: 'emerald' as const, note: 'Cairo VM의 3개 레지스터 (AP, FP, PC)' },
  { lines: [13, 15] as [number, number], color: 'amber' as const, note: '코드 크기 & 실행 속도 최적화' },
];
