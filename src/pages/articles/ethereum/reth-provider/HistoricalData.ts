export const HISTORY_STEPS = [
  {
    title: "target state view 고정",
    desc: "block hash·number와 canonical requirement를 확인해 어느 시점의 account·storage를 묻는지 명확히 한다.",
    color: "#6366f1",
  },
  {
    title: "history availability 확인",
    desc: "node mode와 pruning checkpoint가 target에 필요한 index와 changesets를 보존하는지 확인한다.",
    color: "#ef4444",
  },
  {
    title: "layout별 index route 조회",
    desc: "V1 MDBX 또는 V2 RocksDB history index에서 target 이후 해당 key가 변경된 위치를 찾는다.",
    color: "#0ea5e9",
  },
  {
    title: "changeset source에서 이전 값을 복원",
    desc: "V1 table 또는 V2 static-file changesets를 사용해 target state를 구성한다.",
    color: "#10b981",
  },
] as const;
