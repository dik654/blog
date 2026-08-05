# Video Model Runtime content spec

## Reader contract

- 독자는 이미지 여러 장을 이어 붙이면 영상이 된다고 생각할 수 있다.
- 첫 화면은 종이 넘기기 애니메이션에서 컵 손잡이와 로고가 장마다 바뀌는 장면으로 시작한다.
- image runtime의 기본 순서를 짧게 다시 설명하므로 앞 글을 읽지 않아도 진입할 수 있다.
- 글을 마치면 정지 화면 품질과 시간 일관성 품질을 분리할 수 있어야 한다.

## Narrative order

1. 한 장의 모양과 여러 장 사이의 연속성은 다른 문제임을 본다.
2. image runtime의 조건-작업 공간-복원 순서를 다시 세운다.
3. 시간축 latent와 motion state를 추가한다.
4. T2V, I2V, V2V, audio가 서로 다른 관측 계약임을 구분한다.
5. decode, interpolation, upscale, mux 단계에서 새로 생기는 시간 오류를 추적한다.
6. frame, resolution, attention과 offload가 만드는 실제 memory peak를 계산한다.

## Source intent

- Wan2.2 official repository: A14B의 noise-regime expert 분리와 TI2V-5B의 VAE 압축을 variant별 사실로 확인한다.
- LTX-2.3 open-source documentation: synchronized audio-video generation과 지원 입력 범위의 공식 근거.
- joint loss 식은 교육용 분해이며 공개되지 않은 정확한 training recipe라고 주장하지 않는다.

## Hard-transfer oracle

각 frame은 선명하지만 제품 로고가 흔들리고, 24fps 결과의 소리가 0.3초 늦으며, frame interpolation 뒤 flicker가 커졌다고 하자. 독자는 본문만으로 다음을 설명해야 한다.

- 로고 흔들림은 한 장의 image metric이 아니라 temporal identity defect다.
- image condition이 어느 frame까지 주입되는지와 temporal attention의 보존을 확인한다.
- audio sample rate, duration, token alignment와 mux timestamp를 나누어 검사한다.
- interpolation 전후 artifact를 별도로 저장해 model failure와 delivery pipeline failure를 분리한다.

## Failure signals

- frame 수를 늘리면 motion 품질이 자동으로 좋아진다고 말한다.
- 모든 video MoE를 token routing LLM MoE와 같다고 설명한다.
- model parameter만으로 VRAM을 예측한다.
- exact text, identity, motion, sync를 하나의 품질 점수로 압축한다.

## Visual contract

- image와 video mode를 전환해도 공통 stage 위치가 유지되어 상속 관계가 보인다.
- 시간축이 추가될 때 shape와 failure owner가 어떻게 늘어나는지 명시한다.
- 360px에서 가로 잘림, 내부 scroll, 12px 미만 label이 없어야 한다.
- animation은 변화 원인을 보여 줄 때만 쓰고 reduced-motion에서 같은 정보를 정적으로 제공한다.
