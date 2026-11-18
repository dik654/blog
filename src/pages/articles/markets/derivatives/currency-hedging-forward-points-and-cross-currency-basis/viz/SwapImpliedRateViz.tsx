import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 교차통화 베이시스 = 스왑으로 빌리는 비용이 무위험 금리 차이만으로 계산한 수준에서 벗어나는 정도.
 * 직접 차입: 1달러 × (1 + 0.05×0.25) = 1.0125달러 상환.
 * 스왑 길: 1,350원을 3%로 빌림 → 오늘 1달러로 교환 → 석 달 뒤 1,360.125원 상환이 필요
 *          → 3절 선도 약 1,343.3원으로 되바꾸면 필요한 달러 1,360.125 ÷ 1,343.3 = 1.0125달러 → 암묵 달러 금리 5%.
 * 실제 호가가 이 선도에서 벗어나는 크기와 방향은 본문에 없으므로 숫자를 적지 않습니다.
 */
const SPOT = 1350;
const YEARS = 0.25;
const KRW_LATER = SPOT * (1 + 0.03 * YEARS);
const USD_REPAY = 1 + 0.05 * YEARS;
const FORWARD = KRW_LATER / USD_REPAY;
const IMPLIED_USD = KRW_LATER / FORWARD;
const IMPLIED_RATE = ((IMPLIED_USD - 1) / YEARS) * 100;

const fmt = (value: number, digits: number) => value.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const SCENES = [
  { label: "현금시장에서 직접", summary: "1달러 빌림 → 1.0125달러 상환", step: 0, note: "달러를 현금시장에서 연 5%로 석 달 빌리면 1달러에 5% × 0.25 = 1.25%가 붙어 1.0125달러를 갚습니다. 이것이 비교 기준인 달러 금리입니다." },
  { label: "스왑 ① 원화를 빌려 바꿈", summary: "1,350원 빌림 → 오늘 1달러", step: 1, note: "다른 길은 원화를 연 3%로 빌린 뒤 외환스왑으로 달러를 마련하는 것입니다. 외환스왑은 오늘 두 통화를 한 번 바꾸고, 정해 둔 날 정해 둔 가격으로 되바꾸는 계약입니다. 오늘 1,350원을 1달러로 바꾸고, 석 달 뒤에는 원화 대출 1,360.125원을 갚아야 합니다." },
  { label: "스왑 ② 석 달 뒤 되바꿈", summary: `1,360.125 ÷ ${fmt(FORWARD, 1)} = ${fmt(IMPLIED_USD, 4)}달러`, step: 2, note: `되바꾸는 가격이 3절의 선도 약 ${fmt(FORWARD, 1)}원이면 원화 1,360.125원을 받으려고 넘길 달러는 1,360.125 ÷ ${fmt(FORWARD, 1)} = ${fmt(IMPLIED_USD, 4)}달러입니다. 오늘 받은 1달러에 석 달 뒤 ${fmt(IMPLIED_USD, 4)}달러를 내는 셈이라 스왑으로 빌린 달러의 암묵 금리는 연 ${fmt(IMPLIED_RATE, 1)}%입니다.` },
  { label: "두 길이 같으면", summary: "암묵 5% = 현금 5% → 차이 0", step: 3, note: "3절의 선도는 두 금리 차이만으로 계산한 값이라 두 길의 비용이 정확히 같습니다. 무위험 금리 차이만으로 계산한 수준에서 벗어난 틈이 없으니 이 교과서 계산에서는 교차통화 베이시스가 0입니다." },
  { label: "실제 호가가 벗어나면", summary: "암묵 금리 ≠ 현금 금리 → 그 틈", step: 4, note: "실제 스왑 시장의 선도 호가가 이 계산값과 다르면 되바꿀 때 넘길 달러가 1.0125와 달라지고, 스왑으로 빌린 달러의 비용이 현금 금리 5%에서 벗어납니다. 그 틈이 교차통화 베이시스이며 본문은 달러 조달 수요, 대차대조표 비용, 신용·유동성 제약이 여기에 들어간다고 설명합니다. 틈의 크기와 방향은 본문에 없어 숫자를 적지 않았습니다." },
] as const;

function Box({ title, lines, active, color }: { title: string; lines: readonly string[]; active: boolean; color: string }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-xs leading-5 sm:text-sm ${active ? "" : "border-dashed text-muted-foreground/50"}`} style={{ borderColor: active ? color : undefined }}>
      <span className="block font-semibold" style={{ color: active ? color : undefined }}>{title}</span>
      {lines.map((line) => <span key={line} className="block">{line}</span>)}
    </div>
  );
}

export default function SwapImpliedRateViz() {
  return (
    <SceneShell
      eyebrow="교차통화 베이시스"
      title="달러를 직접 빌리는 길과 스왑으로 마련하는 길의 비용을 비교합니다"
      description="왼쪽은 현금시장에서 달러를 바로 빌리는 길, 오른쪽은 원화를 빌려 스왑으로 달러를 마련하는 길입니다. 3절의 현물 1,350원·원화 3%·달러 5%·석 달 단리를 그대로 씁니다."
      ariaLabel="달러 직접 차입과 원화 차입 후 외환스왑의 석 달 비용 비교와 교차통화 베이시스"
      scenes={SCENES}
      render={(index) => {
        const step = SCENES[index].step;
        const gap = step === 4;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">직접 차입 · 달러 5%</p>
                <Box title="오늘" lines={["1달러 받음"]} active color="#d97706" />
                <Box title="석 달 뒤" lines={["1.0125달러 갚음"]} active color="#d97706" />
              </div>
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">스왑 길 · 원화 3%</p>
                <Box title="오늘" lines={["1,350원 빌림", "→ 1달러로 바꿈"]} active={step >= 1} color="#2563eb" />
                <Box
                  title="석 달 뒤"
                  lines={gap ? ["되바꾸는 가격이 다르면", "넘길 달러 ≠ 1.0125"] : ["1,360.125원 갚을 몫을", `${fmt(IMPLIED_USD, 4)}달러로 되삼`]}
                  active={step >= 2}
                  color="#2563eb"
                />
              </div>
            </div>
            <div className={`rounded-lg border px-3 py-2 text-center text-xs leading-6 sm:text-sm ${step >= 3 ? (gap ? "border-[#dc2626]" : "border-[#16a34a]") : "border-dashed border-border/60 text-muted-foreground/60"}`}>
              {step < 3 ? (
                <span>두 길의 석 달 비용을 아직 비교하지 않았습니다</span>
              ) : gap ? (
                <span><strong>스왑 암묵 금리 − 현금 금리 = 교차통화 베이시스</strong> (크기·방향은 움직일 수 있음)</span>
              ) : (
                <span><strong>암묵 {fmt(IMPLIED_RATE, 1)}% − 현금 5.0% = 0</strong> (교과서 계산)</span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
