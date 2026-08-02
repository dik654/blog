import MathText from '@/components/ui/math-text';
import M from '@/components/ui/math';
import QKVComputationScene from './viz/QKVComputationScene';
import QKVRoleDetailScene from './viz/QKVRoleDetailScene';

export default function QKVComputation() {
  return (
    <MathText id="qkv-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Q, K, V 행렬 생성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          같은 입력 $X$ 에서 곧바로 점수를 만들면 “비교 기준”과 “가져올 내용”이 묶인다<br />
          그래서 $X$ 를 세 학습 가중치 $W_Q$, $W_K$, $W_V$ 로 따로 투영한다<br />
          결과 $Q$, $K$, $V$ 는 같은 token에서 나왔지만 attention 안에서 다른 역할을 맡는다
        </p>
      </div>

      <QKVComputationScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>행렬 곱 계산</h3>
        <div className="rounded-lg border p-3 font-mono text-sm space-y-1 mb-4">
          <div>Q = X(3×6) × W_Q(6×6) = (3×6)</div>
          <div>K = X(3×6) × W_K(6×6) = (3×6)</div>
          <div>V = X(3×6) × W_V(6×6) = (3×6)</div>
        </div>
        <p>
          $W_Q$, $W_K$, $W_V$ 는 학습 파라미터다<br />
          $Q$ 는 찾는 모양, $K$ 는 비교되는 모양, $V$ 는 실제 전달할 내용
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Q/K/V의 역할 구분</h3>
        <p className="leading-7">
          한 token이 다른 token을 고를 때 필요한 정보와, 선택된 뒤 전달할 정보는 다를 수 있다.
          예를 들어 비교 기준은 문법 역할이고, 전달 내용은 의미 특징일 수 있다.
          세 projection을 분리하면 모델이 이 두 축을 따로 학습한다.
          같은 시퀀스에서 세 값이 나오면 self-attention, decoder의 $Q$ 가 encoder의 $K,V$ 를 조회하면 cross-attention이다.
        </p>
        <M display>{'\\underbrace{X \\cdot W_Q}_{\\text{Query (검색어)}} \\;\\;\\; \\underbrace{X \\cdot W_K}_{\\text{Key (인덱스)}} \\;\\;\\; \\underbrace{X \\cdot W_V}_{\\text{Value (데이터)}}'}</M>
      </div>
      <div className="not-prose my-8"><QKVRoleDetailScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Q/K/V는 같은 입력에서 파생된 <strong>세 가지 역할의 투영</strong>.<br />
          요약 2: <strong>정보 검색 비유</strong> — Query로 Key 검색 후 Value 가져옴.<br />
          요약 3: Self-attention에서 <strong>모든 토큰이 모든 토큰</strong>을 조회.
        </p>
      </div>
    </MathText>
  );
}
