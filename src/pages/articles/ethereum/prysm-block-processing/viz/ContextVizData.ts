export const C = { block: '#8b5cf6', ok: '#10b981', err: '#ef4444', ops: '#f59e0b', exec: '#0ea5e9' };

export const STEPS = [
  {
    label: '수신 블록을 검증해야 함',
    body: '유효하지 않은 블록이 반영되면 합의가 깨지므로 모든 블록은 엄격한 검증을 통과해야 합니다.',
  },
  {
    label: '문제: 다양한 오퍼레이션 혼재',
    body: 'RANDAO, 어테스테이션, 디포짓 등이 혼재하여 정확한 순서로 처리해야 상태 일관성이 유지됩니다.',
  },
  {
    label: '문제: EL 실행 페이로드 검증',
    body: 'CL이 직접 실행할 수 없어 Engine API로 EL에 위임해야 합니다.',
  },
  {
    label: '해결: onBlock 6단계 파이프라인',
    body: '부모 상태 → 슬롯 전진 → ProcessBlock → EL 검증 → 포크 선택 → DB 저장으로 구성됩니다.',
  },
  {
    label: '해결: 배치 BLS 서명 검증',
    body: '개별 대신 배치 BLS 집계 서명으로 검증 성능을 대폭 향상합니다.',
  },
];
