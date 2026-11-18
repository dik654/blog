import SceneShell from "./SceneShell";
import { POW, Q } from "./zkNumbers";

/**
 * 본문 대응: #source — C=gᵐhʳ에서 g=2, h=8=2³이면 C=2^(m+3r) mod 23. 지수는 11로 나눈 나머지.
 * (m,r)=(4,10): 4+30=34≡1 → C=2. (7,9): 7+27=34≡1 → C=2. a=(4−7)/(9−10)=3.
 * 한 m 열을 위에서 아래로 보면 r=0…10에서 11개 값이 한 번씩 나온다(r이 균일하면 C도 균일).
 */
const IDX: readonly number[] = Array.from({ length: Q }, (_, i) => i);
const commit = (m: number, r: number) => POW[(m + 3 * r) % Q];

const SCENES = [
  { label: "칸 하나가 한 가지 열림", summary: "(m, r) = (4, 10) → C = 2", note: "h=8=2³이라 C=2ᵐ×8ʳ=2^(m+3r)입니다. m=4, r=10이면 지수 34≡1이므로 C=2입니다. 칸마다 그 (m, r)로 만든 C를 적었습니다." },
  { label: "C = 2인 칸들", summary: "11칸, 열마다 하나", note: "같은 C=2가 나오는 (m, r)는 m+3r≡1인 11칸입니다. 본문의 (7, 9)도 그중 하나입니다." },
  { label: "관계 3을 알면 옮겨 엶", summary: "(4, 10) → (7, 9), a = 3", note: "h=2³이라는 관계를 알면 m을 3 올리고 r을 1 내려 같은 C=2를 유지할 수 있습니다. 거꾸로 두 열림에서 a=(4−7)/(9−10)=3이 나옵니다. 숨김과 별개로 약속을 바꿀 수 있는 경우입니다." },
  { label: "숨김: 열마다 모든 값", summary: "m = 4 열, m = 7 열 모두 11개 값", note: "m 하나를 정하고 r을 0~10에서 고르게 뽑으면 C는 11개 값을 한 번씩 거칩니다. m=4든 m=7이든 C의 분포가 같아 C만으로는 m을 구별할 수 없습니다. 이 숨김은 관계 3을 알아도 성립합니다. 실제로 그 관계를 아무도 모르게 생성자를 정하는 것은 앞 장면의 바꿔 열기를 막기 위해서입니다." },
] as const;

export default function PedersenGridViz() {
  return (
    <SceneShell
      eyebrow="Pedersen commitment"
      title="같은 약속값 2를 여는 방법이 열한 가지입니다"
      description="가로는 숨길 값 m, 세로는 가리는 무작위 수 r이며 둘 다 11로 나눈 나머지 0~10입니다. 칸의 숫자는 그 (m, r)로 만든 약속값 C=2ᵐ×8ʳ을 23으로 나눈 나머지입니다. g=2, h=8은 본문의 작은 예입니다."
      ariaLabel="m과 r의 11×11 격자에서 Pedersen 약속값이 같은 칸, 옮겨 여는 경로, 열마다 고른 분포"
      scenes={SCENES}
      render={(active) => {
        const on = (m: number, r: number) => {
          if (active === 0) return m === 4 && r === 10;
          if (active === 1) return commit(m, r) === 2;
          if (active === 2) return (m === 4 && r === 10) || (m === 7 && r === 9);
          return m === 4 || m === 7;
        };
        const soft = (m: number, r: number) => active === 2 && commit(m, r) === 2;
        return (
          <div className="min-w-0">
            <div className="mx-auto grid max-w-[460px] grid-cols-[1.5rem_repeat(11,minmax(0,1fr))] gap-px font-mono text-[10px] sm:text-xs">
              <span className="flex items-end justify-center pb-0.5 font-sans text-[10px] text-muted-foreground">r\m</span>
              {IDX.map((m) => (
                <span key={`h${m}`} className={`py-0.5 text-center font-semibold ${active === 3 && (m === 4 || m === 7) ? "text-primary" : "text-muted-foreground"}`}>{m}</span>
              ))}
              {IDX.map((r) => (
                <div key={`r${r}`} className="contents">
                  <span className="flex items-center justify-center text-muted-foreground">{r}</span>
                  {IDX.map((m) => {
                    const value = commit(m, r);
                    const hit = on(m, r);
                    const named = active === 2 && hit;
                    return (
                      <span
                        key={m}
                        className={`flex h-6 items-center justify-center rounded-[3px] border sm:h-7 ${
                          named
                            ? "border-red-600 bg-red-500/15 font-bold text-red-800 dark:text-red-300"
                            : hit
                              ? "border-primary/60 bg-primary/15 font-bold text-primary"
                              : soft(m, r)
                                ? "border-primary/30 text-primary/70"
                                : "border-transparent bg-muted/40 text-muted-foreground/70"
                        }`}
                      >
                        {value}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-3 flex min-h-[2.5rem] items-center justify-center text-center font-mono text-xs sm:text-sm">
              {active === 2 ? "(4,10): 4+3×10=34 ≡ 1   (7,9): 7+3×9=34 ≡ 1" : active === 3 ? "열 4와 열 7: 둘 다 {1,2,3,4,6,8,9,12,13,16,18}" : "C = 2^(m + 3r) mod 23,  지수는 11로 나눈 나머지"}
            </p>
          </div>
        );
      }}
    />
  );
}
