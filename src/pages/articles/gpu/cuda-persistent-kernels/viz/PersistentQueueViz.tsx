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

const LIFE_STEPS = [
  { tabLabel: "일반 실행", label: "일반 kernel은 task 묶음마다 launch하고 grid가 끝나면 사라집니다", body: "Task가 자주 도착하면 host launch와 kernel 시작 경계도 반복됩니다." },
  { tabLabel: "상주 시작", label: "Persistent kernel은 고정된 worker block grid를 한 번 launch합니다", body: "응용 프로그램은 grid 크기를 고르지만 어느 block이 어느 SM에 놓일지는 하드웨어 scheduler가 정합니다." },
  { tabLabel: "Ticket", label: "Worker는 queue ticket을 얻어 task 하나의 소유권만 가져갑니다", body: "Ticket 획득은 중복 소비를 막지만 task 성공이나 결과 공개를 뜻하지 않습니다." },
  { tabLabel: "완료", label: "Worker는 결과를 쓴 뒤 completion을 공개하고 다시 queue로 돌아갑니다", body: "Kernel lifetime과 task lifetime이 분리되므로 한 grid가 여러 task를 순서대로 처리합니다." },
  { tabLabel: "Drain", label: "입력을 닫은 뒤 queue와 in-flight가 모두 비면 worker가 종료합니다", body: "Launch를 줄인 대가로 ownership·backpressure·memory visibility·shutdown 계약을 직접 소유합니다." },
] as const;

function LifeDesktop({ step }: { step: number }) {
  const nodes = [
    { x: 72, label: "Host", sub: "task publish", c: C.blue },
    { x: 216, label: "Queue", sub: "bounded", c: C.amber },
    { x: 360, label: "Workers", sub: "4 blocks", c: C.violet },
    { x: 504, label: "Output", sub: "completion", c: C.teal },
    { x: 648, label: "Exit", sub: "all 4", c: C.red },
  ] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 310" role="img" aria-label="일반 launch와 persistent worker queue 수명 비교">
    <text x="42" y="42" fontSize="9" fontWeight="800" fill={C.muted}>일반 실행</text>
    {[0, 1, 2].map((i) => <g key={i}><rect x={118 + i * 176} y="22" width="124" height="38" rx="8" fill="#f8fafc" stroke={C.line}/><text x={180 + i * 176} y="46" textAnchor="middle" fontSize="8.7" fontWeight="700" fill={C.ink}>launch {i + 1} → exit</text></g>)}
    {nodes.slice(0, -1).map((node, i) => <g key={node.label} opacity={i < step ? 1 : .28}><line x1={node.x + 38} y1="145" x2={nodes[i + 1].x - 43} y2="145" stroke={node.c} strokeWidth="1.25"/><circle cx={nodes[i + 1].x - 43} cy="145" r="2.5" fill={node.c}/></g>)}
    {nodes.map((node, i) => <g key={node.label} opacity={i <= step ? 1 : .3}>
      <circle cx={node.x} cy="145" r="36" fill={i === step ? `${node.c}18` : "#f8fafc"} stroke={i <= step ? node.c : C.line} strokeWidth="1.25"/>
      <text x={node.x} y="141" textAnchor="middle" fontSize="9.4" fontWeight="800" fill={i === step ? node.c : C.ink}>{node.label}</text>
      <text x={node.x} y="158" textAnchor="middle" fontSize="7.8" fill={C.muted}>{node.sub}</text>
    </g>)}
    <path d="M504 188 C504 232 360 232 360 188" fill="none" stroke={step >= 3 && step < 4 ? C.teal : C.line} strokeWidth="1.25"/>
    <circle cx="360" cy="188" r="2.5" fill={step >= 3 && step < 4 ? C.teal : C.line}/>
    <text x="432" y="247" textAnchor="middle" fontSize="8.7" fontWeight="700" fill={step >= 3 && step < 4 ? C.teal : C.muted}>다음 task를 받으러 반복</text>
    <rect x="126" y="266" width="468" height="28" rx="8" fill={`${nodes[step].c}0d`} stroke={nodes[step].c}/>
    <text x="360" y="284" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={C.ink}>{["launch 경계가 task 경계", "grid는 유지", "ticket은 소유권", "completion 뒤 반복", "close → drain → exit"][step]}</text>
  </svg>;
}

function LifeMobile({ step }: { step: number }) {
  const rows = [["Host", "task publish"], ["Queue", "bounded slots"], ["Workers", "4 resident blocks"], ["Output", "completion"], ["Exit", "all workers"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 410" role="img" aria-label="모바일용 persistent worker 수명 흐름">
    {rows.map(([label, sub], i) => { const y = 16 + i * 70; const color = [C.blue, C.amber, C.violet, C.teal, C.red][i]; return <g key={label} opacity={i <= step ? 1 : .3}>
      <circle cx="58" cy={y + 25} r="21" fill={i === step ? `${color}18` : "#f8fafc"} stroke={i <= step ? color : C.line}/>
      <text x="58" y={y + 29} textAnchor="middle" fontSize="8.7" fontWeight="800" fill={color}>{i + 1}</text>
      <text x="96" y={y + 21} fontSize="9.6" fontWeight="800" fill={i === step ? color : C.ink}>{label}</text>
      <text x="96" y={y + 39} fontSize="8.5" fill={C.muted}>{sub}</text>
      {i < 4 && <><line x1="58" y1={y + 48} x2="58" y2={y + 66} stroke={color}/><circle cx="58" cy={y + 66} r="2" fill={color}/></>}
    </g>; })}
    <rect x="36" y="370" width="228" height="27" rx="8" fill={`${[C.blue, C.amber, C.violet, C.teal, C.red][step]}0d`} stroke={[C.blue, C.amber, C.violet, C.teal, C.red][step]}/>
    <text x="150" y="388" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={C.ink}>{["task마다 launch", "grid 한 번", "task 소유", "결과 공개", "안전 종료"][step]}</text>
  </svg>;
}

export function PersistentLifecycleViz() {
  return <StepViz steps={LIFE_STEPS}>{step => <><LifeMobile step={step}/><LifeDesktop step={step}/></>}</StepViz>;
}

const RESIDENCY_STEPS = [
  { tabLabel: "Register", label: "SM register 65,536개를 block당 8,192개로 나누면 register 상한은 8 blocks입니다", body: "65,536÷8,192=8입니다. 숫자는 계산 순서를 위한 가상 장치 fixture입니다." },
  { tabLabel: "Shared", label: "SM shared memory 64KiB를 block당 16KiB로 나누면 shared-memory 상한은 4 blocks입니다", body: "64÷16=4이므로 register보다 shared memory가 먼저 소진됩니다." },
  { tabLabel: "최솟값", label: "Hardware 상한 16과 두 자원 상한 8·4 중 최솟값은 SM당 4 blocks입니다", body: "어느 한 자원이라도 부족하면 다음 block을 resident하게 만들 수 없습니다." },
  { tabLabel: "전체 상한", label: "설명용 4-SM 장치의 동시 resident 상한은 4×4=16 blocks입니다", body: "이 값은 배치 가능한 상한이지 선택해야 할 worker 수가 아닙니다." },
  { tabLabel: "의도적 4개", label: "이 사례는 다른 work의 여지를 위해 persistent grid를 4 blocks로 제한합니다", body: "응용 프로그램은 grid 크기만 정합니다. 실제 block→SM 배치와 순서는 하드웨어가 정하므로 특정 mapping에 의존하면 안 됩니다." },
] as const;

function ResidencyDesktop({ step }: { step: number }) {
  const cards = [["Register", "65,536 ÷ 8,192", "8"], ["Shared", "64KiB ÷ 16KiB", "4"], ["Hardware", "blocks / SM", "16"]] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 320" role="img" aria-label="register shared memory hardware 상한에서 persistent block 수 계산">
    {cards.map(([name, calc, value], i) => { const x = 54 + i * 210; const active = i <= Math.min(step, 2); const color = [C.blue, C.amber, C.violet][i]; return <g key={name} opacity={active ? 1 : .3}>
      <rect x={x} y="48" width="176" height="92" rx="12" fill={i === step ? `${color}16` : "#f8fafc"} stroke={active ? color : C.line}/>
      <text x={x + 88} y="74" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={color}>{name}</text>
      <text x={x + 88} y="98" textAnchor="middle" fontSize="8.6" fill={C.muted}>{calc}</text>
      <text x={x + 88} y="125" textAnchor="middle" fontSize="16" fontWeight="900" fill={C.ink}>{value}</text>
    </g>; })}
    <line x1="143" y1="157" x2="143" y2="188" stroke={C.blue}/><circle cx="143" cy="188" r="2.5" fill={C.blue}/>
    <line x1="353" y1="157" x2="353" y2="188" stroke={C.amber}/><circle cx="353" cy="188" r="2.5" fill={C.amber}/>
    <line x1="563" y1="157" x2="563" y2="188" stroke={C.violet}/><circle cx="563" cy="188" r="2.5" fill={C.violet}/>
    <rect x="224" y="196" width="272" height="50" rx="10" fill={step >= 2 ? `${C.teal}12` : "#f8fafc"} stroke={step >= 2 ? C.teal : C.line}/>
    <text x="360" y="217" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.ink}>min(8, 4, 16) = 4 blocks / SM</text>
    <text x="360" y="235" textAnchor="middle" fontSize="8.5" fill={C.muted}>{step >= 3 ? "4 SM × 4 = resident upper bound 16" : "가장 먼저 소진되는 자원이 상한"}</text>
    <rect x="210" y="270" width="300" height="30" rx="8" fill={step === 4 ? `${C.red}10` : "#f8fafc"} stroke={step === 4 ? C.red : C.line}/>
    <text x="360" y="289" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={step === 4 ? C.red : C.muted}>{step === 4 ? "launch 4 blocks · 특정 SM mapping은 가정하지 않음" : "상한 16 ≠ 선택 16"}</text>
  </svg>;
}

function ResidencyMobile({ step }: { step: number }) {
  const rows = [["Register", "65,536÷8,192", "8"], ["Shared", "64÷16KiB", "4"], ["Hardware", "SM당 상한", "16"], ["Minimum", "min(8,4,16)", "4 / SM"], ["Choice", "4 SM 장치", "grid 4"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 410" role="img" aria-label="모바일용 persistent worker residency 계산">
    {rows.map(([name, calc, value], i) => { const y = 14 + i * 72; const color = [C.blue, C.amber, C.violet, C.teal, C.red][i]; return <g key={name} opacity={i <= step ? 1 : .3}>
      <rect x="34" y={y} width="232" height="52" rx="9" fill={i === step ? `${color}12` : "#f8fafc"} stroke={i <= step ? color : C.line}/>
      <text x="52" y={y + 20} fontSize="9" fontWeight="800" fill={color}>{name}</text>
      <text x="52" y={y + 39} fontSize="8.2" fill={C.muted}>{calc}</text>
      <text x="246" y={y + 33} textAnchor="end" fontSize="10" fontWeight="900" fill={C.ink}>{value}</text>
      {i < 4 && <><line x1="48" y1={y + 55} x2="48" y2={y + 68} stroke={color}/><circle cx="48" cy={y + 68} r="2" fill={color}/></>}
    </g>; })}
    <text x="150" y="393" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={step === 4 ? C.red : C.muted}>{step === 4 ? "상한 16에서 4만 선택" : "fixture 값 · 실제 target은 occupancy API로 확인"}</text>
  </svg>;
}

export function ResidencyBudgetViz() {
  return <StepViz steps={RESIDENCY_STEPS}>{step => <><ResidencyMobile step={step}/><ResidencyDesktop step={step}/></>}</StepViz>;
}

const QUEUE_STEPS = [
  { tabLabel: "도착 300", label: "평균 도착률은 초당 300 tasks라고 둡니다", body: "평균 하나만으로 burst와 tail latency까지 안전하다고 말할 수는 없습니다." },
  { tabLabel: "처리 400", label: "4 workers가 각각 초당 100 tasks를 처리하면 평균 capacity는 초당 400 tasks입니다", body: "4×100=400이고 utilization은 300÷400=75%입니다." },
  { tabLabel: "Burst", label: "16-slot queue에 이미 12개가 있을 때 6개가 한꺼번에 오면 4개만 들어갑니다", body: "남은 slot은 4개이므로 나머지 2개에는 block·reject·fallback 중 미리 정한 정책을 적용합니다." },
  { tabLabel: "꼬리 확인", label: "평균 안정 조건을 통과해도 queue depth p95·max와 reject 수를 따로 봅니다", body: "λ<Cμ는 장기 평균의 필요 조건일 뿐 burst, task-size 분포, contention 변화까지 보장하지 않습니다." },
] as const;

function QueueDesktop({ step }: { step: number }) {
  return <svg className="!hidden sm:!block" viewBox="0 0 720 310" role="img" aria-label="도착률 처리율 bounded queue backpressure 계산">
    <rect x="48" y="52" width="150" height="70" rx="12" fill={`${C.blue}10`} stroke={C.blue}/><text x="123" y="79" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.blue}>Arrival</text><text x="123" y="104" textAnchor="middle" fontSize="14" fontWeight="900" fill={C.ink}>λ = 300/s</text>
    <line x1="208" y1="87" x2="262" y2="87" stroke={C.blue} strokeWidth="1.25"/><circle cx="262" cy="87" r="2.5" fill={C.blue}/>
    <rect x="270" y="40" width="180" height="94" rx="12" fill={step >= 1 ? `${C.violet}10` : "#f8fafc"} stroke={step >= 1 ? C.violet : C.line}/><text x="360" y="70" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.violet}>Workers</text><text x="360" y="96" textAnchor="middle" fontSize="12" fontWeight="900" fill={C.ink}>4 × 100/s = 400/s</text><text x="360" y="117" textAnchor="middle" fontSize="8.5" fill={C.muted}>utilization 300÷400 = 75%</text>
    <line x1="458" y1="87" x2="512" y2="87" stroke={C.violet} strokeWidth="1.25"/><circle cx="512" cy="87" r="2.5" fill={C.violet}/>
    <rect x="520" y="52" width="150" height="70" rx="12" fill={`${C.teal}10`} stroke={C.teal}/><text x="595" y="79" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.teal}>Capacity headroom</text><text x="595" y="104" textAnchor="middle" fontSize="14" fontWeight="900" fill={C.ink}>100/s</text>
    <text x="54" y="174" fontSize="9" fontWeight="800" fill={C.muted}>Bounded queue · 16 slots</text>
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={54 + i * 38} y="190" width="30" height="34" rx="5" fill={i < 12 ? `${C.amber}20` : step >= 2 ? `${C.red}12` : "#f8fafc"} stroke={i < 12 ? C.amber : i < 16 && step >= 2 ? C.red : C.line}/>) }
    {step >= 2 && <><path d="M510 250 H642" fill="none" stroke={C.red} strokeWidth="1.25"/><circle cx="642" cy="250" r="2.5" fill={C.red}/><text x="576" y="242" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={C.red}>burst 6: admit 4 · overflow 2</text></>}
    <rect x="174" y="270" width="372" height="27" rx="8" fill={step === 3 ? `${C.red}0d` : "#f8fafc"} stroke={step === 3 ? C.red : C.line}/><text x="360" y="288" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={C.ink}>{["λ = 300/s", "Cμ = 400/s", "capacity 16 · overflow policy", "p95 · max · reject까지 측정"][step]}</text>
  </svg>;
}

function QueueMobile({ step }: { step: number }) {
  const rows = [["Arrival", "300 tasks/s"], ["Capacity", "4×100 = 400/s"], ["Utilization", "300÷400 = 75%"], ["Burst", "12+6 → admit 4, overflow 2"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 370" role="img" aria-label="모바일용 bounded queue 처리율과 burst 계산">
    {rows.map(([a, b], i) => { const y = 16 + i * 70; const color = [C.blue, C.violet, C.teal, C.red][i]; return <g key={a} opacity={i <= step ? 1 : .3}><rect x="34" y={y} width="232" height="50" rx="9" fill={i === step ? `${color}12` : "#f8fafc"} stroke={i <= step ? color : C.line}/><text x="52" y={y + 20} fontSize="9.2" fontWeight="800" fill={color}>{a}</text><text x="246" y={y + 34} textAnchor="end" fontSize="9" fontWeight="800" fill={C.ink}>{b}</text>{i < 3 && <><line x1="48" y1={y + 53} x2="48" y2={y + 66} stroke={color}/><circle cx="48" cy={y + 66} r="2" fill={color}/></>}</g>; })}
    <rect x="36" y="314" width="228" height="39" rx="8" fill={`${[C.blue, C.violet, C.teal, C.red][step]}0d`} stroke={[C.blue, C.violet, C.teal, C.red][step]}/><text x="150" y="331" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={C.ink}>{step === 3 ? "평균 안정 ≠ burst 안전" : "설명용 4-worker fixture"}</text><text x="150" y="345" textAnchor="middle" fontSize="8" fill={C.muted}>block · reject · fallback을 미리 선택</text>
  </svg>;
}

export function QueueBackpressureViz() {
  return <StepViz steps={QUEUE_STEPS}>{step => <><QueueMobile step={step}/><QueueDesktop step={step}/></>}</StepViz>;
}

const ASSIGN_STEPS = [
  { tabLabel: "작업 8개", label: "작업 시간 [8,1,1,1,8,1,1,1]ms를 4 workers가 처리합니다", body: "두 개의 긴 task와 여섯 개의 짧은 task가 섞인 하나의 고정 fixture입니다." },
  { tabLabel: "Static 16ms", label: "Static strided 배분은 W0에 두 긴 task가 겹쳐 16ms에 끝납니다", body: "W0=16ms, W1=W2=W3=2ms입니다. 평균 busy time 5.5ms 대비 마지막 worker 비율은 16÷5.5=2.91입니다." },
  { tabLabel: "Dynamic 9ms", label: "Dynamic ticket은 먼저 빈 worker가 다음 task를 받아 makespan을 9ms로 줄입니다", body: "이 fixture의 scheduling만 추적한 값입니다. Atomic과 queue overhead는 아직 더하지 않았습니다." },
  { tabLabel: "Ticket 비용", label: "Ticket 0.05ms 가정은 1ms task의 5%, 8ms task의 0.625%입니다", body: "8 tasks면 aggregate ticket work는 0.4ms입니다. 실제 같은-address contention과 overlap은 target GPU에서 측정해야 합니다." },
  { tabLabel: "선택", label: "Chunk와 work stealing은 ticket 수를 줄이지만 다시 불균형·종료 판정 비용을 냅니다", body: "고른 일은 static, 큰 편차는 dynamic, 매우 작은 불규칙 일은 chunk·per-worker queue 후보로 두고 실제 makespan p95로 고릅니다." },
] as const;

const TASKS = [8, 1, 1, 1, 8, 1, 1, 1] as const;

function AssignmentDesktop({ step }: { step: number }) {
  const staticLoads = [16, 2, 2, 2];
  const dynamicLoads = [8, 9, 3, 2];
  const loads = step >= 2 ? dynamicLoads : staticLoads;
  const max = 16;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 350" role="img" aria-label="불규칙 task의 static dynamic chunk work stealing 배분 비교">
    <text x="44" y="36" fontSize="9" fontWeight="800" fill={C.muted}>Task durations · ms</text>
    {TASKS.map((value, i) => <g key={i}><rect x={44 + i * 78} y="50" width="62" height="42" rx="7" fill={value === 8 ? `${C.red}16` : `${C.blue}12`} stroke={value === 8 ? C.red : C.blue}/><text x={75 + i * 78} y="76" textAnchor="middle" fontSize="9" fontWeight="900" fill={value === 8 ? C.red : C.blue}>T{i} · {value}</text></g>)}
    <text x="44" y="130" fontSize="9" fontWeight="800" fill={C.muted}>{step >= 2 ? "Dynamic ticket schedule" : "Static strided schedule"}</text>
    {loads.map((value, i) => { const y = 148 + i * 39; const color = value >= 8 ? C.red : [C.blue, C.amber, C.violet, C.teal][i]; return <g key={i}><text x="44" y={y + 18} fontSize="8.8" fontWeight="800" fill={C.ink}>W{i}</text><rect x="76" y={y} width={value / max * 500} height="24" rx="5" fill={`${color}22`} stroke={color}/><text x={86 + value / max * 500} y={y + 17} fontSize="8.5" fontWeight="800" fill={color}>{value}ms</text></g>; })}
    <rect x="154" y="316" width="412" height="27" rx="8" fill={`${[C.blue, C.red, C.teal, C.amber, C.violet][step]}0d`} stroke={[C.blue, C.red, C.teal, C.amber, C.violet][step]}/>
    <text x="360" y="334" textAnchor="middle" fontSize="8.7" fontWeight="800" fill={C.ink}>{["두 긴 task가 섞임", "static max 16ms · ratio 2.91", "dynamic max 9ms", "0.05ms / 1ms = 5%", "분포와 p95로 선택"][step]}</text>
  </svg>;
}

function AssignmentMobile({ step }: { step: number }) {
  const staticRows = [["W0", "T0 8 + T4 8", "16ms"], ["W1", "T1 + T5", "2ms"], ["W2", "T2 + T6", "2ms"], ["W3", "T3 + T7", "2ms"]] as const;
  const dynamicRows = [["W0", "T0", "8ms"], ["W1", "T1 + T4", "9ms"], ["W2", "T2 + T5 + T7", "3ms"], ["W3", "T3 + T6", "2ms"]] as const;
  const rows = step >= 2 ? dynamicRows : staticRows;
  return <svg className="block sm:!hidden" viewBox="0 0 300 390" role="img" aria-label="모바일용 static dynamic task 배분">
    <text x="34" y="28" fontSize="8.8" fontWeight="800" fill={C.muted}>tasks [8,1,1,1,8,1,1,1] ms</text>
    {rows.map(([worker, tasks, total], i) => { const y = 48 + i * 61; const color = Number(total.replace("ms", "")) >= 8 ? C.red : [C.blue, C.amber, C.violet, C.teal][i]; return <g key={worker}><rect x="34" y={y} width="232" height="44" rx="8" fill={`${color}0d`} stroke={color}/><text x="50" y={y + 18} fontSize="9" fontWeight="900" fill={color}>{worker}</text><text x="86" y={y + 19} fontSize="8.3" fill={C.muted}>{tasks}</text><text x="246" y={y + 33} textAnchor="end" fontSize="9" fontWeight="900" fill={C.ink}>{total}</text></g>; })}
    <rect x="35" y="306" width="230" height="56" rx="9" fill={`${[C.blue, C.red, C.teal, C.amber, C.violet][step]}0d`} stroke={[C.blue, C.red, C.teal, C.amber, C.violet][step]}/>
    <text x="150" y="328" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={C.ink}>{step < 2 ? "Static makespan 16ms" : "Dynamic makespan 9ms"}</text>
    <text x="150" y="347" textAnchor="middle" fontSize="8.1" fill={C.muted}>{step === 3 ? "ticket 0.05ms: short task의 5%" : step === 4 ? "chunk·steal도 실제 p95로 검증" : "scheduling-only fixture"}</text>
  </svg>;
}

export function WorkAssignmentViz() {
  return <StepViz steps={ASSIGN_STEPS}>{step => <><AssignmentMobile step={step}/><AssignmentDesktop step={step}/></>}</StepViz>;
}

const SHUTDOWN_STEPS = [
  { tabLabel: "입력 닫기", label: "Producer가 closed=true를 release로 공개해 새 task 게시를 막습니다", body: "Sentinel 한 개가 아니라 모든 worker가 볼 수 있는 상태 전이를 사용합니다." },
  { tabLabel: "Queue 비우기", label: "Worker는 이미 공개된 queue slot을 acquire로 읽어 끝까지 처리합니다", body: "Descriptor를 먼저 쓰고 ready·tail을 release로 공개해야 payload가 flag보다 늦게 보이는 문제를 막습니다." },
  { tabLabel: "진행 중 0", label: "Queue가 비고 in-flight가 0이 될 때까지 완료 또는 명시적 취소를 기록합니다", body: "Dequeue 순서와 완료 순서가 다를 수 있으므로 task별 completion state를 보존합니다." },
  { tabLabel: "Workers 4/4", label: "네 worker가 모두 exit counter를 올린 뒤에야 kernel 종료를 관측합니다", body: "한 worker가 sentinel을 가져갔다고 다른 workers까지 자동으로 끝나는 것은 아닙니다." },
  { tabLabel: "Release gate", label: "Exactly-once·p95·다른 stream progress·오류 종료를 baseline과 함께 검증합니다", body: "Launch 수만 줄고 queue tail이나 shutdown hang이 생기면 persistent candidate를 채택하지 않습니다." },
] as const;

function ShutdownDesktop({ step }: { step: number }) {
  const nodes = [["CLOSE", "release", C.blue], ["QUEUE", "0 slots", C.amber], ["IN-FLIGHT", "0 tasks", C.violet], ["EXIT", "4 / 4", C.teal], ["RELEASE", "or rollback", C.red]] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 300" role="img" aria-label="persistent kernel close drain all worker exit release 흐름">
    {nodes.slice(0, -1).map((node, i) => <g key={node[0]} opacity={i < step ? 1 : .28}><line x1={144 + i * 140} y1="124" x2={184 + i * 140} y2="124" stroke={node[2]} strokeWidth="1.25"/><circle cx={184 + i * 140} cy="124" r="2.5" fill={node[2]}/></g>)}
    {nodes.map(([a, b, color], i) => { const x = 52 + i * 140; return <g key={a} opacity={i <= step ? 1 : .3}><rect x={x} y="82" width="92" height="84" rx="13" fill={i === step ? `${color}16` : "#f8fafc"} stroke={i <= step ? color : C.line}/><text x={x + 46} y="114" textAnchor="middle" fontSize="9" fontWeight="900" fill={color}>{a}</text><text x={x + 46} y="140" textAnchor="middle" fontSize="8.3" fill={C.muted}>{b}</text></g>; })}
    <path d="M98 182 v42 H518 v-42" fill="none" stroke={step >= 3 ? C.teal : C.line} strokeWidth="1.25"/><circle cx="518" cy="182" r="2.5" fill={step >= 3 ? C.teal : C.line}/><text x="308" y="244" textAnchor="middle" fontSize="8.7" fontWeight="800" fill={step >= 3 ? C.teal : C.muted}>closed ∧ queue empty ∧ in-flight 0 ∧ exits 4</text>
    <rect x="164" y="263" width="392" height="27" rx="8" fill={`${nodes[step][2]}0d`} stroke={nodes[step][2]}/><text x="360" y="281" textAnchor="middle" fontSize="8.6" fontWeight="800" fill={C.ink}>{["새 publish 금지", "기존 task drain", "결과 또는 cancel", "all-worker proof", "correctness + performance"][step]}</text>
  </svg>;
}

function ShutdownMobile({ step }: { step: number }) {
  const rows = [["Close", "release publish"], ["Queue", "drain to 0"], ["In-flight", "complete/cancel to 0"], ["Workers", "exit 4 / 4"], ["Gate", "release or rollback"]] as const;
  return <svg className="block sm:!hidden" viewBox="0 0 300 410" role="img" aria-label="모바일용 persistent kernel 종료 증명">
    {rows.map(([a, b], i) => { const y = 14 + i * 68; const color = [C.blue, C.amber, C.violet, C.teal, C.red][i]; return <g key={a} opacity={i <= step ? 1 : .3}><circle cx="54" cy={y + 24} r="20" fill={i === step ? `${color}16` : "#f8fafc"} stroke={i <= step ? color : C.line}/><text x="54" y={y + 28} textAnchor="middle" fontSize="8.5" fontWeight="900" fill={color}>{i + 1}</text><text x="91" y={y + 20} fontSize="9.3" fontWeight="800" fill={i === step ? color : C.ink}>{a}</text><text x="91" y={y + 39} fontSize="8.4" fill={C.muted}>{b}</text>{i < 4 && <><line x1="54" y1={y + 46} x2="54" y2={y + 64} stroke={color}/><circle cx="54" cy={y + 64} r="2" fill={color}/></>}</g>; })}
    <text x="150" y="388" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={step === 4 ? C.red : C.muted}>{step === 4 ? "hang·loss·starvation이면 rollback" : "sentinel 하나로는 부족"}</text>
  </svg>;
}

export function ShutdownReleaseViz() {
  return <StepViz steps={SHUTDOWN_STEPS}>{step => <><ShutdownMobile step={step}/><ShutdownDesktop step={step}/></>}</StepViz>;
}
