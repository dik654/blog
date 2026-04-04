import type { CodeRef } from './codeRefsTypes';

export const cpuCodeRefs: Record<string, CodeRef> = {
  'cpu-prover': {
    path: 'sp1/crates/sdk/src/cpu/mod.rs',
    lang: 'rust',
    highlight: [1, 22],
    desc: 'CpuProver는 CPU 기반 증명 백엔드입니다.\nSP1LocalNode를 내부에 보유하고, Prover 트레이트를 구현합니다.',
    code: `/// A prover that uses the CPU to execute and prove programs.
#[derive(Clone)]
pub struct CpuProver {
    pub(crate) prover: Arc<SP1LocalNode>,
}

impl Prover for CpuProver {
    type ProvingKey = SP1ProvingKey;
    type Error = CPUProverError;
    type ProveRequest<'a> = CpuProveBuilder<'a>;

    fn inner(&self) -> &SP1NodeCore { self.prover.core() }

    fn setup(&self, elf: Elf) -> impl SendFutureResult<..> {
        async move {
            let vk = self.prover.setup(&elf).await?;
            Ok(SP1ProvingKey { vk, elf })
        }
    }

    fn prove<'a>(&'a self, pk: &'a Self::ProvingKey, stdin: SP1Stdin)
        -> Self::ProveRequest<'a> {
        CpuProveBuilder::new(self, pk, stdin)
    }
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'SP1LocalNode: 로컬 워커 노드. 실행+증명을 모두 처리' },
      { lines: [14, 18], color: 'emerald', note: 'setup: ELF로부터 VerifyingKey 생성. async로 병렬 처리 가능' },
      { lines: [21, 24], color: 'amber', note: 'CpuProveBuilder: .core()/.compressed()/.groth16() 체이닝 지원' },
    ],
  },
};
