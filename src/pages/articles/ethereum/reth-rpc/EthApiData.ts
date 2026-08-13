export interface EthMethod {
  id: string;
  name: string;
  category: string;
  desc: string;
  flow: string;
  color: string;
}
export const ETH_METHODS: readonly EthMethod[] = [
  {
    id: "balance",
    name: "eth_getBalance",
    category: "state lookup",
    desc: "선택한 block context의 account balance를 조회한다.",
    flow: "selector resolution → historical/latest state provider → account availability → quantity result",
    color: "#6366f1",
  },
  {
    id: "call",
    name: "eth_call",
    category: "EVM simulation",
    desc: "선택한 base state 위에서 call을 실행하되 canonical state를 변경하지 않는다.",
    flow: "state view + overrides → fork-aware EVM → return data or revert/error",
    color: "#0ea5e9",
  },
  {
    id: "send",
    name: "eth_sendRawTransaction",
    category: "pool submission",
    desc: "signed envelope를 decode하고 txpool validation·replacement policy에 전달한다.",
    flow: "decode → validate → pool result → accepted transaction hash or error",
    color: "#10b981",
  },
  {
    id: "logs",
    name: "eth_getLogs",
    category: "indexed range query",
    desc: "block range, address와 topics로 logs를 검색한다.",
    flow: "range/limit checks → indices·bloom candidate filtering → receipt logs → exact filter",
    color: "#f59e0b",
  },
  {
    id: "estimate",
    name: "eth_estimateGas",
    category: "repeated simulation",
    desc: "현재 context와 call parameters에서 성공 가능한 gas estimate를 탐색한다.",
    flow: "upper-bound execution → search strategy → revert and allowance handling → estimate",
    color: "#ec4899",
  },
] as const;
