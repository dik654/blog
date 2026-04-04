export const C = { app: '#6366f1', kern: '#f59e0b', disk: '#8b5cf6', fast: '#10b981', slow: '#ef4444' };

export const STEPS = [
  {
    label: 'Traditional read() — 2번 복사',
    body: 'App이 read() 시스콜을 호출하면 커널이 디스크→커널 버퍼→유저 버퍼로 2번 memcpy한다.',
  },
  {
    label: 'mmap — 0번 복사',
    body: 'App은 가상 주소를 역참조할 뿐, MMU가 물리 주소(페이지 캐시)로 직접 변환한다.',
  },
  {
    label: 'Page Fault 흐름',
    body: '첫 접근 시 OS가 4KB 페이지를 디스크에서 로드(~100us). 이후 접근은 메모리 속도(~50ns).',
  },
  {
    label: 'MDBX에서의 효과',
    body: 'B+tree 노드가 mmap된 페이지 — 포인터 역참조만으로 root→leaf 트리 탐색이 완료된다.',
  },
];
