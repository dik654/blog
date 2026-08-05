"""Open-R1 reward registry의 검증 경계를 줄인 교육용 excerpt."""

import re
from collections.abc import Callable

from math_verify import parse, verify


def accuracy_reward(completions, solution, **kwargs) -> list[float]:
    rewards = []
    for completion, gold in zip(completions, solution):
        # 본문 대응: parser failure와 verified wrong은 학습 점수가 같아도 log 상태는 달라야 한다.
        try:
            gold_expr = parse(gold)
            answer_expr = parse(completion[0]["content"])
        except Exception:
            rewards.append(0.0)
            continue

        if not gold_expr or not answer_expr:
            rewards.append(0.0)
            continue
        rewards.append(float(verify(gold_expr, answer_expr)))
    return rewards


def format_reward(completions, **kwargs) -> list[float]:
    # 교육용 원형의 함정: MULTILINE + search에서는 ^/$가 전체 completion 경계가 아닐 수 있다.
    pattern = re.compile(
        r"^<think>.*?</think>\s*<answer>.*?</answer>$",
        flags=re.DOTALL | re.MULTILINE,
    )
    return [
        1.0 if pattern.search(completion[0]["content"]) else 0.0
        for completion in completions
    ]


def tag_count_reward(completions, **kwargs) -> list[float]:
    tags = ("<think>", "</think>", "<answer>", "</answer>")
    return [
        sum(completion[0]["content"].count(tag) == 1 for tag in tags) / len(tags)
        for completion in completions
    ]


def code_reward(completions, verification_info, sandbox_provider, **kwargs):
    # 본문 대응: candidate code를 trainer host에서 exec하지 않는다.
    return sandbox_provider.run_tests(
        completions=completions,
        tests=verification_info,
        network=False,
        read_only_filesystem=True,
        timeout_seconds=10,
    )


def get_reward_funcs(script_args) -> list[Callable]:
    # 실제 공식 registry에는 reasoning, repetition, length와 여러 code reward가 더 있다.
    registry = {
        "accuracy": accuracy_reward,
        "format": format_reward,
        "tag_count": tag_count_reward,
        "code": code_reward,
    }

    # 본문 대응: 이번 run의 config에 이름이 있어야 policy update에 연결된다.
    return [registry[name] for name in script_args.reward_funcs]
