# AI 수식·Viz P3 중간 보고서

## 1. 이번 배치의 경계

이번 배치는 모든 구형 Viz를 새 디자인으로 교체한 작업이 아니다. 먼저 전체 재구성이 다시 무너지지 않도록 다음 두 기반을 고정했다.

1. AI 글의 표시 수식은 바로 아래에서 한글로 식 전체의 의미, 기호, 연산을 선택한 이유를 설명한다.
2. 모바일과 데스크톱에서 본문·수식·StepViz stage가 넘치거나 빈 화면이 되지 않는다.

이 기준을 통과한 뒤에만 topic별 Viz의 서사, 조형, 상호작용을 다시 설계한다. 레이아웃 안전성과 시각적 완성도를 같은 완료 표시로 합치지 않았다.

## 2. 수식 감사에서 배운 점

최초 공식 감사에는 137개의 수식 설명 공백이 있었다. 이 숫자를 바로 137개의 글쓰기 작업으로 해석하지 않았다.

- 공통 논문 renderer와 NLP 공통 renderer가 imported section을 충분히 연결하지 못해 false positive가 생겼다.
- shared renderer를 고친 뒤 실제 AI 공백은 12개 article family의 41건으로 좁혀졌다.
- 각 식에 인접한 `FormulaNote`를 추가하고 긴 식을 의미 단위 `aligned` 행으로 나눴다.
- 최종 공식 감사는 전체 581개 글 중 29개 비AI 공백만 남겼고, AI 공백은 0개다.

대상에는 ARIMA, CNN, ResNet, Sentence Embeddings, Tabular DL, ECOD, GAN, 생성 모델 이론, VAE, Diffusion, Wan2.2, LTX-2.3이 포함된다.

FormulaNote는 기호 사전으로 끝내지 않았다. 예를 들어 convolution 출력 크기에서 floor가 필요한 이유, ECOD가 tail probability에 `-log`를 적용하는 이유, triplet loss가 margin을 두는 이유를 식 바로 아래에 적었다. 독자가 나중 문단에서 설계 의도를 역추론하지 않게 하기 위한 결정이다.

## 3. 본문 정확성 보정

수식을 설명하는 과정에서 ResNet의 과도한 단순화를 함께 수정했다.

- degradation problem을 vanishing gradient 하나로 환원하지 않았다.
- identity 항의 `+I`가 gradient norm을 항상 1 이상으로 보장한다고 쓰지 않았다. residual Jacobian과 상쇄될 수 있다.
- `2^n independent ensemble`을 문자 그대로의 독립 ensemble이 아니라 path-view 해석으로 한정했다.

CNN 출력 크기는 실제 framework 동작과 맞게 floor를 포함했다. 큰 자동 floor delimiter는 현재 KaTeX SVG path 오류를 만들기 때문에 일반 `\lfloor ... \rfloor`로 렌더링했다.

## 4. 공통 Viz 프레임 보정

공통 `StepViz`는 모바일에서 실제 SVG가 100~150px 높이인데 stage를 240px 이상 강제해 큰 빈 공간을 만들었다. 모바일 최소 높이를 190px로 줄이고 desktop의 360px 규칙은 유지했다.

legacy SVG의 semantic color가 topic card 색과 Oklch로 섞이며 파랑·초록 점까지 분홍색으로 흐려졌다. 배경과 sRGB로 섞도록 바꾸고 semantic hue와 대비를 보존했다. 작은 SVG 글자는 모바일에서 11px 아래로 내려가지 않도록 공통 하한을 뒀다.

대표 결함은 별도로 고쳤다.

- ResNet: SVG `y`를 CSS transform으로 animation해 막대가 stage 밖으로 밀리던 문제를 bottom-origin `scaleY` animation으로 교체했다.
- Tabular DL: SVG 안의 emoji가 missing glyph 사각형으로 보이던 문제를 `01`, `02`, `03` milestone 표식으로 교체했다.
- ECOD: point, ECDF curve, tail overlay와 label 대비를 높였다.
- ARIMA, CNN, SBERT, LTX: 0.6배 수준으로 축소되던 긴 식을 의미 단위로 줄바꿈했다.

## 5. 회귀 계약

`tests/ai-formula-viz-corpus-p3.spec.ts`는 12개 대표 slug를 mobile과 desktop에서 검사한다.

- formula와 FormulaNote가 실제로 보이는가
- document, formula, StepViz stage의 horizontal overflow가 1px 이하인가
- formula scale이 0.8 아래로 줄지 않는가
- `\\theta`, `\\frac` 같은 raw LaTeX가 본문에 남지 않는가
- FormulaNote가 한글 설명을 포함하는가
- console error와 page error가 없는가

첫 실행은 CNN의 큰 floor delimiter에서 KaTeX 내부 SVG `MM...` path 오류를 찾아냈다. 식 표기를 조정한 뒤 24/24가 통과했다. 이 사례 때문에 브라우저 console 검사도 수식 회귀 계약에 포함한다.

## 6. 시각 검토 결과

모바일 screenshot에서 다음 상태를 직접 확인했다.

- Tabular DL 3단계의 세 조건이 깨진 emoji 없이 번호와 계층으로 보인다.
- ECOD 3단계에서 왼쪽·오른쪽 tail이 구분되고, 4단계에서 낮은 확률이 높은 점수로 바뀌는 흐름이 보인다.
- LTX dual-stream 식은 영상·문장·오디오 항의 한글 underbrace가 0.8 이상 크기로 보인다.
- ResNet 비교 chart의 막대가 첫 scene부터 stage 안에 존재한다.

이는 clipping과 가독성 하한을 통과했다는 뜻이다. ECOD처럼 아직 정적인 곡선과 작은 label에 의존하는 Viz, Sentence Embedding처럼 설명 상태가 약한 Viz는 다음 topic별 재설계 대상이다.

## 7. 남은 작업

1. ARIMA, CNN, ResNet, Sentence Embeddings, Tabular DL, ECOD의 모든 scene을 misconception과 상태 변화 기준으로 다시 평가한다.
2. 단순 선·박스·화살표를 유지할 이유가 없는 scene은 interactive control surface나 비교 실험으로 교체한다.
3. 360, 390, 768, 1440px에서 각 scene의 default, counterexample, failure, pass 상태를 캡처한다.
4. 정적 서사가 확정된 scene에만 animation과 reduced-motion fallback을 붙인다.
5. 29개의 비AI 수식 공백은 해당 category 작업으로 분리한다. AI Viz 재설계 완료로 오해하지 않는다.

## 8. 작은 모델에 남길 실행 규칙

4B/9B 모델에는 “Viz를 예쁘게 고쳐라”라고 주지 않는다. scene 하나마다 아래 입력을 고정한다.

```json
{
  "misconception": "이 scene이 제거할 한 가지 오해",
  "state_change": ["default", "counterexample", "failure", "pass"],
  "reader_decision": "조작 후 독자가 내릴 판단",
  "formula_contract": {
    "equation": "의미 단위로 나눈 KaTeX",
    "operation_reason": "왜 이 연산을 쓰는지",
    "symbol_notes": "한글 기호 설명"
  },
  "layout_contract": {
    "viewports": [360, 390, 768, 1440],
    "min_formula_scale": 0.8,
    "min_svg_text_px": 11,
    "inner_scroll": false,
    "clipping": false
  },
  "evidence": ["interaction test", "console test", "state screenshot"]
}
```

작은 모델은 scene code 작성과 자기검사를 맡을 수 있다. 최종 screenshot의 계층, 색 대비, 공백, 선 굵기와 서사 연결은 별도 verifier가 판단해야 한다.

## 9. 학습 핵심 경로 재구성

P3의 다음 배치는 `딥러닝 학습 개요 → 퍼셉트론 → 신경망 → 활성화 함수 → 크로스 엔트로피 → 역전파 → 옵티마이저 → 오토인코더`를 하나의 실행 가능한 학습 루프로 고정했다.

- 원본 article 배열도 이 순서로 재배치해 sidebar와 path renderer가 서로 다른 순서를 만들지 않게 했다.
- `전체 지도`라는 표현은 범위를 과장하므로 `학습 루프`와 `신경망 학습 핵심 경로`로 바꿨다.
- 신경망 글이 선형층 붕괴를 소유하고, 활성화 함수 글은 그 증명을 반복하지 않고 local slope와 gradient failure를 소유하게 했다.
- 퍼셉트론은 XOR 실패를 input space와 hidden feature space의 실제 좌표 변화로 보여 주고, 역전파는 forward·backward를 같은 계산 그래프의 반대 실행 순서로 통일했다.
- gradient accumulation은 graph branch의 합산과 micro-batch buffer 누적이라는 서로 다른 의미를 명시적으로 분리했다.

## 10. Cross-Entropy 정확성 보정

Claude의 독립 검토는 `-1/p`를 그대로 “실제 큰 수정 신호”로 설명한 문장이 다음 절의 `p-y`와 충돌한다고 지적했다. 이 지적은 반영했다.

1. `-1/p`는 loss를 확률에 대해 미분한 값이다.
2. 신경망은 확률을 직접 update하지 않고 logit을 update한다.
3. softmax Jacobian의 `p(1-p)`를 곱하면 정답 logit의 gradient는 `p-1`이 되어 -1과 0 사이에 남는다.
4. sigmoid+MSE는 activation derivative를 추가로 곱해 확신한 오답에서 gradient가 작아진다.

정답 확률 0.01에서 CE logit gradient는 -0.99, sigmoid+MSE gradient는 약 -0.0098이라는 숫자 비교를 넣었다. 또한 one-hot target과 soft target의 entropy floor를 분리하고, label smoothing 식과 LLM의 `perplexity = exp(mean NLL)`를 추가했다. 이로써 “평균 token NLL이 0.1 nat 감소하면 PPL은 약 9.5% 감소한다”는 전이 계산을 본문만으로 할 수 있다.

## 11. Autoencoder 계산 폐쇄

오토인코더는 단순한 `x → z → x-hat` 소개에서 다음 계산 폐쇄를 갖는 글로 확장했다.

- 2→1→2 forward 예제와 같은 weight를 사용해 `delta_out`, latent 책임, `delta_z`, encoder weight gradient까지 숫자로 검산한다.
- 선형 k차원 bottleneck의 최소 MSE가 버린 covariance eigenvalue의 합이라는 PCA 관계를 넣었다.
- MSE는 Gaussian observation model, BCE는 Bernoulli observation model의 negative log-likelihood라는 cross-entropy 연결을 명시했다.
- VAE 식은 단순한 두 loss의 합이 아니라 negative ELBO로 위치시키고, beta weighting과 posterior collapse를 다음 VAE 글의 경계로 연결했다.
- latent diffusion autoencoder에서 pixel MSE만으로 충분하지 않아 perceptual·adversarial loss를 함께 쓰는 이유를 명시했다.
- 입력 reconstruction용 고전 Sparse AE와 Transformer residual stream 해석용 현대 SAE를 같은 이름의 다른 문제로 구분했다.

## 12. Claude 협업 기록과 채택 기준

Claude에는 두 runtime entrypoint와 실제 imported component closure만 읽히고 수정 권한은 주지 않았다. 독립 검토 결과 중 다음은 채택했다.

- probability-space gradient와 logit-space gradient의 충돌
- CE 대 MSE saturation 비교의 누락
- one-hot, empirical target, soft target의 P 구분
- perplexity와 KL 방향의 실전 연결
- autoencoder 숫자 backward, PCA residual, ELBO, posterior collapse의 공백
- article 내부의 명시적 prerequisite·next-step link 부족

반면 “모든 기존 StepViz를 즉시 되살리라”는 제안은 이번 정적 서사 배치에서는 보류했다. 사용자 요청대로 전체 본문과 causal state를 먼저 확정한 뒤 animation과 reduced-motion fallback을 추가한다. 표나 카드가 독립 비교가 아니라 실행 흐름을 대신하고 있는 곳만 responsive arrow flow로 먼저 교체했다.

## 13. 4B/9B용 좁은 실행 절차

작은 모델에는 article 전체를 한 번에 고치게 하지 않는다. 다음 다섯 artifact를 순서대로 만들게 한다.

```json
{
  "article_contract": {
    "owned_question": "이 글 하나가 끝까지 답할 단 하나의 질문",
    "previous_output": "앞 글에서 입력으로 받는 값",
    "next_output": "다음 글에 넘길 계산 결과",
    "minimum_history_stop": "더 과거로 내려가지 않는 최초 기반"
  },
  "transfer_check": {
    "private_question": "본문을 베끼지 않고 개념을 옮겨야 풀리는 숫자 문제",
    "required_insights": [],
    "current_prose_support": [],
    "missing_support": []
  },
  "formula_units": [
    {
      "equation": "한 화면에 들어가는 하나의 계산",
      "korean_underbraces": ["입력 역할", "연산 이유", "출력 역할"],
      "adjacent_note_only": "식에 실제 등장한 기호만 설명"
    }
  ],
  "visual_state": {
    "misconception": "제거할 오해 한 개",
    "cause": "사용자가 바꾸는 입력",
    "effect": "화면에서 함께 변해야 하는 결과",
    "failure_state": "반례 또는 포화 상태"
  },
  "verification": {
    "build": true,
    "mobile_and_desktop": true,
    "min_formula_scale": 0.8,
    "overflow": false,
    "console_error": false,
    "visual_verifier": "별도 모델 또는 사람"
  }
}
```

Verifier는 특히 “미분 변수가 달라졌는데 같은 gradient라고 부르는가”, “확률식과 logit식의 설명이 충돌하는가”, “같은 이름의 개념이 다른 분야에서 다른 object를 가리키는가”를 검사한다. 이번 배치의 `-1/p`와 두 종류의 Sparse AE가 이 검사의 대표 사례다.

## 14. FFT와 Word2Vec 계산 폐쇄

FFT는 주파수 막대를 보여 주는 소개에서 sampling과 실제 배열 shape를 검산하는 글로 바꿨다.

- `N=4`, `x=[1,0,-1,0]`의 DFT가 `X=[0,2,0,2]`가 되고 실수 입력의 `rFFT`가 `[0,2,0]`만 저장하는 과정을 닫았다.
- 주파수 index를 실제 Hz로 바꾸는 `f_k=k f_s/N`을 추가하고, 7 Hz를 10 Hz로 sampling하면 3 Hz로 alias되는 숫자 반례를 넣었다.
- 16 kHz, 1초 신호에 window 400, hop 160, `center=False`를 적용하면 98 frame과 201 bin이 되어 PyTorch·librosa 관례에서 `201×98`이 된다는 shape를 검산했다.
- `n_fft=512`가 표시 bin을 257개로 늘려도 400-sample window가 정하는 실제 분해능을 되돌리지는 못한다고 분리했다.
- DFT 곱은 먼저 circular convolution을 만든다. Linear convolution에는 `L≥N+K-1` zero-padding과 앞 `N+K-1`개 slice가 필요하도록 잘못된 무조건 등식을 교정했다.

Word2Vec은 모델 이름 목록에서 실제 pair update가 corpus 통계의 geometry로 누적되는 글로 바꿨다.

- Skip-gram과 CBOW의 입력·출력 표기를 `w_I`, `v_{w_I}`, `w_O`로 통일하고 objective 전환 전후 카드 높이를 고정했다.
- `∂L/∂s=σ(s)-y`로 positive와 sampled negative의 방향을 계산하고, 이미 score가 낮은 negative보다 hard negative에 큰 신호가 가는 이유를 숫자로 보였다.
- Corpus 전체의 기대 gradient가 0인 지점에서 `σ(s*)=P(w,c)/(P(w,c)+kP(w)P_n(c))`를 얻고 sigmoid를 역으로 풀어 `s*=log(P(w,c)/(kP(w)P_n(c)))`를 유도했다.
- `P_n(c)=P(c)`일 때 `s*=PMI(w,c)-log k`이며, PMI 2.303과 `k=5`에서 score가 0.694가 되는 전이 계산을 넣었다.
- 단순 shifted-PMI 해석과 실제 Word2Vec의 `P_n(c)∝P(c)^{3/4}`를 구분하고, 낮은 차원의 두 embedding 행렬이 거대한 word-context 표를 low-rank로 근사한다는 경계를 명시했다.

Claude의 read-only import-closure 검토에서 circular/linear convolution 혼동, STFT shape 관례, `n_fft`와 window 해상도 혼동, shifted-PMI로 가는 기대-gradient 단계, negative 표 열 헤더가 발견돼 모두 반영했다. 오래된 FFT·Word2Vec 파일과 Viz 디렉터리 삭제 제안은 runtime import에서 제외되어 있더라도 사용자 수정이 섞인 넓은 삭제가 될 수 있어 채택하지 않았다.

검증 결과는 다음과 같다.

- production build 통과, 기존 900 kB 초과 chunk 경고만 유지
- FFT·Word2Vec mobile/desktop formula-viz regression `4/4`
- document overflow 0, FFT 최소 formula scale mobile 0.92·desktop 0.87, Word2Vec mobile 0.93·desktop 1.00
- Word2Vec objective tab 전환 전후 높이 mobile 245.9375 px, desktop 160.1875 px로 동일
- 공통 `figcaption::before`의 `V03`이 grid 열을 밀어내던 문제는 캡션과 열 이름 행을 분리해 수정했고, 1440px 최종 표의 `scrollWidth=clientWidth=822`

## 15. NLP 1단계 경로와 계산 계약

기존 배치는 Word2Vec을 딥러닝 기반의 transfer branch와 NLP 선행 선택지에 동시에 노출해, 어디서 읽어야 하는지와 무엇을 입력으로 받는지가 충돌했다. Runtime 순서를 다음 하나로 고정했다.

`Tokenizer → 분포 의미론 → Word2Vec → RNN → LSTM → Seq2Seq → Attention → Transformer → BERT`

- Word2Vec과 2013 논문은 foundation에서 NLP로 옮기고, 논문은 핵심 개념 목록을 끊지 않는 optional source spine으로 분리했다.
- Tokenizer는 Unicode 정규화·grapheme·byte fallback, vocabulary weight 예산, BPE 학습과 merge 적용, WordPiece 공개 범위, Unigram likelihood, workload별 평가를 소유한다.
- 교육용 평가 문자열의 실제 값은 공백 단어 4개, UTF-8 42 byte다. 14 subword와 비교하면 full-attention score cell은 `(42/14)^2=9`배가 된다. 전체 LLM 시간이 9배라는 주장은 하지 않는다.
- NFC는 canonical equivalence, NFKC는 compatibility equivalence까지 합친다는 범위를 기본 입력의 code-point·byte 변화로 확인한다.
- 분포 의미론은 tokenizer ID가 matrix 행·열 축을 결정한다는 계약에서 시작해 count event, PPMI, 희귀 pair 신뢰도, SVD tail error, cosine geometry를 닫는다.
- `bank-loan`은 `log2(10)=3.322`, 한 번뿐인 `bank-quasar`는 `log2(20)=4.322`다. 더 큰 PMI가 더 강한 표본 증거는 아니므로 최소 count·smoothing·split 재현성 경고를 함께 둔다.
- Singular values `[6,3,1]`에서 rank-1 error는 `sqrt(10)=3.16`, rank-2 error는 1이다. Explorer와 KaTeX가 같은 값을 사용한다.
- SGNS의 `score*=PMI_ln-ln(k)`는 empirical unigram noise와 충분한 embedding 차원이라는 단순 경계에서만 정확하다. 실제 3/4 noise와 유한 차원은 다음 Word2Vec 글에서 다룬다.

Claude read-only 검토는 처음 작성본에서 다음 결함을 찾았다.

1. Cosine SVG의 x·y 배율이 달라 화면 각도와 계산 cosine이 달랐다.
2. Tokenizer 평가 문자열은 실제 42 byte·4단어인데 37 byte·5단어로 고정돼 있었다.
3. PPMI의 row·column event 합을 단어 등장 횟수처럼 표기했고 희귀 기대 확률을 `0.00005→0.0001`로 반올림해 옆의 20배와 모순됐다.
4. NFC와 NFKC의 동등성 범위, tokenizer가 word-context 축을 결정한다는 이전 글 계약, shifted-PMI의 충분한 차원 조건이 빠졌다.
5. 교육용 subword heuristic이 SentencePiece와 WordPiece marker를 섞고 ZWJ grapheme을 code point별로 자를 수 있었다.

모두 반영했다. Cosine plot은 같은 pixel/unit 배율을 사용하고 계산·그림이 0.280으로 일치한다. Subword heuristic은 grapheme을 먼저 확정한 뒤 문자 run만 자른다. `MetricGrid`는 항목 수에 따라 열 수를 선택해 좁은 SVD sidebar에서 단어가 세로로 찢어지던 공용 레이아웃 결함도 수정했다.

검증 결과는 다음과 같다.

- affected ESLint와 production build 통과, 기존 900 kB 초과 chunk 경고만 유지
- Tokenizer·분포 의미론 mobile/desktop formula-viz regression `4/4`
- NLP·foundation 경로 회귀 `19/19`
- 두 viewport 모두 document overflow 0, console/page error 0
- 128k untied bf16 token weight 2.00 GiB, byte fertility 10.50, 희귀 PMI 4.322, rank-1 error 3.16 interaction 확인
- 모든 display formula scale 0.8 이상, 세 정의를 한 줄에 몰아 0.72까지 줄던 확률 정규화 식은 세 계산 단위로 분리
- 기본 Unicode 예시는 headless 환경의 emoji font 부재에도 tofu glyph가 없도록 구성하고, ZWJ 입력 지원과 설명은 유지

## 16. RNN·LSTM의 시간축 계산 계약

RNN과 LSTM은 이름과 gate를 소개하는 글에서, 실제 시간축 계산과 구현 shape를 검산하는 글로 재구성했다.

- RNN은 같은 `W_h`를 모든 timestep에서 재사용하므로 `∂L/∂W_h`가 시간별 기여의 합이 된다는 점을 명시했다.
- Language model loss는 batch와 timestep을 가진 shifted target, PAD mask, 실제 token 수로 나눈 mean NLL로 닫았다.
- BPTT Jacobian은 시간 순서를 보존해 적었고, `0.8^40≈1.33e-4`와 `1.1^40≈45.26`을 1배 기준선의 아래·위로 표시했다. Gradient clipping은 exploding norm을 제한하지만 vanishing을 복원하지 않는다는 경계도 분리했다.
- TBPTT는 state 값 전달과 graph detach를 구분했다. Chunk 2에서는 `t2·t4·t6`, chunk 4에서는 `t4` 뒤의 모든 경계를 표시한다.
- Padding mask 누락은 PAD 학습, hidden reset 누락은 sample leakage와 batch-order 의존, detach 누락은 graph·memory·backward time 증가로 관찰된다는 실행 증상을 추가했다.
- LSTM은 `B=32,T=50,e=128,h=256`에서 input projection `[32,50,1024]`, recurrent add `[32,1024]`, stacked gate `[32,50,4,256]`, PyTorch weight shape를 분리했다. Input projection은 시간축 병렬화가 가능하지만 recurrent add는 `h_{t-1}` 때문에 순차적이라는 제한도 명시했다.
- Gate 예제는 `c_t=1.04`, `h_t≈0.545`로 닫았고, gate 출력을 고정한 direct derivative와 gate 의존 경로까지 포함한 total derivative를 구분했다.
- `f=0.9`도 40 step 뒤에는 1.48%만 남고 반감기는 약 6.58 step이라는 보존 길이 계산을 추가했다.
- LSTM/GRU cell 종류와 causal/bidirectional 방향을 독립 축으로 만들고 output·final-state shape와 streaming 가능 여부가 함께 바뀌게 했다.
- Gate histogram과 norm은 원인을 증명하지 않는 진단 단서다. Causal claim에는 intervention이나 ablation이 별도로 필요하다는 경계를 넣었다.

독립 검토는 RNN의 reset·detach 실패 증상, batch-indexed NLL, LSTM의 input projection과 recurrent computation 사이 병렬성 차이를 보강하게 했다. 이 세 항목은 모두 반영했다.

Claude 협업 경로는 이후 `context-manager`로만 고정한다. 확인된 gateway model은 `claude-sonnet-4-6`이지만 현재 `llm-wrapper`의 Open WebUI login이 400으로 실패해 gateway가 500 `All providers failed`를 반환한다. 인증이 복구될 때까지 direct Claude CLI로 우회하지 않고 독립 검토를 보류한다. 이 오류는 글의 build나 runtime 결함이 아니라 협업 provider 인증 결함이다.

검증 결과는 다음과 같다.

- affected ESLint와 production build 통과, 기존 900 kB 초과 chunk 경고만 유지
- RNN·LSTM mobile/desktop formula-viz regression `4/4`
- RNN `0.8^40` plot endpoint가 기준선 아래, `1.1^40` endpoint가 위에 있고 수치 anchor가 각각 일치
- TBPTT chunk 2의 `t2·t4·t6` detach boundary 확인
- LSTM 1.48% retention, 6.6-step half-life, bidirectional `[32,50,512]`, GRU causal `[32,50,256]`과 state·streaming 계약 확인
- 모바일 최종 screenshot에서 formula와 gate flow의 clipping·내부 horizontal scroll이 없고 console/page error 0

## 17. Seq2Seq·Attention의 memory interface 전환

Seq2Seq와 Attention은 모델 이름을 이어 붙이는 글에서, recurrent state bridge가 differentiable memory lookup으로 바뀌는 하나의 계산 서사로 재구성했다.

- Seq2Seq bridge는 단일 `c∈R^h` 표기만 남기지 않고 LSTM의 final hidden·cell을 각각 `[L,B,h]`로 연결했다. Source length가 늘면 encoder step은 늘지만 bridge에 source axis가 생기지 않는 것이 고정 병목의 정확한 위치다.
- Source reversal은 역사 trivia가 아니라 첫 target과 정렬되는 source token에서 초기 decoder loss까지의 recurrent edge를 줄인 최적화 장치로 복원했다. 설명 예제에서는 edge가 4개에서 1개로 줄어든다.
- Teacher forcing ratio는 BOS를 제외한 `n-1`개 feedback slot에만 적용한다. `n=8,r=.75`에서는 gold 5.25, model 1.75 slot이고 추론은 7개 모두 model feedback이다.
- 기존 완성 hypothesis 표를 실제 beam search로 오해하게 만들던 UI를 제거했다. 현재 beam을 확장하고 conditional probability를 joint probability에 곱한 뒤 top-k를 남기는 세 단계를 실행한다. Beam 1은 `I am <EOS>`의 0.1716, beam 2는 `We stay <EOS>`의 0.3671을 찾는다.
- Length normalization은 search ranking을 바꾸지만 model distribution을 바꾸지 않는다. 큰 beam이 task quality를 자동으로 높인다는 주장도 배제했다.
- Attention score explorer는 raw score, max-shifted score, mask, final weight를 같은 행에 표시한다. `[2,1,0]`을 먼저 softmax하고 마지막 weight만 0으로 만들면 합이 0.910이지만, 마지막 score를 `-∞`로 바꾼 뒤 softmax하면 `[.731,.269,0]`과 합 1을 얻는다.
- `sqrt(d_k)`는 teaching temperature와 분리했다. Independent unit-variance 근사에서 dot product 분산은 `d_k`; `d_k=64`이면 표준편차 8이고 `sqrt(d_k)`로 나눈 뒤 1이 된다.
- Self와 cross attention의 Q/K/V source를 분리하고 cross mode에서는 target causal checkbox를 disable했다. Target causal triangle은 decoder self-attention에, source padding mask는 cross-attention key 열에 적용된다.
- Multi-head는 고정된 문법 역할 카드가 아니라 split·concat·projection shape와 비용으로 설명한다. `d_model=16,H=8`이면 `d_k=2`, 총 projected width는 16이고 `n=6`의 score dot-product 주항은 `n^2 d_model=576`이다.
- Attention weight는 value mixing coefficient이며 final causal explanation과 동일하지 않다는 별도 근거를 연결했다.

공식 근거는 Sutskever et al. 2014, Bahdanau et al. 2015, Luong et al. 2015, Vaswani et al. 2017, Bengio et al. 2015와 Jain & Wallace 2019의 원문 범위로 제한했다. 각 논문의 역사적 주장과 현재 architecture 계약을 섞지 않았다.

검증 결과는 다음과 같다.

- affected ESLint와 production build 통과, 기존 900 kB 초과 chunk 경고만 유지
- Seq2Seq·Attention mobile/desktop formula-viz regression `4/4`
- 390·768·1440px document overflow 0, formula overflow 0, 최소 formula scale 0.98
- Bridge 64 scalar, reversal 1 edge, gold/model feedback 5.3/1.8, beam 1/2 결과를 interaction으로 확인
- Masked weight 0, pre-mask sum 1.000, post-zero sum 0.910, scaling 8→1, cross causal disable, multi-head shape·MAC 확인
- console/page error 0

## 18. Transformer·BERT의 architecture와 pretraining 계약

Transformer와 BERT는 블록 이름과 objective를 소개하는 글에서, 입력 순서가 어떻게 보존되고 실제 tensor·memory·loss가 어떤 수치로 닫히는지를 검산하는 글로 재구성했다.

- Position이 없는 self-attention을 단순한 bag-of-words라고 부르지 않고 permutation equivariance로 한정했다. 같은 token multiset의 두 문장에서 position signal을 끄고 켜며 `E(token)`과 `E(token)+P_i`가 어떻게 달라지는지 비교한다.
- Q/K/V shape explorer는 `B=2,N=8,H=8,d_model=64`에서 score tensor `[2,8,8,8]`, 1,024개 score element, QK+AV 주항 16,384 MAC을 함께 계산한다.
- Causal mask는 6×6 matrix를 본문 폭에 맞는 고정 square grid로 바꿨다. `t=3`은 4개 key만 읽지만 일반 dense kernel은 여전히 36개 cell을 만들 수 있어, 정보 제약과 연산 절약을 구분한다.
- KV cache 식에 batch 축을 복원하고 MHA·GQA·MQA를 query head와 KV head 수로 분리했다. `B=2,L=24,N=4096,H_kv=8,d_k=128,bf16`이면 0.75 GiB이며, 32 query head 기준 GQA group size는 4이고 MHA cache의 25%다.
- Cache는 과거 K/V projection 재계산을 없애지만 새 query가 길이 N의 cache를 읽는 attention을 없애지 않는다는 실행 경계를 명시했다.
- BERT MLM은 정수 반올림으로 80/10/10을 왜곡하지 않고 확률 표본의 기대값으로 표시한다. 1,000 token에서 prediction target 150개, `[MASK]` 120개, random 15개, unchanged 15개, 직접 loss가 없는 위치 850개가 된다.
- NSP는 `[CLS] A [SEP] B [SEP]` 입력, actual/random 50/50 sampling, `[CLS]` 이진 head와 `IsNext/NotNext` label을 직접 전환한다. MLM과 NSP는 같은 encoder를 update하지만 정답 단위와 head가 다른 loss다.
- RoBERTa의 차이를 NSP 제거 하나로 환원하지 않고 data, batch, training step, dynamic masking이 함께 바뀐 recipe로 제한했다.
- WordPiece 뒤 token label 정렬 규칙과 ignore 위치를 명시했다. Raw BERT `[CLS]`는 semantic cosine distance에 직접 최적화된 범용 문장 embedding이 아니므로 Sentence-BERT의 siamese pooling·metric objective로 연결했다.

독립 근거는 Transformer, LayerNorm, Pre-LN 분석, GQA, BERT, RoBERTa, Sentence-BERT 원문과 구현 문서로 제한했다. Claude 검토는 사용자 지시대로 context-manager만 사용하도록 유지했지만, 현재 llm-wrapper 인증 실패 때문에 호출이 불가능해 direct CLI로 우회하지 않았다.

검증 중 정적 기본 화면에서는 드러나지 않던 NSP 상태 전환 오류를 발견했다. `NotNext`에 공용 `FlowRow`가 지원하지 않는 `red` tone을 넘겨 React render가 중단됐고, 이를 지원되는 `amber` token으로 교체했다. 이 사례 때문에 이후 작은 모델 verifier는 기본 screenshot뿐 아니라 모든 segmented control의 비기본 상태에서 console·page error를 반드시 검사한다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- Transformer·BERT mobile/desktop formula-viz regression `4/4`
- Transformer·BERT tablet breakpoint와 계산 interaction regression `4/4`
- 390·768·1440px document overflow 0, formula overflow 0, 최소 formula scale 0.8 이상
- Position signature, 1,024 score cell, 16,384 MAC, causal key 4개, 0.75 GiB GQA cache와 25% MHA ratio 확인
- MLM 150/120/15/15/850, NSP NotNext, raw CLS와 contrastive embedding 경계 확인
- 최종 production preview에서 console/page error 0

## 19. LLM Architecture의 2026 현재 앵커와 최소 계보

기존 경로는 모델 표를 서사로 바꿨지만 최상단 질문이 2025년 DeepSeek-V3.2에 남아 있었다. 이 상태에서는 2026년에 공개된 depth mixing과 encoder-free multimodal input을 기존 attention·MoE 표의 변형으로만 읽게 된다. 현재 앵커를 특정 checkpoint 하나에서 세 공개 근거 묶음으로 교체했다.

- DeepSeek-V4는 token 방향의 compressed long-range access와 residual 경로를 함께 바꾼 사례다.
- Moonshot AI Attention Residuals는 이전 layer 표현을 선택하는 depth attention을 별도 축으로 연다.
- Gemma 4 12B는 vision·audio가 shared backbone에 들어오는 input boundary와 MTP drafter를 보여 준다.
- 이 세 근거를 입력 경계, 문맥 혼합, 용량 배분, 상태 저장, 깊이 혼합의 다섯 축으로 재구성했다. 이 다섯 축은 회사가 공동 발표한 taxonomy가 아니라 이 글의 비교 도구임을 본문에 명시했다.
- 필수 계보는 GPT-2 dense → Llama 3 modern dense → Gemma 3 local/global → DeepSeek V3 MLA+Sparse MoE → Kimi Linear state+attention hybrid의 다섯 전환에서 멈춘다. 70여 모델 데이터는 기본 서사를 밀어내지 않는다.
- DeepSeek-V3.2는 더 이상 “현재 최상단”이 아니다. KV, sparse attention, MoE와 RL runtime을 다시 결합해 비용을 검산하는 통합 보고서로 마지막에 배치했다.
- category와 sidebar의 `전체 지도` 표현을 `구조 읽는 출발점`으로 바꾸고 Dense → KV → MoE → Hybrid 순서를 하나의 경로로 고정했다.

비공개 전이 문제는 다음 수치로 닫는다. `B=2,L=48,H_kv=4,d_h=128,N=8192,bf16`이면 KV cache는 `2·B·L·H_kv·d_h·N·2 byte = 1.5 GiB`다. 이 계산 뒤에만 GQA 비율, local/global 4:1, routed expert 8/256+shared expert, depth-mixing axis를 추가한다. 글을 읽고 이 항들을 서로 다른 비용과 표현 축으로 설명하지 못하면 계보가 아니라 모델 목록을 외운 것이다.

시각 검증에서는 이미지 `naturalWidth`가 0이 아닌 것만으로 가독성을 보장할 수 없다는 점을 확인했다. 768px에서 portrait 원문 도식이 한 열 전체 너비로 쌓이며 지나치게 긴 빈 영역처럼 보였다. milestone 행을 768px부터 설명·도식의 두 열로 전환하고, 모든 도식을 확대 아이콘과 원본 링크로 열 수 있게 했다. 전체 페이지 캡처뿐 아니라 각 offscreen milestone을 실제로 scroll-into-view한 뒤 행 단위 screenshot을 검사했다.

Claude 검토는 사용자 지시대로 context-manager의 `ai-researcher`에만 요청했다. 이번에도 provider가 `All providers failed` gateway 500을 반환해 결과를 받지 못했다. direct Claude CLI로 우회하지 않았고, 이 상태를 협업 결함으로 기록했다.

검증 결과는 다음과 같다.

- affected ESLint와 `git diff --check` 통과
- production build 통과, 기존 900 kB 초과 chunk 경고만 유지
- LLM architecture overview와 네 branch의 mobile·tablet·desktop 회귀, category route 계약 포함 `17/17`
- 세 공식 source link, 다섯 milestone image, 네 Korean `FormulaNote`, 학습 연속성, 표 부재와 원본 확대 link 확인
- 390·768·1440px document overflow 0
- 768px milestone 행 단위 screenshot에서 설명과 구조도 겹침·절단 없음

## 20. Open-R1의 한 batch 실행 계약

기존 Open-R1 글은 SFT, GRPO, reward, 배포를 각각 소개했지만 한 문제 행이 실제 policy update가 되는 실행 순서를 닫지 못했다. 보상 가중치를 고정된 표처럼 제시했고, Open-R1 저장소가 소유하지 않는 제품 serving architecture까지 같은 구현 범위로 보이게 했다. 이를 공식 저장소 commit `1416fa0cf21595d2083b399a2a0bbddd7f6e9563`의 2026-04-02 snapshot에 맞춰 다시 경계 지었다.

- Open-R1의 공개 목표는 reasoning trace distillation, pure RL, base model에서 시작하는 multi-stage RL의 세 갈래다. 따라서 SFT를 모든 reasoning RL의 필수 전제로 쓰지 않았다.
- SFT는 대화 직렬화, completion loss mask, tokenizer EOS가 generation stop과 일치하는 계약으로 재구성했다. 교육용 token 장면에서 prompt는 문맥만 제공하고 assistant completion과 EOS만 loss를 받는다.
- GRPO는 같은 prompt에서 생성한 `G`개 completion을 group 내부에서 비교한다. `[1,1,0,0]`의 단순 예에서는 정규화 advantage가 `[+1,+1,-1,-1]`가 되지만, `[1,1,1,1]`과 `[0,0,0,0]`은 모두 group variance가 0이라 비교 신호가 사라진다.
- 공식 demo recipe의 `P=8`, `G=16`, `C=2048`을 사용해 rollout 상한을 `P·G·C=262,144 tokens`로 닫았다. 이는 실제 사용량이 아니라 모든 completion이 max length에 도달할 때의 상한이다.
- Reward는 하나의 고정 공식이 아니라 config가 registry에서 선택하는 계약이다. 공식 recipe의 `accuracy`, `format`, `tag_count`와 각각 1.0 가중치는 예시일 뿐이며, code reward는 sandbox provider 경계를 반드시 통과하게 했다.
- DeepSeek distilled template가 `<think>`를 미리 채우거나 reasoning block을 제거하면 format reward가 모델 품질이 아니라 template mismatch를 벌할 수 있음을 실패 사례로 넣었다.
- 생성 데이터, decontamination, held-out evaluation을 training reward와 분리했다. Reward 상승과 held-out 정확도·entropy 악화가 동시에 보이면 학습 성공으로 판정하지 않는다.
- 단일 node의 vLLM colocate와 전용 vLLM server를 runtime mode로 분리하고, 제품 routing·quota·fallback은 별도 `llm-serving-ops` 글의 소유권으로 되돌렸다.

비공개 전이 문제는 여섯 단계다. 독자는 본문만으로 rollout token 상한, mixed/all-equal reward의 advantage, chat template 불일치, reward 상승과 held-out 하락의 판정, 안전하지 않은 code execution 경계를 설명해야 한다. 각 단계의 답이 lifecycle Viz, SFT token 계약, interactive GRPO ledger, reward registry, data/eval loop에 직접 대응하도록 만들었다. 이 문제는 본문에 시험 문제로 노출하지 않고 authoring completeness gate로 사용한다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. 공식 snapshot과 저장소가 소유하는 실행 경계를 먼저 고정한다.
2. 데이터 한 행을 출발점으로 config, tensor/group, reward, update, evaluation까지 동사 순서로 복원한다.
3. 소개 표를 만들기 전에 mixed case와 degenerate case를 모두 수치로 푼다.
4. source claim, recipe example, author inference를 서로 다른 문장으로 표시한다.
5. 모든 display 수식은 Korean annotation을 갖고 raw LaTeX가 DOM text로 새지 않게 한다.
6. 기본 상태뿐 아니라 전부 정답·전부 오답 같은 비기본 control을 실행하고, DOM overflow와 browser error channel을 함께 검사한다.

Claude 검토는 사용자 지시대로 context-manager의 `ai-researcher`에만 요청했다. `POST /api/agents/ai-researcher/chat`가 gateway 500 `Provider error: All providers failed`를 반환해 결과를 받지 못했다. direct Claude CLI로 우회하지 않았고, 공식 저장소 원문과 로컬 회귀 검증으로만 배치를 닫았다.

검증 결과는 다음과 같다.

- affected Open-R1 ESLint와 `git diff --check` 통과
- production build 통과, 기존 900 kB 초과 chunk 경고만 유지
- 전체 저장소 `tsc -b`는 이번 변경과 무관한 기존 17개 파일의 type error로 실패했으며 Open-R1 경로 오류는 없음
- local Playwright mobile·tablet·desktop과 LLM sidebar 순서 `4/4`
- public Playwright 동일 계약 `4/4`, article와 `open-r1-mZWQV0cS.js` chunk 모두 HTTP 200
- 390·768·1440px document overflow 0, console error 0, article table 0, Korean FormulaNote 5개
- 모바일 SFT token 계약 `scrollWidth=356`, `clientWidth=356`; 빈 animation state, clipping, 내부 horizontal scroll 없음

## 21. Post-training의 피드백 신호 선택 계약

기존 Post-training 글은 CPT, SFT, RLHF, DPO, RLVR을 한 흐름에 나열했지만 독자가 실제 프로젝트에서 먼저 답해야 하는 질문, 즉 "현재 부족한 것이 지식인가, 정답 형식인가, 사람의 선호인가, 실행 가능한 성공인가"를 닫지 못했다. GRPO 실행은 Open-R1과, 보상 실패는 Reasoning frontier와, RLHF 역학은 RLHF 글과 중복됐다. 이 글의 독립 소유권을 방법 설명이 아니라 피드백 계약 선택으로 다시 고정했다.

- RAG와 CPT는 둘 다 새 사실을 다루지만 외부 근거를 조회하는 것과 unlabeled corpus로 표현을 적응시키는 것을 분리했다.
- SFT의 한 행은 `{prompt, ideal_answer}`이고 teacher가 준 completion token을 직접 모방한다. 학습하지 않은 전략을 현재 policy가 탐색하는 신호가 아님을 명시했다.
- DPO와 RLHF는 선호 신호를 공유하지만 DPO의 fixed chosen/rejected pair와 RLHF의 reward model·online rollout 경계를 분리했다.
- RLVR은 verifier가 실행 가능한 성공을 판정할 수 있을 때만 사용한다. 그럴듯한 문체나 의료적 안전성처럼 채점기가 닫히지 않는 목표를 억지로 binary reward로 바꾸지 않는다.
- DeepSeek-R1-Zero를 근거로 SFT를 모든 reasoning RL의 보편적 전제라고 쓰지 않았다. 동시에 multi-stage DeepSeek-R1의 cold-start가 readability와 broader quality에 기여한 범위도 함께 남겼다.
- 의료 JSON assistant 예시는 RAG/CPT → SFT → preference → selective RLVR 순으로 신호를 합성한다. 이는 범용 recipe가 아니라 서로 다른 오류를 서로 다른 데이터 계약으로 고치는 검산 예시다.
- 기존 넓은 SVG와 중복 step scene은 제거했다. `FeedbackContractViz`는 데이터 행·직접 신호·데이터 생산자·탐색 여부를 탭별로 비교하고, `SignalDecisionLab`은 네 시나리오에서 첫 신호와 다음 조합을 선택하며, `SignalCompositionViz`는 실제 합성 순서를 한 화면 폭 안에서 보여 준다.
- 네 display equation은 CPT NLL, completion-masked SFT NLL, DPO log-ratio, verifier reward expectation을 다루며 각 항의 역할을 한국어 annotation으로 붙였다.

비공개 전이 문제는 다섯 증거 묶음으로 구성했다. 20억 token의 unlabeled 한국어 의료 corpus, 2만 개 이상 JSON, 5만 chosen/rejected tone pair, hidden test가 있는 1만 coding prompt, 그리고 online rollout budget을 보고 각각 RAG/CPT, SFT, DPO/RLHF, RLVR을 골라야 한다. 마지막에는 이 데이터를 이름 없는 하나의 post-training corpus로 합치면 왜 provenance, target, producer, exploration 계약이 사라지는지 설명해야 한다. 본문만으로 이 문제를 풀 수 있도록 모든 Viz와 수식을 동일한 판별 축에 맞췄다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. 방법 이름보다 현재 부족한 능력과 이용 가능한 증거를 먼저 묻는다.
2. 각 방법을 dataset row, target, producer, exploration, failure boundary로 기록한다.
3. fixed offline pair와 current-policy online rollout을 같은 preference data로 뭉개지 않는다.
4. 지식, 모방, 선호, 실행 가능한 성공을 서로 대체 가능한 신호로 쓰지 않는다.
5. SFT를 보편적 필수 단계라고 주장하지 않고 source가 입증한 범위만 쓴다.
6. 실행 역학과 reward failure는 소유 article로 넘기고 현재 글은 선택 결정만 소유한다.

공식 근거는 Gururangan et al. 2020의 domain/task adaptive pretraining, InstructGPT의 demonstrations·ranking·reward model·PPO 순서, DPO의 fixed preference classification objective, DeepSeek-R1/R1-Zero의 cold-start와 pure RL 범위로 제한했다. Claude 검토는 사용자 지시대로 context-manager의 `ai-researcher`에만 요청했으나 `POST /api/agents/ai-researcher/chat`가 gateway 500 `Provider error: All providers failed`를 반환했다. direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- local 및 public mobile·tablet·desktop과 category route 회귀 각각 `4/4`
- 390·768·1440px document overflow 0, console/page error 0, article table 0
- 네 FormulaNote, 네 scenario, 네 feedback contract tab의 비기본 상태 확인
- 390px에서 decision `356/356`, contract `356/356`, composition `358/358`로 내부 horizontal scroll 없음
- 모바일 element screenshot에서 글자 절단, 카드 중첩, 빈 animation state 없음
- 공개 article과 `post-training-rlvr-C9mvitey.js` chunk HTTP 200

## 22. InstructGPT RLHF의 ranking-to-update 실행 계약

기존 RLHF 글은 SFT, reward model, PPO를 소개한 뒤 DPO·CAI 대안 갤러리로 빠졌다. 다수의 넓은 SVG가 같은 pipeline을 반복했고, 독자는 한 human ranking이 실제 token probability update로 바뀌는 계산을 재현할 수 없었다. 글의 독립 소유권을 `한 prompt의 K-way ranking → Bradley-Terry reward → bounded PPO token update`로 고정하고, 방법 선택은 Post-training 글, 일반 PPO는 RL 기초 글, GRPO 구현은 Open-R1로 돌려보냈다.

- InstructGPT의 SFT, RM, PPO dataset을 `{prompt, demonstration}`, `{prompt, ranked completions[]}`, `{prompt}`로 분리했다. 약 13k/33k/31k prompt는 논문 recipe이지 보편 비율이 아님을 명시했다.
- 한 prompt의 K개 답 순위는 `K(K-1)/2` pair를 만들지만 독립 prompt가 아니다. K=4는 6개, K=5는 10개이며, 논문이 같은 prompt의 correlated comparisons를 한 batch element로 유지한 이유를 forward 재사용과 overfit 경계로 복원했다.
- Bradley-Terry probability와 group-averaged RM loss를 한국어 annotation으로 다시 썼다. Reward score `[1.2,.4,-.2,-1.0]`에 모두 `+100`을 더해도 pair probability와 평균 loss 0.288이 그대로인 interaction을 추가했다.
- Pairwise loss는 공통 score offset에 불변이므로 reward의 절대 0점을 정하지 못한다. InstructGPT가 RL 전에 labeler demonstrations의 mean score를 0으로 맞춘 bias normalization의 이유를 value target과 연결했다.
- PPO token lab은 `ε=.2`에서 양수 advantage의 ratio 1.35가 2.70 대신 2.40으로, 음수 advantage의 ratio .70이 -1.40 대신 -1.60으로, ratio 1.10은 1.65 그대로 선택되는 세 상태를 직접 실행한다.
- Rollout old policy와 frozen SFT reference를 분리했다. Clipping은 한 rollout batch의 local ratio 이득을, sampled token log-ratio penalty는 여러 update의 reference drift를 다룬다.
- PPO-ptx의 pretraining likelihood gradient를 별도 세 번째 guardrail로 복원했다. InstructGPT ablation 범위에서는 KL 계수를 크게 하는 것만으로 public NLP regression이 복구되지 않았다는 source boundary를 남겼다.
- 약 40명의 contractor, 72.6% training-labeler agreement, 같은 vendor 범위의 held-out evaluator를 근거로 reward model이 보편적 인간 가치가 아니라 특정 평가자·지침·prompt 분포의 proxy임을 시각화했다.
- 기존 12개 RLHF SVG 중 article에 import되던 반복 pipeline·세부 scene을 제거하고, responsive CSS 기반 `RLHFDataContractViz`, `RankingBatchLab`, `PPOUpdateLab`, `TwoDistanceViz`, `PreferenceScopeBand`로 교체했다.

비공개 전이 문제는 8단계다. K=4 순위에서 6개 pair를 열거하고, score offset 불변성을 증명하며, positive·negative advantage의 clipped objective를 수치로 계산한다. 이어 old policy와 reference policy의 기준을 분리하고, KL과 pretraining mix가 같은 신호가 아닌 이유, evaluator population의 범위를 설명해야 한다. 각 답은 본문의 row schema, ranking lab, offset 식, PPO lab, three-guardrail Viz와 직접 대응한다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. 한 prompt에서 출발해 SFT, RM, PPO의 row schema와 label producer를 동사 순서로 쓴다.
2. 논문 recipe, 일반 mechanism, 작성자의 inference를 분리한다.
3. 같은 ranking에서 나온 correlated pair를 독립 prompt처럼 세지 않는다.
4. Reward shift invariance와 RL 전 offset normalization을 함께 설명한다.
5. PPO clipping은 advantage 양수와 음수 사례를 모두 수치로 계산한다.
6. Old policy와 frozen SFT reference를 이름과 수명 주기로 분리한다.
7. Reward model을 bounded evaluator proxy로 쓰고 보편적 가치라고 부르지 않는다.
8. 모든 비기본 control, formula scale, document overflow와 browser error channel을 함께 검사한다.

공식 근거는 Ouyang et al. 2022의 세 데이터셋, K-way ranking batch, reward normalization, bandit·KL·PPO-ptx·평가 범위, Schulman et al. 2017의 clipped surrogate, Christiano et al. 2017의 preference-learned reward로 제한했다. Claude 검토는 context-manager의 `ai-researcher`로만 요청했으나 `POST /api/agents/ai-researcher/chat`가 gateway 500 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았다.

로컬 검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- RLHF 및 upstream Post-training mobile·tablet·desktop, category route local/public 회귀 각각 `8/8`
- 390·768·1440px document overflow 0, console/page error 0, article table 0
- FormulaNote 7개, K=4/5, reward +100, positive/negative/in-range PPO 상태 확인
- 390px formula scale은 5개 1.00, 가장 긴 2개 0.76으로 약 12.2px 이상
- 모든 Viz에서 client width와 scroll width가 일치하며 모바일 element screenshot에 clipping·overlap·빈 initial state 없음
- 공개 article과 `rlhf-uBeXHZ7e.js` chunk HTTP 200

## 23. PPO의 stored rollout-to-update 실행 계약

기존 PPO·연속 제어 글은 ratio, clipping, actor loss와 알고리즘 선택기를 이미 갖고 있었고 기존 단계 애니메이션도 반응형으로 안정적이었다. 따라서 장면을 전부 교체하는 대신, 비공개 전이 문제를 풀지 못하게 하던 세 연결 단절을 고쳤다. Stored old log-probability가 ratio로 바뀌는 수치 경로가 없었고, GAE는 이름만 나온 채 terminal mask와 역산이 생략됐으며, 모바일 display equation이 11px 안팎까지 축소됐다.

- Ratio를 확률 분수에서 끝내지 않고 `exp(log πcurrent - log πold)`까지 연결했다. 선택 확률 0.40의 stored log-probability -0.916과 current 확률 0.52의 -0.654를 빼면 0.262이고, exp를 취한 ratio가 1.30이라는 수치 검산을 넣었다.
- PPO clipping은 positive advantage의 upper boundary와 negative advantage의 lower boundary를 직접 조작한다. 평균 approximate KL이 작아도 소수 ratio outlier가 숨을 수 있으므로 log-ratio quantile, 최대 절댓값, sequence별 KL과 clip fraction을 함께 보게 했다.
- GAE의 one-step TD residual에 `1-d_t` terminal mask를 복원했다. Time-limit truncation과 진짜 terminal을 구분하지 않으면 bootstrap을 잘못 차단하거나 다음 episode value가 현재 credit에 새는 실패를 명시했다.
- 새 `GaeCreditLab`은 `r=[0.2,0,0.5,1.0]`, `V=[1.0,1.2,0.8,0.5]`, `γ=.9`를 고정하고 `t3→t0` 역산을 보여 준다. TD residual은 `[.280,-.480,.150,.500]`이고 A0는 λ=0에서 .280, λ=.95에서 .292, λ=1에서 .334다. Critic target은 매 step `R̂=Â+V`로 복원한다.
- λ=0의 낮은 sampling variance·높은 critic bias 의존과 λ→1의 낮은 bootstrap bias·높은 rollout variance를 설명했다. λ를 보편 상수가 아니라 critic 품질과 horizon에 맞춰 검증할 손잡이로 제한했다.
- 기존 `PpoIterationSequenceViz`는 계산의 전체 위치를 보여 주는 애니메이션으로 유지했다. GAE Lab은 수치 역산, 애니메이션은 rollout 고정부터 refresh까지의 lifecycle을 소유해 중복을 피했다.
- Continuous control 선택기는 이름 추천기가 아니라 action space, replay 재사용, stochastic entropy라는 세 계약으로 DQN, PPO, TD3/DDPG, SAC 후보를 줄이는 bounded tool임을 유지했다. Offline coverage, safety, partial observability와 multi-agent dynamics는 별도 축으로 남겼다.
- GAE, PPO, DDPG, TD3, SAC 근거를 각각 Schulman et al. 2015/2017, Lillicrap et al. 2015, Fujimoto et al. 2018, Haarnoja et al. 2018의 원문 범위에 묶었다.

비공개 전이 문제는 다음 순서다. 주어진 네 step reward·value·terminal에서 λ별 TD residual, GAE와 critic target을 역산한다. 이어 stored old/current log-probability로 ratio를 만들고 advantage 양쪽 부호에서 clipped objective를 계산한다. 평균 KL이 낮지만 tail ratio가 폭주하는 경우를 진단한 뒤, continuous torque와 비싼 rollout이라는 조건에서 on-policy stability와 off-policy reuse를 비교하고 token policy로 state·action·reward·KL을 전이한다. 본문은 문제를 그대로 노출하지 않지만 각 계산과 경계가 FormulaNote, GAE Lab, clip Lab, algorithm chooser에 일대일 대응한다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. 기존 Viz를 교체하기 전에 독립 역할, overflow와 animation initial state를 감사한다. 유효한 장면은 유지하고 빠진 계산만 추가한다.
2. Rollout buffer의 실제 저장 field에서 시작해 `old log-prob → ratio → surrogate → optimizer`를 동사 순서로 쓴다.
3. GAE는 이름이나 합 공식만 쓰지 않고 terminal mask, reverse recurrence, value target과 truncation 경계를 수치로 닫는다.
4. Hyperparameter는 좋고 나쁜 방향을 함께 쓴다. λ에는 bias와 variance, ε에는 안정성과 clipped information loss가 동시에 있다.
5. 평균 지표가 tail failure를 숨길 수 있으면 quantile·max·per-sequence 보조 지표를 명시한다.
6. 알고리즘 선택기는 bounded decision aid로 쓰고 coverage·safety 같은 누락 축을 화면 안에 표시한다.
7. 긴 한국어 annotation은 font를 무작정 축소하지 않고 계산을 3~4개의 aligned row로 분해한다.
8. 기본 상태뿐 아니라 λ=0/1, positive/negative clip, replay·entropy·action-space 조합을 모두 브라우저에서 실행한다.

Claude 검토는 사용자 지시대로 context-manager의 `ai-researcher`에만 요청했다. Agent 목록 조회와 routing은 성공했지만 `POST /api/agents/ai-researcher/chat`가 gateway 500 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았고, 원 논문 경계, 수치 oracle과 브라우저 회귀로 배치를 닫았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- PPO 단독 mobile·tablet·desktop interaction 회귀 `3/3`
- PPO와 upstream RLHF·Post-training 연결 회귀 local/public 각각 `11/11`
- 390·768·1440px document overflow 0, 세 interactive Viz 내부 overflow 0, console/page error 0, article table 0
- display equation 7개와 FormulaNote 6개, 모든 display equation에 한국어 내부 annotation 적용
- 390px 최소 formula font 12.09px; ratio 13.56px, GAE recurrence 18px이며 formula clipping 0
- 모바일 element screenshot에서 clip Lab, GAE 네 step, algorithm chooser의 글자 절단·겹침·강제 horizontal scroll 없음
- 공개 article과 `rl-ppo-continuous-control-BJiJzY4N.js` chunk HTTP 200

## 24. Policy Gradient의 causality-to-variance 실행 계약

기존 Policy Gradient·Actor-Critic 글은 trajectory objective, baseline, TD residual과 GAE를 순서대로 소개했고 Actor-Critic lifecycle animation도 반응형으로 안정적이었다. 그러나 글의 비공개 전이 문제는 본문만으로 풀 수 없었다. Bandit Lab은 baseline을 바꿔도 평균 gradient가 같다는 결과만 보여 주고 실제 variance를 계산하지 않았으며, 본문은 action-independent baseline이면 항상 variance가 줄어드는 것처럼 과도하게 일반화했다. Trajectory factorization과 reward-to-go의 causality는 문장에만 있어 왜 simulator를 미분하지 않는지와 왜 과거 reward를 제거해도 되는지를 증명할 수 없었다.

- Trajectory 확률을 initial distribution, policy action probability, environment transition의 곱으로 복원했다. Environment dynamics가 policy parameter와 무관하다는 표준 가정 아래 log-derivative를 적용하면 policy score만 남는 과정을 세 수식으로 연결했다.
- Reward `[1,-2,4]`, `γ=1`의 고정 trajectory를 사용해 전체 return weight `[3,3,3]`과 reward-to-go `[3,2,4]`를 전환하는 `ReturnToGoViz`를 추가했다. 미래 action보다 먼저 확정된 reward와 그 action의 expected policy score를 곱하면 0이므로, 과거 항 제거는 bias가 아니라 noise를 줄이는 연산임을 수식과 장면이 같은 순서로 설명한다.
- Binary bandit은 `p(A)=.5`, `R_A=2`, `R_B=-1`로 고정했다. Exact gradient와 REINFORCE sample-gradient expectation은 모두 `.75`다. `b=0`의 sample `[1,.5]`와 variance `.0625`, 이 1D estimator의 `b*=.5`에서 sample `[.75,.75]`와 variance `0`, `b=2`에서 sample `[0,1.5]`와 variance `.5625`를 직접 조작한다.
- 이 예제의 `b*=(1-p)R_A+pR_B`를 일반 MDP의 보편 최적 baseline으로 확장하지 않았다. Action-independent baseline은 기대 gradient를 보존하지만 return 규모를 잘못 예측하면 variance를 키울 수 있다고 고쳤다.
- Actor와 critic이 같은 rollout에서 읽는 target을 분리하고 TD residual에 `(1-d_t)` terminal mask를 복원했다. One-step TD residual은 언제나 exact advantage가 아니며 on-policy이고 critic이 `V^π`를 맞춘 조건에서 action-conditioned expectation으로 일치한다는 경계를 넣었다.
- 기존 `ActorCriticSequenceViz`는 rollout → TD residual → advantage → actor/critic loss의 시간 흐름을 보여 주는 애니메이션으로 유지했다. 새 Viz는 causality와 variance의 숫자 계산, 기존 animation은 network update lifecycle을 소유한다.
- GAE 장면은 conceptual residual map으로 제한하고, terminal-safe reverse recurrence와 value target 구현은 다음 PPO 글의 소유권으로 넘겼다. λ=0, .5, .95, 1에서 `δ=[1,-.4,.8,.2]`, `γ=.9`의 기여를 고정해 GAE를 단순 smoothing으로 읽지 않게 했다.
- Display equation 11개를 모두 한국어 내부 annotation과 FormulaNote에 연결했다. 긴 GAE annotation은 `weight → per-step credit → sum`의 세 행으로 나눠 mobile font를 줄이는 대신 계산 구조를 드러냈다.

비공개 전이 문제는 세 묶음이다. 첫째, trajectory factorization과 log-derivative로 environment 미분 항이 사라지는 조건을 보인다. 둘째, reward `[1,-2,4]`에서 전체 return과 reward-to-go를 계산하고 과거 reward 항의 기대가 0임을 증명한다. 셋째, binary bandit의 세 baseline에서 기대 gradient와 variance를 계산한 뒤 terminal-safe TD residual, critic bias와 GAE trace를 연결한다. 문제 문장은 독자에게 노출하지 않고 각 oracle이 formula, Viz control과 capability check에 일대일 대응하는 authoring gate로 사용했다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. `trajectory factorization → log derivative → policy score`를 생략하지 말고 환경을 미분하지 않는 가정을 표시한다.
2. Return estimator는 전체 return과 reward-to-go의 기대값만 비교하지 말고 같은 trajectory에서 각 시점 weight를 수치로 계산한다.
3. Baseline에는 기대값 보존과 variance 변화라는 두 별도 주장을 둔다. 좋은 baseline과 나쁜 baseline을 모두 계산한다.
4. 작은 예제의 zero-variance baseline을 일반 value baseline의 보편 성질로 확장하지 않는다.
5. Critic prediction, TD target, TD residual, sampled advantage를 같은 이름으로 합치지 않고 terminal mask와 일치 조건을 적는다.
6. 기존 animation이 독립 lifecycle을 설명하면 유지하고, 빠진 계산을 별도 interaction으로 보강한다.
7. 긴 한글 수식 주석은 축소하지 말고 중간 변수를 도입해 여러 aligned row로 나눈다.
8. 기본 상태뿐 아니라 baseline `0/b*/2`, full/causal return과 390·768·1440px overflow·formula font·browser error를 자동 검증한다.

공식 근거는 Williams 1992의 REINFORCE estimator, Sutton et al. 1999의 policy-gradient theorem, Schulman et al. 2015의 GAE, OpenAI Spinning Up의 expected grad-log-prob lemma, reward-to-go와 VPG 실행 순서로 제한했다. Claude 검토는 사용자 지시대로 context-manager의 `ai-researcher`에만 요청했다. Agent 목록 조회는 성공했지만 `POST /api/agents/ai-researcher/chat`가 gateway 500 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- Policy Gradient mobile·tablet·desktop interaction 회귀 `3/3`
- Policy Gradient → PPO → RLHF → Post-training 연결 회귀 local/public 각각 `14/14`
- 390·768·1440px document, formula, interactive-Viz overflow 0, console/page error 0, article table 0
- baseline `0/b*/2`, full return과 reward-to-go, 네 GAE trace 상태의 numeric oracle 확인
- display equation 11개, FormulaNote 8개, missing Korean annotation 0
- 공개 390px 최소 formula font 13.32px; formula clipping 0
- 모바일 element screenshot에서 return rows, bandit probability/variance와 기존 Actor-Critic animation의 글자 절단·겹침·강제 horizontal scroll 없음
- 공개 article과 `rl-policy-gradient-actor-critic-B6JPsCmk.js` chunk HTTP 200

## 25. MC·TD·Q-learning·DQN의 target ledger 실행 계약

기존 MC·TD·DQN 글은 올바른 주제들을 갖고 있었지만 한 trajectory에서 target이 어떻게 달라지는지 계산할 수 없었다. 특히 λ-return Viz가 one-step TD와 full MC 두 숫자를 단순 convex interpolation해 실제 TD(λ)의 forward view를 잘못 표현했다. TD, SARSA, Q-learning과 DQN 수식에는 true terminal mask가 없었고, `done` 하나로 termination과 time-limit truncation을 합쳤다. Double DQN toggle은 선택과 평가 network를 설명했지만 값을 실제로 바꾸지 않았으며, 근거 없는 종합 risk score가 개별 실패 원인을 가렸다.

- Reward `[1,2,4]`, `γ=.9`, `V(s1)=5`, `V(s2)=3`의 한 trajectory로 1-step `5.50`, 2-step `5.23`, terminal MC `6.04`를 고정했다. Finite λ-return은 `(1-λ)λ^(n-1)`과 마지막 남은 `λ^(N-1)`로 모든 n-step return을 섞는다. λ=.5에서 가중치 `[.5,.25,.25]`, target `5.5675`, 표기 `5.568`이 된다.
- `LambdaReturnLab`은 λ=0/.5/.9/1에서 각 horizon weight, contribution과 최종 target을 동시에 바꾼다. 이로써 “λ-return은 TD와 MC 두 숫자의 직선 보간”이라는 기존 오류를 화면에서 반증한다.
- SARSA와 Q-learning은 같은 `r=1`, behavior next Q `2`, greedy next Q `6`을 사용한다. Continuing 또는 time-limit truncation에서는 `2.80`과 `6.40`, true termination에서는 둘 다 `1.00`이 된다. `ControlTargetLab`은 action 주체와 bootstrap gate를 함께 전환한다.
- Exploration을 behavior policy, target policy, coverage의 세 계약으로 분리했다. Off-policy는 behavior와 target을 분리할 수 있다는 뜻이지, replay support 밖의 action value를 자동으로 신뢰할 수 있다는 뜻이 아니다.
- 기존 `DqnLearningSequenceViz`는 replay sample → true termination gate → frozen target → online regression의 시간 흐름을 소유하므로 유지했다. 다만 `d/done`을 `terminated`와 `m=1-terminated`로 고치고 truncation 경계를 장면 안에 명시했다.
- 새 `DqnBackupLab`은 online next `[2,3]`, target next `[2.1,1.6]`, prediction `1.4`를 고정한다. DQN은 target max action `a0`에서 `Y=2.89`, residual `1.49`, loss `2.2201`; Double DQN은 online argmax `a1`을 target이 평가해 `Y=2.44`, residual `1.04`, loss `1.0816`; terminal은 `Y=1`, residual `-.4`, loss `.16`이다.
- Double DQN을 “항상 더 작은 target을 만드는 장치”로 쓰지 않았다. 같은 noisy max가 선택과 평가를 동시에 맡는 경로를 분리해 overestimation bias를 줄이는 장치라는 source boundary를 남겼다.
- 가짜 종합 risk score를 삭제하고 evaluation return, TD residual tail, Q scale, replay age, target lag를 서로 다른 진단 축으로 복원했다. Training loss 감소는 현재 replay와 frozen target이 만든 회귀 문제를 더 잘 맞췄다는 뜻이지 policy improvement의 증거가 아니다.
- Display equation 8개를 MC, n-step, finite λ-return, terminal-safe TD, SARSA, Q-learning, Double DQN, DQN loss에 배치했다. 긴 한글 annotation은 `gate → future term → target → residual/loss`의 3~4개 aligned row로 나눠 모바일 축소를 막았다.
- 역사적 최소 바닥은 Watkins & Dayan 1992의 Q-learning, Mnih et al. 2015의 DQN, van Hasselt et al. 2016의 Double DQN으로 끊었다. Rainbow와 이후 변형은 이 글에 계속 쌓지 않고 독립 판단이 필요한 후속 소유권으로 넘겼다.

비공개 전이 문제는 동일 숫자 예제의 여섯 판단으로 구성했다. 1·2·3-step과 λ=.5 return을 계산하고, continuing·termination·truncation에서 SARSA와 Q-learning target을 구한다. 이어 DQN과 Double DQN의 선택·평가 network, target, residual, loss와 gradient 경로를 추적하고 replay correlation, moving target, max bias, coverage 부족을 중복 없이 진단한다. 문제 문장은 본문에 노출하지 않고 각 답을 세 interaction, 수식과 capability check에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. 알고리즘 이름을 나열하기 전에 한 transition과 숫자 oracle을 고정한다.
2. 모든 return target에서 관측한 reward와 추정한 bootstrap을 별도 항으로 표시한다.
3. λ-return은 n-step return 전체의 기하 가중합으로 계산하고 two-number interpolation으로 대체하지 않는다.
4. `done`을 그대로 쓰지 말고 termination과 truncation이 bootstrap을 다르게 처리하는지 확인한다.
5. SARSA/Q-learning은 next action을 누가 골랐는지, DQN/Double DQN은 선택과 평가 network가 누구인지 동사로 쓴다.
6. Replay, target lag, max bias와 coverage를 하나의 stability 점수로 합치지 않는다.
7. 긴 Korean formula annotation은 글자를 줄이지 말고 중간 변수와 aligned row로 분해한다.
8. λ=0/1, true terminal/truncation, DQN/Double/terminal의 비기본 상태와 mobile overflow를 브라우저에서 모두 실행한다.

공식 근거는 Sutton & Barto 2판의 MC·n-step·TD(λ)·SARSA·Q-learning 정의, Watkins & Dayan 1992의 Q-learning, Mnih et al. 2015의 DQN, van Hasselt et al. 2016의 Double DQN, Farama의 time-limit API 계약으로 제한했다. Claude 검토는 사용자 지시대로 context-manager에서 agent 목록을 조회한 뒤 `ai-researcher`에만 요청했다. `POST /api/agents/ai-researcher/chat`가 gateway 500 `Provider error: All providers failed`를 반환했고 direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- MC·TD·DQN 단독 mobile·tablet·desktop interaction 회귀 `3/3`
- MC·TD·DQN → Policy Gradient → PPO → RLHF → Post-training 연결 회귀 local/public 각각 `17/17`
- λ-return, continuing/termination/truncation, DQN/Double/terminal의 모든 numeric oracle 확인
- display equation 8개, FormulaNote 4개, missing Korean annotation 0, article table 0
- 공개 390px 최소 formula font `12.96px`, document/formula/Viz overflow 0, console/page error 0
- 모바일·태블릿·데스크톱 element screenshot에서 계산 Lab, annotation, 기존 DQN animation의 글자 절단·겹침·내부 horizontal scroll 없음
- 공개 article과 `rl-temporal-difference-dqn-BW_cNITr.js` chunk HTTP 200

## 26. MDP·Return·Value·Bellman의 순차 의사결정 실행 계약

기존 MDP·Bellman 글은 MDP, return, V/Q, Bellman이라는 올바른 단어와 유효한 backup 애니메이션을 갖고 있었다. 그러나 독자가 state와 observation을 구분하거나, V와 Q가 무엇을 평균하는지 수치로 증명하거나, expectation backup과 max backup의 차이를 계산할 수는 없었다. Finite-horizon에서 같은 물리 상태라도 남은 시간이 다르면 가치가 달라진다는 clock 조건도 빠져 있어 다음 TD·Policy Gradient 글의 입력 계약이 약했다.

- 1차원 coast dynamics를 고정한 `MarkovSufficiencyLab`을 추가했다. 현재 위치 `x=0`만 observation으로 쓰면 왼쪽에서 온 history와 오른쪽에서 온 history가 같은 key로 합쳐지지만 숨은 속도 `v=+1/-1` 때문에 다음 위치는 `+1/-1`로 갈린다. `(x,v)`로 전환하면 이 동역학 안에서는 서로 다른 state key가 되어 Markov 예측이 복원된다.
- 이 예제를 “모든 문제에서 위치와 속도면 충분하다”로 일반화하지 않았다. Markov sufficiency는 다음 결과 분포를 예측하는 데 필요한 history 정보가 현재 state에 들어 있다는 조건이며, 센서로 보이는 observation과 환경 state는 다를 수 있다고 경계를 뒀다. 숨은 변수와 belief update는 다음 POMDP 글의 소유권으로 넘겼다.
- Reward `[0,1,0,-1,5]`의 `ReturnExplorer`에서 시작 시점과 discount를 직접 바꾼다. 기본 `gamma=.9`에서 `G0=3.452`, `G2=3.150`이며 `gamma=0`이면 현재 다음 reward만 남는다. Return을 reward의 단순 합이 아니라 “어느 시점에서, 어떤 discount로 본 미래”로 고정했다.
- `ValueConditioningLab`은 같은 state에서 `Qsafe=2.800`, `Qrisk=.765`를 고정하고 policy의 safe 확률만 바꾼다. 50:50에서는 `V=1.783`, advantage가 `+1.018/-1.018`이며 policy 가중 평균은 0이다. Safe 75%에서는 `V=2.291`, advantage가 `+.509/-1.526`로 바뀌지만 다시 평균하면 0이다.
- `V=sum pi Q`와 `sum pi A=0`를 중간 변수 `w_a`, `M_Q`, `M_A`로 여러 행에 풀었다. 이는 다음 Policy Gradient 글에서 state baseline이 평균 방향을 바꾸지 않고 action의 상대적 credit을 남기는 입력 계약이다.
- 기존 `BellmanBackupSequenceViz`는 transition 분포에서 backup으로 가는 시간 흐름을 독립적으로 설명하므로 유지했다. 새 `BellmanExplorer`는 safe와 risk action에 같은 next value를 넣고 risk 성공 확률을 조작해 expectation과 maximum의 차이를 숫자로 닫는다.
- 기본 `gamma=.9, p=.35`에서 safe backup은 `2.80`, risk는 `.77`, 50:50 policy expectation은 `1.78`, optimality backup은 `2.80`이다. Risk 성공 확률을 `.65`로 바꾸면 risk `3.14`, expectation `2.97`, max `3.14`로 역전된다.
- Finite horizon에서는 state key에 시간 또는 남은 horizon을 포함하거나 `V_t`를 써야 한다. 똑같은 위치라도 종료까지 한 step 남은 경우와 백 step 남은 경우의 future opportunity가 다르므로 stationary `V(s)` 하나로 합치면 잘못된 평균이 된다.
- Display equation 8개를 Markov 조건, return 재귀, V/Q/A, policy average, expectation Bellman, optimality Bellman에 배치하고 모두 한국어 내부 annotation과 FormulaNote로 연결했다. 모바일에서 긴 Q 정의와 advantage 평균 증명은 글자를 줄이는 대신 계산 행을 분리했다.
- 역사적 바닥은 Sutton & Barto의 표준 정의와 OpenAI Spinning Up의 state/observation·value·Bellman 경계로 끊었다. 이 글은 POMDP belief filter나 TD update를 흡수하지 않고 각각 다음 글로 넘긴다.

비공개 전이 문제는 네 묶음이다. 첫째, 같은 `x=0` observation을 만드는 두 history에서 다음 위치 분포가 달라지는 반례를 찾고 어떤 state 확장이 Markov 조건을 복원하는지 판단한다. 둘째, 고정 reward sequence에서 여러 시작 시점과 discount의 return을 계산한다. 셋째, policy 확률을 바꿔 `V`와 두 `A`를 계산하고 가중 평균이 0임을 증명한다. 넷째, transition 확률이 바뀔 때 policy expectation과 optimality max가 서로 다른 값을 내는 이유를 계산하고 finite-horizon clock, hidden observation과 TD target의 경계를 설명한다. 문제 문장은 본문에 노출하지 않고 각 답을 interaction, formula와 browser oracle에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. MDP를 명사 목록으로 시작하지 말고 같은 observation이 다른 next distribution을 만드는 최소 반례부터 고정한다.
2. Observation이 아니라 state가 Markov하다는 주장에는 어떤 history 정보가 state에 압축됐는지와 적용 동역학의 범위를 적는다.
3. Return은 reward sequence, 시작 시점과 discount를 함께 제시하고 독자가 직접 합을 검산하게 한다.
4. V와 Q는 “무엇을 조건으로 고정하고 무엇을 policy로 평균하는가”를 같은 숫자에서 비교한다.
5. Advantage에는 `V=sum pi Q`와 `E_pi[A]=0`의 계산을 넣어 다음 policy-gradient baseline으로 연결한다.
6. Bellman expectation과 optimality는 이름이 아니라 같은 action backup을 policy 평균할지 max로 고를지 숫자로 비교한다.
7. Finite horizon clock, hidden-state belief와 sample-based TD를 현재 글에 무한히 흡수하지 말고 다음 소유권을 명시한다.
8. 긴 한국어 annotation은 중간 변수와 aligned row로 분해하고, 기본값 외 state representation·policy probability·risk probability·discount·start step을 브라우저에서 실행한다.

공식 근거는 Sutton & Barto 2판의 MDP·return·value·Bellman 정의와 OpenAI Spinning Up의 state 대 observation, V/Q/A와 Bellman 관계로 제한했다. Claude 검토는 사용자 지시대로 context-manager에서 agent 목록을 조회한 뒤 `ai-researcher`에만 요청했다. `POST /api/agents/ai-researcher/chat`가 gateway 500 `Provider error: All providers failed`를 반환했고 direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- MDP·Bellman 단독 mobile·tablet·desktop interaction 회귀 `3/3`
- MDP·Bellman부터 PPO까지의 연결 회귀 local/public 각각 `12/12`
- Markov 부족/충분, return 시작점·discount, policy 50/75%, risk probability 35/65%의 모든 numeric oracle 확인
- display equation 8개, FormulaNote 5개, missing Korean annotation 0, article table 0
- 390·768·1440px document/formula/Viz overflow 0, console/page error 0
- 공개 390px 최소 formula font `12.14px`, formula clipping 0
- 모바일·데스크톱 element screenshot에서 Markov 두 history, Value ledger, Bellman backup의 글자 절단·겹침·강제 horizontal scroll 없음
- 공개 article과 `rl-mdp-bellman-CXbX4zaM.js` chunk HTTP 200

## 27. POMDP·Belief·State Estimation의 숨은 상태 추론 계약

기존 POMDP 글은 hidden state, belief, Bayes filter, Kalman filter와 recurrent policy를 올바른 순서로 소개했고, 기존 `PomdpBeliefSequenceViz`도 관측에서 행동으로 이어지는 lifecycle을 안정적으로 보여 줬다. 그러나 belief Lab은 action transition을 생략한 correction-only 계산이었고, active sensing은 ACT·SENSE·WAIT 카드만 있어 정보가 언제 비용보다 가치 있는지 계산할 수 없었다. Kalman Lab도 predicted covariance를 직접 주는 구조라 process noise와 sensor noise의 역할을 분리하지 못했고, NIS consistency와 recurrent burn-in·mask는 실행 계약이 없었다.

- Full Bayes filter를 `prediction → likelihood mass → evidence → normalization`으로 복원했다. Prior blocked probability `.5`, hold transition `P(B'|B)=.9`, `P(B'|C)=.1`, sensor accuracy `.85`, blocked observation이면 predicted belief `.500`, evidence `.500`, posterior `.850`이다.
- 같은 prior에서 move/slip transition `P(B'|B)=.65`, `P(B'|C)=.35`를 선택하면 predicted belief `.500`으로 같지만, prior `.7`에서는 hold가 `.660`, move가 `.560`으로 갈린다. 관측만 Bayes로 갱신하는 것이 아니라 행동이 먼저 state distribution을 이동시킨다는 점을 수치로 고정했다.
- Clear observation으로 바꾸면 prior `.7`, move 조건의 evidence는 `.458`, posterior blocked probability는 `.183`이다. Evidence를 단순 분모로 숨기지 않고 “이번 관측이 현재 예측 아래 얼마나 가능한가”라는 likelihood check로 읽게 했다.
- `ActiveSensingLab`은 safe `+4`, danger `-8`, probe accuracy `.85`, probe cost `.5`를 고정했다. Danger belief `.5`에서는 즉시 행동 가치 `-2.00`, probe 후 최적 행동 가치 `1.70`이므로 `PROBE FIRST`; belief `.9`에서는 즉시 행동 `2.80`, probe `2.30`이므로 `ACT NOW`다.
- Probe의 두 observation branch에서 posterior, branch probability와 후속 최적 결정을 모두 계산한다. Entropy 감소 자체가 reward는 아니며, 관측이 이후 행동을 바꿔 얻는 expected utility가 sensing cost를 넘어야만 정보 수집이 가치 있다는 경계를 명시했다.
- Kalman Lab은 `P^- = P + Q`, `S = H P^- H^T + R`, `K = P^- H^T S^{-1}`의 covariance chain으로 바꿨다. `P=1, Q=1, R=1`이면 `P^-=2`, `K=.667`, corrected estimate `5.33`, posterior variance `.67`; `R=4`이면 `K=.333`, estimate `4.67`, posterior variance `1.33`이다.
- Innovation을 단순 오차가 아니라 predicted innovation covariance로 정규화하는 NIS를 추가했다. NIS tail이 반복적으로 크면 센서 outlier뿐 아니라 Q/R calibration, model mismatch와 association 오류를 함께 의심해야 하며, 한 step의 작은 residual만으로 filter consistency를 선언하지 않게 했다.
- Recurrent policy에는 sequence burn-in과 loss mask 수식을 추가했다. Burn-in observation은 hidden state를 복원하지만 gradient loss에 포함하지 않고, true terminal에서는 hidden state를 reset한다. Random subsequence 시작에서 hidden state를 항상 zero로 두는 train–serve mismatch를 별도 failure mode로 만들었다.
- 기존 POMDP 애니메이션은 observation → belief → state estimate → policy lifecycle을 담당하므로 유지했다. 새 Lab들은 계산 가능한 filter, sensing value와 covariance trust를 담당해 같은 내용을 중복하지 않는다.
- Display equation 12개를 belief prediction·normalization, belief control, Kalman prediction·gain·correction, NIS와 recurrent sequence loss에 배치했다. 모든 수식에 한국어 내부 annotation을 넣고 12개의 FormulaNote로 단위·가정·실패 경계를 붙였다.

비공개 전이 문제는 다섯 묶음이다. 첫째, 같은 observation에서 action transition이 다른 두 Bayes posterior와 evidence를 계산한다. 둘째, probe의 observation branch posterior와 expected optimal value를 구해 즉시 행동의 threshold를 판정한다. 셋째, Q와 R을 바꿨을 때 predicted covariance, Kalman gain, estimate와 posterior covariance를 계산한다. 넷째, innovation과 S로 NIS를 만들고 residual 크기만 보는 진단의 실패를 설명한다. 다섯째, recurrent subsequence에서 burn-in, loss mask와 terminal reset이 각각 어떤 정보를 보존하거나 차단하는지 추적한다. 문제 문장은 독자에게 노출하지 않고 각 답을 수식, 조작 가능한 Viz와 capability check에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. POMDP를 “state가 안 보인다”로 끝내지 말고 transition prediction과 observation correction을 별도 단계로 계산한다.
2. Normalizer `Z`를 생략하지 않고 observation evidence와 posterior 합 1을 함께 검산한다.
3. Information gain과 decision value를 같은 값으로 취급하지 않는다. Sensing branch별 posterior, 후속 action과 cost를 expected utility로 닫는다.
4. Kalman gain은 임의 trust slider가 아니라 P, Q, R에서 유도하고 estimate뿐 아니라 posterior covariance를 계산한다.
5. Innovation 진단에는 residual과 predicted covariance를 함께 쓰며 NIS 하나를 보편적 이상 탐지기로 일반화하지 않는다.
6. Recurrent policy는 hidden state, burn-in window, loss mask와 terminal reset을 실행 순서로 쓴다.
7. 유효한 lifecycle animation은 유지하고 숫자 계산이 빠졌을 때만 독립 Lab을 추가한다.
8. Prior·transition·observation·sensor accuracy, sensing threshold와 Q/R의 비기본 상태를 390·768·1440px에서 실행하고 formula font, overflow와 browser error를 함께 검사한다.

공식 근거는 Kaelbling, Littman & Cassandra 1998의 belief sufficient statistic·Bayes update·information-gathering action, Welch & Bishop의 Kalman prediction/correction, Hausknecht & Stone의 DRQN partial-observation framing으로 제한했다. Claude 검토는 사용자 지시대로 context-manager의 `ai-researcher`에만 요청했으나 `POST /api/agents/ai-researcher/chat`가 gateway 500 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- POMDP 단독 mobile·tablet·desktop interaction 회귀 local/public 각각 `3/3`
- MDP → POMDP → TD → Policy Gradient → PPO 연결 회귀 local/public 각각 `15/15`
- Full Bayes prediction/evidence/posterior, sensing belief 50/90%, Kalman Q/R의 모든 numeric oracle 확인
- display equation 12개, FormulaNote 12개, missing Korean annotation 0, article table 0
- 390·768·1440px document/formula/Viz overflow 허용 기준 이내, console/page error 0
- 공개 390px 최소 formula font `12.00px`; formula clipping 0
- 모바일·데스크톱 screenshot에서 기존 belief animation과 세 계산 Lab의 글자 절단·겹침·강제 내부 scroll 없음
- 공개 article과 `rl-pomdp-state-estimation-BIFpOEcR.js` chunk HTTP 200, `cm-blog.service` active

## 28. Demonstration에서 Offline RL까지의 데이터 지지집합 실행 계약

기존 모방 학습·Offline RL 글은 BC, 복합 오차, DAgger, CQL, Decision Transformer라는 큰 순서는 맞았고 기존 `OfflineLearningSequenceViz`도 온라인 상호작용과 고정 데이터 학습의 차이를 안정적으로 보여 줬다. 그러나 CQL 실험은 방문 횟수로 임의 penalty를 만드는 모형이라 실제 `logsumexp - dataset expectation` 목적함수와 gradient를 재현하지 못했다. IQL은 빠져 있었고, 학습된 정책을 배포 전에 어떻게 검증하는지와 support가 끊기면 왜 평가조차 식별되지 않는지도 설명하지 않았다.

- BC를 supervised action prediction으로 고정한 뒤, 한 step 오류가 horizon을 따라 누적되는 확률과 기대 오류 횟수를 같은 Lab에서 계산한다. 기본 `T=200, epsilon=.01`이면 한 번 이상 오류날 확률은 `86.7%`, 기대 오류는 `2.00`; `T=150`이면 `77.9%`, `1.50`이다.
- DAgger는 expert action을 learner가 실제 방문한 state에 다시 붙여 dataset distribution을 learner-induced distribution 쪽으로 옮기는 방법으로 설명했다. Expert가 없거나 query가 위험한 환경에서는 그대로 적용할 수 없다는 운영 경계도 함께 남겼다.
- CQL Lab은 actions `lane/brake/shortcut`, dataset count `640/260/2`, Q `3.1/3.6/6.7`을 고정했다. `R(Q)=logsumexp(Q)-E_beta Q=3.518`이고 gradient `softmax(Q)-beta`는 `-0.684/-0.246/+0.930`이다. 데이터에는 두 번뿐인데 Q가 큰 shortcut만 강하게 아래로 밀리는 방향을 독자가 직접 확인한다.
- `alpha=1.2`, learning rate `.5`의 regularizer-only preview는 Q를 `3.51/3.75/6.14`로 바꾼다. `alpha=0`에서는 원래 Q를 유지하고 `alpha=2.4`에서는 `3.92/3.90/5.58`이 된다. 이는 전체 CQL update가 아니라 conservative term의 방향을 격리한 시각화이며, 본문은 실제 목적함수가 Bellman error와 이 항의 합임을 명시한다.
- IQL을 추가해 training 중 dataset 밖 action을 직접 max하거나 질의하지 않는 경로를 설명했다. Upper expectile value fit과 advantage-weighted behavior cloning을 두 단계로 분리하고, IQL도 dataset support 밖 행동의 실제 결과를 새로 관측하는 방법은 아니라는 경계를 뒀다.
- OPE Lab은 세 trajectory의 `(pi_beta, pi, G)=(.4,.6,8),(.5,.25,4),(.1,.15,12)`를 사용한다. Importance ratio는 `1.5/.5/1.5`, ordinary IS는 `10.67`, self-normalized IS는 `9.14`, ESS는 `2.58/3`이다.
- Target policy가 선택하지만 behavior probability가 0인 action을 누르면 계산을 거부하고 `식별 불가`를 표시한다. Importance sampling 공식을 보여 주는 것과 실제 배포 승인을 내리는 것은 다르며, support와 ESS, estimator variance, multiple seeds와 안전 제약을 함께 보지 않으면 안 된다고 명시했다.
- Decision Transformer는 return-to-go를 causal token sequence의 조건으로 두는 action prediction으로 설명했다. 높은 목표 return을 입력하는 것이 dataset 밖 성공 행동을 생성·검증한다는 뜻은 아니므로, sequence modeling 역시 support 문제를 지우지 않는다고 연결했다.
- Display equation 12개를 BC·복합오차·DAgger·CQL·IQL·OPE·DT에 배치하고 모두 한국어 내부 annotation과 12개의 FormulaNote로 연결했다. 긴 주석은 font를 축소하지 않고 aligned row와 중간 변수로 분리했다.
- 역사적 바닥은 DAgger, CQL, IQL, Decision Transformer와 importance-sampling OPE 원문으로 끊었다. 고전 IL/RL 논문을 무한히 더 내려가지 않고, 각 방법이 해결하는 distribution·support·evaluation 실패를 같은 사례로 이어 읽게 했다.

비공개 전이 문제는 한 toy dataset을 끝까지 재사용한다. 첫째, BC의 one-step error가 long horizon에서 왜 커지는지 계산한다. 둘째, dataset 빈도와 Q로 CQL regularizer 및 각 action gradient를 계산해 어떤 Q가 내려가야 하는지 판정한다. 셋째, IQL이 unseen shortcut을 training target에서 직접 고르지 않는 실행 순서를 설명한다. 넷째, 세 trajectory로 IS·self-normalized IS·ESS를 계산한 뒤 behavior support가 0인 target action은 왜 점수 자체가 식별되지 않는지 증명한다. 다섯째, 같은 데이터로 학습한 DT에 높은 desired return을 주는 것만으로 배포 가능성을 증명할 수 없는 이유를 연결한다. 문제 문장은 본문에 노출하지 않고 모든 답을 수식, interactive state와 browser oracle에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. BC→distribution shift→DAgger→fixed dataset→conservative learning→OPE→sequence policy를 하나의 데이터 흐름으로 연결한다.
2. CQL을 방문 횟수 기반 임의 penalty로 흉내 내지 말고 `logsumexp - dataset expectation`과 gradient 방향을 같은 숫자로 계산한다.
3. Regularizer-only 시각화와 Bellman term을 포함한 실제 CQL objective를 명확히 구분한다.
4. IQL은 expectile V fit과 advantage-weighted actor의 실행 순서를 쓰고 “unseen action을 학습 중 직접 질의하지 않는다”와 “support를 창조하지 않는다”를 함께 적는다.
5. OPE에는 behavior와 target probability, return, importance ratio, estimator와 ESS를 넣고 zero support에서는 수치를 만들지 않는다.
6. Decision Transformer의 conditioning과 causal prediction loss를 설명하되 desired return을 causal guarantee로 과장하지 않는다.
7. 유효한 lifecycle animation은 유지하고 빠진 계산만 독립 Lab으로 추가한다.
8. 기본값 외 horizon·error, CQL alpha, supported/unsupported OPE를 390·768·1440px에서 실행하고 formula font·overflow·console error를 함께 검사한다.

공식 근거는 Ross, Gordon & Bagnell 2011의 DAgger, Kumar et al. 2020의 CQL, Kostrikov et al. 2021의 IQL, Chen et al. 2021의 Decision Transformer, Hanna et al. 2019의 importance-sampling OPE로 제한했다. Claude 검토는 사용자 지시대로 `context-manager` gateway의 `claude-sonnet-4-6` 모델에 bounded read-only prompt로 요청했다. `/v1/chat/completions`가 `Provider error: All providers failed`를 반환했고 direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- Imitation·Offline RL 단독 mobile·tablet·desktop interaction 회귀 local/public 각각 `3/3`
- MDP → POMDP → TD → Policy Gradient → PPO → Imitation·Offline RL 연결 회귀 local/public 각각 `18/18`
- 복합 오차, CQL regularizer·gradient·alpha 상태, OPE supported/unsupported의 모든 numeric oracle 확인
- display equation 12개, FormulaNote 12개, missing Korean annotation 0, article table 0
- 390·768·1440px document/formula/Viz overflow 허용 기준 이내, console/page error 0
- 공개 390px 최소 formula font `12.00px`; formula clipping 0
- 모바일·데스크톱 screenshot에서 CQL dual bar와 OPE evidence panel의 글자 절단·겹침·강제 내부 scroll 없음
- 공개 article과 `rl-imitation-offline-learning-6KwkNqAw.js` chunk HTTP 200, `cm-blog.service` active

## 29. Model-based RL에서 World Models까지의 예측·계획·검증 계약

기존 글은 Dyna, model bias, World Models, MuZero와 Dreamer를 올바른 큰 순서로 소개했고 기존 `WorldModelSequenceViz`도 real transition과 imagined transition의 lifecycle을 유지할 가치가 있었다. 그러나 planning Lab은 model accuracy 비율로 correct·biased update 수를 임의 분할해 실제 알고리즘을 계산하지 않았고, World Models와 MuZero의 서로 다른 학습 target이 한 섹션에 섞여 있었다. Dreamer도 posterior와 prior, continue가 lambda-return을 끊는 실행 계약 없이 설명에 머물렀다.

- Dyna Lab은 실제 transition 한 번으로 Q가 `5→4`가 된 뒤 stale model이 계속 target `5`를 내는 상황을 격리했다. `alpha=.2`에서 가상 backup 5회면 Q는 `4.67`, 50회면 `5.00`으로 실제 교정이 지워진다. Model을 새 transition으로 교정해 target이 `0`이 되면 5회 뒤 `1.31`, 50회 뒤 `0.00`이다.
- 반복 scalar backup을 `Q^(n)=yhat+(Q^(0)-yhat)(1-alpha)^n`으로 닫았다. Planning budget은 정확성의 보증이 아니라 현재 model target에 대한 확신 증폭기이며, prioritized sweeping도 stale transition을 참으로 바꾸지 않는다는 경계를 명시했다.
- Model bias Lab은 일정 acceleration bias라는 최소 물리 반례로 one-step 위치 오차와 horizon 오차를 분리한다. 기본 `b=.04, H=12`에서 one-step `.020m`, H-step `2.88m`, 증폭 `144x`; `H=20`에서는 `8.00m`, `400x`다. 이는 모든 neural model의 보편적 bound가 아니라 one-step validation loss가 closed-loop fidelity를 대체하지 못한다는 계산이다.
- World Models를 V·M·C로 독립시켰다. V는 frame을 z로 압축하고, M은 action·z·history h에서 다음 latent distribution과 필요한 done을 예측하며, C는 decoded future가 아니라 현재 `[z;h]`로 action을 만든다. Dream artifact exploitation과 temperature의 역할도 real closed-loop 검증과 구분했다.
- MuZero는 representation `h`, recurrent dynamics `g`, prediction `f`를 depth별로 추적한다. Model prior `[.30,.45,.25]`와 MCTS 뒤 policy target `[.20,.70,.10]`을 다른 숫자로 보여 주고, reward는 실제 환경 기록, policy는 visit distribution, value는 reward와 bootstrap의 결합에서 온다는 출처를 분리했다. Pixel reconstruction target은 없지만 safety-relevant 변수가 자동 보존된다는 뜻은 아니다.
- Dreamer는 실제 observation을 본 posterior anchor를 독립된 시작 띠로 두고, 그 이후는 새 pixel 없이 prior로 전개되는 구조로 바꿨다. 기본 `gamma=.9, lambda=.8`, rewards `[1,2,5]`, values `[2,1.5,1,4]`, terminal continue `[1,1,0]`에서 `R2=5.00`, `R1=5.87`, `R0=5.59`다. Terminal을 놓쳐 `[1,1,1]`이 되면 `R0=7.17`로 존재하지 않는 미래가 붙고, `lambda=0`이면 `R0=2.80`이다.
- Display equation 10개를 Dyna model·backup·반복 수렴, horizon bias, World Models latent·controller, MuZero architecture·loss, Dreamer RSSM·lambda-return에 배치했다. 처음 모바일 검사에서 5개 식이 `9.54–11.49px`로 축소되는 결함을 발견해 한국어 underbrace를 중간 변수와 여러 행으로 분해했고, 최종 10개 모두 `12.00px`, clipping 0을 달성했다.
- MuZero의 model prediction과 training target, Dreamer의 anchor와 imagination을 시각적으로 분리했다. 특히 모바일 4열에 갇혀 `observation`이 부자연스럽게 끊기던 anchor를 full-width band로 바꿔 390px에서도 단어 절단과 내부 scroll이 없게 했다.

비공개 전이 문제는 네 묶음이다. 첫째, 환경 변경 전·stale·교정 후 Dyna target에 planning 횟수를 적용해 Q가 어느 target으로 수렴하는지 계산한다. 둘째, one-step dynamics bias를 두 번 적분해 horizon별 위치 drift와 증폭 배율을 구하고 일반화 한계를 설명한다. 셋째, World Models의 V·M·C와 MuZero의 h·g·f에서 각 입력·출력·학습 target·consumer를 추적하고 model prior와 search target을 구분한다. 넷째, Dreamer posterior에서 시작한 prior imagination의 terminal-aware lambda-return을 역산하고 continue 오류가 value를 어떻게 부풀리는지 계산한다. 문제 문장은 본문에 노출하지 않고 모든 답을 본문, 수식, interaction과 browser oracle에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. Model-based RL을 “미래를 예측한다”로 시작하지 말고 어떤 action-conditioned quantity를 누가 planning에 소비하는지 먼저 쓴다.
2. Dyna planning은 임의 accuracy 비율이 아니라 실제 update와 동일한 backup을 model-generated transition에 적용해 계산한다.
3. Planning 횟수는 stale target도 증폭하므로 model freshness와 rollout validation을 compute budget보다 먼저 검사한다.
4. World Models의 V·M·C, MuZero의 h·g·f, Dreamer의 posterior·prior를 이름 목록이 아니라 입력·출력·target·consumer 순서로 분리한다.
5. MuZero model prior와 MCTS visit target을 같은 policy distribution으로 합치지 않고 reward·policy·value target의 출처를 각각 쓴다.
6. Dreamer lambda-return에는 reward, value, continue, terminal과 horizon bootstrap을 넣고 continue 오류 상태도 실행한다.
7. 긴 한국어 KaTeX annotation은 font를 줄이지 말고 보조 변수와 aligned row로 분해한다.
8. 유효한 lifecycle animation은 유지하고 Dyna stale/refreshed, horizon 12/20, MuZero depth 1/3, Dreamer terminal/missing-terminal/lambda 0을 390·768·1440px에서 실행한다.

공식 근거는 Sutton의 Dyna 원 논문, Ha & Schmidhuber의 저자 공식 World Models 글, MuZero 원 논문, DreamerV3 출판본으로 제한했다. Claude 독립 검토는 사용자 지시대로 context-manager gateway의 `claude-sonnet-4-6`에 bounded read-only prompt로 세 차례 요청했다. 모두 `/v1/chat/completions`에서 `Provider error: All providers failed`를 반환했고 wrapper 로그의 Anthropic 로그인 자격 증명 오류와 일치했다. Direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- Model-based RL 단독 mobile·tablet·desktop interaction 회귀 local/public 각각 `3/3`
- MDP → POMDP → TD → Policy Gradient → PPO → Imitation·Offline RL → Model-based RL 연결 회귀 local/public 각각 `21/21`
- Dyna stale/refreshed·planning count, model bias horizon, MuZero prior/target·depth, Dreamer terminal·lambda의 모든 numeric oracle 확인
- display equation 10개, FormulaNote 10개, missing Korean annotation 0, article table 0
- 390·768·1440px document/formula/Viz overflow 허용 기준 이내, console/page error 0
- 공개 390px 최소 formula font `12.00px`, formula clipping 0
- 모바일·데스크톱 screenshot에서 Dyna, bias, MuZero, Dreamer의 글자 절단·겹침·강제 내부 scroll 없음
- 공개 article과 `rl-model-based-world-models-CrIfNkmw.js` chunk HTTP 200, `cm-blog.service` active

## 30. Safe RL의 예산·국소 업데이트·개입 마감시간 실행 계약

기존 Safe RL 글은 CMDP, Lagrangian, CPO, Lyapunov, Recovery RL과 Safety Gym이라는 개념 경계 및 원문 근거는 올바르게 잡혀 있었다. 그러나 독자가 실제 정책을 승인할 때 필요한 계산은 기대 위반 횟수와 고정 penalty 비교뿐이었다. 기대 비용 제약과 한 번이라도 사고가 날 확률이 섞였고, CPO는 왜 어떤 step은 허용되고 어떤 step은 복구가 필요한지 계산할 수 없었으며, Lyapunov와 Recovery는 각각 local backup과 실제 제동 시간이라는 핵심 운영 경계가 빠져 있었다.

- 먼저 `T=100, p=.01`에서 기대 위반 횟수 `1.00`과 한 번 이상 위반할 확률 `63.4%`를 나란히 계산했다. 기대 비용 CMDP 제약은 chance constraint가 아니며, step probability를 `.002`로 낮추면 기대 횟수 `.20`, any-event probability `18.1%`가 된다는 차이를 같은 조작으로 확인한다.
- 고정 Lagrange multiplier Lab은 reward와 cost를 같은 점수로 접어 넣되 lambda가 정책 선택을 어떻게 바꾸는지 격리했다. `lambda=4/20/150`에서 각각 고속 통과, 감속 통과, 정지·재계획이 선택된다. Dual penalty는 유용한 최적화 압력이지 per-update feasibility 보증은 아니라는 한계를 CPO로 넘겼다.
- CPO Lab은 1차원 local QCQP의 trust interval과 linearized safety half-space를 실제 교집합으로 계산한다. `g=1,b=.6,H=1,c=.04,delta=.08`이면 trust 범위는 `±.400`, safety upper bound는 `-.067`, 선택 step은 `-.067`이다. `delta=.001`이면 두 허용집합이 만나지 않아 `LOCAL INFEASIBLE`이며, 현재 정책이 예산 안쪽일 때는 같은 `delta=.08`에서 reward 방향 `+.167`을 선택한다.
- CPO의 true-cost residual bound를 따로 두어 local surrogate를 만족했다고 실제 환경의 충돌 확률까지 자동 보증되는 것은 아님을 명시했다. KL trust region은 근사 오차를 제한하지만 model misspecification, estimator noise와 chance constraint를 대신하지 않는다.
- Lyapunov Lab은 action별 `immediate cost + next L` 값 `fast=1.30`, `slow=1.12`, current budget `L(s)=1.20`을 고정했다. Fast 확률 `.25`이면 candidate backup `1.165`, slack `+.035`로 local feasible이고, `.60`이면 `1.228`, `-.028`로 local violation이다. 이 조건이 global expected-cost 논리로 이어지려면 model/cost와 feasible baseline이 유효해야 한다는 전제를 함께 적었다.
- Recovery Lab은 risk classifier 성능과 물리적 개입 가능성을 분리했다. Risk `.74 > .30`이면 recovery action을 고르지만 detection `60ms`, handoff `20ms`, braking `420ms`가 필요해 TTC `300ms`에서는 margin `-200ms`, 즉 `TOO LATE`다. TTC `700ms`이면 `+200ms`로 recoverable이고 risk `.18`이면 gate가 task action을 유지해 위험을 놓친다.
- 기존 `SafeRlSequenceViz`는 없애지 않고 risk estimate → constrained update → shield → monitor의 전체 lifecycle을 설명하는 마지막 deployment section으로 이동했다. 글 제목 바로 아래 장면을 두지 않고, 앞선 계산에서 각 단계의 의미를 배운 뒤 전체 흐름을 재조립하게 했다.
- Display equation 10개를 기대값/사건확률, CMDP, Lagrangian, CPO QCQP와 residual, Lyapunov baseline/local set, recovery risk/gate/timing에 배치했다. 모두 한국어 내부 annotation과 FormulaNote를 가지며, 긴 식은 축소 대신 보조 변수와 여러 행으로 분해했다.

비공개 전이 문제는 다섯 묶음이다. 첫째, 같은 per-step 위험에서 기대 위반 횟수와 episode any-event probability를 계산하고 둘 중 어떤 요구사항인지 판별한다. 둘째, lambda 변화에 따른 reward-cost ranking을 계산하되 dual penalty를 feasibility certificate로 오해하지 않는다. 셋째, CPO trust interval과 safety half-space 교집합을 구하고 infeasible할 때 recovery step이 필요한 이유를 설명한다. 넷째, stochastic action mixture의 Lyapunov Bellman backup과 slack을 계산한다. 다섯째, Recovery risk gate가 켜진 뒤 detection, handoff, braking latency를 TTC에서 빼 실제 개입 가능성을 판정한다. 문제 문장은 본문에 노출하지 않고 모든 답을 수식, 조작 가능한 Viz와 browser oracle에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. Safe RL을 “보상을 줄인다”로 설명하지 말고 expected cost, any-event probability와 hard physical deadline을 서로 다른 계약으로 분리한다.
2. Lagrangian은 reward-cost 단위를 정의하고 lambda별 정책 변화까지 계산하되 per-update safety를 보증한다고 쓰지 않는다.
3. CPO는 objective gradient, cost gradient, budget residual, KL trust region을 숫자로 두고 feasible-set 교집합과 infeasible 상태를 모두 실행한다.
4. Local surrogate와 true constraint 사이 residual 또는 approximation boundary를 반드시 설명한다.
5. Lyapunov는 이름만 나열하지 말고 action mixture의 local Bellman backup과 `L(s)-backup` slack을 계산한다.
6. Recovery는 classifier threshold만 보지 않고 detection, handoff, actuation latency와 TTC를 합쳐 개입 마감시간을 검증한다.
7. Lifecycle animation은 선행 개념을 배운 뒤 재조립하는 위치에 두고, 계산 Lab과 역할을 중복시키지 않는다.
8. 기본값 외 budget, lambda, CPO infeasible/feasible, Lyapunov violation, Recovery late/recoverable/missed-risk를 390·768·1440px에서 실행하고 formula font, overflow와 browser error를 함께 검사한다.

공식 근거는 Achiam et al. 2017의 CPO, Chow et al. 2018의 Lyapunov-based safe policy optimization, Thananjeyan et al. 2021의 Recovery RL, OpenAI의 Safety Gym benchmark 설명으로 제한했다. CPO의 near-constraint satisfaction, Lyapunov의 global expected-cost constraint를 local linear conditions로 바꾸는 범위, Recovery RL의 offline violation data 및 분리된 recovery policy를 서로 다른 보증 수준으로 유지했다. Claude 독립 검토는 사용자 지시대로 context-manager gateway의 `claude-sonnet-4-6`에 bounded read-only prompt로 요청했으나 `/v1/chat/completions`가 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- Safe RL 단독 mobile·tablet·desktop interaction 회귀 local/public 각각 `3/3`
- MDP → POMDP → TD → Policy Gradient → PPO → Imitation·Offline RL → Model-based RL → Safe RL 연결 회귀 local/public 각각 `24/24`
- expected count/any-event probability, lambda ranking, CPO feasible/infeasible, Lyapunov slack, Recovery timing의 모든 numeric oracle 확인
- display equation 10개, FormulaNote 10개, missing Korean annotation 0, article table 0
- 390·768·1440px document/formula/Viz overflow 0, console/page error 0
- 공개 390px 최소 formula font `12.00px`, formula clipping 0
- 모바일·데스크톱 screenshot에서 CPO interval, Lyapunov mixture, Recovery timing의 글자 절단·겹침·강제 내부 scroll 없음
- 공개 article과 `rl-safe-constrained-learning-Ck6aWOkQ.js` chunk HTTP 200, `cm-blog.service` active

## 31. Dense Transformer의 공통 실행 계약과 시대순 설계 전환

기존 Dense 글은 GPT-2, Llama, Qwen, Gemma, OLMo의 수치를 모아 두었지만, 독자가 한 block의 실제 실행 순서와 모델별 변경 이유를 이어 읽기 어려웠다. 공통 수식은 attention residual을 지나지 않은 `h_l`에 FFN을 바로 더하는 잘못된 축약이었고, SwiGLU gate와 value branch의 역할도 모호했다. 모델마다 큰 반복 Viz를 두어 모바일 길이만 늘어났으며, 원 논문 구조도는 작은 grid 안에서 읽기 어려웠다.

- 공통 decoder를 `u_l=h_l+Attn(Norm(h_l))`, `h_(l+1)=u_l+MLP(Norm(u_l))`의 두 단계로 고쳤다. 독자는 attention이 만든 중간 residual을 FFN이 실제로 소비한다는 실행 계약부터 잡는다.
- SwiGLU를 `g=SiLU(xW_g)`, `v=xW_u`, `MLP(x)=(g odot v)W_d`로 분리했다. Gate, candidate, down projection을 따로 설명하고 일반 FFN의 `2dm`과 gated FFN의 `3dm` projection weight 예산을 계산한다.
- 하나의 `DenseBlockDecisionLab`에서 GPT-2 XL, Llama 3 8B, Qwen3 8B, Gemma 3 27B, OLMo 3 7B를 시대순으로 비교한다. 각 preset은 이전 모델에서 물려받은 계약, 이번에 바꾼 결정, 실행·메모리 결과, 공식 근거의 경계를 같은 위치에 표시한다.
- 정확한 per-block projection oracle은 GPT-2 XL attention `10.24M`·FFN `20.48M`, Qwen3 attention `41.94M`·FFN `150.99M`, Gemma 3 attention `66.06M`·FFN `346.82M`, OLMo 3 attention `67.11M`·FFN `135.27M`이다. Bias, norm, embedding은 이 비교에서 제외한다고 명시했다.
- Qwen3의 QK-Norm을 단순 L2/cosine normalization으로 잘못 일반화하지 않았다. 공식 구현처럼 head별 RMSNorm 뒤 scaled dot product를 계산하며, toy 조건 `gamma=1, epsilon=0`에서 `q=(3,4), k=(4,3), d_h=2`이면 score는 `1.358`이고 양의 query scale을 바꿔도 같다. 실제 학습 가능한 gamma와 epsilon은 이 toy 불변성 밖에 남는다.
- Qwen tokenizer vocabulary `151,669`와 official config의 padded embedding rows `151,936`을 구분했다. Untied input/output embedding 두 장은 config row 기준 `1,244.66M` weights다.
- Gemma 3의 5 local : 1 global schedule과 OLMo 3의 24 sliding : 8 full schedule을 모델 이름이 아니라 layer 실행 결정으로 설명했다. OLMo 3은 표준 post-norm이 아니라 attention/FFN sublayer output을 residual에 더하기 전에 정규화하는 구조임을 별도 수식으로 경계 지었다.
- GPT-2 XL을 무한한 역사 탐색의 종점이 아니라 이 경로의 최소 canonical stopping point로 정했다. 그 아래의 언어모델 역사와 범용 신경망사는 이 글의 기본 경로에서 숨기고 필요할 때만 기반 글로 연결한다.
- 원 논문 구조도는 여러 작은 카드 대신 5개 tab 중 한 장을 크게 읽는 viewer로 바꿨다. Mobile 최소 높이 `30rem`, tablet `38rem`, desktop `44rem`, image 최대 높이 `42rem`으로 확장해 전체 구조를 먼저 보고 선택적으로 확대할 수 있게 했다.

비공개 전이 문제는 네 묶음이다. 첫째, decoder block의 attention과 FFN residual을 순서대로 전개해 어떤 상태가 다음 sublayer 입력인지 찾는다. 둘째, hidden·intermediate·Q/KV head 수로 attention과 gated FFN projection weights를 계산하고 embedding 예산과 분리한다. 셋째, Q/K vector의 공통 scale을 바꿔 raw score와 RMS-normalized score를 비교하되 learned gamma·epsilon의 경계를 설명한다. 넷째, 처음 보는 모델 config에서 position, norm, MLP, KV sharing, layer schedule, embedding tying을 추출해 가장 가까운 baseline과 새 결정을 판별한다. 문제 문장은 본문에 노출하지 않고 5개 preset, 수식, source viewer와 browser numeric oracle에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. 모델 목록이나 비교표로 시작하지 말고 한 decoder block의 실제 residual 실행 순서를 먼저 고정한다.
2. 각 모델은 이전 baseline, 바뀐 한두 결정, 실행·메모리 결과, 근거 경계 순서로 쓴다.
3. Attention과 FFN projection weight는 matrix shape에서 계산하고 bias·norm·embedding 포함 여부를 명시한다.
4. QK-Norm은 구현의 실제 norm 종류와 적용 축을 확인하며 RMSNorm을 cosine normalization으로 바꾸어 쓰지 않는다.
5. Tokenizer vocabulary와 padded embedding rows, tied와 untied output head를 구분한다.
6. Layer cadence는 이름만 쓰지 말고 local/global 또는 sliding/full layer가 어디서 실행되는지 설명한다.
7. 원 논문 그림은 one-at-a-time large viewer로 제공하고 기본 본문에 강제 horizontal scroll을 만들지 않는다.
8. Canonical paper는 leaf topic당 하나를 기본 종점으로 삼고, 현재 모델 이해에 직접 필요한 결정만 그 위에 쌓는다.
9. 기본값과 비기본값의 numeric oracle, 실제 KaTeX 내부 font, formula/document overflow, image load와 다음 경로 링크를 390·768·1440px에서 실행한다.

공식 근거는 OpenAI GPT-2 report, Meta Llama 3 release와 reference code, Qwen3 technical report·official config·implementation, Gemma 3 report와 official PyTorch config, OLMo 3 report와 official config, GLU Variants 원 논문으로 제한했다. 숫자는 소개 글의 요약이 아니라 matrix shape와 config에서 다시 계산했으며, RoPE가 임의 길이 일반화를 보증한다는 식의 범위 밖 주장은 제거했다. Claude 독립 검토는 사용자 지시대로 context-manager의 `ai-researcher`와 `ui-design-researcher`에 bounded read-only prompt로 각각 요청했으나 두 호출 모두 `POST /api/agents/.../chat`에서 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- Dense 단독 mobile·tablet·desktop과 numeric/source handoff 회귀 local/public 각각 `5/5`
- LLM overview와 Dense·KV/long-context·Sparse MoE·Hybrid/Linear 연결 회귀 local/public 각각 `17/17`
- 5개 core model chapter, 단일 decision Lab, article table 0, source figure tab 5개
- display equation 15개, FormulaNote 15개, raw LaTeX 노출 0
- 실제 KaTeX 내부 glyph 최소 `12px`, formula/document overflow와 console/page error 0
- 모바일 core chapter 높이 `1450px` 미만, tablet `1100px` 미만, desktop `900px` 미만
- 모바일·데스크톱 screenshot에서 Lab, model chapter, source viewer의 글자 절단·겹침·강제 내부 scroll 없음
- 공개 article과 `llm-architecture-dense-transformers-PJBea5Hk.js` chunk HTTP 200, `cm-blog.service` active

## 32. LLM 아키텍처 갤러리의 비교표 제거와 미지 모델 판독 계약

기존 갤러리는 이미 `Extracted fact sheet`와 큰 비교표를 기본 학습 경로에서 제거하고, GPT-2에서 Llama 3·Gemma 3·DeepSeek-V3·Kimi Linear로 이어지는 변화와 Dense → KV/Long Context → Sparse MoE → Hybrid/Linear의 네 갈래를 만들었다. 각 갈래에도 핵심 모델 다섯 개를 본문으로 설명하고 나머지 모델은 선택형 목록 아래로 숨겼다. 이번 감사에서 남은 결함은 모델 이름을 읽은 뒤 처음 보는 아키텍처를 스스로 판독하는 계산이 없다는 점, 원 논문 구조도 여러 장이 작은 3열 썸네일로 보인다는 점, 원격 이미지가 늦게 로드되면 확대 도구가 붙지 않는다는 점이었다.

- `ArchitectureFingerprintLab`을 추가해 서로 다른 네 축을 한 화면에서 계산한다. 기본 `B=2, L=48, H_q=32, H_{kv}=4, d_h=128, N=8192, bf16=2 bytes`에서 전체 KV cache는 `1,610,612,736 bytes = 1.50 GiB`, query/KV head 공유는 `8:1`이다. Context를 16,384로 바꾸면 `3.00 GiB`, KV head를 32로 바꾸면 `12.00 GiB`와 `1:1`, 절감률 `0%`가 된다.
- `local×4 → global×1` cadence를 48개 layer에 실제로 펼쳤다. Global layer index는 5, 10, ..., 45이고 local/global 수는 39/9, 실제 비율은 `4.33:1`이다. 표기상 4:1이더라도 48이 주기 5로 나누어떨어지지 않아 마지막 불완전 꼬리가 생긴다는 점을 숫자로 드러냈다. 50 layers에서는 40/10, 정확히 `4.00:1`이 된다.
- Routed expert `top-8/256 = 3.125%`와 항상 켜지는 shared expert를 분리했다. 이 비율만 보고 active parameter 수나 FLOPs를 추정하면 안 되며, expert별 width, shared path, attention과 router cost가 추가로 필요하다는 경계를 명시했다. Top-k를 16으로 바꾸면 routed fraction은 `6.250%`다.
- Depth mixer는 과거 layer output 6개 중 강하게 선택된 2개를 보여 준다. 이는 sequence 위치 사이를 섞는 token attention도 아니고 FFN expert를 고르는 MoE router도 아니다. 독자가 하나의 “sparsity”라는 말로 세 구조를 합치지 않도록 KV, layer cadence, expert routing, depth routing을 별도 fingerprint 축으로 유지했다.
- 각 갈래의 원본 구조도는 작은 세 장짜리 카드 grid를 없애고, 모델 tab에서 한 장을 선택해 크게 보는 viewer로 바꿨다. Desktop은 설명과 원본 구조도를 같은 시야에 두고, mobile은 전체 구조를 먼저 보여 준 뒤 선택적인 detail/fullscreen에서만 pan·zoom하게 했다. 기본 읽기 화면에 강제 horizontal scroll은 만들지 않았다.
- `ArticleVizTools`가 초기 DOM scan 뒤 로드된 원격 bitmap도 capture-phase `load` event로 다시 감지하게 했다. Fullscreen 자동 확대 직후에는 실제 scroll range의 중앙으로 이동해, mobile에서 확대했지만 구조도 중심이 화면 밖에 놓이던 결함도 고쳤다.
- 2026년 최신 예시는 모델명 나열로 추가하지 않고 공식 공개 구조의 변화만 연결했다. DeepSeek-V4의 HCA·CSA, Moonshot Attention Residuals의 depth attention, Gemma 4의 encoder-free multimodal과 MTP, Kimi Linear의 KDA/MLA hybrid는 각각 어느 fingerprint 축을 바꾸는지 설명하는 근거로만 사용했다.

비공개 전이 문제는 처음 보는 48-layer 모델 카드 하나를 주고 네 축으로 판독하게 한다. 첫째, batch·context·KV head·head dimension·dtype에서 KV bytes와 MHA 대비 절감률을 계산한다. 둘째, local/global cadence를 실제 layer index로 펼쳐 불완전 꼬리가 nominal ratio를 바꾸는지 확인한다. 셋째, top-k/total expert 비율과 shared expert를 분리해 active parameter 추정을 보류해야 할 조건을 찾는다. 넷째, depth residual mixing이 token attention과 expert routing 중 어느 것과도 같은 연산이 아닌 이유를 입력 축과 소비자 기준으로 설명한다. 문제 문장은 본문에 노출하지 않고 모든 답을 Lab control, 본문 경계와 browser oracle에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. 모델 목록이나 표를 먼저 만들지 말고 현재 목표 모델에서 구조 변화의 원인을 거슬러 Dense → KV/context → MoE → hybrid/depth mixing으로 연결한다.
2. 새 모델은 이름이 아니라 KV layout, layer cadence, routed FFN, depth mixer라는 독립 축으로 fingerprint한다.
3. KV cache는 batch, layer, KV head, context, head dimension, K와 V 두 장, bytes per element를 모두 곱해 byte와 GiB를 함께 검산한다.
4. 반복 주기는 nominal 비율만 쓰지 말고 실제 layer index를 펼쳐 incomplete tail을 계산한다.
5. `top-k / total experts`는 routed fraction일 뿐 active parameter ratio가 아니며 shared expert와 expert width가 없으면 추정을 중단한다.
6. Token attention, expert routing과 depth residual mixing은 무엇을 섞는지와 어느 축에서 선택하는지로 구분한다.
7. 원 논문 그림 여러 장을 작은 grid로 축소하지 말고 one-at-a-time large viewer와 선택적 fullscreen detail을 사용한다.
8. 기본값과 MHA/GQA/MQA, context 증가, layer tail 변화, top-k 변경, 그림 tab·fullscreen을 390·768·1440px에서 실행하고 formula size, image natural width, overflow와 browser error를 함께 검사한다.

공식 근거는 GQA 원 논문, DeepSeek-V3 기술 보고서, Moonshot Kimi Linear·Attention Residuals 공식 저장소, DeepSeek-V4 공식 모델 카드와 보고서, Google Gemma 4 공식 발표로 제한했다. 공개되지 않은 구현이나 vendor 주장으로 성능을 일반화하지 않았고, 각 최신 구조가 바꾸는 계산 축만 사용했다. Claude 독립 검토는 사용자 지시대로 context-manager gateway의 `claude-sonnet-4-6`에 bounded read-only prompt로 다시 요청했다. Gateway와 wrapper service는 active였지만 저장된 로그인 자격 증명이 거부되어 `/v1/chat/completions`가 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- overview와 네 갈래 mobile·tablet·desktop 회귀 local/public 각각 `17/17`
- KV bytes·sharing·saving, local/global layer count·tail ratio, routed expert fraction, depth mixer의 기본값과 non-default numeric oracle 확인
- 원본 viewer model tab 변경, remote image `naturalWidth > 0`, 확대 도구 노출, fullscreen open/close 확인
- overview display equation 4개, FormulaNote 4개, article table 0
- 390·768·1440px document/formula/Viz overflow 허용 기준 이내, console/page error 0
- 모바일·데스크톱 screenshot에서 fingerprint Lab과 대형 원본 viewer의 글자 절단·겹침·강제 내부 scroll 없음; fullscreen 확대는 중앙 정렬 뒤 선택적 pan만 허용
- 공개 article, `llm-architecture-gallery-BSFhzMMJ.js`와 네 갈래 chunk HTTP 200, `cm-blog.service` active

## 33. KV Cache·Long Context의 저장 계약과 가시 경로 분리

기존 KV·Long Context 글은 `128K` 같은 지원 길이, KV 저장량, 실제 attention 가시 범위를 한 흐름 안에서 구분하지 못했다. Cache 식에는 batch `B`가 빠져 있었고 prefill의 causal triangle과 decode의 한 행 읽기를 같은 복잡도 말로 다뤘다. GQA·MLA·sliding window도 모델 이름별 사실로 나열되어, 독자가 처음 보는 config에서 무엇을 계산해야 하는지 전이하기 어려웠다. DeepSeek-V2 설명에는 61층이라는 잘못된 수치가 들어가 있었으며 원 보고서 기준은 60층이다.

- 글의 소유 질문을 “context 상한이 아니라 과거 token마다 무엇을 저장하고 어느 layer가 어디를 직접 읽는가”로 바꿨다. Dense decoder의 Q/K/V 계약을 앞에서 받고 Sparse MoE의 attention/FFN 독립 축으로 넘긴다.
- Batch-aware cache를 `M_KV=2BLNH_kv d_h b`로 고쳤다. `2`는 K와 V 두 장, `B`는 동시에 살아 있는 sequence 수이며 둘 중 하나라도 빼면 배포 메모리 계산이 틀린다.
- Prefill은 full causal pair `L N(N+1)/2`, local pair `L[w(w+1)/2+(N-w)w]`로 분리했다. Decode는 새 query 한 행이 읽는 position-layer 수이므로 같은 `N^2` 표기를 재사용하지 않는다.
- `MlaCacheExplorer`는 MHA, 반사실적 8-KV-head GQA 기준선, DeepSeek-V2 MLA를 같은 60-layer·128-head·fp16 틀에서 비교한다. 32K, batch 2에서 MHA `240.00 GiB`, GQA `15.00 GiB`, MLA `4.22 GiB`이고 MLA의 token당 cache는 `(512+64)×60×2=69,120 bytes`다. GQA 기준선을 DeepSeek-V2의 실제 config라고 주장하지 않는다.
- `LongContextWindowLab`은 Gemma 3 27B형 52 local·10 global·16 KV heads·window 1024를 펼친다. 32K, batch 2에서 full cache `31.00 GiB`, mixed cache `5.81 GiB`, 절감률 `81.25%`; prefill pair-layer는 `33.29B→7.09B`, decode read positions는 `2,031,616→380,928`이다.
- 24-token strip은 `direct visible`과 `inherited reachable`을 다른 상태로 그린다. Layer 7이 직접 읽는 token은 4개여도 layer 6의 global output을 통해 계산 그래프상 prefix 24개에 도달할 수 있다. 이 도달 가능성은 retrieval 정확도나 먼 정보의 보존을 보증하지 않는다.
- 최소 계보는 GQA 원 논문, Mistral 7B의 GQA+SWA, DeepSeek-V2의 joint KV latent와 decoupled RoPE, Gemma 3의 5 local:1 global까지만 보인다. 더 오래된 sequence model 역사나 최신 모델 목록은 기본 경로에 넣지 않았다.

비공개 전이 문제는 두 모델 config를 준다. 첫 모델에서는 full/mixed KV bytes, prefill pair-layer, decode read-position을 각각 계산하고, direct visibility와 inherited reachability가 retrieval quality와 다른 이유를 설명한다. 둘째 모델에서는 같은 layer/head 폭에서 MHA·GQA·MLA 저장량을 계산하고, GQA의 head sharing과 MLA의 latent coordinate compression이 서로 다른 축임을 판별한다. 마지막으로 content up projection을 inference matrix에 흡수해도 position-sensitive RoPE key가 cache에 남는 이유를 실행 순서로 설명한다. 문제 문장은 본문에 노출하지 않고 두 Lab, 수식, 네 개 계보 chapter와 numeric oracle에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. `128K 지원`을 저장량, 직접 가시 범위, 계산 그래프 도달성, retrieval 정확도로 분해하고 같은 의미로 쓰지 않는다.
2. KV bytes는 `B, L, N, H_kv, d_h, K/V 두 장, bytes/element`를 모두 표시한 뒤 byte와 GiB를 함께 검산한다.
3. Prefill의 causal triangle과 decode의 한-row cache read를 별도 식과 별도 설명으로 쓴다.
4. GQA는 KV head 수를 줄이고 MLA는 저장 좌표 폭을 바꾼다. 같은 절감률이 나와도 같은 연산이라고 말하지 않는다.
5. Local/global cadence는 nominal ratio만 쓰지 말고 실제 layer 수와 마지막 tail을 펼친다.
6. Direct visible token과 inherited reachable token을 별도 색·legend·numeric counter로 표시하고, reachability를 품질 보증으로 일반화하지 않는다.
7. 모델 계보는 각 결정의 첫 canonical 근거만 유지하고, 최신 모델 목록 대신 현재 구조를 판독하는 계산 축을 남긴다.
8. 기본값과 batch 1, context 128K, window 4096, global 직전·해당·직후 depth를 실행하며 390·768·1440px의 KaTeX font, formula/document overflow, figure load와 handoff를 검사한다.

공식 근거는 Ainslie et al. GQA, Mistral 7B, DeepSeek-V2 원 보고서, Gemma 3 Technical Report로 제한했다. DeepSeek-V2 PDF의 architecture 표와 MLA 식을 다시 읽어 60 layers, 128 heads, `d_h=128`, `d_c=512`, `d_r=64`를 확정했다. 저자 보고의 93.3% cache 감소와 5.76배 throughput은 해당 배포 비교의 결과로만 경계 지었다. Claude 독립 검토는 사용자 지시대로 context-manager의 `ai-researcher`와 `ui-design-researcher`에 새 bounded read-only 세션으로 다시 요청했으나 두 호출 모두 `POST /api/agents/.../chat`에서 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, `git diff --check`, production build 통과; 기존 900 kB 초과 chunk 경고만 유지
- KV·Long Context 단독 mobile·tablet·desktop, numeric/source handoff 회귀 local/public 각각 `6/6`
- LLM overview와 Dense·KV/Long Context·Sparse MoE·Hybrid/Linear 연결 회귀 local/public 각각 `17/17`
- display equation 11개, FormulaNote 11개, article table 0, core lineage chapter 4개
- 390·768·1440px 실제 KaTeX 내부 glyph 최소 `12px`, formula/document overflow와 console/page error 0
- MHA/GQA/MLA 및 local/global의 기본값·비기본값 numeric oracle, direct/reachable depth 전환 확인
- 모바일·데스크톱 screenshot에서 Lab, token strip, chapter의 글자 절단·겹침·강제 내부 scroll 없음
- 공개 article과 `llm-architecture-kv-long-context-BqY6KGjE.js` chunk HTTP 200, `cm-blog.service` active

## 34. Sparse MoE의 expert 장부·capacity·GPU 통신 실행 계약

기존 Sparse MoE 글은 total/active parameter 수치와 최신 모델 카탈로그를 먼저 보여 주었지만, 독자가 active expert bank, model-wide active, FLOPs, latency와 network byte를 분리해 계산할 수 없었다. Top-k load 비율은 token 수 `T`로 나누어 합이 `k`가 되는 식이었고, Switch의 Top-1 auxiliary loss와 일반 Top-k 설명도 섞여 있었다. Capacity overflow, no-drop straggler, routing-only bias와 expert-parallel 왕복 traffic은 설명 문장만 있어 새 config에 전이할 수 없었다.

- Dense decoder의 두 번째 residual에서 FFN 자리만 MoE로 교체되는 식부터 고정했다. Attention과 residual은 항상 실행되는 경로이므로 sparse FFN의 active ratio를 block 전체 비율로 옮기지 않는다.
- Gated expert 하나를 `P_e=dm+dm+md=3dm`으로 복원하고 layer bank `(E+S)P_e`, token당 expert path `(k+S)P_e`를 분리했다. Bias, router, norm, embedding과 attention은 이 expert-only 장부에서 제외한다.
- DeepSeek-V3형 `d=7168,m=2048,E=256,k=8,S=1,58 MoE layers`에서는 expert 하나 `44.04M`, layer bank `11.32B`, layer active path `396.36M`, bank active ratio `3.50%`, all-layer bank `656.46B`, active expert path `22.99B`를 재구성했다. 보고 active `37B`와의 `14.01B` 잔차는 always-on path의 존재를 감지하지만 정확한 미공개 breakdown으로 과장하지 않는다.
- Qwen3-235B-A22B형 `d=4096,m=1536,E=128,k=8,S=0,94 layers`에서는 expert 하나 `18.87M`, layer bank `2.42B`, active path `150.99M`, bank ratio `6.25%`, all-layer bank `227.10B`, active expert path `14.19B`를 계산했다. Model-wide `22/235=9.36%`와 expert-bank `8/128=6.25%`를 같은 비율로 쓰지 않는다.
- Top-k capacity를 `ceil(CF Tk/E)`로 일반화하되 Switch 원식은 Top-1임을 명시했다. General Top-k load share는 `Tk`로 정규화해 합을 1로 만들고, Switch auxiliary loss의 `f_i,P_i`는 Top-1 정의로 유지했다.
- 16 token, Top-2, 4 expert의 collapsed load `[16,10,4,2]`에서 capacity factor 1.0이면 capacity 8, overflow 10, assignment drop rate `31.25%`다. 같은 routing을 no-drop으로 실행하면 32 assignment는 모두 보존되지만 max/ideal load가 `2.00x`여서 straggler가 step latency를 제한한다.
- DeepSeek-V3의 sigmoid affinity와 expert bias를 분리했다. Bias `b_i`는 Top-k 선택에만 더하고, 선택된 expert output을 섞는 weight는 원 affinity `s_i`로 계산한다. `auxiliary-loss-free`가 모든 balance loss 제거를 뜻하지 않으며 작은 sequence-wise auxiliary loss가 남는 경계도 적었다.
- Expert parallel 왕복 payload 하한을 `2Tkd b`로 계산했다. `T=4096,k=8,d=7168,b=2`이면 MoE layer당 `896 MiB`이며 metadata, padding, collective protocol, topology와 overlap은 제외한다.
- 제품 목록 중심 본문을 Switch → Mixtral → DeepSeekMoE → DeepSeek-V3 → Qwen3의 다섯 전환으로 바꿨다. 1990년대 원형 역사는 기본 경로에서 숨기고, capacity, decoder Top-2, fine-grained/shared isolation, routing bias/no-drop, no-shared 분기만 남겼다.
- Parameter ledger와 routing/capacity/dispatch Lab을 모바일에서도 각각 2열 metric과 4열 token grid로 압축했다. 네 expert 색은 violet, blue, emerald, neutral로 분리하고 overflow만 rose로 유지해 경로와 실패를 구분했다.

비공개 전이 문제는 세 묶음이다. 첫째, 처음 보는 MoE config의 matrix shape에서 expert 하나, layer bank, token당 active bank와 all-layer bank를 계산하고 model-wide active와의 잔차를 해석한다. 둘째, Top-k assignment load에서 capacity overflow/drop과 no-drop straggler를 각각 계산하고 서로 다른 실행 정책임을 설명한다. 셋째, hidden dispatch와 return byte 하한을 구한 뒤 routing bias, node limit, placement와 network overlap이 latency에 미치는 경계를 판별한다. 문제 문장은 본문에 노출하지 않고 두 Lab, 12개 수식, 다섯 causal chapter와 browser oracle에 일대일 대응시켰다.

4B/9B 작성 모델에는 다음 계약을 준다.

1. 최신 모델 이름이나 total/active 표기로 시작하지 말고 dense block에서 sparse해진 정확한 sublayer를 먼저 표시한다.
2. Expert parameter는 matrix shape에서 계산하고 expert bank, token path, always-on path를 별도 장부로 둔다.
3. Active parameter, FLOPs, memory traffic, communication byte와 latency를 같은 값처럼 쓰지 않는다.
4. Top-k load는 assignment 총수 `Tk`로 정규화하고 Switch의 Top-1 loss와 섞지 않는다.
5. Capacity/drop training과 no-drop/straggler runtime을 별도 정책으로 실행한다.
6. Routing bias가 expert 선택과 output mixture 중 어디에 쓰이는지 원 수식으로 확인한다.
7. Expert parallel은 dispatch-return byte 하한과 topology, node limit, padding, overlap 경계를 함께 쓴다.
8. 기본값 외 Qwen preset, balanced/collapsed load, capacity factor 1.50과 no-drop을 390·768·1440px에서 실행하고 KaTeX font, overflow, image와 handoff를 검사한다.

공식 근거는 Switch Transformer, Mixtral of Experts, DeepSeekMoE, DeepSeek-V3, Qwen3 원 보고서와 DeepSeek/Qwen official config로 제한했다. 저자 측 성능 수치를 보편 법칙으로 옮기지 않고 architecture decision, 공개 dimension과 실행 경계만 사용했다. Claude 독립 검토는 사용자 지시대로 context-manager의 `ai-researcher`에 fresh bounded read-only prompt로 재요청했으나 `POST /api/agents/ai-researcher/chat`에서 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았다.

검증 결과는 다음과 같다.

- affected ESLint, production build 통과; repository-wide lint는 이번 변경과 무관한 기존 674건 때문에 실패
- Sparse MoE 단독 mobile·tablet·desktop, numeric, routing, source handoff 회귀 local/public 각각 `6/6`
- LLM overview와 Dense·KV/long-context·Sparse MoE·Hybrid/Linear 연결 회귀 local/public 각각 `17/17`
- DeepSeek/Qwen parameter ledger와 capacity 1.00/1.50, balanced/collapsed, no-drop, 896 MiB의 모든 numeric oracle 확인
- display equation 12개, FormulaNote 12개, article table 0, core causal chapter 5개
- 390·768·1440px document/formula/Viz overflow 0, console/page error 0
- 공개 390px 최소 KaTeX 내부 font `13.23px`, formula clipping 0
- 모바일·데스크톱 screenshot에서 parameter ledger와 routing grid의 글자 절단, 중첩 card, 강제 내부 scroll 없음
- 공개 article과 `llm-architecture-sparse-moe-CeC-A7Dr.js` chunk HTTP 200, `cm-blog.service` active
