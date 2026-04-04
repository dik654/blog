import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '전송 계층 — 메시지를 어떻게 보내는가',
    body: 'MCP는 JSON-RPC 2.0 기반\n전송(transport) 방식만 바꾸면 로컬↔원격 모두 대응\n3가지 전송 계층: stdio, HTTP SSE, Streamable HTTP',
  },
  {
    label: 'stdio — 로컬 프로세스 통신',
    body: 'Host가 Server를 자식 프로세스(child process)로 실행\nstdin/stdout으로 JSON-RPC 메시지 교환\n가장 단순 — 로컬 도구(파일시스템, git)에 적합',
  },
  {
    label: 'HTTP SSE — 원격 서버 스트리밍',
    body: 'Client → Server: HTTP POST로 요청\nServer → Client: SSE(Server-Sent Events)로 스트리밍 응답\n원격 API 서버에 적합 — 방화벽 뒤 서비스 접근 시 사용',
  },
  {
    label: 'Streamable HTTP — 최신 통합 방식',
    body: '단일 HTTP 엔드포인트로 양방향 통신\nServer → Client 알림도 가능 (SSE 업그레이드)\nstateless 서버 지원 — 클라우드 배포에 최적화',
  },
];

export const TRANSPORTS = [
  { label: 'stdio', desc: '로컬', arrow: 'stdin/stdout', color: '#6366f1', y: 40 },
  { label: 'HTTP SSE', desc: '원격', arrow: 'POST + SSE', color: '#10b981', y: 100 },
  { label: 'Streamable HTTP', desc: '통합', arrow: '단일 endpoint', color: '#f59e0b', y: 160 },
];
