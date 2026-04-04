export interface GlossaryTerm {
  icon: string;
  name: string;
  en: string;
  desc: string;
  why: string;
  /** 심화 아티클 경로 (블로그 내 라우트) */
  articleLink?: string;
  /** 심화 아티클 제목 */
  articleTitle?: string;
}

export const DA_TERMS: GlossaryTerm[] = [
  {
    icon: '📦', name: 'Blob', en: 'Binary Large Object',
    desc: '128KB 고정 크기 데이터 덩어리. 4096개 BLS12-381 필드 원소(각 32B)로 구성된다. 롤업이 L1에 저렴하게 데이터를 게시하기 위한 용도로, calldata 대비 10배 이상 저렴하다. Reth에서는 DiskFileBlobStore가 blob을 LRU 캐시 + 디스크 파일로 관리하고, 약 18일 후 자동 pruning한다.',
    why: 'EIP-4844의 핵심 데이터 단위. 블록당 최대 6개(Pectra 이후 9개). Blob의 저장·검증·수명주기가 노드 구현의 핵심이다.',
    articleLink: '/blockchain/reth-eip4844',
    articleTitle: 'Reth EIP-4844: Blob TX 저장·검증·가스 코드 분석',
  },
  {
    icon: '🧳', name: 'Sidecar (사이드카)', en: 'BlobTxSidecar',
    desc: '블록 본문(RLP)과 별도로 전파되는 보조 구조체. blob 원본 데이터 + KZG 커밋먼트(각 48B) + KZG 증명(각 48B)을 담는다. 블록 RLP에는 포함되지 않아(rlp:"-") 블록 크기에 영향 없이 대용량 데이터를 전파할 수 있다. 약 18일(4096 에폭) 후 자동 삭제된다.',
    why: '블록 크기 증가 없이 대용량 데이터 전파. 일시적 저장으로 노드 디스크 부담을 억제한다.',
    articleLink: '/blockchain/reth-eip4844',
    articleTitle: 'Reth EIP-4844: BlobTxSidecar 구조 상세',
  },
  {
    icon: '🔐', name: 'KZG 커밋먼트', en: 'Kate-Zaverucha-Goldberg',
    desc: '다항식을 타원곡선 위의 G1 점 하나(48B)로 "요약"하는 기법. BlobToCommitment()가 blob을 다항식으로 해석 → trusted setup의 SRS(τ^i·G1)로 커밋. VerifyBlobProof()가 페어링 검사로 검증한다. 원본 128KB 없이 48B 증명만으로 무결성 확인이 가능하다.',
    why: 'DAS와 blob 검증의 수학적 기반. 이더리움은 KZG ceremony에 14만+ 참여자가 기여했다.',
    articleLink: '/blockchain/polycommit',
    articleTitle: '다항식 커밋먼트: KZG·IPA·Linear Codes 구현 비교',
  },
  {
    icon: '🤝', name: 'Trusted Setup (신뢰 설정)', en: 'Structured Reference String',
    desc: 'KZG에 필요한 초기 매개변수(SRS) 생성 의식. 비밀값 τ를 선택 → τ^0·G1, τ^1·G1, ..., τ^n·G1 계산 → τ 삭제. 참여자 중 1명만 τ를 삭제하면 전체 시스템이 안전하다(1-of-N 신뢰 모델). 이더리움은 2023년 KZG ceremony를 통해 SRS를 생성했다.',
    why: 'KZG의 보안 근간. Groth16과 달리 universal SRS라 회로 변경에도 재사용 가능하다.',
    articleLink: '/blockchain/groth16',
    articleTitle: 'Groth16: Trusted Setup 상세',
  },
  {
    icon: '📐', name: 'BLS12-381', en: 'Barreto-Lynn-Scott curve',
    desc: '페어링 친화적 타원곡선. G1(48B)·G2(96B) 두 군과 Gt(384B) 타겟 군을 가진다. 128비트 보안을 제공하며, 이더리움 합의(BLS 서명 집계)와 EIP-4844(KZG 커밋먼트) 모두에 사용된다. 곡선 이름의 12는 임베딩 차수, 381은 필드 크기(비트)다.',
    why: 'KZG 커밋먼트의 기반 곡선. 페어링 e(G1, G2) → Gt 연산으로 다항식 평가 정확성을 검증한다.',
    articleLink: '/blockchain/pairing',
    articleTitle: 'Optimal Ate Pairing: Miller Loop · Final Exp 구현',
  },
  {
    icon: '⚙️', name: '옵코드 (Opcode)', en: 'EVM Operation Code',
    desc: 'EVM(이더리움 가상 머신)의 기계 명령어. 스택에서 피연산자를 꺼내고(pop) 결과를 올린다(push). BLOBHASH(0x49)는 Cancun 하드포크에 추가된 옵코드로, 트랜잭션에 첨부된 blob의 versioned hash를 스택에 올린다. 롤업 컨트랙트가 blob 데이터를 참조할 때 사용한다.',
    why: '스마트 컨트랙트가 blob 데이터를 참조할 수 있는 유일한 인터페이스.',
    articleLink: '/blockchain/evm-fundamentals',
    articleTitle: 'EVM 완전 분석: 스택 머신에서 인터프리터까지',
  },
  {
    icon: '🔢', name: 'Reed-Solomon 부호', en: 'Reed-Solomon Code',
    desc: '다항식 평가 기반 이레이저 코딩. n개 데이터를 차수 n-1 다항식으로 보간 → 2n개 점에서 평가하여 확장. 50%까지 손실되어도 임의의 n개 점으로 원본 복구가 가능하다(Lagrange 보간). DAS에서 blob을 확장하는 데 사용한다.',
    why: 'DAS의 수학적 기반. 라이트 노드의 무작위 샘플링이 통계적으로 유의미해지는 핵심 이유.',
    articleLink: '/blockchain/reed-solomon',
    articleTitle: 'Reed-Solomon 부호: 이레이저 코딩 구현',
  },
  {
    icon: '🎲', name: 'DAS', en: 'Data Availability Sampling',
    desc: '라이트 노드가 전체 데이터(수 MB) 대신 무작위 셀 몇 개(각 ~512B)만 요청하여 데이터 가용성을 확률적으로 검증하는 기법. Reed-Solomon 확장 덕분에 75개 셀만 샘플링해도 99.99% 확률로 원본 복구 가능성이 보장된다.',
    why: '풀 노드 없이도 DA를 검증. Danksharding의 핵심 확장 메커니즘이다.',
  },
];
