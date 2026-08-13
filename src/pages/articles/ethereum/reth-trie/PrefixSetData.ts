export const PREFIX_OPERATIONS = [
  {
    name: "insert(key)",
    phase: "collect",
    desc: "Execution history의 changed hashed key를 해당 account 또는 storage scope에 추가하고 중복을 제거한다.",
    color: "#6366f1",
  },
  {
    name: "contains(prefix)",
    phase: "walk",
    desc: "ordered range에서 prefix 아래 changed key가 있는지 확인해 subtree 재계산 여부를 결정한다.",
    color: "#f59e0b",
  },
  {
    name: "freeze()",
    phase: "read",
    desc: "변경 수집이 끝난 representation을 반복적인 immutable prefix query에 맞게 고정한다.",
    color: "#10b981",
  },
] as const;
