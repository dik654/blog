import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MobileStageFlow from "./MobileStageFlow";

/** 본문 대응: Overview.tsx — 한 요청이 후보와 배포 조건을 차례로 줄인다 */
const SCENES = ["요청 계약", "학습 신호", "같은 조건 실측", "배포 결정"] as const;
const NOTES = [
  "입력은 상품 사진, 출력은 같은 상품 ID의 순위입니다. 문장 검색과 픽셀 마스크는 이번 요청에 없습니다.",
  "자기지도와 이미지·텍스트 정렬 인코더는 남고, 마스크를 직접 내는 분할 시스템은 출력 종류가 달라 빠집니다.",
  "같은 상품의 촬영 변형, 다른 상품, 같은 전처리와 목표 장비를 고정해 후보 두 개를 비교합니다.",
  "과제 성능과 지연·메모리, 기존 벡터의 재색인 비용까지 통과한 후보를 선택하고 근거를 남깁니다.",
] as const;
const MOBILE_STAGES = [
  { title: "상품 사진 → 상품 순위", detail: "입력과 출력부터 고정" },
  { title: "후보 종류를 구분", detail: "인코더와 분할 시스템을 섞지 않음" },
  { title: "같은 조건으로 측정", detail: "정확도 · 견고성 · 지연 · 메모리" },
  { title: "교체 비용까지 결정", detail: "재색인과 임계값 재조정 포함" },
] as const;

const PRIMARY = "#6366f1";
const SECONDARY = "#10b981";
const WARN = "#f59e0b";
const MUTED = "#94a3b8";

export default function AxesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="선택 전체 경로"
      title="요청 한 건이 후보와 비용을 차례로 좁힙니다"
      description="재생하거나 장면을 골라 상품 사진 요청이 기술 선택으로 바뀌는 순서를 따라갑니다."
      note="이 흐름은 선택 절차이며 특정 모델의 우위를 주장하지 않습니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="vision-backbone-selection-path"
        tabIndex={0}
        role="group"
        aria-label="상품 사진 요청에서 백본 선택까지의 네 단계"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[18rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MobileStageFlow items={MOBILE_STAGES} active={step} ariaLabel="백본 선택의 네 단계" />
          <svg viewBox="0 0 480 200" className="mt-4 hidden w-full max-w-2xl sm:block">
            <defs>
              <marker id="selection-path-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={MUTED} />
              </marker>
            </defs>
            {[
              { x: 12, w: 102, color: PRIMARY, title: "요청 계약", detail: "사진 → 상품 순위" },
              { x: 132, w: 102, color: SECONDARY, title: "후보 종류", detail: "학습 신호·출력" },
              { x: 252, w: 102, color: WARN, title: "고정 실측", detail: "같은 데이터·설정" },
              { x: 372, w: 96, color: PRIMARY, title: "배포 결정", detail: "비용·교체" },
            ].map((item, index) => (
              <g key={item.title} opacity={index <= step ? 1 : 0.18}>
                <rect x={item.x} y={64} width={item.w} height={66} fill={item.color} fillOpacity={index === step ? 0.15 : 0.06} stroke={item.color} strokeWidth={index === step ? 1.5 : 1} />
                <text x={item.x + item.w / 2} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill={item.color}>{item.title}</text>
                <text x={item.x + item.w / 2} y={108} textAnchor="middle" fontSize={8} fill={MUTED}>{item.detail}</text>
                {index < 3 && <line x1={item.x + item.w} y1={97} x2={item.x + item.w + 14} y2={97} stroke={MUTED} strokeWidth={1} markerEnd="url(#selection-path-arrow)" />}
              </g>
            ))}
            <text x={12} y={32} fontSize={9} fill={MUTED}>같은 요청을 끝까지 유지해야 비교 기준이 바뀌지 않습니다</text>
            <text x={12} y={172} fontSize={9} fontWeight={700} fill={step === 3 ? SECONDARY : MUTED}>
              {step === 3 ? "선택 결과와 뒤집힐 조건을 함께 기록" : "현재 단계가 다음 단계의 입력을 확정"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
