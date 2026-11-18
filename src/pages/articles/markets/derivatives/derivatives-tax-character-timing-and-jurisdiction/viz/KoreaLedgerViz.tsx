import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 두 번째 문단 — 2026-10-09 확인한 국세청 안내 기준.
 * (가정) 손익 1 = 100만 원 → 이익 1,200만 − 손실 500만 = 순손익 700만.
 * 700 − 기본공제 250 = 과세표준 450 → ×10%(한시 탄력세율) = 45 → +지방소득세 4.5 = 49.5(만 원).
 */
const ROWS = [
  { key: "gain", label: "이익", value: 1200, color: "#16a34a", from: 0, op: "+12 → 1,200만" },
  { key: "loss", label: "손실", value: -500, color: "#dc2626", from: 0, op: "−5 → −500만" },
  { key: "net", label: "순손익", value: 700, color: "#64748b", from: 0, op: "1,200 − 500" },
  { key: "deduction", label: "기본공제", value: -250, color: "#d97706", from: 1, op: "연 250만" },
  { key: "base", label: "과세표준", value: 450, color: "#2563eb", from: 1, op: "700 − 250" },
  { key: "tax", label: "양도소득세", value: 45, color: "#7c3aed", from: 2, op: "450 × 10%" },
  { key: "local", label: "지방소득세", value: 4.5, color: "#7c3aed", from: 3, op: "45 × 10%" },
  { key: "total", label: "납부 합계", value: 49.5, color: "#7c3aed", from: 3, op: "45 + 4.5" },
] as const;

const SCALE = 1200;

const SCENES = [
  { label: "파생상품 장부 안에서 통산", summary: "1,200만 − 500만 = 700만", note: "이익 12와 손실 5를 같은 과세 범위의 파생상품으로 보고, 손익 1을 100만 원으로 읽었습니다(가정). 다른 자산의 양도손익과 섞지 않고 이 장부 안에서만 계산합니다." },
  { label: "기본공제 250만 원", summary: "700만 − 250만 = 450만", note: "국내외 파생상품 양도소득을 합쳐 연 250만 원을 공제하고 남은 450만 원이 과세표준입니다." },
  { label: "세율 10%", summary: "450만 × 10% = 45만", note: "기본세율은 20%이지만 한시 탄력세율 10%가 적용된다는 안내를 따랐습니다. 한시 세율이므로 거래연도에 따라 달라질 수 있습니다." },
  { label: "지방소득세를 더합니다", summary: "45만 + 4.5만 = 49.5만", note: "지방소득세는 양도소득세의 10%인 4.5만 원이고, 둘을 합친 49.5만 원을 다음 해 5월 1일~31일에 신고·납부하는 흐름입니다. 범위·세율·공제는 개정될 수 있습니다." },
] as const;

function amount(value: number) {
  const abs = Math.abs(value).toLocaleString("en-US");
  return `${value < 0 ? "−" : ""}${abs}만`;
}

export default function KoreaLedgerViz() {
  return (
    <SceneShell
      eyebrow="한국 파생상품 양도소득세"
      title="순손익 700만 원이 세액 49.5만 원이 되기까지"
      description="막대 길이는 1,200만 원을 기준으로 한 금액입니다. 2026-10-09 확인한 국세청 안내 기준이며, 손익 1을 100만 원으로 읽은 것은 가정입니다."
      ariaLabel="한국 거주 개인의 파생상품 순손익 700만 원에서 기본공제, 세율 10퍼센트, 지방소득세를 차례로 적용해 49.5만 원을 구하는 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="space-y-2">
            {ROWS.map((row) => {
              const on = active >= row.from;
              const width = `${Math.max((Math.abs(row.value) / SCALE) * 100, 0.6)}%`;
              const strong = row.key === "net" || row.key === "base" || row.key === "total";
              return (
                <div key={row.key} className={`grid grid-cols-[4.75rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:text-sm ${on ? "" : "opacity-25"}`}>
                  <span className={strong ? "font-bold" : "text-muted-foreground"}>{row.label}</span>
                  <div className="min-w-0">
                    <div className="h-3.5 rounded-sm bg-muted/40">
                      <div className="h-full rounded-sm" style={{ width: on ? width : "0%", backgroundColor: row.color }} />
                    </div>
                    <span className="block truncate text-[11px] text-muted-foreground">{on ? row.op : " "}</span>
                  </div>
                  <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{on ? amount(row.value) : ""}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded-lg border border-dashed border-border px-3 py-2 text-xs leading-5 text-muted-foreground">
            다른 자산의 양도손익은 이 장부에 섞지 않습니다.
          </div>
        </div>
      )}
    />
  );
}
