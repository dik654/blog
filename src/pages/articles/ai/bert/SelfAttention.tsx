import BertAttnDetailViz from './viz/BertAttnDetailViz';
import M from '@/components/ui/math';

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

      <div className="rounded-xl border bg-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Q / K / V 투영</h3>
        <M display>
          {`Q = X \\, W_Q \\quad (\\underbrace{n \\times 768}_{\\text{input}}) \\times (\\underbrace{768 \\times 64}_{W_Q}) = (n \\times 64)`}
        </M>
        <M display>
          {`K = X \\, W_K \\quad (n \\times 768) \\times (768 \\times 64) = (n \\times 64)`}
        </M>
        <M display>
          {`V = X \\, W_V \\quad (n \\times 768) \\times (768 \\times 64) = (n \\times 64)`}
        </M>
        <p className="text-sm text-muted-foreground mt-3">
          <M>{`n`}</M> = 시퀀스 길이, 헤드당 <M>{`d_k = 768 / 12 = 64`}</M>
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-xl font-semibold mb-3">특수 토큰</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {TOKENS.map((t) => (
          <div key={t.token} className="rounded-xl border p-4 text-center"
            style={{ borderColor: t.color + '40', background: t.color + '08' }}>
            <span className="block font-mono font-bold text-lg mb-1" style={{ color: t.color }}>{t.token}</span>
            <span className="text-sm text-foreground/70">{t.desc}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Head Attention 상세</h3>
        <M display>
          {`\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^T}{\\underbrace{\\sqrt{d_k}}_{=8}}\\right)V \\quad d_k = \\frac{768}{12} = 64`}
        </M>
        <M display>
          {`\\text{MultiHead} = \\underbrace{\\text{Concat}(\\text{head}_1, \\dots, \\text{head}_{12})}_{(512,\\,768)} W_O`}
        </M>
      </div>
      <BertAttnDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: BERT의 attention은 <strong>12 heads × 12 layers = 144</strong> 병렬 관계 추출기.<br />
          요약 2: 헤드마다 <strong>구문·의미·위치·전역</strong> 다양한 패턴 학습 — 해석 가능성 연구 활발.<br />
          요약 3: <strong>Contextualized embedding</strong>으로 word2vec의 한계 돌파 — 문맥 의존 표현.
        </p>
      </div>
    </section>
  );
}
