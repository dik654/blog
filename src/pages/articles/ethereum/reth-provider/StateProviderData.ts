export const TRAIT_METHODS = [
  {
    name: "basic_account(address)",
    returns: "Option<Account>",
    desc: "nonce, balance와 code hash 같은 account metadata를 선택한 state view에서 읽는다.",
  },
  {
    name: "storage(address, key)",
    returns: "Option<StorageValue>",
    desc: "같은 state view의 contract storage slot을 읽고 absent value semantics를 adapter에서 맞춘다.",
  },
  {
    name: "bytecode_by_hash(hash)",
    returns: "Option<Bytecode>",
    desc: "account metadata와 분리된 bytecode lookup capability를 제공한다.",
  },
  {
    name: "block_hash(number)",
    returns: "Option<B256>",
    desc: "EVM BLOCKHASH와 실행 문맥에 필요한 canonical block hash를 availability 범위 안에서 읽는다.",
  },
] as const;

export const IMPLEMENTORS = [
  {
    name: "latest provider",
    desc: "persisted canonical state snapshot",
    color: "#10b981",
  },
  {
    name: "overlay provider",
    desc: "BundleState를 base provider 위에 합성",
    color: "#f59e0b",
  },
  {
    name: "historical provider",
    desc: "target block과 history availability를 고정",
    color: "#6366f1",
  },
  {
    name: "test provider",
    desc: "필요 capability만 deterministic fixture로 제공",
    color: "#6b7280",
  },
] as const;
