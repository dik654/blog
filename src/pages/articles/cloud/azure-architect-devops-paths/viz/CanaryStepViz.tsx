import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 1·2문단 — (가정) 새 버전은 먼저 10% 트래픽에서 5분 동안 오류율을 본 뒤 전체로 넓힌다. 10% 단계 배포와 자동 중단.
 * 칸 100개 = 요청 100건으로 바꿔 그린 것(가정). 10% → 10칸.
 * 오류율 기준값과 중단 뒤 되돌리기 여부는 본문에 없으므로 그리지 않는다. 3·4장면은 5분 관찰 뒤 갈라지는 두 갈래다.
 */
const ACCENT = "#2563eb";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const LABEL = "#475569";

const CELL = 13;
const GAP = 3;
const GRID_X = 8;
const GRID_Y = 24;
const NEW_SHARE = 10;

type Phase = "first" | "watch" | "pass" | "stop";

const SCENES = [
  {
    label: "새 버전은 10%부터",
    summary: "100칸 중 10칸",
    phase: "first",
    note: "칸 하나를 요청 한 건으로 보고 100건을 그렸습니다(가정). 새 버전은 처음에 요청 10%만 받고, 나머지 90%는 기존 버전이 그대로 받습니다.",
  },
  {
    label: "5분 동안 오류율 관찰",
    summary: "10%에서 5분",
    phase: "watch",
    note: "새 버전이 받은 요청에서 오류율을 5분 동안 봅니다. 넓힐지 멈출지 가르는 오류율 기준값은 본문에 숫자가 없어 적지 않았습니다.",
  },
  {
    label: "갈래 ① 기준 통과",
    summary: "10% → 100%",
    phase: "pass",
    note: "5분 동안 오류율이 기준 안에 있으면 새 버전을 전체 트래픽으로 넓힙니다. 숫자 사례의 '기준 통과 뒤 승격'입니다.",
  },
  {
    label: "갈래 ② 기준을 넘음",
    summary: "자동 중단 · 10%에서 멈춤",
    phase: "stop",
    note: "②는 ①과 같은 5분 관찰에서 갈라진 다른 결과입니다. 오류율이 기준을 넘으면 승격을 자동으로 멈추므로 새 버전은 100%로 넓어지지 않습니다. 멈춘 뒤 이전 버전으로 되돌리는 절차는 이 절이 따로 적지 않았습니다.",
  },
] as const satisfies readonly { label: string; summary: string; phase: Phase; note: string }[];

const CELLS = Array.from({ length: 100 }, (_, index) => index);

export default function CanaryStepViz() {
  return (
    <SceneShell
      eyebrow="10% 단계 배포"
      title="새 버전을 10%에 5분 먼저 보내고, 결과에 따라 넓히거나 멈춥니다"
      description="3절의 가정 사례입니다. 왼쪽 칸 100개는 요청 100건이고, 파란 칸이 새 버전을 받은 요청입니다. 3·4장면은 차례가 아니라 5분 뒤에 갈라지는 두 결과입니다."
      ariaLabel="요청 100건 중 10건을 새 버전에 보내 5분 동안 오류율을 보고, 통과하면 100%로 넓히고 넘으면 자동 중단하는 과정"
      scenes={SCENES}
      render={(active) => {
        const phase: Phase = SCENES[active].phase;
        const newCount = phase === "pass" ? 100 : NEW_SHARE;
        const stopped = phase === "stop";
        const watched = phase !== "first";
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={GRID_X} y={14} fontSize={10.5} fontWeight={700} fill={LABEL}>요청 100건(가정)</text>
            {CELLS.map((index) => {
              const col = index % 10;
              const row = Math.floor(index / 10);
              const isNew = index < newCount;
              return (
                <rect
                  key={index}
                  x={GRID_X + col * (CELL + GAP)}
                  y={GRID_Y + row * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={isNew ? (stopped ? "none" : ACCENT) : MUTED}
                  fillOpacity={isNew ? 1 : 0.35}
                  stroke={isNew && stopped ? RED : "none"}
                  strokeWidth={1.25}
                />
              );
            })}

            <g transform="translate(184 24)">
              <rect x={0} y={0} width={10} height={10} rx={2} fill={stopped ? "none" : ACCENT} stroke={stopped ? RED : "none"} strokeWidth={1.25} />
              <text x={16} y={9} fontSize={10.5} fill="currentColor">새 버전 {newCount}건</text>
              <rect x={0} y={18} width={10} height={10} rx={2} fill={MUTED} fillOpacity={0.35} />
              <text x={16} y={27} fontSize={10.5} fill="currentColor">기존 버전 {100 - newCount}건</text>

              <text x={0} y={60} fontSize={10.5} fontWeight={700} fill={LABEL}>오류율 관찰</text>
              <rect x={0} y={66} width={160} height={12} rx={3} fill={MUTED} fillOpacity={0.2} />
              <rect x={0} y={66} width={watched ? 160 : 0} height={12} rx={3} fill={ACCENT} fillOpacity={0.6} />
              <text x={0} y={92} fontSize={10} fill={LABEL}>0분</text>
              <text x={160} y={92} textAnchor="end" fontSize={10} fill={LABEL}>5분</text>
              <text x={0} y={110} fontSize={10} fill={LABEL}>기준값: 본문에 숫자 없음</text>

              {phase === "pass" ? (
                <text x={0} y={140} fontSize={11.5} fontWeight={700} fill={ACCENT}>① 통과 → 전체로 승격</text>
              ) : null}
              {stopped ? (
                <>
                  <text x={0} y={140} fontSize={11.5} fontWeight={700} fill={RED}>② 넘음 → 자동 중단</text>
                  <text x={0} y={158} fontSize={10} fill={LABEL}>100%로 넓히지 않음</text>
                </>
              ) : null}
              {phase === "watch" ? (
                <text x={0} y={140} fontSize={11} fill={LABEL}>5분 뒤 ①·② 중 하나로</text>
              ) : null}
            </g>
          </svg>
        );
      }}
    />
  );
}
