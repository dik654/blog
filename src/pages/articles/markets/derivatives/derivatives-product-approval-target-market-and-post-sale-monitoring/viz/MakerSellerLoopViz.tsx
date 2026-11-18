import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 제조자는 이론적 고객·상품 시나리오로 목표시장을 정해 판매자에게 정보를 주고,
 * 판매자는 그 정보와 실제 고객 자료를 합쳐 더 구체적인 목표시장과 채널을 정한다.
 * 실제 판매 결과를 다시 공유해야 두 판단을 고칠 수 있다.
 */
const SCENES = [
  { label: "제조자가 가진 자료", summary: "이론적 고객 + 상품 시나리오", note: "제조자는 이론적 고객과 상품 시나리오로 목표시장을 정합니다. 그 결과를 판매자에게 충분한 정보로 넘깁니다." },
  { label: "판매자가 합치는 자료", summary: "제조자 정보 + 실제 고객 자료", note: "판매자는 제조자 정보에 자신이 가진 실제 고객 자료를 합쳐 더 구체적인 목표시장과 채널을 정합니다. 제조자의 목표시장 문서가 있다고 판매자의 책임이 없어지지 않습니다." },
  { label: "결과가 양쪽으로 돌아갑니다", summary: "판매 결과 → 제조자 · 판매자", note: "실제 판매 결과를 다시 공유해야 두 판단을 고칠 수 있습니다. 판매자가 고객 확인서를 받았다는 사실도 제조자의 책임을 없애지 않습니다." },
] as const;

const NODES = [
  { who: "제조자", has: "이론적 고객 · 상품 시나리오", gives: "목표시장 + 충분한 정보" },
  { who: "판매자", has: "제조자 정보 · 실제 고객 자료", gives: "더 구체적인 목표시장 · 채널" },
  { who: "실제 판매", has: "판매 · 손실 · 민원", gives: "판매 결과" },
] as const;

function Arrow({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 16 12" width={16} height={12} aria-hidden="true" className="shrink-0 self-center">
      <path d="M1 6h12M9 2l4 4-4 4" fill="none" stroke={on ? "#2563eb" : "#cbd5e1"} strokeWidth={1.25} />
    </svg>
  );
}

export default function MakerSellerLoopViz() {
  return (
    <SceneShell
      eyebrow="제조자와 판매자"
      title="같은 고객을 서로 다른 자료로 보고, 결과로 다시 맞춥니다"
      description="제조자는 상품을 설계한 쪽, 판매자는 고객에게 파는 쪽입니다. 칸마다 위는 가진 자료, 아래는 다음 칸으로 넘기는 것입니다."
      ariaLabel="제조자가 목표시장 정보를 판매자에게 넘기고, 판매자가 실제 고객 자료와 합쳐 판매한 뒤, 판매 결과가 제조자와 판매자 모두에게 돌아가는 고리"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="flex items-stretch gap-1 sm:gap-2">
            {NODES.map((node, index) => {
              const on = index === active;
              return (
                <div key={node.who} className="flex min-w-0 flex-1 items-stretch gap-1 sm:gap-2">
                  <div className={`flex min-w-0 flex-1 flex-col rounded-lg border px-2 py-2 text-xs leading-5 ${on ? "border-primary/70 bg-background" : "border-border/60 text-muted-foreground"}`}>
                    <span className={`block font-bold ${on ? "text-foreground" : ""}`}>{node.who}</span>
                    <span className="block">{node.has}</span>
                    <span className={`mt-auto block border-t border-border/50 pt-1 font-semibold ${on ? "text-primary" : ""}`}>{node.gives}</span>
                  </div>
                  {index < NODES.length - 1 && <Arrow on={index === active || index === active - 1} />}
                </div>
              );
            })}
          </div>
          <div className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs leading-5 ${active === 2 ? "border-primary/70 bg-background font-semibold" : "border-dashed border-border/60 text-muted-foreground/70"}`}>
            <svg viewBox="0 0 16 12" width={16} height={12} aria-hidden="true" className="shrink-0">
              <path d="M15 6H3M7 2L3 6l4 4" fill="none" stroke={active === 2 ? "#2563eb" : "#cbd5e1"} strokeWidth={1.25} />
            </svg>
            <span>판매 결과를 제조자와 판매자 모두에게 다시 공유 → 목표시장과 채널 판단을 고침</span>
          </div>
        </div>
      )}
    />
  );
}
