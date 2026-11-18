import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설명용 장부.
 * 청산: 70 − 비용 5 = 65 → 담보 40, 우선 10 → 일반 15 → 15 ÷ 50 = 30%, 주주 0.
 * 재조정: 95 → 새 자금 10, 담보 40, 우선 10 → 일반 35 → 35 ÷ 50 = 70%. 95가 실현된다는 가정.
 */
const SCALE = 100;
const GENERAL_CLAIM = 50;

interface Segment {
  key: string;
  label: string;
  value: number;
  color: string;
}

const COST: Segment = { key: "cost", label: "청산비용", value: 5, color: "#94a3b8" };
const NEW_MONEY: Segment = { key: "new", label: "새 자금", value: 10, color: "#7c3aed" };
const SECURED: Segment = { key: "secured", label: "담보", value: 40, color: "#0f766e" };
const PRIORITY: Segment = { key: "priority", label: "우선", value: 10, color: "#d97706" };
const GENERAL_LIQ: Segment = { key: "general", label: "일반", value: 15, color: "#2563eb" };
const GENERAL_REORG: Segment = { key: "general", label: "일반", value: 35, color: "#2563eb" };
const REST_LIQ: Segment = { key: "rest", label: "남은 65", value: 65, color: "#cbd5e1" };

const SCENES = [
  { label: "청산 1 · 팔아서 남는 돈", summary: "70 − 5 = 65", pool: 70, segments: [COST, REST_LIQ], received: null, note: "회사를 닫고 자산 70을 팔면 먼저 청산비용 5가 빠집니다. 채권자에게 나눌 수 있는 돈은 65입니다." },
  { label: "청산 2 · 선순위 먼저", summary: "65 − 40 − 10 = 15", pool: 70, segments: [COST, SECURED, PRIORITY, GENERAL_LIQ], received: null, note: "담보채권 40과 임금·세금 같은 우선청구 10이 먼저 받습니다. 일반채권자 몫으로 15가 남습니다." },
  { label: "청산 3 · 일반채권 회수율", summary: "15 ÷ 50 = 30%", pool: 70, segments: [COST, SECURED, PRIORITY, GENERAL_LIQ], received: 15, note: "일반채권 50 가운데 15만 돌아와 단순 회수율은 30%입니다. 이 장부에서 주주의 잔여는 0입니다." },
  { label: "재조정 1 · 계속기업가치 95", summary: "95 − 10 − 40 − 10 = 35", pool: 95, segments: [NEW_MONEY, SECURED, PRIORITY, GENERAL_REORG], received: null, note: "주문과 기술을 살려 계속 운영한 가치가 95라고 놓습니다. 절차 중 새 자금 10, 담보 40, 우선청구 10을 지급하면 일반채권자에게 35가 남습니다." },
  { label: "재조정 2 · 일반채권 회수율", summary: "35 ÷ 50 = 70%", pool: 95, segments: [NEW_MONEY, SECURED, PRIORITY, GENERAL_REORG], received: 35, note: "같은 일반채권 50에 35가 돌아와 회수율은 70%입니다. 다만 95가 실현된다는 가정 위의 숫자라, 95가 실현되지 않으면 이 비교도 무너집니다." },
] as const;

export default function RecoveryWaterfallViz() {
  return (
    <SceneShell
      eyebrow="배분 순서"
      title="같은 일반채권 50이 청산에서는 15, 재조정에서는 35를 받습니다"
      description="막대 길이는 0~100 같은 눈금입니다. 위 막대는 나눌 돈이 누구에게 먼저 가는지, 아래 막대는 일반채권 50 가운데 돌아오는 몫입니다. 숫자는 모두 이 글의 설명용 장부(가정)이며 실제 법률 결론이 아닙니다."
      ariaLabel="청산과 재조정에서 담보, 우선, 일반채권 순서로 나뉘는 배분과 일반채권 회수율"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fill = scene.received ?? 0;
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground sm:text-sm">
                <span className="font-semibold text-foreground">{scene.pool === 70 ? "청산: 자산 70" : "재조정: 계속기업가치 95"}</span>
                <span className="font-mono">0 ─ {SCALE}</span>
              </div>
              <div className="flex h-9 w-full overflow-hidden rounded-md border border-border bg-muted/30">
                {scene.segments.map((seg) => (
                  <div
                    key={seg.key + seg.value}
                    className="flex h-full items-center justify-center border-r border-white text-[11px] font-semibold text-white last:border-r-0 sm:text-xs"
                    style={{ width: `${(seg.value / SCALE) * 100}%`, backgroundColor: seg.color, color: seg.key === "rest" ? "#334155" : "#ffffff" }}
                    title={`${seg.label} ${seg.value}`}
                  >
                    {seg.value >= 10 ? seg.value : ""}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex min-h-[2.5rem] flex-wrap content-start gap-x-3 gap-y-1 text-xs leading-5">
                {scene.segments.map((seg) => (
                  <span key={seg.key + seg.value} className="flex items-center gap-1">
                    <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: seg.color }} />
                    {seg.label} {seg.value}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground sm:text-sm">
                <span className="font-semibold text-foreground">일반채권 50 중 받는 몫</span>
                <span className="font-mono">{scene.received === null ? "계산 전" : `${scene.received} ÷ 50 = ${(scene.received / GENERAL_CLAIM) * 100}%`}</span>
              </div>
              <div className="relative h-6 w-full rounded-md bg-muted/30">
                <div className="absolute inset-y-0 left-0 rounded-md border border-dashed border-[#2563eb]" style={{ width: `${(GENERAL_CLAIM / SCALE) * 100}%` }} />
                <div
                  className="absolute inset-y-0 left-0 rounded-md transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${(fill / SCALE) * 100}%`, backgroundColor: "#2563eb" }}
                />
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">점선 칸이 받아야 할 50, 채운 칸이 실제로 받는 몫입니다.</p>
            </div>
          </div>
        );
      }}
    />
  );
}
