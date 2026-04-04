import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PLONKish 산술화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          R1CS는 행렬 곱셈 한 가지만 표현 — 덧셈에도 별도 게이트 필요
          <br />
          PLONKish는 5개 selector 계수 조합으로 Add, Mul, Bool, 상수를 하나의 방정식으로 통합
          <br />
          q_L*a + q_R*b + q_O*c + q_M*a*b + q_C = 0 — 계수만 바꾸면 게이트 유형 결정
        </p>
        <p className="leading-7">
          Domain은 n차 단위근 w로 구성된 평가 영역 — n은 2의 거듭제곱
          <br />
          3개 코셋(H, K1*H, K2*H)으로 wire column A, B, C를 분리
          <br />
          K1=2, K2=3 — H의 원소가 아니므로 3n개 tag가 모두 고유
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          pad_to_power_of_two — 더미 게이트(selector 전부 0)로 패딩하여 FFT 호환 보장
          <br />
          selector_polynomials에서 Lagrange 보간 — O(n^2) 비용이지만 교육용에서는 충분
          <br />
          프로덕션에선 NTT 기반 O(n log n) 보간 사용
        </p>
      </div>
    </section>
  );
}
