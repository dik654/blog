export interface EngineMethod {
  id: string;
  name: string;
  direction: string;
  role: string;
  details: string;
  color: string;
}

export const ENGINE_METHODS: EngineMethod[] = [
  {
    id: 'fcu',
    name: 'forkchoice_updated',
    direction: 'CL → EL',
    role: 'Head 지정 + 블록 빌드 요청',
    details:
      'CL이 fork choice를 결정한 후 EL에 통보한다. headBlockHash, safeBlockHash, finalizedBlockHash 세 해시를 전달. ' +
      'payloadAttributes가 포함되면 새 블록 빌드를 시작하라는 신호. 포함되지 않으면 head 갱신만.',
    color: '#6366f1',
  },
  {
    id: 'new-payload',
    name: 'new_payload',
    direction: 'CL → EL',
    role: '블록 유효성 검증',
    details:
      'CL이 수신한 블록의 ExecutionPayload를 EL에 전달하여 검증을 요청한다. ' +
      'EL은 revm으로 모든 TX를 실행하고, state root가 일치하는지 확인. VALID/INVALID/SYNCING 중 하나를 응답.',
    color: '#0ea5e9',
  },
  {
    id: 'get-payload',
    name: 'get_payload',
    direction: 'CL → EL',
    role: '빌드된 블록 수신',
    details:
      'FCU에서 요청한 블록 빌드가 완료되면, CL이 결과를 가져간다. ' +
      'ExecutionPayload(블록 바디) + blockValue(가스 수수료 합계)를 포함. MEV 입찰과 비교하여 더 높은 것을 선택.',
    color: '#10b981',
  },
];
