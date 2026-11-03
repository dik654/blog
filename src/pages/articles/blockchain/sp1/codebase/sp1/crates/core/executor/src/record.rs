// Selected excerpt from SP1 v6.10.0 crates/core/executor/src/record.rs.

pub struct ExecutionRecord {
    pub program: Arc<Program>,
    pub cpu_event_count: u32,
    pub add_events: Vec<(AluEvent, RTypeRecord)>,
    pub mul_events: Vec<(AluEvent, RTypeRecord)>,
    pub branch_events: Vec<(BranchEvent, ITypeRecord)>,
    pub jal_events: Vec<(JumpEvent, JTypeRecord)>,
    pub jalr_events: Vec<(JumpEvent, ITypeRecord)>,
    pub memory_load_word_events: Vec<(MemInstrEvent, ITypeRecord)>,
    pub memory_store_word_events: Vec<(MemInstrEvent, ITypeRecord)>,
    pub precompile_events: PrecompileEvents,
    pub global_memory_initialize_events: Vec<MemoryInitializeFinalizeEvent>,
    pub global_memory_finalize_events: Vec<MemoryInitializeFinalizeEvent>,
    pub cpu_local_memory_access: Vec<MemoryLocalEvent>,
    pub syscall_events: Vec<(SyscallEvent, RTypeRecord)>,
    pub global_interaction_events: Vec<GlobalInteractionEvent>,
    pub instruction_fetch_events: Vec<(InstructionFetchEvent, MemoryAccessRecord)>,
    pub instruction_decode_events: Vec<InstructionDecodeEvent>,
    pub public_values: PublicValues<u32, u64, u64, u32>,
    pub initial_timestamp: u64,
    pub last_timestamp: u64,
    pub pc_start: Option<u64>,
    pub next_pc: u64,
    pub exit_code: u32,
}

impl ExecutionRecord {
    pub fn split(
        &mut self,
        done: bool,
        last_record: &mut ExecutionRecord,
        can_pack_global_memory: bool,
        opts: &SplitOpts,
    ) -> Vec<ExecutionRecord> {
        let mut shards = Vec::new();
        let precompile_events = take(&mut self.precompile_events);

        for (syscall_code, events) in precompile_events.into_iter() {
            let threshold: usize = opts.syscall_threshold[syscall_code];
            let chunks = events.chunks_exact(threshold);
            // Each returned record receives the same program and proof nonce.
            // The full source also packs memory/page-protection boundaries.
            let mut event_shards = chunks
                .map(|chunk| {
                    let mut record = ExecutionRecord::new(
                        self.program.clone(),
                        self.public_values.proof_nonce,
                        self.global_dependencies_opt,
                    );
                    record.precompile_events.insert(syscall_code, chunk.to_vec());
                    record
                })
                .collect::<Vec<_>>();
            shards.append(&mut event_shards);
        }

        shards
    }
}
