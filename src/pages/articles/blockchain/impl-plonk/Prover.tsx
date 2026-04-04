import ProverViz from './viz/ProverViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Prover({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="prover" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prover 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          PLONK prover는 5라운드 Fiat-Shamir 프로토콜
          <br />
          Round 1: wire commit → Round 2: permutation Z → Round 3: quotient T → Round 4: eval → Round 5: opening
          <br />
          각 라운드 출력을 transcript에 추가 → 다음 챌린지가 결정적으로 도출
        </p>
        <p className="leading-7">
          선형화 트릭: 다항식 곱(예: q_L(x)*a(x))을 scalar*polynomial(q_L(x)*a_bar)로 분해
          <br />
          verifier가 다항식을 직접 평가하지 않고 commitment 선형 결합으로 [r]_1 계산 가능
          <br />
          batch opening: nu 거듭제곱으로 6개 다항식을 결합 → KZG open 한 번으로 모두 증명
        </p>
      </div>
      <div className="not-prose mb-8">
        <ProverViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          T(x) 3분할 — degree ~3n인 T를 n차씩 잘라 각각 commit, SRS 크기를 n+1로 유지 가능
          <br />
          상수잔여(r_constant) 보정 — 선형화에서 남는 상수항을 빼야 r(zeta)=0 성립
          <br />
          verifier의 pairing 2번: e(W+u*W_omega, [tau]_2) = e(zeta*W + ... + F - E, G_2)
        </p>
      </div>
    </section>
  );
}
