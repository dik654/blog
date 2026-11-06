import SceneShell from "./SceneShell";
import { monopsonyHours } from "../model";

/**
 * 본문 대응: #two-predictions — n*(F): 10/3(F≤19/3), F−3(19/3<F≤8), 13−F(8<F<13), 0(F≥13).
 * 경쟁 기준: 5(F≤8), 13−F(8<F<13), 0. 점 값은 model.ts에서 계산한다.
 */
const X0 = 36;
const X1 = 344;
const Y0 = 176;
const Y1 = 22;
const FMAX = 14;
const HMAX = 6;
const sx = (f: number) => X0 + (f / FMAX) * (X1 - X0);
const sy = (h: number) => Y0 - (h / HMAX) * (Y0 - Y1);
const LOW = 19 / 3;

const line = (points: readonly (readonly [number, number])[]) => points.map(([f, h]) => `${sx(f)},${sy(h)}`).join(" ");
const MONOPSONY = line([[0, 10 / 3], [LOW, 10 / 3], [8, 5], [13, 0], [14, 0]]);
const COMPETITIVE = line([[0, 5], [8, 5], [13, 0], [14, 0]]);

const SCENES = [
  { label: "낮은 하한", summary: "19/3 이하 → 10/3시간", note: "최저시급이 19/3(원래 지급 시급) 이하이면 제약이 되지 않아 원래 10/3시간을 유지합니다." },
  { label: "오르는 구간", summary: "7 → 4시간 · 8 → 5시간", note: "19/3보다 높고 8 이하이면 F − 3시간을 고릅니다. 그 시급으로 구할 수 있는 노동이 늘어서 고용이 늘어납니다. 8에서 이 모형의 노동시간이 가장 큽니다." },
  { label: "내려오는 구간", summary: "9 → 4시간", note: "8부터는 13 − F시간으로 줄고 두 선이 겹칩니다. 9의 4시간은 동일 임금 고용주의 인상 전 10/3보다는 많고 경쟁 기준의 인상 전 5보다는 적습니다." },
  { label: "높은 하한", summary: "12 → 1시간 · 13 → 0시간", note: "12이면 두 모형 모두 1시간으로, 동일 임금 고용주도 인상 전보다 적습니다. 13 이상이면 0시간입니다. 고용효과의 방향은 출발 조건과 인상 폭을 함께 봐야 합니다." },
] as const;

const POINTS: readonly (readonly { f: number; left: boolean; tag: string; dx: number; dy: number }[])[] = [
  [],
  [{ f: 7, left: true, tag: "", dx: -8, dy: -6 }, { f: 8, left: false, tag: " (두 모형 같음)", dx: 7, dy: -6 }],
  [{ f: 9, left: false, tag: " (두 모형 같음)", dx: 7, dy: -6 }],
  [{ f: 12, left: true, tag: "", dx: -6, dy: 4 }, { f: 13, left: true, tag: "", dx: -14, dy: -5 }],
];

export default function HoursByFloorViz() {
  return (
    <SceneShell
      eyebrow="최저시급과 노동시간"
      title="동일 임금 고용주의 시간은 최저시급이 오를 때 유지되다가 늘고, 나중에 줄어듭니다"
      description="실선은 더 구하려면 모든 시간의 시급을 올려야 하는 동일 임금 고용주, 점선은 수요와 공급이 만나는 경쟁 기준입니다. 같은 연속 시간 모형의 계산이며 실제 시장의 추정이 아닙니다(가정)."
      ariaLabel="최저시급에 따라 선택되는 노동시간의 두 모형 곡선"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
          <line x1={X0} x2={X0} y1={Y1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
          {[0, 5].map((h) => (
            <text key={h} x={X0 - 6} y={sy(h) + 4} textAnchor="end" fontSize={11} fill="#64748b">{h}</text>
          ))}
          <text x={X0 - 6} y={sy(10 / 3) + 4} textAnchor="end" fontSize={11} fill="#64748b">10/3</text>
          <text x={X0} y={12} fontSize={11} fill="#64748b">노동시간</text>
          {([[0, "0"], [LOW, "19/3"], [8, "8"], [13, "13"]] as const).map(([f, label]) => (
            <g key={label}>
              <line x1={sx(f)} x2={sx(f)} y1={Y1} y2={Y0} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 4" />
              <text x={sx(f)} y={Y0 + 15} textAnchor="middle" fontSize={11} fill="#64748b">{label}</text>
            </g>
          ))}
          <text x={X1} y={Y0 + 30} textAnchor="end" fontSize={11} fill="#64748b">최저시급 F</text>

          <polyline points={COMPETITIVE} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="5 3" />
          <polyline points={MONOPSONY} fill="none" stroke="#2563eb" strokeWidth={1.25} />
          <text x={sx(1)} y={sy(5) - 6} fontSize={11} fill="#64748b">경쟁 기준</text>
          <text x={sx(1)} y={sy(10 / 3) + 15} fontSize={11} fontWeight={700} fill="#2563eb">동일 임금 고용주</text>

          {active === 0 && <line x1={sx(0)} x2={sx(LOW)} y1={sy(10 / 3)} y2={sy(10 / 3)} stroke="#d97706" strokeWidth={1.25} />}
          {active === 2 && <circle cx={sx(0)} cy={sy(5)} r={3.5} fill="#64748b" />}
          {active === 2 && <circle cx={sx(0)} cy={sy(10 / 3)} r={3.5} fill="#2563eb" />}
          {active === 2 && <line x1={sx(0)} x2={sx(9)} y1={sy(monopsonyHours(9))} y2={sy(monopsonyHours(9))} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />}
          {POINTS[active].map(({ f, left, tag, dx, dy }) => (
            <g key={f}>
              <circle cx={sx(f)} cy={sy(monopsonyHours(f))} r={4.5} fill="#d97706" />
              <text x={sx(f) + dx} y={sy(monopsonyHours(f)) + dy} textAnchor={left ? "end" : "start"} fontSize={11} fontWeight={700} fill="#b45309">
                {f} → {monopsonyHours(f)}시간{tag}
              </text>
            </g>
          ))}
        </svg>
      )}
    />
  );
}
