import NetworkSceneShell from "./NetworkSceneShell";

/**
 * 본문 대응: #fabric-oversubscription — source·destination이 어느 leaf에 있는지,
 * ECMP hash가 path를 얼마나 고르게 쓰는지, uplink 하나가 빠졌는지에 따라 실제 결과가 달라진다.
 * 숫자는 NetworkBudgetViz의 사례: host 8 × 100G = 800G, uplink 4 × 200G = 800G (1.00:1),
 * 한 uplink 장애 뒤 800 ÷ 600 = 1.33:1. leaf 2개·flow 배치·hash 결과는 설명용 가정이다.
 */
const HOSTS = 8;
const UPLINK_CAP = 200;
const BAR_MAX = 300;

const SCENES = [
  {
    label: "같은 leaf 안에서 끝남",
    summary: "uplink 사용 0",
    kind: "local",
    loads: [0, 0, 0, 0],
    note: "보내는 host와 받는 host가 같은 leaf 아래 있으면 data는 leaf에서 바로 돌아 나갑니다. uplink를 쓰지 않습니다. 본문이 말하는 workload placement는 이런 배치를 늘려 cross-leaf traffic 자체를 줄이는 일입니다.",
  },
  {
    label: "다른 leaf로 가는 flow 하나",
    summary: "spine 4개 중 1개 경로",
    kind: "single",
    loads: [0, 100, 0, 0],
    note: "받는 host가 leaf B 아래 있으면 uplink → spine → leaf B를 지납니다. ECMP는 비용이 같은 여러 경로 가운데 flow마다 hash 값으로 하나를 고르는 방식입니다. 여기서는 hash가 uplink 2를 골랐다고 둡니다(가정).",
  },
  {
    label: "8개 host가 동시에, 고르게",
    summary: "800G ÷ 800G = 1.00:1",
    kind: "even",
    loads: [200, 200, 200, 200],
    note: "leaf A의 host 8개가 각각 100G로 leaf B에 보냅니다(가정). hash가 uplink마다 flow 2개씩 완전히 고르게 나누면 모든 uplink가 정확히 200G로 찹니다. 수식의 ρ = 1.00:1은 이 이상적 분배를 전제한 값입니다.",
  },
  {
    label: "hash가 치우치면",
    summary: "uplink 1: 300G 요구 / 200G",
    kind: "skew",
    loads: [300, 200, 200, 100],
    note: "flow 수와 총량은 앞 장면과 같아 ρ는 여전히 1.00:1입니다. 하지만 hash가 3·2·2·1개로 나누면(가정) uplink 1에는 300G가 몰리고 uplink 4는 절반이 빕니다. 그래서 본문은 aggregate 비율과 별도로 hash 불균형과 queue를 측정합니다.",
  },
  {
    label: "uplink 하나가 빠지면",
    summary: "800G ÷ 600G = 1.33:1",
    kind: "down",
    loads: [300, 300, 200, null],
    note: "uplink 4가 고장 나면 살아 있는 uplink는 3 × 200G = 600G입니다. 같은 800G 요구를 나누면 1.33:1이고, 100G flow 8개를 가장 고르게 3·3·2로 나눠도 두 uplink는 용량보다 100G 많은 요구를 받습니다. 정상 상태와 장애 상태를 따로 계산하는 이유입니다.",
  },
] as const;

const W = 360;
const H = 236;
const SPINE_Y = 14;
const SPINE_H = 24;
const SPINE_X: readonly number[] = [28, 108, 188, 268];
const SPINE_W = 64;
const LEAF_Y = 112;
const LEAF_H = 26;
const LEAF: readonly { name: string; x: number; w: number }[] = [
  { name: "leaf A", x: 22, w: 140 },
  { name: "leaf B", x: 198, w: 140 },
];
const HOST_Y = 192;
const HOST_W = 12;
const HOST_STEP = 17.5;

const hostX = (leaf: number, host: number) => LEAF[leaf].x + 2 + host * HOST_STEP;
const spineMid = (spine: number) => SPINE_X[spine] + SPINE_W / 2;
const leafUpX = (leaf: number, spine: number) => LEAF[leaf].x + 22 + spine * 32;

type Kind = (typeof SCENES)[number]["kind"];
type Scene = { label: string; summary: string; kind: Kind; loads: readonly (number | null)[]; note: string };
const SCENE_LIST: readonly Scene[] = SCENES;

function uplinkColor(load: number | null) {
  if (load === null) return "#dc2626";
  if (load > UPLINK_CAP) return "#dc2626";
  if (load > 0) return "#2563eb";
  return "#cbd5e1";
}

function hostActive(kind: Kind, leaf: number, host: number) {
  if (kind === "local") return leaf === 0 && (host === 0 || host === 5);
  if (kind === "single") return host === 0;
  return true;
}

export default function LeafSpinePathViz() {
  return (
    <NetworkSceneShell
      eyebrow="Leaf-spine 경로"
      title="1.00:1 fabric도 hash가 치우치거나 uplink가 빠지면 uplink가 넘칩니다"
      description="그림은 같은 구성의 leaf 2개와 spine 4개(가정)이고 빨간 실선은 200G보다 많은 요구를 받는 링크, 빨간 점선은 고장 난 링크입니다. 막대는 leaf A에서 spine으로 나가는 uplink 4개의 요구량입니다. 점선이 uplink 한 개 용량 200G이고, 앞 절 그림의 host 8 × 100G·uplink 4 × 200G 사례를 그대로 씁니다."
      ariaLabel="leaf-spine fabric에서 같은 leaf 통신, cross-leaf 경로, 균등 분배, hash 불균형, uplink 장애 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENE_LIST[active];
        const kind = scene.kind;
        return (
          <div className="min-w-0 sm:grid sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] sm:items-center sm:gap-6">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {SPINE_X.map((x, spine) => (
                <g key={`spine-${spine}`}>
                  <rect x={x} y={SPINE_Y} width={SPINE_W} height={SPINE_H} rx={6} fill="none" stroke="#64748b" strokeWidth={1} />
                  <text x={x + SPINE_W / 2} y={SPINE_Y + 16} textAnchor="middle" fontSize={11} fill="#64748b">
                    spine {spine + 1}
                  </text>
                </g>
              ))}
              {LEAF.map((_leaf, li) =>
                SPINE_X.map((_, spine) => {
                  const load = scene.loads[spine];
                  const isA = li === 0;
                  const down = isA && load === null;
                  const color = isA ? uplinkColor(load) : load === null ? "#cbd5e1" : uplinkColor(load);
                  // leaf B 쪽 spine→leaf 링크도 같은 200G 용량에 같은 양을 받으므로 같은 색 규칙을 씁니다.
                  return (
                    <line
                      key={`up-${li}-${spine}`}
                      x1={leafUpX(li, spine)}
                      y1={LEAF_Y}
                      x2={spineMid(spine)}
                      y2={SPINE_Y + SPINE_H}
                      stroke={color}
                      strokeWidth={color === "#cbd5e1" ? 1 : 1.25}
                      strokeDasharray={down ? "4 3" : undefined}
                    />
                  );
                }),
              )}
              {LEAF.map((leaf, li) => (
                <g key={leaf.name}>
                  <rect x={leaf.x} y={LEAF_Y} width={leaf.w} height={LEAF_H} rx={6} fill="none" stroke="#64748b" strokeWidth={1} />
                  <text x={leaf.x + leaf.w / 2} y={LEAF_Y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">
                    {leaf.name}
                  </text>
                  {Array.from({ length: HOSTS }, (_, host) => {
                    const on = hostActive(kind, li, host);
                    return (
                      <g key={`host-${li}-${host}`}>
                        <line
                          x1={hostX(li, host) + HOST_W / 2}
                          y1={HOST_Y}
                          x2={hostX(li, host) + HOST_W / 2}
                          y2={LEAF_Y + LEAF_H}
                          stroke={on ? "#16a34a" : "#cbd5e1"}
                          strokeWidth={1}
                        />
                        <rect
                          x={hostX(li, host)}
                          y={HOST_Y}
                          width={HOST_W}
                          height={HOST_W}
                          rx={2}
                          fill={on ? "#16a34a" : "#ffffff"}
                          fillOpacity={on ? 0.85 : 0}
                          stroke="#64748b"
                          strokeWidth={1}
                        />
                      </g>
                    );
                  })}
                  <text x={leaf.x + leaf.w / 2} y={HOST_Y + 30} textAnchor="middle" fontSize={10} fill="#64748b">
                    host 8개 × 100G
                  </text>
                </g>
              ))}
              {kind === "local" && (
                <text x={LEAF[0].x + LEAF[0].w / 2} y={LEAF_Y - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">
                  leaf 안에서 반환
                </text>
              )}
              {kind === "down" && (
                <text x={(leafUpX(0, 3) + spineMid(3)) / 2 + 14} y={(LEAF_Y + SPINE_Y + SPINE_H) / 2 - 4} textAnchor="start" fontSize={11} fontWeight={700} fill="#dc2626">
                  ✕ 고장
                </text>
              )}
            </svg>
            <div className="mt-3 space-y-1.5 sm:mt-0" aria-hidden="true">
              {scene.loads.map((load, index) => {
                const over = load !== null && load > UPLINK_CAP;
                const width = load === null ? 0 : (load / BAR_MAX) * 100;
                return (
                  <div key={index} className="grid grid-cols-[4rem_minmax(0,1fr)_5.5rem] items-center gap-2 text-xs">
                    <span className="text-muted-foreground">uplink {index + 1}</span>
                    <div className="relative h-3.5 min-w-0 rounded-sm bg-muted/40">
                      <div
                        className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                        style={{ width: `${width}%`, backgroundColor: over ? "#dc2626" : "#2563eb" }}
                      />
                      <span className="absolute inset-y-[-3px] border-l border-dashed border-foreground/60" style={{ left: `${(UPLINK_CAP / BAR_MAX) * 100}%` }} />
                    </div>
                    <span className={`text-right font-mono ${over || load === null ? "font-bold text-red-700 dark:text-red-400" : ""}`}>
                      {load === null ? "고장" : `${load}G / ${UPLINK_CAP}G`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
