export const C = { client: '#f59e0b', gateway: '#6366f1', pi: '#10b981', response: '#0ea5e9' };

export const STEPS = [
  { label: 'Client 연결: Operator/Node/WebChat → Gateway',
    body: 'Operator(CLI/TUI), Node(macOS/iOS 앱), WebChat 클라이언트가 ws://127.0.0.1:18789로 Gateway에 연결합니다. 각 클라이언트 유형별로 다른 인증 방식을 사용합니다.' },
  { label: '메시지 수신: 채널 라우팅 (20+ 채널)',
    body: 'Gateway의 Channel Router가 수신 메시지를 정규화하고, DM/그룹/멘션 라우팅 규칙에 따라 적절한 에이전트 세션으로 전달합니다.' },
  { label: 'Pi Agent: tool adapter + 모델 실행',
    body: 'Pi SDK의 createAgentSession()으로 에이전트를 실행합니다. toToolDefinitions()로 도구를 브릿지하고, 멀티 프로바이더 모델을 선택하여 에이전트 루프를 수행합니다.' },
  { label: '응답 스트리밍: SSE/WebSocket으로 반환',
    body: '에이전트의 text_delta 이벤트를 실시간 스트리밍으로 클라이언트에 전달합니다. 채널별 리치 메시지 포맷으로 변환하여 최종 응답을 전송합니다.' },
];
