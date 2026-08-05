import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead } from '@/components/learning/ArticleLearning';
import CooleyTukeyViz from './viz/CooleyTukeyViz';

const levels = [
  { label: 'N = 8', groups: ['x₀…x₇'], work: '8개 bin을 각각 직접 비교하지 않는다.' },
  { label: 'N = 4 × 2', groups: ['짝수 x₀,x₂,x₄,x₆', '홀수 x₁,x₃,x₅,x₇'], work: '길이 4 DFT 두 개로 재사용한다.' },
  { label: 'N = 2 × 4', groups: ['길이 2', '길이 2', '길이 2', '길이 2'], work: '같은 분할을 log₂N 단계 반복한다.' },
];

export default function FFTDivideConquer() {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">FFT는 어떻게 같은 DFT 계산을 줄일까?</h2>
      <QuestionLead
        question="FFT는 DFT를 근사하거나 다른 결과를 내는 빠른 변환일까?"
        answer="아니다. Cooley–Tukey FFT는 DFT basis의 주기성과 대칭성을 이용해 중복 계산을 재사용한다. 부동소수점 반올림 차이는 있을 수 있지만 수학적으로 같은 변환을 계산한다."
      />
      <CooleyTukeyViz />
      <div className="not-prose my-8 space-y-3">
        {levels.map((level, index) => (
          <div key={level.label} className="grid min-w-0 gap-3 rounded-md border border-border p-4 lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <p className="font-mono text-xs font-bold text-blue-600">{level.label}</p>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${level.groups.length}, minmax(0, 1fr))` }}>{level.groups.map((group, groupIndex) => <div key={`${group}-${groupIndex}`} className="min-w-0 rounded-sm bg-muted/50 px-2 py-3 text-center text-[11px] font-semibold leading-relaxed">{group}</div>)}</div>
            <p className="text-xs leading-relaxed text-muted-foreground"><span className="mr-2 font-mono font-bold">0{index + 1}</span>{level.work}</p>
          </div>
        ))}
      </div>
      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-[11px] sm:text-base">{String.raw`\underbrace{X_k}_{\text{앞 절반 출력}}=\underbrace{E_k}_{\text{짝수 DFT}}+\underbrace{\omega_N^kO_k}_{\text{회전시킨 홀수 DFT}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-[11px] sm:text-base">{String.raw`\underbrace{X_{k+N/2}}_{\text{뒤 절반 출력}}=\underbrace{E_k}_{\text{같은 값을 재사용}}-\underbrace{\omega_N^kO_k}_{\text{부호만 반전}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{T(N)}_{\text{전체 비용}}=2T(N/2)+\underbrace{O(N)}_{\text{butterfly 결합}}=O(N\log N)`}</Math></div>
      </div>
      <FormulaNote
        meaning="짝수 sample의 DFT Ek와 홀수 sample의 DFT Ok를 한 번씩 구하면 twiddle factor의 부호 대칭으로 출력 두 개를 동시에 조립할 수 있다. 이 결합이 butterfly다."
        symbols={[
          [String.raw`E_k`, '짝수 index sample만 모은 길이 N/2 DFT'],
          [String.raw`O_k`, '홀수 index sample만 모은 길이 N/2 DFT'],
          [String.raw`\omega_N^k=e^{-i2\pi k/N}`, '홀수 부분의 위상을 맞추는 complex twiddle factor'],
          [String.raw`\log_2N`, '문제 크기를 절반씩 줄일 수 있는 재귀 단계 수'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>N=1024에서 계산 규모 비교</h3>
        <p>
          정의대로 모든 입력·출력 쌍을 계산하면 약 N²=1,048,576 규모의 항을 다룬다. Radix-2 FFT는 약 N log₂N=10,240
          규모의 stage 연산으로 재사용한다. 실제 시간은 hardware, memory layout, batch, real/complex dtype과 library kernel에
          따라 달라지므로 이 비율을 그대로 wall-clock 속도라고 해석하지 않는다.
        </p>
        <h3>길이가 2의 거듭제곱이 아니면?</h3>
        <p>
          Radix-2 설명에는 2의 거듭제곱이 편하지만 현대 FFT library는 mixed-radix와 다른 알고리즘으로 여러 길이를 처리한다.
          Zero-padding은 계산에 유리한 길이를 선택하거나 spectrum을 더 촘촘히 표시할 수 있지만, 원 신호의 새로운 주파수
          정보를 만들어 내지는 않는다.
        </p>
      </div>
    </section>
  );
}
