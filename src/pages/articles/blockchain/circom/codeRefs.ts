import type { CodeRef } from "@/components/code/types";
import assignOpRs from "./codebase/circom/assign_op.rs?raw";
import assignmentBranchRs from "./codebase/circom/assignment_branch.rs?raw";
import constraintEqualityRs from "./codebase/circom/constraint_equality.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "assign-op": {
    path: "program_structure/src/abstract_syntax_tree/ast.rs:360–365",
    code: assignOpRs.trimEnd(),
    lang: "rust",
    highlight: [1, 6],
    desc: "iden3/circom v2.2.3 · 일반 변수 대입, signal 대입, constraint를 포함한 signal 대입을 서로 다른 연산으로 보존하는 원문",
    annotations: [
      {
        lines: [1, 6],
        color: "sky",
        note: "AssignSignal과 AssignConstraintSignal이 AST 단계부터 다른 값이므로 single arrow와 double arrow를 같은 동작으로 취급하지 않습니다.",
      },
    ],
  },
  "assignment-branch": {
    path: "constraint_generation/src/execute.rs:450–478",
    code: assignmentBranchRs.trimEnd(),
    lang: "rust",
    highlight: [1, 29],
    desc: "iden3/circom v2.2.3 · double-arrow 대입은 quadratic form을 constraint로 추가하고, single-arrow 대입은 inspect에서 경고 후보가 되는 원문",
    annotations: [
      {
        lines: [1, 16],
        color: "emerald",
        note: "AssignConstraintSignal은 우변이 quadratic인지 확인하고 lhs-rhs를 constraint form으로 바꾼 뒤 node에 추가합니다.",
      },
      {
        lines: [17, 29],
        color: "amber",
        note: "AssignSignal은 같은 constraint를 추가하지 않습니다. 우변이 quadratic이면 --inspect가 double arrow를 쓰라는 경고 후보로 모읍니다.",
      },
    ],
  },
  "constraint-equality": {
    path: "constraint_generation/src/execute.rs:650–658",
    code: constraintEqualityRs.trimEnd(),
    lang: "rust",
    highlight: [1, 9],
    desc: "iden3/circom v2.2.3 · ===의 양변 차이를 constraint form으로 바꿔 회로 노드에 추가하는 핵심 원문",
    annotations: [
      {
        lines: [1, 9],
        color: "violet",
        note: "Constraint equality는 계산 결과를 signal에 대입하지 않고, 이미 있는 두 식의 차이가 0이어야 한다는 행을 추가합니다.",
      },
    ],
  },
};
