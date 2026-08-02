# Image Model Runtime content spec

## Reader contract

- 독자는 이미지 생성 모델을 사용해 본 적은 있어도 `condition`, `latent`, `denoiser`, `solver`, `VAE`를 모를 수 있다.
- 첫 화면은 한국어 패키지 시안을 주문하는 장면으로 시작한다.
- 역할을 일상어로 본 뒤에만 기술 이름을 붙인다.
- 글을 마치면 결과 실패를 prompt 하나의 문제로 몰지 않고 최초 실패 stage를 찾을 수 있어야 한다.

## Narrative order

1. 주문서와 참고 이미지를 읽는다.
2. 작은 작업 공간에서 무작위 상태를 여러 번 고친다.
3. 압축 결과를 RGB pixel로 펼친다.
4. 이 세 흐름을 condition, latent, denoiser/solver, VAE로 세분한다.
5. 각 stage의 input, output, failure owner를 수식과 Viz로 검산한다.
6. architecture 이름보다 prediction contract와 artifact boundary를 먼저 확인한다.

## Source intent

- Latent Diffusion Models: pixel 대신 autoencoder latent에서 diffusion하고 cross-attention으로 조건을 주입하는 역사 기준점.
- Krea 2 Technical Report: 2026년 공개 image foundation model에서 DiT, attention, timestep modulation과 VAE가 함께 설계되는 현재 사례.
- 본문의 다섯 stage는 여러 모델을 비교하기 위한 교육용 실행 분해다. 특정 제품의 비공개 graph라고 주장하지 않는다.

## Hard-transfer oracle

한글 제목은 틀렸고 컵 모양은 맞으며, VAE를 바꾸자 색만 탁해졌다고 하자. 독자는 본문만으로 다음을 설명해야 한다.

- 글자 오류는 tokenizer, 실제 encoder input, visible-text 학습과 condition path부터 확인한다.
- 컵 모양이 맞다는 사실만으로 denoiser 전체가 정상이라고 단정하지 않는다.
- VAE 교체 뒤 생긴 색 변화는 decoder scale, channel, color contract를 먼저 의심한다.
- seed, solver, LoRA와 postprocess를 한꺼번에 바꾸지 않고 한 축씩 통제한다.

## Failure signals

- 첫 질문의 답에서 정의되지 않은 tensor 이름을 연속 나열한다.
- prompt를 바꾸면 모든 실패를 고칠 수 있다고 암시한다.
- step 수가 많을수록 항상 좋다고 말한다.
- model output과 postprocess output을 구분하지 않는다.

## Visual contract

- 공통 runtime Viz는 입력에서 pixel까지 왼쪽에서 오른쪽으로 읽힌다.
- 360px에서는 stage가 잘리거나 가로 scroll을 요구하지 않는다.
- 색은 stage 구분을 보조할 뿐, 의미를 색 하나에만 맡기지 않는다.
- label은 12px 이상이며 선택 상태에서 geometry가 움직이지 않는다.
