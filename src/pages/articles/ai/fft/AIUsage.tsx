import ExplainedFormula from "@/components/ui/explained-formula";
import FFTApplicationDecisionViz from "./viz/FFTApplicationDecisionViz";

export default function AIUsage() {
  return (
    <section id="ai-usage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">AI에서 FFT는 feature, exact operator와 fixed mixer로 서로 다르게 쓰인다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          “주파수 domain을 쓴다”는 말만으로는 model의 inductive bias나 비용을 알 수
          없다. Audio preprocessing은 local spectrum의 magnitude를 feature로 남기고,
          FFT convolution은 같은 linear operator를 더 빠르게 계산하며, FNet은
          learned attention 대신 fixed global mixing을 사용한다. 먼저 어떤
          intermediate를 만들고 무엇을 버리는지 구분해야 한다.
        </p>
      </div>

      <FFTApplicationDecisionViz />

      <ExplainedFormula
        question="긴 signal에서 시간에 따라 변하는 local spectrum을 어떻게 만들까?"
        idea={<>Frame index m마다 signal을 H sample씩 이동하고 window w[n]를 곱한 뒤 N-point DFT를 계산합니다. Magnitude 또는 power를 남기면 time–frequency matrix가 됩니다.</>}
        formula={String.raw`\begin{aligned}s_m[n]&=x[n+mH]w[n]\\[3pt]\operatorname{STFT}_x[m,k]&=\sum_{n=0}^{N-1}s_m[n]e^{-i2\pi kn/N}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}s_m[n]&=\underbrace{x[n+mH]w[n]}_{\text{analysis window 계산}}\\[3pt]\operatorname{STFT}_x[m,k]&=\underbrace{\sum_{n=0}^{N-1}s_m[n]e^{-i2\pi kn/N}}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`x[n+mH]w[n]`, annotation: ["analysis window이(가) 식의 결과에 기여하는","방식을 계산합니다.","Frame index m마다"] },
          { expression: String.raw`\sum_{n=0}^{N-1}s_m[n]e^{-i2\pi kn/N}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Frame index m마다"] },
        ]}
        terms={[
          { symbol: "m", name: "frame index", description: "시간축에서 몇 번째 local window인지 나타냅니다." },
          { symbol: "k", name: "frequency bin", description: "각 frame 안의 discrete frequency index입니다." },
          { symbol: "H", name: "hop size", description: "인접 frame 사이에 이동하는 sample 수입니다." },
          { symbol: "w[n]", name: "analysis window", description: "Frame 경계를 taper해 leakage 특성을 조절합니다." },
        ]}
        assumptions={["같은 sample rate와 preprocessing convention을 train과 inference에서 유지합니다.", "Magnitude-only spectrogram은 phase를 제거하므로 일반적으로 그대로 invertible하지 않습니다."]}
        interpretation="N은 frequency resolution과 local stationarity 구간을, H는 time-axis sampling과 compute를 함께 바꾼다. Model checkpoint는 이 frontend contract에 묶여 있습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          예를 들어 16kHz audio에서 N=400은
          <code>400/16000=0.025s</code>, 즉 25ms frame을 뜻합니다. Hop
          H=160이면 frame 시작점은 <code>160/16000=0.01s</code>, 즉
          10ms마다 이동합니다. N은 한 번에 보는 시간 범위와 frequency
          grid를, H는 time-axis sampling 간격과 frame 수를 주로 바꾼니다.
        </p>
        <h3>Audio: STFT에서 log-Mel까지</h3>
        <p>
          STFT power에 Mel filter bank를 곱고 log compression을 적용하면 log-Mel
          spectrogram이 된다. Whisper는 16kHz audio에서 80-channel log-magnitude
          Mel representation을 사용했지만, 이것이 모든 speech model의 표준 입력은
          아니다. Wav2vec 2.0처럼 raw waveform에서 frontend를 학습하는 model도 있다.
          Whisper의 정확한 preprocessing은 <a href="https://cdn.openai.com/papers/whisper.pdf" target="_blank" rel="noreferrer">공식 논문</a>의 model specification과 함께 확인해야 한다.
        </p>
      </div>

      <ExplainedFormula
        question="큰 convolution을 왜 frequency별 multiplication으로 바꿀 수 있을까?"
        idea={<>Circular convolution은 Fourier basis에서 diagonal operator이므로 각 frequency bin을 독립적으로 곱할 수 있습니다. Linear convolution은 wrap-around를 막도록 충분히 padding한 뒤 inverse transform하고 필요한 구간을 자릅니다.</>}
        formula={String.raw`y=x*h=\mathcal F^{-1}\!\left(\mathcal F(x)\odot\mathcal F(h)\right)`}
        annotatedFormula={String.raw`y=\underbrace{x*h=\mathcal F^{-1}\!\left(\mathcal F(x)\odot\mathcal F(h)\right)}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`x*h=\mathcal F^{-1}\!\left(\mathcal F(x)\odot\mathcal F(h)\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Circular convolution은 Fourier","basis에서 diagonal operator이므로 각","frequency bin을 독립적으로 곱할 수 있습니다."] },
        ]}
        terms={[
          { symbol: "x*h", name: "linear convolution", description: "Input x와 filter h를 shift하며 multiply-accumulate한 결과입니다." },
          { symbol: "\\mathcal F", name: "FFT transform", description: "두 operand를 같은 frequency coordinate로 옮깁니다." },
          { symbol: "\\odot", name: "binwise product", description: "Frequency bin마다 complex multiplication을 수행합니다." },
          { symbol: "\\mathcal F^{-1}", name: "inverse FFT", description: "곱한 coefficient를 original coordinate로 되돌립니다." },
        ]}
        assumptions={["Linear convolution length 이상으로 zero-padding해 circular wrap-around를 피합니다.", "FFT·inverse FFT·padding·workspace 비용을 모두 포함해 direct convolution과 비교합니다."]}
        interpretation="Kernel이 짧으면 optimized direct convolution이 더 빠를 수 있다. FFT의 asymptotic advantage는 long kernel, large batch와 transform reuse 조건에서 실제 이득으로 바뀝니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          길이 5 signal과 길이 3 filter의 linear convolution 길이는
          <code>5+3−1=7</code>입니다. 따라서 두 operand를 적어도 7칸의
          transform grid에 padding해야 하며, 더 짧으면 circular convolution의 끝
          부분이 앞으로 감기는 wrap-around가 생깁니다. 실제 library는 7보다
          큰 계산 친화적 길이를 선택할 수 있지만, 결과에서 필요한 7개 구간만
          취하는 linear-operator 계약은 같습니다.
        </p>
        <h3>Token mixing과 long convolution은 같은 것이 아니다</h3>
        <p>
          <a href="https://arxiv.org/abs/2105.03824" target="_blank" rel="noreferrer">FNet</a>은 encoder의 self-attention sublayer를 parameter-free Fourier mixing으로
          바꾸어 모든 token을 섞는다. 하지만 input content마다 pairwise attention
          weight를 만드는 것은 아니므로 selective routing과 causal masking의 동작이
          다르다. 논문의 GLUE 결과도 해당 model size와 sequence length 조건의
          empirical trade-off로 읽어야 한다.
        </p>
        <p>
          <a href="https://arxiv.org/abs/2302.10866" target="_blank" rel="noreferrer">Hyena</a>는 implicitly parameterized long convolution과 data-controlled gating을
          결합하며 FFT는 긴 convolution을 subquadratic하게 계산하는 아래층이다.
          따라서 “FFT가 attention을 했다”기보다 learned long filter operator의
          execution path에 FFT가 들어간다고 보는 편이 정확하다.
        </p>
        <h3>실제 선택 기준</h3>
        <p>
          Feature pipeline이라면 sample rate·window·hop·normalization과 phase 보존
          여부를 versioning한다. Operator acceleration이라면 end-to-end latency,
          padding과 workspace, backward cost를 측정하며, architecture replacement라면
          같은 parameter·training token·hardware budget에서 quality와 serving path를
          함께 비교한다. FFT의 O(N log N)만 보고 model 전체가 빨라진다고 결론 내리면
          안 된다.
        </p>
      </div>

      <div id="paper-whisper-frontend" className="scroll-mt-24" />
      <div id="paper-fnet" className="scroll-mt-24" />
      <div id="paper-hyena" className="scroll-mt-24" />
      <div className="not-prose mt-8 grid gap-5 md:grid-cols-3">
        {[
          ["paper-whisper-frontend", "Robust Speech Recognition via Large-Scale Weak Supervision", "16kHz audio와 80-channel log-Mel frontend를 포함한 Whisper의 model·data recipe를 설명합니다. 이 frontend가 모든 speech model의 표준이거나 FFT만으로 robustness를 만들었다는 주장은 아닙니다.", "https://cdn.openai.com/papers/whisper.pdf", "Whisper 원 논문 보기"],
          ["paper-fnet", "FNet: Mixing Tokens with Fourier Transforms", "Encoder의 self-attention sublayer를 parameter-free Fourier mixing으로 바꾸어 speed–accuracy trade-off를 비교합니다. Content-adaptive attention과 동일한 연산이거나 decoder serving의 보편적 우위를 보인 결과는 아닙니다.", "https://arxiv.org/abs/2105.03824", "FNet 원 논문 보기"],
          ["paper-hyena", "Hyena Hierarchy", "Implicit long convolution과 data-controlled gating을 계층적으로 결합하고 긴 sequence에서 subquadratic operator를 평가합니다. FFT 자체가 selective routing을 학습하거나 모든 길이에서 attention보다 빠르다는 뜻은 아닙니다.", "https://arxiv.org/abs/2302.10866", "Hyena 원 논문 보기"],
        ].map(([id, title, description, href, label]) => (
          <div key={id} className="min-w-0 border-l border-border pl-4">
            <p className="text-xs font-bold text-primary">논문 읽기 · 적용 경계</p>
            <p className="mt-2 text-sm font-semibold leading-6">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href={href} target="_blank" rel="noreferrer">{label}</a>
          </div>
        ))}
      </div>
    </section>
  );
}
