# Video convolution architectures 재작성 계획

## 분류

- Track: `concept`
- Form: explanation
- Medium: article
- 독자: 비디오 모델 이름은 들어 봤지만, 같은 clip이 각 구조에서 어떻게 계산되는지 아직 연결하지 못한 독자
- 현재 과제: I3D·R(2+1)D·SlowFast를 이름 목록으로 외우지 않고, 한 입력이 각 구조에서 달라지는 지점을 계산해 설명하기
- 선행 지식: 부모 글의 timestamp·source FPS·sampling stride, CNN의 channel과 convolution
- Truth status: 원 논문의 구조와 표기는 공식 공개 논문 근거, 숫자 fixture는 설명용 가정, 대상 환경의 성능은 미측정

## 한 문장 답과 다음 질문

한 문장 답: 세 구조는 모두 시간 정보를 쓰지만, I3D는 2D weight를 3D 초기값으로 옮기고, R(2+1)D는 한 3D 연산을 공간·시간 두 연산으로 나누며, SlowFast는 같은 구간을 서로 다른 sampling rate와 channel 수로 읽습니다.

다음 질문: 같은 30 fps 영상과 같은 관측 구간을 넣었을 때 각 구조가 읽는 source timestamp, weight, 중간 feature, pathway shape는 실제로 어떻게 달라집니까?

## 범위

### 이 글이 소유하는 것

1. Temporal convolution의 kernel·dilation·layer stride를 source timestamp span으로 환산합니다.
2. I3D의 boring-video fixed point가 보존하는 값과 보존하지 않는 값을 구분합니다.
3. R(2+1)D가 full 3D convolution을 공간·ReLU·시간 순서로 나누고 parameter 수를 맞추는 방법을 계산합니다.
4. SlowFast의 `T`, `tau`, `alpha`, `beta`가 같은 raw clip에서 두 pathway shape를 만드는 과정을 계산합니다.

### 이 글이 다루지 않는 것

- 특정 데이터셋이나 하드웨어에서 어느 모델을 선택할지 결정하지 않습니다.
- 논문 간 accuracy·latency 순위를 일반화하지 않습니다.
- 배포, GPU 용량, serving benchmark, 운영 Runbook은 실무 글로 보냅니다.
- Video transformer의 tubelet·attention은 다음 개념 글에서 다룹니다.

## 고정 사례

원본은 30 fps 영상입니다. 입력 sampler가 source frame을 2칸마다 읽으므로 model input position은 source index `0, 2, 4, 6, 8, ...`에 대응합니다.

- Temporal layer 1: kernel 3, dilation 1, stride 1
- Temporal layer 2: kernel 3, dilation 1, stride 2
- I3D weight 예시: 2D weight 합 `6`, temporal depth `3`
- R(2+1)D feature 예시: temporal kernel `3`, spatial kernel `3×3`, input/output channel `4`
- SlowFast shape 예시: Slow `T=8`, `C=256`, `alpha=8`, `beta=1/8`; 두 pathway는 같은 raw duration을 봅니다.

수치는 구조와 계산을 보여 주기 위한 가정입니다. 논문 성능 수치로 사용하지 않습니다.

## 사실 장부

| ID | 사실 | 근거 | 상태 | 사용할 곳 |
|---|---|---|---|---|
| F1 | 한 layer의 sampled-position span은 `(k-1)d+1`, first-last gap은 `(k-1)d`입니다. | convolution geometry | 계산 가능 | receptive span |
| F2 | stacked layer는 `r_l=r_(l-1)+(k_l-1)d_l j_(l-1)`, `j_l=j_(l-1)s_l`로 계산할 수 있습니다. | convolution geometry | 계산 가능 | receptive span |
| F3 | source first-last span은 `(r-1) × input stride / source FPS`입니다. | 부모 글 timestamp contract | 계산 가능 | receptive span |
| F4 | I3D는 2D filter를 시간축으로 N회 복제하고 N으로 나눠 반복 정지 영상의 convolution response를 보존합니다. | Carreira & Zisserman, CVPR 2017 | 원문 확인 | I3D |
| F5 | 이 inflation은 초기화 규칙이며 motion knowledge 자체를 보장하지 않습니다. | F4의 보장 범위와 논문의 video training | 분석 | I3D boundary |
| F6 | R(2+1)D는 `Nin×t×d×d → M×1×d×d → Nout×t×1×1`로 factorize하고 중간 ReLU를 둡니다. | Tran et al., CVPR 2018 | 원문 확인 | R(2+1)D |
| F7 | `M=floor(t d² Nin Nout / (d² Nin + t Nout))`로 full 3D와 parameter 수를 근사 일치시킵니다. | Tran et al., CVPR 2018 | 원문 확인 | R(2+1)D calculation |
| F8 | SlowFast의 Slow shape가 `{T,S²,C}`이면 Fast는 `{alpha T,S²,beta C}`입니다. | Feichtenhofer et al., ICCV 2019 | 원문 확인 | SlowFast |
| F9 | 논문 대표값은 `alpha=8`, `beta=1/8`이며 lateral transform 뒤 Fast feature를 Slow 쪽에 결합합니다. | Feichtenhofer et al., ICCV 2019 | 원문 확인 | SlowFast |
| F10 | alpha·beta shape만으로 실제 latency·accuracy를 결정할 수 없습니다. | 연산량·runtime·task 의존 경계 | 분석 | boundary |

## 독자 순서

1. 직속 부모 지도에서 convolution 영역을 찾습니다.
2. 같은 clip이 네 경로에서 달라지는 전체 지도를 먼저 봅니다.
3. Temporal receptive field 두 layer를 source seconds까지 계산합니다.
4. I3D에서 2D weight `6`이 `[2,2,2]`로 이동하고 반복 정지 영상 response `18`이 `6`으로 보존되는 과정을 봅니다.
5. R(2+1)D에서 `3×3×3`, `4→4 channel`의 432 parameters가 `1×3×3`, `4→9`과 `3×1×1`, `9→4`의 432 parameters로 나뉘는 과정을 봅니다.
6. SlowFast에서 같은 duration이 Slow `8×256`, Fast `64×32`로 나뉘고 lateral fusion에서 시간축을 맞추는 과정을 봅니다.
7. 세 구조를 초기화·한 block의 연산 경로·전체 pathway 배분이라는 서로 다른 축으로 다시 전체 지도에 놓습니다.
8. 설계 자체의 경계와 다음 Video Transformer 질문을 남깁니다.

## 시각화 질문

| 시각화 | 질문 | 상태 변화 |
|---|---|---|
| 전체 지도 | 같은 clip에서 세 구조는 어디를 바꿉니까? | source timestamps → operator → feature path |
| Receptive span | 두 temporal layer를 지난 output 하나는 source 몇 초를 봅니까? | active input positions, `r`, `j`, source gap |
| I3D inflation | 2D response scale을 유지하면서 weight를 시간축으로 어떻게 옮깁니까? | one 2D weight → three scaled slices → same response |
| R(2+1)D | Full 3D parameter budget을 유지하며 연산을 어떻게 둘로 나눕니까? | parameter ledger and activation path |
| SlowFast | 같은 duration을 두 rate·capacity로 어떻게 나눠 읽고 합칩니까? | Slow/Fast samples and shapes → lateral transform → fusion |

모든 시각화는 고정 배치에서 상태만 바꾸며, 사용자 입력 전에는 재생하지 않습니다. JavaScript 비활성 상태에서는 같은 단계와 결론을 순서 목록으로 보여 줍니다.

## 근거 순서

1. 기존 article·learning metadata·ownership·evidence를 읽습니다.
2. CVF 공개 원문에서 I3D inflation, R(2+1)D factorization과 `M`, SlowFast `alpha`·`beta`·lateral shape를 확인합니다.
3. 고정 사례 수치를 독립 계산합니다.
4. 사실을 독자 순서에 재배치하고, 논문별 성능 주장은 source fold 안에 제한합니다.

## 완료 증거

- 전용 시각화가 기존 공용 장식 그림을 대체합니다.
- opening map과 모든 child view가 같은 입력·용어·방향을 유지합니다.
- 각 수치가 바로 앞 ledger row나 그림에서 재현됩니다.
- 글 전용 검사, 전역 reading-order, formula, calculation, pseudocode, topology, runtime 검사를 통과합니다.
- 1440px·390px, keyboard, reduced motion, JavaScript 비활성 렌더를 확인합니다.
- production 배포 뒤 같은 경로를 다시 확인한 후에만 `rewritten-production-verified`로 바꿉니다.
