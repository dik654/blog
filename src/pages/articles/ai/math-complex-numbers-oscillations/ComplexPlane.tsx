import ExplainedFormula from "@/components/ui/explained-formula";

export default function ComplexPlane() {
  return (
    <section id="complex-plane" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">복소수는 평면의 두 좌표를 하나의 수처럼 계산하게 한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          실수 <code>a</code>와 <code>b</code>를 순서쌍 <code>(a,b)</code>로 두어도 평면의 점은 나타낼 수 있습니다. 복소수는 여기에 <code>i²=-1</code>이라는 곱셈 규칙을 더해 <code>a+bi</code>로 적습니다. 덧셈은 좌표별로 이뤄지고, 곱셈은 크기를 곱하면서 각도를 더하는 연산이 됩니다. Fourier 분석에서 이 두 번째 성질이 핵심입니다.
        </p>
      </div>
      <ExplainedFormula
        question="복소수 하나에서 평면 좌표·길이·반대 회전 정보를 어떻게 읽을까?"
        idea={<>실수부 a를 가로 좌표, 허수부 b를 세로 좌표로 읽습니다. 원점까지의 거리는 피타고라스 정리로 구하고, conjugate는 세로 좌표의 부호를 바꾸어 실수축에 대해 반사합니다.</>}
        formula={String.raw`z=a+bi,\quad i^2=-1,\quad |z|=\sqrt{a^2+b^2},\quad \overline z=a-bi,\quad z\overline z=|z|^2`}
        annotatedFormula={String.raw`z=\underbrace{a+bi,\quad i^2=-1,\quad |z|=\sqrt{a^2+b^2},\quad \overline z=a-bi,\quad z\overline z=|z|^2}_{\text{complex conjugate 계산}}`}
        operations={[
          { expression: String.raw`a+bi,\quad i^2=-1,\quad |z|=\sqrt{a^2+b^2},\quad \overline z=a-bi,\quad z\overline z=|z|^2`, annotation: ["complex conjugate이(가) 식의 결과에 기여하는","방식을 계산합니다.","실수부 a를 가로 좌표, 허수부 b를 세로 좌표로 읽습니다."] },
        ]}
        terms={[
          { symbol: "a", name: "real part", description: "복소평면의 가로 좌표입니다." },
          { symbol: "b", name: "imaginary coordinate", description: "복소평면의 세로 좌표이며 bi로 적습니다." },
          { symbol: "|z|", name: "magnitude", description: "원점에서 z까지의 Euclidean distance입니다." },
          { symbol: String.raw`\overline z`, name: "complex conjugate", description: "회전 방향의 부호를 뒤집은 실수축 대칭점입니다." },
        ]}
        assumptions={["a와 b는 실수이며 i는 i²=-1을 만족하도록 확장한 단위입니다."]}
        interpretation="복소수의 magnitude는 vector 길이와 같고 conjugate는 phase 부호를 뒤집습니다. Real signal DFT에서 양·음 frequency coefficient가 conjugate pair를 이루는 이유가 여기서 나옵니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>i를 곱하면 왜 90° 회전하는가</h3>
        <p>
          <code>z=a+bi</code>에 <code>i</code>를 곱하면 <code>iz=-b+ai</code>가 됩니다. 좌표로 쓰면 <code>(a,b)→(-b,a)</code>이며, 길이는 그대로이고 방향만 반시계로 90° 바뀝니다. 다시 <code>i</code>를 곱하면 <code>(-a,-b)</code>가 되어 180° 회전하고, 네 번 곱하면 처음 위치로 돌아옵니다.
        </p>
      </div>
    </section>
  );
}
