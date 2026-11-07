import SceneShell from "./SceneShell";

/**
 * 본문 대응: #irr — NPV(r) 곡선이 0을 지나는 자리가 내부수익률이다.
 * −1억, +4천만×3: r=0 +2,000, 8% +308, 9.7% ≈0, 15% −867. 부호가 두 번 바뀌는 흐름은
 * −10,000 +23,000 −13,200(가정): 10%와 20%에서 정확히 0, 15%에서 +18.9.
 */
const ONE = [-10000, 4000, 4000, 4000] as const;
const TWO = [-10000, 23000, -13200] as const;
const npv = (flows: readonly number[], r: number) => flows.reduce<number>((sum, c, t) => sum + c / (1 + r) ** t, 0);

const W = 360;
const H = 196;
const L = 46;
const R_EDGE = 350;
const T = 16;
const B = 172;
const R_MAX = 0.3;

const VIEWS = {
  one: { flows: ONE, min: -3000, max: 2400, ticks: [2000, 0, -2000] },
  two: { flows: TWO, min: -240, max: 60, ticks: [0, -200] },
} as const;

const SCENES = [
  { label: "할인율 0%", summary: "그냥 더한 값 +2,000만 원", view: "one", r: 0, mark: null, value: "+2,000", chips: ["−1억", "+4천만", "+4천만", "+4천만"], note: "할인을 전혀 하지 않으면 금액을 그대로 더한 값입니다. 곡선은 할인율을 옮겨 가며 같은 현금흐름의 순현재가치를 다시 계산해 이은 선입니다." },
  { label: "할인율 8%", summary: "NPV 약 +308만 원", view: "one", r: 0.08, mark: null, value: "8% · +308", chips: ["−1억", "+4천만", "+4천만", "+4천만"], note: "앞에서 계산한 지점입니다. 할인율이 오를수록 들어올 돈의 오늘 값이 줄어 곡선이 내려갑니다." },
  { label: "할인율 약 9.7%", summary: "NPV ≈ 0 → 내부수익률", view: "one", r: 0.097, mark: null, value: "약 9.7% · 0", chips: ["−1억", "+4천만", "+4천만", "+4천만"], note: "곡선이 0을 지나는 자리가 내부수익률입니다. 바깥에서 가져온 비율이 아니라 이 현금흐름에서 나온 값입니다." },
  { label: "할인율 15%", summary: "NPV 약 −867만 원 (가정)", view: "one", r: 0.15, mark: null, value: "15% · −867", chips: ["−1억", "+4천만", "+4천만", "+4천만"], note: "처음 한 번 나가고 뒤로 계속 들어오는 흐름이라 곡선이 내려가기만 합니다. 0을 지나는 자리도 한 곳뿐이어서 찾기 쉽습니다." },
  { label: "부호가 두 번 바뀌면", summary: "10%와 20%에서 모두 NPV = 0 (가정)", view: "two", r: 0.1, mark: 0.2, value: "", chips: ["−1억", "+2.3억", "−1.32억", ""], note: "나감·들어옴·다시 나감인 가정 사례입니다. 곡선이 0을 두 번 지나 무엇이 그 사업의 수익률인지 말할 수 없습니다. 세로 눈금은 앞 장면과 다릅니다." },
] as const;

export default function IrrCurveViz() {
  return (
    <SceneShell
      eyebrow="내부수익률"
      title="곡선이 0을 지나는 자리를 찾는 일입니다"
      description="가로는 할인율, 세로는 그 할인율의 순현재가치(만 원)입니다. 위 칸은 순서대로 오가는 돈이고, 빨간 글자가 나가는 돈입니다."
      ariaLabel="할인율에 따른 순현재가치 곡선과 내부수익률"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const view = VIEWS[scene.view];
        const sx = (r: number) => L + (r / R_MAX) * (R_EDGE - L);
        const sy = (v: number) => B - ((v - view.min) / (view.max - view.min)) * (B - T);
        const steps = 60;
        const d = Array.from({ length: steps + 1 }, (_, i) => {
          const r = (i / steps) * R_MAX;
          return `${i === 0 ? "M" : "L"}${sx(r).toFixed(1)} ${sy(npv(view.flows, r)).toFixed(1)}`;
        }).join(" ");
        const v = npv(view.flows, scene.r);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-1.5">
              {(scene.chips as readonly string[]).map((chip, i) => (
                <div key={i} className={`rounded-md border px-1 py-1 text-center text-[11px] leading-4 ${chip ? "border-border bg-background" : "border-transparent"}`}>
                  <span className="block text-muted-foreground">{chip ? (i === 0 ? "오늘" : `${i}년 뒤`) : " "}</span>
                  <span className={`block font-mono font-bold ${chip.startsWith("−") ? "text-red-700 dark:text-red-400" : ""}`}>{chip || " "}</span>
                </div>
              ))}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {(view.ticks as readonly number[]).map((tick) => (
                <g key={tick}>
                  <line x1={L} x2={R_EDGE} y1={sy(tick)} y2={sy(tick)} stroke={tick === 0 ? "#64748b" : "#94a3b8"} strokeWidth={1} strokeOpacity={tick === 0 ? 1 : 0.35} />
                  <text x={L - 5} y={sy(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick > 0 ? `+${tick.toLocaleString("en-US")}` : tick === 0 ? "0" : `−${Math.abs(tick).toLocaleString("en-US")}`}</text>
                </g>
              ))}
              {[0, 0.1, 0.2, 0.3].map((r) => (
                <text key={r} x={sx(r)} y={B + 16} textAnchor="middle" fontSize={11} fill="#64748b">{Math.round(r * 100)}%</text>
              ))}
              <path d={d} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <line x1={sx(scene.r)} x2={sx(scene.r)} y1={T} y2={B} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={sx(scene.r)} cy={sy(v)} r={4} fill="#d97706" />
              <text x={sx(scene.r) + 8} y={sy(v) - 8} fontSize={12} fontWeight={700} fill="#b45309">{scene.value}</text>
              {scene.mark !== null && (
                <g>
                  <line x1={sx(scene.mark)} x2={sx(scene.mark)} y1={T} y2={B} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
                  <text x={sx(scene.r) - 6} y={sy(0) - 8} textAnchor="end" fontSize={12} fontWeight={700} fill="#b45309">10%에서 0</text>
                  <circle cx={sx(scene.mark)} cy={sy(npv(view.flows, scene.mark))} r={4} fill="#d97706" />
                  <text x={sx(scene.mark) + 6} y={sy(0) - 8} fontSize={12} fontWeight={700} fill="#b45309">20%에서 0</text>
                </g>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
