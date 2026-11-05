import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "국내 계약에는 마지막 집행자가 있습니다",
  "국가 사이에는 그 자리가 비어 있습니다",
  "그래서 각자 대비하고 서로 더 불안해집니다",
  "협력에는 세 조건이 남습니다",
] as const;

const NOTES = [
  "국내에서는 법원이 다툼을 판정하고 국가가 판결을 집행합니다. 당사자가 싫다고 해도 작동하는 마지막 자리가 있습니다.",
  "A국과 B국 위에는 같은 방식의 세계 정부가 없습니다. 재판과 중재가 있어도 관할과 대응은 국가의 동의와 선택에 기대므로, 각국이 최악의 경우를 직접 대비합니다.",
  "A국의 방어용 순찰선은 B국의 눈에는 항로를 막을 능력입니다. B국도 늘리면 양쪽 모두 비용을 더 쓰고도 상대 전력이 커져 더 불안해집니다.",
  "그래도 협력은 가능합니다. 위반을 볼 수 있고, 대응할 수 있으며, 앞으로의 협력 가치가 한 번의 배신 이익보다 커야 합니다.",
] as const;

function Actor({ children, tone }: { children: ReactNode; tone: "blue" | "amber" }) {
  const color =
    tone === "blue"
      ? "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100"
      : "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100";
  return (
    <div className={"flex min-h-16 items-center justify-center rounded-xl border px-3 text-center text-sm font-bold " + color}>
      {children}
    </div>
  );
}

export default function AnarchyStructureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const step = scenes.active;

  return (
    <VizFrame
      documentFlow
      eyebrow="먼저 볼 질문"
      title="국내 계약과 국가 간 약속은 어디에서 갈라질까요?"
      description="두 당사자 위에서 판정하고 집행하는 마지막 자리가 있는지만 먼저 보세요."
      note="해협과 수치는 설명용 가상 사례입니다. 국제 제도 자체가 없다는 뜻이 아니라, 국내 정부와 같은 자동적인 최종 집행자가 없다는 비교입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="최종 집행자가 있을 때와 없을 때의 선택 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-[32rem] min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary md:min-h-[27rem]"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="text-[11px] font-black text-primary">
            장면 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-5 flex flex-1 flex-col justify-center">
            {step === 0 && (
              <div className="mx-auto w-full max-w-xl">
                <div className="mx-auto max-w-xs rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-center dark:border-emerald-800 dark:bg-emerald-950/40">
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                    법원 판정 + 국가 집행
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">싫어도 따르게 하는 마지막 자리</p>
                </div>
                <div className="py-2 text-center text-lg text-emerald-600" aria-hidden="true">↓</div>
                <div className="grid grid-cols-2 gap-3">
                  <Actor tone="blue">계약 당사자 A</Actor>
                  <Actor tone="amber">계약 당사자 B</Actor>
                </div>
                <p className="mt-4 rounded-lg bg-muted/60 p-3 text-center text-sm leading-6">
                  해석이 다르면 법원이 끝내고, 위반하면 국가가 집행합니다.
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="mx-auto w-full max-w-xl">
                <div className="mx-auto max-w-xs rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-3 text-center dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-sm font-bold text-muted-foreground">자동적인 최종 집행자 없음</p>
                  <p className="mt-1 text-xs text-muted-foreground">판정과 대응이 국가의 동의·선택에 기대는 자리</p>
                </div>
                <div className="py-2 text-center text-lg text-slate-400" aria-hidden="true">↓</div>
                <div className="grid grid-cols-2 gap-3">
                  <Actor tone="blue">해협의 A국</Actor>
                  <Actor tone="amber">해협의 B국</Actor>
                </div>
                <p className="mt-4 rounded-lg bg-rose-50 p-3 text-center text-sm leading-6 text-rose-900 dark:bg-rose-950/30 dark:text-rose-100">
                  최악의 경우를 각자 대비합니다. 이것이 자력구제입니다.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <Actor tone="blue">
                  A국
                  <br />
                  방어용 순찰선 +2
                </Actor>
                <div className="text-center text-xs font-bold text-rose-600">
                  <span className="hidden sm:inline">위협으로 읽음 ⇄</span>
                  <span className="sm:hidden">↓ 위협으로 읽고 대응 ↓</span>
                </div>
                <Actor tone="amber">
                  B국
                  <br />
                  대응 순찰선 +2
                </Actor>
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-sm leading-6 text-rose-900 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100 sm:col-span-3">
                  둘 다 더 지출 · 상대 전력도 증가 · 둘 다 더 불안
                  <br />
                  <strong>악의가 없어도 생기는 안보 딜레마</strong>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-3">
                {[
                  ["1", "위반을 볼 수 있음", "공동 위치 기록·검증"],
                  ["2", "대응할 수 있음", "항만 협력 중단·자체 대비"],
                  ["3", "미래가 더 큼", "반복되는 협력의 가치"],
                ].map(([number, title, detail]) => (
                  <div key={number} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">조건 {number}</p>
                    <p className="mt-2 text-sm font-bold">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
                  </div>
                ))}
                <p className="rounded-xl bg-muted/60 p-3 text-center text-sm font-semibold leading-6 sm:col-span-3">
                  세 조건이 모이면 강제 없이도 약속을 지키는 편이 유리해질 수 있습니다.
                </p>
              </div>
            )}
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
