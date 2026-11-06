import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설탕 판매액 100(가정)을 칸으로 나눕니다.
 * 운송·정제·보험 35 + 도구·식량 10 + 세금 10 = 55, 잔여 100 − 55 = 45.
 * 마지막 장면의 임금은 글이 금액을 정하지 않았으므로 칸 수로 세지 않고 45칸 전체에 점선 테두리만 둡니다.
 */
const COLOR = { transport: "#64748b", tools: "#a8a29e", tax: "#0f766e", residual: "#d97706", wage: "#2563eb", idle: "#cbd5e1" };

const SCENES = [
  { label: "판매액 100", summary: "칸 하나 = 1", note: "시장에 기록된 금액을 100칸으로 놓았습니다. 실제 역사 평균이 아니라 장부 경계를 보기 위한 가정입니다." },
  { label: "기록된 비용과 세금", summary: "35 + 10 + 10 = 55", note: "운송·정제·보험, 도구와 최소한의 식량, 제국 세금은 장부에 금액으로 적힙니다. 합하면 55칸입니다." },
  { label: "남는 몫과 임금 0", summary: "100 − 55 = 45", note: "남은 45칸이 소유주의 잔여, 곧 판매액에서 기록된 비용을 빼고 남은 몫입니다. 이 장부에서 노예로 만든 사람의 임금 청구는 0이라 칸을 하나도 차지하지 못합니다." },
  { label: "장부에 없는 손실", summary: "금액 없음", note: "이동의 자유, 가족 분리, 폭력, 조기 사망은 비용 항목으로 잡히지 않습니다. 이 글이 금액을 정하지 않았으므로 칸으로 세지 않고 점선 상자로만 둡니다." },
  { label: "임금을 인정한다면 (가정)", summary: "잔여 = 45 − 임금", note: "판매액과 다른 비용을 그대로 두고 임금이 장부에 오른다고 해 봅니다. 글이 금액을 정하지 않아 몇 칸인지 세지 않고, 점선 테두리를 친 45칸 안에서 나간다고만 표시했습니다. 어떤 청구권을 인정하느냐가 잔여의 크기를 바꾼다는 뜻입니다." },
] as const;

function cellColor(index: number, active: number) {
  if (active === 0) return COLOR.idle;
  if (index < 35) return COLOR.transport;
  if (index < 45) return COLOR.tools;
  if (index < 55) return COLOR.tax;
  if (active === 1) return COLOR.idle;
  return COLOR.residual;
}

function Row({ color, name, value, on, dashed = false }: { color: string; name: string; value: string; on: boolean; dashed?: boolean }) {
  return (
    <div className={`grid grid-cols-[0.75rem_minmax(0,1fr)_auto] items-center gap-2 text-sm ${on ? "" : "opacity-40"}`}>
      <span className="h-3 w-3 rounded-sm border" style={dashed ? { borderColor: color, borderStyle: "dashed" } : { backgroundColor: color, borderColor: color }} />
      <span className="min-w-0">{name}</span>
      <span className="font-mono font-bold">{value}</span>
    </div>
  );
}

export default function LedgerBoundaryViz() {
  return (
    <SceneShell
      eyebrow="장부의 경계"
      title="설탕 판매액 100칸에 들어간 것과 들어가지 못한 것"
      description="칸 하나가 판매액 1입니다. 모든 수는 장부 경계를 보기 위한 가정입니다. 잔여는 판매액에서 기록된 비용을 빼고 소유주에게 남는 몫입니다."
      ariaLabel="설탕 판매액 100을 비용과 잔여로 나누고 장부 밖 손실을 따로 두는 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 grid-cols-[8rem_minmax(0,1fr)] gap-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-x-6">
          <div className="grid w-full grid-cols-10 gap-0.5 self-start sm:row-span-2" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: 100 }, (_, index) => (
              <span key={index} className="aspect-square rounded-[2px]" style={active === 4 && index >= 55 ? { backgroundColor: cellColor(index, active), outline: `1px dashed ${COLOR.wage}`, outlineOffset: "-1px" } : { backgroundColor: cellColor(index, active) }} />
            ))}
          </div>
          <div className={`min-w-0 rounded-lg border border-dashed px-3 py-2 text-sm leading-6 sm:col-start-2 sm:row-start-2 ${active >= 3 ? "border-red-600" : "border-border opacity-40"}`}>
            <span className="block font-semibold">장부 밖 · 금액 없음</span>
            이동의 자유, 가족 분리, 폭력, 조기 사망
          </div>
          <div className="col-span-2 min-w-0 space-y-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
            <Row color={COLOR.transport} name="운송·정제·보험" value={active >= 1 ? "35" : "−"} on={active >= 1} />
            <Row color={COLOR.tools} name="도구·최소한의 식량" value={active >= 1 ? "10" : "−"} on={active >= 1} />
            <Row color={COLOR.tax} name="제국 세금" value={active >= 1 ? "10" : "−"} on={active >= 1} />
            <Row color={COLOR.residual} name="소유주 잔여" value={active >= 4 ? "45 − 임금" : active >= 2 ? "45" : "−"} on={active >= 2} />
            <Row color={COLOR.wage} name="노예로 만든 사람의 임금 청구" value={active >= 4 ? "금액 없음" : active >= 2 ? "0" : "−"} on={active >= 2} dashed={active >= 4} />
          </div>
        </div>
      )}
    />
  );
}
