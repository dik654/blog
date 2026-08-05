# KSampler 파라미터 쉽게 이해하기 - ComfyUI 입문자 필수 강의

- URL: https://www.youtube.com/watch?v=at0JcQGA3Is&t=77s
- 채널: Deno
- 업로드: 2026-06-06
- 길이: 33:28
- 분류: ComfyUI KSampler 파라미터 해설 원본 자료

## 원본 요지

ComfyUI 입문자가 KSampler를 조절할 때 이해해야 할 여섯 파라미터를 설명한다. 대상 파라미터는 `seed`, `steps`, `CFG`, `sampler`, `scheduler`, `denoise`다. 핵심 메시지는 KSampler 값을 외우는 것이 아니라, 각 값이 denoising trajectory의 어느 부분을 바꾸는지 이해하고 모델별 권장값에서 실험해야 한다는 점이다.

## 파라미터별 핵심

- `seed`: 초기 noise를 만드는 난수 트리거다. `1`과 `2`가 숫자로 가까워도 결과가 비슷해진다는 뜻은 아니다. 같은 prompt와 같은 나머지 설정에서 seed만 바꾸면 구도, 얼굴, 배치가 달라질 수 있다.
- `steps`: noise에서 이미지로 가는 denoising 반복 수다. 스텝이 많을수록 항상 좋은 것은 아니며, 모델이 권장하는 구간에서 비교해야 한다. 예시에서는 Z-Image 계열에서 30-50 같은 권장 범위를 먼저 확인하라고 설명한다.
- `CFG`: prompt 압력이다. 값을 높이면 positive/negative conditioning 차이를 더 강하게 반영하지만, 너무 높으면 얼굴, 색감, 질감이 과장될 수 있다.
- `turbo/distilled 모델`: 적은 step으로 결과를 내도록 학습된 모델은 CFG를 1로 두는 경우가 많다. 이때 일반적인 negative prompt는 실질적으로 거의 작동하지 않으므로 `ConditioningZeroOut` 같은 노드가 negative input을 채우는 자리 역할을 할 수 있다.
- `sampler`: 다음 denoising step으로 이동하는 수치 알고리즘이다. 모델별로 잘 맞는 sampler가 다르므로 정답 하나를 외우기보다 같은 seed와 steps에서 비교해야 한다.
- `scheduler`: sigma/noise level을 어떤 순서와 간격으로 줄일지 정한다. 같은 steps라도 simple, normal, karras, beta 등 스케줄러에 따라 초반 구도 형성 구간과 후반 디테일 구간의 비중이 달라진다.
- `denoise`: 원본 latent를 얼마나 강하게 다시 그릴지 정한다. `0.5`가 항상 sigma 그래프의 정확한 절반부터 시작한다는 뜻은 아니며, scheduler에 따라 실제 시작 위치가 달라진다.

## 블로그화 포인트

- KSampler는 "이미지 생성 버튼"이 아니라 latent denoising loop를 실행하는 노드로 설명한다.
- seed, steps, CFG, sampler, scheduler, denoise를 한 표로 정리하되, 각 값을 바꿀 때 실제로 달라지는 실패/품질 양상을 함께 적는다.
- CFG 수식은 `uncond + scale * (cond - uncond)` 형태로 설명한다. `scale = 1`이면 positive 조건만 남는다는 점을 FormulaNote로 바로 설명한다.
- turbo/distilled 모델에서 negative prompt가 기대처럼 안 먹는 이유를 KSampler 입력 누락 문제가 아니라 CFG 설계와 연결해 설명한다.
- denoise와 manual sigma를 연결해서, img2img/upscale/video second pass에서 왜 작은 denoise 값이나 수동 sigma가 쓰이는지 설명한다.

## 연결

- [[KSampler]]
- [[ComfyUI]]
