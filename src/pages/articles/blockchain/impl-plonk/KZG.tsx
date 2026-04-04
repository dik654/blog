import KzgViz from './viz/KzgViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function KZG({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="kzg" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KZG 다항식 커밋먼트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Groth16은 회로마다 새로운 CRS가 필요 — 회로 변경 시 재setup 필수
          <br />
          KZG는 universal SRS — tau 하나로 어떤 다항식에도 commit 가능
          <br />
          PLONK의 핵심 빌딩 블록: wire, selector, permutation 다항식 모두 KZG로 commit
        </p>
        <p className="leading-7">
          commit(f) = f(tau)를 커브 포인트로 인코딩 — 64바이트 하나로 다항식 전체 표현
          <br />
          open: f(z)=y 증명 — 몫 q(x) = (f(x)-y)/(x-z)를 commit하면 증거 pi
          <br />
          verify: e(pi, [tau]_2) == e(C - [y]_1 + z*pi, G_2) — 페어링 2번으로 검증
        </p>
      </div>
      <div className="not-prose mb-8">
        <KzgViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          2-pairing 최적화 — naive 형태는 G2에서 scalar_mul(z)이 필요하지만, 변환하면 G1에서만 처리
          <br />
          commit의 동형 속성: commit(f) + commit(g) = commit(f+g) — prover의 선형화 트릭 기반
          <br />
          batch_open/verify — 다중 점을 한 번에 처리, vanishing poly + interpolation으로 일반화
        </p>
      </div>
    </section>
  );
}
