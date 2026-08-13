export const TRIE_CHALLENGES = [
  {
    title: "전체 state와 변경 집합을 구분한다",
    desc: "root는 전체 state를 commit하지만 계산 입력은 이번 범위의 changes와 기존 trie artifacts를 함께 사용할 수 있다.",
    color: "#ef4444",
  },
  {
    title: "prefix는 탐색 힌트이지 증명이 아니다",
    desc: "PrefixSet은 affected subtree를 찾는다. 최종 correctness는 Ethereum trie encoding으로 계산한 root와 header commitment의 비교가 보장한다.",
    color: "#f59e0b",
  },
  {
    title: "재사용과 영속화를 분리한다",
    desc: "unaffected hashes를 읽어 root 계산에 재사용하는 것과 새 trie artifacts를 canonical storage에 기록하는 것은 서로 다른 단계다.",
    color: "#10b981",
  },
] as const;
