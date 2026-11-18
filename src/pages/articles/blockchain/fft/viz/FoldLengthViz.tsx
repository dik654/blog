import NttSceneShell from "./NttSceneShell";

/**
 * 본문 대응: #zk-usage — A=1+x², B=1+x의 곱 1+x+x²+x³을 담는 칸 수.
 * 길이 4: 네 계수가 각자 칸에 → 1+x+x²+x³.
 * 길이 2: x²=1, x³=x → [1+1, 1+1] = 2+2x.
 * 길이 3: x³=1 → [1+1, 1, 1] = 2+x+x² (대수적 예, F₁₇에는 3차 단위근이 없음).
 */
const TERMS = ["1", "x", "x²", "x³"] as const;
const SLOT_NAMES = ["상수", "x", "x²", "x³"] as const;

const SCENES = [
  { label: "길이 4: 계수마다 칸이 있습니다", summary: "1 + x + x² + x³", length: 4, note: "곱의 계수 네 개가 각자 다른 칸에 들어갑니다. 역변환하면 곱의 계수 (1,1,1,1)을 그대로 되찾습니다." },
  { label: "길이 2: x² = 1이 됩니다", summary: "2 + 2x", length: 2, note: "위치 1·−1에서는 x²=1이라 x² 항이 상수 칸에, x³ 항이 x 칸에 겹칩니다. 겹친 뒤에는 어느 항에서 온 1인지 구분할 수 없습니다." },
  { label: "길이 3: x³ = 1로 줄인 대수적 예", summary: "2 + x + x²", length: 3, note: "x³ 항만 상수 칸에 겹칩니다. 다만 3은 16을 나누지 않아 F₁₇에는 필요한 3차 단위근이 없습니다. F₁₇에서 길이 3 NTT를 실행한 결과가 아닙니다." },
] as const;

export default function FoldLengthViz() {
  return (
    <NttSceneShell
      eyebrow="곱을 담는 칸 수"
      title="칸이 모자라면 높은 차수 항이 낮은 칸에 겹칩니다"
      description="위의 네 조각은 A=1+x²와 B=1+x를 곱한 1+x+x²+x³의 항입니다. 아래 칸은 변환 길이만큼 있는 계수 자리이며, 길이 n에서는 xⁿ=1이라 xᵏ가 k를 n으로 나눈 나머지 칸으로 갑니다."
      ariaLabel="곱 1+x+x²+x³을 길이 4, 2, 3의 칸에 담았을 때 겹치는 항"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const slotOf = (degree: number) => degree % scene.length;
        return (
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">곱의 항 (계수는 모두 1)</p>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {TERMS.map((term, degree) => {
                const folded = slotOf(degree) !== degree;
                return (
                  <div key={term} className={`rounded-md border px-1 py-1.5 text-center ${folded ? "border-amber-600" : "border-border"}`}>
                    <span className="block font-mono text-sm font-bold">{term}</span>
                    <span className={`block text-[11px] ${folded ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
                      {folded ? `→ ${(SLOT_NAMES as readonly string[])[slotOf(degree)]} 칸` : "제자리"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">길이 {scene.length}의 계수 칸</p>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {SLOT_NAMES.map((term, slot) => {
                const exists = slot < scene.length;
                const members = TERMS.filter((_, degree) => slotOf(degree) === slot);
                return (
                  <div
                    key={term}
                    className={`min-h-[5.5rem] rounded-md border px-1 py-2 text-center ${exists ? (members.length > 1 ? "border-amber-600" : "border-primary/60") : "border-dashed border-border/40"}`}
                  >
                    <span className={`block text-[11px] ${exists ? "text-muted-foreground" : "text-muted-foreground/40"}`}>{term} 칸</span>
                    {exists ? (
                      <>
                        <span className="mt-1 block font-mono text-xs leading-5">{members.join(" + ")}</span>
                        <span className={`mt-1 block font-mono text-base font-bold ${members.length > 1 ? "text-amber-700 dark:text-amber-400" : ""}`}>{members.length}</span>
                      </>
                    ) : (
                      <span className="mt-2 block text-xs text-muted-foreground/40">칸 없음</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
