import SceneShell from "./SceneShell";

/**
 * 본문 대응: #routing "선택된 token은 expert별로 모았다가 다시 원래 순서로 돌아온다".
 * token 4개 × Top-2 = assignment 8개(가정 fixture). 어느 expert를 골랐는지는 그림을 위한 가정이다.
 * expert별 load: E₁ 3, E₂ 2, E₃ 2, E₄ 1 → 합 8.
 * 장치 배치(가정): token t1·t2와 E₁·E₂는 장치 A, token t3·t4와 E₃·E₄는 장치 B.
 * 장치를 넘는 assignment: t1→E₃, t3→E₁, t4→E₂ = 3개.
 */
const TOKENS = [
  { id: "t1", picks: ["E₁", "E₃"], device: "A" },
  { id: "t2", picks: ["E₂", "E₁"], device: "A" },
  { id: "t3", picks: ["E₁", "E₄"], device: "B" },
  { id: "t4", picks: ["E₃", "E₂"], device: "B" },
] as const;

const EXPERTS = [
  { id: "E₁", device: "A" },
  { id: "E₂", device: "A" },
  { id: "E₃", device: "B" },
  { id: "E₄", device: "B" },
] as const;

const ASSIGNMENTS = TOKENS.flatMap((token) => token.picks.map((expert) => ({ token: token.id, expert, from: token.device })));
const deviceOf = (expert: string) => EXPERTS.find((item) => item.id === expert)?.device ?? "A";
const CROSS = ASSIGNMENTS.filter((item) => deviceOf(item.expert) !== item.from).length;

const SCENES = [
  { label: "token 순서대로", summary: `token 4 × Top-2 = ${ASSIGNMENTS.length}`, note: "Router가 token마다 expert 2개를 고르면 assignment가 8개 생깁니다. 이 상태는 token 순서로 놓여 있어서 같은 expert로 갈 조각이 여기저기 흩어져 있습니다. 어느 expert를 골랐는지는 그림을 위한 가정입니다." },
  { label: "expert별로 모으기 (dispatch)", summary: "E₁ 3 · E₂ 2 · E₃ 2 · E₄ 1", note: "Assignment를 expert별로 정렬해 연속 buffer를 만듭니다. 이것이 dispatch입니다. 오른쪽 칸 하나가 한 expert의 buffer이고, 칸에 든 token 수가 그 expert의 load입니다." },
  { label: "expert마다 한 번에 계산", summary: "작은 호출 8번 → 묶음 4번", note: "Token 하나마다 작은 FFN을 따로 부르지 않고, buffer 하나를 행렬곱(GEMM) 한 번으로 계산합니다. 이 그림에서는 assignment 8개가 expert 4개의 batched GEMM 4번이 됩니다." },
  { label: "원래 자리로 되돌려 합치기", summary: "y(t1) = p₁·E₁(t1) + p₃·E₃(t1)", note: "Expert 출력을 원래 token 위치로 되돌리고(gather 또는 combine), token마다 선택된 두 출력에 고른 expert마다 따로 매겨진 routing weight(p₁, p₃처럼 expert 번호를 붙인 값)를 곱해 더합니다. Token 순서가 다시 t1→t4로 돌아옵니다." },
  { label: "expert가 여러 장치에 있으면", summary: `장치를 넘는 assignment ${CROSS} / ${ASSIGNMENTS.length}`, note: "Expert가 장치 A·B에 나뉘면 dispatch와 combine의 재배치가 장치 사이 통신(all-to-all)이 됩니다. 이 가정 배치에서는 8개 중 3개가 장치를 넘어가고, 되돌아올 때도 같은 경로를 반대로 지납니다." },
] as const;

const chip = "inline-flex h-6 items-center rounded border px-1.5 font-mono text-[11px] leading-none";

export default function DispatchCombineViz() {
  return (
    <SceneShell
      eyebrow="Dispatch · combine"
      title="Token 순서로 흩어진 assignment를 expert별 buffer로 모았다가 다시 제자리로 돌린다"
      description="왼쪽은 token 순서, 오른쪽은 expert별 buffer입니다. 칩 하나가 assignment 하나이고, ⇄ 표시는 장치를 넘는 assignment입니다. Token 4개·expert 4개·Top-2와 어느 expert를 골랐는지, 장치 배치는 모두 그림을 위한 가정입니다."
      ariaLabel="token 4개의 Top-2 assignment 8개를 expert별 buffer로 모아 계산한 뒤 원래 token 위치로 되돌리는 과정"
      scenes={SCENES}
      render={(active) => {
        const tokenSide = active === 0 || active === 3;
        const expertSide = active === 1 || active === 2;
        const devices = active === 4;
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] items-start gap-1 sm:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] sm:gap-3">
            <div className={`min-w-0 space-y-2 ${tokenSide || devices ? "" : "opacity-45"}`}>
              <p className="text-xs font-semibold text-muted-foreground">token 순서</p>
              {TOKENS.map((token) => (
                <div key={token.id} className="min-w-0 rounded-lg border border-border bg-background p-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-bold">{token.id}</span>
                    <span className={`text-[10px] ${devices ? "font-semibold text-foreground" : "text-transparent"}`}>장치 {token.device}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {active === 3 ? (
                      <span className="text-[11px] leading-6 text-foreground">p{token.picks[0].slice(1)}·{token.picks[0]} + p{token.picks[1].slice(1)}·{token.picks[1]}</span>
                    ) : (
                      token.picks.map((expert) => {
                        const cross = devices && deviceOf(expert) !== token.device;
                        return (
                          <span key={expert} className={`${chip} ${cross ? "border-amber-600 font-bold text-amber-700 dark:text-amber-400" : "border-border"}`}>
                            →{expert}{cross ? " ⇄" : ""}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground" aria-hidden>
              <span className="text-sm">{active === 3 ? "←" : active === 4 ? "⇄" : "→"}</span>
            </div>
            <div className={`min-w-0 space-y-2 ${expertSide || devices ? "" : "opacity-45"}`}>
              <p className="text-xs font-semibold text-muted-foreground">expert buffer</p>
              {EXPERTS.map((expert) => {
                const inBuffer = ASSIGNMENTS.filter((item) => item.expert === expert.id);
                return (
                  <div key={expert.id} className={`min-w-0 rounded-lg border p-2 ${active === 2 ? "border-primary/60" : "border-border"} bg-background`}>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-xs font-bold">{expert.id}</span>
                      <span className={`text-[10px] ${active === 2 ? "font-semibold text-primary" : devices ? "font-semibold text-foreground" : "text-transparent"}`}>
                        {active === 2 ? "GEMM 1회" : `장치 ${expert.device}`}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {active === 0
                        ? <span className={`${chip} border-dashed border-border/60 text-muted-foreground/60`}>비어 있음</span>
                        : inBuffer.map((item) => {
                            const cross = devices && item.from !== expert.device;
                            return (
                              <span key={item.token} className={`${chip} ${cross ? "border-amber-600 font-bold text-amber-700 dark:text-amber-400" : "border-border"}`}>
                                {item.token}{cross ? " ⇄" : ""}
                              </span>
                            );
                          })}
                    </div>
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
