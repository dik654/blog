import type { CodeRef } from '@/components/code/types';
import blockGo from './codebase/cometbft/types/block.go?raw';

export const blockRefs: Record<string, CodeRef> = {
  'block-struct': {
    path: 'types/block.go', code: blockGo, lang: 'go', highlight: [14, 20],
    desc: 'Block struct — Header + Data + Evidence + LastCommit',
    annotations: [
      { lines: [15, 15], color: 'sky', note: 'mtx: 동시 접근 보호용 Mutex' },
      { lines: [16, 19], color: 'emerald', note: '4개 필드: Header, Data, Evidence, LastCommit' },
    ],
  },
  'header-struct': {
    path: 'types/block.go', code: blockGo, lang: 'go', highlight: [22, 49],
    desc: 'Header — 14개 필드 (Version ~ ProposerAddress)',
    annotations: [
      { lines: [25, 28], color: 'sky', note: '기본 블록 정보: Version, ChainID, Height, Time' },
      { lines: [34, 41], color: 'emerald', note: '6개의 해시: DataHash, ValidatorsHash, AppHash 등' },
      { lines: [47, 48], color: 'amber', note: 'EvidenceHash + ProposerAddress (합의 정보)' },
    ],
  },
  'header-hash': {
    path: 'types/block.go', code: blockGo, lang: 'go', highlight: [51, 77],
    desc: 'Header.Hash() — 14개 필드 → merkle.HashFromByteSlices()',
    annotations: [
      { lines: [53, 56], color: 'sky', note: 'nil 체크 + Version.Marshal()로 첫 필드 직렬화' },
      { lines: [61, 76], color: 'emerald', note: '14개 필드를 cdcEncode 후 Merkle root 계산' },
    ],
  },
  'data-hash': {
    path: 'types/block.go', code: blockGo, lang: 'go', highlight: [79, 90],
    desc: 'Data.Hash() — TX들의 Merkle root',
    annotations: [
      { lines: [80, 82], color: 'sky', note: 'Data는 Txs []Tx 필드 하나만 가짐' },
      { lines: [85, 89], color: 'emerald', note: 'Txs.Hash()를 호출 → SHA256 + Merkle root' },
    ],
  },
  'make-partset': {
    path: 'types/block.go', code: blockGo, lang: 'go', highlight: [92, 100],
    desc: 'MakePartSet() — protobuf → 64KB Parts로 분할',
    annotations: [
      { lines: [95, 96], color: 'sky', note: 'protobuf 직렬화: cdc.MarshalBinaryLengthPrefixed' },
      { lines: [99, 99], color: 'emerald', note: 'NewPartSetFromData: 64KB 청크 + Merkle 증명' },
    ],
  },
};
