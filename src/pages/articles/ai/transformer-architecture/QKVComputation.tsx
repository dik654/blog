import M from '@/components/ui/math';
import QKVComputationViz from './viz/QKVComputationViz';
import QKVRoleDetailViz from './viz/QKVRoleDetailViz';

export default function QKVComputation() {
  return (
    <section id="qkv-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Q, K, V 행렬 생성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          입력 행렬 X(3×6)를 <strong>3개 복사</strong>한다<br />
          각 복사본에 다른 가중치 행렬(W_Q, W_K, W_V)을 곱한다<br />
          결과: Q(3×6), K(3×6), V(3×6) — 같은 크기, 다른 역할
        </p>
      </div>

      <QKVComputationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>행렬 곱 계산</h3>
        <div className="rounded-lg border p-3 font-mono text-sm space-y-1 mb-4">
          <div>Q = X(3×6) × W_Q(6×6) = (3×6)</div>
          <div>K = X(3×6) × W_K(6×6) = (3×6)</div>
          <div>V = X(3×6) × W_V(6×6) = (3×6)</div>
        </div>
        <p>
          W_Q, W_K, W_V는 학습으로 업데이트되는 파라미터<br />
          Q — "내가 찾는 정보" / K — "내가 가진 정보" / V — "실제 전달 정보"
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Q/K/V의 역할 구분</h3>
        <p className="leading-7">
          Q는 "무엇을 찾을까"(검색어), K는 "나는 무엇인가"(인덱스), V는 "내 정보"(데이터).
          같은 입력 X에서 세 가지 다른 가중치 행렬로 투영하여 다른 역할을 부여한다.
          Self-Attention에서는 Q, K, V가 같은 시퀀스에서 파생되고,
          Cross-Attention에서는 Q가 디코더, K/V가 인코더에서 온다.
        </p>
        <M display>{'\\underbrace{X \\cdot W_Q}_{\\text{Query (검색어)}} \\;\\;\\; \\underbrace{X \\cdot W_K}_{\\text{Key (인덱스)}} \\;\\;\\; \\underbrace{X \\cdot W_V}_{\\text{Value (데이터)}}'}</M>
      </div>
      <div className="not-prose my-8"><QKVRoleDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Q/K/V는 같은 입력에서 파생된 <strong>세 가지 역할의 투영</strong>.<br />
          요약 2: <strong>정보 검색 비유</strong> — Query로 Key 검색 후 Value 가져옴.<br />
          요약 3: Self-attention에서 <strong>모든 토큰이 모든 토큰</strong>을 조회.
        </p>
      </div>
    </section>
  );
}
