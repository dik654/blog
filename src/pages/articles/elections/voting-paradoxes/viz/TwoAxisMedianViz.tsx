import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — 쟁점이 둘이면 가운데가 축마다 달라지고, 합친 안이 도전을 이긴다는 보장이 없다.
 * 세 점의 좌표와 "가까울수록 좋아한다"는 모두 그림용 가정이다.
 * 갑(1,9)·을(5,1)·병(9,5) → 축별 가운데 5·5 → 합친 안 (5,5), 도전안 (7,3).
 * 을·병: 합친 안까지 4.0, 도전안까지 2.8. 갑: 5.7, 8.5.
 */
type Point = { x: number; y: number };
const VOTERS = [
  { name: "갑", x: 1, y: 9 },
  { name: "을", x: 5, y: 1 },
  { name: "병", x: 9, y: 5 },
] as const;
const MIDDLE: Point = { x: 5, y: 5 };
const CHALLENGER: Point = { x: 7, y: 3 };

const LEFT = 44;
const TOP = 12;
const SIZE = 210;
const px = (value: number) => LEFT + (value / 10) * SIZE;
const py = (value: number) => TOP + SIZE - (value / 10) * SIZE;
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const ACCENT = "#2563eb";
const WARN = "#d97706";
const LINE = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "세 사람의 최고점", summary: "한 줄에 놓기 어렵습니다", note: "가로는 세금, 세로는 복지입니다. 갑은 세금은 낮게, 복지는 높게 원합니다. 세 점과 수치는 그림을 위한 가정입니다." },
  { label: "세금 축의 가운데", summary: "1 · 5 · 9 → 5 (을)", note: "세 점을 세금 축으로 내리면 가운데는 을의 5입니다." },
  { label: "복지 축의 가운데", summary: "1 · 5 · 9 → 5 (병)", note: "복지 축으로 옮기면 가운데에 서는 사람이 을에서 병으로 바뀝니다. 두 축 모두 값이 5인 것은 그림의 좌표를 그렇게 잡았기 때문입니다." },
  { label: "각 축의 가운데를 합친 안", summary: "(5, 5)", note: "세금은 을에게서, 복지는 병에게서 가운데를 가져와 합친 안입니다. 세 사람 누구의 최고점도 아닙니다." },
  { label: "도전안이 2대 1로 이깁니다", summary: "(7, 3)이 (5, 5)를 이김", note: "최고점에 가까운 안을 좋아한다고 가정합니다. 칸의 숫자는 합친 안 → 도전안 거리입니다. 합친 안이 늘 진다는 뜻이 아니라 이긴다는 보장이 없다는 뜻입니다." },
] as const;

export default function TwoAxisMedianViz() {
  return (
    <SceneShell
      eyebrow="한 축이라는 전제"
      title="쟁점이 둘이면 가운데는 축마다 달라집니다"
      description="세금과 복지를 두 축으로 놓습니다. 최고점은 각자 가장 좋아하는 위치입니다. 세 사람의 위치와 수치는 모두 가정입니다."
      ariaLabel="세금과 복지 평면에서 축별 가운데를 합친 안이 도전안에 2대 1로 지는 예"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_11rem]">
        <svg viewBox="0 0 270 262" className="mx-auto h-auto w-full max-w-[250px] sm:max-w-[300px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={LEFT} y={TOP} width={SIZE} height={SIZE} fill="none" stroke={LINE} strokeWidth={1} />
          <text x={LEFT + SIZE / 2} y={TOP + SIZE + 34} textAnchor="middle" fontSize={12} fill={TEXT}>세금 (낮음 → 높음)</text>
          <text x={12} y={TOP + SIZE / 2} textAnchor="middle" fontSize={12} fill={TEXT} transform={`rotate(-90 12 ${TOP + SIZE / 2})`}>복지 (낮음 → 높음)</text>
          {active === 1 && VOTERS.map((voter) => (
            <g key={voter.name}>
              <line x1={px(voter.x)} x2={px(voter.x)} y1={py(voter.y)} y2={TOP + SIZE} stroke={voter.name === "을" ? ACCENT : LINE} strokeWidth={1} strokeDasharray="3 3" />
              <text x={px(voter.x)} y={TOP + SIZE + 16} textAnchor="middle" fontSize={12} fontWeight={voter.name === "을" ? 700 : 400} fill={voter.name === "을" ? ACCENT : TEXT}>{voter.x}</text>
            </g>
          ))}
          {active === 2 && VOTERS.map((voter) => (
            <g key={voter.name}>
              <line x1={LEFT} x2={px(voter.x)} y1={py(voter.y)} y2={py(voter.y)} stroke={voter.name === "병" ? ACCENT : LINE} strokeWidth={1} strokeDasharray="3 3" />
              <text x={LEFT - 6} y={py(voter.y) + 4} textAnchor="end" fontSize={12} fontWeight={voter.name === "병" ? 700 : 400} fill={voter.name === "병" ? ACCENT : TEXT}>{voter.y}</text>
            </g>
          ))}
          {active === 3 && (
            <g stroke={ACCENT} strokeWidth={1} strokeDasharray="3 3">
              <line x1={px(MIDDLE.x)} x2={px(MIDDLE.x)} y1={py(MIDDLE.y)} y2={TOP + SIZE} />
              <line x1={LEFT} x2={px(MIDDLE.x)} y1={py(MIDDLE.y)} y2={py(MIDDLE.y)} />
            </g>
          )}
          {active === 4 && VOTERS.map((voter) => {
            const toMiddle = distance(voter, MIDDLE);
            const toChallenger = distance(voter, CHALLENGER);
            const prefersChallenger = toChallenger < toMiddle;
            const target = prefersChallenger ? CHALLENGER : MIDDLE;
            return (
              <line key={voter.name} x1={px(voter.x)} y1={py(voter.y)} x2={px(target.x)} y2={py(target.y)} stroke={prefersChallenger ? WARN : LINE} strokeWidth={1} />
            );
          })}
          {VOTERS.map((voter) => (
            <g key={voter.name}>
              <circle cx={px(voter.x)} cy={py(voter.y)} r={6} fill={TEXT} />
              <text x={voter.name === "갑" ? px(voter.x) + 10 : voter.name === "을" ? px(voter.x) - 10 : px(voter.x)} y={voter.name === "병" ? py(voter.y) - 10 : py(voter.y) + 4} textAnchor={voter.name === "갑" ? "start" : voter.name === "을" ? "end" : "middle"} fontSize={13} fontWeight={700} fill={TEXT}>{voter.name}</text>
            </g>
          ))}
          {active >= 3 && (
            <g>
              <rect x={px(MIDDLE.x) - 6} y={py(MIDDLE.y) - 6} width={12} height={12} fill={ACCENT} />
              <text x={px(MIDDLE.x) + 10} y={py(MIDDLE.y) + 4} textAnchor="start" fontSize={13} fontWeight={700} fill={ACCENT}>합친 안</text>
            </g>
          )}
          {active === 4 && (
            <g>
              <path d={`M${px(CHALLENGER.x)} ${py(CHALLENGER.y) - 8} L${px(CHALLENGER.x) + 8} ${py(CHALLENGER.y) + 6} L${px(CHALLENGER.x) - 8} ${py(CHALLENGER.y) + 6} Z`} fill={WARN} />
              <text x={px(CHALLENGER.x) + 12} y={py(CHALLENGER.y) + 16} textAnchor="start" fontSize={13} fontWeight={700} fill={WARN}>도전안</text>
            </g>
          )}
        </svg>
        <div className={`grid grid-cols-3 gap-1 text-center text-xs leading-5 sm:grid-cols-1 ${active === 4 ? "" : "invisible"}`}>
          {VOTERS.map((voter) => {
            const toMiddle = distance(voter, MIDDLE);
            const toChallenger = distance(voter, CHALLENGER);
            return (
              <span key={voter.name} className="rounded border border-border px-1 py-0.5">
                <strong>{voter.name}</strong> {toMiddle.toFixed(1)} → {toChallenger.toFixed(1)}
                <span className="block text-muted-foreground">{toChallenger < toMiddle ? "도전안" : "합친 안"} 선택</span>
              </span>
            );
          })}
        </div>
        </div>
      )}
    />
  );
}
