// ── p2p/src/simulated/mod.rs ──
// 결정론적 네트워크 시뮬레이터

/// 시뮬레이션 링크 속성
pub struct Link {
    pub latency: Duration,    // 네트워크 지연
    pub jitter: Duration,     // 지연 변동 폭
    pub success_rate: f64,    // 전달 성공 확률 (0.0~1.0)
}

/// 시뮬레이션 설정
pub struct Config {
    pub max_size: usize,          // 최대 메시지 크기
    pub disconnect_on_block: bool, // block 시 연결 해제 여부
    pub tracked_peer_sets: Option<usize>, // 추적 peer set 수
}

// Network::new(context, config) → (Network, Oracle)
// oracle.add_link(peer_a, peer_b, Link { ... })
// oracle.limit_bandwidth(peer, egress, ingress)

// 결정론적 실행:
// deterministic::Runner::seeded(seed)
// → 동일 seed → 동일 메시지 순서 → 동일 결과

// 4가지 장애 시뮬레이션:
// 1. 네트워크 파티션: remove_link(a, b)
// 2. 비잔틴 장애: 커스텀 핸들러로 악성 메시지 전송
// 3. 링크 손실: success_rate < 1.0
// 4. 크래시 복구: disconnect + reconnect 시퀀스

// 대역폭 시뮬레이션 (progressive filling):
// 1. 활성 전송 수집
// 2. progressive filling → max-min 공정 할당
// 3. 가장 빨리 완료되는 전송까지 시간 전진
// 4. 메시지 전달 → 반복
