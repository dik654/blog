export const BUILD_PATHS = [
  {
    title: "Reth local payload builder",
    owner: "Execution client",
    desc: "forkchoiceUpdated payload attributes로 job을 열고 txpool candidates를 실행해 getPayload에 답한다.",
    color: "#6366f1",
  },
  {
    title: "External block builder",
    owner: "Separate builder service",
    desc: "private orderflow·bundles와 public transactions를 조립하고 relay에 signed bid와 payload를 제출한다.",
    color: "#0ea5e9",
  },
  {
    title: "Relay network",
    owner: "Out-of-protocol intermediary",
    desc: "builder submissions를 검증·보관하고 proposer-side request에 blinded bid와 payload를 제공한다.",
    color: "#10b981",
  },
  {
    title: "mev-boost / CL integration",
    owner: "Validator stack",
    desc: "relay configuration, header selection, blinded block signing과 payload retrieval을 수행한다.",
    color: "#f59e0b",
  },
] as const;
