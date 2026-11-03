import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    tabLabel: "Launch · 4,096 blocks",
    label: "CPU가 N=1,048,576인 SAXPY kernel을 launch한다",
    body: "Block당 256 threads로 잡으면 1,048,576÷256=4,096 blocks입니다. Grid와 block은 아직 물리 core 번호가 아니라 처리할 index를 나눈 작업표입니다.",
  },
  {
    tabLabel: "Place · 1 block",
    label: "Hardware가 block 하나를 가용 SM에 배치한다",
    body: "Block은 실행을 마칠 때까지 그 SM의 registers와 shared-memory 자원을 사용합니다. 256 threads는 연속한 32개씩 8 warps로 나뉩니다.",
  },
  {
    tabLabel: "Load · warp 0",
    label: "Warp 0의 32 lanes가 x[0:31]과 기존 y[0:31]을 읽는다",
    body: "float 두 배열을 모두 HBM에서 읽는 단순 장부라면 32×4×2=256 bytes입니다. 실제 HBM traffic은 L1·L2 hit와 transaction 상태에 따라 달라집니다.",
  },
  {
    tabLabel: "FMA · 64 FLOP",
    label: "각 lane이 register에서 y=a×x+y를 계산한다",
    body: "32 elements에 multiply와 add가 하나씩 있으므로 64 FLOP입니다. Load 결과가 늦으면 이 warp는 기다리고 scheduler는 같은 partition의 다른 eligible warp를 고릅니다.",
  },
  {
    tabLabel: "Store · 128 B",
    label: "32개 결과를 저장하고 다음 warp가 같은 경로를 반복한다",
    body: "Store는 32×4=128 bytes입니다. 이 경계의 단순 HBM 장부는 64 FLOP÷(256+128) bytes=1/6 FLOP/B이며, a의 traffic과 cache·write 정책은 별도로 기록합니다.",
  },
] as const;

const reached = (step: number, index: number) => step >= index;

function MobileTrace({ step }: { step: number }) {
  const rows = [
    ["CPU launch", "N=1,048,576 · 4,096 blocks"],
    ["SM placement", "256 threads · 8 warps"],
    ["Warp 0 load", "x+y · 256 B"],
    ["Register FMA", "32 lanes · 64 FLOP"],
    ["Warp 0 store", "y · 128 B"],
  ] as const;
  return <svg className="!block sm:!hidden" viewBox="0 0 340 410" role="img" aria-label="SAXPY 한 warp가 CPU launch부터 load FMA store까지 실행되는 다섯 단계">
    {rows.slice(0,-1).map((_,i)=><g key={i}><line x1="170" y1={70+i*77} x2="170" y2={87+i*77} stroke={reached(step,i+1)?"var(--primary)":"var(--border)"} strokeWidth="1.2"/><polygon points={`166,83 ${174},83 170,89`} fill={reached(step,i+1)?"var(--primary)":"var(--muted-foreground)"}/></g>)}
    {rows.map(([title,detail],i)=><g key={title} opacity={step<i?0.48:1}>
      <rect x="20" y={12+i*77} width="300" height="58" rx="12" fill={step===i?"var(--accent)":"var(--card)"} stroke={step===i?"var(--primary)":"var(--border)"} strokeWidth="1.2"/>
      <circle cx="45" cy={41+i*77} r="13" fill={reached(step,i)?"var(--primary)":"var(--muted)"}/>
      <text x="45" y={45+i*77} textAnchor="middle" fontSize="10" fontWeight="800" fill={reached(step,i)?"var(--primary-foreground)":"var(--muted-foreground)"}>{i+1}</text>
      <text x="69" y={35+i*77} fontSize="12" fontWeight="800" fill="var(--foreground)">{title}</text>
      <text x="69" y={53+i*77} fontSize="10" fill="var(--muted-foreground)">{detail}</text>
    </g>)}
  </svg>;
}

function DesktopTrace({ step }: { step: number }) {
  const nodes = [
    ["CPU", "launch", "4,096 blocks"],
    ["SM", "place block", "8 warps"],
    ["Warp 0", "load x+y", "256 B"],
    ["Registers", "32 FMA", "64 FLOP"],
    ["Memory", "store y", "128 B"],
  ] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 820 286" role="img" aria-label="SAXPY 한 warp가 CPU launch부터 load FMA store까지 실행되는 다섯 단계">
    <rect x="15" y="30" width="143" height="194" rx="17" fill="var(--muted)" stroke="var(--border)" opacity="0.55"/>
    <text x="86" y="54" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--muted-foreground)">HOST</text>
    <rect x="174" y="30" width="631" height="194" rx="17" fill="var(--muted)" stroke="var(--border)" opacity="0.55"/>
    <text x="489" y="54" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--muted-foreground)">GPU · 한 warp의 실행 경로</text>
    {nodes.slice(0,-1).map((_,i)=><g key={i}><line x1={149+i*159} y1="130" x2={171+i*159} y2="130" stroke={reached(step,i+1)?"var(--primary)":"var(--border)"} strokeWidth="1.2"/><polygon points={`${167+i*159},126 ${175+i*159},130 ${167+i*159},134`} fill={reached(step,i+1)?"var(--primary)":"var(--muted-foreground)"}/></g>)}
    {nodes.map(([title,action,value],i)=>{
      const x=25+i*159;
      return <g key={title} opacity={step<i?0.45:1}>
        <rect x={x} y="76" width="124" height="108" rx="14" fill={step===i?"var(--accent)":"var(--card)"} stroke={step===i?"var(--primary)":"var(--border)"} strokeWidth="1.2"/>
        {i===2&&[0,1,2,3,4,5,6,7].map(l=><circle key={l} cx={x+28+l*10} cy="101" r="3.2" fill="var(--primary)"/>)}
        {i===3&&<text x={x+62} y="105" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--primary)">a×x+y</text>}
        {i!==2&&i!==3&&<rect x={x+36} y="92" width="52" height="18" rx="4" fill="var(--accent)"/>}
        <text x={x+62} y="133" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--foreground)">{title}</text>
        <text x={x+62} y="151" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">{action}</text>
        <text x={x+62} y="169" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--foreground)">{value}</text>
        <circle cx={x+111} cy="88" r="10" fill={reached(step,i)?"var(--primary)":"var(--muted)"}/>
        <text x={x+111} y="92" textAnchor="middle" fontSize="10" fontWeight="800" fill={reached(step,i)?"var(--primary-foreground)":"var(--muted-foreground)"}>{i+1}</text>
      </g>;
    })}
    <rect x="238" y="233" width="344" height="38" rx="10" fill="var(--background)" stroke="var(--border)"/>
    <text x="410" y="256" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--foreground)">64 FLOP ÷ 384 B = 1/6 FLOP/B · cache miss 단순 장부</text>
  </svg>;
}

export default function ContextViz() {
  return <StepViz steps={STEPS}>{step=><><MobileTrace step={step}/><DesktopTrace step={step}/></>}</StepViz>;
}
