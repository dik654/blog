import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const labels = ["고정", "기준선", "REVERT", "Invalid", "Fork", "Mismatch", "복구"] as const;
const notes = [
  "Base와 candidate에 같은 Reth release 조건, ChainSpec, 부모 상태, header와 raw block bytes를 넣습니다. 실행 process와 data directory는 분리합니다.",
  "정상 블록에서 result·BundleState·post-validation·state root를 모두 저장합니다. Hash 하나만 같다고 기준선이 완성되지는 않습니다.",
  "한 거래가 REVERT하는 fixture를 넣습니다. 두 실행기는 failed receipt, gas, nonce와 나머지 상태를 같게 만들어야 하며 블록 자체는 유효할 수 있습니다.",
  "Nonce·intrinsic gas·envelope가 유효하지 않은 거래를 넣습니다. Base가 블록을 거절하면 candidate도 같은 경계에서 거절해야 합니다.",
  "Fork 활성 직전과 직후의 header·system operation을 재생합니다. 첫 차이가 환경 구성인지 transaction 결과인지 commitment인지 남깁니다.",
  "Header의 gas·receipts·requests 또는 state root를 한 항목만 바꿉니다. 실행 결과가 있어도 post-validation은 불일치를 거절해야 합니다.",
  "Candidate를 격리하고 binary·ChainSpec·실행 설정을 baseline digest로 되돌립니다. 전체 fixture와 restart 결과가 다시 일치해야 재진입합니다.",
] as const;

const baseStatus = ["입력 대기", "PASS", "PASS · failed receipt", "REJECT", "PASS", "REJECT", "PASS"] as const;
const candidateStatus = ["입력 대기", "PASS", "대조 중", "대조 중", "대조 중", "대조 중", "격리 후 재실행"] as const;
const evidence = [
  "release · ChainSpec · parent · block bytes",
  "result · bundle · validation · root",
  "receipt status · gas · nonce · state",
  "typed error · output 없음",
  "env · system call · result · commitment",
  "got/expected · reject reason",
  "rollback digest · replay parity",
] as const;

export default function RethBlockExecutionValidationViz() {
  const scenes = useAnimatedScenes(labels.length, 11200, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame
      eyebrow="실무 경로 · 같은 입력을 두 실행기에 재생"
      title="정상 결과를 먼저 고정하고, 실패 경계를 하나씩 바꿉니다"
      description="입력 고정부터 정상 기준선, REVERT, invalid transaction, fork 경계, commitment 불일치와 rollback까지 같은 증거 묶음으로 대조합니다."
      note="실험 설계입니다. 대상 환경의 성능·복구 결과는 아직 측정하지 않았고 운영 노드에 장애를 주입하지 않습니다."
      canvasClassName="flex flex-col justify-center px-2 py-0 sm:px-5 sm:py-0"
    >
      <div id={scenes.playbackId} data-viz-live-only data-reth-block-execution-validation-scene={active} tabIndex={0} role="group" aria-label="Reth Block Execution 변경을 기준선과 장애 fixture로 검증하는 과정" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-7 gap-1">
          {labels.map((label, index) => <div key={label} className="min-w-0 text-center"><span className={`block h-1 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} /><span className={`mt-1 block font-mono text-[8px] font-black ${index === active ? "text-foreground" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")}<span className="hidden md:inline"> · {label}</span></span></div>)}
        </div>

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-stretch gap-2">
          <div className="border border-border p-4">
            <span className="font-mono text-[9px] font-black text-muted-foreground">BASE · v2.8.1</span>
            <strong className="mt-2 block break-keep text-sm">{baseStatus[active]}</strong>
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">권위 있는 비교 기준</p>
          </div>
          <div className="flex items-center justify-center text-primary" aria-hidden>⇄</div>
          <div className={`border p-4 ${active === labels.length - 1 ? "border-amber-500" : "border-primary/60"}`}>
            <span className="font-mono text-[9px] font-black text-primary">CANDIDATE</span>
            <strong className="mt-2 block break-keep text-sm">{candidateStatus[active]}</strong>
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">독립 process · 독립 data dir</p>
          </div>
        </div>

        <div className="mt-3 border-y border-border py-3">
          <p className="font-mono text-[9px] font-black text-primary">현재 대조할 증거</p>
          <p className="mt-1 break-keep text-xs font-bold leading-5">{evidence[active]}</p>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-px bg-border p-px text-center">
          {[
            ["Result", active === 0 ? "—" : "receipt·gas"],
            ["State", active === 0 ? "—" : "bundle"],
            ["Validate", active < 1 ? "—" : active === 2 ? "valid 가능" : active === 3 || active === 5 ? "reject" : "compare"],
            ["Recovery", active === 6 ? "replayed" : "not run"],
          ].map(([title, value]) => <div key={title} className="min-w-0 bg-background px-2 py-3"><strong className="block text-[10px]">{title}</strong><span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground">{value}</span></div>)}
        </div>

        <p data-scene-note className="mt-3 h-36 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:h-auto sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">
          <strong className="mb-1 block font-mono text-[9px] text-primary">{String(active + 1).padStart(2, "0")}/{String(labels.length).padStart(2, "0")} · {labels[active]}</strong>
          {notes[active]}
        </p>
        <AnimatedSceneControls {...scenes} labels={labels} controlLabels={["고정", "기준", "REVERT", "Invalid", "Fork", "Mismatch", "복구"]} playLabel="Block Execution 검증 경로 재생" className="sticky bottom-0 mt-0 bg-background/95 sm:static sm:!min-h-0 sm:!border-t-0 sm:bg-transparent sm:!pt-2 [&>p]:hidden [&_[data-viz-desktop-controls]]:gap-1 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button]:py-1 [&_[data-viz-desktop-controls]>button:last-child]:w-20" />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
