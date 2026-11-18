import SceneShell from "./SceneShell";

/**
 * 본문 대응: #accounting — inactivity 추가 penalty가 참여하지 않는 weight의 비중을 줄여
 * 남은 정상 참여가 다시 2/3 threshold를 만들게 하는 feedback.
 * 참여 60, 불참 40 → 35 → 30 (모두 가정). 3×60 = 180 vs 2×합계 200 → 190 → 180.
 */
const PARTICIPATING = 60;
const SCALE = 100;

const SCENES = [
  { label: "참여가 모자람", summary: "3×60=180 < 2×100=200", absent: 40, note: "정상 참여 60, 불참 40으로 둡니다(가정). 참여 막대 끝이 2/3 선에 닿지 못해 threshold를 만들지 못합니다." },
  { label: "불참 weight가 줄어듦", summary: "3×60=180 < 2×95=190", absent: 35, note: "Finality가 지연되는 동안 timely target에 참여한 쪽은 score가 회복되고, 불참한 쪽은 추가 penalty를 받습니다. 불참 weight가 줄면 전체가 줄어 2/3 선이 왼쪽으로 옵니다. 한 번 결석했다고 즉시 퇴출하는 timer는 아닙니다." },
  { label: "다시 threshold", summary: "3×60=180 = 2×90=180", absent: 30, note: "불참 weight가 30까지 줄면 참여 60이 전체 90의 2/3과 같아져 다시 threshold를 만듭니다. 줄어드는 폭과 걸리는 epoch 수는 설명용 가정이라 시간축을 그리지 않았습니다." },
] as const;

const W = 360;
const H = 120;
const LEFT = 12;
const RIGHT = 12;
const BAR_Y = 46;
const BAR_H = 26;
const px = (value: number) => LEFT + (value / SCALE) * (W - LEFT - RIGHT);

export default function InactivityWeightViz() {
  return (
    <SceneShell
      eyebrow="Inactivity feedback"
      title="불참 weight가 줄면 같은 참여가 다시 2/3이 됩니다"
      description="막대 전체가 active weight(설명용 단위)입니다. 파란 칸은 timely target에 참여한 weight, 회색 칸은 참여하지 않은 weight, 세로선은 그때 전체의 2/3 위치입니다. 모든 숫자는 가정입니다."
      ariaLabel="불참 weight가 40에서 30으로 줄며 참여 60이 2/3 threshold에 다시 닿는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const total = PARTICIPATING + scene.absent;
        const threshold = (total * 2) / 3;
        const reached = 3 * PARTICIPATING >= 2 * total;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={px(0)} y={BAR_Y} width={px(PARTICIPATING) - px(0)} height={BAR_H} fill="#2563eb" />
            <rect x={px(PARTICIPATING)} y={BAR_Y} width={px(total) - px(PARTICIPATING)} height={BAR_H} fill="#cbd5e1" />
            <rect x={px(total)} y={BAR_Y} width={px(SCALE) - px(total)} height={BAR_H} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <text x={px(PARTICIPATING / 2)} y={BAR_Y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">참여 60</text>
            <text x={px(PARTICIPATING + scene.absent / 2)} y={BAR_Y + 17} textAnchor="middle" fontSize={11} fill="#334155">불참 {scene.absent}</text>
            {scene.absent < 40 && (
              <text x={px((total + SCALE) / 2)} y={BAR_Y + 17} textAnchor="middle" fontSize={10} fill="#64748b">−{40 - scene.absent}</text>
            )}
            <line x1={px(threshold)} x2={px(threshold)} y1={BAR_Y - 16} y2={BAR_Y + BAR_H + 8} stroke={reached ? "#16a34a" : "#dc2626"} strokeWidth={1.25} />
            <text x={px(threshold)} y={BAR_Y - 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={reached ? "#166534" : "#991b1b"}>
              2/3 = {Number.isInteger(threshold) ? threshold : threshold.toFixed(1)}
            </text>
            <text x={px(0)} y={BAR_Y + BAR_H + 26} fontSize={11} fill="#64748b">합계 {total}</text>
            <text x={px(SCALE)} y={BAR_Y + BAR_H + 26} textAnchor="end" fontSize={11} fontWeight={700} fill={reached ? "#166534" : "#991b1b"}>
              {reached ? "threshold 통과" : "threshold 미달"}
            </text>
          </svg>
        );
      }}
    />
  );
}
