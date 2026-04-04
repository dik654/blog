export const C = { local: '#6366f1', ext: '#f59e0b', relay: '#8b5cf6', ok: '#10b981', fail: '#ef4444' };

export const STEPS = [
  {
    label: '로컬 블록 빌드 (항상 실행)',
    body: 'inner 빌더가 항상 로컬 블록을 빌드하여 liveness fallback을 보장합니다.',
  },
  {
    label: '외부 릴레이 입찰 요청',
    body: 'get_header()로 릴레이의 최고가 블록 헤더를 요청하며 타임아웃 시 건너뜁니다.',
  },
  {
    label: 'value 비교 — 외부 vs 로컬',
    body: '외부 bid.value > 로컬 payload.value이면 외부 채택, 아니면 로컬을 사용합니다.',
  },
  {
    label: 'Blinded Block 서명',
    body: '헤더만 수신하여 blind signing 후 get_payload 호출 시 바디가 공개됩니다.',
  },
  {
    label: '데코레이터 패턴',
    body: 'MevPayloadBuilder<Inner>가 기존 빌더를 감싸 외부 입찰 비교만 추가합니다.',
  },
];
