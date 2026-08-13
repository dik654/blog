import { defineNarrativeFlow } from "@/components/viz/narrative-flow";

export const STEPS = defineNarrativeFlow([
  {
    label: "요청 경계와 transport를 먼저 식별한다",
    body: "일반 JSON-RPC와 authenticated Engine API는 노출 대상·인증·위험 모델이 다르며 listen address와 port는 configuration이다.",
  },
  {
    label: "JSON-RPC envelope를 typed method로 decode한다",
    body: "jsonrpsee가 method name과 params를 검사해 namespace별 server implementation으로 dispatch한다.",
  },
  {
    label: "API 구현이 provider·pool·network 책임을 조합한다",
    body: "eth 계열도 method마다 필요한 backend가 다르므로 모든 요청을 하나의 state-provider 경로로 일반화하지 않는다.",
  },
  {
    label: "Engine API는 forkchoice와 payload lifecycle을 수행한다",
    body: "consensus client의 forkchoiceUpdated·getPayload·newPayload 요청이 engine tree와 payload builder의 상태를 바꾼다.",
  },
  {
    label: "결과를 protocol error와 함께 encode한다",
    body: "성공값뿐 아니라 invalid params, unavailable state, execution validation status를 JSON-RPC contract에 맞춰 반환한다.",
  },
]);
