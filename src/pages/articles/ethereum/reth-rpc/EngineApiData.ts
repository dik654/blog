export interface EngineMethod {
  id: string;
  name: string;
  direction: string;
  role: string;
  details: string;
  color: string;
}
export const ENGINE_METHODS: readonly EngineMethod[] = [
  {
    id: "fcu",
    name: "engine_forkchoiceUpdatedV*",
    direction: "CL → EL",
    role: "canonical references · build start",
    details:
      "head, safe와 finalized hashes를 전달한다. Payload attributes가 있으면 fork에 맞는 local payload job을 시작하고 payload id를 받을 수 있다.",
    color: "#6366f1",
  },
  {
    id: "get",
    name: "engine_getPayloadV*",
    direction: "CL → EL",
    role: "local payload result",
    details:
      "payload id에 연결된 local build result를 반환한다. Response shape는 blobs bundle, block value, execution requests 등 fork version에 따라 확장된다.",
    color: "#10b981",
  },
  {
    id: "new",
    name: "engine_newPayloadV*",
    direction: "CL → EL",
    role: "external payload validation",
    details:
      "fork-specific parameters와 payload를 검증해 VALID, INVALID, SYNCING 같은 protocol status를 반환한다. Status는 단순 boolean이 아니다.",
    color: "#0ea5e9",
  },
] as const;
