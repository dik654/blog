export const C = {
  proc: '#6366f1',
  os: '#0ea5e9',
  disk: '#f59e0b',
  cow: '#10b981',
  dim: '#94a3b8',
};

export const STEPS = [
  {
    label: 'mmap: 파일 → 가상 메모리 매핑',
    body: 'mmap() 시스콜로 DB 파일 전체를 프로세스의 가상 주소 공간에 매핑합니다.\n파일의 각 영역이 가상 메모리 주소에 1:1 대응됩니다.',
  },
  {
    label: '읽기: 포인터 역참조 (zero-copy)',
    body: 'read() 시스콜 없이 일반 포인터로 데이터에 접근합니다.\nOS가 투명하게 디스크 I/O를 처리하므로, 불필요한 버퍼 복사가 없습니다.',
  },
  {
    label: 'Page Fault: 최초 접근 시 디스크 → 메모리',
    body: '매핑만 해둔 상태에서 실제 접근이 발생하면 page fault가 트리거됩니다.\nOS 커널이 해당 4KB 페이지를 디스크에서 물리 메모리로 로드합니다.',
  },
  {
    label: 'Copy-on-Write: 쓰기 시 페이지 복사',
    body: '쓰기 트랜잭션이 페이지를 수정할 때, 원본을 건드리지 않고 새 페이지에 복사 후 수정합니다.\n읽기 트랜잭션은 여전히 원본 페이지를 참조하므로 비차단(non-blocking)입니다.',
  },
  {
    label: '결과: 읽기/쓰기 동시 진행',
    body: '읽기 트랜잭션은 old page를, 쓰기 트랜잭션은 new page를 참조합니다.\n커밋 후 meta 페이지를 atomic하게 업데이트하여 새 트리를 가리킵니다.',
  },
];
