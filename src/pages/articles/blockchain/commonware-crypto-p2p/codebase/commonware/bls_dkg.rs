// ── cryptography/src/bls12381/dkg.rs ──
// Joint-Feldman DKG + Desmedt97 Resharing

/// DKG 라운드 설정 정보
pub struct Info {
    round: u64,              // 라운드 번호 (실패 라운드 포함 단조 증가)
    previous: Option<Output>, // 이전 라운드 출력 (리셰어링용)
    dealers: Vec<PublicKey>,  // 딜러 목록 (>= 이전 quorum)
    players: Vec<PublicKey>,  // 공유를 받을 플레이어
}

/// 딜러 상태 머신
pub struct Dealer { /* ... */ }

impl Dealer {
    /// Step 1: 비밀 다항식 생성 → 공개 커밋먼트 + 개인 딜링
    pub fn start(info: &Info, rng: &mut impl CryptoRngCore)
        -> (Self, DealerPubMsg, Vec<(usize, DealerPrivMsg)>) {
        // degree 2f 다항식 → 각 플레이어 인덱스에서 평가
        // 공개: 다항식 커밋먼트 (DealerPubMsg)
        // 비공개: 스칼라 평가값 (DealerPrivMsg, 암호화 채널로 전달)
    }

    /// Step 4: 플레이어 ACK 수집
    pub fn receive_player_ack(&mut self, ack: PlayerAck) { /* ... */ }

    /// Step 4: 타임아웃 → ACK 미수신 share 공개
    pub fn finalize(self) -> SignedDealerLog { /* ... */ }
}

/// 플레이어 상태 머신
pub struct Player { /* ... */ }

impl Player {
    /// Step 3: 딜러 메시지 검증 → ACK 반환
    pub fn dealer_message(&mut self, pub_msg: &DealerPubMsg,
        priv_msg: &DealerPrivMsg) -> Option<PlayerAck> {
        // 다항식 커밋먼트 vs 비공개 share 일치 검증
    }

    /// Step 5: 모든 DealerLog로 최종 Share 계산
    pub fn finalize(self, logs: &[DealerLog])
        -> Result<(Share, Output), Error> {
        // 유효 딜러의 share 합산 → 개인 share
        // 공개 다항식 합산 → 그룹 공개키
    }
}

/// DKG 출력 — 그룹 공개키 + 참여자 목록
pub struct Output {
    pub polynomial: Vec<G1>,       // 공개 다항식 커밋먼트
    pub dealers: Vec<PublicKey>,    // 성공 딜러
    pub players: Vec<PublicKey>,    // share 수신 플레이어
    pub revealed: HashSet<usize>,  // share가 공개된 플레이어 인덱스
}
