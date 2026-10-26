import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "조건 고정",
  "같은 연산 재생",
  "경계 변화 검사",
  "중간 종료",
  "다시 열어 대조",
  "결정과 되돌리기",
] as const;

const NOTES = [
  "Source SHA, page format, comparator, duplicate 정책, 점유율, sync 방식, filesystem, 장비와 operation trace를 한 manifest에 고정합니다.",
  "Candidate index와 독립 ordered-map oracle에 insert·delete·point·range 연산을 같은 순서로 넣습니다. 두 상태의 writer는 서로 분리합니다.",
  "Empty, capacity−1, capacity, capacity+1, root growth, 구현이 지원하는 redistribution·merge·root shrink를 의도적으로 통과시킵니다.",
  "Page write, parent downlink, root·meta·free-list 공개 전후에서 격리된 실험 프로세스만 종료합니다. 운영 데이터에는 장애를 주입하지 않습니다.",
  "재시작 뒤 모든 key와 range 결과, page graph 불변식을 oracle과 대조합니다. PostgreSQL을 시험한다면 amcheck는 추가 증거이지 완전한 무결성 증명은 아닙니다.",
  "정확성과 복구를 통과한 run에서만 page read/write, 높이, 공간, p50·p99를 비교합니다. 결과가 없으면 ADR은 proposed이며 우위는 미측정입니다.",
] as const;

const OUTPUTS = [
  ["manifest", "bplus-run-v1", "판정", "비교 조건 고정"],
  ["trace", "ops-017 · seed 23", "판정", "candidate ↔ oracle"],
  ["boundary", "capacity+1 · root split", "판정", "불변식 검사"],
  ["kill point", "parent publish 직전", "판정", "재시작 대기"],
  ["reopen", "point·range·graph", "판정", "결과 미측정"],
  ["receipt", "correctness → cost", "판정", "proposed"],
] as const;

export default function BplusValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200, { loop: false });
  const active = scenes.active;
  const output = OUTPUTS[active];

  return (
    <VizFrame
      eyebrow="실무 경로 · page graph 검증"
      title="같은 연산을 재생하고, 끊어 보고, 다시 열어 대조합니다"
      description="성능 숫자보다 먼저 page graph와 조회 결과가 복구되는지를 증명하는 순서입니다."
      note="Operation 수·자료 크기·장비·통과 기준과 결과는 아직 대상 환경에서 측정하지 않았습니다. 그림의 식별자는 실험 구조를 설명하기 위한 가정입니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-bplus-validation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="B+ tree 구현 조건을 고정하고 연산과 장애 복구를 검증해 결정으로 남기는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6" aria-label="B+ tree 검증의 여섯 단계">
          {SCENES.map((label, index) => (
            <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
              <span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:hidden">
          <section className="min-w-0 border border-border bg-background p-3" aria-label="실험의 상태 소유자">
            <p className="text-[10px] font-bold text-muted-foreground">서로 다른 상태 소유자</p>
            <div className="mt-2 grid grid-cols-2 gap-px bg-border p-px text-[10px] leading-4">
              <div className="min-w-0 bg-background p-2"><strong className="block text-xs">Harness</strong><span className="text-muted-foreground">manifest·trace·receipt</span></div>
              <div className="min-w-0 bg-background p-2"><strong className="block text-xs">Candidate</strong><span className="text-muted-foreground">page graph·index files</span></div>
              <div className="min-w-0 bg-background p-2"><strong className="block text-xs">Oracle</strong><span className="text-muted-foreground">기대 key·range 결과</span></div>
              <div className="min-w-0 bg-background p-2"><strong className="block text-xs">Collector</strong><span className="text-muted-foreground">읽기 전용 raw metrics</span></div>
            </div>
          </section>

          <section className="min-w-0 border border-border bg-background p-3" aria-label="현재 단계의 입력과 판정">
            <p className="text-[10px] font-bold text-muted-foreground">현재 단계의 증거</p>
            <div className="mt-2 grid grid-cols-2 gap-px bg-border p-px">
              <div className="min-w-0 bg-background p-2">
                <span className="text-[9px] font-bold text-muted-foreground">{output[0]}</span>
                <p className="mt-1 break-all font-mono text-[10px] font-bold leading-4">{output[1]}</p>
              </div>
              <div className="min-w-0 bg-background p-2">
                <span className="text-[9px] font-bold text-muted-foreground">{output[2]}</span>
                <p className="mt-1 break-keep text-xs font-black leading-4">{output[3]}</p>
              </div>
            </div>
            {active >= 2 ? (
              <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px text-center">
                <div className="bg-background px-1 py-1.5"><span className="block text-[9px] text-muted-foreground">point</span><strong className="block text-[10px]">대조</strong></div>
                <div className="bg-background px-1 py-1.5"><span className="block text-[9px] text-muted-foreground">range</span><strong className="block text-[10px]">대조</strong></div>
                <div className="bg-background px-1 py-1.5"><span className="block text-[9px] text-muted-foreground">graph</span><strong className="block text-[10px] text-primary">검사</strong></div>
              </div>
            ) : null}
          </section>
        </div>

        <div className="mt-3 hidden gap-px bg-border p-px sm:grid sm:grid-cols-2">
          <section className="min-w-0 bg-background p-4" aria-label="실험의 상태 소유자">
            <p className="text-[10px] font-bold text-muted-foreground">서로 다른 상태 소유자</p>
            <div className="mt-3 grid gap-px bg-border p-px text-xs leading-5">
              <div className="bg-background px-3 py-2.5"><strong>Harness</strong><span className="ml-2 text-muted-foreground">manifest·trace·receipt</span></div>
              <div className="bg-background px-3 py-2.5"><strong>Candidate</strong><span className="ml-2 text-muted-foreground">page graph·index files</span></div>
              <div className="bg-background px-3 py-2.5"><strong>Oracle</strong><span className="ml-2 text-muted-foreground">기대 key·range 결과</span></div>
              <div className="bg-background px-3 py-2.5"><strong>Collector</strong><span className="ml-2 text-muted-foreground">읽기 전용 raw metrics</span></div>
            </div>
          </section>

          <section className="min-h-56 min-w-0 bg-background p-4" aria-label="현재 단계의 입력과 판정">
            <p className="text-[10px] font-bold text-muted-foreground">현재 단계의 증거</p>
            <div className="mt-3 border-y border-border py-3">
              <span className="text-[9px] font-bold text-muted-foreground">{output[0]}</span>
              <p className="mt-1 break-all font-mono text-xs font-bold">{output[1]}</p>
            </div>
            <div className="border-b border-border py-3">
              <span className="text-[9px] font-bold text-muted-foreground">{output[2]}</span>
              <p className="mt-1 break-keep text-sm font-black">{output[3]}</p>
            </div>
            {active >= 2 ? (
              <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center">
                <div className="bg-background px-2 py-2"><span className="block text-[9px] text-muted-foreground">point</span><strong className="mt-1 block text-xs">대조</strong></div>
                <div className="bg-background px-2 py-2"><span className="block text-[9px] text-muted-foreground">range</span><strong className="mt-1 block text-xs">대조</strong></div>
                <div className="bg-background px-2 py-2"><span className="block text-[9px] text-muted-foreground">graph</span><strong className="mt-1 block text-xs text-primary">검사</strong></div>
              </div>
            ) : null}
          </section>
        </div>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-16 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["고정", "재생", "경계", "종료", "대조", "결정"]}
          playLabel="B+ tree 검증 과정 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
