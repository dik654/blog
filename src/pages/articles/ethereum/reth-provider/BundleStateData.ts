export const BUNDLE_FIELDS = [
  {
    name: 'state',
    type: 'HashMap<Address, BundleAccount>',
    desc: '변경된 계정의 현재 상태를 보관한다. 키는 주소, 값은 잔액/nonce/스토리지 변경 정보를 담은 BundleAccount다.',
    color: '#10b981',
  },
  {
    name: 'reverts',
    type: 'Vec<Vec<(Address, AccountRevert)>>',
    desc: '블록별 되돌리기 정보다. reorg(체인 재구성) 발생 시 이 데이터로 상태를 이전 블록으로 롤백한다. 인덱스가 블록 순서에 대응한다.',
    color: '#ef4444',
  },
  {
    name: 'contracts',
    type: 'HashMap<B256, Bytecode>',
    desc: 'CREATE/CREATE2로 배포된 새 컨트랙트의 바이트코드다. code_hash를 키로 사용하므로 동일 코드는 한 번만 저장된다.',
    color: '#f59e0b',
  },
];

export const BUNDLE_ACCOUNT_FIELDS = [
  { name: 'info', desc: '현재 계정 정보 (nonce, balance, code_hash)' },
  { name: 'original_info', desc: '변경 전 원본 — revert 시 이 값으로 복원' },
  { name: 'storage', desc: '변경된 슬롯만 보관 — 전체 복사가 아니라 delta만 저장하므로 메모리 효율적' },
  { name: 'status', desc: 'Changed / Created / Destroyed 등 계정 상태 변화 유형' },
];
