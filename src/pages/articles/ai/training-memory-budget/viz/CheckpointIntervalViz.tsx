import SceneShell from "./SceneShell";

/**
 * 본문 대응: #checkpointing — 간격 k를 바꾸면 기준점 수 n/k와 복원 값 수 k가 반대로 움직인다.
 * n=9 층 연쇄, 마지막 구간을 복원하는 순간의 슬롯.
 * k=1: 9+1=10, k=3: 3+3=6, k=9: 1+9=10 (글의 근사식 S(k)≈n/k+k).
 */
const N = 9;

const SCENES = [
  {
    label: "간격 1",
    summary: "9/1 + 1 = 10칸",
    k: 1,
    note: "모든 층의 입력 x₀~x₈을 기준점으로 남깁니다. 구간이 한 층이라 한 번에 복원할 값은 1개뿐이지만, 계속 보관할 기준점이 9개입니다. 입력 x₀까지 세므로 앞 절의 '출력 9개 저장'보다 한 칸 많은 근사식 값입니다.",
  },
  {
    label: "간격 3",
    summary: "9/3 + 3 = 6칸",
    k: 3,
    note: "기준점 x₀·x₃·x₆ 3개를 보관하고, 마지막 구간을 복원할 때 x₇·x₈·x₉ 3개가 더 생깁니다. 두 장부가 같아지는 √9=3에서 합이 가장 작습니다.",
  },
  {
    label: "간격 9",
    summary: "9/9 + 9 = 10칸",
    k: 9,
    note: "기준점은 입력 x₀ 하나뿐입니다. 대신 역방향 계산 직전에 x₁~x₉ 9개를 한꺼번에 복원해야 합니다. 간격을 넓히면 기준점은 줄지만 한 번에 복원할 값이 늘어납니다.",
  },
] as const;

const ANCHOR = "#059669";
const REPLAY = "#d97706";
const EMPTY = "#94a3b8";
const INK = "#64748b";
const LINE = "#2563eb";

const W = 360;
const CELL = 30;
const CELL_GAP = 3;
const ROW_X = (W - (10 * CELL + 9 * CELL_GAP)) / 2;
const ROW_Y = 22;

/** 곡선 영역 */
const PX0 = 40;
const PX1 = 340;
const PY0 = 216;
const PY1 = 112;
const Y_MAX = 10;
const kx = (k: number) => PX0 + ((k - 1) / (N - 1)) * (PX1 - PX0);
const sy = (s: number) => PY0 - (s / Y_MAX) * (PY0 - PY1);
const slots = (k: number) => N / k + k;
const CURVE = Array.from({ length: 81 }, (_, i) => 1 + (i * (N - 1)) / 80)
  .map((k, i) => `${i === 0 ? "M" : "L"}${kx(k).toFixed(1)},${sy(slots(k)).toFixed(1)}`)
  .join(" ");

function cellState(k: number, index: number) {
  const lastStart = N - k;
  if (index <= lastStart && index % k === 0) return "anchor";
  if (index > lastStart) return "replay";
  return "empty";
}

export default function CheckpointIntervalViz() {
  return (
    <SceneShell
      eyebrow="체크포인트 간격"
      title="간격을 좁혀도 넓혀도 동시에 들고 있는 칸이 늘어납니다"
      description="아홉 층 연쇄에서 마지막 구간을 복원하는 순간을 셉니다. 간격 k는 기준점 사이에 다시 실행할 층 수입니다. 칸 하나는 단순화한 층 출력 하나(128B)이고, 아래 곡선은 이 절의 근사식 S(k)≈9/k+k입니다."
      note="각 층의 크기가 같고 연쇄 구조이며 층 출력 하나만 센다는 이 글의 교육용 근사입니다. 실제 최고치는 분기·attention 중간 텐서·프레임워크 내부 저장값에 따라 달라집니다."
      ariaLabel="체크포인트 간격 1, 3, 9에서 기준점 수와 복원 값 수, 그 합"
      scenes={SCENES}
      render={(active) => {
        const { k } = SCENES[active];
        const anchors = N / k;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 244`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: 기준점 ${anchors}개, 복원 ${k}개`}>
              {Array.from({ length: 10 }, (_, index) => {
                const state = cellState(k, index);
                const color = state === "anchor" ? ANCHOR : state === "replay" ? REPLAY : EMPTY;
                const x = ROW_X + index * (CELL + CELL_GAP);
                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={ROW_Y}
                      width={CELL}
                      height={CELL}
                      rx={4}
                      fill={color}
                      fillOpacity={state === "empty" ? 0.06 : 0.22}
                      stroke={color}
                      strokeWidth={1}
                      strokeDasharray={state === "empty" ? "3 2" : undefined}
                    />
                    <text x={x + CELL / 2} y={ROW_Y + 19} textAnchor="middle" fontSize={10} fontWeight={700} fill={state === "empty" ? EMPTY : INK}>
                      x{index}
                    </text>
                  </g>
                );
              })}
              <text x={ROW_X} y={ROW_Y + CELL + 16} fontSize={11.5} fontWeight={700} fill={ANCHOR}>
                기준점 {anchors}개
              </text>
              <text x={W - ROW_X} y={ROW_Y + CELL + 16} textAnchor="end" fontSize={11.5} fontWeight={700} fill={REPLAY}>
                복원한 값 {k}개
              </text>
              <text x={W / 2} y={ROW_Y + CELL + 32} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={INK}>
                동시에 {anchors + k}칸
              </text>

              <line x1={PX0} x2={PX1} y1={PY0} y2={PY0} stroke={EMPTY} strokeWidth={1} />
              <line x1={PX0} x2={PX0} y1={PY0} y2={PY1 - 4} stroke={EMPTY} strokeWidth={1} />
              {[0, 5, 10].map((v) => (
                <text key={v} x={PX0 - 6} y={sy(v) + 3} textAnchor="end" fontSize={10.5} fill={INK}>
                  {v}
                </text>
              ))}
              <text x={PX0 + 14} y={PY1 - 8} fontSize={10.5} fill={INK}>
                칸 수 S(k)
              </text>
              <path d={CURVE} fill="none" stroke={LINE} strokeWidth={1.25} />
              {SCENES.map((scene, i) => (
                <g key={scene.k}>
                  <circle cx={kx(scene.k)} cy={sy(slots(scene.k))} r={i === active ? 5 : 3} fill={i === active ? LINE : "#ffffff"} stroke={LINE} strokeWidth={1} />
                  <text x={kx(scene.k)} y={PY0 + 14} textAnchor="middle" fontSize={10.5} fontWeight={i === active ? 700 : 400} fill={INK}>
                    k={scene.k}
                  </text>
                </g>
              ))}
            </svg>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="font-semibold" style={{ color: ANCHOR }}>■</span> 계속 보관하는 기준점</span>
              <span><span className="font-semibold" style={{ color: REPLAY }}>■</span> 마지막 구간에서 다시 만든 값</span>
              <span>점선 칸: 지금은 없음</span>
            </div>
          </div>
        );
      }}
    />
  );
}
