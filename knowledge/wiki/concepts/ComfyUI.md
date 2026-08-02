# ComfyUI

## 정의
ComfyUI는 이미지·영상 생성 모델의 loader, text encoder, latent, sampler, VAE, 후처리 단계를 노드 그래프로 연결해 실행하는 diffusion workflow UI다.

## 상세
ComfyUI의 핵심은 화면 배치가 아니라 타입이 있는 데이터 흐름이다. `MODEL`, `CLIP`, `CONDITIONING`, `LATENT`, `IMAGE`, `VAE` 같은 값이 노드 사이를 이동하고, KSampler는 이 중 `MODEL`, positive/negative conditioning, latent를 받아 denoising loop를 실행한다.

입문자가 자주 헷갈리는 부분은 노드를 추가한 것과 실제로 그 노드의 output이 소비되는 것이 다르다는 점이다. LoRA를 추가해도 KSampler가 패치된 `MODEL`을 받지 않으면 결과에 영향이 없다. negative prompt를 입력해도 CFG가 1인 turbo/distilled workflow에서는 negative conditioning이 거의 쓰이지 않을 수 있다.

## 관련 개념
- [[KSampler]] - ComfyUI 기본 그래프에서 latent denoising을 수행하는 핵심 노드

## 소스
- [[raw/articles/ksampler-parameters-comfyui.md]] - KSampler 파라미터 해설 영상 정리
