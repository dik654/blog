import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stacking 첫 문단들 — row i가 속한 fold를 뺀 base model만 row i를 예측해 Z의 i,m 칸을 채우고,
 * meta-model은 Z와 target으로 학습한다. Test 때는 fold model들의 test prediction을 base model별로 평균한다.
 * 6행·3 fold·base model 2개(A, B)는 장면을 보이기 위한 가정이다.
 */
const ROWS = [
  { id: "x₁", fold: 1 },
  { id: "x₂", fold: 1 },
  { id: "x₃", fold: 2 },
  { id: "x₄", fold: 2 },
  { id: "x₅", fold: 3 },
  { id: "x₆", fold: 3 },
] as const;

const SUP = ["⁽⁻¹⁾", "⁽⁻²⁾", "⁽⁻³⁾"] as const;

const SCENES = [
  {
    label: "Fold 1을 빼고 학습",
    summary: "x₃–x₆으로 학습 → x₁·x₂ 예측",
    note: "Fold 1의 행 x₁·x₂를 빼고 A와 B를 학습합니다. 이 두 모델은 x₁·x₂를 본 적이 없으므로, 여기서 낸 prediction만 Z의 x₁·x₂ 줄에 적습니다. Z는 행마다 base model별 prediction을 한 칸씩 모은 표(n×M)입니다.",
  },
  {
    label: "Fold 2를 빼고 학습",
    summary: "x₁·x₂·x₅·x₆으로 학습 → x₃·x₄ 예측",
    note: "이번에는 fold 2를 뺀 새 A·B를 학습합니다. 앞 장면에서 예측 대상이던 x₁·x₂가 지금은 학습 데이터입니다. 각 칸에는 그 행을 보지 않은 모델의 값만 들어갑니다.",
  },
  {
    label: "Fold 3을 빼고 학습",
    summary: "x₁–x₄로 학습 → x₅·x₆ 예측 · Z 완성",
    note: "Fold를 한 바퀴 돌면 모든 행이 정확히 한 번씩 ‘처음 보는 행’으로 예측을 받습니다. 이렇게 6×2 Z가 채워집니다. 학습에 쓴 행의 prediction은 어느 칸에도 들어가지 않습니다.",
  },
  {
    label: "Meta-model 학습",
    summary: "Z(6×2)와 target y → h",
    note: "Meta-model h는 Z의 한 줄(그 행의 A·B prediction)을 입력으로 받아 target y를 맞추도록 학습합니다. 입력이 모두 unseen prediction이라 base model의 in-sample 과신을 배우지 않습니다.",
  },
  {
    label: "Test 경로를 맞춤",
    summary: "fold model 3개의 test 예측을 model별 평균",
    note: "Test 행에는 fold model 세 개가 각각 prediction을 냅니다. A끼리, B끼리 평균해 feature 두 개를 만들고 같은 h에 넣습니다. Full-data model 하나를 대신 쓰면 OOF feature와 분포가 달라질 수 있어 따로 검증합니다.",
  },
] as const;

const FOLD_COLOR = ["#2563eb", "#d97706", "#059669"] as const;

export default function OofFoldFillViz() {
  return (
    <SceneShell
      eyebrow="OOF matrix Z 만들기"
      title="각 행은 자기를 보지 않은 모델에게서만 prediction을 받습니다"
      description="6개 행을 fold 3개로 나누고 base model A·B 두 개를 쓰는 작은 예입니다(가정). ‘학습’ 행으로 base model을 학습하고, 굵게 표시한 ‘예측’ 행은 그 모델에게서 prediction을 받습니다."
      ariaLabel="세 fold를 돌며 OOF matrix Z를 채우고 meta-model과 test 경로로 잇는 과정"
      scenes={SCENES}
      render={(active) => {
        const foldScene = active <= 2;
        const filledUpTo = Math.min(active, 2) + 1;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[2.4rem_2.6rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.2rem] gap-px overflow-hidden rounded-lg border border-border bg-border text-[11px] sm:text-xs">
              {["행", "fold", "이번 역할", "Z · A", "Z · B", "y"].map((head) => (
                <span key={head} className="bg-muted/40 px-1.5 py-1.5 font-semibold text-muted-foreground">{head}</span>
              ))}
              {ROWS.map((row) => {
                const target = foldScene && row.fold === active + 1;
                const training = foldScene && !target;
                const filled = row.fold <= filledUpTo;
                const role = foldScene ? (target ? "예측" : "학습") : "h 입력";
                const sup = SUP[row.fold - 1];
                return (
                  <div key={row.id} className="contents">
                    <span className={`bg-background px-1.5 py-1.5 font-mono ${training ? "text-muted-foreground" : "font-bold"}`}>{row.id}</span>
                    <span className="bg-background px-1.5 py-1.5 font-mono font-bold" style={{ color: FOLD_COLOR[row.fold - 1] }}>{row.fold}</span>
                    <span className={`bg-background px-1.5 py-1.5 ${target ? "font-bold text-foreground" : "text-muted-foreground"}`}>{role}</span>
                    <span className={`bg-background px-1.5 py-1.5 font-mono ${filled ? (target ? "font-bold" : "") : "text-muted-foreground/40"}`}>{filled ? `fA${sup}` : "빈칸"}</span>
                    <span className={`bg-background px-1.5 py-1.5 font-mono ${filled ? (target ? "font-bold" : "") : "text-muted-foreground/40"}`}>{filled ? `fB${sup}` : "빈칸"}</span>
                    <span className={`bg-background px-1.5 py-1.5 font-mono ${active === 3 ? "font-bold" : "text-muted-foreground"}`}>{`y${row.id.slice(1)}`}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground sm:text-xs">
              fA⁽⁻ᵏ⁾는 fold k를 빼고 학습한 A입니다. 칸의 숫자 k가 그 행의 fold와 항상 같습니다.
            </p>
            <StableSceneStack
              active={active === 4 ? 2 : active === 3 ? 1 : 0}
              className="mt-3"
              scenes={[
                ["다음 단계", `Z 채움 ${filledUpTo * 2} / 6행 · 세 fold를 모두 돌아야 meta 학습`],
                ["학습", "h ← Z의 각 줄(A, B prediction)과 같은 행의 y"],
                ["Test 행 x*", "A: fA⁽⁻¹⁾·fA⁽⁻²⁾·fA⁽⁻³⁾(x*) 평균 · B: fB⁽⁻¹⁾·fB⁽⁻²⁾·fB⁽⁻³⁾(x*) 평균 → h"],
              ].map(([head, body]) => (
                <div key={head} className="rounded-lg border border-border bg-background px-3 py-2 text-[11px] leading-5 sm:text-xs">
                  <p className="font-semibold">{head}</p>
                  <p>{body}</p>
                </div>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
