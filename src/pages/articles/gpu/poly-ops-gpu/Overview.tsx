import PlonkPipelineViz from './viz/PlonkPipelineViz';
import PolyOpsMapViz from './viz/PolyOpsMapViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NTT 너머의 다항식 연산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ZK 증명 시스템에서 NTT는 가장 기본적인 다항식 연산 프리미티브다.<br />
          그러나 실제 PLONK/Groth16 프로버는 NTT만으로 완성되지 않는다.<br />
          몫 다항식(quotient polynomial) 계산에는 <strong>coset NTT</strong>와
          <strong>vanishing polynomial 나눗셈</strong>이 필수이고,
          KZG 오프닝 증명에는 <strong>다점 평가</strong>가 필요하다.
        </p>
        <PlonkPipelineViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 coset이 필요한가</h3>
        <p>
          PLONK에서 몫 다항식 h(x) = t(x) / Z(x)를 계산해야 한다.<br />
          Z(x) = x^n - 1은 단위근 omega^i에서 모두 0이다.<br />
          따라서 평가 형태에서 직접 나누면 0으로 나누기가 발생한다.<br />
          해결책: 단위근이 아닌 <strong>coset</strong> g*omega^i에서 평가하면 Z(g*omega^i) != 0이 보장된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">이 글에서 다루는 연산</h3>
        <PolyOpsMapViz />
        <p>
          각 연산은 GPU에서 높은 병렬성을 가진다.
          coset NTT는 전처리 곱셈 + 표준 NTT, 다항식 나눗셈은 원소별 Fp 나눗셈,
          다점 평가는 점마다 독립적인 Horner 평가다.<br />
          모두 GPU의 대규모 스레드에 자연스럽게 매핑된다.
        </p>
      </div>
    </section>
  );
}
