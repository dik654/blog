/**
 * AI 시스템 이상 분류 — model · input · output · agent loop · cost.
 */
export default function AiAnomalyTaxonomyViz() {
  const W = 720;
  const H = 380;

  const types = [
    {
      name: 'Model performance', color: '#3b82f6', x: 30, y: 60,
      examples: ['accuracy 급락', 'latency p99 spike', 'OOM error 증가'],
    },
    {
      name: 'Input drift', color: '#10b981', x: 250, y: 60,
      examples: ['평소 query 분포 변화', '비정상 길이 input', '언어 / encoding 이상'],
    },
    {
      name: 'Output anomaly', color: '#f59e0b', x: 470, y: 60,
      examples: ['hallucination 증가', 'refusal rate spike', '특정 token 반복'],
    },
    {
      name: 'Prompt injection', color: '#ef4444', x: 30, y: 220,
      examples: ['system prompt 탈취 시도', 'jailbreak pattern', '도구 오용 (excessive tool call)'],
    },
    {
      name: 'Agent loop', color: '#8b5cf6', x: 250, y: 220,
      examples: ['무한 루프 (같은 도구 반복)', 'context 폭증 (긴 conversation)', '의사결정 지연 패턴'],
    },
    {
      name: 'Cost / quota', color: '#ec4899', x: 470, y: 220,
      examples: ['일일 token 폭증', '비싼 모델 routing 증가', 'cache hit rate 급락'],
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">AI 시스템 이상 6 분류 — 무엇을 봐야 하는가</text>

        {types.map((t) => (
          <g key={t.name}>
            <rect x={t.x} y={t.y} width={220} height={130} rx={8}
              fill={t.color} fillOpacity={0.06} stroke={t.color} strokeWidth={1.4} />
            <text x={t.x + 110} y={t.y + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={t.color}>{t.name}</text>
            {t.examples.map((ex, i) => (
              <g key={i}>
                <rect x={t.x + 12} y={t.y + 38 + i * 28} width={196} height={24} rx={3}
                  fill={t.color} fillOpacity={0.10} stroke={t.color} strokeWidth={0.5} />
                <text x={t.x + 22} y={t.y + 54 + i * 28} fontSize={9} fill="var(--muted-foreground)">• {ex}</text>
              </g>
            ))}
          </g>
        ))}

        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          기존 APM 으로 안 잡히는 영역 — input / output / agent 행동 패턴이 핵심 신호
        </text>
      </svg>
    </div>
  );
}
