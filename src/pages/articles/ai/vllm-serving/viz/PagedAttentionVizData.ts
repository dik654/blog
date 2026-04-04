export const C = { alloc: '#6366f1', free: '#94a3b8', cow: '#f59e0b', shared: '#10b981' };

export const STEPS = [
  { label: '전통적 시스템: 최대 길이만큼 사전 할당',
    body: '요청마다 max_seq_len 크기의 연속 메모리를 할당합니다. 실제 사용량보다 훨씬 큰 메모리를 점유하여 내부/외부 단편화가 20-38% 발생합니다.' },
  { label: 'PagedAttention: 고정 크기 블록으로 동적 할당',
    body: 'OS의 가상 메모리처럼 Block Table을 통해 논리 블록→물리 블록을 매핑합니다. 비연속 물리 블록을 사용하므로 외부 단편화가 없습니다.' },
  { label: 'Decode: 토큰 생성 시 블록 동적 추가',
    body: '새 토큰이 생성되면 현재 블록에 추가하고, 블록이 가득 차면 새 물리 블록을 할당합니다. 마지막 블록에서만 미사용 슬롯이 발생합니다 (평균 B/2).' },
  { label: 'Copy-on-Write: Beam Search에서 메모리 공유',
    body: '동일 프롬프트를 공유하는 시퀀스들은 같은 물리 블록을 참조합니다. 분기 시에만 새 블록을 복사(CoW)하여 메모리를 절약합니다.' },
  { label: '결과: 메모리 낭비 20-38% → 4% 미만',
    body: 'PagedAttention으로 동일 GPU에서 2-4x 더 많은 요청을 동시 처리할 수 있습니다. HuggingFace 대비 최대 24x 처리량 향상.' },
];

export const BLOCK_W = 36;
export const BLOCK_H = 24;
export const GAP = 4;
