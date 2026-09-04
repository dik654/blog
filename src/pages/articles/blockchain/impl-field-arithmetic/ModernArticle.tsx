import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { FieldImplementationViz } from "./FieldImplementationViz";

const ARK_FP = "https://github.com/arkworks-rs/algebra/tree/6a28df57ddf1f0cb9735ec22d6e9e7f8785980b5/ff/src/fields/models/fp";
const ARK_SERIALIZE = "https://github.com/arkworks-rs/algebra/blob/6a28df57ddf1f0cb9735ec22d6e9e7f8785980b5/serialize/src/lib.rs";

export default function ModernFieldImplementationArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">수학의 field element를 검증 가능한 Rust artifact로 내리기</p><h2 className="text-3xl font-bold tracking-tight">유한체 구현은 큰 정수 연산 하나가 아니라 parameter·내부 표현·직렬화 경계를 함께 고정하는 일이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">증명기는 같은 수를 세 모습으로 다룹니다. 파일과 네트워크에서는 canonical bytes, 함수 안에서는 여러 machine-word limbs, 곱셈이 반복될 때는 Montgomery domain을 씁니다. <a href="/crypto/field-arithmetic" className="text-primary hover:underline">소수체와 Montgomery reduction 정본</a>이 수학을 소유하므로, 이 글은 그 수학을 Rust 타입과 artifact로 구현하고 잘못된 bytes를 거절하는 경계만 설명합니다.</p>
      <p>
            고정 예시는 BN254 scalar field의 element 하나가 proof input에서 들어와 곱셈을 거쳐 다시 canonical bytes로 나가는 흐름입니다.
            Base field와 scalar field는 비트 길이가 비슷해도 서로 다른 타입이며 modulus·encoding·domain digest가 맞지 않으면 계산을 시작하지
            않습니다.
          </p>
      <FieldImplementationViz />
      <ContentBoundary article="impl-field-arithmetic" />
    </section>

    <section id="parameter-artifact" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Parameter artifact</p><h2 className="mt-2 text-2xl font-bold">modulus만 하드코딩하지 말고 limb layout과 Montgomery constants를 같은 revision으로 봉인한다</h2></header>
      <p>Artifact에는 field id, prime modulus, word width, limb count와 order, R·R²·inv, two-adicity와 root of unity, extension을 쓴다면 non-residue와 Frobenius table, generator/compiler revision을 넣습니다. 코드 생성 결과와 test vector에도 같은 digest를 남겨야 “상수 한 줄만 바뀐 binary”를 구분할 수 있습니다.</p>
      <ExplainedFormula question="Prime p를 L개 limbs와 Montgomery constants로 옮길 때 무엇을 계산할까?" idea={<>Word width에 맞춰 R을 p보다 큰 2의 거듭제곱으로 잡고, 입력 x를 xR mod p로 저장합니다.</>} formula={String.raw`L=\left\lceil\frac{\operatorname{bitlen}(p)}{w}\right\rceil,\quad R=2^{wL},\quad R_2=R^2\bmod p,\quad n'=-p_0^{-1}\bmod 2^w`}
      annotatedFormula={String.raw`L=\underbrace{\left\lceil\frac{\operatorname{bitlen}(p)}{w}\right\rceil,\quad R=2^{wL},\quad R_2=R^2\bmod p,\quad n'=-p_0^{-1}\bmod 2^w}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\left\lceil\frac{\operatorname{bitlen}(p)}{w}\right\rceil,\quad R=2^{wL},\quad R_2=R^2\bmod p,\quad n'=-p_0^{-1}\bmod 2^w`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Word width에 맞춰 R을 p보다"] },
      ]} terms={[
        {symbol:"p",name:"Prime modulus",description:"Field Fp를 정의하는 소수입니다."},{symbol:"w",name:"Word width",description:"한 limb의 bit 수입니다."},{symbol:"L",name:"Limb count",description:"p를 담는 word 개수입니다."},{symbol:"R",name:"Montgomery radix",description:"p보다 크고 p와 서로소인 2의 거듭제곱입니다."},{symbol:"R_2",name:"Conversion constant",description:"Canonical x를 Montgomery xR mod p로 옮길 때 쓰는 상수입니다."},{symbol:"p_0",name:"Least-significant limb",description:"Little-endian limb 배열에서 p의 첫 word입니다."},{symbol:"n'",name:"Reduction inverse",description:"낮은 word를 소거하는 modular inverse 상수입니다."},
      ]} assumptions={["p는 홀수 prime이고 limb order·w·L이 artifact와 일치합니다.","이 식은 상수의 의미를 보여 주며 실제 carry schedule과 constant-time 성질은 compiler·ISA까지 별도 검사합니다."]} interpretation="bitlen(p)=254, w=64이면 L=4이고 R=2^256입니다. p나 w가 달라지면 R2와 n'도 함께 다시 생성해야 합니다." />
      <div id="paper-arkworks-field"><CitationBlock type="code" citeKey={1} source="arkworks algebra · prime-field model · commit 6a28df5" href={ARK_FP}><p><strong>문제:</strong> 여러 prime fields를 같은 Rust API로 구현하면서 modulus별 constants와 arithmetic backend를 결속해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 prime-field configuration, big-integer representation과 field operations의 구현 경계를 제공합니다.</p><p><strong>중요 가정:</strong> commit 6a28df5의 trait·macro·backend와 선택한 field configuration을 함께 고정합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 ark-ff 코드 구조와 구현입니다.</p><p><strong>일반화 금지:</strong> 이 source가 임의의 custom constants, side-channel resistance나 production audit를 자동 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="serialization" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Serialization boundary</p><h2 className="mt-2 text-2xl font-bold">internal limbs를 그대로 내보내지 않고 canonical integer를 하나의 byte string으로만 허용한다</h2></header>
      <p>Deserialize는 길이와 endianness를 확인하고 정수 x를 복원한 뒤 x&lt;p인지 검사합니다. 그 다음에만 Montgomery domain으로 변환합니다. p와 같은 bytes, 불필요한 leading padding, 다른 field type tag, truncated input은 typed error로 끝내며 “일단 mod p”로 줄여 받지 않습니다.</p>
      <ExplainedFormula question="같은 field element에 여러 byte 표현이 생기지 않게 하려면?" idea={<>정해진 길이와 byte order로 정수 x를 복원하고 canonical range에 들어온 경우만 승인합니다.</>} formula={String.raw`x=\sum_{i=0}^{B-1} b_i2^{8i},\qquad \operatorname{admit}(b)\iff |b|=B\ \land\ 0\le x<p`}
      annotatedFormula={String.raw`x=\underbrace{\sum_{i=0}^{B-1} b_i2^{8i},\qquad \operatorname{admit}(b)\iff |b|=B\ \land\ 0\le x<p}_{\text{판정 조건 결합}}`}
      operations={[
        { expression: String.raw`\sum_{i=0}^{B-1} b_i2^{8i},\qquad \operatorname{admit}(b)\iff |b|=B\ \land\ 0\le x<p`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","정해진 길이와 byte order로 정수 x를 복원하고","canonical range에 들어온 경우만 승인합니다."] },
      ]} terms={[
        {symbol:"b_i",name:"Byte",description:"Little-endian encoding의 i번째 byte입니다."},{symbol:"B",name:"Encoded length",description:"Profile이 정한 고정 byte 수입니다."},{symbol:"x",name:"Decoded integer",description:"Domain 변환 전 canonical 정수입니다."},{symbol:"p",name:"Prime modulus",description:"x가 반드시 작아야 하는 field modulus입니다."},{symbol:String.raw`\operatorname{admit}`,name:"Admission predicate",description:"Bytes를 typed field element로 승격할 조건입니다."},
      ]} assumptions={["예시는 little-endian입니다. Protocol이 big-endian이면 index 식과 artifact를 함께 바꿉니다.","Compression flag가 좌표 high bits를 공유하는 point encoding은 별도의 schema가 필요합니다."]} interpretation="B=2,p=17에서 0x1000은 x=16이라 승인하지만 0x1100은 x=17이라 거절합니다. 둘을 mod 17로 0에 합치면 malleability가 생깁니다." />
      <div id="paper-arkworks-serialize"><CitationBlock type="code" citeKey={2} source="arkworks canonical serialization traits · commit 6a28df5" href={ARK_SERIALIZE}><p><strong>문제:</strong> Cryptographic objects의 encoding과 validation mode를 일관된 API로 노출해야 합니다.</p><p><strong>핵심 기여:</strong> CanonicalSerialize·CanonicalDeserialize와 validation/compression modes를 정의합니다.</p><p><strong>중요 가정:</strong> Exact type implementation과 protocol schema가 같은 commit·version에 맞아야 합니다.</p><p><strong>근거 범위:</strong> arkworks serialization interface와 error boundary입니다.</p><p><strong>일반화 금지:</strong> Trait 사용만으로 cross-language compatibility·canonical field range·point subgroup 검사가 자동 증명되지는 않습니다.</p></CitationBlock></div>
    </section>

    <section id="execution-profile" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Execution profile</p><h2 className="mt-2 text-2xl font-bold">adc·sbb·mac의 carry schedule과 최종 subtraction을 입력값과 무관한 경로로 검토한다</h2></header>
      <p>덧셈은 carry, 뺄셈은 borrow, 곱셈은 full-width partial products를 전파합니다. Montgomery reduction은 낮은 limbs를 차례로 소거하고 마지막 후보가 p 이상이면 p를 뺍니다. Source가 branchless처럼 보여도 compiler가 secret-dependent branch나 table lookup을 만들 수 있으므로 target binary의 codegen과 timing 분포를 함께 검사합니다.</p>
      <ExplainedFormula question="Montgomery reduction이 2L-limb 곱 T를 다시 L limbs로 만드는 핵심은?" idea={<>T의 낮은 R 영역을 상수 n′로 상쇄하는 m을 고른 뒤 p의 배수를 더하고 R로 나눕니다.</>} formula={String.raw`m=(T\bmod R)n'\bmod R,\qquad u=\frac{T+mp}{R},\qquad z=u\ge p\ ?\ u-p:u`}
      annotatedFormula={String.raw`m=\underbrace{(T\bmod R)n'\bmod R,\qquad u=\frac{T+mp}{R},\qquad z=u\ge p\ ?\ u-p:u}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`(T\bmod R)n'\bmod R,\qquad u=\frac{T+mp}{R},\qquad z=u\ge p\ ?\ u-p:u`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","T의 낮은 R 영역을 상수 n′로 상쇄하는 m을 고른 뒤 p의","배수를 더하고 R로 나눕니다."] },
      ]} terms={[
        {symbol:"T",name:"Wide product",description:"두 Montgomery residues를 곱한 최대 2L-limb 값입니다."},{symbol:"R",name:"Radix",description:"2^(wL)인 limb base입니다."},{symbol:"n'",name:"Inverse",description:"-p^(-1) mod R이며 word implementation은 낮은 words부터 적용합니다."},{symbol:"m",name:"Cancellation factor",description:"T+mp의 낮은 L limbs를 0으로 만듭니다."},{symbol:"u",name:"Reduced candidate",description:"R로 정확히 나눈 뒤의 bounded candidate입니다."},{symbol:"z",name:"Canonical residue",description:"Conditional subtraction 뒤 [0,p) 범위 값입니다."},
      ]} assumptions={["입력 bounds가 implementation proof가 요구하는 범위에 있고 n′와 p가 같은 artifact에 속합니다.","삼항 표기는 개념식이며 실제 구현은 constant-time select와 target codegen audit가 필요합니다."]} interpretation="마지막 subtraction을 생략하면 값이 field와 동치여도 [0,p) canonical invariant가 깨져 serialization과 비교가 달라질 수 있습니다." />
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">경계값·reference parity·round-trip·codegen을 모두 통과한 artifact만 배포한다</h2></header>
      <p>0,1,p−1,p,p+1, maximal limbs와 carry chain을 길게 만드는 vectors를 넣습니다. Big-int reference와 add/sub/mul/inverse parity, field laws, serialize-deserialize round trip, noncanonical rejection, base/scalar type mismatch, extension/Frobenius identities를 확인합니다. Compiler·target flags가 바뀌면 binary digest와 timing audit를 다시 만들고 실패하면 이전 artifact로 rollback합니다.</p>
      <ExplainedFormula question="성능 수치가 correctness 실패를 숨기지 않게 어떤 비율을 보고할까?" idea={<>검증을 통과한 operations만 wall-clock 시간의 분자에 넣고 실패를 별도 count로 남깁니다.</>} formula={String.raw`R_{valid}=\frac{N_{total}-N_{failed}}{T_{setup}+T_{ops}+T_{check}}`}
      annotatedFormula={String.raw`R_{valid}=\underbrace{\frac{N_{total}-N_{failed}}{T_{setup}+T_{ops}+T_{check}}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\frac{N_{total}-N_{failed}}{T_{setup}+T_{ops}+T_{check}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","검증을 통과한 operations만 wall-clock 시간의","분자에 넣고 실패를 별도 count로 남깁니다."] },
      ]} terms={[
        {symbol:"R_{valid}",name:"Verified operation rate",description:"초당 reference parity를 통과한 operations입니다."},{symbol:"N_{total}",name:"Attempted operations",description:"측정 구간의 전체 field operations 수입니다."},{symbol:"N_{failed}",name:"Failed operations",description:"값·encoding·invariant 검사를 통과하지 못한 수입니다."},{symbol:"T_{setup}",name:"Setup time",description:"Artifact load와 buffer 준비 시간입니다."},{symbol:"T_{ops}",name:"Arithmetic time",description:"Warmup 뒤 연산 실행 시간입니다."},{symbol:"T_{check}",name:"Validation time",description:"Reference와 serialization 검사를 완료한 시간입니다."},
      ]} assumptions={["같은 artifact digest·compiler·target·input corpus를 비교합니다.","Microbenchmark와 proof end-to-end 결과를 분리하고 median·p95·RSS를 함께 기록합니다."]} interpretation="100만 회 중 2회가 틀렸다면 raw ops/s가 높아도 release 후보가 아닙니다. 실패를 분자에서 빼는 것만으로 충분하지 않고 gate 자체가 fail closed여야 합니다." />
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 10/10:</strong> parameter artifact, limb 계산, canonical admission, p 반례, Montgomery reduction, carry 경계, constant-time 범위, base/scalar 분리, release vectors, 측정·rollback을 이 글만으로 답할 수 있습니다.</aside>
    </section>
  </article>;
}
