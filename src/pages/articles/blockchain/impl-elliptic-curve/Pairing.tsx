import PairingViz from './viz/PairingViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Pairing({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="pairing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Miller 루프 &amp; 최종 지수화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Optimal Ate 페어링: G1의 점 P + G2의 점 Q → GT(Fp12*) 원소 출력
          <br />
          핵심 성질: e(aP, bQ) = e(P,Q)^(ab) — ZK 증명 검증에서 다항식 동치를 곡선 위에서 확인
          <br />
          파이프라인: to_affine → Miller loop → final exponentiation
        </p>
        <p className="leading-7">
          Miller loop: NAF(|6u+2|)를 MSB→LSB로 64회 순회, 매번 line_double + 조건부 line_add
          <br />
          line function 결과는 sparse Fp12 — 0이 아닌 계수 3개만이라 곱셈 비용 절반
          <br />
          최종 지수화: f^((p¹²-1)/r) = easy part(conjugate, frob) + hard part(761비트 pow)
        </p>
      </div>
      <div className="not-prose mb-8">
        <PairingViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          line function이 Affine 좌표를 사용하는 이유 — 교육적 명확성 우선, Jacobian은 공식이 복잡
          <br />
          프로덕션에서는 Jacobian + sparse multiplication으로 성능 2배 향상 가능
          <br />
          Frobenius 보정이 BN254 전용인 점 — BLS12-381 등 다른 곡선에서는 보정 방식이 다름
        </p>
      </div>
    </section>
  );
}
