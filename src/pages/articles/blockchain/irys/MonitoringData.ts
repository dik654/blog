export const loggingCode = `// 로깅 설정 (main.rs)
// 환경 변수로 모듈별 레벨 제어
export RUST_LOG="irys_chain=debug,irys_consensus=info,irys_p2p=warn"

// 구조화 로그 출력 (tracing-subscriber)
let output_layer = tracing_subscriber::fmt::layer()
    .with_line_number(true)   // 라인 번호 포함
    .with_ansi(true)          // 컬러 출력
    .with_file(true)          // 파일명 포함
    .with_writer(std::io::stdout);

// JSON 형식 (프로덕션 권장)
export RUST_LOG_FORMAT=json
// 출력 예: {"level":"INFO","target":"irys_consensus",
//   "message":"VDF step completed",
//   "fields":{"step_number":12345,"duration_ms":1200}}`;

export const loggingAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '모듈별 로그 레벨 환경 변수' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: 'tracing-subscriber 설정' },
  { lines: [12, 16] as [number, number], color: 'amber' as const, note: 'JSON 구조화 로그 형식' },
];

export const metricsCode = `// 내장 메트릭 구조체
pub struct VdfMetrics {
    pub steps_per_second: f64,      // 초당 VDF 단계 수
    pub verification_time_ms: u64,  // 검증 시간 (ms)
    pub difficulty: u64,            // 현재 난이도
    pub reset_count: u64,           // 리셋 횟수
}

pub struct ChainMetrics {
    pub block_height: u64,          // 현재 블록 높이
    pub block_time_avg_ms: u64,     // 평균 블록 시간
    pub tx_pool_size: usize,        // 트랜잭션 풀 크기
    pub peers_connected: usize,     // 연결된 피어 수
    pub storage_used_bytes: u64,    // 사용 스토리지
}

// Prometheus 엔드포인트: GET /metrics
// 로그 파일 위치: .irys/logs/
//   irys-node.log      — 메인 노드 로그
//   consensus.log      — 합의 관련 로그
//   p2p.log            — P2P 네트워킹 로그
//   storage.log        — 스토리지 관련 로그`;

export const metricsAnnotations = [
  { lines: [2, 7] as [number, number], color: 'sky' as const, note: 'VDF 성능 메트릭' },
  { lines: [9, 15] as [number, number], color: 'emerald' as const, note: '블록체인 상태 메트릭' },
  { lines: [18, 22] as [number, number], color: 'amber' as const, note: '로그 파일 구조' },
];
