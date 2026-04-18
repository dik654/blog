import { CitationBlock } from '@/components/ui/citation';
import ECODPipelineViz from './viz/ECODPipelineViz';
import AnomalyCompareDetailViz from './viz/AnomalyCompareDetailViz';
import ECDFDetailViz from './viz/ECDFDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECOD 개요</h2>
      <div className="not-prose mb-8"><ECODPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ECOD</strong>(Empirical Cumulative distribution-based Outlier Detection) — 학습이 필요 없는(training-free) 비지도 이상 탐지 알고리즘<br />
          경험적 누적 분포 함수(ECDF, 관측 데이터로부터 직접 추정한 CDF)를 활용<br />
          각 데이터 포인트가 얼마나 <strong>"꼬리(tail)"</strong>에 위치하는지 측정
        </p>

        <CitationBlock
          source="Li et al., TKDE 2022 — ECOD"
          citeKey={1} type="paper"
          href="https://arxiv.org/abs/2201.00382"
        >
          <p className="italic">
            "ECOD is a novel outlier detection method that uses empirical cumulative
            distribution functions per dimension. It is hyperparameter-free, easy to
            interpret, and highly scalable."
          </p>
          <p className="mt-2 text-xs">
            ECOD — 하이퍼파라미터 없이 해석이 쉬우며 대규모 데이터에 확장 가능
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 아이디어</h3>
        <ul>
          <li><strong>비지도 학습</strong> — 라벨 없이 데이터 분포만으로 이상치를 탐지</li>
          <li><strong>차원별 독립 분석</strong> — 각 피처의 ECDF를 개별 계산</li>
          <li><strong>꼬리 확률 기반</strong> — 분포의 극단에 위치할수록 높은 이상치 점수</li>
          <li><strong>하이퍼파라미터 프리</strong> — k, contamination 등 튜닝 불필요</li>
        </ul>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">이상 탐지 알고리즘 계보</h3>
        <div className="not-prose"><AnomalyCompareDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 ECDF 기반인가</h3>
        <div className="not-prose"><ECDFDetailViz /></div>
        <p className="leading-7">
          요약 1: ECOD는 <strong>training-free + hyperparameter-free</strong> — 즉시 사용 가능.<br />
          요약 2: <strong>ECDF 꼬리 확률 + -log 변환</strong>으로 이상 점수 생성.<br />
          요약 3: 대규모 데이터(n &gt; 100K)에서 <strong>거리 기반 방법보다 유리</strong>.
        </p>
      </div>
    </section>
  );
}
