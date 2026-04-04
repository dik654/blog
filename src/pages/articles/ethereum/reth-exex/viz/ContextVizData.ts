export const C = { pipeline: '#6366f1', ext: '#10b981', err: '#ef4444', mgr: '#8b5cf6', idx: '#f59e0b' };

export const STEPS = [
  {
    label: '블록 실행 결과를 실시간 필요',
    body: '인덱서, 브릿지, 분석 서비스가 블록 실행 결과를 실시간으로 소비해야 합니다.',
  },
  {
    label: '문제: 외부 폴링의 비효율',
    body: '별도 서비스가 RPC 폴링하면 네트워크 지연과 중복 실행으로 리소스가 낭비됩니다.',
  },
  {
    label: '문제: reorg 동기화 실패',
    body: '외부 인덱서의 reorg 감지 타이밍이 늦으면 잘못된 데이터를 제공합니다.',
  },
  {
    label: '해결: ExEx — 노드 내부 스트림',
    body: 'Reth 고유 기능으로 Pipeline 실행 결과를 내부 채널로 전달하여 별도 프로세스 없이 처리합니다.',
  },
  {
    label: '해결: 3종 알림 + FinishedHeight',
    body: 'Committed/Reverted/Reorged 3종 알림과 FinishedHeight 보고로 프루닝 기준을 결정합니다.',
  },
];
