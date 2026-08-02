import FormulaNote from '@/components/ui/formula-note';
import MathFormula from '@/components/ui/math';
import { CitationBlock } from '@/components/ui/citation';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  AutoregressiveTraceLab,
  DeepAREvidenceLab,
  GlobalSeriesLab,
  ScaleSamplingLab,
} from './paper-deepar-2017/viz/DeepARSourceLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <MathFormula display className="my-0 text-[12px] sm:text-[15px]">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function PaperDeepAR2017Article() {
  return (
    <>
      <section id="global-related-series" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">상품마다 모델을 만들지 않고 관계 있는 시계열에서 하나의 규칙을 배운다</h2>
        <QuestionLead
          question="판매 이력이 두 주뿐인 신상품은 자기 데이터만으로 다음 12주 분포를 어떻게 배울 수 있을까?"
          answer="혼자서는 어렵다. DeepAR는 수많은 관련 상품의 시계열 window를 하나의 recurrent network와 likelihood head로 학습한다. 신상품은 다른 상품에서 배운 갱신 규칙을 빌리되, 자기 history·상품 feature·달력 covariate로 다른 hidden state와 예측 분포를 만든다."
        />
        <ConceptPrimer items={[
          { term: 'Local model', meaning: '시계열 하나마다 ARIMA나 별도 network를 fit하는 방식이다.', why: '관측이 짧은 item은 추정할 정보가 부족하고 item 수만큼 model 관리 비용이 늘어난다.' },
          { term: 'Global model', meaning: '관련 시계열의 window를 함께 보며 하나의 parameter 집합을 학습한다.', why: '반복되는 주기와 covariate 반응을 공유하면서 item별 조건은 입력과 state로 남길 수 있다.' },
          { term: 'Probabilistic forecast', meaning: '미래 값 하나가 아니라 가능한 미래의 조건부 분포를 낸다.', why: '발주·용량·위험 결정은 평균뿐 아니라 부족·초과 비용과 quantile이 필요하다.' },
          { term: 'Conditioning range', meaning: '예측 시점에 실제로 관측 가능한 target history 구간이다.', why: '막연한 과거·미래 대신 정보 가용성 경계를 정확히 고정한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            2017년 DeepAR가 세운 기준점은 “LSTM도 시계열에 쓸 수 있다”가 아니다. 핵심은
            <strong> 여러 관련 시계열을 하나의 autoregressive 확률 모델로 학습</strong>하고, 각 item의 다음 값 분포를
            이전 target과 known covariate에 조건화한 것이다. 전통적인 local model이 item 하나의 짧은 history 안에서만
            parameter를 추정한다면, global model의 parameter <code>Θ</code>는 모든 training window의 gradient를 함께 받는다.
          </p>
          <p>
            그렇다고 상품 정체성이 지워지지는 않는다. Category나 item identity embedding, age, week-of-year,
            promotion처럼 prediction range에도 미리 알 수 있는 feature, 직전 target과 hidden state가 item별 조건이 된다.
            같은 <code>Θ</code>를 통과해도 입력과 state가 다르므로 likelihood parameter도 달라진다. 아래에서 파란 영역은
            공유되는 계산 규칙, 왼쪽 history와 state는 item별 evidence다.
          </p>
        </div>
        <GlobalSeriesLab />
        <Misconception>
          Global은 universal과 다르다. 논문은 related time series가 계절성·상품군·판매 행동을 어느 정도 공유한다는 전제에서
          정보를 모은다. 서로 관계없는 domain을 무조건 한 model에 섞으면 transfer가 아니라 interference가 될 수 있다.
        </Misconception>
      </section>

      <section id="joint-future-samples" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">관측 구간은 state를 만들고 예측 구간은 자기 sample을 다시 먹는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 시점의 network 입력은 이전 hidden state, 직전 target, 현재 covariate다. LSTM 내부 gate 계산은{' '}
            <InternalLink slug="lstm-timeseries" learningPathId="ai-timeseries-forecasting">LSTM 시계열 글</InternalLink>
            이 소유한다. 여기서 중요한 것은 이 state update가 어떤 확률 분포를 만들고, 실제 예측에서 무엇을 다음 입력으로
            되돌리는가다.
          </p>
          <p>
            Conditioning range에서는 target이 관측되어 있으므로 차례로 network에 넣어 forecast origin 직전 state를 만든다.
            Prediction range 첫 시점에서 likelihood parameter를 계산하고 값 하나를 sample한다. 그 sample을 다음 시점의
            직전 target으로 넣고 다시 sample한다. Horizon 끝까지 가면 한 개의 미래 path가 된다. 이 전체 과정을 반복해야
            horizon 여러 시점이 함께 움직이는 joint distribution을 얻는다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{h_{i,t}}_{\text{현재 item state}}
&=\underbrace{h\!\left(h_{i,t-1},z_{i,t-1},x_{i,t};\Theta\right)}_{\text{이전 state·직전 target·feature로 공유 규칙을 갱신}}
\end{aligned}`}
          meaning="왜 이전 target을 다시 넣나: 방금 일어난 값이 다음 state와 다음 분포를 바꾸는 autoregressive 의존성을 만들기 위해서다. 같은 Θ를 쓰더라도 item마다 history와 feature가 달라 서로 다른 state가 만들어진다."
          symbols={[
            [String.raw`i`, '상품·센서처럼 하나의 시계열을 가리키는 item index'],
            [String.raw`h_{i,t}`, '시점 t까지 item history를 압축한 recurrent hidden state'],
            [String.raw`z_{i,t-1}`, '직전 시점에 관측했거나 prediction에서 sample한 target'],
            [String.raw`x_{i,t}`, '시점 t에 사용할 수 있는 item·calendar·promotion covariate'],
            [String.raw`\Theta`, '모든 관련 시계열이 공유하는 RNN과 likelihood-head parameters'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{q_{i,t}}_{\text{t 시점의 조건부 likelihood}}
&=\ell\!\left(z_{i,t}\mid\theta(h_{i,t})\right)\\
\underbrace{Q_i}_{\text{horizon 전체의 미래 분포}}
&=Q_\Theta(z_{i,t_0:T}\mid z_{i,<t_0},x_{i,1:T})\\
Q_i&=\prod_{t=t_0}^{T}q_{i,t}
\end{aligned}`}
          meaning="왜 조건부 likelihood를 곱하나: 각 step은 과거 관측 또는 이전 sample에 조건화되어 있고, 이 chain을 순서대로 전개하면 horizon 전체의 joint distribution이 되기 때문이다. 식은 step별 factorization이지만 이전 sample이 다음 state로 들어가므로 sample path의 시간 의존성이 사라지는 것은 아니다."
          symbols={[
            [String.raw`t_0`, 'Conditioning range와 prediction range가 갈리는 forecast origin'],
            [String.raw`z_{i,1:t_0-1}`, 'Forecast origin 전에 실제로 관측한 target history'],
            [String.raw`x_{i,1:T}`, 'Conditioning·prediction range 전체에서 사용 가능한 covariates'],
            [String.raw`q_{i,t}`, '현재 hidden state가 만든 한 시점의 conditional likelihood'],
            [String.raw`Q_i`, 'Item i의 forecast horizon 전체에 대한 joint predictive distribution'],
            [String.raw`\ell(z\mid\theta)`, 'State가 만든 parameter를 갖는 한 시점의 확률분포'],
            [String.raw`\prod`, 'Forecast origin부터 horizon 끝까지 conditional factors를 순서대로 곱하는 연산'],
          ]}
        />
        <AutoregressiveTraceLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            학습 때는 prediction range도 실제 과거 안에서 window를 잡으므로 정답 target을 알고 있다. DeepAR는 정답
            <code>z</code>를 넣어 state를 갱신하고 그 정답의 log likelihood를 직접 최대화한다. 이 때문에 학습에서는
            정답을 보고, 실제 예측에서는 자기 sample을 본다는 간극이 생긴다. 저자들은 scheduled sampling 변형도 시험했지만
            유의한 정확도 개선을 보지 못했고 convergence만 느려졌다고 보고했다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{g_{i,t}}_{\text{한 관측의 학습 점수}}
&=\log\ell\!\left(z_{i,t}\mid\theta(h_{i,t})\right)\\
\underbrace{\mathcal L(\Theta)}_{\text{모든 item·시점의 점수}}
&=\sum_{i=1}^{N}\sum_{t=t_0}^{T}g_{i,t}
\end{aligned}`}
          meaning="왜 mean error 하나가 아니라 log likelihood를 높이나: network가 point forecast뿐 아니라 분포의 spread와 shape까지 함께 맞추게 하기 위해서다. Hidden state는 관측 입력의 deterministic function이므로 이 논문 설정에서는 별도 latent-state inference 없이 stochastic gradient descent로 직접 최적화할 수 있다."
          symbols={[
            [String.raw`\mathcal L(\Theta)`, '최대화하는 전체 log-likelihood objective'],
            [String.raw`N`, '관련 시계열 item 수'],
            [String.raw`z_{i,t}`, '학습 window 안에서 관측된 실제 target'],
            [String.raw`g_{i,t}`, '한 item·한 시점의 observed-target log likelihood'],
            [String.raw`\theta(h_{i,t})`, 'Hidden state에서 계산한 likelihood parameters'],
          ]}
        />
      </section>

      <section id="likelihood-support" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">출력 분포는 target이 가질 수 있는 값과 변동 방식을 따라야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Likelihood는 마지막 장식이 아니라 model이 무엇을 오류로 보는지 정한다. 전력 사용량처럼 실수 target에는
            Gaussian likelihood를 사용해 mean과 standard deviation을 낸다. 판매 개수처럼 0 이상의 정수이고 평균보다 분산이
            큰 bursty count에는 negative binomial을 사용한다. 두 분포 모두 필요한 parameter를 hidden state의 affine layer와
            softplus로 계산해 scale이나 shape가 양수가 되게 한다.
          </p>
          <p>
            Negative binomial의 중요한 성질은 평균이 커질수록 분산이 선형보다 빠르게 커질 수 있다는 점이다.
            Poisson처럼 variance를 mean과 같게 고정하지 않고 <code>α</code>가 extra variation을 조절한다. 그래서 평균 판매량은
            같지만 행사 주간에 크게 튀는 상품을 더 넓은 분포로 표현할 수 있다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{v_{\mathrm{base}}}_{\text{평균 기반 변동}}&=\mu\\
\underbrace{v_{\mathrm{burst}}}_{\text{추가 변동}}&=\mu^2\alpha\\
\underbrace{\operatorname{Var}[z]}_{\text{count 예측의 분산}}
&=v_{\mathrm{base}}+v_{\mathrm{burst}}
\end{aligned}`}
          meaning="왜 μ²α 항을 더하나: 평균이 큰 상품에서 관측되는 과산포를 Poisson의 Var[z]=μ보다 넓게 표현하기 위해서다. α가 0에 가까우면 기본 변동에 가까워지고, α가 커질수록 같은 mean에서도 더 넓은 tail을 허용한다."
          symbols={[
            [String.raw`\mu`, 'Negative-binomial likelihood의 조건부 평균'],
            [String.raw`\alpha`, '평균 대비 추가 분산을 조절하는 양의 shape parameter'],
            [String.raw`v_{\mathrm{base}},v_{\mathrm{burst}}`, 'Poisson 수준의 기본 변동과 burstiness가 추가한 변동'],
            [String.raw`\operatorname{Var}[z]`, '다음 count target의 조건부 분산'],
          ]}
        />
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['Real-valued target', 'Gaussian', 'μ는 affine output, σ는 softplus output', '음수가 가능한 연속값과 대칭적인 조건부 noise가 출발점일 때'],
            ['Positive count', 'Negative binomial', 'μ와 α 모두 softplus output', '0 이상의 정수이고 intermittent·bursty·over-dispersed한 수요일 때'],
            ['다른 support', '별도 likelihood', 'Sampling과 log likelihood gradient가 가능해야 함', '논문은 beta·Bernoulli·mixture가 가능하다고 설명하지만 실험으로 검증하지는 않았다.'],
          ].map(([target, likelihood, parameters, boundary]) => (
            <div key={target} className="grid gap-2 py-4 sm:grid-cols-[8rem_8rem_minmax(0,1fr)] sm:gap-4">
              <p className="text-sm font-black">{target}</p>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300">{likelihood}</p>
              <div>
                <p className="text-xs font-semibold">{parameters}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{boundary}</p>
              </div>
            </div>
          ))}
        </div>
        <Misconception>
          Distribution 이름을 count에 맞췄다고 calibration이 자동 보장되지는 않는다. Covariate availability, regime shift,
          censoring과 scale heuristic이 틀리면 likelihood family가 맞아도 quantile coverage는 어긋날 수 있다.
        </Misconception>
      </section>

      <section id="power-law-scale" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">작은 상품과 큰 상품을 같은 network에 넣으려면 scale과 학습 노출을 따로 고친다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            수십만 상품의 평균 판매량은 보통 균일하지 않다. 긴 tail의 소수 상품이 수천 개를 팔고 다수 상품은 거의 팔리지
            않는다. Raw target을 그대로 넣으면 LSTM nonlinearity의 제한된 작동 범위 안에서 1과 2,000을 동시에 다루고,
            마지막 출력에서 다시 원래 단위를 복원해야 한다.
          </p>
          <p>
            DeepAR는 item별 scale <code>ν</code>를 conditioning target 평균에 1을 더해 계산한다. Autoregressive input은
            <code>ν</code>로 나누고 negative-binomial mean은 <code>ν</code>를 곱해 원래 단위로 돌린다. Shape는
            <code>√ν</code>로 나눈다. 별도로 training window를 균일하게 뽑지 않고 <code>ν</code>에 비례해 골라
            high-velocity item이 너무 드물게 학습되는 것을 막는다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\nu_i}_{\text{item scale}}
&=1+\frac{1}{t_0}\sum_{t=1}^{t_0}\underbrace{z_{i,t}}_{\text{conditioning target}}\\
\underbrace{z'_{i,t}}_{\text{network에 넣는 값}}
&=\underbrace{z_{i,t}/\nu_i}_{\text{item 크기를 나눠 작동 범위를 맞춤}}\\
\underbrace{\mu_{i,t}}_{\text{원래 단위의 count 평균}}
&=\underbrace{\nu_i\,\operatorname{softplus}(o_{\mu,i,t})}_{\text{양의 raw output을 item scale로 복원}}\\
\underbrace{\alpha_{i,t}}_{\text{count shape}}
&=\underbrace{\operatorname{softplus}(o_{\alpha,i,t})/\sqrt{\nu_i}}_{\text{scale에 맞춰 추가 분산을 조정}}
\end{aligned}`}
          meaning="왜 input과 output을 반대 방향으로 변환하나: network 내부에서는 item 크기를 비슷하게 만들되 최종 likelihood는 실제 판매 단위를 설명해야 하기 때문이다. 왜 1을 더하나: 전부 0인 짧은 history에서도 0으로 나누지 않게 한다. 이 평균 scale은 논문이 효과를 본 heuristic이지 결측·급격한 regime 변화에도 항상 맞는 정답은 아니다."
          symbols={[
            [String.raw`\nu_i`, 'Item i의 conditioning-range 평균에서 만든 scale factor'],
            [String.raw`z'_{i,t}`, 'LSTM autoregressive input으로 들어가는 normalized target'],
            [String.raw`o_{\mu,i,t},o_{\alpha,i,t}`, 'Likelihood head가 내는 scale 이전 raw outputs'],
            [String.raw`\operatorname{softplus}`, '출력 parameter를 0보다 크게 만드는 smooth activation'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{Z_\nu}_{\text{scale 정규화 상수}}&=\sum_j\nu_j\\
\underbrace{P(i)}_{\text{item i의 선택 확률}}
&=\frac{\underbrace{\nu_i}_{\text{item scale}}}{Z_\nu}
\end{aligned}`}
          meaning="왜 uniform sampling을 바꾸나: power-law dataset에서 큰 상품은 수가 적어 균일 추출 시 거의 보지 못하고 underfit될 수 있기 때문이다. 그러나 이는 큰 상품의 정확도를 더 중요하게 두는 학습 노출 정책이다. 모든 item을 공평하게 평가한다는 뜻도, 원래 데이터 분포의 unbiased sample이라는 뜻도 아니다."
          symbols={[
            [String.raw`P(i)`, '다음 training instance가 item i에서 올 확률'],
            [String.raw`Z_\nu`, '모든 item scale을 합친 sampling normalization constant'],
            [String.raw`\sum_j\nu_j`, '모든 item scale의 합으로 probability를 정규화하는 항'],
            [String.raw`j`, 'Training pool 안의 모든 item index'],
          ]}
        />
        <ScaleSamplingLab />
      </section>

      <section id="source-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">성능 표보다 중요한 것은 horizon 합계의 불확실성을 어떻게 보존했는가다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Table 1의 retail 결과는 가장 강한 기존 방법의 risk를 1.00으로 둔 상대값이다. DeepAR의 전체 평균은 parts 0.94,
            ec-sub 0.77, ec 0.85였다. Power-law가 있는 ec 계열에서는 scale correction과 velocity sampling을 뺀
            <code>rnn-negbin</code>이 더 나빴고, power-law가 두드러지지 않은 parts에서는 둘이 비슷했다. 이는 모든 dataset에서
            일정한 개선율을 보였다는 증거가 아니라, 논문이 제안한 scale mechanism이 필요한 조건을 보여 주는 ablation이다.
          </p>
          <p>
            공개 electricity와 traffic에서는 Table 2의 ND·RMSE가 MatFact보다 낮았다. 다만 rolling prediction window마다
            retrain한 결과가 아니다. 첫 prediction window 전 data로 한 번 학습한 model을 여러 window에 재사용했다.
            Supplement는 decoder에서 200개 sample을 뽑았다고 기록한다.
          </p>
        </div>
        <DeepAREvidenceLab />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{Z_i^{(m)}(L,S)}_{\text{m번째 span 합}}
&=\sum_{t=t_0+L}^{t_0+L+S-1}\tilde z_{i,t}^{(m)}\\
\underbrace{\widehat Z_i^\rho(L,S)}_{\text{span 합의 분위수}}
&=\operatorname{Quantile}_\rho\!\left(\{Z_i^{(m)}\}_{m=1}^{M}\right)
\end{aligned}`}
          meaning="왜 각 시점의 0.9-quantile을 더하면 안 되나: 시점별 marginal quantile만 더하면 같은 path 안에서 함께 높아지거나 낮아지는 시간 상관을 잃기 때문이다. 각 autoregressive path를 horizon span 안에서 먼저 합산하고, 그 합계 sample들의 empirical quantile을 구해야 재고처럼 누적량을 결정할 수 있다."
          symbols={[
            [String.raw`\tilde z_{i,t}^{(m)}`, 'm번째 autoregressive sample path의 시점 t 값'],
            [String.raw`L`, 'Forecast origin 뒤에서 span이 시작하는 lead time'],
            [String.raw`S`, '합산하는 prediction span 길이. 끝점은 포함하지 않아 정확히 S개를 더한다.'],
            [String.raw`M`, 'Monte Carlo sample path 수. 논문 실험은 200개를 사용했다.'],
            [String.raw`\rho`, '0.5 또는 0.9 같은 목표 quantile level'],
          ]}
        />
        <CitationBlock source="Salinas et al. · DeepAR · Tables 1–3 and Figures 4–5" citeKey={1} href="https://arxiv.org/abs/1704.04110">
          Retail relative risk, electricity·traffic point metrics, 200 decoder samples, temporal-correlation shuffling ablation과
          dataset별 runtime·window 설정은 서로 다른 범위의 근거다. 이 글은 이를 하나의 보편 성능 수치로 합치지 않는다.
        </CitationBlock>
      </section>

      <section id="limits-current-handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">DeepAR는 확률 예측의 첫 바닥이고 운영 검증의 끝은 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            논문은 training window의 시작을 실제 item 등장 전으로 옮기고 target을 0으로 padding해 “new” series 행동을
            학습했다. 그러나 별도의 cold-start benchmark로 상품군 밖 신상품 성능을 분리해 검증하지는 않았다. “Little or no
            history” 가능성과 production cold-start 보장은 구분해야 한다.
          </p>
          <p>
            더 중요한 경계는 missing observation이다. Out-of-stock인 주의 판매량은 실제 수요가 0이라는 뜻이 아니다.
            Appendix는 결측값을 현재 predictive distribution sample로 대신하고 그 시점의 likelihood term을 제외하는 방법을
            제안한다. 동시에 비교 가능한 adjusted metric이 어렵다는 이유로 <strong>실험 결과를 생략했다</strong>. 따라서 이
            제안만으로 결측이 많은 발주 시스템을 release할 수 없다.
          </p>
          <p>
            Scale도 평균 heuristic이다. 결측이 많거나 한 item 내부 variance가 매우 크면 적절한 <code>ν</code> 선택 자체가
            어렵다고 원문이 인정한다. Hyperparameter는 forecast start 이전 data를 90/10으로 나눠 고르고 learning rate는
            dataset별 수동 조정했다. Supplement는 non-overlapping time interval에서도 검증하는 절차가 더 낫다고 적는다.
            최신 pretrained model과 비교하려면 이 오래된 단일 split을 그대로 답습하지 말고{' '}
            <InternalLink slug="time-series-forecasting-evaluation" learningPathId="ai-timeseries-forecasting">
              현재 시계열 예측 검증 글
            </InternalLink>
            의 availability contract와 rolling-origin backtest로 올라가야 한다.
          </p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['Source가 증명한 것', '관련 시계열을 공유 RNN·likelihood로 학습하고 scale correction, weighted sampling과 joint sample path로 2017년 benchmark에서 경쟁한 결과.'],
            ['Source가 제안만 한 것', '결측 target을 conditional sample로 대체하고 likelihood에서 제외하는 처리. 이 설정의 실험 결과는 생략됐다.'],
            ['현재 검증이 추가할 것', 'Available-at timestamp, out-of-stock censoring slice, rolling origin, seasonal baseline, quantile coverage, runtime과 fallback release gate.'],
          ].map(([label, body]) => (
            <div key={label} className="grid gap-2 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-5">
              <p className="text-sm font-black">{label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <CapabilityCheck items={[
          'Global parameter와 item-specific history·feature·hidden state를 구분한다.',
          'Conditioning range의 관측 feedback과 prediction range의 sampled feedback을 추적한다.',
          '실수 Gaussian과 count negative-binomial likelihood의 support를 구분한다.',
          'νᵢ가 input, likelihood parameter와 training-window exposure에 각각 미치는 영향을 설명한다.',
          'Horizon 합계 quantile을 독립 marginal이 아니라 correlated sample path에서 계산한다.',
          '논문이 검증한 결과와 cold-start·missing-data의 미검증 release claim을 분리한다.',
        ]} />
        <StopRule>
          Global sharing, autoregressive likelihood, item scale, velocity sampling, joint sample path와 source limitation을 설명할 수 있으면
          DeepAR 아래의 모든 recurrent forecasting 논문을 더 파지 않는다. ARIMA·LSTM 계산이 막힐 때만 해당 기반 글로 내려가고,
          실제 선택은 현재 rolling backtest와 pretrained candidate 비교로 올라간다.
        </StopRule>
        <SourceNotes sources={[
          { label: 'Salinas et al. · DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks', href: 'https://arxiv.org/abs/1704.04110', note: 'Figure 2, Equations 1–2, scale handling, Tables 1–3, Figures 4–5와 missing-observation appendix의 1차 원문.' },
          { label: 'Amazon Science · DeepAR paper page', href: 'https://www.amazon.science/publications/deepar-probabilistic-forecasting-with-autoregressive-recurrent-networks', note: '연구팀의 publication record와 paper scope.' },
          { label: 'GluonTS · DeepAR estimator', href: 'https://ts.gluon.ai/stable/api/gluonts/gluonts.mx.model.deepar.html', note: '후속 공개 구현의 estimator interface. 논문 수치의 독립 재현 증거로 간주하지 않는다.' },
        ]} />
      </section>
    </>
  );
}
