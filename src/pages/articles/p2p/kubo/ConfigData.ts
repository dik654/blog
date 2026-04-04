export const CONFIG_STEPS = [
  { label: '설정 개요' }, { label: '네트워크 설정' },
  { label: '스토리지 설정' }, { label: '프로파일' },
];

export const CONFIG_SECTIONS = [
  { key: 'Addresses', desc: 'Swarm/API/Gateway 리스닝 주소', color: '#6366f1' },
  { key: 'Bootstrap', desc: '초기 연결할 피어 목록', color: '#0ea5e9' },
  { key: 'Datastore', desc: '저장소 백엔드 & GC 설정', color: '#10b981' },
  { key: 'Gateway', desc: 'HTTP Gateway 설정', color: '#f59e0b' },
  { key: 'Routing', desc: 'DHT/HTTP 라우터 설정', color: '#ef4444' },
  { key: 'Swarm', desc: '연결 관리 & NAT 설정', color: '#8b5cf6' },
];

export const CONFIG_CODE = `// Datastore 설정 구조체
type Datastore struct {
  StorageMax         string  // 최대 저장 용량 (10GB)
  StorageGCWatermark int64   // GC 임계점 (백분율, 90)
  GCPeriod           string  // GC 주기 ("1h")
  HashOnRead         bool    // 읽기 시 해시 검증
  BloomFilterSize    int     // 블룸 필터 크기
  BlockKeyCacheSize  OptionalInteger
  WriteThrough       Flag    // 쓰기 관통 모드
}`;

export const CONFIG_ANNOTATIONS = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '저장 공간 한도 설정' },
  { lines: [4, 4] as [number, number], color: 'emerald' as const, note: 'GC 실행 주기' },
  { lines: [5, 6] as [number, number], color: 'amber' as const, note: '읽기 검증 & 캐시 최적화' },
];
