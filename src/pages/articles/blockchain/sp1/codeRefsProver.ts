import type { CodeRef } from './codeRefsTypes';

export const proverCodeRefs: Record<string, CodeRef> = {
  'prover-entry': {
    path: 'sp1/crates/prover/src/lib.rs',
    lang: 'rust',
    highlight: [1, 18],
    desc: 'SP1 Prover 크레이트는 Core/Recursion/SNARK 증명의 진입점입니다.\nSP1_CIRCUIT_VERSION으로 증명 호환성을 관리하고\nPlonky3 기반 컴포넌트들을 조합합니다.',
    code: `pub mod build;
mod components;
pub mod recursion;
pub mod shapes;
mod types;
pub mod utils;
pub mod verify;
pub mod worker;

pub use types::*;
pub use components::*;

/// The global version for all components of SP1.
///
/// This string should be updated whenever any step in verifying
/// an SP1 proof changes, including core, recursion, and plonk-bn254.
/// This string is used to download SP1 artifacts and the gnark
/// docker image.
pub const SP1_CIRCUIT_VERSION: &str = include_str!("../SP1_CIRCUIT_VERSION");

pub use sp1_hypercube::{HashableKey, SP1VerifyingKey};`,
    annotations: [
      { lines: [1, 8], color: 'sky', note: '모듈 구성: build(회로), recursion(재귀), verify(검증), worker(병렬)' },
      { lines: [13, 19], color: 'emerald', note: '버전 관리: core/recursion/plonk 변경 시 반드시 업데이트' },
      { lines: [21, 21], color: 'amber', note: 'sp1_hypercube: Plonky3 기반 증명 시스템의 핵심 라이브러리' },
    ],
  },

  'vm-ecall': {
    path: 'sp1/crates/core/executor/src/vm.rs',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'ECALL(시스템 콜)은 SHA256, keccak256 등 암호화 연산을\n최적화된 프리컴파일로 실행합니다.\nX10/X11 레지스터에서 인자를 읽고, X5에 결과를 기록합니다.',
    code: `/// Execute an ecall instruction.
pub fn execute_ecall<RT>(
    rt: &mut RT,
    instruction: &Instruction,
    code: SyscallCode,
) -> Result<EcallResult, ExecutionError>
where
    RT: SyscallRuntime<'a>,
{
    let core = rt.core_mut();

    // Read arguments from a0 (X10) and a1 (X11)
    let c_record = core.rr(Register::X11, MemoryAccessPosition::C);
    let b_record = core.rr(Register::X10, MemoryAccessPosition::B);
    let c = c_record.value;
    let b = b_record.value;

    let a = if code == SyscallCode::ENTER_UNCONSTRAINED {
        0  // unconstrained mode skips execution
    } else {
        sp1_ecall_handler(rt, code, b, c).unwrap_or(code as u64)
    };

    let core = rt.core_mut();
    // Write result to t0 (X5)
    let a_record = core.rw(Register::X5, a);
    // Add 256 to next clock to account for the ecall.
    core.set_next_clk(core.next_clk() + 256);

    Ok(EcallResult { a, a_record, b, b_record, c, c_record })
}`,
    annotations: [
      { lines: [2, 8], color: 'sky', note: 'SyscallRuntime 트레이트로 프리컴파일 핸들러 주입' },
      { lines: [12, 16], color: 'emerald', note: 'RISC-V ABI: a0(X10), a1(X11)에서 시스템 콜 인자 읽기' },
      { lines: [18, 22], color: 'amber', note: 'ENTER_UNCONSTRAINED: 증명 없이 실행. 힌트 생성에 사용' },
      { lines: [25, 28], color: 'violet', note: 't0(X5)에 결과 기록. 클럭 +256으로 ecall 비용 반영' },
    ],
  },
};
