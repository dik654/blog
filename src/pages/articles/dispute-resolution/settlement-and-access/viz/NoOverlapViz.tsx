import SceneShell from "./SceneShell";

/**
 * 본문 대응: #no-overlap — M이 승소 가능성을 90%로, V가 30%로 보면 두 선이 교차한다.
 * 앞 절의 식 R_M = d·p_M·J − C_M, R_V = d·p_V·J + C_V 에서 d=0.90, J=12, C_M=3, C_V=2를 그대로 둔다(가정).
 * 70%·60% → 4.56·8.48 (겹침), 90%·60% → 6.72·8.48, 90%·30% → 6.72·5.24 (1.48 벌어짐).
 */
const D = 0.9;
const J = 12;
const CM = 3;
const CV = 2;
const rm = (p: number) => Math.round((D * p * J - CM) * 100) / 100;
const rv = (p: number) => Math.round((D * p * J + CV) * 100) / 100;

const SCENES = [
  { label: "앞 절의 전망", pm: 0.7, pv: 0.6, summary: "456만 ~ 848만원 겹침", note: "M은 70%, V는 M의 승소 가능성을 60%로 볼 때입니다. M의 최저선 456만원이 V의 최고선 848만원보다 낮아 그 사이 금액을 둘 다 받아들일 수 있습니다." },
  { label: "M이 90%로 올려 봄", pm: 0.9, pv: 0.6, summary: "M 최저선 456만 → 672만원", note: "새 증거를 본 M의 계산은 0.90×0.90×12−3=6.72입니다. M의 최저선이 오른쪽으로 움직여 겹치는 구간이 672만~848만원으로 좁아집니다." },
  { label: "V는 30%로 봄", pm: 0.9, pv: 0.3, summary: "M 672만 > V 524만원", note: "V의 계산은 0.90×0.30×12+2=5.24입니다. 이제 M이 받아들일 최저액이 V가 낼 최고액보다 148만원 높아, 둘 다 받아들일 수 있는 금액이 하나도 없습니다." },
] as const;

const W = 360;
const H = 150;
const LEFT = 20;
const RIGHT = 340;
const AXIS_Y = 92;
const x = (value: number) => LEFT + (value / J) * (RIGHT - LEFT);
const TICKS = [0, 3, 6, 9, 12] as const;

const OWNER = "#0284c7";
const VENDOR = "#d97706";
const OVERLAP = "#059669";
const GAP = "#dc2626";
const MUTED = "#64748b";

const won = (value: number) => `${Math.round(value * 100)}만`;

export default function NoOverlapViz() {
  return (
    <SceneShell
      eyebrow="대안값의 교차"
      title="전망이 벌어지면 두 선이 서로 지나칩니다"
      description="가로축은 합의금(백만원)입니다. 파란 선 오른쪽은 M이 받아들일 수 있는 금액, 주황 선 왼쪽은 V가 낼 수 있는 금액입니다. 시간 할인 0.90·판결액 1,200만원·M 부담 300만원·V 부담 200만원은 앞 절 값을 그대로 둔 계산입니다(가정)."
      ariaLabel="M과 V의 승소 전망 차이가 커지면 합의 가능 범위가 사라지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const m = rm(scene.pm);
        const v = rv(scene.pv);
        const overlap = m <= v;
        const lo = Math.min(m, v);
        const hi = Math.max(m, v);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={x(lo)} y={AXIS_Y - 14} width={x(hi) - x(lo)} height={28} rx={4} fill={overlap ? "#05966922" : "#dc262614"} stroke={overlap ? OVERLAP : GAP} strokeWidth={1} strokeDasharray={overlap ? undefined : "4 3"} />
              <text x={(x(lo) + x(hi)) / 2} y={AXIS_Y + 34} textAnchor="middle" fontSize={12} fontWeight={700} fill={overlap ? OVERLAP : GAP}>
                {overlap ? "합의 가능" : "빈 틈 148만원"}
              </text>
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick)} y={AXIS_Y + 52} textAnchor="middle" fontSize={11} fill={MUTED}>{tick}</text>
                </g>
              ))}
              <line x1={x(m)} x2={x(m)} y1={30} y2={AXIS_Y + 14} stroke={OWNER} strokeWidth={1.25} />
              <line x1={x(m)} x2={x(m) + 14} y1={34} y2={34} stroke={OWNER} strokeWidth={1.25} />
              <text x={x(m)} y={22} textAnchor={m > v ? "start" : "end"} dx={m > v ? -4 : 4} fontSize={12} fontWeight={700} fill={OWNER}>
                {`M 최저 ${won(m)}`}
              </text>
              <line x1={x(v)} x2={x(v)} y1={48} y2={AXIS_Y + 14} stroke={VENDOR} strokeWidth={1.25} />
              <line x1={x(v)} x2={x(v) - 14} y1={52} y2={52} stroke={VENDOR} strokeWidth={1.25} />
              <text x={x(v)} y={44} textAnchor={m > v ? "end" : "start"} dx={m > v ? 4 : -4} fontSize={12} fontWeight={700} fill={VENDOR}>
                {`V 최고 ${won(v)}`}
              </text>
            </svg>
            <div className="mt-2 grid gap-1 font-mono text-xs leading-6 sm:grid-cols-2 sm:text-sm">
              <span style={{ color: OWNER }}>{`M: 0.90×${scene.pm.toFixed(2)}×12−3 = ${m.toFixed(2)}`}</span>
              <span style={{ color: VENDOR }}>{`V: 0.90×${scene.pv.toFixed(2)}×12+2 = ${v.toFixed(2)}`}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
