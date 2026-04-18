import StructuredOutputViz from './viz/StructuredOutputViz';
import { StrategyViz, BestPracticesViz } from './viz/StructuredOutputDetailViz';

export default function StructuredOutput() {
  return (
    <section id="structured-output" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        구조화된 출력: JSON · XML · 마크다운
      </h2>
      <div className="not-prose mb-8"><StructuredOutputViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM 출력을 자동화 파이프라인에 연동하려면 파싱 가능한 구조가 필수<br />
          JSON 스키마 명시, XML 태그 분리, 마크다운 헤더 구조화 — 3가지 주요 포맷
        </p>
        <p>
          스키마 없이 "JSON으로 줘"만 지시하면 필드 누락·타입 불일치 빈발<br />
          예시 1개와 필드 설명을 함께 제공하면 구조 준수율 95% 이상 달성 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">구조화 출력 전략</h3>
        <div className="not-prose mb-6"><StrategyViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">구조화 출력 Best Practices</h3>
        <div className="not-prose mb-6"><BestPracticesViz /></div>
        <p className="leading-7">
          요약 1: <strong>예시 1개</strong>가 구조 준수율을 50% → 95%로 올림.<br />
          요약 2: <strong>XML 태그</strong>는 Claude, <strong>JSON mode</strong>는 OpenAI 표준.<br />
          요약 3: 프로덕션에서는 <strong>Pydantic + retry</strong>로 파싱 안정성 확보.
        </p>
      </div>
    </section>
  );
}
