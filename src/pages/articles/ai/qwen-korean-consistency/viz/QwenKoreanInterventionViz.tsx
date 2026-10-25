import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["관측", "분류", "작은 개입", "출력층 후보", "재학습 후보", "같은 조건 비교", "배포·복귀"] as const;

const NOTES = [
  "같은 질문·모델·template·생성 설정에서 reasoning, 최종 답변, 번역 필드를 따로 저장합니다.",
  "계산 설명에 섞인 원치 않은 언어와 사용자가 요청한 ‘首尔’ 번역을 서로 다른 label로 기록합니다.",
  "가중치를 바꾸기 전에 기본 언어와 번역·인용 예외를 prompt에 적고, 명확한 실패만 runtime에서 검사합니다.",
  "표면 token 선택이 문제라면 Smoothie-Qwen 변환본을 별도 checkpoint로 만들어 원본과 비교합니다.",
  "reasoning 구간 전체의 정책이 반복해서 어긋나면 한국어 SFT와 reward 기반 학습을 별도 후보로 만듭니다.",
  "모든 후보에 같은 질문과 생성 조건을 사용해 원치 않은 전환·정답·정상 번역·지연·비용을 함께 측정합니다.",
  "기준을 통과한 가장 작은 개입만 일부 요청에 배포하고, 회귀가 보이면 이전 model·prompt·guard 조합으로 돌아갑니다.",
] as const;

const NODES = [
  { title: "고정 질문", detail: "9,600÷3 · 首尔", x: 18, y: 112, w: 92 },
  { title: "출력 구간", detail: "reasoning · final", x: 134, y: 48, w: 104 },
  { title: "오류·예외", detail: "의도까지 label", x: 134, y: 198, w: 104 },
  { title: "Prompt·Guard", detail: "요청 시점 정책", x: 272, y: 22, w: 112 },
  { title: "출력층 보정", detail: "별도 checkpoint", x: 272, y: 123, w: 112 },
  { title: "SFT·RL", detail: "policy update", x: 272, y: 224, w: 112 },
  { title: "짝지은 평가", detail: "개선·회귀·비용", x: 428, y: 112, w: 104 },
  { title: "일부 배포", detail: "승인·복귀 기준", x: 558, y: 112, w: 76 },
] as const;

const ACTIVE = [[0], [1, 2], [3], [4], [5], [6], [7]] as const;
const PATHS = [
  "M110 140L134 76",
  "M110 140L134 226",
  "M238 76L272 50",
  "M238 136H272",
  "M238 226L272 252",
  "M384 50L428 128",
  "M384 151H428",
  "M384 252L428 152",
  "M532 140H558",
] as const;

function Diagram({ active }: { active: number }) {
  const selected: readonly number[] = ACTIVE[active];
  return (
    <div role="img" aria-label="Qwen 한국어 출력 문제를 관측하고 분류한 뒤 세 개입 후보를 같은 조건에서 비교해 배포하는 흐름">
      <ol className="grid grid-cols-2 gap-1.5 sm:hidden">
        {NODES.map((node, index) => (
          <li
            key={node.title}
            className={`min-w-0 border p-2 ${selected.includes(index) ? "border-primary bg-primary/10" : index < active + 1 ? "border-foreground/35 bg-muted/45" : "border-border bg-background"}`}
          >
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-[11px] leading-4">{node.title}</strong>
            <span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground">{node.detail}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 border-l border-primary/45 pl-3 text-[10px] leading-4 text-muted-foreground sm:hidden">
        세 개입은 고정된 한 순서가 아닙니다. 각각 따로 비교할 수 있고, 이 묶음에서 읽는 RL 논문은 Smoothie 보정 모델 위에 SFT·RL을 추가한 조합 실험입니다.
      </p>

      <svg viewBox="0 0 652 310" className="mx-auto hidden h-auto w-full max-w-[41rem] sm:block" aria-hidden="true">
        <defs>
          <marker id="qwen-intervention-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L8 4L0 8Z" fill="currentColor" />
          </marker>
        </defs>
        {PATHS.map((path, index) => (
          <path
            key={path}
            d={path}
            fill="none"
            className={index < Math.min(active + 2, PATHS.length) ? "stroke-primary" : "stroke-border"}
            strokeWidth={index < Math.min(active + 2, PATHS.length) ? 1.25 : 1}
            markerEnd="url(#qwen-intervention-arrow)"
          />
        ))}
        {NODES.map((node, index) => {
          const isSelected = selected.includes(index);
          return (
            <g key={node.title}>
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height="56"
                rx="5"
                className={isSelected ? "fill-primary/10 stroke-primary" : index < active + 1 ? "fill-muted/55 stroke-foreground/35" : "fill-background stroke-border"}
                strokeWidth={isSelected ? 1.25 : 1}
              />
              <text x={node.x + node.w / 2} y={node.y + 22} textAnchor="middle" className="fill-foreground text-[9.5px] font-bold">{node.title}</text>
              <text x={node.x + node.w / 2} y={node.y + 41} textAnchor="middle" className="fill-muted-foreground text-[8px]">{node.detail}</text>
            </g>
          );
        })}
        <text x="328" y="297" textAnchor="middle" className="fill-muted-foreground text-[8.5px]">
          세 후보는 독립 비교·조합이 가능합니다 · 이 RL 논문은 Smoothie 보정 모델 위에 학습을 추가했습니다
        </text>
      </svg>
    </div>
  );
}

export default function QwenKoreanInterventionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  return (
    <VizFrame
      eyebrow="한 질문 · 세 개입 지점"
      title="먼저 실패를 구분한 뒤, 가장 작은 개입부터 같은 조건에서 비교합니다"
      description="9,600원을 나누고 ‘서울’을 중국어로 번역하는 한 질문을 끝까지 따라갑니다."
      note="설명용 판단 경로입니다. 논문 수치와 공개 checkpoint가 우리 서비스의 배포 결과를 보장하지 않으므로 실제 값은 별도 평가에서 측정합니다."
      canvasClassName="p-2 sm:p-7"
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="qwen-korean-intervention-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Qwen 한국어 출력 문제를 진단하고 개입을 선택하는 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex h-auto min-h-0 min-w-0 flex-col overflow-visible outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(39rem,calc(100svh-8rem))] sm:min-h-[33rem] sm:overflow-y-auto"
      >
        <div data-viz-live-only className="flex flex-none flex-col justify-center">
          <p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-3 border-y border-border py-3"><Diagram active={scenes.active} /></div>
          <p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{NOTES[scenes.active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="판단 흐름 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
