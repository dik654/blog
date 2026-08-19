# huggingface/trl 저장소 · trl/trainer/grpo_trainer.py (main branch, commit
# 7bd0d61, 2026년 8월 기준). 전체 3466줄 중 이 글이 다루는 advantage 계산과
# _compute_loss의 clipped surrogate·loss_type별 aggregation만 발췌했습니다.
# vLLM rollout, entropy bonus, off-policy masking, multi-modal 입력 처리는
# 생략했습니다.
# 본문 대응: GRPOProcess의 Â_i=(r_i-r̄)/(s_r+ε)와 u_{i,t}=ρ_{i,t}Â_i,
# c_{i,t}=clip(ρ_{i,t},1-ε,1+ε)Â_i, ℓ_{i,t}=min(u_{i,t},c_{i,t}).

# === 1) Group-relative advantage (article의 Â_i) ===
# self.multi_objective_aggregation에 따라 두 개의 독립된 분기가 있다(아래는
# 각 분기의 핵심만 나란히 발췌 — 실제로는 elif로 이어지지 않는 별개 branch).

# (a) multi_objective_aggregation == "sum_then_normalize"인 경우:
# 여러 reward를 먼저 합친 뒤 group 단위로 normalize. scale_rewards=="group"이면
# article의 정확한 식대로 group std로 나누고, "none"이면 std 나눗셈을 생략한다
# — article이 "현재 TRL에서는 끄거나 batch-level scaling을 선택할 수 있다"고
# 말한 부분의 실제 근거.
advantages = rewards - mean_grouped_rewards
if self.scale_rewards != "none":
    advantages = advantages / (std_rewards + 1e-4)

# (b) multi_objective_aggregation == "normalize_then_sum"인 경우:
# article의 RewardSystem section이 다룬 r_i=Σw_k R_k(q,o_i;v_k)가 정확히
# 여기서 계산된다. 각 reward component를 group 안에서 먼저 normalize한 뒤
# reward_weights(w_k)를 곱해 합친다.
grouped = rewards_per_func.view(-1, num_generations, len(self.reward_funcs))
mean_k = torch.nanmean(grouped, dim=1, keepdim=True)
std_k = nanstd(grouped, dim=1, keepdim=True)
reward_k = (grouped - mean_k) / (std_k + 1e-4)
reward_k = reward_k.view(-1, len(self.reward_funcs))
# article의 w_k·R_k 합 — reward_weights가 각 component의 weight
rewards = (reward_k * self.reward_weights.to(device).unsqueeze(0)).nansum(dim=1)
advantages = (rewards - torch.nanmean(rewards)) / (nanstd(rewards) + 1e-4)

# Unscorable completions(모든 reward func가 None을 반환)은 advantage를
# 0으로 둬 policy를 움직이지 않게 한다 — open-r1 rewards.py의 accuracy_reward
# 가 반환하는 None이 최종적으로 여기서 무해화된다.
advantages = torch.nan_to_num(advantages, nan=0.0)


# === 2) Clipped surrogate loss (article의 u_{i,t}, c_{i,t}, ℓ_{i,t}) ===
def _compute_loss(self, model, inputs):
    per_token_logps, entropies, aux_loss = self._get_per_token_logps_and_entropies(...)

    advantages = inputs["advantages"]
    old_per_token_logps = inputs.get("old_per_token_logps")
    old_per_token_logps = per_token_logps.detach() if old_per_token_logps is None else old_per_token_logps

    # article의 ρ_{i,t} — 새 policy와 rollout(old) policy의 log-prob 비율을
    # exp로 되돌린 것. token-level 또는 sequence-level 두 방식을 지원한다.
    log_ratio = per_token_logps - old_per_token_logps
    if self.importance_sampling_level == "token":
        log_importance_weights = log_ratio
    elif self.importance_sampling_level == "sequence":
        log_importance_weights = (log_ratio * mask).sum(-1) / mask.sum(-1).clamp(min=1.0)
        log_importance_weights = log_importance_weights.unsqueeze(-1)
    coef_1 = torch.exp(log_importance_weights)  # article의 ρ_{i,t}

    if self.loss_type in ["grpo", "bnpo", "dr_grpo", "dapo", "luspo"]:
        # article의 c_{i,t} 항 — ρ를 [1-ε_low, 1+ε_high] 밖으로 못 나가게 clip
        coef_2 = torch.clamp(coef_1, 1 - self.epsilon_low, 1 + self.epsilon_high)
        per_token_loss1 = coef_1 * advantages  # article의 u_{i,t}
        per_token_loss2 = coef_2 * advantages  # article의 c_{i,t}
        # article의 ℓ_{i,t}=min(u,c) — 구현은 최대화 목적을 최소화 loss로
        # 바꾸기 위해 부호를 반전
        per_token_loss = -torch.min(per_token_loss1, per_token_loss2)

    # article이 예고한 "loss_type에 따라 update가 달라진다"의 실제 근거 —
    # per-token surrogate는 grpo/bnpo/dr_grpo/dapo가 모두 같은 식을 쓰지만,
    # 최종 scalar loss로 aggregation하는 방식은 서로 다르다.
    if self.loss_type == "grpo":
        # article의 원 GRPO — completion마다 평균한 뒤 batch 평균(sample-level)
        loss = ((per_token_loss * mask).sum(-1) / mask.sum(-1).clamp(min=1.0)).mean()
    elif self.loss_type == "dr_grpo":
        # article의 Dr. GRPO — 고정된 max_completion_length로 나눔(길이
        # normalization을 아예 없애 length bias를 원천 차단)
        loss = (per_token_loss * mask).sum() / (per_token_loss.size(0) * self.max_completion_length)
    elif self.loss_type == "dapo":
        # article의 DAPO — sample 단위가 아니라 이번 generation batch
        # 전체의 active token 수(num_items_in_batch)로 나눔(token-level
        # aggregation)
        normalizer = inputs["num_items_in_batch"].clamp(min=1.0) / self.accelerator.num_processes
        loss = (per_token_loss * mask).sum() / normalizer
