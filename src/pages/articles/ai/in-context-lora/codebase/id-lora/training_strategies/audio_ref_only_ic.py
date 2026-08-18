# ID-LoRA repo · packages/ltx-trainer/src/ltx_trainer/training_strategies/
# audio_ref_only_ic.py (2026년 8월 기준 main branch). 오디오 in-context 학습
# 전략 — video 쪽 동일 로직과 batch shape 처리는 생략하고, reference를
# "context로 이어붙이는" 핵심 로직만 발췌했습니다.
# 본문 대응: flow-matching forward noise·target(diffusion-continuous-time
# 글의 x_t=(1-t)x_0+tx_1, u_t=x_1-x_0을 그대로 재사용), reference를 clean한
# 채로 이어붙이는 방식, negative temporal position.

class AudioRefOnlyICStrategy(TrainingStrategy):
    def _get_negative_audio_positions(self, num_time_steps, batch_size, device, dtype):
        """Generate negative audio position embeddings for reference audio.

        Uses the same mechanism as _get_audio_positions (the standard target
        method) and then shifts the entire block into negative time. This
        ensures audio reference positions are computed with the same formula
        as target positions, keeping audio and video in sync.
        """
        # target과 완전히 같은 함수로 우선 "보통" 위치를 계산 —
        # reference만을 위한 별도 위치 공식을 새로 만들지 않음
        positions = self._get_audio_positions(
            num_time_steps=num_time_steps, batch_size=batch_size, device=device, dtype=dtype,
        )

        # 1 latent frame이 실제 시간으로 몇 초인지 계산 (article의 Δt)
        time_per_latent = (
            self._audio_patchifier.hop_length
            * self._audio_patchifier.audio_latent_downsample_factor
            / self._audio_patchifier.sample_rate
        )

        # reference 구간의 마지막 위치(끝나는 시각)
        audio_duration = positions[:, :, -1, 1].max().item()

        # article의 p'_ref = p_ref - audio_duration - Δt — reference 전체를
        # target(t=0에서 시작)보다 확실히 이전 시점으로 밀어 넣음(gap 한 칸 포함)
        positions = positions - audio_duration - time_per_latent
        return positions

    def prepare_training_inputs(self, batch, timestep_sampler):
        # === Target audio: 표준 flow-matching forward process ===
        sigmas = timestep_sampler.sample_for(target_audio_latents)  # article의 t
        audio_noise = torch.randn_like(target_audio_latents)        # article의 x_1
        sigmas_expanded = sigmas.view(-1, 1, 1)

        # article의 x_t=(1-t)x_0+t x_1 (x_0=target_audio_latents, x_1=audio_noise)
        noisy_target_audio = (
            (1 - sigmas_expanded) * target_audio_latents + sigmas_expanded * audio_noise
        )
        # article의 u_t=x_1-x_0 — model이 예측할 velocity target
        audio_targets = audio_noise - target_audio_latents

        # === Reference audio: noise를 전혀 섞지 않고 그대로(clean) 사용 ===
        # (diffusion-continuous-time의 t=0 지점 — "이미 완성된" 데이터로 조건화)
        ref_audio_conditioning_mask = torch.ones(
            batch_size, ref_audio_seq_len, dtype=torch.bool, device=device
        )

        # article의 context concatenation — clean reference와 noisy target을
        # 하나의 attention sequence로 이어붙임(별도 cross-attention module 없이)
        combined_audio_latents = torch.cat([ref_audio_latents, noisy_target_audio], dim=1)

        # article의 p'_ref — negative position으로 reference를 "과거"로 취급
        if self.config.use_negative_ref_positions:
            ref_audio_positions = self._get_negative_audio_positions(
                num_time_steps=ref_audio_seq_len, batch_size=batch_size, device=device, dtype=dtype,
            )
        else:
            ref_audio_positions = self._get_audio_positions(
                num_time_steps=ref_audio_seq_len, batch_size=batch_size, device=device, dtype=dtype,
            )
        # target audio position은 항상 0에서 시작(일반 생성과 동일)
        target_audio_positions = self._get_audio_positions(
            num_time_steps=target_audio_seq_len, batch_size=batch_size, device=device, dtype=dtype,
        )

        # Loss는 reference(조건) 위치는 0, target 위치만 1로 마스킹
        ref_audio_loss_mask = torch.zeros(batch_size, ref_audio_seq_len, dtype=torch.bool, device=device)
        target_audio_loss_mask = torch.ones(batch_size, target_audio_seq_len, dtype=torch.bool, device=device)
        audio_loss_mask = torch.cat([ref_audio_loss_mask, target_audio_loss_mask], dim=1)
