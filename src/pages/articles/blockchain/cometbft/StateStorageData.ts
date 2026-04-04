export const STATE_STRUCT_CODE = `State 구조체 — 블록체인 핵심 상태

type State struct {
  Version    cmtstate.Version   // 프로토콜 버전
  ChainID    string             // 네트워크 식별자 (불변)
  InitialHeight  int64          // 시작 높이

  // 마지막 블록 정보
  LastBlockHeight  int64
  LastBlockID      types.BlockID
  LastBlockTime    time.Time

  // 밸리데이터 세트 (3세대 관리)
  NextValidators  *types.ValidatorSet  // 다음 높이
  Validators      *types.ValidatorSet  // 현재 높이
  LastValidators  *types.ValidatorSet  // 이전 높이

  // 합의 파라미터 + 실행 결과
  ConsensusParams  types.ConsensusParams
  AppHash          []byte  // 애플리케이션 상태 해시
  LastResultsHash  []byte  // 이전 블록 실행 결과
}`;

export const STATE_STRUCT_ANNOTATIONS = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: '불변 필드' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: '블록 메타데이터' },
  { lines: [13, 16] as [number, number], color: 'amber' as const, note: '3세대 밸리데이터' },
  { lines: [18, 21] as [number, number], color: 'violet' as const, note: '상태 해시' },
];

export const BLOCKSTORE_CODE = `BlockStore 구조체 — 블록 저장소

type BlockStore struct {
  db          dbm.DB         // DB 인터페이스
  base        int64          // 첫 번째 블록 높이
  height      int64          // 마지막 블록 높이

  // LRU 캐시 (성능 최적화)
  seenCommitCache     *lru.Cache[int64, *types.Commit]
  blockCommitCache    *lru.Cache[int64, *types.Commit]
  blockPartCache      *lru.Cache[blockPartIndex, *types.Part]

  // 키 레이아웃 버전
  dbKeyLayout  BlockKeyLayout  // v1 (문자열) vs v2 (바이너리)
}

저장 데이터:
  H:<height>              → BlockMeta (메타데이터)
  P:<height>:<partIndex>  → BlockPart (블록 조각)
  C:<height>              → Commit (커밋 정보)
  SC:<height>             → SeenCommit (확인된 커밋)
  BH:hex(<hash>)          → height (해시 인덱스)`;

export const BLOCKSTORE_ANNOTATIONS = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: '연속성 보장 (base~height)' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: 'LRU 캐시' },
  { lines: [17, 21] as [number, number], color: 'amber' as const, note: 'DB 키 형식' },
];

export const DB_BACKEND_TABLE = [
  { backend: 'goleveldb', desc: 'Go 순수 구현, 기본값', perf: '범용, 설치 편리' },
  { backend: 'pebbledb', desc: 'CockroachDB 기반', perf: '높은 쓰기 성능' },
  { backend: 'rocksdb', desc: 'Facebook, CGO 필요', perf: '대규모 데이터 최적화' },
  { backend: 'badgerdb', desc: 'Dgraph 개발', perf: 'SSD 최적화 LSM-tree' },
] as const;
