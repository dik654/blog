import type { CodeRef } from './codeRefsTypes';

export const sdkCodeRefs: Record<string, CodeRef> = {
  'sdk-entry': {
    path: 'sp1/crates/sdk/src/lib.rs',
    lang: 'rust',
    highlight: [1, 24],
    desc: 'SP1 SDK는 zkVM과 상호작용하는 고수준 API를 제공합니다.\nProverClient로 CPU/CUDA/Network 백엔드를 선택하고\nprove(), verify(), execute() 메서드를 사용합니다.',
    code: `//! # SP1 SDK
//! A library for interacting with the SP1 RISC-V zkVM.

pub mod client;
pub mod cpu;
pub use cpu::CpuProver;
pub mod mock;
pub use mock::MockProver;
pub mod light;
pub use light::LightProver;
pub mod cuda;
pub use cuda::CudaProver;
pub mod env;

// Re-export the client.
pub use crate::client::ProverClient;

// Re-export proof and prover traits.
pub mod proof;
pub use proof::*;
pub mod prover;
pub use prover::{ProveRequest, Prover, ProvingKey, SP1VerificationError};

pub use sp1_build::include_elf;
pub use sp1_core_executor::{ExecutionReport, SP1Context};
pub use sp1_core_machine::io::SP1Stdin;
pub use sp1_prover::{HashableKey, SP1VerifyingKey, SP1_CIRCUIT_VERSION};`,
    annotations: [
      { lines: [4, 12], color: 'sky', note: '4가지 프로버 백엔드: CPU, Mock(테스트), Light, CUDA(GPU)' },
      { lines: [16, 16], color: 'emerald', note: 'ProverClient: 진입점. builder 패턴으로 백엔드 선택' },
      { lines: [21, 22], color: 'amber', note: 'Prover 트레이트: setup/prove/verify 인터페이스 정의' },
      { lines: [24, 27], color: 'violet', note: '핵심 re-export: ELF 로딩, stdin, 검증 키 등' },
    ],
  },

  'sdk-prover': {
    path: 'sp1/crates/sdk/src/prover.rs',
    lang: 'rust',
    highlight: [1, 26],
    desc: 'Prover 트레이트는 모든 증명 백엔드의 공통 인터페이스입니다.\nsetup()으로 검증 키를 생성하고, prove()로 증명을 만들고,\nverify()로 검증합니다.',
    code: `/// The entire user-facing functionality of a prover.
pub trait Prover: Clone + Send + Sync {
    type ProvingKey: ProvingKey;
    type Error: fmt::Debug + fmt::Display;
    type ProveRequest<'a>: ProveRequest<'a, Self> where Self: 'a;

    /// The inner LocalProver struct used by the prover.
    fn inner(&self) -> &SP1NodeCore;

    /// Setup the prover with the given ELF.
    fn setup(&self, elf: Elf) -> impl SendFutureResult<Self::ProvingKey, Self::Error>;

    /// Prove the given program on the given input.
    fn prove<'a>(&'a self, pk: &'a Self::ProvingKey, stdin: SP1Stdin)
        -> Self::ProveRequest<'a>;

    /// Execute the program on the given input.
    fn execute(&self, elf: Elf, stdin: SP1Stdin) -> ExecuteRequest<'_, Self> {
        ExecuteRequest::new(self, elf, stdin)
    }

    /// Verify the given proof.
    fn verify(
        &self, proof: &SP1ProofWithPublicValues,
        vkey: &SP1VerifyingKey, status_code: Option<StatusCode>,
    ) -> Result<(), SP1VerificationError>;
}`,
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'Clone+Send+Sync: 멀티스레드 안전. GAT로 ProveRequest 정의' },
      { lines: [10, 11], color: 'emerald', note: 'setup: ELF를 파싱하여 ProvingKey(+VerifyingKey) 생성' },
      { lines: [13, 15], color: 'amber', note: 'prove: 빌더 패턴 반환. .core()/.compressed()/.groth16() 체이닝' },
      { lines: [22, 26], color: 'violet', note: 'verify: public values 해시 + 증명 자체를 검증' },
    ],
  },
};
