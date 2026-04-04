export interface ChainSpecField {
  id: string;
  label: string;
  type: string;
  role: string;
  detail: string;
  color: string;
}

export const CHAINSPEC_FIELDS: ChainSpecField[] = [
  {
    id: 'chain',
    label: 'chain',
    type: 'Chain',
    role: '체인 식별자',
    detail: 'Mainnet(1), Sepolia(11155111), 또는 커스텀 ID. ' +
      '피어 연결 시 chain_id가 다르면 핸드셰이크를 거부한다.',
    color: '#6366f1',
  },
  {
    id: 'genesis',
    label: 'genesis + genesis_header',
    type: 'Genesis / Header',
    role: '블록 0의 상태와 헤더',
    detail: 'alloc 필드에 초기 잔액이 정의되고, state_root를 계산하여 헤더에 포함. ' +
      'genesis_hash가 불일치하면 피어와 동기화 불가.',
    color: '#10b981',
  },
  {
    id: 'hardforks',
    label: 'hardforks',
    type: 'ChainHardforks',
    role: '하드포크 활성화 조건 맵',
    detail: 'BTreeMap<EthereumHardfork, ForkCondition>으로 관리. ' +
      '키가 정렬되어 하드포크 순서가 자연스럽게 유지된다.',
    color: '#f59e0b',
  },
  {
    id: 'params',
    label: 'base_fee_params / blob_gas',
    type: 'BaseFeeParams / BlobParams',
    role: 'EIP-1559 / EIP-4844 매개변수',
    detail: 'base_fee의 변화율(elasticity, max_change_denominator)과 ' +
      'blob gas 한도를 정의. L2는 이 값을 달리 설정하여 수수료 모델을 조정한다.',
    color: '#8b5cf6',
  },
];
