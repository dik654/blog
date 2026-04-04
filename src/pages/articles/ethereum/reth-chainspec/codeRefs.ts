import type { CodeRef } from '@/components/code/types';
import chainspecSrc from './codebase/reth/chainspec.rs?raw';
import genesisSrc from './codebase/reth/genesis.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'chainspec-struct': {
    path: 'crates/chainspec/src/spec.rs', lang: 'rust', highlight: [3, 15],
    desc: 'ChainSpec — chain_id, genesis, hardforks를 하나로 묶는 핵심 구조체',
    annotations: [
      { lines: [5, 7], color: 'sky', note: 'chain + genesis_header + genesis' },
      { lines: [10, 10], color: 'emerald', note: 'ChainHardforks — BTreeMap 기반 하드포크' },
      { lines: [12, 13], color: 'amber', note: 'EIP-1559 + EIP-4844 파라미터' },
    ],
    code: chainspecSrc,
  },
  'fork-condition': {
    path: 'crates/ethereum-forks/src/hardfork.rs', lang: 'rust',
    highlight: [19, 29],
    desc: 'ForkCondition — Block/TTD/Timestamp 세 가지 활성화 조건',
    annotations: [
      { lines: [21, 21], color: 'sky', note: 'Block — 블록 번호 (Frontier~Istanbul)' },
      { lines: [22, 25], color: 'amber', note: 'TTD — 누적 난이도 (The Merge)' },
      { lines: [26, 26], color: 'emerald', note: 'Timestamp — (Shanghai~)' },
    ],
    code: chainspecSrc,
  },
  'eth-chainspec-trait': {
    path: 'crates/chainspec/src/api.rs', lang: 'rust', highlight: [33, 43],
    desc: 'EthChainSpec trait — 모든 체인 설정의 공통 인터페이스',
    annotations: [
      { lines: [36, 37], color: 'sky', note: 'chain() + chain_id() — 체인 식별' },
      { lines: [38, 38], color: 'emerald', note: 'base_fee_params — EIP-1559' },
      { lines: [40, 42], color: 'violet', note: 'genesis 관련 메서드들' },
    ],
    code: chainspecSrc,
  },
  'mainnet-spec': {
    path: 'crates/chainspec/src/spec.rs', lang: 'rust', highlight: [3, 27],
    desc: 'MAINNET — LazyLock으로 초기화되는 메인넷 ChainSpec',
    annotations: [
      { lines: [5, 7], color: 'sky', note: 'include_str! — 컴파일 타임에 json 임베딩' },
      { lines: [16, 19], color: 'amber', note: 'The Merge 블록 + 최종 TTD' },
      { lines: [22, 24], color: 'emerald', note: 'EIP-1559 기본 파라미터' },
    ],
    code: genesisSrc,
  },
  'make-genesis': {
    path: 'crates/chainspec/src/spec.rs', lang: 'rust', highlight: [30, 50],
    desc: 'make_genesis_header — 하드포크별 조건부 필드를 설정하여 헤더 생성',
    annotations: [
      { lines: [35, 38], color: 'sky', note: 'London 활성 → base_fee 초기값' },
      { lines: [40, 43], color: 'emerald', note: 'Shanghai 활성 → withdrawals root' },
      { lines: [46, 46], color: 'amber', note: 'state_root — alloc에서 계산' },
    ],
    code: genesisSrc,
  },
};
