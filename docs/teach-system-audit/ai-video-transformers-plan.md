# Video Transformer 재작성 계획

## 질문

30 fps 원본에서 source stride 2로 뽑은 16-frame clip을 `2×16×16` tubelet로 바꾸면 무엇이 1,568개가 되며, TimeSformer의 divided attention과 VideoMAE의 tube masking은 각각 어느 계산을 바꿉니까?

## 직속 부모와 고정 사례

- 부모: `/cs/ai/video-understanding#return`
- 앞 글: `/cs/ai/video-convolution-architectures#return-map`
- 입력: 30 fps, source index `0,2,…,30`, 16 frames, `224×224`
- tubelet: temporal depth 2, spatial patch `16×16`
- geometry: `8×14×14 = 1,568` tokens

## 전개

1. 같은 timestamp clip을 3D grid로 고정합니다.
2. sampled frame 두 장과 같은 공간 patch를 tubelet 하나로 묶습니다.
3. `T=8`, `S=196`에서 joint와 divided attention의 연결 그래프와 pair proxy를 대조합니다.
4. VideoMAE 공식 구현의 per-spatial-frame truncation과 temporal tiling을 따라 90% tube mask가 160 visible tokens를 만드는 과정을 추적합니다.
5. interaction을 나누는 것과 encoder input을 줄이는 것은 서로 다른 축임을 부모 지도에 반환합니다.

## 1차 근거

- TimeSformer ICML 2021 논문과 공식 코드 commit `a5ef29a7b7264baff199a30b3306ac27de901133`
- VideoMAE arXiv v3/NeurIPS 2022 논문과 공식 코드 commit `14ef8d856287c94ef1f985fe30f958eb4ec2c55d`

## 검증할 수치

- tubelet: `16/2 × 224/16 × 224/16 = 1,568`
- joint: `1,568² = 2,458,624`
- divided: `8×196² + 196×8² = 307,328 + 12,544 = 319,872`
- VideoMAE official tube mask: `int(.9×196)=176`, `(196−176)×8=160` visible, `176×8=1,408` masked

## 경계

- pair proxy는 heads·embedding dimension·MLP·memory traffic·kernel latency를 포함하지 않습니다.
- TimeSformer 원형은 frame-level 2D patches를 사용하며, 이 글의 tubelet depth 2 fixture는 VideoMAE cube embedding을 따릅니다.
- 90% masking의 유효성은 VideoMAE 논문의 pretraining·dataset·evaluation 범위에 한정합니다.
