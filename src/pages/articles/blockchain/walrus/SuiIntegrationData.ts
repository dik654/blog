export const SUI_OBJECTS_CODE = `// Sui 온체인 오브젝트 (walrus-sui/src)
// 1. System 오브젝트: 에포크 관리, 노드 등록, 파라미터
// 2. Blob 오브젝트: 블롭 메타데이터 (BlobId, 크기, 에포크)
// 3. WriteCertificate: 2f+1 확인 증명

// Blob 등록 트랜잭션
pub fn register_blob(
    system: &mut System,
    blob_id: BlobId,
    size: u64,
    epochs_ahead: u32,   // 저장 기간 (에포크 수)
    payment: Coin<SUI>,  // 저장 비용 지불
) -> Blob {
    // 1. 저장 비용 계산 (크기 * 에포크 * 가격)
    // 2. Blob 오브젝트 생성
    // 3. 스토리지 리소스 할당
}`;

export const SUI_OBJECTS_ANNOTATIONS = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: 'Sui 온체인 핵심 오브젝트' },
  { lines: [7, 13] as [number, number], color: 'emerald' as const, note: 'Blob 등록: BlobId + 비용 지불' },
];

export const EPOCH_CODE = `// 에포크 관리 (committee.rs)
// 에포크마다 노드 위원회가 변경될 수 있음
// 노드 가입/탈퇴, 스테이킹 변동 반영

pub struct Committee {
    pub epoch: u64,
    pub members: Vec<CommitteeMember>,
    pub total_weight: u64,          // 전체 투표 가중치
    pub n_shards: u16,              // 총 샤드 수
}

// 에포크 전환 시:
// 1. 새 위원회 선출 (스테이킹 기반)
// 2. 슬라이버 재할당 (노드 변경분만)
// 3. 이전 에포크 데이터 마이그레이션`;

export const EPOCH_ANNOTATIONS = [
  { lines: [5, 10] as [number, number], color: 'sky' as const, note: '위원회 구조 (에포크별)' },
  { lines: [12, 15] as [number, number], color: 'emerald' as const, note: '에포크 전환 3단계' },
];
