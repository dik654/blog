import type { CodeRef } from "@/components/code/types";
import fibonacciRs from "./codebase/sp1/examples/fibonacci/program/src/main.rs?raw";
import programRs from "./codebase/sp1/crates/core/executor/src/program.rs?raw";
import recordRs from "./codebase/sp1/crates/core/executor/src/record.rs?raw";
import coreVerifyRs from "./codebase/sp1/crates/prover/src/verify.rs?raw";
import proofRs from "./codebase/sp1/crates/sdk/src/proof.rs?raw";
import proverRs from "./codebase/sp1/crates/sdk/src/prover.rs?raw";
import tensorRs from "./codebase/sp1/slop/crates/tensor/src/inner.rs?raw";

export const SP1_VERSION = "v6.10.0";
export const SP1_COMMIT = "d83ed91f96701209613720708f36ffce0e98ed33";

export const codeRefsReal: Record<string, CodeRef> = {
  "sp1-fibonacci": {
    path: "sp1/examples/fibonacci/program/src/main.rs",
    code: fibonacciRs,
    lang: "rust",
    highlight: [7, 23],
    desc: "공식 Fibonacci guest가 stdin에서 n을 읽고 무엇을 어떤 순서로 public values에 commit하는지 확인합니다. n=10이면 n·a·b는 10·55·89입니다.",
    annotations: [
      { lines: [8, 10], color: "sky", note: "stdin의 n을 읽고 첫 public value로 commit" },
      { lines: [12, 19], color: "emerald", note: "a=0, b=1에서 n번 반복해 F(n), F(n+1) 계산" },
      { lines: [21, 22], color: "amber", note: "두 번째와 세 번째 public value를 순서대로 commit" },
    ],
  },
  "sp1-program": {
    path: "sp1/crates/core/executor/src/program.rs",
    code: programRs,
    lang: "rust",
    highlight: [3, 53],
    desc: "소스 이름이 아니라 executor가 실제로 읽는 ELF bytes가 instruction·PC·memory image를 가진 Program으로 바뀌는 경계입니다.",
    annotations: [
      { lines: [3, 15], color: "sky", note: "Program identity에 들어가는 instruction·PC·memory fields" },
      { lines: [19, 30], color: "emerald", note: "ELF decode와 RV64IM instruction transpile" },
      { lines: [32, 37], color: "amber", note: "빈 ELF와 최대 program size를 거절" },
    ],
  },
  "sp1-record": {
    path: "sp1/crates/core/executor/src/record.rs",
    code: recordRs,
    lang: "rust",
    highlight: [3, 27],
    desc: "ExecutionRecord가 instruction count가 아니라 CPU·ALU·branch·memory·syscall·public values와 shard boundary를 함께 담는 witness artifact임을 보여 줍니다.",
    annotations: [
      { lines: [3, 12], color: "sky", note: "CPU·ALU·control-flow event fields" },
      { lines: [13, 20], color: "emerald", note: "memory·precompile·syscall·global interaction fields" },
      { lines: [21, 27], color: "amber", note: "public values, timestamp, PC와 exit boundary" },
    ],
  },
  "sp1-core-verify": {
    path: "sp1/crates/prover/src/verify.rs",
    code: coreVerifyRs,
    lang: "rust",
    highlight: [3, 41],
    desc: "Core verifier가 각 shard proof의 유효성만 보는 것이 아니라 timestamp와 program counter를 앞 shard의 끝에서 다음 shard의 시작으로 연결하는 실제 검사입니다.",
    annotations: [
      { lines: [3, 14], color: "sky", note: "last_timestamp → next initial_timestamp 연속성" },
      { lines: [16, 35], color: "emerald", note: "VK start PC와 shard nextPC → next startPC 연속성" },
      { lines: [37, 41], color: "amber", note: "마지막 next PC가 HALT_PC인지 확인" },
    ],
  },
  "sp1-proof": {
    path: "sp1/crates/sdk/src/proof.rs",
    code: proofRs,
    lang: "rust",
    highlight: [3, 35],
    desc: "Core·Compressed·PLONK·Groth16의 네 proof variants와 proof·public values·version을 묶은 receipt, wrapper의 vkey/PV hash 검사를 한 화면에서 봅니다.",
    annotations: [
      { lines: [3, 8], color: "sky", note: "서로 목적과 verifier가 다른 네 proof modes" },
      { lines: [10, 15], color: "emerald", note: "proof·public_values·sp1_version을 묶은 receipt" },
      { lines: [21, 31], color: "amber", note: "wrapper public inputs의 vkey hash와 public-values hash 검사" },
    ],
  },
  "sp1-prover": {
    path: "sp1/crates/sdk/src/prover.rs",
    code: proverRs,
    lang: "rust",
    highlight: [3, 31],
    desc: "User-facing lifecycle이 setup·prove·execute·verify로 나뉘는 이유와 각 단계의 artifact를 확인합니다.",
    annotations: [
      { lines: [14, 16], color: "sky", note: "ELF→PK/VK setup과 proof request" },
      { lines: [18, 20], color: "emerald", note: "proof를 만들지 않는 execute 경로" },
      { lines: [22, 30], color: "amber", note: "proof·VK·expected status를 받는 verify 경로" },
    ],
  },
  "sp1-verification": {
    path: "sp1/crates/sdk/src/prover.rs",
    code: proverRs,
    lang: "rust",
    highlight: [33, 53],
    desc: "Receipt version을 먼저 확인하고 mode별 verifier에 expected VK를 전달하는 SDK 경계입니다. Full source는 이 사이에서 exit code와 public-values digest도 검사합니다.",
    annotations: [
      { lines: [40, 44], color: "sky", note: "bundle version과 현재 circuit version mismatch 거절" },
      { lines: [48, 53], color: "emerald", note: "expected vkey로 mode별 proof 검증" },
    ],
  },
  "sp1-tensor-shape": {
    path: "sp1/slop/crates/tensor/src/inner.rs",
    code: tensorRs,
    lang: "rust",
    highlight: [3, 43],
    desc: "v6.8.1 security fix 이후 tensor의 declared dimensions와 physical storage length를 같게 강제하고, 2×2인데 원소가 3개 또는 5개인 bincode를 거절하는 회귀 테스트입니다.",
    annotations: [
      { lines: [8, 20], color: "sky", note: "expected dimensions product와 actual storage length 비교" },
      { lines: [22, 24], color: "emerald", note: "verifier가 재사용하는 physical shape predicate" },
      { lines: [27, 43], color: "amber", note: "appended/truncated storage negative fixtures" },
    ],
  },
};
