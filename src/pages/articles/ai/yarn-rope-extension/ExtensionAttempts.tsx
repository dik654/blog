import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";

const methods = [
  {
    name: "원래 RoPE",
    position: "그대로",
    frequency: "그대로",
    consequence: "학습 범위 밖의 각도를 그대로 extrapolation한다.",
  },
  {
    name: "Position Interpolation",
    position: "m → m/s",
    frequency: "그대로",
    consequence: "전체 위치를 학습 범위 안으로 압축하지만 근거리 해상도도 함께 줄어든다.",
  },
  {
    name: "NTK-aware scaling",
    position: "그대로",
    frequency: "base를 변경",
    consequence: "고주파는 비교적 보존하고 저주파를 더 크게 늘린다.",
  },
  {
    name: "YaRN",
    position: "그대로",
    frequency: "band별 blend",
    consequence: "파장에 따라 interpolation과 extrapolation을 섞고 attention scale을 보정한다.",
  },
];

export default function ExtensionAttempts() {
  return (
    <section id="extension-attempts" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PI와 NTK-aware scaling은 무엇을 늘릴지 다르게 선택했다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          원래 context length가 <M>{"L"}</M>이고 목표 길이가
          <M>{"L'=sL"}</M>라면 가장 직관적인 방법은 Position
          Interpolation(PI)이다. 새 위치 <M>{"m"}</M>을
          <M>{"m/s"}</M>로 바꾸면 전체 sequence가 기존 위치 범위 안에 들어온다.
        </p>
      </div>

      <ExplainedFormula
        question="목표 길이 L′의 모든 position을 원래 학습 범위 [0,L) 안에 넣으려면?"
        idea={<>확장 배율 s=L′/L만큼 position index를 줄인 뒤 RoPE를 계산합니다. 가장 먼 상대 거리도 L 안으로 들어오지만 가까운 거리의 각도 차이까지 s배 촘촘해집니다.</>}
        formula={String.raw`s=\frac{L'}{L},\qquad m'=\frac{m}{s}=m\frac{L}{L'}`}
        terms={[
          { symbol: "L", name: "original context", description: "checkpoint가 adaptation 전에 학습한 최대 sequence length입니다." },
          { symbol: "L'", name: "target context", description: "확장하려는 최대 sequence length입니다." },
          { symbol: "m'", name: "interpolated position", description: "RoPE에 실제로 전달하는 압축된 position index입니다." },
        ]}
        assumptions={["L′>L이고 s>1인 context extension 상황입니다."]}
        interpretation="PI는 학습 범위 밖을 그대로 extrapolation하는 대신 새 위치를 익숙한 좌표 구간에 넣습니다. 대가로 모든 frequency의 local resolution도 같은 비율로 줄어듭니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PI는 구현이 단순하고 짧은 continued training으로 적응시킬 수 있지만,
          모든 frequency의 각도 차이를 같은 비율로 줄인다. 따라서 가까운
          token을 구분하던 고주파까지 압축되는 trade-off가 생긴다.
        </p>

        <h3>NTK-aware scaling은 RoPE base를 바꾼다</h3>
        <p>
          NTK-aware scaling은 position index를 줄이는 대신 RoPE base를 키워
          inverse frequency를 조정한다. 지수적으로 배열된 frequency에 base
          변경이 다르게 반영되므로, 고주파는 상대적으로 덜 바뀌고 저주파는 더
          느려진다. 이 아이디어는 커뮤니티 구현에서 시작해 여러 inference
          library의 dynamic NTK 계열로 이어졌다.
        </p>
      </div>

      <ExplainedFormula
        question="고주파는 덜 바꾸고 저주파는 더 느리게 만드는 base scaling은 어떻게 생길까?"
        idea={<>position 전체를 줄이지 않고 RoPE base를 키웁니다. i=0인 최고 frequency는 그대로이고, i가 커질수록 새 base의 영향이 강해져 저주파가 더 느려집니다.</>}
        formula={String.raw`b'=b\,s^{d/(d-2)},\qquad \theta_i'=(b')^{-2i/d}`}
        terms={[
          { symbol: "b'", name: "scaled RoPE base", description: "목표 extension factor를 반영해 키운 frequency base입니다." },
          { symbol: "d/(d-2)", name: "dimension correction", description: "가장 느린 rotary pair가 대략 목표 scale에 맞도록 쓰이는 지수입니다." },
          { symbol: "\\theta_i'", name: "rescaled inverse frequency", description: "i가 클수록 원래 θi보다 더 크게 낮아집니다." },
        ]}
        assumptions={["정적 NTK-aware 식의 대표 표기입니다. dynamic NTK는 현재 sequence length를 반영해 effective factor를 갱신할 수 있습니다."]}
        interpretation="PI처럼 모든 frequency를 똑같이 압축하지는 않지만, 최적 base를 간접적으로 정해야 하고 구현마다 static·dynamic convention을 확인해야 합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          다만 “NTK-aware”라는 이름 아래 static·dynamic 변형과 구현 convention이
          섞여 있으므로 config 이름만 보고 같은 동작이라고 가정하면 안 된다.
          Model repository와 사용하는 library가 factor를 어떻게 해석하는지
          확인해야 한다.
        </p>
      </div>

      <figure data-viz="rope-extension-methods" className="not-prose my-9 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
        <figcaption className="mb-4 text-sm font-semibold">
          Context extension 방법이 바꾸는 대상
        </figcaption>
        <div className="grid gap-3 lg:grid-cols-2">
          {methods.map((method) => (
            <div key={method.name} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
              <p className="font-semibold">{method.name}</p>
              <dl className="mt-3 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Position</dt>
                <dd className="font-mono">{method.position}</dd>
                <dt className="text-muted-foreground">Frequency</dt>
                <dd>{method.frequency}</dd>
              </dl>
              <p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">
                {method.consequence}
              </p>
            </div>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          여기서 YaRN의 출발점이 보인다. 모든 frequency를 같은 비율로
          interpolation하지도 않고, base 하나로 변화량을 간접 조절하지도 않는다.
          대신 각 차원의 파장이 원래 context에서 얼마나 관찰됐는지를 기준으로
          처리 방식을 나눈다.
        </p>
      </div>
    </section>
  );
}
