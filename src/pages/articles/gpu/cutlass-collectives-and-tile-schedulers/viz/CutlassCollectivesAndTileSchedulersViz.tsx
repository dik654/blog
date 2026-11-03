import StepViz from "@/components/ui/step-viz";

const C = {
  blue: "#2563eb",
  teal: "#0f766e",
  amber: "#d97706",
  violet: "#7c3aed",
  red: "#dc2626",
  ink: "#334155",
  muted: "#64748b",
  line: "#cbd5e1",
};

const tint = (color: string, alpha = "16") => color + alpha;

const OVERVIEW = [
  { tabLabel: "문제 모양", label: "설명용 GEMM은 M=512, N=640, K=256입니다", body: "실제 성능 측정값이 아니라 모든 계산을 한 경로로 잇기 위한 고정 fixture입니다." },
  { tabLabel: "Tile 20개", label: "128×128×64 tile이면 output은 4×5=20 tiles입니다", body: "M 방향 512÷128=4, N 방향 640÷128=5입니다. K는 256÷64=4번 반복합니다." },
  { tabLabel: "Collective", label: "CollectiveMma는 tile 하나의 K 반복 4회를 stage pipeline으로 처리합니다", body: "CollectiveEpilogue는 accumulator에 후처리를 적용해 output tile을 씁니다." },
  { tabLabel: "Scheduler", label: "Tile scheduler는 worker 8개에 output tile 20개를 어떤 순서로 줄지 정합니다", body: "Static persistent는 local arithmetic으로 다음 tile을 정하고 Stream-K는 K 반복 80개를 나눕니다." },
  { tabLabel: "Profiler", label: "Stage·cluster·scheduler·raster 후보는 마지막에 같은 shape로 실측합니다", body: "식은 가능한 후보와 비용을 설명할 뿐 가장 빠른 조합을 정하지 않습니다." },
] as const;

function OverviewDesktop({ step }: { step: number }) {
  const nodes = [["Shape", "512×640×256", C.blue], ["Tiles", "4×5 · K 4회", C.amber], ["Collective", "MMA → epilogue", C.violet], ["Scheduler", "8 workers", C.teal], ["Profiler", "same shape", C.red]] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 300" role="img" aria-label="GEMM shape에서 CUTLASS collective scheduler profiler로 이어지는 큰 그림">
    {nodes.slice(0, -1).map((n, i) => <g key={n[0]} opacity={i < step ? 1 : .28}><line x1={112 + i * 142} y1="126" x2={152 + i * 142} y2="126" stroke={n[2]} strokeWidth="1.25"/><circle cx={152 + i * 142} cy="126" r="2.5" fill={n[2]}/></g>)}
    {nodes.map(([a, b, color], i) => { const x = 42 + i * 142; return <g key={a} opacity={i <= step ? 1 : .3}><rect x={x} y="84" width="108" height="84" rx="14" fill={i === step ? tint(color) : "#f8fafc"} stroke={i <= step ? color : C.line}/><text x={x + 54} y="116" textAnchor="middle" fontSize="9.4" fontWeight="900" fill={color}>{a}</text><text x={x + 54} y="142" textAnchor="middle" fontSize="8.1" fill={C.muted}>{b}</text></g>; })}
    <rect x="136" y="220" width="448" height="34" rx="9" fill={tint(nodes[step][2], "0d")} stroke={nodes[step][2]}/><text x="360" y="241" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.ink}>{["입력 shape 고정", "20 tiles · 80 K-iterations", "tile 하나의 실행 계약", "tile을 worker에 배정", "후보를 같은 조건에서 측정"][step]}</text>
  </svg>;
}

function OverviewMobile({ step }: { step: number }) {
  const rows = [["Shape", "512×640×256"], ["Tiles", "4×5 · K 4회"], ["Collective", "MMA → epilogue"], ["Scheduler", "8 workers"], ["Profiler", "same shape"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 405" role="img" aria-label="모바일용 CUTLASS 큰 그림">
    {rows.map(([a, b], i) => { const y = 14 + i * 69; const color = [C.blue,C.amber,C.violet,C.teal,C.red][i]; return <g key={a} opacity={i <= step ? 1 : .3}><circle cx="55" cy={y + 24} r="20" fill={i===step?tint(color):"#f8fafc"} stroke={i<=step?color:C.line}/><text x="55" y={y+28} textAnchor="middle" fontSize="8.5" fontWeight="900" fill={color}>{i+1}</text><text x="92" y={y+20} fontSize="9.4" fontWeight="800" fill={i===step?color:C.ink}>{a}</text><text x="92" y={y+39} fontSize="8.5" fill={C.muted}>{b}</text>{i<4&&<><line x1="55" y1={y+46} x2="55" y2={y+65} stroke={color}/><circle cx="55" cy={y+65} r="2" fill={color}/></>}</g>; })}
    <text x="150" y="388" textAnchor="middle" fontSize="8.4" fontWeight="800" fill={C.ink}>한 shape의 같은 숫자를 끝까지 유지합니다</text>
  </svg>;
}

export function CutlassOverviewViz() {
  return <StepViz steps={OVERVIEW}>{step => <><OverviewMobile step={step}/><OverviewDesktop step={step}/></>}</StepViz>;
}

const COLLECTIVE = [
  { tabLabel: "Tile 배정", label: "Scheduler가 worker 0에 output tile (m=0,n=0)을 줍니다", body: "Collective는 어느 tile을 받을지 결정하지 않고 받은 tile을 어떻게 처리할지만 소유합니다." },
  { tabLabel: "Stage 채우기", label: "Producer warp가 A 16KiB와 B 16KiB를 다음 shared-memory stage에 옮깁니다", body: "128×64×2B=16KiB씩이며 TMA와 barrier의 구체 schedule은 DispatchPolicy가 고정합니다." },
  { tabLabel: "MMA 4회", label: "Consumer warp group이 K 방향 네 stage를 차례로 소비해 accumulator를 만듭니다", body: "K=256, bK=64이므로 k-iteration은 4회입니다." },
  { tabLabel: "Epilogue", label: "CollectiveEpilogue가 accumulator에 bias·activation 등을 적용해 D tile을 씁니다", body: "Mainloop과 epilogue는 accumulator tensor shape 계약으로 연결됩니다." },
  { tabLabel: "다음 Tile", label: "Worker 0은 static persistent loop에서 index 0→8→16으로 이동합니다", body: "Grid가 8이므로 다음 linear tile은 현재 index에 8을 더해 얻습니다." },
] as const;

function CollectiveDesktop({ step }: { step: number }) {
  const nodes = [["tile (0,0)",C.blue],["A+B stage",C.amber],["4× MMA",C.violet],["D tile",C.teal],["idx + 8",C.red]] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 300" role="img" aria-label="CUTLASS tile 하나가 scheduler collective mainloop epilogue를 통과하는 과정">
    {nodes.slice(0,-1).map((n,i)=><g key={n[0]} opacity={i<step?1:.28}><line x1={146+i*138} y1="126" x2={176+i*138} y2="126" stroke={n[1]} strokeWidth="1.25"/><circle cx={176+i*138} cy="126" r="2.5" fill={n[1]}/></g>)}
    {nodes.map(([label,color],i)=>{const x=46+i*138;return <g key={label} opacity={i<=step?1:.3}>{i===2?<circle cx={x+50} cy="126" r="45" fill={i===step?tint(color):"#f8fafc"} stroke={i<=step?color:C.line}/>:<rect x={x} y="86" width="100" height="80" rx="13" fill={i===step?tint(color):"#f8fafc"} stroke={i<=step?color:C.line}/>}<text x={x+50} y="130" textAnchor="middle" fontSize="9" fontWeight="900" fill={i===step?color:C.ink}>{label}</text></g>})}
    <rect x="134" y="218" width="452" height="38" rx="9" fill={tint(nodes[step][1],"0d")} stroke={nodes[step][1]}/><text x="360" y="241" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={C.ink}>{["scheduler owns assignment","producer owns copies","consumer owns math","epilogue owns output","persistent loop owns next work"][step]}</text>
  </svg>;
}

function CollectiveMobile({step}:{step:number}) {
  const rows=[["Tile","(0,0)"],["Stage","A16 + B16 KiB"],["Mainloop","MMA × 4"],["Epilogue","acc → D"],["Next","0 → 8 → 16"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 395" role="img" aria-label="모바일용 CUTLASS collective 실행 경로">{rows.map(([a,b],i)=>{const y=14+i*67,color=[C.blue,C.amber,C.violet,C.teal,C.red][i];return <g key={a} opacity={i<=step?1:.3}><rect x="38" y={y} width="224" height="46" rx="9" fill={i===step?tint(color,"14"):"#f8fafc"} stroke={i<=step?color:C.line}/><text x="54" y={y+19} fontSize="9.1" fontWeight="900" fill={color}>{a}</text><text x="242" y={y+32} textAnchor="end" fontSize="8.7" fontWeight="800" fill={C.ink}>{b}</text>{i<4&&<><line x1="52" y1={y+49} x2="52" y2={y+63} stroke={color}/><circle cx="52" cy={y+63} r="2" fill={color}/></>}</g>})}<text x="150" y="374" textAnchor="middle" fontSize="8.4" fontWeight="800" fill={C.ink}>tile 하나의 ownership을 부품별로 나눕니다</text></svg>;
}

export function CollectiveTraceViz(){return <StepViz steps={COLLECTIVE}>{step=><><CollectiveMobile step={step}/><CollectiveDesktop step={step}/></>}</StepViz>}

const STAGES=[
  {tabLabel:"A 16KiB",label:"A tile 한 벌은 128×64×2B=16KiB입니다",body:"Tile의 M×K 원소 수에 bf16 2B를 곱합니다."},
  {tabLabel:"B 16KiB",label:"B tile 한 벌도 64×128×2B=16KiB입니다",body:"A와 B를 합치면 barrier·alignment 전 stage 한 벌은 32KiB입니다."},
  {tabLabel:"Stage 3",label:"Stage 3은 32×3=96KiB를 mainloop buffers로 사용합니다",body:"Producer는 최대 두 벌 앞서 copy를 발행할 수 있지만 실제 overlap은 schedule과 K 길이를 탑니다."},
  {tabLabel:"Stage 4",label:"Stage 4는 32×4=128KiB를 사용합니다",body:"H100 threadblock 한도 227KiB 안에는 들어가지만 epilogue carveout과 정렬·barrier도 남겨야 합니다."},
  {tabLabel:"측정 선택",label:"Stage 수가 늘면 latency hiding은 좋아질 수 있지만 resident blocks는 줄 수 있습니다",body:"K 반복이 4회뿐인 fixture에서는 깊은 pipeline의 fill·drain 비용도 커지므로 profiler로 고릅니다."},
] as const;

function StageDesktop({step}:{step:number}) {
  const vals=[16,16,96,128] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 310" role="img" aria-label="CUTLASS pipeline stage shared memory 계산">
    <rect x="70" y="44" width="580" height="38" rx="8" fill="#f8fafc" stroke={C.line}/><rect x="70" y="44" width={580*128/227} height="38" rx="8" fill={tint(C.violet,"18")} stroke={C.violet}/><text x="360" y="68" textAnchor="middle" fontSize="8.7" fontWeight="800" fill={C.ink}>H100 block limit 227KiB · stage4 mainloop 128KiB</text>
    {vals.map((v,i)=>{const x=58+i*166,color=[C.blue,C.amber,C.teal,C.violet][i];return <g key={i} opacity={i<=Math.min(step,3)?1:.3}><rect x={x} y="124" width="136" height="92" rx="12" fill={i===step?tint(color):"#f8fafc"} stroke={i<=step?color:C.line}/><text x={x+68} y="154" textAnchor="middle" fontSize="9" fontWeight="900" fill={color}>{["A tile","B tile","stage 3","stage 4"][i]}</text><text x={x+68} y="188" textAnchor="middle" fontSize="15" fontWeight="900" fill={C.ink}>{v}KiB</text></g>})}
    <rect x="174" y="252" width="372" height="32" rx="8" fill={step===4?tint(C.red,"0d"):"#f8fafc"} stroke={step===4?C.red:C.line}/><text x="360" y="272" textAnchor="middle" fontSize="8.7" fontWeight="800" fill={C.ink}>{step===4?"fits ≠ fastest · occupancy와 K=4를 함께 측정":"stage 한 벌 = A16 + B16 = 32KiB"}</text>
  </svg>;
}

function StageMobile({step}:{step:number}) {
  const rows=[["A","128×64×2B","16KiB"],["B","64×128×2B","16KiB"],["한 벌","16+16","32KiB"],["Stage 3","32×3","96KiB"],["Stage 4","32×4","128KiB"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 405" role="img" aria-label="모바일용 pipeline stage memory 계산">{rows.map(([a,b,v],i)=>{const y=12+i*69,color=[C.blue,C.amber,C.teal,C.violet,C.red][i];return <g key={a} opacity={i<=Math.min(step+1,4)?1:.3}><rect x="36" y={y} width="228" height="50" rx="9" fill={(i===step||i===step+1&&step<2)?tint(color,"12"):"#f8fafc"} stroke={i<=Math.min(step+1,4)?color:C.line}/><text x="52" y={y+19} fontSize="9" fontWeight="900" fill={color}>{a}</text><text x="52" y={y+38} fontSize="8.1" fill={C.muted}>{b}</text><text x="244" y={y+31} textAnchor="end" fontSize="9.4" fontWeight="900" fill={C.ink}>{v}</text></g>})}<text x="150" y="382" textAnchor="middle" fontSize="8.3" fontWeight="800" fill={step===4?C.red:C.muted}>{step===4?"fit만 확인 · fastest는 profiler":"H100 227KiB에서 carveout 별도"}</text></svg>;
}

export function StageBudgetViz(){return <StepViz steps={STAGES}>{step=><><StageMobile step={step}/><StageDesktop step={step}/></>}</StepViz>}

const SCHEDULER=[
  {tabLabel:"20 tiles",label:"4×5 output grid를 linear tile 0~19로 펼칩니다",body:"Raster order와 swizzle은 linear index를 (m,n)으로 푸는 순서이며 shared-memory swizzle과 다른 개념입니다."},
  {tabLabel:"Wave 1",label:"Worker 0~7이 tile 0~7을 처리해 첫 wave를 채웁니다",body:"이 단순 fixture는 한 worker block이 동시에 한 tile을 처리한다고 둡니다."},
  {tabLabel:"Wave 2",label:"Static persistent loop는 index에 grid 8을 더해 tile 8~15를 줍니다",body:"Worker 0의 경로는 0→8→16입니다."},
  {tabLabel:"Wave 3",label:"마지막에는 tile 16~19만 남아 workers 4개가 한 wave 동안 놉니다",body:"배정 slot은 3×8=24, 실제 tile은 20이므로 효율 20/24=83.3%, 빈 비율 16.7%입니다."},
  {tabLabel:"다음 질문",label:"Tile 수를 바꾸지 않고 K 반복 80개를 균등하게 나누면 빈 wave를 줄일 수 있을까요?",body:"이 질문이 Stream-K로 이어집니다. 다만 partial accumulator 합치기 비용이 새로 생깁니다."},
] as const;

function SchedulerDesktop({step}:{step:number}) {
  return <svg className="!hidden sm:!block" viewBox="0 0 720 330" role="img" aria-label="20 output tiles가 8 workers에 세 wave로 배정되는 과정">
    {Array.from({length:8},(_,w)=><text key={w} x="42" y={62+w*28} fontSize="8.5" fontWeight="800" fill={C.muted}>W{w}</text>)}
    {Array.from({length:3},(_,wave)=>Array.from({length:8},(_,w)=>{const tile=wave*8+w;const active=wave<=Math.min(step-1,2)&&step>0;const exists=tile<20;const x=78+wave*188,y=44+w*28;return <g key={wave+"-"+w} opacity={active?1:.24}><rect x={x} y={y} width="156" height="20" rx="4" fill={exists?tint([C.blue,C.violet,C.teal][wave],"18"):"#f8fafc"} stroke={exists?[C.blue,C.violet,C.teal][wave]:C.line} strokeDasharray={exists?undefined:"3 2"}/>{exists&&<text x={x+8} y={y+14} fontSize="8.2" fontWeight="800" fill={C.ink}>t{tile}</text>}</g>}))}
    <text x="156" y="294" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={C.blue}>wave 1</text><text x="344" y="294" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={C.violet}>wave 2</text><text x="532" y="294" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={C.teal}>wave 3 · 4 idle</text>
    <text x="360" y="318" textAnchor="middle" fontSize="9" fontWeight="900" fill={step>=3?C.red:C.muted}>{step>=3?"20 ÷ (3×8) = 83.3% · waste 16.7%":"idx += grid 8"}</text>
  </svg>;
}

function SchedulerMobile({step}:{step:number}) {
  const waves=[["Wave 1","t0 … t7","8 / 8"],["Wave 2","t8 … t15","8 / 8"],["Wave 3","t16 … t19","4 / 8"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 355" role="img" aria-label="모바일용 tile wave 배정">{waves.map(([a,b,c],i)=>{const y=34+i*76,color=[C.blue,C.violet,C.teal][i],active=step>i;return <g key={a} opacity={active?1:.3}><rect x="36" y={y} width="228" height="55" rx="10" fill={active?tint(color,"12"):"#f8fafc"} stroke={active?color:C.line}/><text x="52" y={y+21} fontSize="9.2" fontWeight="900" fill={color}>{a}</text><text x="52" y={y+41} fontSize="8.3" fill={C.muted}>{b}</text><text x="244" y={y+34} textAnchor="end" fontSize="9" fontWeight="900" fill={C.ink}>{c}</text></g>})}<rect x="36" y="273" width="228" height="48" rx="9" fill={step>=3?tint(C.red,"0d"):"#f8fafc"} stroke={step>=3?C.red:C.line}/><text x="150" y="294" textAnchor="middle" fontSize="8.6" fontWeight="900" fill={C.ink}>slot 24 · work 20</text><text x="150" y="311" textAnchor="middle" fontSize="8.1" fill={C.muted}>효율 83.3% · 빈 비율 16.7%</text></svg>;
}

export function TileSchedulerViz(){return <StepViz steps={SCHEDULER}>{step=><><SchedulerMobile step={step}/><SchedulerDesktop step={step}/></>}</StepViz>}

const STREAM_K=[
  {tabLabel:"80 iterations",label:"20 tiles에 K 반복이 4회씩 있으므로 전체 일은 20×4=80입니다",body:"Data-parallel은 tile을 쪼개지 않지만 Stream-K는 이 K-iteration 전체를 worker에 나눕니다."},
  {tabLabel:"10 each",label:"80 iterations를 8 workers에 나누면 각 worker가 정확히 10회씩 맡습니다",body:"스케줄링만 보면 종료점이 12회에서 10회로 줄어 이상적인 개선폭은 16.7%입니다."},
  {tabLabel:"4 split tiles",label:"10은 tile당 4의 배수가 아니어서 경계 tile 2·7·12·17이 두 worker에 걸립니다",body:"각 worker 구간 [0,10), [10,20)…이 4의 배수 경계를 가로지를 때 split tile이 생깁니다."},
  {tabLabel:"Fixup",label:"Split tile마다 partial accumulator를 저장하고 최종 합치는 fixup이 필요합니다",body:"원자 연산·workspace·동기화 비용은 kernel과 hardware 구현에 따라 달라집니다."},
  {tabLabel:"선택 기준",label:"빈 wave 절약이 fixup 비용보다 클 때만 Stream-K가 이깁니다",body:"따라서 tile 수가 이미 worker 수의 배수이거나 K가 짧으면 data-parallel이 더 단순하고 빠를 수 있습니다."},
] as const;

function StreamKDesktop({step}:{step:number}) {
  return <svg className="!hidden sm:!block" viewBox="0 0 720 330" role="img" aria-label="80 K iterations를 8 workers에 균등 배분하고 split tile을 합치는 Stream-K 과정">
    <text x="360" y="28" textAnchor="middle" fontSize="9" fontWeight="900" fill={C.ink}>20 tiles × 4 K-iters = 80 · worker 8</text>
    {Array.from({length:8},(_,w)=>{const y=52+w*29;return <g key={w} opacity={step>=1?1:.28}><text x="36" y={y+15} fontSize="8" fontWeight="800" fill={C.muted}>W{w}</text><rect x="66" y={y} width="580" height="19" rx="4" fill="#f8fafc" stroke={C.line}/><rect x={66+w*72.5} y={y} width="72.5" height="19" rx="4" fill={tint(w%2?C.violet:C.blue,"18")} stroke={w%2?C.violet:C.blue}/><text x={102+w*72.5} y={y+13.5} textAnchor="middle" fontSize="7.8" fontWeight="900" fill={C.ink}>{w*10}–{w*10+9}</text></g>})}
    {step>=2&&[10,30,50,70].map((boundary,i)=>{const x=66+boundary/80*580;return <g key={boundary}><line x1={x} y1="46" x2={x} y2="287" stroke={C.red} strokeDasharray="3 3"/><circle cx={x} cy="42" r="3" fill={C.red}/><text x={x} y="310" textAnchor="middle" fontSize="7.8" fontWeight="800" fill={C.red}>split t{[2,7,12,17][i]}</text></g>})}
    <text x="360" y="326" textAnchor="middle" fontSize="8.4" fontWeight="900" fill={step>=3?C.red:C.muted}>{step>=3?"ideal 12→10 뒤에 fixup 비용을 더해야 합니다":"각 worker 10 iterations"}</text>
  </svg>;
}

function StreamKMobile({step}:{step:number}) {
  const rows=[["전체 일","20×4","80"],["균등 몫","80÷8","10씩"],["경계","t2·7·12·17","4 split"],["새 비용","partial 합치기","fixup"],["판정","절약 > fixup","선택"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 405" role="img" aria-label="모바일용 Stream-K 균등 배분 계산">{rows.map(([a,b,c],i)=>{const y=14+i*69,color=[C.blue,C.violet,C.red,C.amber,C.teal][i];return <g key={a} opacity={i<=step?1:.3}><rect x="35" y={y} width="230" height="50" rx="9" fill={i===step?tint(color,"12"):"#f8fafc"} stroke={i<=step?color:C.line}/><text x="51" y={y+19} fontSize="9" fontWeight="900" fill={color}>{a}</text><text x="51" y={y+38} fontSize="8.1" fill={C.muted}>{b}</text><text x="245" y={y+31} textAnchor="end" fontSize="9.2" fontWeight="900" fill={C.ink}>{c}</text></g>})}<text x="150" y="383" textAnchor="middle" fontSize="8.2" fontWeight="800" fill={C.ink}>이상적 16.7% 절약은 fixup 전 숫자입니다</text></svg>;
}

export default function StreamKBalanceViz(){return <StepViz steps={STREAM_K}>{step=><><StreamKMobile step={step}/><StreamKDesktop step={step}/></>}</StepViz>}

const CLUSTER=[
  {tabLabel:"2×1 cluster",label:"M 방향으로 붙은 CTA 두 개는 서로 다른 A tile과 같은 B tile을 씁니다",body:"두 CTA는 하나의 cluster로 함께 배치되며 같은 GPC 안에서 동시 실행 조건을 만족해야 합니다."},
  {tabLabel:"복제 전송",label:"Multicast가 없으면 같은 B tile을 global memory에서 두 번 가져옵니다",body:"CTA마다 자기 shared memory가 있으므로 단순 경로는 B transfer가 두 번입니다."},
  {tabLabel:"TMA multicast",label:"한 번의 B tile 전송이 두 CTA의 shared memory를 동시에 채웁니다",body:"각 CTA가 B의 절반만 읽는 것이 아니라 동일한 완전한 B tile을 받습니다."},
  {tabLabel:"조건 확인",label:"이상적인 pair B traffic은 2→1이지만 A traffic·cluster 제약·occupancy는 그대로 남습니다",body:"Cluster shape은 reuse 방향과 active-cluster 한도를 함께 측정해 고릅니다."},
] as const;

function ClusterDesktop({step}:{step:number}) {
  return <svg className="!hidden sm:!block" viewBox="0 0 720 310" role="img" aria-label="2x1 CTA cluster에서 B tile을 TMA multicast로 공유하는 과정">
    <rect x="62" y="60" width="596" height="172" rx="24" fill="#f8fafc" stroke={C.violet}/><text x="82" y="86" fontSize="8.5" fontWeight="900" fill={C.violet}>CLUSTER 2×1 · same GPC</text>
    {[0,1].map(i=><g key={i}><rect x={166+i*268} y="111" width="120" height="76" rx="12" fill={tint(i?C.teal:C.blue,"12")} stroke={i?C.teal:C.blue}/><text x={226+i*268} y="141" textAnchor="middle" fontSize="9" fontWeight="900" fill={C.ink}>CTA {i}</text><text x={226+i*268} y="164" textAnchor="middle" fontSize="8" fill={C.muted}>A{i} + shared B</text></g>)}
    {step<2?[0,1].map(i=><g key={i} opacity={step>=1?1:.28}><line x1="360" y1="42" x2={226+i*268} y2="104" stroke={C.amber}/><circle cx={226+i*268} cy="104" r="3" fill={C.amber}/></g>):<><line x1="360" y1="42" x2="360" y2="91" stroke={C.amber}/><line x1="360" y1="91" x2="226" y2="104" stroke={C.amber}/><line x1="360" y1="91" x2="494" y2="104" stroke={C.amber}/><circle cx="226" cy="104" r="3" fill={C.amber}/><circle cx="494" cy="104" r="3" fill={C.amber}/></>}
    <rect x="292" y="18" width="136" height="32" rx="8" fill={tint(C.amber,"16")} stroke={C.amber}/><text x="360" y="38" textAnchor="middle" fontSize="8.5" fontWeight="900" fill={C.ink}>global B tile</text>
    <text x="360" y="270" textAnchor="middle" fontSize="9" fontWeight="900" fill={step>=2?C.teal:C.muted}>{step>=2?"full B transfer 2 → 1 · two shared-memory destinations":"same B tile · separate A tiles"}</text>
  </svg>;
}

function ClusterMobile({step}:{step:number}) {
  const rows=[["배치","CTA 0 + CTA 1","2×1"],["공통 데이터","같은 B tile","reuse"],["기본 전송","B를 두 번","2"],["multicast","한 번→두 smem","1"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 350" role="img" aria-label="모바일용 TMA multicast 설명">{rows.map(([a,b,c],i)=>{const y=22+i*69,color=[C.violet,C.blue,C.red,C.teal][i];return <g key={a} opacity={i<=step?1:.3}><rect x="36" y={y} width="228" height="50" rx="9" fill={i===step?tint(color,"12"):"#f8fafc"} stroke={i<=step?color:C.line}/><text x="52" y={y+19} fontSize="9" fontWeight="900" fill={color}>{a}</text><text x="52" y={y+38} fontSize="8.1" fill={C.muted}>{b}</text><text x="244" y={y+31} textAnchor="end" fontSize="9.2" fontWeight="900" fill={C.ink}>{c}</text></g>})}<text x="150" y="326" textAnchor="middle" fontSize="8.2" fontWeight="800" fill={C.ink}>각 CTA가 절반이 아니라 full B를 받습니다</text></svg>;
}

export function ClusterMulticastViz(){return <StepViz steps={CLUSTER}>{step=><><ClusterMobile step={step}/><ClusterDesktop step={step}/></>}</StepViz>}

const AUTOTUNE=[
  {tabLabel:"16 candidates",label:"Stage 2개 × cluster 2개 × scheduler 2개 × raster 2개로 설명용 후보 16개를 만듭니다",body:"실제 후보는 build에 인스턴스화된 operation만 가능합니다."},
  {tabLabel:"Build",label:"현재 GPU·dtype·alignment에서 실제 실행 가능한 kernel만 등록합니다",body:"문서에 옵션이 있다고 profiler가 모든 조합을 런타임 생성하는 것은 아닙니다."},
  {tabLabel:"Parity",label:"같은 입력과 reference로 정확도 허용오차를 먼저 통과시킵니다",body:"빠르지만 틀린 kernel은 성능 후보가 아닙니다."},
  {tabLabel:"Benchmark",label:"Warm-up 뒤 반복 측정해 중앙값과 p95를 함께 봅니다",body:"한 번의 최솟값보다 분산과 tail latency가 실제 운영 결정을 더 잘 설명합니다."},
  {tabLabel:"Dispatch",label:"(M,N,K,dtype,layout,hardware) 범위별 winner를 dispatch table에 저장합니다",body:"모든 shape에 하나의 winner가 있다고 일반화하지 않습니다."},
] as const;

function AutotuneDesktop({step}:{step:number}) {
  const nodes=[["2×2×2×2","16"],["compiled","≤16"],["correct","pass"],["p50·p95","measure"],["shape key","winner"]] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 300" role="img" aria-label="CUTLASS profiler로 후보를 검증하고 shape별 kernel을 선택하는 과정">
    {nodes.slice(0,-1).map((n,i)=><g key={n[0]} opacity={i<step?1:.25}><line x1={146+i*138} y1="132" x2={176+i*138} y2="132" stroke={C.blue}/><circle cx={176+i*138} cy="132" r="2.5" fill={C.blue}/></g>)}
    {nodes.map(([a,b],i)=>{const x=46+i*138,color=[C.blue,C.violet,C.red,C.amber,C.teal][i];return <g key={a} opacity={i<=step?1:.3}><rect x={x} y="85" width="100" height="94" rx="13" fill={i===step?tint(color,"14"):"#f8fafc"} stroke={i<=step?color:C.line}/><text x={x+50} y="120" textAnchor="middle" fontSize="8.6" fontWeight="900" fill={color}>{a}</text><text x={x+50} y="151" textAnchor="middle" fontSize="9" fontWeight="900" fill={C.ink}>{b}</text></g>})}
    <text x="360" y="232" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={C.ink}>{["설명용 조합 수","build가 가능한 집합","정확도 gate","반복 latency","shape-scoped 선택"][step]}</text><text x="360" y="260" textAnchor="middle" fontSize="8" fill={C.muted}>후보 수 16은 이 fixture의 탐색표이지 CUTLASS의 고정값이 아닙니다</text>
  </svg>;
}

function AutotuneMobile({step}:{step:number}) {
  const rows=[["조합","2⁴","16"],["빌드","지원 operation","≤16"],["정확도","reference 비교","gate"],["성능","warm-up+p50/p95","rank"],["저장","shape key","dispatch"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 405" role="img" aria-label="모바일용 CUTLASS autotuning 절차">{rows.map(([a,b,c],i)=>{const y=14+i*69,color=[C.blue,C.violet,C.red,C.amber,C.teal][i];return <g key={a} opacity={i<=step?1:.3}><rect x="35" y={y} width="230" height="50" rx="9" fill={i===step?tint(color,"12"):"#f8fafc"} stroke={i<=step?color:C.line}/><text x="51" y={y+19} fontSize="9" fontWeight="900" fill={color}>{a}</text><text x="51" y={y+38} fontSize="8.1" fill={C.muted}>{b}</text><text x="245" y={y+31} textAnchor="end" fontSize="9" fontWeight="900" fill={C.ink}>{c}</text></g>})}<text x="150" y="383" textAnchor="middle" fontSize="8.2" fontWeight="800" fill={C.ink}>정답 확인 뒤 shape별로 고릅니다</text></svg>;
}

export function AutotuneViz(){return <StepViz steps={AUTOTUNE}>{step=><><AutotuneMobile step={step}/><AutotuneDesktop step={step}/></>}</StepViz>}
