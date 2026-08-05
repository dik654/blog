import { Link } from 'react-router-dom';
import { ArrowRight, Route } from 'lucide-react';
import { categoryPath, subcategoryPath } from '@/lib/paths';

const routeSteps = [
  {
    order: '01',
    label: '목표 분야',
    description: '지금 이해하거나 만들고 싶은 시스템을 고른다.',
    href: categoryPath('ai'),
  },
  {
    order: '02',
    label: '필요한 기반',
    description: '목표 글에서 막힌 수학·과학·딥러닝만 보강한다.',
    href: subcategoryPath('ai', 'ai-foundations'),
  },
  {
    order: '03',
    label: '구현 · 운영',
    description: '원리를 코드, 실험과 운영 시스템으로 검증한다.',
    href: subcategoryPath('ai', 'ai-practical'),
  },
  {
    order: 'GUIDE',
    label: '막힐 때 읽는 도구',
    description: '낯선 시스템의 실패 위치와 다음 공부를 좁혀야 할 때만 연다.',
    href: subcategoryPath('ai', 'ai-systems-foundation'),
  },
];

export default function LearningPaths() {
  return (
    <section className="mb-14 border-y border-border py-6" aria-labelledby="learning-path-title">
      <div className="mb-5 flex items-start gap-3">
        <Route className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <h2 id="learning-path-title" className="text-base font-bold">탑다운 학습 경로</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">최신 목표에서 시작한다. 이해를 막는 기반만 내려가 확인하고 다시 구현으로 올라온다.</p>
        </div>
      </div>
      <ol className="grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
        {routeSteps.map((step) => (
          <li key={step.order} className="min-w-0 border-b border-border last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0">
            <Link
              to={step.href}
              className="group flex h-full min-w-0 items-start gap-3 px-3 py-4 transition-colors hover:bg-accent/40"
            >
              <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-muted-foreground">{step.order}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{step.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{step.description}</span>
              </span>
              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
