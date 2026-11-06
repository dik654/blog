import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 깨끗한 거리만으로는 납부 여부를 구분할 수 없다.
 * 칸 = 가게 1곳. 10×2만원=20만원, 8×2만원=16만원(청소비와 같음). 미납 2곳은 설명용 가정.
 */
type Pay = "hidden" | "paid" | "unpaid" | "check";

const SCENES = [
  { label: "거리만 봅니다", summary: "가게 10곳 · 납부 여부는 안 보임", pay: 0, cleanLog: false, note: "A시장의 가게 10곳이 같은 거리를 씁니다. 청소된 거리를 아무리 봐도 어느 가게가 돈을 냈는지는 나타나지 않습니다." },
  { label: "10곳이 모두 냈을 때", summary: "10×2만원 = 20만원", pay: 10, cleanLog: false, note: "납부 기록에는 10곳의 납부 여부가 남습니다. 청소비 16만원을 내고 거리가 청소됩니다." },
  { label: "2곳이 안 냈을 때 (가정)", summary: "8×2만원 = 16만원", pay: 8, cleanLog: false, note: "16만원이면 청소비는 낼 수 있어 거리 모습은 앞 장면과 같을 수 있습니다. 결과만으로는 두 장면을 구분하지 못합니다." },
  { label: "두 기록을 잇습니다", summary: "납부 기록 + 청소 기록", pay: 8, cleanLog: true, note: "납부 기록과 청소 기록을 연결해야 납부 약속과 구매한 서비스가 맞는지 볼 수 있습니다." },
  { label: "미납이 곧 고의는 아닙니다", summary: "미납 2곳 → 사정 확인", pay: -8, cleanLog: true, note: "미납이 언제나 고의인 것은 아니므로 사정을 확인할 절차가 필요합니다." },
] as const;

const CELL: Record<Pay, { cls: string; text: string }> = {
  hidden: { cls: "border border-dashed border-border text-muted-foreground", text: "?" },
  paid: { cls: "bg-[#2563eb] text-white", text: "냄" },
  unpaid: { cls: "border border-dashed border-[#dc2626] text-[#dc2626]", text: "×" },
  check: { cls: "border border-dashed border-[#d97706] font-bold text-[#d97706]", text: "?" },
};

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

export default function StreetRecordViz() {
  return (
    <SceneShell
      eyebrow="결과와 기여"
      title="깨끗한 거리는 같아도 납부 기록은 다를 수 있습니다"
      description="칸 하나가 가게 한 곳입니다. 금액은 글의 가정이고, 미납 2곳이 어느 가게인지는 의미가 없습니다."
      ariaLabel="청소된 거리와 납부 기록, 청소 기록의 관계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const count = Math.abs(scene.pay);
        const stateOf = (index: number): Pay => {
          if (scene.pay === 0) return "hidden";
          if (index < count) return "paid";
          return scene.pay < 0 ? "check" : "unpaid";
        };
        return (
          <div key={scene.label} className="min-w-0 space-y-3">
            <Row title={scene.pay === 0 ? "납부 기록 · 거리만 봐서는 알 수 없음" : "납부 기록"}>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }, (_, index) => {
                  const state = CELL[stateOf(index)];
                  return (
                    <span key={index} className={`flex h-8 items-center justify-center rounded-sm text-xs ${state.cls}`}>
                      {state.text}
                    </span>
                  );
                })}
              </div>
            </Row>
            <Row title="함께 쓰는 거리">
              <div className="flex h-9 items-center justify-center rounded-sm border border-[#16a34a] text-xs font-semibold text-[#16a34a]">청소된 거리</div>
            </Row>
            <Row title="청소 기록">
              <div className={`flex h-9 items-center justify-center rounded-sm text-xs ${scene.cleanLog ? "border border-[#2563eb] font-semibold text-[#2563eb]" : "border border-dashed border-border text-muted-foreground"}`}>
                {scene.cleanLog ? "언제 · 어디를 정리했는지" : "아직 대조하지 않음"}
              </div>
            </Row>
          </div>
        );
      }}
    />
  );
}
