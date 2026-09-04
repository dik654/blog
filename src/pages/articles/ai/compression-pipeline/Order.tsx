import ExplainedFormula from "@/components/ui/explained-formula";
import OrderViz from "./viz/OrderViz";
export default function Order() {
  return (
    <section id="order" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Compression stage는 대체로 교환법칙이 성립하지 않으므로, 구조가 바뀐 뒤
        calibration을 다시 수집합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Distillation은 student architecture와 behavior distribution을 만들고 structured pruning은 tensor shape와
          activation을 바꿉니다. 이 둘보다 먼저 quantization scale을 맞춰 놓으면 뒤 단계가 만든 새 tensor에 이전 통계가 대응하지 않을 수 있습니다. 일반
          출발점은 student/structure 결정→recovery→final graph calibration→quantization→engine build입니다.
        </p>
        <p>
          다만 공동 학습이나 hardware constraint 때문에 다른 순서가 나을 수
          있으므로 규칙으로 단정하지 않습니다. 작은 factorial pilot에서 순서를
          비교하고 각 stage의 input hash·output hash·data
          manifest·quality/runtime receipt를 남깁니다.
        </p>
      </div>
      <ExplainedFormula
        question="A→B와 B→A가 다른 결과를 내는 순서 효과를 어떻게 측정할까요?"
        idea={
          <>
            같은 baseline과 budget에서 두 순서의 최종 metric 차이를 직접
            계산합니다. 차이가 측정 불확실성보다 크면 두 stage는 해당
            workload에서 교환 가능하다고 볼 수 없습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
m_{AB}&=m(B(A(\theta_0))),\\
m_{BA}&=m(A(B(\theta_0))),\\
\Delta_{\mathrm{order}}(m)&=m_{AB}-m_{BA}.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
m_{AB}&=\underbrace{m(B(A(\theta_0))),}_{\text{frozen baseline 계산}}\\
m_{BA}&=\underbrace{m(A(B(\theta_0))),}_{\text{frozen baseline 계산}}\\
\Delta_{\mathrm{order}}(m)&=\underbrace{m_{AB}-m_{BA}.}_{\text{변화량 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`m(B(A(\theta_0))),`, annotation: ["frozen baseline이(가) 식의 결과에 기여하는","방식을 계산합니다.","같은 baseline과 budget에서 두 순서의 최종","metric 차이를 직접 계산합니다."] },
          { expression: String.raw`m(A(B(\theta_0))),`, annotation: ["frozen baseline이(가) 식의 결과에 기여하는","방식을 계산합니다.","같은 baseline과 budget에서 두 순서의 최종","metric 차이를 직접 계산합니다."] },
          { expression: String.raw`m_{AB}-m_{BA}.`, annotation: ["paired metric이(가) 식의 결과에 기여하는 방식을","계산합니다.","같은 baseline과 budget에서 두 순서의 최종","metric 차이를 직접 계산합니다."] },
        ]}
        terms={[
          {
            symbol: "theta_0",
            name: "frozen baseline",
            description: "두 순서가 공통으로 시작하는 model revision입니다.",
          },
          {
            symbol: "A,B",
            name: "compression stages",
            description:
              "예를 들어 structured pruning과 quantization처럼 비교할 두 변환입니다.",
          },
          {
            symbol: "m",
            name: "paired metric",
            description:
              "같은 test item·runtime condition에서 측정한 quality loss·memory·latency입니다.",
          },
          {
            symbol: "Delta_order",
            name: "order effect",
            description: "두 최종 artifact 사이의 metric 차이입니다.",
          },
        ]}
        assumptions={[
          "두 순서의 target sparsity/bit·recovery compute·calibration sample count와 tuning budget을 맞춥니다.",
          "Metric 부호를 고정하고 paired item·반복 run의 uncertainty와 함께 해석합니다.",
          "A 또는 B가 다른 artifact shape를 지원하지 못해 실패한 경우도 순서 효과의 운영 결과로 기록합니다.",
        ]}
        interpretation="A→B의 quality가 .82, B→A가 .79라면 higher-is-better metric의 order effect는 .03입니다. 단일 seed·run noise가 .03보다 큰지 확인하기 전에는 순서를 확정하지 않습니다."
      />
      <div className="not-prose my-8">
        <OrderViz />
      </div>
    </section>
  );
}
