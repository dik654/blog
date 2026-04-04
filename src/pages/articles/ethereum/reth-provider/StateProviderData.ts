export const TRAIT_METHODS = [
  {
    name: 'account(address)',
    returns: 'Option<Account>',
    desc: '주소로 계정 정보를 조회한다. nonce, balance, code_hash가 포함된다. None이면 해당 주소에 계정이 없다는 뜻이다.',
    table: 'PlainAccountState',
  },
  {
    name: 'storage(address, key)',
    returns: 'Option<StorageValue>',
    desc: '(주소, 슬롯 키) 쌍으로 스토리지 값을 조회한다. ERC-20 잔액, 매핑 데이터 등이 여기에 저장된다.',
    table: 'PlainStorageState',
  },
  {
    name: 'bytecode_by_hash(hash)',
    returns: 'Option<Bytecode>',
    desc: 'code_hash로 컨트랙트 바이트코드를 조회한다. 동일 코드를 배포한 여러 계정이 같은 해시를 공유하므로 중복 저장을 피할 수 있다.',
    table: 'Bytecodes',
  },
];

export const IMPLEMENTORS = [
  { name: 'LatestStateProviderRef', desc: 'MDBX tx + StaticFile로 최신 확정 상태를 제공', color: '#10b981' },
  { name: 'HistoricalStateProvider', desc: 'ChangeSet 역추적으로 과거 시점 상태 복원', color: '#6366f1' },
  { name: 'BundleStateProvider', desc: '메모리 캐시 + DB 폴백으로 실행 중 상태 제공', color: '#f59e0b' },
  { name: 'MockStateProvider', desc: '테스트용 — HashMap으로 상태를 직접 주입', color: '#6b7280' },
];
