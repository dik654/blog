export default function StaticVsContextualViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 340" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Static vs Contextual Embedding</text>

        {/* Static */}
        <rect x={20} y={48} width={290} height={280} rx={10}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={2} />
        <text x={165} y={70} textAnchor="middle" fontSize={14} fontWeight={700} fill="#3b82f6">
          Static (Word2Vec, GloVe)
        </text>
        <text x={165} y={86} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          2013 ~ 2017
        </text>
        <line x1={30} y1={94} x2={300} y2={94} stroke="#3b82f6" strokeOpacity={0.3} strokeWidth={0.8} />

        <text x={35} y={116} fontSize={11} fontWeight={700} fill="var(--foreground)">원리</text>
        <text x={35} y={132} fontSize={10} fill="var(--muted-foreground)">• 단어별 고정된 단일 벡터</text>
        <text x={35} y={148} fontSize={10} fill="var(--muted-foreground)">• 맥락 무관, 사전처럼 lookup</text>

        <text x={35} y={176} fontSize={11} fontWeight={700} fill="var(--foreground)">예시 — "bank"</text>
        <rect x={35} y={186} width={260} height={58} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={45} y={204} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          "강가(river bank)" → v(bank) = [0.21, ...]
        </text>
        <text x={45} y={220} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          "은행(bank)" → v(bank) = [0.21, ...]
        </text>
        <text x={45} y={236} fontSize={10} fontFamily="monospace" fontWeight={700} fill="#ef4444">
          같은 벡터 = 다의어 모호
        </text>

        <text x={35} y={268} fontSize={11} fontWeight={700} fill="#10b981">장점</text>
        <text x={35} y={284} fontSize={10} fill="var(--muted-foreground)">• 빠름, 단순, pre-training 쉬움</text>
        <text x={35} y={300} fontSize={10} fill="var(--muted-foreground)">• 의미 관계 선형 구조</text>
        <text x={35} y={316} fontSize={10} fill="var(--muted-foreground)">• ~50K 단어 × 300 dim = 60MB</text>

        {/* Contextual */}
        <rect x={330} y={48} width={290} height={280} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={2} />
        <text x={475} y={70} textAnchor="middle" fontSize={14} fontWeight={700} fill="#10b981">
          Contextual (BERT, GPT)
        </text>
        <text x={475} y={86} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          2018 ~
        </text>
        <line x1={340} y1={94} x2={610} y2={94} stroke="#10b981" strokeOpacity={0.3} strokeWidth={0.8} />

        <text x={345} y={116} fontSize={11} fontWeight={700} fill="var(--foreground)">원리</text>
        <text x={345} y={132} fontSize={10} fill="var(--muted-foreground)">• 문장마다 달라지는 동적 벡터</text>
        <text x={345} y={148} fontSize={10} fill="var(--muted-foreground)">• Attention으로 주변 맥락 반영</text>

        <text x={345} y={176} fontSize={11} fontWeight={700} fill="var(--foreground)">예시 — "bank"</text>
        <rect x={345} y={186} width={260} height={58} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={355} y={204} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          "river bank" → v = [0.84, 0.12, ...]
        </text>
        <text x={355} y={220} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          "central bank" → v = [0.03, 0.91, ...]
        </text>
        <text x={355} y={236} fontSize={10} fontFamily="monospace" fontWeight={700} fill="#10b981">
          다른 벡터 = 다의어 해결
        </text>

        <text x={345} y={268} fontSize={11} fontWeight={700} fill="#ef4444">단점</text>
        <text x={345} y={284} fontSize={10} fill="var(--muted-foreground)">• 느림 (매번 forward pass)</text>
        <text x={345} y={300} fontSize={10} fill="var(--muted-foreground)">• 거대 모델 필요 (110M+)</text>
        <text x={345} y={316} fontSize={10} fill="var(--muted-foreground)">• 저장 불가 (inference 필요)</text>
      </svg>
    </div>
  );
}
