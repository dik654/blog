import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dataflow 셋째 문단 — OS는 부분합을 한 PE에 붙잡고 reduction 항을 시간에 따라 모으고,
 * WS는 weight를 붙잡고 부분합이 PE 사이를 위에서 아래로 이동하며 완성된다.
 * 숫자: C₀₀ = 11 + 2×5 + 3×7 = 42, 행 1은 13 + 4×5 = 33 (본문 값).
 * 두 PE의 위아래 배치와 아래 PE의 weight 7(B₁₀)은 설명용 가정.
 */
type Slot = { a: string; top: string; state: string; active: boolean };

const SCENES = [
  {
    label: "OS · 첫 항",
    summary: "c1: 11 + 2×5 = 21",
    mode: "OS",
    upper: { a: "a = 2", top: "b = 5", state: "c1: 11 → 21", active: true },
    lower: { a: "", top: "", state: "다른 PE", active: false },
    between: "b = 5 그대로 아래로",
    bottom: "",
    note: "OS에서는 C₀₀의 부분합이 위 PE의 c1에 머뭅니다. a=2는 왼쪽에서, b=5는 위에서 들어와 곱해진 뒤 c1의 11에 더해져 21이 됩니다. a와 b는 그대로 오른쪽과 아래 PE로 흘러갑니다.",
  },
  {
    label: "OS · 둘째 항",
    summary: "c1: 21 + 3×7 = 42",
    mode: "OS",
    upper: { a: "a = 3", top: "b = 7", state: "c1: 21 → 42", active: true },
    lower: { a: "", top: "", state: "다른 PE", active: false },
    between: "b = 7 그대로 아래로",
    bottom: "",
    note: "다음 reduction 항 3×7이 같은 PE에 도착해 같은 c1에 더해집니다. 부분합은 PE를 떠나지 않습니다. 붙잡힌 부분합이 재사용되는 횟수는 이 출력의 reduction 항 수, 여기서는 2입니다.",
  },
  {
    label: "WS · 위 PE",
    summary: "11 + 2×5 = 21 → 아래로",
    mode: "WS",
    upper: { a: "a = 2", top: "부분합 11", state: "weight 5 고정", active: true },
    lower: { a: "", top: "", state: "weight 7 고정 (가정)", active: false },
    between: "out_b = 21",
    bottom: "",
    note: "WS에서는 위 PE가 B₀₀=5를 붙잡습니다. 위에서 내려온 부분합 11에 2×5를 더한 21은 PE에 남지 않고 out_b로 아래 PE에 넘어갑니다.",
  },
  {
    label: "WS · 아래 PE",
    summary: "21 + 3×7 = 42",
    mode: "WS",
    upper: { a: "", top: "", state: "weight 5 고정", active: false },
    lower: { a: "a = 3", top: "", state: "weight 7 고정 (가정)", active: true },
    between: "부분합 21",
    bottom: "out_b = 42",
    note: "아래 PE가 B₁₀=7을 붙잡고 있다고 하면(가정) a=3과 넘어온 21로 21+3×7=42를 만듭니다. 같은 42지만 OS와 달리 부분합이 PE 사이를 이동하며 완성됩니다.",
  },
  {
    label: "WS · 출력 행 1",
    summary: "13 + 4×5 = 33 → 아래로",
    mode: "WS",
    upper: { a: "a = 4", top: "부분합 13", state: "weight 5 재사용", active: true },
    lower: { a: "행 1의 다음 값", top: "", state: "weight 7 고정 (가정)", active: false },
    between: "out_b = 33",
    bottom: "",
    note: "뒤이어 출력 행 1의 a=4와 부분합 13이 같은 위 PE를 지나 13+4×5=33이 됩니다. 5는 다시 읽지 않고 재사용합니다. 아래 PE에서 더할 행 1의 값은 글에 나오지 않아 숫자를 적지 않았습니다.",
  },
] as const;

const BLUE = "#2563eb";
const TEAL = "#0f766e";
const AMBER = "#d97706";
const INK = "#334155";
const MUTED = "#94a3b8";
const LINE = "#cbd5e1";

const PE_X = 150;
const PE_W = 130;
const PE_H = 56;
const UPPER_Y = 44;
const LOWER_Y = 160;
const MID_X = PE_X + PE_W / 2;

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const horizontal = y1 === y2;
  const head = horizontal ? `${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4} ${x2},${y2}` : `${x2 - 4},${y2 - 7} ${x2 + 4},${y2 - 7} ${x2},${y2}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={horizontal ? x2 - 7 : x2} y2={horizontal ? y2 : y2 - 7} stroke={color} strokeWidth={1.25} />
      <polygon points={head} fill={color} />
    </g>
  );
}

function Pe({ y, slot, name, stationaryColor }: { y: number; slot: Slot; name: string; stationaryColor: string }) {
  const stroke = slot.active ? stationaryColor : LINE;
  return (
    <g>
      <rect x={PE_X} y={y} width={PE_W} height={PE_H} rx={10} fill="none" stroke={stroke} strokeWidth={slot.active ? 1.25 : 1} />
      <text x={MID_X} y={y + 22} textAnchor="middle" fontSize={11} fill={slot.active ? INK : MUTED}>{name}</text>
      <text x={MID_X} y={y + 42} textAnchor="middle" fontSize={12} fontWeight={700} fill={slot.active ? stationaryColor : MUTED}>{slot.state}</text>
      {slot.a && (
        <g>
          <Arrow x1={20} y1={y + PE_H / 2} x2={PE_X} y2={y + PE_H / 2} color={slot.active ? BLUE : MUTED} />
          <text x={22} y={y + PE_H / 2 - 7} fontSize={11} fontWeight={700} fill={slot.active ? BLUE : MUTED}>{slot.a}</text>
        </g>
      )}
      <line x1={PE_X + PE_W} y1={y + PE_H / 2} x2={344} y2={y + PE_H / 2} stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
      <text x={344} y={y + PE_H / 2 - 6} textAnchor="end" fontSize={10} fill={MUTED}>a → 오른쪽 PE</text>
    </g>
  );
}

export default function ReuseAxisViz() {
  return (
    <SceneShell
      eyebrow="재사용 축"
      title="OS는 부분합이 한 PE에 머물고, WS는 부분합이 PE 사이를 내려갑니다"
      description="세로로 이어진 PE 두 칸입니다. 왼쪽 화살표는 activation a, 위 화살표는 OS에서는 weight b, WS에서는 위에서 내려온 부분합(partial sum)입니다. 7은 본문 식의 B₁₀이고, 그 값을 아래 칸이 붙잡는다는 배치는 설명을 위한 가정입니다."
      ariaLabel="같은 C00=42를 OS와 WS가 어디에서 누적하는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const isWs = scene.mode === "WS";
        const stationary = isWs ? TEAL : AMBER;
        const flowColor = isWs ? AMBER : TEAL;
        return (
          <svg viewBox="0 0 360 252" className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={8} y={14} fontSize={11} fontWeight={700} fill={stationary}>{isWs ? "WS · 칸에 붙잡힌 것 = weight" : "OS · 칸에 붙잡힌 것 = 부분합"}</text>
            {scene.upper.top && (
              <g>
                <Arrow x1={MID_X} y1={20} x2={MID_X} y2={UPPER_Y} color={flowColor} />
                <text x={MID_X + 8} y={36} fontSize={11} fontWeight={700} fill={flowColor}>{scene.upper.top}</text>
              </g>
            )}
            <Pe y={UPPER_Y} slot={scene.upper} name="위 PE" stationaryColor={stationary} />
            <Arrow x1={MID_X} y1={UPPER_Y + PE_H} x2={MID_X} y2={LOWER_Y} color={flowColor} />
            <text x={MID_X + 8} y={(UPPER_Y + PE_H + LOWER_Y) / 2 + 4} fontSize={11} fontWeight={700} fill={flowColor}>{scene.between}</text>
            <Pe y={LOWER_Y} slot={scene.lower} name="아래 PE" stationaryColor={stationary} />
            {scene.bottom && (
              <g>
                <Arrow x1={MID_X} y1={LOWER_Y + PE_H} x2={MID_X} y2={248} color={flowColor} />
                <text x={MID_X + 8} y={240} fontSize={11} fontWeight={700} fill={flowColor}>{scene.bottom}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
