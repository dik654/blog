export interface GenesisStep {
  title: string;
  desc: string;
}

export const GENESIS_STEPS: readonly GenesisStep[] = [
  {
    title: "입력 정규화",
    desc: "built-in spec 또는 custom genesis를 같은 Genesis와 chain configuration types로 파싱한다.",
  },
  {
    title: "초기 state 구성",
    desc: "alloc의 balance, nonce, code와 storage로 account·storage tries를 구성해 state root를 계산한다.",
  },
  {
    title: "genesis header 생성",
    desc: "block 0에서 활성인 hardfork rules를 조회해 조건부 header fields를 포함한다.",
  },
  {
    title: "hash 고정·공유",
    desc: "sealed header hash를 기대값과 검증하고 network handshake, database와 all services에 같은 identity를 제공한다.",
  },
] as const;
