import { Link } from "react-router-dom";
import OptimizerViz from "./viz/OptimizerViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Optimizer는 gradient를 parameter update로 바꾸는 규칙이다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">Backpropagation이 계산한 gradient는 “현재 위치에서 어느 쪽으로 loss가 커지는가”라는 local sensitivity입니다. 그 반대 방향으로 얼마나 움직일지, 과거 gradient를 얼마나 기억할지, 좌표마다 scale을 다르게 할지를 정하는 쪽이 optimizer입니다. Gradient 계산과 parameter update는 같은 일이 아닙니다.</p>
        <p>이 글은 <Link to="/ai/math-functions-derivatives-gradients#partial-gradient">gradient</Link>, <Link to="/ai/math-probability-expectation-variance#gradient-noise">stochastic estimate와 variance</Link>, <Link to="/ai/math-optimization-convexity#gradient-descent">convexity·smoothness·convergence 전제</Link>를 이미 정본으로 설명한 뒤 이어집니다. 용어가 낯설다면 각 링크를 먼저 읽고 돌아올 수 있습니다.</p>
      </div>
      <OptimizerViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none"><h3>비교 질문을 먼저 고정한다</h3><p>Optimizer를 “몇 epoch 만에 수렴했다”는 숫자 하나로 순위 매길 수는 없습니다. 같은 initial checkpoint·data order·effective batch·schedule·precision·training budget에서 training objective, validation metric, wall-clock, peak memory와 update stability를 함께 비교해야 합니다.</p></div>
    </section>
  );
}
