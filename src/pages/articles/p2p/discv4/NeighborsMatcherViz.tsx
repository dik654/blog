import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #findnode 의 matcher 문단 — go-ethereum v1.17.8은 raw contact 수가 16에 이르면
 * request를 끝내고, invalid contact는 결과에서 빼지만 raw 수에는 센다. 16개보다 적으면
 * 다음 packet을 기다리다 timeout되지만 그때까지 모은 valid nodes를 쓴다.
 * 12번째 칸 중 하나가 검사 실패, Bob에게 9개뿐인 경우는 설명용 가정이다.
 */
type Cell = "empty" | "valid" | "invalid" | "missing";

const INVALID_SLOT = 4; // 0부터 센 다섯 번째 칸 (가정)

function cells(received: number, total: number): Cell[] {
  return Array.from({ length: 16 }, (_, i) => {
    if (i < received) return i === INVALID_SLOT && total === 16 ? "invalid" : "valid";
    if (i >= total) return "missing";
    return "empty";
  });
}

const SCENES = [
  {
    label: "FINDNODE를 보낸 직후",
    summary: "raw 0 / 16",
    received: 0,
    total: 16,
    status: "다음 NEIGHBORS를 기다림",
    note: "Alice는 같은 Bob identity·source IP의 pending FINDNODE에 매칭되는 NEIGHBORS만 받습니다. 아직 도착한 contact가 없습니다.",
  },
  {
    label: "첫 NEIGHBORS: 12개",
    summary: "raw 12 · valid 11",
    received: 12,
    total: 16,
    status: "raw 12 < 16 → 계속 기다림",
    note: "Alice는 expiration과 각 node의 IP·UDP·TCP·public key를 검사합니다. 하나가 검사에 실패했다고 하면(가정) 결과에는 11개만 들어가지만 raw 수는 12입니다.",
  },
  {
    label: "둘째 NEIGHBORS: 4개",
    summary: "raw 16 · valid 15",
    received: 16,
    total: 16,
    status: "raw 16 도달 → request 끝",
    note: "raw 수가 16에 이르면 v1.17.8 matcher가 request를 끝냅니다. 검사에 실패한 1개도 raw 16 안에 들어 있으므로 결과는 15개입니다.",
  },
  {
    label: "Bob에게 9개뿐이라면 (가정)",
    summary: "raw 9 · valid 9 · timeout",
    received: 9,
    total: 9,
    status: "다음 packet 없음 → timeout, 오류 아님",
    note: "첫 NEIGHBORS 뒤 matcher가 다음 packet을 기다리다 timeout됩니다. 이 release는 packet을 하나라도 받았다면 timeout을 오류로 반환하지 않고 지금까지 모은 valid nodes를 씁니다. 응답 성공과 16개 수신은 다른 metric입니다.",
  },
] as const;

const TONE: Record<Cell, string> = {
  empty: "border-dashed border-border bg-background text-muted-foreground/50",
  valid: "border-emerald-600 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  invalid: "border-red-600 bg-red-500/10 text-red-700 dark:text-red-400",
  missing: "border-dashed border-border/40 text-muted-foreground/40",
};

const MARK: Record<Cell, string> = { empty: "", valid: "✓", invalid: "✗", missing: "–" };

function Packet({ title, items, offset, cols }: { title: string; items: Cell[]; offset: number; cols: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-border/70 p-2">
      <p className="mb-2 text-[11px] font-semibold text-muted-foreground sm:text-xs">{title}</p>
      <div className={`grid ${cols} gap-1`}>
        {items.map((cell, i) => (
          <div
            key={offset + i}
            className={`flex h-7 items-center justify-center rounded-sm border text-xs font-bold transition-colors duration-300 motion-reduce:transition-none ${TONE[cell]}`}
            aria-label={`contact ${offset + i + 1}: ${cell}`}
          >
            {MARK[cell]}
          </div>
        ))}
      </div>
    </div>
  );
}

function MatcherBody({ active }: { active: number }) {
        const scene = SCENES[active];
        const all = cells(scene.received, scene.total);
        const valid = all.filter((c) => c === "valid").length;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[3fr_1fr] gap-2">
              <Packet title="NEIGHBORS #1 (최대 12)" items={all.slice(0, 12)} offset={0} cols="grid-cols-6" />
              <Packet title="#2" items={all.slice(12)} offset={12} cols="grid-cols-2" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
              <div className="rounded-md border border-border px-1 py-2">
                <span className="block text-muted-foreground">raw 수신</span>
                <span className="font-mono text-base font-bold">{scene.received}</span>
              </div>
              <div className="rounded-md border border-border px-1 py-2">
                <span className="block text-muted-foreground">결과(valid)</span>
                <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400">{valid}</span>
              </div>
              <div className="rounded-md border border-border px-1 py-2">
                <span className="block text-muted-foreground">matcher</span>
                <span className="block text-[11px] font-semibold leading-4 sm:text-xs">{scene.status}</span>
              </div>
            </div>
          </div>
        );
}

export default function NeighborsMatcherViz() {
  return (
    <SceneShell
      eyebrow="NEIGHBORS 수신"
      title="받은 수와 쓸 수 있는 수를 따로 셉니다"
      description="칸 하나가 contact 하나입니다. ✓는 검사를 통과해 결과에 들어간 contact, ✗는 검사에 실패했지만 받은 수(raw)에는 세는 contact, –는 오지 않는 칸입니다. go-ethereum v1.17.8 기준입니다."
      ariaLabel="NEIGHBORS 두 packet을 받으며 raw 수와 valid 수가 달라지는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <MatcherBody key={scene.label} active={index} />)} />
      )}
    />
  );
}
