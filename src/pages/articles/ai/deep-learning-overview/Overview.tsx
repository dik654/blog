import { RoughNotation } from 'react-rough-notation';
import DepthVsWidthViz from './viz/DepthVsWidthViz';
import DLOverviewViz from './viz/DLOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 깊은 네트워크인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          얕은 네트워크(2~3층) — 이론상 어떤 함수든 근사 가능(만능 근사 정리)<br />
          그러나{' '}
          <RoughNotation type="highlight" show color="#fef08a" animationDelay={300}>
            필요한 뉴런 수가 기하급수적으로 증가
          </RoughNotation>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">깊이의 효율성</h3>
        <p>
          5×5 특징 조합 표현 시:<br />
          <strong>넓은 1층</strong> — 최대 2²⁵ = 33,554,432개 뉴런 필요<br />
          <strong>깊은 5층</strong> — 각 층 5개 뉴런이면 충분 (총 25개)<br />
          깊이가 파라미터 효율을 극적으로 개선
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">계층적 추상화</h3>
        <p>
          층이 깊을수록 추상 수준이 상승:<br />
          1층: 엣지(edge, 경계선) 감지<br />
          2층: 엣지를 조합 → 도형(코너, 곡선)<br />
          3층: 도형을 조합 → 텍스처(패턴)<br />
          4~5층: 텍스처 조합 → 물체(얼굴, 자동차)<br />
          각 층이 이전 층의 출력을 재조합 — 복잡한 함수를 적은 파라미터로 표현 가능
        </p>
      </div>
      <div className="not-prose mt-8">
        <DepthVsWidthViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Deep Learning의 본질 + 깊이의 수학적 근거</h3>
      </div>
      <div className="not-prose mt-4 mb-4">
        <DLOverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Deep Learning의 본질은 <strong>representation learning</strong> — 자동 특징 학습.<br />
          요약 2: <strong>깊이가 지수적 효율</strong> — 수학적으로 증명됨.<br />
          요약 3: compositional 구조를 가진 <strong>현실 데이터에 특히 효과적</strong>.
        </p>
      </div>
    </section>
  );
}
