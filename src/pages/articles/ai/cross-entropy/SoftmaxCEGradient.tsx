import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import SoftmaxGradientTraceViz from "./viz/SoftmaxGradientTraceViz";

export default function SoftmaxCEGradient() {
  return (
    <section id="softmax-ce-gradient" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Softmax와 cross-entropy는 하나의 연산처럼 미분한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Softmax가 K개의 logit을 합이 1인 probability vector로 바꾸는 이상 한 logit을 건드리면 모든 class probability가 함께 달라진다.
          Jacobian에는 diagonal 항과 class 사이의 coupling 항이 모두 생기지만 cross-entropy와 chain rule로 결합하면 최종 logit
          gradient가 예측 확률에서 target을 뺀 형태로 정리된다.
        </p>
        <p>
          이 절은 cross-entropy 관점에서 그 결과를 사용한다. 계산 graph를 거꾸로
          따라가며 이 식을 유도하는 정본 설명은
          {" "}<Link to="/ai/backprop-optimization#tensor-backward">
            역전파 아티클의 softmax–cross-entropy 미분
          </Link>
          에서 이어서 볼 수 있다.
        </p>
      </div>

      <ExplainedFormula
        question="서로 coupling된 softmax probability를 거쳐도 logit gradient를 간단히 계산할 수 있을까?"
        idea={<>Softmax Jacobian을 cross-entropy의 probability gradient와 곱합니다. One-hot target의 합이 1이라는 조건을 사용하면 자기 class와 다른 class의 항이 정리되어 p−y만 남습니다.</>}
        formula={String.raw`\begin{aligned}p_j&=\frac{e^{z_j}}{\sum_ke^{z_k}}\\[-1pt]L&=-\sum_i y_i\log p_i\\[3pt]\frac{\partial p_i}{\partial z_j}&=p_i(\delta_{ij}-p_j)\\[3pt]\frac{\partial L}{\partial z_j}&=p_j-y_j\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}p_j&=\underbrace{\frac{e^{z_j}}{\sum_ke^{z_k}}}_{\text{기준량당 비율}}\\[-1pt]L&=\underbrace{-\sum_i y_i\log p_i}_{\text{로그 비용 변환}}\\[3pt]\frac{\partial p_i}{\partial z_j}&=\underbrace{p_i(\delta_{ij}-p_j)}_{\text{기준량당 비율}}\\[3pt]\frac{\partial L}{\partial z_j}&=p_j-y_j\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{e^{z_j}}{\sum_ke^{z_k}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Softmax Jacobian을 cross-entropy의","probability gradient와 곱합니다."] },
          { expression: String.raw`-\sum_i y_i\log p_i`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Softmax Jacobian을 cross-entropy의","probability gradient와 곱합니다."] },
          { expression: String.raw`p_i(\delta_{ij}-p_j)`, annotation: ["Kronecker delta이(가) 식의 결과에 기여하는","방식을 계산합니다.","Softmax Jacobian을 cross-entropy의","probability gradient와 곱합니다."] },
        ]}
        terms={[
          { symbol: "z_j", name: "logit", description: "Class j의 normalized 전 score입니다." },
          { symbol: "p_j", name: "predicted probability", description: "softmax가 만든 class j의 확률입니다." },
          { symbol: "y_j", name: "target mass", description: "one-hot이면 정답만 1이며 soft label이면 각 class에 분산됩니다." },
          { symbol: "\\delta_{ij}", name: "Kronecker delta", description: "i=j일 때 1, 아니면 0이라 diagonal/off-diagonal derivative를 한 식에 담습니다." },
        ]}
        assumptions={["Target distribution은 Σⱼyⱼ=1을 만족합니다.", "Batch reduction이 mean이면 이 gradient에 batch size의 역수가 추가됩니다."]}
        interpretation="정답 class에서는 p−1이므로 gradient descent가 logit을 올리고, 나머지는 p>0이므로 logit을 내린다. 오답에 준 확률만큼 correction의 크기도 커집니다."
      />

      <SoftmaxGradientTraceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>구현에서는 probability를 먼저 만들지 않는다</h3>
        <p>
          큰 양의 logit에 직접 exp를 취하면 overflow가 나고, 매우 작은 probability에
          log를 취하면 <code>−inf</code>가 생길 수 있다. Stable 구현은 최대 logit을
          빼는 log-sum-exp identity를 사용해 logits에서 NLL을 바로 계산한다. 따라서
          PyTorch의 <code>cross_entropy</code>처럼 logits를 받는 fused function
          앞에 softmax를 따로 적용하면 안 된다.
        </p>
      </div>

      <ExplainedFormula
        question="정답 확률을 직접 만들지 않고도 categorical NLL을 안정적으로 계산하려면?"
        idea={<>모든 logit에서 최댓값 m을 빼도 softmax는 변하지 않습니다. Exp의 입력을 0 이하로 옮겨 overflow를 막고 log-sum-exp와 정답 logit의 차이로 loss를 계산합니다.</>}
        formula={String.raw`\begin{aligned}m&=\max_k z_k\\[2pt]\operatorname{LSE}(z)&=m+\log\sum_k e^{z_k-m}\\[2pt]L&=\operatorname{LSE}(z)-z_y\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}m&=\underbrace{\max_k z_k}_{\text{경계 후보 선택}}\\[2pt]\operatorname{LSE}(z)&=\underbrace{m+\log\sum_k e^{z_k-m}}_{\text{로그 비용 변환}}\\[2pt]L&=\underbrace{\operatorname{LSE}(z)-z_y}_{\text{log-sum-exp 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`\max_k z_k`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","모든 logit에서 최댓값 m을 빼도 softmax는 변하지","않습니다."] },
          { expression: String.raw`m+\log\sum_k e^{z_k-m}`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","모든 logit에서 최댓값 m을 빼도 softmax는 변하지","않습니다."] },
          { expression: String.raw`\operatorname{LSE}(z)-z_y`, annotation: ["log-sum-exp이(가) 식의 결과에 기여하는 방식을","계산합니다.","모든 logit에서 최댓값 m을 빼도 softmax는 변하지","않습니다."] },
        ]}
        terms={[
          { symbol: "m", name: "maximum logit", description: "수치 안정화를 위해 모든 logits에서 빼는 기준값입니다." },
          { symbol: "\\operatorname{LSE}", name: "log-sum-exp", description: "log와 exp의 합성 계산을 안정적으로 수행한 값입니다." },
          { symbol: "z_y", name: "target logit", description: "정답 class에 해당하는 raw score입니다." },
        ]}
        assumptions={["Single-label categorical NLL의 식입니다.", "Mixed precision에서는 library의 fused kernel과 내부 accumulation dtype을 따릅니다."]}
        interpretation="Softmax probability tensor를 materialize하지 않아도 loss와 p−y gradient를 계산할 수 있어 수치 안정성과 memory traffic 모두에 유리합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          예를 들어 logits가 <code>(1000,999)</code>이고 첫 class가 정답이면, exp를
          직접 계산하는 방식은 overflow할 수 있다. 최댓값 1000을 빼면
          <code>(0,−1)</code>이 되고, loss는
          <code>ln(1+e⁻¹)≈0.313 nat</code>로 안정적으로 계산된다. 모든 logit에서
          같은 값을 빼도 softmax 확률이 바뀌지 않기 때문에 가능한 변환이다.
        </p>
      </div>
    </section>
  );
}
