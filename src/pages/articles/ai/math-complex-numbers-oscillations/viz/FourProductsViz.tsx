import SceneShell from "./SceneShell";

/**
 * 본문 대응: #complex-plane — (a+bi)(c+di)=(ac−bd)+(ad+bc)i. a=3,b=4,c=0,d=1이면
 * ac=0, ad·i=3i, bc·i=0, bd·i²=4i²=−4 → 실수부 −4, 허수부 3.
 */
const CELLS = [
  { id: "ac", general: "ac", value: "3×0 = 0", sign: "0", kind: "real" },
  { id: "ad", general: "ad · i", value: "3×1·i = 3i", sign: "3i", kind: "imag" },
  { id: "bc", general: "bc · i", value: "4×0·i = 0", sign: "0", kind: "imag" },
  { id: "bd", general: "bd · i²", value: "4×1·i² = 4i²", sign: "−4", kind: "real" },
] as const;

const SCENES = [
  { label: "네 칸으로 나눕니다", summary: "(a+bi)(c+di)", note: "두 괄호를 전개하면 칸이 넷입니다. 앞 괄호의 a, bi가 각 줄이고, 뒤 괄호의 c, di가 각 열입니다." },
  { label: "숫자를 넣습니다", summary: "(3+4i)(0+1i)", note: "사례는 a=3, b=4에 i를 곱하는 c=0, d=1입니다. 칸마다 값을 적습니다." },
  { label: "i²에서 부호가 바뀝니다", summary: "4i² = −4", note: "오른쪽 아래 칸만 i가 두 번 들어 있습니다. i²=−1이므로 허수 칸이 아니라 실수 칸으로 넘어가고 부호가 바뀝니다." },
  { label: "같은 종류끼리 모읍니다", summary: "실수부 −4 · 허수부 3", note: "파란 칸을 더하면 실수부 ac−bd=−4, 노란 칸을 더하면 허수부 ad+bc=3입니다. 결과 −4+3i는 앞의 회전 규칙과 같습니다." },
] as const;

export default function FourProductsViz() {
  return (
    <SceneShell
      eyebrow="복소수 곱셈"
      title="네 번 곱해 두 자리로 모읍니다"
      description="복소수 곱셈 한 번은 실수 곱셈 네 번과 덧셈·뺄셈으로 이뤄집니다. 파란 칸은 실수부로, 노란 칸은 허수부로 갑니다."
      ariaLabel="복소수 곱셈의 네 항 분해"
      scenes={SCENES}
      render={(active) => {
        const colored = active >= 2;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-1.5 text-center text-sm">
              <span />
              <span className="font-mono font-bold">{active === 0 ? "c" : "c = 0"}</span>
              <span className="font-mono font-bold">{active === 0 ? "di" : "1i"}</span>
              {["a", "bi"].flatMap((row, rowIndex) => [
                <span key={row} className="self-center font-mono font-bold">{active === 0 ? row : rowIndex === 0 ? "3" : "4i"}</span>,
                ...CELLS.slice(rowIndex * 2, rowIndex * 2 + 2).map((cell) => (
                  <div
                    key={cell.id}
                    className={`min-w-0 rounded-md border px-1 py-3 ${colored ? (cell.kind === "real" ? "border-blue-600 bg-blue-500/10" : "border-amber-600 bg-amber-500/10") : "border-border bg-background"}`}
                  >
                    <span className="block whitespace-nowrap font-mono text-xs sm:text-sm">{active === 0 ? cell.general : cell.value}</span>
                    <span className="mt-0.5 block font-mono font-bold">{colored ? cell.sign : " "}</span>
                  </div>
                )),
              ])}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5 text-center text-sm">
              <div className={`rounded-md border px-2 py-2 ${active === 3 ? "border-blue-600" : "border-dashed border-border"}`}>
                <span className="block text-xs text-muted-foreground">실수부</span>
                <span className="font-mono font-bold">{active === 3 ? "0 + (−4) = −4" : "ac − bd"}</span>
              </div>
              <div className={`rounded-md border px-2 py-2 ${active === 3 ? "border-amber-600" : "border-dashed border-border"}`}>
                <span className="block text-xs text-muted-foreground">허수부</span>
                <span className="font-mono font-bold">{active === 3 ? "3 + 0 = 3" : "ad + bc"}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
