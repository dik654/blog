# unslothai/unsloth 저장소 · unsloth/models/llama.py (main branch, commit
# fdf83cb, 2026년 8월 기준). 전체 3945줄 중 이 글이 다루는
# FastLlamaModel.get_peft_model()의 파라미터 목록과 use_rslora 검증
# 블록만 발췌했습니다. QLoRA dtype 처리·LoftQ init·module 이름 검증 등
# 나머지 본문은 "..."로 생략했습니다.
#
# 본문 대응: LoRA.tsx의 "Attention의 q·k·v·o projection과 MLP의
# gate·up·down projection 중 어디에 capacity를 배분할지 정해야 합니다"
# 문장의 실제 기본값 — Unsloth가 실전에서 권장하는 target_modules·r·
# lora_alpha·use_rslora의 기본값이 코드에 리터럴로 박혀 있습니다.

class FastLlamaModel:
    # ... (from_pretrained 등 나머지 static method — 생략)

    @staticmethod
    def get_peft_model(
        model,
        # article의 "capacity를 배분" — r이 커질수록 LoRA 행렬 rank가
        # 커져 표현력은 늘지만 학습 파라미터·메모리도 늘어난다. Unsloth
        # 기본값 16은 "일반적으로 충분하다"는 실전 경험치.
        r = 16,
        # article이 가리키는 실제 module 이름 — attention의 q·k·v·o와
        # MLP의 gate·up·down projection 전부를 기본으로 포함한다. 즉
        # Unsloth의 기본 권장은 "attention만"이 아니라 7개 linear 전부다.
        target_modules = [
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],
        # article의 α — 관행적으로 r과 같은 값(여기선 16)을 기본값으로
        # 둬 s=α/r=1이 되게 한다.
        lora_alpha = 16,
        lora_dropout = 0.0,
        bias = "none",
        layers_to_transform = None,
        layers_pattern = None,
        finetune_last_n_layers = None,
        use_gradient_checkpointing = "unsloth",
        random_state = 3407,
        max_seq_length = 2048,  # not used anymore
        # article에는 없는 실제 옵션 — rank-stabilized LoRA. 기본은
        # False(원 LoRA의 1/r scaling)이며, 켜면 1/sqrt(r) scaling으로
        # 바뀌어 r을 키울 때 학습이 더 안정적이라는 보고가 있다.
        use_rslora = False,
        modules_to_save = None,
        init_lora_weights = True,
        loftq_config = {},
        temporary_location = "_unsloth_temporary_saved_buffers",
        qat_scheme = None,
        target_parameters = None,  # For MoE expert layers (nn.Parameter)
        ensure_weight_tying = False,
        **kwargs,
    ):
        # ... (QAT·QLoRA dtype·LoftQ init 분기 — 생략)

        # article에는 없는 실제 검증 — use_rslora를 켰는데 설치된 PEFT
        # 버전이 이를 지원하지 않으면 조용히 무시하지 않고 즉시 에러를
        # 던진다. rank-stabilized LoRA는 PEFT 쪽 지원 버전이 있다는 뜻.
        assert type(use_rslora) is bool
        if use_rslora:
            if not SUPPORTS_RSLORA:
                # We manually check for PEFT
                import peft
                raise RuntimeError(
                    f"Unsloth: Your PEFT version of {peft.__version__} does not support `use_rslora`.\n"
                    "Please install PEFT 0.7.2 or higher.\n"
                    "You can also install from source: `pip install git+https://github.com/huggingface/peft.git"
                )

        # ... (module 이름 검증·LoRA 주입 — 생략)
