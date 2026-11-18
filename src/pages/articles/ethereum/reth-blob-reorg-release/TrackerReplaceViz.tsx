import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #update-order 마지막 문단 — Tracker가 높이 100의 [H₀]를 100′의 빈 목록으로
 * 교체하지 않으면 100′ finality 때 Pool에서 다시 대기 중인 T₀의 S₀를 잘못 지울 수 있다.
 * 왼쪽 = Reth v2.8.1(교체함), 오른쪽 = 교체하지 않았다고 가정한 비교용 경로.
 * 마지막 장면은 #finality의 block 101 재포함 fixture를 이어 그린다.
 */

type Tone = "ok" | "warn" | "plain" | "muted";

interface Lane {
  tracker: string;
  store: string;
  storeTone: Tone;
  event: string;
}

interface Scene {
  label: string;
  summary: string;
  pool: string;
  reth: Lane;
  naive: Lane;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "Block 100 포함",
    summary: "두 경로가 같음",
    pool: "T₀는 block 100에서 mined",
    reth: { tracker: "100 → [H₀]", store: "S₀ 보관", storeTone: "plain", event: "finality 전이라 삭제 없음" },
    naive: { tracker: "100 → [H₀]", store: "S₀ 보관", storeTone: "plain", event: "finality 전이라 삭제 없음" },
    note: "Old canonical block 100이 T₀를 포함했습니다. Tracker는 높이 100에 H₀를 적고, BlobStore는 finality 전까지 S₀를 남깁니다. 여기까지는 두 경로가 같습니다.",
  },
  {
    label: "Reorg와 재주입",
    summary: "높이 100의 기록이 갈림",
    pool: "T₀ + S₀ 재주입 · Pool에서 대기",
    reth: { tracker: "100 → [] (100′ 내용)", store: "S₀ 보관", storeTone: "plain", event: "같은 높이를 new chain 기록으로 덮어씀" },
    naive: { tracker: "100 → [H₀] (old 기록 그대로)", store: "S₀ 보관", storeTone: "plain", event: "old block 100의 기록이 남음" },
    note: "Block 100′이 canonical이 되고 T₀는 다시 Pool 후보로 들어갑니다. Reth는 높이 100의 기록을 100′의 Blob hash 목록, 곧 빈 목록으로 교체합니다. 오른쪽은 이 교체가 없었다고 가정한 경로입니다.",
  },
  {
    label: "Block 100′ finalized",
    summary: "오른쪽만 H₀를 내보냄",
    pool: "T₀는 아직 Pool에서 대기",
    reth: { tracker: "높이 100 기록 꺼냄 · 내보낼 hash 없음", store: "S₀ 유지", storeTone: "ok", event: "on_finalized_block(100) → H₀ 없음" },
    naive: { tracker: "높이 100 기록 꺼냄 · H₀ 배출", store: "S₀ 삭제될 수 있음", storeTone: "warn", event: "on_finalized_block(100) → Finalized [H₀]" },
    note: "Finalized height가 100에 닿으면 Tracker는 높이 100의 기록을 꺼내 그 안의 hash를 삭제 대상으로 내보냅니다. 교체한 왼쪽은 꺼낼 hash가 없습니다. 교체하지 않은 오른쪽은 H₀를 내보내므로 Pool에서 대기 중인 T₀의 S₀를 지울 수 있습니다.",
  },
  {
    label: "Block 101 재포함 뒤",
    summary: "왼쪽은 이때 S₀ 정리",
    pool: "T₀는 block 101에서 mined",
    reth: { tracker: "101 → [H₀] → finalized에서 배출", store: "delete_blobs → cleanup_blobs", storeTone: "plain", event: "on_finalized_block(101) → Finalized [H₀]" },
    naive: { tracker: "101 → [H₀]", store: "S₀는 100′ finality 때 이미 지워졌을 수 있음", storeTone: "muted", event: "이후 동작은 이 글의 범위 밖" },
    note: "T₀가 block 101에 다시 포함되고 101이 finalized되면, 왼쪽은 그때 H₀를 내보내 delete_blobs와 background cleanup_blobs로 S₀를 정리합니다. 재포함되지 않고 Pool에 오래 남으면 finality tracker가 아니라 stale transaction eviction이 sidecar 삭제를 맡습니다.",
  },
];

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

const TONE_CLASS: Record<Tone, string> = {
  ok: "border-emerald-600 text-emerald-800 dark:text-emerald-300",
  warn: "border-dashed border-rose-600 text-rose-700 dark:text-rose-400",
  plain: "border-border text-foreground",
  muted: "border-dashed border-border text-muted-foreground",
};

function LaneColumn({ heading, sub, lane }: { heading: string; sub: string; lane: Lane }) {
  return (
    <section className="min-w-0 rounded-lg border border-border p-2 sm:p-3" aria-label={heading}>
      <strong className="block break-keep text-xs">{heading}</strong>
      <span className="block break-keep text-[10px] leading-4 text-muted-foreground">{sub}</span>
      <dl className="mt-3 grid gap-2 text-xs">
        <div>
          <dt className="font-mono text-[9px] font-black tracking-[0.1em] text-primary">TRACKER</dt>
          <dd className="mt-1 break-keep font-mono text-[11px] leading-5">{lane.tracker}</dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] font-black tracking-[0.1em] text-primary">BLOBSTORE H₀</dt>
          <dd className={`mt-1 break-keep rounded-md border px-2 py-1 text-[11px] leading-5 ${TONE_CLASS[lane.storeTone]}`}>{lane.store}</dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] font-black tracking-[0.1em] text-primary">EVENT</dt>
          <dd className="mt-1 break-keep text-[11px] leading-5 text-muted-foreground">{lane.event}</dd>
        </div>
      </dl>
    </section>
  );
}

export default function TrackerReplaceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6000);

  return (
    <VizFrame
      eyebrow="Tracker 교체 · 비교"
      title="높이 100의 기록을 바꾸지 않으면 S₀가 먼저 지워질 수 있습니다"
      description="Tracker는 block 높이마다 그 block에 든 Blob transaction hash 목록을 적고, 그 높이가 finalized되면 목록의 hash를 삭제 대상으로 내보냅니다. 왼쪽은 Reth v2.8.1, 오른쪽은 교체하지 않았다고 가정한 비교용 경로입니다."
      note="T₀·H₀·S₀와 block 100·100′·101은 본문의 설명용 fixture입니다. 오른쪽 경로는 Reth의 동작이 아니라 교체가 왜 필요한지 보이기 위한 가정입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Tracker가 reorg 때 같은 높이 기록을 교체하는 경우와 교체하지 않은 가정의 비교"
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

        <div className="mt-4 min-w-0">
          <StableSceneStack
            active={scenes.active}
            scenes={SCENES.map((item) => (
              <div key={item.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs">
                <span className="font-bold text-primary">Pool의 T₀</span>
                <span className="break-keep">{item.pool}</span>
              </div>
            ))}
          />
          <StableSceneStack
            active={scenes.active}
            className="mt-3"
            scenes={SCENES.map((item) => (
              <div key={item.label} className="grid grid-cols-2 gap-2 sm:gap-3">
                <LaneColumn heading="Reth v2.8.1 · 교체함" sub="reorg new chain 기록으로 같은 높이를 덮어씀" lane={item.reth} />
                <LaneColumn heading="교체하지 않음 (가정)" sub="old block 100의 기록이 남았다고 가정" lane={item.naive} />
              </div>
            ))}
          />
        </div>

        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
