import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["CALL 입력", "Spec 선택", "주소 조회", "Gas 계산", "Gas 판정", "SHA-256", "EVM 반환"] as const;
const NOTES = [
  "CALL-02는 주소 0x02에 abc 3바이트와 precompile frame gas 100을 전달합니다. 이 값은 설명용 fixture입니다.",
  "Reth는 block header와 ChainSpec으로 EVM SpecId를 정합니다. 이 사례에서는 Prague registry를 선택합니다.",
  "revm handler가 bytecode_address 0x02를 현재 registry에서 찾습니다. 0x02는 SHA-256 entry와 연결됩니다.",
  "SHA-256은 crypto backend를 부르기 전에 60 + 12×ceil(3/32) = 72 gas를 계산합니다.",
  "전달된 100 gas가 비용 72 이상이므로 실행합니다. 71 gas였다면 backend를 부르지 않고 PrecompileOOG로 끝납니다.",
  "crypto provider가 abc를 SHA-256으로 계산해 32바이트 output을 만듭니다. 같은 protocol input은 backend와 관계없이 같은 bytes를 내야 합니다.",
  "handler는 성공 output과 frame gas 28을 InterpreterResult로 돌려줍니다. 28은 CALL 전체 비용이 아니라 precompile frame 안에서 남은 값입니다.",
] as const;

const STAGES = [
  { title: "CALL frame", role: "주소·입력·전달 gas", value: ["0x02 · abc · 100", "CALL-02"] },
  { title: "Fork registry", role: "Spec별 주소 계약", value: ["Prague", "0x02 → SHA-256"] },
  { title: "Gas gate", role: "비용 계산·실행 판정", value: ["60 + 12×1", "100 ≥ 72"] },
  { title: "Crypto provider", role: "해시 bytes 계산", value: ["SHA-256(abc)", "ba7816…15ad"] },
  { title: "Interpreter", role: "result·output·남은 gas", value: ["Return · 32 bytes", "gas 28"] },
] as const;

function Stage({ index, active }: { index: number; active: number }) {
  const stage = STAGES[index];
  const reachedAt = [0, 1, 3, 5, 6] as const;
  const reached = active >= reachedAt[index];
  const current =
    (index === 0 && active === 0) ||
    (index === 1 && active >= 1 && active <= 2) ||
    (index === 2 && active >= 3 && active <= 4) ||
    (index === 3 && active === 5) ||
    (index === 4 && active === 6);

  return (
    <div className={`relative min-w-0 border bg-background p-3 sm:p-4 ${current ? "border-primary" : reached ? "border-primary/35" : "border-border"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
        <span className={`h-2 w-2 rounded-full ${current ? "bg-primary" : reached ? "bg-primary/35" : "bg-border"}`} aria-hidden />
      </div>
      <strong className="mt-2 block break-keep text-xs leading-5">{stage.title}</strong>
      <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{stage.role}</span>
      <div className="mt-3 min-h-12 border-t border-border pt-2 font-mono text-[9px] leading-4">
        <span className="block break-all">{reached ? stage.value[0] : "—"}</span>
        <span className={`block break-all ${current ? "font-bold text-primary" : "text-muted-foreground"}`}>{reached ? stage.value[1] : "대기"}</span>
      </div>
    </div>
  );
}

export default function RethPrecompileCallViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const active = scenes.active;
  const activeStage = active === 0 ? 0 : active <= 2 ? 1 : active <= 4 ? 2 : active === 5 ? 3 : 4;
  const mobileStage = STAGES[activeStage];
  return (
    <VizFrame
      eyebrow="개념 경로 · Precompile CALL"
      title="주소 조회와 gas 판정을 통과한 뒤에만 네이티브 연산을 실행합니다"
      description="CALL-02의 주소·입력·gas·output을 같은 고정 지도에서 끝까지 추적합니다."
      note="100−72=28은 precompile frame 내부 계산입니다. CALL opcode 자체의 다른 비용은 이 fixture 범위 밖입니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-precompiles-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth에서 주소 0x02 SHA-256 precompile CALL이 처리되는 일곱 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="lg:hidden">
          <div className="grid grid-cols-5 gap-px bg-border p-px" aria-label="Precompile CALL 전체 단계">
            {(["CALL", "REGISTRY", "GAS", "CRYPTO", "RESULT"] as const).map((label, index) => (
              <div key={label} className={`min-w-0 bg-background px-1 py-2 text-center ${index === activeStage ? "text-primary" : index < activeStage ? "text-foreground" : "text-muted-foreground"}`}>
                <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-1 block truncate text-[7px] leading-3">{label}</strong>
              </div>
            ))}
          </div>
          <div className="mt-2 border border-primary bg-background p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="block text-sm">{mobileStage.title}</strong>
                <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{mobileStage.role}</span>
              </div>
              <span className="font-mono text-[9px] font-black text-primary">{String(activeStage + 1).padStart(2, "0")}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px font-mono text-[9px] leading-4">
              <span className="min-w-0 break-all bg-background p-2">{mobileStage.value[0]}</span>
              <strong className="min-w-0 break-all bg-background p-2 text-primary">{mobileStage.value[1]}</strong>
            </div>
          </div>
        </div>
        <div className="hidden gap-2 lg:grid lg:grid-cols-[1fr_1fr_1fr_1fr_1fr] lg:items-stretch">
          {STAGES.map((stage, index) => <Stage key={stage.title} index={index} active={active} />)}
        </div>

        <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[0.8fr_1.2fr]">
          <div className="bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">현재 장면</span>
            <strong className="mt-1 block break-keep text-sm">{SCENES[active]}</strong>
          </div>
          <div className="bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">CALL-02에서 새로 확인한 값</span>
            <strong className="mt-1 block break-keep text-sm text-primary">
              {active === 0 && "입력 3 bytes · frame gas 100"}
              {active === 1 && "EVM SpecId → Prague registry"}
              {active === 2 && "0x02 → SHA-256 entry"}
              {active === 3 && "비용 72 gas"}
              {active === 4 && "100 ≥ 72 · 실행"}
              {active === 5 && "output ba7816…15ad"}
              {active === 6 && "Return · 32 bytes · gas 28"}
            </strong>
          </div>
        </div>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["입력", "Spec", "조회", "계산", "판정", "해시", "반환"]}
          playLabel="CALL 처리 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
