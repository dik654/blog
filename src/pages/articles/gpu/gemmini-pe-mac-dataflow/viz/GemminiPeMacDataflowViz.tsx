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

const STEPS = [
  {
    tabLabel: "목표 · C₀₀=42",
    label: "먼저 PE가 만들어야 할 숫자 하나를 고정합니다",
    body: "A₀₀=2, A₀₁=3, B₀₀=5, B₁₀=7, D₀₀=11이면 C₀₀=11+2×5+3×7=42입니다. OS와 WS는 이 같은 계산을 무엇을 붙잡아 두고 수행할지만 다릅니다.",
  },
  {
    tabLabel: "MAC · 11+2×5",
    label: "MacUnit은 세 입력을 받아 한 번의 곱셈-누산을 표현합니다",
    body: "첫 항에서는 in_a=2, in_b=5, in_c=11을 넣어 out_d=21을 만듭니다. 이 식은 조합 논리이고 실제 타이밍·파이프라인 경계는 PE를 둘러싼 구성까지 봐야 합니다.",
  },
  {
    tabLabel: "OS · 11→42",
    label: "Output-Stationary는 C₀₀의 부분합을 같은 레지스터에 붙잡습니다",
    body: "D₀₀=11을 미리 넣고 (2,5), (3,7)을 차례로 받아 11→21→42로 누적합니다. 계산이 끝나 propagate 선택이 바뀔 때 42가 out_c로 나갑니다.",
  },
  {
    tabLabel: "WS · weight=5",
    label: "Weight-Stationary는 B₀₀=5를 붙잡아 여러 출력 행에 재사용합니다",
    body: "행 0에서는 a=2와 들어온 부분합 11로 21을, 행 1에서는 a=4와 들어온 부분합 13으로 33을 만듭니다. out_b는 다음 PE로 가서 다른 weight 항을 계속 더합니다.",
  },
  {
    tabLabel: "경계 · c1↔c2",
    label: "propagate 비트가 바뀌는 경계에서 c1과 c2의 역할이 교대합니다",
    body: "c1이 완성된 42를 내보내는 동안 c2는 다음 출력을 누적합니다. flip은 매 사이클 역할을 바꾸라는 뜻이 아니라 prop 선택이 달라진 첫 유효 사이클을 표시합니다.",
  },
] as const;

function Arrow({ x1, y1, x2, y2, color = C.blue }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const horizontal = y1 === y2;
  const points = horizontal
    ? `${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4} ${x2},${y2}`
    : `${x2 - 4},${y2 - 8} ${x2 + 4},${y2 - 8} ${x2},${y2}`;
  return <><line x1={x1} y1={y1} x2={horizontal ? x2 - 8 : x2} y2={horizontal ? y2 : y2 - 8} stroke={color} strokeWidth="1.2"/><polygon points={points} fill={color}/></>;
}

function Box({ x, y, w, h, title, detail, color = C.line }: { x: number; y: number; w: number; h: number; title: string; detail?: string; color?: string }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="10" fill={`${color}10`} stroke={color}/><text x={x+w/2} y={y+24} textAnchor="middle" fontSize="12" fontWeight="700" fill={color===C.line?C.ink:color}>{title}</text>{detail&&<text x={x+w/2} y={y+43} textAnchor="middle" fontSize="10" fill={C.muted}>{detail}</text>}</g>;
}

function Desktop({ step }: { step: number }) {
  return <svg className="!hidden sm:!block" viewBox="0 0 700 330" role="img" aria-label="Gemmini PE에서 C00=42를 OS와 WS로 계산하는 흐름">
    {step===0&&<g>
      <text x="350" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>C = A×B + D · 한 숫자 C₀₀만 따라갑니다</text>
      <Box x={34} y={72} w={150} h={74} title="A의 0번 행" detail="[2, 3]" color={C.blue}/>
      <Box x={274} y={72} w={150} h={74} title="B의 0번 열" detail="[5, 7]" color={C.teal}/>
      <Box x={514} y={72} w={150} h={74} title="초기값 D₀₀" detail="11" color={C.amber}/>
      <Arrow x1={184} y1={109} x2={258} y2={109}/><Arrow x1={424} y1={109} x2={498} y2={109} color={C.teal}/>
      <rect x="124" y="205" width="452" height="70" rx="12" fill={`${C.violet}0d`} stroke={C.violet}/>
      <text x="350" y="232" textAnchor="middle" fontSize="15" fontWeight="700" fill={C.violet}>11 + 2×5 + 3×7 = 42</text>
      <text x="350" y="256" textAnchor="middle" fontSize="11" fill={C.muted}>OS는 42가 될 부분합을 고정 · WS는 5와 7 같은 weight를 고정</text>
    </g>}
    {step===1&&<g>
      <text x="350" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>MacUnit · out_d = in_c + in_a × in_b</text>
      <Box x={30} y={100} w={112} h={62} title="in_a" detail="2 · activation" color={C.blue}/>
      <Box x={30} y={198} w={112} h={62} title="in_b" detail="5 · weight" color={C.teal}/>
      <Box x={30} y={2} w={112} h={62} title="in_c" detail="11 · partial sum" color={C.amber}/>
      <Arrow x1={142} y1={33} x2={262} y2={116} color={C.amber}/><Arrow x1={142} y1={131} x2={262} y2={145}/><Arrow x1={142} y1={229} x2={262} y2={174} color={C.teal}/>
      <Box x={262} y={98} w={176} h={94} title="MacUnit" detail="11 + 2×5" color={C.violet}/>
      <Arrow x1={438} y1={145} x2={538} y2={145} color={C.violet}/>
      <Box x={538} y={114} w={132} h={62} title="out_d" detail="21" color={C.red}/>
      <text x="350" y="292" textAnchor="middle" fontSize="11" fill={C.muted}>같은 MacUnit 하나를 OS와 WS가 서로 다른 배선으로 공유합니다.</text>
    </g>}
    {step===2&&<g>
      <text x="350" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>OS · 하나의 C₀₀ 부분합이 PE 안에서 자랍니다</text>
      <Box x={28} y={90} w={116} h={64} title="preload D₀₀" detail="c1 = 11" color={C.amber}/>
      <Arrow x1={144} y1={122} x2={190} y2={122} color={C.amber}/>
      <Box x={190} y={90} w={132} h={64} title="cycle 1" detail="11 + 2×5 = 21" color={C.blue}/>
      <Arrow x1={322} y1={122} x2={368} y2={122}/>
      <Box x={368} y={90} w={132} h={64} title="cycle 2" detail="21 + 3×7 = 42" color={C.violet}/>
      <Arrow x1={500} y1={122} x2={546} y2={122} color={C.violet}/>
      <Box x={546} y={90} w={126} h={64} title="out_c" detail="42 · prop flip" color={C.red}/>
      <Box x={190} y={206} w={310} h={58} title="c2는 동시에 다음 output의 D를 받음" detail="한 레지스터는 compute · 다른 레지스터는 준비/propagate" color={C.teal}/>
      <text x="350" y="300" textAnchor="middle" fontSize="11" fill={C.muted}>A와 B는 흐르고, C₀₀의 부분합만 c1에 머뭅니다.</text>
    </g>}
    {step===3&&<g>
      <text x="350" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>WS · B₀₀=5가 머물고 서로 다른 출력 행이 지나갑니다</text>
      <Box x={280} y={58} w={140} h={62} title="c1 · weight" detail="B₀₀ = 5 고정" color={C.teal}/>
      <Arrow x1={350} y1={120} x2={350} y2={165} color={C.teal}/>
      <Box x={262} y={165} w={176} h={70} title="MacUnit" detail="a × 5 + incoming psum" color={C.violet}/>
      <Box x={18} y={150} w={170} h={62} title="output row 0" detail="a=2, psum=11" color={C.blue}/>
      <Arrow x1={188} y1={181} x2={252} y2={181}/>
      <Box x={18} y={240} w={170} h={62} title="output row 1" detail="a=4, psum=13" color={C.blue}/>
      <Arrow x1={188} y1={271} x2={252} y2={218}/>
      <Arrow x1={438} y1={181} x2={520} y2={181} color={C.violet}/>
      <Box x={520} y={145} w={162} h={82} title="out_b" detail="21 · 33 → 다음 PE" color={C.red}/>
      <text x="350" y="318" textAnchor="middle" fontSize="11" fill={C.muted}>여기서 b/in_c는 activation이 아니라 들어온 partial sum입니다.</text>
    </g>}
    {step===4&&<g>
      <text x="350" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>OS 경계 · prop이 0→1로 바뀐 첫 유효 사이클</text>
      <text x="168" y="76" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>prop=0 · 직전 구간</text>
      <Box x={68} y={100} w={200} h={64} title="c1 · compute" detail="C₀₀ = 42 완성" color={C.violet}/>
      <Box x={68} y={206} w={200} h={64} title="c2 · preload" detail="다음 D를 준비" color={C.teal}/>
      <Arrow x1={268} y1={132} x2={342} y2={132} color={C.red}/>
      <text x="350" y="122" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.red}>flip=1</text>
      <text x="350" y="148" textAnchor="middle" fontSize="10" fill={C.muted}>shift는 이 출력 경계에만</text>
      <text x="532" y="76" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>prop=1 · 새 구간</text>
      <Box x={432} y={100} w={200} h={64} title="c1 · propagate" detail="out_c = 42" color={C.red}/>
      <Box x={432} y={206} w={200} h={64} title="c2 · compute" detail="다음 C를 누적" color={C.blue}/>
      <text x="350" y="306" textAnchor="middle" fontSize="11" fill={C.muted}>역할은 매 사이클 교대하지 않습니다. prop 선택이 바뀔 때만 flip이 참입니다.</text>
    </g>}
  </svg>;
}

function Mobile({ step }: { step: number }) {
  const common = <text x="150" y="462" textAnchor="middle" fontSize="10" fill={C.muted}>PE 한 칸의 신호를 따라가는 그림</text>;
  return <svg className="block sm:!hidden" viewBox="0 0 300 478" role="img" aria-label="모바일용 Gemmini PE OS WS 계산 흐름">
    {step===0&&<g>
      <text x="150" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>C₀₀ 하나를 계산합니다</text>
      <Box x={30} y={58} w={240} h={62} title="A의 0번 행" detail="[2, 3]" color={C.blue}/><Arrow x1={150} y1={120} x2={150} y2={158}/>
      <Box x={30} y={158} w={240} h={62} title="B의 0번 열" detail="[5, 7]" color={C.teal}/><Arrow x1={150} y1={220} x2={150} y2={258} color={C.teal}/>
      <Box x={30} y={258} w={240} h={62} title="초기값 D₀₀" detail="11" color={C.amber}/>
      <rect x="30" y="358" width="240" height="62" rx="10" fill={`${C.violet}10`} stroke={C.violet}/><text x="150" y="386" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.violet}>11 + 2×5 + 3×7</text><text x="150" y="407" textAnchor="middle" fontSize="11" fill={C.ink}>= 42</text>
    </g>}
    {step===1&&<g>
      <text x="150" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>MacUnit 입력 세 개</text>
      <Box x={28} y={58} w={112} h={62} title="in_c" detail="11 · psum" color={C.amber}/><Box x={160} y={58} w={112} h={62} title="in_a" detail="2 · activation" color={C.blue}/>
      <Box x={94} y={158} w={112} h={62} title="in_b" detail="5 · weight" color={C.teal}/><Arrow x1={150} y1={220} x2={150} y2={270} color={C.teal}/>
      <Box x={55} y={270} w={190} h={74} title="MacUnit" detail="11 + 2×5" color={C.violet}/><Arrow x1={150} y1={344} x2={150} y2={382} color={C.violet}/><Box x={94} y={382} w={112} h={62} title="out_d" detail="21" color={C.red}/>
    </g>}
    {step===2&&<g>
      <text x="150" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>OS · C₀₀ 부분합을 고정</text>
      <Box x={30} y={58} w={240} h={62} title="preload" detail="c1 = D₀₀ = 11" color={C.amber}/><Arrow x1={150} y1={120} x2={150} y2={150} color={C.amber}/>
      <Box x={30} y={150} w={240} h={62} title="cycle 1" detail="11 + 2×5 = 21" color={C.blue}/><Arrow x1={150} y1={212} x2={150} y2={242}/>
      <Box x={30} y={242} w={240} h={62} title="cycle 2" detail="21 + 3×7 = 42" color={C.violet}/><Arrow x1={150} y1={304} x2={150} y2={334} color={C.violet}/>
      <Box x={30} y={334} w={240} h={62} title="prop 선택 변경" detail="out_c = 42" color={C.red}/><text x="150" y="430" textAnchor="middle" fontSize="10" fill={C.teal}>c2는 그동안 다음 D를 준비</text>
    </g>}
    {step===3&&<g>
      <text x="150" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>WS · weight 5를 고정</text>
      <Box x={60} y={58} w={180} h={62} title="c1 = B₀₀" detail="weight 5" color={C.teal}/><Arrow x1={150} y1={120} x2={150} y2={158} color={C.teal}/>
      <Box x={40} y={158} w={220} h={74} title="row 0" detail="a=2, psum=11 → 21" color={C.blue}/><Arrow x1={150} y1={232} x2={150} y2={270}/>
      <Box x={40} y={270} w={220} h={74} title="row 1" detail="a=4, psum=13 → 33" color={C.blue}/><Arrow x1={150} y1={344} x2={150} y2={382} color={C.violet}/><Box x={60} y={382} w={180} h={62} title="out_b" detail="다음 PE로 계속" color={C.red}/>
    </g>}
    {step===4&&<g>
      <text x="150" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>prop 0→1 · 경계 한 번</text>
      <Box x={30} y={58} w={240} h={62} title="직전 · c1 compute" detail="C₀₀ = 42" color={C.violet}/><Arrow x1={150} y1={120} x2={150} y2={158} color={C.red}/>
      <Box x={30} y={158} w={240} h={62} title="flip = 1" detail="shift를 이 출력에 적용" color={C.red}/><Arrow x1={150} y1={220} x2={150} y2={258} color={C.red}/>
      <Box x={30} y={258} w={240} h={62} title="c1 propagate" detail="out_c = 42" color={C.red}/><Arrow x1={150} y1={320} x2={150} y2={358} color={C.teal}/>
      <Box x={30} y={358} w={240} h={62} title="c2 compute" detail="다음 C 누적 시작" color={C.blue}/><text x="150" y="444" textAnchor="middle" fontSize="10" fill={C.muted}>매 사이클 교대가 아니라 구간 경계에서 교대</text>
    </g>}
    {common}
  </svg>;
}

export default function GemminiPeMacDataflowViz() {
  return <StepViz steps={STEPS}>{step => <><Mobile step={step}/><Desktop step={step}/></>}</StepViz>;
}
