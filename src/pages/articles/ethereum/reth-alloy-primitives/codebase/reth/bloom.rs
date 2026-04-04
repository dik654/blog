// alloy-primitives — Bloom Filter (2048비트)

/// 2048비트 블룸 필터 — 256바이트 고정 크기
pub struct Bloom(pub FixedBytes<256>);

impl Bloom {
    pub const EMPTY: Self = Self(FixedBytes([0u8; 256]));

    /// 로그 토픽을 블룸 필터에 삽입
    /// Keccak256 해시의 처음 6바이트로 3개의 비트 위치 결정
    pub fn accrue(&mut self, input: BloomInput) {
        let hash = keccak256(input.as_bytes());
        for i in (0..6).step_by(2) {
            let bit = (hash[i] as usize * 256 + hash[i + 1] as usize) % 2048;
            let byte_idx = 255 - bit / 8;
            let bit_idx = bit % 8;
            self.0[byte_idx] |= 1 << bit_idx;
        }
    }

    /// 블룸 필터 검사 — false positive 가능
    pub fn contains_input(&self, input: BloomInput) -> bool {
        let mut test = Bloom::EMPTY;
        test.accrue(input);
        self.contains_bloom(&test)
    }

    /// 두 블룸 필터의 비트 AND 검사
    pub fn contains_bloom(&self, other: &Bloom) -> bool {
        self.0.iter().zip(other.0.iter()).all(|(a, b)| a & b == *b)
    }
}
