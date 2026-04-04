export const C = { disk: '#6366f1', cache: '#f59e0b', mem: '#10b981', track: '#0ea5e9' };

export const STEPS = [
  {
    label: 'BlobStore 인터페이스',
    body: 'insert/delete/get/cleanup 4메서드의 trait으로 DiskFile과 InMemory 구현체가 있습니다.',
  },
  {
    label: 'DiskFileBlobStore 삽입',
    body: 'RLP 인코딩 → hash 매핑 → LRU 캐시 → 디스크 파일 쓰기 4단계로 삽입합니다.',
  },
  {
    label: 'DiskFileBlobStore 조회',
    body: 'LRU 캐시 O(1) 확인 후 캐시 미스 시 디스크에서 읽어 캐시에 추가합니다.',
  },
  {
    label: '지연 삭제 (deferred deletion)',
    body: 'delete()는 목록에 추가만, cleanup()에서 일괄 삭제하여 file_lock 경합을 방지합니다.',
  },
];
