#!/usr/bin/env python3
# anthropics/claude-code 저장소 · plugins/hookify/hooks/pretooluse.py
# (main branch, commit c3d2e35, 2026년 8월 기준). 전체 74줄 중 핵심 부분만
# 발췌했습니다. 플러그인 경로 설정(sys.path 조작)과 예외 처리 세부는
# 생략했습니다.
# 본문 대응: tool-effect section의 "File operation, search, shell execution,
# web, code intelligence는 서로 다른 effect를 낸다"는 claim이 실제 gate
# 코드에서 어떻게 event 종류(bash/file)로 분류되는지 보여주는 예시.
"""PreToolUse hook executor for hookify plugin.

This script is called by Claude Code before any tool executes.
It reads .claude/hookify.*.local.md files and evaluates rules.
"""

import json
import sys

from hookify.core.config_loader import load_rules
from hookify.core.rule_engine import RuleEngine


def main():
    """Main entry point for PreToolUse hook."""
    # article의 a_t — Claude가 제안한 tool_use가 stdin JSON으로 들어온다
    input_data = json.load(sys.stdin)

    tool_name = input_data.get('tool_name', '')

    # article의 "File operation... shell execution... 서로 다른 effect"에
    # 대응 — 같은 gate 코드 안에서도 tool 종류별로 다른 event로 분류해
    # 서로 다른 rule set을 적용한다(workspace mutation인 Edit/Write와
    # process effect인 Bash를 하나의 판정으로 뭉치지 않음).
    event = None
    if tool_name == 'Bash':
        event = 'bash'
    elif tool_name in ['Edit', 'Write', 'MultiEdit']:
        event = 'file'

    # article의 G — event 종류에 맞는 rule만 불러와 판정한다
    rules = load_rules(event=event)

    # article의 G(a_t) 판정 — rule engine이 이번 action이 규칙을
    # 위반하는지 평가해 allow/deny/warn 중 하나의 결과를 만든다
    engine = RuleEngine()
    result = engine.evaluate_rules(rules, input_data)

    # article의 o_t 일부 — 판정 결과를 JSON으로 harness에 돌려준다.
    # tool_name == 'Bash'가 아니고 'Edit'/'Write'도 아니면 event가
    # None으로 남아 rule이 적용되지 않는다 — search·web·delegation
    # 같은 나머지 tool 종류는 이 특정 gate의 scope 밖임을 보여준다.
    print(json.dumps(result))


if __name__ == "__main__":
    main()
