"""Open-R1 SFT control flow를 줄인 교육용 excerpt.

공식 저장소의 verbatim snapshot이 아니다. 본문에서 설명한 실행 경계만 남긴다.
"""

import os

from transformers.trainer_utils import get_last_checkpoint
from trl import ModelConfig, SFTTrainer, TrlParser, setup_chat_format

from open_r1.configs import ScriptArguments, SFTConfig
from open_r1.utils import get_dataset, get_model, get_tokenizer


def main(script_args, training_args, model_args):
    # 본문 대응: output_dir에 state가 있으면 같은 run을 이어 간다.
    checkpoint = None
    if os.path.isdir(training_args.output_dir):
        checkpoint = get_last_checkpoint(training_args.output_dir)
    if training_args.resume_from_checkpoint is not None:
        checkpoint = training_args.resume_from_checkpoint

    # 본문 대응: dataset row는 tokenizer/template 계약을 거쳐야 loss input이 된다.
    dataset = get_dataset(script_args)
    tokenizer = get_tokenizer(model_args, training_args)
    model = get_model(model_args, training_args)

    # 본문 대응: template이 없는 base model에는 명시적 fallback이 필요하다.
    if tokenizer.chat_template is None:
        model, tokenizer = setup_chat_format(model, tokenizer, format="chatml")

    trainer = SFTTrainer(
        model=model,
        args=training_args,
        train_dataset=dataset[script_args.dataset_train_split],
        eval_dataset=(
            dataset[script_args.dataset_test_split]
            if training_args.eval_strategy != "no"
            else None
        ),
        processing_class=tokenizer,
    )

    result = trainer.train(resume_from_checkpoint=checkpoint)
    trainer.log_metrics("train", result.metrics)
    trainer.save_state()

    # 본문 대응: 저장된 model의 generation stop과 tokenizer EOS를 다시 맞춘다.
    trainer.model.generation_config.eos_token_id = tokenizer.eos_token_id
    trainer.save_model(training_args.output_dir)

    if training_args.do_eval:
        trainer.log_metrics("eval", trainer.evaluate())


if __name__ == "__main__":
    parser = TrlParser((ScriptArguments, SFTConfig, ModelConfig))
    script_args, training_args, model_args = parser.parse_args_and_config()
    main(script_args, training_args, model_args)
