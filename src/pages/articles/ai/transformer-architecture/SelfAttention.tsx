import MathText from '@/components/ui/math-text';
import M from '@/components/ui/math';
import AttentionFlowScene from './viz/AttentionFlowScene';
import SelfAttnImplDetailScene from './viz/SelfAttnImplDetailScene';

export default function SelfAttention() {
  return (
    <MathText id="self-attention">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Self-Attention 메커니즘</h2>
      <p className="leading-7 mb-4">
        RNN처럼 왼쪽에서 오른쪽으로 한 칸씩 넘기면 앞 위치 계산이 끝날 때까지 다음 위치가 기다린다<br />
        모든 토큰을 한 행렬 $X$ 로 묶고, 각 위치가 다른 모든 위치에서 필요한 값을 직접 가져오면 기다림이 사라진다<br />
        이 입력 토큰들이 서로의 정보를 가져오는 attention이 self-attention이다
      </p>
      <div className="rounded-lg border p-4 font-mono text-sm mb-6">
        Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>)V
      </div>
      <AttentionFlowScene />
      <ul className="mb-6 space-y-2 text-foreground/75">
        <li className="flex gap-2"><span className="text-foreground font-medium">Q:</span> 현재 위치가 찾는 정보의 모양</li>
        <li className="flex gap-2"><span className="text-foreground font-medium">K:</span> 각 위치가 비교될 때 보이는 모양</li>
        <li className="flex gap-2"><span className="text-foreground font-medium">V:</span> 점수가 정해진 뒤 실제로 가져올 내용</li>
      </ul>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Self-Attention 구현과 복잡도</h3>
        <p className="leading-7">
          $W_Q$, $W_K$, $W_V$ 는 같은 $X$ 에서 세 역할을 따로 뽑는다.
          $QK^T$ 는 모든 위치 쌍의 비교표.
          sqrt(d_k) 로 나누는 이유는 차원이 클수록 내적 값이 커져 softmax 가 포화되기 때문이다.
          이후 $A V$ 가 각 위치의 문맥 벡터를 만든다.
        </p>
        <M display>{'\\underbrace{Q \\cdot K^\\top}_{O(n^2 \\cdot d)} \\xrightarrow{\\div \\sqrt{d_k}} \\underbrace{\\text{softmax}}_{O(n^2)} \\xrightarrow{\\times V} \\underbrace{\\text{output}}_{O(n^2 \\cdot d)}'}</M>
      </div>
      <div className="not-prose my-8"><SelfAttnImplDetailScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Self-Attention은 <strong>행렬 연산 4단계</strong>로 구현 — 간결성이 강점.<br />
          요약 2: <strong>O(n²) 복잡도</strong>가 긴 시퀀스의 병목.<br />
          요약 3: Flash/Sparse Attention 등 <strong>최적화 기법</strong>이 활발히 연구됨.
        </p>
      </div>
    </MathText>
  );
}
