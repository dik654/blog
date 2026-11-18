import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — mod 7에서 ×3은 입력을 하나씩 다른 결과로 보내고(3×5≡1),
 * mod 8에서 ×2는 2×4≡0, 2×1≡2×5≡2처럼 입력을 합치며 결과 1을 만들지 못한다.
 * 위 줄 = 입력, 아래 줄 = 곱한 뒤 나머지. 칸 좌표는 8칸 기준으로 고정하고 mod 7은 7칸만 그린다(빈 8번째 칸을 점선으로 그리면 '닿지 않는 결과'와 헷갈린다).
 */
const SLOTS = 8;
const W = 360;
const H = 176;
const X0 = 26;
const STEP = (W - 2 * X0) / (SLOTS - 1);
const TOP_Y = 40;
const BOT_Y = 136;
const R = 13;
const sx = (i: number) => X0 + i * STEP;

const SCENES = [
  {
    label: "mod 7에서 3을 곱함",
    summary: "3×5=15 → 1",
    mod: 7,
    factor: 3,
    focus: [5],
    note: "일곱 입력이 일곱 결과로 하나씩 갑니다. 같은 결과에 두 입력이 모이지 않으므로 결과를 보고 입력을 되찾을 수 있습니다. 결과 1로 가는 입력이 5여서 3으로 나누는 일을 5를 곱하는 일로 바꿉니다.",
  },
  {
    label: "mod 8에서 2를 곱함",
    summary: "2×4=8 → 0",
    mod: 8,
    factor: 2,
    focus: [4],
    note: "0이 아닌 2와 4를 곱했는데 결과가 0입니다. 2에 무엇을 곱해도 짝수이므로 아래 줄의 1·3·5·7에는 아무 선도 닿지 않습니다. 2의 곱셈 상대가 될 값이 없습니다.",
  },
  {
    label: "두 입력이 한 결과로",
    summary: "2×1 = 2×5 → 2",
    mod: 8,
    factor: 2,
    focus: [1, 5],
    note: "입력 1과 5가 같은 결과 2에 모입니다. 결과 2만 보고는 원래 입력이 1인지 5인지 정할 수 없습니다. 값을 여덟 개로 제한했다는 사실만으로 나눗셈이 생기지는 않습니다.",
  },
] as const;

export default function MultiplyMapViz() {
  return (
    <SceneShell
      eyebrow="곱셈이 입력을 어디로 보내는가"
      title="mod 7의 ×3은 섞기만 하고, mod 8의 ×2는 입력을 합칩니다"
      description="위 줄은 입력, 아래 줄은 곱한 뒤 기준으로 나눈 나머지입니다(mod 7은 7로, mod 8은 8로 나눈 나머지). 선 하나가 '이 입력을 곱하면 이 결과'를 뜻합니다. 아래 줄의 1에 닿는 선이 있어야 그 수로 나눌 수 있습니다."
      ariaLabel="mod 7에서 3을 곱할 때와 mod 8에서 2를 곱할 때 입력과 결과의 대응"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const focus = scene.focus as readonly number[];
        const inputs = Array.from({ length: scene.mod }, (_, i) => i);
        const hit = new Set(inputs.map((i) => (i * scene.factor) % scene.mod));
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={14} fontSize={11} fill="#64748b">입력</text>
            <text x={4} y={H - 4} fontSize={11} fill="#64748b">{`×${scene.factor} 한 뒤 mod ${scene.mod}`}</text>
            {inputs.map((i) => {
              const out = (i * scene.factor) % scene.mod;
              const on = focus.includes(i);
              return (
                <line
                  key={`l${i}`}
                  x1={sx(i)}
                  y1={TOP_Y + R}
                  x2={sx(out)}
                  y2={BOT_Y - R}
                  stroke={on ? "#2563eb" : "#94a3b8"}
                  strokeWidth={on ? 1.25 : 1}
                  opacity={on ? 1 : 0.6}
                />
              );
            })}
            {Array.from({ length: SLOTS }, (_, i) => {
              const used = i < scene.mod;
              const on = focus.includes(i);
              if (!used) return null;
              return (
                <g key={`t${i}`}>
                  <circle cx={sx(i)} cy={TOP_Y} r={R} fill={on ? "#dbeafe" : "#ffffff"} stroke={used ? (on ? "#2563eb" : "#64748b") : "#cbd5e1"} strokeWidth={1} strokeDasharray={used ? undefined : "3 3"} />
                  {used && (
                    <text x={sx(i)} y={TOP_Y + 4} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill="#0f172a">{i}</text>
                  )}
                </g>
              );
            })}
            {Array.from({ length: SLOTS }, (_, i) => {
              const used = i < scene.mod;
              const reached = hit.has(i);
              const target = focus.some((f) => (f * scene.factor) % scene.mod === i);
              if (!used) return null;
              const stroke = !used ? "#cbd5e1" : target ? "#2563eb" : reached ? "#64748b" : "#dc2626";
              return (
                <g key={`b${i}`}>
                  <circle cx={sx(i)} cy={BOT_Y} r={R} fill={target ? "#dbeafe" : "#ffffff"} stroke={stroke} strokeWidth={1} strokeDasharray={used && reached ? undefined : "3 3"} />
                  {used && (
                    <text x={sx(i)} y={BOT_Y + 4} textAnchor="middle" fontSize={12} fontWeight={target ? 700 : 400} fill={reached ? "#0f172a" : "#dc2626"}>{i}</text>
                  )}
                </g>
              );
            })}
            <g transform={`translate(${W - 4} 14)`}>
              <text textAnchor="end" fontSize={11} fill={hit.size < scene.mod ? "#dc2626" : "#64748b"}>{hit.size < scene.mod ? "점선 빨강 = 아무 입력도 닿지 않는 결과" : "모든 결과에 선이 하나씩"}</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
