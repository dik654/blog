import ExplainedFormula from "@/components/ui/explained-formula";

export default function RootsOfUnity() {
  return (
    <section id="roots-of-unity" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Roots of unity는 단위원을 똑같은 각도로 나눈 회전점이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          어떤 수를 <code>N</code>번 곱했을 때 1이 되는 복소수들을 <strong>N차 roots of unity</strong>라고 합니다. 단위원에서 0부터 <code>2π</code>까지를 <code>N</code>등분한 점들이며, DFT는 이 점들을 회전 basis로 사용합니다. 서로 다른 회전 횟수는 한 주기 동안 합하면 상쇄되기 때문에 서로 다른 frequency 좌표를 분리할 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="N sample 동안 정확히 k바퀴 도는 discrete rotation을 어떻게 만들까?"
        idea={<>한 sample마다 −2πk/N만큼 회전하는 복소수를 n번 곱합니다. N번째 sample 뒤에는 phase가 −2πk가 되어 정수 k바퀴를 마치고 다시 1로 돌아옵니다.</>}
        formula={String.raw`\omega_N=e^{-i2\pi/N},\qquad \omega_N^{kn}=e^{-i2\pi kn/N},\qquad \omega_N^N=1`}
        terms={[
          { symbol: "\omega_N", name: "primitive Nth root", description: "시계 방향으로 한 칸 회전하는 기본 step입니다." },
          { symbol: "k", name: "frequency index", description: "N sample 동안 도는 바퀴 수를 정합니다." },
          { symbol: "n", name: "sample index", description: "기본 회전 step을 몇 번 적용했는지 나타냅니다." },
        ]}
        assumptions={["k와 n은 정수이며 DFT 분석 convention에 맞춰 음의 phase 방향을 사용합니다."]}
        interpretation="DFT basis는 임의의 파형 목록이 아니라 단위원을 균등 분할한 유한 회전 group입니다. FFT는 이 회전점들의 반복과 부호 대칭을 계산 재사용에 이용합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          예를 들어 <code>N=4</code>이면 roots는 <code>1, -i, -1, i</code>입니다. 한 칸씩 이동할 때마다 90° 회전하고 네 번 뒤에는 1로 돌아옵니다. 또한 두 칸 떨어진 점은 부호가 반대이므로, radix-2 FFT에서는 같은 even·odd 중간 결과를 한 output에는 더하고 반대편 output에는 뺄 수 있습니다.
        </p>
      </div>
    </section>
  );
}
