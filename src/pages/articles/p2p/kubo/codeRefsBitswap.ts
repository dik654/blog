import type { CodeRef } from '@/components/code/types';

import bitswapGo from './codebase/kubo/core/node/bitswap.go?raw';

export const bitswapRefs: Record<string, CodeRef> = {
  'kubo-bitswap-defaults': {
    path: 'core/node/bitswap.go',
    code: bitswapGo,
    lang: 'go',
    highlight: [32, 68],
    desc: 'Bitswap 기본 설정값과 옵션 생성 함수입니다. EngineWorker, TaskWorker, ProviderSearchDelay 등을 config에서 읽어 옵션화합니다.',
    annotations: [
      { lines: [33, 39], color: 'sky', note: '기본 상수 — 128 블록스토어 워커, 8 태스크 워커' },
      { lines: [50, 67], color: 'emerald', note: 'BitswapOptions — config → []bitswap.Option 변환' },
    ],
  },
  'kubo-bitswap-create': {
    path: 'core/node/bitswap.go',
    code: bitswapGo,
    lang: 'go',
    highlight: [84, 205],
    desc: 'Bitswap() 팩토리는 libp2p + HTTP 네트워크를 조합하여 Bitswap 인스턴스를 생성합니다. ServerEnabled=false면 클라이언트 전용(빈 블록스토어)으로 동작합니다.',
    annotations: [
      { lines: [84, 88], color: 'sky', note: 'serverEnabled, libp2pEnabled, httpEnabled 3개 플래그' },
      { lines: [92, 97], color: 'emerald', note: 'libp2p 네트워크 — bsnet.NewFromIpfsHost' },
      { lines: [99, 125], color: 'amber', note: 'HTTP 네트워크 — httpnet.New (Trustless HTTP 검색)' },
      { lines: [184, 196], color: 'violet', note: 'ProviderQueryManager + bitswap.New 최종 생성' },
    ],
  },
  'kubo-noop-exchange': {
    path: 'core/node/bitswap.go',
    code: bitswapGo,
    lang: 'go',
    highlight: [209, 243],
    desc: 'OnlineExchange는 Bitswap 비활성 시 noopExchange를 반환합니다. GetBlock이 항상 ErrNotFound를 반환하여 로컬 블록스토어만 사용합니다.',
    annotations: [
      { lines: [209, 221], color: 'sky', note: 'Bitswap 비활성 → noopExchange 반환' },
      { lines: [227, 229], color: 'emerald', note: 'GetBlock → ErrNotFound (로컬 전용)' },
    ],
  },
};
