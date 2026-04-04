import type { CodeRef } from '@/components/code/types';

import serviceGo from './codebase/beacon-kit/beacon/blockchain/service.go?raw';
import processProposalGo from './codebase/beacon-kit/beacon/blockchain/process_proposal.go?raw';
import finalizeBlockGo from './codebase/beacon-kit/beacon/blockchain/finalize_block.go?raw';
import stateProcessorGo from './codebase/beacon-kit/state-transition/core/state_processor.go?raw';
import blockBuilderGo from './codebase/beacon-kit/beacon/validator/block_builder.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'bk-service': {
    path: 'beacon-kit/beacon/blockchain/service.go',
    code: serviceGo,
    lang: 'go',
    highlight: [36, 72],
    desc: 'Service는 BeaconKit 블록체인 서비스의 핵심입니다. StorageBackend, ExecutionEngine, StateProcessor 등을 조합하여 ABCI 요청을 처리합니다.',
    annotations: [
      { lines: [36, 46], color: 'sky', note: 'Service 구조체 — storageBackend + blobProcessor + depositContract' },
      { lines: [52, 63], color: 'emerald', note: 'executionEngine + stateProcessor + localBuilder' },
      { lines: [68, 72], color: 'amber', note: 'latestFcuReq — 최적화: 중복 FCU 방지' },
    ],
  },

  'bk-process-proposal': {
    path: 'beacon-kit/beacon/blockchain/process_proposal.go',
    code: processProposalGo,
    lang: 'go',
    highlight: [63, 100],
    desc: 'ProcessProposal은 CometBFT의 ABCI ProcessProposal 콜백입니다. 비콘 블록 디코딩, 서명 검증, 포크 버전 확인, 블록 검증을 수행합니다.',
    annotations: [
      { lines: [63, 73], color: 'sky', note: 'ProcessProposal — 블록 + 사이드카 디코딩' },
      { lines: [93, 100], color: 'emerald', note: '포크 버전 검증 — CometBFT 타임스탬프 vs 블록 타임스탬프' },
      { lines: [118, 130], color: 'amber', note: '블록 서명 검증 + 사이드카 서명 일치 확인' },
      { lines: [160, 181], color: 'violet', note: 'VerifyIncomingBlock + 검증된 페이로드 캐싱' },
    ],
  },

  'bk-finalize-block': {
    path: 'beacon-kit/beacon/blockchain/finalize_block.go',
    code: finalizeBlockGo,
    lang: 'go',
    highlight: [39, 84],
    desc: 'FinalizeBlock은 CometBFT의 ABCI FinalizeBlock 콜백입니다. 블록 디코딩 → 사이드카 확정 → 비콘 블록 확정 → 후처리 4단계로 진행됩니다.',
    annotations: [
      { lines: [39, 49], color: 'sky', note: 'FinalizeBlock — STEP 1: 블록+블롭 디코딩' },
      { lines: [53, 65], color: 'emerald', note: 'STEP 1.5: 시작 시 EL 강제 동기화 (1회성)' },
      { lines: [67, 70], color: 'amber', note: 'STEP 2: 사이드카 확정 (DA 기간 내)' },
      { lines: [72, 84], color: 'violet', note: 'STEP 3-4: 비콘 블록 확정 + 후처리' },
    ],
  },

  'bk-state-processor': {
    path: 'beacon-kit/state-transition/core/state_processor.go',
    code: stateProcessorGo,
    lang: 'go',
    highlight: [42, 82],
    desc: 'StateProcessor는 비콘 체인 상태 전이의 핵심입니다. 슬롯 처리, 에포크 경계, 포크 전환, 블록 처리를 순차적으로 수행합니다.',
    annotations: [
      { lines: [42, 61], color: 'sky', note: 'StateProcessor 구조체 — logger + chainSpec + signer + executionEngine' },
      { lines: [85, 119], color: 'emerald', note: 'Transition — ProcessSlots → ProcessFork → ProcessBlock' },
      { lines: [134, 169], color: 'amber', note: 'ProcessSlots — 슬롯 처리 + 에포크 경계 (missed slot 불허)' },
      { lines: [173, 199], color: 'violet', note: 'processSlot — 이전 상태 루트 계산 + 블록 헤더 업데이트' },
    ],
  },

  'bk-block-builder': {
    path: 'beacon-kit/beacon/validator/block_builder.go',
    code: blockBuilderGo,
    lang: 'go',
    highlight: [47, 100],
    desc: 'BuildBlockAndSidecars는 새 비콘 블록을 생성합니다. 실행 페이로드를 검색(또는 낙관적으로 가져오고), 서명하여 비콘 블록과 블롭 사이드카를 조립합니다.',
    annotations: [
      { lines: [47, 57], color: 'sky', note: 'BuildBlockAndSidecars — 페이로드 빌더 활성화 확인' },
      { lines: [59, 83], color: 'emerald', note: '슬롯 처리 + 부모 블록 루트 조회' },
      { lines: [83, 87], color: 'amber', note: 'retrieveExecutionPayload — 실행 페이로드 획득' },
      { lines: [93, 100], color: 'violet', note: '포크 데이터 빌드 + 서명' },
    ],
  },
};
