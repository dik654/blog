import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: ExplainedFormula의 self-consistency — 7개 path의 answer 42, 42, 40, 42, 41, 42, 40.
 * y=42의 indicator 1,1,0,1,0,1,0 → 합 4. 후보별 표: 42=4, 40=2, 41=1 → argmax 42.
 */
const ANSWERS: readonly string[] = ["42", "42", "40", "42", "41", "42", "40"];
const CANDIDATES: readonly string[] = ["42", "40", "41"];
const K = ANSWERS.length;
const count = (y: string) => ANSWERS.filter((a) => a === y).length;

const SCENES = [
  {
    label: "답만 추출",
    summary: `K = ${K}개 path`,
    note: "같은 question에서 7개 reasoning path를 sampling하고, 각 path의 문장은 그대로 둔 채 최종 answer a₁…a₇만 꺼냅니다. 문장을 평균내지 않습니다.",
  },
  {
    label: "y = 42의 indicator",
    summary: "1+1+0+1+0+1+0 = 4",
    note: "후보 y를 42로 두고 각 answer가 42와 같으면 1, 다르면 0으로 바꿉니다(indicator 1[aₖ = y]). 일곱 값을 더하면 42가 받은 표는 4입니다.",
  },
  {
    label: "후보별 합산",
    summary: "42: 4 · 40: 2 · 41: 1",
    note: "같은 계산을 40과 41에도 하면 표는 2와 1입니다. 세 후보의 표를 더하면 4 + 2 + 1 = 7로 path 수 K와 같습니다.",
  },
  {
    label: "argmax와 한계",
    summary: "42 선택 ≠ 정답 보장",
    note: "표가 가장 많은 42를 고릅니다. 하지만 42를 낸 네 path가 같은 잘못된 premise를 공유하면 agreement가 커도 모두 틀릴 수 있어 외부 verifier가 식·단위·근거를 다시 판정합니다. Path 7개를 생성했으니 비용도 path 하나의 7배에 가깝습니다.",
  },
] as const;

const TONE: Record<string, string> = { "42": "#2563eb", "40": "#d97706", "41": "#64748b" };

function Drawing({ step }: { step: number }) {
  return (
    <div className="grid min-w-0 gap-4 text-xs sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:gap-6 sm:text-sm">
      <div className="min-w-0">
        <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_2.5rem_3.25rem] items-center gap-2 border-b border-border pb-1 font-mono text-[10px] font-bold text-muted-foreground">
          <span>k</span>
          <span>reasoning path</span>
          <span>aₖ</span>
          <span className={step === 1 ? "" : "invisible"}>[aₖ=42]</span>
        </div>
        <div className="mt-1.5 grid gap-1">
          {ANSWERS.map((a, k) => {
            const hit = a === "42";
            const marked = step === 3 && hit;
            return (
              <div key={k} className="grid grid-cols-[2.25rem_minmax(0,1fr)_2.5rem_3.25rem] items-center gap-2">
                <span className="font-mono text-muted-foreground">{k + 1}</span>
                <span className={`h-5 min-w-0 rounded-sm border ${marked ? "border-red-600 border-dashed" : "border-border"} bg-muted/40`}>
                  <span className={`block truncate px-1.5 text-[10px] leading-5 ${marked ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                    {marked ? "같은 premise?" : "step → step → …"}
                  </span>
                </span>
                <span className="text-center font-mono font-bold" style={{ color: TONE[a] }}>{a}</span>
                <span className={`text-center font-mono font-bold ${step === 1 ? (hit ? "text-foreground" : "text-muted-foreground/60") : "invisible"}`}>
                  {hit ? 1 : 0}
                </span>
              </div>
            );
          })}
        </div>
        <div className={`mt-1.5 grid grid-cols-[2.25rem_minmax(0,1fr)_2.5rem_3.25rem] items-center gap-2 border-t border-border pt-1 ${step === 1 ? "" : "invisible"}`}>
          <span />
          <span className="text-right text-muted-foreground">합 c(42)</span>
          <span />
          <span className="text-center font-mono font-black">{count("42")}</span>
        </div>
      </div>

      <div className={`min-w-0 ${step >= 2 ? "" : "opacity-30"}`}>
        <p className="border-b border-border pb-1 font-mono text-[10px] font-bold text-muted-foreground">후보별 표 c(y) · 칸 하나 = 1표</p>
        <div className="mt-2 grid gap-2">
          {CANDIDATES.map((y) => {
            const c = step >= 2 ? count(y) : 0;
            const win = step === 3 && y === "42";
            return (
              <div key={y} className="grid grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-center gap-2">
                <span className={`font-mono font-bold ${win ? "underline underline-offset-4" : ""}`} style={{ color: TONE[y] }}>{y}</span>
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: K }, (_, i) => (
                    <span key={i} className="h-4 rounded-sm border" style={{ borderColor: i < c ? TONE[y] : "#cbd5e1", backgroundColor: i < c ? TONE[y] : "transparent", opacity: i < c ? 1 : 0.5 }} />
                  ))}
                </div>
                <span className="text-right font-mono font-bold">{step >= 2 ? c : "·"}</span>
              </div>
            );
          })}
        </div>
        <div className={`mt-3 rounded-md border px-2 py-1.5 ${step === 3 ? "border-primary bg-primary/10" : "invisible border-border"}`}>
          <p className="font-bold">ŷ = argmax c(y) = 42</p>
          <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">다음 단계: 외부 verifier가 식·단위·source span 판정</p>
        </div>
      </div>
    </div>
  );
}

export default function VoteTallyViz() {
  return (
    <SceneShell
      eyebrow="Self-consistency"
      title="일곱 path의 답을 세어 42를 고르기까지"
      description="Self-consistency는 같은 question에서 reasoning path 여러 개를 sampling하고 최종 answer의 표를 세어 고르는 방식입니다. 본문 해석의 일곱 answer 42, 42, 40, 42, 41, 42, 40을 그대로 씁니다. 왼쪽은 path별 최종 answer, 오른쪽은 후보 answer가 받은 표입니다."
      ariaLabel="일곱 reasoning path의 answer를 indicator로 바꿔 후보별 표를 세고 42를 고르는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <Drawing key={scene.label} step={index} />)} />
      )}
    />
  );
}
