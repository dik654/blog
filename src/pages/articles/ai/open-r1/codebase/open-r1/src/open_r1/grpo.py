"""Open-R1 GRPO control flow를 줄인 교육용 excerpt.

Advantage 계산과 clipped objective는 TRL GRPOTrainer 내부에 있다.
"""

import os

from transformers.trainer_utils import get_last_checkpoint
from trl import GRPOTrainer, ModelConfig, TrlParser

from open_r1.configs import GRPOConfig, GRPOScriptArguments
from open_r1.rewards import get_reward_funcs
from open_r1.utils import get_dataset, get_model, get_tokenizer


def main(script_args, training_args, model_args):
    checkpoint = None
    if os.path.isdir(training_args.output_dir):
        checkpoint = get_last_checkpoint(training_args.output_dir)
    if training_args.resume_from_checkpoint is not None:
        checkpoint = training_args.resume_from_checkpoint

    dataset = get_dataset(script_args)
    tokenizer = get_tokenizer(model_args, training_args)
    model = get_model(model_args, training_args)

    # 본문 대응: reward는 코드에 있는 모든 함수가 아니라 config가 고른 함수만 연결한다.
    reward_funcs = get_reward_funcs(script_args)

    # 본문 대응: gold solution과 prompt를 섞지 않고 지정된 problem column만 대화로 만든다.
    def make_conversation(example):
        prompt = []
        if training_args.system_prompt is not None:
            prompt.append({"role": "system", "content": training_args.system_prompt})
        prompt.append({
            "role": "user",
            "content": example[script_args.dataset_prompt_column],
        })
        return {"prompt": prompt}

    dataset = dataset.map(make_conversation)

    # 본문 대응: G개 rollout, verifier, group advantage와 update는 trainer가 닫는다.
    trainer = GRPOTrainer(
        model=model,
        reward_funcs=reward_funcs,
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
    trainer.model.generation_config.eos_token_id = tokenizer.eos_token_id
    trainer.save_model(training_args.output_dir)


if __name__ == "__main__":
    parser = TrlParser((GRPOScriptArguments, GRPOConfig, ModelConfig))
    script_args, training_args, model_args = parser.parse_args_and_config()
    main(script_args, training_args, model_args)
