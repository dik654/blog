import SceneShell from "./SceneShell";

/**
 * 본문 대응: #opportunity-cost 의 접힌 설명 — 빵집 하루 8시간, 빵 한 판 1시간, 케이크 하나 2시간.
 * 시간을 남김없이 쓰는 조합: 빵 = 8 − 2 × 케이크 → (0,8) (1,6) (2,4) (3,2) (4,0).
 * 안쪽·바깥쪽 점과 마지막 장면의 휜 곡선 모양은 글에 숫자가 없어 고른 예입니다(가정).
 */
const HOURS = 8;
const BREAD_H = 1;
const CAKE_H = 2;
const MAX_CAKE = HOURS / CAKE_H;
const MAX_BREAD = HOURS / BREAD_H;
const breadAt = (cake: number) => (HOURS - CAKE_H * cake) / BREAD_H;
const FULL = Array.from({ length: MAX_CAKE + 1 }, (_, cake) => ({ cake, bread: breadAt(cake) }));

/** 안쪽 예(가정): 케이크 1·빵 4 → 6시간. 바깥쪽 예(가정): 케이크 2·빵 6 → 10시간. */
const INSIDE = { cake: 1, bread: 4 };
const OUTSIDE = { cake: 2, bread: 6 };
const hoursOf = (p: { cake: number; bread: number }) => p.cake * CAKE_H + p.bread * BREAD_H;

const W = 360;
const H = 214;
const X0 = 46;
const X1 = 318;
const Y0 = 184;
const Y1 = 18;
const sx = (cake: number) => X0 + (cake / MAX_CAKE) * (X1 - X0);
const sy = (bread: number) => Y0 - (bread / MAX_BREAD) * (Y0 - Y1);

/** 바깥으로 휜 모양 예시(가정): 끝점은 직선과 같게 두고 사분 타원으로 그립니다. 숫자는 표시하지 않습니다. */
const bowBread = (cake: number) => MAX_BREAD * Math.sqrt(Math.max(0, 1 - (cake / MAX_CAKE) ** 2));
const BOW_PATH = Array.from({ length: 41 }, (_, i) => (i / 40) * MAX_CAKE)
  .map((cake, i) => `${i === 0 ? "M" : "L"}${sx(cake).toFixed(1)},${sy(bowBread(cake)).toFixed(1)}`)
  .join(" ");
const BOW_STEPS = [
  { from: 0.5, to: 1.5, label: "포기 적음" },
  { from: 2.5, to: 3.5, label: "포기 많음" },
] as const;

const INK = "#475569";
const MUTED = "#94a3b8";
const LINE = "#2563eb";
const OK = "#16a34a";
const WARN = "#dc2626";
const AMBER = "#d97706";

const SCENES = [
  {
    label: "끝점 두 개",
    summary: "빵 8판 또는 케이크 4개",
    note: "8시간을 전부 빵에 쓰면 8판, 전부 케이크에 쓰면 4개입니다. 가로축은 케이크 개수, 세로축은 빵 판 수입니다.",
  },
  {
    label: "시간을 남김없이 쓰는 조합",
    summary: "빵 1시간×판 + 케이크 2시간×개 = 8시간",
    note: "케이크가 하나 늘 때마다 빵이 두 판 줍니다. 시간을 다 쓰는 이 조합들을 이은 선을 생산가능곡선이라고 부릅니다.",
  },
  {
    label: "선 안쪽과 바깥쪽",
    summary: `안쪽 ${hoursOf(INSIDE)}시간 · 바깥쪽 ${hoursOf(OUTSIDE)}시간`,
    note: `케이크 ${INSIDE.cake}·빵 ${INSIDE.bread}판은 ${hoursOf(INSIDE)}시간만 써서 ${HOURS - hoursOf(INSIDE)}시간이 남고, 케이크 ${OUTSIDE.cake}·빵 ${OUTSIDE.bread}판은 ${hoursOf(OUTSIDE)}시간이 들어 닿지 않습니다. 두 점은 고른 예입니다(가정).`,
  },
  {
    label: "기울기가 곧 값입니다",
    summary: "케이크 +1 → 빵 −2",
    note: "케이크를 하나 더 만들려면 빵 두 판을 포기해야 합니다. 그래서 케이크 한 개의 기회비용은 빵 두 판이고, 선의 기울기가 그 값입니다.",
  },
  {
    label: "실제로는 바깥으로 휩니다",
    summary: "옮길수록 포기하는 빵이 늚 (모양 예시)",
    note: "글에 숫자가 없어 모양만 그렸습니다(가정). 빵을 많이 만들던 쪽에서 케이크로 옮길수록 케이크 하나에 포기하는 빵이 늘어납니다.",
  },
] as const;

export default function PpfSlopeViz() {
  return (
    <SceneShell
      eyebrow="포기한 최선을 그림으로"
      title="빵과 케이크 사이의 경계선과 그 기울기"
      description="빵집의 하루 8시간을 빵(한 판 1시간)과 케이크(하나 2시간)에 나눕니다. 점 하나가 하루 조합 하나입니다."
      note="직선은 빵과 케이크에 드는 시간이 언제나 같다고 둔 경우입니다."
      ariaLabel="빵집 8시간의 생산가능곡선과 기울기"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {/* 축 */}
          <line x1={X0} y1={Y0} x2={X1 + 8} y2={Y0} stroke={MUTED} strokeWidth={1} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 6} stroke={MUTED} strokeWidth={1} />
          {FULL.map((p) => (
            <text key={`xt${p.cake}`} x={sx(p.cake)} y={Y0 + 14} textAnchor="middle" fontSize={10} fill={INK}>
              {p.cake}
            </text>
          ))}
          {[0, 2, 4, 6, 8].map((b) => (
            <text key={`yt${b}`} x={X0 - 8} y={sy(b) + 3.5} textAnchor="end" fontSize={10} fill={INK}>
              {b}
            </text>
          ))}
          <text x={X1 + 8} y={Y0 + 28} textAnchor="end" fontSize={10} fill={INK}>
            케이크(개)
          </text>
          <text x={X0 + 6} y={Y1 - 2} fontSize={10} fill={INK}>
            빵(판)
          </text>

          {/* 장면 0: 끝점 */}
          {active === 0 && (
            <>
              <circle cx={sx(0)} cy={sy(MAX_BREAD)} r={5} fill={LINE} />
              <text x={sx(0) + 10} y={sy(MAX_BREAD) + 4} fontSize={10.5} fontWeight={700} fill={LINE}>
                빵 8판 · 케이크 0 (8×1시간)
              </text>
              <circle cx={sx(MAX_CAKE)} cy={sy(0)} r={5} fill={LINE} />
              <text x={sx(MAX_CAKE)} y={sy(0) - 12} textAnchor="end" fontSize={10.5} fontWeight={700} fill={LINE}>
                빵 0 · 케이크 4개 (4×2시간)
              </text>
            </>
          )}

          {/* 장면 1~3: 직선 */}
          {active >= 1 && active <= 3 && (
            <>
              <line x1={sx(0)} y1={sy(MAX_BREAD)} x2={sx(MAX_CAKE)} y2={sy(0)} stroke={LINE} strokeWidth={1.25} />
              {FULL.map((p) => (
                <g key={`p${p.cake}`}>
                  <circle cx={sx(p.cake)} cy={sy(p.bread)} r={4} fill={LINE} />
                  {active === 1 && (
                    <text x={sx(p.cake) + 8} y={sy(p.bread) - 6} fontSize={10} fill={LINE}>
                      ({p.cake},{p.bread})
                    </text>
                  )}
                </g>
              ))}
            </>
          )}

          {active === 2 && (
            <>
              <circle cx={sx(INSIDE.cake)} cy={sy(INSIDE.bread)} r={5} fill="none" stroke={AMBER} strokeWidth={1.25} />
              <text x={sx(INSIDE.cake) - 8} y={sy(INSIDE.bread) + 20} textAnchor="start" fontSize={10} fontWeight={700} fill={AMBER}>
                안쪽: {hoursOf(INSIDE)}시간, {HOURS - hoursOf(INSIDE)}시간 남음
              </text>
              <circle cx={sx(OUTSIDE.cake)} cy={sy(OUTSIDE.bread)} r={5} fill="none" stroke={WARN} strokeWidth={1.25} strokeDasharray="2 2" />
              <text x={sx(OUTSIDE.cake) + 9} y={sy(OUTSIDE.bread) - 6} fontSize={10} fontWeight={700} fill={WARN}>
                바깥쪽: {hoursOf(OUTSIDE)}시간 필요, 닿지 않음
              </text>
            </>
          )}

          {active === 3 && (
            <>
              <line x1={sx(1)} y1={sy(6)} x2={sx(2)} y2={sy(6)} stroke={OK} strokeWidth={1.25} />
              <line x1={sx(2)} y1={sy(6)} x2={sx(2)} y2={sy(4)} stroke={WARN} strokeWidth={1.25} />
              <text x={(sx(1) + sx(2)) / 2} y={sy(6) - 7} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={OK}>
                케이크 +1
              </text>
              <text x={sx(2) + 7} y={(sy(6) + sy(4)) / 2 + 4} fontSize={10.5} fontWeight={700} fill={WARN}>
                빵 −2
              </text>
              <line x1={sx(3)} y1={sy(2)} x2={sx(4)} y2={sy(2)} stroke={OK} strokeWidth={1.25} />
              <line x1={sx(4)} y1={sy(2)} x2={sx(4)} y2={sy(0)} stroke={WARN} strokeWidth={1.25} />
              <text x={sx(3) - 10} y={sy(2) + 16} textAnchor="end" fontSize={10} fill={INK}>
                어디서든 같은 기울기
              </text>
            </>
          )}

          {active === 4 && (
            <>
              <line x1={sx(0)} y1={sy(MAX_BREAD)} x2={sx(MAX_CAKE)} y2={sy(0)} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
              <path d={BOW_PATH} fill="none" stroke={LINE} strokeWidth={1.25} />
              {BOW_STEPS.map((st) => (
                <g key={st.label}>
                  <line x1={sx(st.from)} y1={sy(bowBread(st.from))} x2={sx(st.to)} y2={sy(bowBread(st.from))} stroke={OK} strokeWidth={1.25} />
                  <line x1={sx(st.to)} y1={sy(bowBread(st.from))} x2={sx(st.to)} y2={sy(bowBread(st.to))} stroke={WARN} strokeWidth={1.25} />
                  <text x={sx(st.to) + 6} y={(sy(bowBread(st.from)) + sy(bowBread(st.to))) / 2 + 4} fontSize={10} fontWeight={700} fill={WARN}>
                    {st.label}
                  </text>
                </g>
              ))}
              <text x={X0 + 10} y={Y0 - 10} fontSize={9.5} fill={INK}>
                점선: 앞의 직선 · 실선: 휜 모양 예시(가정)
              </text>
            </>
          )}
        </svg>
      )}
    />
  );
}
