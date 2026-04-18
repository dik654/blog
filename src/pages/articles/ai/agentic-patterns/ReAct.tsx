import ReActViz from './viz/ReActViz';
import ReActDetailViz from './viz/ReActDetailViz';

export default function ReAct() {
  return (
    <section id="react" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReAct 패턴</h2>
      <div className="not-prose mb-8"><ReActViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ReAct (Yao et al., ICLR 2023) — <strong>Reasoning + Acting 결합 패턴</strong>.<br />
          LLM이 thought + action 번갈아 생성 → tool 호출 → observation → 반복.<br />
          현대 agent framework의 baseline.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">ReAct 프롬프트 구조</h3>
        <div className="not-prose mb-6"><ReActDetailViz /></div>
        <p className="leading-7">
          ReAct: <strong>Thought → Action → Observation → 반복</strong>.<br />
          Yao et al. 2023, most agent frameworks의 기반.<br />
          grounded reasoning + error recovery.
        </p>
      </div>
    </section>
  );
}
