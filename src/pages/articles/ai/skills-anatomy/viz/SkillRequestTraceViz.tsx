import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["요청", "후보 선택", "지침 읽기", "자료 확장", "권한 확인", "결과 검증"] as const;
const NOTES = [
  "사용자는 ‘이 PR에서 실패한 CI를 고치고 검증 결과를 보고해 주세요’라고 요청합니다. 아직 어떤 Skill도 선택되지 않았고 파일이나 외부 서비스도 바뀌지 않았습니다.",
  "실행 환경은 사용할 수 있는 Skill의 name·description·path를 보여줍니다. 요청과 적용 조건이 맞는 gh-fix-ci가 후보로 선택되지만, 이 metadata만으로 작업하지는 않습니다.",
  "선택된 Skill의 SKILL.md 전체를 읽어 재현→최소 수정→재검증→보고 순서를 얻습니다. 이 지침은 system 권한이 아니라 사용자 입력과 같은 우선순위의 작업 지식입니다.",
  "실패 원인을 확인할 때 references/ci-policy.md와 scripts/reproduce.sh만 엽니다. 설치된 모든 참고 파일을 한꺼번에 context에 넣지 않습니다.",
  "Skill은 shell이나 GitHub 권한을 새로 만들지 않습니다. 실행 환경이 현재 workspace와 허용된 tool 범위를 확인하며, 요청하지 않은 push는 시작하지 않습니다.",
  "한 파일을 수정하고 실패한 검사와 관련 회귀 검사를 다시 실행합니다. exit 0·변경 파일·남은 위험을 결과로 남겨야 작업 완료를 주장할 수 있습니다.",
] as const;

const NODES = [
  { title: "사용자 요청", detail: "CI 수정·검증", x: 20, y: 118, w: 96 },
  { title: "후보 목록", detail: "이름·설명·경로", x: 138, y: 44, w: 104 },
  { title: "SKILL.md", detail: "전체 작업 순서", x: 268, y: 44, w: 104 },
  { title: "필요한 자료", detail: "정책·재현 script", x: 398, y: 44, w: 108 },
  { title: "실행 환경", detail: "권한·승인·sandbox", x: 524, y: 118, w: 96 },
  { title: "도구 실행", detail: "log·edit·test", x: 398, y: 228, w: 108 },
  { title: "검증 결과", detail: "exit 0·diff·위험", x: 268, y: 228, w: 104 },
] as const;

const PATHS = [
  "M116 145L138 82",
  "M242 71H268",
  "M372 71H398",
  "M506 82L524 145",
  "M572 172L506 255",
  "M398 255H372",
] as const;

function FlowDiagram({ active }: { active: number }) {
  const activeNode = active === 5 ? 6 : active;
  return (
    <div role="img" aria-label="CI 수정 요청이 Skill 발견과 로딩, 권한 확인, 도구 실행, 결과 검증을 거치는 경로">
      <ol className="grid grid-cols-3 gap-1.5 sm:hidden">
        {NODES.map((node, index) => {
          const selected = index === activeNode || (active === 5 && index === 5);
          const passed = index < activeNode;
          return <li key={node.title} className={`min-w-0 border p-2 ${selected ? "border-primary bg-primary/10" : passed ? "border-foreground/40 bg-muted/50" : "border-border bg-background"}`}>
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-[11px] leading-4">{node.title}</strong>
            <span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground">{node.detail}</span>
          </li>;
        })}
      </ol>
      <svg viewBox="0 0 640 320" className="mx-auto hidden h-auto w-full max-w-[40rem] sm:block" aria-hidden="true">
      <defs>
        <marker id="skill-trace-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor" /></marker>
      </defs>
      {PATHS.map((path, index) => <path key={path} d={path} fill="none" className={index < active ? "stroke-primary" : "stroke-border"} strokeWidth={index < active ? 2 : 1.2} markerEnd="url(#skill-trace-arrow)" />)}
      {NODES.map((node, index) => {
        const selected = index === activeNode || (active === 5 && index === 5);
        const passed = index < activeNode;
        return <g key={node.title}>
          <rect x={node.x} y={node.y} width={node.w} height="54" rx="5" className={selected ? "fill-primary/10 stroke-primary" : passed ? "fill-muted/55 stroke-foreground/40" : "fill-background stroke-border"} strokeWidth={selected ? 1.8 : 1.1} />
          <text x={node.x + node.w / 2} y={node.y + 21} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{node.title}</text>
          <text x={node.x + node.w / 2} y={node.y + 39} textAnchor="middle" className="fill-muted-foreground text-[8.5px]">{node.detail}</text>
        </g>;
      })}
      <circle cx={active === 0 ? 116 : active === 1 ? 242 : active === 2 ? 372 : active === 3 ? 506 : active === 4 ? 506 : 372} cy={active === 0 ? 145 : active <= 2 ? 71 : active === 3 ? 82 : 255} r="4" className="fill-primary" />
      <text x="320" y="301" textAnchor="middle" className="fill-muted-foreground text-[9px]">Skill은 경로를 안내하고 · 실행 환경은 권한을 판정하고 · 도구는 실제 효과를 만듭니다</text>
      </svg>
    </div>
  );
}

export default function SkillRequestTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  return (
    <VizFrame eyebrow="한 요청 · 세 책임" title="작업 지식은 필요한 순간에 펼치고, 실행 권한은 그대로 둡니다" description="CI 수정 요청 하나가 후보 metadata에서 검증 결과까지 이동하는 과정을 따라갑니다." note="OpenAI의 2026-10-25 공식 문서에 맞춘 개념도입니다. 실제 후보 선택과 도구 권한은 사용하는 제품·실행 환경에 따라 달라집니다." canvasClassName="p-3 sm:p-7">
      <div id={scenes.playbackId} data-viz-canvas data-viz-scene="skill-request-trace-viz" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="CI 수정 요청이 Skill을 거쳐 실행되고 검증되는 과정" onKeyDown={scenes.onKeyDown} className="flex h-auto min-h-0 min-w-0 flex-col overflow-visible outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(39rem,calc(100svh-8rem))] sm:min-h-[33rem] sm:overflow-y-auto">
        <div data-viz-live-only className="flex flex-none flex-col justify-center">
          <p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-3 border-y border-border py-3"><FlowDiagram active={scenes.active} /></div>
          <p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[scenes.active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="순서대로 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">{SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}</ol>
      </div>
    </VizFrame>
  );
}
