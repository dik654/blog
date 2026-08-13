export interface MiddlewareLayer {
  id: string;
  name: string;
  target: string;
  desc: string;
  color: string;
}
export const MIDDLEWARE_STACK: readonly MiddlewareLayer[] = [
  {
    id: "bind",
    name: "Listener exposure",
    target: "HTTP·WS·auth RPC",
    desc: "loopback/private address를 기본 경계로 삼고 필요한 listener와 namespaces만 명시적으로 활성화한다.",
    color: "#6366f1",
  },
  {
    id: "jwt",
    name: "JWT bearer authentication",
    target: "Engine API",
    desc: "CL과 EL이 공유한 256-bit secret으로 HS256 token과 freshness를 검증한다. TLS와 network isolation은 별도 책임이다.",
    color: "#ef4444",
  },
  {
    id: "shape",
    name: "Host·origin·payload shape",
    target: "transport",
    desc: "Host/origin policy와 configurable request·response size limits로 decode 전후의 자원 사용을 제한한다.",
    color: "#0ea5e9",
  },
  {
    id: "budget",
    name: "Concurrency·timeout·method limits",
    target: "server and handlers",
    desc: "동시 실행, timeout, block ranges와 result counts를 method 비용에 맞게 제한한다.",
    color: "#f59e0b",
  },
  {
    id: "observe",
    name: "Tracing·metrics",
    target: "all endpoints",
    desc: "method, status, latency와 rejection reason을 기록하되 JWT·params 같은 secrets와 민감 데이터는 노출하지 않는다.",
    color: "#10b981",
  },
] as const;
