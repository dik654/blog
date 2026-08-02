import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const interpretations = [
  ['곱하기', 'sample xn과 주파수 k의 회전 basis를 위치별로 비교한다.'],
  ['더하기', '한 바퀴 동안 같은 방향의 기여는 누적하고 다른 주파수는 상쇄한다.'],
  ['복소수 결과', '크기는 성분의 세기, angle은 시간·공간의 시작 위치를 담는다.'],
  ['역변환', '모든 주파수 계수를 다시 합쳐 N개 sample을 복원한다.'],
];

export default function DFTProjection() {
  return (
    <section id="dft" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">DFT의 합은 실제로 무엇을 측정할까?</h2>
      <QuestionLead
        question="복소 지수와 긴 합은 왜 특정 주파수를 골라낼 수 있을까?"
        answer="각 후보 주파수와 같은 속도로 도는 복소 basis를 sample에 곱해 더한다. 신호에 그 주파수가 있으면 방향이 정렬되어 큰 벡터가 남고, 다르면 회전하며 서로 상쇄된다."
      />
      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{X_k}_{\text{주파수 }k\text{의 계수}}=\sum_{n=0}^{N-1}\underbrace{x_n}_{\text{시간 sample}}\underbrace{e^{-i2\pi kn/N}}_{\text{반대 방향 회전 basis}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{x_n}_{\text{복원한 sample}}=\frac{1}{N}\sum_{k=0}^{N-1}\underbrace{X_k}_{\text{크기와 위상}}\underbrace{e^{i2\pi kn/N}}_{\text{주파수 }k\text{ basis}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{e^{i\theta}}_{\text{복소평면의 회전}}=\underbrace{\cos\theta}_{\text{실수축 성분}}+i\underbrace{\sin\theta}_{\text{허수축 성분}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="DFT는 길이 N의 sample을 길이 N의 complex coefficient로 바꾼다. 정보 손실 없는 역변환이 있으므로 magnitude만 남기거나 일부 bin을 버리기 전까지는 원 신호를 복원할 수 있다."
        symbols={[
          [String.raw`x_n`, '시간 또는 공간 index n에서 측정한 sample'],
          [String.raw`X_k`, '주파수 bin k의 complex coefficient'],
          [String.raw`N`, '분석하는 sample 수'],
          [String.raw`i^2=-1`, '회전을 두 축으로 표현하는 허수 단위'],
        ]}
      />
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {interpretations.map(([term, meaning], index) => (
          <div key={term} className="grid gap-2 border-b border-border p-4 last:border-0 sm:grid-cols-[2rem_7rem_minmax(0,1fr)] sm:items-center"><span className="font-mono text-xs font-bold text-blue-600">{String(index + 1).padStart(2, '0')}</span><p className="text-sm font-bold">{term}</p><p className="text-xs leading-relaxed text-muted-foreground">{meaning}</p></div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>실수 신호의 spectrum에는 왜 좌우 대칭이 생길까?</h3>
        <p>
          입력이 real value이면 양의 주파수와 음의 주파수 coefficient가 complex conjugate 쌍을 이룬다. 따라서 `rfft`는
          중복되는 절반을 생략해 <Math>{String.raw`\lfloor N/2\rfloor+1`}</Math>개 bin만 반환할 수 있다. Magnitude는 반복의 세기를 보여 주지만 phase를 버리면 원래
          sample의 위치 관계를 정확히 복원할 수 없다.
        </p>
      </div>
      <div className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border p-4" data-formula-pair>
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300">실수 입력 4개</p>
          <Math display className="my-3 text-sm">{String.raw`x=[1,0,-1,0]`}</Math>
          <p className="text-xs leading-relaxed text-muted-foreground" data-formula-note>한 주기 안에서 +1과 -1이 반 바퀴 떨어진 cosine 신호다.</p>
        </div>
        <div className="rounded-md border border-border p-4" data-formula-pair>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">DFT와 rFFT 출력</p>
          <Math display className="my-3 text-sm">{String.raw`X=[0,2,0,2]`}</Math>
          <p className="text-xs leading-relaxed text-muted-foreground" data-formula-note><Math>{String.raw`X_3=X_1^*`}</Math>이므로 rFFT는 중복을 버리고 <Math>{String.raw`[0,2,0]`}</Math>만 보관한다.</p>
        </div>
      </div>
      <Misconception>
        Fourier transform이 “모든 유한 신호가 몇 개의 sine wave로 단순 압축된다”는 뜻은 아니다. DFT는 N개 sample을 N개 coefficient로 옮기며, 특정 신호에서 coefficient가 희소할 때만 압축이나 filtering 이점이 생긴다.
      </Misconception>
    </section>
  );
}
