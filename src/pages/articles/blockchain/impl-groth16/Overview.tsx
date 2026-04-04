import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS → QAP 변환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          모든 계산을 "곱셈 하나"의 형태로 분해 — R1CS (Rank-1 Constraint System)
          <br />
          A·s * B·s = C·s — 덧셈은 선형결합으로 흡수, 제약 불필요
          <br />
          곱셈 하나가 제약 하나. 복잡한 프로그램도 곱셈 단위로 쪼개면 R1CS로 표현 가능
        </p>
        <p className="leading-7">
          R1CS 행렬의 각 열을 Lagrange 보간하면 다항식 aⱼ(x), bⱼ(x), cⱼ(x) 생성 — QAP
          <br />
          m개의 등식 검사를 하나의 다항식 항등식 a(x)·b(x) - c(x) = h(x)·t(x)로 압축
          <br />
          Schwartz-Zippel: 랜덤 점 τ에서 성립하면 전체 다항식이 같을 확률 압도적
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          도메인을 단순 {'{1, 2, ..., m}'}으로 선택 — 교육용으로 O(n^2) Lagrange 보간 사용
          <br />
          프로덕션 구현은 roots of unity를 도메인으로 써서 FFT 기반 O(n log n) 보간 가능
          <br />
          열이 전부 0인 변수는 보간 생략 — 희소 행렬 최적화로 불필요한 연산 절약
        </p>
      </div>
    </section>
  );
}
