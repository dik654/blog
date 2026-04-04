export const DUPLEX_CODE = `// challenger/src/duplex.rs — DuplexChallenger
pub struct DuplexChallenger<F, P, const WIDTH: usize, const RATE: usize> {
    pub sponge_state: [F; WIDTH],   // 스펀지 상태
    pub input_buffer: Vec<F>,       // 입력 버퍼
    pub output_buffer: Vec<F>,      // 출력 버퍼
    pub permutation: P,             // Poseidon2 퍼뮤테이션
}

// 1. 흡수 (Absorbing): 데이터를 스펀지에 입력
fn observe(&mut self, value: F) {
    self.output_buffer.clear();    // 출력 무효화
    self.input_buffer.push(value);
    if self.input_buffer.len() == RATE {
        self.duplexing();          // rate 가득 차면 순열 적용
    }
}

// 2. 듀플렉싱: 입력 XOR + 순열 + 출력 추출
fn duplexing(&mut self) {
    for (i, val) in self.input_buffer.drain(..).enumerate() {
        self.sponge_state[i] = val; // rate 부분에 복사
    }
    self.permutation.permute_mut(&mut self.sponge_state);
    self.output_buffer.extend(&self.sponge_state[..RATE]);
}`;

export const DUPLEX_ANNOTATIONS = [
  { lines: [2, 6] as [number, number], color: 'sky' as const, note: '스펀지 상태 + 입출력 버퍼' },
  { lines: [10, 16] as [number, number], color: 'emerald' as const, note: '흡수: 데이터 → 스펀지' },
  { lines: [19, 25] as [number, number], color: 'amber' as const, note: '듀플렉싱: XOR + permute + extract' },
];

export const USAGE_CODE = `// STARK 증명에서 챌린저 사용 순서
// 1. 트레이스 커밋 흡수
challenger.observe(trace_commitment);
challenger.observe_slice(public_values);

// 2. 제약 결합 챌린지 alpha 샘플
let alpha: Challenge = challenger.sample_algebra_element();

// 3. 몫 다항식 커밋 흡수
challenger.observe(quotient_commitment);

// 4. 개구 지점 zeta 샘플
let zeta: Challenge = challenger.sample_algebra_element();

// 5. FRI 쿼리 인덱스 샘플
let query_indices: Vec<usize> = (0..num_queries)
    .map(|_| challenger.sample_bits(log_n))
    .collect();`;

export const USAGE_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '트레이스 커밋 흡수' },
  { lines: [7, 7] as [number, number], color: 'emerald' as const, note: 'alpha 챌린지 (확장체)' },
  { lines: [16, 18] as [number, number], color: 'amber' as const, note: 'FRI 쿼리 인덱스 생성' },
];
