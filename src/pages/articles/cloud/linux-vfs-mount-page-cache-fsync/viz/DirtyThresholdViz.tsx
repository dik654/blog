import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * (가정) dirtyable 메모리 12,288 MiB인 서버에서 앱이 2 GiB를 계속 쓸 때 dirty 합계가 세 선을 차례로 넘는 장면.
 * 한 mechanism: bg_thresh(10%)에서 flusher가 쓰기 시작하고, freerun 상한((bg+thresh)/2)부터 쓰는 쪽이 속도 제한을 받고,
 * thresh(20%)에서 쓰는 쪽이 balance_dirty_pages 안에서 멈춘다(mm/page-writeback.c domain_dirty_limits).
 */
const AVAIL = 12288;
const BG = 1227;
const FREERUN = 1842;
const THRESH = 2457;
const AXIS_MAX = 3072;

interface Scene {
  label: string;
  dirty: number;
  flusher: string;
  writer: string;
  writerColor: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "100 MiB 썼을 때", dirty: 100, flusher: "잠듦 (5초마다 점검만)", writer: "전속력", writerColor: "#16a34a", note: "dirty 100 MiB는 bg_thresh 1,227 MiB 아래입니다. flusher는 5초마다 깨어나 30초 넘은 page가 있는지만 보고 다시 잡니다. 쓰는 쪽은 메모리 복사 속도로 돌아옵니다." },
  { label: "1,227 MiB · bg_thresh", dirty: 1227, flusher: "배경 writeback 시작", writer: "전속력", writerColor: "#16a34a", note: "dirty가 가용 메모리의 10%에 닿자 wb_over_bg_thresh가 참이 되어 flusher가 for_background로 쓰기 시작합니다. 앱은 아직 아무 제한도 받지 않습니다. 장치가 앱보다 느리면 dirty는 계속 늡니다." },
  { label: "1,842 MiB · freerun 상한", dirty: 1842, flusher: "쓰는 중", writer: "속도 제한 시작", writerColor: "#d97706", note: "bg_thresh와 thresh의 중간((1,227 + 2,457) ÷ 2)이 freerun 상한입니다. 여기부터 balance_dirty_pages가 쓰는 쪽에 짧은 멈춤을 끼워 넣어 장치 속도에 맞춥니다. 앱의 write()가 가끔 수 ms씩 길어집니다." },
  { label: "2,457 MiB · thresh", dirty: 2457, flusher: "쓰는 중", writer: "멈춤 (직접 writeback 대기)", writerColor: "#dc2626", note: "가용 메모리의 20%입니다. 쓰는 프로세스가 balance_dirty_pages 안에서 dirty가 줄 때까지 기다립니다. ps에서 D 상태로 보이고 PSI io의 some이 오릅니다. '디스크 때문에 앱이 멈춘다'는 말의 정확한 지점입니다." },
  { label: "writeback이 따라잡음", dirty: 900, flusher: "bg_thresh 아래로 → 잠듦", writer: "전속력", writerColor: "#16a34a", note: "장치가 dirty를 bg_thresh 아래로 내리면 flusher는 다시 잠들고 앱은 전속력으로 돌아옵니다. 이 톱니가 반복되는 동안 앱의 쓰기 속도는 결국 장치 속도로 수렴합니다." },
];

const pct = (v: number) => `${(v / AXIS_MAX) * 100}%`;

export default function DirtyThresholdViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const s = SCENES[scenes.active];
  const fill = s.dirty >= THRESH ? "#dc2626" : s.dirty >= FREERUN ? "#d97706" : s.dirty >= BG ? "#2563eb" : "#16a34a";

  return (
    <VizFrame
      eyebrow="Dirty thresholds · dirtyable 12,288 MiB"
      title="10%에서 flusher가 쓰기 시작하고, 20%에서 쓰는 쪽이 멈춥니다"
      description="막대는 dirty page 합계(0~3,072 MiB)입니다. 세 세로선이 bg_thresh(10%), freerun 상한, thresh(20%)이고 막대 색이 쓰는 쪽의 상태입니다."
      note="(가정) 빈 page − 예약 + file LRU = 12,288 MiB로 두고 dirty_background_ratio 10, dirty_ratio 20을 적용해 손으로 계산했습니다. 실제 서버는 이 분모가 page cache 크기에 따라 계속 움직입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="dirty page 합계가 세 한계선을 넘는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="grid">
            {SCENES.map((sc, i) => (
              <h4 key={sc.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-base font-bold ${i === scenes.active ? "" : "invisible"}`}>
                {sc.label}
              </h4>
            ))}
          </div>
          <div className="relative mt-8 h-10 w-full rounded-sm border border-border">
            <div className="absolute inset-y-0 left-0 rounded-l-sm transition-[width,background-color] duration-500" style={{ width: pct(s.dirty), backgroundColor: `${fill}55` }} />
            <div className="absolute inset-y-0 w-0.5 transition-[left] duration-500" style={{ left: pct(s.dirty), backgroundColor: fill }} />
            {[
              { v: BG, label: "bg 1,227", color: "#2563eb" },
              { v: FREERUN, label: "freerun 1,842", color: "#d97706" },
              { v: THRESH, label: "thresh 2,457", color: "#dc2626" },
            ].map((m) => (
              <div key={m.label} className="absolute -top-6 bottom-0 w-0 border-l border-dashed" style={{ left: pct(m.v), borderColor: m.color }}>
                <span className="absolute -top-0.5 left-1 whitespace-nowrap font-mono text-[10px] font-bold" style={{ color: m.color }}>
                  {m.label}
                </span>
              </div>
            ))}
            <span className="absolute inset-y-0 left-1.5 flex items-center font-mono text-xs font-black" style={{ color: fill }}>
              dirty {s.dirty.toLocaleString()} MiB
            </span>
          </div>
          <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>0</span>
            <span>{AXIS_MAX.toLocaleString()} MiB (가용 {AVAIL.toLocaleString()}의 25%)</span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">flusher (커널 writeback 스레드)</dt>
              <dd className="grid font-bold text-foreground">
                {SCENES.map((sc, i) => (
                  <span key={sc.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 ${i === scenes.active ? "" : "invisible"}`}>
                    {sc.flusher}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">write()를 부르는 앱</dt>
              <dd className="grid font-bold">
                {SCENES.map((sc, i) => (
                  <span key={sc.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 ${i === scenes.active ? "" : "invisible"}`} style={{ color: sc.writerColor }}>
                    {sc.writer}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          {/* 모든 장면의 설명을 같은 칸에 겹쳐 두어 가장 긴 장면이 높이를 정한다 */}
          <div className="mt-3 grid border-l border-primary/50 pl-4">
            {SCENES.map((sc, i) => (
              <p key={sc.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-sm leading-6 text-muted-foreground ${i === scenes.active ? "" : "invisible"}`}>
                {sc.note}
              </p>
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((x) => x.label)} />
      </div>
    </VizFrame>
  );
}
