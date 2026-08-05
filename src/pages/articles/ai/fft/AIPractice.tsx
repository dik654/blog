import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, InternalLink, SourceNotes } from '@/components/learning/ArticleLearning';

const applications = [
  { task: 'Audio feature', input: '겹치는 waveform frame', transform: 'STFT → magnitude/mel 또는 complex feature', caution: 'raw waveform을 직접 학습하는 모델도 있으므로 필수 전처리는 아니다.' },
  { task: '큰 convolution', input: '긴 signal과 큰 kernel', transform: 'FFT 둘 → element-wise product → inverse FFT', caution: '작은 kernel은 transform overhead 때문에 direct convolution이 빠를 수 있다.' },
  { task: 'Long sequence mixing', input: '긴 token·time series', transform: 'FFT 기반 long convolution 또는 spectral mixing', caution: 'content-dependent attention과 같은 연산은 아니며 task별 검증이 필요하다.' },
  { task: 'Spectral operator', input: '공간 field·PDE state', transform: '선택한 Fourier mode를 학습 가능한 weight로 변환', caution: 'grid, boundary, retained mode가 표현 한계를 정한다.' },
  { task: 'Fourier features', input: '좌표·시간 값', transform: '여러 sine/cosine 좌표로 embedding', caution: '주파수 scale이 너무 크면 optimization과 generalization이 나빠질 수 있다.' },
];

export default function AIPractice() {
  return (
    <section id="ai-usage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">AI에서는 언제 FFT가 실제 이득일까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          FFT는 “주파수 feature가 유용한가”와 “연산을 더 싸게 만들 수 있는가”라는 두 이유로 쓰인다. 전자는 신호의 주기와
          scale을 명시적으로 드러내고, 후자는 convolution theorem처럼 다른 연산을 element-wise product로 바꾼다.
        </p>
      </div>
      <div className="not-prose my-6 min-w-0 space-y-2">
        <div className="rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{x\circledast_L h}_{\text{길이 }L\text{의 circular convolution}}=\underbrace{\mathcal{F}_L^{-1}}_{\text{시간축으로 복원}}\!\left(\underbrace{\mathcal{F}_L(x)\odot\mathcal{F}_L(h)}_{\text{주파수별 complex 곱}}\right)`}</Math></div>
        <div className="rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{x*h}_{\text{linear convolution}}=\left(x\circledast_Lh\right)_{0:N+K-1}\quad\text{if}\quad\underbrace{L\ge N+K-1}_{\text{zero-padding 조건}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="DFT bin별 곱을 역변환하면 먼저 길이 L의 circular convolution이 된다. 입력과 kernel을 N+K-1 이상으로 zero-padding해야 wraparound가 사라지고 필요한 구간이 linear convolution과 같아진다."
        symbols={[
          [String.raw`x`, '입력 signal 또는 feature map'],
          [String.raw`h`, 'convolution kernel'],
          [String.raw`\mathcal{F},\mathcal{F}^{-1}`, 'FFT와 inverse FFT'],
          [String.raw`\odot`, 'frequency bin별 element-wise complex multiplication'],
          [String.raw`\circledast_L`, '길이 L에서 양 끝이 이어지는 circular convolution'],
        ]}
      />
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {applications.map((item) => (
          <div key={item.task} className="grid min-w-0 gap-2 border-b border-border p-4 last:border-0 lg:grid-cols-[8rem_minmax(0,0.8fr)_minmax(0,1.15fr)_minmax(0,1.3fr)] lg:gap-4"><p className="text-sm font-bold">{item.task}</p><p className="text-xs leading-relaxed text-muted-foreground">{item.input}</p><p className="text-xs font-semibold leading-relaxed text-blue-700 dark:text-blue-300">{item.transform}</p><p className="text-xs leading-relaxed text-muted-foreground">{item.caution}</p></div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Linear convolution이 되려면 길이부터 맞춘다</h3>
        <p>
          길이 <Math>{String.raw`N`}</Math> 입력과 길이 <Math>{String.raw`K`}</Math> kernel의 결과는
          <Math>{String.raw`N+K-1`}</Math>점이다. FFT 길이 <Math>{String.raw`L`}</Math>을 그보다 작게 잡으면 양 끝이
          원처럼 이어지는 circular convolution이 섞인다. 따라서 <Math>{String.raw`L\ge N+K-1`}</Math>로 padding한 뒤
          FFT, bin별 곱, inverse FFT를 수행하고 필요한 구간을 자른다.
        </p>
        <h3>성능 판단은 복잡도만으로 끝나지 않는다</h3>
        <p>
          `O(N log N)`이 `O(NK)`보다 식으로 작더라도 transform, padding, complex memory, inverse transform 비용이 있다. 실제
          tensor shape와 hardware에서 direct kernel, FFT kernel, learned spectral layer를 benchmark하고 end-to-end accuracy와
          latency를 함께 비교한다. Library가 제공하는 `rfft`, batched FFT, plan/cache 동작도 큰 영향을 준다.
        </p>
        <p>
          LTI·impulse response와 convolution 자체가 낯설면 <InternalLink slug="signals-systems-convolution">신호와 시스템</InternalLink>에서
          먼저 내려가고, basis projection은 <InternalLink slug="linear-algebra-tensors">선형대수와 Tensor Shape</InternalLink>에서
          보강한다. 계산 재사용의 원문은 선택적으로 <InternalLink slug="paper-fft-1965">1965 Cooley–Tukey 논문 글</InternalLink>에서 읽는다.
        </p>
      </div>
      <CapabilityCheck
        items={[
          'DFT와 FFT를 변환과 계산 알고리즘으로 구분할 수 있다.',
          'complex coefficient의 magnitude와 phase가 각각 무엇을 담는지 설명할 수 있다.',
          'Cooley–Tukey가 even/odd DFT를 재사용해 O(N log N)이 되는 흐름을 설명할 수 있다.',
          'aliasing, leakage, frequency resolution, zero-padding을 서로 구분할 수 있다.',
          'AI workload에서 FFT가 feature 표현과 연산 가속 중 어떤 목적으로 쓰이는지 판단할 수 있다.',
        ]}
      />
      <SourceNotes
        sources={[
          { label: 'The Scientist and Engineer’s Guide to DSP · DFT', href: 'https://www.dspguide.com/ch8.htm', note: 'DFT의 기초 해석과 frequency-domain 표현' },
          { label: 'FFTW · Introduction', href: 'https://www.fftw.org/fftw3_doc/Introduction.html', note: '여러 길이와 다차원 DFT를 다루는 실전 FFT library' },
          { label: 'PyTorch · torch.fft', href: 'https://docs.pytorch.org/docs/stable/fft.html', note: 'real/complex, n-dimensional FFT의 tensor API' },
          { label: 'PyTorch · torch.fft.rfft', href: 'https://docs.pytorch.org/docs/stable/generated/torch.fft.rfft.html', note: '실수 입력의 Hermitian symmetry와 N/2+1 출력 계약' },
          { label: 'Fourier Neural Operator', href: 'https://arxiv.org/abs/2010.08895', note: 'Fourier mode에서 operator를 학습하는 대표 사례' },
        ]}
      />
    </section>
  );
}
