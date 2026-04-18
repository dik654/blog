import BottleneckViz from './viz/BottleneckViz';
import S2SLimitsViz from './viz/S2SLimitsViz';
import M from '@/components/ui/math';

export default function Limitations() {
  return (
    <section id="limitations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">한계와 발전</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        긴 문장을 같은 크기 벡터에 압축 → 정보 병목.<br />
        해결: Attention(Bahdanau 2015) → Self-Attention → Transformer → GPT/BERT.
      </p>
      <BottleneckViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Seq2Seq의 구조적 한계</h3>
        <S2SLimitsViz />
        <M display>{'\\underbrace{c \\in \\mathbb{R}^d}_{d=512} \\leftarrow \\text{10단어든 100단어든 같은 크기} \\quad \\Rightarrow \\quad \\text{정보 병목}'}</M>
        <p className="leading-7">
          Bottleneck: 40단어 이상에서 BLEU 20.5로 급락 — <M>{'H(X) > \\log_2(|c|)'}</M>이면 정보 손실 불가피<br />
          순차 처리: LSTM 기반 T=50이면 50번 순차 연산 — Transformer는 <M>{'O(1)'}</M> 병렬
        </p>
        <p className="leading-7">
          요약 1: Seq2Seq의 <strong>4가지 한계</strong>(bottleneck·장기의존성·순차성·해석불가)가 Attention/Transformer 필요성 초래.<br />
          요약 2: <strong>Attention → Transformer → BERT/GPT</strong>의 진화가 모두 Seq2Seq 한계 극복의 산물.<br />
          요약 3: <strong>Encoder-Decoder 패러다임</strong>은 Seq2Seq의 영속적 유산.
        </p>
      </div>
    </section>
  );
}
