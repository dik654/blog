// succinctlabs/sp1 저장소 · crates/sdk/src/prover.rs (v6.4.0, commit
// f66b4bf, 2026년 8월 기준 이 글이 인용하는 SHA). 전체 263줄 중 Prover
// trait 정의만 발췌했습니다. ProveRequest/ExecuteRequest 구현 세부와
// error type 정의는 생략했습니다.
// 본문 대응: proof-receipt/proof-pipeline section의 "Program setup,
// execution, proof construction과 verification을 stable SDK 경계로
// 제공"이라는 claim의 실제 trait 정의.

/// A trait that each prover variant must implement.
pub trait Prover: Clone + Send + Sync {
    /// The proving key used for this prover type.
    type ProvingKey: ProvingKey;

    /// The possible errors that can occur when proving.
    type Error: fmt::Debug + fmt::Display;

    /// The prove request builder.
    type ProveRequest<'a>: ProveRequest<'a, Self>
    where
        Self: 'a;

    /// The inner [`LocalProver`] struct used by the prover.
    fn inner(&self) -> &SP1NodeCore;

    /// The version of the current SP1 circuit.
    fn version(&self) -> &str {
        SP1_CIRCUIT_VERSION
    }

    // article의 "Program artifact"(ELF/VK) 생성 — setup이 article의 A_P
    // 계산에 필요한 ProvingKey(VK 포함)를 만든다
    /// Setup the prover with the given ELF.
    fn setup(&self, elf: Elf) -> impl SendFutureResult<Self::ProvingKey, Self::Error>;

    // article의 proof mode(core/compressed/plonk/groth16)를 만드는 진입점
    /// Prove the given program on the given input in the given proof mode.
    fn prove<'a>(&'a self, pk: &'a Self::ProvingKey, stdin: SP1Stdin) -> Self::ProveRequest<'a>;

    // article의 execution-shards section — ExecutionRecord를 만드는
    // 단계(proof 없이 실행만)
    /// Execute the program on the given input.
    fn execute(&self, elf: Elf, stdin: SP1Stdin) -> ExecuteRequest<'_, Self> {
        ExecuteRequest::new(self, elf, stdin)
    }

    // article의 R=H(d_S‖mode‖H(π)‖v) 검증 — statement digest와 mode·버전이
    // 맞는지 확인
    /// Verify the given proof.
    ///
    /// Note: If the status code is not set, the verification process will check for success.
    fn verify(
        &self,
        proof: &SP1ProofWithPublicValues,
        vkey: &SP1VerifyingKey,
        status_code: Option<StatusCode>,
    ) -> Result<(), SP1VerificationError> {
        verify_proof(self.inner(), self.version(), proof, vkey, status_code)
    }
}

/// A trait that represents a prover's proving key.
pub trait ProvingKey: Clone + Send + Sync {
    /// Get the verifying key corresponding to the proving key.
    fn verifying_key(&self) -> &SP1VerifyingKey;

    /// Get the ELF corresponding to the proving key.
    fn elf(&self) -> &Elf;
}
