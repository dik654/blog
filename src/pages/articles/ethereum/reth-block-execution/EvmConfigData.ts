export interface EnvField {
  field: string;
  source: string;
  desc: string;
}

export const BLOCK_ENV_FIELDS: EnvField[] = [
  { field: 'number', source: 'header.number', desc: '블록 번호. BLOCKNUMBER 옵코드가 반환하는 값.' },
  { field: 'coinbase', source: 'header.beneficiary', desc: '수수료 수취인 주소. COINBASE 옵코드가 반환.' },
  { field: 'timestamp', source: 'header.timestamp', desc: '블록 타임스탬프. TIMESTAMP 옵코드가 반환.' },
  { field: 'basefee', source: 'header.base_fee_per_gas', desc: 'EIP-1559 기본 수수료. BASEFEE 옵코드.' },
  { field: 'prevrandao', source: 'header.mix_hash', desc: 'PoS 이후 RANDAO 난수값. PREVRANDAO 옵코드.' },
];

export const TX_ENV_FIELDS: EnvField[] = [
  { field: 'caller', source: 'ecrecover(sender)', desc: '서명자 주소. SendersStage가 복구한 값.' },
  { field: 'gas_limit', source: 'tx.gas_limit()', desc: 'TX가 사용할 최대 가스.' },
  { field: 'value', source: 'tx.value()', desc: '전송할 ETH 양 (wei).' },
  { field: 'data', source: 'tx.input()', desc: '컨트랙트 호출 데이터 (calldata).' },
  { field: 'nonce', source: 'tx.nonce()', desc: '재사용 방지 넌스. 순서 보장에도 사용.' },
];
