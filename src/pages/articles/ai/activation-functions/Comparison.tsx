import ActivationDecisionViz from "./viz/ActivationDecisionViz";
import { TABLE_DATA } from "./ComparisonData";

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">활성화 함수는 출력의 의미부터 고른다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          먼저 output layer가 무엇을 표현해야 하는지 정한다. 독립적인 binary·multi-label
          확률에는 sigmoid, 서로 배타적인 여러 클래스에는 softmax, 범위 제한이 없는
          회귀 출력에는 identity가 일반적이다. hidden layer는 검증된 architecture의
          기본값에서 시작한 뒤 optimization과 처리량을 함께 비교하는 편이 안전하다.
        </p>
      </div>
      <div className="not-prose mb-8 overflow-x-auto rounded-xl border">
        <table className="min-w-[720px] w-full text-xs">
          <thead>
            <tr className="border-b bg-muted/30">
              {["함수", "범위", "기울기", "장점", "단점", "사용처"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA.map((row) => (
              <tr key={row.name} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-3 py-2 font-medium">{row.name}</td>
                <td className="px-3 py-2 font-mono">{row.range}</td>
                <td className="px-3 py-2">{row.gradient}</td>
                <td className="px-3 py-2">{row.pro}</td>
                <td className="px-3 py-2">{row.con}</td>
                <td className="px-3 py-2">{row.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ActivationDecisionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <p>
          initialization도 activation과 함께 본다. ReLU 계열에는 He initialization,
          tanh·sigmoid 계열에는 Xavier initialization이 흔한 출발점이지만,
          normalization과 residual path가 있는 현대 architecture에서는 전체 신호
          전달을 측정해야 한다. 학습이 불안정할 때 activation만 바꾸기 전에 activation
          분포, gradient norm, learning rate를 먼저 확인하는 편이 원인을 찾기 쉽다.
        </p>
      </div>
    </section>
  );
}
