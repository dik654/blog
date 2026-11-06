import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 관측 → 숫자 z → 다음 숫자 예상 → 계획기 → 실제 환경 → 새 관측.
 * 부품 이름은 6절에서 붙이므로 여기서는 역할로만 부른다.
 */
const INK = "#64748b";
const LINE = "#94a3b8";
const BLUE = "#2563eb";
const AMBER = "#d97706";

type Part = "encode" | "predict" | "plan" | "act" | "sense";

const NODES: readonly { id: Part; x: number; y: number; lines: readonly string[]; color: string }[] = [
  { id: "encode", x: 18, y: 38, lines: ["관측을 숫자로", "바꾸는 부품"], color: BLUE },
  { id: "predict", x: 134, y: 38, lines: ["다음 숫자를", "예상하는 부품"], color: BLUE },
  { id: "plan", x: 250, y: 38, lines: ["계획기", "비용 작은 후보"], color: BLUE },
  { id: "act", x: 250, y: 186, lines: ["선택한 행동", "실행"], color: AMBER },
  { id: "sense", x: 18, y: 186, lines: ["이미지·센서", "새 관측"], color: AMBER },
];

const W = 84;
const H = 46;

interface Scene {
  label: string;
  summary: string;
  note: string;
  on: readonly Part[];
}

const SCENES: readonly Scene[] = [
  { label: "관측을 숫자 묶음으로", summary: "이미지·센서 → z", on: ["sense", "encode"], note: "실제 시스템의 입력은 이미지나 센서 관측입니다. 이것을 숫자 묶음 z로 바꾸는 부품이 있습니다. 이 z가 목표 비교에 충분한 정보를 담아야 계획에 쓸 수 있습니다." },
  { label: "숫자와 행동으로 다음 숫자", summary: "z + 행동 a → 다음 z", on: ["encode", "predict"], note: "그 숫자와 행동 a로 다음 숫자를 예상하는 부품이 있습니다. 이 단계는 모델 안의 계산이고 실제 물체는 움직이지 않습니다." },
  { label: "모델 안에서 후보 비교", summary: "행동 열 여러 개 → 비용", on: ["predict", "plan"], note: "계획기는 여러 행동 열을 모델 안에서 실행해 비용이 작은 후보를 고릅니다." },
  { label: "실제 환경에서 실행", summary: "행동 → 새 관측", on: ["plan", "act", "sense"], note: "실제 환경은 선택한 행동을 실행하고 새로운 관측을 돌려줍니다. 이 관측이 다시 숫자로 바뀌는 입력이 됩니다." },
  { label: "값의 출처가 다릅니다", summary: "모델의 예측 ≠ 센서의 관측", on: ["predict", "sense"], note: "모델 안의 예측값과 센서가 관측한 값은 서로 다른 출처입니다. 위쪽 칸에서 나온 값과 아래쪽 칸에서 나온 값을 같은 것으로 여기지 않습니다." },
];

function Arrow({ d, on, color, label, lx, ly }: { d: string; on: boolean; color: string; label?: string; lx?: number; ly?: number }) {
  return (
    <g opacity={on ? 1 : 0.35}>
      <path d={d} fill="none" stroke={on ? color : LINE} strokeWidth={1.25} />
      {label && <text x={lx} y={ly} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill={on ? color : INK}>{label}</text>}
    </g>
  );
}

function head(x: number, y: number, dir: "r" | "l" | "u" | "d") {
  const s = 5;
  if (dir === "r") return `M${x - s} ${y - s}L${x} ${y}L${x - s} ${y + s}`;
  if (dir === "l") return `M${x + s} ${y - s}L${x} ${y}L${x + s} ${y + s}`;
  if (dir === "u") return `M${x - s} ${y + s}L${x} ${y}L${x + s} ${y + s}`;
  return `M${x - s} ${y - s}L${x} ${y}L${x + s} ${y - s}`;
}

export default function ModelLoopViz() {
  return (
    <SceneShell
      eyebrow="값이 흐르는 길"
      title="모델 안의 예측과 실제 환경의 관측은 다른 칸에서 나옵니다"
      description="위 칸은 계산만 일어나는 모델과 계획기 쪽, 아래 칸은 실제로 움직이는 환경 쪽입니다. 칠한 칸과 진한 화살표가 지금 장면의 경로입니다."
      ariaLabel="관측, 숫자 표현, 예측, 계획, 실행, 재관측의 흐름"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const has = (part: Part) => scene.on.includes(part);
        return (
          <svg viewBox="0 0 360 246" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={6} y={8} width={348} height={102} rx={8} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={18} y={26} fontSize={12} fontWeight={700} fill={BLUE}>모델과 계획기 · 계산만</text>
            <rect x={6} y={158} width={348} height={82} rx={8} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="4 3" />
            <text x={18} y={176} fontSize={12} fontWeight={700} fill={AMBER}>실제 환경 · 물체가 움직임</text>

            <Arrow d={`M102 61H134${head(134, 61, "r")}`} on={has("encode") && has("predict")} color={BLUE} label="z" lx={118} ly={54} />
            <Arrow d={`M218 61H250${head(250, 61, "r")}`} on={has("predict") && has("plan")} color={BLUE} label="예측" lx={234} ly={54} />
            <Arrow d={`M176 106V84${head(176, 84, "u")}`} on={active === 1} color={BLUE} />
            <text x={184} y={102} fontSize={12} fill={active === 1 ? BLUE : INK} opacity={active === 1 ? 1 : 0.4}>행동 a</text>
            <Arrow d={`M292 84V186${head(292, 186, "d")}`} on={active === 3} color={AMBER} label="행동" lx={316} ly={140} />
            <Arrow d={`M250 209H102${head(102, 209, "l")}`} on={active === 3} color={AMBER} />
            <Arrow d={`M60 186V84${head(60, 84, "u")}`} on={active === 0 || active === 3} color={AMBER} label="관측" lx={36} ly={140} />

            {NODES.map((node) => {
              const on = has(node.id);
              return (
                <g key={node.id}>
                  <rect x={node.x} y={node.y} width={W} height={H} rx={8} fill={on ? node.color : "none"} stroke={on ? node.color : LINE} strokeWidth={1} />
                  {node.lines.map((line, index) => (
                    <text key={line} x={node.x + W / 2} y={node.y + 19 + index * 15} textAnchor="middle" fontSize={11.5} fontWeight={on ? 700 : 400} fill={on ? "#ffffff" : INK}>{line}</text>
                  ))}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
