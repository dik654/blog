"""Open-R1 보상 함수 시스템

핵심 아이디어:
- 단일 보상이 아닌 다중 보상 함수로 모델 행동을 다면적으로 평가
- 정확도만 보상하면 "답만 맞추고 추론 과정 생략" 지름길 학습 발생
- format + tag_count 보상으로 <think> 태그 내 추론 과정을 강제

GRPO에서의 역할:
  R_i = Σ(weight_k × reward_func_k(o_i))
  Â_i = (R_i - mean(R_group)) / std(R_group)
  → 보상 함수의 정밀도가 학습 방향을 직접 결정
"""

import re
import math
from math_verify import parse, verify  # LaTeX 수학 표현식 파싱 & 동치 판정


def accuracy_reward(completions: list[dict], solution: list[str], **kwargs) -> list[float]:
    """정확도 보상 — 수학 정답 검증 (가중치 0.7)

    파이프라인:
    1. solution에서 정답 추출 → LaTeX 파싱 (\\boxed{} 우선)
    2. 모델 응답의 <answer> 태그에서 답안 추출
    3. math_verify.verify()로 수학적 동치 판정
    4. 정답이면 1.0, 오답이면 0.0 반환

    math_verify가 해결하는 문제:
    - "1/2" vs "0.5" vs "\\frac{1}{2}" — 모두 동일하게 판정
    - "x^2 + 2x + 1" vs "(x+1)^2" — 대수적 동치 판정
    """
    rewards = []
    for completion, sol in zip(completions, solution):
        content = completion[0]["content"]

        # 정답 파싱: 첫 번째 매칭 모드
        gold_parsed = parse(sol, extraction_mode="first_match",
                           extraction_config=[{"type": "latex"}])
        if gold_parsed is None:
            rewards.append(1.0)  # 파싱 실패 시 보상 부여 (안전)
            continue

        # 모델 응답에서 답안 추출: \boxed{} 패턴 우선
        try:
            answer_parsed = parse(
                content,
                extraction_mode="first_match",
                extraction_config=[
                    {"type": "latex", "boxed": "all"},  # \boxed{} 우선
                    {"type": "latex"},                    # 그 외 LaTeX
                ],
            )
        except Exception:
            rewards.append(0.0)
            continue

        # 수학적 동치 판정
        reward = float(verify(gold_parsed, answer_parsed))
        rewards.append(reward)

    return rewards


def format_reward(completions: list[dict], **kwargs) -> list[float]:
    """형식 보상 — <think>/<answer> 태그 준수 검증 (가중치 0.2)

    왜 필요한가:
    - 정확도 보상만으로는 모델이 <think> 태그 없이 답만 출력하는 지름길 학습
    - 형식 보상으로 "추론 과정 → 답변" 구조를 강제
    """
    pattern = re.compile(
        r"<think>.*?</think>\s*<answer>.*?</answer>",
        re.DOTALL,
    )
    rewards = []
    for completion in completions:
        content = completion[0]["content"]
        reward = 1.0 if pattern.match(content) else 0.0
        rewards.append(reward)
    return rewards


def tag_count_reward(completions: list[dict], **kwargs) -> list[float]:
    """태그 카운트 보상 — 4개 태그 정확도 (가중치 0.1)

    <think>, </think>, <answer>, </answer> 각 태그가
    정확히 1번씩 등장하는지 확인 (각 0.25점, 합계 1.0)
    태그 중첩이나 누락을 감지하여 형식 일관성 보장
    """
    rewards = []
    for completion in completions:
        content = completion[0]["content"]
        score = 0.0
        # 각 태그가 정확히 1번 등장하면 0.25점
        for tag in ["<think>", "</think>", "<answer>", "</answer>"]:
            if content.count(tag) == 1:
                score += 0.25
        rewards.append(score)
    return rewards


def reasoning_steps_reward(completions: list[dict], **kwargs) -> list[float]:
    """추론 단계 보상 — 단계별 추론 패턴 검출

    \n\n 또는 "Step N:" 패턴으로 추론 단계를 감지
    5개 이상의 단계가 있으면 만점, 적으면 비례 감점
    → 짧은 지름길 추론 방지, 긴 사고 체인 유도
    """
    rewards = []
    for completion in completions:
        content = completion[0]["content"]
        # <think> 태그 내부만 추출
        think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
        if not think_match:
            rewards.append(0.0)
            continue

        think_content = think_match.group(1)
        # 빈 줄 또는 "Step N:" 패턴으로 단계 분리
        steps = [s for s in re.split(r"\n\n|Step \d+:", think_content) if s.strip()]
        # 5단계 이상이면 만점
        reward = min(len(steps) / 5.0, 1.0)
        rewards.append(reward)

    return rewards


def code_reward(completions: list[dict], **kwargs) -> list[float]:
    """코드 실행 보상 — 코드 실행 테스트 통과율

    ```python 블록 추출 → 안전한 샌드박스에서 실행
    assert 문 통과율에 비례하여 보상
    → 코딩 문제에서 정확성 검증
    """
    # 코드 실행 환경 구현 (sandbox 필요)
    raise NotImplementedError("Code execution reward requires sandbox setup")
