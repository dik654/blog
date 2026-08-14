import VizFrame from "@/components/viz/VizFrame";
import {
  LearningSceneControls,
  useLearningScenes,
} from "./LearningSceneControls";

const SCENES = ["입력", "국소 표현", "조합 표현", "판정"] as const;

const stages = [
  {
    label: "pixel",
    title: "입력 숫자",
    detail: "밝기와 색 값",
    color: "border-slate-400 bg-slate-500/10",
  },
  {
    label: "edge",
    title: "국소 변화",
    detail: "경계·방향",
    color: "border-sky-500 bg-sky-500/10",
  },
  {
    label: "part",
    title: "반복 조합",
    detail: "귀·눈·윤곽",
    color: "border-violet-500 bg-violet-500/10",
  },
  {
    label: "class",
    title: "목표에 쓸 표현",
    detail: "고양이 score",
    color: "border-emerald-500 bg-emerald-500/10",
  },
] as const;

export default function RepresentationDepthViz() {
  const scenes = useLearningScenes(SCENES.length);

  return (
    <VizFrame
      eyebrow="Animated representation map"
      title="층은 숫자를 버리는 것이 아니라 다음 판단에 쓸 형태로 다시 그린다"
      description="한 단계씩 이동하며 pixel이 국소 패턴, 부분 구조, class score로 조합되는 모습을 봅니다."
      note="그림의 edge·part 이름은 직관을 위한 예입니다. 실제 hidden coordinate 하나가 사람 개념 하나와 정확히 대응한다는 뜻은 아닙니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="Representation learning 단계 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
          {stages.map((stage, index) => (
            <div key={stage.label} className="contents">
              <div
                className={`min-w-0 border p-4 transition-all duration-500 ${stage.color} ${
                  scenes.active === index ? "translate-y-0 opacity-100" : "opacity-45"
                }`}
              >
                <div className="mb-4 flex h-20 items-center justify-center">
                  <StageGlyph index={index} active={scenes.active === index} />
                </div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {stage.label}
                </p>
                <p className="mt-1 text-sm font-black text-foreground">
                  {stage.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stage.detail}</p>
              </div>
              {index < stages.length - 1 && (
                <span
                  aria-hidden
                  className={`hidden text-lg font-black md:block ${
                    scenes.active >= index + 1 ? "text-primary" : "text-border"
                  }`}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <Boundary label="표현" value="중간 숫자의 형태" active={scenes.active <= 2} />
          <Boundary label="목표" value="어떤 차이를 보존할지" active={scenes.active === 3} />
          <Boundary label="깊이" value="작은 변환의 재사용" active={scenes.active >= 1} />
        </div>
        <LearningSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function StageGlyph({ index, active }: { index: number; active: boolean }) {
  if (index === 0) {
    return (
      <div className="grid grid-cols-4 gap-1" aria-hidden>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((cell) => (
          <span
            key={cell}
            className={`h-3 w-3 border border-current ${
              active && [1, 2, 5, 6, 9].includes(cell) ? "bg-primary" : "bg-background"
            }`}
          />
        ))}
      </div>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 96 64" className="h-16 w-24" aria-hidden>
        <path d="M12 50 36 14 58 48 84 16" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M10 53h76" fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray="4 4" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <div className="relative h-16 w-20" aria-hidden>
        <span className="absolute left-1 top-8 h-6 w-6 rounded-full border border-current" />
        <span className="absolute left-7 top-2 h-7 w-7 rounded-full border border-current" />
        <span className="absolute right-1 top-8 h-6 w-6 rounded-full border border-current" />
        <span className="absolute left-4 top-7 h-px w-12 rotate-[-18deg] bg-current" />
        <span className="absolute left-5 top-10 h-px w-10 rotate-[18deg] bg-current" />
      </div>
    );
  }
  return (
    <div className="flex h-16 w-20 items-end gap-2" aria-hidden>
      {[26, 48, 72].map((height, index) => (
        <span
          key={height}
          className={`flex-1 border border-current transition-all duration-500 ${
            active && index === 2 ? "bg-emerald-500/60" : "bg-background"
          }`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function Boundary({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`border-l pl-3 ${active ? "border-primary" : "border-border"}`}>
      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
