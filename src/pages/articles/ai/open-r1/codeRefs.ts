import type { CodeRef } from "@/components/code/types";
import rewardsPy from "./codebase/open-r1/src/open_r1/rewards.py?raw";
import grpoTrainerPy from "./codebase/trl/trl/trainer/grpo_trainer.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "open-r1-rewards": {
    path: "open-r1/src/open_r1/rewards.py",
    code: rewardsPy,
    lang: "python",
    highlight: [10, 95],
    desc: "문제: r_i=Σw_k R_k(q,o_i;v_k)의 각 reward component R_k가 실제로 어떤 함수이고, 어떻게 선택·조합되는지 확인해야 합니다.\n\n해결: open-r1의 accuracy_reward/format_reward가 실제 R_k 함수이고, get_reward_funcs가 config(script_args)에서 어떤 v_k를 쓸지 조립합니다.",
    annotations: [
      { lines: [23, 28], color: "sky", note: "article의 정답 동치 검사 — symbolic verify" },
      { lines: [29, 33], color: "rose", note: "article과 다른 점 — 파싱 실패는 0점이 아니라 None(학습 신호에서 제외)" },
      { lines: [43, 49], color: "emerald", note: "article의 'format reward는 correctness를 대체하지 않는다' — 정규식 tag 검사뿐" },
      { lines: [52, 56], color: "amber", note: "article의 v_k(verifier version) — reward 종류·파라미터를 config에서 조립" },
      { lines: [91, 93], color: "violet", note: "여기서 만든 함수 목록이 GRPOTrainer로 넘어가 실제 weighted-sum을 만듦" },
    ],
  },
  "grpo-advantage": {
    path: "trl/trl/trainer/grpo_trainer.py",
    code: grpoTrainerPy,
    lang: "python",
    highlight: [18, 38],
    desc: "문제: Â_i=(r_i-r̄)/(s_r+ε) 식과 r_i=Σw_k R_k 식이 실제로 어떻게 계산되는지, scale_rewards를 끄면 무슨 일이 일어나는지 확인해야 합니다.\n\n해결: TRL GRPOTrainer가 scale_rewards 설정에 따라 std 나눗셈을 하거나 생략하고, normalize_then_sum 모드에서는 reward_weights(w_k)로 실제 가중합을 계산합니다.",
    annotations: [
      { lines: [18, 20], color: "sky", note: "article의 Â_i=(r_i-r̄)/(s_r+ε) — scale_rewards!='none'일 때만 std로 나눔" },
      { lines: [26, 33], color: "emerald", note: "article의 r_i=Σw_k R_k — reward_weights를 곱해 실제 가중합을 계산" },
      { lines: [35, 38], color: "amber", note: "모든 reward가 None(unscorable)이면 advantage를 0으로 무해화" },
    ],
  },
  "grpo-clipped-loss": {
    path: "trl/trl/trainer/grpo_trainer.py",
    code: grpoTrainerPy,
    lang: "python",
    highlight: [42, 84],
    desc: "문제: u_{i,t}=ρ_{i,t}Â_i, c_{i,t}=clip(ρ_{i,t},1-ε,1+ε)Â_i, ℓ_{i,t}=min(u,c) 식이 실제 코드에서 어떻게 계산되고, loss_type(grpo/dapo/dr_grpo)에 따라 무엇이 달라지는지 확인해야 합니다.\n\n해결: coef_1이 ρ_{i,t}, coef_2가 clip된 c_{i,t}이며, per_token_loss가 -min(u,c)입니다. loss_type은 이 per-token 식이 아니라 이후 scalar로 합치는 aggregation 방식만 바꿉니다.",
    annotations: [
      { lines: [49, 57], color: "sky", note: "article의 ρ_{i,t} — 새 policy와 old(rollout) policy log-prob 비율" },
      { lines: [59, 66], color: "emerald", note: "article의 u_{i,t}, c_{i,t}, ℓ_{i,t}=min(u,c) — 부호 반전은 최대화를 최소화 loss로 바꾸기 위함" },
      { lines: [71, 73], color: "amber", note: "article의 원 GRPO — sample-level(completion마다 평균 후 batch 평균)" },
      { lines: [74, 77], color: "violet", note: "article의 Dr. GRPO — 고정 max_completion_length로 나눠 길이 normalization 자체를 제거" },
      { lines: [78, 83], color: "rose", note: "article의 DAPO — batch 전체 active token 수로 나누는 token-level aggregation" },
    ],
  },
};
