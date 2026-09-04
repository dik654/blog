import ExplainedFormula from "@/components/ui/explained-formula";
import SamplingWindowViz from "./viz/SamplingWindowViz";

export default function Fourier() {
  return (
    <section id="fourier" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">연속 신호를 유한한 DFT로 만들 때 측정 조건이 들어온다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Fourier analysis를 “모든 signal이 몇 개의 sine wave로만 이루어진다”는 주장으로 읽으면 너무 단순하다. 적절한 함수 공간에서 signal을 서로
          orthogonal한 oscillatory basis의 coefficient로 표현하는 관점이다. Euler identity가 cosine과 sine을 하나의 complex
          exponential에 묶어 magnitude와 phase를 동시에 다룰 수 있게 해 준다.
        </p>
      </div>
      <div id="nyquist-boundary" className="scroll-mt-24" />

      <ExplainedFormula
        question="연속 시간 signal의 각 angular frequency 성분을 어떻게 분해하고 다시 합칠까?"
        idea={<>Forward transform은 f(t)를 ω로 회전하는 basis와 전체 시간에 걸쳐 내적하고, inverse transform은 모든 coefficient에 basis를 다시 곱해 합성합니다.</>}
        formula={String.raw`\begin{aligned}F(\omega)&=\int_{-\infty}^{\infty}f(t)e^{-i\omega t}\,dt\\[3pt]f(t)&=\frac1{2\pi}\int_{-\infty}^{\infty}F(\omega)e^{i\omega t}\,d\omega\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}F(\omega)&=\underbrace{\int_{-\infty}^{\infty}f(t)e^{-i\omega t}\,dt}_{\text{spectrum 계산}}\\[3pt]f(t)&=\underbrace{\frac1{2\pi}\int_{-\infty}^{\infty}F(\omega)e^{i\omega t}\,d\omega}_{\text{spectrum 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`\int_{-\infty}^{\infty}f(t)e^{-i\omega t}\,dt`, annotation: ["spectrum이(가) 식의 결과에 기여하는 방식을","계산합니다.","Forward transform은 f(t)를 ω로 회전하는","basis와 전체 시간에 걸쳐 내적하고, inverse"] },
          { expression: String.raw`\frac1{2\pi}\int_{-\infty}^{\infty}F(\omega)e^{i\omega t}\,d\omega`, annotation: ["spectrum이(가) 식의 결과에 기여하는 방식을","계산합니다.","Forward transform은 f(t)를 ω로 회전하는","basis와 전체 시간에 걸쳐 내적하고, inverse"] },
        ]}
        terms={[
          { symbol: "f(t)", name: "continuous signal", description: "시간 t마다 정의된 원래 함수입니다." },
          { symbol: "F(\\omega)", name: "spectrum", description: "Angular frequency ω 성분의 complex coefficient입니다." },
          { symbol: "e^{\\pm i\\omega t}", name: "complex basis", description: "Euler identity로 cosine과 sine phase를 함께 표현합니다." },
          { symbol: "1/(2\\pi)", name: "inverse normalization", description: "Angular-frequency convention에서 생기며 다른 convention에서는 위치가 달라집니다." },
        ]}
        assumptions={["적분과 역변환이 성립하려면 signal class에 맞는 integrability 또는 distribution 조건이 필요합니다.", "이 식은 angular frequency ω를 사용합니다. Hz frequency를 쓰면 exponent와 normalization에 2π가 이동합니다."]}
        interpretation="Forward와 inverse transform은 lossless representation pair다. 실제 ML pipeline에서 magnitude, band aggregation 또는 quantization만 남길 때 정보 손실이 생깁니다."
      />

      <SamplingWindowViz />

      <ExplainedFormula
        question="Sample rate와 frame length가 FFT에서 보이는 frequency 좌표를 어떻게 정할까?"
        idea={<>Continuous signal을 fₛ번/초로 sampling하고 N개씩 잘라 DFT하면, positive frequency의 관측 한계는 Nyquist frequency fₛ/2이고 adjacent bin 간격은 fₛ/N이 됩니다.</>}
        formula={String.raw`\begin{aligned}f_k&=\frac{k f_s}{N}\\[2pt]\Delta f&=\frac{f_s}{N}\\[2pt]|f|&<\frac{f_s}{2}\quad\text{(alias-free band)}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}f_k&=\underbrace{\frac{k f_s}{N}}_{\text{기준량당 비율}}\\[2pt]\Delta f&=\underbrace{\frac{f_s}{N}}_{\text{기준량당 비율}}\\[2pt]|f|&<\underbrace{\frac{f_s}{2}\quad\text{(alias-free band)}}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{k f_s}{N}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Continuous signal을 fₛ번/초로","sampling하고 N개씩 잘라 DFT하면, positive","frequency의 관측 한계는 Nyquist"] },
          { expression: String.raw`\frac{f_s}{N}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Continuous signal을 fₛ번/초로","sampling하고 N개씩 잘라 DFT하면, positive","frequency의 관측 한계는 Nyquist"] },
          { expression: String.raw`\frac{f_s}{2}\quad\text{(alias-free band)}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Continuous signal을 fₛ번/초로","sampling하고 N개씩 잘라 DFT하면, positive","frequency의 관측 한계는 Nyquist"] },
        ]}
        terms={[
          { symbol: "f_s", name: "sample rate", description: "초당 관측한 sample 수입니다." },
          { symbol: "N", name: "frame length", description: "한 번의 DFT에 넣는 sample 수이며 frame duration은 N/fₛ입니다." },
          { symbol: "f_k", name: "bin center", description: "Index k가 나타내는 physical frequency입니다." },
          { symbol: "\\Delta f", name: "bin spacing", description: "인접 DFT bin 사이의 Hz 간격입니다." },
        ]}
        assumptions={["Original continuous signal이 sampling 전에 fₛ/2 아래로 band-limited되었다고 가정합니다.", "Real signal의 unique non-negative bins는 DC와 Nyquist를 포함해 대략 N/2+1개입니다."]}
        interpretation="Sample rate는 관측 band를, frame duration은 frequency grid를 정한다. 높은 sample rate만으로 세밀한 frequency resolution이 생기지는 않습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>유한 frame은 signal에 rectangular window를 곱한 것이다</h3>
        <p>
          관측 구간의 시작과 끝이 자연스럽게 이어지지 않으면 DFT의 periodic assumption에서 경계 discontinuity가 생기고 energy가 여러 bin으로 퍼지는
          spectral leakage가 나타난다. Hann 같은 taper window는 경계를 부드럽게 만들어 side lobe를 줄이는 대신 main lobe를 넓힌다. Leakage
          감소와 가까운 tone 분리 능력 사이에 trade-off가 있는 셈이다.
        </p>
        <p>
          Aliasing·leakage·zero-padding은 서로 다른 현상이다. Aliasing은 sampling 전 band limit 위의 성분이 낮은 frequency로 접히는
          문제다. Leakage는 유한 frame과 window에서 오는 문제이고 zero-padding은 이미 관측한 sequence의 DFT grid를 더 촘촘하게 읽는 방법이다.
        </p>
        <h3>Nyquist 조건은 FFT가 만들어 주는 보장이 아니다</h3>
        <p>
          일정한 간격의 sampling은 continuous spectrum을 sample rate 간격으로 반복한 사본으로 만듭니다. 원래 signal이 <code>fₛ/2</code> 아래로 band-limited되어 있으면 이 사본들이 겹치지 않아 원래 spectrum을 분리할 수 있지만, 더 높은 성분이 남아 있으면 사본이 겹쳐 서로 다른 continuous signal이 같은 sample sequence를 만들 수 있습니다. 예를 들어 8kHz로 sampling한 cosine에서 1kHz와 7kHz는 sample 시점마다 같은 값을 냅니다. 따라서 anti-alias filter와 source band 조건이 없으면 DFT coefficient만으로 둘을 되돌려 구분할 수 없습니다.
        </p>
        <p>
          이 반례는 sample index <code>n</code>에서 직접 검산할 수 있습니다.
          7kHz 성분은 <code>cos(2π·7n/8)</code>이고,
          <code>2π·7n/8=2πn−2πn/8</code>입니다. Cosine의 2π 주기성과
          짝함수 성질을 쓰면 이 값은 <code>cos(2πn/8)</code>, 즉 1kHz
          sample과 같아집니다. FFT algorithm을 바꿔도 이미 같아진 관측값에서
          원래 frequency를 복구할 수는 없습니다.
        </p>
        <p>
          Zero-padding도 이 정보 손실을 복구하지 않습니다. N개 관측 뒤에 0을 더하면 같은 finite observation의 spectrum을 더 많은 frequency 좌표에서 보간할 수 있지만, 실제 관측 시간은 <code>N/fₛ</code> 그대로입니다. 가까운 두 tone을 더 잘 분리하려면 일반적으로 더 긴 관측이나 다른 prior가 필요합니다.
        </p>
      </div>
    </section>
  );
}
