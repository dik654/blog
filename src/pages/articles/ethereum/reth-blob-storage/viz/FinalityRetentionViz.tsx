import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retention — canonical block마다 Blob tx hash를 tracker에 적고,
 * finality 전 reorg에 대비해 sidecar를 남기며, finalized 높이 이하 hash만 삭제 queue → cleanup으로 보낸다.
 * 블록 N−1·N·N+1과 H₁·H₂는 H₀ 주변을 보이기 위한 설명용 가정이다.
 */
const BLOCKS = [
  { block: "N−1", hash: "H₁" },
  { block: "N", hash: "H₀" },
  { block: "N+1", hash: "H₂" },
] as const;

type Phase = "record" | "reorg" | "finalized" | "queued" | "cleaned";

const SCENES: readonly { label: string; summary: string; note: string; phase: Phase }[] = [
  {
    label: "Canonical block마다 기록",
    summary: "block number → Blob tx hash",
    phase: "record",
    note: "Pool maintenance loop는 canonical block이 들어올 때마다 그 block에 포함된 Blob transaction hash를 BlobStoreCanonTracker에 적습니다. 아직 finalized된 block이 없으므로 세 sidecar 파일이 모두 남아 있습니다.",
  },
  {
    label: "Finality 전 reorg라면",
    summary: "빠진 T₀를 S₀와 다시 Pool로",
    phase: "reorg",
    note: "Finality 전에 block N이 old canonical chain에서 빠지는 reorg가 일어나면 그 안의 T₀를 다시 Pool에 넣어야 합니다. 이때 H₀로 S₀를 다시 찾을 수 있어야 하므로 finality 전에는 sidecar를 지우지 않습니다.",
  },
  {
    label: "Reorg 없이 N까지 finalized",
    summary: "높이 ≤ N의 hash만 Finalized",
    phase: "finalized",
    note: "새 finalized height가 N이 되면 tracker는 N 이하 block의 hash H₁·H₀만 Finalized update로 내보냅니다. N+1은 아직 finalized되지 않았으므로 H₂는 tracker에 그대로 남습니다.",
  },
  {
    label: "Disk는 queue에 넣기만",
    summary: "delete_all → txs_to_delete",
    phase: "queued",
    note: "Disk backend의 delete_all은 파일을 바로 지우지 않고 H₁·H₀를 txs_to_delete에 넣습니다. 이 순간에도 blob_dir의 파일은 아직 있습니다. In-memory backend라면 delete 시 바로 제거합니다.",
  },
  {
    label: "Background cleanup",
    summary: "queue의 파일 제거 · H₂ 파일은 유지",
    phase: "cleaned",
    note: "Background blocking task가 cleanup을 호출해 queue에 있던 H₁·H₀ 파일을 제거합니다. 이미 없는 파일(NotFound)도 성공으로 셉니다. Finality 전인 H₂의 sidecar는 그대로 남습니다.",
  },
];

const ORDER: readonly Phase[] = ["record", "reorg", "finalized", "queued", "cleaned"];

function Slot({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-2">
      <p className="text-[10px] font-black tracking-[0.08em] text-muted-foreground">{title}</p>
      <div className="mt-2 flex min-h-[1.75rem] flex-wrap gap-1">{children}</div>
    </div>
  );
}

function Chip({ text, tone }: { text: string; tone: "on" | "off" | "warn" | "gone" }) {
  const cls =
    tone === "on"
      ? "border-primary text-foreground"
      : tone === "warn"
        ? "border-amber-600 text-amber-700 dark:text-amber-400"
        : tone === "gone"
          ? "border-dashed border-border text-muted-foreground/60 line-through"
          : "border-border text-muted-foreground";
  return <span className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${cls}`}>{text}</span>;
}

export default function FinalityRetentionViz() {
  return (
    <SceneShell
      eyebrow="Finality까지 보관"
      title="Finalized 높이 이하의 sidecar만 지워집니다"
      description="맨 위 줄의 칸 하나가 canonical block 하나이고, 아래 줄은 tracker·삭제 queue·파일의 상태입니다. Finalized는 더 이상 reorg로 되돌려지지 않는 높이이며, finalized 높이 이하 block의 hash만 삭제 queue로 갑니다. 블록 N−1·N+1과 H₁·H₂는 설명용 가정입니다."
      note="Disk backend 기준입니다. 이 보관은 local Pool의 reorg 재주입을 위한 것이며 consensus data availability나 장기 archive 보존 기간을 뜻하지 않습니다."
      ariaLabel="Canonical tracker, reorg 재주입, finalized 높이 이하 삭제 queue와 cleanup"
      scenes={SCENES}
      render={(active) => {
        const phase = SCENES[active].phase;
        const step = ORDER.indexOf(phase);
        const finalizedUpTo = step >= 2 ? 1 : -1;
        const reorg = phase === "reorg";
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {BLOCKS.map((item, index) => {
                const isFinal = index <= finalizedUpTo;
                const dropped = reorg && index === 1;
                return (
                  <div
                    key={item.block}
                    className={`min-w-0 rounded-lg border px-2 py-2 text-center ${
                      dropped
                        ? "border-dashed border-amber-600"
                        : isFinal
                          ? "border-emerald-600 bg-emerald-600/5"
                          : "border-border"
                    }`}
                  >
                    <span className="block font-mono text-xs font-bold">Block {item.block}</span>
                    <span className="block font-mono text-[11px] text-muted-foreground">{item.hash}</span>
                    <span
                      className={`mt-1 block text-[10px] font-bold ${
                        dropped ? "text-amber-700 dark:text-amber-400" : isFinal ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                      }`}
                    >
                      {dropped ? "old chain에서 빠짐" : isFinal ? "finalized" : "unfinalized"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="min-h-[2.5rem] rounded-lg border border-dashed border-border px-2 py-2 text-xs leading-5">
              {reorg ? (
                <span>
                  <strong className="text-amber-700 dark:text-amber-400">Reorg 재주입 · </strong>
                  T₀ → Pool, BlobStore에서 H₀로 S₀를 찾아 다시 결합
                </span>
              ) : step >= 2 ? (
                <span>
                  <strong className="text-emerald-700 dark:text-emerald-400">Finalized height = N · </strong>
                  Finalized update: H₁, H₀
                </span>
              ) : (
                <span className="text-muted-foreground">Finalized height: 아직 N−1에 못 미침 (가정)</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Slot title="CANON TRACKER">
                {BLOCKS.map((item, index) =>
                  index <= finalizedUpTo ? null : (
                    <Chip key={item.hash} text={`${item.block}·${item.hash}`} tone="off" />
                  ),
                )}
              </Slot>
              <Slot title="txs_to_delete">
                {step === 3 ? (
                  <>
                    <Chip text="H₁" tone="warn" />
                    <Chip text="H₀" tone="warn" />
                  </>
                ) : (
                  <span className="text-[11px] text-muted-foreground">비어 있음</span>
                )}
              </Slot>
              <Slot title="blob_dir 파일">
                {BLOCKS.map((item, index) => (
                  <Chip key={item.hash} text={item.hash} tone={step === 4 && index <= 1 ? "gone" : "on"} />
                ))}
              </Slot>
            </div>
          </div>
        );
      }}
    />
  );
}
