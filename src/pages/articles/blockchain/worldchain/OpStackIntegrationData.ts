export const txPoolCode = `World Chain 커스텀 트랜잭션 풀:

// 커스텀 트랜잭션 풀 타입 정의
pub type WorldChainTransactionPool<Provider, BlobStore> =
  reth_transaction_pool::Pool<
    WorldChainTransactionValidator<OpTransactionValidator<...>>,
    WorldChainOrdering,     // PBH 우선순위 정렬
    BlobStore
  >;

핵심 컴포넌트:
  WorldChainTransactionValidator → PBH 트랜잭션 검증 로직
  WorldChainOrdering            → PBH 우선순위 정렬 구현
  WorldChainRootValidator       → World ID 루트 검증

노드 컨텍스트 (두 가지 운영 모드):
  Basic Context     → 기본 World Chain 기능만 활성화
  Flashblocks Context → 고성능 블록 빌딩 활성화`;

export const txPoolAnnotations = [
  { lines: [3, 9] as [number, number], color: 'sky' as const, note: 'reth Pool을 커스텀 Validator/Ordering으로 래핑' },
  { lines: [11, 14] as [number, number], color: 'emerald' as const, note: '3개 핵심 컴포넌트' },
  { lines: [16, 18] as [number, number], color: 'amber' as const, note: '두 가지 운영 모드' },
];

export const builderCode = `World Chain Builder (외부 블록 빌더):

pub struct WorldChainPayloadBuilder<Client, S, Txs> {
  // OP Stack 기본 페이로드 빌더
  pub inner: OpPayloadBuilder<WorldChainTransactionPool<...>>,

  // PBH 특화 설정들
  pub verified_blockspace_capacity: u8,    // PBH 블록스페이스 용량 (%)
  pub pbh_entry_point: Address,            // PBH EntryPoint 컨트랙트
  pub pbh_signature_aggregator: Address,   // PBH 서명 집계자
  pub builder_private_key: PrivateKeySigner,
}

블록 생성 과정:
  1. rollup-boost로부터 FCU 요청 수신
  2. WorldChainPayloadBuilderCtx 생성
  3. 트랜잭션 풀에서 최적 트랜잭션 조회
  4. PBH 트랜잭션 검증 (ZK 증명 확인)
  5. 우선순위별 트랜잭션 정렬
  6. 블록 실행 (시퀀서 tx → PBH tx → 일반 tx)
  7. ExecutionPayload 반환`;

export const builderAnnotations = [
  { lines: [3, 12] as [number, number], color: 'sky' as const, note: 'PayloadBuilder 구조체' },
  { lines: [14, 21] as [number, number], color: 'emerald' as const, note: '블록 생성 7단계' },
];
