import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZK-friendly 해시 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          SHA-256 — 비트 연산(AND, XOR, ROTATE) 기반. R1CS로 변환하면 ~25,000개 제약
          <br />
          Poseidon — 유한체 산술(덧셈, 곱셈, 거듭제곱)만 사용. R1CS 제약 ~250개
          <br />
          100배 차이가 ZK 증명 생성 시간을 좌우 — Poseidon이 ZK 표준 해시로 자리잡은 이유
        </p>
        <p className="leading-7">
          구조: Sponge(absorb → permutation → squeeze) + HADES 설계(full + partial rounds)
          <br />
          BN254 Fr 위에서 동작 — Fr.mul, Fr.pow만으로 해시 구현 가능
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Partial round의 S-box가 첫 원소에만 적용되는 것이 핵심 최적화
          <br />
          보안 증명상 57개 partial round는 full round 8개와 동등한 안전 마진 제공
          <br />
          제약 수: full 8 x 9 + partial 57 x 3 = 72 + 171 = 243개 (SHA-256의 1/100)
        </p>
      </div>
    </section>
  );
}
