import PreTrainFlowViz from './viz/PreTrainFlowViz';

const MLM_STRATEGY = [
  { pct: '80%', action: '[MASK]로 교체', color: '#6366f1', example: '"the cat [MASK] on"' },
  { pct: '10%', action: '랜덤 토큰 교체', color: '#f59e0b', example: '"the cat apple on"' },
  { pct: '10%', action: '원본 유지', color: '#10b981', example: '"the cat sat on"' },
];

const STATS = [
  { key: '코퍼스', value: 'Wikipedia + BookCorpus (3.3B words)' },
  { key: '배치 크기', value: '256 sequences x 512 tokens' },
  { key: '학습 스텝', value: '1M steps (~40 epochs)' },
  { key: 'Optimizer', value: 'Adam (lr=1e-4, warmup 10k steps)' },
];

export default function PreTraining() {
  return (
    <section id="pre-training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">사전학습: MLM + NSP</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          BERT의 사전학습 — 두 가지 비지도 목적함수로 구성<br />
          <strong>MLM</strong>(Masked Language Model) — 입력 토큰의 15%를 마스킹하고 원본 예측<br />
          <strong>NSP</strong>(Next Sentence Prediction) — 두 문장의 연속 관계를 이진 분류
        </p>
      </div>

      <PreTrainFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 mb-4">
        <h3 className="text-xl font-semibold mb-3">MLM 마스킹 전략 (15% 토큰 대상)</h3>
      </div>
      <div className="space-y-2 mb-6">
        {MLM_STRATEGY.map((s) => (
          <div key={s.pct} className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
            style={{ borderColor: s.color + '40', background: s.color + '08' }}>
            <span className="font-mono font-bold text-sm w-10" style={{ color: s.color }}>{s.pct}</span>
            <span className="text-sm w-36">{s.action}</span>
            <span className="text-xs font-mono text-foreground/50">{s.example}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-xl font-semibold mb-3">학습 설정</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {STATS.map((s) => (
          <div key={s.key} className="rounded-lg border border-border/40 px-3 py-2 flex justify-between">
            <span className="text-foreground/50 font-mono text-xs">{s.key}</span>
            <span className="text-foreground/80 text-xs">{s.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
