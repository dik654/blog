import PermViz from './viz/PermViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Permutation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="permutation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">순열 인자 (Copy Constraints)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          gate 0의 output = gate 1의 input — 같은 변수를 다른 위치에서 사용
          <br />
          copy constraint: (column, row) 쌍으로 "이 두 wire는 같은 값" 선언
          <br />
          selector만으로는 게이트 간 연결 불가 — 순열 인자가 wire를 엮어줌
        </p>
        <p className="leading-7">
          Union-Find로 equivalence class 구성 → class 내 position을 cycle로 연결
          <br />
          sigma 다항식: sigma_A(w^i) = position_tag(sigma(A, i))
          <br />
          grand product Z(x): copy constraint 만족 시 Z(w^0)=1에서 시작해 Z(w^n)=1로 복귀
        </p>
      </div>
      <div className="not-prose mb-8">
        <PermViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          path halving — Union-Find의 경로 압축 최적화로 거의 O(1) 탐색
          <br />
          beta, gamma 랜덤 챌린지 — Schwartz-Zippel 보조정리로 위조 확률 negligible
          <br />
          Z(x)의 Lagrange 보간 비용이 O(n^2) — NTT 최적화 시 O(n log n)으로 감소
        </p>
      </div>
    </section>
  );
}
