# transformers/models/mixtral/modeling_mixtral.py — MixtralTopKRouter ·
# MixtralExperts.forward (HuggingFace transformers v5.15.0). __init__의
# weight shape 선언과 jitter noise(학습 중 router 안정화용, 본문 범위 밖)는
# 생략했습니다.
# 본문 대응: routing 식(z=W_r x, p_i=softmax, T_k(x)=TopK(p,k))과
# combine 식(y(x)=Σ_{i∈T_k(x)} p_i(x)E_i(x)).

class MixtralTopKRouter(nn.Module):
    def forward(self, hidden_states):
        hidden_states = hidden_states.reshape(-1, self.hidden_dim)
        # article의 z=W_r x
        router_logits = F.linear(hidden_states, self.weight)
        # article의 p_i=softmax(z)_i — 전체 n개 expert에 대한 확률
        router_probs = torch.nn.functional.softmax(router_logits.float(), dim=-1)
        # article의 T_k(x)=TopK(p,k) — 상위 k개만 선택
        router_top_value, router_indices = torch.topk(router_probs, self.top_k, dim=-1)
        # article 식에는 없는 실제 구현 세부사항: 선택된 k개만 다시 정규화해
        # 합이 1이 되게 함 (전체 n개 기준 softmax 값을 그대로 mixture weight로
        # 쓰지 않음)
        router_top_value /= router_top_value.sum(dim=-1, keepdim=True)
        return router_logits, router_top_value, router_indices


class MixtralExperts(nn.Module):
    def forward(self, hidden_states, top_k_index, top_k_weights):
        final_hidden_states = torch.zeros_like(hidden_states)
        with torch.no_grad():
            # 어떤 expert가 어떤 token을 맡았는지 one-hot mask로 표시
            # (article의 T_k(x) 집합을 expert별로 재배열 — "dispatch"에 해당)
            expert_mask = torch.nn.functional.one_hot(top_k_index, num_classes=self.num_experts)
            expert_mask = expert_mask.permute(2, 1, 0)
            expert_hit = torch.greater(expert_mask.sum(dim=(-1, -2)), 0).nonzero()

        for expert_idx in expert_hit:
            expert_idx = expert_idx[0]
            # 이 expert가 실제로 맡은 token들만 골라냄
            top_k_pos, token_idx = torch.where(expert_mask[expert_idx])
            current_state = hidden_states[token_idx]
            # article의 E_i(x) — expert i의 FFN을 그 expert가 맡은 token에만 적용
            gate, up = nn.functional.linear(current_state, self.gate_up_proj[expert_idx]).chunk(2, dim=-1)
            current_hidden_states = self.act_fn(gate) * up
            current_hidden_states = nn.functional.linear(current_hidden_states, self.down_proj[expert_idx])
            # article의 p_i(x)·E_i(x) — expert 출력에 routing weight를 곱함
            current_hidden_states = current_hidden_states * top_k_weights[token_idx, top_k_pos, None]
            # article의 Σ — 원래 token position으로 되돌려 누적 ("combine")
            final_hidden_states.index_add_(0, token_idx, current_hidden_states.to(final_hidden_states.dtype))

        return final_hidden_states
