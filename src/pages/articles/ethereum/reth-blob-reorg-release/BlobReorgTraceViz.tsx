import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const labels = [
  "보관",
  "Old block",
  "Reorg",
  "차집합",
  "재결합",
  "재주입",
  "Finality",
] as const;

const notes = [
  "입장 검사를 통과한 T₀와 sidecar S₀가 Pool과 BlobStore에 있습니다. BlobStore key는 transaction hash H₀입니다.",
  "Old canonical block 100이 T₀를 포함하면 Pool에서는 T₀가 빠지지만 S₀는 finality 전까지 남습니다. Tracker에는 100 → [H₀]가 기록됩니다.",
  "Reorg 알림은 old block 100과 new block 100′을 함께 줍니다. 100은 고아가 되고 100′이 새 canonical block이 됩니다.",
  "Reth는 old chain의 transaction 가운데 new chain에 없는 hash만 고릅니다. 이 fixture에서 H₀는 new mined set에 없으므로 재주입 후보가 됩니다.",
  "Blob transaction body만으로는 전파 크기를 계산할 수 없습니다. get_blob(H₀)가 S₀를 돌려주면 T₀와 S₀를 다시 결합합니다. Local miss면 이 경로의 후보에서 빠집니다.",
  "새 canonical state와 new chain의 mined transaction을 Pool에 먼저 반영합니다. 그다음 재구성한 T₀를 external transaction으로 넣고, Tracker의 높이 100 기록을 100′의 내용으로 교체합니다.",
  "T₀가 block 101에 다시 포함되고 101이 finalized되면 Tracker가 H₀를 삭제 대상으로 내보냅니다. Pool maintenance가 S₀를 지우고 Disk backend cleanup을 실행합니다.",
] as const;

function StateCell({
  eyebrow,
  title,
  detail,
  active,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  active: boolean;
}) {
  return (
    <div
      className={`min-w-0 border px-3 py-3 transition-colors duration-300 ${
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-background text-muted-foreground/65"
      }`}
    >
      <span className="font-mono text-[8px] font-black tracking-[0.12em] text-primary">
        {eyebrow}
      </span>
      <strong className="mt-1 block break-keep text-xs">{title}</strong>
      <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">
        {detail}
      </span>
    </div>
  );
}

function MobileCard({
  eyebrow,
  title,
  rows,
}: {
  eyebrow: string;
  title: string;
  rows: readonly [string, string][];
}) {
  return (
    <section className="border border-primary p-3">
      <span className="font-mono text-[8px] font-black tracking-[0.12em] text-primary">
        {eyebrow}
      </span>
      <h4 className="mt-1 break-keep text-sm font-bold">{title}</h4>
      <dl className="mt-3 grid gap-px bg-border p-px text-[10px] leading-4">
        {rows.map(([term, description]) => (
          <div
            key={term}
            className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 bg-background px-2 py-2"
          >
            <dt className="font-bold text-primary">{term}</dt>
            <dd className="break-keep text-muted-foreground">{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function BlobReorgTraceViz() {
  const scenes = useAnimatedScenes(labels.length, 9500, { loop: false });
  const active = scenes.active;

  const mobileScenes: readonly ReactNode[] = [
    <MobileCard
      key="stored"
      eyebrow="BEFORE INCLUSION"
      title="T₀와 S₀가 hash H₀로 연결됩니다"
      rows={[
        ["Pool", "T₀ · 실행과 ordering"],
        ["BlobStore", "H₀ → sidecar S₀"],
        ["상태", "검증을 마친 local 후보"],
      ]}
    />,
    <MobileCard
      key="old"
      eyebrow="OLD CANONICAL #100"
      title="Block에는 body만 들어가고 S₀는 남습니다"
      rows={[
        ["Block 100", "T₀ 포함"],
        ["Tracker", "100 → [H₀]"],
        ["BlobStore", "S₀ 유지 · 아직 미확정"],
      ]}
    />,
    <MobileCard
      key="reorg"
      eyebrow="CANON STATE NOTIFICATION"
      title="100이 빠지고 100′이 canonical이 됩니다"
      rows={[
        ["Old", "100 · T₀ 포함"],
        ["New", "100′ · T₀ 없음"],
        ["사건", "Reorg { old, new }"],
      ]}
    />,
    <MobileCard
      key="difference"
      eyebrow="OLD − NEW"
      title="H₀가 재주입 후보로 남습니다"
      rows={[
        ["Old hashes", "{H₀}"],
        ["New hashes", "{}"],
        ["차집합", "{H₀}"],
      ]}
    />,
    <MobileCard
      key="join"
      eyebrow="POOL.GET_BLOB(H₀)"
      title="Body T₀와 sidecar S₀를 다시 묶습니다"
      rows={[
        ["Hit", "try_from_eip4844(T₀, S₀)"],
        ["Miss", "이 local 후보에서 제외"],
        ["하지 않음", "hash로 Blob 복원"],
      ]}
    />,
    <MobileCard
      key="reinsert"
      eyebrow="UPDATE THEN REINSERT"
      title="새 state를 먼저 반영하고 T₀를 넣습니다"
      rows={[
        ["1", "on_canonical_state_change"],
        ["2", "add_external_transactions"],
        ["Tracker", "100 → []로 교체"],
      ]}
    />,
    <MobileCard
      key="finality"
      eyebrow="REINCLUDED #101 → FINALIZED"
      title="H₀가 확정되면 S₀를 정리합니다"
      rows={[
        ["Tracker", "101 → [H₀]"],
        ["Finalized", "H₀ 삭제 update"],
        ["Store", "delete_blobs → cleanup"],
      ]}
    />,
  ];

  return (
    <VizFrame
      className="scroll-mt-20"
      eyebrow="개념 경로 · old body와 local sidecar"
      title="Reorg가 T₀를 되돌릴 때 S₀도 다시 붙여야 합니다"
      description="Block 100에서 빠진 T₀ 하나를 따라갑니다. 차집합, sidecar 조회, Pool 재주입과 finality cleanup을 한 경로로 연결합니다."
      note="T₀·H₀·S₀와 block 100·100′·101은 경로를 고정한 설명용 fixture입니다. 특정 mainnet reorg를 측정한 값이 아닙니다."
      canvasClassName="flex flex-col justify-center px-2 py-0 sm:px-5 sm:py-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-blob-reorg-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth가 reorg 뒤 Blob transaction body와 local sidecar를 다시 결합하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="sm:hidden">
          <div className="grid grid-cols-7 gap-1" aria-label="Blob reorg의 일곱 단계">
            {labels.map((label, index) => (
              <div key={label} className="min-w-0 text-center">
                <span
                  className={`block h-1 ${
                    index === active
                      ? "bg-primary"
                      : index < active
                        ? "bg-primary/35"
                        : "bg-border"
                  }`}
                />
                <span
                  className={`mt-1 block font-mono text-[8px] font-black ${
                    index === active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex h-72 items-center">
            <div className="w-full">{mobileScenes[active]}</div>
          </div>
        </div>

        <div className="hidden border border-border bg-background p-3 sm:block">
          <div className="grid grid-cols-7 gap-1" aria-label="Reorg 진행 단계">
            {labels.map((label, index) => (
              <div
                key={label}
                className={`min-w-0 border-t-2 px-1 py-2 text-center text-[9px] font-bold transition-colors ${
                  index === active
                    ? "border-primary text-foreground"
                    : index < active
                      ? "border-primary/35 text-muted-foreground"
                      : "border-border text-muted-foreground/55"
                }`}
              >
                {String(index + 1).padStart(2, "0")} · {label}
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <section className="grid gap-2" aria-label="Canonical chain 상태">
              <p className="font-mono text-[9px] font-black tracking-[0.12em] text-muted-foreground">
                CHAIN
              </p>
              <StateCell
                eyebrow="OLD #100"
                title={active < 2 ? "Canonical · T₀ 포함" : "Orphaned · T₀ 회수 대상"}
                detail="Block body에는 transaction이 있지만 sidecar bytes는 없습니다."
                active={active === 1 || active === 2 || active === 3}
              />
              <StateCell
                eyebrow="NEW #100′"
                title={active < 2 ? "아직 선택되지 않음" : "Canonical · T₀ 없음"}
                detail="New mined hash 집합에 H₀가 없으므로 old−new 차집합에 남습니다."
                active={active === 2 || active === 3 || active === 5}
              />
              <StateCell
                eyebrow="LATER #101"
                title={active < 6 ? "다음 포함을 기다림" : "T₀ 재포함 · finalized"}
                detail="Tracker가 101→H₀를 내보낸 뒤 finality cleanup이 시작됩니다."
                active={active === 6}
              />
            </section>

            <section className="grid gap-2" aria-label="Pool과 BlobStore 상태">
              <p className="font-mono text-[9px] font-black tracking-[0.12em] text-muted-foreground">
                LOCAL POOL STATE
              </p>
              <StateCell
                eyebrow="TRANSACTION POOL"
                title={
                  active === 0
                    ? "T₀ 대기"
                    : active < 5
                      ? "T₀는 old block에서 mined"
                      : active < 6
                        ? "T₀ + S₀ 재주입"
                        : "T₀는 block 101에서 mined"
                }
                detail="Reorg에서는 새 canonical state를 먼저 적용한 뒤 후보를 다시 넣습니다."
                active={active === 0 || active === 5}
              />
              <StateCell
                eyebrow="BLOBSTORE H₀"
                title={active < 6 ? "S₀ 보관" : "S₀ 삭제 대상"}
                detail={
                  active === 4
                    ? "Hit면 body와 재결합 · miss면 local reinsert 없음"
                    : "Finality 전 local reorg 재주입을 위해 sidecar를 유지합니다."
                }
                active={active === 0 || active === 1 || active === 4 || active === 6}
              />
              <StateCell
                eyebrow="CANON TRACKER"
                title={
                  active < 1
                    ? "기록 없음"
                    : active < 5
                      ? "100 → [H₀]"
                      : active < 6
                        ? "100 → []로 교체"
                        : "101 → [H₀] → Finalized"
                }
                detail="같은 block height의 reorg 기록은 새 chain의 Blob hash 목록으로 교체됩니다."
                active={active === 1 || active === 5 || active === 6}
              />
            </section>
          </div>
        </div>

        <p
          data-scene-note
          className="mt-2 h-28 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:h-auto sm:min-h-14 sm:pl-4 sm:text-sm sm:leading-6"
        >
          <strong className="mb-1 block font-mono text-[9px] text-primary">
            {String(active + 1).padStart(2, "0")}/{String(labels.length).padStart(2, "0")} · {labels[active]}
          </strong>
          {notes[active]}
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={labels}
          controlLabels={["보관", "Old", "Reorg", "차집합", "결합", "재주입", "Final"]}
          playLabel="Blob reorg 경로 재생"
          className="mt-0 sm:!min-h-0 sm:!border-t-0 sm:!pt-2 [&>p]:hidden [&_[data-viz-desktop-controls]]:gap-1 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button]:py-1 [&_[data-viz-desktop-controls]>button:last-child]:w-20"
        />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
