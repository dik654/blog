/// Struct containing information about a prover's cycle count after running the guest program
#[derive(Clone, Default, Debug, Serialize, Deserialize)]
#[non_exhaustive]
pub struct SessionStats {
    /// Count of segments in this proof request
    pub segments: usize,

    /// Total rows generated during this session
    pub row_count: u64,

    /// Empty rows used to reach a power of two
    pub padding_row_count: u64,

    /// Total number of riscv instructions ran during this session
    pub insn_count: u64,

    /// ecall metrics grouped by kind.
    pub ecall_metrics: EnumMap<EcallKind, Option<EcallMetric>>,

    /// syscall metrics grouped by kind.
    pub syscall_metrics: EnumMap<SyscallKind, Option<SyscallMetric>>,

    /// count of different block types.
    pub block_counts: Option<EnumMap<BlockType, u64>>,

    /// Execution elapsed time.
    pub execution_time: Option<Duration>,
}
