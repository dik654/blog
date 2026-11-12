import SceneShell from "./CvSceneShell";

/**
 * 본문 대응: #split-family — 질문에 따라 학습·평가 칸이 어떻게 갈리는지.
 * 칸 = 한 대상(환자·병원)의 한 기간 기록 묶음. 대상 4개 × 기간 6개는 그림용 가정.
 * K-fold: 흩어진 칸 / 그룹: 대상 4 통째 / walk-forward: 기간 1~4 학습, 5~6 평가 /
 * 대상+시간: 대상 1~3의 기간 1~4로 학습, 대상 4의 기간 5~6 평가, 나머지 사용 안 함.
 */
type Role = "train" | "test" | "unused";

const GROUPS = 4;
const PERIODS = 6;
const LABEL_W = 56;
const LEFT = 10;
const TOP = 34;
const CW = 46;
const CH = 24;
const GAP = 3;
const cx = (period: number) => LEFT + LABEL_W + period * (CW + GAP);
const cy = (group: number) => TOP + group * (CH + GAP);
const ORIGIN_X = cx(4) - GAP / 2;

const KFOLD_TEST = new Set(["0-1", "1-4", "2-0", "2-3", "3-2", "0-5"]);

const roleOf = (scene: number, group: number, period: number): Role => {
  if (scene === 0) return KFOLD_TEST.has(`${group}-${period}`) ? "test" : "train";
  if (scene === 1) return group === 3 ? "test" : "train";
  if (scene === 2) return period >= 4 ? "test" : "train";
  if (group === 3) return period >= 4 ? "test" : "unused";
  return period >= 4 ? "unused" : "train";
};

const SCENES = [
  { label: "일반 K-fold", summary: "행을 섞어 일부를 평가로", note: "행들이 독립이고 같은 분포에서 왔다고 볼 수 있을 때의 출발점입니다. 평가 칸의 대상과 같은 대상의 다른 칸이 학습에 남으므로, 새 대상을 묻는 질문에는 익숙한 대상을 다시 알아본 성과가 섞일 수 있습니다." },
  { label: "새 대상", summary: "대상 하나를 통째로 격리", note: "대상 4의 모든 칸이 평가로 가고 학습에는 하나도 남지 않습니다. 대상 4는 학습에서 본 적 없는 대상이 됩니다." },
  { label: "미래 기간", summary: "과거로 학습 → 이후 평가", note: "세로선 왼쪽 기간으로만 학습하고 오른쪽 기간을 평가합니다. 기존 대상의 다음 기간을 묻는 walk-forward입니다." },
  { label: "새 병원의 미래", summary: "대상 분리 + 시간 방향", note: "평가는 대상 4의 이후 기간입니다. 대상 조건 때문에 대상 4의 과거 칸도, 시간 조건 때문에 다른 대상의 이후 칸도 학습에서 빠집니다. 한 조건만 지키면 다른 쪽 누수가 남을 수 있습니다." },
];

const LEGEND: readonly { role: Role; text: string }[] = [
  { role: "train", text: "학습" },
  { role: "test", text: "평가" },
  { role: "unused", text: "사용 안 함" },
];

function Cell({ x, y, w, h, role }: { x: number; y: number; w: number; h: number; role: Role }) {
  if (role === "train") return <rect x={x} y={y} width={w} height={h} rx={3} fill="#94a3b8" fillOpacity={0.4} stroke="#94a3b8" strokeWidth={1} />;
  if (role === "test") return <rect x={x} y={y} width={w} height={h} rx={3} fill="#2563eb" fillOpacity={0.8} stroke="#2563eb" strokeWidth={1.25} />;
  return <rect x={x} y={y} width={w} height={h} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />;
}

export default function SplitFamilyGridViz() {
  return (
    <SceneShell
      eyebrow="분할 방식"
      title="새로 만나는 것이 무엇이냐에 따라 평가 칸의 모양이 달라집니다"
      description="칸 하나는 한 대상(환자나 병원)의 한 기간 기록 묶음입니다. 대상 4개와 기간 6개는 그림을 위한 가정입니다."
      ariaLabel="일반 K-fold, 새 대상, 미래 기간, 새 병원의 미래에서 학습과 평가 칸의 배치"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {Array.from({ length: PERIODS }, (_, period) => (
            <text key={period} x={cx(period) + CW / 2} y={TOP - 8} textAnchor="middle" fontSize={10} fill="#64748b">
              기간 {period + 1}
            </text>
          ))}
          {Array.from({ length: GROUPS }, (_, group) => (
            <g key={group}>
              <text x={LEFT} y={cy(group) + 16} fontSize={11} fontWeight={700} fill="#475569">
                대상 {group + 1}
              </text>
              {Array.from({ length: PERIODS }, (_, period) => (
                <Cell key={period} x={cx(period)} y={cy(group)} w={CW} h={CH} role={roleOf(active, group, period)} />
              ))}
            </g>
          ))}
          {active >= 2 && (
            <g>
              <line x1={ORIGIN_X} x2={ORIGIN_X} y1={TOP - 4} y2={cy(GROUPS - 1) + CH + 6} stroke="#dc2626" strokeWidth={1.25} />
              <text x={ORIGIN_X} y={cy(GROUPS - 1) + CH + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">
                학습이 끝나는 시점
              </text>
            </g>
          )}
          {LEGEND.map((item, index) => (
            <g key={item.role} transform={`translate(${LEFT + index * 96}, 172)`}>
              <Cell x={0} y={0} w={18} h={12} role={item.role} />
              <text x={24} y={10} fontSize={10} fill="#475569">{item.text}</text>
            </g>
          ))}
        </svg>
      )}
    />
  );
}
