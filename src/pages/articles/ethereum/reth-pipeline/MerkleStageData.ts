export interface MerkleStep {
  title: string;
  desc: string;
}
export const MERKLE_STEPS: readonly MerkleStep[] = [
  {
    title: "변경 범위를 수집한다",
    desc: "Execution checkpoint 이후의 account·storage changes를 hashed keys와 prefix sets로 바꾼다.",
  },
  {
    title: "영향받은 trie path를 갱신한다",
    desc: "변경 경로는 다시 계산하고 unrelated subtree의 기존 hash와 node는 재사용한다.",
  },
  {
    title: "header state_root와 대조한다",
    desc: "일치한 경우에만 trie artifacts와 Stage checkpoint를 같은 canonical 진행 위치로 옮긴다.",
  },
] as const;
