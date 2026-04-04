export interface RelayEndpoint {
  id: string;
  name: string;
  method: string;
  endpoint: string;
  desc: string;
  timing: string;
  color: string;
}

export const RELAY_ENDPOINTS: RelayEndpoint[] = [
  {
    id: 'register',
    name: 'register_validator',
    method: 'POST',
    endpoint: '/eth/v1/builder/validators',
    desc: '검증자를 릴레이에 등록한다. fee_recipient(수수료 수취 주소)와 gas_limit을 포함. 매 에폭마다 갱신하여 설정 변경을 반영.',
    timing: '매 에폭 (6.4분)',
    color: '#6366f1',
  },
  {
    id: 'get-header',
    name: 'get_header',
    method: 'GET',
    endpoint: '/eth/v1/builder/header/{slot}/{parent}/{pubkey}',
    desc: '특정 슬롯에 대한 최적 빌더 입찰을 요청한다. 응답에 SignedBuilderBid(블록 헤더 + value)가 포함. Proposer는 이 value를 로컬 블록과 비교.',
    timing: '슬롯 시작 시',
    color: '#0ea5e9',
  },
  {
    id: 'get-payload',
    name: 'get_payload',
    method: 'POST',
    endpoint: '/eth/v1/builder/blinded_blocks',
    desc: '서명된 blinded block을 릴레이에 제출하면, 릴레이가 실제 ExecutionPayload(블록 바디)를 반환한다. 이 시점에 빌더의 MEV 전략이 공개.',
    timing: '블록 서명 후',
    color: '#10b981',
  },
];
