import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 첫 문단과 SourceApplication — 값 합의, 법의 보호, 새 임대차는 각각 확인할 문제.
 * 한국 상가건물 임대차보호법 제10조의4: 종료 6개월 전부터 종료 때까지 일정한 방해행위 금지.
 * 가로 길이는 기간에 비례하지 않습니다.
 */
const W = 340;
const H = 74;
const X_START = 60;
const X_WINDOW = 190;
const X_END = 310;
const AXIS_Y = 44;

const ACCENT = "#2563eb";
const DIM = "#94a3b8";
const TEXT = "#64748b";

type Mark = "yes" | "unknown" | "maybe";

const SCENES: readonly { label: string; summary: string; note: string; windowOn: boolean; rows: readonly [{ mark: Mark; text: string }, { mark: Mark; text: string }, { mark: Mark; text: string }] }[] = [
  { label: "값을 합의했을 때", summary: "세 줄 중 한 줄", note: "시설·재고·영업상 이점에 값을 합의해도 채워지는 것은 첫 줄뿐입니다. 새 임대차가 자동 성립하지 않습니다.", windowOn: false, rows: [{ mark: "yes", text: "3,300만 원 합의" }, { mark: "unknown", text: "아직 확인 안 함" }, { mark: "unknown", text: "아직 확인 안 함" }] },
  { label: "법이 막는 구간", summary: "종료 6개월 전 ~ 종료 때", note: "법은 이 기간에 임대인의 일정한 방해행위를 금지합니다. 값이 적정한지를 정해 주거나 양도를 대신 성립시키는 규칙은 아닙니다.", windowOn: true, rows: [{ mark: "yes", text: "3,300만 원 합의" }, { mark: "maybe", text: "특정 방해행위 금지" }, { mark: "unknown", text: "아직 확인 안 함" }] },
  { label: "보호에도 빠지는 경우", summary: "예외와 거절 사유", note: "차임 연체 등의 예외와 새 임차인의 지급 능력 등에 관한 정당한 거절 사유를 법이 함께 규정합니다. 구간 안이라는 것만으로 둘째 줄이 채워지지 않습니다.", windowOn: true, rows: [{ mark: "yes", text: "3,300만 원 합의" }, { mark: "maybe", text: "예외·거절 사유 확인" }, { mark: "unknown", text: "아직 확인 안 함" }] },
  { label: "장소를 쓸 수 있나", summary: "잔금 전에 따로 확인", note: "새 임대차가 성립하는지는 앞의 두 줄과 별개입니다. 장소 사용 조건을 잔금 전에 확인합니다.", windowOn: true, rows: [{ mark: "yes", text: "3,300만 원 합의" }, { mark: "maybe", text: "예외·거절 사유 확인" }, { mark: "maybe", text: "장소 사용 조건 확인" }] },
];

const ROWS = ["값 합의", "법의 보호", "새 임대차"] as const;

const SYMBOL: Record<Mark, string> = { yes: "✓", unknown: "…", maybe: "?" };

function Stage({ step }: { step: number }) {
  const scene = SCENES[step];
  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
        <line x1={X_START} x2={X_END} y1={AXIS_Y} y2={AXIS_Y} stroke={DIM} strokeWidth={1} />
        {scene.windowOn && <rect x={X_WINDOW} y={AXIS_Y - 12} width={X_END - X_WINDOW} height={24} fill={ACCENT} />}
        <line x1={X_WINDOW} x2={X_WINDOW} y1={AXIS_Y - 14} y2={AXIS_Y + 14} stroke={scene.windowOn ? ACCENT : DIM} strokeWidth={1} />
        <line x1={X_END} x2={X_END} y1={AXIS_Y - 14} y2={AXIS_Y + 14} stroke={scene.windowOn ? ACCENT : DIM} strokeWidth={1} />
        <text x={X_WINDOW} y={AXIS_Y - 20} textAnchor="middle" fontSize={13} fontWeight={scene.windowOn ? 700 : 400} fill={scene.windowOn ? ACCENT : TEXT}>종료 6개월 전</text>
        <text x={X_END} y={AXIS_Y - 20} textAnchor="middle" fontSize={13} fontWeight={scene.windowOn ? 700 : 400} fill={scene.windowOn ? ACCENT : TEXT}>종료</text>
        <text x={X_START} y={AXIS_Y - 8} fontSize={13} fill={TEXT}>임대차</text>
      </svg>
      <ul className="mt-3 space-y-2">
        {ROWS.map((row, index) => {
          const item = scene.rows[index];
          return (
            <li key={row} className="grid grid-cols-[4.5rem_1.5rem_minmax(0,1fr)] items-center gap-1 text-sm">
              <span className="font-semibold">{row}</span>
              <span className={`text-center font-mono font-bold ${item.mark === "yes" ? "text-primary" : item.mark === "maybe" ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>{SYMBOL[item.mark]}</span>
              <span className={`min-w-0 leading-6 ${item.mark === "unknown" ? "text-muted-foreground" : ""}`}>{item.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function LeaseThreeChecksViz() {
  return (
    <SceneShell
      eyebrow="세 가지 확인"
      title="값 합의, 법의 보호, 새 임대차는 따로 채워야 하는 세 줄입니다"
      description="위는 임대차 끝부분의 시간축, 아래는 세 줄의 상태입니다. 한국 상가건물 임대차보호법 제10조의4(2026-05-12 시행)이며 길이는 기간에 비례하지 않습니다."
      ariaLabel="값 합의, 임대차 종료 6개월 전부터의 보호, 새 임대차 성립을 각각 확인하는 세 줄"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
