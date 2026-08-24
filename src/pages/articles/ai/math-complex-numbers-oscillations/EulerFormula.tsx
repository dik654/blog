import ExplainedFormula from "@/components/ui/explained-formula";

export default function EulerFormula() {
  return (
    <section id="euler-formula" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Euler 공식은 지수의 연속적인 배율 변화를 회전으로 확장한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          실수 지수 <code>e^t</code>는 현재 값에 비례하는 속도로 커지는 함수입니다. 지수의 입력을 <code>iθ</code>로 바꾸면 변화 방향이 현재 복소수에 대해 90° 돌아가므로, 크기가 커지는 대신 단위원을 따라 회전합니다. 그 가로·세로 좌표를 풀어 쓴 식이 Euler 공식입니다.
        </p>
        <h3>무한급수로 세 함수를 같은 언어에 놓기</h3>
        <p>
          여기서 무한급수는 항을 끝없이 나열한다는 말만 뜻하지 않습니다. 앞에서부터 유한 개씩 더한 <strong>부분합</strong>이 어떤 값에 가까워질 때 그 극한을 급수의 값으로 정의합니다. <code>m!</code>은 1부터 m까지의 곱인 factorial이며, 큰 차수의 항을 빠르게 작게 만들어 급수가 수렴하도록 돕습니다.
        </p>
      </div>
      <ExplainedFormula
        question="eˣ·cos x·sin x를 같은 power-series 표현으로 놓으면 i의 반복이 어떻게 두 삼각함수를 만들까?"
        idea={<>eˣ의 각 항에 x=iθ를 넣습니다. i의 짝수 거듭제곱 1,−1,…은 cosine 항으로, 홀수 거듭제곱 i,−i,…은 i×sine 항으로 묶입니다.</>}
        formula={String.raw`e^x=\sum_{m=0}^{\infty}\frac{x^m}{m!},\quad \cos x=\sum_{m=0}^{\infty}(-1)^m\frac{x^{2m}}{(2m)!},\quad \sin x=\sum_{m=0}^{\infty}(-1)^m\frac{x^{2m+1}}{(2m+1)!}`}
        terms={[
          { symbol: "m!", name: "factorial", description: "m!=1·2·…·m이며 0!=1로 정의합니다." },
          { symbol: String.raw`\sum_{m=0}^{\infty}`, name: "convergent series", description: "처음 M개 항의 부분합이 M→∞에서 가까워지는 극한입니다." },
          { symbol: "(-1)^m", name: "alternating sign", description: "삼각함수 급수의 항 부호를 +,−,+,−로 번갈아 바꿉니다." },
        ]}
        assumptions={["세 power series가 모든 실수·복소수 입력에서 수렴한다는 표준 정의를 사용합니다.", "각도 변수는 radian입니다."]}
        interpretation="Euler 공식은 서로 무관한 세 함수를 우연히 붙인 암기식이 아닙니다. 같은 exponential series에서 i의 네 단계 반복을 짝수·홀수 항으로 분리한 결과입니다."
      />
      <ExplainedFormula
        question="크기는 1로 유지하면서 각도 θ만큼 회전하는 복소수를 어떻게 한 식으로 나타낼까?"
        idea={<>Exponential의 거듭제곱급수에 iθ를 넣으면 i의 거듭제곱이 1,i,−1,−i로 반복됩니다. 짝수 항은 cosine 급수, 홀수 항은 i×sine 급수로 모입니다.</>}
        formula={String.raw`e^{i\theta}=\cos\theta+i\sin\theta,\qquad re^{i\theta}=r(\cos\theta+i\sin\theta)`}
        terms={[
          { symbol: "e^{i\\theta}", name: "unit complex rotation", description: "Magnitude 1, phase θ인 복소수입니다." },
          { symbol: "r", name: "magnitude", description: "단위원 좌표를 반지름 r로 확대합니다." },
          { symbol: String.raw`\theta`, name: "phase", description: "양의 실수축에서 잰 회전 각도입니다." },
        ]}
        assumptions={["θ는 radian이며 exponential·sine·cosine은 실수에서 정의한 power series를 복소수로 확장합니다."]}
        interpretation="복소 지수 하나가 cosine과 sine 두 좌표를 함께 보존합니다. 따라서 Fourier coefficient 하나로 특정 frequency의 amplitude와 phase를 동시에 기록할 수 있습니다."
      />
      <ExplainedFormula
        question="복소수 곱셈이 회전을 합성하는 이유는 무엇일까?"
        idea={<>지수의 곱셈 법칙에 따라 같은 밑 e의 지수는 더해집니다. Polar form의 두 복소수를 곱하면 magnitude는 곱해지고 phase는 더해집니다.</>}
        formula={String.raw`r_1e^{i\theta_1}\,r_2e^{i\theta_2}=r_1r_2e^{i(\theta_1+\theta_2)}`}
        terms={[
          { symbol: "r_1r_2", name: "combined scale", description: "두 곱셈이 적용한 길이 배율의 곱입니다." },
          { symbol: String.raw`\theta_1+\theta_2`, name: "combined phase", description: "두 회전 각도를 순서대로 적용한 총각도입니다." },
        ]}
        assumptions={["복소 exponential의 곱셈 법칙을 사용하며 phase는 2π 차이까지 같은 방향을 나타냅니다."]}
        interpretation="DFT의 basis를 sample index n에 따라 반복 곱할 수 있고, FFT가 roots of unity의 주기성과 대칭성을 재사용할 수 있는 대수적 이유입니다."
      />
    </section>
  );
}
