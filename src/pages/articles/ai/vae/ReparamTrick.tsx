import ReparamViz from './viz/ReparamViz';

export default function ReparamTrick() {
  return (
    <section id="reparam-trick" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reparameterization Trick</h2>
      <div className="not-prose mb-8"><ReparamViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-2xl">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 필요한가?</h3>
        <p>
          인코더가 μ와 σ를 출력했다.<br />
          여기서 z를 직접 샘플링하면?
          <strong>확률적 연산은 미분이 안 된다.</strong>
          역전파가 끊기므로 학습 불가.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">해결: 노이즈를 분리</h3>
        <p>
          랜덤성을 외부로 빼는 트릭. ε ~ N(0,1)에서 먼저 샘플한 뒤,
          <strong>z = μ + σ × ε</strong>로 변환하면 μ와 σ에 대한 그래디언트가 흐른다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">숫자로 확인</h3>
        <ul>
          <li>σ₁ = exp(0.5 × (-0.8)) = exp(-0.4) = <strong>0.670</strong></li>
          <li>σ₂ = exp(0.5 × (-1.2)) = exp(-0.6) = <strong>0.549</strong></li>
          <li>ε = [0.5, -0.3] (N(0,1)에서 랜덤 샘플)</li>
          <li>z₁ = 0.35 + 0.670 × 0.5 = <strong>0.685</strong></li>
          <li>z₂ = -0.12 + 0.549 × (-0.3) = <strong>-0.285</strong></li>
        </ul>
        <p>
          이제 z = [0.685, -0.285]를 디코더에 전달한다.<br />
          매번 ε이 달라지므로 같은 입력이라도 살짝 다른 z가 나온다.<br />
          이것이 VAE의 "생성" 능력의 원천이다.
        </p>
      </div>
    </section>
  );
}
