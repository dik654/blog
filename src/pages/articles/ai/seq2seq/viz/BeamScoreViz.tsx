import SceneShell from "./SceneShell";

/**
 * 본문 대응: #decoder ExplainedFormula — q_t = q_{t−1} + log p_t[y_t], beam search는 q_t로 비교.
 * 확률은 모두 설명용 가정. ln 0.6 = −0.51, ln 0.4 = −0.92.
 * 고마워→요 −0.51 + ln 0.5(−0.69) = −1.20, 고마워→<EOS> −0.51 + ln 0.3(−1.20) = −1.71,
 * 감사→해요 −0.92 + ln 0.9(−0.11) = −1.02. 폭 2면 −1.02, −1.20을 남긴다.
 */
type TreeNode = { id: string; parent: string | null; token: string; p: number; x: number; y: number };

const NODES: readonly TreeNode[] = [
  { id: "sos", parent: null, token: "<SOS>", p: 1, x: 6, y: 96 },
  { id: "a", parent: "sos", token: "고마워", p: 0.6, x: 128, y: 50 },
  { id: "b", parent: "sos", token: "감사", p: 0.4, x: 128, y: 150 },
  { id: "aa", parent: "a", token: "요", p: 0.5, x: 250, y: 22 },
  { id: "ab", parent: "a", token: "<EOS>", p: 0.3, x: 250, y: 78 },
  { id: "ba", parent: "b", token: "해요", p: 0.9, x: 250, y: 150 },
];

const byId = (id: string) => NODES.find((node) => node.id === id) as TreeNode;
const score = (id: string): number => {
  const node = byId(id);
  return node.parent === null ? 0 : score(node.parent) + Math.log(node.p);
};
const fmt = (value: number) => (value === 0 ? "0" : `−${Math.abs(value).toFixed(2)}`);

const NW = 84;
const NH = 34;
const W = 360;
const H = 200;

const SCENES = [
  {
    label: "t=1 · 두 갈래",
    summary: "q₁ = log p: −0.51 · −0.92",
    visible: ["sos", "a", "b"],
    kept: ["a", "b"],
    dropped: [] as string[],
    note: "첫 token 후보 둘을 펼칩니다. q는 고른 token의 log 확률을 더한 값이라 확률 1보다 작은 token을 붙일 때마다 내려갑니다.",
  },
  {
    label: "Greedy · 한 줄만",
    summary: "고마워 → 요 · q₂ = −1.20",
    visible: ["sos", "a", "b", "aa", "ab"],
    kept: ["a", "aa"],
    dropped: ["b", "ab"],
    note: "Greedy는 step마다 확률이 가장 높은 하나만 남깁니다. t=1에서 감사를 버렸으니 그 아래 후보는 다시 보지 않습니다.",
  },
  {
    label: "Beam 폭 2 · q로 비교",
    summary: "남김: −1.02 · −1.20 / 버림: −1.71",
    visible: ["sos", "a", "b", "aa", "ab", "ba"],
    kept: ["ba", "aa"],
    dropped: ["ab"],
    note: "두 prefix를 모두 펼친 뒤 q가 높은 두 개를 남깁니다. 감사가 해요(0.9)를 만나 1등이 되지만, q가 높다고 번역 품질이 더 좋다는 보장은 아닙니다.",
  },
] as const;

export default function BeamScoreViz() {
  return (
    <SceneShell
      eyebrow="누적 점수 q · greedy와 beam"
      title="Token을 붙일 때마다 log 확률을 더하고, beam은 그 합으로 후보를 고릅니다"
      description="상자 하나가 prefix 끝의 token과 그 token의 확률 p이고, 아래 숫자가 그 prefix까지의 누적 q입니다. 모든 확률은 설명용 가정이며 화면에 없는 다른 token 후보는 생략했습니다."
      ariaLabel="SOS에서 갈라지는 후보 tree에서 greedy와 beam 폭 2가 누적 log 확률로 prefix를 남기는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const visible = new Set<string>(scene.visible);
        const kept = new Set<string>(scene.kept);
        const dropped = new Set<string>(scene.dropped);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {NODES.filter((node) => node.parent !== null).map((node) => {
              const parent = byId(node.parent as string);
              const show = visible.has(node.id);
              return (
                <g key={`e-${node.id}`} opacity={show ? (dropped.has(node.id) ? 0.35 : 1) : 0}>
                  <line x1={parent.x + NW} y1={parent.y + NH / 2} x2={node.x} y2={node.y + NH / 2} stroke={kept.has(node.id) ? "#2563eb" : "#94a3b8"} strokeWidth={kept.has(node.id) ? 1.25 : 1} />
                </g>
              );
            })}
            {NODES.map((node) => {
              const show = visible.has(node.id);
              const isKept = kept.has(node.id);
              const isDropped = dropped.has(node.id);
              return (
                <g key={node.id} opacity={show ? (isDropped ? 0.35 : 1) : 0}>
                  <rect x={node.x} y={node.y} width={NW} height={NH} rx={4} fill={isKept ? "#2563eb" : "#94a3b8"} fillOpacity={isKept ? 0.9 : 0.2} stroke={isKept ? "#2563eb" : "#94a3b8"} strokeWidth={1} strokeDasharray={isDropped ? "3 2" : undefined} />
                  <text x={node.x + NW / 2} y={node.y + 14} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={isKept ? "#ffffff" : "#334155"}>{node.parent === null ? node.token : `${node.token} · p=${node.p}`}</text>
                  <text x={node.x + NW / 2} y={node.y + 28} textAnchor="middle" fontSize={10} fill={isKept ? "#ffffff" : "#475569"}>q={fmt(score(node.id))}</text>
                  {isDropped && <text x={node.x + NW / 2} y={node.y + NH + 12} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">버림</text>}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
