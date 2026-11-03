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

const LOOP_STEPS = [
  { tabLabel: "찾기", label: "100ms 요청에서 60ms kernel을 먼저 찾습니다", body: "Nsight Systems timeline으로 host 준비 10ms, H2D 10ms, 제출·대기 15ms, kernel 60ms, D2H·출력 5ms를 분리합니다." },
  { tabLabel: "상한", label: "Kernel을 2배 빠르게 해도 전체는 1.43배가 상한입니다", body: "고칠 수 있는 비중 p=0.6, 구간 speedup r=2이면 새 전체 시간은 0.4+0.6/2=0.7입니다." },
  { tabLabel: "설명", label: "60ms kernel이 160GB를 옮겨 DRAM peak의 89%를 썼다는 가설을 만듭니다", body: "L2 요청 200GB와 hit 20%를 단순화하면 DRAM은 160GB입니다. 160GB÷0.06s=2.67TB/s이고 peak 3TB/s의 약 89%입니다." },
  { tabLabel: "한 변경", label: "재사용을 tile 안으로 옮기는 변경 하나만 적용합니다", body: "같은 설명용 fixture에서 L2 hit가 80%로 오르면 DRAM 이동량 근사는 40GB입니다. 다른 layout·precision 변경은 섞지 않습니다." },
  { tabLabel: "검증", label: "Profiler를 뺀 반복에서 70ms와 parity를 확인한 뒤에만 채택합니다", body: "Kernel 30ms와 나머지 40ms를 더해 end-to-end 70ms인지, median·p95와 다른 shape에서도 이득인지 확인하고 아니면 되돌립니다." },
] as const;

const LOOP_NODES = ["Locate", "Bound", "Explain", "Change", "Verify"] as const;

function LoopDesktop({ step }: { step: number }) {
  return <svg className="!hidden sm:!block" viewBox="0 0 720 300" role="img" aria-label="100ms CUDA 요청을 찾고 설명하고 변경하고 검증하는 반복 과정">
    <path d="M78 126 H642" fill="none" stroke={C.line} strokeWidth="1.25" />
    {LOOP_NODES.map((label, index) => {
      const x = 82 + index * 139;
      const active = index === step;
      const done = index < step;
      const color = [C.blue, C.amber, C.violet, C.teal, C.red][index];
      return <g key={label} opacity={index > step ? .38 : 1}>
        {index % 2 === 0
          ? <circle cx={x} cy="126" r="36" fill={active ? `${color}18` : "#f8fafc"} stroke={active || done ? color : C.line} strokeWidth={active ? 1.25 : 1} />
          : <rect x={x - 30} y="96" width="60" height="60" rx="10" transform={`rotate(45 ${x} 126)`} fill={active ? `${color}18` : "#f8fafc"} stroke={active || done ? color : C.line} strokeWidth={active ? 1.25 : 1} />}
        <text x={x} y="130" textAnchor="middle" fontSize="10" fontWeight="800" fill={active || done ? color : C.muted}>{index + 1}</text>
        <text x={x} y="184" textAnchor="middle" fontSize="10" fontWeight="800" fill={active ? color : C.ink}>{label}</text>
      </g>;
    })}
    <rect x="122" y="220" width="476" height="48" rx="10" fill={`${[C.blue,C.amber,C.violet,C.teal,C.red][step]}0d`} stroke={[C.blue,C.amber,C.violet,C.teal,C.red][step]} />
    <text x="360" y="241" textAnchor="middle" fontSize="10" fontWeight="800" fill={C.ink}>{["100ms → hot kernel 60ms", "p=.6 · r=2 → 1.43×", "160GB ÷ 60ms → 2.67TB/s", "L2 hit 20% → 80% 후보", "100ms → 70ms · parity pass"][step]}</text>
    <text x="360" y="257" textAnchor="middle" fontSize="8.8" fill={C.muted}>각 숫자는 하나의 설명용 fixture 안에서만 이어집니다</text>
  </svg>;
}

function LoopMobile({ step }: { step: number }) {
  return <svg className="block sm:!hidden" viewBox="0 0 300 390" role="img" aria-label="모바일용 CUDA 성능 분석 반복 과정">
    {LOOP_NODES.map((label, index) => {
      const y = 20 + index * 66;
      const active = index === step;
      const color = [C.blue,C.amber,C.violet,C.teal,C.red][index];
      return <g key={label} opacity={index > step ? .38 : 1}>
        <circle cx="55" cy={y + 25} r="20" fill={active ? `${color}18` : "#f8fafc"} stroke={index <= step ? color : C.line} />
        <text x="55" y={y + 29} textAnchor="middle" fontSize="9" fontWeight="800" fill={index <= step ? color : C.muted}>{index + 1}</text>
        <text x="91" y={y + 23} fontSize="10" fontWeight="800" fill={active ? color : C.ink}>{label}</text>
        <text x="91" y={y + 41} fontSize="8.6" fill={C.muted}>{["100ms에서 60ms kernel", "전체 상한 1.43×", "DRAM peak 약 89%", "재사용 변경 하나", "70ms·parity 재측정"][index]}</text>
        {index < 4 && <><line x1="55" y1={y + 47} x2="55" y2={y + 63} stroke={color} /><circle cx="55" cy={y + 63} r="2" fill={color} /></>}
      </g>;
    })}
    <rect x="34" y="352" width="232" height="28" rx="8" fill={`${[C.blue,C.amber,C.violet,C.teal,C.red][step]}0d`} stroke={[C.blue,C.amber,C.violet,C.teal,C.red][step]} />
    <text x="150" y="370" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={C.ink}>{["Locate", "Bound", "Explain", "Change", "Verify"][step]}의 증거만 다음 단계로 보냅니다</text>
  </svg>;
}

export function PerfLoopViz() {
  return <StepViz steps={LOOP_STEPS}>{step => <><LoopMobile step={step} /><LoopDesktop step={step} /></>}</StepViz>;
}

const BOUNDARY_STEPS = [
  { tabLabel: "전체 100ms", label: "End-to-end는 입력 준비부터 사용할 수 있는 출력까지 100ms입니다", body: "사용자가 기다린 critical path 전체를 CPU wall clock으로 잽니다. Copy·queue·kernel·필요한 동기화를 포함합니다." },
  { tabLabel: "제출 25μs", label: "Launch call의 25μs 반환은 kernel 완료가 아닙니다", body: "비동기 호출은 GPU가 60ms 계산을 끝내기 전에 CPU에 control을 돌려줄 수 있습니다. 제출 시간과 완료 시간을 분리합니다." },
  { tabLabel: "Kernel 60ms", label: "같은 stream의 CUDA events는 kernel 경계 60ms를 잽니다", body: "Warm-up 뒤 start event, kernel, stop event를 기록하고 stop 완료를 기다립니다. Copy와 host 준비는 이 값에 들어오지 않습니다." },
  { tabLabel: "같은 분모", label: "FLOPs와 bytes도 같은 60ms 경계로 나눕니다", body: "120GFLOPs÷0.06s와 160GB÷0.06s처럼 일과 traffic의 분모를 kernel event 시간에 맞춰야 achieved ledger가 비교 가능합니다." },
] as const;

const TIMELINE = [
  { label: "Host", ms: 10, color: C.amber },
  { label: "H2D", ms: 10, color: C.blue },
  { label: "Queue", ms: 15, color: C.amber },
  { label: "Kernel", ms: 60, color: C.violet },
  { label: "Output", ms: 5, color: C.teal },
] as const;

function BoundaryDesktop({ step }: { step: number }) {
  const scale = 6.1;
  const segments = TIMELINE.map((segment, index) => ({
    segment,
    index,
    x:
      54 +
      TIMELINE.slice(0, index).reduce(
        (elapsed, previous) => elapsed + previous.ms * scale,
        0,
      ),
    width: segment.ms * scale,
  }));
  return <svg className="!hidden sm:!block" viewBox="0 0 720 300" role="img" aria-label="100ms 요청에서 end-to-end launch kernel ledger 경계를 비교한 timeline">
    <text x="54" y="50" fontSize="9" fontWeight="800" fill={C.muted}>0ms</text><text x="664" y="50" textAnchor="end" fontSize="9" fontWeight="800" fill={C.muted}>100ms</text>
    {segments.map(({ segment, index, x, width }) => { const selected = step === 0 || (step >= 2 && index === 3) || (step === 1 && index === 2); return <g key={segment.label} opacity={selected ? 1 : .25}><rect x={x} y="88" width={width} height="66" fill={`${segment.color}18`} stroke={segment.color}/><text x={x+width/2} y="116" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.ink}>{segment.label}</text><text x={x+width/2} y="137" textAnchor="middle" fontSize="8.5" fill={C.muted}>{segment.ms}ms</text></g>; })}
    {step === 0 && <><path d="M54 175 v12 H664 v-12" fill="none" stroke={C.teal} strokeWidth="1.25"/><text x="359" y="207" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.teal}>wall clock · 100ms</text></>}
    {step === 1 && <><line x1="205" y1="72" x2="205" y2="166" stroke={C.red} strokeWidth="1.25"/><circle cx="205" cy="72" r="3" fill={C.red}/><text x="205" y="55" textAnchor="middle" fontSize="10" fontWeight="800" fill={C.red}>launch call 25μs</text><text x="359" y="207" textAnchor="middle" fontSize="9" fill={C.muted}>CPU 반환점 ≠ GPU 완료점</text></>}
    {step >= 2 && <><path d="M267.5 175 v12 H633.5 v-12" fill="none" stroke={step===2?C.violet:C.blue} strokeWidth="1.25"/><text x="450.5" y="207" textAnchor="middle" fontSize="11" fontWeight="800" fill={step===2?C.violet:C.blue}>{step===2?"CUDA event · 60ms":"120GFLOPs와 160GB의 공통 분모 · 60ms"}</text></>}
    <rect x="120" y="238" width="480" height="38" rx="9" fill="#f8fafc" stroke={C.line}/><text x="360" y="262" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.muted}>{["사용자 체감 시간을 답함", "제출 overhead만 답함", "kernel elapsed만 답함", "achieved FLOP/s·GB/s를 답함"][step]}</text>
  </svg>;
}

function BoundaryMobile({ step }: { step: number }) {
  return <svg className="block sm:!hidden" viewBox="0 0 300 390" role="img" aria-label="모바일용 CUDA 측정 경계 timeline">
    {TIMELINE.map((segment, index) => { const y=20+index*58; const selected=step===0||(step>=2&&index===3)||(step===1&&index===2); return <g key={segment.label} opacity={selected?1:.25}><rect x="48" y={y} width={204} height="42" rx="8" fill={`${segment.color}18`} stroke={segment.color}/><text x="66" y={y+18} fontSize="9.4" fontWeight="800" fill={C.ink}>{segment.label}</text><text x="232" y={y+29} textAnchor="end" fontSize="8.8" fontWeight="700" fill={C.muted}>{segment.ms}ms</text>{index<4&&<line x1="60" y1={y+45} x2="60" y2={y+55} stroke={segment.color}/>}</g>; })}
    <rect x="34" y="328" width="232" height="44" rx="9" fill={`${[C.teal,C.red,C.violet,C.blue][step]}0d`} stroke={[C.teal,C.red,C.violet,C.blue][step]}/><text x="150" y="347" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={C.ink}>{["end-to-end 100ms", "launch call 25μs ≠ 완료", "kernel event 60ms", "F와 Q도 60ms로 나눔"][step]}</text><text x="150" y="362" textAnchor="middle" fontSize="8.3" fill={C.muted}>질문마다 측정 경계가 다릅니다</text>
  </svg>;
}

export function MetricBoundaryViz() {
  return <StepViz steps={BOUNDARY_STEPS}>{step => <><BoundaryMobile step={step}/><BoundaryDesktop step={step}/></>}</StepViz>;
}

const LEDGER_STEPS = [
  { tabLabel: "L2 요청", label: "Profiler가 같은 kernel 경계에서 L2 요청 200GB를 기록했다고 둡니다", body: "이 값은 고정 fixture의 설명용 값입니다. Requested·sector·actual DRAM byte의 계층을 섞지 않습니다." },
  { tabLabel: "Hit 20%", label: "L2 hit 20%이면 단순 근사에서 80%가 DRAM으로 내려갑니다", body: "Q_DRAM≈(1−0.2)×200GB=160GB입니다. Write-back·compression·peer traffic은 생략한 첫 가설입니다." },
  { tabLabel: "DRAM 속도", label: "160GB를 60ms로 나누면 achieved DRAM bandwidth는 2.67TB/s입니다", body: "160GB÷0.06s=2.67TB/s입니다. Peak 3TB/s와 단위를 맞춘 뒤 비교합니다." },
  { tabLabel: "Peak 89%", label: "2.67TB/s는 3TB/s peak의 약 89%입니다", body: "DRAM throughput이 높다는 사실은 memory 계층이 유력한 제한이라는 뜻이지, 원인이 coalescing인지 재사용인지까지 증명하지는 않습니다." },
  { tabLabel: "지붕 비교", label: "120GFLOPs와 160GB는 intensity 0.75 FLOP/B를 만듭니다", body: "Memory roof는 0.75×3=2.25TFLOP/s이고 achieved compute는 120GFLOPs÷0.06s=2TFLOP/s입니다. Memory-roof 근처라는 가설을 얻습니다." },
] as const;

function LedgerDesktop({step}:{step:number}) {
  const rows=[["L2 request","200 GB"],["miss fraction","1−0.20 = 0.80"],["DRAM bytes","160 GB"],["elapsed","0.06 s"],["DRAM rate","2.67 TB/s"]] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 330" role="img" aria-label="L2 request hit rate DRAM bytes bandwidth roofline 계산">
    <rect x="44" y="54" width="172" height="94" rx="14" fill={`${C.blue}10`} stroke={C.blue}/><text x="130" y="88" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.blue}>L2</text><text x="130" y="116" textAnchor="middle" fontSize="10" fill={C.ink}>200GB requested</text>
    <path d="M224 101 H326" fill="none" stroke={C.amber} strokeWidth="1.25"/><circle cx="326" cy="101" r="3" fill={C.amber}/><text x="275" y="84" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.amber}>80% miss</text>
    <rect x="334" y="54" width="172" height="94" rx="14" fill={`${C.violet}10`} stroke={C.violet}/><text x="420" y="88" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.violet}>HBM</text><text x="420" y="116" textAnchor="middle" fontSize="10" fill={C.ink}>160GB actual</text>
    <path d="M514 101 H616" fill="none" stroke={C.red} strokeWidth="1.25"/><circle cx="616" cy="101" r="3" fill={C.red}/><text x="565" y="84" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.red}>÷ 60ms</text>
    <circle cx="646" cy="101" r="34" fill={`${C.red}10`} stroke={C.red}/><text x="646" y="98" textAnchor="middle" fontSize="10" fontWeight="800" fill={C.red}>89%</text><text x="646" y="114" textAnchor="middle" fontSize="8" fill={C.muted}>of peak</text>
    {rows.map(([name,value],index)=>{const x=44+index*132;const active=index<=step;return <g key={name} opacity={active?1:.3}><rect x={x} y="202" width="112" height="58" rx="9" fill={index===step?`${[C.blue,C.amber,C.violet,C.teal,C.red][index]}10`:"#f8fafc"} stroke={index===step?[C.blue,C.amber,C.violet,C.teal,C.red][index]:C.line}/><text x={x+56} y="224" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={C.ink}>{name}</text><text x={x+56} y="245" textAnchor="middle" fontSize="9" fontWeight="800" fill={index===step?[C.blue,C.amber,C.violet,C.teal,C.red][index]:C.muted}>{value}</text>{index<4&&<><line x1={x+116} y1="231" x2={x+128} y2="231" stroke={C.line}/><circle cx={x+128} cy="231" r="2" fill={C.line}/></>}</g>})}
    <text x="360" y="302" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={step===4?C.violet:C.muted}>{step===4?"I=0.75 FLOP/B · memory roof=2.25 TFLOP/s · achieved=2 TFLOP/s":"같은 kernel elapsed 경계에서 한 칸씩 계산"}</text>
  </svg>;
}

function LedgerMobile({step}:{step:number}) {
  const rows=[["L2 request","200GB"],["miss","80%"],["DRAM bytes","160GB"],["elapsed","60ms"],["rate","2.67TB/s · peak 89%"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 390" role="img" aria-label="모바일용 DRAM throughput 계산">
    {rows.map(([name,value],index)=>{const y=18+index*66;const color=[C.blue,C.amber,C.violet,C.teal,C.red][index];return <g key={name} opacity={index<=step?1:.35}><rect x="34" y={y} width="232" height="48" rx="9" fill={index===step?`${color}10`:"#f8fafc"} stroke={index===step?color:C.line}/><text x="54" y={y+20} fontSize="9.2" fontWeight="800" fill={C.ink}>{name}</text><text x="246" y={y+35} textAnchor="end" fontSize="8.7" fontWeight="800" fill={index===step?color:C.muted}>{value}</text>{index<4&&<><line x1="46" y1={y+52} x2="46" y2={y+62} stroke={color}/><circle cx="46" cy={y+62} r="2" fill={color}/></>}</g>})}
    <text x="150" y="371" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={step===4?C.violet:C.muted}>{step===4?"I=.75 · roof=2.25 · achieved=2 TFLOP/s":"설명용 고정 fixture"}</text>
  </svg>;
}

export function BottleneckLedgerViz(){return <StepViz steps={LEDGER_STEPS}>{step=><><LedgerMobile step={step}/><LedgerDesktop step={step}/></>}</StepViz>}

const TRIAGE_STEPS=[
  {tabLabel:"위치",label:"먼저 Nsight Systems에서 100ms critical path와 60ms kernel을 고릅니다",body:"어느 kernel을 볼지 불명확하면 Compute counter보다 system timeline이 먼저입니다."},
  {tabLabel:"신뢰",label:"Nsight Compute의 clock·cache·replay 조건이 비교 가능한지 먼저 확인합니다",body:"2026 Compute Triage Guide의 Decision 0입니다. 다른 조건에서 모은 두 report의 퍼센트를 곧장 비교하지 않습니다."},
  {tabLabel:"분류",label:"Grid가 충분한지 본 뒤 latency와 throughput 제한을 가릅니다",body:"Compute와 memory SOL이 모두 낮으면 issue starvation을, 한쪽이 높으면 해당 pipeline·memory mechanism을 따라갑니다."},
  {tabLabel:"상관",label:"DRAM 89%와 L2 hit 20%를 함께 읽어 재사용 부족 가설을 만듭니다",body:"Top-line throughput 하나로 원인을 확정하지 않습니다. Breakdown과 sector·source evidence가 같은 방향인지 확인합니다."},
  {tabLabel:"한 변경",label:"Tile 재사용 하나만 바꾸고 즉시 다시 profile합니다",body:"지배 병목이 바뀌면 새 branch로 돌아갑니다. Counter가 좋아져도 duration이 줄지 않으면 변경을 채택하지 않습니다."},
] as const;

function TriageDesktop({step}:{step:number}){
  const nodes=[{x:80,y:126,t:"Systems",c:C.blue},{x:220,y:126,t:"Trust?",c:C.red},{x:360,y:126,t:"Classify",c:C.amber},{x:500,y:126,t:"Correlate",c:C.violet},{x:640,y:126,t:"Change",c:C.teal}] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 300" role="img" aria-label="Nsight Systems와 Compute triage 의사결정 흐름">
    {nodes.slice(0,-1).map((node,index)=><g key={node.t}><line x1={node.x+42} y1="126" x2={nodes[index+1].x-46} y2="126" stroke={node.c} strokeWidth="1.25"/><circle cx={nodes[index+1].x-46} cy="126" r="2.5" fill={node.c}/></g>)}
    {nodes.map((node,index)=>{const active=index===step;return <g key={node.t} opacity={index>step?.35:1}>{index===1?<rect x={node.x-33} y="93" width="66" height="66" rx="8" transform={`rotate(45 ${node.x} 126)`} fill={active?`${node.c}18`:"#f8fafc"} stroke={index<=step?node.c:C.line}/>:<circle cx={node.x} cy="126" r="38" fill={active?`${node.c}18`:"#f8fafc"} stroke={index<=step?node.c:C.line}/>}<text x={node.x} y="130" textAnchor="middle" fontSize="9" fontWeight="800" fill={active?node.c:C.ink}>{node.t}</text></g>})}
    <path d="M360 168 v36 h-80" fill="none" stroke={C.line}/><circle cx="280" cy="204" r="2" fill={C.line}/><text x="266" y="208" textAnchor="end" fontSize="8.5" fill={C.muted}>both low → latency branch</text>
    <path d="M360 168 v66 h80" fill="none" stroke={C.line}/><circle cx="440" cy="234" r="2" fill={C.line}/><text x="454" y="238" fontSize="8.5" fill={C.muted}>memory high → memory branch</text>
    <rect x="154" y="260" width="412" height="28" rx="8" fill={`${nodes[step].c}0d`} stroke={nodes[step].c}/><text x="360" y="278" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={C.ink}>{["어디를 볼지 선택", "metric 신뢰성 확인", "현재 지배 branch 선택", "두 metric으로 가설 좁힘", "한 변수 뒤 duration 재검증"][step]}</text>
  </svg>;
}

function TriageMobile({step}:{step:number}){
  const rows=[["Systems","100ms → kernel 60ms"],["Trust","clock · cache · replay"],["Classify","latency vs throughput"],["Correlate","DRAM 89% + L2 hit 20%"],["Change","tile 하나 · 즉시 재측정"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 390" role="img" aria-label="모바일용 Nsight triage 흐름">{rows.map(([a,b],index)=>{const y=18+index*68,color=[C.blue,C.red,C.amber,C.violet,C.teal][index];return <g key={a} opacity={index>step?.35:1}><circle cx="54" cy={y+24} r="20" fill={index===step?`${color}18`:"#f8fafc"} stroke={index<=step?color:C.line}/><text x="54" y={y+28} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={color}>{index+1}</text><text x="91" y={y+21} fontSize="9.5" fontWeight="800" fill={index===step?color:C.ink}>{a}</text><text x="91" y={y+39} fontSize="8.5" fill={C.muted}>{b}</text>{index<4&&<><line x1="54" y1={y+46} x2="54" y2={y+64} stroke={color}/><circle cx="54" cy={y+64} r="2" fill={color}/></>}</g>})}</svg>;
}

export function ProfilerDecisionViz(){return <StepViz steps={TRIAGE_STEPS}>{step=><><TriageMobile step={step}/><TriageDesktop step={step}/></>}</StepViz>}

const RELEASE_STEPS=[
  {tabLabel:"Parity",label:"먼저 reference와 같은 답인지 tolerance로 확인합니다",body:"성능 counter가 좋아도 답이 달라지면 후보가 아닙니다. 0·1·odd·non-multiple shape를 포함합니다."},
  {tabLabel:"No profiler",label:"Profiler를 제거한 동일 반복에서 100ms가 70ms로 줄었는지 잽니다",body:"Nsight Compute의 replay·clock·cache·serialization 효과를 release 숫자에 섞지 않습니다."},
  {tabLabel:"Distribution",label:"Median뿐 아니라 p95와 원본 분포를 함께 비교합니다",body:"설명용 receipt는 baseline 100/120ms, candidate 70/84ms처럼 중앙값과 꼬리가 함께 줄어야 통과합니다."},
  {tabLabel:"Slices",label:"대표 shape·동시성에서 통과하고 회귀 slice에 rollback을 둡니다",body:"한 GPU와 한 input의 승리를 일반화하지 않습니다. 다른 architecture에서는 지배 병목부터 다시 확인합니다."},
] as const;

function ReleaseDesktop({step}:{step:number}){const nodes=[["parity","same answer",C.blue],["no profiler","100 → 70ms",C.teal],["distribution","p95 120 → 84ms",C.amber],["slices","release · rollback",C.violet]] as const;return <svg className="!hidden sm:!block" viewBox="0 0 720 280" role="img" aria-label="CUDA 성능 후보의 배포 관문">{nodes.map(([a,b,color],i)=>{const x=42+i*168;return <g key={a} opacity={i>step?.35:1}><circle cx={x+64} cy="112" r="48" fill={i===step?`${color}14`:"#f8fafc"} stroke={i<=step?color:C.line}/><text x={x+64} y="105" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={i===step?color:C.ink}>{a}</text><text x={x+64} y="126" textAnchor="middle" fontSize="8.5" fill={C.muted}>{b}</text>{i<3&&<><line x1={x+116} y1="112" x2={x+162} y2="112" stroke={color}/><circle cx={x+162} cy="112" r="2.5" fill={color}/></>}</g>})}<path d="M106 188 H610" stroke={C.line}/><text x="358" y="218" textAnchor="middle" fontSize="10" fontWeight="800" fill={step===3?C.violet:C.muted}>{step===3?"fixture 범위 안에서만 release":"앞 관문 실패 → stop"}</text></svg>}
function ReleaseMobile({step}:{step:number}){const rows=[["parity","same answer"],["no profiler","100 → 70ms"],["distribution","p95 120 → 84ms"],["slices","release · rollback"]] as const;return <svg className="block sm:!hidden" viewBox="0 0 300 340" role="img" aria-label="모바일용 CUDA 성능 배포 관문">{rows.map(([a,b],i)=>{const y=18+i*72,color=[C.blue,C.teal,C.amber,C.violet][i];return <g key={a} opacity={i>step?.35:1}><circle cx="56" cy={y+25} r="21" fill={i===step?`${color}14`:"#f8fafc"} stroke={i<=step?color:C.line}/><text x="56" y={y+29} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={color}>{i+1}</text><text x="94" y={y+21} fontSize="9.4" fontWeight="800" fill={i===step?color:C.ink}>{a}</text><text x="94" y={y+40} fontSize="8.6" fill={C.muted}>{b}</text>{i<3&&<><line x1="56" y1={y+48} x2="56" y2={y+68} stroke={color}/><circle cx="56" cy={y+68} r="2" fill={color}/></>}</g>})}<text x="150" y="324" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={step===3?C.violet:C.muted}>{step===3?"slice-scoped release":"fail → stop"}</text></svg>}
export function PerfReleaseViz(){return <StepViz steps={RELEASE_STEPS}>{step=><><ReleaseMobile step={step}/><ReleaseDesktop step={step}/></>}</StepViz>}
