import CodePanel from '@/components/ui/code-panel';

const attentionCode = `# Multi-Head Self-Attention in BERT
# H=12 heads, d_model=768, d_k=d_v=64

Q = X @ W_Q   # (seq_len, 768) @ (768, 64) → (seq_len, 64)
K = X @ W_K   # same shape
V = X @ W_V   # same shape

# Scaled dot-product attention per head
scores = Q @ K.T / sqrt(64)   # (seq_len, seq_len)
attn = softmax(scores, dim=-1)
head_i = attn @ V              # (seq_len, 64)

# 12 heads concat → linear projection
concat = cat(head_1, ..., head_12)  # (seq_len, 768)
output = concat @ W_O               # (seq_len, 768)`;

const annotations = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: 'Q, K, V 투영: 768→64 per head' },
  { lines: [9, 11] as [number, number], color: 'emerald' as const, note: 'Scaled Dot-Product Attention' },
  { lines: [14, 15] as [number, number], color: 'violet' as const, note: '12개 헤드 결합 후 출력 투영' },
];

const TOKENS = [
  { token: '[CLS]', color: '#6366f1', desc: '문장 전체의 집약 표현. 분류 태스크의 입력으로 사용.' },
  { token: '[SEP]', color: '#10b981', desc: '문장 경계 구분. 두 문장 입력 시 A와 B를 분리.' },
  { token: '[MASK]', color: '#f59e0b', desc: '사전학습 시 가려진 토큰. 모델이 예측해야 할 대상.' },
];

export default function SelfAttention() {
  return (
    <section id="self-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Self-Attention과 특수 토큰</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          BERT — Transformer 인코더의 <strong>Multi-Head Self-Attention</strong>을 12개 레이어에 걸쳐 양방향으로 적용<br />
          GPT와 달리 마스킹 없이 모든 위치가 모든 위치를 참조<br />
          좌우 문맥을 동시에 반영
        </p>
      </div>

      <CodePanel title="BERT Multi-Head Self-Attention" code={attentionCode} annotations={annotations} />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 mb-4">
        <h3 className="text-xl font-semibold mb-3">특수 토큰</h3>
      </div>
      <div className="space-y-2">
        {TOKENS.map((t) => (
          <div key={t.token} className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
            style={{ borderColor: t.color + '40', background: t.color + '08' }}>
            <span className="font-mono font-bold text-sm w-16" style={{ color: t.color }}>{t.token}</span>
            <span className="text-sm text-foreground/70">{t.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
