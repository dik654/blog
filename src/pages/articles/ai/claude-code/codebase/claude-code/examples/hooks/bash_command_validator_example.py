#!/usr/bin/env python3
# anthropics/claude-code 저장소 · examples/hooks/bash_command_validator_example.py
# (main branch, commit c3d2e35, 2026년 8월 기준). 83줄 전체를 거의 그대로
# 실었습니다(주석만 Korean 대응 추가).
# 본문 대응: agent-loop section의 a_t=P(s_t), o_t=E(G(a_t)) — Claude가
# 제안한 action(a_t)이 실제로 실행(E)되기 전에 runtime gate(G)를 통과해야
# 한다는 claim의 가장 단순한 실제 예시. 이 hook은 PreToolUse 시점에
# stdin으로 tool_use 제안을 받아 gate 판정을 exit code로 돌려준다.
"""
Claude Code Hook: Bash Command Validator
=========================================
This hook runs as a PreToolUse hook for the Bash tool.
It validates bash commands against a set of rules before execution.
"""

import json
import re
import sys

# article의 G(runtime gate)가 판정하는 규칙 — 여기서는 command 문자열에
# 대한 pattern match. 실제 gate는 identity·scope·approval 등 다른 판정도
# 추가할 수 있지만, 이 예시는 "명령어 하나를 검사하는" 가장 단순한 형태.
_VALIDATION_RULES = [
    (
        r"^grep\b(?!.*\|)",
        "Use 'rg' (ripgrep) instead of 'grep' for better performance and features",
    ),
    (
        r"^find\s+\S+\s+-name\b",
        "Use 'rg --files | rg pattern' or 'rg --files -g pattern' instead of 'find -name' for better performance",
    ),
]


def _validate_command(command: str) -> list[str]:
    issues = []
    for pattern, message in _VALIDATION_RULES:
        if re.search(pattern, command):
            issues.append(message)
    return issues


def main():
    # article의 a_t — Claude가 제안한 tool_use(action)가 stdin JSON으로
    # 이 hook process에 전달된다. Claude Code harness가 P(s_t)로 만든
    # action을 실행하기 전에 여기로 먼저 보낸다.
    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)

    tool_name = input_data.get("tool_name", "")
    if tool_name != "Bash":
        # article의 G — 이 hook의 scope 밖(Bash가 아닌 tool)이면 그냥
        # 통과시킨다(exit 0)
        sys.exit(0)

    tool_input = input_data.get("tool_input", {})
    command = tool_input.get("command", "")

    if not command:
        sys.exit(0)

    issues = _validate_command(command)
    if issues:
        for message in issues:
            print(f"• {message}", file=sys.stderr)
        # article의 G(a_t)=deny — exit code 2는 tool call을 막고(E가 실행
        # 안 됨), stderr 메시지를 Claude에게 observation처럼 돌려준다.
        # article의 o_t=E(G(a_t))에서 G가 거부하면 E가 실행되지 않고
        # 거부 사유만 다음 state로 들어간다는 부분의 실제 구현.
        sys.exit(2)
    # exit code 0 — article의 G(a_t)=allow, E(G(a_t))가 실제로 실행됨


if __name__ == "__main__":
    main()
