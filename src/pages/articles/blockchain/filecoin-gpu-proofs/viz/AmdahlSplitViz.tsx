import SceneShell from "./SceneShell";

/**
 * 본문 대응: #accelerator-split — f=0.4, s=4 (설명용 수치).
 * 남는 시간 = (1−f) + f/s = 0.6 + 0.1 = 0.7 → S ≤ 1/0.7 ≈ 1.43배.
 * s가 한없이 커져도 남는 시간은 0.6 → 1/0.6 ≈ 1.67배를 넘지 못한다 (같은 식의 산술).
 */
const F = 0.4;
const S = 4;
const REST = 1 - F; // 0.6

const X0 = 16;
const SPAN = 328;
const px = (t: number) => X0 + t * SPAN;
const BAR_Y = 40;
const BAR_H = 34;

const GRAY = "#64748b";
const VIOLET = "#7c3aed";
const MUTED = "#94a3b8";

const SCENES = [
  { label: "reference 시간을 둘로 나눕니다", summary: "1 = 0.6 + 0.4", accel: F, note: "막대 전체가 CPU reference 한 번의 측정 시간입니다. 그중 40%가 GPU 후보가 대신하는 구간(f = 0.4)이고, 나머지 60%는 cache I/O·synthesis·검증처럼 그대로 남는 몫입니다." },
  { label: "가속 구간이 4배 빨라지면", summary: "0.6 + 0.4/4 = 0.7 → 1.43배", accel: F / S, note: "가속 구간만 4배(s = 4) 빨라져 0.4가 0.1로 줄어듭니다. 전체는 0.7이 되고, 1/0.7 = 1.43배가 상한입니다." },
  { label: "GPU를 아무리 빠르게 해도", summary: "남는 0.6 → 1/0.6 ≈ 1.67배", accel: 0, note: "s를 한없이 키워 0.4가 0에 가까워져도 회색 0.6은 그대로입니다. 그래서 같은 식으로 계산한 상한은 1/0.6 ≈ 1.67배입니다. 모두 설명용 수치이며 Filecoin의 고정 비율이 아닙니다." },
] as const;

export default function AmdahlSplitViz() {
  return (
    <SceneShell
      eyebrow="일부만 가속할 때"
      title="가속하지 못한 회색 몫이 전체 speedup의 천장을 정합니다"
      description="f는 reference 시간 중 GPU 후보가 대신하는 비율, s는 그 구간만의 speedup입니다. 본문의 설명용 수치 f = 0.4, s = 4를 씁니다."
      ariaLabel="reference 시간 0.6과 0.4로 나눈 뒤 0.4 구간만 줄였을 때 전체 시간과 speedup 상한"
      scenes={SCENES}
      render={(active) => {
        const accel = SCENES[active].accel;
        const total = REST + accel;
        return (
          <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={BAR_Y - 22} fontSize={10.5} fontWeight={700} fill="#334155">{active === 0 ? "CPU reference" : "GPU 후보 적용 후"}</text>
            <rect x={px(0)} y={BAR_Y} width={px(1) - px(0)} height={BAR_H} rx={3} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />
            <rect x={px(0) + 0.5} y={BAR_Y + 0.5} width={px(REST) - px(0) - 1} height={BAR_H - 1} rx={3} fill={GRAY} fillOpacity={0.8} />
            <text x={(px(0) + px(REST)) / 2} y={BAR_Y + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">가속 못 한 몫 0.6</text>
            <text x={(px(0) + px(REST)) / 2} y={BAR_Y + 28} textAnchor="middle" fontSize={9.5} fill="#ffffff">I/O · synthesis · 검증</text>
            {accel > 0 && (
              <rect x={px(REST) + 0.5} y={BAR_Y + 0.5} width={px(REST + accel) - px(REST) - 1} height={BAR_H - 1} rx={3} fill={VIOLET} fillOpacity={0.8} />
            )}
            {accel > 0 && (
              <text x={(px(REST) + px(REST + accel)) / 2} y={BAR_Y + 21} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">{accel === F ? "GPU 후보 0.4" : "0.1"}</text>
            )}
            {active > 0 && (
              <text x={(px(REST + accel) + px(1)) / 2} y={BAR_Y + 21} textAnchor="middle" fontSize={10} fill={MUTED}>{active === 1 ? "줄어든 0.3" : "0.4 → 0에 가까움"}</text>
            )}
            <line x1={px(total)} x2={px(total)} y1={BAR_Y - 14} y2={BAR_Y + BAR_H + 8} stroke="#334155" strokeWidth={1} />
            <text x={px(total)} y={BAR_Y - 6} textAnchor={active === 0 ? "end" : "middle"} fontSize={10.5} fontWeight={700} fill="#334155">끝 {total.toFixed(1)}</text>
            {[0, 0.6, 1].map((t) => (
              <text key={t} x={px(t)} y={BAR_Y + BAR_H + 18} textAnchor={t === 0 ? "start" : t === 1 ? "end" : "middle"} fontSize={9} fill={GRAY}>{t}</text>
            ))}
            <text x={180} y={136} textAnchor="middle" fontSize={11} fontWeight={700} fill={active === 0 ? GRAY : VIOLET}>
              {active === 0 && "speedup = 1 (기준)"}
              {active === 1 && "S ≤ 1 / 0.7 ≈ 1.43배"}
              {active === 2 && "S < 1 / 0.6 ≈ 1.67배"}
            </text>
          </svg>
        );
      }}
    />
  );
}
