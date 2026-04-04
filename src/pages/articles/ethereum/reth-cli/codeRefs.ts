import type { CodeRef } from '@/components/code/types';
import mainSrc from './codebase/reth/main.rs?raw';
import builderSrc from './codebase/reth/builder.rs?raw';
import statesSrc from './codebase/reth/states.rs?raw';
import componentsSrc from './codebase/reth/components.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'cli-main': {
    path: 'bin/reth/src/main.rs', lang: 'rust', highlight: [7, 22],
    desc: 'reth 진입점 — Cli::parse() → builder.node() → launch',
    annotations: [
      { lines: [8, 8], color: 'sky', note: 'SIGSEGV 핸들러 설치' },
      { lines: [10, 11], color: 'emerald', note: 'clap 파싱 → run 콜백' },
      { lines: [14, 14], color: 'amber', note: 'EthereumNode::default()로 한 번에' },
      { lines: [19, 19], color: 'violet', note: 'tokio에서 노드 종료 대기' },
    ],
    code: mainSrc,
  },
  'builder-struct': {
    path: 'crates/node/builder/src/builder/mod.rs', lang: 'rust',
    highlight: [3, 8],
    desc: 'NodeBuilder — DB·ChainSpec 제네릭으로 타입 추적',
    annotations: [
      { lines: [5, 7], color: 'sky', note: 'config + database + rocksdb' },
    ],
    code: builderSrc,
  },
  'builder-node': {
    path: 'crates/node/builder/src/builder/mod.rs', lang: 'rust',
    highlight: [16, 32],
    desc: 'node() — with_types + with_components + add_ons를 한 번에',
    annotations: [
      { lines: [17, 22], color: 'emerald', note: '반환 타입에 CB·AO 제네릭 포함' },
      { lines: [27, 30], color: 'amber', note: '3단계 체이닝으로 상태 전이' },
    ],
    code: builderSrc,
  },
  'builder-states': {
    path: 'crates/node/builder/src/builder/states.rs', lang: 'rust',
    highlight: [3, 28],
    desc: 'NodeBuilderWithTypes → with_components → WithComponents 전이',
    annotations: [
      { lines: [4, 7], color: 'sky', note: '타입 확정, 컴포넌트 미설정' },
      { lines: [11, 18], color: 'emerald', note: 'CB: NodeComponentsBuilder 제약' },
    ],
    code: statesSrc,
  },
  'builder-final': {
    path: 'crates/node/builder/src/builder/states.rs', lang: 'rust',
    highlight: [31, 38],
    desc: 'NodeBuilderWithComponents — launch() 호출 가능한 최종 상태',
    annotations: [
      { lines: [35, 35], color: 'amber', note: 'components_builder로 런타임에 빌드' },
      { lines: [36, 36], color: 'violet', note: 'ExEx·RPC·hooks 묶음' },
    ],
    code: statesSrc,
  },
  'node-components': {
    path: 'crates/node/builder/src/components/mod.rs', lang: 'rust',
    highlight: [3, 21],
    desc: 'NodeComponents trait — Pool/Evm/Consensus/Network 4종 교체',
    annotations: [
      { lines: [8, 8], color: 'sky', note: 'Pool — 멤풀 정책' },
      { lines: [10, 10], color: 'emerald', note: 'Evm — revm 설정' },
      { lines: [12, 12], color: 'amber', note: 'Consensus — 블록 검증' },
      { lines: [14, 14], color: 'violet', note: 'Network — devp2p' },
    ],
    code: componentsSrc,
  },
  'components-struct': {
    path: 'crates/node/builder/src/components/mod.rs', lang: 'rust',
    highlight: [24, 32],
    desc: 'Components struct — 4개 컴포넌트를 하나로 묶는 컨테이너',
    annotations: [
      { lines: [26, 29], color: 'rose', note: '5개 필드 — 각각 교체 가능' },
    ],
    code: componentsSrc,
  },
};
