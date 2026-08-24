import ExplainedFormula from "@/components/ui/explained-formula";
import RadianMeasureViz from "./viz/RadianMeasureViz";

export default function Radians() {
  return (
    <section id="radians" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Radian은 각도를 원의 반지름으로 재는 단위다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          각도 360°는 한 바퀴를 360등분한 약속입니다. Radian은 원 위에서 이동한 호의 길이와 반지름의 비율로 각도를 정의합니다. 그래서 원의 크기가 달라져도 같은 회전을 같은 숫자로 나타내며, 미분과 Fourier 식에서 불필요한 환산 상수가 생기지 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="원의 크기와 무관하게 회전한 양을 어떻게 측정할까?"
        idea={<>중심각이 잘라낸 호의 길이 s를 반지름 r로 나눕니다. 반지름만큼 이동한 호가 1 radian이고, 한 바퀴의 호 길이는 원둘레 2πr이므로 한 바퀴는 2π radian입니다.</>}
        formula={String.raw`\theta=\frac{s}{r},\qquad 2\pi\ \text{rad}=360^\circ,\qquad \pi\ \text{rad}=180^\circ`}
        annotatedFormula={String.raw`\theta=\underbrace{\frac{s}{r},\qquad 2\pi\ \text{rad}=360^\circ,\qquad \pi\ \text{rad}=180^\circ}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{s}{r},\qquad 2\pi\ \text{rad}=360^\circ,\qquad \pi\ \text{rad}=180^\circ`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","중심각이 잘라낸 호의 길이 s를 반지름 r로 나눕니다."] },
        ]}
        terms={[
          { symbol: "s", name: "arc length", description: "원 위에서 실제로 이동한 곡선의 길이입니다." },
          { symbol: "r", name: "radius", description: "원의 중심에서 둘레까지의 거리입니다." },
          { symbol: String.raw`\theta`, name: "angle in radians", description: "길이÷길이이므로 단위가 상쇄되는 회전량입니다." },
          { symbol: String.raw`\pi`, name: "circle constant", description: "원둘레와 지름의 비이며 한 바퀴의 radian 값에 나타납니다." },
        ]}
        assumptions={["원의 중심에서 잰 각도이며 s와 r은 같은 길이 단위를 사용합니다."]}
        interpretation="Radian은 degree를 보기 좋게 바꾼 표기만이 아닙니다. 각도를 길이의 비로 정의하므로 sin의 derivative와 complex exponential의 회전 속도를 자연스럽게 연결합니다."
      />
      <RadianMeasureViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          주파수 식에 <code>2π</code>가 자주 나타나는 까닭도 여기에 있습니다. 초당 한 번 반복되는 신호는 1초 동안 한 바퀴, 즉 <code>2π</code> radian만큼 phase가 증가합니다. 따라서 초당 <code>f</code>회 반복되는 신호의 angular frequency는 <code>ω=2πf</code>가 됩니다.
        </p>
      </div>
    </section>
  );
}
