import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "첫 값 기록",
  "수정과 삭제",
  "정렬 파일 생성",
  "시점별 읽기",
  "안전하게 합치기",
  "밀린 일 제한",
] as const;

const NOTES = [
  "Put(A, 7)은 sequence 41을 받습니다. WAL은 아직 정렬 파일에 내려가지 않은 값을 복구할 기록이고, memtable은 새 쓰기와 읽기에 쓰는 메모리 색인입니다.",
  "Put(A, 9)@52와 Delete(A)@60은 기존 위치를 덮어쓰지 않습니다. 같은 사용자 키 A에 sequence와 값 종류가 다른 내부 항목 세 개가 생깁니다.",
  "가득 찬 memtable은 동결되고 정렬된 L0 SSTable로 내려갑니다. 파일은 immutable이므로 다음 수정도 새 항목으로 들어갑니다.",
  "snapshot 55는 55 이하에서 가장 큰 sequence인 A@52=9를 봅니다. snapshot 61은 A@60 tombstone을 만나므로 없음으로 끝나야 합니다.",
  "활성 snapshot 55를 보존하는 compaction이라면 A@60과 A@52를 남길 수 있습니다. A@41과 더 오래된 A@12는 어느 활성 시점에도 필요하지 않을 때만 제거합니다.",
  "설명용 평균에서 ingest 80MB/s, compaction 60MB/s이면 debt가 초당 20MB 늘어납니다. 남은 한도가 1,000MB라면 약 50초 뒤 쓰기를 늦추거나 멈춰 더 큰 read·space 비용을 막아야 합니다.",
] as const;

const ENTRIES = [
  { sequence: 60, value: "삭제", introduced: 1, dropped: false },
  { sequence: 52, value: "9", introduced: 1, dropped: false },
  { sequence: 41, value: "7", introduced: 0, dropped: true },
  { sequence: 12, value: "2", introduced: 2, dropped: true },
] as const;

const SNAPSHOTS = [
  {
    label: "snapshot 55",
    rule: "sequence ≤ 55 중 최댓값",
    result: "A = 9",
    selected: 52,
  },
  {
    label: "snapshot 61",
    rule: "sequence ≤ 61 중 최댓값",
    result: "없음",
    selected: 60,
  },
] as const;

export default function LsmLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="한 키의 수명 · write → read → compact"
      title="A=7을 A=9로 바꾼 뒤 삭제해도 두 snapshot은 서로 다른 답을 봅니다"
      description="같은 키 A의 내부 항목을 여섯 장면에서 그대로 추적합니다. 재생은 직접 시작하며 마지막 장면에서 멈춥니다."
      note="sequence 41·52·60과 A@12, 80·60MB/s, 1,000MB는 메커니즘을 계산하기 위한 설명용 가정입니다. RocksDB의 실제 임계값과 성능 측정값이 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-lsm-scene={active}
        tabIndex={0}
        role="group"
        aria-label="같은 키의 쓰기, 시점 읽기, compaction과 write stall 과정을 보여 주는 그림"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6" aria-label="LSM의 여섯 상태">
          {SCENES.map((label, index) => (
            <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
              <span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <section className="min-w-0 bg-background p-3 sm:p-4" aria-label="키 A의 내부 항목">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold text-muted-foreground">같은 사용자 키 A</p>
              <p className="font-mono text-[9px] text-muted-foreground">sequence 큰 값부터</p>
            </div>
            <div className="mt-3 grid gap-px bg-border p-px">
              {ENTRIES.map((entry) => {
                const visible = active >= entry.introduced;
                const compactedAway = active >= 4 && entry.dropped;
                return (
                  <div
                    key={entry.sequence}
                    className={`grid grid-cols-[3.5rem_minmax(0,1fr)_4rem] items-center gap-2 bg-background px-3 py-2.5 transition-opacity ${visible ? "opacity-100" : "opacity-20"}`}
                  >
                    <strong className="font-mono text-xs">A@{entry.sequence}</strong>
                    <span className={`break-keep text-xs ${entry.value === "삭제" ? "font-bold text-rose-600 dark:text-rose-300" : "text-muted-foreground"}`}>
                      {entry.value === "삭제" ? "tombstone" : `value ${entry.value}`}
                    </span>
                    <span className="text-right text-[9px] font-bold text-muted-foreground">
                      {compactedAway ? "제거 가능" : active >= 2 ? "SST" : "mem"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="min-h-64 min-w-0 bg-background p-3 sm:p-4" aria-label="현재 저장 상태와 읽기 결과">
            {active <= 2 ? (
              <div className="grid gap-px bg-border p-px">
                <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 bg-background px-3 py-3">
                  <strong className="text-xs">WAL</strong>
                  <span className="break-keep text-xs leading-5 text-muted-foreground">
                    {active === 0 ? "A@41 기록" : active === 1 ? "A@41·52·60 기록" : "flush된 구간은 회수 조건 확인"}
                  </span>
                </div>
                <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 bg-background px-3 py-3">
                  <strong className="text-xs">Memtable</strong>
                  <span className="break-keep text-xs leading-5 text-muted-foreground">
                    {active < 2 ? "쓰기와 최신 읽기에 참여" : "동결 뒤 새 memtable로 교체"}
                  </span>
                </div>
                <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 bg-background px-3 py-3">
                  <strong className="text-xs">L0 SST</strong>
                  <span className="break-keep text-xs leading-5 text-muted-foreground">
                    {active < 2 ? "아직 없음" : "A@60·52·41이 정렬 파일에 고정"}
                  </span>
                </div>
              </div>
            ) : null}

            {active === 3 ? (
              <div className="grid gap-px bg-border p-px">
                {SNAPSHOTS.map((snapshot) => (
                  <div key={snapshot.label} className="bg-background px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-xs">{snapshot.label}</strong>
                      <span className="font-mono text-[10px] font-bold text-primary">A@{snapshot.selected}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{snapshot.rule}</p>
                    <p className="mt-2 text-sm font-black">{snapshot.result}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {active === 4 ? (
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-muted-foreground">L0 + L1 다중 병합</p>
                <div className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-2">
                  <div className="border-y border-border py-3 text-center text-xs font-bold">60 · 52 · 41 · 12</div>
                  <span className="text-center text-muted-foreground" aria-hidden>→</span>
                  <div className="border-y border-primary py-3 text-center text-xs font-black text-primary">60 · 52</div>
                </div>
                <p className="break-keep text-xs leading-5 text-muted-foreground">snapshot 55와 현재 읽기에 필요한 두 경계를 남깁니다. 오래된 snapshot이 더 있다면 제거 가능한 항목이 달라집니다.</p>
              </div>
            ) : null}

            {active === 5 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-px bg-border p-px text-center">
                  <div className="bg-background px-2 py-3"><span className="block text-[9px] text-muted-foreground">입력</span><strong className="mt-1 block text-sm">80 MB/s</strong></div>
                  <div className="bg-background px-2 py-3"><span className="block text-[9px] text-muted-foreground">처리</span><strong className="mt-1 block text-sm">60 MB/s</strong></div>
                  <div className="bg-background px-2 py-3"><span className="block text-[9px] text-muted-foreground">증가</span><strong className="mt-1 block text-sm text-rose-600 dark:text-rose-300">+20 MB/s</strong></div>
                </div>
                <div className="border-y border-border py-4 text-center">
                  <p className="font-mono text-xs">1,000 MB ÷ 20 MB/s = 50 s</p>
                  <p className="mt-2 text-sm font-black">한도 도달 → 쓰기 지연 또는 중단</p>
                </div>
              </div>
            ) : null}
          </section>
        </div>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["기록", "변경", "flush", "읽기", "병합", "압력"]}
          playLabel="LSM 내부 과정 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
