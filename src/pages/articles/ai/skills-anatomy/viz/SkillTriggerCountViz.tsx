import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #execution 공식 해석 — 적용 대상 40건 중 36건을 고르고(4건 놓침),
 * 비적용 요청에서 6건을 잘못 고른 사례. precision = 36/42, recall = 36/40.
 * 비적용 요청의 전체 수는 글에 없으므로 칸으로 세지 않는다.
 */
const POSITIVE = 40;
const TP = 36;
const FN = POSITIVE - TP;
const FP = 6;
const PICKED = TP + FP;

const pct = (num: number, den: number) => ((num / den) * 100).toFixed(1);

const SCENES = [
  {
    label: "적용 대상 40건",
    summary: "칸 하나 = 요청 하나",
    note: "먼저 사람이 ‘이 Skill을 써야 하는 요청’ 40건을 표시해 둡니다. 아직 Skill이 무엇을 골랐는지는 보지 않았습니다. 오른쪽은 ‘쓰면 안 되는 요청’ 묶음이며, 그 전체 수는 글에 나오지 않습니다.",
  },
  {
    label: "고른 것과 놓친 것",
    summary: `맞게 선택(TP) ${TP} · 놓침(FN) ${FN}`,
    note: `적용 대상 40건 중 36건에서 Skill을 골랐습니다. 이 칸이 TP(true positive, 맞게 선택)입니다. 나머지 ${FN}건은 Skill이 필요했는데 고르지 못한 FN(false negative, 놓침)입니다.`,
  },
  {
    label: "잘못 끼어든 것",
    summary: `잘못 선택(FP) ${FP}`,
    note: "쓰면 안 되는 요청 쪽에서 6건을 골랐습니다. 이 칸이 FP(false positive, 잘못 끼어듦)입니다. 비적용 요청이 모두 몇 건인지는 글에 없으므로 나머지는 칸으로 그리지 않았습니다.",
  },
  {
    label: "Precision: 고른 것 중 맞은 비율",
    summary: `${TP} / (${TP}+${FP}) = ${TP}/${PICKED} ≈ ${pct(TP, PICKED)}%`,
    note: `분모는 Skill이 고른 모든 칸, 곧 TP 36과 FP 6을 합친 ${PICKED}건입니다. 놓친 ${FN}건은 고르지 않았으므로 여기에 들어가지 않습니다. 이 값이 낮으면 description 범위가 지나치게 넓을 수 있습니다.`,
  },
  {
    label: "Recall: 필요한 것 중 고른 비율",
    summary: `${TP} / (${TP}+${FN}) = ${TP}/${POSITIVE} = ${pct(TP, POSITIVE)}%`,
    note: `분모는 적용 대상 40건 전체입니다. 잘못 끼어든 FP 6건은 적용 대상이 아니므로 빠집니다. 두 값은 선택만 잽니다. 좋게 나와도 CI 수정이 맞다는 뜻은 아니므로 실제 test와 diff 검증이 따로 필요합니다.`,
  },
] as const;

const TP_COLOR = "#2563eb";
const FN_COLOR = "#d97706";
const FP_COLOR = "#dc2626";

type Kind = "tp" | "fn" | "fp";

function Cell({ kind, revealed, dim, inSet, hidden = false }: { kind: Kind; revealed: boolean; dim: boolean; inSet: boolean; hidden?: boolean }) {
  const color = kind === "tp" ? TP_COLOR : kind === "fn" ? FN_COLOR : FP_COLOR;
  const glyph = kind === "tp" ? "✓" : kind === "fn" ? "−" : "✕";
  return (
    <span
      className="flex aspect-square min-w-0 items-center justify-center rounded-[3px] border text-[9px] font-bold leading-none sm:text-[11px]"
      style={{
        borderColor: revealed ? color : "#94a3b8",
        backgroundColor: revealed && kind !== "fn" ? color : "transparent",
        color: revealed ? (kind === "fn" ? color : "#ffffff") : "transparent",
        opacity: hidden ? 0 : dim ? 0.22 : 1,
        outline: inSet ? "1.25px solid #64748b" : "none",
        outlineOffset: 1,
      }}
    >
      {glyph}
    </span>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="inline-flex size-3.5 items-center justify-center rounded-[3px] text-[9px] font-bold text-white" style={{ backgroundColor: TP_COLOR }}>✓</span>TP 맞게 선택</span>
      <span className="flex items-center gap-1.5"><span className="inline-flex size-3.5 items-center justify-center rounded-[3px] border text-[9px] font-bold" style={{ borderColor: FN_COLOR, color: FN_COLOR }}>−</span>FN 놓침</span>
      <span className="flex items-center gap-1.5"><span className="inline-flex size-3.5 items-center justify-center rounded-[3px] text-[9px] font-bold text-white" style={{ backgroundColor: FP_COLOR }}>✕</span>FP 잘못 끼어듦</span>
      <span className="flex items-center gap-1.5"><span className="inline-block size-3.5 rounded-[3px]" style={{ outline: "1.25px solid #64748b", outlineOffset: 1 }} />현재 분모(바깥 테두리)</span>
    </div>
  );
}

function Grid({ active }: { active: number }) {
  const showPick = active >= 1;
  const showFp = active >= 2;
  const precision = active === 3;
  const recall = active === 4;
  const positives = Array.from({ length: POSITIVE }, (_, index): Kind => (index < TP ? "tp" : "fn"));
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] sm:gap-6">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-bold">적용해야 하는 요청 · {POSITIVE}건</p>
        <div className="grid grid-cols-10 gap-1">
          {positives.map((kind, index) => (
            <Cell
              key={index}
              kind={kind}
              revealed={showPick}
              dim={precision && kind === "fn"}
              inSet={(precision && kind === "tp") || recall}
            />
          ))}
        </div>
      </div>
      <div className="min-w-0">
        <p className="mb-2 text-xs font-bold">적용하면 안 되는 요청</p>
        <div className="grid grid-cols-10 gap-1 sm:grid-cols-6">
          {Array.from({ length: FP }, (_, index) => (
            <Cell key={index} kind="fp" revealed={showFp} hidden={!showFp} dim={recall} inSet={precision} />
          ))}
        </div>
        <div className="mt-2 rounded-md border border-dashed border-border px-2 py-2 text-[11px] leading-4 text-muted-foreground">
          고르지 않은 나머지 비적용 요청 · 수는 글에 없음
        </div>
      </div>
    </div>
  );
}

export default function SkillTriggerCountViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const labels = SCENES.map((scene) => scene.label);
  return (
    <VizFrame
      eyebrow="선택만 세기"
      title="고른 칸과 필요한 칸 중 무엇으로 나누는지가 두 값을 가릅니다"
      description="본문 예시의 40건·36건·6건을 칸으로 셉니다. Precision은 ‘고른 것’, recall은 ‘필요한 것’을 분모로 씁니다."
      note="칸의 배치 순서는 세기 쉽게 정렬한 것입니다(가정). 실제 평가 묶음에서 요청이 이런 순서로 나오지는 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="적용 대상 40건과 잘못 고른 6건으로 precision과 recall을 세는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="min-w-0">
          <StableSceneStack
            active={scenes.active}
            scenes={SCENES.map((scene) => (
              <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-base font-bold">{scene.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
              </div>
            ))}
          />
          <div className="mt-4 min-w-0"><Grid active={scenes.active} /></div>
          <div className="mt-3"><Legend /></div>
          <StableSceneStack
            active={scenes.active}
            className="mt-4"
            scenes={SCENES.map((scene) => (
              <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{scene.note}</p>
            ))}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
