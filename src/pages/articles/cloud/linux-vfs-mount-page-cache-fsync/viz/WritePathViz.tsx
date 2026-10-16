import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * (가정) 앱이 100 MiB를 write()한 뒤 그 데이터가 어디에 있는지를 네 칸(앱 · page cache의 dirty · 장치로 가는 중 · 디스크)으로 따라간다.
 * 한 mechanism: write()는 page cache에 적고 바로 돌아오며, 디스크에 닿는 때는 flusher의 30초 만료(5초 주기 검사)나 fsync()뿐이다.
 * fsync는 데이터 writeback 대기 → jbd2 commit → 장치 flush(ext4 data=ordered, fs/ext4/fsync.c) 세 단계를 모두 기다린다.
 */
interface Scene {
  label: string;
  t: string;
  dirty: number;
  inflight: number;
  onDisk: number;
  app: string;
  appBlocked: boolean;
  journal: string;
  note: string;
}

const TOTAL = 100;

const SCENES: readonly Scene[] = [
  { label: "write() 100 MiB", t: "0.0 s", dirty: 100, inflight: 0, onDisk: 0, app: "돌아옴 (수 ms)", appBlocked: false, journal: "트랜잭션 열림", note: "write()는 100 MiB를 page cache에 복사하고 그 page들을 dirty로 표시한 뒤 돌아옵니다. 디스크에는 아직 한 바이트도 없습니다. dirty 합계 100 MiB는 bg_thresh 1,227 MiB에 훨씬 못 미칩니다." },
  { label: "5 s · flusher 첫 점검", t: "5.0 s", dirty: 100, inflight: 0, onDisk: 0, app: "다음 일 처리 중", appBlocked: false, journal: "commit (메타데이터만)", note: "flusher가 5초마다 깨어나 두 가지를 봅니다. dirty가 bg_thresh를 넘었나(아니오), 30초보다 오래된 dirty가 있나(아니오). 아무것도 쓰지 않습니다. 저널은 commit=5로 메타데이터 트랜잭션을 닫지만 데이터 블록은 아직 할당조차 안 됐습니다." },
  { label: "20 s · 여기서 정전이면", t: "20.0 s", dirty: 100, inflight: 0, onDisk: 0, app: "—", appBlocked: false, journal: "데이터 없음", note: "이 시점에 전원이 나가면 100 MiB는 전부 사라집니다. delayed allocation 때문에 블록도 할당되지 않았고 writeback은 30초 만료 뒤에야 시작되기 때문입니다. ext4 문서가 적은 '더 오래된 데이터도 잃을 수 있다'가 이 장면입니다." },
  { label: "30~35 s · 만료 → writeback", t: "≈ 32 s", dirty: 20, inflight: 30, onDisk: 50, app: "영향 없음", appBlocked: false, journal: "블록 할당 → commit", note: "dirty가 된 지 30초가 지난 page를 flusher가 다음 5초 점검에서 발견해 쓰기 시작합니다. 블록이 할당되고 데이터가 먼저 장치로 간 뒤 메타데이터 트랜잭션이 commit됩니다(data=ordered). 앱은 이 과정을 느끼지 못합니다." },
  { label: "대신 fsync()를 불렀다면", t: "0.0 → 0.2 s", dirty: 0, inflight: 0, onDisk: 100, app: "막힘 ≈ 0.2 s", appBlocked: true, journal: "commit 대기 → flush", note: "fsync()는 ① 100 MiB의 writeback을 시작하고 완료를 기다리고(500 MB/s 장치면 약 0.2초) ② 이 inode의 저널 트랜잭션 commit을 기다리고 ③ 장치의 쓰기 캐시를 flush한 뒤 돌아옵니다. 돌아온 뒤에는 정전이 나도 100 MiB가 남습니다." },
];

const Box = ({ label, value, color, sub }: { label: string; value: number; color: string; sub: string }) => (
  <div className="flex flex-col rounded-sm border border-border p-2">
    <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
    <div className="mt-1 h-3 w-full overflow-hidden rounded-sm bg-border/40">
      <div className="h-full transition-[width] duration-500" style={{ width: `${(value / TOTAL) * 100}%`, backgroundColor: color }} />
    </div>
    <span className="mt-1 font-mono text-sm font-black tabular-nums" style={{ color }}>
      {value} MiB
    </span>
    <span className="text-[10px] text-muted-foreground">{sub}</span>
  </div>
);

export default function WritePathViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const s = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Write path · 100 MiB · ext4 data=ordered"
      title="write()는 page cache에 적고 돌아오며, 디스크에 닿는 때는 만료 아니면 fsync뿐입니다"
      description="세 칸이 100 MiB가 지금 어디에 있는지를 나눠 보여 줍니다. 왼쪽부터 page cache의 dirty page, 장치로 가는 중, 디스크에 닿은 양입니다."
      note="(가정) dirtyable 메모리 12,288 MiB, dirty_background_ratio 10, dirty_expire_centisecs 3000, dirty_writeback_centisecs 500, ext4 기본 옵션(data=ordered, commit=5, delalloc), 장치 500 MB/s."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="100 MiB 쓰기가 page cache에서 디스크로 가는 경로"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{s.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">t = {s.t}</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Box label="page cache · dirty" value={s.dirty} color="#d97706" sub="정전 시 소실" />
            <Box label="장치로 가는 중" value={s.inflight} color="#7c3aed" sub="블록 층 큐" />
            <Box label="디스크에 닿음" value={s.onDisk} color="#16a34a" sub="flush 뒤 안전" />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">앱(write/fsync 호출자)</dt>
              <dd className="font-bold" style={{ color: s.appBlocked ? "#dc2626" : "#16a34a" }}>
                {s.app}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">jbd2 저널</dt>
              <dd className="font-bold text-foreground">{s.journal}</dd>
            </div>
          </dl>
          <p className="mt-4 min-h-[13rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[11rem] sm:min-h-[6rem]">{s.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((x) => x.label)} />
      </div>
    </VizFrame>
  );
}
