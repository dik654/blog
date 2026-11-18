import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 물가 기대 → 명목금리 요구, 정책금리 인상 → 새 대출 비용↑·기존 고정금리 채권 가격↓
 * → 은행(금리·만기 차이 관리)·펀드와 보험사(채권 가격·환매 요구) → 담보가치↓·추가 현금 → 자산 매각 → 가격 하락이 더 커질 수 있음.
 * 본문이 크기를 주지 않으므로 상자에는 방향만 적고 양은 그리지 않습니다.
 */
type NodeId = "expect" | "policy" | "loan" | "bond" | "bank" | "fund" | "collateral" | "sale";

const NODES: Record<NodeId, { who: string; what: string }> = {
  expect: { who: "대출자·채권 투자자", what: "물가 기대가 오르면 더 높은 명목금리를 요구할 수 있음" },
  policy: { who: "중앙은행", what: "정책금리를 올림" },
  loan: { who: "새 대출", what: "빌리는 비용 ↑" },
  bond: { who: "기존 고정금리 채권", what: "시장가격 ↓" },
  bank: { who: "은행", what: "예금과 대출의 금리·만기 차이를 관리" },
  fund: { who: "펀드·보험사", what: "보유 채권의 가격과 환매 요구를 맞춤" },
  collateral: { who: "담보가치 ↓", what: "추가 현금이 필요해짐" },
  sale: { who: "자산 매각", what: "가격 하락을 더 키울 수 있음" },
};

const SCENES = [
  { label: "물가 기대가 금리 요구로", summary: "기대 ↑ → 요구 금리 ↑", lit: ["expect"], loop: false, note: "명목금리는 물가를 빼지 않은 금리 숫자 그대로입니다. 다음 물가가 높을 것으로 보면 대출자와 채권 투자자는 더 높은 명목금리를 요구할 수 있습니다." },
  { label: "정책금리가 두 갈래로 퍼집니다", summary: "새 대출 ↑ · 기존 채권 ↓", lit: ["expect", "policy", "loan", "bond"], loop: false, note: "중앙은행이 정책금리를 올리면 새 대출 비용은 커지고, 이미 발행된 고정금리 채권의 시장가격은 내려갑니다. 같은 인상이 빌리는 쪽과 들고 있는 쪽에 다른 방향으로 닿습니다." },
  { label: "금융기관이 장부를 맞춥니다", summary: "은행 · 펀드·보험사", lit: ["expect", "policy", "loan", "bond", "bank", "fund"], loop: false, note: "은행은 예금과 대출의 금리·만기 차이를 관리하고, 펀드와 보험사는 보유 채권의 가격과 환매 요구를 맞춰야 합니다. 환매는 투자자가 펀드에 돈을 돌려 달라고 하는 것입니다." },
  { label: "담보가 줄면 현금이 필요합니다", summary: "담보 ↓ → 현금 → 매각", lit: ["expect", "policy", "loan", "bond", "bank", "fund", "collateral", "sale"], loop: false, note: "담보는 빌린 돈을 못 갚을 때를 대비해 맡긴 자산입니다. 담보가치가 떨어져 추가 현금이 필요해지면 자산을 팔게 됩니다." },
  { label: "매각이 하락을 다시 키울 수 있습니다", summary: "매각 ↺ 가격 하락", lit: ["expect", "policy", "loan", "bond", "bank", "fund", "collateral", "sale"], loop: true, note: "자산 매각이 가격 하락을 더 키울 수 있습니다. 떨어진 가격이 담보로 맡긴 자산에도 미치면 담보가치가 다시 줄어드는 고리가 될 수 있습니다. 이 고리는 반드시 생기는 것이 아니며, 그 크기는 이 글이 다루지 않습니다." },
] as const;

function Box({ id, lit, accent = false }: { id: NodeId; lit: boolean; accent?: boolean }) {
  const node = NODES[id];
  return (
    <div
      className={`min-w-0 rounded-lg border px-3 py-2 text-sm leading-5 transition-opacity duration-300 motion-reduce:transition-none ${lit ? "opacity-100" : "opacity-30"}`}
      style={{ borderColor: accent && lit ? "#dc2626" : lit ? "#2563eb" : "#94a3b8" }}
    >
      <span className="block font-semibold">{node.who}</span>
      <span className="block text-xs leading-5 text-muted-foreground">{node.what}</span>
    </div>
  );
}

function Arrow({ lit, label }: { lit: boolean; label?: string }) {
  return (
    <div className={`col-span-2 flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground ${lit ? "" : "opacity-30"}`} aria-hidden>
      <span className="font-bold">↓</span>
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export default function RateShockChainViz() {
  return (
    <SceneShell
      eyebrow="금리에서 급매까지"
      title="물가 기대가 채권가격과 펀드 환매로 이어지는 길"
      description="상자는 본문이 든 주체와 변화입니다. 화살표는 순서만 뜻하고, 각 단계의 크기는 본문이 주지 않아 그리지 않았습니다."
      ariaLabel="물가 기대와 정책금리 인상이 대출 비용, 채권가격, 금융기관 장부, 담보와 자산 매각으로 이어지는 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = (id: NodeId) => (scene.lit as readonly string[]).includes(id);
        return (
          <div className="grid min-w-0 grid-cols-2 gap-x-2">
            <Box id="expect" lit={on("expect")} />
            <Box id="policy" lit={on("policy")} />
            <Arrow lit={on("loan")} label="정책금리를 올리면" />
            <Box id="loan" lit={on("loan")} />
            <Box id="bond" lit={on("bond")} />
            <Arrow lit={on("bank")} />
            <Box id="bank" lit={on("bank")} />
            <Box id="fund" lit={on("fund")} />
            <Arrow lit={on("collateral")} label="담보가치가 떨어지면" />
            <div className="col-span-2 grid grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)] items-center gap-x-1">
              <Box id="collateral" lit={on("collateral")} accent />
              <span className={`text-center text-xs font-bold text-muted-foreground ${on("sale") ? "" : "opacity-30"}`} aria-hidden>→</span>
              <Box id="sale" lit={on("sale")} accent />
            </div>
            <div className={`col-span-2 mx-[22%] mt-0 flex h-7 items-end justify-center rounded-b-lg border-x border-b border-dashed transition-opacity duration-300 motion-reduce:transition-none ${scene.loop ? "opacity-100" : "opacity-0"}`} style={{ borderColor: "#dc2626" }} aria-hidden={!scene.loop}>
              <span className="translate-y-1/2 bg-background px-1 text-xs font-semibold" style={{ color: "#dc2626" }}>↺ 하락이 담보가치를 다시 낮출 수 있음</span>
            </div>
          </div>
        );
      }}
    />
  );
}
