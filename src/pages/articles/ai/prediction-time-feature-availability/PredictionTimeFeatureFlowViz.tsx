import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    code: "요청",
    title: "환자 p-17의 위험도를 10시에 예측합니다",
    note: "설명용 가정입니다. 입력 마감은 10:00이고, 같은 시각의 기록은 로그 위치 8420까지 반영한다는 규칙을 함께 고정합니다.",
  },
  {
    code: "도착",
    title: "사건 시각과 시스템 도착 시각을 따로 봅니다",
    note: "활력 기록은 09:40에 발생해 09:42에 도착했습니다. 검사는 09:50에 시행됐지만 10:20에 확정됐으므로 10시 예측에는 아직 없던 정보입니다.",
  },
  {
    code: "판정",
    title: "의존 기록 중 하나라도 늦으면 그 집계값을 그대로 쓸 수 없습니다",
    note: "recent_risk가 활력과 검사 결과를 모두 요구한다면 완성 시각은 10:20입니다. 사전에 정의한 missing-v3 대체 경로가 있을 때만 검사 누락 표시와 함께 다시 계산합니다.",
  },
  {
    code: "재현",
    title: "선택된 값과 제외된 값의 이유를 같은 판정 기록에 남깁니다",
    note: "예측 입력에는 활력 기록과 검사 누락 표시만 들어갑니다. 원본 식별자, 두 시각, 결합·집계·누락 대체 규칙의 버전과 입력 마감 위치를 남겨야 같은 입력을 다시 만들 수 있습니다.",
  },
] as const;

const records = [
  {
    id: "r-vital-31",
    name: "활력",
    event: "09:40",
    available: "09:42",
    allowed: true,
  },
  {
    id: "r-lab-88",
    name: "검사",
    event: "09:50",
    available: "10:20",
    allowed: false,
  },
] as const;

export default function PredictionTimeFeatureFlowViz() {
  const labels = scenes.map((scene) => scene.title);
  const notes = scenes.map((scene) => scene.note);
  const controls = useAnimatedScenes(scenes.length, 6500, {
    autoPlay: false,
    loop: false,
  });
  const active = controls.reducedMotion ? scenes.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow="한 예측 추적"
      title="10시 입력에서 늦게 도착한 검사 결과를 뺍니다"
      description="환자 한 명의 예측 요청을 따라가며 사건 시각, 도착 시각, 입력 판정, 재현 기록을 구분합니다. 사람·기록 식별자와 시각은 설명용 가정입니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="prediction-time-feature-flow"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="flex h-full min-h-0 min-w-0 flex-col border-y border-border/70 bg-background px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6 sm:py-5"
      >
        <div
          data-viz-live-only
          className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]"
        >
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">
            장면 · {String(active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 min-h-14 break-keep text-lg font-bold leading-7 sm:min-h-8">
            {scenes[active].title}
          </h3>

          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.38fr)_minmax(0,.9fr)] lg:items-stretch">
            <section
              className={`${active === 0 ? "block" : "hidden"} border-y border-border py-4 lg:block`}
            >
              <p className="text-[10px] font-black text-muted-foreground">
                예측 요청 · pred-204
              </p>
              <p className="mt-2 break-keep text-sm font-bold leading-6">
                환자 p-17 · 위험도 계산
              </p>
              <dl className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between gap-3 border-b border-border pb-2">
                  <dt className="text-muted-foreground">입력 마감</dt>
                  <dd className="font-mono font-bold">10:00</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-border pb-2">
                  <dt className="text-muted-foreground">반영 위치</dt>
                  <dd className="font-mono font-bold">로그 8420</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">시간대</dt>
                  <dd className="font-mono font-bold">Asia/Seoul</dd>
                </div>
              </dl>
            </section>

            <section
              className={`${active === 1 || active === 2 ? "block" : "hidden"} border-y border-border py-2 lg:block`}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_3.2rem_3.2rem_3.2rem] gap-2 border-b border-border py-2 text-[9px] font-black text-muted-foreground">
                <span>원본 기록</span>
                <span>사건</span>
                <span>도착</span>
                <span>10시</span>
              </div>
              {records.map((record) => {
                const decided = active >= 2;
                return (
                  <div
                    key={record.id}
                    className="grid grid-cols-[minmax(0,1fr)_3.2rem_3.2rem_3.2rem] items-center gap-2 border-b border-border py-3 last:border-b-0"
                  >
                    <span className="min-w-0">
                      <strong className="block break-keep text-xs">{record.name}</strong>
                      <span className="block break-all font-mono text-[9px] text-muted-foreground">
                        {record.id}
                      </span>
                    </span>
                    <span className="font-mono text-[10px]">{record.event}</span>
                    <span className="font-mono text-[10px]">{record.available}</span>
                    <strong
                      className={`text-[10px] ${
                        !decided
                          ? "text-muted-foreground/50"
                          : record.allowed
                            ? "text-primary"
                            : "text-destructive"
                      }`}
                    >
                      {!decided ? "대기" : record.allowed ? "사용" : "제외"}
                    </strong>
                  </div>
                );
              })}
            </section>

            <section
              className={`${active >= 3 ? "block" : "hidden"} border-y py-4 lg:block ${
                active >= 3 ? "border-primary" : "border-border"
              }`}
            >
              <p className="text-[10px] font-black text-muted-foreground">
                입력 판정 기록
              </p>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-3 border-b border-border pb-2">
                  <span className="text-muted-foreground">활력 기록</span>
                  <strong className={active >= 3 ? "text-primary" : "text-muted-foreground/50"}>
                    포함
                  </strong>
                </div>
                <div className="flex justify-between gap-3 border-b border-border pb-2">
                  <span className="text-muted-foreground">검사 결과</span>
                  <strong className={active >= 3 ? "text-destructive" : "text-muted-foreground/50"}>
                    제외
                  </strong>
                </div>
                <div className="flex justify-between gap-3 border-b border-border pb-2">
                  <span className="text-muted-foreground">검사 누락 표시</span>
                  <strong className={active >= 3 ? "text-primary" : "text-muted-foreground/50"}>
                    missing-v3
                  </strong>
                </div>
              </div>
              <p className="mt-4 break-keep text-sm font-bold text-primary">
                {active >= 3 ? "10시 입력 재현 가능" : "판정 전"}
              </p>
            </section>
          </div>

          <div className="mt-5 hidden grid-cols-4 gap-2 lg:grid">
            {scenes.map((scene, index) => (
              <section
                key={scene.code}
                aria-current={index === active ? "step" : undefined}
                className={`min-w-0 border-t-2 px-3 py-3 ${
                  index === active
                    ? "border-primary bg-primary/5"
                    : index < active
                      ? "border-primary/55"
                      : "border-border text-muted-foreground"
                }`}
              >
                <p className="font-mono text-[10px] font-black text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 break-keep text-xs font-bold leading-5">
                  {scene.code}
                </p>
              </section>
            ))}
          </div>

          <p className="mt-4 min-h-20 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:min-h-16">
            {scenes[active].note}
          </p>
        </div>

        <AnimatedSceneControls
          {...controls}
          active={active}
          labels={labels}
          controlLabels={scenes.map((scene) => scene.code)}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-3 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-mobile-controls]]:hidden lg:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
