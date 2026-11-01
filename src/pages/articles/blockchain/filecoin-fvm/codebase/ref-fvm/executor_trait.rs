// ref-fvm fvm@v4.8.4 · fvm/src/executor/mod.rs
// Message 적용과 마지막 state-tree flush가 별도 API라는 점을 보여 주는 발췌입니다.

pub trait Executor {
    type Kernel: Kernel;

    /// Message 한 건을 적용하고 ApplyRet을 반환합니다.
    fn execute_message(
        &mut self,
        msg: Message,
        apply_kind: ApplyKind,
        raw_length: usize,
    ) -> anyhow::Result<ApplyRet>;

    /// State tree를 flush하고 새 root CID를 반환합니다.
    fn flush(&mut self) -> anyhow::Result<Cid>;
}

pub struct ApplyRet {
    /// Chain에 기록되는 message receipt입니다.
    pub msg_receipt: Receipt,
    pub penalty: TokenAmount,
    pub miner_tip: TokenAmount,
    pub base_fee_burn: TokenAmount,
    pub over_estimation_burn: TokenAmount,
    pub refund: TokenAmount,
    pub gas_refund: u64,
    pub gas_burned: u64,
    // ... failure_info, trace, events, return codec ...
}
