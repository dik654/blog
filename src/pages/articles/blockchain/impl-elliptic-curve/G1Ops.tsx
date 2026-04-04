import G1OpsViz from './viz/G1OpsViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function G1Ops({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="g1-ops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">G1 점 연산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          double: 접선 기울기 λ = 3x²/(2y) → Jacobian에서는 역원 없이 중간 변수 A,B,C,D로 전개
          <br />
          add: 두 점 P+Q의 할선 — U,S 변수로 Z 좌표 보정, 특수 케이스(P==Q, P==-Q) 분기
          <br />
          scalar_mul: 256비트 스칼라의 각 비트를 LSB부터 순회하는 double-and-add
        </p>
        <p className="leading-7">
          to_affine: Z.inv()로 (X/Z², Y/Z³) 변환 — 전체 연산 중 유일한 역원 호출
          <br />
          이 구조가 Jacobian 좌표의 존재 이유: 연산은 곱셈만, 최종 출력에서만 inv()
        </p>
      </div>
      <div className="not-prose mb-8">
        <G1OpsViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          add()에서 U₁==U₂ 비교가 같은 점 여부 판별 — Jacobian이라 x₁==x₂ 직접 비교 불가
          <br />
          X₁·Z₂² == X₂·Z₁² 로 변환해 역원 없이 동치 판정 — 곱셈 2회로 해결
          <br />
          scalar_mul의 LSB-first 방식: base를 매번 double하면 자연스럽게 2^i·P가 됨
        </p>
      </div>
    </section>
  );
}
