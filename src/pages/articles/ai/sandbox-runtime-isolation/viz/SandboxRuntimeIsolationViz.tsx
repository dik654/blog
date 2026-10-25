import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["호출", "Seccomp", "gVisor", "Kata", "경계 비교"] as const;
const NOTES = [
  "같은 작업을 비교하기 위해 생성 코드가 openat(AT_FDCWD, \"/workspace/report-91.md\", O_RDONLY)를 호출한다고 고정합니다.",
  "Seccomp가 openat을 허용하면 호출은 공유 호스트 커널로 들어갑니다. 필터는 경로 문자열의 의미나 파일 권한을 대신 판정하지 않습니다.",
  "gVisor에서는 Sentry가 애플리케이션의 Linux 시스템 API를 구현합니다. 호스트 파일이 필요하면 구성에 따라 Gofer 같은 제한된 경로를 사용합니다.",
  "Kata에서는 워크로드의 openat을 VM 안 게스트 커널이 처리합니다. 호스트 파일과 장치는 VMM의 가상화 경계를 통과합니다.",
  "세 경로는 한 줄의 보안 등급이 아닙니다. 어느 커널이 처리하는지와 별개로 파일·통신·자격증명·자원 정책을 다시 확인해야 합니다.",
] as const;

function Defs() {
  return (
    <defs>
      <marker id="runtime-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0L8 4L0 8Z" fill="currentColor" />
      </marker>
    </defs>
  );
}

function Arrow({ x1, y1, x2, y2, dashed = false }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" strokeDasharray={dashed ? "4 4" : undefined} markerEnd="url(#runtime-arrow)" />;
}

function Box({ x, y, w = 108, title, detail, active = false }: { x: number; y: number; w?: number; title: string; detail: string; active?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="48" rx="4" className={active ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{title}</text>
      <text x={x + w / 2} y={y + 34} textAnchor="middle" className="fill-muted-foreground text-[8.5px]">{detail}</text>
    </g>
  );
}

function CallScene() {
  return (
    <svg viewBox="0 0 360 205" className="mx-auto h-[14rem] w-auto max-w-full sm:h-[19rem]" role="img" aria-label="생성 코드가 보고서 파일을 여는 openat 시스템 호출">
      <Defs />
      <text x="180" y="26" textAnchor="middle" className="fill-muted-foreground text-[9px]">생성 코드 · 동일한 비교 입력</text>
      <rect x="28" y="48" width="304" height="63" rx="4" className="fill-background stroke-foreground" />
      <text x="180" y="75" textAnchor="middle" className="fill-foreground text-[9px] font-bold">openat(AT_FDCWD,</text>
      <text x="180" y="94" textAnchor="middle" className="fill-foreground text-[9px] font-bold">“/workspace/report-91.md”, O_RDONLY)</text>
      <Arrow x1={180} y1={111} x2={180} y2={140} />
      <Box x={126} y={143} title="시스템 API 요청" detail="아직 파일을 읽지 않음" active />
    </svg>
  );
}

function SeccompScene() {
  return (
    <svg viewBox="0 0 360 205" className="mx-auto h-[14rem] w-auto max-w-full sm:h-[19rem]" role="img" aria-label="Seccomp가 openat 호출을 허용한 뒤 호스트 커널이 처리하는 경로">
      <Defs />
      <Box x={8} y={61} title="생성 코드" detail="openat 요청" />
      <Arrow x1={116} y1={85} x2={139} y2={85} />
      <Box x={143} y={61} w={82} title="Seccomp" detail="ALLOW" active />
      <Arrow x1={225} y1={85} x2={248} y2={85} />
      <Box x={252} y={61} w={100} title="호스트 커널" detail="호출 실제 처리" />
      <text x="184" y="138" textAnchor="middle" className="fill-foreground text-[9px] font-bold">필터가 보는 값 · 호출 번호와 인자</text>
      <text x="184" y="157" textAnchor="middle" className="fill-muted-foreground text-[8px]">파일 경로 허용 범위는 mount·DAC·LSM에서 별도 판정</text>
      <text x="184" y="180" textAnchor="middle" className="fill-primary text-[9px] font-black">커널 공유는 그대로</text>
    </svg>
  );
}

function GvisorScene() {
  return (
    <svg viewBox="0 0 360 205" className="mx-auto h-[14rem] w-auto max-w-full sm:h-[19rem]" role="img" aria-label="gVisor Sentry가 openat 시스템 API를 구현하는 경로">
      <Defs />
      <Box x={7} y={62} title="생성 코드" detail="openat 요청" />
      <Arrow x1={115} y1={86} x2={137} y2={86} />
      <Box x={141} y={62} w={95} title="Sentry" detail="Linux API 구현" active />
      <Arrow x1={236} y1={86} x2={258} y2={86} />
      <Box x={262} y={62} w={91} title="Gofer 등" detail="제한된 호스트 I/O" />
      <path d="M188 110V139H307" fill="none" className="stroke-muted-foreground" markerEnd="url(#runtime-arrow)" />
      <text x="307" y="135" textAnchor="middle" className="fill-muted-foreground text-[8px]">호스트 커널</text>
      <text x="180" y="171" textAnchor="middle" className="fill-foreground text-[9px] font-bold">애플리케이션 인자를 호스트 호출로 그대로 통과시키지 않음</text>
      <text x="180" y="190" textAnchor="middle" className="fill-muted-foreground text-[8px]">지원되지 않은 API는 호환성 실패가 될 수 있음</text>
    </svg>
  );
}

function KataScene() {
  return (
    <svg viewBox="0 0 360 205" className="mx-auto h-[14rem] w-auto max-w-full sm:h-[19rem]" role="img" aria-label="Kata의 게스트 커널과 VMM을 지나는 openat 처리 경로">
      <Defs />
      <Box x={7} y={62} title="생성 코드" detail="VM 안 openat" />
      <Arrow x1={115} y1={86} x2={137} y2={86} />
      <Box x={141} y={62} w={95} title="게스트 커널" detail="호출 실제 처리" active />
      <Arrow x1={236} y1={86} x2={258} y2={86} />
      <Box x={262} y={62} w={91} title="VMM" detail="가상 장치 경계" />
      <path d="M307 110V139H180" fill="none" className="stroke-muted-foreground" markerEnd="url(#runtime-arrow)" />
      <Box x={126} y={143} title="호스트" detail="hardware·backing I/O" />
      <text x="180" y="197" textAnchor="middle" className="fill-muted-foreground text-[8px]">별도 커널을 얻는 대신 VM 기동·메모리·장치 호환 조건이 생김</text>
    </svg>
  );
}

function CompareScene() {
  const rows = [
    ["Seccomp", "호스트 커널", "호출 허용·거부"],
    ["gVisor", "Sentry", "시스템 API 중개"],
    ["Kata", "게스트 커널", "VM 경계"],
  ];
  return (
    <svg viewBox="0 0 360 205" className="mx-auto h-[14rem] w-auto max-w-full sm:h-[19rem]" role="img" aria-label="Seccomp와 gVisor와 Kata의 처리 커널과 경계를 비교">
      <Defs />
      <text x="68" y="29" textAnchor="middle" className="fill-muted-foreground text-[8px]">경로</text>
      <text x="183" y="29" textAnchor="middle" className="fill-muted-foreground text-[8px]">호출을 처리하는 곳</text>
      <text x="300" y="29" textAnchor="middle" className="fill-muted-foreground text-[8px]">얻는 경계</text>
      {rows.map(([name, kernel, boundary], index) => {
        const y = 43 + index * 46;
        return <g key={name}><rect x="8" y={y} width="344" height="38" rx="3" className={index === 1 ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} /><text x="68" y={y + 23} textAnchor="middle" className="fill-foreground text-[9px] font-bold">{name}</text><text x="183" y={y + 23} textAnchor="middle" className="fill-foreground text-[9px]">{kernel}</text><text x="300" y={y + 23} textAnchor="middle" className="fill-muted-foreground text-[8px]">{boundary}</text></g>;
      })}
      <text x="180" y="192" textAnchor="middle" className="fill-foreground text-[9px] font-bold">파일·통신·자격증명·자원 정책은 세 경로 모두 별도</text>
    </svg>
  );
}

const DRAWINGS = [CallScene, SeccompScene, GvisorScene, KataScene, CompareScene] as const;

export default function SandboxRuntimeIsolationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  const Drawing = DRAWINGS[scenes.active];

  return (
    <VizFrame
      eyebrow="한 호출 · 세 실행 경로"
      title="같은 openat()을 누가 처리하는지가 달라집니다"
      description="호출을 고정한 뒤 Seccomp의 필터, gVisor의 Sentry, Kata의 게스트 커널을 한 단계씩 비교합니다."
      note="경로는 메커니즘 설명입니다. 실제 호환성·기동 시간·메모리 비용은 선택한 릴리스와 워크로드에서 측정해야 합니다."
      canvasClassName="p-3 sm:p-7"
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="sandbox-runtime-openat-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="같은 openat 시스템 호출이 Seccomp와 gVisor와 Kata에서 처리되는 경로"
        onKeyDown={scenes.onKeyDown}
        className="flex h-auto min-h-0 min-w-0 flex-col overflow-visible outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(36rem,calc(100svh-10rem))] sm:min-h-[31rem] sm:overflow-y-auto"
      >
        <div data-viz-live-only className="flex flex-none flex-col justify-center">
          <p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-3 border-y border-border py-3"><Drawing /></div>
          <p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[scenes.active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}
        </ol>
      </div>
    </VizFrame>
  );
}
