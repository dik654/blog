export const STEPS = [
  { label: 'ExEx 전체 흐름', body: 'Pipeline 실행 결과를\n등록된 ExEx들이 독립 처리' },
  { label: 'Pipeline이 블록 실행', body: '블록 실행 완료 → ExExNotification 생성\nArc<Chain>으로 래핑' },
  { label: 'ExExManager fan-out', body: '알림을 모든 ExEx에 clone 전달\n각 ExEx는 독립 채널로 수신' },
  { label: '각 ExEx가 독립 처리', body: '인덱서: TX/로그 인덱싱\n브릿지: 크로스체인 릴레이\n분석: 실시간 통계' },
  { label: 'FinishedHeight 보고', body: '각 ExEx가 처리 완료 높이를 보고\nManager가 min(heights) → 프루닝 기준' },
];

export const C = {
  pipeline: '#6366f1',
  manager: '#8b5cf6',
  indexer: '#10b981',
  bridge: '#f59e0b',
  analytics: '#ef4444',
  dim: '#94a3b8',
};
