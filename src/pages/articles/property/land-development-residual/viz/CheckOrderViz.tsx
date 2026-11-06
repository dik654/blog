import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 첫 두 문단 — 확인 순서에 따라 식의 빈칸이 어떤 근거로 채워지는지.
 * 항목별 금액은 본문에 없으므로 70억을 나눠 그리지 않습니다.
 */
type Slot = "sale" | "cost" | "land";

const SCENES: readonly { label: string; summary: string; note: string; filled: readonly Slot[]; focus: Slot | null; heading: string; items: readonly string[] }[] = [
  { label: "계획 도면", summary: "100억의 근거", note: "처음에는 100억 원에 팔 수 있는 용도와 면적을 계획 도면으로 확인합니다. 도면과 허가 조건이 이 숫자의 근거입니다.", filled: ["sale"], focus: "sale", heading: "도면에서 확인", items: ["용도", "면적"] },
  { label: "땅 조사", summary: "숫자는 그대로", note: "식의 숫자는 바뀌지 않지만 이 땅을 실제로 쓸 수 있는지를 여기서 봅니다. 비용 칸을 채우기 전 단계입니다.", filled: ["sale"], focus: null, heading: "땅에서 확인", items: ["소유권과 실제 경계", "도로 접근", "오염", "기존 점유자의 권리"] },
  { label: "비용 칸 채우기", summary: "70억의 근거", note: "지역 계획과 기반시설 연결 조건을 확인한 뒤 항목을 채워 지급 시점에 놓습니다. 70억 원은 공사비 하나가 아니라 토지를 제외한 비용의 합계입니다.", filled: ["sale", "cost"], focus: "cost", heading: "70억 원의 항목", items: ["설계·인허가와 공사", "기반시설", "세금·금융·판매", "예비비"] },
  { label: "남은 칸 계산", summary: "100 − 70 − 15 = 15억", note: "앞의 칸이 채워져야 토지와 취득에 남은 돈을 계산할 수 있습니다. 땅값을 먼저 정하고 나머지를 맞추는 순서가 아닙니다.", filled: ["sale", "cost", "land"], focus: "land", heading: "이제 나오는 값", items: ["토지와 취득에 남은 15억 원"] },
] as const;

const FILL: Record<Slot, string> = { sale: "100억", cost: "70억", land: "15억" };

function Cell({ name, value, on, focus, fixed = false }: { name: string; value: string; on: boolean; focus: boolean; fixed?: boolean }) {
  const frame = focus ? "border-primary" : on ? "border-foreground/40" : "border-dashed border-border";
  return (
    <div className={`min-w-0 rounded-lg border px-1 py-2 text-center ${frame}`}>
      <span className="block text-xs leading-5 text-muted-foreground">{name}</span>
      <span className={`block font-mono text-sm font-bold ${focus ? "text-primary" : fixed ? "text-amber-700 dark:text-amber-400" : on ? "" : "text-muted-foreground"}`}>{value}</span>
    </div>
  );
}

function Stage({ step }: { step: number }) {
  const scene = SCENES[step];
  const has = (slot: Slot) => scene.filled.includes(slot);
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)] items-center gap-1">
        <Cell name="매각액" value={has("sale") ? FILL.sale : "?"} on={has("sale")} focus={scene.focus === "sale"} />
        <span className="text-center font-mono text-sm text-muted-foreground">−</span>
        <Cell name="비용" value={has("cost") ? FILL.cost : "?"} on={has("cost")} focus={scene.focus === "cost"} />
        <span className="text-center font-mono text-sm text-muted-foreground">−</span>
        <Cell name="목표 이익" value="15억" on focus={false} fixed />
        <span className="text-center font-mono text-sm text-muted-foreground">=</span>
        <Cell name="토지·취득" value={has("land") ? FILL.land : "?"} on={has("land")} focus={scene.focus === "land"} />
      </div>
      <p className="mt-4 text-xs font-semibold text-muted-foreground">{scene.heading}</p>
      <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
        {scene.items.map((item) => (
          <li key={item} className={`min-w-0 border-l border-primary/50 pl-2 leading-6 ${scene.items.length === 1 ? "col-span-2" : ""}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CheckOrderViz() {
  return (
    <SceneShell
      eyebrow="확인 순서"
      title="확인을 하나씩 마칠 때마다 식의 빈칸이 근거를 얻습니다"
      description="위 칸은 3절의 뺄셈이고 아래는 지금 확인하는 것입니다. 목표 이익 15억 원은 처음부터 정해 둔 값이며, 금액은 모두 (가정)입니다."
      note="항목별 금액은 본문에 없어 70억 원을 나눠 그리지 않았습니다."
      ariaLabel="계획 도면, 땅 조사, 비용 항목, 잔여 계산의 순서로 식의 빈칸이 채워지는 과정"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
