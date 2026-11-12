import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture (+ #budget, #source 숫자) — 같은 총량이 더 넓은 깊이에 나뉘는 모습.
 * 첫 곡선 C₁(z)=exp[−(z/120)²], 두 단계 뒤 C₂(z)=(1/√3)·exp[−(z/207.85)²] (첫 표면 농도=1).
 * 넓이: 1×120×√π/2 ≈ 106.3, 0.577×207.85×√π/2 ≈ 106.3 — 같다(고정 도즈).
 * z=120: C₁=e⁻¹≈0.368, z=240: C₁=e⁻⁴≈0.018, C₂=(1/√3)e^(−4/3)≈0.152.
 */
const A1 = 120;
const A2 = 207.85;
const K2 = 1 / Math.sqrt(3);
const ZMAX = 500;
const X0 = 44;
const X1 = 362;
const Y0 = 214;
const Y1 = 24;
const sx = (z: number) => X0 + (z / ZMAX) * (X1 - X0);
const sy = (c: number) => Y0 - (c / 1.05) * (Y0 - Y1);
const c1 = (z: number) => Math.exp(-((z / A1) ** 2));
const c2 = (z: number) => K2 * Math.exp(-((z / A2) ** 2));
const ZS = Array.from({ length: 101 }, (_, i) => i * 5);
const line = (f: (z: number) => number) => ZS.map((z) => `${sx(z).toFixed(1)},${sy(f(z)).toFixed(1)}`).join(" ");
const area = (f: (z: number) => number) => `${sx(0)},${sy(0)} ${line(f)} ${sx(ZMAX)},${sy(0)}`;
const LINE1 = line(c1);
const LINE2 = line(c2);
const AREA1 = area(c1);
const AREA2 = area(c2);
const FIRST = "#d97706";
const SECOND = "#2563eb";

const SCENES = [
  {
    label: "첫 가열 뒤",
    summary: "폭 척도 a = 120 nm",
    note: "칠한 넓이가 넣은 원자 총량입니다. 폭 척도 a는 농도가 그 단계 표면 값의 약 36.8%(1/e)로 내려가는 깊이이며, 120 nm에서 0.368, 240 nm에서는 약 0.018입니다.",
  },
  {
    label: "둘째 가열 뒤",
    summary: "a ≈ 208 nm · 표면 1 → 0.577",
    note: "새 원자 없이 같은 넓이가 더 넓게 펼쳐집니다. 그래서 꼭대기는 첫 표면의 1/√3 ≈ 0.577로 낮아집니다. 낮아진 꼭대기는 원자가 사라졌다는 뜻이 아닙니다.",
  },
  {
    label: "240 nm 깊이를 고정하면",
    summary: "0.018 → 0.152",
    note: "같은 깊이를 정해 놓고 보면 농도는 오히려 커졌습니다. 처음에 거의 닿지 못하던 곳까지 원자가 들어왔기 때문입니다. 두 값 모두 첫 표면 농도를 1로 둔 비율입니다.",
  },
] as const;

export default function ProfileSpreadViz() {
  return (
    <SceneShell
      eyebrow="깊이별 농도 곡선"
      title="같은 넓이가 더 깊이 펼쳐집니다"
      description="가로축은 표면에서 잰 깊이, 세로축은 첫 단계 표면 농도를 1로 둔 농도입니다. 3절에서 가정한 퍼지기 쉬운 정도와 시간을 쓰고, 공급을 멈춘 뒤 그 정도가 일정할 때의 종 모양 곡선(7절의 가우스 근사)으로 그렸습니다."
      ariaLabel="첫 가열과 둘째 가열 뒤의 깊이별 농도 곡선 비교"
      scenes={SCENES}
      render={(active) => {
        const showSecond = active >= 1;
        return (
          <svg viewBox="0 0 376 256" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="깊이 대 농도 곡선">
            <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
            {[0, 100, 200, 300, 400, 500].map((z) => (
              <text key={z} x={sx(z)} y={Y0 + 18} fontSize={14} textAnchor="middle" fill="currentColor">{z}</text>
            ))}
            <text x={X1} y={Y0 + 36} fontSize={14} textAnchor="end" fill="currentColor">깊이 (nm)</text>
            {[0, 0.5, 1].map((c) => (
              <text key={c} x={X0 - 6} y={sy(c) + 5} fontSize={14} textAnchor="end" fill="currentColor">{c}</text>
            ))}
            {showSecond ? (
              <>
                <polyline points={LINE1} fill="none" stroke={FIRST} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
                <polygon points={AREA2} fill={SECOND} fillOpacity={0.15} stroke="none" />
                <polyline points={LINE2} fill="none" stroke={SECOND} strokeWidth={1.25} />
              </>
            ) : (
              <>
                <polygon points={AREA1} fill={FIRST} fillOpacity={0.15} stroke="none" />
                <polyline points={LINE1} fill="none" stroke={FIRST} strokeWidth={1.25} />
              </>
            )}
            {active === 0 ? (
              <g>
                <line x1={sx(A1)} y1={Y0} x2={sx(A1)} y2={sy(c1(A1))} stroke={FIRST} strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(A1)} cy={sy(c1(A1))} r={4} fill={FIRST} />
                <text x={sx(A1) + 8} y={sy(c1(A1)) - 6} fontSize={14} fill={FIRST} fontWeight={700}>a = 120 nm · 0.368</text>
                <text x={sx(150)} y={sy(0.62)} fontSize={14} fill="currentColor">칠한 넓이 = 총량</text>
              </g>
            ) : null}
            {active === 1 ? (
              <g>
                <circle cx={sx(0)} cy={sy(K2)} r={4} fill={SECOND} />
                <text x={sx(0) + 10} y={sy(K2) - 8} fontSize={14} fill={SECOND} fontWeight={700}>표면 0.577</text>
                <line x1={sx(A2)} y1={Y0} x2={sx(A2)} y2={sy(c2(A2))} stroke={SECOND} strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(A2)} cy={sy(c2(A2))} r={4} fill={SECOND} />
                <text x={sx(A2) + 8} y={sy(c2(A2)) - 6} fontSize={14} fill={SECOND} fontWeight={700}>a ≈ 208 nm</text>
                <text x={sx(150)} y={sy(0.86)} fontSize={14} fill="currentColor">점선 = 첫 단계 곡선</text>
              </g>
            ) : null}
            {active === 2 ? (
              <g>
                <line x1={sx(240)} y1={Y0} x2={sx(240)} y2={Y1 + 30} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" />
                <text x={sx(240)} y={Y1 + 22} fontSize={14} textAnchor="middle" fill="currentColor" fontWeight={700}>z = 240 nm</text>
                <circle cx={sx(240)} cy={sy(c1(240))} r={4} fill={FIRST} />
                <circle cx={sx(240)} cy={sy(c2(240))} r={4} fill={SECOND} />
                <circle cx={sx(280)} cy={sy(0.62) - 5} r={4} fill={SECOND} />
                <text x={sx(280) + 10} y={sy(0.62)} fontSize={14} fill={SECOND} fontWeight={700}>두 단계 뒤 0.152</text>
                <circle cx={sx(280)} cy={sy(0.46) - 5} r={4} fill={FIRST} />
                <text x={sx(280) + 10} y={sy(0.46)} fontSize={14} fill={FIRST} fontWeight={700}>첫 단계 0.018</text>
              </g>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
