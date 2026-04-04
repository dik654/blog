import LogicGateViz from './viz/LogicGateViz';

export default function LogicGates() {
  return (
    <section id="logic-gates" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">논리 회로 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          퍼셉트론 하나로 기본 논리 게이트 구현 가능<br />
          가중치와 임계값만 바꾸면 AND, OR, NAND 등 다른 연산으로 전환
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">게이트별 파라미터</h3>
        <p>
          <strong>AND</strong> — w₁=0.5, w₂=0.5, b=−0.7 → 두 입력 모두 1일 때만 통과<br />
          <strong>OR</strong> — w₁=0.5, w₂=0.5, b=−0.2 → 하나만 1이어도 통과<br />
          <strong>NAND</strong> — w₁=−0.5, w₂=−0.5, b=0.7 → AND의 반전
        </p>
      </div>
      <div className="mt-8">
        <LogicGateViz />
      </div>
    </section>
  );
}
