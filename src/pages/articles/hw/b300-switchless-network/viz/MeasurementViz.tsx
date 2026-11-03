import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "2노드 fixture는 pair 사이에 물리 케이블 8개를 씁니다", body: "각 케이블을 split하면 16개 400G logical link가 됩니다. 이것은 endpoint 포화 실험입니다." },
  { label: "Nominal 합은 16×400Gb/s÷8=800GB/s입니다", body: "Bit를 byte로 바꾸기 위해 8로 나눕니다. Protocol overhead가 빠진 선속도 기준입니다." },
  { label: "787.211GB/s busbw는 nominal의 98.4%입니다", body: "nccl-tests가 collective data movement를 보정한 비교 지표입니다. Wire payload counter와 같지 않습니다." },
  { label: "8노드 full mesh에는 pair당 물리 케이블 하나뿐입니다", body: "두 logical 400G link/pair이며 8노드 전체 결과는 미측정입니다. 2노드 수치를 외삽하지 않습니다." },
] as const;

const C = { blue: "#2563eb", teal: "#0f766e", amber: "#d97706", red: "#dc2626", ink: "#334155", muted: "#64748b", line: "#cbd5e1" };

function DesktopScene({ step }: { step: number }) {
  return <svg className="!hidden sm:!block" viewBox="0 0 700 280" role="img" aria-label="2노드 처리량 fixture와 8노드 full mesh 측정 경계">
    <rect x="38" y="42" width="284" height="176" rx="14" fill={step<3?`${C.blue}0d`:"#f8fafc"} stroke={step<3?C.blue:C.line}/>
    <text x="180" y="68" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.blue}>2-node max-width fixture</text>
    <text x="180" y="94" textAnchor="middle" fontSize="9" fill={C.ink}>8 physical cables / pair</text>
    <text x="180" y="118" textAnchor="middle" fontSize="9" fill={C.ink}>16 logical links × 400Gb/s</text>
    <text x="180" y="151" textAnchor="middle" fontSize="12" fontWeight="700" fill={step===1?C.amber:C.ink}>nominal 800GB/s</text>
    <text x="180" y="180" textAnchor="middle" fontSize="12" fontWeight="700" fill={step===2?C.teal:C.ink}>busbw 787.211GB/s</text>
    <text x="180" y="201" textAnchor="middle" fontSize="8.8" fill={C.muted}>project ledger · wire payload 아님</text>
    <line x1="336" y1="130" x2="364" y2="130" stroke={C.red} strokeWidth="1.25" strokeDasharray="4 4"/><circle cx="364" cy="130" r="2.5" fill={C.red}/>
    <rect x="378" y="42" width="284" height="176" rx="14" fill={step===3?`${C.teal}0d`:"#f8fafc"} stroke={step===3?C.teal:C.line}/>
    <text x="520" y="68" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.teal}>8-node full mesh</text>
    <text x="520" y="94" textAnchor="middle" fontSize="9" fill={C.ink}>1 physical cable / pair</text>
    <text x="520" y="118" textAnchor="middle" fontSize="9" fill={C.ink}>2 logical links × 400Gb/s / pair</text>
    <text x="520" y="151" textAnchor="middle" fontSize="12" fontWeight="700" fill={step===3?C.red:C.ink}>whole-mesh result: 미측정</text>
    <text x="520" y="180" textAnchor="middle" fontSize="9" fill={C.muted}>all-reduce · all-gather · all-to-all</text>
    <text x="520" y="201" textAnchor="middle" fontSize="8.8" fill={C.muted}>각 collective를 별도 fixture로 실행</text>
    <text x="350" y="255" textAnchor="middle" fontSize="9.3" fontWeight="700" fill={C.red}>점선은 외삽 금지 경계입니다</text>
  </svg>;
}

function MobileScene({ step }: { step: number }) {
  const values = step===0 ? [["2 nodes", "fixture"],["8", "physical/pair"],["16", "logical links"]] : step===1 ? [["16×400", "Gb/s"],["÷8", "bit→byte"],["800", "GB/s nominal"]] : step===2 ? [["787.211", "busbw"],["÷800", "nominal"],["98.4%", "sanity ratio"]] : [["8 nodes", "full mesh"],["1 cable", "physical/pair"],["미측정", "whole mesh"]];
  return <svg className="block sm:!hidden" viewBox="0 0 300 340" role="img" aria-label="모바일용 측정 경계 계산">
    {values.map(([a,b],i)=><g key={a}><rect x="32" y={28+i*84} width="236" height="58" rx="10" fill={i===2?`${C.teal}10`:"#f8fafc"} stroke={i===2?C.teal:C.line}/><text x="150" y={53+i*84} textAnchor="middle" fontSize="11" fontWeight="700" fill={i===2?C.teal:C.ink}>{a}</text><text x="150" y={72+i*84} textAnchor="middle" fontSize="9" fill={C.muted}>{b}</text>{i<2&&<><line x1="150" y1={90+i*84} x2="150" y2={105+i*84} stroke={step===3?C.red:C.blue}/><circle cx="150" cy={105+i*84} r="2.4" fill={step===3?C.red:C.blue}/></>}</g>)}
    <text x="150" y="312" textAnchor="middle" fontSize="8.8" fill={step===3?C.red:C.muted}>{step===3?"2노드 결과를 8노드에 외삽 금지":"busbw와 wire payload를 구별"}</text>
  </svg>;
}

export default function MeasurementViz() {
  return <StepViz steps={STEPS}>{(step)=><><MobileScene step={step}/><DesktopScene step={step}/></>}</StepViz>;
}
