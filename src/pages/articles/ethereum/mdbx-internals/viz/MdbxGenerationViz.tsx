import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "파일을 page로 봄",
  "Reader가 100 고정",
  "Writer가 새 path 생성",
  "Meta 101 공개",
  "두 snapshot 공존",
  "Reader 종료 뒤 회수",
] as const;

const NOTES = [
  "mmap은 database file의 offset을 process virtual address에 연결합니다. Page 42를 읽을 때 RAM에 없다면 OS page fault가 storage I/O를 만들 수 있으므로 map 크기와 RSS·I/O를 같은 값으로 보지 않습니다.",
  "Reader R1은 시작할 때 일관된 meta를 골라 txid 100과 root 1을 고정하고 reader table에 자신의 snapshot을 등록합니다. 이후 조회는 그 generation의 page graph를 걷습니다.",
  "Writer 101은 R1이 보는 leaf 42를 제자리에서 덮지 않습니다. 변경된 leaf 52와 그 위 branch 18, root 2를 새 generation으로 만들고 아직 공개하지 않습니다.",
  "새 page들이 commit 조건을 만족한 뒤 meta에 txid 101과 root 2를 공개합니다. Meta 공개와 stable media 도달은 sync mode·filesystem·장치 경계를 따로 확인해야 합니다.",
  "Meta 101이 공개된 뒤 시작한 R2는 root 2를 읽지만, 먼저 시작한 R1은 root 1을 계속 읽습니다. 같은 file 안에서 두 transaction generation이 논리적으로 공존합니다.",
  "R1이 끝나기 전에는 R1이 볼 수 있는 retired pages를 재사용하면 안 됩니다. 가장 오래된 reader가 사라진 뒤에야 그 아래 generation의 page를 새 writer에게 돌려줄 수 있습니다.",
] as const;

const Page = ({
  id,
  label,
  state = "plain",
}: {
  id: string;
  label: string;
  state?: "plain" | "old" | "new" | "retired";
}) => {
  const tone = state === "new"
    ? "border-primary text-primary"
    : state === "retired"
      ? "border-dashed border-amber-500/70 text-amber-700 dark:text-amber-300"
      : state === "old"
        ? "border-foreground/45"
        : "border-border text-muted-foreground";

  return (
    <div className={`min-w-0 border bg-background px-2 py-2 text-center ${tone}`}>
      <span className="block font-mono text-[9px] font-black">p{id}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-4">{label}</strong>
    </div>
  );
};

const Path = ({ generation, current }: { generation: 100 | 101; current?: boolean }) => {
  const old = generation === 100;
  return (
    <div className={`border bg-background p-3 ${current ? "border-primary" : "border-border"}`}>
      <div className="flex items-center justify-between gap-2">
        <strong className="text-xs">txid {generation}</strong>
        <span className="text-[9px] font-bold text-muted-foreground">{old ? "기존 graph" : "새 graph"}</span>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1">
        <Page id={old ? "1" : "2"} label="root" state={old ? "old" : "new"} />
        <span aria-hidden className="text-center text-xs text-muted-foreground">→</span>
        <Page id={old ? "8" : "18"} label="branch" state={old ? "old" : "new"} />
        <span aria-hidden className="text-center text-xs text-muted-foreground">→</span>
        <Page id={old ? "42" : "52"} label={old ? "A=old" : "A=new"} state={old ? "old" : "new"} />
      </div>
    </div>
  );
};

export default function MdbxGenerationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6800, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · 한 key의 두 transaction generation"
      title="Reader가 old page를 읽는 동안 writer는 새 root를 공개합니다"
      description="Key A를 바꾸는 한 transaction을 따라가며 mmap, CoW, meta publish와 page 회수 경계를 나눕니다."
      note="Page 번호와 txid는 동작을 설명하기 위한 식별자입니다. 실제 page format과 commit 세부는 고정한 libmdbx release와 sync mode에 귀속합니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-mdbx-generation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="MDBX가 mapped page를 읽고 Copy-on-Write path와 새 meta를 공개한 뒤 old page를 회수하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6" aria-label="MDBX generation 전환의 여섯 단계">
          {SCENES.map((label, index) => (
            <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
              <span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong>
            </div>
          ))}
        </div>

        <section className="mt-3 min-h-[19rem] border border-border bg-background p-3 sm:min-h-[17rem] sm:p-5" aria-label="현재 transaction과 page 상태">
          {active === 0 ? (
            <div className="grid min-h-[14rem] content-center gap-4 sm:grid-cols-[minmax(0,0.85fr)_auto_minmax(0,1.15fr)] sm:items-center">
              <div className="border-y border-border py-4">
                <p className="text-[9px] font-bold text-muted-foreground">DATABASE FILE · offsets</p>
                <div className="mt-3 grid grid-cols-4 gap-px bg-border p-px">
                  {["meta", "p1", "p8", "p42"].map((page) => <span key={page} className="bg-background px-1 py-3 text-center font-mono text-[10px] font-bold">{page}</span>)}
                </div>
              </div>
              <span className="hidden text-lg font-black text-primary sm:block">⇄</span>
              <div className="border-y border-border py-4">
                <p className="text-[9px] font-bold text-muted-foreground">PROCESS · virtual mapping</p>
                <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px text-center text-xs">
                  <div className="bg-background p-3"><strong className="block">주소 범위</strong><span className="mt-1 block text-[10px] text-muted-foreground">file offset과 연결</span></div>
                  <div className="bg-background p-3"><strong className="block">Resident subset</strong><span className="mt-1 block text-[10px] text-muted-foreground">접근한 page 중심</span></div>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">Cold p42 접근 → major page fault 가능 → storage I/O</p>
              </div>
            </div>
          ) : null}

          {active === 1 ? (
            <div className="grid min-h-[14rem] content-center gap-3 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] sm:items-center">
              <div className="border border-primary p-4 text-center">
                <span className="text-[9px] font-bold text-muted-foreground">READER R1</span>
                <strong className="mt-2 block text-xl">txid 100</strong>
                <p className="mt-2 text-xs text-muted-foreground">reader table에 snapshot 등록</p>
              </div>
              <div className="space-y-3">
                <div className="border-y border-border py-3 text-center"><span className="text-[9px] text-muted-foreground">선택한 META</span><strong className="ml-2 font-mono text-sm">tx100 · root p1</strong></div>
                <Path generation={100} current />
              </div>
            </div>
          ) : null}

          {active === 2 ? (
            <div className="grid min-h-[14rem] content-center gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[9px] font-bold text-muted-foreground">R1이 계속 읽는 path</p>
                <Path generation={100} />
              </div>
              <div>
                <p className="mb-2 text-[9px] font-bold text-primary">WRITER 101 · 아직 비공개</p>
                <Path generation={101} current />
              </div>
              <p className="sm:col-span-2 border-y border-border py-3 text-center text-xs font-bold">leaf p52 → branch p18 → root p2를 새로 만듭니다. p42는 덮지 않습니다.</p>
            </div>
          ) : null}

          {active === 3 ? (
            <div className="grid min-h-[14rem] content-center gap-4">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-5">
                <div className="border border-border p-3 text-center"><span className="text-[9px] text-muted-foreground">META · before</span><strong className="mt-2 block font-mono text-sm">tx100 · root p1</strong></div>
                <span className="font-black text-primary">→</span>
                <div className="border border-primary p-3 text-center"><span className="text-[9px] text-muted-foreground">META · publish</span><strong className="mt-2 block font-mono text-sm text-primary">tx101 · root p2</strong></div>
              </div>
              <Path generation={101} current />
              <div className="grid grid-cols-3 gap-px bg-border p-px text-center text-[10px] leading-4">
                <div className="bg-background p-2">새 data pages</div><div className="bg-background p-2">meta visibility</div><div className="bg-background p-2">stable media</div>
              </div>
            </div>
          ) : null}

          {active === 4 ? (
            <div className="grid min-h-[14rem] content-center gap-3 sm:grid-cols-2">
              <div className="border border-border p-3">
                <p className="text-[10px] font-bold">R1 · 먼저 시작</p>
                <p className="mt-1 text-[9px] text-muted-foreground">tx100 · root p1 유지</p>
                <div className="mt-3"><Path generation={100} current /></div>
              </div>
              <div className="border border-primary p-3">
                <p className="text-[10px] font-bold">R2 · meta 101 뒤 시작</p>
                <p className="mt-1 text-[9px] text-muted-foreground">tx101 · root p2 선택</p>
                <div className="mt-3"><Path generation={101} current /></div>
              </div>
            </div>
          ) : null}

          {active === 5 ? (
            <div className="grid min-h-[14rem] content-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
              <div className="border border-amber-500/70 p-3">
                <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300">R1이 열려 있는 동안</p>
                <div className="mt-3 grid grid-cols-3 gap-2"><Page id="1" label="root" state="retired" /><Page id="8" label="branch" state="retired" /><Page id="42" label="A=old" state="retired" /></div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">Retired이지만 R1이 볼 수 있으므로 재사용하지 않습니다.</p>
              </div>
              <span className="hidden font-black text-primary sm:block">R1 종료 →</span>
              <div className="border border-primary p-3">
                <p className="text-[10px] font-bold text-primary">Oldest reader가 101 이상</p>
                <div className="mt-3 grid grid-cols-3 gap-2"><Page id="1" label="재사용 후보" state="new" /><Page id="8" label="재사용 후보" state="new" /><Page id="42" label="재사용 후보" state="new" /></div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">회수 가능한 page를 다음 write generation에 돌려줄 수 있습니다.</p>
              </div>
            </div>
          ) : null}
        </section>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["mmap", "R1", "CoW", "meta", "공존", "회수"]}
          playLabel="MDBX generation 전환 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
