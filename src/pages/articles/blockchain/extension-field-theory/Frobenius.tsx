import FrobeniusStepViz from './viz/FrobeniusStepViz';
import Step1Derive from './viz/frobenius/Step1Derive';
import Step2Reflect from './viz/frobenius/Step2Reflect';

export default function Frobenius() {
  return (
    <section id="frobenius" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Frobenius 사상</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          확장체 원소를 p제곱하는 함수 — 결과적으로 u의 부호만 뒤집히는 "켤레" 연산.
          <br />
          페어링의 Final Exponentiation에서 거듭제곱을 거의 공짜로 만들어주는 핵심 도구.
        </p>
      </div>
      <div className="not-prose mb-10"><FrobeniusStepViz /></div>

      <h3 className="text-xl font-bold mb-4">유도: (a+bu)⁷ 전개</h3>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          왜 p제곱하면 u 부호만 뒤집히는지, 수식 전개로 확인한다.
        </p>
      </div>
      <div className="not-prose mb-10 rounded-xl border p-5"><Step1Derive /></div>

      <h3 className="text-xl font-bold mb-4">기하학적 의미: a축 반사</h3>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          a+bu → a−bu = u 부호만 반전. 2D 격자에서 a축에 대한 반사.
          <br />
          슬라이더로 a, b를 바꿔 확인해보세요.
        </p>
      </div>
      <div className="not-prose rounded-xl border p-5"><Step2Reflect /></div>
    </section>
  );
}
