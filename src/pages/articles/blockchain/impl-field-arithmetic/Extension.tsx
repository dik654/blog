import ExtViz from './viz/ExtViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Extension({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="extension" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확장체 Fp2 → Fp6 → Fp12</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          BN254 G2 점의 좌표는 Fp 하나로 표현 불가 — Fp2(이차 확장체)가 필요
          <br />
          Fp2 = a0 + a1*u (u^2 = -1) — 복소수와 동일한 구조
          <br />
          Fp6 = Fp2 위의 3차 확장, Fp12 = Fp6 위의 2차 확장
        </p>
        <p className="leading-7">
          타워 구조: Fp → Fp2 → Fp6 → Fp12 (2 x 3 x 2 = 12차)
          <br />
          모든 레벨에서 Karatsuba 트릭으로 곱셈 횟수를 절감
          <br />
          페어링(pairing) e(G1, G2)의 결과가 Fp12 원소
        </p>
      </div>
      <div className="not-prose mb-8">
        <ExtViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          역원 계산의 연쇄 위임: Fp12 → Fp6 → Fp2 → Fp
          <br />
          각 층에서 conjugate + norm으로 차원을 하나씩 내림
          <br />
          최종적으로 Fp의 Fermat 역원(a^(p-2))에 도달 — 복잡한 12차 역원이 소수체 역원으로 환원
        </p>
      </div>
    </section>
  );
}
