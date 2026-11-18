import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 만기 지급 0·0·10에서 주가 100의 한 칸 전 값 0.2를 얻는다.
 * 두 번째 차분 (10−2×0+0)÷10²=0.1 = 2×(양옆 평균 5 − 가운데 0)÷100.
 * 굽음 몫 0.5×0.2²×100²×0.1=20, 한 칸 전 값 0+20×0.01=0.2 (금리 0, 가정).
 */
const W = 360;
const H = 200;
const X0 = 46;
const X1 = 340;
const Y0 = 166;
const Y1 = 22;
const S_MIN = 85;
const S_MAX = 115;
const V_MAX = 12;
const sx = (s: number) => X0 + ((s - S_MIN) / (S_MAX - S_MIN)) * (X1 - X0);
const vy = (v: number) => Y0 - (v / V_MAX) * (Y0 - Y1);

const PAYOFF = [
  { s: 90, v: 0 },
  { s: 100, v: 0 },
  { s: 110, v: 10 },
] as const;

const SCENES = [
  { label: "만기 지급 세 점", summary: "90·100·110 → 0·0·10", note: "행사가 100 콜은 만기에 주가에서 100을 뺀 값을 받되 음수면 0입니다. 세 점을 이으면 100에서 꺾인 모양이 됩니다. 이 꺾임이 2절에서 말한 굽음입니다." },
  { label: "가운데 굽음 0.1", summary: "(10−2×0+0)÷10²=0.1", note: "양옆 값 0과 10의 평균은 5인데 가운데 값은 0입니다. 그 차이 5의 두 배를 간격 10의 제곱으로 나누면 두 번째 차분 0.1입니다. 양옆이 가운데보다 높이 휠수록 이 값이 큽니다." },
  { label: "1년 동안의 굽음 몫 20", summary: "0.5×0.2²×100²×0.1=20", note: "굽음 0.1에 주가 100·연 흔들림 20%로 만든 0.5×0.2²×100²=200을 곱하면 20입니다. 1년 동안 이 굽음이 옵션값에 보태는 속도라고 읽으면 됩니다. 금리는 0으로 둔 설명용 계산입니다." },
  { label: "한 칸 전 값 0.2", summary: "0+20×0.01=0.2", note: "시간을 0.01년만 거슬러 가므로 20×0.01=0.2가 가운데 값 0에 더해집니다. 만기에는 0이던 주가 100 칸이 한 칸 전에는 0.2가 됩니다. 격자 간격을 바꿔도 가까운 값이 나오는지는 따로 확인해야 합니다." },
] as const;

export default function CurvatureStepViz() {
  return (
    <SceneShell
      eyebrow="한 칸 역진"
      title="꺾인 지급이 한 칸 전 값 0.2를 만듭니다"
      description="가로는 주가, 세로는 옵션값입니다. 주가 칸 10, 시간 칸 0.01년, 연 흔들림 20%, 금리 0은 본문의 설명용 가정입니다. 두 번째 차분은 양옆 값과 가운데 값의 차이로 휘어진 정도를 재는 값입니다."
      ariaLabel="만기 지급 0, 0, 10에서 두 번째 차분 0.1과 한 칸 전 값 0.2를 구하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[0, 5, 10].map((tick) => (
                <g key={tick}>
                  <line x1={X0} x2={X1} y1={vy(tick)} y2={vy(tick)} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={X0 - 6} y={vy(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick}</text>
                </g>
              ))}
              <polyline points={PAYOFF.map((p) => `${sx(p.s)},${vy(p.v)}`).join(" ")} fill="none" stroke="#475569" strokeWidth={1.25} />
              {active >= 1 && (
                <g>
                  <line x1={sx(90)} y1={vy(0)} x2={sx(110)} y2={vy(10)} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                  <line x1={sx(100)} y1={vy(0)} x2={sx(100)} y2={vy(5)} stroke="#d97706" strokeWidth={1.25} />
                  <circle cx={sx(100)} cy={vy(5)} r={3.5} fill="#d97706" />
                  <text x={sx(100) - 8} y={vy(5) - 8} textAnchor="end" fontSize={13} fontWeight={700} fill="#d97706">양옆 평균 5</text>
                  <text x={sx(100) + 9} y={vy(2.5) + 4} fontSize={13} fill="#d97706">차이 5</text>
                </g>
              )}
              {PAYOFF.map((p) => (
                <g key={p.s}>
                  <circle cx={sx(p.s)} cy={vy(p.v)} r={4} fill="#475569" />
                  <text x={sx(p.s)} y={Y0 + 16} textAnchor="middle" fontSize={12} fill="#64748b">주가 {p.s}</text>
                  <text x={sx(p.s) + (p.s === 110 ? -8 : p.s === 100 ? 8 : 0)} y={vy(p.v) - 8} textAnchor={p.s === 110 ? "end" : p.s === 100 ? "start" : "middle"} fontSize={13} fontWeight={700} fill="#475569">
                    {p.s === 100 && active === 3 ? "" : p.v}
                  </text>
                </g>
              ))}
              {active === 3 && (
                <g>
                  <circle cx={sx(100)} cy={vy(0.2)} r={4} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                  <text x={sx(100) + 8} y={vy(0.2) - 6} fontSize={13} fontWeight={700} fill="#2563eb">한 칸 전 0.2</text>
                </g>
              )}
              <text x={X1} y={H - 2} textAnchor="end" fontSize={12} fill="#64748b">주가 →</text>
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["두 번째 차분", active >= 1 ? "0.1" : "?"],
                ["1년 굽음 몫", active >= 2 ? "20" : "?"],
                ["한 칸 전 값", active >= 3 ? "0.2" : "?"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border bg-background px-2 py-2 text-center">
                  <span className="block text-xs text-muted-foreground">{label}</span>
                  <span className="block font-mono text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
