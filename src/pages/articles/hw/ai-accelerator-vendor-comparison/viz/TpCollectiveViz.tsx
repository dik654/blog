import SceneShell from "./SceneShell";

/**
 * 본문 대응: #link-axis — 한 장에 모두 들어가면 여러 장은 독립 replica가 되고,
 * tensor parallel 2로 나누면 layer마다 결과를 합치는 collective가 생겨 수십 개 layer에서 반복된다.
 * 80 layer는 #memory-axis에서 가정한 Llama 계열 구조를 그대로 쓴다. 칸 길이는 시간에 비례하지 않는다.
 */
const LAYERS = 80;
const C = { a: "#2563eb", b: "#7c3aed", sync: "#d97706", muted: "#64748b", line: "#cbd5e1", text: "#334155" };

const SCENES = [
  {
    label: "한 장에 모두 들어가는 후보라면",
    summary: "두 장 = 독립 replica 2개",
    note: "Weight·KV·여유가 한 장에 모두 들어가는 후보에서는 장마다 모델 전체를 따로 올립니다. 요청 묶음도 장마다 따로 처리하므로 두 장 사이에 모델 병렬 통신이 요청 경로에 없습니다.",
  },
  {
    label: "Tensor parallel 2로 나누면",
    summary: "layer 하나 = 반씩 계산 → 합치기",
    note: "Weight를 두 장에 나누면 각 장은 같은 layer의 자기 조각만 계산합니다. 다음 layer로 가기 전에 두 조각의 결과를 합쳐야 하며, 이 합치기가 collective(여러 장이 함께 하는 통신)입니다.",
  },
  {
    label: "합치기가 layer마다 반복됩니다",
    summary: `token 한 칸에 layer ${LAYERS}개 통과`,
    note: `가정한 ${LAYERS} layer 구조라면 다음 token 한 칸을 만들 때마다 합치기가 layer 수만큼 끼어듭니다. 합치기 하나의 지연이 짧아도 반복되는 만큼 TPOT에 누적됩니다. 칸 길이는 시간에 비례하지 않습니다.`,
  },
  {
    label: "합치는 경로가 어느 범위를 넘나요",
    summary: "scale-up 안 / scale-out을 건넘",
    note: "같은 합치기라도 두 장이 촘촘한 scale-up domain 안에 있는지, server·rack 경계를 넘어 scale-out network를 건너는지에 따라 경로가 다릅니다. Domain을 넘겨야 한다면 그 구성 그대로 p95 TPOT를 잽니다.",
  },
] as const;

function Card({ x, color, title, lines }: { x: number; color: string; title: string; lines: readonly string[] }) {
  return (
    <g>
      <rect x={x} y={34} width={130} height={104} rx={10} fill="#ffffff" fillOpacity={0.02} stroke={color} strokeWidth={1.2} />
      <text x={x + 65} y={56} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={color}>{title}</text>
      {lines.map((line, index) => (
        <text key={line} x={x + 65} y={82 + index * 20} textAnchor="middle" fontSize={10.5} fill={C.text}>{line}</text>
      ))}
    </g>
  );
}

function Replica() {
  return (
    <g>
      <Card x={30} color={C.a} title="가속기 A" lines={["layer 1–80 전체", "요청 묶음 ①"]} />
      <Card x={200} color={C.b} title="가속기 B" lines={["layer 1–80 전체", "요청 묶음 ②"]} />
      <line x1={168} y1={86} x2={192} y2={86} stroke={C.line} strokeWidth={1} strokeDasharray="3 3" />
      <text x={180} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>두 장 사이 모델 병렬 통신 없음</text>
      <text x={180} y={190} textAnchor="middle" fontSize={10} fill={C.muted}>장마다 다음 token을 스스로 끝냅니다</text>
    </g>
  );
}

function SplitLayer() {
  return (
    <g>
      <Card x={30} color={C.a} title="가속기 A" lines={["layer k의 왼쪽 절반", "부분 결과"]} />
      <Card x={200} color={C.b} title="가속기 B" lines={["layer k의 오른쪽 절반", "부분 결과"]} />
      <line x1={162} y1={110} x2={198} y2={110} stroke={C.sync} strokeWidth={1.25} />
      <circle cx={162} cy={110} r={2.4} fill={C.sync} />
      <circle cx={198} cy={110} r={2.4} fill={C.sync} />
      <text x={180} y={168} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.sync}>결과 합치기 (collective)</text>
      <text x={180} y={190} textAnchor="middle" fontSize={10.5} fill={C.text}>합친 뒤에야 두 장 모두 layer k+1로 넘어감</text>
    </g>
  );
}

function Repeat() {
  const left = 20;
  const width = 320;
  const unit = width / LAYERS;
  return (
    <g>
      <text x={left} y={44} fontSize={10.5} fontWeight={700} fill={C.text}>token 한 칸을 만드는 decode step 하나</text>
      {Array.from({ length: LAYERS }, (_, layer) => (
        <g key={layer}>
          <rect x={left + layer * unit} y={56} width={unit * 0.62} height={30} fill="#94a3b8" />
          <rect x={left + layer * unit + unit * 0.62} y={56} width={unit * 0.38} height={30} fill={C.sync} />
        </g>
      ))}
      <text x={left} y={102} fontSize={10} fill={C.muted}>layer 1</text>
      <text x={left + width} y={102} textAnchor="end" fontSize={10} fill={C.muted}>layer 80 (가정 구조)</text>
      <rect x={left} y={118} width={10} height={10} fill="#94a3b8" />
      <text x={left + 16} y={127} fontSize={10} fill={C.text}>각 장의 계산</text>
      <rect x={left + 110} y={118} width={10} height={10} fill={C.sync} />
      <text x={left + 126} y={127} fontSize={10} fill={C.text}>합치기 (칸 길이는 비례 아님)</text>
      <text x={180} y={162} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.sync}>합치기 {LAYERS}번 이상 / token 한 칸</text>
      <text x={180} y={184} textAnchor="middle" fontSize={10.5} fill={C.text}>짧은 지연도 반복되는 만큼 TPOT에 쌓임</text>
    </g>
  );
}

function Domains() {
  return (
    <g>
      <text x={90} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.a}>scale-up domain 안</text>
      <rect x={18} y={40} width={144} height={92} rx={10} fill="none" stroke={C.a} strokeWidth={1} strokeDasharray="4 3" />
      <rect x={30} y={70} width={48} height={32} rx={6} fill="none" stroke={C.text} strokeWidth={1} />
      <text x={54} y={90} textAnchor="middle" fontSize={10.5} fill={C.text}>A</text>
      <rect x={102} y={70} width={48} height={32} rx={6} fill="none" stroke={C.text} strokeWidth={1} />
      <text x={126} y={90} textAnchor="middle" fontSize={10.5} fill={C.text}>B</text>
      <line x1={78} y1={86} x2={102} y2={86} stroke={C.sync} strokeWidth={1.25} />
      <text x={90} y={152} textAnchor="middle" fontSize={10} fill={C.text}>촘촘한 연결 안에서 끝남</text>

      <text x={270} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.b}>domain 밖으로 넘음</text>
      <rect x={196} y={40} width={64} height={92} rx={8} fill="none" stroke={C.line} strokeWidth={1} />
      <text x={228} y={56} textAnchor="middle" fontSize={9.5} fill={C.muted}>node·rack 1</text>
      <rect x={204} y={70} width={48} height={32} rx={6} fill="none" stroke={C.text} strokeWidth={1} />
      <text x={228} y={90} textAnchor="middle" fontSize={10.5} fill={C.text}>A</text>
      <rect x={280} y={40} width={64} height={92} rx={8} fill="none" stroke={C.line} strokeWidth={1} />
      <text x={312} y={56} textAnchor="middle" fontSize={9.5} fill={C.muted}>node·rack 2</text>
      <rect x={288} y={70} width={48} height={32} rx={6} fill="none" stroke={C.text} strokeWidth={1} />
      <text x={312} y={90} textAnchor="middle" fontSize={10.5} fill={C.text}>B</text>
      <polyline points="228,102 228,120 270,120 270,146 270,120 312,120 312,102" fill="none" stroke={C.sync} strokeWidth={1.25} />
      <rect x={252} y={140} width={36} height={14} rx={3} fill="#ffffff" fillOpacity={0.02} stroke={C.sync} strokeWidth={1} />
      <text x={270} y={150} textAnchor="middle" fontSize={8.5} fill={C.sync}>switch</text>
      <text x={270} y={172} textAnchor="middle" fontSize={10} fill={C.text}>scale-out network를 건넘</text>
      <text x={180} y={198} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.muted}>layer마다의 합치기가 이 경로를 그대로 탑니다</text>
    </g>
  );
}

export default function TpCollectiveViz() {
  return (
    <SceneShell
      eyebrow="여러 장으로 나눌 때"
      title="Tensor parallel은 layer마다 결과를 합치고, 그 합치기가 반복됩니다"
      description="네모 하나가 가속기 한 장입니다. 70B 사례가 한 장에 들어가는 경우와 두 장에 나누는 경우를 같은 그림에서 비교합니다. 80 layer는 앞 절의 가정 구조입니다."
      ariaLabel="replica, tensor parallel 2의 layer별 합치기, 80 layer 반복, scale-up과 scale-out 경로 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Replica />}
          {active === 1 && <SplitLayer />}
          {active === 2 && <Repeat />}
          {active === 3 && <Domains />}
        </svg>
      )}
    />
  );
}
