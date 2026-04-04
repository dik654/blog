export const SIERRA_CODE = `// Sierra 프로그램 구조 (Safe Intermediate Representation)
/// A full Sierra program.
pub struct Program {
  pub type_declarations: Vec<TypeDeclaration>,     // 타입 선언
  pub libfunc_declarations: Vec<LibfuncDeclaration>, // 라이브러리 함수 선언
  pub statements: Vec<Statement>,                  // 프로그램 코드
  pub funcs: Vec<Function>,                        // 함수 시그니처 + 진입점
}

// 안전성의 세 가지 핵심 원칙:
// 1. 패닉 없음: 모든 함수는 반드시 반환값을 가짐
// 2. 무한 루프 없음: 자체적으로 실행 단계를 카운팅
// 3. 올바른 빌트인 사용: 라이브러리 함수가 항상 올바르게 사용됨`;

export const SIERRA_ANNOTATIONS = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: 'Sierra 프로그램의 네 가지 구성요소' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: '구조적 안전성: 패닉/무한루프/오용 방지' },
];

export const LIBFUNC_CODE = `// Sierra 라이브러리 함수 계층
define_libfunc_hierarchy! {
  pub enum CoreLibfunc {
    ApTracking(ApTrackingLibfunc),  // 메모리 관리 (AP 추적)
    Drop(DropLibfunc),             // 값 해제
    Dup(DupLibfunc),               // 값 복제
    Felt252(Felt252Libfunc),       // 기본 타입 연산
    BranchAlign(BranchAlignLibfunc), // 제어 흐름
    Gas(GasLibfunc),               // 가스 관리
    Array(ArrayLibfunc),           // 데이터 구조
    Pedersen(PedersenLibfunc),     // 암호화 연산
    Starknet(StarknetLibfunc),     // Starknet 특화
  }, CoreConcreteLibfunc
}`;

export const LIBFUNC_ANNOTATIONS = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: '메모리 관리: AP 추적, Drop, Dup' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '연산 & 제어 흐름 & 가스' },
  { lines: [10, 12] as [number, number], color: 'amber' as const, note: '데이터 구조 & 암호화 & Starknet' },
];
