export const API_ENDPOINTS_CODE = `// REST API 엔드포인트 (/v1 경로)
GET  /info                    → 노드 상태 (버전, 높이, 피어 수, 동기화 상태)
POST /tx                     → 데이터 트랜잭션 제출
GET  /tx/{tx_id}              → 트랜잭션 정보 조회
GET  /tx/{tx_id}/is_promoted  → 프로모션 여부 확인
POST /chunk                   → 데이터 청크 제출
GET  /chunk/ledger/{id}/{off} → 원장 오프셋 청크 조회
GET  /block/{block_tag}       → 블록 정보 (latest, {height}, {hash})
GET  /block_index             → 블록 인덱스 (height, limit)
GET  /price/{ledger}/{size}   → 데이터 저장 가격 조회`;

export const API_ENDPOINTS_ANNOTATIONS = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: '노드 상태 정보' },
  { lines: [3, 6] as [number, number], color: 'emerald' as const, note: '트랜잭션 & 청크 관리' },
  { lines: [8, 10] as [number, number], color: 'amber' as const, note: '블록 & 가격 조회' },
];

export const GOSSIP_ENDPOINTS_CODE = `// 가십 프로토콜 내부 엔드포인트 (/gossip 경로)
web::scope("/gossip")
    .route("/transaction", web::post().to(handle_transaction))
    .route("/commitment_tx", web::post().to(handle_commitment_tx))
    .route("/chunk", web::post().to(handle_chunk))
    .route("/block", web::post().to(handle_block))
    .route("/ingress_proof", web::post().to(handle_ingress_proof))
    .route("/execution_payload", web::post().to(handle_execution_payload))
    .route("/get_data", web::post().to(handle_data_request))
    .route("/pull_data", web::post().to(handle_pull_data))
    .route("/health", web::get().to(handle_health_check))`;

export const GOSSIP_ENDPOINTS_ANNOTATIONS = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: '데이터 전파 엔드포인트' },
  { lines: [9, 11] as [number, number], color: 'emerald' as const, note: '데이터 풀링 & 헬스 체크' },
];

export const INFO_RESPONSE_CODE = `// GET /info 응답 예시
{
    "version": "0.0.1",
    "peerCount": 5,
    "chainId": 1270,
    "height": 12345,
    "blockHash": "0x1234567890abcdef...",
    "blockIndexHeight": 12340,
    "blocks": 12345,
    "isSyncing": false,
    "currentSyncHeight": 0
}`;

export const INFO_RESPONSE_ANNOTATIONS = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '기본 노드 정보' },
  { lines: [10, 11] as [number, number], color: 'emerald' as const, note: '동기화 상태' },
];
