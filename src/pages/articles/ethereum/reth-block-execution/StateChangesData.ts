export interface BundleField {
  field: string;
  type_str: string;
  desc: string;
}

export const BUNDLE_FIELDS: BundleField[] = [
  {
    field: 'state',
    type_str: 'HashMap<Address, BundleAccount>',
    desc: '변경된 계정 정보. 잔액(balance), nonce, 코드 해시(code_hash), 스토리지 슬롯 변경을 저장한다.',
  },
  {
    field: 'contracts',
    type_str: 'HashMap<B256, Bytecode>',
    desc: '새로 배포된 컨트랙트. code_hash를 키로 바이트코드를 저장한다. 같은 코드가 여러 주소에 배포되면 한 번만 저장한다.',
  },
  {
    field: 'reverts',
    type_str: 'Vec<Vec<(Address, AccountRevert)>>',
    desc: '블록별 되돌리기 정보. reorg 발생 시 역순으로 적용해 이전 상태를 복원한다. Pipeline의 unwind()가 이 데이터를 사용한다.',
  },
];
