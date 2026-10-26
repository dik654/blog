// alloy-hardforks 0.4.11 · commit 52877c0 · forkcondition.rs 발췌입니다.

#[derive(Debug, Copy, Clone, PartialEq, Eq, PartialOrd, Ord, Default)]
pub enum ForkCondition {
    Block(BlockNumber),
    TTD {
        activation_block_number: BlockNumber,
        fork_block: Option<BlockNumber>,
        total_difficulty: U256,
    },
    Timestamp(u64),
    #[default]
    Never,
}

impl ForkCondition {
    pub const fn active_at_block(&self, current_block: BlockNumber) -> bool {
        matches!(self, Self::Block(block)
        | Self::TTD { activation_block_number: block, .. } if current_block >= *block)
    }

    pub fn active_at_ttd(&self, ttd: U256, difficulty: U256) -> bool {
        matches!(self, Self::TTD { total_difficulty, .. }
            if ttd.saturating_sub(difficulty) >= *total_difficulty)
    }

    pub const fn active_at_timestamp(&self, timestamp: u64) -> bool {
        matches!(self, Self::Timestamp(time) if timestamp >= *time)
    }
}
