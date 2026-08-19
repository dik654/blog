import type { CodeRef } from "@/components/code/types";
import bashValidatorPy from "./codebase/claude-code/examples/hooks/bash_command_validator_example.py?raw";
import pretooluseePy from "./codebase/claude-code/plugins/hookify/hooks/pretooluse.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "bash-validator-hook": {
    path: "claude-code/examples/hooks/bash_command_validator_example.py",
    code: bashValidatorPy,
    lang: "python",
    highlight: [43, 74],
    desc: "문제: a_t=P(s_t), o_t=E(G(a_t)) 식에서 model이 제안한 action이 실제로 실행되기 전에 runtime gate G를 통과해야 한다는 claim의 가장 단순한 실제 예시를 확인해야 합니다.\n\n해결: 공식 PreToolUse hook 예제가 stdin으로 tool_use 제안(a_t)을 받아 command를 검사하고, exit code(0=허용, 2=차단)로 gate 판정을 돌려줍니다.",
    annotations: [
      { lines: [44, 51], color: "sky", note: "article의 a_t — Claude가 제안한 tool_use가 stdin JSON으로 hook에 전달됨" },
      { lines: [54, 57], color: "emerald", note: "article의 G — scope 밖 tool은 그냥 통과(exit 0)" },
      { lines: [65, 74], color: "amber", note: "article의 G(a_t)=deny/allow — exit code 2면 E가 실행되지 않고 거부 사유만 다음 state로, exit 0이면 실제 실행" },
    ],
  },
  "hookify-pretooluse": {
    path: "claude-code/plugins/hookify/hooks/pretooluse.py",
    code: pretooluseePy,
    lang: "python",
    highlight: [22, 51],
    desc: "문제: \"File operation, search, shell execution, web, code intelligence는 서로 다른 effect를 낸다\"는 claim이 실제 gate 코드에서 어떻게 tool 종류별로 분류되는지 확인해야 합니다.\n\n해결: hookify plugin의 PreToolUse hook이 tool_name을 bash/file 두 event로 분류해 서로 다른 rule set을 적용하고, 나머지 tool 종류는 이 gate의 scope 밖으로 남깁니다.",
    annotations: [
      { lines: [33, 37], color: "sky", note: "article의 tool effect 구분 — Bash(process effect)와 Edit/Write/MultiEdit(workspace mutation)를 다른 event로 분류" },
      { lines: [42, 45], color: "emerald", note: "article의 G(a_t) 판정 — rule engine이 allow/deny/warn을 결정" },
      { lines: [47, 50], color: "amber", note: "search·web·delegation 등 나머지 tool 종류는 이 특정 gate의 scope 밖임을 보여줌" },
    ],
  },
};
