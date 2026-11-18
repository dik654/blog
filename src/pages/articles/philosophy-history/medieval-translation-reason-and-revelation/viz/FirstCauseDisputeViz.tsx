import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — ‘세계에 시작이 있다’ 주장에 대한 논거(변화에는 첫 원인이 필요하다)와
 * 반론(영원한 운동도 원인에 의존할 수 있다)을 시간선 위의 그림으로 비교한다.
 * 가로축 = 시간, 점 = 변화, 화살표 = 원인 의존. 점의 개수와 간격은 설명용(가정)이다.
 */
const SCENES = [
  {
    label: "논거: 변화에는 첫 원인이 필요하다",
    summary: "원인 사슬 → 맨 앞의 시작",
    note: "세계에 시작이 있다는 주장 쪽의 논거입니다. 변화를 원인 쪽으로 거슬러 올라가면 첫 원인이 있어야 한다고 보고, 그 첫 원인이 놓인 자리를 시간선의 맨 앞, 곧 시작으로 읽습니다.",
  },
  {
    label: "반론: 영원한 운동도 원인에 의존할 수 있다",
    summary: "시작 없는 선 + 원인 의존",
    note: "반론은 시간선 양끝을 열어 둡니다. 운동이 영원히 이어져도 매 순간 원인에 의존할 수 있다면, 원인이 필요하다는 점에서 시간상 시작이 있다는 결론이 곧바로 따라 나오지는 않습니다.",
  },
  {
    label: "두 그림을 나란히 놓습니다",
    summary: "원인 필요 = 둘 다 · 시작 = 갈림",
    note: "두 그림 모두 원인을 인정하고, 시작이 있는지에서 갈립니다. 다음 단계에서는 철학적 증명과 경전 해석이 각각 어디까지 결론을 허용하는지 따로 표시하고, 증명 불가능하다고 남긴 부분도 기록합니다.",
  },
] as const;

const DOTS = [0, 1, 2, 3, 4, 5] as const;
const DOT_X = (index: number) => 96 + index * 46;

function Chain({ open, compact = false }: { open: boolean; compact?: boolean }) {
  const height = compact ? 112 : 150;
  const lineY = compact ? 78 : 118;
  const causeY = compact ? 22 : 40;
  return (
    <svg
      viewBox={`0 0 360 ${height}`}
      className={`mx-auto h-auto w-full ${compact ? "max-w-md" : "max-w-xl"}`}
      role="img"
      aria-label={open ? "양끝이 열린 시간선 위의 변화들이 위쪽 원인에 각각 의존하는 그림" : "변화들이 왼쪽 끝의 첫 원인까지 이어지고 그 자리에 시작이 있는 그림"}
    >
      <defs>
        <marker id={`cause-arrow-${open ? "o" : "c"}-${compact ? "s" : "l"}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#2563eb" />
        </marker>
      </defs>
      <line x1={open ? 16 : 52} y1={lineY} x2={344} y2={lineY} stroke="#64748b" strokeWidth={1} />
      <text x={344} y={lineY + 18} fontSize={11} textAnchor="end" fill="#64748b">
        시간 →
      </text>
      {open ? (
        <>
          <text x={22} y={lineY - 6} fontSize={12} fill="#64748b">
            …
          </text>
          <text x={326} y={lineY - 6} fontSize={12} fill="#64748b">
            …
          </text>
          <rect x={130} y={causeY - 14} width={100} height={26} rx={8} fill="none" stroke="#2563eb" strokeWidth={1} />
          <text x={180} y={causeY + 4} fontSize={12} textAnchor="middle" fill="#2563eb">
            원인
          </text>
          {DOTS.map((dot) => (
            <line
              key={dot}
              x1={180}
              y1={causeY + 13}
              x2={DOT_X(dot)}
              y2={lineY - 8}
              stroke="#2563eb"
              strokeWidth={1}
              strokeDasharray="3 3"
              markerEnd={`url(#cause-arrow-o-${compact ? "s" : "l"})`}
            />
          ))}
        </>
      ) : (
        <>
          <line x1={52} y1={lineY - 22} x2={52} y2={lineY + 8} stroke="#dc2626" strokeWidth={1.25} />
          <text x={52} y={lineY + 24} fontSize={11} textAnchor="middle" fill="#dc2626">
            시작
          </text>
          <rect x={22} y={causeY - 14} width={64} height={26} rx={8} fill="none" stroke="#2563eb" strokeWidth={1} />
          <text x={54} y={causeY + 4} fontSize={12} textAnchor="middle" fill="#2563eb">
            첫 원인
          </text>
          <line x1={58} y1={causeY + 13} x2={DOT_X(0) - 8} y2={lineY - 6} stroke="#2563eb" strokeWidth={1} markerEnd={`url(#cause-arrow-c-${compact ? "s" : "l"})`} />
          {DOTS.slice(1).map((dot) => (
            <line key={dot} x1={DOT_X(dot - 1) + 7} y1={lineY} x2={DOT_X(dot) - 8} y2={lineY} stroke="#2563eb" strokeWidth={1.25} markerEnd={`url(#cause-arrow-c-${compact ? "s" : "l"})`} />
          ))}
        </>
      )}
      {DOTS.map((dot) => (
        <circle key={dot} cx={DOT_X(dot)} cy={lineY} r={5} fill="#64748b" />
      ))}
    </svg>
  );
}

function Verdict({ title, cause, start }: { title: string; cause: string; start: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 text-xs sm:text-sm">
      <span className="font-semibold">{title}</span>
      <span className="rounded border border-primary/60 px-1.5 py-0.5">원인 {cause}</span>
      <span className="rounded border border-border px-1.5 py-0.5">시작 {start}</span>
    </div>
  );
}

function Compare() {
  return (
    <div className="min-w-0 space-y-2">
      <Verdict title="논거의 그림" cause="필요" start="있음" />
      <Chain open={false} compact />
      <Verdict title="반론의 그림" cause="의존" start="없어도 됨" />
      <Chain open compact />
    </div>
  );
}

export default function FirstCauseDisputeViz() {
  return (
    <SceneShell
      eyebrow="문답의 첫 두 칸"
      title="‘원인이 필요하다’와 ‘시작이 있다’를 떼어 보는 반론"
      description="7절의 ‘세계에 시작이 있는가’ 토론에서 논거와 반론이 각각 그리는 시간 그림입니다. 가로선은 시간, 점은 변화, 파란 화살표는 그 변화가 원인에 기대는 관계입니다."
      ariaLabel="첫 원인이 시간의 시작에 놓이는 논거의 그림, 시작 없는 시간선에서도 변화가 원인에 의존하는 반론의 그림, 두 그림 비교의 세 장면"
      scenes={SCENES}
      render={(active) =>
        active === 2 ? (
          <Compare />
        ) : (
          <div className="min-w-0">
            <Chain open={active === 1} />
            <p className="mt-1 text-center text-xs leading-5 text-muted-foreground">점 = 변화 · 파란 화살표 = 원인에 의존함 (점 개수는 설명용 가정)</p>
          </div>
        )
      }
    />
  );
}
