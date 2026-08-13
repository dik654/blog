export const OVERLAY_STEPS = [
  {
    title: "1. Base view를 고정한다",
    desc: "같은 canonical checkpoint의 account·storage trie artifacts를 읽는 일관된 view를 잡는다.",
    color: "#6366f1",
  },
  {
    title: "2. Storage overlays를 먼저 처리한다",
    desc: "계정별 changed prefixes, wipe와 slot updates를 적용해 새 storage roots를 만든다.",
    color: "#f59e0b",
  },
  {
    title: "3. Account values와 paths를 갱신한다",
    desc: "새 storage root, nonce, balance와 code hash를 account leaf에 반영하고 affected ancestors를 다시 해시한다.",
    color: "#10b981",
  },
  {
    title: "4. Root와 artifacts를 반환한다",
    desc: "계산 root를 header commitment와 비교하고 성공한 canonical 범위의 trie updates만 영속화한다.",
    color: "#8b5cf6",
  },
] as const;
export const STATE_ROOT_FIELDS = [
  {
    name: "base view",
    desc: "기존 trie nodes와 hashes를 같은 canonical checkpoint에서 읽는 provider view.",
  },
  {
    name: "account prefixes",
    desc: "새 account value나 삭제가 영향을 주는 hashed-address paths.",
  },
  {
    name: "storage prefixes",
    desc: "account별 slot update와 wipe가 영향을 주는 hashed-slot paths.",
  },
  {
    name: "hashed overlay",
    desc: "Execution post-state를 trie key space와 deletion semantics로 정규화한 변경 집합.",
  },
] as const;
