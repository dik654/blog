export const TABLE_GROUPS = [
  {
    title: "Domain schema",
    color: "#0ea5e9",
    items: [
      {
        name: "BlockReader",
        detail:
          "header·body·canonical mapping처럼 block-oriented capability를 표현한다.",
      },
      {
        name: "StateProvider",
        detail:
          "account, bytecode, storage lookup을 physical backend에서 분리한다.",
      },
      {
        name: "History providers",
        detail:
          "block context와 pruning availability를 포함한 historical query를 표현한다.",
      },
    ],
  },
  {
    title: "Storage V1 schema",
    color: "#f59e0b",
    items: [
      {
        name: "typed MDBX tables",
        detail: "Table trait이 key·value codec과 cursor contract를 묶는다.",
      },
      {
        name: "DupSort tables",
        detail:
          "동일 primary key 아래 정렬된 subkeys가 필요한 V1 layout에서 사용한다.",
      },
      {
        name: "plain state·history",
        detail: "legacy V1의 physical table 집합이며 V2의 보편 경로가 아니다.",
      },
    ],
  },
  {
    title: "Storage V2 routing",
    color: "#10b981",
    items: [
      {
        name: "RocksDB indexes",
        detail: "history indices와 transaction-hash lookups를 담당한다.",
      },
      {
        name: "static-file changesets",
        detail:
          "account·storage changesets의 ordered immutable history를 담당한다.",
      },
      {
        name: "persisted settings",
        detail:
          "provider가 initialized data directory의 mode와 segment availability를 따른다.",
      },
    ],
  },
] as const;

export const SCHEMA_RULES = [
  {
    question: "typed table이 backend 고정을 뜻하는가?",
    answer:
      "아니다. typed key·value contract는 안전한 access를 제공하지만 Storage V2는 같은 domain query를 RocksDB나 static files로 route할 수 있다.",
  },
  {
    question: "table 이름을 RPC 코드에서 직접 사용해도 되는가?",
    answer:
      "physical layout에 결합되므로 provider capability를 사용하는 편이 안전하다. migration과 pruning은 provider에서 availability로 드러나야 한다.",
  },
  {
    question: "새 데이터 종류는 어디에 추가하는가?",
    answer:
      "먼저 domain query와 retention 특성을 정의하고, 그다음 storage version별 route와 codec을 연결한다. 한 backend의 편의만 보고 schema를 정하지 않는다.",
  },
] as const;
