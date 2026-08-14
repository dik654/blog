import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ModernKzgGpuViz } from "./ModernKzgGpuViz";

const KZG = "https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf";
const CKZG = "https://github.com/ethereum/c-kzg-4844/tree/673d93cdb5b61072f288f08c147c180cf378cb9b";
const SPPARK = "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/msm/pippenger.cuh";

export default function ModernKzgGpuArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">KZG equation을 검증 가능한 GPU jobs로 내리기</p><h2 className="text-3xl font-bold tracking-tight">KZG GPU 가속은 commitment 수식을 바꾸는 일이 아니라 polynomial·SRS·MSM artifact의 identity를 보존하는 일이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Polynomial commitment interface와 KZG quotient·pairing equation은 <a className="text-primary hover:underline" href="/crypto/polycommit#kzg">KZG 정본</a>이 소유합니다. 이 글은 coefficient/evaluation buffer가 <a className="text-primary hover:underline" href="/gpu/poly-ops-gpu">GPU polynomial 연산</a>과 <a className="text-primary hover:underline" href="/gpu/msm-gpu-impl">GPU MSM</a>을 거쳐 commitment/proof가 되고, 독립 verifier receipt로 닫히는 구현 경계만 다룹니다.</p>
      <p>공통 workload는 degree 7 polynomial, 정확히 8개 SRS G1 points, evaluation claim (z,y), quotient polynomial과 proof입니다. GPU 결과가 빨라도 SRS prefix·curve·form·generation이 다르면 폐기합니다.</p>
      <ModernKzgGpuViz />
      <ContentBoundary article="kzg-gpu" />
    </section>

    <section id="srs-residency" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · SRS residency</p><h2 className="mt-2 text-2xl font-bold">SRS를 bytes로 cache하지 말고 curve·degree·digest·validation이 붙은 immutable artifact로 올린다</h2></header>
      <p>Structured reference string(SRS)은 [τ⁰]G,[τ¹]G,… points입니다. Loader는 외부 encoding을 해석하고 point-on-curve·subgroup·길이와 digest를 확인한 뒤 backend 내부 point layout으로 변환합니다. 외부 compressed bytes와 device Jacobian/affine bytes는 다르므로 고정 GB 수치를 encoding 설명 없이 일반화하지 않습니다.</p>
      <ExplainedFormula question="고정 SRS와 한 KZG job의 peak live bytes를 어떻게 예산할까?" idea={<>항상 resident인 SRS prefix에 scalar, quotient, MSM workspace와 outputs가 동시에 살아 있는 구간을 더합니다.</>} formula={String.raw`B_{live}=n s_P+n s_F+n_qs_F+B_{MSM}+B_{out}+B_{runtime}`} terms={[
        {symbol:"B_{live}",name:"Peak live bytes",description:"해당 stage에서 필요한 device allocation 합입니다."},
        {symbol:"n",name:"Commitment length",description:"사용하는 coefficients와 SRS prefix points 수입니다."},
        {symbol:"s_P",name:"Internal point bytes",description:"Validated device SRS point 하나의 aligned bytes입니다."},
        {symbol:"s_F",name:"Field element bytes",description:"Device scalar/coefficient 하나의 internal bytes입니다."},
        {symbol:"n_q",name:"Quotient length",description:"Opening quotient coefficients 수입니다."},
        {symbol:"B_{MSM}",name:"MSM workspace",description:"Digits·sort·buckets·partial reductions의 actual allocation입니다."},
        {symbol:"B_{out}",name:"Output bytes",description:"Commitment/proof와 staging buffers입니다."},
        {symbol:"B_{runtime}",name:"Runtime overhead",description:"Context·module·allocator reserve 등 측정한 기타 device bytes입니다."},
      ]} assumptions={["모든 sizes는 외부 serialization이 아니라 pinned backend의 actual aligned allocation입니다.","Buffer live intervals가 겹치는 stage를 기준으로 하며 allocator fragmentation margin을 별도 기록합니다."]} interpretation="n=8,sP=96,sF=32,nq=7,MSM=4096,out=192,runtime=1024이면 6,560B입니다. SRS만 768B라고 보고 capacity를 정하면 실패합니다." />
    </section>

    <section id="commit-job" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Commit job</p><h2 className="mt-2 text-2xl font-bold">Coefficient form과 정확한 SRS monomial prefix를 같은 MSM job으로 묶는다</h2></header>
      <ExplainedFormula question="KZG commitment가 GPU MSM의 어떤 입력이 될까?" idea={<>각 coefficient를 scalar로, 같은 degree의 SRS power를 point로 넣은 MSM 결과가 commitment입니다.</>} formula={String.raw`f(X)=\sum_{i=0}^{n-1}a_iX^i,\qquad C=\sum_{i=0}^{n-1}a_i[\tau^i]G=[f(\tau)]G`} terms={[
        {symbol:"f(X)",name:"Polynomial",description:"Degree가 n보다 작은 coefficient-form polynomial입니다."},
        {symbol:"X",name:"Formal variable",description:"Polynomial expression의 indeterminate입니다."},
        {symbol:"a_i",name:"Coefficient scalar",description:"GPU MSM의 i번째 scalar입니다."},
        {symbol:"i",name:"Degree/index",description:"Coefficient와 SRS power를 같은 위치로 묶습니다."},
        {symbol:"n",name:"MSM length",description:"Coefficient count이자 SRS prefix length입니다."},
        {symbol:"\tau",name:"Hidden setup scalar",description:"SRS ceremony가 powers를 만들 때 사용하고 폐기해야 하는 값입니다."},
        {symbol:"[\tau^i]G",name:"SRS point",description:"GPU MSM의 i번째 curve point입니다."},
        {symbol:"G",name:"Group generator",description:"고정 KZG curve subgroup의 generator입니다."},
        {symbol:"C",name:"Commitment",description:"MSM 결과로 얻는 group element입니다."},
      ]} assumptions={["SRS curve·subgroup·degree bound·basis가 polynomial profile과 일치하고 τ는 알려져 있지 않습니다.","a_i는 evaluation values가 아니라 monomial coefficients이며 internal scalar domain을 backend API에 맞춥니다."]} interpretation="a=(2,3), SRS=(G,[τ]G)이면 C=2G+3[τ]G입니다. Lagrange-form SRS를 같은 index로 넣는 것은 별도 basis 계약입니다." />
      <div id="paper-kzg-gpu"><CitationBlock type="paper" citeKey={1} source="Kate–Zaverucha–Goldberg · Polynomial Commitments (ASIACRYPT 2010)" href={KZG}><p><strong>문제:</strong> 큰 polynomial을 짧게 commit하고 한 evaluation을 작은 witness로 증명해야 합니다.</p><p><strong>핵심 기여:</strong> Degree-bounded SRS, pairing 기반 commitment·evaluation witness와 verification construction을 제시합니다.</p><p><strong>중요 가정:</strong> Bilinear group, hidden setup scalar와 논문의 binding/hiding security model을 전제로 합니다.</p><p><strong>근거 범위:</strong> KZG 수학적 commit/open/verify construction입니다.</p><p><strong>일반화 금지:</strong> GPU layout·fixed speedup·transparent/post-quantum setup·모든 batch variant를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="opening-dag" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Opening DAG</p><h2 className="mt-2 text-2xl font-bold">Evaluation·exact quotient·proof MSM·pairing verify를 generation-bound DAG로 잇는다</h2></header>
      <p>Claim y=f(z)를 계산하고 q=(f−y)/(X−z)의 remainder가 0인지 확인한 뒤 q coefficients와 SRS prefix를 MSM해 proof π를 만듭니다. Batch opening은 transcript challenge와 aggregation equation을 특정 protocol/version에 고정해야 하며, 여러 commitments를 무조건 하나의 MSM으로 이어 붙이는 식으로 group 결과를 분리할 수 없습니다.</p>
      <ExplainedFormula question="KZG artifact가 같은 입력 generation에서 만들어졌는지 어떻게 봉인할까?" idea={<>Polynomial, SRS, claim, backend와 output digests를 하나의 receipt identity에 묶어 verifier 결과와 함께 저장합니다.</>} formula={String.raw`R=H(A_f\|A_{SRS}\|z\|y\|H(C)\|H(\pi)\|v\|b)`} terms={[
        {symbol:"R",name:"KZG artifact receipt",description:"재현·rollback에 사용하는 immutable identity입니다."},
        {symbol:"H",name:"Hash",description:"Canonical encoded fields를 결합하는 pinned digest입니다."},
        {symbol:"A_f",name:"Polynomial artifact",description:"Form/domain/generation과 bytes digest입니다."},
        {symbol:"A_{SRS}",name:"SRS artifact",description:"Curve·degree·basis·validation과 digest입니다."},
        {symbol:"z,y",name:"Opening claim",description:"Evaluation point와 claimed field value입니다."},
        {symbol:"C",name:"Commitment",description:"Validated commitment group encoding입니다."},
        {symbol:"\pi",name:"Opening proof",description:"Validated quotient commitment encoding입니다."},
        {symbol:"v",name:"Verifier result",description:"Pinned independent verifier의 success/failure receipt입니다."},
        {symbol:"b",name:"Backend identity",description:"GPU model, driver, implementation SHA와 artifact key입니다."},
      ]} assumptions={["각 field는 length-delimited canonical encoding이고 verifier version·public inputs를 고정합니다.","Receipt는 verifier의 cryptographic check를 대체하지 않고 그 결과와 provenance를 결속합니다."]} interpretation="같은 C와 π라도 SRS digest가 바뀌면 R이 달라집니다. 오래된 verifier 성공을 새 setup의 승인으로 재사용할 수 없습니다." />
      <div id="paper-ckzg-kzg"><CitationBlock type="code" citeKey={2} source="ethereum/c-kzg-4844 v2.1.6 · commit 673d93c" href={CKZG}><p><strong>문제:</strong> Ethereum blob KZG commitments/proofs, trusted setup loading과 verification을 상호운용 가능한 API로 구현해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned official repository가 setup parsing, commitment/proof compute·verify와 consensus test vectors를 제공합니다.</p><p><strong>중요 가정:</strong> v2.1.6, BLS12-381, EIP-4844 profile과 shipped trusted setup/test formats를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 CPU reference/API behavior입니다.</p><p><strong>일반화 금지:</strong> 임의 KZG batch protocol·GPU acceleration·모든 proof system의 setup을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Independent verifier와 negative fixtures가 승인한 artifact만 성능 비교에 넣는다</h2></header>
      <p>Zero/constant/max-degree, SRS short/wrong digest/wrong subgroup, coefficient/evaluation mismatch, y·z mutation, quotient remainder, malformed C/π, GPU OOM·timeout과 fallback을 포함합니다. CPU reference와 GPU C·π bytes 또는 normalized points를 비교하고, pinned independent verifier가 valid를 승인하고 invalid를 같은 failure class로 거절해야 합니다.</p>
      <ExplainedFormula question="KZG GPU 경로의 유효 처리량과 speedup을 어떤 경계에서 계산할까?" idea={<>독립 verifier가 승인한 artifacts만 세고 setup cache hit/cold, transfer, polynomial work와 MSM을 포함한 같은 wall-clock 경계를 비교합니다.</>} formula={String.raw`R_{KZG}=\frac{N_{verified}}{T_{wall}},\qquad S=\frac{T_{reference}^{e2e}}{T_{GPU}^{e2e}}`} terms={[
        {symbol:"R_{KZG}",name:"Verified artifact rate",description:"초당 승인된 commitments/opening proofs입니다."},
        {symbol:"N_{verified}",name:"Verified outputs",description:"Pinned independent verifier가 승인한 artifact 수입니다."},
        {symbol:"T_{wall}",name:"Wall time",description:"정한 request/input boundary부터 verifier receipt까지입니다."},
        {symbol:"S",name:"End-to-end speedup",description:"같은 correctness gate를 통과한 reference 대비 GPU 비율입니다."},
        {symbol:"T_{reference}^{e2e}",name:"Reference time",description:"같은 SRS·polynomial·claim을 쓰는 CPU/reference 전체 시간입니다."},
        {symbol:"T_{GPU}^{e2e}",name:"GPU time",description:"SRS load/cache, transfer, quotient, MSM, sync, fallback과 verification을 포함합니다."},
      ]} assumptions={["SRS/circuit/input/backend SHA, batch, concurrency와 warm/cold cache state를 고정합니다.","Invalid, retry, fallback과 queue time을 숨기지 않고 kernel-only 결과는 별도 표에 둡니다."]} interpretation="GPU MSM이 1ms여도 quotient 3ms, transfers 2ms, verify 2ms면 전체는 최소 8ms입니다. MSM 숫자를 KZG end-to-end로 부르면 안 됩니다." />
      <div id="paper-sppark-kzg-msm"><CitationBlock type="code" citeKey={3} source="sppark pippenger.cuh · commit 17278d7" href={SPPARK}><p><strong>문제:</strong> KZG commitment/proof가 소비하는 large curve MSM을 GPU bucket kernels로 실행해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 signed digit breakdown, sort/accumulate/integrate MSM path를 제공합니다.</p><p><strong>중요 가정:</strong> Commit 17278d7, supported curve/scalar representation과 launch configuration을 고정합니다.</p><p><strong>근거 범위:</strong> KZG가 호출할 수 있는 MSM implementation snapshot입니다.</p><p><strong>일반화 금지:</strong> KZG protocol·SRS validation·fixed proof speedup을 대신 보장하지 않습니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 역검사 10/10:</strong> SRS identity/residency, coefficient-SRS binding, commitment MSM, quotient DAG, receipt, negative fixtures, independent verifier, memory example, end-to-end measurement와 rollback을 이 글만으로 다뤄야 합니다. Verification·failure parity·p95 중 하나라도 퇴행하면 이전 backend artifact로 되돌립니다.</aside>
    </section>
  </article>;
}
