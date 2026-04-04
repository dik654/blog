export interface EngineStep {
  method: string;
  direction: string;
  payload: string;
  detail: string;
  color: string;
}

export const ENGINE_STEPS: EngineStep[] = [
  {
    method: 'engine_forkchoiceUpdatedV3',
    direction: 'CL → EL',
    payload: 'ForkchoiceState + PayloadAttributes',
    detail: 'head/safe/finalized 해시로 canonical 체인을 갱신한다. PayloadAttributes가 있으면 새 블록 빌드를 시작한다. payload_id를 반환하여 나중에 결과를 조회할 수 있게 한다.',
    color: '#6366f1',
  },
  {
    method: 'engine_getPayloadV3',
    direction: 'CL → EL',
    payload: 'payload_id',
    detail: '이전에 시작된 빌드 작업의 결과를 요청한다. EL은 현재까지 조립된 최적 블록을 반환한다. ExecutionPayload + BlobsBundle + block_value(수수료 합계)로 구성된다.',
    color: '#0ea5e9',
  },
  {
    method: 'engine_newPayloadV3',
    direction: 'CL → EL',
    payload: 'ExecutionPayload + expectedBlobVersionedHashes',
    detail: '다른 검증자가 제안한 블록을 검증한다. EL이 블록을 실행하고 상태 루트가 일치하는지 확인한다. VALID/INVALID/SYNCING 상태를 반환한다.',
    color: '#10b981',
  },
];

export interface TraitDesign {
  question: string;
  answer: string;
}

export const TRAIT_DESIGNS: TraitDesign[] = [
  {
    question: 'PayloadBuilder trait이 분리된 이유?',
    answer: 'MEV 빌더(rbuilder, mev-boost)가 자체 블록 조립 로직을 주입할 수 있어야 한다. trait으로 추상화하면 기본 구현을 교체하거나 래핑할 수 있다.',
  },
  {
    question: 'payload_id는 어떻게 생성되는가?',
    answer: 'ForkchoiceUpdated의 head_hash + payload_attributes(timestamp, prevRandao, suggestedFeeRecipient)를 해시하여 고유 ID를 생성한다. 같은 입력이면 같은 ID가 나온다.',
  },
  {
    question: 'continuous building의 구현 방식?',
    answer: 'tokio::spawn으로 비동기 태스크를 시작한다. TX 풀 변경 알림(notify_listeners)을 받아 새 TX를 추가하고, Arc<Mutex<BuiltPayload>>로 최신 결과를 공유한다.',
  },
];
