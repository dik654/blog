import WeightDecayViz from './viz/WeightDecayViz';

export default function WeightDecay() {
  return (
    <section id="weight-decay" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Weight Decay vs L2 정규화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>L2 정규화</strong> — 손실 함수에 가중치의 제곱합을 더함: L_total = L_data + (λ/2)·‖w‖²<br />
          gradient에 λw가 추가 → 큰 가중치일수록 더 강한 패널티 → 가중치가 0 방향으로 축소<br />
          결과적으로 모델이 "단순한" 해를 선호하게 유도 — Occam's Razor의 수학적 구현
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Weight Decay와의 미묘한 차이</h3>
        <p>
          <strong>Weight Decay</strong> — 매 업데이트에서 가중치를 직접 축소: w ← (1 − lr·λ)·w − lr·∇L<br />
          SGD에서는 L2 정규화와 Weight Decay가 <strong>수학적으로 동치</strong><br />
          하지만 Adam/AdaGrad 같은 적응형 옵티마이저에서는 다름 — 이 차이가 AdamW 탄생의 원인
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Adam에서 L2가 문제인가</h3>
        <p>
          Adam의 업데이트: w ← w − lr · m̂/(√v̂ + ε)<br />
          L2 정규화 → gradient에 λw를 더함 → m̂에 λw가 포함 → √v̂으로 나누면 λw의 효과도 함께 축소<br />
          결과: 자주 업데이트되는 파라미터(큰 v̂)는 정규화 효과가 약해짐. 의도와 다름
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">AdamW: Decoupled Weight Decay</h3>
        <p>
          Loshchilov & Hutter(2019) — AdamW는 weight decay를 gradient 계산과 <strong>분리</strong><br />
          w ← w − lr · m̂/(√v̂ + ε) − lr · λ · w<br />
          정규화 항이 적응 학습률의 영향을 받지 않음 → 모든 파라미터에 균일한 축소 효과<br />
          현대 딥러닝의 <strong>사실상 표준</strong>: PyTorch의 torch.optim.AdamW, Hugging Face의 기본 옵티마이저
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">적절한 λ(weight_decay) 범위</h3>
        <p>
          일반 범위: 1e-4 ~ 1e-2<br />
          Transformer(BERT, GPT): 0.01 이 표준. 학습률과 함께 튜닝<br />
          CNN(ResNet 등): 1e-4 ~ 5e-4. BN이 이미 정규화 역할을 하므로 약하게 설정<br />
          너무 큰 λ → 가중치가 전부 0에 수렴 → 언더피팅. 너무 작은 λ → 효과 없음
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Bias와 Norm에는 Weight Decay를 적용하지 않음</h3>
        <p>
          bias, LayerNorm의 γ/β에는 weight decay를 적용하지 않는 것이 관례<br />
          이유: bias는 모델 복잡도에 미미한 영향, Norm 파라미터는 분포 조정 역할<br />
          PyTorch에서는 param_groups로 분리: decay 대상 / no_decay 대상을 나눠 옵티마이저에 전달
        </p>
      </div>
      <div className="not-prose my-8">
        <WeightDecayViz />
      </div>
    </section>
  );
}
