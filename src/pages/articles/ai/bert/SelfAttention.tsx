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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Head Attention 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BERT-base Multi-Head Attention
// H=12 heads, d_model=768, d_k=d_v=64
//
// Input: X (seq_len=512, d_model=768)
//
// Step 1: 선형 투영으로 Q, K, V 생성 (헤드별 분리)
//   W_Q, W_K, W_V ∈ R^{768 × 768}
//
//   Q = X @ W_Q  → (512, 768)
//   K = X @ W_K  → (512, 768)
//   V = X @ W_V  → (512, 768)
//
//   reshape & split:
//   Q → (12 heads, 512, 64)
//   K → (12 heads, 512, 64)
//   V → (12 heads, 512, 64)
//
// Step 2: 각 헤드마다 Scaled Dot-Product Attention
//   scores_h = Q_h @ K_h.T  → (512, 512)
//   scores_h /= sqrt(64) = 8
//   attn_h = softmax(scores_h)
//   head_h = attn_h @ V_h  → (512, 64)
//
// Step 3: 헤드 결합 및 최종 투영
//   concat = cat(head_1, ..., head_12)  → (512, 768)
//   output = concat @ W_O              → (512, 768)
//
// 파라미터 수 (per block):
//   4 × 768 × 768 = 2,359,296 (W_Q, W_K, W_V, W_O)
//
// 왜 sqrt(d_k)로 나누나?
//   - 차원 증가 시 dot product 값이 커짐
//   - softmax 포화(saturation) 방지
//   - 기울기 안정화`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Attention 패턴 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BERT Attention 헤드가 학습하는 패턴 (Clark et al. 2019)
//
// 1. Syntactic heads (구문론적)
//    - 주어-동사 일치 감지
//    - 수식어-피수식어 관계
//    - 동사-목적어 연결
//
// 2. Semantic heads (의미론적)
//    - 공참조 해소 (coreference)
//    - 명사구 경계 감지
//    - 의미 유사성
//
// 3. Positional heads (위치 기반)
//    - 직전/직후 토큰 집중
//    - 문장 시작/끝 집중
//    - 고정 거리 토큰 참조
//
// 4. Broad heads (전역)
//    - 문장 전체 요약
//    - [CLS], [SEP] 강하게 참조
//
// 헤드 시각화:
//   attention weights를 heatmap으로 시각화
//   bertviz 라이브러리 활용

// 특수 토큰의 attention 패턴:
//   [CLS] → 모든 토큰 균등 참조 (문장 요약)
//   [SEP] → 경계 역할, 문장 구분
//   [MASK] → 주변 컨텍스트 집중
//
// 각 토큰의 출력 임베딩:
//   - 단어 의미 + 문맥 정보 결합
//   - 같은 단어도 상황에 따라 다른 벡터
//   - "bank" (강둑) vs "bank" (은행) 구분
//
// 예시:
//   "I went to the bank to deposit money"
//   → "bank" 벡터는 "money", "deposit" 문맥 반영 → 은행
//
//   "I sat by the bank of the river"
//   → "bank" 벡터는 "river" 문맥 반영 → 강둑`}
        </pre>
        <p className="leading-7">
          요약 1: BERT의 attention은 <strong>12 heads × 12 layers = 144</strong> 병렬 관계 추출기.<br />
          요약 2: 헤드마다 <strong>구문·의미·위치·전역</strong> 다양한 패턴 학습 — 해석 가능성 연구 활발.<br />
          요약 3: <strong>Contextualized embedding</strong>으로 word2vec의 한계 돌파 — 문맥 의존 표현.
        </p>
      </div>
    </section>
  );
}
