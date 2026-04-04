import type { CodeRef } from '@/components/code/types';

import packingRs from './codebase/irys/crates/packing/src/lib.rs?raw';

export const packingRefs: Record<string, CodeRef> = {
  'irys-unpack': {
    path: 'crates/packing/src/lib.rs',
    code: packingRs,
    lang: 'rust',
    highlight: [20, 46],
    desc: 'unpack 함수는 PackedChunk를 엔트로피 재계산 + XOR로 UnpackedChunk로 복원합니다. mining_address, partition_hash, offset을 시드로 사용합니다.',
    annotations: [
      { lines: [27, 35], color: 'sky', note: '엔트로피 재계산 (2D 해시)' },
      { lines: [37, 37], color: 'emerald', note: 'XOR로 언패킹' },
      { lines: [39, 45], color: 'amber', note: '메타데이터 통과 (data_root, tx_offset 등)' },
    ],
  },
  'irys-xor-pack': {
    path: 'crates/packing/src/lib.rs',
    code: packingRs,
    lang: 'rust',
    highlight: [269, 286],
    desc: 'XOR 패킹/언패킹 유틸리티입니다. xor_vec_u8_arrays_in_place는 in-place 변환, packing_xor_vec_u8는 엔트로피 벡터를 소비하며 패킹합니다.',
    annotations: [
      { lines: [270, 273], color: 'sky', note: 'in-place XOR (패킹/언패킹 공용)' },
      { lines: [280, 285], color: 'emerald', note: '엔트로피 소비 XOR (벡터 반환)' },
    ],
  },
  'irys-cuda-pack': {
    path: 'crates/packing/src/lib.rs',
    code: packingRs,
    lang: 'rust',
    highlight: [118, 173],
    desc: 'CUDA GPU 가속 패킹입니다. capacity_pack_range_cuda_c는 다수 청크의 엔트로피를 GPU에서 병렬 계산하고, 호스트에서 XOR 적용합니다.',
    annotations: [
      { lines: [136, 143], color: 'sky', note: '엔트로피 버퍼 용량 검증' },
      { lines: [151, 164], color: 'emerald', note: 'unsafe CUDA 커널 호출' },
      { lines: [169, 172], color: 'amber', note: '에러 코드 체크' },
    ],
  },
};
