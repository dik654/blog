import SceneShell from "./SceneShell";

/**
 * 본문 대응: #baseline — final block hash 하나만 저장하면 첫 차이를 찾기 어렵다.
 * 거래 다섯 개의 가스 사용량(가정): base 10·10·40·20·10, candidate는 3번째만 45.
 * 누적 가스: base 10·20·60·80·90, candidate 10·20·65·85·95 → 3번째부터 끝까지 다르다.
 */
const BASE_GAS = [10, 10, 40, 20, 10] as const;
const CAND_GAS = [10, 10, 45, 20, 10] as const;
const cumulative = (gas: readonly number[]) => gas.map((_, index) => gas.slice(0, index + 1).reduce<number>((sum, value) => sum + value, 0));
const BASE_CUM = cumulative(BASE_GAS);
const CAND_CUM = cumulative(CAND_GAS);
const FIRST_DIFF = BASE_CUM.findIndex((value, index) => value !== CAND_CUM[index]);

const SCENES = [
  { label: "해시 하나만 저장", summary: "H_base ≠ H_cand", note: "두 실행기가 만든 최종 블록 해시만 남겼다고 해 보겠습니다. 해시가 다르다는 사실은 알 수 있지만, 다섯 거래 중 어디에서 갈라졌는지는 해시 두 개만으로 알 수 없습니다." },
  { label: "거래별 영수증", summary: "거래마다 누적 가스 기록", note: "거래마다 영수증(receipt)을 남기면 각 거래의 성공 여부와 지금까지 쓴 가스 합계(cumulative gas)를 나란히 놓을 수 있습니다. 가스 숫자는 설명용 가정입니다." },
  { label: "첫 차이", summary: `${FIRST_DIFF + 1}번째 거래: ${BASE_CUM[FIRST_DIFF]} vs ${CAND_CUM[FIRST_DIFF]}`, note: `위에서부터 비교하면 1·2번째는 같고 ${FIRST_DIFF + 1}번째에서 처음 갈라집니다. 누적 값이라 4·5번째도 모두 5씩 다르게 보이지만 그 둘은 앞의 차이를 물려받은 것입니다. 그래서 '다른 곳'이 아니라 '처음 다른 곳'을 찾습니다.` },
  { label: "같은 run ID로 묶기", summary: "run ID 하나에 모든 증거", note: `run ID는 실험 한 번의 기록을 묶는 이름입니다. ${FIRST_DIFF + 1}번째 거래를 찾았으면 같은 run ID에 묶인 그 거래의 receipt와 함께, 블록 단위로 남는 BundleAccount의 original/present 값, fork별 requests, 각 검증 항목을 꺼내 base와 candidate의 같은 기록끼리 대조합니다.` },
] as const;

const EVIDENCE = ["거래 3 receipt · cumulative gas", "블록 · BundleAccount original/present", "블록 · fork별 requests", "블록 · 각 검증 항목"] as const;

export default function FirstDivergenceViz() {
  return (
    <SceneShell
      eyebrow="정상 기준선 · 무엇을 저장할까"
      title="최종 해시는 '다르다'만 알려 주고, 거래별 기록은 '어디서'를 알려 줍니다"
      description="한 블록에 거래 다섯 개가 있고 candidate만 세 번째 거래에서 가스를 다르게 썼다고 가정합니다. 칸 안 숫자는 그 거래까지의 누적 가스입니다."
      note="거래 수와 가스 숫자는 설명용 가정이며 실제 측정값이 아닙니다."
      ariaLabel="최종 해시만 저장할 때와 거래별 누적 가스를 저장할 때 첫 차이를 찾는 과정 비교"
      scenes={SCENES}
      render={(active) => {
        const showRows = active >= 1;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[4.5rem_repeat(5,minmax(0,1fr))_minmax(0,1.4fr)] gap-1 text-center text-[10px] sm:text-xs">
              <span />
              {BASE_GAS.map((_, index) => (
                <span key={index} className={`font-bold ${active >= 2 && index === FIRST_DIFF ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>거래 {index + 1}</span>
              ))}
              <span className="font-bold text-muted-foreground">최종 해시</span>

              {[
                { who: "base", cum: BASE_CUM, hash: "H_base" },
                { who: "candidate", cum: CAND_CUM, hash: "H_cand" },
              ].map((row) => (
                <div key={row.who} className="contents">
                  <span className="self-center text-left font-mono text-[10px] font-bold sm:text-xs">{row.who}</span>
                  {row.cum.map((value, index) => {
                    const differs = value !== BASE_CUM[index];
                    const first = index === FIRST_DIFF;
                    const tone = !showRows
                      ? "border-dashed border-border text-muted-foreground/40"
                      : active >= 2 && first
                        ? "border-red-600 font-bold text-red-700 dark:text-red-400"
                        : active >= 2 && differs
                          ? "border-amber-500 text-amber-700 dark:text-amber-400"
                          : active >= 2 && index < FIRST_DIFF
                            ? "border-emerald-600"
                            : "border-border";
                    return (
                      <span key={index} className={`rounded border px-0.5 py-2 font-mono ${tone}`}>
                        {showRows ? value : "?"}
                      </span>
                    );
                  })}
                  <span className="rounded border border-red-600 px-0.5 py-2 font-mono font-bold text-red-700 dark:text-red-400">{row.hash}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[10px] leading-4 sm:text-xs">
              <span className={`rounded border px-1 py-1.5 ${active >= 2 ? "border-emerald-600" : "border-dashed border-border text-muted-foreground/40"}`}>같음 · 거래 1–2</span>
              <span className={`rounded border px-1 py-1.5 ${active >= 2 ? "border-red-600 font-bold" : "border-dashed border-border text-muted-foreground/40"}`}>첫 차이 · 거래 3</span>
              <span className={`rounded border px-1 py-1.5 ${active >= 2 ? "border-amber-500" : "border-dashed border-border text-muted-foreground/40"}`}>물려받은 차이 · 4–5</span>
            </div>

            <div className={`mt-3 rounded border p-2 ${active === 3 ? "border-blue-600" : "border-dashed border-border"}`}>
              <p className={`font-mono text-[10px] font-bold sm:text-xs ${active === 3 ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground/50"}`}>같은 run ID · 첫 차이 거래 {FIRST_DIFF + 1}에서 출발</p>
              <div className="mt-1.5 grid grid-cols-2 gap-1 sm:grid-cols-4">
                {EVIDENCE.map((item) => (
                  <span key={item} className={`rounded border px-1 py-1 text-center text-[10px] leading-4 sm:text-xs ${active === 3 ? "border-border" : "border-dashed border-border/50 text-muted-foreground/40"}`}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
