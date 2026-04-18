import { RoughNotation } from 'react-rough-notation';
import M from '@/components/ui/math';
import TransformerBlockViz from './viz/TransformerBlockViz';
import OverviewDetailViz from './viz/OverviewDetailViz';

export default function Overview() {
  return (
    <section id="overview">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">개요</h2>
      <div className="not-prose mb-8"><TransformerBlockViz /></div>
      <p className="leading-7">
        Transformer — 2017년{' '}
        <RoughNotation type="highlight" show color="#fef08a" animationDelay={300}>
          "Attention Is All You Need"
        </RoughNotation>{' '}
        논문에서 제안된 아키텍처<br />
        기존 RNN/LSTM 기반 시퀀스 모델의 한계를 극복<br />
        병렬 처리가 가능하고, 긴 시퀀스에서도 효과적으로 의존성을 포착
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Transformer 전체 구조</h3>
        <p className="leading-7">
          Encoder 6층 + Decoder 6층이 원 논문의 기본 구성.
          각 층은 Self-Attention + FFN + Residual + LayerNorm으로 이루어진다.
          RNN의 순차 처리를 제거하고, Attention만으로 시퀀스 전체를 병렬 처리한다.
        </p>
        <M display>{'\\underbrace{\\text{Encoder}(\\times 6)}_{\\text{Self-Attn + FFN}} \\;\\longrightarrow\\; \\underbrace{\\text{Decoder}(\\times 6)}_{\\text{Masked Attn + Cross-Attn + FFN}}'}</M>
      </div>
      <div className="not-prose my-8"><OverviewDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>Encoder 6 + Decoder 6</strong> 층 구조가 원 논문 기본.<br />
          요약 2: <strong>No Recurrence</strong>, Attention만으로 시퀀스 처리 — 병렬화 혁명.<br />
          요약 3: GPT/BERT/LLaMA 모두 Transformer의 <strong>encoder 또는 decoder 부분</strong>.
        </p>
      </div>
    </section>
  );
}
