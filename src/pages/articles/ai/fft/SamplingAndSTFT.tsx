import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception } from '@/components/learning/ArticleLearning';

const failureModes = [
  { title: 'Aliasing', cause: 'sampling rate의 절반보다 높은 성분', symptom: '낮은 가짜 주파수로 접혀 보인다.', fix: '충분한 sampling rate와 anti-alias filter' },
  { title: 'Leakage', cause: 'window 안에서 주기가 정확히 끝나지 않음', symptom: '한 성분의 에너지가 주변 bin으로 퍼진다.', fix: 'Hann 같은 window와 분석 길이 선택' },
  { title: '낮은 해상도', cause: '관측 시간 N/fs가 너무 짧음', symptom: '가까운 주파수 두 개를 구분하지 못한다.', fix: '더 긴 관측 구간; zero-padding은 보간만 수행' },
  { title: '시간 정보 손실', cause: '전체 신호를 FFT 한 번으로 요약', symptom: '성분이 언제 나타났는지 알 수 없다.', fix: '겹치는 짧은 frame마다 FFT하는 STFT' },
];

export default function SamplingAndSTFT() {
  return (
    <section id="sampling-stft" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Spectrum을 믿기 전에 무엇을 확인해야 할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          FFT는 주어진 sample의 DFT를 정확히 계산해도, sampling 과정에서 이미 정보가 섞였거나 짧은 구간을 잘못 잘랐다면
          원하는 물리 신호를 보여 주지 못한다. 예를 들어 7 Hz sine을 초당 10번만 재면 Nyquist 5 Hz를 넘어서 3 Hz처럼
          보이는 alias가 생긴다.
        </p>
      </div>
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{f_{\max}}_{\text{복원할 최고 주파수}}<\underbrace{\frac{f_s}{2}}_{\text{Nyquist 경계}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{\Delta f}_{\text{DFT bin 간격}}=\frac{f_s}{N}=\frac{1}{\underbrace{N/f_s}_{\text{관측 시간}}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="fs/2는 구분 가능한 최고 주파수의 이론적 경계이고, fs/N은 DFT bin 간격이다. 관측 시간을 두 배로 늘리면 가까운 성분을 구분할 주파수 해상도가 좋아진다."
        symbols={[
          [String.raw`f_s`, '초당 sample 수인 sampling rate'],
          [String.raw`f_{\max}`, '원 신호에 포함된 가장 높은 주파수'],
          [String.raw`N`, '한 번의 FFT에 넣는 sample 수'],
          [String.raw`\Delta f`, '서로 인접한 DFT bin의 주파수 간격'],
          [String.raw`f_k=k\Delta f=kf_s/N`, 'index k가 실제로 가리키는 주파수'],
        ]}
      />
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {failureModes.map((mode) => (
          <div key={mode.title} className="grid min-w-0 gap-2 border-b border-border p-4 last:border-0 lg:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-4"><p className="text-sm font-bold">{mode.title}</p><p className="text-xs leading-relaxed"><span className="text-muted-foreground">원인 · </span>{mode.cause}</p><p className="text-xs leading-relaxed"><span className="text-muted-foreground">관찰 · </span>{mode.symptom}</p><p className="text-xs font-semibold leading-relaxed text-blue-700 dark:text-blue-300">{mode.fix}</p></div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>STFT는 시간과 주파수 해상도를 교환한다</h3>
        <p>
          긴 window는 frequency bin을 촘촘하게 하지만 짧은 사건의 발생 시점을 흐린다. 짧은 window는 시간 변화에 민감하지만
          가까운 주파수를 분리하기 어렵다. Spectrogram의 shape는 대략 `frame 수 × frequency bin 수`이며 window length,
          hop length, sampling rate가 함께 결정한다.
        </p>
      </div>
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <div className="border-b border-border bg-muted/20 px-4 py-3 text-sm font-bold">숫자로 닫는 sampling 판단</div>
        <div className="grid gap-4 p-4 lg:grid-cols-3 lg:p-5">
          <div className="min-w-0 border-b border-border pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4" data-formula-pair>
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300">7 Hz를 10 Hz로 sampling</p>
            <Math display className="my-3 text-sm">{String.raw`|7-1\times10|=3\,\mathrm{Hz}`}</Math>
            <p className="text-xs leading-relaxed text-muted-foreground" data-formula-note>7 Hz와 3 Hz sample이 같은 점들을 만들므로 관측 결과에는 3 Hz alias가 남는다.</p>
          </div>
          <div className="min-w-0 border-b border-border pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4" data-formula-pair>
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300">1초 관측, 1 kHz sampling</p>
            <Math display className="my-3 text-sm">{String.raw`\Delta f=1000/1000=1\,\mathrm{Hz}`}</Math>
            <p className="text-xs leading-relaxed text-muted-foreground" data-formula-note>4096점으로 zero-padding하면 그림의 점은 촘촘해져도 실제 1초 관측이 주는 분리 능력은 늘지 않는다.</p>
          </div>
          <div className="min-w-0" data-formula-pair>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">16 kHz 음성 1초의 STFT</p>
            <Math display className="my-3 text-sm">{String.raw`F=\lfloor(16000-400)/160\rfloor+1=98`}</Math>
            <Math display className="my-3 text-sm">{String.raw`B=400/2+1=201`}</Math>
            <p className="text-xs leading-relaxed text-muted-foreground" data-formula-note>25 ms window 400점, 10 ms hop 160점, <Math>{String.raw`n_{fft}=400`}</Math>, center padding 없음이면 PyTorch·librosa 관례의 shape는 <Math>{String.raw`201\times98`}</Math>, 즉 bin × frame이다. <Math>{String.raw`n_{fft}=512`}</Math>로 zero-padding하면 257 bin이 되지만 실제 분해능은 400점 window가 정한다.</p>
          </div>
        </div>
      </div>
      <Misconception>
        magnitude spectrum만으로 충분한 task도 있지만 phase가 일반적으로 불필요한 것은 아니다. 원 waveform 복원, source separation, 위치·정렬 정보가 필요한 문제에서는 phase 또는 complex spectrum을 보존하는 설계가 중요하다.
      </Misconception>
    </section>
  );
}
