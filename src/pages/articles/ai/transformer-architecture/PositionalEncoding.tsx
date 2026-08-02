import MathText from '@/components/ui/math-text';
import M from '@/components/ui/math';
import PositionalEncodingScene from './viz/PositionalEncodingScene';
import PosEncDetailScene from './viz/PosEncDetailScene';

export default function PositionalEncoding() {
  return (
    <MathText id="positional-encoding">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Positional Encoding</h2>
      <p className="leading-7 mb-4">
        attention은 모든 토큰 쌍을 한 번에 비교한다<br />
        순서를 따로 넣지 않으면 같은 토큰 묶음의 순열을 구분하기 어렵다<br />
        그래서 토큰 embedding에 위치 정보를 담은 벡터 $P$ 를 더한다
      </p>
      <div className="rounded-lg border p-4 font-mono text-sm space-y-1 mb-6">
        <div>PE(pos, 2i) = sin(pos / 10000<sup>2i/d</sup>)</div>
        <div>PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d</sup>)</div>
      </div>
      <PositionalEncodingScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Positional Encoding 대안들</h3>
        <p className="leading-7">
          Sinusoidal PE에서 시작하여 Learned, Relative, RoPE, ALiBi로 진화했다.
          RoPE는 복소수 회전으로 Q·K^T 내적에서 상대 위치가 자연스럽게 등장한다.
          ALiBi는 PE 자체를 제거하고 attention score에 선형 bias를 더하는 방식이다.
        </p>
        <M display>{'\\underbrace{\\text{Sinusoidal}}_{\\text{2017}} \\;\\to\\; \\underbrace{\\text{Learned}}_{\\text{BERT}} \\;\\to\\; \\underbrace{\\text{Relative}}_{\\text{T5}} \\;\\to\\; \\underbrace{\\text{RoPE}}_{\\text{LLaMA}} \\;\\to\\; \\underbrace{\\text{ALiBi}}_{\\text{BLOOM}}'}</M>
      </div>
      <div className="not-prose my-8"><PosEncDetailScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: PE는 <strong>sinusoidal → learned → relative → RoPE → ALiBi</strong>로 진화.<br />
          요약 2: 현대 LLM은 <strong>RoPE</strong> 주류 — 상대 위치 자연스럽게 표현.<br />
          요약 3: 긴 문맥 처리를 위한 <strong>YaRN, NTK scaling</strong> 등 active research 영역.
        </p>
      </div>
    </MathText>
  );
}
