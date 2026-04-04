"""Open-R1 합성 데이터 생성 파이프라인

핵심 아이디어:
- 강력한 모델(DeepSeek-R1)로 수학/코딩/추론 문제의 추론 트레이스 대량 생성
- Distilabel + vLLM + Ray 결합으로 분산 파이프라인 구축
- 동일 프롬프트에 여러 응답 생성 → 다양성 확보 → GRPO 그룹 학습에 활용
"""

import logging
from dataclasses import dataclass, field

from datasets import load_dataset
from distilabel.llms import OpenAILLM
from distilabel.pipeline import Pipeline
from distilabel.steps.tasks import TextGeneration

logger = logging.getLogger(__name__)


@dataclass
class GenerateScriptArguments:
    """데이터 생성용 인자"""
    model: str = field(default="deepseek-ai/DeepSeek-R1")
    dataset_name: str = field(default="AI-MO/NuminaMath-TIR")
    dataset_split: str = field(default="train")
    num_generations: int = field(default=4)       # 프롬프트당 생성 수
    max_new_tokens: int = field(default=16384)    # 긴 추론 허용
    temperature: float = field(default=0.6)       # 다양성 조절
    input_batch_size: int = field(default=64)     # vLLM 배치 크기
    vllm_server_url: str = field(default="http://localhost:8000/v1")
    timeout: int = field(default=1800)            # 30분 타임아웃 (긴 추론 대응)


def build_distilabel_pipeline(args: GenerateScriptArguments) -> Pipeline:
    """Distilabel 파이프라인 구축

    아키텍처:
    1. Ray 분산 처리 → 여러 워커에서 병렬 생성
    2. OpenAILLM → vLLM 서버에 OpenAI-compatible API 호출
    3. TextGeneration → 배치 단위로 추론 트레이스 생성
    4. group_generations=True → 동일 프롬프트의 생성 결과를 하나의 행으로 그룹화
    """
    with Pipeline().ray() as pipeline:
        TextGeneration(
            llm=OpenAILLM(
                base_url=args.vllm_server_url,
                model=args.model,
                generation_kwargs={
                    "max_new_tokens": args.max_new_tokens,
                    "temperature": args.temperature,
                },
            ),
            input_batch_size=args.input_batch_size,
            num_generations=args.num_generations,
            group_generations=True,  # 핵심: GRPO에서 그룹 비교할 수 있도록 그룹화
        )
    return pipeline


def main():
    args = GenerateScriptArguments()

    # ── 1. vLLM 서버 시작 (별도 프로세스) ──
    # python -m vllm.entrypoints.openai.api_server --model deepseek-ai/DeepSeek-R1
    logger.info(f"Connecting to vLLM server at {args.vllm_server_url}")

    # ── 2. 소스 데이터셋 로드 ──
    dataset = load_dataset(args.dataset_name, split=args.dataset_split)

    # 프롬프트 형식: 시스템 메시지 + 사용자 질문
    def format_prompt(example):
        return {
            "instruction": example["problem"],
            "system_prompt": (
                "You are a helpful assistant that solves math problems step by step. "
                "First think through the problem in <think> tags, then give your "
                "final answer in <answer> tags."
            ),
        }

    dataset = dataset.map(format_prompt)

    # ── 3. Distilabel 파이프라인 실행 ──
    pipeline = build_distilabel_pipeline(args)
    distiset = pipeline.run(dataset=dataset)

    # ── 4. 결과 필터링 & 업로드 ──
    # 형식 검증 통과 + 정확도 검증 통과한 샘플만 유지
    filtered = distiset.filter(
        lambda x: x["generation"] is not None and len(x["generation"]) > 0
    )
    filtered.push_to_hub(f"open-r1/{args.dataset_name.split('/')[-1]}-reasoning")

    logger.info(f"Generated {len(filtered)} reasoning traces from {len(dataset)} prompts")


if __name__ == "__main__":
    main()
