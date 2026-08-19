// succinctlabs/sp1 저장소 · crates/core/executor/src/record.rs (v6.4.0,
// commit f66b4bf, 2026년 8월 기준 이 글이 인용하는 SHA). 전체 1639줄 중
// ExecutionRecord struct(수십 개 event 필드 중 대표만)와 shard로 나누는
// split()의 boundary-linking 부분만 발췌했습니다. 개별 opcode별 event
// 정의와 memory/page-prot 세부 처리는 생략했습니다.
// 본문 대응: execution-shards section의 "ExecutionRecord는 단순 instruction
// count가 아니라 CPU, memory, syscall/precompile events와 public values를
// 담는 witness artifact"와 m_i^out=m_{i+1}^in shard 연속성 식.

pub struct ExecutionRecord {
    /// The program.
    pub program: Arc<Program>,
    /// The number of CPU related events.
    pub cpu_event_count: u32,
    // article의 "CPU... events" — opcode별 event trace. 실제로는 add/sub/
    // mul/div/shift/branch/jump 등 수십 개 필드가 이런 형태로 이어진다
    // (여기서는 대표 몇 개만 남기고 생략).
    /// A trace of the ADD, and ADDI events.
    pub add_events: Vec<(AluEvent, RTypeRecord)>,
    /// A trace of the MUL events.
    pub mul_events: Vec<(AluEvent, RTypeRecord)>,
    /// A trace of load word instructions.
    pub memory_load_word_events: Vec<(MemInstrEvent, ITypeRecord)>,
    /// A trace of store word instructions.
    pub memory_store_word_events: Vec<(MemInstrEvent, ITypeRecord)>,
    // article의 "syscall/precompile events"
    /// A trace of the precompile events.
    pub precompile_events: PrecompileEvents,
    // article의 memory boundary — shard 경계에서 global memory 상태를
    // 초기화/확정하는 event
    /// A trace of the global memory initialize events.
    pub global_memory_initialize_events: Vec<MemoryInitializeFinalizeEvent>,
    /// A trace of the global memory finalize events.
    pub global_memory_finalize_events: Vec<MemoryInitializeFinalizeEvent>,
    // article의 "public values" — record가 담는 witness의 일부로, shard
    // 경계 state(PC·clock 등)도 여기 함께 들어간다
    pub public_values: PublicValues<u32, u64, u64, u32>,
    // ... 나머지 수십 개 event 필드 생략 ...
}

impl ExecutionRecord {
    // split()(발췌) — 하나의 큰 record를 여러 shard(ExecutionRecord)로
    // 나눈다. article의 m_i^out=m_{i+1}^in — 이전 shard(last_record)의
    // public_values(종료 state)를 다음 blank shard의 시작 state로 그대로
    // 이어 붙이는 지점이 정확히 여기다.
    pub fn split(
        &mut self,
        done: bool,
        last_record: &mut ExecutionRecord,
        can_pack_global_memory: bool,
        opts: &SplitOpts,
    ) -> Vec<ExecutionRecord> {
        // ... precompile event를 threshold 단위로 나눠 여러 shard를 만드는
        // 부분 생략 ...

        if done {
            let mut blank_record = ExecutionRecord::new(
                self.program.clone(),
                self.public_values.proof_nonce,
                self.global_dependencies_opt,
            );

            // article의 m_i^out — 직전 shard(last_record)의 종료 state
            let last_record_public_values = last_record.public_values;

            // article의 m_{i+1}^in — 새 blank shard의 시작 state를 직전
            // shard의 종료 state로 채운다. 이 두 값이 같아야("이어져야")
            // 원래 한 실행이라는 article의 불변식이 실제로 여기서
            // 강제된다.
            blank_record
                .public_values
                .update_finalized_state_from_public_values(&last_record_public_values);

            // ... 이후 memory event를 blank_record 또는 last_record에
            // 채워 넣는 부분 생략 ...
        }

        Vec::new() // 실제로는 shards를 return — 발췌를 위해 단순화
    }
}
