import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #case — 자료 여덟 칸의 비중.
 * 같은 비중: 칸마다 1/8 → 오차 20/8=2.5, 변화율 32/8=4 → 3−0.4=2.6.
 * 묶음 평균을 반씩: 앞 두 칸 1/4씩, 뒤 여섯 칸 1/12씩 → 오차 (1+3)/2=2, 변화율 (2+14/3)/2=10/3 → 3−1/3≈2.666667.
 */
const SCENES: readonly ShellScene[] = [
  { label: "여덟 자료를 같은 비중으로", summary: "오차 20 ÷ 8 = 2.5", note: "칸 하나의 폭이 자료 하나의 비중입니다. 여덟 칸의 폭이 같으면 앞 묶음이 전체의 1/4, 뒤 묶음이 3/4를 차지합니다." },
  { label: "묶음 평균을 다시 반씩", summary: "오차 (1 + 3) ÷ 2 = 2", note: "묶음 평균 1과 3을 반씩 섞으면 앞의 두 칸이 전체의 절반을 받습니다. 뒤의 여섯 칸은 나머지 절반을 나눠 가지므로 짧은 묶음이 과대평가됩니다." },
  { label: "그 차이가 이동까지", summary: "2.6 ≠ 약 2.666667", note: "변화율도 같은 비중 문제를 겪습니다. 이동 크기 0.1을 쓰면 숫자 3이 도착하는 곳이 달라집니다. 이 예의 합계들은 설명을 위한 가정 값입니다." },
];

const EQUAL = [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8];
const HALF = [1 / 4, 1 / 4, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12];
const FIRST = "#d97706";
const SECOND = "#2563eb";

function Cells({ weights, firstLabel, secondLabel }: { weights: readonly number[]; firstLabel: string; secondLabel: string }) {
  return (
    <div className="min-w-0">
      <div className="flex h-9 w-full gap-px">
        {weights.map((weight, index) => (
          <div key={index} className="h-full rounded-sm" style={{ width: `${weight * 100}%`, backgroundColor: index < 2 ? FIRST : SECOND, opacity: 0.8 }} />
        ))}
      </div>
      <div className="mt-1 flex w-full text-xs font-semibold">
        <span className="min-w-0 text-amber-700 dark:text-amber-400" style={{ width: `${(weights[0] + weights[1]) * 100}%` }}>
          {firstLabel}
        </span>
        <span className="min-w-0 text-blue-700 dark:text-blue-400">{secondLabel}</span>
      </div>
    </div>
  );
}

function Calc({ name, line, strong }: { name: string; line: string; strong?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${strong ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
      <p className="text-xs text-muted-foreground">{name}</p>
      <p className="font-mono text-sm font-bold">{line}</p>
    </div>
  );
}

export default function WeightShareViz() {
  return (
    <SceneShell
      eyebrow="여덟 자료의 비중"
      title="같은 여덟 자료인데 어떻게 평균하느냐에 따라 칸의 폭이 달라집니다"
      description="주황 두 칸이 첫 묶음, 파랑 여섯 칸이 둘째 묶음입니다. 칸의 폭은 비중이며 자료의 값이 아닙니다. 오차 합은 2와 18, 변화율 합은 4와 28입니다 (가정)."
      ariaLabel="두 묶음을 평균하는 방식에 따른 자료 여덟 개의 비중과 결과"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <Cells weights={active === 0 ? EQUAL : HALF} firstLabel={active === 0 ? "1/4" : "1/2"} secondLabel={active === 0 ? "3/4" : "1/2"} />
          {active === 2 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <Calc name="같은 비중 (평균 변화율 4)" line="3 − 0.1 × 4 = 2.6" strong />
              <Calc name="반씩 (평균 변화율 10/3)" line="3 − 0.1 × 10/3 ≈ 2.666667" />
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              <Calc name={active === 0 ? "합을 자료 수로" : "첫 묶음 평균"} line={active === 0 ? "(2 + 18) ÷ 8" : "2 ÷ 2 = 1"} />
              <Calc name={active === 0 ? "오차 평균" : "둘째 묶음 평균"} line={active === 0 ? "2.5" : "18 ÷ 6 = 3"} strong={active === 0} />
            </div>
          )}
        </div>
      )}
    />
  );
}
