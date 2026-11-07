import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #paper-eagle — 불확실성은 다음 토큰을 고를 때 생긴다.
 * 고른 토큰을 입력에 함께 넣으면 어느 갈래를 예측할지 정해진다. 예측 오차는 별개다.
 */
interface Scene extends ShellScene {
  branch: "none" | "A" | "B";
  input: string;
  errorMark: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "갈래가 둘", summary: "중간 표현만으로는 어느 쪽?", branch: "none", input: "현재 중간 표현", errorMark: false, note: "같은 현재 중간 표현 뒤에서 A를 뽑느냐 B를 뽑느냐에 따라 다음 중간 표현도 달라집니다. 어떤 토큰을 뽑을지 모르면 어느 갈래를 예측할지 정해지지 않습니다." },
  { label: "토큰 A를 함께 넣음", summary: "A 갈래를 예측", branch: "A", input: "현재 중간 표현 + 고른 토큰 A", errorMark: false, note: "이미 고른 다음 토큰을 한 시점 앞선 입력에 함께 넣어 어느 갈래를 예측할지 알려 줍니다." },
  { label: "토큰 B를 함께 넣음", summary: "B 갈래를 예측", branch: "B", input: "현재 중간 표현 + 고른 토큰 B", errorMark: false, note: "같은 현재 중간 표현이어도 입력에 든 토큰이 B이면 다른 갈래를 예측합니다." },
  { label: "남는 것은 예측 오차", summary: "두 가지를 구분", branch: "A", input: "현재 중간 표현 + 고른 토큰 A", errorMark: true, note: "갈래를 고르는 것은 토큰 선택의 불확실성이고, 고른 갈래를 얼마나 맞히느냐는 학습된 제안기의 예측 오차입니다. 둘을 구분해야 합니다." },
];

const BLUE = "#2563eb";
const GRAY = "#64748b";
const AMBER = "#d97706";

function Edge({ d, on, id }: { d: string; on: boolean; id: string }) {
  return <path d={d} fill="none" stroke={on ? BLUE : GRAY} strokeWidth={on ? 1.25 : 1} opacity={on ? 1 : 0.45} markerEnd={`url(#${id})`} />;
}

function Node({ x, y, w, lines, on, strong = false }: { x: number; y: number; w: number; lines: readonly string[]; on: boolean; strong?: boolean }) {
  const h = lines.length > 1 ? 44 : 34;
  return (
    <g opacity={on ? 1 : 0.45}>
      <rect x={x} y={y - h / 2} width={w} height={h} rx={8} fill={on ? (strong ? `${BLUE}1f` : `${GRAY}14`) : "none"} stroke={on && strong ? BLUE : GRAY} strokeWidth={1} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={y + (index - (lines.length - 1) / 2) * 16 + 4} textAnchor="middle" fontSize={11.5} fontWeight={index === 0 ? 700 : 400} fill="currentColor">
          {line}
        </text>
      ))}
    </g>
  );
}

export default function EagleBranchViz() {
  return (
    <SceneShell
      eyebrow="EAGLE · 후보 A와 B"
      title="같은 중간 표현 뒤에서도 고른 토큰에 따라 다음 갈래가 달라집니다"
      description="중간 표현(feature)은 기준 모델이 토큰을 고르기 전에 만드는 내부 값이고, 제안기는 그 다음 시점을 예측합니다."
      ariaLabel="현재 중간 표현에서 다음 토큰에 따라 갈라지는 다음 중간 표현"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const a = scene.branch !== "B";
        const b = scene.branch !== "A";
        const picked = scene.branch !== "none";
        return (
          <div className="min-w-0">
            <p className="rounded-md border border-border px-3 py-2 text-xs">
              <span className="font-bold text-muted-foreground">제안기 입력 · </span>
              <span className="font-semibold">{scene.input}</span>
            </p>
            <svg viewBox="0 0 340 156" className="mx-auto mt-3 h-auto w-full max-w-[540px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                <marker id="eagle-arrow-on" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={BLUE} /></marker>
                <marker id="eagle-arrow-off" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={GRAY} /></marker>
              </defs>
              <Edge d="M86 78 L120 38" on={a && picked} id={a && picked ? "eagle-arrow-on" : "eagle-arrow-off"} />
              <Edge d="M86 78 L120 118" on={b && picked} id={b && picked ? "eagle-arrow-on" : "eagle-arrow-off"} />
              <Edge d="M172 34 L214 34" on={a && picked} id={a && picked ? "eagle-arrow-on" : "eagle-arrow-off"} />
              <Edge d="M172 122 L214 122" on={b && picked} id={b && picked ? "eagle-arrow-on" : "eagle-arrow-off"} />
              <Node x={4} y={78} w={82} lines={["현재", "중간 표현"]} on strong={false} />
              <Node x={122} y={34} w={50} lines={["토큰 A"]} on={a} strong={a && picked} />
              <Node x={122} y={122} w={50} lines={["토큰 B"]} on={b} strong={b && picked} />
              <Node x={216} y={34} w={120} lines={["A 뒤의", "다음 중간 표현"]} on={a} strong={a && picked} />
              <Node x={216} y={122} w={120} lines={["B 뒤의", "다음 중간 표현"]} on={b} strong={b && picked} />
              {scene.errorMark && (
                <g>
                  <rect x={212} y={8} width={127} height={52} rx={10} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={276} y={76} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={AMBER}>여기서는 예측 오차</text>
                  <text x={45} y={118} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={BLUE}>토큰 선택</text>
                </g>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
