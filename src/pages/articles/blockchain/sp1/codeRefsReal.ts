import type { CodeRef } from "@/components/code/types";
import programRs from "./codebase/sp1/crates/core/executor/src/program.rs?raw";
import recordRs from "./codebase/sp1/crates/core/executor/src/record.rs?raw";
import proofRs from "./codebase/sp1/crates/sdk/src/proof.rs?raw";
import proverRs from "./codebase/sp1/crates/sdk/src/prover.rs?raw";

export const codeRefsReal: Record<string, CodeRef> = {
  "sp1-program": {
    path: "sp1/crates/core/executor/src/program.rs",
    code: programRs,
    lang: "rust",
    highlight: [17, 48],
    desc: "문제: A_P=H(d_src‖d_tool‖H(ELF)‖H(VK)‖d_schema‖v) 식에서 H(ELF) 대상이 되는 \"parsed ELF\" artifact가 실제로 어떤 구조인지 확인해야 합니다.\n\n해결: Program struct가 ELF에서 파싱한 instructions와 memory_image, 시작 주소(pc_start_abs)를 담습니다.",
    annotations: [
      { lines: [20, 21], color: "sky", note: "article의 ELF instructions — parse된 실행 명령어 목록" },
      { lines: [26, 27], color: "emerald", note: "article의 program artifact identity 중 실행 시작점" },
      { lines: [35, 36], color: "amber", note: "article의 memory image — 전역 상수 등 초기 메모리" },
    ],
  },
  "sp1-record": {
    path: "sp1/crates/core/executor/src/record.rs",
    code: recordRs,
    lang: "rust",
    highlight: [10, 80],
    desc: "문제: ExecutionRecord가 \"단순 instruction count가 아니라 CPU·memory·syscall/precompile events와 public values를 담는 witness artifact\"라는 주장과, shard 연속성 식 m_i^out=m_{i+1}^in이 실제로 어떻게 구현되는지 확인해야 합니다.\n\n해결: ExecutionRecord struct가 event trace들과 public_values를 함께 담고, split()이 이전 shard의 종료 state를 다음 shard의 시작 state로 그대로 이어붙입니다.",
    annotations: [
      { lines: [18, 25], color: "sky", note: "article의 CPU/memory events — 대표 event trace 필드 (실제로는 수십 개)" },
      { lines: [27, 34], color: "emerald", note: "article의 syscall/precompile events와 memory boundary event" },
      { lines: [63, 72], color: "amber", note: "article의 m_i^out=m_{i+1}^in — 이전 shard 종료 state를 다음 shard 시작 state로 그대로 이어붙임" },
    ],
  },
  "sp1-proof": {
    path: "sp1/crates/sdk/src/proof.rs",
    code: proofRs,
    lang: "rust",
    highlight: [17, 62],
    desc: "문제: d_S=H(vkHash‖H(PV)) 식 — statement digest가 vkey hash와 public values hash의 결속으로 만들어진다는 주장이 실제 코드에서 확인되는지 봐야 합니다.\n\n해결: verify_mock_public_inputs가 정확히 vkey.hash_bn254()와 public_values.hash_bn254()를 비교하고, SP1ProofWithPublicValues struct가 proof·public_values·sp1_version을 함께 묶습니다.",
    annotations: [
      { lines: [22, 30], color: "sky", note: "article의 vkHash — verification key의 canonical identity 검사" },
      { lines: [32, 40], color: "emerald", note: "article의 H(PV) — public values hash 검사" },
      { lines: [52, 61], color: "amber", note: "article의 receipt 필드 — mode(proof 안에 포함)·public_values·sp1_version이 한 struct에" },
    ],
  },
  "sp1-prover": {
    path: "sp1/crates/sdk/src/prover.rs",
    code: proverRs,
    lang: "rust",
    highlight: [10, 59],
    desc: "문제: \"Program setup, execution, proof construction과 verification을 stable SDK 경계로 제공\"한다는 주장이 실제로 어느 trait에서 확인되는지 봐야 합니다.\n\n해결: Prover trait이 setup/prove/execute/verify 네 메서드로 이 경계를 정의합니다.",
    annotations: [
      { lines: [30, 33], color: "sky", note: "article의 program artifact 생성 — setup이 ProvingKey(VK 포함)를 만듦" },
      { lines: [35, 37], color: "emerald", note: "article의 proof mode 생성 진입점" },
      { lines: [39, 44], color: "amber", note: "article의 execution-shards — proof 없이 실행만 하는 execute" },
      { lines: [46, 58], color: "violet", note: "article의 receipt 검증 — statement digest·mode·버전 확인" },
    ],
  },
};
