# ID-LoRA repo · scripts/inference_two_stage.py (2026년 8월 기준 main
# branch). Stage 1(ID-LoRA로 target 해상도 생성) 안에서 매 denoising step마다
# 일어나는 guidance 계산 부분만 발췌했습니다. Video 쪽 CFG와 stage 2
# upsampling 로직은 생략했습니다.
# 본문 대응: identity guidance — reference가 context에 있을 때와 없을 때의
# 예측 차이를 classifier-free guidance처럼 더해 화자 정체성을 강화.

class TwoStagePipeline:
    def _denoise_step(self, vs, as_, sigma, ref_aud_len, video_cfg, audio_cfg):
        # 1) 표준 CFG: text 조건 있음(da_pos) vs 없음(da_neg)의 차이를 더함
        nv = modality_from_latent_state(vs, v_context_n, sigma)
        na = modality_from_latent_state(as_, a_context_n, sigma)
        dv_neg, da_neg = self._stage_1_transformer(video=nv, audio=na, perturbations=None)
        dv_delta = video_cfg.delta(dv_pos, dv_neg)
        da_delta = audio_cfg.delta(da_pos, da_neg)

        # 2) Identity guidance: reference audio를 context에서 아예 빼고
        #    같은 target에 대해 다시 한 번 예측(da_noref)
        if self._identity_guidance and self._identity_guidance_scale > 0 and ref_aud_len > 0:
            # target 위치만 남긴 audio state — reference 없이 예측하기 위함
            tgt_aud = LatentState(
                latent=as_.latent[:, ref_aud_len:],
                denoise_mask=as_.denoise_mask[:, ref_aud_len:],
                positions=as_.positions[:, :, ref_aud_len:],
                clean_latent=as_.clean_latent[:, ref_aud_len:],
            )
            nrv = modality_from_latent_state(vs, v_context_p, sigma)
            nra = modality_from_latent_state(tgt_aud, a_context_p, sigma)
            _, da_noref = self._stage_1_transformer(video=nrv, audio=nra, perturbations=None)

            # article의 id_delta = w_id·(pred_with_ref − pred_without_ref)
            # (표준 CFG의 "조건 있음 - 없음"과 같은 구조이되, 토글하는 조건이
            # text prompt가 아니라 "reference audio가 context에 있는가")
            id_delta = self._identity_guidance_scale * (da_pos[:, ref_aud_len:] - da_noref)

            # target 위치에만 적용 — reference 자체 위치는 애초에 conditioning이라
            # loss/guidance 대상이 아님
            full_id_delta = torch.zeros_like(da_delta)
            full_id_delta[:, ref_aud_len:] = id_delta
            da_delta = da_delta + full_id_delta

        return dv_delta, da_delta
