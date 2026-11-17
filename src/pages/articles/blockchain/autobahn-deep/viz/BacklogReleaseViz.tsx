import AutobahnSceneShell from "./AutobahnSceneShell";

/**
 * 본문 대응: #release 첫 두 문단 — 3초 blip 동안 네 차선이 20대씩 전진하면 cut 하나가 80대의 끝점을 가리킨다.
 * cut 메시지는 끝점 4개로 80대에 비례해 커지지 않지만, 80대의 수신·검증·실행은 남고,
 * 유입 부하가 처리 용량보다 크면 backlog는 계속 늘어난다.
 * 가정: blip 동안 일정하게 쌓임, cut은 t=3초에 커밋, 회복 뒤 유입 20대/초,
 * 처리 용량은 40대/초(여유) 또는 10대/초(부족).
 * 계산: 여유 80 + (20−40)×4 = 0 (t=7), 부족 80 + (20−10)×4 = 120 (t=7).
 */
const BACKLOG_AT_COMMIT = 4 * 20;
const INFLOW = 20;
const FAST_CAPACITY = 40;
const SLOW_CAPACITY = 10;
const AFTER_SECONDS = 4;
const FAST_END = Math.max(0, BACKLOG_AT_COMMIT + (INFLOW - FAST_CAPACITY) * AFTER_SECONDS);
const SLOW_END = BACKLOG_AT_COMMIT + (INFLOW - SLOW_CAPACITY) * AFTER_SECONDS;

const X0 = 44;
const X_PER_SECOND = 48;
const Y0 = 176;
const Y_PER_CAR = 1.2;
const x = (seconds: number) => X0 + seconds * X_PER_SECOND;
const y = (cars: number) => Y0 - cars * Y_PER_CAR;

interface ReleaseScene {
  label: string;
  summary: string;
  note: string;
  showBlip: boolean;
  showCommit: boolean;
  showFast: boolean;
  showSlow: boolean;
}

const SCENES: readonly ReleaseScene[] = [
  {
    label: "3초 정지 동안 쌓임",
    summary: "4차선 × 20대 = 80대",
    note: "합의가 3초 멈춘 동안에도 네 차선은 각각 자동차 20대씩 전진합니다. 아직 순서에 넣지 못한 자동차가 80대 쌓였습니다. 그래프는 일정하게 쌓인다고 단순화했습니다(가정).",
    showBlip: true,
    showCommit: false,
    showFast: false,
    showSlow: false,
  },
  {
    label: "cut 하나가 80대를 가리킴",
    summary: "cut 메시지: 끝점 4개",
    note: "cut 하나가 네 차선의 끝점만 담아 80대를 한 번에 순서에 넣으므로 메시지는 80대에 비례해 커지지 않습니다. 그러나 느린 노드가 빠진 자동차를 받고, hash·부모 연결을 확인하고, 실행할 일 80대분은 남습니다.",
    showBlip: true,
    showCommit: true,
    showFast: false,
    showSlow: false,
  },
  {
    label: "처리 용량이 유입보다 클 때",
    summary: `80 + (20 − 40) × 4 = ${FAST_END}`,
    note: "회복 뒤에도 새 거래가 초당 20대 들어오고, 수신·검증·실행을 합친 처리 용량이 초당 40대라고 가정합니다. 매초 20대씩 줄어 4초 뒤에야 남은 일이 0이 됩니다. 커밋 직후가 아니라 이때가 따라잡은 시점입니다.",
    showBlip: true,
    showCommit: true,
    showFast: true,
    showSlow: false,
  },
  {
    label: "유입이 처리 용량보다 클 때",
    summary: `80 + (20 − 10) × 4 = ${SLOW_END}`,
    note: "처리 용량이 초당 10대뿐이라면(가정) 매초 10대씩 더 쌓여 4초 뒤 120대가 됩니다. cut은 똑같이 빨리 커밋됐지만 backlog는 줄지 않고 계속 늘어납니다.",
    showBlip: true,
    showCommit: true,
    showFast: false,
    showSlow: true,
  },
];

const TICKS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const Y_TICKS = [0, 40, 80, 120] as const;

export default function BacklogReleaseViz() {
  return (
    <AutobahnSceneShell
      eyebrow="blip 뒤 회복 · 숫자는 설명용 가정"
      title="cut은 끝점 4개로 커밋돼도 쌓인 80대의 일은 따로 줄어듭니다"
      description="가로축은 시간(초), 세로축은 아직 수신·검증·실행을 끝내지 못한 자동차 수입니다. 0~3초가 합의가 멈춘 구간이고, cut은 3초에 커밋된다고 둡니다(가정)."
      note="80대는 본문의 예이고, 유입 20대/초와 처리 용량 40대/초·10대/초는 두 갈래를 보이려는 가정입니다."
      ariaLabel="blip 동안 쌓인 80대가 cut 커밋 뒤 처리 용량에 따라 줄거나 늘어나는 네 장면"
      playLabel="backlog 변화 재생"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox="0 0 400 214" className="mx-auto h-auto w-full max-w-[26rem]" role="img" aria-label="시간에 따른 남은 자동차 수">
              <rect x={x(0)} y={y(130)} width={x(3) - x(0)} height={Y0 - y(130)} fill="#94a3b8" fillOpacity={0.15} />
              <text x={x(1.5)} y={y(130) + 12} textAnchor="middle" fontSize="13" fill="#64748b">합의 정지 3초</text>
              {Y_TICKS.map((value) => (
                <g key={value}>
                  <line x1={X0} x2={x(7)} y1={y(value)} y2={y(value)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray={value === 0 ? undefined : "3 3"} />
                  <text x={X0 - 6} y={y(value) + 4} textAnchor="end" fontSize="13" fill="#64748b">{value}</text>
                </g>
              ))}
              {TICKS.map((second) => (
                <text key={second} x={x(second)} y={Y0 + 16} textAnchor="middle" fontSize="13" fill="#64748b">{second}초</text>
              ))}
              <text x={X0 - 6} y={y(130) - 2} textAnchor="end" fontSize="12" fill="#64748b">대</text>

              {scene.showBlip ? <line x1={x(0)} y1={y(0)} x2={x(3)} y2={y(BACKLOG_AT_COMMIT)} stroke="#2563eb" strokeWidth={1.25} /> : null}
              {scene.showBlip ? <circle cx={x(3)} cy={y(BACKLOG_AT_COMMIT)} r={4} fill="#2563eb" /> : null}
              {scene.showBlip ? <text x={x(3) - 6} y={y(BACKLOG_AT_COMMIT) - 8} textAnchor="end" fontSize="14" fontWeight="700" fill="#2563eb">80대</text> : null}

              {scene.showCommit ? <line x1={x(3)} x2={x(3)} y1={y(130)} y2={Y0} stroke="#d97706" strokeWidth={1.25} /> : null}
              {scene.showCommit ? <text x={x(3) + 6} y={y(118)} fontSize="13" fontWeight="700" fill="#b45309">cut 커밋 · 끝점 4개</text> : null}

              {scene.showFast ? <line x1={x(3)} y1={y(BACKLOG_AT_COMMIT)} x2={x(7)} y2={y(FAST_END)} stroke="#16a34a" strokeWidth={1.25} /> : null}
              {scene.showFast ? <circle cx={x(7)} cy={y(FAST_END)} r={4} fill="#16a34a" /> : null}
              {scene.showFast ? <text x={x(7) - 4} y={y(FAST_END + 25)} textAnchor="end" fontSize="14" fontWeight="700" fill="#15803d">7초 {FAST_END}대 · 따라잡음</text> : null}

              {scene.showSlow ? <line x1={x(3)} y1={y(BACKLOG_AT_COMMIT)} x2={x(7)} y2={y(SLOW_END)} stroke="#dc2626" strokeWidth={1.25} /> : null}
              {scene.showSlow ? <circle cx={x(7)} cy={y(SLOW_END)} r={4} fill="#dc2626" /> : null}
              {scene.showSlow ? <text x={x(7) - 4} y={y(SLOW_END) + 70} textAnchor="end" fontSize="14" fontWeight="700" fill="#b91c1c">7초 {SLOW_END}대 · 계속 증가</text> : null}
            </svg>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border px-2 py-2">
                <p className="text-[11px] font-semibold text-muted-foreground">합의가 싣는 것</p>
                <p className="mt-1 font-bold">{scene.showCommit ? "끝점 4개 (80대에 비례하지 않음)" : "아직 cut 없음"}</p>
              </div>
              <div className="rounded-lg border border-border px-2 py-2">
                <p className="text-[11px] font-semibold text-muted-foreground">노드가 처리할 것</p>
                <p className="mt-1 font-bold">
                  {scene.showFast ? `4초 뒤 ${FAST_END}대` : scene.showSlow ? `4초 뒤 ${SLOW_END}대` : `${BACKLOG_AT_COMMIT}대 수신·검증·실행`}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
