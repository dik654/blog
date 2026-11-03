import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "완전연결망의 node pair 수부터 셉니다", body: "8개 중 두 개를 고르는 조합은 8×7÷2=28입니다. 이것이 물리 edge의 출발점입니다." },
  { label: "Pair당 케이블 수를 곱해 전체 케이블을 구합니다", body: "8노드에서는 pair당 한 개이므로 1×28=28개입니다." },
  { label: "한 노드가 쓰는 포트 수가 8 이하인지 확인합니다", body: "각 노드는 다른 7개 노드와 연결되어 1×(8−1)=7개 포트를 씁니다." },
  { label: "규모가 바뀌면 pair당 대역폭도 다시 계산합니다", body: "2노드 fixture는 pair당 8개, 4노드는 2개, 8노드는 1개입니다. 같은 측정값을 옮겨 적지 않습니다." },
] as const;

const C = { blue: "#2563eb", teal: "#0f766e", amber: "#d97706", red: "#dc2626", ink: "#334155", muted: "#64748b", line: "#cbd5e1" };

function DesktopScene({ step }: { step: number }) {
  const cards = [
    ["node pair", "C(8,2)", "8×7÷2 = 28"],
    ["physical cables", "c × C(8,2)", "1×28 = 28"],
    ["ports / node", "c × (8−1)", "1×7 = 7 ≤ 8"],
  ] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 700 290" role="img" aria-label="8노드 완전연결망 케이블 포트 계산">
    {cards.map(([title,formula,result],i)=>{
      const x=34+i*222; const color=[C.blue,C.amber,C.teal][i]; const active=step===i;
      return <g key={title} opacity={step<3&&i>step?0.35:1}><rect x={x} y="48" width="188" height="116" rx="12" fill={active?`${color}14`:"#f8fafc"} stroke={active?color:C.line} strokeWidth={active?1.25:1}/><text x={x+94} y="76" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={active?color:C.ink}>{title}</text><text x={x+94} y="108" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>{formula}</text><text x={x+94} y="140" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{result}</text>{i<2&&<><line x1={x+194} y1="106" x2={x+212} y2="106" stroke={color}/><circle cx={x+212} cy="106" r="2.4" fill={color}/></>}</g>;
    })}
    <rect x="34" y="196" width="632" height="54" rx="10" fill={step===3?`${C.red}0c`:"#f8fafc"} stroke={step===3?C.red:C.line}/>
    <text x="350" y="218" textAnchor="middle" fontSize="9.8" fontWeight="700" fill={step===3?C.red:C.muted}>{step===3?"2 nodes: 8 cables/pair · 4 nodes: 2 · 8 nodes: 1":"노드당 8개 물리 OSFP가 상한"}</text>
    <text x="350" y="238" textAnchor="middle" fontSize="8.8" fill={C.muted}>{step===3?"2-node 800GB/s fixture ≠ 8-node pair bandwidth":"8노드에서 남는 한 포트는 자동 우회로가 아닙니다"}</text>
  </svg>;
}

function MobileScene({ step }: { step: number }) {
  const parts = step===0 ? [["8×7", "순서 있는 선택"],["÷2", "중복 pair 제거"],["28", "node pairs"]] : step===1 ? [["c=1", "pair당 cable"],["×28", "node pairs"],["28", "physical cables"]] : step===2 ? [["N−1", "peer 7개"],["×c=1", "peer당 cable"],["7≤8", "port budget 통과"]] : [["2 nodes", "8 / pair"],["4 nodes", "2 / pair"],["8 nodes", "1 / pair"]];
  return <svg className="block sm:!hidden" viewBox="0 0 300 340" role="img" aria-label="모바일용 full mesh 계산 과정">
    {parts.map(([a,b],i)=><g key={a}><rect x="32" y={28+i*84} width="236" height="58" rx="10" fill={i===2?`${C.teal}12`:"#f8fafc"} stroke={i===2?C.teal:C.line}/><text x="150" y={53+i*84} textAnchor="middle" fontSize="11" fontWeight="700" fill={i===2?C.teal:C.ink}>{a}</text><text x="150" y={72+i*84} textAnchor="middle" fontSize="9" fill={C.muted}>{b}</text>{i<2&&<><line x1="150" y1={90+i*84} x2="150" y2={105+i*84} stroke={C.blue}/><circle cx="150" cy={105+i*84} r="2.4" fill={C.blue}/></>}</g>)}
    <text x="150" y="310" textAnchor="middle" fontSize="8.8" fill={step===3?C.red:C.muted}>{step===3?"규모마다 fixture와 결과를 따로 측정":"여덟 번째 포트는 자동 우회가 아님"}</text>
  </svg>;
}

export default function TopologyViz() {
  return <StepViz steps={STEPS}>{(step)=><><MobileScene step={step}/><DesktopScene step={step}/></>}</StepViz>;
}
