import type { CodeRef } from '@/components/code/types';
import engineRaw from './codebase/prysm/beacon-chain/execution/engine_client.go?raw';

export const engineCodeRefs: Record<string, CodeRef> = {
  'engine-new-payload': {
    path: 'execution/engine_client.go — NewPayload()',
    lang: 'go',
    code: engineRaw,
    highlight: [3, 25],
    desc: 'NewPayload — 실행 페이로드를 EL에 전송하여 검증 요청',
    annotations: [
      { lines: [10, 10], color: 'sky', note: 'Deneb: versionedHashes + parentBlockRoot 포함' },
      { lines: [12, 12], color: 'emerald', note: 'JSON-RPC: engine_newPayloadV3 호출' },
      { lines: [16, 22], color: 'amber', note: 'VALID/INVALID/SYNCING 상태 분기 처리' },
    ],
  },
  'engine-forkchoice': {
    path: 'execution/engine_client.go — ForkchoiceUpdated()',
    lang: 'go',
    code: engineRaw,
    highlight: [27, 43],
    desc: 'ForkchoiceUpdated — head/safe/finalized 블록을 EL에 통보',
    annotations: [
      { lines: [31, 31], color: 'sky', note: 'ForkchoiceState: head, safe, finalized 해시' },
      { lines: [35, 35], color: 'emerald', note: 'engine_forkchoiceUpdatedV3 JSON-RPC 호출' },
      { lines: [41, 41], color: 'amber', note: 'payloadID → EL이 블록 빌드 시작' },
    ],
  },
};
