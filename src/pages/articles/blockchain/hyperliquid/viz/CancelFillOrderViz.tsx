import SceneShell from "./SceneShell";

/**
 * 본문 대응: #consensus — 공통 순서 안에서 체결과 취소 중 무엇이 먼저 적용됐는지가 정해진다.
 * 체결 0.04, 잔량 0.06. 먼저 체결되는 일부 0.02는 그림을 위한 가정: 포지션 0.04+0.02=0.06, 취소 0.06−0.02=0.04.
 */
const CELLS = Array.from({ length: 10 }, (_, index) => index);

const SCENES = [
  { label: "두 요청이 겹침", summary: "포지션 0.04 · 잔량 0.06", filled: 4, cancelled: 0, order: ["취소 요청", "상대 주문"], decided: false, note: "내 취소 요청과 잔량을 가져가려는 상대 주문이 비슷한 때 들어온 상황입니다. 어느 쪽이 먼저 눌렸는지가 아니라 공통 순서에 어떻게 놓이는지를 봅니다." },
  { label: "체결이 먼저", summary: "포지션 0.06 · 취소 0.04", filled: 6, cancelled: 4, order: ["상대 주문 0.02(가정)", "취소 요청"], decided: true, note: "상대 주문이 먼저 적용되면 잔량 일부가 체결되고, 뒤이은 취소는 남은 양에만 적용됩니다. 취소를 보냈어도 포지션이 늘어날 수 있으므로 최종 체결량을 다시 맞춥니다." },
  { label: "취소가 먼저", summary: "포지션 0.04 · 취소 0.06", filled: 4, cancelled: 6, order: ["취소 요청", "상대 주문"], decided: true, note: "취소가 먼저 적용되면 대기 중인 0.06개가 빠지고, 뒤이은 상대 주문이 가져갈 내 잔량이 없습니다. 포지션은 0.04개에 머뭅니다." },
] as const;

export default function CancelFillOrderViz() {
  return (
    <SceneShell
      eyebrow="(가정) 잔량 0.06개의 경합"
      title="취소와 체결이 겹치면 무엇이 결과를 정할까요"
      description="칸 하나가 0.01개입니다. HyperBFT는 Hyperliquid 노드들이 공통 처리 순서를 확정하는 합의 체계입니다. 먼저 체결되는 일부를 0.02개로 둔 것은 설명용 가정입니다."
      note="합의가 전 세계 사용자의 실제 클릭 시각을 알아내거나 모든 주문에 동일한 네트워크 지연을 보장하는 것은 아닙니다."
      ariaLabel="체결과 취소의 적용 순서에 따른 포지션 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-xs">
              <span className="rounded-md border border-border bg-background p-2 font-semibold">{scene.decided ? "1번째" : "?"} · {scene.order[0]}</span>
              <span aria-hidden>{scene.decided ? "→" : "·"}</span>
              <span className="rounded-md border border-border bg-background p-2 font-semibold">{scene.decided ? "2번째" : "?"} · {scene.order[1]}</span>
            </div>
            <div className="mt-4 grid grid-cols-10 gap-1" role="img" aria-label={scene.summary}>
              {CELLS.map((cell) => {
                const isFilled = cell < scene.filled;
                const isCancelled = !isFilled && scene.cancelled > 0;
                return (
                  <div
                    key={cell}
                    className="flex h-9 items-center justify-center rounded-sm border text-xs font-bold"
                    style={{
                      backgroundColor: isFilled ? "#2563eb" : "transparent",
                      borderColor: isFilled ? "#2563eb" : isCancelled ? "#dc2626" : "#94a3b8",
                      borderStyle: isFilled ? "solid" : "dashed",
                      color: "#dc2626",
                    }}
                  >
                    {isCancelled ? "×" : ""}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-semibold" style={{ color: "#2563eb" }}>채운 칸</span> 체결 · 점선 칸 대기 · <span className="font-semibold" style={{ color: "#dc2626" }}>×</span> 취소
            </p>
          </div>
        );
      }}
    />
  );
}
