export const steps = [
  {
    phase: '1. 슬롯 시작',
    actor: 'CL',
    detail: '12초 주기로 슬롯이 시작되면 CL이 블록 제안자를 결정합니다.',
  },
  {
    phase: '2. 페이로드 요청',
    actor: 'CL → EL',
    detail: 'engine_forkchoiceUpdated + PayloadAttributes로 EL에 블록 빌딩을 요청합니다.',
  },
  {
    phase: '3. 트랜잭션 실행',
    actor: 'EL',
    detail: 'PayloadBuilder가 풀에서 트랜잭션을 선별, EVM으로 실행, 상태 루트를 병렬 계산합니다.',
  },
  {
    phase: '4. 페이로드 수신',
    actor: 'CL ← EL',
    detail: 'engine_getPayload로 실행 페이로드 + BlobsBundle을 수신합니다.',
  },
  {
    phase: '5. 블록 조립 & 서명',
    actor: 'CL + VC',
    detail: '비콘 블록에 실행 페이로드를 포함하고, 검증자가 BLS 서명합니다.',
  },
  {
    phase: '6. P2P 전파',
    actor: 'Network',
    detail: 'gossipsub으로 블록과 블롭을 네트워크에 전파합니다.',
  },
  {
    phase: '7. 검증 & Import',
    actor: 'CL → EL',
    detail: 'engine_newPayload로 다른 노드들이 블록을 검증합니다. EL이 VALID를 반환하면 import.',
  },
  {
    phase: '8. 어테스테이션',
    actor: 'CL',
    detail: '검증자 위원회가 블록에 투표하고, 포크 초이스 가중치가 업데이트됩니다.',
  },
  {
    phase: '9. 확정 (Finality)',
    actor: 'CL',
    detail: '2 에폭(~12.8분) 후 Casper FFG에 의해 블록이 확정됩니다.',
  },
];
