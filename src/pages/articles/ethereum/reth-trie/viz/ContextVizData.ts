export const C = { trie: '#6366f1', err: '#ef4444', ok: '#10b981', change: '#f59e0b', parallel: '#8b5cf6' };

export const STEPS = [
  {
    label: '매 블록마다 상태 루트를 계산해야 함',
    body: '블록 유효성은 상태 루트 일치 여부로 판단하며 12초 안에 계산 완료해야 합니다.',
  },
  {
    label: '문제: 수억 개 계정의 전체 trie 재계산',
    body: 'Geth는 dirty trie를 전체 순회하며 커밋하여 계정 수에 비례해 느려집니다.',
  },
  {
    label: '해결: PrefixSet — 변경된 키만 추적',
    body: 'BTreeSet으로 변경 키만 수집하여 해당 서브트리만 재해시합니다.',
  },
  {
    label: '해결: overlay_root — 기존 해시 재사용',
    body: 'DB의 기존 trie 위에 변경사항을 overlay하고 미변경 서브트리 해시를 재사용합니다.',
  },
  {
    label: '해결: 병렬 trie — storage trie를 rayon으로',
    body: '독립적인 각 계정의 storage trie를 rayon으로 병렬 계산합니다.',
  },
];
