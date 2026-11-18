import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 뒷부분 — 금리가 오르면 신규 차입비용은 늘고 기존 고정금리 채권 가격은 내려간다.
 * 가정: 1년 만기, 액면 100, 기존 금리 3% → 1년 뒤 103. 새 금리 5% → 새 채권 100은 1년 뒤 105.
 * 기존 채권 가격 = 103 ÷ 1.05 ≈ 98.1 (100 대비 약 −1.9).
 */
const OLD_PAY = 103;
const NEW_PAY = 105;
const OLD_PRICE = Math.round((OLD_PAY / 1.05) * 10) / 10;

interface Row {
  label: string;
  today: number | null;
  later: number | null;
}

interface Scene {
  label: string;
  summary: string;
  rows: readonly Row[];
  hot: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "기존 채권: 금리 3%", summary: "오늘 100 → 1년 뒤 103", rows: [{ label: "기존 3% 채권", today: 100, later: OLD_PAY }, { label: "새 5% 채권", today: null, later: null }], hot: 0, note: "정부가 액면 100, 고정금리 3%, 만기 1년인 채권을 냈다고 합시다(가정). 오늘 100을 내면 1년 뒤 103을 받습니다." },
  { label: "금리가 5%로 오릅니다", summary: "새 채권: 100 → 105", rows: [{ label: "기존 3% 채권", today: 100, later: OLD_PAY }, { label: "새 5% 채권", today: 100, later: NEW_PAY }], hot: 1, note: "시장 금리가 5%로 올랐다고 합시다(가정). 이제 정부가 새로 100을 빌리려면 1년 뒤 105를 약속해야 합니다. 같은 100을 빌리는 이자가 3에서 5로 늘어나는 것이 '신규 차입비용 증가'입니다." },
  { label: "기존 채권 가격이 내려갑니다", summary: "103 ÷ 1.05 ≈ 98.1", rows: [{ label: "기존 3% 채권", today: OLD_PRICE, later: OLD_PAY }, { label: "새 5% 채권", today: 100, later: NEW_PAY }], hot: 0, note: "100을 내면 105를 주는 새 채권이 있으니, 103만 주는 기존 채권에 100을 내려는 사람은 찾기 어렵습니다. 기존 채권이 새 채권과 같은 5%를 벌어 주려면 가격이 103 ÷ 1.05 ≈ 98.1로 내려가야 합니다. 그래서 글은 정부·은행·연금의 장부를 함께 봐야 한다고 씁니다." },
];

const SCALE = 110;

function Cell({ value, strong }: { value: number | null; strong: boolean }) {
  return (
    <div className="min-w-0">
      <div className="h-4 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${value === null ? 0 : (value / SCALE) * 100}%`, backgroundColor: strong ? "#2563eb" : "#94a3b8" }} />
      </div>
      <span className={`mt-1 block text-right font-mono text-xs sm:text-sm ${strong ? "font-bold" : ""}`}>{value === null ? "−" : value}</span>
    </div>
  );
}

function Body({ scene }: { scene: Scene }) {
  return (
    <div className="min-w-0 space-y-3 text-sm">
      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-3 text-xs text-muted-foreground">
        <span />
        <span>오늘 내는 값</span>
        <span>1년 뒤 받는 돈</span>
      </div>
      {scene.rows.map((row, index) => (
        <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)_minmax(0,1fr)] items-start gap-3">
          <span className={index === scene.hot ? "font-bold" : "text-muted-foreground"}>{row.label}</span>
          <Cell value={row.today} strong={index === scene.hot} />
          <Cell value={row.later} strong={index === scene.hot} />
        </div>
      ))}
    </div>
  );
}

export default function RateBondPriceViz() {
  return (
    <SceneShell
      eyebrow="금리와 채권 가격"
      title="금리가 오르면 이미 산 고정금리 채권의 값이 내려갑니다"
      description="고정금리 채권은 처음 정한 이자를 만기까지 그대로 주는 채권입니다. 액면 100, 금리 3%와 5%, 만기 1년은 모두 설명용 가정입니다."
      ariaLabel="금리가 3퍼센트에서 5퍼센트로 오를 때 신규 차입비용이 늘고 기존 3퍼센트 채권 가격이 약 98.1로 내려가는 계산"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene) => <Body key={scene.label} scene={scene} />)} />}
    />
  );
}
