import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: Kimi K2.5 token 하나가 만들어질 때 나누는 방식마다 어떤 선이 몇 번 쓰이는지.
 * 노드 두 대와 GPU 16장의 위치는 고정이고, 장면마다 쓰이는 선과 숫자만 바뀐다.
 */
const SCENES = ["TP: 모두 모여 합치기", "PP: 경계에서 넘기기", "EP: 흩었다 모으기", "복제본: 넘기지 않기"] as const;

const NOTES = [
  "TP8에서는 층마다 attention 뒤와 FFN 뒤에 8장이 부분합을 모아 더합니다. 61층이면 token 하나에 122회입니다. 한 번에 오가는 양은 작아서 대역폭보다 왕복 지연이 쌓입니다.",
  "PP2에서는 앞 노드가 31층, 뒤 노드가 30층을 맡고 경계에서 hidden 7,168개를 BF16으로 한 번 넘깁니다. token당 14 KiB라 2,000 tok/s여도 0.23 Gbps입니다. 대신 두 노드가 한 token을 차례로 처리하므로 빨라지지는 않습니다.",
  "EP에서는 MoE 층마다 token을 고른 expert가 있는 장으로 보냈다가 결과를 되돌려 받습니다. BF16으로 8개 expert에 보냈다 받으면 층당 229 KB, 60층이면 token당 약 13.8 MB(상한)입니다. PCIe만 있는 노드는 이 경로가 가장 약합니다.",
  "노드마다 모델을 통째로 올리면 GPU끼리 노드를 넘어 주고받는 것이 없습니다. 앞단의 요청 분배기가 요청을 나눌 뿐입니다. 고속 네트워크가 없어도 용량이 노드 수만큼 늘어납니다.",
] as const;

const NODE_A = { x: 8, y: 54, w: 160, h: 112 };
const NODE_B = { x: 192, y: 54, w: 160, h: 112 };

function gpuPos(node: typeof NODE_A, i: number) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return { x: node.x + 14 + col * 36, y: node.y + 28 + row * 40 };
}

export default function NetworkDemandViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const scene = scenes.active;
  const hubA = { x: NODE_A.x + NODE_A.w / 2, y: NODE_A.y + 66 };

  return (
    <VizFrame
      eyebrow="Network demand per token"
      title="나누는 방식이 정하는 것은 선의 굵기보다 왕복 횟수입니다"
      description="왼쪽과 오른쪽 상자는 GPU 8장짜리 노드 두 대입니다. 장면마다 Kimi K2.5 token 하나를 만드는 동안 쓰이는 선만 그립니다."
      note="통신량은 config 값으로 계산한 상한입니다. 실제 NCCL 알고리즘과 FP8 dispatch는 바이트를 줄일 수 있습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="병렬화 방식별 token당 통신"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")} · <span className="text-sm text-foreground">{SCENES[scene]}</span></p>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center lg:gap-6">
        <svg viewBox="0 0 360 214" className="w-full" role="img" aria-label={SCENES[scene]}>
          <text x={NODE_A.x} y={NODE_A.y - 8} fontSize={10.5} fontWeight={700} fill="currentColor">노드 A</text>
          <text x={NODE_B.x} y={NODE_B.y - 8} fontSize={10.5} fontWeight={700} fill="currentColor">노드 B</text>
          {[NODE_A, NODE_B].map((node, n) => (
            <rect key={n} x={node.x} y={node.y} width={node.w} height={node.h} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1}
              strokeOpacity={scene === 0 || scene === 2 ? (n === 0 ? 1 : 0.35) : 1} />
          ))}
          {/* 요청 분배기: 복제본 장면에서만 쓰인다 */}
          <g opacity={scene === 3 ? 1 : 0.15}>
            <rect x={140} y={4} width={80} height={20} rx={4} fill="none" stroke="#059669" strokeWidth={1} />
            <text x={180} y={18} fontSize={10} textAnchor="middle" fill="#059669">요청 분배</text>
            <line x1={160} y1={24} x2={NODE_A.x + 80} y2={NODE_A.y} stroke="#059669" strokeWidth={1} />
            <line x1={200} y1={24} x2={NODE_B.x + 80} y2={NODE_B.y} stroke="#059669" strokeWidth={1} />
          </g>
          {/* TP: 노드 A의 8장이 한 점으로 모였다 흩어진다 */}
          <g opacity={scene === 0 ? 1 : 0}>
            {Array.from({ length: 8 }, (_, i) => {
              const p = gpuPos(NODE_A, i);
              return <line key={i} x1={p.x + 12} y1={p.y + 12} x2={hubA.x} y2={hubA.y - 18} stroke="#2563eb" strokeWidth={1} />;
            })}
            <circle cx={hubA.x} cy={hubA.y - 18} r={5} fill="#2563eb" />
          </g>
          {/* EP: 노드 A 안에서 여러 장으로 엇갈려 보낸다 */}
          <g opacity={scene === 2 ? 1 : 0}>
            {[[0, 5], [0, 7], [1, 6], [2, 4], [3, 6], [4, 1], [5, 3], [6, 0], [7, 2], [1, 3]].map(([a, b]) => {
              const p = gpuPos(NODE_A, a);
              const q = gpuPos(NODE_A, b);
              return <line key={`${a}-${b}`} x1={p.x + 12} y1={p.y + 12} x2={q.x + 12} y2={q.y + 12} stroke="#d97706" strokeWidth={1} />;
            })}
          </g>
          {/* PP: 경계 한 줄 */}
          <g opacity={scene === 1 ? 1 : 0}>
            <line x1={NODE_A.x + NODE_A.w} y1={NODE_A.y + 56} x2={NODE_B.x} y2={NODE_B.y + 56} stroke="#7c3aed" strokeWidth={1} />
            <polygon points={`${NODE_B.x},${NODE_B.y + 56} ${NODE_B.x - 6},${NODE_B.y + 52} ${NODE_B.x - 6},${NODE_B.y + 60}`} fill="#7c3aed" />
            <text x={180} y={NODE_A.y + 44} fontSize={9.5} textAnchor="middle" fill="#7c3aed">14 KiB</text>
            <text x={NODE_A.x + 80} y={NODE_A.y + NODE_A.h - 6} fontSize={9} textAnchor="middle" fill="#6b7280">층 1–31</text>
            <text x={NODE_B.x + 80} y={NODE_B.y + NODE_B.h - 6} fontSize={9} textAnchor="middle" fill="#6b7280">층 32–61</text>
          </g>
          {[NODE_A, NODE_B].map((node, n) =>
            Array.from({ length: 8 }, (_, i) => {
              const p = gpuPos(node, i);
              const active = scene === 1 || scene === 3 || n === 0;
              return (
                <rect key={`${n}-${i}`} x={p.x} y={p.y} width={24} height={24} rx={3}
                  fill={scene === 3 ? (n === 0 ? "#2563eb" : "#059669") : "#64748b"} fillOpacity={active ? 0.75 : 0.18} />
              );
            }),
          )}
          <text x={8} y={196} fontSize={11.5} fontWeight={700} fill="currentColor">
            {["token당 122회, 지연이 쌓임", "token당 경계 1회, 14 KiB", "token당 약 13.8 MB, 층마다 왕복", "노드 사이 GPU 통신 0"][scene]}
          </text>
          <text x={8} y={210} fontSize={9.5} fill="#6b7280">
            {["노드 안 PCIe에 둡니다", "노드를 넘겨도 100GbE면 충분합니다", "NVLink 없는 노드에서는 가장 약한 경로입니다", "용량은 노드 수에 비례합니다"][scene]}
          </text>
        </svg>
        <StableSceneStack
          active={scene}
          scenes={NOTES.map((note) => (
            <p key={note} className="border-l border-primary/50 pl-3 text-[13px] leading-6 text-muted-foreground sm:text-sm">{note}</p>
          ))}
        />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
