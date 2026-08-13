export interface SenderFact {
  label: string;
  value: string;
  desc: string;
}
export const SENDER_FACTS: readonly SenderFact[] = [
  {
    label: "network field",
    value: "sender는 전송되지 않음",
    desc: "transaction type별 signing payload와 signature로 복구하므로 임의의 from 값을 신뢰하지 않는다.",
  },
  {
    label: "parallel boundary",
    value: "transaction별 독립",
    desc: "signature recovery는 나눌 수 있지만 결과는 원래 TxNumber와 순서대로 다시 결합해야 한다.",
  },
  {
    label: "validation",
    value: "fork·type aware",
    desc: "chain id, typed envelope와 signature 규칙을 적용한 뒤 유효한 sender만 downstream에 제공한다.",
  },
  {
    label: "storage contract",
    value: "provider-routed mapping",
    desc: "Execution은 논리적 sender mapping을 읽으며 MDBX·RocksDB 같은 물리 배치를 직접 가정하지 않는다.",
  },
] as const;
