import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — rollout은 predictor의 다음 latent를 emb에 이어 붙이고,
 * criterion은 마지막 예측과 목표의 좌표별 제곱 차이를 합한다.
 * z=x 1차원 가정: [+1,+1] → 0,1,2 비용 0 / [−1,−1] → 0,−1,−2 비용 16.
 * 합과 평균 구분: 세 좌표 차이 1,2,2 (가정) → 1+4+4 = 9, 평균이면 3.
 */
const SCENES = [
  { label: "시작 표현", summary: "emb = [0]", note: "emb는 지금까지의 표현을 시간 순서로 담은 줄입니다. 첫 칸은 관측에서 만든 표현입니다. 숫자는 latent를 z=x 한 차원으로 줄인 우리 가정입니다." },
  { label: "첫 예측을 붙임", summary: "emb = [0, 1]", note: "predictor가 낸 다음 latent를 줄 끝에 이어 붙입니다. 점선 칸은 센서 값이 아니라 예측입니다." },
  { label: "그 예측에서 또 예측", summary: "emb = [0, 1, 2]", note: "다음 입력에는 방금 붙인 예측이 들어갑니다. 실제 환경을 매번 관측하는 코드가 아닙니다." },
  { label: "마지막 칸만 목표와 비교", summary: "(2−2)² = 0 · (−2−2)² = 16", note: "criterion은 마지막 예측과 목표를 비교해 후보마다 비용 하나를 만듭니다. [+1,+1]은 0, [−1,−1]은 16입니다. 실제 학습된 LeWM의 192차원 표현을 이 숫자로 대체했다는 뜻은 아닙니다." },
  { label: "이름은 mse여도 합입니다", summary: "1 + 4 + 4 = 9 · 평균이면 3", note: "함수 이름은 mse_loss지만 reduction=\"none\"은 좌표별 제곱 차이를 그대로 두고, 뒤의 sum이 그것을 합합니다. 세 좌표의 차이가 1, 2, 2라고 놓으면(가정) 비용은 9이며 평균 3이 아닙니다." },
] as const;

function Cell({ value, kind, strong = false }: { value: string; kind: "seen" | "pred"; strong?: boolean }) {
  return (
    <span className={`flex h-11 w-14 items-center justify-center rounded border font-mono text-sm ${kind === "seen" ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-dashed border-blue-600 text-blue-700 dark:text-blue-300"} ${strong ? "font-bold" : ""}`}>
      {value}
    </span>
  );
}

function Line({ name, values, goal }: { name: string; values: readonly string[]; goal?: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold">{name}</p>
      <div className="flex flex-wrap items-center gap-1">
        {values.map((value, index) => <Cell key={index} value={value} kind={index === 0 ? "seen" : "pred"} strong={Boolean(goal) && index === values.length - 1} />)}
        {goal && <span className="ml-1 text-xs text-muted-foreground">↔ 목표 {goal}</span>}
      </div>
    </div>
  );
}

export default function RolloutConcatViz() {
  return (
    <SceneShell
      eyebrow="rollout과 cost"
      title="예측을 줄 끝에 이어 붙이고, 마지막 칸만 목표와 잽니다"
      description="주황 실선 칸은 관측에서 만든 표현, 파랑 점선 칸은 모델이 예측한 표현입니다. Rollout은 예측 결과를 다음 예측의 입력으로 쓰는 것입니다."
      ariaLabel="rollout이 예측을 이어 붙이고 criterion이 마지막 표현으로 비용을 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        if (active === 4) {
          return (
            <div className="grid grid-cols-3 gap-2 text-center">
              {[1, 2, 2].map((diff, index) => (
                <div key={index} className="rounded-lg border border-border px-1 py-2">
                  <p className="text-xs text-muted-foreground">좌표 {index + 1}</p>
                  <p className="font-mono text-sm">차이 {diff}</p>
                  <p className="font-mono text-sm font-bold">제곱 {diff * diff}</p>
                </div>
              ))}
              <p className="col-span-3 font-mono text-sm font-bold">sum → 1 + 4 + 4 = 9</p>
              <p className="col-span-3 text-xs text-muted-foreground">평균이었다면 9 ÷ 3 = 3</p>
            </div>
          );
        }
        if (active === 3) {
          return (
            <div className="space-y-3">
              <Line name="[+1, +1]" values={["0", "1", "2"]} goal="2" />
              <Line name="[−1, −1]" values={["0", "−1", "−2"]} goal="2" />
            </div>
          );
        }
        return <Line name="[+1, +1]의 emb" values={["0", "1", "2"].slice(0, active + 1)} />;
      }}
    />
  );
}
