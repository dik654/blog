import SystemPromptViz from './viz/SystemPromptViz';
import { LayerViz, GuardViz } from './viz/SystemPromptDetailViz';

export default function SystemPrompt() {
  return (
    <section id="system-prompt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시스템 프롬프트 설계</h2>
      <div className="not-prose mb-8"><SystemPromptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          시스템 프롬프트 — 모든 대화 턴에서 LLM이 가장 먼저 읽는 고정 지시문<br />
          5개 레이어를 순서대로 쌓아 올리면 일관되고 안전한 응답 유도 가능
        </p>
        <p>
          <strong>핵심 원칙</strong> — 구체적일수록 좋고, 모호하면 LLM이 자의적으로 해석<br />
          Bad: "적절히 응답하세요" → Good: "항상 한국어로, JSON 형식으로, 개인정보 없이"
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">System Prompt 5-Layer 구조</h3>
        <div className="not-prose mb-6"><LayerViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">안전성 프롬프트 (Guardrails)</h3>
        <div className="not-prose mb-6"><GuardViz /></div>
        <p className="leading-7">
          요약 1: System Prompt는 <strong>Role → Context → Task → Rules → Format</strong> 5층 구조.<br />
          요약 2: <strong>XML 태그</strong>로 섹션 구분 (Claude 표준).<br />
          요약 3: Guardrails은 <strong>positive framing + scope limit</strong>이 핵심.
        </p>
      </div>
    </section>
  );
}
