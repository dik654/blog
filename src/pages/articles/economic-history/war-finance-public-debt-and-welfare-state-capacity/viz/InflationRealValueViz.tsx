import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 둘째 문단 — 인플레이션은 고정금리 명목부채의 실질가치를 낮출 수 있지만 현금·임금·연금의 구매력도 깎는다.
 * 가정: 명목 100, 물가 25% 상승 → 실질 100 ÷ 1.25 = 80.
 */
const NOMINAL = 100;

interface Scene {
  label: string;
  summary: string;
  price: number;
  focus: "none" | "debt" | "income";
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "물가가 그대로일 때", summary: "명목 100 = 실질 100", price: 1, focus: "none", note: "정부가 갚을 고정금리 국채 원금 100과, 가계가 가진 현금·임금·연금 100을 놓습니다(가정). 물가가 그대로면 적힌 금액(명목)과 그 돈으로 살 수 있는 양(실질)이 같습니다." },
  { label: "물가 25% 상승: 정부의 부채", summary: "100 ÷ 1.25 = 80", price: 1.25, focus: "debt", note: "물가가 25% 오르면(가정) 정부가 갚을 원금은 여전히 100이지만 실질가치는 100 ÷ 1.25 = 80입니다. 고정금리 명목부채의 실질 부담이 낮아질 수 있다는 뜻입니다. 같은 채권을 가진 쪽이 돌려받을 돈의 실질가치도 같은 80입니다." },
  { label: "같은 물가 상승: 현금·임금·연금", summary: "100 ÷ 1.25 = 80", price: 1.25, focus: "income", note: "같은 물가 상승은 현금·임금·연금도 가리지 않습니다. 명목 금액이 100에 머물면 실질 구매력은 똑같이 80으로 깎입니다. 부채 부담을 줄이는 같은 힘이 가계의 구매력도 깎는 셈입니다." },
];

function Bar({ label, value, color, strong }: { label: string; value: number; color: string; strong: boolean }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

function Group({ title, real, on }: { title: string; real: number; on: boolean }) {
  return (
    <div className={`space-y-2 rounded-lg border p-3 ${on ? "border-primary/60" : "border-border/60"}`}>
      <p className={`text-sm ${on ? "font-bold" : "font-semibold text-muted-foreground"}`}>{title}</p>
      <Bar label="명목" value={NOMINAL} color="#94a3b8" strong={false} />
      <Bar label="실질" value={real} color={real < NOMINAL ? "#dc2626" : "#2563eb"} strong={on} />
    </div>
  );
}

function Body({ scene }: { scene: Scene }) {
  const real = Math.round(NOMINAL / scene.price);
  return (
    <div className="min-w-0 space-y-3">
      <p className="text-sm">
        물가 지수 <span className="font-mono font-bold">100 → {Math.round(100 * scene.price)}</span>
        <span className="text-muted-foreground"> (가정)</span>
      </p>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <Group title="정부가 갚을 고정금리 국채 원금" real={real} on={scene.focus === "debt"} />
        <Group title="가계의 현금·임금·연금" real={real} on={scene.focus === "income"} />
      </div>
    </div>
  );
}

export default function InflationRealValueViz() {
  return (
    <SceneShell
      eyebrow="명목과 실질"
      title="같은 물가 상승이 부채와 구매력을 함께 깎습니다"
      description="명목은 돈에 적힌 금액, 실질은 그 금액을 물가로 나눠 실제로 살 수 있는 양으로 잰 값입니다. 금액 100과 물가 상승률 25%는 설명용 가정입니다."
      ariaLabel="물가가 25퍼센트 오를 때 고정금리 국채 원금 100과 현금·임금·연금 100의 실질가치가 모두 80이 되는 계산"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene) => <Body key={scene.label} scene={scene} />)} />}
    />
  );
}
