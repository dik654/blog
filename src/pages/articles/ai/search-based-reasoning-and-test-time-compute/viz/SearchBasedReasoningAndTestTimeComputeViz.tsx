import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["문제·예산", "병렬 후보", "중간 가지치기", "피드백 수정", "선택 기준"] as const;
const NOTES = [
  "숫자 4·7·8·8로 24를 만드는 문제와 생성 8회 예산을 고정합니다. 추가 연산은 아직 답도, 전략도 아닙니다.",
  "Best-of-8은 최종 답 여덟 개를 서로 독립적으로 만든 뒤 verifier가 최고 점수 하나를 고릅니다. 후보끼리는 중간 정보를 나누지 않습니다.",
  "Tree search는 중간식의 점수를 보고 낮은 가지를 일찍 버립니다. 같은 8회라도 다음 생성을 유망한 상태에 집중할 수 있습니다.",
  "Revision은 앞선 답을 다음 입력에 넣어 고칩니다. 다만 ‘틀렸다’는 외부 신호 없이 모델의 자기평가만 따르면 맞던 답도 뒤집힐 수 있습니다.",
  "문제 난도·예산·verifier가 볼 수 있는 범위를 먼저 확인합니다. 생성 횟수만 비교하면 어느 전략이 왜 이겼는지 설명할 수 없습니다.",
] as const;

function Arrow({ x1, y1, x2, y2, dashed = false }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" strokeDasharray={dashed ? "4 4" : undefined} markerEnd="url(#search-arrow)" />;
}

function Label({ x, y, title, detail, active = false }: { x: number; y: number; title: string; detail?: string; active?: boolean }) {
  return <g><rect x={x} y={y} width="92" height={detail ? "44" : "30"} rx="4" className={active ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} strokeWidth="1" /><text x={x + 46} y={y + 17} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{title}</text>{detail && <text x={x + 46} y={y + 32} textAnchor="middle" className="fill-muted-foreground text-[8px]">{detail}</text>}</g>;
}

function Defs() {
  return <defs><marker id="search-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor" /></marker></defs>;
}

function BudgetScene() {
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="같은 문제와 생성 8회 예산"><Defs /><text x="180" y="24" textAnchor="middle" className="fill-muted-foreground text-[9px]">설명용 문제</text><text x="180" y="52" textAnchor="middle" className="fill-foreground text-[20px] font-black">4 · 7 · 8 · 8 → 24</text><path d="M50 90H310" className="stroke-border" strokeWidth="1" />{Array.from({ length: 8 }, (_, index) => <g key={index}><circle cx={61 + index * 34} cy="118" r="11" className="fill-background stroke-muted-foreground" /><text x={61 + index * 34} y="121" textAnchor="middle" className="fill-foreground text-[8px] font-bold">{index + 1}</text></g>)}<text x="180" y="154" textAnchor="middle" className="fill-foreground text-[11px] font-bold">생성 예산 8회</text><text x="180" y="176" textAnchor="middle" className="fill-muted-foreground text-[9px]">같은 예산 · 다른 배치 방법 · 다른 결과</text></svg>;
}

function ParallelScene() {
  const candidates = ["24 ✓", "28", "16", "4", "15", "32", "23", "1"];
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="여덟 후보를 병렬 생성하고 하나를 고르는 과정"><Defs /><Label x={8} y={75} title="문제" detail="4·7·8·8" /><Arrow x1={100} y1={97} x2={125} y2={97} />{candidates.map((value, index) => { const column = index % 4; const row = Math.floor(index / 4); const x = 130 + column * 48; const y = 54 + row * 54; return <g key={`${value}-${index}`}><circle cx={x} cy={y} r="16" className={index === 0 ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} /><text x={x} y={y + 3} textAnchor="middle" className="fill-foreground text-[8px] font-bold">{value}</text></g>; })}<Arrow x1={294} y1={81} x2={318} y2={81} /><text x="330" y="70" textAnchor="middle" className="fill-muted-foreground text-[8px]">검증</text><text x="330" y="91" textAnchor="middle" className="fill-primary text-[10px] font-black">0.95</text><text x="180" y="174" textAnchor="middle" className="fill-muted-foreground text-[9px]">8개를 끝까지 생성한 뒤 최고 점수 하나를 선택</text></svg>;
}

function TreeScene() {
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="중간 상태를 평가하고 가지치기하는 과정"><Defs /><circle cx="180" cy="24" r="13" className="fill-background stroke-foreground" /><text x="180" y="27" textAnchor="middle" className="fill-foreground text-[8px] font-bold">시작</text>{[80, 180, 280].map((x, index) => <g key={x}><line x1="180" y1="37" x2={x} y2="66" className={index === 2 ? "stroke-border" : "stroke-muted-foreground"} strokeDasharray={index === 2 ? "4 4" : undefined} /><circle cx={x} cy="78" r="17" className={index === 2 ? "fill-background stroke-border" : "fill-background stroke-muted-foreground"} /><text x={x} y="76" textAnchor="middle" className="fill-foreground text-[8px] font-bold">{["7−1", "8−4", "7+8"][index]}</text><text x={x} y="91" textAnchor="middle" className="fill-muted-foreground text-[8px]">{[".82", ".61", ".12"][index]}</text></g>)}{[45, 115].map((x) => <line key={x} x1="80" y1="95" x2={x} y2="132" className="stroke-muted-foreground" />)}{[150, 210].map((x) => <line key={x} x1="180" y1="95" x2={x} y2="132" className="stroke-muted-foreground" />)}{[45, 115, 150, 210].map((x, index) => <g key={x}><circle cx={x} cy="145" r="14" className={index === 0 ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} /><text x={x} y="148" textAnchor="middle" className="fill-foreground text-[8px] font-bold">{["24 ✓", "12", "16", "4"][index]}</text></g>)}<text x="282" y="134" textAnchor="middle" className="fill-muted-foreground text-[8px]">낮은 점수 가지는</text><text x="282" y="148" textAnchor="middle" className="fill-muted-foreground text-[8px]">다음 생성 전에 중지</text><text x="180" y="184" textAnchor="middle" className="fill-muted-foreground text-[9px]">평가 → 상위 상태 유지 → 남은 예산을 다시 배분</text></svg>;
}

function RevisionScene() {
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="외부 검증 신호로 답을 수정하는 과정"><Defs /><Label x={8} y={70} title="답 1" detail="(8−4)×(8−7)=4" /><Arrow x1={100} y1={92} x2={127} y2={92} /><Label x={133} y={70} title="외부 검사" detail="4 ≠ 24" active /><Arrow x1={225} y1={92} x2={252} y2={92} /><Label x={258} y={70} title="답 2" detail="(7−8÷8)×4=24" active /><path d="M304 118C304 164 180 169 180 124" fill="none" className="stroke-muted-foreground" strokeDasharray="4 4" markerEnd="url(#search-arrow)" /><text x="180" y="183" textAnchor="middle" className="fill-muted-foreground text-[9px]">수정 방향은 ‘틀림’이라는 독립 신호가 정함</text></svg>;
}

function DecisionScene() {
  return <svg viewBox="0 0 360 205" className="mx-auto h-[12.5rem] w-auto max-w-full" role="img" aria-label="검증 신호에 따라 탐색 전략을 고르는 기준"><Defs /><text x="180" y="20" textAnchor="middle" className="fill-foreground text-[11px] font-black">verifier는 언제 판단할 수 있습니까?</text><path d="M180 32V57M180 57H67V78M180 57V78M180 57H293V78" fill="none" className="stroke-muted-foreground" /><Label x={21} y={78} title="최종 답만" detail="Best-of-N" /><Label x={134} y={78} title="중간 상태도" detail="Tree search" active /><Label x={247} y={78} title="오류 피드백" detail="Revision" /><text x="67" y="145" textAnchor="middle" className="fill-muted-foreground text-[8px]">병렬 후보 뒤 선택</text><text x="180" y="145" textAnchor="middle" className="fill-muted-foreground text-[8px]">일찍 가지치기</text><text x="293" y="145" textAnchor="middle" className="fill-muted-foreground text-[8px]">앞 답을 고쳐 재사용</text><path d="M45 166H315" className="stroke-border" /><text x="180" y="188" textAnchor="middle" className="fill-foreground text-[9px] font-bold">같은 문제 · 같은 예산 · 같은 verifier로 비교해야 합니다</text></svg>;
}

const DRAWINGS = [BudgetScene, ParallelScene, TreeScene, RevisionScene, DecisionScene] as const;

export default function SearchBasedReasoningAndTestTimeComputeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  const Drawing = DRAWINGS[scenes.active];
  return <VizFrame eyebrow="한 문제 · 생성 예산 8회" title="후보를 언제 평가하느냐가 탐색 경로를 바꿉니다" description="4·7·8·8로 24를 만드는 같은 문제를 병렬 생성·중간 가지치기·수정으로 비교합니다." note="문제와 수치는 메커니즘을 설명하기 위한 예시입니다. 논문 성능 수치는 아래 원문 근거에 따로 귀속합니다.">
    <div id={scenes.playbackId} data-viz-canvas data-viz-scene="search-budget-strategy-viz" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="같은 생성 예산을 병렬 후보와 중간 가지치기와 피드백 수정에 배분하는 과정" onKeyDown={scenes.onKeyDown} className="flex h-[min(33rem,calc(100svh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div data-viz-live-only className="flex min-h-0 flex-1 flex-col justify-center"><p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p><h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4><div className="mt-3 border-y border-border py-3"><Drawing /></div><p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[scenes.active]}</p></div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
      <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">{SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}</ol>
    </div>
  </VizFrame>;
}
