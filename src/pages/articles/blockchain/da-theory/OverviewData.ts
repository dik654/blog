export const BLOB_LIFECYCLE = [
  {
    title: '생성: 롤업이 blob 트랜잭션 제출',
    desc: '롤업 시퀀서가 배치 데이터를 128KB blob에 담아 BlobTx로 제출한다. Sidecar에 blob 원본 + KZG 커밋먼트 + 증명이 포함된다.',
    icon: '📦',
  },
  {
    title: '전파: P2P 네트워크로 배포',
    desc: 'blob 데이터는 블록 본문과 분리되어 전파된다. 블록에는 versioned hash(32B)만 기록하므로 합의 부하가 작다.',
    icon: '🔗',
  },
  {
    title: '검증: KZG 커밋먼트로 무결성 확인',
    desc: '검증자가 VerifyBlobProof로 blob과 커밋먼트의 일치를 확인한다. 원본 데이터 없이도 페어링 검사로 O(1) 검증이 가능하다.',
    icon: '✅',
  },
  {
    title: '프루닝: ~18일 후 자동 삭제',
    desc: 'blob 원본은 영구 저장하지 않는다. 합의 레이어가 약 18일(4096 에포크) 후 자동 삭제한다. versioned hash는 블록에 영구 보존된다.',
    icon: '🗑️',
  },
];
