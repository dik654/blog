import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #release — primary 밖 sender의 Ineligible, 같은 peer의 duplicate 이동,
 * deque_size를 넘긴 eviction, primary에서 빠진 peer의 reference 감소를 한 cache에서 차례로 본다.
 * deque_size=2, digest 이름(d3·d5·d7·d8·d9), C가 primary 밖이라는 설정은 모두 설명용 가정이다.
 * count는 #cache-eligibility의 c(d) = 그 digest를 가진 eligible peer deque 수.
 */

type PeerKey = "A" | "B" | "C";

interface Scene {
  label: string;
  summary: string;
  note: string;
  deques: Record<PeerKey, readonly string[]>;
  eligible: Record<PeerKey, boolean>;
  changedPeer: PeerKey | null;
  waiter: string;
}

const DIGESTS = ["d3", "d5", "d7", "d8", "d9"] as const;
const PEERS: readonly PeerKey[] = ["A", "B", "C"];

const SCENES: readonly Scene[] = [
  {
    label: "출발 상태",
    summary: "d7 count = 2",
    note: "A와 B는 latest.primary 안의 peer이고 C는 밖에 있다고 가정합니다. A deque는 최신 d3 뒤에 d7을, B deque는 d7과 d5를 둡니다. d7 payload는 items에 하나만 있고 count는 두 deque를 세어 2입니다. Bob은 d9를 subscribe해 waiter로 기다립니다(가정).",
    deques: { A: ["d3", "d7"], B: ["d7", "d5"], C: [] },
    eligible: { A: true, B: true, C: false },
    changedPeer: null,
    waiter: "d9 · pending",
  },
  {
    label: "primary 밖 sender",
    summary: "waiter 응답 · cache Ineligible",
    note: "C가 d9를 보냅니다. Engine은 waiters를 먼저 꺼내므로 Bob의 d9 waiter는 item을 받습니다. 그 다음 eligibility 검사에서 C가 latest.primary 밖이라 cache insert는 Ineligible로 끝나고, d9는 어느 deque에도 items에도 남지 않습니다.",
    deques: { A: ["d3", "d7"], B: ["d7", "d5"], C: [] },
    eligible: { A: true, B: true, C: false },
    changedPeer: "C",
    waiter: "d9 · 응답함",
  },
  {
    label: "같은 peer의 중복",
    summary: "d7 앞으로 · count 그대로 2",
    note: "A가 이미 deque에 있는 d7을 다시 보냅니다. 같은 peer의 duplicate digest는 deque 앞쪽으로 옮겨질 뿐 새 reference가 아니므로 d7 count는 2로 그대로입니다. 순서만 [d3, d7]에서 [d7, d3]으로 바뀝니다.",
    deques: { A: ["d7", "d3"], B: ["d7", "d5"], C: [] },
    eligible: { A: true, B: true, C: false },
    changedPeer: "A",
    waiter: "d9 · 응답함",
  },
  {
    label: "deque_size 초과",
    summary: "d3 밀려남 → count 0 → 제거",
    note: "A가 새 d8을 보냅니다. deque_size를 2로 가정했으므로 가장 오래된 d3이 A deque에서 밀려납니다. d3을 참조하던 deque는 A 하나뿐이라 count가 1에서 0이 되고, d3은 items에서도 제거됩니다. d8은 count 1로 새로 들어갑니다.",
    deques: { A: ["d8", "d7"], B: ["d7", "d5"], C: [] },
    eligible: { A: true, B: true, C: false },
    changedPeer: "A",
    waiter: "d9 · 응답함",
  },
  {
    label: "B가 primary에서 빠짐",
    summary: "d7 2 → 1 유지 · d5 1 → 0 제거",
    note: "Peer 집합 update로 B가 latest.primary에서 빠지면 B가 가진 reference를 모두 줄입니다. d7은 A deque에 아직 있어 count 1로 남고, B만 참조하던 d5는 0이 되어 제거됩니다. 이 count는 recipient quorum이나 영구 사본 수가 아닙니다.",
    deques: { A: ["d8", "d7"], B: [], C: [] },
    eligible: { A: true, B: false, C: false },
    changedPeer: "B",
    waiter: "d9 · 응답함",
  },
];

const countOf = (scene: Scene, digest: string) =>
  PEERS.filter((peer) => scene.eligible[peer] && scene.deques[peer].includes(digest)).length;

function PeerColumn({ scene, peer, previous }: { scene: Scene; peer: PeerKey; previous: Scene | null }) {
  const eligible = scene.eligible[peer];
  const changed = scene.changedPeer === peer;
  const slots = [0, 1].map((slot) => scene.deques[peer][slot] ?? null);
  return (
    <div className={`min-w-0 rounded-lg border p-2 sm:p-3 ${changed ? "border-primary" : "border-border"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="font-mono text-[10px] font-black text-primary sm:text-xs">PEER {peer}</span>
        <span className={`text-[9px] leading-4 sm:text-[10px] ${eligible ? "text-muted-foreground" : "font-bold text-amber-700 dark:text-amber-400"}`}>
          {eligible ? "primary 안" : "primary 밖"}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1">
        {slots.map((digest, slot) => {
          const isNew = digest !== null && previous !== null && previous.deques[peer][slot] !== digest;
          return (
            <div
              key={slot}
              className={`flex min-h-9 flex-col items-center justify-center rounded border px-1 text-center ${
                digest === null ? "border-dashed border-border/60 text-muted-foreground/60" : isNew ? "border-primary bg-primary/10" : "border-border bg-background"
              }`}
            >
              <span className="font-mono text-[11px] font-bold sm:text-sm">{digest ?? "—"}</span>
              <span className="text-[8px] leading-3 text-muted-foreground sm:text-[9px]">{slot === 0 ? "최신" : "오래됨"}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 min-h-8 break-keep text-[9px] leading-4 text-muted-foreground sm:text-[10px]">
        {peer === "C" ? (scene.changedPeer === "C" ? "d9 전송 · deque 없음" : "cache 참조 없음") : eligible ? "deque_size 2 (가정)" : "reference 모두 해제"}
      </p>
    </div>
  );
}

function CacheState({ index }: { index: number }) {
  const scene = SCENES[index];
  const previous = index > 0 ? SCENES[index - 1] : null;
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {PEERS.map((peer) => (
          <PeerColumn key={peer} scene={scene} peer={peer} previous={previous} />
        ))}
      </div>
      <p className="mt-3 text-[10px] font-bold text-muted-foreground sm:text-xs">Global items · count(digest)</p>
      <div className="mt-1 grid grid-cols-5 gap-1 sm:gap-2">
        {DIGESTS.map((digest) => {
          const count = countOf(scene, digest);
          const before = previous === null ? count : countOf(previous, digest);
          const removed = before > 0 && count === 0;
          const resident = count > 0;
          return (
            <div
              key={digest}
              className={`flex min-h-16 flex-col items-center justify-center rounded border px-0.5 text-center ${
                resident ? "border-primary/60 bg-background" : removed ? "border-dashed border-red-600" : "border-dashed border-border/60"
              }`}
            >
              <span className={`font-mono text-[11px] font-bold sm:text-sm ${resident ? "" : "text-muted-foreground/70"}`}>{digest}</span>
              <span className="font-mono text-[10px] sm:text-xs">
                {before !== count ? `${before}→${count}` : `${count}`}
              </span>
              <span className={`text-[8px] leading-3 sm:text-[10px] ${resident ? "text-primary" : removed ? "font-bold text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                {resident ? "보관" : removed ? "제거" : "없음"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded border border-border px-2 py-1.5 text-[10px] sm:text-xs">
        <span className="text-muted-foreground">Bob waiter</span>
        <strong className={scene.waiter.includes("응답") ? "text-primary" : "text-muted-foreground"}>{scene.waiter}</strong>
      </div>
    </div>
  );
}

export default function CacheLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const labels = SCENES.map((scene) => scene.label);
  return (
    <VizFrame
      eyebrow="cache 잔류 · 다섯 장면"
      title="응답받은 item도 eligible peer deque가 참조할 때만 cache에 남습니다"
      description="칸 하나가 peer deque의 자리입니다(deque_size 2, 가정). 아래 줄은 digest마다 payload 하나를 두는 items map과, 그 digest를 가진 eligible peer deque 수인 count입니다."
      note="Peer 이름, digest와 deque_size는 설명용 가정입니다. count가 0이 되는 순간에만 payload를 지웁니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="primary 밖 sender, 중복 digest, deque 초과, peer 제외에 따라 cache count가 바뀌는 다섯 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-sm font-bold sm:text-base">{scene.label}</h4>
              <span className="font-mono text-xs font-bold text-primary sm:text-sm">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-3 min-w-0">
          <CacheState index={scenes.active} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:pl-4 sm:text-sm sm:leading-7">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} controlLabels={["출발", "primary 밖", "중복", "초과", "B 제외"]} playLabel="cache 잔류 장면 재생" />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
