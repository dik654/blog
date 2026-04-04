export interface TraitItem {
  trait_name: string;
  purpose: string;
  key_method: string;
  detail: string;
}

export const EXECUTOR_TRAITS: TraitItem[] = [
  {
    trait_name: 'BlockExecutor',
    purpose: '단일 블록 실행',
    key_method: 'execute_and_verify_one()',
    detail: '블록 내 모든 TX를 revm으로 실행하고, 가스 사용량/receipt를 검증한다. Output으로 실행 결과를 반환한다.',
  },
  {
    trait_name: 'BatchExecutor',
    purpose: '다중 블록 누적 실행',
    key_method: 'finalize()',
    detail: 'execute_and_verify_one()을 반복 호출해 상태를 누적한다. finalize()로 BundleState를 소비(self 이동)해 반환한다.',
  },
  {
    trait_name: 'BlockExecutorProvider',
    purpose: '실행기 팩토리',
    key_method: 'batch_executor()',
    detail: 'DB 상태를 받아 BatchExecutor를 생성한다. ExecutionStage가 이 팩토리로 실행기를 만든다.',
  },
];
