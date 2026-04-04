import type { CodeRef } from '@/components/code/types';
import muxGo from './codebase/oasis-core/go/consensus/cometbft/abci/mux.go?raw';
import fullGo from './codebase/oasis-core/go/consensus/cometbft/full/full.go?raw';

export const consensusCodeRefs: Record<string, CodeRef> = {
  'abci-mux': {
    path: 'oasis-core/go/consensus/cometbft/abci/mux.go',
    code: muxGo,
    lang: 'go',
    highlight: [84, 134],
    annotations: [
      { lines: [84, 101], color: 'sky', note: 'ApplicationServer — ABCI 앱 + 소켓 서버, Mux 래핑' },
      { lines: [126, 134], color: 'emerald', note: 'Register — Oasis 앱을 ABCI 멀티플렉서에 등록' },
    ],
    desc: 'CometBFT ABCI 멀티플렉서입니다. 여러 Oasis 내부 앱(staking, registry, governance 등)을 하나의 ABCI 인터페이스로 통합합니다.',
  },

  'abci-mux-inner': {
    path: 'oasis-core/go/consensus/cometbft/abci/mux.go',
    code: muxGo,
    lang: 'go',
    highlight: [215, 235],
    annotations: [
      { lines: [215, 226], color: 'sky', note: 'abciMux 구조체 — 앱 맵, 메서드 라우팅, 실행 순서 관리' },
      { lines: [227, 235], color: 'emerald', note: 'HaltHooks, invalidatedTxs — 업그레이드 중지 & TX 무효화 감시' },
    ],
    desc: 'ABCI 멀티플렉서의 내부 구조입니다. appsByMethod로 트랜잭션을 적절한 앱으로 라우팅하고, appsByLexOrder로 InitChain/BeginBlock/EndBlock을 순서대로 실행합니다.',
  },

  'full-service': {
    path: 'oasis-core/go/consensus/cometbft/full/full.go',
    code: fullGo,
    lang: 'go',
    highlight: [104, 160],
    annotations: [
      { lines: [104, 130], color: 'sky', note: 'fullService — CometBFT 풀 노드 구조체' },
      { lines: [133, 148], color: 'emerald', note: 'Start() — commonNode → startFn → CometBFT 노드 시작' },
    ],
    desc: 'Oasis CometBFT 풀 노드 구현입니다. P2P 서비스, 업그레이더, 블록 알림 브로커를 관리하며, syncedCh로 초기 동기화 완료를 알립니다.',
  },
};
