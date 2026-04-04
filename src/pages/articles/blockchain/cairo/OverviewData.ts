export const PIPELINE_CODE = `// Cairo 컴파일 파이프라인 (Salsa 쿼리 기반)
// 각 단계는 독립적인 Database Group으로 관리

trait Database:
  ParserGroup +      // 구문 분석 (AST 생성)
  DefsGroup +        // 정의 수집
  SemanticGroup +    // 의미 분석 (타입 체크)
  LoweringGroup +    // Lowering (고수준 → 저수준)
  SierraGenGroup     // Sierra IR 생성
{
  // 각 그룹은 특정 컴파일 단계의 쿼리들을 정의
}

// 데이터베이스 기반: 증분 컴파일 + 병렬 처리 지원
#[salsa::db]
pub struct RootDatabase {
  storage: salsa::Storage<RootDatabase>,
}`;

export const PIPELINE_ANNOTATIONS = [
  { lines: [4, 8] as [number, number], color: 'sky' as const, note: '5개 컴파일 단계 (Database Group)' },
  { lines: [14, 17] as [number, number], color: 'emerald' as const, note: 'Salsa 쿼리 DB: 증분 컴파일 지원' },
];

export const TYPE_CODE = `// Cairo 핵심 타입 시스템
// felt252: STARK-friendly 소수체 원소 (P = 2^251 + 17·2^192 + 1)

fn fibonacci(n: felt252) -> felt252 {
  if n == 0 { return 0; }
  if n == 1 { return 1; }
  fibonacci(n - 1) + fibonacci(n - 2)
}

// 소유권 기반 메모리 모델 (Rust와 유사)
#[derive(Copy, Drop)]  // felt252는 Copy + Drop
struct Point { x: felt252, y: felt252 }

// 제네릭 + 트레이트
fn swap<T, +Drop<T>>(ref a: T, ref b: T) { ... }`;

export const TYPE_ANNOTATIONS = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: 'felt252: 251비트 소수체 원소' },
  { lines: [4, 8] as [number, number], color: 'emerald' as const, note: '재귀 함수 — 가스 카운팅 자동 삽입' },
  { lines: [11, 12] as [number, number], color: 'amber' as const, note: 'Copy/Drop 트레이트 = 소유권 제어' },
];
