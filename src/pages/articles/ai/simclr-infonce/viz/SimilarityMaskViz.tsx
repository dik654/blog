import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #batch — 의사코드의 cosine[6][6] 행렬에서 대각선(자기 자신)을 지우고,
 * 행마다 positive 하나를 찾아 2N=6개 anchor loss를 평균하는 과정을 칸으로 보여 준다.
 * 자기 자신을 남기는 오류 장면은 3절의 설명용 cosine [0.8, 0.4, 0.1, −0.1, 0.0]과 τ=0.5를 그대로 쓴다.
 * 정규화된 vector의 자기 cosine은 1 → 1/0.5=2 → exp(2)=7.389.
 * Z: 10.219 → 10.219+7.389 = 17.608, p: 4.953/10.219 = 0.485 → 4.953/17.608 = 0.281, loss: 0.724 → 1.268.
 */
const VIEWS = ["A₁", "A₂", "B₁", "B₂", "C₁", "C₂"] as const;
const POSITIVE_OF = [1, 0, 3, 2, 5, 4] as const;
/** "자기 자신을 남기면" 장면의 A₁ 행: 자기 1.0 + 3절 후보 순서(A₂·B₁·B₂·C₁·C₂)의 설명용 cosine. */
const A1_COSINE = ["1.0", "0.8", "0.4", "0.1", "−0.1", "0.0"] as const;

const SCENES = [
  {
    label: "6×6 점수판",
    summary: "6 × 6 = 36칸",
    note: "행은 anchor, 열은 후보 view입니다. 칸 하나에 두 view의 cosine similarity가 들어갑니다. 의사코드의 cosine[anchor][index]가 이 칸입니다. 값은 batch마다 달라 여기서는 적지 않습니다.",
  },
  {
    label: "대각선 지우기",
    summary: "행마다 6 − 1 = 5 후보",
    note: "대각선 칸은 view가 자기 자신과 비교한 점수입니다. 의사코드의 index !== anchor 필터가 이 칸을 지워 행마다 다섯 후보만 남깁니다.",
  },
  {
    label: "행마다 positive 하나",
    summary: "6행 → anchor loss 6개",
    note: "A₁ 행의 positive는 A₂ 열이고, A₂ 행의 positive는 A₁ 열입니다. 같은 pair라도 두 행은 지우는 열이 다릅니다. 그래서 N=3 원본에서 2N=6개 loss가 나옵니다.",
  },
  {
    label: "positive 위치 당기기",
    summary: "positive > anchor 이면 −1",
    note: "번호는 코드처럼 0부터 셉니다. 대각선을 빼면 그 오른쪽 열이 한 칸씩 왼쪽으로 당겨집니다. A₁ 행에서 A₂는 원래 열 1이지만 후보 배열에서는 0번입니다. B₁ 행에서 B₂는 열 3에서 2번이 됩니다. 의사코드의 positiveIndex가 이 보정입니다.",
  },
  {
    label: "자기 자신을 남기면",
    summary: "p 0.485 → 0.281",
    note: "3절의 설명용 cosine과 temperature τ=0.5(cosine을 나누는 양수)를 그대로 쓴 계산입니다(가정). 길이를 1로 맞춘 vector의 자기 cosine은 1이라 A₁ 자신의 점수 1 ÷ 0.5 = 2가 A₂의 0.8 ÷ 0.5 = 1.6보다 높습니다. 후보마다 exp(점수)를 더한 분모 Z가 10.219에서 17.608로 커져 A₂ 확률은 0.281로 떨어지고 loss는 0.724에서 1.268이 됩니다.",
  },
  {
    label: "6개 loss 평균",
    summary: "(ℓ₁ + … + ℓ₆) ÷ 2N",
    note: "A₁→A₂와 A₂→A₁을 포함해 여섯 행이 각각 다섯 후보 중 하나를 맞히는 분류 문제가 됩니다. 전체 batch loss는 이 여섯 값을 2N=6으로 나눈 평균입니다.",
  },
] as const;

type CellKind = "plain" | "self" | "positive" | "negative";

function cellKind(scene: number, row: number, col: number): CellKind {
  if (row === col) return scene >= 1 ? "self" : "plain";
  if (scene < 2) return "plain";
  return POSITIVE_OF[row] === col ? "positive" : "negative";
}

const CELL_STYLE: Record<CellKind, string> = {
  plain: "border-border bg-background text-muted-foreground",
  self: "border-dashed border-border bg-muted/40 text-muted-foreground/70",
  positive: "border-[#16a34a] bg-[#16a34a]/15 font-bold text-[#15803d] dark:text-[#4ade80]",
  negative: "border-border bg-background text-muted-foreground",
};

const CELL_TEXT: Record<CellKind, string> = {
  plain: "sim",
  self: "×",
  positive: "P",
  negative: "N",
};

function focusRows(scene: number): readonly number[] {
  if (scene === 2) return [0, 1];
  if (scene === 3) return [0, 2];
  if (scene === 4) return [0];
  return [];
}

function Matrix({ scene }: { scene: number }) {
  const rows = focusRows(scene);
  return (
    <div className="min-w-0" role="img" aria-label={SCENES[scene].note}>
      <div className="grid grid-cols-[2.25rem_repeat(6,minmax(0,1fr))] gap-1 text-center font-mono text-[10px] sm:grid-cols-[3rem_repeat(6,minmax(0,1fr))] sm:text-xs">
        <span className="self-end pb-1 text-[9px] text-muted-foreground sm:text-[10px]">anchor</span>
        {VIEWS.map((view) => (
          <span key={view} className="pb-1 font-bold">{view}</span>
        ))}
        {VIEWS.map((rowView, row) => {
          const dim = rows.length > 0 && !rows.includes(row);
          return [
            <span key={`${rowView}-h`} className={`flex items-center justify-center font-bold ${dim ? "opacity-35" : ""}`}>{rowView}</span>,
            ...VIEWS.map((colView, col) => {
              const kind = cellKind(scene, row, col);
              const selfKept = scene === 4 && row === 0 && col === 0;
              const shownCosine = scene === 4 && row === 0 ? A1_COSINE[col] : null;
              return (
                <span
                  key={`${rowView}-${colView}`}
                  className={`flex h-7 items-center justify-center rounded-sm border ${selfKept ? "border-[#dc2626] bg-[#dc2626]/10 font-bold text-[#b91c1c] dark:text-[#f87171]" : CELL_STYLE[kind]} ${dim ? "opacity-35" : ""}`}
                >
                  {shownCosine ?? CELL_TEXT[kind]}
                </span>
              );
            }),
          ];
        })}
      </div>
      <p className="mt-2 text-[10px] leading-5 text-muted-foreground sm:text-xs">
        × 지운 자기 칸 · P positive · N negative · 열 = 후보 view
      </p>
    </div>
  );
}

function CandidateRow({ anchor, original, positive }: { anchor: string; original: number; positive: number }) {
  const anchorIndex = VIEWS.indexOf(anchor as (typeof VIEWS)[number]);
  const candidates = VIEWS.filter((_, index) => index !== anchorIndex);
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold sm:text-xs">
        {anchor} 행 · positive 원래 열 {original} → 후보 {positive}번
      </p>
      <div className="mt-1 grid grid-cols-5 gap-1 text-center font-mono text-[10px] sm:text-xs">
        {candidates.map((view, index) => (
          <span
            key={view}
            className={`rounded-sm border py-1 ${index === positive ? "border-[#16a34a] bg-[#16a34a]/15 font-bold text-[#15803d] dark:text-[#4ade80]" : "border-border bg-background text-muted-foreground"}`}
          >
            <span className="block text-[9px] font-normal text-muted-foreground">{index}</span>
            {view}
          </span>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, before, after }: { label: string; before: string; after: string }) {
  return (
    <div className="min-w-0 bg-background px-2 py-2">
      <span className="block text-[9px] text-muted-foreground sm:text-[10px]">{label}</span>
      <span className="block font-mono text-[11px] sm:text-sm">
        <span className="text-muted-foreground">{before}</span> → <strong className="text-[#b91c1c] dark:text-[#f87171]">{after}</strong>
      </span>
    </div>
  );
}

function Detail({ scene }: { scene: number }) {
  if (scene === 3) {
    return (
      <div className="grid gap-3">
        <CandidateRow anchor="A₁" original={1} positive={0} />
        <CandidateRow anchor="B₁" original={3} positive={2} />
      </div>
    );
  }
  if (scene === 4) {
    return (
      <div className="grid grid-cols-3 gap-px bg-border p-px md:grid-cols-1">
        <Stat label="분모 Z (exp 합)" before="10.219" after="17.608" />
        <Stat label="p(A₂|A₁)" before="0.485" after="0.281" />
        <Stat label="loss" before="0.724" after="1.268" />
      </div>
    );
  }
  if (scene === 5) {
    return (
      <div className="grid grid-cols-6 gap-1 text-center font-mono text-[10px] sm:text-xs md:grid-cols-2">
        {VIEWS.map((view, row) => (
          <span key={view} className="rounded-sm border border-border bg-background py-1">
            <span className="block text-[9px] text-muted-foreground">ℓ{row + 1}</span>
            {view}→{VIEWS[POSITIVE_OF[row]]}
          </span>
        ))}
      </div>
    );
  }
  const text = [
    "36칸 = 6 anchor × 6 view",
    "남는 칸 6 × 5 = 30",
    "positive 6칸 · negative 24칸",
  ][scene];
  return <p className="font-mono text-xs text-muted-foreground sm:text-sm">{text}</p>;
}

export default function SimilarityMaskViz() {
  return (
    <SceneShell
      eyebrow="Similarity mask"
      title="6×6 점수판에서 대각선을 지우면 행마다 다섯 후보가 남습니다"
      description="행 하나가 anchor 하나의 분류 문제입니다. 의사코드가 지우는 칸과 다시 맞추는 위치를 같은 점수판에서 따라갑니다."
      ariaLabel="SimCLR 6 view similarity 행렬에서 자기 자신을 지우고 행마다 positive를 찾는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] md:items-start">
          <Matrix scene={active} />
          <StableSceneStack
            active={active}
            scenes={SCENES.map((scene, index) => (
              <Detail key={scene.label} scene={index} />
            ))}
          />
        </div>
      )}
    />
  );
}
