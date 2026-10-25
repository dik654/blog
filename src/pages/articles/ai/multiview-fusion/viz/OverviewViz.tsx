import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MultiviewMobileStageFlow from "../MultiviewMobileStageFlow";

const SCENES = ["파일 도착", "한 묶음 만들기", "누락 기록", "대상별 분리"] as const;
const NOTES = [
  "정면 RGB·깊이, 측면, 밑창, 위쪽 사진은 처음에는 서로 다른 파일입니다. 파일 이름만으로 같은 상품이라고 단정하지 않습니다.",
  "상품 식별자 shoe-017을 기준으로 네 관측을 한 묶음에 넣고, 판정값 ‘검수 필요’도 파일이 아니라 묶음 전체에 붙입니다.",
  "측면 카메라가 응답하지 않은 상태를 빈 이미지나 값 0으로 숨기지 않고 m_side=0과 촬영 상태로 남깁니다.",
  "shoe-017에서 나온 원본·센서값·파생 crop은 모두 검증 자료로 함께 이동합니다. 같은 상품이 학습과 검증에 동시에 들어가지 않습니다.",
] as const;
const STAGES = [
  { title: "관측 파일", detail: "서로 다른 카메라와 센서에서 따로 도착" },
  { title: "상품 묶음", detail: "shoe-017 하나의 입력으로 결합" },
  { title: "누락과 좌표", detail: "측면 없음·pose·시각을 명시" },
  { title: "대상별 분리", detail: "한 상품의 파생본은 같은 split으로" },
] as const;

function Stage({ index, active, title, children }: { index: number; active: number; title: string; children: ReactNode }) {
  const current = index === active;
  return (
    <li
      aria-current={current ? "step" : undefined}
      className={`min-w-0 border-t-2 px-3 py-4 transition-colors duration-300 ${
        index <= active ? "border-primary text-foreground" : "border-border text-muted-foreground"
      } ${current ? "bg-primary/8" : "bg-background"}`}
    >
      <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
      <strong className="mt-1 block break-keep text-xs leading-5">{title}</strong>
      <div className="mt-3 text-[11px] leading-5">{children}</div>
    </li>
  );
}

export default function OverviewViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="관측 묶음 만들기"
      title="따로 도착한 파일을 한 상품의 입력으로 묶습니다"
      description="재생하거나 장면을 골라 파일, 상품 식별자, 누락 상태, 학습·검증 분리가 차례로 생기는 과정을 봅니다."
      note="shoe-017과 판정값은 설명을 위한 가정입니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="multiview-episode-contract"
        tabIndex={0}
        role="group"
        aria-label="관측 파일을 한 상품 묶음으로 만들고 대상별로 분리하는 네 단계"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[20rem] flex-col justify-center sm:min-h-[22rem]">
          <p className="text-[11px] font-black text-primary">장면 · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MultiviewMobileStageFlow items={STAGES} active={step} ariaLabel="멀티뷰 관측 묶음의 네 단계" />
          <ol className="mt-6 hidden grid-cols-4 gap-px bg-border p-px sm:grid">
            <Stage index={0} active={step} title="관측 파일">
              <span className="block">front.rgb · front.depth</span>
              <span className="block">side.rgb · sole.rgb · top.rgb</span>
            </Stage>
            <Stage index={1} active={step} title="상품 묶음">
              <span className="block font-mono text-primary">object_id = shoe-017</span>
              <span className="block">label = 검수 필요</span>
            </Stage>
            <Stage index={2} active={step} title="누락과 좌표">
              <span className="block font-mono">m = [1, 0, 1, 1]</span>
              <span className="block">camera · pose · time</span>
            </Stage>
            <Stage index={3} active={step} title="대상별 분리">
              <span className="block font-semibold text-emerald-700 dark:text-emerald-300">shoe-017 → 검증</span>
              <span className="block">모든 파생본 함께 이동</span>
            </Stage>
          </ol>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
