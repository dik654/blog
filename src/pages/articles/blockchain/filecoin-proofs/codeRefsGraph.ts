import type { CodeRef } from '@/components/code/types';
import graphRs from './codebase/rust-fil-proofs/storage-proofs-porep/src/stacked/vanilla/graph.rs?raw';

export const graphCodeRefs: Record<string, CodeRef> = {
  'stacked-graph': {
    path: 'storage-proofs-porep/src/stacked/vanilla/graph.rs',
    code: graphRs,
    lang: 'rust',
    highlight: [27, 61],
    annotations: [
      { lines: [27, 29], color: 'sky', note: 'EXP_DEGREE = 8, DEGREE = BASE(6) + EXP(8) = 14' },
      { lines: [31, 44], color: 'emerald', note: 'StackedGraph 구조체 — base_graph + Feistel 확장 부모' },
      { lines: [61, 61], color: 'amber', note: 'StackedBucketGraph 타입 별칭 — BucketGraph 기반 DRG' },
    ],
    desc: 'SDR의 핵심 그래프 구조입니다. BASE_DEGREE=6(DRG) + EXP_DEGREE=8(Feistel 확장)으로 총 14개 부모 노드를 가집니다. Feistel 순열로 확장 부모를 결정론적으로 계산합니다.',
  },
};
