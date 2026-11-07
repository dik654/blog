import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 0.1개 주문이 두 체결로 나뉘고 체결마다 요율이 다르다.
 * 0.04×50,000=2,000 → ×0.045%=0.90 / 0.06×50,000=3,000 → ×0.015%=0.45 / 1,000−1.35=998.65.
 */
const CELLS = Array.from({ length: 10 }, (_, index) => index);

const SCENES = [
  { label: "주문 0.1개", summary: "0.1 × 50,000 = 5,000달러", stage: 0, note: "50,000달러 이하에서 0.1개를 사겠다고 요청합니다. 칸 열 개가 아직 비어 있습니다. 모두 같은 가격에 체결되면 최종 계약 금액은 5,000달러입니다." },
  { label: "먼저 0.04개", summary: "2,000 × 0.045% = 0.90", stage: 1, note: "먼저 팔려는 물량이 0.04개뿐이면 그만큼만 체결되고 0.06개는 기다립니다. 상대 주문을 즉시 가져간 체결이라 0.045%를 냅니다." },
  { label: "나중 0.06개", summary: "3,000 × 0.015% = 0.45", stage: 2, note: "기다리던 0.06개가 같은 가격에 체결된다고 합시다. 대기 주문이 나중에 체결됐으므로 0.015%를 냅니다." },
  { label: "남은 잔액", summary: "1,000 − 1.35 = 998.65 USDC", stage: 3, note: "수수료 합계 0.90+0.45=1.35 USDC를 뺀 값입니다. 가격 손익과 펀딩(무기한 계약 보유자끼리 주고받는 정기 지급)은 아직 넣지 않았습니다." },
] as const;

function Row({ label, value, on, strong = false }: { label: string; value: string; on: boolean; strong?: boolean }) {
  return (
    <div className={`grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-t border-border/60 py-2 text-xs sm:text-sm ${on ? "" : "opacity-40"}`}>
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{on ? value : "−"}</span>
    </div>
  );
}

export default function FillFeeViz() {
  return (
    <SceneShell
      eyebrow="(가정) 한 주문의 두 체결"
      title="0.1개 주문은 어떻게 둘로 나뉘고 수수료는 어떻게 쌓일까요"
      description="칸 하나가 0.01개입니다. 가격·체결량은 가정이고, 요율은 2026-10-18 확인한 기본 0등급 무기한 계약 값입니다. 할인·소개·builder 추가비가 없는 일반 시장을 가정합니다."
      ariaLabel="0.1개 주문이 0.04개와 0.06개로 체결되며 수수료가 쌓이는 과정"
      scenes={SCENES}
      render={(active) => {
        const { stage } = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-10 gap-1" role="img" aria-label={`0.1개 중 체결 상태: ${SCENES[active].label}`}>
              {CELLS.map((cell) => {
                const first = cell < 4;
                const filled = first ? stage >= 1 : stage >= 2;
                const color = first ? "#2563eb" : "#16a34a";
                return (
                  <div
                    key={cell}
                    className="h-9 rounded-sm border"
                    style={{ borderColor: stage === 0 || !filled ? "#94a3b8" : color, borderStyle: filled ? "solid" : "dashed", backgroundColor: filled ? color : "transparent" }}
                  />
                );
              })}
            </div>
            <div className="mt-1 grid grid-cols-10 gap-1 text-xs">
              <span className={`col-span-4 font-semibold ${stage >= 1 ? "" : "opacity-40"}`} style={{ color: "#2563eb" }}>0.04개 즉시</span>
              <span className={`col-span-6 text-right font-semibold ${stage >= 1 ? "" : "opacity-40"}`} style={{ color: stage >= 2 ? "#16a34a" : undefined }}>{stage >= 2 ? "0.06개 체결" : "0.06개 대기"}</span>
            </div>
            <div className="mt-3">
              <Row label="즉시 가져간 0.04개 비용" value="0.90 USDC" on={stage >= 1} />
              <Row label="대기 후 체결된 0.06개 비용" value="0.45 USDC" on={stage >= 2} />
              <Row label="가격 손익·펀딩 전 잔액" value="998.65 USDC" on={stage >= 3} strong />
            </div>
          </div>
        );
      }}
    />
  );
}
