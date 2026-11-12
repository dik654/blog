import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gaming-the-weights — 위험 기준 비율과 단순 비율 가운데 더 까다로운 쪽이 실제 제약이 된다.
 * 자본 8, 총 익스포저 100(앞 식의 예). 최저 기준은 위험 기준 8%, 단순 5%로 가정한다.
 * 옮기기 전: 위험가중자산 100 → 요구 자본 8 × 100% = 8, 단순 5% × 100 = 5 → 8이 제약.
 * 절반을 가중치 0으로 매겨진 자산으로 옮기면(실제 위험은 그대로, 가정): 위험가중자산 50 → 비율 8/50 = 16%, 요구 자본 4.
 * 단순 비율은 가중치를 쓰지 않으므로 8/100 = 8%, 요구 자본 5 그대로 → 실제 요구는 더 큰 5.
 */
const TOTAL = 100;
const CAPITAL = 8;
const RISK_MIN = 0.08;
const SIMPLE_MIN = 0.05;
const SCALE = 10;

interface Scene {
  label: string;
  summary: string;
  note: string;
  rwa: number;
  showFloor: boolean;
}

const SCENES: readonly Scene[] = [
  {
    label: "옮기기 전",
    summary: "요구 자본 8 · 위험 기준이 제약",
    note: "자산 100이 전부 가중치 100%인 기업대출이면 위험가중자산도 100입니다. 위험 기준으로는 8%×100 = 8, 단순 비율로는 5%×100 = 5가 필요하므로 더 까다로운 위험 기준 8이 실제 요구가 됩니다.",
    rwa: 100,
    showFloor: true,
  },
  {
    label: "가중치가 낮은 쪽으로 옮기면",
    summary: "8 ÷ 50 = 16%",
    note: "절반을 가중치 0으로 매겨진 자산으로 옮겼는데 실제 위험은 그대로라고 해 봅시다(가정). 위험가중자산이 50이 되어 같은 자본 8로 비율이 16%로 뛰고, 위험 기준 요구 자본은 4로 반이 됩니다. 측정된 위험만 줄었습니다.",
    rwa: 50,
    showFloor: false,
  },
  {
    label: "단순 비율이 바닥을 받칩니다",
    summary: "max(4, 5) = 5",
    note: "단순 비율은 가중치를 쓰지 않으므로 총 익스포저 100이 그대로이고 요구 자본 5도 그대로입니다. 두 판정 가운데 더 까다로운 쪽이 실제 제약이 되므로 요구 자본은 4가 아니라 5에서 멈춥니다.",
    rwa: 50,
    showFloor: true,
  },
];

function Bar({ label, sub, need, color, dim, binding }: { label: string; sub: string; need: number; color: string; dim: boolean; binding: boolean }) {
  return (
    <div className={`grid grid-cols-[6.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:grid-cols-[9rem_minmax(0,1fr)_3.5rem] sm:text-sm ${dim ? "opacity-35" : ""}`}>
      <span className="min-w-0">
        <span className={binding ? "font-bold" : ""}>{label}</span>
        <span className="block text-[11px] text-muted-foreground">{sub}</span>
      </span>
      <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
        <div
          className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${(need / SCALE) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className={`text-right font-mono ${binding ? "font-bold" : ""}`}>{need}</span>
    </div>
  );
}

export default function WeightFloorViz() {
  return (
    <SceneShell
      eyebrow="두 기준 겹치기"
      title="가중치를 낮춰 줄어드는 것은 측정된 위험뿐이라 단순 비율이 바닥을 받칩니다"
      description="막대는 두 판정이 각각 요구하는 자본입니다. 자본 8·자산 100은 앞 식의 예를 그대로 씁니다."
      note="최저 기준 위험 기준 8%·단순 5%는 계산이 보이도록 고른 가정입니다. 실제 수치와 적용 시기는 나라마다 다르게 정합니다."
      ariaLabel="위험 기준 비율과 단순 비율이 각각 요구하는 자본과 실제 제약"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const riskNeed = scene.rwa * RISK_MIN;
        const simpleNeed = TOTAL * SIMPLE_MIN;
        const binding = Math.max(riskNeed, simpleNeed);
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/80 px-3 py-2">
                <span className="block text-muted-foreground">위험 기준 비율</span>
                <span className="font-mono font-bold">
                  {CAPITAL} ÷ {scene.rwa} = {((CAPITAL / scene.rwa) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="rounded-lg border border-border/80 px-3 py-2">
                <span className="block text-muted-foreground">단순 비율 (가중치 없음)</span>
                <span className="font-mono font-bold">
                  {CAPITAL} ÷ {TOTAL} = {((CAPITAL / TOTAL) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <Bar
              label="위험 기준 요구"
              sub={`8% × 위험가중 ${scene.rwa}`}
              need={riskNeed}
              color="#6366f1"
              dim={false}
              binding={scene.showFloor && riskNeed >= simpleNeed}
            />
            <Bar
              label="단순 비율 요구"
              sub={`5% × 총 익스포저 ${TOTAL}`}
              need={simpleNeed}
              color="#d97706"
              dim={!scene.showFloor}
              binding={scene.showFloor && simpleNeed > riskNeed}
            />
            <div className="flex items-baseline justify-between rounded-lg border px-3 py-2 text-xs sm:text-sm" style={{ borderColor: scene.showFloor ? "#2563eb" : "#cbd5e1" }}>
              <span className="font-semibold">{scene.showFloor ? "실제 요구 자본 = 둘 중 큰 쪽" : "위험 기준 하나만 있다면 요구 자본"}</span>
              <span className="font-mono font-bold">{scene.showFloor ? binding : riskNeed}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
