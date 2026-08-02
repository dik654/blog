import MathText from '@/components/ui/math-text';
import { RoughNotation } from 'react-rough-notation';
import M from '@/components/ui/math';
import TransformerBlockScene from './viz/TransformerBlockScene';
import OverviewDetailScene from './viz/OverviewDetailScene';

export default function Overview() {
  return (
    <MathText id="overview">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">개요</h2>
      <div className="not-prose mb-8"><TransformerBlockScene /></div>
      <p className="leading-7">
        RNN은 토큰을 한 칸씩 처리한다.
        앞 hidden state가 다음 step의 input이 되므로 긴 문장을 병렬로 풀기 어렵다<br />
        토큰 간 관계를 attention으로 직접 계산하면 모든 위치를 한 번에 처리할 수 있다.
        순서는 위치 벡터로 따로 넣고, 관계 계산 뒤 각 위치를 FFN으로 다시 변환한다<br />
        이 stack이 2017년{' '}
        <RoughNotation type="highlight" show color="#fef08a" animationDelay={300}>
          "Attention Is All You Need"
        </RoughNotation>{' '}
        논문에서 Transformer라는 이름으로 정리됐다
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Transformer 전체 구조</h3>
        <p className="leading-7">
          encoder는 source 문장을 읽어 H_enc 라는 memory를 만든다.
          decoder는 미래를 가린 target 문맥에서 query를 만들고, H_enc 를 다시 조회한다.
          각 층 안에서는 attention이 위치 사이 정보를 섞고, FFN이 위치별 표현을 다시 휘게 한다.
          residual과 LayerNorm은 깊은 stack에서 값과 gradient가 흔들리지 않게 붙는 안정화 조각이다.
        </p>
        <M display>{'\\underbrace{\\text{Encoder}(\\times 6)}_{\\text{Self-Attn + FFN}} \\;\\longrightarrow\\; \\underbrace{\\text{Decoder}(\\times 6)}_{\\text{Masked Attn + Cross-Attn + FFN}}'}</M>
      </div>
      <div className="not-prose my-8"><OverviewDetailScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: RNN step 의존을 제거하고 token 쌍 관계를 직접 계산.<br />
          요약 2: 위치 정보 $P$, attention, FFN, residual, LayerNorm이 최소 조각.<br />
          요약 3: GPT/BERT/LLaMA는 이 조각 중 encoder 또는 decoder 쪽을 남긴 변형.
        </p>
      </div>
    </MathText>
  );
}
