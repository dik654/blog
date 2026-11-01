import type { CodeRef } from "@/components/code/types";
import executorRs from "./codebase/ref-fvm/executor.rs?raw";
import executorTraitRs from "./codebase/ref-fvm/executor_trait.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "fvm-machine": {
    path: "fvm/src/executor/default.rs · fvm@v4.8.4 발췌",
    code: executorRs,
    lang: "rust",
    highlight: [4, 86],
    desc: "실제 ref-fvm v4.8.4에서 사전 검사, actor-call transaction, receipt와 message-level gas 정산 경계를 순서대로 발췌했습니다.",
    annotations: [
      {
        lines: [10, 15],
        color: "sky",
        note: "Actor 실행 전에 preflight_message가 sender와 gas costs를 만들거나 조기 ApplyRet을 반환합니다.",
      },
      {
        lines: [19, 29],
        color: "emerald",
        note: "Actor 호출만 with_transaction 안에 있습니다. Sender sequence·gas 확보는 그보다 먼저 일어납니다.",
      },
      {
        lines: [33, 38],
        color: "amber",
        note: "Receipt에는 exit code·return data·gas·events root가 들어가며 state root는 없습니다.",
      },
      {
        lines: [68, 81],
        color: "rose",
        note: "Preflight가 sender sequence를 올리고 최대 gas 비용을 먼저 확보합니다.",
      },
      {
        lines: [84, 104],
        color: "violet",
        note: "Actor 호출 뒤 burn·tip·refund를 working state에 반영합니다.",
      },
    ],
  },
  "fvm-flush": {
    path: "fvm/src/executor/mod.rs · fvm@v4.8.4 발췌",
    code: executorTraitRs,
    lang: "rust",
    highlight: [4, 17],
    desc: "Executor interface에서 message 한 건의 ApplyRet과 전체 state-tree flush가 별도 method임을 확인합니다.",
    annotations: [
      {
        lines: [7, 13],
        color: "sky",
        note: "execute_message는 message 한 건의 ApplyRet을 반환합니다.",
      },
      {
        lines: [15, 16],
        color: "emerald",
        note: "호출자가 적용을 끝낸 뒤 별도의 flush가 새 state-root CID를 반환합니다.",
      },
      {
        lines: [19, 29],
        color: "amber",
        note: "ApplyRet은 receipt와 gas 결과를 담지만 state root 필드는 없습니다.",
      },
    ],
  },
};
