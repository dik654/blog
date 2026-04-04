import type { CodeRef } from '@/components/code/types';
import merkleRaw from './codebase/prysm/encoding/ssz/merkleize.go?raw';

export const merkleCodeRefs: Record<string, CodeRef> = {
  'ssz-hash-tree-root': {
    path: 'encoding/ssz/merkleize.go — HashTreeRoot()',
    lang: 'go',
    code: merkleRaw,
    highlight: [26, 31],
    desc: 'HashTreeRoot — 컨테이너 필드들의 HTR을 리프로 머클라이즈',
    annotations: [
      { lines: [27, 28], color: 'sky', note: '각 필드의 HTR을 청크 배열로 복사' },
      { lines: [29, 29], color: 'emerald', note: 'Merkleize 호출: limit = 필드 수' },
    ],
  },
  'ssz-mix-in-length': {
    path: 'encoding/ssz/merkleize.go — MixInLength()',
    lang: 'go',
    code: merkleRaw,
    highlight: [16, 22],
    desc: 'MixInLength — 가변 길이 리스트의 root와 length를 해시 결합',
    annotations: [
      { lines: [18, 19], color: 'sky', note: 'length를 32바이트 청크로 변환' },
      { lines: [20, 20], color: 'emerald', note: 'H(root, lengthChunk) → 최종 해시' },
    ],
  },
};
