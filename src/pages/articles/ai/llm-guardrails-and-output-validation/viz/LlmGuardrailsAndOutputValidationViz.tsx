import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["요청", "입력 검사", "응답 검사", "실행 검사", "영수증"] as const;
const NOTES = [
  "장애 보고서 91을 요약해 내부 #ops로 보내 달라는 요청입니다. 문장만 보면 허용 범위입니다.",
  "입력 rail은 원문만 검사해 ALLOW를 냅니다. 아직 생기지 않은 응답과 도구 호출은 승인하지 않습니다.",
  "모델 JSON은 schema를 통과해도 본문에 비밀값이 남습니다. 출력 rail이 값을 제거하고 MODIFY를 기록합니다.",
  "도구 rail은 대상·권한·본문을 다시 봅니다. 외부 주소이거나 불확실하면 실행하지 않고 사람에게 넘깁니다.",
  "검사된 본문만 전송하고 messageId=184를 남깁니다. 실제 효과는 이 영수증으로 확인합니다.",
] as const;

function Defs() {
  return <defs><marker id="guard-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor" /></marker></defs>;
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" markerEnd="url(#guard-arrow)" />;
}

function Box({ x, y, w = 112, title, detail, active = false }: { x: number; y: number; w?: number; title: string; detail: string; active?: boolean }) {
  return <g><rect x={x} y={y} width={w} height="48" rx="4" className={active ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} /><text x={x + w / 2} y={y + 18} textAnchor="middle" className="fill-foreground text-[9px] font-bold">{title}</text><text x={x + w / 2} y={y + 34} textAnchor="middle" className="fill-muted-foreground text-[8px]">{detail}</text></g>;
}

function RequestScene() {
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="장애 보고서 요약과 내부 채널 전송 요청"><Defs /><text x="180" y="26" textAnchor="middle" className="fill-muted-foreground text-[9px]">사용자 요청</text><rect x="43" y="47" width="274" height="62" rx="5" className="fill-background stroke-foreground" /><text x="180" y="73" textAnchor="middle" className="fill-foreground text-[11px] font-bold">장애 보고서 91을 요약해서</text><text x="180" y="92" textAnchor="middle" className="fill-foreground text-[11px] font-bold">내부 #ops 채널로 보내 줘</text><Arrow x1={180} y1={109} x2={180} y2={139} /><Box x={124} y={142} title="아직 생긴 효과 없음" detail="requestId=req-91" /></svg>;
}

function InputScene() {
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="입력만 검사해 요청을 허용하는 과정"><Defs /><Box x={12} y={72} title="사용자 요청" detail="보고서 요약·내부 전송" /><Arrow x1={124} y1={96} x2={154} y2={96} /><Box x={158} y={72} title="입력 rail" detail="주제·PII·탈옥 검사" active /><Arrow x1={270} y1={96} x2={299} y2={96} /><g><circle cx="323" cy="96" r="22" className="fill-primary/10 stroke-primary" /><text x="323" y="100" textAnchor="middle" className="fill-primary text-[9px] font-black">ALLOW</text></g><text x="180" y="153" textAnchor="middle" className="fill-muted-foreground text-[9px]">입력만 통과 · 응답과 실행은 아직 미검사</text></svg>;
}

function OutputScene() {
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="구조는 맞지만 비밀값이 섞인 응답을 수정하는 과정"><Defs /><Box x={9} y={61} w={104} title="모델 응답" detail="JSON + 비밀값" /><Arrow x1={113} y1={85} x2={137} y2={85} /><Box x={141} y={61} w={86} title="Schema" detail="PASS" /><Arrow x1={227} y1={85} x2={251} y2={85} /><Box x={255} y={61} w={96} title="출력 rail" detail="MODIFY" active /><text x="180" y="136" textAnchor="middle" className="fill-muted-foreground text-[9px]">body: “복구 완료 · sk-live-7A9”</text><path d="M86 149H274" className="stroke-border" /><text x="180" y="174" textAnchor="middle" className="fill-foreground text-[10px] font-bold">body: “복구 완료 · [비밀값 제거]”</text></svg>;
}

function ToolScene() {
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="도구 호출의 대상과 권한을 실행 직전에 검사하는 과정"><Defs /><Box x={10} y={68} w={105} title="send_message" detail="channel=#ops" /><Arrow x1={115} y1={92} x2={144} y2={92} /><Box x={148} y={68} w={105} title="도구 rail" detail="대상·권한·본문" active /><path d="M253 81H285V48H310" fill="none" className="stroke-muted-foreground" markerEnd="url(#guard-arrow)" /><path d="M253 103H285V138H310" fill="none" className="stroke-muted-foreground" markerEnd="url(#guard-arrow)" /><text x="318" y="43" textAnchor="middle" className="fill-primary text-[9px] font-black">허용</text><text x="318" y="58" textAnchor="middle" className="fill-muted-foreground text-[8px]">#ops</text><text x="318" y="134" textAnchor="middle" className="fill-foreground text-[9px] font-black">보류</text><text x="318" y="149" textAnchor="middle" className="fill-muted-foreground text-[8px]">외부 대상</text><text x="180" y="181" textAnchor="middle" className="fill-muted-foreground text-[9px]">애매하면 실행 대신 사람 승인 대기</text></svg>;
}

function ReceiptScene() {
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="검사된 메시지 한 건의 실행 영수증"><Defs /><Box x={12} y={71} title="검사된 호출" detail="send_message" /><Arrow x1={124} y1={95} x2={155} y2={95} /><Box x={159} y={71} title="내부 #ops" detail="메시지 1건 생성" active /><Arrow x1={271} y1={95} x2={299} y2={95} /><g><circle cx="326" cy="95" r="23" className="fill-primary/10 stroke-primary" /><text x="326" y="91" textAnchor="middle" className="fill-primary text-[8px] font-black">SENT</text><text x="326" y="104" textAnchor="middle" className="fill-muted-foreground text-[7px]">#184</text></g><text x="180" y="151" textAnchor="middle" className="fill-foreground text-[10px] font-bold">requestId=req-91 · messageId=184</text><text x="180" y="174" textAnchor="middle" className="fill-muted-foreground text-[9px]">모델의 주장 대신 실제 효과를 다시 조회할 식별자</text></svg>;
}

const DRAWINGS = [RequestScene, InputScene, OutputScene, ToolScene, ReceiptScene] as const;

export default function LlmGuardrailsAndOutputValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  const Drawing = DRAWINGS[scenes.active];
  return <VizFrame eyebrow="한 요청 · 세 검사 · 한 효과" title="입력 허용이 응답과 실행까지 승인하지는 않습니다" description="같은 장애 보고서 요청에서 새 상태가 생길 때마다 무엇을 다시 검사하는지 따라갑니다." note="메시지 번호와 비밀값은 메커니즘을 설명하기 위한 예시입니다. 특정 제품의 성능 측정값이 아닙니다.">
    <div id={scenes.playbackId} data-viz-canvas data-viz-scene="guardrail-request-lifecycle-viz" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="요청과 응답과 도구 호출을 각 단계에서 검사하고 실제 영수증을 확인하는 과정" onKeyDown={scenes.onKeyDown} className="flex h-auto min-h-0 min-w-0 flex-col overflow-visible outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(36rem,calc(100svh-10rem))] sm:min-h-[31rem] sm:overflow-y-auto">
      <div data-viz-live-only className="flex flex-none flex-col justify-center sm:min-h-0 sm:flex-1"><p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p><h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4><div className="mt-3 border-y border-border py-3"><Drawing /></div><p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[scenes.active]}</p></div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
      <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">{SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}</ol>
    </div>
  </VizFrame>;
}
