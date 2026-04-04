export interface DesignChoice {
  id: string;
  title: string;
  problem: string;
  solution: string;
  color: string;
}

export const DESIGN_CHOICES: DesignChoice[] = [
  {
    id: 'timing',
    title: '12초 시간 제한',
    problem: 'PoS에서 검증자가 블록 제안자로 선정되면, 12초 슬롯 안에 TX 선택 + EVM 실행 + 상태 루트 계산을 완료해야 한다. 늦으면 빈 블록으로 수수료 수익이 0이다.',
    solution: 'ForkchoiceUpdated 수신 즉시 백그라운드 빌드를 시작한다. GetPayload 호출 전까지 점진적으로 TX를 추가하여 결과를 개선한다.',
    color: '#ef4444',
  },
  {
    id: 'mev',
    title: 'MEV 경쟁',
    problem: 'MEV 빌더(Flashbots rbuilder 등)가 더 수익 높은 블록을 제안한다. 로컬 빌더가 느리거나 비효율적이면 검증자가 외부 MEV 블록을 선택한다.',
    solution: 'PayloadBuilder를 trait으로 추상화한다. 기본 구현은 tip 순 정렬이고, MEV 빌더가 trait을 구현하면 번들 최적화 블록을 생성할 수 있다.',
    color: '#f59e0b',
  },
  {
    id: 'continuous',
    title: 'continuous building',
    problem: '블록 빌드를 한 번에 완료하면, 이후 도착하는 고수익 TX를 포함할 수 없다. 12초 동안 TX 풀은 계속 변한다.',
    solution: 'PayloadBuilder는 비동기 태스크로 실행된다. GetPayload 호출 시점까지 계속 더 좋은 TX를 추가하여 block_value(수수료 합계)를 극대화한다.',
    color: '#10b981',
  },
];

export interface EngineApiFlow {
  step: string;
  caller: string;
  action: string;
}

export const ENGINE_FLOW: EngineApiFlow[] = [
  { step: '1', caller: 'CL → EL', action: 'ForkchoiceUpdated + payload_attributes 전송' },
  { step: '2', caller: 'EL 내부', action: 'canonical 체인 갱신 + 빌드 태스크 시작' },
  { step: '3', caller: 'EL 내부', action: 'TX 풀에서 best_transactions()로 TX 선택 + 실행' },
  { step: '4', caller: 'CL → EL', action: 'GetPayload(payload_id) 호출' },
  { step: '5', caller: 'EL → CL', action: 'ExecutionPayload + block_value 반환' },
];
