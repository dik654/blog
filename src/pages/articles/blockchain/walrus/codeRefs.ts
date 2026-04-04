import type { CodeRef } from '@/components/code/types';

import bftRs from './codebase/walrus-core/src/bft.rs?raw';
import blobEncodingRs from './codebase/walrus-core/src/encoding/blob_encoding.rs?raw';
import configRs from './codebase/walrus-core/src/encoding/config.rs?raw';
import sliversRs from './codebase/walrus-core/src/encoding/slivers.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'walrus-bft': {
    path: 'walrus-core/src/bft.rs',
    code: bftRs,
    lang: 'rust',
    highlight: [6, 25],
    desc: 'BFT 파라미터 모듈입니다. max_n_faulty(n) = (n-1)/3으로 비잔틴 장애 임계값을 계산하고, min_n_correct = n - f로 최소 정직 노드 수를 도출합니다.',
    annotations: [
      { lines: [12, 14], color: 'sky', note: 'max_n_faulty — f = (n-1)/3' },
      { lines: [21, 25], color: 'emerald', note: 'min_n_correct — n - f (최소 정직 노드)' },
      { lines: [34, 42], color: 'amber', note: '파라미터 테스트 케이스: n=100 → f=33' },
    ],
  },

  'walrus-blob-encoding': {
    path: 'walrus-core/src/encoding/blob_encoding.rs',
    code: blobEncodingRs,
    lang: 'rust',
    highlight: [277, 345],
    desc: 'BlobEncoder::encode_with_metadata는 2D RS 인코딩 파이프라인의 핵심입니다. 원본 블롭을 행/열 방향으로 Reed-Solomon 인코딩하고 슬라이버 쌍과 메타데이터를 생성합니다.',
    annotations: [
      { lines: [277, 289], color: 'sky', note: '빈 슬라이버 할당 (Primary + Secondary)' },
      { lines: [293, 302], color: 'emerald', note: '시스테매틱 심볼 직접 복사 (행/열)' },
      { lines: [308, 324], color: 'amber', note: '행 방향 RS 인코딩 → Secondary 복구 심볼' },
      { lines: [337, 345], color: 'violet', note: '열 방향 RS 인코딩 → Primary 복구 + 심볼 해시' },
    ],
  },

  'walrus-config': {
    path: 'walrus-core/src/encoding/config.rs',
    code: configRs,
    lang: 'rust',
    highlight: [421, 460],
    desc: 'ReedSolomonEncodingConfig는 n_shards, source_symbols_primary (n-2f), source_symbols_secondary (n-f)를 관리합니다. BFT 파라미터에서 인코딩 설정을 자동 도출합니다.',
    annotations: [
      { lines: [421, 432], color: 'sky', note: 'RS 인코딩 설정 구조체 — primary k₁, secondary k₂' },
      { lines: [446, 460], color: 'emerald', note: 'new() — source_symbols_for_n_shards로 자동 도출' },
      { lines: [717, 725], color: 'amber', note: 'source_symbols_for_n_shards — BFT에서 k₁, k₂ 계산' },
    ],
  },

  'walrus-slivers': {
    path: 'walrus-core/src/encoding/slivers.rs',
    code: sliversRs,
    lang: 'rust',
    highlight: [40, 56],
    desc: 'SliverData<T>는 제네릭 슬라이버 구조체로 Primary/Secondary를 타입 파라미터로 구분합니다. SliverPair는 교차 인덱스로 두 방향의 슬라이버를 묶습니다.',
    annotations: [
      { lines: [41, 44], color: 'sky', note: 'PrimarySliver / SecondarySliver 타입 별칭' },
      { lines: [48, 56], color: 'emerald', note: 'SliverData<T> — Symbols + SliverIndex + PhantomData' },
      { lines: [429, 434], color: 'amber', note: 'SliverPair — primary[i] + secondary[n-1-i] 교차 보유' },
    ],
  },
};
