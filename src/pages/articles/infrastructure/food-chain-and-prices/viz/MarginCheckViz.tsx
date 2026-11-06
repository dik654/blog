import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 가격 차이만으로는 폭리가 확정되지 않습니다. 같은 품질·수량·기간으로 맞추고,
 * 비용을 보고, 특정 단계의 순마진만 커졌는지 봅니다. 4절 사례: 출하 10, 판매 8, 폐기 2, 총액 2,000(가정).
 */
const GATES = [
  { ask: "같은 품질·수량·기간으로 맞췄나요?", side: "아니면", out: "출하량·판매량·폐기량과 원가·지급일부터 적습니다" },
  { ask: "비용은 그대로인가요?", side: "아니면", out: "폐기율·연료비·임금이 오르면 소매가격이 바뀝니다" },
  { ask: "특정 단계의 순마진만 커졌나요?", side: "그렇다면", out: "계약·구매자 집중도를 조사할 이유가 생깁니다. 폭리 확정은 아닙니다" },
] as const;

const SCENES = [
  { label: "가격 차이만 보면", summary: "200원 → 250원, 아직 모름", note: "가격 차이 자체만으로 누가 폭리를 취했는지는 확정되지 않습니다. 세 질문을 차례로 거칩니다." },
  { label: "먼저 같은 단위로 맞춥니다", summary: "출하 10 · 판매 8 · 폐기 2", note: "4절 사례(가정)라면 출하 10개, 판매 8개, 폐기 2개입니다. 이 수량을 맞춰야 250원을 제대로 읽습니다." },
  { label: "비용을 봅니다", summary: "2,000 ÷ 8 = 250원", note: "4절 가정에서는 총액 2,000원이 그대로이고 판매 수량만 줄어 250원이 됐습니다. 이 가정에서 총이익이 늘었다고 볼 수는 없습니다." },
  { label: "순마진만 커졌다면", summary: "조사할 이유 ≠ 확정", note: "순마진은 판매액에서 비용을 빼고 남는 몫입니다. 이것만 커졌다면 조사할 이유가 생길 뿐, 그 자체가 폭리의 확정은 아닙니다." },
] as const;

export default function MarginCheckViz() {
  return (
    <SceneShell
      eyebrow="폭리를 말하기 전에"
      title="가격 차이에서 조사까지 세 단계를 거칩니다"
      description="왼쪽은 질문, 오른쪽은 그 답일 때 읽는 법입니다. 순마진은 판매액에서 비용을 뺀 몫입니다."
      ariaLabel="같은 단위 맞추기, 비용 확인, 순마진 확인으로 이어지는 판단 순서"
      scenes={SCENES}
      render={(scene) => (
        <ol className="space-y-2">
          {GATES.map((gate, index) => {
            const on = scene === index + 1;
            return (
              <li key={gate.ask} className={`grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-stretch gap-2 ${on ? "" : "opacity-45"}`}>
                <div className={`rounded-lg border p-2 text-xs font-bold leading-5 sm:p-2.5 sm:text-sm sm:leading-6 ${on ? "border-primary" : "border-border/60"}`}>
                  {index + 1}. {gate.ask}
                </div>
                <div className={`rounded-lg border border-dashed p-2 text-xs leading-5 sm:p-2.5 ${on ? "border-primary" : "border-border/60"}`}>
                  <span className="font-bold">{gate.side} → </span>
                  <span className="text-muted-foreground">{gate.out}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
