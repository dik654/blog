# KSampler

## 정의
KSampler는 ComfyUI에서 모델과 conditioning, latent를 받아 seed, steps, CFG, sampler, scheduler, denoise 설정에 따라 latent denoising loop를 실행하는 핵심 sampling 노드다.

## 상세
KSampler를 이해할 때는 파라미터를 UI 옵션이 아니라 denoising trajectory의 조절점으로 봐야 한다. `seed`는 초기 noise를 정하고, `steps`는 noise를 깎는 반복 수를 정한다. `CFG`는 positive conditioning과 negative/unconditional conditioning의 차이를 얼마나 강하게 반영할지 정한다. `sampler`는 한 step에서 다음 step으로 이동하는 수치 알고리즘이고, `scheduler`는 sigma/noise level을 어떤 간격으로 낮출지 정한다. `denoise`는 기존 latent를 얼마나 보존하고 어느 지점부터 다시 그릴지 정한다.

CFG의 실무 감각은 특히 중요하다. 일반적인 classifier-free guidance에서는 negative/unconditional 예측에서 positive 예측 방향으로 얼마나 밀지 `guidance scale`로 정한다. scale이 1이면 positive 조건만 남는 형태가 되므로, Z-Image Turbo나 LTX 같은 turbo/distilled workflow에서 CFG를 1로 고정하면 negative prompt가 기대처럼 작동하지 않을 수 있다.

KSampler 튜닝은 한 번에 여러 값을 바꾸면 원인을 잃는다. 모델 권장값을 기준으로 seed를 고정한 뒤 steps, CFG, sampler, scheduler, denoise를 하나씩 바꿔 비교해야 한다. 구도나 얼굴이 마음에 들지 않으면 seed와 prompt를 먼저 보고, 디테일이 부족하면 steps나 후반 pass의 denoise를 보고, prompt 반영이 약하면 CFG와 모델 특성을 확인한다.

## 관련 개념
- [[ComfyUI]] - KSampler가 실행되는 노드 그래프 환경

## 소스
- [[raw/articles/ksampler-parameters-comfyui.md]] - seed, steps, CFG, sampler, scheduler, denoise 설명 원본 자료
