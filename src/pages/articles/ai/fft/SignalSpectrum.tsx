import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';

function Mixer() {
  const [lowAmplitude, setLowAmplitude] = useState(0.8);
  const [highAmplitude, setHighAmplitude] = useState(0.35);
  const width = 600;
  const height = 220;
  const center = 110;
  const wavePath = Array.from({ length: 161 }, (_, index) => {
    const time = index / 160;
    const value = lowAmplitude * globalThis.Math.sin(2 * globalThis.Math.PI * 2 * time)
      + highAmplitude * globalThis.Math.sin(2 * globalThis.Math.PI * 5 * time);
    return `${index === 0 ? 'M' : 'L'} ${(30 + time * 540).toFixed(2)} ${(center - value * 42).toFixed(2)}`;
  }).join(' ');

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5"><span className="text-sm font-bold">같은 신호를 두 좌표계에서 함께 본다</span><span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-300">TIME ↔ FREQUENCY</span></figcaption>
      <div className="grid gap-4 border-b border-border bg-sky-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <label htmlFor="fft-low-amplitude" className="block text-xs font-semibold text-muted-foreground">2 Hz 진폭 · {lowAmplitude.toFixed(2)}<input id="fft-low-amplitude" type="range" min="0" max="1" step="0.05" value={lowAmplitude} onChange={(event) => setLowAmplitude(Number(event.target.value))} className="mt-3 block w-full accent-blue-600" /></label>
        <label htmlFor="fft-high-amplitude" className="block text-xs font-semibold text-muted-foreground">5 Hz 진폭 · {highAmplitude.toFixed(2)}<input id="fft-high-amplitude" type="range" min="0" max="1" step="0.05" value={highAmplitude} onChange={(event) => setHighAmplitude(Number(event.target.value))} className="mt-3 block w-full accent-emerald-600" /></label>
      </div>
      <div className="grid min-w-0 gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center lg:p-6">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-bold text-muted-foreground">시간 영역 · 두 성분을 더한 파형</p>
          <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="2Hz와 5Hz 사인파를 더한 시간 영역 파형">
            <line x1="30" y1={center} x2="570" y2={center} stroke="var(--border)" />
            {[0, 0.25, 0.5, 0.75, 1].map((time) => <g key={time}><line x1={30 + time * 540} y1="22" x2={30 + time * 540} y2="198" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="2 6" /><text x={30 + time * 540} y="215" textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">{time}s</text></g>)}
            <path d={wavePath} fill="none" stroke="#2563eb" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="mb-4 text-xs font-bold text-muted-foreground">주파수 영역 · 성분별 크기</p>
          <div className="flex h-44 items-end justify-center gap-8 border-b border-border px-3">
            {[{ frequency: '2 Hz', amplitude: lowAmplitude, color: 'bg-blue-600' }, { frequency: '5 Hz', amplitude: highAmplitude, color: 'bg-emerald-600' }].map((item) => (
              <div key={item.frequency} className="flex h-full w-12 flex-col justify-end text-center"><span className="mb-2 font-mono text-xs font-bold">{item.amplitude.toFixed(2)}</span><div className={`mx-auto w-7 rounded-t-sm ${item.color}`} style={{ height: `${item.amplitude * 120}px` }} /><span className="mt-2 text-xs font-semibold">{item.frequency}</span></div>
            ))}
          </div>
        </div>
      </div>
      <p className="border-t border-border bg-sky-500/[0.035] px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">Slider 하나를 움직일 때 <strong className="text-foreground">시간 파형과 해당 주파수 막대가 동시에 변한다.</strong> 이 막대는 우선 크기만 보여 주며, 복원에 필요한 위상은 다음 절에서 더한다.</p>
    </figure>
  );
}

export default function SignalSpectrum() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">복잡한 파형 안에 어떤 반복이 숨어 있을까?</h2>
      <QuestionLead
        question="시간에 따라 흔들리는 값의 목록에서 반복 주기와 세기를 어떻게 분리할까?"
        answer="신호를 서로 다른 주파수의 sine·cosine basis에 투영해 각 성분의 크기와 위상을 구한다. DFT가 그 변환이고 FFT는 같은 DFT를 빠르게 계산하는 알고리즘이다."
      />
      <ConceptPrimer
        items={[
          { term: '신호', meaning: '시간이나 공간 위치에 따라 측정한 값의 배열이다.', why: 'FFT가 변환할 입력 index와 sample 값을 정의한다.' },
          { term: '주파수', meaning: '1초 또는 한 공간 구간 안에서 패턴이 반복되는 횟수다.', why: '복잡한 신호를 반복 속도가 다른 basis 성분으로 분리한다.' },
          { term: '진폭·위상', meaning: '성분의 세기와 반복이 기준점에서 시작하는 위치다.', why: '같은 주파수라도 크기와 정렬이 다른 신호를 구분한다.' },
          { term: '주파수 bin', meaning: 'DFT가 index k마다 측정하는 하나의 이산 주파수 칸이다.', why: '연속적인 모든 주파수가 아니라 관측 길이가 정한 간격으로 spectrum을 읽게 한다.' },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          아래 신호는 2 Hz와 5 Hz sine wave의 합이다. 시간 영역에서는 하나의 굴곡진 선으로 보이지만, 주파수 영역에서는
          두 위치의 막대로 분리된다. 두 slider를 움직이면 시간 파형의 변화와 spectrum의 변화가 같은 정보를 다른 좌표계로
          표현한다는 점을 볼 수 있다.
        </p>
      </div>
      <Mixer />
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{x(t)}_{\text{관측한 시간 신호}}=\underbrace{A_1\sin(2\pi f_1t)}_{\text{첫 주파수 성분}}+\underbrace{A_2\sin(2\pi f_2t)}_{\text{둘째 주파수 성분}}`}</MathFormula></div>
      <FormulaNote
        meaning="시간 영역의 각 sample은 두 성분이 합쳐진 값이다. 주파수 표현은 같은 신호를 basis별 계수 A1, A2로 다시 기술한다. 변환은 정보를 무조건 줄이는 압축이 아니라 좌표계의 변경이다."
        symbols={[
          [String.raw`t`, '시간 또는 공간 위치'],
          [String.raw`f_1, f_2`, '각 sine 성분이 반복되는 주파수'],
          [String.raw`A_1, A_2`, '각 주파수 성분의 진폭'],
          [String.raw`\{X_k\}`, '주파수마다 복소 계수를 배열한 spectrum'],
        ]}
      />
    </section>
  );
}
