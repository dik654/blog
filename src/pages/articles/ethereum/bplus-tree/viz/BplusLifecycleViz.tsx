import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "한 page의 예산",
  "35를 찾는 경로",
  "35부터 62까지",
  "삽입으로 넘침",
  "둘로 나누고 연결",
  "삭제와 실패 경계",
] as const;

const NOTES = [
  "4,096바이트 page에서 header 96바이트를 빼고 separator와 child pointer 한 쌍을 24바이트로 잡으면 최대 166개를 계산할 수 있습니다. 실제 fanout은 key 길이·slot·fill factor에 따라 달라집니다.",
  "Root의 separator [20,40]은 35를 가운데 child로 보냅니다. Internal page는 길을 고르고 실제 key 또는 record pointer는 leaf에서 확인합니다.",
  "35가 있을 첫 leaf까지는 root에서 내려갑니다. 그다음에는 leaf의 right-sibling 연결을 따라 62를 넘을 때까지 순서대로 읽습니다.",
  "용량 4인 leaf [10,20,30,40]에 25를 넣으면 정렬된 다섯 항목이 되어 한 page에 들어가지 않습니다. 기존 leaf만 덮어써서는 불변식을 지킬 수 없습니다.",
  "다섯 항목을 [10,20]과 [25,30,40]으로 나누고, parent에 새 right leaf로 가는 경계 25를 공개합니다. Parent도 넘치면 같은 변화가 위로 전파됩니다.",
  "삭제 뒤에는 sibling 재분배나 merge로 경계와 점유율을 고칩니다. 반대로 새 leaf를 만들고 parent downlink를 공개하지 않으면 그 page의 key는 root 탐색으로 도달할 수 없습니다.",
] as const;

const Leaf = ({
  label,
  values,
  active = false,
  danger = false,
}: {
  label: string;
  values: readonly number[];
  active?: boolean;
  danger?: boolean;
}) => (
  <div className={`min-w-0 border bg-background p-3 ${danger ? "border-rose-500/70" : active ? "border-primary" : "border-border"}`}>
    <span className="block text-[9px] font-bold text-muted-foreground">{label}</span>
    <div className="mt-2 grid grid-flow-col auto-cols-fr gap-px bg-border p-px text-center font-mono text-xs font-bold">
      {values.map((value) => (
        <span key={value} className={`bg-background px-1 py-2 ${active ? "text-primary" : ""}`}>{value}</span>
      ))}
    </div>
  </div>
);

export default function BplusLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · 한 key와 한 page split"
      title="Page 예산에서 조회·범위 탐색·분할·복구 불변식까지"
      description="질의 35와 삽입 25가 같은 page graph를 어떻게 읽고 바꾸는지 여섯 장면으로 따라갑니다."
      note="Page 크기와 숫자는 원리를 설명하기 위한 가정입니다. PostgreSQL을 비롯한 실제 구현은 page 형식·동시성·삭제 정책이 서로 다릅니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-bplus-scene={active}
        tabIndex={0}
        role="group"
        aria-label="B+ tree page 예산에서 조회, 범위 탐색, 분할과 실패 경계까지의 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6" aria-label="B+ tree의 여섯 단계">
          {SCENES.map((label, index) => (
            <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
              <span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong>
            </div>
          ))}
        </div>

        <section className="mt-3 min-h-[18rem] border border-border bg-background p-3 sm:min-h-[16rem] sm:p-5" aria-label="현재 B+ tree 상태">
          {active === 0 ? (
            <div className="grid min-h-[13rem] content-center gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:items-center">
              <div className="border-y border-border py-4">
                <p className="text-[10px] font-bold text-muted-foreground">4,096 B PAGE</p>
                <div className="mt-3 flex h-20 overflow-hidden border border-border text-center text-xs font-bold">
                  <div className="grid w-[24%] place-items-center bg-muted/50 px-2">header<br />96 B</div>
                  <div className="grid flex-1 place-items-center border-l border-border px-2">routing entries<br />4,000 B</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-b border-border pb-3 font-mono text-sm font-black">⌊(4,096 − 96) ÷ 24⌋ = 166</div>
                <div className="grid grid-cols-2 gap-px bg-border p-px text-center">
                  <div className="bg-background p-3"><span className="block text-[9px] text-muted-foreground">보수적 fanout</span><strong className="mt-1 block text-xl">160</strong></div>
                  <div className="bg-background p-3"><span className="block text-[9px] text-muted-foreground">leaf 용량</span><strong className="mt-1 block text-xl">200</strong></div>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">100만 rows → 5,000 leaves → 32 parents → 1 root</p>
              </div>
            </div>
          ) : null}

          {active === 1 || active === 2 ? (
            <div className="grid min-h-[13rem] content-center gap-3 sm:gap-5">
              <div className="mx-auto w-full max-w-sm border border-primary bg-background p-3 text-center">
                <span className="text-[9px] font-bold text-muted-foreground">ROOT · separator</span>
                <p className="mt-2 font-mono text-lg font-black">20 │ 40</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-muted-foreground">
                <span>≤ 20</span><span className="text-primary">20…40</span><span>&gt; 40</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Leaf label="leaf 08" values={[4, 12, 20]} />
                <Leaf label="leaf 09" values={[21, 35, 39]} active />
                <Leaf label="leaf 10" values={[41, 52, 62, 70]} active={active === 2} />
              </div>
              <div className="border-y border-border py-3 text-center">
                {active === 1 ? (
                  <p className="text-sm font-black">질의 35 → 가운데 child → leaf 09에서 확인</p>
                ) : (
                  <p className="text-sm font-black">35에서 시작 → sibling 10으로 이동 → 62에서 종료</p>
                )}
              </div>
            </div>
          ) : null}

          {active === 3 ? (
            <div className="grid min-h-[13rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] content-center items-center gap-2 sm:gap-5">
              <Leaf label="삽입 전 · capacity 4" values={[10, 20, 30, 40]} />
              <span className="text-center text-xl font-black text-primary">+ 25 →</span>
              <Leaf label="정렬 뒤 · overflow" values={[10, 20, 25, 30, 40]} danger />
              <p className="col-span-3 border-y border-border py-3 text-center text-sm font-black">한 page의 용량을 넘었으므로 page graph를 바꿔야 합니다.</p>
            </div>
          ) : null}

          {active === 4 ? (
            <div className="grid min-h-[13rem] content-center gap-4 sm:gap-5">
              <div className="mx-auto w-full max-w-sm border border-primary bg-background p-3 text-center">
                <span className="text-[9px] font-bold text-muted-foreground">PARENT · 새 downlink 공개</span>
                <p className="mt-2 font-mono text-lg font-black">… │ 25 │ …</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Leaf label="left leaf" values={[10, 20]} active />
                <Leaf label="right leaf · 경계 25" values={[25, 30, 40]} active />
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-xs font-bold text-muted-foreground">
                <span>정렬 보존</span><span className="text-primary">right sibling →</span><span>같은 leaf 깊이</span>
              </div>
            </div>
          ) : null}

          {active === 5 ? (
            <>
              <div className="grid min-h-[13rem] content-center gap-3 sm:hidden">
                <div className="border border-border bg-background p-3">
                  <p className="text-[10px] font-bold text-primary">정상 복구 · 이웃과 함께 경계를 고침</p>
                  <div className="mt-3 grid grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] gap-2">
                    <div className="border border-rose-500/70 p-2 text-center">
                      <span className="block text-[9px] font-bold text-muted-foreground">부족 page</span>
                      <strong className="mt-2 block border border-border py-2 font-mono text-xs">10</strong>
                    </div>
                    <div className="border border-border p-2 text-center">
                      <span className="block text-[9px] font-bold text-muted-foreground">이웃 page</span>
                      <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px font-mono text-xs font-bold">
                        {[20, 25, 30].map((value) => <span key={value} className="bg-background py-2">{value}</span>)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 border-t border-border pt-3 text-xs leading-5">재분배하거나 합치고 parent separator도 함께 고칩니다.</p>
                </div>
                <div className="border border-rose-500/70 bg-background p-3">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-300">실패 · parent downlink를 공개하지 않음</p>
                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center">
                    <div className="border border-border px-2 py-3 font-mono text-xs">root<br />25 없음</div>
                    <span className="font-black text-rose-600 dark:text-rose-300">×</span>
                    <div className="border border-rose-500/70 p-2">
                      <span className="block text-[9px] font-bold text-muted-foreground">새 leaf</span>
                      <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px font-mono text-xs font-bold">
                        {[25, 30, 40].map((value) => <span key={value} className="bg-background py-2">{value}</span>)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 border-t border-border pt-3 text-xs leading-5">Page는 있어도 root에서 내려가는 경로가 없어 key에 도달할 수 없습니다.</p>
                </div>
              </div>
              <div className="hidden min-h-[13rem] grid-cols-2 content-center gap-px bg-border p-px sm:grid">
                <div className="bg-background p-4">
                  <p className="text-[10px] font-bold text-primary">정상 삭제 복구</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Leaf label="underflow" values={[10]} danger />
                    <Leaf label="sibling" values={[20, 25, 30]} />
                  </div>
                  <p className="mt-4 border-t border-border pt-3 text-xs leading-5">재분배하거나 합치고 parent separator도 함께 고칩니다.</p>
                </div>
                <div className="bg-background p-4">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-300">도달 불가능한 page</p>
                  <div className="mt-4 border border-border p-3 text-center font-mono text-xs">root … 25 없음</div>
                  <p className="my-2 text-center text-rose-600 dark:text-rose-300">연결 끊김 ↓</p>
                  <Leaf label="새 leaf · parent downlink 없음" values={[25, 30, 40]} danger />
                  <p className="mt-4 border-t border-border pt-3 text-xs leading-5">Page가 존재해도 root에서 내려가는 경로가 없으면 key를 찾을 수 없습니다.</p>
                </div>
              </div>
            </>
          ) : null}
        </section>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["예산", "조회", "범위", "넘침", "분할", "복구"]}
          playLabel="B+ tree 내부 과정 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
