import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 생우 계약은 인도증서·승인 시설을 거쳐 계량·등급·소유권 이전으로,
 * 비육우 계약은 현물시장의 적격 거래 자료 → 지수 → 지수에 맞춰 닫힘(현금정산)으로 간다.
 * 남는 확인 작업은 #overview 둘째 문단과 #need 둘째 문단(베이시스)을 따른다.
 */
const LIVE = ["인도증서", "승인 가축시장·도축장", "운송·계량·등급 판정", "소유권 이전"] as const;
const FEEDER = ["현물시장 적격 거래 자료", "지수 계산", "지수와 마지막 선물가격의 차이 × 5만 lb", "현금으로 닫힘"] as const;

const SCENES = [
  { label: "만기에서 갈라집니다", summary: "같은 소 가격 · 다른 마지막 작업", live: 0, feeder: 0, note: "두 계약 모두 소 가격을 헤지하지만 만기에 가는 곳이 다릅니다. 생우는 실제 동물이, 비육우는 거래 자료 묶음이 마지막 단계로 갑니다." },
  { label: "생우 · 실제 소가 움직입니다", summary: "4만 lb · 인도증서 → 소유권 이전", live: 4, feeder: 0, note: "생우 계약은 인도증서와 승인 시설을 거쳐 실제 소를 계량하고 등급을 판정한 뒤 소유권을 넘깁니다. 품질과 수율이 기준에서 벗어나면 정산금액을 조정합니다." },
  { label: "비육우 · 거래 자료가 모입니다", summary: "5만 lb · 지수로 정산", live: 4, feeder: 4, note: "비육우 계약은 현물시장의 적격 거래 자료로 계산한 지수에 맞춰 닫힙니다. 특정 소 떼를 받을 준비는 하지 않습니다." },
  { label: "각 길에 남는 확인", summary: "등급·시설 / 지수 반영·베이시스", live: 4, feeder: 4, note: "생우 쪽은 등급·무게·도축장·운송을 맞추고, 비육우 쪽은 현물 거래 자료가 지수에 제대로 들어갔는지 확인합니다. 지역·무게·거래 방식이 내 사업장과 다르면 현금정산 뒤에도 지수와 내 사업장 가격의 차이, 곧 베이시스가 남습니다." },
] as const;

function Lane({ title, steps, reached, color, residual, showResidual }: { title: string; steps: readonly string[]; reached: number; color: string; residual: string; showResidual: boolean }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-sm font-bold" style={{ color: reached > 0 ? color : undefined }}>{title}</p>
      {steps.map((step, i) => (
        <div key={step} className="min-w-0">
          {i > 0 ? <div className="text-center font-mono text-[10px] leading-3" style={{ color: i < reached ? color : "#cbd5e1" }}>↓</div> : null}
          <div
            className={`rounded-lg border px-2 py-1 text-center text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${i < reached ? "opacity-100" : "opacity-35"}`}
            style={{ borderColor: i < reached ? color : "#cbd5e1" }}
          >
            {step}
          </div>
        </div>
      ))}
      <div className={`mt-2 rounded-lg border border-dashed px-2 py-1.5 text-xs leading-5 ${showResidual ? "" : "invisible"}`} style={{ borderColor: color }}>
        {residual}
      </div>
    </div>
  );
}

export default function PathSplitViz() {
  return (
    <SceneShell
      eyebrow="만기의 두 길"
      title="생우는 가축시장으로, 비육우는 거래자료 묶음으로 갑니다"
      description="비육우는 비육 전 단계의 소이고, 그 선물은 공개 현물지수로 현금정산합니다. 테두리가 진한 칸이 지금 장면까지 지난 단계입니다."
      ariaLabel="생우 선물의 실물인도 경로와 비육우 선물의 지수 현금정산 경로, 각 경로에 남는 확인 작업"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-3">
            <p className="text-center text-xs text-muted-foreground"><strong className="text-foreground">만기</strong> · 소 가격 헤지 계약이 두 길로 갈라집니다</p>
            <div className="grid grid-cols-2 gap-3">
              <Lane title="생우 4만 lb · 실물인도" steps={LIVE} reached={scene.live} color="#b45309" residual="남는 확인: 등급·무게·도축장·운송, 품질·수율 조정" showResidual={index === 3} />
              <Lane title="비육우 5만 lb · 현금정산" steps={FEEDER} reached={scene.feeder} color="#2563eb" residual="남는 확인: 지수 반영, 지수와 사업장 가격의 차이(베이시스)" showResidual={index === 3} />
            </div>
          </div>
        );
      }}
    />
  );
}
