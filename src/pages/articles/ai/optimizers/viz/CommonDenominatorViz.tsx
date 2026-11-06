import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #effective-batch — 공통 분모가 있을 때와 없을 때, 다시 나눌 때의 오차 평균.
 * 분모 8: 2/8 + 18/8 = 0.25 + 2.25 = 2.5. None: 평균 1과 3을 반씩 → 2. 이중 나눔: 2.5 ÷ 2 = 1.25.
 */
interface DenomScene extends ShellScene {
  first: number;
  second: number;
  total: string;
  firstText: string;
  secondText: string;
  good: boolean;
}

const SCENES: readonly DenomScene[] = [
  { label: "분모를 먼저 셉니다", summary: "유효 위치 2 + 6 = 8", first: 0, second: 0, total: "", firstText: "", secondText: "", good: true, note: "최대 묶음 수만큼 자료를 먼저 모은 뒤 실제 유효 위치를 셉니다. −100은 계산에서 빼라는 표시입니다. 2와 6은 이렇게 센 수여야 하며 문자열 길이나 padding(빈칸) 포함 길이가 아닙니다." },
  { label: "공통 분모 8로 나눕니다", summary: "0.25 + 2.25 = 2.5", first: 0.25, second: 2.25, total: "2.5", firstText: "2 ÷ 8", secondText: "18 ÷ 8", good: true, note: "num_items_in_batch는 코드에서 공통 분모를 받는 인자입니다. 값이 있으면 각 합을 8로 나눕니다. 같은 parameter에서 만든 손실이면 변화율의 합도 (4 + 28) ÷ 8 = 4입니다." },
  { label: "분모가 None이면", summary: "(1 + 3) ÷ 2 = 2", first: 0.5, second: 1.5, total: "2", firstText: "1 ÷ 2", secondText: "3 ÷ 2", good: false, note: "num_items_in_batch가 None, 곧 공통 분모를 받지 않으면 각 호출이 자체 평균 1과 3을 만듭니다. 그것을 그대로 반씩 평균하면 2가 되어 처음 정한 목표 2.5와 달라집니다." },
  { label: "누적 횟수로 또 나누면", summary: "2.5 ÷ 2 = 1.25", first: 0.125, second: 1.125, total: "1.25", firstText: "", secondText: "", good: false, note: "같은 분모를 쓴 손실을 누적 횟수 2로 다시 나누면 이번에는 너무 작아집니다. 외부 학습 루프가 추가로 나누는지, 분산 실행에서 합산과 평균이 어디에 있는지까지 확인해야 합니다." },
];

const AXIS_MAX = 3;
const TARGET = 2.5;
const pct = (value: number) => `${(value / AXIS_MAX) * 100}%`;

function CountRow({ name, valid, ignored }: { name: string; valid: number; ignored: number }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2">
      <span className="text-xs text-muted-foreground">{name}</span>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: valid }, (_, index) => (
          <span key={`v${index}`} className="h-6 w-6 rounded-sm" style={{ backgroundColor: "#2563eb" }} />
        ))}
        {Array.from({ length: ignored }, (_, index) => (
          <span key={`i${index}`} className="flex h-6 w-8 items-center justify-center rounded-sm border border-dashed border-slate-500 text-[11px] text-muted-foreground">
            −100
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CommonDenominatorViz() {
  return (
    <SceneShell
      eyebrow="공통 분모"
      title="어느 분모로 몇 번 나누느냐에 따라 2.5가 2도 1.25도 됩니다"
      description="오차 합 2와 18, 유효 위치 2와 6은 첫 사례의 가정이며 실제 모델을 실행해 측정한 값이 아닙니다 (가정). 눈금은 같고 점선이 목표 2.5입니다. −100 칸의 개수는 설명을 위해 고른 것입니다 (가정)."
      ariaLabel="공통 분모 유무와 이중 나눔에 따른 오차 평균 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        if (active === 0) {
          return (
            <div className="min-w-0 space-y-3">
              <CountRow name="첫 묶음" valid={2} ignored={1} />
              <CountRow name="둘째 묶음" valid={6} ignored={1} />
              <p className="font-mono text-sm font-bold">num_items_in_batch = 8</p>
            </div>
          );
        }
        const sum = scene.first + scene.second;
        return (
          <div className="min-w-0">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{scene.firstText ? `주황 ${scene.firstText} · 파랑 ${scene.secondText}` : "주황 첫 묶음 · 파랑 둘째 묶음"}</span>
              <span>눈금 0–3</span>
            </div>
            <div className="relative mt-1 h-10 rounded-sm bg-muted/40">
              <div className="absolute left-0 top-0 flex h-full" style={{ width: pct(sum) }}>
                <div className="h-full" style={{ width: `${(scene.first / sum) * 100}%`, backgroundColor: "#d97706" }} />
                <div className="h-full" style={{ width: `${(scene.second / sum) * 100}%`, backgroundColor: "#2563eb" }} />
              </div>
              <div className="absolute -bottom-1 -top-1 border-l border-dashed border-slate-500" style={{ left: pct(TARGET) }} />
            </div>
            <p className={`mt-3 font-mono text-lg font-bold ${scene.good ? "text-primary" : "text-red-700 dark:text-red-400"}`}>
              {scene.total} {scene.good ? "= 목표" : "≠ 목표 2.5"}
            </p>
          </div>
        );
      }}
    />
  );
}
