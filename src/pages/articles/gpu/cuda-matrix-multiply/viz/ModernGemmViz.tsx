import StepViz from "@/components/ui/step-viz";

const C = { blue: "#2563eb", teal: "#0f766e", amber: "#d97706", red: "#dc2626", violet: "#7c3aed", ink: "#334155", muted: "#64748b", line: "#cbd5e1" };

const DATAFLOW_STEPS = [
  { tabLabel: "4×4 문제", label: "4×4 행렬 A와 B를 곱해 4×4 결과 C를 만듭니다", body: "A의 row 수와 B의 column 수가 output shape를 정하고, 공통 K=4가 각 칸의 곱-누산 횟수를 정합니다." },
  { tabLabel: "한 칸 담당", label: "Thread 하나가 output C[1,2] 한 칸을 맡습니다", body: "2차원 thread index를 row=1, col=2에 연결합니다. 유효 범위 밖 thread는 store하지 않습니다." },
  { tabLabel: "row·column", label: "A row [1,2,3,4]와 B column [5,6,7,8]을 짝짓습니다", body: "같은 k의 두 값을 곱합니다. 주소를 따라가는 순서와 수학의 reduction index가 하나로 연결됩니다." },
  { tabLabel: "70 계산", label: "네 곱을 더하면 C[1,2]=70입니다", body: "1×5+2×6+3×7+4×8=70입니다. 한 칸은 4 MAC, FMA=2 관례로 8 FLOPs입니다." },
  { tabLabel: "128 FLOPs", label: "16개 output 전체는 16×4 MAC=128 FLOPs입니다", body: "수학은 끝났지만 이웃 output thread도 같은 A·B 값을 다시 요청합니다. 이제 traffic과 reuse가 다음 질문입니다." },
] as const;

function DataflowDesktop({ step }: { step: number }) {
  const terms = ["1×5", "2×6", "3×7", "4×8"];
  return <svg className="!hidden sm:!block" viewBox="0 0 700 300" role="img" aria-label="4×4 GEMM에서 output C 1 2를 계산하는 과정">
    {step <= 1 ? <>
      {["A · 4×4", "B · 4×4", "C · 4×4"].map((label, index) => { const x = 64 + index * 220; return <g key={label}><rect x={x} y="74" width="132" height="120" rx="12" fill={index === 2 && step === 1 ? `${C.teal}10` : "#f8fafc"} stroke={index === 2 && step === 1 ? C.teal : C.line} /><text x={x + 66} y="105" textAnchor="middle" fontSize="11" fontWeight="700" fill={index === 2 && step === 1 ? C.teal : C.ink}>{label}</text><g>{[0,1,2,3].flatMap(r => [0,1,2,3].map(c => <rect key={`${r}-${c}`} x={x + 26 + c * 20} y={122 + r * 15} width="16" height="11" fill={index === 2 && step === 1 && r === 1 && c === 2 ? `${C.teal}30` : "#ffffff"} stroke={index === 2 && step === 1 && r === 1 && c === 2 ? C.teal : C.line} />))}</g></g>; })}
      <text x="350" y="238" textAnchor="middle" fontSize="10" fontWeight="700" fill={step === 1 ? C.teal : C.blue}>{step === 1 ? "thread(row=1,col=2) → C[1,2]" : "(4×4) × (4×4) → (4×4)"}</text>
    </> : <>
      {terms.map((term, index) => { const x = 46 + index * 158; return <g key={term}><rect x={x} y="82" width="126" height="72" rx="11" fill={step >= 3 ? `${C.blue}0d` : "#f8fafc"} stroke={C.blue} /><text x={x + 63} y="124" textAnchor="middle" fontSize="14" fontWeight="700" fill={C.ink}>{term}</text>{index < 3 && <><line x1={x + 132} y1="118" x2={x + 152} y2="118" stroke={C.blue} /><circle cx={x + 152} cy="118" r="2.2" fill={C.blue} /></>}</g>; })}
      <text x="350" y="198" textAnchor="middle" fontSize="13" fontWeight="700" fill={step === 3 ? C.teal : step === 4 ? C.violet : C.muted}>{step === 2 ? "same k끼리 pair" : step === 3 ? "5 + 12 + 21 + 32 = 70" : "16 outputs × 4 MAC × 2 = 128 FLOPs"}</text>
      <text x="350" y="232" textAnchor="middle" fontSize="9" fill={C.muted}>{step === 4 ? "이웃 thread의 repeated A·B load가 다음 병목 후보" : "한 output thread의 register accumulator"}</text>
    </>}
  </svg>;
}

function DataflowMobile({ step }: { step: number }) {
  const rows = step === 0 ? [["A", "4×4"], ["B", "4×4"], ["C", "4×4"]]
    : step === 1 ? [["block/grid", "2D index"], ["thread", "row 1 · col 2"], ["output", "C[1,2]"]]
      : step === 2 ? [["A row", "1 · 2 · 3 · 4"], ["same k", "pair"], ["B column", "5 · 6 · 7 · 8"]]
        : step === 3 ? [["products", "5 · 12 · 21 · 32"], ["sum", "70"], ["one output", "4 MAC · 8 FLOPs"]]
          : [["outputs", "16"], ["MAC/output", "4"], ["FLOP/MAC", "2"], ["total", "128 FLOPs"]];
  return <svg className="block sm:!hidden" viewBox="0 0 300 350" role="img" aria-label="모바일용 4×4 GEMM output 계산">{rows.map(([a,b], index) => { const y = 20 + index * (rows.length === 3 ? 92 : 76); const active = index === rows.length - 1; return <g key={`${a}-${index}`}><rect x="36" y={y} width="228" height="56" rx="10" fill={active ? `${C.teal}10` : "#f8fafc"} stroke={active ? C.teal : C.line} /><text x="56" y={y + 23} fontSize="9.6" fontWeight="700" fill={active ? C.teal : C.ink}>{a}</text><text x="244" y={y + 38} textAnchor="end" fontSize="9" fontWeight="700" fill={active ? C.teal : C.muted}>{b}</text>{index < rows.length - 1 && <><line x1="48" y1={y + 60} x2="48" y2={y + 72} stroke={C.blue} /><circle cx="48" cy={y + 72} r="2.2" fill={C.blue} /></>}</g>; })}</svg>;
}

export function GemmDataflowViz() { return <StepViz steps={DATAFLOW_STEPS}>{step => <><DataflowMobile step={step} /><DataflowDesktop step={step} /></>}</StepViz>; }

const TILE_STEPS = [
  { tabLabel: "공동 적재", label: "Block의 16 threads가 A·B 4×4 tile을 함께 읽습니다", body: "A 16개와 B 16개, FP32라면 32×4=128 bytes를 global memory에서 shared memory로 stage합니다." },
  { tabLabel: "적재 동기화", label: "첫 barrier가 32개 shared slot의 준비를 맞춥니다", body: "일부 warp가 먼저 consumer loop에 들어가 다른 thread의 load 전 값을 읽지 않게 block 전체가 기다립니다." },
  { tabLabel: "타일 재사용", label: "16 output threads가 각자 4 MAC을 수행합니다", body: "32 loaded values로 모두 64 multiply-accumulate operations를 수행하고, FMA=2 관례로 128 FLOPs입니다." },
  { tabLabel: "덮기 동기화", label: "두 번째 barrier 뒤 다음 K tile로 덮어씁니다", body: "모든 consumer가 현재 tile 사용을 끝내기 전에 shared slot을 새 값으로 덮지 않도록 맞춥니다." },
  { tabLabel: "경계 처리", label: "10×10처럼 끝이 남으면 없는 load는 0으로 채웁니다", body: "T=4의 마지막 K tile에서 k=10,11은 zero-fill하고 모든 thread가 barrier에 도달한 뒤 row<10·col<10 output만 store합니다." },
] as const;

function TileDesktop({ step }: { step: number }) {
  const rows = [["global load", "A 16 + B 16", "128 B"], ["load barrier", "all threads ready", "sync"], ["reuse + compute", "16 outputs × 4 MAC", "128 FLOPs"], ["overwrite barrier", "all consumers done", "sync"], ["partial edge", "predicate + zero fill", "safe"]] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 700 320" role="img" aria-label="4×4 shared-memory tile의 load barrier reuse barrier edge 과정">{rows.map(([a,b,c], index) => { const y = 20 + index * 54; const color = [C.blue,C.amber,C.teal,C.amber,C.violet][index]; return <g key={a} opacity={index > step ? .4 : 1}><rect x="52" y={y} width="596" height="42" rx="9" fill={index === step ? `${color}10` : "#f8fafc"} stroke={index === step ? color : C.line} /><text x="72" y={y + 26} fontSize="9.5" fontWeight="700" fill={index === step ? color : C.ink}>{a}</text><text x="350" y={y + 26} textAnchor="middle" fontSize="9" fill={C.muted}>{b}</text><text x="626" y={y + 26} textAnchor="end" fontSize="9" fontWeight="700" fill={index === step ? color : C.muted}>{c}</text>{index < rows.length - 1 && <><line x1="66" y1={y + 46} x2="66" y2={y + 50} stroke={color} /><circle cx="66" cy={y + 50} r="2" fill={color} /></>}</g>; })}<text x="350" y="302" textAnchor="middle" fontSize="8.8" fill={C.muted}>4×4·FP32의 requested-byte 교육용 fixture · cache와 C store는 별도</text></svg>;
}

function TileMobile({ step }: { step: number }) {
  const rows = [["global", "32 values · 128 B"], ["barrier 1", "loads complete"], ["shared reuse", "16×4 MAC · 128 FLOPs"], ["barrier 2", "consumers complete"], ["edge", "predicate · zero · store guard"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 390" role="img" aria-label="모바일용 4×4 tile reuse 과정">{rows.map(([a,b], index) => { const y = 16 + index * 70; const color = [C.blue,C.amber,C.teal,C.amber,C.violet][index]; return <g key={a} opacity={index > step ? .4 : 1}><rect x="34" y={y} width="232" height="50" rx="9" fill={index === step ? `${color}10` : "#f8fafc"} stroke={index === step ? color : C.line} /><text x="54" y={y + 21} fontSize="9.4" fontWeight="700" fill={index === step ? color : C.ink}>{a}</text><text x="246" y={y + 36} textAnchor="end" fontSize="8.6" fontWeight="700" fill={index === step ? color : C.muted}>{b}</text>{index < rows.length - 1 && <><line x1="46" y1={y + 54} x2="46" y2={y + 66} stroke={color} /><circle cx="46" cy={y + 66} r="2.1" fill={color} /></>}</g>; })}</svg>;
}

export function TileReuseViz() { return <StepViz steps={TILE_STEPS}>{step => <><TileMobile step={step} /><TileDesktop step={step} /></>}</StepViz>; }

const MEASURE_STEPS = [
  { tabLabel: "정답 검사", label: "먼저 0·1·odd·non-multiple shape의 정답을 비교합니다", body: "CPU 또는 library reference와 dtype tolerance를 고정합니다. Edge predicate가 틀리면 timing을 중단합니다." },
  { tabLabel: "예열 분리", label: "Context·module·cache의 첫 실행 효과를 warm-up으로 분리합니다", body: "같은 input·shape를 사용하되 warm-up 결과는 measured distribution에 넣지 않습니다." },
  { tabLabel: "이벤트 측정", label: "같은 stream의 CUDA events로 kernel 완료를 잽니다", body: "Start와 stop event를 기록하고 stop을 synchronize해 비동기 launch 반환시간과 GPU elapsed를 구별합니다." },
  { tabLabel: "작업량÷시간", label: "1024³의 useful work는 약 2.147 GFLOPs입니다", body: "2×1024³=2,147,483,648 FLOPs입니다. 0.20ms라는 설명용 elapsed라면 약 10.74 TFLOP/s입니다." },
  { tabLabel: "배포 기록", label: "Requested bytes와 actual DRAM·resources를 함께 저장합니다", body: "Median·p95 kernel/end-to-end, achieved FLOP/s·GB/s, register·shared·occupancy·stalls를 같은 receipt에 둡니다." },
] as const;

const MEASURE_ROWS = [["parity", "reference · edge shapes", C.blue], ["warm-up", "first-run excluded", C.amber], ["events", "same stream · stop sync", C.teal], ["work/time", "2.147 GFLOP ÷ 0.20 ms", C.violet], ["release receipt", "median · p95 · counters", C.red]] as const;
function MeasurementDesktop({ step }: { step: number }) { return <svg className="!hidden sm:!block" viewBox="0 0 700 320" role="img" aria-label="GEMM correctness warmup event throughput release 측정 과정">{MEASURE_ROWS.map(([a,b,color], index) => { const y=20+index*54; return <g key={a} opacity={index>step?.4:1}><rect x="52" y={y} width="596" height="42" rx="9" fill={index===step?`${color}10`:"#f8fafc"} stroke={index===step?color:C.line}/><text x="72" y={y+26} fontSize="9.5" fontWeight="700" fill={index===step?color:C.ink}>{a}</text><text x="626" y={y+26} textAnchor="end" fontSize="9" fontWeight="700" fill={index===step?color:C.muted}>{b}</text>{index<4&&<><line x1="66" y1={y+46} x2="66" y2={y+50} stroke={color}/><circle cx="66" cy={y+50} r="2" fill={color}/></>}</g>})}<text x="350" y="302" textAnchor="middle" fontSize="8.8" fill={C.muted}>0.20ms는 계산을 설명하는 가상 값이며 target GPU 실측이 아닙니다</text></svg>; }
function MeasurementMobile({ step }: { step: number }) { return <svg className="block sm:!hidden" viewBox="0 0 300 390" role="img" aria-label="모바일용 GEMM 측정 과정">{MEASURE_ROWS.map(([a,b,color], index)=>{const y=16+index*70;return <g key={a} opacity={index>step?.4:1}><rect x="34" y={y} width="232" height="50" rx="9" fill={index===step?`${color}10`:"#f8fafc"} stroke={index===step?color:C.line}/><text x="54" y={y+21} fontSize="9.4" fontWeight="700" fill={index===step?color:C.ink}>{a}</text><text x="246" y={y+36} textAnchor="end" fontSize="8.5" fill={C.muted}>{b}</text>{index<4&&<><line x1="46" y1={y+54} x2="46" y2={y+66} stroke={color}/><circle cx="46" cy={y+66} r="2" fill={color}/></>}</g>})}</svg>; }
export function GemmMeasurementViz(){return <StepViz steps={MEASURE_STEPS}>{step=><><MeasurementMobile step={step}/><MeasurementDesktop step={step}/></>}</StepViz>}

const RELEASE_STEPS = [
  { tabLabel: "naive 기준", label: "Naive kernel은 수학·index·edge의 가장 단순한 기준선입니다", body: "단순함이 목적입니다. Cache가 반복 load를 흡수할 수 있지만 재사용을 명시적으로 보장하지는 않습니다." },
  { tabLabel: "tiled 후보", label: "Tiled kernel은 requested traffic을 줄이는 후보입니다", body: "T=16·32 등 여러 tile에서 actual traffic, bank·barrier, register·shared와 end-to-end를 측정합니다." },
  { tabLabel: "cuBLAS 기준", label: "cuBLAS는 production library 기준선입니다", body: "Tensor Core·pipeline·epilogue 경로와 precision semantics를 맞추고 custom kernel보다 먼저 비교합니다." },
  { tabLabel: "release gate", label: "목표 workload slice에서 같은 답과 p95를 이긴 후보만 채택합니다", body: "한 정사각 shape의 승자를 skinny·tiny·odd shape로 일반화하지 않고 회귀 slice는 fallback합니다." },
] as const;
const RELEASE_ROWS=[["naive","simple reference",C.blue],["tiled","reuse candidate",C.teal],["cuBLAS","library baseline",C.amber],["release","parity · median · p95",C.violet]] as const;
function ReleaseDesktop({step}:{step:number}){return <svg className="!hidden sm:!block" viewBox="0 0 700 280" role="img" aria-label="Naive tiled cuBLAS GEMM release gate">{RELEASE_ROWS.map(([a,b,color],i)=>{const x=28+i*169;return <g key={a} opacity={i>step?.4:1}><rect x={x} y="66" width="145" height="112" rx="12" fill={i===step?`${color}10`:"#f8fafc"} stroke={i===step?color:C.line}/><text x={x+72.5} y="98" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={i===step?color:C.ink}>{a}</text><text x={x+72.5} y="132" textAnchor="middle" fontSize="8.8" fill={C.muted}>{b}</text><text x={x+72.5} y="157" textAnchor="middle" fontSize="8.6" fontWeight="700" fill={i===step?color:C.muted}>{i<step?"pass":i===step?"check":"wait"}</text>{i<3&&<><line x1={x+149} y1="122" x2={x+165} y2="122" stroke={color}/><circle cx={x+165} cy="122" r="2.2" fill={color}/></>}</g>})}<text x="350" y="232" textAnchor="middle" fontSize="9" fontWeight="700" fill={step===3?C.violet:C.red}>{step===3?"목표 workload에서만 release":"앞 관문을 다음 후보의 속도로 덮지 않음"}</text></svg>}
function ReleaseMobile({step}:{step:number}){return <svg className="block sm:!hidden" viewBox="0 0 300 340" role="img" aria-label="모바일용 GEMM release gate">{RELEASE_ROWS.map(([a,b,color],i)=>{const y=18+i*72;return <g key={a} opacity={i>step?.4:1}><rect x="34" y={y} width="232" height="52" rx="9" fill={i===step?`${color}10`:"#f8fafc"} stroke={i===step?color:C.line}/><text x="54" y={y+22} fontSize="9.5" fontWeight="700" fill={i===step?color:C.ink}>{a}</text><text x="246" y={y+39} textAnchor="end" fontSize="8.6" fill={C.muted}>{b}</text>{i<3&&<><line x1="46" y1={y+55} x2="46" y2={y+67} stroke={color}/><circle cx="46" cy={y+67} r="2" fill={color}/></>}</g>})}<text x="150" y="326" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={step===3?C.violet:C.red}>{step===3?"workload-scoped release":"fail → stop"}</text></svg>}
export function GemmReleaseViz(){return <StepViz steps={RELEASE_STEPS}>{step=><><ReleaseMobile step={step}/><ReleaseDesktop step={step}/></>}</StepViz>}
