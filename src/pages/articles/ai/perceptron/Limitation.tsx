import XORProblemViz from './viz/XORProblemViz';

export default function Limitation() {
  return (
    <section id="limitation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">퍼셉트론의 한계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>XOR 문제</strong> — (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0<br />
          직선 하나로는 XOR의 출력을 분리할 수 없음<br />
          이것이 선형 분리 불가능(Linearly Inseparable) 문제
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">첫 번째 AI 겨울</h3>
        <p>
          1969년 Minsky &amp; Papert가 『Perceptrons』에서 수학적으로 증명<br />
          단층 퍼셉트론은 비선형 문제를 풀 수 없음<br />
          이 발표 이후 신경망 연구 투자가 급감 → 첫 번째 AI 겨울(AI Winter) 도래
        </p>
      </div>
      <div className="mt-8">
        <XORProblemViz />
      </div>
    </section>
  );
}
