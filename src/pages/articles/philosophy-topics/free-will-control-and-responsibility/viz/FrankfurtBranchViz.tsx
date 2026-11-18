import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 프랑크푸르트식 사례. 실제 경로(자기 이유 → 문 열기, 장치는 개입 안 함)와
 * 반사실 경로(마음을 바꾸면 장치가 강제로 열게 함)가 같은 결과로 모인다.
 * 그래서 달리 할 기회는 없지만 실제 원천은 자기 이유다 → 대안 가능성 원칙(PAP)에 도전.
 */
const W = 360;
const H = 196;

const SCENES = [
  { label: "실제로 일어난 일", summary: "자기 이유 → 문을 엶", note: "사람은 자기 이유로 문을 열기로 했고 원래 계획대로 열었습니다. 감시 장치는 끝까지 개입하지 않았습니다." },
  { label: "일어나지 않은 갈래", summary: "마음을 바꾸면 → 장치가 강제", note: "장치는 그가 마음을 바꾸면 강제로 문을 열게 만들 준비를 하고 있었습니다. 실제로는 이 점선 갈래로 가지 않았습니다." },
  { label: "두 갈래가 같은 곳으로", summary: "달리 할 기회 없음 · 원천은 자기 이유", note: "어느 갈래로 가도 문은 열립니다. 그래서 달리 할 기회는 없었지만, 실제 행동의 원천은 자기 이유였습니다. 대안 가능성 원칙은 '다르게 할 수 있어야만 책임이 있다'는 원칙이고, 이 사례는 그 원칙에 도전합니다." },
  { label: "논쟁이 남는 자리", summary: "갈림길의 작은 대안?", note: "장치가 개입하지 않았어도 갈림길에 작은 대안이 남는지, 행위의 원천만으로 충분한지 논쟁은 이어집니다. 사례 하나가 논쟁을 끝냈다고 말할 수는 없습니다." },
] as const;

const ACTUAL = "#2563eb";
const COUNTER = "#d97706";
const MUTED = "#94a3b8";

function Node({ x, y, w, lines, stroke, dashed = false, dim = false }: { x: number; y: number; w: number; lines: readonly string[]; stroke: string; dashed?: boolean; dim?: boolean }) {
  const h = 44;
  return (
    <g opacity={dim ? 0.35 : 1} style={{ transition: "opacity 300ms" }}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={stroke} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={y + (lines.length === 1 ? 26 : 19 + index * 14)} textAnchor="middle" fontSize={11} fill="currentColor">
          {line}
        </text>
      ))}
    </g>
  );
}

export default function FrankfurtBranchViz() {
  return (
    <SceneShell
      eyebrow="프랑크푸르트식 사례"
      title="갈림길 두 갈래가 모두 같은 문 열기로 모입니다"
      description="실선은 실제로 일어난 경로, 점선은 마음을 바꿨다면 일어났을 경로입니다. 대안 가능성 원칙(PAP)은 '다르게 할 수 있었어야만 책임이 있다'는 원칙을 말합니다."
      ariaLabel="자기 이유로 문을 연 실제 경로와 장치가 강제했을 반사실 경로가 같은 결과로 모이는 분기도"
      scenes={SCENES}
      render={(active) => {
        const actualOn = active !== 1;
        const counterOn = active >= 1;
        const converge = active >= 2;
        const fork = active === 3;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <Node x={8} y={76} w={96} lines={["자기 이유로", "열기로 함"]} stroke={ACTUAL} />
              <path d="M104 98 L124 98 L124 42 L136 42" fill="none" stroke={actualOn ? ACTUAL : MUTED} strokeWidth={1.25} />
              <path d="M124 98 L124 154 L136 154" fill="none" stroke={counterOn ? COUNTER : MUTED} strokeWidth={1.25} strokeDasharray="4 3" />
              <circle cx={124} cy={98} r={fork ? 7 : 3} fill={fork ? "none" : actualOn ? ACTUAL : MUTED} stroke={fork ? COUNTER : "none"} strokeWidth={1.25} />
              {fork && (
                <text x={124} y={124} textAnchor="middle" fontSize={10} fill={COUNTER}>작은 대안?</text>
              )}
              <Node x={136} y={20} w={112} lines={["계획대로 진행", "장치는 개입 안 함"]} stroke={actualOn ? ACTUAL : MUTED} dim={!actualOn} />
              <Node x={136} y={132} w={112} lines={["마음을 바꾸면", "장치가 강제"]} stroke={counterOn ? COUNTER : MUTED} dashed dim={!counterOn} />
              <path d="M248 42 L262 42 L262 98 L276 98" fill="none" stroke={actualOn ? ACTUAL : MUTED} strokeWidth={1.25} opacity={actualOn ? 1 : 0.35} />
              <path d="M248 154 L262 154 L262 98" fill="none" stroke={counterOn ? COUNTER : MUTED} strokeWidth={1.25} strokeDasharray="4 3" opacity={counterOn ? 1 : 0.35} />
              <Node x={276} y={76} w={76} lines={["문이 열림"]} stroke={converge ? "#64748b" : actualOn ? ACTUAL : COUNTER} />
              <text x={70} y={22} textAnchor="middle" fontSize={10} fill={ACTUAL}>실선 = 실제</text>
              <text x={70} y={182} textAnchor="middle" fontSize={10} fill={COUNTER}>점선 = 반사실</text>
            </svg>
            <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div className={`rounded-lg border px-3 py-2 transition-opacity duration-300 motion-reduce:transition-none ${converge ? "border-[#d97706] opacity-100" : "border-dashed border-border opacity-40"}`}>
                <span className="font-bold">대안 가능성</span>
                <span className="ml-2">{converge ? (fork ? "달리 할 기회 없음? 작은 대안이 남는지 논쟁 중" : "달리 할 기회 없음") : "—"}</span>
              </div>
              <div className={`rounded-lg border px-3 py-2 transition-opacity duration-300 motion-reduce:transition-none ${converge ? "border-[#2563eb] opacity-100" : "border-dashed border-border opacity-40"}`}>
                <span className="font-bold">행위의 원천</span>
                <span className="ml-2">{converge ? "실제로는 자기 이유" : "—"}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
