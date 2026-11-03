// Selected excerpt from SP1 v6.10.0 crates/sdk/src/prover.rs.

pub trait Prover: Clone + Send + Sync {
    type ProvingKey: ProvingKey;
    type Error: fmt::Debug + fmt::Display;
    type ProveRequest<'a>: ProveRequest<'a, Self>
    where
        Self: 'a;

    fn inner(&self) -> &SP1NodeCore;

    fn version(&self) -> &str {
        SP1_CIRCUIT_VERSION
    }

    fn setup(&self, elf: Elf) -> impl SendFutureResult<Self::ProvingKey, Self::Error>;
    fn prove<'a>(&'a self, pk: &'a Self::ProvingKey, stdin: SP1Stdin) -> Self::ProveRequest<'a>;

    fn execute(&self, elf: Elf, stdin: SP1Stdin) -> ExecuteRequest<'_, Self> {
        ExecuteRequest::new(self, elf, stdin)
    }

    fn verify(
        &self,
        proof: &SP1ProofWithPublicValues,
        vkey: &SP1VerifyingKey,
        status_code: Option<StatusCode>,
    ) -> Result<(), SP1VerificationError> {
        verify_proof(self.inner(), self.version(), proof, vkey, status_code)
    }
}

pub(crate) fn verify_proof(
    node: &SP1NodeCore,
    version: &str,
    bundle: &SP1ProofWithPublicValues,
    vkey: &SP1VerifyingKey,
    status_code: Option<StatusCode>,
) -> Result<(), SP1VerificationError> {
    let status_code = status_code.unwrap_or(StatusCode::SUCCESS);

    if bundle.sp1_version != version {
        return Err(SP1VerificationError::VersionMismatch(bundle.sp1_version.clone()));
    }

    // The full source then checks mode-specific exit codes and public-values digests
    // before calling node.verify(vkey, &bundle.proof).
    node.verify(vkey, &bundle.proof).map_err(|e| match bundle.proof {
        SP1Proof::Core(_) => SP1VerificationError::Core(e),
        SP1Proof::Compressed(_) => SP1VerificationError::Recursion(e),
        SP1Proof::Plonk(_) => SP1VerificationError::Plonk(e),
        SP1Proof::Groth16(_) => SP1VerificationError::Groth16(e),
    })
}
