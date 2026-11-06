import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째·셋째 문단, #source, #comparison — 세 검사가 각각 무엇을 보는가.
 * 0.01 ETH = 0.01 × 10^9 Gwei = 10,000,000 Gwei (본문의 설명용 숫자). 미공개·지연의 결과는 본문이 단정하지 않으므로 단정하지 않습니다.
 */
type Mark = "catch" | "pass" | "open" | "none";
type Result = readonly [Mark, string];
const CATCH: Result = ["catch", "여기서 걸림"];
const PASS: Result = ["pass", "통과"];

const GATES = [
  { name: "bid 처리", sees: "활성 상태·서명·지급 여력·slot·부모" },
  { name: "PTC 확인", sees: "약속한 자료가 제때 보였는지와 관련 가용성" },
  { name: "실행 검증", sees: "거래 순서·이전 상태·가스·실제 접근, 계산한 목록의 hash" },
] as const;

const SCENES = [
  { label: "세 검사", summary: "서로 다른 것을 봅니다", marks: [["none", "-"], ["none", "-"], ["none", "-"]], plain: true, note: "역할을 나눠도 필요한 검사는 사라지지 않고, 하나가 다른 하나를 대신하지 않습니다." },
  { label: "지급 여력 부족", summary: "10,000,000 Gwei 감당?", marks: [CATCH, ["none", "지급 여력 안 봄"], ["none", "지급 여력 안 봄"]], plain: false, note: "설명용 0.01 ETH는 10,000,000 Gwei입니다. bid 처리는 이를 감당할 수 있는지 검사하며 X의 변화를 계산하지 않습니다." },
  { label: "내용이 제때 안 보임", summary: "서명만으론 부족", marks: [["none", "도착 판정 아님"], ["open", "결과는 명세 확인"], ["none", "도착 판정 아님"]], plain: false, note: "서명만으로 제때 받았다고 판정하지 않습니다. 적용되는 fork 선택·지급 규칙은 고정한 명세 버전 전체로 확인해야 합니다." },
  { label: "거짓 89 또는 X 누락", summary: "hash 불일치", marks: [["none", "X 계산 안 함"], ["none", "X 계산 안 함"], CATCH], plain: false, note: "실행 검증은 직접 계산해 목록을 만듭니다. 90 대신 89를 주장하거나 필요한 X를 누락했다면 받아들일 수 없습니다." },
  { label: "올바른 경우", summary: "100 → 90 → 95 (가정)", marks: [PASS, PASS, PASS], plain: false, note: "지급 약속과 100→90→95의 정확성을 각각 확인합니다. 목록에 95라고 적혔다는 이유만으로 T1·T2를 검증했다고 치지 않습니다." },
] as const satisfies readonly { label: string; summary: string; marks: readonly [Result, Result, Result]; plain: boolean; note: string }[];

const MARK_STYLE: Record<Mark, { borderColor?: string; backgroundColor?: string; color?: string }> = {
  catch: { borderColor: "#dc2626", backgroundColor: "#dc262614", color: "#dc2626" },
  pass: { borderColor: "#16a34a", backgroundColor: "#16a34a14", color: "#15803d" },
  open: { borderColor: "#d97706", backgroundColor: "#d9770614", color: "#b45309" },
  none: {},
};

export default function CheckGatesViz() {
  return (
    <SceneShell
      eyebrow="세 검사의 경계"
      title="문제마다 잡아내는 검사가 다릅니다"
      description="칸 하나가 한 검사입니다. 89·0.01 ETH는 본문의 설명용 숫자입니다."
      ariaLabel="bid 처리, PTC 확인, 실행 검증이 각 문제에 어떻게 반응하는지"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 gap-2 sm:grid-cols-3">
              {GATES.map((gate, index) => {
                const [mark, text] = scene.marks[index];
                return (
                  <div key={gate.name} className="flex min-w-0 flex-col rounded-lg border border-border bg-background px-3 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <p className="text-sm font-bold">{gate.name}</p>
                      <p className={`rounded-md border px-2 py-0.5 text-xs font-semibold leading-5 ${mark === "none" ? "border-dashed border-border/60 text-muted-foreground" : ""} ${scene.plain ? "invisible" : ""}`} style={MARK_STYLE[mark]}>
                        {text}
                      </p>
                    </div>
                    <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">{gate.sees}</p>
                    {index === 2 && (
                      <p className={`mt-1 text-xs font-semibold leading-5 ${active === 3 ? "" : "invisible"}`}>
                        계산 <span className="font-mono">(1, 90) (2, 95)</span> ≠ 주장 <span className="font-mono" style={{ color: "#dc2626" }}>(1, 89) …</span>
                      </p>
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
