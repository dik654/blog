export interface RPCLayer {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
}
export const RPC_LAYERS: readonly RPCLayer[] = [
  {
    id: "transport",
    label: "Listeners",
    role: "HTTP·WS·IPC / auth RPC",
    details:
      "각 listener는 별도 address, port, enabled namespaces와 exposure policy를 가진다.",
    why: "Public JSON-RPC와 CL↔EL Engine API의 trust boundary를 분리한다.",
    color: "#6366f1",
  },
  {
    id: "middleware",
    label: "Middleware",
    role: "auth·limits·observability",
    details:
      "JWT, host/origin, payload limits, timeout과 tracing을 method implementation 밖에서 적용한다.",
    why: "운영 policy를 바꿔도 protocol handler contract를 유지할 수 있다.",
    color: "#0ea5e9",
  },
  {
    id: "dispatch",
    label: "Typed modules",
    role: "decode·dispatch·encode",
    details:
      "jsonrpsee modules가 namespace와 versioned methods를 params/result types에 연결한다.",
    why: "invalid params와 unsupported method를 실제 provider 작업 전에 구분한다.",
    color: "#10b981",
  },
  {
    id: "handler",
    label: "Services",
    role: "provider·EVM·pool·engine",
    details:
      "Method handler가 요청된 block context를 고정하고 backend service 결과를 RPC response로 변환한다.",
    why: "Transport가 state availability, execution validity와 Engine status의 의미를 재정의하지 않게 한다.",
    color: "#f59e0b",
  },
] as const;
