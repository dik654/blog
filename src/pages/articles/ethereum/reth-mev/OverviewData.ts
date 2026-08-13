export const PBS_ROLES = [
  {
    id: "searcher",
    label: "Searcher",
    role: "ordered bundle·private orderflow를 builder에 제출",
    boundary: "Reth node의 public txpool이나 Engine API 책임과 동일하지 않다.",
    color: "#f59e0b",
  },
  {
    id: "builder",
    label: "External builder",
    role: "transactions와 bundles를 실행해 payload와 bid를 만든다.",
    boundary:
      "rbuilder 같은 별도 service는 Reth crates를 사용할 수 있지만 Reth node 자체와 같은 process라고 가정하지 않는다.",
    color: "#0ea5e9",
  },
  {
    id: "relay",
    label: "Relay",
    role: "builder submissions를 검사하고 blinded bid·payload exchange를 중개한다.",
    boundary:
      "availability, censorship와 trust assumptions가 추가되는 out-of-protocol component다.",
    color: "#10b981",
  },
  {
    id: "proposer path",
    label: "CL / mev-boost",
    role: "validator registration, header selection과 blinded block exchange를 조정한다.",
    boundary:
      "외부 bid와 local payload의 선택은 execution client Reth 내부 RPC loop의 책임이 아니다.",
    color: "#6366f1",
  },
] as const;
