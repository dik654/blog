"""Open-R1 SFT (Supervised Fine-Tuning) 학습 스크립트

핵심 아이디어:
- 사전 훈련된 Qwen2.5-Math-7B를 <think>/<answer> 추론 형식으로 미세조정
- DeepSeek-R1이 생성한 350K Mixture-of-Thoughts 데이터로 학습
- Liger Kernel + DeepSpeed ZeRO-3으로 메모리 최적화
"""

import logging
from dataclasses import dataclass, field

from datasets import load_dataset
from transformers import AutoTokenizer, set_seed
from trl import SFTConfig, SFTTrainer, setup_chat_format

logger = logging.getLogger(__name__)


@dataclass
class SFTScriptArguments:
    """SFT 학습용 인자 정의"""
    dataset_name: str = field(default="open-r1/OpenR1-Math-220k")
    dataset_config: str = field(default="default")
    max_seq_length: int = field(default=16384)
    liger_kernel: bool = field(default=True)  # CUDA 커널 최적화 (20-30% 메모리 절약)


def main():
    # ── 1. 설정 로드 ──
    # TRL의 SFTConfig가 학습 하이퍼파라미터를 통합 관리
    # recipes/ 디렉토리의 YAML 파일에서 불러올 수 있음
    training_args = SFTConfig(
        output_dir="data/OpenR1-SFT-7B",
        num_train_epochs=1,
        per_device_train_batch_size=2,
        learning_rate=1e-5,
        lr_scheduler_type="cosine",
        bf16=True,
        gradient_checkpointing=True,  # 메모리 ↔ 연산 트레이드오프
        max_seq_length=16384,
    )

    # ── 2. 모델 & 토크나이저 로드 ──
    # Qwen2.5-Math-7B-Instruct를 기반으로 ChatML 형식 설정
    model_name = "Qwen/Qwen2.5-Math-7B-Instruct"
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    # ChatML 형식이 없으면 자동 설정 (<|im_start|>, <|im_end|> 토큰 추가)
    if tokenizer.chat_template is None:
        _, tokenizer = setup_chat_format(None, tokenizer)

    # ── 3. 데이터셋 로드 & 전처리 ──
    # 350K 추론 트레이스 데이터: 각 샘플은 (질문, <think>추론과정</think><answer>답</answer>) 쌍
    dataset = load_dataset(
        "open-r1/OpenR1-Math-220k",
        split="train",
    )

    # 대화 형식으로 변환: ChatML 템플릿 적용
    def format_chat(example):
        messages = example["messages"]
        return {"text": tokenizer.apply_chat_template(messages, tokenize=False)}

    dataset = dataset.map(format_chat, remove_columns=dataset.column_names)

    # ── 4. SFTTrainer로 학습 ──
    # TRL의 SFTTrainer가 packing, loss masking 등을 자동 처리
    trainer = SFTTrainer(
        model=model_name,
        args=training_args,
        train_dataset=dataset,
        processing_class=tokenizer,
    )

    # 학습 시작
    train_result = trainer.train()
    metrics = train_result.metrics

    # ── 5. 체크포인트 저장 & Hub 업로드 ──
    trainer.save_model(training_args.output_dir)
    trainer.push_to_hub()

    logger.info(f"Training complete. Loss: {metrics['train_loss']:.4f}")


if __name__ == "__main__":
    main()
