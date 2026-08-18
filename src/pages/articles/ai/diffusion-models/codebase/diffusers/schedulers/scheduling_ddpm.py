# diffusers/schedulers/scheduling_ddpm.py — DDPMScheduler.add_noise · step
# (HuggingFace diffusers v0.39.0). step()은 epsilon-prediction 경로만 남기고
# v_prediction·thresholding·learned-variance 분기는 생략했습니다(article도
# ε_θ 예측을 기본으로 다룹니다). _get_variance()의 variance_type별 분기도
# "σ_t는 설정에 따라 달라지는 posterior 분산"이라는 사실만 주석으로 남기고
# 생략했습니다.

class DDPMScheduler:
    def add_noise(self, original_samples, noise, timesteps):
        """Forward diffusion — closed form으로 x_t를 한 번에 만듭니다."""
        alphas_cumprod = self.alphas_cumprod.to(dtype=original_samples.dtype)

        # article의 √ᾱ_t
        sqrt_alpha_prod = alphas_cumprod[timesteps] ** 0.5
        sqrt_alpha_prod = sqrt_alpha_prod.flatten()
        while len(sqrt_alpha_prod.shape) < len(original_samples.shape):
            sqrt_alpha_prod = sqrt_alpha_prod.unsqueeze(-1)

        # article의 √(1-ᾱ_t)
        sqrt_one_minus_alpha_prod = (1 - alphas_cumprod[timesteps]) ** 0.5
        sqrt_one_minus_alpha_prod = sqrt_one_minus_alpha_prod.flatten()
        while len(sqrt_one_minus_alpha_prod.shape) < len(original_samples.shape):
            sqrt_one_minus_alpha_prod = sqrt_one_minus_alpha_prod.unsqueeze(-1)

        # article의 x_t = √ᾱ_t·x0 + √(1-ᾱ_t)·ε
        noisy_samples = sqrt_alpha_prod * original_samples + sqrt_one_minus_alpha_prod * noise
        return noisy_samples

    def step(self, model_output, timestep, sample, generator=None):
        """Reverse process 한 step — model이 예측한 noise로 x_{t-1}을 만듭니다."""
        t = timestep
        prev_t = self.previous_timestep(t)

        # 1. lookup table에서 alpha·beta 조회 (article의 ᾱ_t, β_t)
        alpha_prod_t = self.alphas_cumprod[t]
        alpha_prod_t_prev = self.alphas_cumprod[prev_t] if prev_t >= 0 else self.one
        beta_prod_t = 1 - alpha_prod_t
        beta_prod_t_prev = 1 - alpha_prod_t_prev
        current_alpha_t = alpha_prod_t / alpha_prod_t_prev
        current_beta_t = 1 - current_alpha_t

        # 2. epsilon-prediction: model_output(ε_θ)으로 x0를 먼저 복원
        # (article의 μ_θ 식과는 다른 parameterization — 이 식은 DDPM 논문의
        # formula 15로 x̂0을 구한 뒤 formula 7로 mean을 합성합니다.
        # Article이 쓰는 형태는 x̂0=(x_t-√(1-ᾱ_t)ε)/√ᾱ_t를 formula 11에 대입해
        # 미리 정리해 둔 식이며, 대수적으로 같은 값을 냅니다.)
        pred_original_sample = (sample - beta_prod_t**0.5 * model_output) / alpha_prod_t**0.5

        # 3. x̂0과 x_t를 섞는 계수 (DDPM 논문 formula 7)
        pred_original_sample_coeff = (alpha_prod_t_prev**0.5 * current_beta_t) / beta_prod_t
        current_sample_coeff = current_alpha_t**0.5 * beta_prod_t_prev / beta_prod_t

        # 4. article의 μ_θ와 같은 값을 만드는 mean
        pred_prev_sample = pred_original_sample_coeff * pred_original_sample + current_sample_coeff * sample

        # 5. article의 "z~N(0,I) (t=1이면 z=0)" — t=0(마지막 x0)에서만 noise를 끔
        variance = 0
        if t > 0:
            variance_noise = randn_tensor(model_output.shape, generator=generator, device=model_output.device)
            # σ_t는 variance_type 설정(fixed_small·fixed_large·learned 등)에 따라
            # 달라지는 posterior 분산입니다 — article은 그중 한 가지 고정값을 씁니다.
            variance = (self._get_variance(t) ** 0.5) * variance_noise

        return pred_prev_sample + variance
