"""Open-R1 GRPO (Group Relative Policy Optimization) 학습 스크립트

핵심 아이디어:
- PPO의 Critic(가치 함수) 모델을 제거 → 메모리 절약 (7B 기준 ~14GB)
- 동일 프롬프트에 N개 응답 생성 → 그룹 내 상대적 보상 순위로 Advantage 계산
- vLLM 백엔드로 다중 응답 고속 생성

GRPO 손실 함수:
  L = -E[ min(r(θ)·Â, clip(r(θ), 1±ε)·Â) - β·KL(π_θ || π_ref) ]
  Â = (R_i - mean(R_group)) / std(R_group)  ← 그룹 정규화 Advantage
"""

import logging
from dataclasses import dataclass, field

from datasets import load_dataset
from transformers import AutoTokenizer
from trl import GRPOConfig, GRPOTrainer

from open_r1.rewards import (
    accuracy_reward,
    format_reward,
    tag_count_reward,
)

logger = logging.getLogger(__name__)


@dataclass
class GRPOScriptArguments:
    """GRPO 학습용 인자"""
    dataset_name: str = field(default="open-r1/OpenR1-Math-220k")
    max_prompt_length: int = field(default=2048)
    max_completion_length: int = field(default=8192)
    num_generations: int = field(default=14)  # 그룹 크기: 프롬프트당 14개 응답 생성


def main():
    # ── 1. GRPO 설정 ──
    training_args = GRPOConfig(
        output_dir="data/OpenR1-GRPO-7B",
        learning_rate=1e-6,          # SFT보다 낮은 lr (정책 안정성)
        num_train_epochs=1,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        max_prompt_length=2048,
        max_completion_length=8192,
        num_generations=14,           # ← 그룹 크기 N
        temperature=1.0,              # 다양성 유지
        beta=0.001,                   # KL 페널티 계수 β
        # vLLM 백엔드 설정
        use_vllm=True,
        vllm_gpu_memory_utilization=0.7,
    )

    # ── 2. 보상 함수 목록 정의 ──
    # GRPO의 핵심: 이 함수들이 모델 응답의 품질을 평가
    # 각 함수의 결과를 가중 합산하여 최종 보상 R_i 산출
    reward_funcs = [
        accuracy_reward,   # 가중치 0.7 — math_verify로 정답 검증
        format_reward,     # 가중치 0.2 — <think>/<answer> 형식 준수
        tag_count_reward,  # 가중치 0.1 — 4개 태그 정확도
    ]

    # ── 3. 데이터셋 로드 ──
    dataset = load_dataset(
        training_args.dataset_name,
        split="train",
    )

    # ── 4. 토크나이저 ──
    tokenizer = AutoTokenizer.from_pretrained(training_args.model_name_or_path)

    # ── 5. GRPOTrainer 초기화 & 학습 ──
    # GRPOTrainer 내부 동작:
    #   (a) 프롬프트 q에 대해 N개 응답 생성: {o_1, ..., o_N} ~ π_old(·|q)
    #   (b) 각 응답의 보상 계산: R_i = Σ(weight_k × reward_func_k(o_i))
    #   (c) 그룹 정규화 Advantage: Â_i = (R_i - mean(R)) / std(R)
    #   (d) 정책 업데이트: 높은 Â의 응답 확률 ↑, 낮은 Â의 응답 확률 ↓
    trainer = GRPOTrainer(
        model=training_args.model_name_or_path,
        args=training_args,
        train_dataset=dataset,
        reward_funcs=reward_funcs,
        processing_class=tokenizer,
    )

    trainer.train()
    trainer.save_model()
    trainer.push_to_hub()


if __name__ == "__main__":
    main()
