import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const labels = ["기준선", "Attributes", "Resource", "Resolve", "Restart", "Rollback"] as const;
const notes = [
  "Base와 candidate에 같은 Reth commit, ChainSpec, parent state, raw transaction corpus, payload attributes와 clock schedule을 입력합니다.",
  "Timestamp·fork field를 한 항목씩 어긋나게 해 두 구현이 같은 typed rejection을 내고 build를 시작하지 않는지 확인합니다.",
  "Nonce dependency, gas 경계, blob count·sidecar와 block-size 경계를 재생해 transaction 포함 순서, receipts, roots와 local value를 비교합니다.",
  "첫 build 전·진행 중·best 생성 뒤 getPayload를 호출해 fallback, resolve latency, ID 제거와 duplicate resolve 결과를 기록합니다.",
  "Process를 재시작한 뒤 이전 in-memory payloadId가 UnknownPayload가 되는지 확인합니다. 새 job을 임의로 대신 반환하면 실패입니다.",
  "차이가 하나라도 있으면 candidate rollout을 중지하고 binary·설정·traffic을 기준선으로 되돌린 뒤 같은 fixture가 다시 통과하는지 확인합니다.",
] as const;

export default function RethPayloadBuilderValidationViz() {
  const scenes = useAnimatedScenes(labels.length, 9800, { loop: false });
  const active = scenes.active;
  const rows = [
    ["입력", active === 0 ? "release · parent · attrs · tx corpus" : "같은 fixture + fault"],
    ["Base", active === 5 ? "재활성화" : "기준 result bundle"],
    ["Candidate", active === 5 ? "중지·격리" : active === 0 ? "비교 result bundle" : "fault outcome"],
    ["Gate", active === 0 ? "비교 준비" : active < 5 ? "typed result·bytes·timing" : "rollback replay"],
  ] as const;

  return (
    <VizFrame
      eyebrow="실무 경로 · 격리한 test node"
      title="같은 입력에 장애 하나씩만 더해 두 release의 결과를 대조합니다"
      description="정상 후보만 비교하지 않고 요청 거부, resource edge, resolve 시점, restart와 rollback을 같은 run ledger에 남깁니다."
      note="대상 운영 환경의 측정값은 아직 없습니다. 이 그림은 설치 승인안이 아니라 검증 순서입니다."
      canvasClassName="flex flex-col justify-center px-2 py-0 sm:px-5 sm:py-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-payload-builder-validation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth Payload Builder release를 같은 fixture와 장애로 검증하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-6 gap-1">
          {labels.map((label, index) => (
            <div key={label} className="min-w-0 text-center">
              <span className={`block h-1 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
              <span className={`mt-1 block break-keep font-mono text-[8px] font-black ${index === active ? "text-foreground" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")}<span className="hidden sm:inline"> · {label}</span></span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-4">
          {rows.map(([title, body], index) => (
            <div key={title} className={`bg-background p-3 transition-colors ${index === active % 4 ? "text-foreground" : "text-muted-foreground"}`}>
              <strong className="text-xs">{title}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-2 text-center text-xs">
          <div className="border border-border px-3 py-3"><strong>Base receipt</strong><span className="mt-1 block text-[10px] text-muted-foreground">payload · receipts · status · timing</span></div>
          <span className="text-primary" aria-hidden>↔</span>
          <div className={`border px-3 py-3 ${active === 5 ? "border-amber-500" : "border-primary"}`}><strong>{active === 5 ? "Rollback receipt" : "Candidate receipt"}</strong><span className="mt-1 block text-[10px] text-muted-foreground">첫 차이와 provenance 기록</span></div>
        </div>
        <p data-scene-note className="mt-3 h-32 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:h-auto sm:min-h-16 sm:pl-4 sm:text-sm sm:leading-6">
          <strong className="mb-1 block font-mono text-[9px] text-primary">{String(active + 1).padStart(2, "0")}/{String(labels.length).padStart(2, "0")} · {labels[active]}</strong>
          {notes[active]}
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={labels}
          controlLabels={["기준", "Attrs", "자원", "Resolve", "Restart", "Rollback"]}
          playLabel="Payload Builder 검증 경로 재생"
          className="mt-0 sm:!min-h-0 sm:!border-t-0 sm:!pt-2 [&>p]:hidden [&_[data-viz-desktop-controls]]:gap-1 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button]:py-1 [&_[data-viz-desktop-controls]>button:last-child]:w-20"
        />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
