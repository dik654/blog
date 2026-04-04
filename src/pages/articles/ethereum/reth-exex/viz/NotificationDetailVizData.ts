export const C = { pipe: '#6366f1', mgr: '#8b5cf6', commit: '#10b981', revert: '#f59e0b', prune: '#0ea5e9' };

export const STEPS = [
  {
    label: 'Pipeline → ExExNotification 생성',
    body: 'ExecutionStage가 블록을 실행 완료\n결과(Arc<Chain>)를 ExExNotification으로 래핑\nArc 참조 → clone 시 데이터 복사 없음',
  },
  {
    label: 'ExExManager fan-out',
    body: 'Manager가 등록된 모든 ExEx에\nNotification을 clone하여 전달\n각 ExEx는 독립 채널 → 한 ExEx가 느려도\n다른 ExEx에 영향 없음',
  },
  {
    label: 'ChainCommitted 처리',
    body: 'ExEx가 알림을 수신하면\n블록의 TX/로그/영수증을 순회\n인덱서: DB에 기록\n브릿지: deposit 이벤트 감지',
  },
  {
    label: 'ChainReverted 처리',
    body: 'reorg 발생 시 Manager가 Reverted 전송\nExEx는 해당 블록의 인덱스를 롤백\n노드와 ExEx가 동시에 reorg 반영\n→ 일관성 자동 유지',
  },
  {
    label: 'FinishedHeight 보고',
    body: '각 ExEx가 처리 완료 시 FinishedHeight 전송\nManager가 min(heights) 계산\n→ 그 이하 블록 데이터 프루닝 허용\n느린 ExEx가 있으면 디스크 사용량 증가',
  },
];
