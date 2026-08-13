export interface BodyVerifyItem {
  label: string;
  desc: string;
}
export const BODY_VERIFY_ITEMS: readonly BodyVerifyItem[] = [
  {
    label: "transactions_root",
    desc: "ordered transaction envelopes로 protocol trie root를 계산해 header commitment와 비교한다.",
  },
  {
    label: "ommers_hash",
    desc: "PoW history에서는 ommer headers를 검증하고, post-Merge canonical block에서는 empty ommers rule을 적용한다.",
  },
  {
    label: "withdrawals_root",
    desc: "fork가 활성화된 범위에서 withdrawals의 존재 조건과 계산 root를 header와 대조한다.",
  },
  {
    label: "provider mapping",
    desc: "block과 transaction order를 보존하는 logical indices를 저장하며 physical Storage V1/V2 route는 provider가 결정한다.",
  },
] as const;
