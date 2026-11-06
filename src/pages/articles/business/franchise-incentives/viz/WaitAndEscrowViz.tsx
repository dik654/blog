import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 가맹사업법 제7조 제3항·제11조 제1항의 14일(자문 시 7일)과 제6조의5의 가맹금 예치.
 * 칸 하나는 기간 하루의 길이이며, 초일 계산 방식을 본문이 정하지 않아 허용되는 첫 날짜는 적지 않는다.
 * 3천만 원은 본문의 가맹비 가정이고 월매출 사례와 다른 돈이다.
 */
const SCENES = [
  { label: "문서를 받은 날부터 기다립니다", summary: "정보공개서: 14일", days: 14, second: false, blocked: false, money: 0, note: "등록된 정보공개서와 인근 가맹점 현황 문서를 받은 날이 11월 2일(가정)입니다. 14일이 지나기 전에는 본부가 가맹금을 받거나 계약을 맺을 수 없습니다." },
  { label: "바로 다음 날 계약금을 받으면", summary: "11월 3일 → 금지에 걸립니다", days: 14, second: false, blocked: true, money: 0, note: "표시한 칸이 그다음 날입니다. 첫날을 어떻게 세든 14일 안쪽입니다. 계약을 서두르자는 말보다 이 기간이 먼저입니다." },
  { label: "자문을 받은 경우", summary: "14일 → 7일", days: 7, second: false, blocked: false, money: 0, note: "변호사나 가맹거래사(같은 법 제27조의 자격을 갖춘 가맹사업 자문인)의 자문을 받았다면 기간이 7일로 줄어듭니다." },
  { label: "계약서 문서에도 같은 기간", summary: "계약서 내용 문서: 14일(자문 시 7일)", days: 14, second: true, blocked: false, money: 0, note: "가맹계약서 내용을 담은 문서에도 같은 기간이 적용됩니다. 그림은 두 문서를 같은 날 받았다고 놓은 가정이며, 어떤 날짜부터 허용되는지까지 계산해 적지는 않았습니다." },
  { label: "돈을 낸 뒤의 원칙", summary: "가맹비 3천만 원(가정) → 예치기관", days: 14, second: true, blocked: false, money: 1, note: "점주가 내는 가맹금은 원칙적으로 본부 계좌가 아니라 대통령령으로 정한 예치기관으로 갑니다. 이 3천만 원은 앞 사례의 월매출과 다른 돈입니다." },
  { label: "예치의 예외", summary: "피해보상보험계약 등을 맺은 경우", days: 14, second: true, blocked: false, money: 2, note: "본부가 제15조의2의 가맹점사업자피해보상보험계약 등을 맺은 경우에만 예외가 됩니다." },
] as const;

function DayStrip({ label, days, blocked, dim }: { label: string; days: number; blocked: boolean; dim: boolean }) {
  return (
    <div className={dim ? "opacity-30" : ""}>
      <p className="text-xs font-semibold">{label}</p>
      <div className="mt-1 grid gap-[2px]" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
        {Array.from({ length: 14 }, (_, index) => {
          const on = index < days;
          const stop = blocked && index === 0;
          return (
            <div
              key={index}
              className={`flex h-6 items-center justify-center rounded-sm border text-[11px] font-bold ${on ? "" : "border-dashed border-border"}`}
              style={on ? { backgroundColor: stop ? "#dc2626" : "#fde68a", borderColor: stop ? "#dc2626" : "#d97706", color: stop ? "#ffffff" : "#92400e" } : undefined}
            >
              {stop ? "✕" : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WaitAndEscrowViz() {
  return (
    <SceneShell
      eyebrow="서명 전후의 순서"
      title="서명 전에는 기다리고, 낸 돈은 맡겨 둡니다"
      description="칸 하나가 기간의 하루입니다. 날짜와 금액은 본문의 가정입니다. 한국 가맹사업법 2026-10-02 시행본, 2026-10-09 확인 기준입니다."
      ariaLabel="문서 제공 뒤 14일 또는 7일의 대기 기간과 가맹금의 예치 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const toEscrow = scene.money === 1;
        const toHq = scene.money === 2;
        return (
          <div className="min-w-0">
            <div className="space-y-3">
              <DayStrip label="정보공개서·인근 가맹점 현황 문서" days={scene.days} blocked={scene.blocked} dim={scene.money > 0} />
              <DayStrip label="가맹계약서 내용 문서" days={scene.days} blocked={false} dim={!scene.second || scene.money > 0} />
            </div>
            <svg viewBox="0 0 360 96" className={`mx-auto mt-4 h-auto w-full max-w-[520px] text-foreground ${scene.money === 0 ? "opacity-30" : ""}`} role="img" aria-label={scene.money === 0 ? "가맹금 경로, 이 장면에서는 아직 돈을 내지 않음" : scene.summary}>
              <rect x={4} y={28} width={104} height={40} rx={8} fill="none" stroke="#94a3b8" />
              <text x={56} y={45} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">점주의 가맹금</text>
              <text x={56} y={60} textAnchor="middle" fontSize={11} fill="#64748b">3천만 원(가정)</text>
              <rect x={236} y={4} width={120} height={36} rx={8} fill="none" stroke={toEscrow ? "#2563eb" : "#94a3b8"} />
              <text x={296} y={27} textAnchor="middle" fontSize={12} fontWeight={700} fill={toEscrow ? "#2563eb" : "currentColor"}>예치기관</text>
              <rect x={236} y={56} width={120} height={36} rx={8} fill="none" stroke={toHq ? "#d97706" : "#94a3b8"} />
              <text x={296} y={79} textAnchor="middle" fontSize={12} fontWeight={700} fill={toHq ? "#d97706" : "currentColor"}>본부 계좌</text>
              <path d="M 108 42 L 228 24" fill="none" stroke={toEscrow ? "#2563eb" : "#94a3b8"} strokeWidth={toEscrow ? 1.25 : 1} />
              <path d="M 228 24 L 220 22 L 222 30 Z" fill={toEscrow ? "#2563eb" : "#94a3b8"} />
              <text x={160} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={toEscrow ? "#2563eb" : "#64748b"}>원칙</text>
              <path d="M 108 56 L 228 72" fill="none" stroke={toHq ? "#d97706" : "#94a3b8"} strokeWidth={toHq ? 1.25 : 1} strokeDasharray="4 3" />
              <path d="M 228 72 L 222 66 L 220 74 Z" fill={toHq ? "#d97706" : "#94a3b8"} />
              <text x={160} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill={toHq ? "#d97706" : "#64748b"}>예외일 때만</text>
            </svg>
          </div>
        );
      }}
    />
  );
}
