export const PROVIDER_CONTEXTS = [
  {
    title: "latest canonical",
    desc: "현재 canonical head의 persisted state와 가까운 in-memory execution 결과를 조합한다.",
    color: "#10b981",
  },
  {
    title: "pending / overlay",
    desc: "아직 persistence되지 않은 BundleState 변경을 base state 위에 덮어 읽는다.",
    color: "#f59e0b",
  },
  {
    title: "historical",
    desc: "목표 block, history availability와 pruning을 확인한 뒤 layout별 index·changeset route를 사용한다.",
    color: "#6366f1",
  },
  {
    title: "block data",
    desc: "header·body·receipt처럼 state가 아닌 data는 별도의 reader capability와 static segments를 사용할 수 있다.",
    color: "#0ea5e9",
  },
] as const;
