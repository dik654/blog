import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ModernNttGpuViz } from "./ModernNttGpuViz";

const SPPARK_KERNEL = "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/ntt/kernels.cu";
const SPPARK_NTT = "https://github.com/supranational/sppark/blob/17278d74295392f9813f009300b257a688422b7a/ntt/ntt.cuh";
const CUDA = "https://docs.nvidia.com/cuda/archive/12.8.1/cuda-c-best-practices-guide/index.html";

export default function ModernNttGpuArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Finite-field transform를 launch plan으로 내리기</p><h2 className="text-3xl font-bold tracking-tight">GPU NTT의 핵심은 butterfly 수가 아니라 stage 사이의 order·twiddle·buffer 계약이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Number theoretic transform(NTT)의 field, root of unity, forward/inverse 수식은 <a className="text-primary hover:underline" href="/crypto/fft#dft">NTT 정본</a>에서 먼저 설명합니다. 여기서는 같은 transform을 pinned sppark의 Cooley–Tukey(CT)·Gentleman–Sande(GS) kernels, bit-reversal, coset power pass로 실행하는 구현 경계만 소유합니다.</p>
      <p>고정 예제는 N=8 coefficient buffer를 evaluation form으로 바꾼 뒤 inverse로 복원하는 workload입니다. 호출 receipt에 field, N, root/domain id, direction, coset, input/output order, normalization, backend SHA를 넣지 않으면 길이가 같은 잘못된 배열도 성공처럼 보입니다.</p>
      <ModernNttGpuViz />
      <ContentBoundary article="ntt-gpu-impl" />
    </section>

    <section id="stage-tile" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Stage tile</p><h2 className="mt-2 text-2xl font-bold">한 thread의 butterfly index를 먼저 증명하고 여러 stage를 tile로 묶는다</h2></header>
      <ExplainedFormula question="Radix-2 stage s에서 thread t가 어느 두 원소를 읽을까?" idea={<>Stage의 half-span h를 기준으로 thread를 group과 group 안 j로 나누면 겹치지 않는 butterfly pair를 만듭니다.</>} formula={String.raw`h=2^s,\quad j=t\bmod h,\quad g=\left\lfloor\frac{t}{h}\right\rfloor,\quad (i_0,i_1)=(2hg+j,\,2hg+j+h)`}
      annotatedFormula={String.raw`h=\underbrace{2^s,\quad j=t\bmod h,\quad g=\left\lfloor\frac{t}{h}\right\rfloor,\quad (i_0,i_1)=(2hg+j,\,2hg+j+h)}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`2^s,\quad j=t\bmod h,\quad g=\left\lfloor\frac{t}{h}\right\rfloor,\quad (i_0,i_1)=(2hg+j,\,2hg+j+h)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Stage의 half-span h를 기준으로 thread를","group과 group 안 j로 나누면 겹치지 않는","butterfly pair를 만듭니다."] },
      ]} terms={[
        {symbol:"s",name:"Stage index",description:"0부터 log₂N−1까지 butterfly span을 정합니다."},
        {symbol:"h",name:"Half-span",description:"Butterfly 두 입력 사이 거리입니다."},
        {symbol:"t",name:"Logical butterfly index",description:"0부터 N/2−1까지 독립 pair 하나를 가리킵니다."},
        {symbol:"j",name:"In-group offset",description:"현재 2h group 안 첫 입력 위치입니다."},
        {symbol:"g",name:"Group index",description:"길이 2h인 butterfly group 번호입니다."},
        {symbol:"i_0,i_1",name:"Input indices",description:"한 butterfly가 읽고 쓰는 두 array indices입니다."},
      ]} assumptions={["N은 field가 지원하는 2의 거듭제곱 domain이며 t<N/2입니다.","이 index 식은 radix-2 설명용입니다. Pinned sppark의 mixed-radix launch details를 같은 식으로 단정하지 않습니다."]} interpretation="N=8,s=1이면 h=2입니다. t=3은 j=1,g=1이므로 indices (5,7)을 처리합니다." />
      <p>Shared memory에 여러 stages를 묶으면 global traffic을 줄일 수 있지만 block 안 barrier와 shared capacity·bank mapping이 새 제약입니다. Tile 밖 stage는 kernel boundary 또는 global synchronization이 필요하며, block barrier만으로 grid 전체 순서를 만들 수 없습니다.</p>
    </section>

    <section id="twiddle-contract" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Twiddle contract</p><h2 className="mt-2 text-2xl font-bold">Twiddle table은 값 배열이 아니라 field·direction·stage index의 artifact다</h2></header>
      <ExplainedFormula question="Butterfly의 twiddle이 두 output을 어떻게 만들까?" idea={<>두 번째 입력에 현재 stage의 root power를 곱한 뒤 합과 차를 동시에 계산합니다.</>} formula={String.raw`u=x_{i_0},\quad v=\omega^{q(s,j)}x_{i_1},\quad (y_{i_0},y_{i_1})=(u+v,\,u-v)`}
      annotatedFormula={String.raw`u=\underbrace{x_{i_0},\quad v=\omega^{q(s,j)}x_{i_1},\quad (y_{i_0},y_{i_1})=(u+v,\,u-v)}_{\text{Root of unity 계산}}`}
      operations={[
        { expression: String.raw`x_{i_0},\quad v=\omega^{q(s,j)}x_{i_1},\quad (y_{i_0},y_{i_1})=(u+v,\,u-v)`, annotation: ["Root of unity이(가) 식의 결과에 기여하는 방식을","계산합니다.","두 번째 입력에 현재 stage의 root power를 곱한","뒤 합과 차를 동시에 계산합니다."] },
      ]} terms={[
        {symbol:"x",name:"Stage input",description:"현재 stage가 읽는 field-element buffer입니다."},
        {symbol:"y",name:"Stage output",description:"Butterfly 결과 buffer이며 in-place일 수도 있습니다."},
        {symbol:"i_0,i_1",name:"Butterfly indices",description:"Stage tile mapping이 정한 두 positions입니다."},
        {symbol:"u,v",name:"Butterfly temporaries",description:"첫 input과 twiddle을 곱한 둘째 input입니다."},
        {symbol:String.raw`\omega`,name:"Root of unity",description:"고정 field에서 N차 primitive root입니다."},
        {symbol:"q(s,j)",name:"Twiddle exponent map",description:"Direction·decimation·stage·offset이 정하는 exponent입니다."},
      ]} assumptions={["모든 연산은 같은 finite field에서 하며 inverse는 inverse root와 최종 N⁻¹ scaling 계약을 따릅니다.","Twiddle layout과 q mapping은 implementation revision에 고정하며 CT와 GS table을 무심코 공유하지 않습니다."]} interpretation="ω table이 맞아도 direction tag가 반대면 round-trip은 실패합니다. 단순 값 checksum보다 field/domain/direction을 포함한 artifact key가 필요합니다." />
      <div id="paper-sppark-ntt"><CitationBlock type="code" citeKey={1} source="sppark ntt.cuh · commit 17278d7" href={SPPARK_NTT}><p><strong>문제:</strong> Direction·input order·coset에 맞춰 CT/GS NTT와 permutation을 조합해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 CT/GS launcher 선택, bit-reversal과 forward/inverse coset power placement를 구현합니다.</p><p><strong>중요 가정:</strong> Commit 17278d7의 NTTParameters, supported field/domain와 stream behavior를 고정합니다.</p><p><strong>근거 범위:</strong> 해당 implementation의 dispatch·ordering path입니다.</p><p><strong>일반화 금지:</strong> 모든 NTT library의 ordering이나 고정 kernel 수·속도를 뜻하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="permutation-plan" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Permutation plan</p><h2 className="mt-2 text-2xl font-bold">Bit reversal을 없앤 것이 아니라 어느 경계에서 요구하는지 명시한다</h2></header>
      <ExplainedFormula question="k-bit index의 bit-reversed 위치를 어떻게 계산할까?" idea={<>Index의 k개 binary digits 순서를 뒤집어 새 위치를 만듭니다.</>} formula={String.raw`i=\sum_{r=0}^{k-1}b_r2^r,\qquad rev_k(i)=\sum_{r=0}^{k-1}b_r2^{k-1-r}`}
      annotatedFormula={String.raw`i=\underbrace{\sum_{r=0}^{k-1}b_r2^r,\qquad rev_k(i)=\sum_{r=0}^{k-1}b_r2^{k-1-r}}_{\text{Bit-reversed index 계산}}`}
      operations={[
        { expression: String.raw`\sum_{r=0}^{k-1}b_r2^r,\qquad rev_k(i)=\sum_{r=0}^{k-1}b_r2^{k-1-r}`, annotation: ["Bit-reversed index이(가) 식의 결과에 기여하는","방식을 계산합니다.","Index의 k개 binary digits 순서를 뒤집어 새","위치를 만듭니다."] },
      ]} terms={[
        {symbol:"i",name:"Original index",description:"0부터 N−1까지의 array position입니다."},
        {symbol:"k",name:"Index bits",description:"N=2^k를 표현하는 bit 수입니다."},
        {symbol:"b_r",name:"Binary digit",description:"i의 r번째 낮은-order bit입니다."},
        {symbol:"r",name:"Bit position",description:"0부터 k−1까지 순회하는 index입니다."},
        {symbol:"rev_k(i)",name:"Bit-reversed index",description:"k bits의 순서를 뒤집어 얻은 position입니다."},
      ]} assumptions={["N=2^k이고 index는 정확히 k bits로 zero-pad합니다.","CT/GS 및 in/out ordering 계약에 따라 별도 permutation pass가 필요 없을 수도 있지만 output tag는 남깁니다."]} interpretation="N=8,k=3에서 i=3=011₂이면 rev₃(i)=110₂=6입니다." />
      <p>In-place permutation은 pair를 한 번만 swap해야 하며, out-of-place permutation은 별도 buffer와 read/write traffic을 요구합니다. Pinned kernels에는 작은 domain용 direct bit reversal과 shared-memory를 쓰는 큰-domain path가 있으므로, “bit reverse는 항상 CPU 전처리”라고 쓰지 않습니다.</p>
      <div id="paper-sppark-permutation"><CitationBlock type="code" citeKey={2} source="sppark kernels.cu · commit 17278d7" href={SPPARK_KERNEL}><p><strong>문제:</strong> NTT input/output order와 coset powers를 GPU memory에 실제 배치해야 합니다.</p><p><strong>핵심 기여:</strong> Direct·shared-memory bit-reversal kernels와 LDE power kernels를 제공합니다.</p><p><strong>중요 가정:</strong> Commit 17278d7, lg_domain_size, launch bounds와 field type을 고정합니다.</p><p><strong>근거 범위:</strong> 해당 permutation·power kernel source입니다.</p><p><strong>일반화 금지:</strong> 고정 bandwidth·bank conflict·모든 domain 우위를 제공하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Round-trip·naive DFT·convolution을 통과한 뒤 stage traffic과 전체 시간을 잰다</h2></header>
      <p>N=1/2/8, zero/constant/basis vector, invalid domain, wrong root, wrong order와 coset mismatch를 검사합니다. 작은 N은 O(N²) field DFT와, 큰 N은 pinned CPU NTT·round-trip·convolution identity와 비교합니다. Warm-up 후 stage별 events, final sync, actual/requested bytes, field butterfly/s, occupancy·bank conflicts·stalls와 H2D/D2H를 기록합니다.</p>
      <ExplainedFormula question="Out-of-place radix-2 NTT의 최소 requested traffic을 어떻게 추정할까?" idea={<>각 stage가 N field elements를 한 번 읽고 한 번 쓴다고 단순화해 stage 수만큼 합합니다.</>} formula={String.raw`B_{req}=2Ns_F\log_2N,\qquad BW_{req}=\frac{B_{req}}{t_{stages}}`}
      annotatedFormula={String.raw`B_{req}=\underbrace{2Ns_F\log_2N,\qquad BW_{req}=\frac{B_{req}}{t_{stages}}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`2Ns_F\log_2N,\qquad BW_{req}=\frac{B_{req}}{t_{stages}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 stage가 N field elements를 한 번 읽고","한 번 쓴다고 단순화해 stage 수만큼 합합니다."] },
      ]} terms={[
        {symbol:"B_{req}",name:"Requested bytes",description:"Cache·transaction amplification 전 algorithmic read/write bytes입니다."},
        {symbol:"N",name:"Domain size",description:"Transform field elements 수입니다."},
        {symbol:"s_F",name:"Field element bytes",description:"Device internal representation의 aligned element 크기입니다."},
        {symbol:String.raw`\log_2N`,name:"Radix-2 stage count",description:"N이 2의 거듭제곱일 때의 stages 수입니다."},
        {symbol:"BW_{req}",name:"Requested bandwidth",description:"Algorithmic bytes를 measured stage time으로 나눈 값입니다."},
        {symbol:"t_{stages}",name:"Stage-chain time",description:"Permutation/transfer 제외 여부를 명시한 NTT kernel events 시간입니다."},
      ]} assumptions={["모든 stage가 out-of-place global pass라는 상한 모델이며 fused shared-memory stages는 이 traffic보다 작을 수 있습니다.","Profiler actual transactions와 cache hit를 별도 기록하며 requested BW를 HBM achieved BW로 부르지 않습니다."]} interpretation="N=8,sF=32B이면 단순 requested traffic은 2×8×32×3=1,536B입니다." />
      <div id="paper-cuda-ntt"><CitationBlock type="paper" citeKey={3} source="CUDA C++ Best Practices Guide 12.8.1" href={CUDA}><p><strong>문제:</strong> Kernel timing과 requested/actual bandwidth를 올바른 동기화 경계에서 비교해야 합니다.</p><p><strong>핵심 기여:</strong> CUDA event, effective bandwidth, coalescing과 correctness-first 절차를 설명합니다.</p><p><strong>중요 가정:</strong> CUDA 12.8.1과 target GPU properties·compiler를 고정합니다.</p><p><strong>근거 범위:</strong> 측정과 memory behavior 방법론입니다.</p><p><strong>일반화 금지:</strong> 특정 tile·radix·occupancy가 항상 최적이라는 뜻은 아닙니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 역검사 10/10:</strong> thread pair, butterfly, twiddle artifact, bit reversal, coset/order boundary, buffer traffic, reference fixtures, invalid domain, measurement와 rollback을 이 글만으로 다뤄야 합니다. Round-trip·convolution·p95 중 하나라도 기준을 넘으면 이전 kernel plan으로 되돌립니다.</aside>
    </section>
  </article>;
}
