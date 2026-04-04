import { CitationBlock } from '@/components/ui/citation';

const TIMELINE = [
  { year: '2017', method: 'RLHF', desc: 'RM + PPO', problem: '4모델, 불안정', color: '#ef4444' },
  { year: '2023.05', method: 'DPO', desc: 'RM 제거', problem: '2단계 유지', color: '#6366f1' },
  { year: '2022.12', method: 'CAI', desc: 'AI 피드백', problem: '강한 모델 필요', color: '#10b981' },
  { year: '2024.03', method: 'ORPO', desc: '1단계 통합', problem: '성능 차이', color: '#f59e0b' },
  { year: '2024.02', method: 'KTO', desc: '이진 피드백', problem: '경계 설정', color: '#8b5cf6' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LLM 정렬 기법의 진화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 질문</strong> — 사전학습된 LLM을 인간 의도에 맞게 정렬하는 가장 효율적인 방법은?<br />
          RLHF(2017)에서 시작된 정렬 연구는 복잡도를 줄이는 방향으로 진화
        </p>
      </div>

      <div className="not-prose overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">연도</th>
              <th className="text-left py-2 px-3">기법</th>
              <th className="text-left py-2 px-3">핵심 개선</th>
              <th className="text-left py-2 px-3">남은 한계</th>
            </tr>
          </thead>
          <tbody>
            {TIMELINE.map(t => (
              <tr key={t.method} className="border-b border-border/40">
                <td className="py-2 px-3 font-mono text-xs">{t.year}</td>
                <td className="py-2 px-3 font-semibold" style={{ color: t.color }}>{t.method}</td>
                <td className="py-2 px-3">{t.desc}</td>
                <td className="py-2 px-3 text-muted-foreground">{t.problem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Ouyang et al., 2022 — InstructGPT" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2203.02155">
          <p className="italic text-sm">
            "Making language models bigger does not inherently make them better at following
            a user's intent. We show an approach for aligning language models with user intent
            on a wide range of tasks by fine-tuning with human feedback."
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
