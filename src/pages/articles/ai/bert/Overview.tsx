import BERTPipelineViz from './viz/BERTPipelineViz';

const MILESTONES = [
  { year: '2018-02', name: 'ELMo', color: '#f59e0b', desc: '양방향 LSTM 기반 문맥 임베딩. 사전학습 후 feature로 사용.' },
  { year: '2018-06', name: 'GPT-1', color: '#10b981', desc: '단방향(left-to-right) Transformer 디코더. 파인튜닝 패러다임 도입.' },
  { year: '2018-10', name: 'BERT', color: '#6366f1', desc: '양방향 Transformer 인코더. MLM으로 양방향 문맥을 동시에 학습.' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BERT 등장 배경</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>BERT</strong>(Bidirectional Encoder Representations from Transformers) — 2018년 Google AI가 발표한 사전학습 언어 모델<br />
          ELMo의 양방향성과 GPT의 Transformer 구조를 결합<br />
          <strong>마스킹 기반 양방향 인코딩</strong>이라는 혁신적 학습 방식으로 NLP 벤치마크 11개에서 동시에 SOTA(State-of-the-Art, 최고 성능) 달성
        </p>
      </div>

      <div className="space-y-2 mb-8">
        {MILESTONES.map((m) => (
          <div key={m.name} className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
            style={{ borderColor: m.color + '40', background: m.color + '08' }}>
            <span className="text-xs font-mono w-20 flex-shrink-0" style={{ color: m.color }}>{m.year}</span>
            <span className="font-semibold text-sm w-16" style={{ color: m.color }}>{m.name}</span>
            <span className="text-sm text-foreground/70">{m.desc}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BERT 입력 파이프라인</h3>
        <p className="leading-7">
          BERT — WordPiece 토크나이저(서브워드 단위로 분할하는 토크나이저)로 서브워드 분할<br />
          Token + Position + Segment 3종 임베딩을 합산<br />
          12개(base) 또는 24개(large) Transformer 레이어에 입력
        </p>
      </div>
      <BERTPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BERT 모델 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BERT-base vs BERT-large
//
// ┌──────────────────┬──────────┬──────────┐
// │   파라미터       │ BERT-base│BERT-large│
// ├──────────────────┼──────────┼──────────┤
// │ Transformer 층   │    12    │    24    │
// │ Hidden 크기      │    768   │   1024   │
// │ Attention 헤드   │    12    │    16    │
// │ Feed-forward     │   3072   │   4096   │
// │ 총 파라미터      │   110M   │   340M   │
// │ Max seq length   │    512   │    512   │
// │ Vocabulary       │  30,522  │  30,522  │
// └──────────────────┴──────────┴──────────┘
//
// 임베딩 레이어:
//   Token Embeddings:    vocab_size × hidden (30,522 × 768)
//   Position Embeddings: 512 × 768 (학습 가능)
//   Segment Embeddings:  2 × 768 (문장 A, B 구분)
//
//   Input = TokenEmb + PositionEmb + SegmentEmb
//
// Position Embedding 방식:
//   - Transformer 원논문: sinusoidal (고정)
//   - BERT: 학습 가능한 임베딩
//   - 최대 512 위치까지
//   - 512 초과 시 truncation 필요

// Transformer Encoder Block:
//   1. Multi-Head Self-Attention
//   2. Add & Norm (residual + LayerNorm)
//   3. Position-wise Feed-Forward
//   4. Add & Norm
//
// 출력: 각 토큰 위치마다 768차원 벡터 (contextualized embedding)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">BERT 설계 철학</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 사전학습 + 파인튜닝 패러다임
//
// 기존 NLP 방식 (2017 이전):
//   - 태스크별 전용 아키텍처 설계
//   - 제로에서 학습 (small data)
//   - feature engineering 필수
//
// BERT 방식:
//   1. 대규모 코퍼스에서 사전학습 (3.3B words)
//   2. 태스크별 가벼운 헤드만 추가
//   3. 전체 모델 fine-tuning
//   4. 태스크 독립적 표현 학습
//
// 양방향성의 가치:
//   ELMo:  좌→우 LSTM + 우→좌 LSTM (concat)
//   GPT:   좌→우만 (decoder)
//   BERT:  완전 양방향 (MLM으로 가능)
//
// 예시 문장: "The [MASK] sat on the mat"
//   단방향: "The" 만 보고 예측 → 불확실
//   양방향: "sat on the mat" 도 봄 → "cat" 명확
//
// 혁신:
//   - 모든 토큰이 모든 토큰 참조
//   - 문맥적 임베딩 (같은 단어도 상황마다 다른 벡터)
//   - 한 모델이 11개 태스크 SOTA

// GLUE 벤치마크 성과 (2018):
//   - 이전 SOTA: 68.9
//   - BERT-large: 80.5 (+11.6 point)
//   - 인간 수준에 근접
//
// 영향:
//   - RoBERTa, ALBERT, ELECTRA 등 파생 모델
//   - XLM-R로 다국어 확장
//   - BioBERT, ClinicalBERT 등 도메인 특화
//   - T5, BART로 encoder-decoder 확장`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Transformer Encoder 12/24층</strong> - BERT는 Attention 기반 깊은 문맥 인코더.<br />
          요약 2: <strong>양방향 MLM</strong>이 핵심 혁신 — GPT의 단방향과 근본적 차이.<br />
          요약 3: "사전학습 + 파인튜닝" 패러다임 확립 — 이후 모든 NLP의 표준.
        </p>
      </div>
    </section>
  );
}
