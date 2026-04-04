export interface ExExConcept {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
}

export const EXEX_CONCEPTS: ExExConcept[] = [
  {
    id: 'notification',
    label: 'ExExNotification',
    role: '체인 이벤트 스트림',
    details:
      'ChainCommitted, ChainReverted, ChainReorged 3종 이벤트를 전달한다. ' +
      '각 이벤트에 블록 데이터 + 상태 변경(BundleState)이 포함되어 있어 추가 DB 조회 불필요.',
    why: '왜 3종? commit(정상), revert(되감기), reorg(교체) — 모든 체인 상태 변경을 빠짐없이 커버.',
    color: '#6366f1',
  },
  {
    id: 'manager',
    label: 'ExExManager',
    role: 'fan-out 브로드캐스터',
    details:
      '등록된 모든 ExEx에 알림을 복제(clone) 전달한다. ' +
      'Arc<Chain>으로 감싸져 있어 clone 시 데이터 복사 없이 참조 카운트만 증가. 10개 ExEx도 메모리 1벌.',
    why: '왜 Arc? 블록 데이터가 수 MB에 달할 수 있다. 복사 대신 공유 참조로 메모리를 절약.',
    color: '#0ea5e9',
  },
  {
    id: 'context',
    label: 'ExExContext',
    role: '노드 내부 리소스 접근',
    details:
      'provider(상태 DB), pool(TX풀), notifications(이벤트 채널), head(현재 체인 head)에 접근한다. ' +
      'ExEx 함수의 첫 번째 인자로 전달되며, 노드의 전체 기능을 활용할 수 있다.',
    why: '왜 Context 패턴? 필요한 리소스를 하나의 구조체로 묶어 의존성을 명확하게 관리.',
    color: '#10b981',
  },
  {
    id: 'finished-height',
    label: 'FinishedHeight',
    role: '프루닝 시그널',
    details:
      'ExEx가 처리를 완료한 블록 높이를 ExExManager에 알린다. ' +
      'Manager는 모든 ExEx의 min(finished_height)를 프루닝 기준점으로 사용.',
    why: '왜 필요? 느린 ExEx가 있으면 해당 블록까지 데이터를 보존해야 한다. 디스크 사용량 제어의 핵심.',
    color: '#f59e0b',
  },
];
