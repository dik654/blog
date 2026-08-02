# 신호와 시스템 재작성 명세

## 이 글의 역할

- 상위 목표: 독자가 CNN, audio pipeline, sensor loop, S4와 Mamba에서 반복되는 `sample`, `filter`, `state`, `convolution`, `scan`을 서로 무관한 용어로 외우지 않고 하나의 시간축 계약으로 읽게 한다.
- 시작 질문: 같은 숫자 배열이라도 index가 시간인지 공간인지, 미래 sample을 쓸 수 있는지, sampling rate가 얼마인지에 따라 왜 전혀 다른 계산이 되는가?
- 최소 바닥: 이산 sequence, 유한 합, 복소수의 크기·위상만 사용한다. 측도론, z-transform의 pole 증명, Laplace 기반 제어 설계까지 내려가지 않는다.
- 종료 능력: 독자가 낯선 filter·Conv1d·state recurrence를 보고 causality와 stability를 검사하고, impulse response를 구해 convolution과 recurrence 두 실행 형태를 오가며, sampling alias와 padding·delay 오류까지 추적할 수 있어야 한다.
- 계보 중단점: 1940년대 이전의 물리·Fourier 역사로 계속 내려가지 않는다. LTI의 operational definition, impulse decomposition, difference equation, sampling theorem을 이 글의 최소 바닥으로 끊고 필요한 다음 글로 연결한다.

## 첫 화면 서사 계약

```text
1초마다 방 온도를 적는 장면
→ 숫자와 측정 시각을 함께 기록해야 하는 이유
→ 한 측정값을 sample, 시간 순서 기록을 signal이라고 이름 붙이기
→ 최근 값을 섞으면 흔들림과 함께 반응 속도도 바뀐다는 장면
→ 기록을 출력으로 바꾸는 규칙을 system이라고 이름 붙이기
→ 같은 [1, 2, 1]이 기록과 섞는 규칙에서 왜 다른지 판단
```

`audio`, `image kernel`, `token sequence`, `LTI`, `convolution`을 첫 질문을 이해하기 위한 전제로 두지 않는다. 익숙한 측정 장면에서 역할을 본 뒤 정확한 용어를 붙이고, QuestionLead의 답은 용어 목록이 아니라 `축·간격·역할`의 세 계약으로 설명한다.

## 숨은 전이 문제

아래 수치와 문제 문장은 공개 본문에 복사하지 않는다. 작성자·감사자 전용 fixture다.

58 Hz로 표본화하는 진동 센서에 12 Hz 유효 신호와 46 Hz 간섭이 함께 들어온다. 입력의 일부를 `x=[1,-2,4,1,-1]`, causal FIR을 `h=[0.6,0.3,-0.1]`로 두고, 별도로 scalar state system

`s[n]=0.75s[n-1]+x[n]`, `y[n]=1.4s[n]`, `s[-1]=0`

을 사용한다. 배치 구현자는 FFT를 길이 5로 계산했고, PyTorch 구현자는 같은 `h`를 `Conv1d` weight에 그대로 넣었다. 실시간 구현자는 중앙 정렬 smoothing을 현재 출력에 사용하려 한다.

본문만 읽은 독자는 다음을 풀 수 있어야 한다.

1. 46 Hz가 58 Hz sampling에서 만드는 alias를 찾고 12 Hz 성분과 구분할 수 있는지 판단한다.
2. anti-alias filter가 ADC 뒤가 아니라 앞에 있어야 하는 이유를 설명한다.
3. causal linear convolution의 support와 길이 `N+M-1`을 구하고 출력의 임의 두 위치를 flip·shift·multiply·sum으로 계산한다.
4. centered smoothing이 offline에서는 가능하지만 zero-latency streaming에서는 미래 sample을 요구한다는 실패를 찾는다.
5. `h`의 절대합으로 FIR의 BIBO stability를 판정하고, scalar recurrence는 `|0.75|<1`에서 왜 안정적인지 말한다.
6. recurrence를 펼쳐 `h_state[k]=1.4(0.75)^k` 형태의 impulse response를 얻고 convolution과 같은 출력을 만든다는 것을 보인다.
7. FFT 길이 5가 circular wrap-around를 만드는 이유와 linear convolution에 필요한 최소 zero-padding 길이를 제시한다.
8. PyTorch `Conv1d`가 mathematical convolution이 아니라 cross-correlation이라는 convention 차이를 찾아, 같은 수치 출력을 원할 때 kernel index를 어떻게 바꿀지 말한다.
9. stride, dilation, padding을 바꿨을 때 output length와 receptive field가 어떻게 달라지는지 계산한다.
10. fixed LTI SSM은 recurrence와 convolution kernel로 둘 다 실행할 수 있지만 input-dependent selective SSM은 하나의 고정 convolution kernel로 줄일 수 없다는 경계를 설명한다.
11. bounded input에 unbounded output을 내는 system, linear하지만 time-varying인 system, nonlinear하지만 time-invariant인 system의 반례를 각각 구성한다.

각 섹션은 위 능력 중 적어도 하나를 직접 해결해야 한다. 마지막 `CapabilityCheck`는 fixture 숫자를 노출하지 않고 같은 종류의 전이를 확인한다.

## 근거와 주장 경계

### 표준 신호·시스템 정의

- MIT OpenCourseWare RES.6-007 Lecture 4:
  - 이산·연속 LTI system에서 delayed impulse의 선형 결합으로 입력을 표현하고 convolution sum/integral을 유도한다.
  - <https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/27da9a018e92fc06d2cf1fbce5cd3e71_MITRES_6_007S11_lec04.pdf>
- MIT OpenCourseWare RES.6-007 Lecture 5:
  - LTI system의 memoryless, causal, BIBO stable 조건을 impulse response로 판정한다.
  - BIBO stability는 discrete에서 `sum |h[k]| < infinity`, continuous에서 `integral |h(t)| dt < infinity`와 동치다.
  - 원문은 memoryless system이면 impulse response가 scaled impulse여야 한다는 방향을 명시한다. scaled impulse이면 convolution이 현재 sample의 scale만 남겨 memoryless라는 역방향은 convolution 정의에서 본문이 직접 유도한다.
  - <https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/431b597316940ea786c72a16b8cd6371_MITRES_6_007S11_lec05.pdf>
- MIT OpenCourseWare RES.6-007 Lecture 6:
  - linear constant-coefficient difference equation, auxiliary condition, recursive implementation과 direct-form memory를 다룬다.
  - auxiliary condition이 0인 것이 linear system의 조건이고, initial rest가 causal LTI difference-equation system을 고정하는 조건임을 본문에 명시한다. fixture의 `s[-1]=0`은 initial rest의 유한 index 표현이다.
  - 추출본의 homogeneous-solution OCR은 판독성이 낮으므로 geometric kernel 계수는 해당 OCR 문장을 인용하지 않는다. 본문이 recurrence를 반복 대입해 직접 유도하고, 뒤의 S4 원문에 있는 recurrence-to-kernel 전개로 독립 대조한다.
  - <https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/c7ac1086bd3994495536c05eb68d9afb_MITRES_6_007S11_lec06.pdf>
- MIT OpenCourseWare 6.003 Lecture 9:
  - complex exponential이 LTI system의 eigenfunction이며 frequency response가 amplitude와 phase를 바꾸는 계수라는 근거다.
  - 이 원문은 continuous-time `e^{st}`와 Laplace 적분으로 유도한다. 본문의 discrete-time 합 `e^{j omega n}`은 같은 LTI convolution 구조에 `e^{j omega(n-k)}`를 직접 대입해 별도로 유도하며, 원문에 이산 합이 그대로 실려 있다고 주장하지 않는다.
  - real-valued `h`에서는 conjugate symmetry `H(-j omega)=H(j omega)*`로 양·음 주파수 항이 결합되어 실수 sinusoid의 magnitude/phase 표현이 된다는 전제를 밝힌다.
  - <https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/ae0f6535cd4c67454ac3cf1a70c85934_MIT6_003F11_lec09.pdf>
- MIT OpenCourseWare RES.6-007 Lecture 16:
  - bandlimited signal의 sampling, spectrum 복제, `omega_s > 2 omega_M`, ideal low-pass reconstruction과 aliasing을 다룬다.
  - 정확 복원 주장은 bandlimited assumption 아래에서만 쓴다. 경계 등호는 일반적인 안전 조건으로 제시하지 않는다.
  - 원문은 sampling 뒤 ideal low-pass reconstruction과 aliasing의 불가역성을 직접 다룬다. analog anti-alias filter를 ADC 앞에 둬야 한다는 문장은 “sample 뒤에는 겹친 원인을 분리할 수 없다”는 결과에서 도출한 engineering inference라고 본문에서 구분한다.
  - <https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/8708ec068ebdea2c4ee2f38fad39fb83_MITRES_6_007S11_lec16.pdf>

### 실제 구현 계약

- PyTorch `Conv1d`:
  - 공식 식은 cross-correlation이다. input/output channel 합, stride, padding, dilation, groups와 output length 식을 해당 문서 기준으로 쓴다.
  - `padding="same"`은 stride 1에서만 지원된다는 runtime 경계를 포함한다.
  - <https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv1d.html>
- SciPy `fftconvolve`:
  - full linear convolution의 출력 길이는 `N+M-1`이고 `full`, `same`, `valid` mode가 다르다.
  - FFT가 항상 빠르다고 쓰지 않는다. 큰 배열에서 유리하지만 작은 배열에서는 direct method가 더 빠를 수 있고, zero-padding boundary artifact를 확인해야 한다.
  - <https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.fftconvolve.html>

### AI architecture 연결

- S4:
  - continuous state space를 discretize한 recurrence와, LTI recurrence를 펼쳐 만든 convolution kernel을 둘 다 사용한다.
  - recurrence `x_k=A_bar x_{k-1}+B_bar u_k`, output `y_k=Cx_k`에서 kernel `(CB_bar, CA_bar B_bar, ...)`을 얻는 연결을 설명한다.
  - <https://arxiv.org/abs/2111.00396>
- Mamba:
  - fixed `A,B,C,Delta`인 고전 SSM은 LTI지만, input-dependent selection을 도입하면 time-varying이 되어 하나의 고정 convolution kernel 표현을 사용할 수 없고 hardware-aware scan이 필요하다.
  - Mamba 전체 성능을 LTI 이론만으로 설명한다고 과장하지 않는다.
  - <https://arxiv.org/abs/2312.00752>

## 서사와 섹션

### 01 · 배열보다 먼저 시간축 계약을 고정한다

- continuous `x(t)`와 discrete `x[n]`, sample interval `T_s`, sampling rate `f_s=1/T_s`.
- index의 단위, acquisition time, processing time, missing sample을 구분한다.
- system `T{x}=y`, memory, causality, time invariance, linearity, BIBO stability를 입력-출력 질문으로 정의한다.
- Viz `SystemPropertyLab`: delay, moving average, time-varying gain, square, accumulator를 선택하고 scale/add/shift/bounded-input probe를 실행한다. 결과만 표시하지 않고 어떤 witness가 계약을 깨는지 보여 준다.

### 02 · Impulse 하나에서 convolution 전체를 재구성한다

- `delta[n]`, shifted impulse, input decomposition.
- linearity가 응답을 더하게 하고 time invariance가 같은 `h`를 shift해 재사용하게 하는 두 단계.
- flip → shift → overlap → multiply → sum.
- support와 causal boundary를 먼저 보여 주고 finite example을 계산한다.
- Viz `ConvolutionWorkbench`: 모바일에서 6-column 고정 표를 강요하지 않는다. 현재 `n`의 살아 있는 항만 큰 행으로 보여 주고, 전체 output은 별도 chart로 분리한다.

### 03 · Impulse response로 memory·causality·stability를 판정한다

- memoryless iff scaled impulse, causal iff `h[k]=0` for `k<0`, BIBO stable iff absolute sum finite.
- accumulator는 bounded step input에 unbounded ramp output을 내므로 BIBO failure다.
- centered moving average와 causal moving average를 비교해 offline/streaming 경계를 드러낸다.
- FormulaNote에서 충분조건처럼 흐리지 않고 이 글의 discrete LTI 범위에서는 필요충분 조건임을 밝힌다.

### 04 · Difference equation을 펼치면 state와 kernel이 연결된다

- first-order recurrence를 한 단계씩 펼쳐 과거 입력 계수를 찾는다.
- auxiliary condition이 0이어야 linearity가 보존되고, initial rest가 causal LTI solution을 고정한다. `s[-1]=0`을 initial rest의 사례로 연결한다.
- initial state가 0이 아니면 zero-input response와 zero-state response를 구분한다.
- scalar geometric kernel은 판독이 깨진 Lecture 6 OCR을 직접 인용하지 않고 반복 대입으로 유도하며 S4의 recurrence-to-kernel 식과 대조한다.
- scalar `|a|<1`, `|a|=1`, `|a|>1`의 기억 decay·보존·폭주를 비교한다. 다차원 일반화는 eigenvalue 글로 넘긴다.
- Viz `RecurrenceKernelLab`: `a`와 impulse/step input을 조절하고 state scan, impulse kernel, convolution output을 같은 축에서 대조한다.

### 05 · Complex exponential은 모양을 유지하므로 주파수별 gain을 읽을 수 있다

- Lecture 9의 원 유도는 continuous-time/Laplace라는 경계를 먼저 밝히고, discrete convolution 식에는 본문이 `e^{j omega n}`을 직접 넣어 `H(e^{j omega})e^{j omega n}`을 유도한다.
- magnitude는 증폭·감쇠, phase는 정렬·delay를 나타낸다.
- real-valued impulse response에서는 conjugate symmetry로 양·음 주파수 항이 결합되어 실수 sinusoid의 magnitude·phase 표현이 된다는 전제를 둔다.
- linear convolution과 DFT의 circular convolution을 구분하고 zero-padding `N+M-1`을 설명한다.
- direct vs FFT는 의미가 아니라 실행 비용 선택이며 작은 kernel에서 FFT를 강제하지 않는다.
- 자세한 butterfly 구현은 `FFT` 글로 넘긴다.

### 06 · Sampling은 점을 찍는 일이 아니라 복원 가능한 정보를 정하는 일이다

- bandlimited assumption → spectrum replication → overlap 없음 → `f_s>2B`.
- alias는 sample 이후에는 원 신호와 구분할 수 없다. analog anti-alias filter가 sampling 앞에 필요하다는 배치 결론은 Lecture 16의 불가역성에서 도출한 engineering inference임을 본문에 표시한다.
- frequency와 sample rate를 조작하면 원 신호와 alias 후보가 같은 sample을 통과하는 장면을 보여 준다.
- Viz `SamplingExplorer`: 고정 600px SVG의 작은 글씨를 제거하고, 좁은 화면에서는 plot/진단/result를 세로로 분리한다. control target은 44px 이상이다.

### 07 · CNN, audio, S4, Mamba에서 어디까지 같은가

- PyTorch Conv1d의 cross-correlation convention과 output length를 실제 shape 예로 계산한다.
- 신호처리 convolution과 같은 수치를 원하면 `weight[k]=h[M-1-k]`처럼 kernel index를 반전해 적재해야 한다는 변환을 02의 flip 단계와 직접 연결한다.
- stride는 출력 위치를 건너뛰고 dilation은 kernel tap 간격을 벌리며, 둘을 단순히 같은 downsampling으로 부르지 않는다.
- 한 layer의 effective receptive width `d(K-1)+1`을 output length와 별도로 계산한다. stacked receptive field의 일반식은 이 글 범위 밖임을 밝힌다.
- convolution 뒤 activation이 들어가면 전체 network는 linear가 아니다.
- fixed SSM은 recurrent scan과 convolution kernel의 dual execution이 가능하다.
- selective SSM은 input-dependent coefficients 때문에 fixed LTI convolution 경계 밖이다.
- audio/sensor에서는 rate, causal filter delay, timestamp가 모델 tensor shape보다 앞선 계약이다.
- 내부 연결: `fft`, `differential-equations-phase-plane-numerical-integration`, `llm-architecture-hybrid-linear`, `robot-dynamics-feedback-control`, `audio-representation-neural-codecs`.

## 수식 계약

모든 핵심 식은 `MathFormula`로 렌더링하고 바로 아래 `FormulaNote`를 둔다. 식 안에는 가능한 경우 짧은 한글 `underbrace`로 각 연산의 목적을 표시한다. 한 식에 설명을 과적재해 글자가 작아지면 두 식으로 나눈다.

- `T{a x_1+b x_2}=aT{x_1}+bT{x_2}`와 shift test.
- `x[n]=sum_k x[k]delta[n-k]`.
- `y[n]=sum_k x[k]h[n-k]`.
- causal/BIBO conditions.
- first-order recurrence의 unroll과 impulse response.
- eigenfunction derivation과 `Y=HX`.
- linear convolution length와 zero-padding.
- sampling condition과 alias mapping.
- PyTorch Conv1d output length.
- 한 Conv1d layer의 effective receptive width `d(K-1)+1`.

모바일 390px에서 formula container overflow를 허용하지 않는다. computed formula scale이 0.76 아래로 떨어지면 font를 더 줄이지 말고 식과 한글 label을 분리한다. raw `\omega`, `\delta`, `\sum`, `\bar A` 문자열을 prose에 두지 않는다.

## Viz 계약

- 색 변경만으로 상태를 구분하지 않는다. label, shape, line style, current witness를 함께 사용한다.
- semantic accent는 blue=input, violet=system/kernel, emerald=valid output, amber=boundary, red=failure로 제한한다.
- 선은 같은 hierarchy에서 굵기를 통일하고 arrow가 text를 가로지르지 않게 한다.
- control target은 최소 44px, keyboard focus와 visible label을 갖는다.
- plot label은 모바일 실제 렌더에서 12px 아래로 만들지 않는다.
- 390/768/1440에서 document와 figure horizontal overflow가 1px 이하여야 한다.
- animation은 전체 본문과 static interaction 검증 뒤 별도 pass에서 추가한다. `prefers-reduced-motion`에서 정지해도 모든 인과를 읽을 수 있어야 한다.
- 장식용 큰 공백을 만들지 않는다. figure 앞 질문, 조작, 바로 아래 해석이 하나의 시야 흐름으로 이어져야 한다.

## 검증

- 정적:
  - article section metadata와 실제 section id 일치
  - raw LaTeX 없음
  - 핵심 display 식마다 인접 `FormulaNote`
  - 직접 조작 Viz 최소 4개
  - 내부 학습 링크 최소 5개
  - LTI 반례, BIBO 조건, linear/circular convolution, anti-alias 위치, Conv1d cross-correlation, S4/Mamba 경계 존재
- 수치:
  - convolution output을 독립 계산과 대조
  - recurrence scan과 generated kernel convolution 일치
  - alias mapping과 Nyquist 상태 갱신
  - Conv1d output length가 공식 문서 식과 일치
- 시각:
  - 390/768/1440 screenshot
  - document/figure/formula overflow, text clipping, label collision
  - 44px control target과 keyboard focus
  - Viz의 실제 concept area가 본문 폭을 충분히 사용하고 과도한 빈 공간이 없는지 확인
- Claude:
  - 작성 전에는 이 명세를 MIT, PyTorch, SciPy, S4, Mamba source snapshot과 작은 범위로 나눠 감사한다.
  - 작성 후에는 숨은 fixture를 본문만으로 풀고 수식·runtime·responsive를 별도 micro audit으로 검증한다.
  - HTTP 200만으로 통과 처리하지 않는다. `.ok=true`, `claude-code:sonnet`, attempt success, 120자 초과, 첫 줄 `ACCEPT|REVISE`, source hash stable을 모두 만족해야 한다.
  - timeout, 500, empty result는 무효로 기록하고 같은 넓은 요청을 반복하지 말고 더 작은 범위로 분해한다.
