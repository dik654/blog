# ChenDarYen/Normalized-Attention-Guidance 저장소 · nag/attention_nag.py
# (main branch, commit 8bb34a1, 2026년 8월 기준). 전체 132줄 중 이 글이
# 다루는 NAGAttnProcessor2_0의 시그니처·guidance 분기만 발췌했습니다.
# Batch/head reshape, group_norm, spatial_norm 같은 표준 SDPA attention
# 배관 코드는 "..."로 생략했습니다 — NAG와 무관한 일반 attention 구현입니다.
#
# 본문 대응: latent-diffusion-guidance article의 CFG 식
# ε̂ = εu + w(εc − εu)를 attention output 레벨로 옮긴 것이 NAG입니다.
# CFG가 "노이즈 예측 두 개의 차이를 증폭"한다면, NAG는 "attention output
# 두 개의 차이를 증폭"하되 L1-norm 기반 clamp(τ)와 원래 값과의 blend(α)를
# 추가해, 이 증폭이 attention 내부에서 CFG처럼 무한정 커지지 않게 막습니다.

class NAGAttnProcessor2_0:
    def __init__(self, nag_scale: float = 1.0, nag_tau: float = 2.5, nag_alpha: float = 0.5):
        # article의 w에 대응 — nag_scale이 CFG의 guidance scale w와 같은
        # 역할입니다. nag_tau·nag_alpha는 CFG에는 없는 NAG 고유의 안전장치.
        self.nag_scale = nag_scale
        self.nag_tau = nag_tau
        self.nag_alpha = nag_alpha

    def __call__(self, attn, hidden_states, encoder_hidden_states=None, attention_mask=None, temb=None, *args, **kwargs):
        # ... (residual·spatial_norm·4D→3D reshape — 표준 attention 전처리, 생략)

        batch_size, sequence_length, _ = (
            hidden_states.shape if encoder_hidden_states is None else encoder_hidden_states.shape
        )

        # article의 조건 — CFG처럼 nag_scale이 1보다 크고 cross-attention
        # (encoder_hidden_states가 있음)일 때만 guidance를 적용합니다.
        # origin_batch_size는 실제 요청 batch 수(2×/3×/4× 중 순수 크기).
        apply_guidance = self.nag_scale > 1 and encoder_hidden_states is not None
        if apply_guidance:
            origin_batch_size = batch_size - len(hidden_states)
            assert batch_size / origin_batch_size in [2, 3, 4]

        # ... (attention_mask·group_norm·to_q/to_k/to_v projection, query
        # tile·reshape, scaled_dot_product_attention 호출 — 표준 attention
        # 본체, 생략. 이 SDPA의 출력이 아래 hidden_states입니다.)

        if apply_guidance:
            # article의 εc, εu에 대응 — CFG-style batch 관례대로, batch
            # 안에 reference(positive) branch와 negative branch가 같이
            # 들어 있어 여기서 둘을 분리합니다.
            hidden_states_negative = hidden_states[-origin_batch_size:]
            if batch_size == 2 * origin_batch_size:
                hidden_states_positive = hidden_states[:origin_batch_size]
            else:
                hidden_states_positive = hidden_states[origin_batch_size:2 * origin_batch_size]

            # article의 핵심 대응 — εc + w(εc − εu)와 정확히 같은 형태의
            # extrapolation을 attention output에 적용합니다. CFG의
            # εu+w(εc−εu)를 대수적으로 정리하면 εc·scale − εu·(scale−1)과
            # 동일합니다.
            hidden_states_guidance = hidden_states_positive * self.nag_scale - hidden_states_negative * (self.nag_scale - 1)

            # article에는 없는 NAG 고유의 안전장치 1 — L1-norm 기반 clamp.
            # Extrapolation으로 커진 norm이 원래 positive norm 대비 tau배를
            # 넘지 못하게 눌러, CFG가 few-step·distilled 모델에서 자주
            # 무너지는(collapse) 현상을 막습니다.
            norm_positive = torch.norm(hidden_states_positive, p=1, dim=-1, keepdim=True).expand(*hidden_states_positive.shape)
            norm_guidance = torch.norm(hidden_states_guidance, p=1, dim=-1, keepdim=True).expand(*hidden_states_guidance.shape)
            scale = norm_guidance / norm_positive
            hidden_states_guidance = hidden_states_guidance * torch.minimum(scale, scale.new_ones(1) * self.nag_tau) / scale

            # article에는 없는 NAG 고유의 안전장치 2 — clamp된 guidance와
            # 원래 positive attention output을 alpha로 blend합니다.
            # alpha=1이면 순수 guidance, alpha=0이면 CFG 없는 것과 같습니다.
            hidden_states_guidance = hidden_states_guidance * self.nag_alpha + hidden_states_positive * (1 - self.nag_alpha)

            if batch_size == 2 * origin_batch_size:
                hidden_states = hidden_states_guidance
            elif batch_size == 3 * origin_batch_size:
                hidden_states = torch.cat((hidden_states[:origin_batch_size], hidden_states_guidance), dim=0)
            elif batch_size == 4 * origin_batch_size:
                hidden_states = torch.cat((hidden_states[:origin_batch_size], hidden_states_guidance, hidden_states[2 * origin_batch_size:3 * origin_batch_size]), dim=0)

        # ... (to_out linear·dropout, 4D 복원, residual 더하기, rescale — 생략)
        return hidden_states
