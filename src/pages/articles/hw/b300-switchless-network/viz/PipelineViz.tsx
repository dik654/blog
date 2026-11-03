import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "물리 manifest가 케이블 양끝을 고정합니다", body: "노드 3 OSFP와 노드 7 OSFP, cable serial, 각 host의 BDF를 한 edge로 기록합니다." },
  { label: "Inventory가 물리 포트를 두 논리 endpoint에 연결합니다", body: "Split 뒤의 PF·netdev·RDMA device를 현재 host에서 다시 찾아 manifest에 결합합니다." },
  { label: "두 논리 링크마다 다른 /30을 생성합니다", body: "노드 3↔7은 link 1에 10.137.1.0/30, link 2에 10.137.2.0/30을 사용합니다." },
  { label: "Remote와 같은 /30의 GID와 exact HCA를 고릅니다", body: "주소 선택과 adapter allowlist는 다른 단계입니다. 둘 다 맞아야 의도한 direct path를 씁니다." },
  { label: "Pair test 뒤 2→4→8노드 collective를 실행합니다", body: "Correctness·raw log·p95·counter를 같은 run ID로 보존하고 link-loss drill로 운영 경계를 닫습니다." },
] as const;

const colors = ["#d97706", "#2563eb", "#0f766e", "#7c3aed", "#059669"];
const rows = [
  ["physical edge", "N3 OSFP ↔ N7 OSFP", "cable serial"],
  ["logical identity", "PF .0/.1 · netdev", "mlx5 device"],
  ["L3 segments", "10.137.1.0/30", "10.137.2.0/30"],
  ["RDMA transport", "peer-matched GID", "exact HCA"],
  ["acceptance", "2 → 4 → 8 nodes", "fault drill"],
] as const;

function DesktopScene({ step }: { step: number }) {
  return <svg className="!hidden sm:!block" viewBox="0 0 700 300" role="img" aria-label="물리 케이블에서 collective까지 이어지는 검수 사슬">
    <text x="38" y="28" fontSize="9.5" fontWeight="700" fill="#64748b">같은 topology revision · 같은 node pair ID</text>
    {rows.map(([name,left,right],i)=>{
      const y=48+i*46; const active=i===step; const done=i<step; const color=colors[i];
      return <g key={name} opacity={i>step?0.38:1}>
        <rect x="38" y={y} width="624" height="34" rx="8" fill={active?`${color}14`:"#f8fafc"} stroke={active?color:"#cbd5e1"} strokeWidth={active?1.25:1}/>
        <circle cx="58" cy={y+17} r="6" fill={done||active?color:"#e2e8f0"}/>
        <text x="74" y={y+21} fontSize="9.2" fontWeight="700" fill={active?color:"#334155"}>{name}</text>
        <text x="286" y={y+21} textAnchor="middle" fontSize="8.8" fill="#475569">{left}</text>
        <text x="526" y={y+21} textAnchor="middle" fontSize="8.8" fill="#475569">{right}</text>
        {i<rows.length-1&&<><line x1="58" y1={y+36} x2="58" y2={y+44} stroke={done?colors[i+1]:"#cbd5e1"}/><circle cx="58" cy={y+44} r="2.2" fill={done?colors[i+1]:"#cbd5e1"}/></>}
      </g>;
    })}
    <text x="350" y="288" textAnchor="middle" fontSize="8.8" fill="#64748b">앞 단계가 불일치하면 뒤의 collective 숫자를 채택하지 않습니다</text>
  </svg>;
}

function MobileScene({ step }: { step: number }) {
  const [name,left,right]=rows[step]; const color=colors[step];
  return <svg className="block sm:!hidden" viewBox="0 0 300 330" role="img" aria-label="모바일용 switchless 검수 사슬">
    <rect x="28" y="28" width="244" height="54" rx="10" fill={`${color}14`} stroke={color}/>
    <text x="150" y="51" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={color}>{name}</text>
    <text x="150" y="69" textAnchor="middle" fontSize="8.8" fill="#64748b">현재 확인할 층</text>
    <line x1="150" y1="86" x2="150" y2="106" stroke={color}/><circle cx="150" cy="106" r="2.4" fill={color}/>
    <rect x="28" y="112" width="244" height="54" rx="10" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="150" y="144" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#334155">{left}</text>
    <line x1="150" y1="170" x2="150" y2="190" stroke={color}/><circle cx="150" cy="190" r="2.4" fill={color}/>
    <rect x="28" y="196" width="244" height="54" rx="10" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="150" y="228" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#334155">{right}</text>
    <text x="150" y="292" textAnchor="middle" fontSize="9" fill="#64748b">단계 {step+1}/5 · 같은 peer ID로 연결</text>
    <text x="150" y="312" textAnchor="middle" fontSize="8.6" fill="#64748b">불일치하면 여기서 중단</text>
  </svg>;
}

export default function PipelineViz() {
  return <StepViz steps={STEPS}>{(step)=><><MobileScene step={step}/><DesktopScene step={step}/></>}</StepViz>;
}
