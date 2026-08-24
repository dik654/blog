import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { PoseidonKernelViz } from "./PoseidonKernelViz";

const POSEIDON = "https://www.usenix.org/system/files/sec21-grassi.pdf";
const FILECOIN = "https://spec.filecoin.io/algorithms/crypto/poseidon/";
const ICICLE = "https://github.com/ingonyama-zk/icicle/blob/6b451e6ed5dcdd9b49aa5f9d5657e0c00cfab6a2/docs/docs/icicle/primitives/poseidon.md";

export default function ModernPoseidonGpuArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Poseidon instance를 검증 가능한 GPU batch로 내리기</p><h2 className="text-3xl font-bold tracking-tight">GPU Poseidon의 출발점은 x⁵ kernel이 아니라 field·width·round constants가 봉인된 parameter artifact다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">고정 proof workload에서 witness의 field elements는 hash와 Merkle tree inputs가 되고, root는 이후 proof statement에 들어갑니다. <a className="text-primary hover:underline" href="/crypto/poseidon-hash">Poseidon 정본</a>이 sponge, HADES rounds, S-box와 MDS의 수학·security를 소유합니다. 이 글은 exact instance를 GPU state lanes와 batch/tree frontier로 내리고, reference parity를 통과한 artifact만 release하는 구현 경계를 맡습니다.</p>
      <p>“Poseidon은 α=5, RF=8, RP=57”처럼 하나의 숫자 묶음을 보편값으로 외우면 안 됩니다. Prime field, state width와 security target에 따라 profile이 달라지며, optimized constants와 sparse transforms도 같은 derivation revision에 속해야 합니다.</p>
      <PoseidonKernelViz />
      <ContentBoundary article="poseidon-gpu" />
    </section>

    <section id="parameter-artifact" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Parameter artifact</p><h2 className="mt-2 text-2xl font-bold">Field부터 constants digest까지 하나의 immutable profile로 묶고 partial mix를 임의 조합하지 않는다</h2></header>
      <p>Artifact에는 modulus, state width t, rate/capacity, domain tag, S-box exponent α, full/partial rounds, round constants, MDS와 optimized sparse matrices, generator revision을 넣습니다. Caller input의 field encoding과 profile field가 다르면 kernel launch 전에 실패합니다.</p>
      <ExplainedFormula question="GPU output이 정확히 어느 Poseidon instance의 결과인지 어떻게 봉인할까?" idea={<>Algorithm 이름 대신 모든 parameters와 constants bytes를 canonical digest에 결속합니다.</>} formula={String.raw`A_P=H(p\|t\|r\|c\|\alpha\|R_F\|R_P\|H(C)\|H(M)\|v)`}
      annotatedFormula={String.raw`A_P=\underbrace{H(p\|t\|r\|c\|\alpha\|R_F\|R_P\|H(C)\|H(M)\|v)}_{\text{S-box exponent 계산}}`}
      operations={[
        { expression: String.raw`H(p\|t\|r\|c\|\alpha\|R_F\|R_P\|H(C)\|H(M)\|v)`, annotation: ["S-box exponent이(가) 식의 결과에 기여하는 방식을","계산합니다.","Algorithm 이름 대신 모든 parameters와","constants bytes를 canonical digest에"] },
      ]} terms={[
        {symbol:"A_P",name:"Parameter artifact",description:"한 Poseidon instance를 식별하는 digest입니다."},
        {symbol:"H",name:"Digest",description:"Length-delimited canonical encoding에 적용한 pinned hash입니다."},
        {symbol:"p",name:"Prime modulus",description:"State elements가 속한 field Fp의 modulus입니다."},
        {symbol:"t",name:"State width",description:"한 permutation state의 field-element 수입니다."},
        {symbol:"r,c",name:"Rate and capacity",description:"Input/output 영역과 security margin 영역의 widths이며 t=r+c입니다."},
        {symbol:"\\alpha",name:"S-box exponent",description:"Pinned profile의 nonlinear power exponent입니다."},
        {symbol:"R_F,R_P",name:"Round counts",description:"Full rounds와 partial rounds의 수입니다."},
        {symbol:"C",name:"Round constants",description:"Round와 state coordinate별 field constants입니다."},
        {symbol:"M",name:"Mixing artifacts",description:"MDS와 profile에 포함된 pre/sparse matrix bytes입니다."},
        {symbol:"v",name:"Revision",description:"Parameter generator/spec/backend schema revision입니다."},
      ]} assumptions={["각 field는 type·length·endianness가 고정된 canonical encoding입니다.","Security는 원 논문의 parameter-generation assumptions와 선택한 audited profile에 귀속하며 digest 자체가 안전성을 증명하지 않습니다."]} interpretation="같은 p와 t라도 RP나 constants 한 element가 바뀌면 AP가 달라집니다. Old GPU cache를 새 circuit profile에 재사용하면 안 됩니다." />
      <div id="paper-poseidon-gpu-theory"><CitationBlock type="paper" citeKey={1} source="Grassi et al. · Poseidon (USENIX Security 2021)" href={POSEIDON}><p><strong>문제:</strong> Prime-field proof systems 안에서 constraint 비용이 낮으면서 분석 가능한 hash/permutation이 필요합니다.</p><p><strong>핵심 기여:</strong> HADES full/partial round strategy, parameter/security analysis와 Poseidon construction을 제시합니다.</p><p><strong>중요 가정:</strong> 선택한 field·width·security target과 논문의 attack model·parameter generation을 전제로 합니다.</p><p><strong>근거 범위:</strong> Poseidon 수학과 parameter rationale입니다.</p><p><strong>일반화 금지:</strong> 특정 CUDA mapping·고정 round 수·고정 GPU speedup을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="round-kernel" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Round kernel</p><h2 className="mt-2 text-2xl font-bold">ARK→S-box→mix 순서를 보존하고 lane ownership과 barrier를 profile width에 맞춘다</h2></header>
      <p>한 state를 thread 하나가 소유할지, coordinates를 여러 lanes가 나눌지는 batch, width, register pressure와 matrix traffic에 따라 측정합니다. Full round는 모든 coordinates, partial round는 profile이 지정한 coordinate에 S-box를 적용합니다. Cross-thread mix가 있으면 producer values가 준비된 뒤 barrier가 필요합니다. ICICLE v3.9.0 문서는 batch API와 constants profile을 보여주지만 CUDA kernel 내부 schedule의 보편 최적성을 증명하지는 않습니다.</p>
      <ExplainedFormula question="한 Poseidon round를 GPU에서 어떤 세 단계로 읽을까?" idea={<>먼저 round constants를 더하고, schedule에 따라 S-box를 적용한 뒤, matrix로 모든 output coordinates를 섞습니다.</>} formula={String.raw`x_i'=\sum_{j=0}^{t-1}M_{ij}\,S_r(x_j+C_{r,j})`}
      annotatedFormula={String.raw`x_i'=\underbrace{\sum_{j=0}^{t-1}M_{ij}\,S_r(x_j+C_{r,j})}_{\text{Round constant 계산}}`}
      operations={[
        { expression: String.raw`\sum_{j=0}^{t-1}M_{ij}\,S_r(x_j+C_{r,j})`, annotation: ["Round constant이(가) 식의 결과에 기여하는 방식을","계산합니다.","먼저 round constants를 더하고, schedule에","따라 S-box를 적용한 뒤, matrix로 모든 output"] },
      ]} terms={[
        {symbol:"x_i'",name:"Next state coordinate",description:"Round 뒤 i번째 output field element입니다."},
        {symbol:"i",name:"Output index",description:"Mixing matrix의 row이자 output lane 위치입니다."},
        {symbol:"j",name:"Input index",description:"Mixing에 기여하는 이전 state coordinate입니다."},
        {symbol:"t",name:"State width",description:"Pinned profile의 coordinate 수입니다."},
        {symbol:"M_{ij}",name:"Mix coefficient",description:"Pinned full 또는 transformed matrix artifact의 field element입니다."},
        {symbol:"S_r",name:"Round S-box schedule",description:"Full round는 모든 coordinates에 power map, partial round는 profile이 고른 coordinate에만 적용합니다."},
        {symbol:"x_j",name:"Current state",description:"Round 전 j번째 field element입니다."},
        {symbol:"C_{r,j}",name:"Round constant",description:"Round r, coordinate j의 pinned constant입니다."},
        {symbol:"r",name:"Round index",description:"Full/partial schedule과 constants를 선택합니다."},
      ]} assumptions={["모든 operations는 같은 canonical field/Montgomery domain에서 수행하고 matrix form은 constants transformation과 짝이 맞습니다.","Barrier는 여러 threads가 state coordinates를 공유하는 mapping에만 필요하며 thread-local state에는 불필요할 수 있습니다."]} interpretation="α=5인 pinned 예에서는 y=x², z=y², x⁵=z·x로 3번 곱셈에 계산할 수 있습니다. α=5를 다른 profile의 보편값으로 일반화하지 않습니다." />
      <div id="paper-filecoin-poseidon"><CitationBlock type="code" citeKey={2} source="Filecoin Specification · Poseidon" href={FILECOIN}><p><strong>문제:</strong> Filecoin profile의 optimized Poseidon constants와 transformed matrix schedule을 일관되게 기술해야 합니다.</p><p><strong>핵심 기여:</strong> Unoptimized/optimized constants, pre-sparse와 sparse matrix 변환의 구현 절차를 설명합니다.</p><p><strong>중요 가정:</strong> 페이지가 지정한 Filecoin parameter profile과 현재 specification status를 그대로 확인해야 합니다.</p><p><strong>근거 범위:</strong> Filecoin-specific optimized permutation description입니다.</p><p><strong>일반화 금지:</strong> 페이지 자체의 audit 경고를 넘어서 완전한 security audit·모든 Poseidon instance·GPU correctness를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="batch-tree" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Batch and tree frontier</p><h2 className="mt-2 text-2xl font-bold">독립 states는 batch하되 Merkle level 사이의 parent dependency와 padding·domain tag를 보존한다</h2></header>
      <p>첫 level에는 hashes가 많아 GPU가 충분히 차지만 root에 가까워질수록 jobs가 줄어듭니다. Parent는 ordered children이 모두 준비된 뒤 실행합니다. Leaf와 internal node의 domain, arity, 마지막 incomplete group의 padding rule이 다르면 같은 leaves에서도 다른 root가 나옵니다.</p>
      <ExplainedFormula question="Arity a인 tree에서 level별 hash job 수는 어떻게 줄어들까?" idea={<>각 parent가 최대 a개 children을 소비하므로 이전 level node 수를 a로 나누어 올림합니다.</>} formula={String.raw`N_{\ell+1}=\left\lceil\frac{N_\ell}{a}\right\rceil`}
      annotatedFormula={String.raw`N_{\ell+1}=\underbrace{\left\lceil\frac{N_\ell}{a}\right\rceil}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\left\lceil\frac{N_\ell}{a}\right\rceil`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 parent가 최대 a개 children을 소비하므로 이전","level node 수를 a로 나누어 올림합니다."] },
      ]} terms={[
        {symbol:"N_\\ell",name:"Nodes at level ℓ",description:"현재 level에서 소비할 child hashes 수입니다."},
        {symbol:"N_{\\ell+1}",name:"Parent jobs",description:"다음 level에서 계산할 Poseidon states 수입니다."},
        {symbol:"a",name:"Tree arity",description:"Parent 한 개가 받는 ordered children 수입니다."},
        {symbol:"\\ell",name:"Level",description:"Leaves를 0으로 둔 tree depth index입니다."},
        {symbol:"\\lceil\\cdot\\rceil",name:"Ceiling",description:"Incomplete 마지막 group도 한 parent job으로 셉니다."},
      ]} assumptions={["Padding 또는 exact-size rejection rule과 leaf/internal domain tags를 profile에 고정합니다.","부모 level은 필요한 child outputs와 completion event가 모두 준비된 뒤 시작합니다."]} interpretation="N0=8,a=2이면 8→4→2→1입니다. N0=7이면 마지막 child 처리 규칙을 정하지 않고 7→4라고만 계산해서는 root semantics가 완성되지 않습니다." />
      <div id="paper-icicle-poseidon"><CitationBlock type="code" citeKey={3} source="ICICLE v3.9.0 Poseidon documentation · commit 6b451e6" href={ICICLE}><p><strong>문제:</strong> Poseidon parameter sets와 여러 preimages의 batch hashing을 accelerator API로 노출해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned page는 constants profile, hash_many input/output shape와 supported binding surface를 설명합니다.</p><p><strong>중요 가정:</strong> v3.9.0의 실제 supported field/arity, loaded constants와 backend installation을 확인합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 documented Poseidon API behavior입니다.</p><p><strong>일반화 금지:</strong> 문서의 GPU 설명을 모든 kernel 내부 mapping·모든 arity 지원·고정 throughput의 증거로 확대하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Official/reference vectors와 tree root parity 뒤 verified states/s를 측정하고 profile mismatch는 fail closed한다</h2></header>
      <p>Zero/one/max canonical field element, width·round/constants·domain mismatch, noncanonical input, empty/partial batch, leaf order mutation, wrong padding, wrong event dependency, OOM과 timeout을 포함합니다. Round-by-round debug fixture와 full hash/tree roots를 CPU reference·circuit과 비교하고 최종 proof verifier가 같은 public root를 승인해야 합니다.</p>
      <ExplainedFormula question="GPU Poseidon의 유효 처리량을 어떻게 보고할까?" idea={<>Reference/root/proof gate를 통과한 states만 세고 transfer·kernel·sync를 같은 wall-clock boundary에 넣습니다.</>} formula={String.raw`R_P=\frac{N_{states}^{verified}}{T_{H2D}+T_{kernel}+T_{D2H}+T_{sync}}`}
      annotatedFormula={String.raw`R_P=\underbrace{\frac{N_{states}^{verified}}{T_{H2D}+T_{kernel}+T_{D2H}+T_{sync}}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\frac{N_{states}^{verified}}{T_{H2D}+T_{kernel}+T_{D2H}+T_{sync}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Reference/root/proof gate를 통과한","states만 세고 transfer·kernel·sync를","같은 wall-clock boundary에 넣습니다."] },
      ]} terms={[
        {symbol:"R_P",name:"Verified state rate",description:"초당 parity를 통과한 independent Poseidon states 수입니다."},
        {symbol:"N_{states}^{verified}",name:"Verified states",description:"Pinned reference와 같은 outputs를 낸 state 수입니다."},
        {symbol:"T_{H2D}",name:"Input transfer",description:"Host에서 device로 inputs/profile을 보내는 시간입니다."},
        {symbol:"T_{kernel}",name:"Kernel time",description:"Warmup 뒤 event로 측정한 round/batch kernel 시간입니다."},
        {symbol:"T_{D2H}",name:"Output transfer",description:"필요한 outputs를 host로 가져오는 시간입니다."},
        {symbol:"T_{sync}",name:"Synchronization",description:"Completion과 async errors를 관측하는 시간입니다."},
      ]} assumptions={["Field/profile/batch/tree shape/backend SHA를 고정하고 median/p95와 peak memory를 기록합니다.","Proof workload에서 outputs가 device-resident라면 생략한 D2H를 명시하고 전체 pipeline measurement도 별도로 냅니다."]} interpretation="1024 states 중 4개가 parity 실패하고 전체 2ms라면 512,000이 아니라 510,000 verified states/s입니다. 실패 후보는 release하지 않습니다." />
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 역검사 10/10:</strong> profile identity, round 식, 모든 기호, x⁵ 예, lane/barrier 경계, batch shape, tree frontier, padding 반례, parity suite, measurement·rollback까지 이 글만으로 답할 수 있어야 합니다.</aside>
    </section>
  </article>;
}
