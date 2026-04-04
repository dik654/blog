export const CONFIG_CODE = `# Irys 노드 설정 (config.toml)
mode = "PeerSync"           # Genesis | PeerSync | TrustedPeerSync
base_directory = "./.irys"  # 데이터 디렉토리
mining_key = "your_private_key_hex"  # 노드 식별 키 (64자리 hex)
reward_address = "0x..."    # 보상 수신 주소
consensus = "Testnet"       # Testnet | Testing | Custom

[gossip]
public_ip = "your.public.ip"
public_port = 8081          # 가십 포트
bind_ip = "0.0.0.0"
bind_port = 8081

[http]
public_port = 8080          # REST API 포트
bind_ip = "0.0.0.0"
bind_port = 8080`;

export const CONFIG_ANNOTATIONS = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '노드 모드 & 데이터 경로' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: '가십 네트워크 설정' },
  { lines: [14, 17] as [number, number], color: 'amber' as const, note: 'HTTP API 설정' },
];

export const PERFORMANCE_CODE = `# 성능 최적화 설정
[packing]
cpu_packing_concurrency = 4    # CPU 패킹 동시성 (고성능: 16)
gpu_packing_batch_size = 1024  # GPU 배치 크기 (고성능: 4096)

[storage]
num_writes_before_sync = 1     # 디스크 동기화 전 쓰기 횟수

[data_sync]
max_pending_chunk_requests = 100        # 최대 대기 청크 요청
max_storage_throughput_bps = 1047961600 # 최대 저장 처리량 (1GB/s)
chunk_request_timeout = "15s"           # 청크 요청 타임아웃

[cache]
cache_clean_lag = 2            # 캐시 정리 지연 블록 수`;

export const PERFORMANCE_ANNOTATIONS = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: '패킹 성능 설정' },
  { lines: [9, 12] as [number, number], color: 'emerald' as const, note: '데이터 동기화 튜닝' },
];

export const METRICS_CODE = `// 메트릭 구조체 (irys-metrics)
pub struct VdfMetrics {
    pub steps_per_second: f64,    // 초당 VDF 단계 수
    pub verification_time_ms: u64, // 검증 시간 (ms)
    pub difficulty: u64,          // 현재 난이도
}

pub struct ChainMetrics {
    pub block_height: u64,         // 블록 높이
    pub block_time_avg_ms: u64,    // 평균 블록 시간
    pub tx_pool_size: usize,       // 트랜잭션 풀 크기
    pub peer_count: usize,         // 연결 피어 수
    pub sync_progress: f64,        // 동기화 진행률 (0.0-1.0)
}

// Prometheus 엔드포인트: GET /metrics/prometheus
// irys_block_height 12345
// irys_vdf_steps_per_second 1500.0
// irys_peer_count 8`;

export const METRICS_ANNOTATIONS = [
  { lines: [2, 6] as [number, number], color: 'sky' as const, note: 'VDF 성능 메트릭' },
  { lines: [8, 14] as [number, number], color: 'emerald' as const, note: '블록체인 상태 메트릭' },
  { lines: [16, 19] as [number, number], color: 'amber' as const, note: 'Prometheus 형식 내보내기' },
];
