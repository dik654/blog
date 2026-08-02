import { useState, type ComponentType } from 'react';
import { Camera, CheckCircle2, Database, GitCompareArrows, Target, TriangleAlert } from 'lucide-react';

type FailureType = 'input' | 'pair' | 'task';

type Decision = {
  label: string;
  title: string;
  observation: string;
  next: string;
  evidence: string;
  stop: string;
  icon: ComponentType<{ className?: string }>;
};

const decisions: Record<FailureType, Decision> = {
  input: {
    label: '입력 분포',
    title: '새 장비·조명에서만 무너진다',
    observation: '같은 결함인데 카메라, 배율, 배경이 바뀐 slice에서 이웃 구조가 달라진다.',
    next: 'Generic baseline을 고정한 뒤 domain corpus로 continued pretraining 후보를 만든다.',
    evidence: '장비·시점별 holdout, domain corpus provenance, generic holdout을 함께 남긴다.',
    stop: '새 slice가 개선되지 않거나 일반 능력 손실이 더 크면 추가 사전학습을 중단한다.',
    icon: Camera,
  },
  pair: {
    label: '이웃 정의',
    title: '보이는 모양은 비슷하지만 원인이 다르다',
    observation: 'Encoder는 시각적으로 가까운 후보를 찾지만 root cause와 조치가 다른 false neighbor가 상위에 남는다.',
    next: 'Domain pretraining보다 positive·hard negative 정책과 contrastive objective를 먼저 고친다.',
    evidence: '원인 확정 pair, false-neighbor 유형, leakage-safe split과 Top-K 순위를 남긴다.',
    stop: 'Pair 정책 변경이 MRR·Precision@K와 판정자 검토를 함께 개선하지 못하면 중단한다.',
    icon: GitCompareArrows,
  },
  task: {
    label: '최종 과업',
    title: '이웃은 괜찮지만 최종 판정이 틀린다',
    observation: 'Representation의 neighborhood는 유용하지만 class, score 또는 action head가 운영 목표를 놓친다.',
    next: 'Head-only를 기준선으로 task fine-tuning을 시작하고 update 범위를 단계적으로 넓힌다.',
    evidence: '실제 출력 계약, slice별 metric, calibration과 새 시점 holdout을 남긴다.',
    stop: '더 많은 layer를 열어도 단순 head를 이기지 못하거나 비용만 증가하면 중단한다.',
    icon: Target,
  },
};

export default function DomainAdaptationDecisionLab() {
  const [failure, setFailure] = useState<FailureType>('input');
  const decision = decisions[failure];
  const Icon = decision.icon;

  return (
    <figure data-domain-adaptation-lab className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[11px] font-black uppercase text-muted-foreground">Adaptation decision lab</p>
        <h3 className="mt-1 text-base font-bold sm:text-lg">성능이 떨어졌다고 모두 domain pretraining을 하지는 않는다</h3>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          관찰한 실패를 먼저 고르면, 바꿔야 할 학습 신호와 검증 근거가 달라진다.
        </p>
      </figcaption>

      <div className="grid gap-px bg-border sm:grid-cols-3" role="tablist" aria-label="관찰한 실패 유형">
        {(Object.entries(decisions) as Array<[FailureType, Decision]>).map(([key, item]) => {
          const ItemIcon = item.icon;
          const selected = failure === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFailure(key)}
              className={`min-w-0 bg-background px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground ${selected ? 'bg-foreground text-background' : 'hover:bg-muted/45'}`}
            >
              <span className="flex items-center gap-2">
                <ItemIcon className="h-4 w-4 shrink-0" />
                <span className="text-xs font-bold">{item.label}</span>
              </span>
              <span className={`mt-2 block text-xs leading-relaxed ${selected ? 'text-background/70' : 'text-muted-foreground'}`}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="border-b border-border bg-muted/10 p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <span className="grid h-10 w-10 place-items-center rounded border border-border bg-background">
            <Icon className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[11px] font-black text-muted-foreground">현재 관찰</p>
          <h4 className="mt-1 text-base font-bold leading-snug">{decision.title}</h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{decision.observation}</p>
        </div>

        <div className="min-w-0 divide-y divide-border">
          <div className="flex min-w-0 gap-3 p-4 sm:p-5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground">다음 실험</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed">{decision.next}</p>
            </div>
          </div>
          <div className="flex min-w-0 gap-3 p-4 sm:p-5">
            <Database className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground">필요한 근거</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{decision.evidence}</p>
            </div>
          </div>
          <div className="flex min-w-0 gap-3 p-4 sm:p-5">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground">중단 조건</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{decision.stop}</p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
