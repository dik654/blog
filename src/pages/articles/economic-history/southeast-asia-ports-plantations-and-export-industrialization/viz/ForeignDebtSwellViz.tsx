import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 — 단기 외화대출로 토지·공장을 늘린 뒤 현지 통화 값이 떨어지고 자금이 빠지면
 * 현지 통화로 환산한 부채가 급증해 은행·기업·노동자의 위기로 번질 수 있다.
 * 숫자는 모두 가정: 대출 100달러, 1달러 = 현지 통화 10 → 20. 100 × 10 = 1,000, 100 × 20 = 2,000.
 */
const LOAN = 100;
const SCALE = 2000;

interface Scene {
  label: string;
  summary: string;
  rate: number;
  spread: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "단기 외화로 빌려 공장을 늘립니다", summary: "100달러 × 10 = 1,000", rate: 10, spread: false, note: "기업이 단기 외화대출 100달러를 빌려 토지와 공장을 늘린다고 합시다. 1달러가 현지 통화 10이면 현지 통화로 1,000입니다. 단기 대출은 만기가 짧아 자주 갚거나 다시 빌려야 하는 빚입니다. 숫자는 모두 설명용 가정입니다." },
  { label: "현지 통화의 값이 반으로 떨어집니다", summary: "100달러 × 20 = 2,000", rate: 20, spread: false, note: "현지 통화의 값이 떨어져 1달러를 사는 데 20이 든다고 합시다. 갚을 달러는 그대로 100인데 현지 통화로 따지면 2,000이 됩니다. 글이 말하는 '현지 통화로 환산한 부채 급증'이 이 곱셈입니다. 이때 1달러당 현지 통화 숫자는 10에서 20으로 오릅니다." },
  { label: "자금이 빠지면 번질 수 있습니다", summary: "은행·기업·노동자", rate: 20, spread: true, note: "이 상태에서 자금까지 빠지면 불어난 빚이 은행·기업·노동자의 위기로 번질 수 있습니다. 글은 '번질 수 있다'고 쓰며, 세 곳 사이의 순서나 크기는 정하지 않아 화살표 없이 나란히 두었습니다." },
];

function Bar({ label, value, on }: { label: string; value: number; on: boolean }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className={on ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(value / SCALE) * 100}%`, backgroundColor: on ? "#dc2626" : "#64748b" }} />
      </div>
      <span className={`text-right font-mono ${on ? "font-bold" : ""}`}>{value.toLocaleString("ko-KR")}</span>
    </div>
  );
}

function Body({ scene, first }: { scene: Scene; first: boolean }) {
  const local = LOAN * scene.rate;
  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-md border border-border px-2 py-1 font-mono">갚을 돈 100달러</span>
        <span className="text-muted-foreground">×</span>
        <span className={`rounded-md border px-2 py-1 font-mono ${first ? "border-border" : "border-red-600 font-bold text-red-700 dark:text-red-400"}`}>1달러 = 현지 통화 {scene.rate}</span>
        <span className="text-muted-foreground">=</span>
        <span className="rounded-md border border-border px-2 py-1 font-mono font-bold">현지 통화 {local.toLocaleString("ko-KR")}</span>
      </div>
      <div className="space-y-2">
        <Bar label="처음 빌릴 때" value={LOAN * 10} on={false} />
        <Bar label="지금 갚을 돈" value={local} on={!first} />
        <p className="text-xs text-muted-foreground">막대 단위: 현지 통화(가정)</p>
      </div>
      <div className={`flex flex-wrap items-center gap-2 text-sm ${scene.spread ? "" : "opacity-30"}`}>
        <span className="text-muted-foreground">위기로 번질 수 있는 곳</span>
        {["은행", "기업", "노동자"].map((name) => (
          <span key={name} className={`rounded-md border px-2 py-1 ${scene.spread ? "border-red-600 font-semibold" : "border-border"}`}>{name}</span>
        ))}
      </div>
    </div>
  );
}

export default function ForeignDebtSwellViz() {
  return (
    <SceneShell
      eyebrow="외화 빚의 곱셈"
      title="갚을 달러는 그대로인데 현지 통화로는 두 배가 됩니다"
      description="외화대출은 달러 같은 외국 돈으로 빌려 같은 외국 돈으로 갚는 빚입니다. 현지 통화로 따진 빚은 '갚을 달러 × 1달러를 사는 데 드는 현지 통화'입니다. 대출액과 교환 비율은 모두 설명용 가정입니다."
      ariaLabel="단기 외화대출 100달러가 현지 통화 가치 하락으로 현지 통화 1,000에서 2,000으로 늘고, 은행·기업·노동자의 위기로 번질 수 있는 과정"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <Body key={scene.label} scene={scene} first={index === 0} />)} />}
    />
  );
}
