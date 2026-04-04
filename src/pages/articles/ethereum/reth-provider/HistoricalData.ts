export const CHANGESET_STEPS = [
  {
    title: '1. 현재 상태에서 출발',
    desc: 'MDBX에 저장된 최신 확정 상태가 시작점이다. Block #N 시점의 잔액, nonce, 스토리지가 여기에 있다.',
    color: '#10b981',
  },
  {
    title: '2. ChangeSet 역방향 적용',
    desc: 'AccountChangeSets 테이블에서 해당 블록의 "변경 전 값"을 조회한다. 현재 값에 역방향 패치를 적용하면 이전 블록의 상태가 복원된다.',
    color: '#f59e0b',
  },
  {
    title: '3. 과거 상태 복원 완료',
    desc: '복원된 상태는 StateProvider trait을 구현하므로 Latest와 동일한 인터페이스로 사용 가능하다. archive 모드 없이도 과거 상태에 접근할 수 있다.',
    color: '#6366f1',
  },
];
