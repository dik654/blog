import type { CodeRef } from "@/components/code/types";
import loraConfigYaml from "./codebase/id-lora/configs/ltx2_v2v_ic_lora.yaml?raw";
import audioRefOnlyIcPy from "./codebase/id-lora/training_strategies/audio_ref_only_ic.py?raw";
import inferenceTwoStagePy from "./codebase/id-lora/inference/inference_two_stage.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "lora-config": {
    path: "id-lora/packages/ltx-trainer/configs/ltx2_v2v_ic_lora.yaml",
    code: loraConfigYaml,
    lang: "python",
    highlight: [7, 25],
    desc: "문제: IC-LoRA가 '새 architecture 없이 기존 attention을 재사용한다'는 주장이 실제로는 어느 module에, 얼마나 큰 rank로 적용되는지 확인해야 합니다.\n\n해결: ID-LoRA의 LTX-2 video-to-video 학습 설정이 rank 32 LoRA를 video self-attention·cross-attention·FFN projection에만 붙이고, base weight는 건드리지 않습니다.",
    annotations: [
      { lines: [10, 11], color: "sky", note: "article의 LoRA rank — 표현력과 base model 이탈 정도의 trade-off" },
      { lines: [15, 25], color: "emerald", note: "article의 target module — attn1(video self-attention)·attn2(cross-attention)·ff(FFN)에만 A·B가 붙고 나머지 weight는 frozen" },
      { lines: [30, 30], color: "amber", note: "training_strategy.name — IC-LoRA의 핵심이 새 module이 아니라 '어떤 latent를 in-context로 붙이는가'라는 전략 선택임을 보여줌" },
    ],
  },
  "reference-conditioning": {
    path: "id-lora/packages/ltx-trainer/src/ltx_trainer/training_strategies/audio_ref_only_ic.py",
    code: audioRefOnlyIcPy,
    lang: "python",
    highlight: [39, 79],
    desc: "문제: reference와 target을 하나의 context로 이어붙이는 학습이 실제로 flow-matching forward process·position embedding·loss mask에서 각각 어떻게 다르게 처리되는지 확인해야 합니다.\n\n해결: prepare_training_inputs가 target에만 forward noise를 섞고 reference는 clean하게 concat한 뒤, reference block에는 negative position을, loss mask에는 target만 1을 부여합니다.",
    annotations: [
      { lines: [41, 50], color: "sky", note: "article의 x_t=(1-t)x_0+tx_1, u_t=x_1-x_0 — diffusion-continuous-time의 flow-matching을 target audio에 그대로 재사용" },
      { lines: [54, 56], color: "emerald", note: "article의 reference conditioning — clean 상태 그대로 두어 노이즈를 섞지 않음" },
      { lines: [60, 60], color: "amber", note: "article의 context concatenation — 별도 cross-attention 없이 하나의 attention sequence로 이어붙임" },
      { lines: [10, 37], color: "violet", note: "article의 negative temporal position — reference 전체를 target(t=0 시작)보다 이전 시점으로 밀어 넣는 _get_negative_audio_positions" },
      { lines: [77, 79], color: "rose", note: "article의 loss mask — reference(조건) 위치는 0, target 위치만 1로 마스킹해 loss가 target에만 걸리게 함" },
    ],
  },
  "identity-guidance": {
    path: "id-lora/scripts/inference_two_stage.py",
    code: inferenceTwoStagePy,
    lang: "python",
    highlight: [9, 42],
    desc: "문제: identity guidance가 classifier-free guidance와 어떻게 같은 구조를 재사용하면서 '무엇을 토글하는가'만 다른지 확인해야 합니다.\n\n해결: _denoise_step이 표준 CFG delta를 먼저 계산한 뒤, reference audio를 context에서 제거하고 다시 예측한 delta를 target 위치에만 추가로 더합니다.",
    annotations: [
      { lines: [11, 15], color: "sky", note: "article의 표준 CFG — text 조건 있음(da_pos) vs 없음(da_neg)의 차이" },
      { lines: [19, 29], color: "emerald", note: "article의 identity guidance — reference audio를 context에서 제거(ref_aud_len 이후만 남김)하고 같은 target을 다시 예측" },
      { lines: [34, 34], color: "amber", note: "article의 id_delta = w_id·(pred_with_ref − pred_without_ref) — CFG와 같은 '있음-없음' 구조, 토글 대상만 reference 유무로 바뀜" },
      { lines: [38, 40], color: "rose", note: "article의 target-only 적용 — reference 자체 위치는 conditioning이라 guidance 대상이 아님" },
    ],
  },
};
