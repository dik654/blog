import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const labels = [
  "Pool 결과",
  "Key",
  "Disk insert",
  "Read",
  "Canonical 추적",
  "Finalized",
  "Cleanup",
] as const;

const notes = [
  "입장 검사를 통과한 T₀가 실제 Pool에 추가되면 sidecar S₀는 Pool entry와 분리되어 BlobStore 경계로 넘어갑니다.",
  "BlobStore는 transaction hash H₀를 key로 사용합니다. 같은 sidecar의 versioned hash는 Engine API 조회를 위한 별도 LRU index에 연결됩니다.",
  "Disk backend는 S₀를 RLP fields로 encode하고 versioned-hash index와 sidecar cache를 갱신한 뒤 blob_dir/H₀ 파일을 씁니다. 별도 digest·generation receipt는 없습니다.",
  "get(H₀)은 cache를 먼저 보고, miss면 파일을 읽어 decode합니다. 파일 없음은 None, decode 실패는 DecodeError, get_exact의 누락은 MissingSidecar입니다.",
  "Canonical block에 들어간 Blob transaction hash는 block number와 함께 추적됩니다. Finality 전에는 reorg 시 old-chain transaction을 다시 넣을 수 있도록 sidecar를 남깁니다.",
  "Finalized 높이 이하의 hash가 나오면 Disk backend는 즉시 파일을 지우지 않고 deletion queue에 넣습니다. In-memory backend는 delete 시 바로 제거합니다.",
  "Background cleanup이 queue의 파일을 지우고 NotFound도 성공으로 셉니다. Disk store open은 이전 디렉터리 전체를 지우므로 restart 복구용 영구 archive가 아닙니다.",
] as const;

function Stage({
  number,
  title,
  detail,
  state,
}: {
  number: number;
  title: string;
  detail: string;
  state: "future" | "current" | "done";
}) {
  return (
    <div
      className={`min-w-0 border p-3 transition-colors duration-300 ${
        state === "current"
          ? "border-primary bg-primary/5"
          : state === "done"
            ? "border-primary/35 bg-background"
            : "border-border bg-background text-muted-foreground/65"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <strong className="break-keep text-xs">{title}</strong>
        <span className="font-mono text-[9px] font-black text-primary">
          {String(number + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">
        {detail}
      </p>
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
      <span className="text-[8px] font-black tracking-[0.12em] text-muted-foreground">
        {eyebrow}
      </span>
      <h4 className="mt-1 break-keep text-sm font-bold">{title}</h4>
      <dl className="mt-3 grid gap-px bg-border p-px text-[10px] leading-4">
        {rows.map(([term, description]) => (
          <div
            key={term}
            className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2 bg-background px-2 py-2"
          >
            <dt className="font-bold text-primary">{term}</dt>
            <dd className="break-keep text-muted-foreground">{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function BlobStoreTraceViz() {
  const scenes = useAnimatedScenes(labels.length, 9000, { loop: false });
  const active = scenes.active;
  const status = (step: number) =>
    active === step ? "current" : active > step ? "done" : "future";

  const mobileScenes: readonly ReactNode[] = [
    <MobileCard
      key="pool"
      eyebrow="POOL INSERTION RESULT"
      title="T₀와 sidecar S₀가 갈라집니다"
      rows={[
        ["Pool entry", "실행·ordering에 필요한 transaction"],
        ["Sidecar", "Blob·commitment·proof를 가진 S₀"],
        ["경계", "Pool lock 밖에서 BlobStore insert"],
      ]}
    />,
    <MobileCard
      key="key"
      eyebrow="BLOBSTORE KEY"
      title="Transaction hash H₀가 저장 key입니다"
      rows={[
        ["Primary key", "H₀ = T₀ transaction hash"],
        ["Value", "PooledBlobSidecar S₀"],
        ["보조 index", "versioned hash → H₀ · LRU"],
      ]}
    />,
    <MobileCard
      key="insert"
      eyebrow="DISKFILEBLOBSTORE"
      title="Cache를 갱신하고 파일을 씁니다"
      rows={[
        ["Encode", "S₀ fields를 RLP bytes로 변환"],
        ["Memory", "Version index와 sidecar LRU 갱신"],
        ["File", "blob_dir/H₀에 bytes 기록"],
      ]}
    />,
    <MobileCard
      key="read"
      eyebrow="GET H₀"
      title="Cache miss만 disk decode로 내려갑니다"
      rows={[
        ["Cache hit", "Arc<Sidecar> 즉시 반환"],
        ["File hit", "RLP decode 뒤 cache에 다시 삽입"],
        ["실패", "None · DecodeError · I/O Error"],
      ]}
    />,
    <MobileCard
      key="canonical"
      eyebrow="CANON TRACKER"
      title="Finality 전에는 재주입을 위해 남깁니다"
      rows={[
        ["Record", "block number → Blob tx hashes"],
        ["Reorg", "Old-chain transaction 재주입 가능"],
        ["조건", "아직 finalized되지 않은 block"],
      ]}
    />,
    <MobileCard
      key="finalized"
      eyebrow="FINALIZED UPDATE"
      title="더 이상 필요한 hash를 deletion queue로 보냅니다"
      rows={[
        ["Tracker", "finalized 높이 이하 hash 반환"],
        ["Disk", "txs_to_delete에 추가"],
        ["Memory", "HashMap에서 즉시 제거"],
      ]}
    />,
    <MobileCard
      key="cleanup"
      eyebrow="MAINTENANCE"
      title="파일 삭제와 restart 경계를 구분합니다"
      rows={[
        ["Cleanup", "Queue 파일 삭제 · NotFound도 성공"],
        ["Open", "기존 blob_dir 전체 삭제 후 재생성"],
        ["보장 아님", "Restart 복구 · 영구 archive"],
      ]}
    />,
  ];

  return (
    <VizFrame
      className="scroll-mt-20"
      eyebrow="개념 경로 · T₀ sidecar의 local 수명"
      title="Pool에서 분리된 sidecar를 finality까지 보관합니다"
      description="T₀의 sidecar S₀가 transaction hash H₀로 저장되고, cache·file 조회와 canonical 추적을 거쳐 정리되는 실제 Reth v2.8.1 경로입니다."
      note="T₀·S₀·H₀는 이전 글과 이어지는 설명용 식별자입니다. 이 그림은 local execution-client pool artifact를 다루며 consensus availability나 장기 archive를 뜻하지 않습니다."
      canvasClassName="flex flex-col justify-center px-2 py-0 sm:px-5 sm:py-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-blob-storage-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth BlobStore가 sidecar를 저장하고 finality 뒤 정리하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="sm:hidden">
          <div className="grid grid-cols-7 gap-1" aria-label="BlobStore의 일곱 단계">
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

        <div className="hidden gap-3 border border-border bg-background p-3 sm:grid">
          <div className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-stretch gap-3">
            <section className="grid gap-2" aria-label="Pool과 BlobStore 저장 경로">
              <p className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">
                INSERT PATH
              </p>
              <Stage number={0} title="Pool result" detail="T₀ entry · S₀ sidecar 분리" state={status(0)} />
              <Stage number={1} title="BlobStore key" detail="H₀ → PooledBlobSidecar S₀" state={status(1)} />
              <Stage number={2} title="Disk insert" detail="RLP · version index · LRU · file" state={status(2)} />
              <Stage number={3} title="Read" detail="cache → file decode → None/Error" state={status(3)} />
            </section>

            <div className="flex items-center justify-center" aria-hidden>
              <span
                className={`text-2xl transition-colors ${
                  active >= 4 ? "text-primary" : "text-muted-foreground/30"
                }`}
              >
                →
              </span>
            </div>

            <section className="grid gap-2" aria-label="Canonical 추적과 삭제 경로">
              <p className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">
                RETENTION PATH
              </p>
              <Stage number={4} title="Canonical tracker" detail="block number → Blob tx hashes" state={status(4)} />
              <Stage number={5} title="Finalized" detail="delete_all · disk는 queue" state={status(5)} />
              <Stage number={6} title="Cleanup" detail="remove_file · NotFound도 성공" state={status(6)} />
              <div className="grid grid-cols-2 gap-px bg-border p-px text-center text-[9px] leading-4">
                <div className={`bg-background px-2 py-2 ${active >= 2 ? "opacity-100" : "opacity-45"}`}>
                  <strong className="block text-primary">DISK</strong>
                  <span>LRU + 임시 파일</span>
                </div>
                <div className={`bg-background px-2 py-2 ${active >= 6 ? "opacity-100" : "opacity-45"}`}>
                  <strong className="block text-amber-700">RESTART</strong>
                  <span>이전 디렉터리 삭제</span>
                </div>
              </div>
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
          controlLabels={["Pool", "Key", "Insert", "Read", "추적", "Final", "정리"]}
          playLabel="BlobStore 수명주기 재생"
          className="mt-0 sm:!min-h-0 sm:!border-t-0 sm:!pt-2 [&>p]:hidden [&_[data-viz-desktop-controls]]:gap-1 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button]:py-1 [&_[data-viz-desktop-controls]>button:last-child]:w-20"
        />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
