import SceneShell from "./SceneShell";

/**
 * 본문 대응: #leakage 둘째 문단 — label horizon이 길면 train label interval이 validation 구간과 겹친다.
 * 가정: row 시각 t는 그 row의 cutoff이고 label은 t부터 7일(글의 horizon 7일 예), H=7일, g=7일.
 * gap 0: c−3 row의 label [c−3, c+4)가 평가 구간 [c, c+7)과 4일 겹친다.
 * gap 7일: t < c−7인 row만 남아 마지막 c−8 row의 label은 [c−8, c−1)에서 끝난다.
 */
const HORIZON = 7;
const VAL = 7;

const SCENES = [
  { label: "row 하나의 모양", summary: "입력 시각 t + 뒤 7일 label", gap: null, rowT: -10, note: "학습 row 하나는 시각 t까지의 입력과 t 뒤 7일 동안의 정답을 함께 가집니다. 그래서 row의 시각이 경계 앞에 있어도 정답 구간은 앞으로 7일을 더 뻗습니다." },
  { label: "gap 없음", summary: "c−3 row의 label이 4일 겹침", gap: 0, rowT: -3, note: "t < c만 지키면 c−3 row도 학습에 들어갑니다. 이 row의 정답 구간은 c+4까지 이어져 평가 구간 [c, c+7)의 앞 4일과 겹칩니다. 평가 row가 입력으로 쓰는 시기의 정보가 학습 정답에 섞이는 경로입니다." },
  { label: "gap 7일 (가정)", summary: "마지막 row c−8 · label은 c−1에서 끝", gap: 7, rowT: -8, note: "t < c−7인 row만 학습에 두면 하루 단위 row 중 마지막은 c−8이고, 그 정답 구간은 c−1 직전에 끝납니다. c−7부터 c 직전까지의 row는 학습에도 평가에도 쓰지 않습니다. 이 폭은 끊으려는 경로가 label 확정인지 window overlap인지에 따라 정합니다." },
] as const;

const W = 360;
const H = 164;
const D0 = -14;
const D1 = 8;
const X0 = 16;
const X1 = 344;
const x = (day: number) => X0 + ((day - D0) / (D1 - D0)) * (X1 - X0);
const dayLabel = (day: number) => (day === 0 ? "c" : day > 0 ? `c+${day}` : `c${day}`.replace("-", "−"));

export default function PurgeGapViz() {
  return (
    <SceneShell
      eyebrow="Purge gap"
      title="정답 구간이 평가 구간에 닿지 않을 만큼 학습 경계를 당깁니다"
      description="가로축은 fold의 origin c 기준 날짜입니다. 학습 row의 label 길이 7일과 평가 구간 7일, gap 7일은 설명을 위한 가정입니다."
      ariaLabel="label horizon 때문에 학습 정답 구간이 평가 구간과 겹치는 경우와 gap으로 끊는 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const trainEnd = scene.gap === null ? 0 : -scene.gap;
        const labelEnd = scene.rowT + HORIZON;
        const overlap = Math.max(0, labelEnd);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={16} fontSize={11} fill="#334155">학습 row 시각</text>
            <rect x={x(D0)} y={22} width={x(trainEnd) - x(D0)} height={16} rx={3} fill="#0284c7" fillOpacity={scene.gap === null ? 0.35 : 0.8} />
            {scene.gap !== null && scene.gap > 0 && (
              <>
                <rect x={x(trainEnd)} y={22} width={x(0) - x(trainEnd)} height={16} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={(x(trainEnd) + x(0)) / 2} y={34} textAnchor="middle" fontSize={10} fill="#64748b">gap</text>
              </>
            )}
            <rect x={x(0)} y={22} width={x(VAL) - x(0)} height={16} rx={3} fill="#d97706" fillOpacity={0.8} />
            <text x={(x(0) + x(VAL)) / 2} y={34} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">평가</text>

            <text x={X0} y={70} fontSize={11} fill="#334155">예시 row</text>
            <rect x={x(scene.rowT)} y={84} width={x(labelEnd) - x(scene.rowT)} height={16} rx={3} fill="#475569" fillOpacity={0.15} stroke="#475569" strokeWidth={1} />
            {overlap > 0 && <rect x={x(0)} y={84} width={x(labelEnd) - x(0)} height={16} rx={3} fill="#dc2626" fillOpacity={0.3} stroke="#dc2626" strokeWidth={1} />}
            <circle cx={x(scene.rowT)} cy={92} r={4} fill="#0284c7" />
            <text x={(x(scene.rowT) + x(labelEnd)) / 2} y={116} textAnchor="middle" fontSize={10} fill="#475569">label 7일 · {dayLabel(scene.rowT)} ~ {dayLabel(labelEnd)}</text>
            {overlap > 0 && <text x={x(labelEnd) + 4} y={96} fontSize={10} fontWeight={700} fill="#dc2626">{overlap}일 겹침</text>}

            <line x1={x(0)} x2={x(0)} y1={20} y2={128} stroke="#dc2626" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={136} y2={136} stroke="#94a3b8" strokeWidth={1} />
            {[-14, -7, 0, 7].map((d) => (
              <text key={d} x={x(d)} y={151} textAnchor={d === -14 ? "start" : "middle"} fontSize={10} fill="#64748b">{dayLabel(d)}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
