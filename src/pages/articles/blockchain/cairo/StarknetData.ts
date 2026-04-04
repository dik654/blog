export const CONTRACT_CODE = `// Starknet 컨트랙트 컴파일 특화 처리
// starknet-compile 바이너리 사용

// 1. 플러그인 시스템 초기화
pub fn starknet_plugin_suite() -> PluginSuite {
  let mut suite = PluginSuite::default();
  suite
    .add_plugin::<plugin::StarknetPlugin>()
    .add_plugin::<StorageInterfacesPlugin>()
    .add_inline_macro_plugin::<SelectorMacro>()
    .add_analyzer_plugin::<ABIAnalyzer>()
    .add_analyzer_plugin::<StorageAnalyzer>();
  suite
}

// 2. 컨트랙트 발견 & 검증
pub struct ContractDeclaration<'db> {
  pub submodule_id: SubmoduleId<'db>,  // #[starknet::contract] 모듈
}`;

export const CONTRACT_ANNOTATIONS = [
  { lines: [5, 13] as [number, number], color: 'sky' as const, note: '플러그인 스위트: Starknet 속성 + 스토리지 + ABI' },
  { lines: [17, 19] as [number, number], color: 'emerald' as const, note: '#[starknet::contract] 모듈 발견' },
];

export const ABI_CODE = `// ABI 생성 & 컨트랙트 클래스
pub struct AbiBuilder<'db> {
  abi_items: OrderedHashSet<Item>,     // ABI 항목들
  entry_points: HashMap<String, EntryPointInfo<'db>>,
  ctor: Option<EntryPointInfo<'db>>,   // 생성자
}
// ABI 항목 유형: Functions, Constructor, L1Handler,
//               Events, Structs, Enums, Interfaces, Impls

// 최종 Sierra 컨트랙트 클래스
pub struct ContractClass {
  pub sierra_program: Vec<BigUintAsHex>,    // 컴파일된 Sierra
  pub entry_points_by_type: ContractEntryPoints, // 엔트리 포인트
  pub abi: Option<Contract>,                // ABI 정보
}

// 클래스 해시 = poseidon(version, entry_points, abi, sierra_program)
pub fn compute_class_hash(contract_class: &ContractClass) -> Result<Felt252> {
  let abi_hash = compute_abi_hash(&contract_class.abi)?;
  let sierra_hash = compute_sierra_program_hash(&contract_class.sierra_program);
  poseidon_hash_many(&[VERSION, entry_points_hash, abi_hash, sierra_hash])
}`;

export const ABI_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: 'ABI 빌더: 엔트리 포인트 + 이벤트 수집' },
  { lines: [11, 15] as [number, number], color: 'emerald' as const, note: 'ContractClass: Sierra + ABI + 엔트리포인트' },
  { lines: [18, 22] as [number, number], color: 'amber' as const, note: 'Poseidon 해시로 클래스 해시 계산' },
];
