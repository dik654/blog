import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "8노드는 28개 물리 edge로 직접 연결됩니다", body: "노드마다 다른 일곱 노드로 가는 OSFP 포트 7개를 씁니다. 남은 한 포트는 별도 연결 없이는 우회로가 아닙니다." },
  { label: "노드 7의 케이블 하나가 노드 3 대신 노드 6으로 갔습니다", body: "세 포트 모두 UP일 수 있어도 topology manifest의 상대와 다르면 실패입니다." },
  { label: "물리 800G 케이블 하나가 두 400G 논리 링크로 갈라집니다", body: "케이블 수 1과 논리 링크 수 2를 구별해야 주소·처리량·장애 범위를 정확히 셉니다." },
  { label: "각 논리 링크는 고유한 /30·GID·HCA로 이어집니다", body: "노드 3↔7은 10.137.1.0/30과 10.137.2.0/30입니다. 상대 subnet과 같은 GID를 고릅니다." },
  { label: "2→4→8노드와 링크 손실을 통과해야 채택합니다", body: "Switchless는 공식 switched fabric의 대체 보장이 아닙니다. 작고 정적인 실험망에서 자체 acceptance로 범위를 제한합니다." },
] as const;

const C = { ink: "#334155", blue: "#2563eb", teal: "#0f766e", amber: "#d97706", red: "#dc2626", muted: "#64748b", line: "#cbd5e1" };

function Node({ x, y, n, active = false, bad = false }: { x: number; y: number; n: number; active?: boolean; bad?: boolean }) {
  const color = bad ? C.red : active ? C.blue : C.muted;
  return <g><circle cx={x} cy={y} r="18" fill={`${color}12`} stroke={color} strokeWidth={active || bad ? 1.25 : 1} /><text x={x} y={y + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={color}>N{n}</text></g>;
}

function DesktopScene({ step }: { step: number }) {
  if (step <= 1) {
    const nodes = [[350,38],[488,82],[548,174],[452,242],[248,242],[152,174],[212,82],[350,174]] as const;
    return <svg className="!hidden sm:!block" viewBox="0 0 700 280" role="img" aria-label="8노드 switchless 완전연결망과 오배선 사례">
      <text x="34" y="25" fontSize="9.5" fontWeight="700" fill={C.muted}>{step === 0 ? "균일 full mesh · 28 physical cables" : "link-up은 맞지만 peer가 틀린 사건"}</text>
      {step === 0 && nodes.slice(0,7).map(([x1,y1], i) => nodes.slice(i + 1,7).map(([x2,y2], j) => <line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} strokeWidth="0.7" />))}
      {step === 0 && nodes.slice(0,7).map(([x,y], i) => <line key={`c-${i}`} x1={x} y1={y} x2="350" y2="174" stroke={C.line} strokeWidth="0.7" />)}
      {step === 1 && <>
        <line x1="212" y1="82" x2="350" y2="174" stroke={C.line} strokeWidth="1" strokeDasharray="4 4" />
        <text x="240" y="121" fontSize="8.8" fill={C.muted}>설계: N3↔N7</text>
        <line x1="152" y1="174" x2="350" y2="174" stroke={C.red} strokeWidth="1.25" />
        <circle cx="170" cy="174" r="3" fill={C.red} /><circle cx="332" cy="174" r="3" fill={C.red} />
        <text x="250" y="164" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.red}>실제: N6↔N7</text>
      </>}
      {nodes.map(([x,y], i) => <Node key={i} x={x} y={y} n={i + 1} active={step === 1 && (i === 2 || i === 6)} bad={step === 1 && i === 5} />)}
      <rect x="565" y="60" width="110" height="126" rx="10" fill="#f8fafc" stroke={C.line} />
      <text x="620" y="84" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.ink}>{step === 0 ? "수량 장부" : "판정 장부"}</text>
      <text x="579" y="109" fontSize="8.8" fill={C.muted}>{step === 0 ? "노드 8" : "LED: UP"}</text>
      <text x="579" y="130" fontSize="8.8" fill={C.muted}>{step === 0 ? "edge 28" : "예정 peer: N3"}</text>
      <text x="579" y="151" fontSize="8.8" fill={step === 1 ? C.red : C.muted}>{step === 0 ? "port/node 7" : "관측 peer: N6"}</text>
      <text x="579" y="172" fontSize="8.8" fontWeight="700" fill={step === 1 ? C.red : C.blue}>{step === 0 ? "여유 port 1" : "FAIL"}</text>
    </svg>;
  }
  if (step === 2) return <svg className="!hidden sm:!block" viewBox="0 0 700 280" role="img" aria-label="800G 물리 케이블과 두 400G 논리 링크">
    <Node x={90} y={138} n={3} active /><Node x={610} y={138} n={7} active />
    <rect x="144" y="82" width="412" height="112" rx="14" fill="#f8fafc" stroke={C.amber} />
    <text x="350" y="105" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.amber}>물리 OSFP cable 1개 · nominal 800Gb/s</text>
    <rect x="166" y="127.5" width="368" height="5" rx="2.5" fill={C.blue} /><circle cx="166" cy="130" r="3" fill={C.blue} /><circle cx="534" cy="130" r="3" fill={C.blue} />
    <rect x="166" y="157.5" width="368" height="5" rx="2.5" fill={C.teal} /><circle cx="166" cy="160" r="3" fill={C.teal} /><circle cx="534" cy="160" r="3" fill={C.teal} />
    <text x="350" y="126" textAnchor="middle" fontSize="8.8" fontWeight="700" fill="white">logical link 1 · 400GbE</text>
    <text x="350" y="156" textAnchor="middle" fontSize="8.8" fontWeight="700" fill="white">logical link 2 · 400GbE</text>
    <text x="350" y="230" textAnchor="middle" fontSize="9" fill={C.muted}>장애 단위는 물리 cable이고, 주소·GID 선택 단위는 논리 link입니다</text>
  </svg>;
  if (step === 3) return <svg className="!hidden sm:!block" viewBox="0 0 700 280" role="img" aria-label="논리 링크에서 GID HCA collective로 이어지는 경로">
    {[[34,56,132,"OSFP 3","physical"],[184,56,132,"PF .0 / .1","logical"],[334,56,150,"10.137.1/30\n10.137.2/30","address"],[502,56,164,"matched GID + HCA","transport"]].map(([x,y,w,label,sub],i)=><g key={String(label)}><rect x={Number(x)} y={Number(y)} width={Number(w)} height="70" rx="10" fill={i===3?`${C.teal}12`:"#f8fafc"} stroke={i===3?C.teal:C.line}/><text x={Number(x)+Number(w)/2} y="83" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={i===3?C.teal:C.ink}>{String(label).split("\n").map((t,j)=><tspan key={t} x={Number(x)+Number(w)/2} dy={j?14:0}>{t}</tspan>)}</text><text x={Number(x)+Number(w)/2} y="112" textAnchor="middle" fontSize="8.8" fill={C.muted}>{String(sub)}</text>{i<3&&<><line x1={Number(x)+Number(w)+5} y1="91" x2={Number(x)+Number(w)+17} y2="91" stroke={C.blue}/><circle cx={Number(x)+Number(w)+17} cy="91" r="2.3" fill={C.blue}/></>}</g>)}
    <rect x="104" y="174" width="492" height="60" rx="12" fill={`${C.blue}0d`} stroke={C.blue}/>
    <text x="350" y="198" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.blue}>N3 rank ↔ N7 rank collective path</text>
    <text x="350" y="218" textAnchor="middle" fontSize="8.8" fill={C.muted}>한 ID 사슬이 끊기면 다음 단계로 넘어가지 않습니다</text>
  </svg>;
  return <svg className="!hidden sm:!block" viewBox="0 0 700 280" role="img" aria-label="2노드에서 8노드까지 acceptance 확대">
    {[{x:44,w:168,n:"2 nodes",d:"pair·GID·HCA"},{x:266,w:168,n:"4 nodes",d:"여러 pair·rail"},{x:488,w:168,n:"8 nodes",d:"28 edge·56 path"}].map((s,i)=><g key={s.n}><rect x={s.x} y="72" width={s.w} height="90" rx="12" fill={i===2?`${C.teal}12`:"#f8fafc"} stroke={i===2?C.teal:C.line}/><text x={s.x+s.w/2} y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill={i===2?C.teal:C.ink}>{s.n}</text><text x={s.x+s.w/2} y="132" textAnchor="middle" fontSize="9" fill={C.muted}>{s.d}</text>{i<2&&<><line x1={s.x+s.w+8} y1="117" x2={s.x+s.w+36} y2="117" stroke={C.blue}/><circle cx={s.x+s.w+36} cy="117" r="2.5" fill={C.blue}/></>}</g>)}
    <text x="350" y="210" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.red}>오류 1개면 확대 중단 · 고친 뒤 2노드부터 재검증</text>
    <text x="350" y="235" textAnchor="middle" fontSize="8.8" fill={C.muted}>공식 production 참조망은 switched Spectrum-X · 이 경로는 project acceptance</text>
  </svg>;
}

function MobileScene({ step }: { step: number }) {
  const boxes = step === 0 ? [["N=8", "노드 수"],["28", "물리 cable"],["7", "port/node"]] : step === 1 ? [["설계", "N7↔N3"],["관측", "N7↔N6"],["판정", "FAIL"]] : step === 2 ? [["1개", "800G 물리 cable"],["2개", "400G 논리 link"],["2개", "고유 /30"]] : step === 3 ? [["OSFP", "physical"],["/30", "address"],["GID·HCA", "transport"]] : [["2노드", "pair"],["4노드", "rail"],["8노드", "full mesh"]];
  return <svg className="block sm:!hidden" viewBox="0 0 300 360" role="img" aria-label="모바일용 switchless acceptance 흐름">
    <text x="150" y="28" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={step===1?C.red:C.muted}>{STEPS[step].label}</text>
    {boxes.map(([a,b],i)=><g key={`${a}-${i}`}><rect x="30" y={55+i*82} width="240" height="58" rx="10" fill={step===1&&i===2?`${C.red}10`:i===2?`${C.teal}10`:"#f8fafc"} stroke={step===1&&i===2?C.red:i===2?C.teal:C.line}/><text x="150" y={80+i*82} textAnchor="middle" fontSize="11" fontWeight="700" fill={step===1&&i===2?C.red:i===2?C.teal:C.ink}>{a}</text><text x="150" y={99+i*82} textAnchor="middle" fontSize="9" fill={C.muted}>{b}</text>{i<2&&<><line x1="150" y1={116+i*82} x2="150" y2={130+i*82} stroke={step===1?C.red:C.blue}/><circle cx="150" cy={130+i*82} r="2.4" fill={step===1?C.red:C.blue}/></>}</g>)}
    <text x="150" y="330" textAnchor="middle" fontSize="8.8" fill={C.muted}>{step===4?"한 단계라도 실패하면 확대하지 않음":"물리 수량과 논리 수량을 구별"}</text>
  </svg>;
}

export default function OverviewViz() {
  return <StepViz steps={STEPS}>{(step)=><><MobileScene step={step}/><DesktopScene step={step}/></>}</StepViz>;
}
