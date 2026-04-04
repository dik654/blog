export const C = { state: '#8b5cf6', cow: '#0ea5e9', hash: '#10b981', err: '#ef4444', ok: '#10b981' };

export const STEPS = [
  {
    label: '수십만 검증자의 상태를 하나에',
    body: '전체 합의 상태를 하나의 BeaconState에 보관하며 매 슬롯(12초)마다 갱신해야 합니다.',
  },
  {
    label: '문제: 메모리 폭발',
    body: 'BeaconState는 수백 MB로 포크 분기를 동시 보관하면 메모리가 고갈됩니다.',
  },
  {
    label: '문제: 해시 병목',
    body: '매 슬롯 상태 루트를 계산해야 하며 전체 해시는 12초 안에 처리 불가합니다.',
  },
  {
    label: '해결: Copy-on-Write',
    body: '상태 복사 시 참조만 공유하고 수정 시에만 해당 필드를 복사하여 메모리를 절약합니다.',
  },
  {
    label: '해결: FieldTrie 해시 캐싱',
    body: '각 필드를 독립 서브트리로 분리하고 dirtyFields 비트맵으로 변경분만 재해시합니다.',
  },
];
