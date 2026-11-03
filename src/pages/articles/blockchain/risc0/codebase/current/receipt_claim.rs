pub struct ReceiptClaim {
    /// The [SystemState] just before execution has begun.
    pub pre: MaybePruned<SystemState>,

    /// The [SystemState] just after execution has completed.
    pub post: MaybePruned<SystemState>,

    /// The exit code for the execution.
    pub exit_code: ExitCode,

    /// Input to the guest.
    pub input: MaybePruned<Option<Input>>,

    /// [Output] of the guest, including the journal and assumptions set during execution.
    pub output: MaybePruned<Option<Output>>,
}

impl ReceiptClaim {
    /// Construct a [ReceiptClaim] representing a zkVM execution that ended normally (i.e.
    /// Halted(0)) with the given image ID and journal.
    pub fn ok(
        image_id: impl Into<Digest>,
        journal: impl Into<MaybePruned<Vec<u8>>>,
    ) -> ReceiptClaim {
        Self {
            pre: MaybePruned::Pruned(image_id.into()),
            post: MaybePruned::Value(SystemState {
                pc: 0,
                merkle_root: Digest::ZERO,
            }),
            exit_code: ExitCode::Halted(0),
            input: None.into(),
            output: Some(Output {
                journal: journal.into(),
                assumptions: MaybePruned::Pruned(Digest::ZERO),
            })
            .into(),
        }
    }
}

impl Digestible for ReceiptClaim {
    /// Hash the [ReceiptClaim] to get a digest of the struct.
    fn digest<S: Sha256>(&self) -> Digest {
        let (sys_exit, user_exit) = self.exit_code.into_pair();
        tagged_struct::<S>(
            "risc0.ReceiptClaim",
            &[
                self.input.digest::<S>(),
                self.pre.digest::<S>(),
                self.post.digest::<S>(),
                self.output.digest::<S>(),
            ],
            &[sys_exit, user_exit],
        )
    }
}
