import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'JSON-RPC 2.0 + 3가지 전송 계층', body: 'Protocol: JSON-RPC 2.0 — request/response + notifications + batching\n\n① stdio: 로컬 프로세스, stdin/stdout 통신\n가장 간단·빠름, 네트워크 오버헤드 없음, 지연 <1ms\n적합: local tools, filesystem, git, shell\n\n② HTTP + SSE: 원격 서버, POST로 요청, SSE로 서버 푸시\n적합: cloud services, shared tools, multi-user\n\n③ Streamable HTTP (2024+): 양방향 streaming, single connection, full duplex\n적합: cloud (신규 배포)\n\nAuthentication: stdio=OS 프로세스 수준 | HTTP=OAuth, API keys, TLS\n성능: stdio <1ms | HTTP local 1-5ms | HTTP remote 10-100ms\n에러: JSON-RPC error codes, retry+backoff, circuit breakers' },
];
const visuals = [
  { title: 'stdio · SSE · Streamable HTTP', color: '#ef4444', rows: [
    { label: 'stdio', value: '로컬, stdin/stdout, <1ms, 가장 빠름' },
    { label: 'HTTP SSE', value: '원격, POST+SSE, cloud (legacy)' },
    { label: 'Streamable', value: '양방향, single conn, cloud (2024+)' },
    { label: 'Protocol', value: 'JSON-RPC 2.0 기반' },
    { label: 'Auth', value: 'stdio=OS | HTTP=OAuth, API keys' },
  ]},
];
export default function TransportDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
