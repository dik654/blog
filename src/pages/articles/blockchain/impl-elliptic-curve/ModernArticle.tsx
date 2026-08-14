import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CurveImplementationViz } from "./CurveImplementationViz";

const ARK_SW = "https://github.com/arkworks-rs/algebra/tree/6a28df57ddf1f0cb9735ec22d6e9e7f8785980b5/ec/src/models/short_weierstrass";
const ARK_BN = "https://github.com/arkworks-rs/curves/tree/e2d16a27e2cfa9f972ae9772df827a22730011b4/bn254";

export default function ModernCurveImplementationArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Bytes를 G1/G2와 pairing receipt로 안전하게 승격하기</p><h2 className="text-3xl font-bold tracking-tight">타원곡선 구현은 점 공식을 옮기는 일보다 curve profile과 admission 순서를 지키는 일이 먼저다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">증명 파일에서 읽은 좌표 두 개를 곧바로 G1으로 다루면 안 됩니다. Encoding을 canonical하게 해석하고 curve equation과 subgroup을 확인한 뒤에야 typed point가 됩니다. <a className="text-primary hover:underline" href="/crypto/elliptic-curves">곡선군·Jacobian·pairing 정본</a>이 수학을 소유하며, 이 글은 BN254를 예로 Rust artifact, 좌표 연산 profile과 release gate를 설명합니다.</p>
      <p>고정 workload는 compressed point를 읽어 G1 scalar multiplication과 G2 pairing product를 수행하고 검증 receipt를 만드는 흐름입니다. G1과 G2는 서로 바꿀 수 없고, infinity·twist·subgroup·encoding rules도 같은 profile revision에 묶습니다.</p>
      <CurveImplementationViz />
      <ContentBoundary article="impl-elliptic-curve" />
    </section>

    <section id="curve-profile" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Curve profile artifact</p><h2 className="mt-2 text-2xl font-bold">field id부터 generator·order·twist·pairing constants까지 하나의 digest로 고정한다</h2></header>
      <p>Profile은 base/scalar field artifact ids, curve coefficients a,b, G1/G2 generators, subgroup order r와 cofactors, G2 twist embedding, Miller loop parameter, final exponent strategy, point encoding schema와 source revision을 포함합니다. “BN254”라는 이름만으로는 구현 artifact를 식별하기에 부족합니다.</p>
      <ExplainedFormula question="Curve profile이 어떤 객체를 구현하는지 최소한 어떻게 확인할까?" idea={<>Generator가 equation 위에 있고 subgroup order를 곱하면 identity가 되는지 artifact 생성 단계에서 확인합니다.</>} formula={String.raw`G=(x_G,y_G):\ y_G^2=x_G^3+ax_G+b\pmod p,\qquad [r]G=\mathcal O`} terms={[
        {symbol:"G",name:"Generator",description:"Profile이 지정한 subgroup generator입니다."},{symbol:"x_G,y_G",name:"Coordinates",description:"Base field 또는 G2 twist field의 coordinates입니다."},{symbol:"a,b",name:"Curve coefficients",description:"Short-Weierstrass equation의 constants입니다."},{symbol:"p",name:"Base modulus",description:"Coordinates가 속한 field의 modulus입니다."},{symbol:"r",name:"Subgroup order",description:"Scalar field modulus이자 G가 생성하는 subgroup의 order입니다."},{symbol:String.raw`\mathcal O`,name:"Identity",description:"Point at infinity입니다."},{symbol:"[r]G",name:"Scalar multiplication",description:"G를 r번 더한 group operation입니다."},
      ]} assumptions={["Discriminant가 0이 아니며 G1/G2 profile은 각자의 field·twist equation을 사용합니다.","두 검사는 parameter typo를 찾지만 secure curve selection이나 pairing construction 전체의 proof는 아닙니다."]} interpretation="On-curve만 통과한 점은 더 큰 group의 작은 subgroup에 있을 수 있습니다. [r]P=O 또는 profile-specific subgroup check가 admission에 추가로 필요합니다." />
      <div id="paper-arkworks-bn254"><CitationBlock type="code" citeKey={1} source="arkworks curves · BN254 parameters · commit e2d16a2" href={ARK_BN}><p><strong>문제:</strong> BN254의 fields, G1/G2, twist와 pairing parameters를 Rust types로 일관되게 제공해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 BN254-specific configuration과 generators를 generic algebra traits에 연결합니다.</p><p><strong>중요 가정:</strong> commit e2d16a2와 의존 algebra revision, feature flags를 함께 고정합니다.</p><p><strong>근거 범위:</strong> 해당 arkworks revision의 BN254 parameter implementation입니다.</p><p><strong>일반화 금지:</strong> 다른 BN curve·encoding·security target 또는 사용자 정의 constants의 안전성을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="point-encoding" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Point encoding admission</p><h2 className="mt-2 text-2xl font-bold">tag→canonical coordinate→equation→subgroup 순서가 끝나기 전에는 point 타입을 만들지 않는다</h2></header>
      <p>Decoder는 compression/infinity/sign flags와 고정 길이를 먼저 확인합니다. x나 y가 field modulus 이상이면 거절하고, 압축 형식이면 equation에서 y를 복구해 sign rule을 적용합니다. Infinity encoding은 profile이 허용한 단 하나의 형태만 받고, on-curve와 subgroup check를 통과한 뒤 G1/G2 타입을 반환합니다.</p>
      <ExplainedFormula question="Compressed x에서 y 후보를 복구한 뒤 왜 검사가 더 필요한가?" idea={<>Equation의 square root는 두 후보를 만들며 sign bit가 하나를 고릅니다. 그러나 subgroup membership은 equation만으로 결정되지 않습니다.</>} formula={String.raw`y^2=x^3+ax+b\pmod p,\qquad y\in\{y_0,\ p-y_0\},\qquad [r]P=\mathcal O`} terms={[
        {symbol:"x",name:"Decoded x",description:"Canonical range를 통과한 coordinate입니다."},{symbol:"y_0",name:"Square-root candidate",description:"Right-hand side의 한 modular square root입니다."},{symbol:"p-y_0",name:"Second root",description:"y0와 반대 부호인 다른 curve point입니다."},{symbol:"a,b",name:"Curve coefficients",description:"Pinned profile의 equation constants입니다."},{symbol:"P",name:"Decoded point",description:"Sign rule까지 적용한 candidate point입니다."},{symbol:"r",name:"Subgroup order",description:"Typed group이 허용하는 prime-order subgroup 크기입니다."},{symbol:String.raw`\mathcal O`,name:"Identity",description:"Subgroup check의 결과 identity입니다."},
      ]} assumptions={["Square-root algorithm과 sign convention, flag bit placement가 encoding profile에 고정됩니다.","Cofactor clearing을 admission 대신 쓸지는 protocol이 명시해야 하며 attacker bytes를 조용히 다른 point로 바꾸면 안 됩니다."]} interpretation="x가 equation 위의 y를 만들더라도 [r]P≠O이면 원하는 subgroup 점이 아닙니다. Pairing verifier에 넣기 전에 거절해야 합니다." />
    </section>

    <section id="coordinate-ops" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Coordinate operation profile</p><h2 className="mt-2 text-2xl font-bold">저장은 affine, 반복 연산은 Jacobian으로 하되 exceptional branch와 normalization 비용을 숨기지 않는다</h2></header>
      <p>Affine addition은 inversion을 요구하므로 MSM처럼 덧셈이 많은 경로에서는 Jacobian (X:Y:Z)을 씁니다. Z=0을 identity로 정하고 mixed-add, double, full-add의 formula family와 a=0 같은 전제를 profile에 적습니다. “complete formula”가 아닌 구현이라면 P=Q, P=−Q, infinity branches를 명시적으로 검사합니다.</p>
      <ExplainedFormula question="Jacobian coordinates가 affine point를 어떻게 나타내며 무엇을 아끼는가?" idea={<>Z의 역원을 매 덧셈마다 계산하지 않고 projective coordinates로 누적한 뒤 경계에서 한 번 normalization합니다.</>} formula={String.raw`(x,y)=\left(\frac{X}{Z^2},\frac{Y}{Z^3}\right),\qquad Z\ne0`} terms={[
        {symbol:"X,Y,Z",name:"Jacobian coordinates",description:"같은 affine point의 projective representation입니다."},{symbol:"x,y",name:"Affine coordinates",description:"Serialization과 pairing input 경계의 normalized point입니다."},{symbol:"Z^2,Z^3",name:"Projective scale",description:"Field multiplications로 갱신하는 scale powers입니다."},{symbol:"Z\ne0",name:"Finite-point condition",description:"Z=0은 implementation convention상 identity입니다."},
      ]} assumptions={["Field inversion은 Z≠0에서만 수행하고 identity는 별도 branch로 처리합니다.","사용한 add/double formula의 curve coefficient·exception assumptions를 source revision에 고정합니다."]} interpretation="Projective coordinates는 inversion을 없애는 것이 아니라 뒤로 미룹니다. 여러 점은 batch inversion으로 normalize할 수 있지만 zero Z를 분리해야 합니다." />
      <div id="paper-arkworks-sw"><CitationBlock type="code" citeKey={2} source="arkworks algebra · short-Weierstrass model · commit 6a28df5" href={ARK_SW}><p><strong>문제:</strong> Affine/projective points와 add/double/scalar multiplication을 curve-specific configuration 위에 구현해야 합니다.</p><p><strong>핵심 기여:</strong> Generic short-Weierstrass types, serialization hooks와 group operations의 concrete Rust implementation을 제공합니다.</p><p><strong>중요 가정:</strong> Exact curve config, field backend와 commit 6a28df5의 formula branches를 함께 읽습니다.</p><p><strong>근거 범위:</strong> Pinned ark-ec implementation structure와 operation behavior입니다.</p><p><strong>일반화 금지:</strong> 모든 공식이 모든 curve에서 complete하거나 fixed operation count·constant-time을 가진다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Pairing and release gate</p><h2 className="mt-2 text-2xl font-bold">공식 vectors와 negative encodings를 통과한 뒤 pairing product와 end-to-end verifier를 비교한다</h2></header>
      <p>Identity, generator, P+O, P+(−P), P+P, random scalar, invalid flags, x≥p, off-curve, wrong subgroup와 G1/G2 type confusion을 포함합니다. Pairing은 bilinearity와 non-degeneracy vectors, product equation, independent library parity를 검사합니다. Benchmark는 deserialize·subgroup check·Miller loop·final exponentiation을 나눠 기록하고 binary/profile digest가 바뀌면 rollback 가능한 receipt를 만듭니다.</p>
      <ExplainedFormula question="Pairing implementation의 핵심 동작을 어떤 equality로 검증할까?" idea={<>Scalar multiplication을 pairing 전후 어느 쪽에 적용해도 같은 target-group 값이 나와야 합니다.</>} formula={String.raw`e([a]P,[b]Q)=e(P,Q)^{ab},\qquad e(P,Q)\ne1`} terms={[
        {symbol:"e",name:"Pairing",description:"G1×G2에서 target group GT로 가는 bilinear map입니다."},{symbol:"P",name:"G1 point",description:"Admission을 통과한 G1 subgroup point입니다."},{symbol:"Q",name:"G2 point",description:"Admission을 통과한 G2 subgroup point입니다."},{symbol:"a,b",name:"Scalars",description:"Scalar field의 test values입니다."},{symbol:"[a]P,[b]Q",name:"Scalar multiples",description:"각 group에서 수행한 scalar multiplication입니다."},{symbol:"e(P,Q)^{ab}",name:"Target exponentiation",description:"GT에서 pairing value를 ab만큼 거듭제곱한 값입니다."},{symbol:"1",name:"GT identity",description:"Non-degeneracy fixture가 피해야 할 trivial result입니다."},
      ]} assumptions={["P,Q는 올바른 prime-order subgroups에 있고 pairing parameters와 final exponent가 같은 curve profile에 속합니다.","몇 개 vector의 bilinearity는 security proof나 모든 input correctness를 대신하지 않습니다."]} interpretation="Bilinearity가 실패하면 Miller loop, line function, Frobenius 또는 final exponent profile 중 하나가 어긋난 것입니다. 어느 stage가 틀렸는지 intermediate fixture로 좁힙니다." />
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 10/10:</strong> curve artifact, G/r checks, decoding 순서, compressed root 반례, subgroup, Jacobian 의미, exceptional cases, pairing equality, negative suite, stage measurement·rollback을 이 글만으로 답할 수 있습니다.</aside>
    </section>
  </article>;
}
