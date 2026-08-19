# huggingface/open-r1 저장소 · src/open_r1/rewards.py (main branch, commit
# 1416fa0, 2026년 8월 기준). 전체 706줄 중 이 글이 다루는 accuracy_reward·
# format_reward·get_reward_funcs만 발췌했습니다. code/cosine/repetition
# penalty 등 다른 reward component와 sandbox 실행 로직은 생략했습니다.
# 본문 대응: RewardSystem section의 r_i=Σw_k R_k(q,o_i;v_k) — 여러 verifier
# component가 실제로 어떤 함수이고, config에서 어떻게 선택·조합되는지.
# 실제 weighted-sum(Σw_k) 계산 자체는 TRL GRPOTrainer 쪽에 있어 grpo_trainer.py
# codeRef에서 이어집니다.

def accuracy_reward(completions, solution, **kwargs):
    """Reward function that checks if the completion is the same as the ground truth."""
    # article의 R_k 중 하나 — 정답 동치(correctness) verifier
    contents = [completion[0]["content"] for completion in completions]
    rewards = []
    for content, sol in zip(contents, solution):
        gold_parsed = parse(sol, extraction_mode="first_match")
        if len(gold_parsed) != 0:
            answer_parsed = parse(
                content,
                extraction_config=[LatexExtractionConfig(...)],
                extraction_mode="first_match",
            )
            try:
                # article의 "정답 동치" — symbolic verify, 단순 문자열 비교가 아님
                reward = float(verify(gold_parsed, answer_parsed))
            except Exception as e:
                print(f"verify failed: {e}, answer: {answer_parsed}, gold: {gold_parsed}")
                reward = None
        else:
            # article의 "Parser가 읽지 못한 정답을 0점으로 만들거나" — 실제로는
            # 0이 아니라 None을 반환해 이 example 자체를 학습 신호에서 제외한다
            reward = None
            print("Failed to parse gold solution: ", sol)
        rewards.append(reward)

    return rewards


def format_reward(completions, **kwargs):
    """Reward function that checks if the reasoning process is enclosed within
    <think> and </think> tags, while the final answer is enclosed within
    <answer> and </answer> tags."""
    # article의 "Format reward는 accessibility를 돕지만 correctness를
    # 대체하지 않는다" — 실제로 이 함수는 tag 유무만 정규식으로 확인하고
    # 내용의 정답 여부는 전혀 보지 않는다. 1.0/0.0 binary reward.
    pattern = r"^<think>\n.*?\n</think>\n<answer>\n.*?\n</answer>$"
    completion_contents = [completion[0]["content"] for completion in completions]
    matches = [re.match(pattern, content, re.DOTALL | re.MULTILINE) for content in completion_contents]
    return [1.0 if match else 0.0 for match in matches]


def get_reward_funcs(script_args):
    # article의 v_k(verifier version) — 어떤 R_k를 쓸지, 각 R_k의 파라미터
    # (sandbox provider, cosine 범위, repetition penalty 등)를 모두 config
    # (script_args)에서 읽어 조립한다. 이 registry 자체가 "reward는 versioned
    # measurement program"이라는 article의 주장의 실제 근거다.
    REWARD_FUNCS_REGISTRY = {
        "accuracy": accuracy_reward,
        "format": format_reward,
        "reasoning_steps": reasoning_steps_reward,
        "cosine": get_cosine_scaled_reward(
            min_value_wrong=script_args.cosine_min_value_wrong,
            max_value_wrong=script_args.cosine_max_value_wrong,
            min_value_correct=script_args.cosine_min_value_correct,
            max_value_correct=script_args.cosine_max_value_correct,
            max_len=script_args.cosine_max_len,
        ),
        "repetition_penalty": get_repetition_penalty_reward(
            ngram_size=script_args.repetition_n_grams,
            max_penalty=script_args.repetition_max_penalty,
        ),
        "length": len_reward,
        # article의 code reward — provider(sandbox)와 language 설정이
        # 채점 결과를 바꾸는 v_k의 일부임을 보여준다
        "code": update_wrapper(
            partial(
                code_reward,
                num_parallel=script_args.parallel_code_exec_per_proc,
                provider_type=script_args.code_provider,
                enforce_same_language=getattr(script_args, "enforce_same_language", False),
            ),
            code_reward,
        ),
        "code_format": get_code_format_reward(language=script_args.code_language),
        "tag_count": tag_count_reward,
        "soft_overlong_punishment": get_soft_overlong_punishment(
            max_completion_len=script_args.max_completion_len,
            soft_punish_cache=script_args.soft_punish_cache,
        ),
    }
    # script_args.reward_funcs가 선택한 이름 목록 — 실제 weighted-sum(Σw_k)은
    # 여기서 만든 callable list를 GRPOTrainer가 호출해 만든다
    reward_funcs = [REWARD_FUNCS_REGISTRY[func] for func in script_args.reward_funcs]

    return reward_funcs
