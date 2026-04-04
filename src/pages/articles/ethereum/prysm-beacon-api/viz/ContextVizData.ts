export const C = { grpc: '#8b5cf6', rest: '#3b82f6', err: '#ef4444', ok: '#10b981', val: '#f59e0b' };

export const STEPS = [
  {
    label: '외부 통신 요구',
    body: '검증자 클라이언트와 외부 도구가 비콘 노드와 통신하여 의무 조회와 상태 모니터링을 합니다.',
  },
  {
    label: '문제: 두 인터페이스 동시 지원',
    body: 'gRPC(내부용)와 REST(표준 Beacon API) 두 인터페이스의 로직 중복을 피해야 합니다.',
  },
  {
    label: '문제: 보안 + 성능',
    body: '매 슬롯 수십 건의 요청이 도착하므로 인터셉터 기반 보안과 스트리밍이 필수입니다.',
  },
  {
    label: '해결: gRPC primary + gateway 자동 변환',
    body: 'gRPC에 로직을 구현하고 gRPC-gateway가 REST로 자동 변환하여 로직 중복을 제거합니다.',
  },
  {
    label: '해결: 이벤트 스트리밍 + SSE',
    body: 'gRPC 스트리밍과 REST SSE로 폴링 없이 블록/어테스테이션 이벤트를 실시간 수신합니다.',
  },
];
