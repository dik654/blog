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
    </section>
  );
}
