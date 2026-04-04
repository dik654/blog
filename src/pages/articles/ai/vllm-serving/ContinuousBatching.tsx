import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

export default function ContinuousBatching() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Continuous Batching</h3>
      <CodePanel title="Static vs Continuous Batching 비교" code={`Static Batching vs Continuous Batching:

Static Batching (기존):
  배치 내 모든 요청이 완료될 때까지 대기
  Time →  [====Req1====]
          [====Req2==============]  ← 긴 응답
          [====Req3========]
          ↑ Req1 완료되어도 배치 끝까지 GPU 점유

Continuous Batching (vLLM):
  Iteration 단위로 요청을 동적으로 추가/제거
  Time →  [====Req1====][Req4===]
          [====Req2==============]
          [====Req3========][Req5]
          ↑ Req1 완료 즉시 Req4 투입 → GPU 활용률 극대화`} annotations={[
        { lines: [3, 8], color: 'rose', note: 'Static — GPU 유휴 시간 발생' },
        { lines: [10, 15], color: 'emerald', note: 'Continuous — GPU 활용률 극대화' },
      ]} />

      <CitationBlock source="Yu et al., OSDI 2022 — Orca" citeKey={6} type="paper">
        <p className="italic">
          "Orca proposes iteration-level scheduling, where the serving system makes scheduling
          decisions at each generation iteration instead of at the request level. This enables
          continuous batching — requests can join and leave a running batch at any iteration."
        </p>
        <p className="mt-2 text-xs">
          Continuous Batching의 원천 — Orca 논문(OSDI 2022). vLLM은 이 개념을
          PagedAttention과 결합하여 메모리 효율 + 배칭 효율 동시 달성.
          V1의 Chunked Prefill은 더 나아가 Prefill과 Decode를 인터리빙
        </p>
      </CitationBlock>
    </>
  );
}
