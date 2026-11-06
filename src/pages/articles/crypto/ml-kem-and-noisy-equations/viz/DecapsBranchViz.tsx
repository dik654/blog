import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #source — kem.c 146행 복원, 150행 해시, 153행 재암호화, 155행 비교, 158행 대체 키, 161행 조건부 복사.
 * 일치와 불일치 모두 32바이트 키 하나로 끝나므로 결과 상자를 같은 자리에 둡니다.
 */
const W = 360;
const H = 314;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#64748b";

type NodeId = "c" | "m" | "g" | "enc" | "cmp" | "alt" | "k" | "out";
type EdgeId = "c-m" | "m-g" | "g-enc" | "enc-cmp" | "c-cmp" | "cmp-alt" | "cmp-k" | "g-k" | "alt-out" | "k-out";

const NODES: Record<NodeId, { x: number; y: number; w: number; h: number; text: string; sub?: string }> = {
  c: { x: 8, y: 4, w: 118, h: 36, text: "받은 캡슐 c" },
  m: { x: 170, y: 4, w: 164, h: 36, text: "내부 복호 → m′" },
  g: { x: 170, y: 56, w: 164, h: 36, text: "해시 G → K′, r′" },
  enc: { x: 170, y: 108, w: 164, h: 36, text: "다시 암호화 → c′" },
  cmp: { x: 8, y: 160, w: 326, h: 34, text: "c′ = c 인가?" },
  alt: { x: 8, y: 214, w: 164, h: 44, text: "대체 키", sub: "J(z ‖ c)" },
  k: { x: 186, y: 214, w: 166, h: 44, text: "후보 키", sub: "K′" },
  out: { x: 8, y: 276, w: 344, h: 34, text: "32바이트 키 하나" },
};

const EDGES: Record<EdgeId, { d: string; arrow: string; label?: { x: number; y: number; text: string } }> = {
  "c-m": { d: "M126 22 H170", arrow: "164,18 170,22 164,26" },
  "m-g": { d: "M252 40 V56", arrow: "248,50 252,56 256,50" },
  "g-enc": { d: "M252 92 V108", arrow: "248,102 252,108 256,102" },
  "enc-cmp": { d: "M252 144 V160", arrow: "248,154 252,160 256,154" },
  "c-cmp": { d: "M67 40 V160", arrow: "63,154 67,160 71,154" },
  "cmp-alt": { d: "M90 194 V214", arrow: "86,208 90,214 94,208", label: { x: 100, y: 209, text: "다름" } },
  "cmp-k": { d: "M270 194 V214", arrow: "266,208 270,214 274,208", label: { x: 236, y: 209, text: "같음" } },
  "g-k": { d: "M334 74 H346 V214", arrow: "342,208 346,214 350,208" },
  "alt-out": { d: "M90 258 V276", arrow: "86,270 90,276 94,270" },
  "k-out": { d: "M270 258 V276", arrow: "266,270 270,276 274,270" },
};

const SCENES = [
  { label: "복원", summary: "146행", note: "수신자만 아는 복호 키로 받은 캡슐을 풀어 메시지 m′을 얻습니다. mod 17 사례에서 7을 비트 1로 읽은 일이 이 단계의 축소판입니다.", nodes: ["c", "m"], edges: ["c-m"], color: BLUE },
  { label: "후보 재료", summary: "150행", note: "m′과 공개 키의 해시를 해시 함수 G에 넣어 후보 키 K′과 재암호화 난수 r′을 함께 만듭니다.", nodes: ["m", "g"], edges: ["m-g"], color: BLUE },
  { label: "다시 만들기", summary: "153행", note: "공개 키, m′, r′으로 캡슐 c′을 다시 만듭니다. 받은 캡슐과 같은 절차를 수신자가 직접 되풀이합니다.", nodes: ["g", "enc"], edges: ["g-enc"], color: BLUE },
  { label: "같으면", summary: "155·161행", note: "158행이 대체 키를 먼저 만들어 두지만, c′과 c가 같으면 161행이 그 자리에 정상 후보 K′을 복사합니다.", nodes: ["enc", "c", "cmp", "k", "out"], edges: ["enc-cmp", "c-cmp", "cmp-k", "g-k", "k-out"], color: BLUE },
  { label: "다르면", summary: "155·158행", note: "비밀 z와 받은 캡슐로 만든 대체 키가 그대로 남습니다. 이 경로도 32바이트 키로 끝나 불일치를 그대로 알려 주지 않습니다. 이를 암묵적 거절이라 합니다.", nodes: ["enc", "c", "cmp", "alt", "out"], edges: ["enc-cmp", "c-cmp", "cmp-alt", "alt-out"], color: RED },
] as const;

export default function DecapsBranchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const liveNodes = new Set<string>(scene.nodes);
  const liveEdges = new Set<string>(scene.edges);

  return (
    <VizFrame
      eyebrow="복원 경로의 분기"
      title="받은 캡슐을 다시 만들어 보고 어느 키를 쓸지 고릅니다"
      description="고정한 ML-KEM-768 kem.c의 행 번호를 따라갑니다. 바깥 입력 검사는 끝났다고 두었고, 두 갈래는 논리를 나눠 그린 표기입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="캡슐을 복원하고 재암호화해 비교한 뒤 후보 키 또는 대체 키가 남는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[380px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          {(Object.keys(EDGES) as EdgeId[]).map((id) => {
            const edge = EDGES[id];
            const live = liveEdges.has(id);
            const color = live ? scene.color : "#94a3b8";
            return (
              <g key={id} opacity={live ? 1 : 0.45}>
                <path d={edge.d} fill="none" stroke={color} strokeWidth={live ? 1.25 : 1} />
                <polyline points={edge.arrow} fill="none" stroke={color} strokeWidth={live ? 1.25 : 1} />
                {edge.label && (
                  <text x={edge.label.x} y={edge.label.y} fontSize={13} fontWeight={700} fill={live ? color : GRAY}>{edge.label.text}</text>
                )}
              </g>
            );
          })}
          {(Object.keys(NODES) as NodeId[]).map((id) => {
            const node = NODES[id];
            const live = liveNodes.has(id);
            const color = live ? scene.color : "#94a3b8";
            return (
              <g key={id} opacity={live ? 1 : 0.55}>
                <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={8} fill={live ? `${color}1a` : "none"} stroke={color} strokeWidth={live ? 1.25 : 1} />
                <text
                  x={node.x + node.w / 2}
                  y={node.y + (node.sub ? 18 : node.h / 2 + 5)}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={live ? 700 : 500}
                  fill={live ? color : GRAY}
                >
                  {node.text}
                </text>
                {node.sub && (
                  <text x={node.x + node.w / 2} y={node.y + 36} textAnchor="middle" fontSize={13} fill={live ? color : GRAY}>{node.sub}</text>
                )}
              </g>
            );
          })}
        </svg>
        <StableSceneStack
          active={scenes.active}
          className="mt-2"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
