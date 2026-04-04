export const C = { range: '#6366f1', sig: '#f59e0b', recover: '#10b981', db: '#8b5cf6' };

export const STEPS = [
  {
    label: 'input.next_block_range()',
    body: 'BodiesStage 체크포인트 기준으로 sender를 복구할 TX 범위를 결정합니다.',
  },
  {
    label: 'DB에서 TX 서명(v,r,s) 로드',
    body: 'Transactions 테이블에서 ECDSA 서명을 읽으며, sender 주소는 아직 없는 상태입니다.',
  },
  {
    label: 'rayon par_iter → ecrecover',
    body: '(v,r,s) + tx_hash에서 secp256k1 복구로 sender 주소를 rayon 병렬 추출합니다.',
  },
  {
    label: 'provider.insert_senders()',
    body: '복구된 sender 주소를 TxSenders 테이블에 저장하여 ExecutionStage가 사용합니다.',
  },
];
