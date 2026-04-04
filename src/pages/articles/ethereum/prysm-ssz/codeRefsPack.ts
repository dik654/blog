import type { CodeRef } from '@/components/code/types';
import htrRaw from './codebase/prysm/encoding/ssz/htrutils.go?raw';

export const packCodeRefs: Record<string, CodeRef> = {
  'ssz-pack': {
    path: 'encoding/ssz/htrutils.go — PackByChunk()',
    lang: 'go',
    code: htrRaw,
    highlight: [3, 18],
    desc: 'PackByChunk — 바이트 슬라이스를 32바이트 청크로 패딩하여 머클 리프 준비',
    annotations: [
      { lines: [5, 5], color: 'sky', note: '빈 입력 → 빈 청크 1개 반환' },
      { lines: [10, 15], color: 'emerald', note: '각 아이템을 32바이트 경계에 맞춰 패킹' },
    ],
  },
  'ssz-merkleize': {
    path: 'encoding/ssz/htrutils.go — BitwiseMerkleize()',
    lang: 'go',
    code: htrRaw,
    highlight: [20, 41],
    desc: 'BitwiseMerkleize — 청크 배열을 바이너리 머클 트리로 해시',
    annotations: [
      { lines: [25, 25], color: 'sky', note: 'depth 계산: 2의 거듭제곱으로 올림' },
      { lines: [29, 37], color: 'emerald', note: '상향식 해시: 인접 쌍을 SHA256으로 결합' },
      { lines: [33, 33], color: 'amber', note: '빈 자리는 zeroHash(d)로 패딩' },
    ],
  },
};
