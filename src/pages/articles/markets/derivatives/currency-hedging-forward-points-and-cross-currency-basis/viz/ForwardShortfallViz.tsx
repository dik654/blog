import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 100만 달러 전부 선도 매도, 실제 매출 60만 → 부족 40만 달러를 시장에서 사서 이행.
 * 대안: 확정 채권 80만 달러만 먼저 헤지하고 나머지 예상 주문(100 − 80 = 20)은 도착할 때 나누어 추가.
 * 막대 단위는 만 달러, 축 끝은 100.
 */
const FULL = 100;

const SCENES = [
  { label: "예상 매출 전부를 미리 팔면", summary: "선도 매도 100 = 예상 매출 100", sales: 100, forward: 100, confirmed: null, note: "석 달 뒤 받을 것으로 예상한 100만 달러 전부를 선도로 팔았습니다. 계획대로라면 들어온 달러를 그대로 넘겨 약속을 지키고 원화 수입이 고정됩니다." },
  { label: "실제 매출이 60이면", summary: "100 − 60 = 부족 40만 달러", sales: 60, forward: 100, confirmed: null, note: "선도로 넘기기로 한 수량은 100만 달러 그대로인데 들어온 달러는 60만입니다. 부족한 40만 달러는 결제 때 시장에서 사서 넘겨야 합니다. 환율은 고정했지만 판매량 위험이 새 통화 포지션으로 바뀐 것입니다." },
  { label: "확정분만 먼저 헤지하면", summary: "선도 80 · 나머지는 도착할 때 추가", sales: 100, forward: 80, confirmed: 80, note: "다른 방법은 확정 채권 80만 달러만 먼저 선도로 팔고, 예상 주문은 도착할 때 나누어 추가하는 것입니다. 헤지 비율은 기초 노출과 헤지 수단이 함께 움직이는 정도, 취소 가능성, 현금 한도로 정합니다." },
] as const;

function Row({ label, children, value }: { label: string; children: ReactNode; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:grid-cols-[6.5rem_minmax(0,1fr)_4rem] sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex h-6 min-w-0 overflow-hidden rounded-sm bg-muted/40">{children}</div>
      <span className="text-right font-mono">{value}</span>
    </div>
  );
}

function Segment({ width, color, dashed = false, text }: { width: number; color: string; dashed?: boolean; text?: string }) {
  if (width <= 0) return null;
  return (
    <span
      className={`flex h-full items-center justify-center truncate text-[11px] font-semibold ${dashed ? "border border-dashed" : "text-white"}`}
      style={{ width: `${(width / FULL) * 100}%`, backgroundColor: dashed ? "transparent" : color, borderColor: dashed ? color : undefined, color: dashed ? color : undefined }}
    >
      {width >= 35 ? text : null}
    </span>
  );
}

export default function ForwardShortfallViz() {
  return (
    <SceneShell
      eyebrow="수량 위험"
      title="미리 판 달러보다 덜 벌면 모자란 만큼 시장에서 사야 합니다"
      description="막대 단위는 만 달러이고 끝이 100만 달러입니다. 위 막대는 석 달 뒤 들어오는 매출 달러, 아래 막대는 선도로 넘기기로 약속한 달러입니다."
      ariaLabel="100만 달러 선도 매도 뒤 실제 매출 60만 달러일 때 생기는 부족분 40만 달러와 확정분 80만 달러 헤지"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const shortfall = Math.max(scene.forward - scene.sales, 0);
        const covered = Math.min(scene.sales, scene.forward);
        return (
          <div className="min-w-0 space-y-3">
            <Row label="매출 달러" value={`${scene.sales}만`}>
              {scene.confirmed === null ? (
                <Segment width={scene.sales} color="#2563eb" text={index === 0 ? "예상 매출" : "실제 매출"} />
              ) : (
                <>
                  <Segment width={scene.confirmed} color="#2563eb" text="확정 채권 80" />
                  <Segment width={scene.sales - scene.confirmed} color="#2563eb" dashed text="예상 20" />
                </>
              )}
            </Row>
            <Row label="선도 인도 약속" value={`${scene.forward}만`}>
              <Segment width={covered} color="#16a34a" text={scene.confirmed === null ? "매출로 이행" : "선도 80"} />
              <Segment width={shortfall} color="#dc2626" dashed text="부족 40" />
              {scene.confirmed !== null ? <Segment width={FULL - scene.forward} color="#64748b" dashed text="도착 시 추가" /> : null}
            </Row>
            <div
              className={`rounded-lg border px-3 py-2 text-xs leading-6 sm:text-sm ${shortfall > 0 ? "border-[#dc2626]" : "border-border"}`}
            >
              {shortfall > 0 ? (
                <span><strong>부족 {shortfall}만 달러</strong> → 결제 때 그날 시장 환율로 사서 넘겨야 함 (미리 정해진 가격 없음)</span>
              ) : scene.confirmed === null ? (
                <span>들어온 달러가 약속한 수량과 같아 시장에서 더 살 달러가 없음</span>
              ) : (
                <span>선도 80은 확정 채권에 맞춤 · <strong>점선 20</strong>은 100 − 80으로 둔 예상 주문(본문에 금액 없음)으로, 선도 없이 두었다가 주문이 도착할 때 수량을 정함</span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
