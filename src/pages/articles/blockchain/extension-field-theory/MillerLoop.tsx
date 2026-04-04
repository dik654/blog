import MathTex from '@/components/ui/math';
import MillerLoopViz from './viz/MillerLoopViz';

export default function MillerLoop() {
  return (
    <section id="miller-loop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Miller Loop 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          페어링의 첫 번째 단계.
          G2 점 Q와 G1 점 P를 입력받아 <MathTex>{'\\mathbb{F}_{p^{12}}'}</MathTex> 원소 f를 출력한다.
        </p>
        <p>
          핵심 아이디어: 스칼라 곱 kP가 "k의 비트를 순회하며 점을 누적"이듯,
          <br />
          Miller Loop는 r의 비트를 순회하며 <strong>Fp¹² 값을 누적</strong>한다.
          <br />
          매 더블링마다 접선을 P에서 평가해서 f에 곱하면, P와 Q의 기하학적 관계가 f에 인코딩된다.
        </p>
      </div>
      <div className="not-prose"><MillerLoopViz /></div>
    </section>
  );
}
