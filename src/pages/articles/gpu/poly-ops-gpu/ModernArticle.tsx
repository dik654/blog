import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ModernPolyOpsViz } from "./ModernPolyOpsViz";

const SPPARK_NTT = "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/ntt/ntt.cuh";
const CKZG = "https://github.com/ethereum/c-kzg-4844/blob/673d93cdb5b61072f288f08c147c180cf378cb9b/src/ckzg.c";
const ICICLE = "https://github.com/ingonyama-zk/icicle/tree/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2";

export default function ModernPolyOpsGpuArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Representation을 잃지 않는 polynomial kernel</p><h2 className="text-3xl font-bold tracking-tight">GPU polynomial 연산은 배열을 빠르게 처리하기 전에 그 배열이 coefficient인지 evaluation인지부터 증명해야 한다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Polynomial의 coefficient/evaluation form, interpolation, vanishing polynomial과 NTT는 <a className="text-primary hover:underline" href="/crypto/polynomials">다항식 정본</a>과 <a className="text-primary hover:underline" href="/crypto/fft">NTT 정본</a>이 소유합니다. 여기서는 하나의 proof workload가 coefficient buffer에서 coset evaluation으로 이동하고, pointwise 계산 뒤 quotient/opening용 coefficient로 돌아오는 GPU 구현 경계만 설명합니다.</p>
      <p>Buffer receipt에는 field, representation form, domain/coset id, N, order, Montgomery/canonical state와 generation을 함께 둡니다. 길이와 element type만 같은 배열을 받는 API는 representation mismatch를 알아채지 못합니다.</p>
      <ModernPolyOpsViz />
      <ContentBoundary article="poly-ops-gpu" />
    </section>

    <section id="form-domain" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Form/domain tag</p><h2 className="mt-2 text-2xl font-bold">Kernel input을 bytes가 아니라 typed polynomial artifact로 받는다</h2></header>
      <p>Coefficient a_i는 monomial basis의 가중치이고 evaluation y_j는 특정 domain point에서의 값입니다. 같은 N field elements라도 pointwise multiplication은 evaluation form에서 convolution을 뜻하지만 coefficient form에서는 단순 coefficient별 곱일 뿐입니다. Domain root와 coset generator가 다르면 evaluation form끼리도 호환되지 않습니다.</p>
      <ExplainedFormula question="Polynomial buffer artifact를 어떤 identity로 구분할까?" idea={<>값 digest뿐 아니라 field·form·domain·order·generation을 묶어 같은 길이의 다른 의미를 분리합니다.</>} formula={String.raw`A=H(\mathrm{field}\|\mathrm{form}\|N\|\mathrm{domain}\|\mathrm{order}\|\mathrm{gen}\|H(\mathrm{bytes}))`}
      annotatedFormula={String.raw`A=\underbrace{H(\mathrm{field}\|\mathrm{form}\|N\|\mathrm{domain}\|\mathrm{order}\|\mathrm{gen}\|H(\mathrm{bytes}))}_{\text{Domain identity 계산}}`}
      operations={[
        { expression: String.raw`H(\mathrm{field}\|\mathrm{form}\|N\|\mathrm{domain}\|\mathrm{order}\|\mathrm{gen}\|H(\mathrm{bytes}))`, annotation: ["Domain identity이(가) 식의 결과에 기여하는","방식을 계산합니다.","값 digest뿐 아니라","field·form·domain·order·generation을"] },
      ]} terms={[
        {symbol:"A",name:"Artifact identity",description:"Kernel input/output receipt에 저장하는 digest입니다."},
        {symbol:"H",name:"Collision-resistant hash",description:"Metadata와 bytes를 길이 구분 encoding으로 묶는 함수입니다."},
        {symbol:"field",name:"Field identity",description:"Modulus와 internal representation revision입니다."},
        {symbol:"form",name:"Polynomial form",description:"Coefficient 또는 evaluation representation입니다."},
        {symbol:"N",name:"Logical length",description:"Degree bound/domain size와 연결된 element 수입니다."},
        {symbol:"domain",name:"Domain identity",description:"Root of unity와 coset generator를 포함합니다."},
        {symbol:"order",name:"Element order",description:"Natural 또는 bit-reversed 같은 array ordering입니다."},
        {symbol:"gen",name:"Proof generation",description:"같은 proof attempt의 stage인지 구분합니다."},
        {symbol:"bytes",name:"Serialized buffer",description:"실제 field-element payload입니다."},
      ]} assumptions={["Metadata는 canonical length-delimited encoding을 사용하고 hash algorithm/version을 고정합니다.","Artifact identity는 polynomial의 외부 statement 의미나 cryptographic soundness 전체를 증명하지 않습니다."]} interpretation="Bytes가 같아도 form=coefficient와 form=evaluation이면 A가 달라야 합니다. 그렇지 않으면 zero-heavy fixture가 representation bug를 가릴 수 있습니다." />
    </section>

    <section id="coset-plan" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Coset NTT</p><h2 className="mt-2 text-2xl font-bold">Coefficient를 g의 거듭제곱으로 twist한 뒤 NTT하면 coset에서 평가된다</h2></header>
      <ExplainedFormula question="왜 coefficient별 g^i scaling이 f(gω^j)를 만들까?" idea={<>f(gX)의 coefficient는 a_i g^i이므로, 이 새 polynomial을 ω-domain에서 NTT하면 원래 f의 coset evaluations가 됩니다.</>} formula={String.raw`\tilde a_i=a_i g^i,\qquad \operatorname{NTT}_{\omega}(\tilde a)_j=\sum_{i=0}^{N-1}a_i(g\omega^j)^i=f(g\omega^j)`}
      annotatedFormula={String.raw`\tilde a_i=\underbrace{a_i g^i,\qquad \operatorname{NTT}_{\omega}(\tilde a)_j=\sum_{i=0}^{N-1}a_i(g\omega^j)^i=f(g\omega^j)}_{\text{Twisted coefficient 계산}}`}
      operations={[
        { expression: String.raw`a_i g^i,\qquad \operatorname{NTT}_{\omega}(\tilde a)_j=\sum_{i=0}^{N-1}a_i(g\omega^j)^i=f(g\omega^j)`, annotation: ["Twisted coefficient이(가) 식의 결과에","기여하는 방식을 계산합니다.","f(gX)의 coefficient는 a_i g^i이므로, 이","새 polynomial을 ω-domain에서 NTT하면 원래"] },
      ]} terms={[
        {symbol:"a_i",name:"Coefficient",description:"f(X)=Σa_iX^i의 i번째 coefficient입니다."},
        {symbol:"i",name:"Coefficient index",description:"0부터 N−1까지 monomial degree입니다."},
        {symbol:"g",name:"Coset generator",description:"Base subgroup domain을 g배 이동하는 non-zero field element입니다."},
        {symbol:String.raw`\tilde a_i`,name:"Twisted coefficient",description:"Coset NTT 입력으로 쓰는 a_i g^i입니다."},
        {symbol:String.raw`\omega`,name:"Root of unity",description:"크기 N multiplicative subgroup의 primitive root입니다."},
        {symbol:"j",name:"Evaluation index",description:"Coset point gω^j의 position입니다."},
        {symbol:"N",name:"Domain size",description:"Transform length이자 coefficient padding 길이입니다."},
        {symbol:"f",name:"Polynomial",description:"Degree가 N보다 작은 고정 field polynomial입니다."},
      ]} assumptions={["g≠0이고 gΩ는 의도한 coset이며 N은 field two-adicity가 지원합니다.","Inverse path는 inverse NTT normalization 뒤 g^{-i}로 untwist하고 output order를 확인합니다."]} interpretation="f=1+2X, g=3이면 twisted coefficients는 (1,6)입니다. ω-domain에서 평가한 값은 정확히 f(3ω^j)입니다." />
      <p>Pinned sppark는 forward coset에서 NTT 전에, inverse coset에서는 inverse NTT 뒤에 LDE powers를 적용합니다. 이를 별도 kernel로 둘지 stage와 fuse할지는 traffic과 register pressure를 같은 workload에서 비교해야 합니다.</p>
      <div id="paper-sppark-coset"><CitationBlock type="code" citeKey={1} source="sppark ntt.cuh · commit 17278d7" href={SPPARK_NTT}><p><strong>문제:</strong> Forward/inverse NTT에서 coset powers와 bit order를 올바른 위치에 적용해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned dispatch가 CT/GS, bit reversal과 forward-before/inverse-after LDE power passes를 조합합니다.</p><p><strong>중요 가정:</strong> Commit 17278d7의 field, NTTParameters, direction/type/order를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 source revision의 coset NTT orchestration입니다.</p><p><strong>일반화 금지:</strong> 모든 library가 같은 pass 순서·fusion·성능을 갖는다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="recurrence-map" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Recurrence map</p><h2 className="mt-2 text-2xl font-bold">Horner와 synthetic division은 polynomial 사이에는 병렬이지만 한 polynomial 안에는 dependency chain이 있다</h2></header>
      <p>임의 point 하나에서의 Horner evaluation과 (f−y)/(X−z) synthetic division은 높은 coefficient의 결과를 다음 coefficient가 소비합니다. “Coefficient마다 thread 하나”로 단순 분할하면 recurrence가 깨집니다. 여러 polynomials·points를 batch하거나 prefix-style 알고리즘을 고를 수 있지만, 추가 passes·workspace와 crossover를 측정해야 합니다.</p>
      <ExplainedFormula question="Horner evaluation의 순차 dependency는 어디에 있을까?" idea={<>가장 높은 coefficient에서 시작해 이전 accumulator에 z를 곱하고 다음 coefficient를 더합니다.</>} formula={String.raw`h_{d}=a_d,\qquad h_i=h_{i+1}z+a_i\;(i=d-1,\ldots,0),\qquad f(z)=h_0`}
      annotatedFormula={String.raw`h_{d}=\underbrace{a_d,\qquad h_i=h_{i+1}z+a_i\;(i=d-1,\ldots,0),\qquad f(z)=h_0}_{\text{Evaluation 계산}}`}
      operations={[
        { expression: String.raw`a_d,\qquad h_i=h_{i+1}z+a_i\;(i=d-1,\ldots,0),\qquad f(z)=h_0`, annotation: ["Evaluation이(가) 식의 결과에 기여하는 방식을","계산합니다.","가장 높은 coefficient에서 시작해 이전","accumulator에 z를 곱하고 다음"] },
      ]} terms={[
        {symbol:"d",name:"Polynomial degree",description:"가장 높은 non-zero coefficient index입니다."},
        {symbol:"a_i",name:"Coefficient",description:"Degree i 항의 field coefficient입니다."},
        {symbol:"z",name:"Evaluation point",description:"f(z)를 계산할 field element입니다."},
        {symbol:"h_i",name:"Horner accumulator",description:"Higher-degree suffix를 z에서 접어 온 중간값입니다."},
        {symbol:"i",name:"Descending index",description:"d−1에서 0까지 순서대로 처리합니다."},
        {symbol:"f(z)",name:"Evaluation",description:"마지막 accumulator h₀입니다."},
      ]} assumptions={["Coefficient는 같은 field·canonical degree order에 있고 overflow가 없는 field operations를 사용합니다.","한 recurrence의 h_i는 h_{i+1} 완료 뒤에만 계산하며 batch 간 독립성과 혼동하지 않습니다."]} interpretation="f=1+2X+3X²,z=2이면 h2=3,h1=8,h0=17입니다. h0를 h1과 동시에 원래 a만으로 계산할 수 없습니다." />
      <ExplainedFormula question="Synthetic division 결과와 remainder를 어떻게 동시에 검사할까?" idea={<>Horner와 같은 descending recurrence가 quotient coefficients를 만들고 마지막 값은 factor theorem의 remainder f(z)가 됩니다.</>} formula={String.raw`q_{d-1}=a_d,\quad q_{i-1}=a_i+zq_i,\quad r=a_0+zq_0,\quad f(X)=(X-z)q(X)+r`}
      annotatedFormula={String.raw`q_{d-1}=\underbrace{a_d,\quad q_{i-1}=a_i+zq_i,\quad r=a_0+zq_0,\quad f(X)=(X-z)q(X)+r}_{\text{Dividend 계산}}`}
      operations={[
        { expression: String.raw`a_d,\quad q_{i-1}=a_i+zq_i,\quad r=a_0+zq_0,\quad f(X)=(X-z)q(X)+r`, annotation: ["Dividend이(가) 식의 결과에 기여하는 방식을","계산합니다.","Horner와 같은 descending recurrence가","quotient coefficients를 만들고 마지막 값은"] },
      ]} terms={[
        {symbol:"q_i",name:"Quotient coefficient",description:"q(X)의 degree i coefficient입니다."},
        {symbol:"a_i",name:"Input coefficient",description:"f(X)의 degree i coefficient입니다."},
        {symbol:"z",name:"Divisor root",description:"Divisor X−z의 field element입니다."},
        {symbol:"r",name:"Remainder",description:"Field element f(z)이며 opening claim y와 비교합니다."},
        {symbol:"f(X)",name:"Dividend",description:"나누려는 polynomial입니다."},
        {symbol:"q(X)",name:"Quotient",description:"Degree가 f보다 하나 작은 polynomial입니다."},
        {symbol:"X",name:"Formal variable",description:"Polynomial identity의 indeterminate입니다."},
      ]} assumptions={["d≥1이며 coefficient order는 ascending이고 indices가 범위를 벗어나지 않습니다.","Opening quotient (f−y)/(X−z)는 r=y일 때만 exact하므로 mismatch를 error로 처리합니다."]} interpretation="f=1+2X+3X²,z=2이면 q=8+3X,r=17이며 (X−2)(3X+8)+17=f입니다." />
      <div id="paper-ckzg-poly"><CitationBlock type="code" citeKey={2} source="c-kzg-4844 v2.1.6 · commit 673d93c" href={CKZG}><p><strong>문제:</strong> Ethereum KZG API에서 polynomial evaluation·quotient와 proof inputs를 일관되게 계산해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned official implementation은 polynomial/KZG routines와 validation path를 제공합니다.</p><p><strong>중요 가정:</strong> v2.1.6 commit, BLS12-381 field/domain constants와 API input format을 고정합니다.</p><p><strong>근거 범위:</strong> 해당 CPU reference implementation snapshot입니다.</p><p><strong>일반화 금지:</strong> GPU recurrence parallelization이나 임의 proof system의 성능을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Round-trip·exact remainder·form mismatch를 확인한 뒤 유효 element/s를 비교한다</h2></header>
      <p>Zero/constant/max-degree, N=1, wrong form/domain/order, coset g=0, unsupported N, non-zero division remainder와 aliasing을 포함합니다. CPU reference와 coset round-trip, direct evaluation, f=(X−z)q+r identity를 먼저 맞춘 뒤 H2D·twist·NTT·pointwise·INTT·recurrence·D2H를 분리 측정합니다.</p>
      <ExplainedFormula question="Polynomial kernel 후보의 useful throughput을 어떻게 기록할까?" idea={<>검증된 logical elements만 세고 전체 pipeline 및 kernel-chain 시간을 별도로 둡니다.</>} formula={String.raw`R_{elem}=\frac{B\,N_{valid}}{t_{kernel}},\qquad S=\frac{T_{reference}^{e2e}}{T_{candidate}^{e2e}}`}
      annotatedFormula={String.raw`R_{elem}=\underbrace{\frac{B\,N_{valid}}{t_{kernel}},\qquad S=\frac{T_{reference}^{e2e}}{T_{candidate}^{e2e}}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\frac{B\,N_{valid}}{t_{kernel}},\qquad S=\frac{T_{reference}^{e2e}}{T_{candidate}^{e2e}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","검증된 logical elements만 세고 전체","pipeline 및 kernel-chain 시간을 별도로","둡니다."] },
      ]} terms={[
        {symbol:"R_{elem}",name:"Useful element rate",description:"초당 검증된 polynomial elements입니다."},
        {symbol:"B",name:"Batch count",description:"독립 polynomials 또는 evaluation jobs 수입니다."},
        {symbol:"N_{valid}",name:"Valid elements per job",description:"Reference와 일치한 logical length입니다."},
        {symbol:"t_{kernel}",name:"Kernel-chain time",description:"선택한 GPU operations completion events까지의 시간입니다."},
        {symbol:"S",name:"End-to-end speedup",description:"동일 representation checks와 output verification을 포함한 시간 비율입니다."},
        {symbol:"T_{reference}^{e2e}",name:"Reference time",description:"Pinned CPU/reference 전체 경로 wall time입니다."},
        {symbol:"T_{candidate}^{e2e}",name:"Candidate time",description:"Transfer·sync·error/fallback을 포함한 GPU 전체 경로입니다."},
      ]} assumptions={["Field·N·batch·form/domain·backend SHA와 warm/cold 상태를 고정합니다.","Wrong-form rejection과 remainder mismatch를 successful output에서 제외하고 retry 비용은 포함합니다."]} interpretation="B=4,N=1024,kernel=2ms이면 2,048,000 element/s입니다. 이 값만으로 transfer가 포함된 proof throughput을 주장할 수 없습니다." />
      <div id="paper-icicle-poly"><CitationBlock type="code" citeKey={3} source="ICICLE v3.9.0 · commit 6b451e6" href={ICICLE}><p><strong>문제:</strong> Polynomial·NTT primitives를 여러 accelerator backends에서 일관된 API로 호출해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned repository가 polynomial/NTT runtime surface와 examples를 제공합니다.</p><p><strong>중요 가정:</strong> v3.9.0, supported field/backend, caller-owned stream·memory·representation을 고정합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 implementation/API surface입니다.</p><p><strong>일반화 금지:</strong> Protocol soundness·모든 size speedup·automatic form safety를 대신 보장하지 않습니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 역검사 10/10:</strong> form/domain identity, coset twist, inverse untwist, Horner dependency, synthetic quotient/remainder, 반례, fixtures, kernel/e2e 측정, failure와 rollback을 이 글만으로 풀 수 있어야 합니다. Mismatch가 나면 artifact generation을 폐기하고 이전 typed kernel plan으로 되돌립니다.</aside>
    </section>
  </article>;
}
