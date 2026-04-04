import CoTViz from './viz/CoTViz';

export default function ChainOfThought() {
  return (
    <section id="chain-of-thought" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Chain-of-Thought & 추론 유도</h2>
      <div className="not-prose mb-8"><CoTViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Chain-of-Thought(CoT)</strong> — LLM이 최종 답 전에 중간 추론 과정을 생성하도록 유도하는 기법<br />
          산술·논리·상식 추론 등 복잡한 문제에서 정확도를 크게 향상
        </p>
        <p>
          Zero-shot CoT — "Let's think step by step" 한 줄 추가만으로 추론 유도 (Kojima et al., 2022)<br />
          Few-shot CoT — 풀이 과정이 포함된 예시 제공으로 더 안정적인 추론<br />
          Self-Consistency — 동일 질문을 여러 번 실행, 다수결로 최종 답 선택
        </p>
      </div>
    </section>
  );
}
