import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { WitnessFrontierViz } from "./WitnessFrontierViz";

const CIRCOM = "https://github.com/iden3/circom/tree/ad44e915a12bb047b05745c2884aad9cc8326bc6";
const OU = "https://eprint.iacr.org/2023/657";
const CUDA = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";

export default function ModernGpuWitnessArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Witness를 GPU kernel보다 먼저 dataflow로 읽기</p><h2 className="text-3xl font-bold tracking-tight">Witness generation은 R1CS 행을 푸는 일이 아니라 입력에서 모든 중간 signal을 계산하는 프로그램 실행이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">증명 workload는 입력에서 witness를 만들고, field-native hash와 polynomial 연산을 거쳐 MSM·NTT·Poseidon 결과를 proof artifact에 넣습니다. 이 글은 그 첫 단계만 맡습니다. <a className="text-primary hover:underline" href="/crypto/r1cs">R1CS 정본</a>은 완성된 witness가 만족해야 할 관계를 설명하고, 여기서는 그 witness를 만드는 producer dependency와 GPU release gate를 설명합니다.</p>
      <p>초심자가 가장 먼저 구분할 것은 <strong>constraint</strong>와 <strong>witness program</strong>입니다. Constraint는 “결과가 맞는가”를 검사하지만, witness program은 “중간값을 어떤 순서로 계산할까”를 정합니다. Circom 2.2.3은 C++·WebAssembly witness calculator를 생성합니다. 아래 GPU frontier는 그 현재 구현 사실이 아니라, dependency graph를 보존하며 accelerator로 내릴 때 필요한 설계 계약입니다.</p>
      <WitnessFrontierViz />
      <ContentBoundary article="gpu-witness-gen" />
    </section>

    <section id="dataflow-dag" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Dataflow DAG</p><h2 className="mt-2 text-2xl font-bold">각 signal에 producer와 consumers를 붙이고 cycle·unknown input을 실행 전에 거절한다</h2></header>
      <p>Signal node는 field value 하나를 만들며 incoming edge는 먼저 필요한 값입니다. 예를 들어 x=3, a=x², b=x+5, out=a·b라면 a와 b는 서로 독립이지만 out은 둘 다 기다립니다. R1CS를 sparse matrix로 GPU에 올리는 것만으로는 이 계산 순서를 얻을 수 없습니다.</p>
      <ExplainedFormula question="각 signal이 실행 가능한 가장 이른 level을 어떻게 계산할까?" idea={<>선행 producer가 없으면 입력 level이고, 그렇지 않으면 가장 늦은 predecessor보다 한 단계 뒤입니다.</>} formula={String.raw`L(v)=\begin{cases}0,&\operatorname{pred}(v)=\varnothing\\1+\max_{u\in\operatorname{pred}(v)}L(u),&\text{otherwise}\end{cases}`} terms={[
        {symbol:"L(v)",name:"Level of v",description:"Signal node v가 실행 가능한 가장 이른 frontier 번호입니다."},
        {symbol:"v",name:"Signal node",description:"입력 또는 arithmetic operation이 생산하는 witness 값입니다."},
        {symbol:"\\operatorname{pred}(v)",name:"Predecessors",description:"v를 계산하기 전에 완료되어야 하는 producer node 집합입니다."},
        {symbol:"u",name:"Predecessor",description:"v가 읽는 값 하나를 생산하는 node입니다."},
        {symbol:"\\varnothing",name:"Empty set",description:"선행 계산이 없는 public/private input 또는 constant를 뜻합니다."},
      ]} assumptions={["Dependency graph는 cycle이 없는 DAG이며 모든 read는 정확히 한 producer 또는 명시적 input에 연결됩니다.","Level이 같아도 side effect나 alias가 있으면 추가 순서 계약이 필요합니다."]} interpretation="예제에서 x와 5는 L0, a와 b는 L1, out은 L2입니다. Cycle이 있으면 유한 level을 만들 수 없으므로 compile 단계에서 실패해야 합니다." />
      <div id="paper-circom-witness"><CitationBlock type="code" citeKey={1} source="Circom v2.2.3 · commit ad44e91" href={CIRCOM}><p><strong>문제:</strong> Circuit source에서 constraints와 실제 witness calculator artifact를 생성해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned compiler source는 R1CS와 C++·WebAssembly witness 계산 경로를 함께 제공합니다.</p><p><strong>중요 가정:</strong> v2.2.3 compiler, 선택한 prime field와 같은 compiled circuit artifact를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 compiler·generated witness program 경계입니다.</p><p><strong>일반화 금지:</strong> GPU frontier scheduler·automatic parallel safety·고정 speedup을 구현했다는 근거는 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="frontier-schedule" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Frontier schedule</p><h2 className="mt-2 text-2xl font-bold">같은 level의 node 수보다 전체 work와 긴 dependency chain을 함께 본다</h2></header>
      <p>GPU는 frontier가 넓을 때 유리하지만, 한 signal의 긴 recurrence는 threads를 늘려도 사라지지 않습니다. 따라서 “constraint 수가 크다”만으로 GPU 적합성을 판단하지 않고, compiler가 만든 witness instructions의 work와 span을 측정합니다.</p>
      <ExplainedFormula question="P개 worker가 있어도 witness가 더 빨라질 수 없는 하한은 무엇일까?" idea={<>전체 연산을 P개가 나누는 시간과 가장 긴 dependency chain 시간 가운데 큰 값보다 빨라질 수 없습니다.</>} formula={String.raw`T_P\ge\max\!\left(\frac{W}{P},D\right)`} terms={[
        {symbol:"T_P",name:"Parallel time",description:"P개 worker로 한 witness를 계산하는 실행 시간의 하한입니다."},
        {symbol:"W",name:"Work",description:"모든 field operation의 총 비용입니다."},
        {symbol:"P",name:"Workers",description:"동시에 유효 작업을 실행할 수 있는 threads 또는 lanes 수입니다."},
        {symbol:"D",name:"Span",description:"가장 긴 producer→consumer path의 누적 비용입니다."},
        {symbol:"\\max",name:"Maximum",description:"Work 분배와 dependency 두 제약 중 더 큰 하한을 선택합니다."},
      ]} assumptions={["W와 D는 같은 비용 단위로 측정하고 memory stall·launch overhead는 아직 더하지 않은 이상적 하한입니다.","각 operation의 field/profile과 결과가 CPU reference와 동일합니다."]} interpretation="W=8 operation, D=3 step, P=4라면 하한은 max(2,3)=3 step입니다. 이를 실제 3 step 성능 예측으로 쓰면 안 됩니다." />
      <div id="paper-ou-parallel-witness"><CitationBlock type="paper" citeKey={2} source="Ou · Automating the Parallelization of Zero-Knowledge Protocols (2023/657)" href={OU}><p><strong>문제:</strong> ZK implementation의 witness/prover code에서 안전한 parallel regions를 수작업 없이 찾아야 합니다.</p><p><strong>핵심 기여:</strong> Live-variable와 dependency 분석으로 독립 작업을 찾아 병렬화하는 compiler 접근을 제시합니다.</p><p><strong>중요 가정:</strong> 논문의 program model, dependency analysis와 평가 workload를 전제로 합니다.</p><p><strong>근거 범위:</strong> Dependency-preserving parallelization 아이디어와 연구 결과입니다.</p><p><strong>일반화 금지:</strong> 모든 circuit이 넓은 frontier를 가지거나 이 글의 GPU lowering이 Circom에 이미 통합됐다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="residency-plan" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Residency plan</p><h2 className="mt-2 text-2xl font-bold">전체 R1CS가 아니라 현재 살아 있는 inputs·instructions·signals의 실제 bytes를 예산한다</h2></header>
      <p>한 frontier가 끝났다고 모든 signal을 버릴 수는 없습니다. 뒤 level이 다시 읽는 값은 마지막 consumer까지 살아 있어야 합니다. Host/device 경계를 넘나드는 작은 frontier는 launch와 transfer가 계산보다 비쌀 수 있으므로 CPU에 남기거나 여러 witnesses를 batch하는 선택도 계획에 포함합니다.</p>
      <ExplainedFormula question="한 시점의 witness device memory를 어떻게 계산할까?" idea={<>현재 살아 있는 signal bytes와 instructions, constants, frontier scratch, runtime reserve를 실제 allocation 기준으로 더합니다.</>} formula={String.raw`B_{live}(k)=s_F\,|S_k|+B_{inst}+B_{const}+B_{scratch}(k)+B_{runtime}`} terms={[
        {symbol:"B_{live}(k)",name:"Live bytes",description:"Frontier k가 실행될 때 동시에 필요한 device bytes입니다."},
        {symbol:"s_F",name:"Field element bytes",description:"Pinned device representation 한 element의 aligned bytes입니다."},
        {symbol:"S_k",name:"Live signal set",description:"이미 생산됐고 아직 마지막 consumer가 남은 signal 집합입니다."},
        {symbol:"B_{inst}",name:"Instruction bytes",description:"Operation codes와 operand indexes의 resident bytes입니다."},
        {symbol:"B_{const}",name:"Constant bytes",description:"Field constants와 immutable tables입니다."},
        {symbol:"B_{scratch}(k)",name:"Scratch bytes",description:"현재 frontier outputs·scan·compaction 등 임시 공간입니다."},
        {symbol:"B_{runtime}",name:"Runtime reserve",description:"Context·allocator·module 등 측정한 overhead입니다."},
      ]} assumptions={["외부 serialization 크기가 아니라 accelerator의 aligned allocation을 사용합니다.","Async copy가 남아 있으면 관련 source/destination buffer도 live set에 포함합니다."]} interpretation="sF=32B, live signals 10개, instructions 96B, constants 64B, scratch 128B, runtime 256B이면 864B입니다. 작은 예제이며 production 고정값은 아닙니다." />
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Witness bytes, constraint satisfaction, proof verification을 차례로 통과한 결과만 성능표에 넣는다</h2></header>
      <p>Zero·one·maximum canonical field value, branch 양쪽, unused signal, dependency cycle, divide-by-zero, malformed input, device OOM·timeout을 포함합니다. CPU/reference witness와 canonical field values를 비교하고, 전체 constraints와 최종 verifier가 같은 statement를 승인해야 합니다. GPU failure는 generation을 폐기하고 검증된 CPU 경로나 이전 scheduler artifact로 되돌립니다.</p>
      <ExplainedFormula question="Witness GPU 경로의 유효 처리량을 어떤 경계에서 셀까?" idea={<>최종 proof verifier까지 통과한 witnesses만 세고 parse·transfer·kernel·sync·fallback 시간을 wall clock에 포함합니다.</>} formula={String.raw`R_{witness}=\frac{N_{verified}}{T_{wall}}`} terms={[
        {symbol:"R_{witness}",name:"Verified witness rate",description:"초당 최종 검증까지 통과한 witness 수입니다."},
        {symbol:"N_{verified}",name:"Verified count",description:"Reference parity·constraint check·proof verification을 모두 통과한 수입니다."},
        {symbol:"T_{wall}",name:"Wall time",description:"입력 수신부터 verified receipt까지의 전체 시간입니다."},
      ]} assumptions={["같은 circuit/input generation·field·batch·hardware·software SHA를 고정합니다.","Warmup과 반복 수를 기록하고 median/p95, failure·retry·fallback을 숨기지 않습니다."]} interpretation="100개를 0.5초에 계산했어도 2개가 검증 실패하면 성공 수는 98개이고 196 verified witness/s입니다." />
      <div id="paper-cuda-witness"><CitationBlock type="code" citeKey={3} source="NVIDIA CUDA C++ Best Practices Guide 12.8.1" href={CUDA}><p><strong>문제:</strong> Asynchronous GPU work의 시간을 올바르게 재고 memory transfer와 kernel 병목을 구분해야 합니다.</p><p><strong>핵심 기여:</strong> Events·synchronization·effective bandwidth와 correctness-first verification 방법을 설명합니다.</p><p><strong>중요 가정:</strong> CUDA 12.8.1 semantics와 같은 benchmark boundary·workload를 고정합니다.</p><p><strong>근거 범위:</strong> GPU timing·bandwidth 측정 방법입니다.</p><p><strong>일반화 금지:</strong> Witness scheduler correctness·고정 occupancy·고정 speedup을 보장하지 않습니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 역검사 10/10:</strong> constraint/witness 구분, DAG, level 계산, work/span, 작은 계산, live memory, batching 경계, negative fixtures, verifier gate, measurement·rollback까지 이 글만으로 답할 수 있어야 합니다.</aside>
    </section>
  </article>;
}
