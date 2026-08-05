import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  Clock3,
  FunctionSquare,
  Gauge,
  Route,
  ScanLine,
  Waves,
} from 'lucide-react';
import type { Article } from '@/content';
import { articlePath } from '@/lib/paths';

interface Props {
  articles: Article[];
  categorySlug: string;
}

const phases = [
  {
    number: '01',
    pathId: 'ai-math-shape-foundations',
    title: '모양과 방향을 읽는다',
    description: 'Tensor 연산이 가능한지 shape로 먼저 검산하고, 행렬이 정보를 보존하거나 버리는 방향을 찾는다.',
    returnTo: '신경망 · Embedding · RNN',
    items: [
      {
        slug: 'linear-algebra-tensors',
        question: '행렬곱 뒤에 어떤 축이 사라지고 어떤 축이 남는가?',
        outcome: '벡터, 내적, 행렬곱, 전치와 broadcasting을 실제 tensor 코드와 연결한다.',
      },
      {
        slug: 'linear-algebra-decompositions',
        question: '행렬은 어떤 방향을 보존하고 어떤 정보를 압축하는가?',
        outcome: '부분공간, rank, eigenvalue와 SVD를 반복 dynamics와 low-rank 근사로 연결한다.',
      },
    ],
  },
  {
    number: '02',
    pathId: 'ai-math-change-foundations',
    title: '변화, 누적과 경로를 계산한다',
    description: '한 점의 변화율, 공간 전체에 분포한 기여의 누적, 변화 규칙을 시간에 따라 적분하는 문제를 구분한다.',
    returnTo: '역전파 · Diffusion sampler · 로봇 궤적',
    items: [
      {
        slug: 'calculus-computational-graphs',
        question: '출력의 작은 변화를 각 입력의 책임으로 어떻게 나누는가?',
        outcome: '도함수, gradient, 연쇄 법칙, Jacobian과 VJP를 같은 계산 그래프에서 추적한다.',
      },
      {
        slug: 'integrals-fields-conservation',
        question: '공간에 흩어진 작은 기여는 어떻게 총량과 경계의 흐름이 되는가?',
        outcome: '적분, scalar·vector field, flux와 보존법칙을 합력·control volume 계산으로 연결한다.',
      },
      {
        slug: 'differential-equations-phase-plane-numerical-integration',
        question: '현재 상태의 변화 규칙만으로 전체 궤적을 어떻게 복원하는가?',
        outcome: 'ODE, Euler·RK4, phase plane과 양쪽 경계 적분을 실제 경로 계산으로 연결한다.',
      },
    ],
  },
  {
    number: '03',
    pathId: 'ai-math-evidence-foundations',
    title: '좋은 학습인지 판단한다',
    description: '어느 방향으로 움직일지, 불확실성을 어떤 비용으로 바꿀지, 표본 밖에서도 통하는지 분리해 판단한다.',
    returnTo: 'Optimizer · Cross-entropy · 모델 평가',
    items: [
      {
        slug: 'optimization-geometry',
        question: '같은 gradient인데도 곡률과 제약에 따라 왜 update가 달라지는가?',
        outcome: 'Convexity, Hessian, condition number, Lagrangian과 KKT를 update의 실패 조건으로 읽는다.',
      },
      {
        slug: 'probability-information-theory',
        question: '불확실한 관측을 학습 가능한 하나의 비용으로 어떻게 바꾸는가?',
        outcome: '분포, likelihood, entropy와 KL divergence를 손실 함수의 선택 이유로 연결한다.',
      },
      {
        slug: 'statistics-generalization',
        question: 'Train loss가 낮은 모델이 새 데이터에서도 좋다고 어떻게 판단하는가?',
        outcome: '표본, 데이터 분할, 과적합, calibration과 실험 설계의 증거 계약을 세운다.',
      },
    ],
  },
  {
    number: '04',
    pathId: 'ai-math-signal-foundations',
    title: '시간과 기억을 다룬다',
    description: '시간에 따라 변하는 입력을 시스템의 응답으로 읽고, convolution과 주파수 표현이 필요한 이유를 찾는다.',
    returnTo: 'CNN · Audio · Time Series · SSM',
    items: [
      {
        slug: 'signals-systems-convolution',
        question: '시스템은 과거 입력을 어떤 규칙으로 모아 현재 출력으로 만드는가?',
        outcome: 'LTI, impulse response, convolution, frequency response와 sampling을 하나의 실행 흐름으로 잇는다.',
      },
    ],
  },
] as const;

const lenses = [
  { label: '모양', detail: '연산 가능 여부', icon: ScanLine },
  { label: '변화', detail: '민감도와 궤적', icon: FunctionSquare },
  { label: '판단', detail: '목표와 증거', icon: Gauge },
  { label: '기억', detail: '시간축의 응답', icon: Waves },
] as const;

export default function MathFoundationLearningPath({ articles, categorySlug }: Props) {
  const bySlug = new Map(articles.map((article) => [article.slug, article]));

  return (
    <div className="foundation-learning-path space-y-16" data-math-foundation-path>
      <section aria-labelledby="math-foundation-title">
        <div className="grid gap-6 border-y border-border py-7 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-300">
              <Route className="h-4 w-4" aria-hidden="true" />
              JUST-IN-TIME FOUNDATION
            </div>
            <h2 id="math-foundation-title" className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
              수학을 전부 끝내지 말고, 막힌 계산에서 내려온다
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              이 경로는 독립된 수학 교과서 목차가 아니다. 신경망, 생성 모델, 로봇과 신호 처리에서 막힌 질문을
              해결한 뒤 원래 글로 돌아가기 위한 보강 지도다. 현재 막힌 종류 하나만 고른다.
            </p>
          </div>
          <div className="border-l-2 border-cyan-600 pl-4">
            <p className="font-mono text-4xl font-bold leading-none">4</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">계산 관점</strong><br />모양 · 변화 · 판단 · 기억
            </p>
          </div>
        </div>

        <div className="foundation-loop math-foundation-loop" aria-label="수학 보강을 고르는 네 가지 관점">
          {lenses.map((lens, index) => {
            const Icon = lens.icon;
            return (
              <div key={lens.label} className="contents">
                <div className="foundation-loop__step" data-tone={index === 0 ? 'data' : index === 1 ? 'gradient' : index === 2 ? 'loss' : 'prediction'}>
                  <div className="flex items-center justify-between gap-2">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="font-mono text-[10px] opacity-65">0{index + 1}</span>
                  </div>
                  <p className="mt-3 text-sm font-bold">{lens.label}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{lens.detail}</p>
                </div>
                {index < lenses.length - 1 && (
                  <div className="foundation-loop__arrow" aria-hidden="true">
                    <ArrowRight className="hidden h-4 w-4 sm:block" />
                    <ArrowDown className="h-4 w-4 sm:hidden" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section aria-label="AI 수학 과학 보강 순서" className="space-y-14">
        {phases.map((phase) => (
          <section key={phase.number} className="foundation-phase" data-phase={phase.number} aria-labelledby={`math-phase-${phase.number}`}>
            <div className="foundation-phase__header">
              <p className="foundation-phase__number font-mono" aria-hidden="true">{phase.number}</p>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase text-muted-foreground">CALCULATION LENS {phase.number}</p>
                <h3 id={`math-phase-${phase.number}`} className="mt-1 text-xl font-bold">{phase.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{phase.description}</p>
                <p className="mt-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300">다시 올라갈 곳 · {phase.returnTo}</p>
              </div>
            </div>

            <div className="foundation-phase__articles">
              {phase.items.map((item, index) => {
                const article = bySlug.get(item.slug);
                if (!article) return null;
                return (
                  <Link
                    key={item.slug}
                    to={`${articlePath(categorySlug, item.slug)}?path=${phase.pathId}`}
                    className="foundation-path-article group grid min-w-0 gap-3 border-t border-border/70 py-5 transition-colors last:border-b sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:items-start sm:px-3"
                  >
                    <span className="foundation-path-article__number font-mono text-lg font-bold" aria-hidden="true">
                      {phase.number}.{index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-bold leading-snug group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
                        {article.title}
                      </span>
                      <span className="mt-1.5 block text-sm font-semibold leading-relaxed text-foreground/85">{item.question}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{item.outcome}</span>
                      <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {article.level && <span>{article.level}</span>}
                        {article.estimatedMinutes && (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> 약 {article.estimatedMinutes}분
                          </span>
                        )}
                      </span>
                    </span>
                    <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground sm:mt-2 sm:block" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </section>

      <p className="border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        읽는 기준: 기호를 말로 설명하고, 작은 숫자로 계산하고, shape·단위·오차를 검산할 수 있으면 원래 목표 글로 돌아간다.
      </p>
    </div>
  );
}
