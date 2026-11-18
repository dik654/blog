import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 셋째 문단 — 아이켄그린·하우스만(1999)의 '원죄'.
 * 페소를 벌고 오래 걸리는 사업의 조달을 통화(페소·달러) × 만기(장기·단기) 네 칸으로 놓는다.
 * 원죄 = 자국 통화로 해외에서 못 빌리고 국내에서도 장기로 못 빌림 → 페소·장기 칸이 막힌다.
 * 남은 칸은 통화 불일치, 만기 불일치, 또는 둘 다. 마지막 장면의 충격 경로는 #mechanism(평가절하)과 #comparison(이자 10→18)에서 온다.
 */
type CellKey = "pesoLong" | "pesoShort" | "dollarLong" | "dollarShort";

const CELLS: readonly { key: CellKey; currency: string; maturity: string; mismatch: string; shock: string }[] = [
  { key: "pesoLong", currency: "페소", maturity: "장기", mismatch: "짝이 맞는 조달", shock: "" },
  { key: "pesoShort", currency: "페소", maturity: "단기", mismatch: "만기 불일치", shock: "사업이 끝나기 전에 다시 빌려야 해, 그때 금리가 올라 있으면 이자가 늘어납니다" },
  { key: "dollarLong", currency: "달러", maturity: "장기", mismatch: "통화 불일치", shock: "평가절하하면 달러 부채를 갚는 데 드는 페소가 늘어납니다" },
  { key: "dollarShort", currency: "달러", maturity: "단기", mismatch: "통화 + 만기 불일치", shock: "다시 빌릴 때의 금리와 평가절하를 함께 맞습니다" },
];

const SCENES = [
  { label: "페소를 버는 장기 사업", summary: "짝이 맞는 칸은 하나", step: 0, note: "페소로 돈을 벌고 오래 걸리는 사업이라면, 페소로 길게 빌리는 칸이 버는 통화와 갚는 기간이 맞는 조달입니다. 나머지 세 칸은 통화나 만기 가운데 하나 이상이 어긋납니다." },
  { label: "원죄: 그 칸이 막힙니다", summary: "해외에선 페소로, 국내에선 길게 못 빌림", step: 1, note: "원죄(original sin)는 자국 통화로는 해외에서 빌릴 수 없고 국내에서도 장기로 빌릴 수 없는 상태입니다. 해외에서도 국내에서도 페소·장기 칸을 채울 수 없습니다." },
  { label: "남은 칸은 모두 불일치", summary: "통화 또는 만기, 하나는 피할 수 없음", step: 2, note: "남은 세 칸은 페소를 버는 사업을 달러로 조달하는 통화 불일치, 장기 사업을 단기 대출로 조달하는 만기 불일치, 또는 둘 다입니다. 그래서 논문은 금융 취약성이 불가피하다고 설명합니다." },
  { label: "금리와 환율이 움직이면", summary: "불일치마다 다른 경로", step: 3, note: "만기가 짧으면 다시 빌릴 때의 금리에, 달러로 빌리면 평가절하에 노출됩니다(7절). 3절 둘째 해의 이자 10→18은 이 노출이 금리 상승 때 외화 잔액을 뒤집는 모습을 단순화한 것입니다." },
] as const;

export default function OriginalSinGridViz() {
  return (
    <SceneShell
      eyebrow="통화 × 만기"
      title="원죄 상태에서는 네 칸 중 맞는 칸이 막힙니다"
      description="칸 하나가 조달 방법 하나입니다. 가로는 빌리는 통화, 세로는 갚는 기간입니다. 페소는 본문처럼 그 나라의 자국 통화를 뜻하고, 사업은 설명용 가정입니다."
      ariaLabel="페소를 버는 장기 사업의 조달을 통화와 만기 네 칸으로 나눈 원죄 설명"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        const cell = (key: CellKey) => CELLS.find((item) => item.key === key) ?? CELLS[0];
        const renderCell = (key: CellKey) => {
          const item = cell(key);
          const isMatch = key === "pesoLong";
          const blocked = isMatch && step >= 1;
          const lit = isMatch ? step === 0 : step >= 2;
          const border = blocked ? "#dc2626" : lit ? (isMatch ? "#16a34a" : "#d97706") : "#cbd5e1";
          return (
            <div key={key} className="flex min-h-[8.5rem] min-w-0 flex-col gap-1 rounded-lg border px-2 py-2 text-xs leading-5 sm:text-sm" style={{ borderColor: border, borderStyle: blocked ? "dashed" : "solid" }}>
              <span className={`font-semibold ${lit || blocked ? "" : "text-muted-foreground/60"}`}>{item.currency}로 {item.maturity} 대출</span>
              <span className="font-semibold" style={{ color: blocked ? "#dc2626" : lit ? border : "#94a3b8" }}>
                {blocked ? "✕ 빌릴 수 없음" : item.mismatch}
              </span>
              <span className={`text-[11px] leading-4 text-muted-foreground sm:text-xs ${(blocked && step < 3) || (step === 3 && item.shock) ? "" : "invisible"}`}>
                {blocked ? "해외: 페소로 못 빌림 · 국내: 길게 못 빌림" : item.shock || "−"}
              </span>
            </div>
          );
        };
        return (
          <div className="mx-auto min-w-0 max-w-[34rem]">
            <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)] gap-2">
              <span />
              <span className="text-center text-xs font-semibold text-muted-foreground">페소로</span>
              <span className="text-center text-xs font-semibold text-muted-foreground">달러로</span>
              <span className="self-center text-center text-xs font-semibold text-muted-foreground">장기</span>
              {renderCell("pesoLong")}
              {renderCell("dollarLong")}
              <span className="self-center text-center text-xs font-semibold text-muted-foreground">단기</span>
              {renderCell("pesoShort")}
              {renderCell("dollarShort")}
            </div>
          </div>
        );
      }}
    />
  );
}
