import SceneShell from "./SceneShell";

/**
 * 본문 대응: #entropy-source — 확률 1을 칸으로 나눈 막대.
 * 균등 8개: pmax=1/8 → 3비트, 후보 8개.
 * 한 값 1/2: pmax=1/2 → 1비트 (나머지 1/2의 분포는 본문이 정하지 않음).
 * pmax=1/8 + 나머지 7/8이 아주 많은 값에 퍼짐: 3비트지만 후보 수는 8이 아님.
 * 균등 8비트 seed: 256개 × 1/256 → 8비트, 256번이면 전부.
 */
const W = 300;
const H = 66;
const X0 = 8;
const BAR_W = W - 2 * X0;
const Y = 14;
const BAR_H = 30;

type Block = { share: number; kind: "top" | "even" | "rest" };

const SCENES = [
  { label: "균등한 여덟 후보", summary: "pmax=1/8 → 3비트 · 후보 8개", blocks: Array.from({ length: 8 }, (_, i): Block => ({ share: 1 / 8, kind: i === 0 ? "top" : "even" })), pmax: "1/8", bits: "3비트", count: "정확히 8개 (본문이 지정)", note: "어느 후보를 먼저 골라도 맞힐 확률은 1/8=2⁻³이라 3비트입니다. 이 사례는 후보 집합까지 정했으므로 여덟 번이면 모두 시험할 수 있습니다." },
  { label: "한 값이 절반", summary: "pmax=1/2 → 1비트", blocks: [{ share: 1 / 2, kind: "top" }, { share: 1 / 2, kind: "rest" }] as Block[], pmax: "1/2", bits: "1비트", count: "정하지 않음", note: "한 값이 절반 확률로 나오면 그 값을 먼저 추측해 1/2로 맞힙니다. −log₂(1/2)=1이므로 가장 쉬운 한 번의 추측 기준으로는 1비트입니다." },
  { label: "1/8인데 후보가 많음", summary: "pmax=1/8 → 3비트 · 후보 8개 아님", blocks: [{ share: 1 / 8, kind: "top" }, { share: 7 / 8, kind: "rest" }] as Block[], pmax: "1/8", bits: "3비트", count: "아주 많은 값 (개수 미정)", note: "가장 흔한 값이 1/8이고 나머지 7/8이 아주 많은 값에 퍼진 분포도 3비트입니다. 첫 장면과 최소 엔트로피는 같지만 전체 후보 수는 여덟 개가 아니며, 이 값만으로 평균 탐색 횟수를 알 수도 없습니다. 점선 칸 안의 개수는 정하지 않았습니다." },
  { label: "균등한 8비트 seed", summary: "pmax=1/256 → 8비트 · 256번", blocks: Array.from({ length: 256 }, (_, i): Block => ({ share: 1 / 256, kind: i === 0 ? "top" : "even" })), pmax: "1/256", bits: "8비트", count: "정확히 256개", note: "가능한 값이 정확히 256개이고 균등하면 256번 안에 모두 시험할 수 있습니다. 출력이 256비트라고 2²⁵⁶개의 입력이 생기지는 않습니다." },
] as const;

export default function MinEntropySplitViz() {
  return (
    <SceneShell
      eyebrow="최소 엔트로피"
      title="가장 흔한 값의 확률은 후보 수를 말해 주지 않습니다"
      description="막대 전체가 확률 1이고 칸 하나가 시작값 하나입니다. 파란 칸이 가장 먼저 추측할 값(pmax)입니다. 점선 칸은 본문이 나눠 갖는 방식을 정하지 않은 나머지 확률입니다."
      ariaLabel="네 가지 시작값 분포의 최대 확률, 최소 엔트로피, 후보 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const blocks = scene.blocks as readonly Block[];
        const starts = blocks.reduce<number[]>((acc, b, i) => [...acc, i === 0 ? 0 : acc[i - 1] + blocks[i - 1].share], []);
        const thin = blocks.length > 32;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {blocks.map((b, i) => {
                const x = X0 + starts[i] * BAR_W;
                const w = b.share * BAR_W;
                const fill = b.kind === "top" ? "#2563eb" : b.kind === "even" ? "#94a3b8" : "none";
                return (
                  <rect
                    key={i}
                    x={x}
                    y={Y}
                    width={w}
                    height={BAR_H}
                    fill={fill}
                    fillOpacity={b.kind === "even" ? 0.55 : 1}
                    stroke={b.kind === "rest" ? "#64748b" : thin ? "none" : "#ffffff"}
                    strokeWidth={1}
                    strokeDasharray={b.kind === "rest" ? "4 3" : undefined}
                  />
                );
              })}
              {blocks.some((b) => b.kind === "rest") && (
                <text x={X0 + starts[1] * BAR_W + (blocks[1].share * BAR_W) / 2} y={Y + BAR_H / 2 + 4} textAnchor="middle" fontSize={12} fill="#64748b">
                  나머지 {active === 1 ? "1/2" : "7/8"} · 나뉨 미정
                </text>
              )}
              <text x={X0} y={Y + BAR_H + 15} fontSize={12} fill="#2563eb" fontWeight={700}>pmax {scene.pmax}</text>
              <text x={W - X0} y={Y + BAR_H + 15} textAnchor="end" fontSize={12} fill="#64748b">합계 1</text>
            </svg>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <p className="rounded-md border border-border px-1 py-2"><span className="block text-muted-foreground">한 번에 맞힐 확률</span><span className="font-mono text-sm font-bold">{scene.pmax}</span></p>
              <p className="rounded-md border border-border px-1 py-2"><span className="block text-muted-foreground">최소 엔트로피</span><span className="font-mono text-sm font-bold">{scene.bits}</span></p>
              <p className="rounded-md border border-border px-1 py-2"><span className="block text-muted-foreground">전체 후보 수</span><span className="text-sm font-bold">{scene.count}</span></p>
            </div>
          </div>
        );
      }}
    />
  );
}
