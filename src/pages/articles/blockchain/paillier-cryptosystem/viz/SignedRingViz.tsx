import SceneShell from "./SceneShell";

/**
 * 본문 대응: #encoding — n=15, max_int = 15//3 − 1 = 4.
 * 0–4 양수, 5–10 넘침 감지, 11–14 → −4…−1.
 * 4+3 = 7 → 넘침 구간 → OverflowError. 4를 네 번 더하면 4 → 8 → 12 → 16 ≡ 1 → 양수 1로 조용히 읽힘.
 */
const N = 15;
const CX = 180;
const CY = 122;
const R = 84;
const R_LABEL = 108;
const R_PATH = 62;

type Zone = "pos" | "over" | "neg";
const zoneOf = (k: number): Zone => (k <= 4 ? "pos" : k <= 10 ? "over" : "neg");
const ZONE_COLOR: Record<Zone, string> = { pos: "#2563eb", over: "#d97706", neg: "#7c3aed" };
const signedLabel = (k: number) => (k <= 4 ? `${k}` : k <= 10 ? "" : `−${N - k}`);

const angle = (k: number) => ((-90 + (k * 360) / N) * Math.PI) / 180;
const at = (k: number, radius: number) => ({ x: CX + radius * Math.cos(angle(k)), y: CY + radius * Math.sin(angle(k)) });

function arc(from: number, to: number) {
  const a = at(from, R_PATH);
  const b = at(to, R_PATH);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${R_PATH} ${R_PATH} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

const SCENES = [
  { label: "세 구간", summary: "0–4 양수 · 5–10 넘침 · 11–14 음수", hops: [] as readonly (readonly [number, number])[], end: -1, note: "15개 나머지를 원으로 놓았습니다. 바깥 숫자가 signed decode가 읽는 값입니다. 11–14는 −4…−1로 읽고, 5–10은 넘침을 알아채기 위해 비워 둔 구간입니다." },
  { label: "4 + 3", summary: "raw 7 → 넘침 구간 → OverflowError", hops: [[4, 7]] as const, end: 7, note: "4에서 3칸 가면 7입니다. raw 복호는 정상적으로 7이지만 7이 넘침 구간에 있으므로 signed decode는 OverflowError를 냅니다. 덧셈이 틀린 것이 아니라 정수 표현 범위를 넘은 것입니다." },
  { label: "4를 네 번", summary: "4 → 8 → 12 → 16 ≡ 1 → 경고 없이 1", hops: [[4, 8], [8, 12], [12, 1]] as const, end: 1, note: "정수 합은 16이지만 원을 한 바퀴 넘어 1에 도착합니다. 1은 양수 구간이라 decode는 경고 없이 1을 돌려줍니다. 중간 합 8은 넘침 구간, 12는 −3으로 읽히는 음수 구간에 있지만 decode하는 것은 마지막 1뿐이라 경로는 검사되지 않습니다." },
] as const;

export default function SignedRingViz() {
  return (
    <SceneShell
      eyebrow="signed 인코딩"
      title="합이 넘침 구간에 떨어지면 오류, 한 바퀴 돌아 나오면 조용히 틀립니다"
      description="n=15에서 평문 나머지 0–14를 원 위에 놓았습니다. 원 안의 숫자는 raw 복호 값, 바깥 숫자는 원문 signed decode가 돌려주는 정수입니다."
      ariaLabel="n=15의 signed 인코딩 구간과 4+3, 4를 네 번 더한 경우의 도착 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 250" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                <marker id="paillier-ring-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M0 0 L8 4 L0 8 z" fill="#334155" />
                </marker>
              </defs>
              {scene.hops.map(([from, to]) => {
                const mid = at((from + ((to - from + N) % N) / 2) % N, R_PATH - 14);
                return (
                  <g key={`${from}-${to}`}>
                    <path d={arc(from, to)} fill="none" stroke="#334155" strokeWidth={1.25} markerEnd="url(#paillier-ring-arrow)" />
                    <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize={10} fill="#334155">
                      +{(to - from + N) % N}
                    </text>
                  </g>
                );
              })}
              {Array.from({ length: N }, (_, k) => {
                const zone = zoneOf(k);
                const color = ZONE_COLOR[zone];
                const p = at(k, R);
                const q = at(k, R_LABEL);
                const isEnd = k === scene.end;
                return (
                  <g key={k}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={12}
                      fill={color}
                      fillOpacity={isEnd ? 0.3 : 0.1}
                      stroke={color}
                      strokeWidth={isEnd ? 1.25 : 1}
                      strokeDasharray={zone === "over" ? "3 2" : undefined}
                    />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={11} fontWeight={isEnd ? 700 : 400} fill="#334155">{k}</text>
                    {signedLabel(k) && (
                      <text x={q.x} y={q.y + 4} textAnchor="middle" fontSize={10} fill={color}>{signedLabel(k)}</text>
                    )}
                  </g>
                );
              })}
              <text x={CX} y={CY - 2} textAnchor="middle" fontSize={11} fill="#64748b">mod 15</text>
              <text x={CX} y={CY + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">
                {scene.end < 0 ? "" : scene.end === 7 ? "7 → 오류" : "1 → 1로 읽음"}
              </text>
            </svg>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              <span className="text-blue-700 dark:text-blue-400">● 0–4 양수</span>
              <span className="text-amber-700 dark:text-amber-400">◌ 5–10 넘침 감지(점선)</span>
              <span className="text-violet-700 dark:text-violet-400">● 11–14 → −4…−1</span>
            </div>
          </div>
        );
      }}
    />
  );
}
