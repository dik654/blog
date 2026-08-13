import ExplainedFormula from "@/components/ui/explained-formula";
import TrainingInterventionViz from "./viz/TrainingInterventionViz";

export default function Regularization() {
  return (
    <section id="regularization" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Regularization은 training loop의 서로 다른 지점에 개입한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Regularization은 모델을 막연히 “방해”하는 기법의 목록이 아니다. 어떤
          objective를 최적화할지, activation에 어떤 noise를 넣을지, data
          distribution을 어떻게 확장할지, 어느 checkpoint를 선택할지처럼 개입
          지점이 서로 다르다. 같은 validation gain을 보여도 계산 비용과 실패 mode가
          다르므로 이름보다 training loop에서의 위치를 먼저 봐야 한다.
        </p>
      </div>

      <TrainingInterventionViz />

      <ExplainedFormula
        question="adaptive optimizer에서 L2 penalty와 weight decay를 왜 같은 것으로 취급하면 안 될까?"
        idea={<>L2 penalty는 λθ를 loss gradient에 더하므로 Adam의 moment normalization을 함께 거칩니다. AdamW는 data gradient update와 별도로 parameter를 직접 shrink해 두 효과를 분리합니다.</>}
        formula={String.raw`\begin{aligned}g_t^{\rm L2}&=g_t+\lambda\theta_t\\u_t&=\operatorname{Adam}(g_t)\\\theta_{t+1}^{\rm AdamW}&=(1-\eta_t\lambda)\theta_t-\eta_tu_t\end{aligned}`}
        terms={[
          { symbol: "\\lambda", name: "regularization / decay coefficient", description: "두 식에서 같은 기호를 써도 optimizer와 결합되는 방식은 다릅니다." },
          { symbol: "g_t+\\lambda\\theta_t", name: "coupled L2 gradient", description: "penalty gradient가 data gradient와 함께 optimizer state에 들어갑니다." },
          { symbol: "(1-\\eta_t\\lambda)\\theta_t", name: "decoupled shrink", description: "loss gradient transform과 분리해 parameter를 직접 줄입니다." },
        ]}
        assumptions={["개념 비교를 위한 AdamW형 update이며 bias correction 등 Adam 내부 식은 생략했습니다."]}
        interpretation="SGD에서는 적절한 scale 아래 두 방식이 대응하지만 adaptive optimizer에서는 일반적으로 같지 않습니다. AdamW가 ‘decoupled’라고 부르는 이유입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 구분은
          <a href="https://arxiv.org/abs/1711.05101" target="_blank" rel="noreferrer"> AdamW 원 논문</a>에서
          확인할 수 있다. Dropout은 parameter penalty가 아니라 training 중 unit과
          connection을 확률적으로 제거하는 방법이며,
          <a href="https://www.jmlr.org/papers/v15/srivastava14a.html" target="_blank" rel="noreferrer"> 원 논문</a>의
          ensemble approximation 관점과 현재 architecture에서의 실제 ablation을
          함께 보는 편이 정확하다.
        </p>
      </div>
    </section>
  );
}
