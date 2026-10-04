import type { CodeRef, FileNode } from "@/components/code/types";
import result from "./codebase/claude-docs/tool-result.py?raw";
export const codeRefs: Record<string, CodeRef> = {
  result: {
    path: "Claude Platform Docs / tool-result.py",
    code: result,
    lang: "python",
    highlight: [1, 9],
    desc: "공식 Tool use overview의 client tool 왕복 예제에서 messages에 원 응답과 tool_result를 추가하는 9줄을 그대로 발췌했습니다. 2026-10-04 확인. 실제 호출과 결과를 같은 ID로 묶습니다.",
    annotations: [
      {
        lines: [2, 2],
        color: "sky",
        note: "도구 호출이 들어 있는 원래 assistant 응답을 먼저 보존합니다.",
      },
      {
        lines: [6, 6],
        color: "emerald",
        note: "실행 결과를 tool_use.id와 연결합니다. 결과 순서나 도시 이름을 추측해서 붙이지 않습니다.",
      },
    ],
  },
};
export const fileTrees: Record<string, FileNode> = {
  docs: {
    name: "공식 문서 발췌",
    type: "dir",
    children: [{ name: "tool-result.py", type: "file", codeKey: "result" }],
  },
};
