import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["요청", "조회", "승인 대기", "환불 실행", "장애와 재개", "영수증 검증"] as const;
const NOTES = [
  "고객이 A-104 환불을 요청합니다. Runtime은 실행 식별자 refund-8472와 phase를 만들지만 아직 외부 효과는 없습니다.",
  "주문과 당시 정책을 조회해 금액·정책 version·판정 근거를 상태에 기록합니다.",
  "금액이 기준을 넘어 승인 대상과 정책 version을 checkpoint에 저장한 뒤 멈춥니다. 다음 날 답이 와도 같은 run의 승인인지 확인합니다.",
  "승인 후 refund:refund-8472:A-104를 key로 API를 호출합니다. 결제 시스템이 요청을 받아들이는 순간 외부 효과가 생깁니다.",
  "결제는 성공했지만 완료 저장 전에 worker가 종료됩니다. 새 worker는 마지막 checkpoint와 같은 key로 기존 결과를 확인합니다.",
  "같은 operation ID와 영수증을 받으면 주문·금액·상태를 검증한 뒤 completed를 저장합니다.",
] as const;

const NODES = [
  { title: "고객 요청", detail: "order A-104", x: 20, y: 119, w: 94 },
  { title: "실행 상태", detail: "refund-8472", x: 136, y: 45, w: 104 },
  { title: "주문·정책", detail: "amount·policy", x: 264, y: 45, w: 104 },
  { title: "저장 지점", detail: "thread state", x: 392, y: 45, w: 104 },
  { title: "담당자 승인", detail: "bound payload", x: 522, y: 119, w: 98 },
  { title: "환불 API", detail: "stable key", x: 522, y: 229, w: 98 },
  { title: "영수증 검증", detail: "operation ID", x: 368, y: 229, w: 112 },
  { title: "완료 상태", detail: "receipt linked", x: 214, y: 229, w: 108 },
] as const;

const ACTIVE = [[0], [2], [4], [5], [1, 3, 5], [6, 7]] as const;
const PATHS = [
  "M114 147L136 82",
  "M240 73H264",
  "M368 73H392",
  "M496 82L522 147",
  "M571 175V229",
  "M522 257H480",
  "M368 257H322",
] as const;

function RuntimeDiagram({ active }: { active: number }) {
  const selectedNodes: readonly number[] = ACTIVE[active];
  const passedCount = active === 0 ? 0 : active === 1 ? 3 : active === 2 ? 5 : active === 3 ? 6 : active === 4 ? 6 : 8;
  return (
    <div role="img" aria-label="A-104 환불 요청이 조회, 승인 대기, 환불 실행, 장애 복구와 영수증 검증을 거치는 경로">
      <ol className="grid grid-cols-3 gap-1.5 sm:hidden">
        {NODES.map((node, index) => {
          const selected = selectedNodes.includes(index);
          const passed = index < passedCount;
          return (
            <li key={node.title} className={`min-w-0 border p-2 ${selected ? "border-primary bg-primary/10" : passed ? "border-foreground/40 bg-muted/50" : "border-border bg-background"}`}>
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-[11px] leading-4">{node.title}</strong>
            </li>
          );
        })}
      </ol>

      <svg viewBox="0 0 640 330" className="mx-auto hidden h-auto w-full max-w-[40rem] sm:block" aria-hidden="true">
        <defs>
          <marker id="refund-runtime-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor" /></marker>
        </defs>
        {PATHS.map((path, index) => <path key={path} d={path} fill="none" className={index < active ? "stroke-primary" : "stroke-border"} strokeWidth={index < active ? 1.25 : 1} markerEnd="url(#refund-runtime-arrow)" />)}
        {NODES.map((node, index) => {
          const selected = selectedNodes.includes(index);
          const passed = index < passedCount;
          return (
            <g key={node.title}>
              <rect x={node.x} y={node.y} width={node.w} height="56" rx="5" className={selected ? "fill-primary/10 stroke-primary" : passed ? "fill-muted/55 stroke-foreground/40" : "fill-background stroke-border"} strokeWidth={selected ? 1.25 : 1} />
              <text x={node.x + node.w / 2} y={node.y + 22} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{node.title}</text>
              <text x={node.x + node.w / 2} y={node.y + 41} textAnchor="middle" className="fill-muted-foreground text-[8.5px]">{node.detail}</text>
            </g>
          );
        })}
        {active === 4 ? <g><path d="M510 207L528 225M528 207L510 225" className="stroke-destructive" strokeWidth="1.2" /><text x="500" y="198" textAnchor="end" className="fill-destructive text-[9px] font-bold">worker 종료</text><path d="M444 101V180H510" fill="none" className="stroke-primary" strokeDasharray="4 4" strokeWidth="1.2" markerEnd="url(#refund-runtime-arrow)" /><text x="445" y="169" textAnchor="middle" className="fill-primary text-[8.5px] font-bold">복원·같은 key 조회</text></g> : null}
        <text x="320" y="316" textAnchor="middle" className="fill-muted-foreground text-[9px]">실행 상태는 Checkpoint에 · 외부 효과는 operation ID와 영수증에 남습니다</text>
      </svg>
    </div>
  );
}

export default function RefundRuntimeTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  return (
    <VizFrame eyebrow="한 요청 · 두 종류의 상태" title="환불 상태를 저장해도 외부 환불은 따로 확인해야 합니다" description="A-104 환불 한 건이 사람의 승인과 worker 장애를 지나 완료되는 과정을 따라갑니다." note="설명용 상태 전이입니다. 실제 결제사의 idempotency·조회·취소 계약과 내부 승인 정책은 별도로 검증해야 합니다." canvasClassName="p-2 sm:p-7">
      <div id={scenes.playbackId} data-viz-canvas data-viz-scene="refund-runtime-trace-viz" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="환불 요청이 durable runtime에서 중단되고 재개되는 과정" onKeyDown={scenes.onKeyDown} className="flex h-auto min-h-0 min-w-0 flex-col overflow-visible outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(39rem,calc(100svh-8rem))] sm:min-h-[33rem] sm:overflow-y-auto">
        <div data-viz-live-only className="flex flex-none flex-col justify-center">
          <p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-3 border-y border-border py-3"><RuntimeDiagram active={scenes.active} /></div>
          <p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{NOTES[scenes.active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="순서대로 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">{SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}</ol>
      </div>
    </VizFrame>
  );
}
