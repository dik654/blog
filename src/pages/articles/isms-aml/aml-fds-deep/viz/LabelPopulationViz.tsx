import FdsSceneShell from "./FdsSceneShell";

/**
 * 본문 대응: #rules-model-chain 첫 문단 — precision과 recall은 분모가 다르고, 알려진 STR만 positive로 두면
 * 보고되지 않은 누락이 label에서 사라진다.
 * 칸 하나 = case 한 건(가정). 열린 alert 14건, 검증된 검토 대상 10건(알려진 STR 6 + 미보고 4).
 * alert가 잡은 대상 7건(STR 6 + 미보고 1) → precision 7/14 = 50%, recall 7/10 = 70%.
 * 알려진 STR만 label이면 recall 6/6 = 100%, 놓친 미보고 3건은 분모에서 사라진다.
 */
type Cell = "str" | "unreported" | "none";

const ALERT_CELLS: readonly Cell[] = [
  "str", "str", "str", "str", "str", "str", "unreported",
  "none", "none", "none", "none", "none", "none", "none",
];
const MISSED_CELLS: readonly Cell[] = ["unreported", "unreported", "unreported"];

const ALERTS = ALERT_CELLS.length;
const CAUGHT = ALERT_CELLS.filter((cell) => cell !== "none").length;
const TARGETS = CAUGHT + MISSED_CELLS.length;
const STR_CAUGHT = ALERT_CELLS.filter((cell) => cell === "str").length;

const SCENES = [
  { label: "Precision: 열린 alert 중 대상", summary: `${CAUGHT} / ${ALERTS} = ${Math.round((CAUGHT / ALERTS) * 100)}%`, note: "분모는 열린 alert 14건입니다. 그중 검증된 검토 대상이 7건이므로 alert 두 건 중 한 건꼴로 실제 검토 대상입니다." },
  { label: "Recall: 대상 중 잡아낸 것", summary: `${CAUGHT} / ${TARGETS} = ${Math.round((CAUGHT / TARGETS) * 100)}%`, note: "분모가 바뀝니다. 검증된 검토 대상 10건 가운데 alert가 연 것은 7건이고, 미보고 대상 3건은 alert 밖에 남았습니다." },
  { label: "알려진 STR만 positive라면", summary: `${STR_CAUGHT} / ${STR_CAUGHT} = 100%로 보임`, note: "미보고 대상 4건이 label에서 빠지면 alert 밖의 3건은 누락으로 세어지지 않습니다. 실제 누락은 그대로인데 recall은 100%처럼 보입니다. 그래서 quality-reviewed case·synthetic typology·독립 표본을 나눠 씁니다." },
] as const;

const STYLE: Record<Cell, { bg: string; border: string; text: string; mark: string }> = {
  str: { bg: "#2563eb", border: "#2563eb", text: "#ffffff", mark: "STR" },
  unreported: { bg: "#bfdbfe", border: "#2563eb", text: "#1e3a8a", mark: "미보고" },
  none: { bg: "transparent", border: "#94a3b8", text: "#64748b", mark: "" },
};
const UNLABELED = { bg: "transparent", border: "#94a3b8", text: "#94a3b8", mark: "label 없음" };

function Box({ cell, active, group }: { cell: Cell; active: number; group: "alert" | "missed" }) {
  const hidden = active === 2 && cell === "unreported";
  const s = hidden ? UNLABELED : STYLE[cell];
  const counted = active === 0 ? group === "alert" : active === 1 ? cell !== "none" : cell === "str";
  return (
    <span
      className="flex h-9 min-w-0 items-center justify-center rounded-md border text-[10px] font-semibold leading-3"
      style={{
        backgroundColor: s.bg,
        borderColor: s.border,
        color: s.text,
        borderStyle: hidden ? "dashed" : "solid",
        opacity: counted ? 1 : 0.4,
      }}
    >
      {s.mark}
    </span>
  );
}

export default function LabelPopulationViz() {
  return (
    <FdsSceneShell
      eyebrow="Precision · recall"
      title="같은 결과도 분모를 무엇으로 잡느냐에 따라 달라 보입니다"
      description="칸 하나가 case 한 건이고 건수는 가정입니다. 파란 칸은 검증된 검토 대상(진하게: 알려진 STR, 연하게: 보고되지 않은 대상), 빈 칸은 검토 대상이 아닌 alert입니다. STR은 금융정보분석원에 제출한 의심거래보고입니다."
      ariaLabel="열린 alert와 검증된 검토 대상으로 계산한 precision과 recall"
      scenes={SCENES}
      render={(active) => {
        const alertFocus = active === 0;
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            <div className={`min-w-0 rounded-lg border p-3 ${alertFocus ? "border-primary" : "border-border"}`}>
              <p className="mb-2 text-xs font-semibold">열린 alert {ALERTS}건{alertFocus ? " · 분모" : ""}</p>
              <div className="grid grid-cols-7 gap-1.5">
                {ALERT_CELLS.map((cell, index) => (
                  <Box key={index} cell={cell} active={active} group="alert" />
                ))}
              </div>
            </div>
            <div className={`min-w-0 rounded-lg border border-dashed p-3 ${active === 1 ? "border-red-600" : "border-border"}`}>
              <p className="mb-2 text-xs font-semibold">alert 밖 · 놓친 대상</p>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-2">
                {MISSED_CELLS.map((cell, index) => (
                  <Box key={index} cell={cell} active={active} group="missed" />
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
                {active === 2 ? "label이 없어 누락으로 세지 않음" : `${MISSED_CELLS.length}건 누락`}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
