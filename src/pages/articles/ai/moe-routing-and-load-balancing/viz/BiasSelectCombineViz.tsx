import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bias — bias는 top-k 선택 점수에만 더하고 combine weight는 원래 확률 p를 쓴다.
 * token 하나의 확률 p는 그림용 가정이다(합 1). bias는 본문 식 아래 해석의 3 step 뒤 값
 * e0 −0.002, e5 +0.003을 쓰고 나머지는 0으로 둔다(가정).
 * p 순위: e2 .260 > e0 .252 > e5 .249 → top-2 {e2, e0}
 * p+b 순위: e2 .260 > e5 .252 > e0 .250 → top-2 {e2, e5}
 * combine: 0.260·E2(x) + 0.249·E5(x)  (0.252는 쓰지 않음)
 */
interface Row {
  expert: string;
  p: number;
  b: number;
}

const E0: Row = { expert: "e0", p: 0.252, b: -0.002 };
const E2: Row = { expert: "e2", p: 0.26, b: 0 };
const E5: Row = { expert: "e5", p: 0.249, b: 0.003 };

const BY_P: readonly Row[] = [E2, E0, E5];
const BY_SCORE: readonly Row[] = [E2, E5, E0];

const SCENES = [
  {
    label: "확률만으로 고르면",
    summary: "top-2 = e2, e0",
    note: "bias가 없으면 확률이 큰 e2와 e0이 뽑힙니다. e0은 앞 예시에서 이미 과부하인 expert입니다.",
  },
  {
    label: "bias를 더하면",
    summary: "top-2 = e2, e5",
    note: "e0에 −0.002, e5에 +0.003을 더하면 선택 점수가 0.250과 0.252로 뒤집혀 e0 대신 e5가 뽑힙니다.",
  },
  {
    label: "합칠 때는 원래 확률",
    summary: "weight = p",
    note: "합칠 때는 bias 없는 확률 0.260과 0.249를 씁니다. 선택 점수 0.252는 식에 들어가지 않아 mixture weight는 그대로입니다.",
  },
] as const;

const fmt = (v: number) => v.toFixed(3);
const fmtBias = (v: number) => (v > 0 ? `+${fmt(v)}` : v < 0 ? `−${fmt(-v)}` : "0");

export default function BiasSelectCombineViz() {
  return (
    <SceneShell
      eyebrow="Auxiliary-loss-free bias · token 하나"
      title="Bias는 누구를 뽑을지만 바꾸고, 뽑힌 expert의 출력은 원래 확률로 합칩니다"
      description="위쪽 두 줄이 top-2로 뽑힌 expert입니다. 확률 p는 token 하나에 대한 그림용 가정이고, bias는 아래 식의 해석에서 3 step 뒤 값(e0 −0.002, e5 +0.003, 나머지 0으로 가정)을 씁니다."
      note="나머지 다섯 expert(e1, e3, e4, e6, e7)의 확률은 합쳐 0.239로, 각각 0.060 이하라고 가정해 순위 경쟁에서 뺐습니다."
      ariaLabel="bias가 top-2 선택을 바꾸지만 combine weight에는 쓰이지 않는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const rows = active === 0 ? BY_P : BY_SCORE;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[3rem_repeat(3,minmax(0,1fr))] gap-x-2 px-2 pb-1 text-[11px] font-bold text-muted-foreground sm:text-xs">
              <span>expert</span>
              <span className="text-right">확률 p</span>
              <span className="text-right">bias b</span>
              <span className="text-right">선택 점수</span>
            </div>
            <div className="space-y-1">
              {rows.map((row, rank) => {
                const picked = rank < 2;
                const score = active === 0 ? row.p : row.p + row.b;
                return (
                  <div key={rank}>
                    {rank === 2 && (
                      <p className="my-0.5 border-t border-dashed border-[#d97706] pt-0.5 text-right text-[10px] font-bold text-[#b45309]">top-2 경계 · 아래는 뽑히지 않음</p>
                    )}
                    <div
                      className={`grid grid-cols-[3rem_repeat(3,minmax(0,1fr))] items-center gap-x-2 rounded-md border px-2 py-1 font-mono sm:py-1.5 text-xs sm:text-sm ${
                        picked ? "border-[#2563eb] bg-[#2563eb]/10" : "border-border text-muted-foreground"
                      }`}
                    >
                      <span className="font-bold">{row.expert}</span>
                      <span className={`text-right ${active === 2 && picked ? "rounded-sm bg-[#16a34a]/15 font-bold text-[#15803d] dark:text-[#4ade80]" : ""}`}>{fmt(row.p)}</span>
                      <span className="text-right">{active === 0 ? "—" : fmtBias(row.b)}</span>
                      <span className={`text-right ${active === 2 ? "opacity-40" : "font-bold"}`}>{fmt(score)}</span>
                    </div>
                  </div>
                );
              })}
              <div className="grid grid-cols-[3rem_repeat(3,minmax(0,1fr))] gap-x-2 px-2 py-1 font-mono text-[11px] text-muted-foreground sm:text-xs">
                <span>나머지 5</span>
                <span className="text-right">≤ 0.060</span>
                <span className="text-right">{active === 0 ? "—" : "0"}</span>
                <span className="text-right">≤ 0.060</span>
              </div>
            </div>
            <div className="mt-2 rounded-md border border-border px-2 py-1 text-[11px] leading-5 sm:mt-3 sm:px-3 sm:py-2 sm:text-sm sm:leading-6">
              <span className="font-bold">combine: </span>
              <span className="font-mono">
                {active === 2 ? "y = 0.260·E2(x) + 0.249·E5(x)" : active === 1 ? "뽑힌 e2, e5만 계산 예정" : "뽑힌 e2, e0만 계산 예정"}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
