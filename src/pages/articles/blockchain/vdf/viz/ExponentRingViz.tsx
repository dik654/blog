import SceneShell from "./SceneShell";

/**
 * 본문 대응: #contract — "지수를 군의 순서로 줄여 건너뛰는 우회"와
 * "군의 순서를 쉽게 알 수 있는 이 예시는 지수를 줄일 수 있다"는 해석.
 * 3^k mod 17은 16칸마다 되풀이된다. 2⁴ mod 16 = 0 이므로 g^16 = g^0 = 1.
 */
const ORDER = 16;
const POWERS = Array.from({ length: ORDER - 1 }).reduce<number[]>((acc) => [...acc, ((acc[acc.length - 1] ?? 1) * 3) % 17], [1]);
const CHAIN = [1, 2, 4, 8, 16];
const SUPER: Record<number, string> = { 1: "g¹", 2: "g²", 4: "g⁴", 8: "g⁸", 16: "g¹⁶" };

const CX = 180;
const CY = 150;
const R = 108;
const pos = (k: number, r = R) => {
  const angle = ((k % ORDER) / ORDER) * 2 * Math.PI - Math.PI / 2;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
};

const SCENES = [
  { label: "거듭제곱은 고리를 돕니다", summary: "16칸 뒤 제자리 · 군의 순서 16", center: ["×3마다 한 칸", "16칸이면 제자리"], note: "칸 안의 수는 3의 거듭제곱을 17로 나눈 나머지입니다. 원소가 16개라 16칸을 돌면 처음 값 1로 돌아옵니다. 이 원소 개수가 군의 순서입니다." },
  { label: "제곱은 지수를 두 배로", summary: "3→9→13→16→1", center: ["칸 수가", "1→2→4→8→16"], note: "한 번 제곱할 때마다 지수가 두 배가 됩니다. T=4로 네 번 제곱하면 3→9→13→16→1을 거쳐 지수 16 자리에 닿습니다." },
  { label: "순서를 알면 건너뜁니다", summary: "2⁴ mod 16 = 0 → g⁰ = 1", center: ["16 mod 16 = 0", "제곱 없이 1"], note: "고리 길이 16을 알면 지수의 16 나머지만 봅니다. 2⁴의 나머지가 0이라 제곱 없이 y=1이고, T≥4면 늘 같습니다. 지수를 줄일 수 있으니 이 예시는 안전한 VDF가 아닙니다." },
  { label: "순서를 모르게 합니다", summary: "순서를 알기 어려운 군(가정)", center: ["고리 길이 ?", "지수를 줄일 값 없음"], note: "안전한 VDF는 순서를 알기 어려운 군과 construction의 보안 가정을 더해 이 우회를 막습니다. 실제 군의 크기와 모양은 이 그림과 다릅니다." },
] as const;

export default function ExponentRingViz() {
  return (
    <SceneShell
      eyebrow="설명용 작은 군 · g=3 · mod 17"
      title="군의 순서를 알면 왜 지수를 줄일 수 있을까"
      description="군의 순서는 군에 든 원소의 개수입니다. 고리의 칸이 3^k mod 17의 값이고, 맨 위 칸이 g⁰=g¹⁶=1입니다. 이 작은 군은 산술만 보여 주는 예시입니다."
      ariaLabel="3의 거듭제곱 mod 17이 16칸 고리를 이루고 지수를 줄이면 제곱 없이 결과를 얻는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 300" className="mx-auto h-auto w-full max-w-[330px] sm:max-w-[420px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={active === 3 ? "#d97706" : "#cbd5e1"} strokeWidth={1} strokeDasharray={active === 3 ? "5 5" : undefined} />
            {active === 1 &&
              CHAIN.slice(0, -1).map((k, index) => {
                const from = pos(k);
                const to = pos(CHAIN[index + 1] ?? k);
                return <line key={k} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#2563eb" strokeWidth={1.25} />;
              })}
            {active !== 3 &&
              POWERS.map((value, k) => {
                const { x, y } = pos(k);
                const exponent = k === 0 ? ORDER : k;
                const inChain = active === 1 && CHAIN.includes(exponent);
                const hit = (active === 2 && k === 0) || inChain;
                const start = active === 0 && (k === 0 || k === 1);
                const on = hit || start;
                const label = pos(k, R + 24);
                return (
                  <g key={k}>
                    <circle cx={x} cy={y} r={14} fill={hit ? "#2563eb" : "#f8fafc"} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                    <text x={x} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fontFamily="monospace" fill={hit ? "#ffffff" : "#475569"}>{value}</text>
                    {on && SUPER[exponent] && (
                      <text x={label.x} y={label.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{k === 0 && active !== 1 ? "g⁰=g¹⁶" : SUPER[exponent]}</text>
                    )}
                  </g>
                );
              })}
            <text x={active === 1 ? CX - 50 : CX} y={CY - 4} textAnchor="middle" fontSize={14} fontWeight={700} fill={active === 3 ? "#d97706" : "#2563eb"}>{scene.center[0]}</text>
            <text x={active === 1 ? CX - 50 : CX} y={CY + 16} textAnchor="middle" fontSize={active === 1 ? 12 : 13} fill="#64748b">{scene.center[1]}</text>
          </svg>
        );
      }}
    />
  );
}
