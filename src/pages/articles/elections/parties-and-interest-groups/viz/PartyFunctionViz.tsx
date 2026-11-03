import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "후보별로 보면 48칸이다",
  "정당별로 보면 12칸이다",
  "정당 이름은 세 표지가 된다",
  "운송 면허는 묶음 밖에 남는다",
] as const;

const CONTROL_LABELS = ["48칸", "12칸", "세 표지", "빠진 쟁점"] as const;

const NOTES = [
  "후보 12명×쟁점 4개=48칸입니다. 아직 아무것도 묶지 않은 장부입니다.",
  "세 정당이 공약을 함께 쓰면 3곳×쟁점 4개=12칸을 먼저 비교합니다.",
  "공약과 행동이 잘 맞는다면 정당 이름 세 개가 더 짧은 판단 표지가 됩니다.",
  "압축에는 삭제가 붙습니다. 면허가 핵심 공약에서 빠지면 그 선호만 따로 표시할 수 없습니다.",
] as const;

const ISSUES = ["교통비", "주차", "도로 예산", "운송 면허"] as const;
const PARTIES = [
  { name: "가당", tone: "border-sky-400/70 bg-sky-500/10" },
  { name: "나당", tone: "border-amber-400/70 bg-amber-500/10" },
  { name: "다당", tone: "border-emerald-400/70 bg-emerald-500/10" },
] as const;

function CandidateGrid() {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className="flex h-10 items-center justify-center border border-border bg-background text-xs font-bold tabular-nums sm:h-16"
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

function PartyColumns({ labelsOnly = false }: { labelsOnly?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {PARTIES.map((party, partyIndex) => (
        <div key={party.name} className={`border p-2 sm:p-3 ${party.tone}`}>
          <p className="text-center text-sm font-bold">{party.name}</p>
          {!labelsOnly && (
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {Array.from({ length: 4 }, (_, index) => (
                <span
                  key={index}
                  className="flex min-h-8 items-center justify-center border border-border/70 bg-background/80 text-[11px] tabular-nums sm:min-h-9 sm:text-xs"
                >
                  후보 {partyIndex * 4 + index + 1}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PartyFunctionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });
  const step = scenes.active;

  return (
    <VizFrame
      className="mobile-viz-stable-height"
      eyebrow="한 선거의 압축 장부"
      title="48칸이 12칸과 세 이름으로 줄지만, 면허 쟁점은 빠집니다"
      description="같은 후보와 쟁점을 한 단계씩 압축합니다."
      note="설명을 연결하기 위한 가상 사례입니다. 실제 정당 안에서는 후보의 입장이 갈릴 수 있고 쟁점도 여러 축에 놓일 수 있습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="열두 후보의 48개 확인 칸이 세 정당으로 압축되고 운송 면허가 빠지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-full min-w-0 flex-col overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <p className="text-[11px] font-black text-primary">
            장면 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 break-keep text-lg font-bold">{SCENES[step]}</h4>

          <div className="mt-3 sm:mt-5">
            {step === 0 && (
              <div>
                <CandidateGrid />
                <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-xs sm:mt-4">
                  {ISSUES.map((issue) => (
                    <div
                      key={issue}
                      className="border border-border py-1.5 sm:py-2"
                    >
                      {issue}
                    </div>
                  ))}
                </div>
                <p className="mt-3 border-y border-border py-2 text-center text-2xl font-black tabular-nums sm:mt-5 sm:py-4">
                  12명 × 4개 = 48칸
                </p>
              </div>
            )}

            {step === 1 && (
              <div>
                <PartyColumns />
                <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-xs sm:mt-4">
                  {ISSUES.map((issue) => (
                    <div
                      key={issue}
                      className="border border-border py-1.5 sm:py-2"
                    >
                      {issue}
                    </div>
                  ))}
                </div>
                <p className="mt-3 border-y border-border py-2 text-center text-2xl font-black tabular-nums sm:mt-5 sm:py-4">
                  3곳 × 4개 = 12칸
                </p>
              </div>
            )}

            {step === 2 && (
              <div>
                <PartyColumns labelsOnly />
                <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="border-y border-border py-4 text-center">
                    <p className="text-xs text-muted-foreground">공약 묶음</p>
                    <p className="mt-1 font-bold">12칸</p>
                  </div>
                  <span aria-hidden="true" className="text-muted-foreground">
                    →
                  </span>
                  <div className="border-y border-border py-4 text-center">
                    <p className="text-xs text-muted-foreground">정당 이름</p>
                    <p className="mt-1 font-bold">세 표지</p>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-7 text-muted-foreground">
                  이 단축은 이름이 실제 공약과 행동을 잘 예고할 때만 쓸
                  만합니다.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                {ISSUES.map((issue, index) => {
                  const omitted = index === ISSUES.length - 1;
                  return (
                    <div
                      key={issue}
                      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border px-3 py-2 sm:px-4 sm:py-3 ${
                        omitted
                          ? "border-amber-500 border-dashed bg-amber-500/10"
                          : "border-border bg-background"
                      }`}
                    >
                      <strong>{issue}</strong>
                      <span
                        className={`text-xs font-bold ${
                          omitted
                            ? "text-amber-700 dark:text-amber-300"
                            : "text-muted-foreground"
                        }`}
                      >
                        {omitted ? "핵심 공약 밖" : "세 묶음 안"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="mt-3 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:mt-5 sm:leading-7">
            {NOTES[step]}
          </p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={CONTROL_LABELS}
          playLabel="압축 과정 재생"
        />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
