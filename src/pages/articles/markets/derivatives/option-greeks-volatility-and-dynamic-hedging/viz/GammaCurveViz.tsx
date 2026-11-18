import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case(1문단)·#mechanism — 옵션 가격 5, 델타 0.50, 감마 0.04.
 * 일차 근사: 5 + 0.5ΔS → +2: 6. 이차 근사: + 0.5 × 0.04 × ΔS² → +2: 6.08.
 * (가정) +4: 직선 7, 곡선 7.32, 차이 0.32. +2 지점의 기울기 0.50 + 0.04 × 2 = 0.58(7절).
 */
const PRICE = 5;
const DELTA = 0.5;
const GAMMA = 0.04;
const lin = (ds: number) => PRICE + DELTA * ds;
const quad = (ds: number) => lin(ds) + 0.5 * GAMMA * ds * ds;

const SCENES = [
  { label: "델타만 쓰면 직선", summary: "주가 +2 → 5 + 1 = 6", note: "델타 0.50은 주가가 조금 움직일 때 옵션 가격이 그 절반만큼 따라간다는 기울기입니다. 이 기울기만 쓰면 옵션 가격 근사는 직선이 되고, 주가 +2에서 일차 효과 +1을 줍니다." },
  { label: "감마를 넣으면 휘어짐", summary: "+0.5 × 0.04 × 2² = +0.08 → 6.08", note: "감마는 델타 자체가 바뀌는 정도입니다. 감마 0.04를 넣은 이차 근사는 직선 위로 휘어 주가 +2에서 0.08을 더합니다. 3절의 계산이 이 틈입니다." },
  { label: "더 크게 움직이면(가정)", summary: "주가 +4 → 직선 7 · 곡선 7.32", note: "주가가 4 움직인다고 가정하면 직선과 곡선의 틈은 0.32로, +2일 때의 네 배입니다. 이동이 커질수록 처음 델타 하나로 읽은 값과 멀어집니다. 곡선도 근사이며 실제 가격은 다를 수 있습니다." },
  { label: "기울기 자체가 바뀜", summary: "+2 지점 기울기 0.50 + 0.04 × 2 = 0.58", note: "곡선 위 +2 지점에서 접하는 선의 기울기는 0.58입니다. 처음 0.50에 맞춘 헤지가 주가 이동 뒤 더는 맞지 않는 이유이며, 7절의 재조정이 여기서 시작됩니다." },
] as const;

const W = 360;
const H = 176;
const LEFT = 36;
const RIGHT = 16;
const TOP = 16;
const BOTTOM = 140;
const X_MAX = 4;
const Y_LO = 4.6;
const Y_HI = 7.45;
const xs = (ds: number) => LEFT + (ds / X_MAX) * (W - LEFT - RIGHT);
const yp = (price: number) => BOTTOM - ((price - Y_LO) / (Y_HI - Y_LO)) * (BOTTOM - TOP);
const SAMPLES: readonly number[] = Array.from({ length: 41 }, (_, i) => (i / 40) * X_MAX);
const curvePath = SAMPLES.map((ds, i) => `${i === 0 ? "M" : "L"} ${xs(ds).toFixed(1)} ${yp(quad(ds)).toFixed(1)}`).join(" ");
const Y_TICKS: readonly number[] = [5, 6, 7];
const X_TICKS: readonly number[] = [0, 1, 2, 3, 4];

function fmt(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export default function GammaCurveViz() {
  return (
    <SceneShell
      eyebrow="델타와 감마"
      title="델타는 직선, 감마는 그 직선이 휘는 정도입니다"
      description="가로축은 주가 변화, 세로축은 옵션 한 단위 가격의 근사입니다. 3절의 옵션 가격 5, 델타 0.50, 감마 0.04를 쓰며 변동성·시간은 그대로 둡니다. 주가 +4는 차이를 보이려는 가정입니다."
      ariaLabel="델타만 쓴 직선 근사와 감마를 더한 곡선 근사가 주가 변화에 따라 벌어지는 모습"
      scenes={SCENES}
      render={(active) => {
        const target = active === 2 ? 4 : 2;
        const showCurve = active >= 1;
        const tangentFrom = 0.6;
        const tangentTo = 3.4;
        const slope = DELTA + GAMMA * 2;
        const tan = (ds: number) => quad(2) + slope * (ds - 2);
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {Y_TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={yp(tick)} y2={yp(tick)} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={LEFT - 6} y={yp(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
                </g>
              ))}
              {X_TICKS.map((tick) => (
                <text key={tick} x={xs(tick)} y={BOTTOM + 16} textAnchor="middle" fontSize={11} fill="#64748b">{tick === 0 ? "0" : `+${tick}`}</text>
              ))}
              <text x={W - RIGHT} y={BOTTOM + 32} textAnchor="end" fontSize={10} fill="#64748b">주가 변화 →</text>
              <line x1={xs(0)} x2={xs(X_MAX)} y1={yp(lin(0))} y2={yp(lin(X_MAX))} stroke="#64748b" strokeWidth={1.25} strokeDasharray={showCurve ? "4 3" : undefined} />
              <text x={xs(X_MAX) - 4} y={active === 3 ? yp(5.85) : yp(lin(X_MAX)) + 16} textAnchor="end" fontSize={11} fill="#475569">{active === 3 ? "델타만 · 기울기 0.50" : "델타만"}</text>
              {showCurve && (
                <>
                  <path d={curvePath} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                  <text x={xs(X_MAX) - 4} y={yp(quad(X_MAX)) - 6} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">델타+감마</text>
                </>
              )}
              {active === 3 && (
                <>
                  <line x1={xs(tangentFrom)} x2={xs(tangentTo)} y1={yp(tan(tangentFrom))} y2={yp(tan(tangentTo))} stroke="#d97706" strokeWidth={1.25} />
                  <text x={xs(tangentFrom)} y={yp(tan(tangentFrom)) + 18} fontSize={11} fontWeight={700} fill="#d97706">기울기 0.58</text>
                </>
              )}
              <line x1={xs(target)} x2={xs(target)} y1={TOP} y2={BOTTOM} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
              <circle cx={xs(target)} cy={yp(lin(target))} r={3.5} fill="#64748b" />
              {showCurve && <circle cx={xs(target)} cy={yp(quad(target))} r={3.5} fill="#2563eb" />}
              <circle cx={xs(0)} cy={yp(PRICE)} r={3.5} fill="#475569" />
              <text x={xs(0) + 6} y={yp(PRICE) + 16} fontSize={11} fill="#475569">옵션 5</text>
            </svg>
            <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs sm:text-sm">
              <span className="text-[11px] text-muted-foreground">주가 변화</span>
              <span className="text-[11px] text-muted-foreground">델타만</span>
              <span className="text-[11px] text-muted-foreground">델타+감마</span>
              <span>+{target}</span>
              <span>{fmt(lin(target))}</span>
              <span className={showCurve ? "font-bold text-[#2563eb]" : "text-muted-foreground/50"}>{showCurve ? fmt(quad(target)) : "−"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
