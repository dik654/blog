import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "전체",
  "공개 요청",
  "공개 조회",
  "공개 응답",
  "Engine 요청",
  "검증",
  "실행 결과",
  "선택 반영",
  "실패 경계",
] as const;

const NOTES = [
  "지갑과 합의 클라이언트는 같은 실행 클라이언트에 JSON-RPC 요청을 보내지만, 서로 다른 listener와 module을 거칩니다. 아래 두 줄은 대체 경로가 아니라 동시에 존재하는 두 신뢰 경계입니다.",
  "지갑이 id 17로 eth_getBalance(A, latest)를 보냅니다. 공개 HTTP listener가 켜져 있고 eth module이 허용돼 있어야 메서드 handler까지 도달합니다.",
  "Eth handler는 latest를 현재 canonical state provider로 해석하고 blocking I/O 작업에서 A의 account balance를 읽습니다. 이 시점의 canonical head는 block 1,000입니다.",
  "후보 block 1,001이 아직 canonical이 아니므로 공개 조회는 A의 기존 잔액 100 ETH를 반환합니다. JSON-RPC id 17은 요청과 응답을 연결할 뿐 chain 선택 권한을 주지 않습니다.",
  "합의 클라이언트가 별도 auth listener로 engine_newPayloadV4를 보냅니다. HTTP Authorization header의 JWT가 먼저 검사되고, 그 뒤에야 Engine method를 해석합니다.",
  "Engine handler는 V4에 맞는 payload·blob hash·beacon root·execution requests 형식을 검사합니다. 형식과 fork version이 맞아야 candidate가 consensus engine으로 전달됩니다.",
  "Execution client가 후보를 실행·검증해 VALID를 반환해도 block 1,001이 곧바로 canonical head가 되지는 않습니다. VALID는 실행 결과가 맞다는 판정이고, 선택은 후속 forkchoiceUpdated의 책임입니다.",
  "합의 클라이언트가 block 1,001을 head로 정한 forkchoiceUpdated를 보내면 canonical view가 바뀝니다. 그 뒤 새 eth_getBalance(A, latest)는 89.999958 ETH를 읽습니다.",
  "잘못된 JWT는 method dispatch 전에 막히고, 지원하지 않는 Engine version·field는 Engine validator에서 거절됩니다. 공개 listener에 Engine method가 없으면 method not found이며, 세 실패는 같은 오류로 합쳐지지 않습니다.",
] as const;

type NodeId =
  | "wallet"
  | "public-listener"
  | "eth-module"
  | "provider"
  | "cl"
  | "auth-listener"
  | "engine-module"
  | "engine-tree";

const PUBLIC_NODES = [
  { id: "wallet", eyebrow: "호출자", title: "지갑 · 애플리케이션", detail: "eth_getBalance · id 17" },
  { id: "public-listener", eyebrow: "공개 경계", title: "HTTP · WS listener", detail: "transport · 허용 module" },
  { id: "eth-module", eyebrow: "메서드", title: "EthApi handler", detail: "params · block selector" },
  { id: "provider", eyebrow: "읽기", title: "State provider", detail: "canonical account state" },
] as const;

const ENGINE_NODES = [
  { id: "cl", eyebrow: "호출자", title: "Consensus client", detail: "newPayload · forkchoice" },
  { id: "auth-listener", eyebrow: "인증 경계", title: "Auth listener", detail: "JWT before dispatch" },
  { id: "engine-module", eyebrow: "메서드", title: "EngineApi handler", detail: "fork version · fields" },
  { id: "engine-tree", eyebrow: "실행", title: "Consensus engine", detail: "execute · status · canonical" },
] as const;

const ACTIVE: ReadonlyArray<readonly NodeId[]> = [
  [...PUBLIC_NODES.map((node) => node.id), ...ENGINE_NODES.map((node) => node.id)],
  ["wallet", "public-listener"],
  ["public-listener", "eth-module", "provider"],
  ["provider", "eth-module", "public-listener", "wallet"],
  ["cl", "auth-listener"],
  ["auth-listener", "engine-module"],
  ["engine-module", "engine-tree", "cl"],
  ["cl", "auth-listener", "engine-module", "engine-tree", "provider", "wallet"],
  ["public-listener", "auth-listener", "engine-module"],
];

const RECEIPTS = [
  ["경계", "공개 transport와 JWT auth module을 분리"],
  ["request", "eth_getBalance · latest · id 17"],
  ["read view", "canonical block 1,000 · A = 100 ETH"],
  ["response", "id 17 · result = 100 ETH"],
  ["request", "engine_newPayloadV4 · candidate 1,001"],
  ["admission", "JWT 통과 · V4 fields 검증"],
  ["status", "VALID · 아직 canonical 아님"],
  ["canonical", "head 1,001 · A = 89.999958 ETH"],
  ["rejection", "auth · method · protocol 오류를 분리"],
] as const;

const TRACE = [
  "두 경로를 먼저 같은 좌표에 놓습니다.",
  "지갑 → 공개 listener",
  "공개 listener → EthApi → provider",
  "provider → EthApi → 지갑",
  "CL → JWT auth listener",
  "JWT → EngineApi validator",
  "EngineApi → consensus engine → PayloadStatus",
  "후속 forkchoiceUpdated → canonical view",
  "실패한 경계에서 즉시 중단",
] as const;

function Lane({
  label,
  relation,
  nodes,
  activeIds,
}: {
  label: string;
  relation: string;
  nodes: ReadonlyArray<{ id: NodeId; eyebrow: string; title: string; detail: string }>;
  activeIds: Set<NodeId>;
}) {
  return (
    <section className="border-t border-border py-3 first:border-t-0" aria-label={`${label} 경로`}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <strong className="text-[11px] text-foreground">{label}</strong>
        <span className="text-[10px] text-muted-foreground">{relation}</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border p-px lg:grid-cols-4">
        {nodes.map((node, index) => {
          const selected = activeIds.has(node.id);
          return (
            <div
              key={node.id}
              data-rpc-node={node.id}
              data-active={selected ? "true" : "false"}
              className={`relative min-w-0 bg-background p-3 sm:p-4 ${selected ? "ring-2 ring-inset ring-primary" : "opacity-40"}`}
            >
              <span className="font-mono text-[9px] font-black text-primary">{node.eyebrow}</span>
              <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{node.title}</strong>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">{node.detail}</span>
              {index < nodes.length - 1 ? (
                <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-1 text-primary lg:block">→</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function RethRpcBoundaryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;
  const activeIds = new Set(ACTIVE[active]);

  return (
    <VizFrame
      eyebrow="개념 경로 · 같은 노드의 두 JSON-RPC 요청"
      title="공개 조회와 Engine 요청은 첫 listener부터 갈라집니다"
      description="A의 잔액 조회와 A→B 10 ETH 후보 검증을 나란히 따라가며, 같은 JSON-RPC 봉투 아래에서 달라지는 권한과 상태를 확인합니다."
      note="Reth v2.8.1 commit d763342f와 Ethereum Execution APIs의 고정 revision을 기준으로 구성했습니다. 블록 번호와 잔액은 전체 노드 지도의 설명용 사례입니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-rpc-scene={active}
        tabIndex={0}
        role="group"
        aria-label="공개 JSON-RPC와 JWT 인증 Engine API가 서로 다른 상태를 처리하는 아홉 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-9 gap-px bg-border p-px" aria-label="Reth RPC 경계의 아홉 장면">
          {SCENES.map((scene, index) => (
            <div key={scene} className={`min-w-0 bg-background px-0.5 py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
            </div>
          ))}
        </div>

        <div className="mt-2 border-y border-border px-1 sm:mt-3 sm:px-3">
          <Lane label="Public JSON-RPC" relation="지갑이 canonical state를 읽습니다" nodes={PUBLIC_NODES} activeIds={activeIds} />
          <Lane label="Authenticated Engine API" relation="CL이 후보의 실행과 chain 선택을 요청합니다" nodes={ENGINE_NODES} activeIds={activeIds} />
        </div>

        <div className="mt-2 grid gap-px bg-border p-px sm:mt-3 sm:grid-cols-[0.75fr_1.25fr]">
          <div className="min-w-0 bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">지금 따라갈 경로</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{TRACE[active]}</strong>
          </div>
          <div className="min-w-0 bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">상태 영수증</span>
            <strong className="mt-1 block break-keep text-xs leading-5 text-primary sm:text-sm">{RECEIPTS[active][0]} · {RECEIPTS[active][1]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-2 min-h-[5.5rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["전체", "요청", "조회", "응답", "엔진", "검증", "결과", "반영", "실패"]}
          playLabel="재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]]:flex-nowrap [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:whitespace-nowrap [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
