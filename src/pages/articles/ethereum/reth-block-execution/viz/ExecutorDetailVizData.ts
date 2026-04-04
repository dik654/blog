export const C = { trait: '#6366f1', batch: '#f59e0b', state: '#10b981', db: '#8b5cf6' };

export const STEPS = [
  {
    label: 'BlockExecutor::execute_and_verify_one()',
    body: '단일 블록의 TX를 순회하며 revm에 전달하여 실행 결과와 상태 변경을 출력합니다.',
  },
  {
    label: 'BatchExecutor가 BlockExecutor를 감싸기',
    body: 'BatchExecutor가 BlockExecutor를 반복 호출하며 BundleState에 인메모리 누적합니다.',
  },
  {
    label: 'BundleState 내부 구조',
    body: 'state(계정별 변경), contracts(바이트코드), reverts(블록별 되돌리기) 3개 필드로 구성됩니다.',
  },
  {
    label: 'finalize() → BundleState 반환',
    body: 'finalize(self)로 BundleState 소유권을 이전하고 write_to_storage()로 MDBX에 기록합니다.',
  },
];
