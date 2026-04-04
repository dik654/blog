import VerifyViz from './viz/VerifyViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Verify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">검증 (Verifier)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          e(A,B) = e(α,β) · e(IC_sum, [γ]₂) · e(C, [δ]₂)
          <br />
          IC_sum = ic[0] + Σ public[j]·ic[j+1] — 공개 입력으로 MSM 결합
          <br />
          페어링 3개만으로 완료 — 회로 크기와 무관하게 항상 O(1)
        </p>
        <p className="leading-7">
          증명 크기: A(G1, 64B) + B(G2, 128B) + C(G1, 64B) = 256바이트
          <br />
          e(α,β)는 검증키에 사전 계산 — 매 검증마다 Fp12 곱셈 1회로 대체
          <br />
          Ethereum zk-rollup 검증의 사실상 표준 — precompile로 온체인 검증 가능
        </p>
      </div>
      <div className="not-prose mb-8">
        <VerifyViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          input.is_zero() 체크 — 0인 공개 입력은 IC_sum에 기여 안 함, 스칼라 곱 절약
          <br />
          LHS == RHS는 Fp12 (12개 Fp 원소) 비교 — 빠르지만 페어링 자체가 비용의 대부분
          <br />
          증명 변조 감지: A, B, C 중 하나라도 변경하면 페어링 등식이 깨져 즉시 reject
        </p>
      </div>
    </section>
  );
}
