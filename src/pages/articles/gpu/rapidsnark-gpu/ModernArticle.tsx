import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { RapidsnarkBoundaryViz } from "./RapidsnarkBoundaryViz";

const RAPID_README = "https://github.com/iden3/rapidsnark/blob/81eddf1a536d26497b237c0b8a04fe90baf7e439/README.md";
const RAPID_IO = "https://github.com/iden3/rapidsnark/blob/81eddf1a536d26497b237c0b8a04fe90baf7e439/src/prover.cpp";
const RAPID_CORE = "https://github.com/iden3/rapidsnark/blob/81eddf1a536d26497b237c0b8a04fe90baf7e439/src/groth16.cpp";
const CUDA_TIMING = "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#timing";

export default function ModernRapidsnarkGpuArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">현재 CPU prover와 GPU offload 제안을 같은 사실로 섞지 않기</p><h2 className="text-3xl font-bold tracking-tight">Pinned rapidsnark에는 GPU backend가 없다—먼저 WTNS·zkey·CPU stage map을 읽고 별도 adapter의 경계를 설계한다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">
            rapidsnark는 Circom/snarkjs artifact로 Groth16 proof를 만드는 C++ prover입니다. commit 81eddf1의 README에도
            Intel/ARM assembly 구현이라고 적혀 있습니다. Source tree에는 CUDA kernel이나 GPU runtime path가 없습니다. 따라서 기존 글의
            “rapidsnark GPU prover가 NTT와 MSM을 실행한다”는 설명은 현재 구현 사실이 아닙니다.
          </p>
      <p>이 글은 두 층을 분리합니다. 먼저 pinned CPU path가 <code>.zkey</code>와 <code>.wtns</code>를 어떻게 승인하고 thread pool·FFT·MSM으로 proof를 만드는지 설명합니다. 그 다음 <a className="text-primary hover:underline" href="/gpu/gpu-proof-pipeline">GPU proof pipeline 정본</a>을 재사용해, NTT/MSM backend를 붙이려면 어떤 representation·buffer·completion·fallback 계약이 필요한지 제안합니다.</p>
      <RapidsnarkBoundaryViz />
      <ContentBoundary article="rapidsnark-gpu" />
      <div id="paper-rapidsnark-readme"><CitationBlock type="code" citeKey={1} source="iden3 rapidsnark README · commit 81eddf1" href={RAPID_README}><p><strong>문제:</strong> Circom/snarkjs circuits의 Groth16 proof를 native prover로 생성하고 standalone/server interfaces를 제공해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned README는 C++와 Intel/ARM assembly 기반 build, zkey+witness CLI와 server mode를 문서화합니다.</p><p><strong>중요 가정:</strong> commit 81eddf1, supported alt_bn128 artifacts와 documented build targets를 사용합니다.</p><p><strong>근거 범위:</strong> 현재 upstream의 공개 interface와 CPU implementation positioning입니다.</p><p><strong>일반화 금지:</strong> CUDA/GPU backend, fixed speedup, production SLA 또는 모든 zkey curve 지원의 근거가 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="input-contract" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · WTNS·zkey input contract</p><h2 className="mt-2 text-2xl font-bold">확장자보다 section header·prime·variable count·protocol을 먼저 확인한다</h2></header>
      <p>
            Pinned loader는 zkey protocol id가 Groth16인지 먼저 확인합니다. 그다음 q/r primes와 nVars, nPublic, domainSize,
            query sections를 읽습니다. Witness header에서 읽는 것은 field byte width와 prime, nVars입니다. prover는 zkey와
            witness variable count, supported scalar prime을 비교합니다. 이 검사는 시작점일 뿐입니다. deployment wrapper라면 file
            digest와 schema/version, section bounds, proving-key point admission까지 receipt에 넣습니다.
          </p>
      <ExplainedFormula question="Witness bytes와 proving key가 같은 scalar field·layout을 가리키는지 최소한 무엇을 비교할까?" idea={<>Prime, variable counts, public count, domain과 exact artifact digests를 하나의 admission predicate로 묶습니다.</>} formula={String.raw`\operatorname{admit}\iff p_w=p_z\ \land\ N_w=N_z\ \land\ N_{pub}<N_z\ \land\ n\in\mathcal D\ \land\ d_w,d_z\in P`}
      annotatedFormula={String.raw`\operatorname{admit}\iff p_w=\underbrace{p_z\ \land\ N_w=N_z\ \land\ N_{pub}<N_z\ \land\ n\in\mathcal D\ \land\ d_w,d_z\in P}_{\text{판정 조건 결합}}`}
      operations={[
        { expression: String.raw`p_z\ \land\ N_w=N_z\ \land\ N_{pub}<N_z\ \land\ n\in\mathcal D\ \land\ d_w,d_z\in P`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","Prime, variable counts, public","count, domain과 exact artifact","digests를 하나의 admission predicate로"] },
      ]} terms={[
        {symbol:"p_w,p_z",name:"Witness/key scalar primes",description:"WTNS와 zkey headers에서 읽은 moduli입니다."},{symbol:"N_w,N_z",name:"Variable counts",description:"Witness elements와 key relation variables 수입니다."},{symbol:"N_{pub}",name:"Public count",description:"Witness 앞쪽에서 public output으로 꺼낼 signals 수입니다."},{symbol:"n",name:"Domain size",description:"Pinned FFT/QAP implementation이 지원하는 size입니다."},{symbol:String.raw`\mathcal D`,name:"Supported domains",description:"Power-of-two와 root availability 같은 exact constraints입니다."},{symbol:"d_w,d_z",name:"Artifact digests",description:"Input bytes의 immutable identities입니다."},{symbol:"P",name:"Approved profile",description:"Circuit/build manifest에 등록된 digest set입니다."},
      ]} assumptions={["Section offsets와 lengths는 overflow-safe parser로 file bounds 안에서 검증합니다.","현재 source의 header checks를 완전한 adversarial parser proof로 확대하지 않습니다."]} interpretation="Prime과 nVars가 같아도 다른 circuit의 zkey일 수 있습니다. Production adapter에서는 relation/profile digest까지 일치해야 합니다." />
      <div id="paper-rapidsnark-io"><CitationBlock type="code" citeKey={2} source="iden3 rapidsnark prover input path · commit 81eddf1" href={RAPID_IO}><p><strong>문제:</strong> Memory/file buffers의 zkey와 WTNS를 typed Groth16 prover input으로 변환하고 errors를 C API에 전달해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 Groth16Prover construction, supported prime·witness length checks와 proof/public serialization path를 보여줍니다.</p><p><strong>중요 가정:</strong> commit 81eddf1의 BinFileUtils, alt_bn128 engine과 exact artifact formats를 사용합니다.</p><p><strong>근거 범위:</strong> 현재 loader와 API가 실제로 수행하는 checks입니다.</p><p><strong>일반화 금지:</strong> 모든 malformed-section 방어, arbitrary curve support, zkey ceremony provenance나 GPU admission을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="cpu-stage-map" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Current CPU stage map</p><h2 className="mt-2 text-2xl font-bold">MSM A/B1/B2/C, coefficient accumulation, FFT quotient, MSM H와 proof assembly가 현재 경로다</h2></header>
      <p><code>groth16.cpp</code>는 먼저 witness와 A·B1·B2·C queries의 CPU MSM을 호출합니다. Coefficients를 thread pool로 a,b arrays에 누적하고 c=a·b를 만든 뒤, a/b/c 각각에 inverse FFT→coset shift→FFT를 적용해 (ab−c) evaluations를 계산합니다. 마지막 H MSM 뒤 random r,s와 verification-key points를 결합해 A∈G1, B∈G2, C∈G1 proof를 만듭니다.</p>
      <ExplainedFormula question="Pinned source의 thread-pool coefficient accumulation은 어떤 수학 값을 만든다고 읽을까?" idea={<>Sparse R1CS/QAP coefficient records가 가리키는 domain slot에 witness와 coefficient의 곱을 더합니다.</>} formula={String.raw`a_c\mathrel{+}=w_s\,\alpha_{c,s},\qquad b_c\mathrel{+}=w_s\,\beta_{c,s}`}
      annotatedFormula={String.raw`a_c\mathrel{+}=\underbrace{w_s\,\alpha_{c,s},\qquad b_c\mathrel{+}=w_s\,\beta_{c,s}}_{\text{Accumulation 계산}}`}
      operations={[
        { expression: String.raw`w_s\,\alpha_{c,s},\qquad b_c\mathrel{+}=w_s\,\beta_{c,s}`, annotation: ["Accumulation이(가) 식의 결과에 기여하는 방식을","계산합니다.","Sparse R1CS/QAP coefficient","records가 가리키는 domain slot에"] },
      ]} terms={[
        {symbol:"a_c,b_c",name:"Domain accumulators",description:"Constraint/domain index c의 A/B evaluations입니다."},{symbol:"w_s",name:"Witness element",description:"Signal/variable index s의 scalar입니다."},{symbol:String.raw`\alpha_{c,s},\beta_{c,s}`,name:"Sparse coefficients",description:"zkey coefficient section이 제공하는 field values입니다."},{symbol:"c",name:"Constraint index",description:"Thread-safe accumulator destination입니다."},{symbol:"s",name:"Signal index",description:"Witness source index입니다."},{symbol:String.raw`\mathrel{+}=`,name:"Accumulation",description:"같은 c로 모이는 terms를 field addition합니다."},
      ]} assumptions={["Coefficient records의 m tag가 A/B destination을 정확히 선택하고 indices가 bounds 안에 있습니다.","현재 source는 shared destinations에 striped mutexes를 사용하며 이 식 자체는 그 schedule의 최적성을 말하지 않습니다."]} interpretation="서로 다른 threads가 같은 c를 갱신할 수 있으므로 reduction ownership이 필요합니다. GPU로 옮길 때도 atomic, sort-reduce 또는 segmented reduction 중 하나를 명시해야 합니다." />
      <div id="paper-rapidsnark-core"><CitationBlock type="code" citeKey={3} source="iden3 rapidsnark Groth16 core · commit 81eddf1" href={RAPID_CORE}><p><strong>문제:</strong> Witness와 zkey queries에서 quotient polynomial과 Groth16 proof points를 계산해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 CPU MSM calls, ThreadPool coefficient loops, FFT sequence와 proof assembly의 실제 순서를 제공합니다.</p><p><strong>중요 가정:</strong> commit 81eddf1의 alt_bn128 engine, FFT/MSM dependencies와 zkey layout을 사용합니다.</p><p><strong>근거 범위:</strong> 현재 CPU prover stage map과 dependencies입니다.</p><p><strong>일반화 금지:</strong> Stage 비중, fixed speedup, CUDA kernels, stream overlap 또는 GPU memory pool이 구현돼 있다는 근거가 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="gpu-boundary" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Proposed GPU offload boundary</p><h2 className="mt-2 text-2xl font-bold">GPU adapter는 새 구현이다—field encoding·NTT order·MSM query layout과 completion receipt를 명시한다</h2></header>
      <p>
            GPU로 옮기기 좋은 후보는 large-domain NTT와 MSM입니다. 다만 함수 이름만 바꿔 끼울 수는 없습니다. Scalar와 points의
            canonical/Montgomery representation, bit-reversal/coset order는 adapter profile에 고정합니다.
            affine/projective layout과 device ownership, stream/event completion, async error propagation도 같은
            profile에 박아 둡니다. Small workload와 unsupported domain, OOM 또는 parity failure에서는 pinned CPU path로
            명시적으로 fallback하고 그 이유를 남깁니다.
          </p>
      <ExplainedFormula question="GPU offload가 이득이 되는 조건을 transfer까지 포함해 어떻게 판단할까?" idea={<>CPU 시간과 GPU의 upload·queue·kernel·download·sync 전체를 같은 stage output parity 뒤 비교합니다.</>} formula={String.raw`\Delta T=T_{CPU}-\left(T_{H2D}+T_{queue}+T_{kernel}+T_{D2H}+T_{sync}\right)`}
      annotatedFormula={String.raw`\Delta T=\underbrace{T_{CPU}-\left(T_{H2D}+T_{queue}+T_{kernel}+T_{D2H}+T_{sync}\right)}_{\text{허용 경계 판정}}`}
      operations={[
        { expression: String.raw`T_{CPU}-\left(T_{H2D}+T_{queue}+T_{kernel}+T_{D2H}+T_{sync}\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","CPU 시간과 GPU의","upload·queue·kernel·download·sync","전체를 같은 stage output parity 뒤"] },
      ]} terms={[
        {symbol:String.raw`\Delta T`,name:"Observed saving",description:"양수일 때만 해당 profile에서 GPU path가 빠른 wall-clock 차이입니다."},{symbol:"T_{CPU}",name:"CPU baseline",description:"같은 revision·input·output을 만드는 current implementation 시간입니다."},{symbol:"T_{H2D}",name:"Upload",description:"Scalars, points, roots와 metadata를 device로 보내는 시간입니다."},{symbol:"T_{queue}",name:"Queue delay",description:"Shared accelerator에서 launch 전 기다린 시간입니다."},{symbol:"T_{kernel}",name:"Kernel time",description:"Warmup 뒤 events로 측정한 NTT/MSM 실행 시간입니다."},{symbol:"T_{D2H}",name:"Download",description:"Host assembly에 필요한 output transfer입니다."},{symbol:"T_{sync}",name:"Completion",description:"Event synchronization과 async error 관측 시간입니다."},
      ]} assumptions={["CPU/GPU가 byte-identical 또는 verifier-equivalent output을 만들고 profile·batch·cache condition이 같습니다.","Device-resident 다음 stage가 있으면 D2H를 생략할 수 있지만 end-to-end receipt에 residency boundary를 기록합니다."]} interpretation="Kernel이 4배 빨라도 H2D와 queue가 크면 ΔT≤0일 수 있습니다. 그래서 window/domain threshold는 고정 상식이 아니라 measured routing policy입니다." />
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Hybrid release gate</p><h2 className="mt-2 text-2xl font-bold">CPU reference·snarkjs-compatible verifier parity 뒤 stage와 end-to-end를 함께 측정하고 즉시 rollback 가능하게 한다</h2></header>
      <p>
            Valid fixtures만 넣지 않습니다. wrong WTNS prime/count와 zkey protocol/domain/query length, corrupted
            points, unsatisfied witness를 함께 넣습니다. NTT order·coset mismatch, MSM scalar/point permutation,
            stale event, OOM, device loss도 같은 목록입니다. 비교는 같은 witness/zkey에서 합니다. CPU와 GPU outputs, final
            proof/public JSON, independent verifier 결과를 나란히 놓습니다. 배포 receipt에는 source/backend SHA와 GPU
            model/driver, profile digest를 남깁니다. fallback reason과 cold/warm median·p95, peak host/device
            memory도 함께 적습니다.
          </p>
      <ExplainedFormula question="Hybrid prover의 처리량을 correctness와 fallback을 숨기지 않고 어떻게 보고할까?" idea={<>Independent verification을 통과한 proofs만 end-to-end wall time으로 나누고 GPU 선택·fallback·failure counts를 함께 기록합니다.</>} formula={String.raw`R_{proof}=\frac{N_{verified}}{\sum_i T_{e2e,i}},\qquad N=N_{gpu}+N_{fallback}+N_{failed}`}
      annotatedFormula={String.raw`R_{proof}=\underbrace{\frac{N_{verified}}{\sum_i T_{e2e,i}},\qquad N=N_{gpu}+N_{fallback}+N_{failed}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\frac{N_{verified}}{\sum_i T_{e2e,i}},\qquad N=N_{gpu}+N_{fallback}+N_{failed}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Independent verification을 통과한","proofs만 end-to-end wall time으로 나누고","GPU 선택·fallback·failure counts를 함께"] },
      ]} terms={[
        {symbol:"R_{proof}",name:"Verified proof rate",description:"초당 verifier 승인을 얻은 proofs입니다."},{symbol:"N_{verified}",name:"Verified proofs",description:"Exact public inputs로 independent verifier를 통과한 수입니다."},{symbol:"T_{e2e,i}",name:"Request latency",description:"Input admission부터 verification receipt까지 i번째 wall time입니다."},{symbol:"N",name:"Attempt count",description:"전체 proving 요청 수입니다."},{symbol:"N_{gpu}",name:"GPU selections",description:"GPU adapter에서 성공한 요청 수입니다."},{symbol:"N_{fallback}",name:"CPU fallbacks",description:"정책 또는 typed GPU failure로 CPU가 처리한 요청 수입니다."},{symbol:"N_{failed}",name:"Failures",description:"어느 경로에서도 valid proof를 만들지 못한 요청 수입니다."},
      ]} assumptions={["Warmup, synchronization, queueing과 verification을 포함하고 workload distribution을 고정합니다.","Fallback 성공은 GPU correctness 성공으로 세지 않으며 GPU path parity failure는 release를 막습니다."]} interpretation="GPU 90건, fallback 10건이 모두 검증돼도 ‘GPU 성공률 100%’가 아닙니다. Route decision과 최종 service success를 분리합니다." />
      <div id="paper-cuda-timing"><CitationBlock type="code" citeKey={4} source="NVIDIA CUDA C++ Best Practices Guide · Timing" href={CUDA_TIMING}><p><strong>문제:</strong> Asynchronous GPU execution 때문에 host timer가 kernel completion을 잘못 측정할 수 있습니다.</p><p><strong>핵심 기여:</strong> CPU timer synchronization과 CUDA events를 사용한 elapsed-time measurement 경계를 설명합니다.</p><p><strong>중요 가정:</strong> 사용한 stream, device synchronization, warmup과 transfer inclusion boundary를 명시합니다.</p><p><strong>근거 범위:</strong> CUDA execution timing 방법입니다.</p><p><strong>일반화 금지:</strong> 특정 rapidsnark GPU backend, fixed occupancy·speedup 또는 numerical parity를 보장하지 않습니다.</p></CitationBlock></div>
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 10/10:</strong> current CPU fact, no-GPU boundary, WTNS/zkey checks, coefficient 식, stage dependencies, GPU representation contract, offload inequality, fallback conditions, parity failures, measurement·rollback을 이 글만으로 답할 수 있습니다.</aside>
    </section>
  </article>;
}
