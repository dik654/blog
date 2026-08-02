import { useMemo, useState } from 'react';
import { BeginnerOpening, ConceptPrimer, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const target = [0.05, 0.12, 0.28, 0.35, 0.15, 0.05];
const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

function estimatedDistribution(sampleCount: number) {
  const noiseScale = 0.42 / globalThis.Math.sqrt(sampleCount);
  const perturbed = target.map((probability, index) => globalThis.Math.max(0.008, probability + globalThis.Math.sin(index * 2.3 + sampleCount * 0.07) * noiseScale));
  const total = perturbed.reduce((sum, probability) => sum + probability, 0);
  return perturbed.map((probability) => probability / total);
}

function DistributionExplorer() {
  const [sampleCount, setSampleCount] = useState(40);
  const estimate = useMemo(() => estimatedDistribution(sampleCount), [sampleCount]);
  const totalVariation = estimate.reduce((sum, probability, index) => sum + globalThis.Math.abs(probability - target[index]), 0) / 2;

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <label htmlFor="distribution-samples" className="block text-xs font-semibold text-muted-foreground">
          관측한 표본 수 · {sampleCount}개
          <input id="distribution-samples" type="range" min="20" max="400" step="20" value={sampleCount} onChange={(event) => setSampleCount(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
      </figcaption>
      <div className="p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 bg-zinc-300 dark:bg-zinc-600" />실제 분포 · 관측 불가</span>
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 bg-blue-600" />표본으로 추정한 분포</span>
        </div>
        <div className="grid h-52 grid-cols-6 items-end gap-2 border-b border-border px-1 sm:gap-4">
          {target.map((probability, index) => (
            <div key={labels[index]} className="flex h-full min-w-0 items-end justify-center gap-1">
              <div className="w-2.5 bg-zinc-300 dark:bg-zinc-600 sm:w-4" style={{ height: `${probability * 460}px` }} title={`실제 ${probability.toFixed(2)}`} />
              <div className="w-2.5 bg-blue-600 sm:w-4" style={{ height: `${estimate[index] * 460}px` }} title={`추정 ${estimate[index].toFixed(2)}`} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-2 px-1 pt-2 text-center font-mono text-xs text-muted-foreground sm:gap-4">
          {labels.map((label) => <span key={label}>{label}</span>)}
        </div>
        <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-xs leading-relaxed text-muted-foreground">표본이 적으면 우연한 빈도 차이를 실제 구조로 착각하기 쉽다. 생성 모델은 유한한 표본에서 반복되는 구조를 찾아 아직 보지 못한 샘플에도 확률을 배분해야 한다.</p>
          <div className="sm:text-right"><p className="text-xs font-semibold text-muted-foreground">분포 차이 · TV distance</p><p className="mt-1 font-mono text-2xl font-bold">{totalVariation.toFixed(3)}</p></div>
        </div>
      </div>
    </figure>
  );
}

export default function DistributionProblem() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">생성은 무엇을 외우는 일이 아니라 분포를 배우는 일이다</h2>
      <BeginnerOpening
        title="생성 모델은 본 예시를 그대로 꺼내는 저장함이 아니라, 어떤 결과가 자연스러운지 배우는 모델입니다."
        description={<>고양이 사진을 만든다면 귀, 눈, 털, 자세와 배경이 어떤 조합으로 자주 나타나는지를 배워야 한다. 학습 뒤에는 보지 못한 조합도 만들되, 고양이 세계에서 나올 법한 범위를 벗어나지 않아야 한다. 이 <strong className="text-foreground">가능한 결과와 그 빈도의 규칙</strong>을 분포라고 부른다.</>}
        familiarScene={<>색 공이 든 주머니에서 공을 여러 번 꺼내 본다고 하자. 파란 공이 자주 나오고 빨간 공이 드물다면, 공 하나하나를 외우지 않아도 다음 색의 가능성을 짐작할 수 있다. 생성 모델은 훨씬 복잡한 image에서 이 빈도와 함께 나타나는 관계를 배운다.</>}
        steps={[
          { label: '여러 예시를 관찰한다', detail: '직접 볼 수 없는 실제 분포 대신 그 분포에서 나온 유한한 sample을 모은다.' },
          { label: '자주 나타나는 구조를 배운다', detail: 'Model distribution이 관측 sample의 영역과 관계를 가깝게 표현하도록 조정한다.' },
          { label: '새 결과를 뽑아 검증한다', detail: 'Sampling으로 새 결과를 만들고 품질뿐 아니라 다양성과 빠진 mode도 함께 본다.' },
        ]}
      />
      <QuestionLead
        question="학습 이미지와 똑같지 않지만 같은 세계에서 나온 듯한 새 이미지는 어떻게 만들까?"
        answer="관측한 표본을 저장하는 대신 그 표본들이 자주 놓이는 영역, 함께 변하는 특징, 드문 경우의 확률을 나타내는 모델 분포 pθ(x)를 학습한다. 생성은 이 분포에서 새로운 x를 뽑는 과정이다."
      />
      <ConceptPrimer
        items={[
          { term: 'data distribution', meaning: '현실에서 샘플을 만들어 내지만 직접 식으로 알 수 없는 분포 p_data(x)다.', why: '모델이 근사하려는 대상과 학습 데이터 자체를 구분하게 한다.' },
          { term: 'model distribution', meaning: '파라미터 θ가 정의하는 근사 분포 pθ(x)다.', why: '학습은 두 분포의 차이를 줄이는 θ를 찾는 과정이 된다.' },
          { term: 'sampling', meaning: '학습된 분포의 확률 질량을 따라 하나의 결과를 뽑는 과정이다.', why: '좋은 reconstruction이나 분류 성능과 실제 생성 능력을 구분하게 한다.' },
          { term: 'likelihood', meaning: '현재 θ에서 관측값 x가 나올 밀도 또는 확률 pθ(x)다.', why: '일부 생성 모델은 이를 직접 계산하지만 GAN 같은 모델은 그렇지 않다.' },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          실제 분포는 보이지 않는다. 볼 수 있는 것은 그 분포에서 나온 유한한 데이터뿐이다. 표본 수를 바꿔 보면 같은
          실제 분포에서도 경험적 빈도가 흔들린다. 모델 용량이 너무 작으면 구조를 놓치고, 너무 크고 제약이 없으면 표본을
          그대로 외울 수 있다. 생성 모델의 공통 문제는 <strong>표본에 맞으면서도 분포의 빈 공간을 타당하게 채우는 것</strong>이다.
        </p>
      </div>
      <DistributionExplorer />
      <Misconception>
        생성 품질이 좋다고 반드시 likelihood가 높거나 전체 mode를 잘 덮는 것은 아니다. 한 지표나 보기 좋은 몇 개의 sample만으로 분포 학습을 판단할 수 없다.
      </Misconception>
    </section>
  );
}
