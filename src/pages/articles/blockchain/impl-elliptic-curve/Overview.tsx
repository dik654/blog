import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BN254 곡선 파라미터</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          BN254 타원곡선: y² = x³ + 3 — 가장 단순한 형태 (a=0, b=3)
          <br />
          유한체 Fp 위의 점들이 순환군을 형성 — 이산로그 문제(ECDLP)가 암호학적 안전성 제공
          <br />
          생성자 G = (1, 2): 최소 좌표로 전체 군을 생성
        </p>
        <p className="leading-7">
          Affine 좌표 (x, y): 직관적이지만 덧셈마다 역원(inv) 필요
          <br />
          Jacobian 좌표 (X, Y, Z): (X/Z², Y/Z³) 표현으로 역원 없이 곱셈만으로 연산
          <br />
          최종 출력 시에만 to_affine → inv() 딱 1회
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          a=0이 단순 편의가 아닌 성능 설계 — 더블링 공식에서 +aZ⁴ 항이 사라져 Fp 곱셈 1회 절약
          <br />
          scalar_mul에서 더블링은 256회 호출 — 곱셈 1회 절약이 256회 누적
          <br />
          G1Affine/G1 이중 표현: 저장은 Affine(작음), 연산은 Jacobian(빠름) — 역할 분리
        </p>
      </div>
    </section>
  );
}
