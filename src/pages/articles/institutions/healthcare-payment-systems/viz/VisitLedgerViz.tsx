import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 환자 2 + 공동 재원 8 = 병원 수입 10, 관련 비용 7, 차액 3 (만 원, 모두 가정).
 * 비용 범위 장면에서 막대를 늘리지 않는다. 시설 유지·공통 인건비의 금액은 본문에 없다.
 */
const SCALE = 10;
const PATIENT = "#d97706";
const POOL = "#2563eb";
const COST = "#64748b";
const REST = "#16a34a";

const SCENES = [
  { label: "병원이 받는 돈은 두 갈래입니다", summary: "2 + 8 = 10만 원", note: "창구에서 본 2만 원은 병원 수입의 일부입니다. 나머지 8만 원은 공동 재원에서 옵니다. 이 비율은 특정 국가의 본인부담률이 아닙니다." },
  { label: "같은 눈금에 비용을 놓습니다", summary: "관련 비용 7만 원", note: "병원의 관련 비용을 7만 원으로 둡니다(가정). 수입 막대와 같은 눈금이라 칸을 그대로 비교할 수 있습니다." },
  { label: "두 막대의 차이가 차액입니다", summary: "10 − 7 = 3만 원", note: "받은 10만 원에서 관련 비용 7만 원을 뺀 3만 원입니다." },
  { label: "3만 원의 뜻은 비용 범위에 달렸습니다", summary: "7만 원 안에 무엇이 있나", note: "시설 유지와 공통 인건비를 7만 원에 모두 넣었는지에 따라 3만 원의 의미도 달라집니다. 그 금액은 글에 없어 막대는 그대로 두었습니다." },
] as const;

function Segment({ value, color, label, dashed = false, on = true }: { value: number; color: string; label: string; dashed?: boolean; on?: boolean }) {
  return (
    <div
      className={`flex h-10 min-w-0 items-center justify-center rounded-sm border text-xs font-bold ${dashed ? "border-dashed" : ""} ${on ? "" : "opacity-25"}`}
      style={{ width: `${(value / SCALE) * 100}%`, borderColor: color, backgroundColor: dashed ? "transparent" : `${color}2e` }}
    >
      {label}
    </div>
  );
}

export default function VisitLedgerViz() {
  return (
    <SceneShell
      eyebrow="한 번의 진료"
      title="10만 원을 어디서 받아 어디에 쓰는지 한 눈금에 놓습니다"
      description="두 막대의 눈금이 같고 전체 폭이 10만 원입니다. 모든 금액은 설명을 위한 가정입니다."
      ariaLabel="병원 수입 10만 원의 구성과 관련 비용 7만 원, 차액 3만 원"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">병원이 받는 돈 (만 원)</p>
            <div className="flex gap-0.5">
              <Segment value={2} color={PATIENT} label="환자 2" />
              <Segment value={8} color={POOL} label="공동 재원 8" />
            </div>
          </div>
          <div className={active === 0 ? "opacity-25" : ""}>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">관련 비용과 차액 (만 원)</p>
            <div className="flex gap-0.5">
              <Segment value={7} color={COST} label="관련 비용 7" />
              <Segment value={3} color={REST} label={active >= 2 ? "차액 3" : "?"} dashed={active < 2} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs leading-5">
            <div className={`rounded-lg border border-border/70 px-3 py-2 ${active === 3 ? "" : "invisible"}`}>시설 유지가 7만 원 안에 있나?</div>
            <div className={`rounded-lg border border-border/70 px-3 py-2 ${active === 3 ? "" : "invisible"}`}>공통 인건비가 7만 원 안에 있나?</div>
          </div>
        </div>
      )}
    />
  );
}
