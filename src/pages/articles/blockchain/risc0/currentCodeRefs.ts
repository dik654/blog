import type { CodeRef } from "@/components/code/types";

import compositeChainRs from "./codebase/current/composite_chain.rs?raw";
import helloGuestRs from "./codebase/current/hello_guest.rs?raw";
import helloHostRs from "./codebase/current/hello_host.rs?raw";
import helloVerifyRs from "./codebase/current/hello_verify.rs?raw";
import integrityBoundaryRs from "./codebase/current/integrity_boundary.rs?raw";
import receiptClaimRs from "./codebase/current/receipt_claim.rs?raw";
import receiptShapeRs from "./codebase/current/receipt_shape.rs?raw";
import receiptVerifyRs from "./codebase/current/receipt_verify.rs?raw";
import sessionStatsRs from "./codebase/current/session_stats.rs?raw";

export const RISC0_COMMIT = "164c64bb3a844d393bb7addc5781c705c647f2d5";

export const currentCodeRefs: Record<string, CodeRef> = {
  "risc0-hello-guest": {
    path: "examples/hello-world/methods/guest/src/main.rs · lines 16–35",
    code: helloGuestRs,
    lang: "rust",
    highlight: [9, 19],
    desc: "공식 guest가 비공개 입력 17과 23을 읽고 checked_mul로 391을 계산한 뒤, 곱만 journal에 공개하는 경로입니다.",
    annotations: [
      { lines: [9, 12], color: "sky", note: "host가 넣은 두 u64를 guest가 읽음" },
      { lines: [13, 16], color: "amber", note: "1을 인수로 쓰는 경우를 guest 규칙으로 거절" },
      { lines: [18, 19], color: "emerald", note: "overflow를 확인하고 product만 journal에 commit" },
    ],
  },
  "risc0-hello-host": {
    path: "examples/hello-world/src/lib.rs · lines 18–51",
    code: helloHostRs,
    lang: "rust",
    highlight: [10, 25],
    desc: "Host가 두 입력을 ExecutorEnv에 넣고 MULTIPLY_ELF를 증명한 뒤, receipt의 공개 journal을 u64로 해석하는 공식 예제입니다.",
    annotations: [
      { lines: [10, 18], color: "sky", note: "두 입력은 executor 환경으로 전달" },
      { lines: [23, 25], color: "emerald", note: "고정 ELF를 실행·증명해 Receipt 획득" },
      { lines: [28, 31], color: "amber", note: "journal bytes를 같은 타입과 순서로 decode" },
    ],
  },
  "risc0-hello-verify": {
    path: "examples/hello-world/src/main.rs · lines 16–32",
    code: helloVerifyRs,
    lang: "rust",
    highlight: [10, 17],
    desc: "공식 verifier가 receipt를 받은 뒤 호출자에게 고정된 MULTIPLY_ID로 verify하는 마지막 단계입니다.",
    annotations: [
      { lines: [10, 10], color: "sky", note: "같은 17×23 fixture" },
      { lines: [15, 17], color: "emerald", note: "MULTIPLY_ID와 성공 종료·journal을 함께 확인" },
    ],
  },
  "risc0-receipt-shape": {
    path: "risc0/zkvm/src/receipt.rs · lines 114–130",
    code: receiptShapeRs,
    lang: "rust",
    highlight: [4, 17],
    desc: "Receipt의 세 부분입니다. inner와 journal은 검증 경로에 참여하지만 metadata는 암호학적으로 결속되지 않아 보안 정책의 근거가 될 수 없습니다.",
    annotations: [
      { lines: [4, 6], color: "sky", note: "실제 proof variant와 claim을 담는 inner" },
      { lines: [8, 11], color: "emerald", note: "guest가 공개한 journal" },
      { lines: [13, 17], color: "rose", note: "metadata는 보안 판단에 사용 금지" },
    ],
  },
  "risc0-receipt-verify": {
    path: "risc0/zkvm/src/receipt.rs · lines 163–194",
    code: receiptVerifyRs,
    lang: "rust",
    highlight: [13, 30],
    desc: "verify가 먼저 seal 무결성을 검사하고, 호출자가 준 ImageID와 현재 journal digest로 정상 종료 expected claim을 만들어 실제 claim digest와 비교하는 원문입니다.",
    annotations: [
      { lines: [6, 10], color: "amber", note: "metadata와 inner의 내부 형식 불일치 거절" },
      { lines: [13, 13], color: "sky", note: "seal과 inner claim의 암호학적 무결성 확인" },
      { lines: [18, 19], color: "emerald", note: "ImageID·Halted(0)·journal digest expected claim 생성" },
      { lines: [20, 29], color: "rose", note: "실제 claim digest가 다르면 거절" },
    ],
  },
  "risc0-integrity-boundary": {
    path: "risc0/zkvm/src/receipt.rs · lines 196–225",
    code: integrityBoundaryRs,
    lang: "rust",
    highlight: [4, 11],
    desc: "verify_integrity는 seal과 journal의 결속만 확인합니다. guest 성공 여부와 ImageID는 확인하지 않으므로 애플리케이션의 최종 승인 함수로 쓰면 안 됩니다.",
    annotations: [
      { lines: [4, 11], color: "rose", note: "성공 exit와 실행 guest를 확인하지 않는다고 명시" },
      { lines: [17, 21], color: "amber", note: "metadata 내부 불일치와 seal 무결성 검사" },
      { lines: [23, 29], color: "sky", note: "journal이 inner claim에 결속됐는지 보기 위한 claim open" },
    ],
  },
  "risc0-receipt-claim": {
    path: "risc0/zkvm/src/claim/receipt.rs · lines 56–94, 338–352",
    code: receiptClaimRs,
    lang: "rust",
    highlight: [18, 40],
    desc: "ReceiptClaim::ok가 ImageID를 pre에, Halted(0)을 exit에, journal digest를 output에 넣고 tagged_struct digest로 모든 필드를 결속하는 원문입니다.",
    annotations: [
      { lines: [1, 15], color: "sky", note: "pre·post·exit·input·output의 실제 claim 구조" },
      { lines: [25, 40], color: "emerald", note: "성공 execution의 expected claim 생성" },
      { lines: [47, 61], color: "amber", note: "tag와 네 field digest·exit pair를 함께 hash" },
    ],
  },
  "risc0-composite-chain": {
    path: "risc0/zkvm/src/receipt/composite.rs · lines 81–114",
    code: compositeChainRs,
    lang: "rust",
    highlight: [2, 34],
    desc: "Composite receipt가 각 비최종 segment의 proof, 이전 post→다음 pre 연결, SystemSplit, 빈 output을 순서대로 확인하는 경로입니다.",
    annotations: [
      { lines: [2, 9], color: "sky", note: "이전 post digest와 현재 pre digest 연결" },
      { lines: [11, 16], color: "amber", note: "비최종 segment는 SystemSplit이고 output이 없어야 함" },
      { lines: [17, 25], color: "emerald", note: "현재 post digest를 다음 expected pre로 저장" },
      { lines: [28, 34], color: "violet", note: "마지막 segment도 같은 연결을 확인" },
    ],
  },
  "risc0-session-stats": {
    path: "risc0/zkvm/src/host/prove_info.rs · lines 69–96",
    code: sessionStatsRs,
    lang: "rust",
    highlight: [4, 30],
    desc: "현재 main의 SessionStats 필드입니다. 예전 글의 단일 cycles 숫자 대신 segments·rows·padding rows·instructions·ecall/syscall·execution time을 따로 기록해야 합니다.",
    annotations: [
      { lines: [4, 15], color: "sky", note: "segments·rows·padding·instructions를 분리" },
      { lines: [17, 24], color: "amber", note: "ecall·syscall 비용 분포" },
      { lines: [26, 30], color: "emerald", note: "block 종류와 실행 시간" },
    ],
  },
};
