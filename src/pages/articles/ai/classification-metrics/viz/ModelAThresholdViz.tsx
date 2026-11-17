import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 대출 1,000건 중 부도 100건, Model A는 부도에 .51·정상에 .49.
 * 그림 앞의 세 예측 질문(AUC vs Brier, τ .50→.52, FN 비용 20배)에 같은 숫자로 답한다.
 * 칸 하나 = 10건. 비용은 false positive 1, false negative 20(가정 단위, 본문의 "20배"만 사용).
 * 계산: Brier = (1−.51)² = (.49)² = .2401, 비교용 상수 .10 → (100×.81 + 900×.01)/1000 = .09.
 * τ=.50 → 오류 0, τ=.52 → FN 100 → 건당 2.0, τ=.49 → FP 900 → 건당 0.9.
 */
const N_DEFAULT = 100;
const N_NORMAL = 900;
const N_TOTAL = N_DEFAULT + N_NORMAL;
const S_DEFAULT = 0.51;
const S_NORMAL = 0.49;
const C_FN = 20;
const C_FP = 1;

const SCENES: readonly { label: string; summary: string; tau: number | null; note: string }[] = [
  {
    label: "순서: 부도가 모두 위에",
    summary: "ROC-AUC = 1.0",
    tau: null,
    note: "ROC-AUC는 부도 1건과 정상 1건을 무작위로 뽑았을 때 부도가 더 높은 score를 받을 확률입니다. 100 × 900 = 90,000쌍 모두에서 부도(.51)가 정상(.49)보다 높으므로 1.0입니다.",
  },
  {
    label: "확률: 51%라고 말했지만",
    summary: "Brier .2401",
    tau: null,
    note: "Brier score는 보고한 probability와 실제 결과(부도 1, 정상 0)의 차이를 제곱해 평균한 값이고 낮을수록 좋습니다. 부도는 (1 − .51)², 정상은 (0 − .49)²로 모두 .2401입니다. 모든 신청에 실제 부도율 .10(100/1,000)을 똑같이 주는 비교 model(가정)은 순서를 전혀 가르지 못해도 Brier가 .09로 더 낮습니다.",
  },
  {
    label: "Threshold τ = .50",
    summary: "alert 100건 · 오류 0건",
    tau: 0.5,
    note: "Score가 threshold τ 이상인 신청에만 alert를 겁니다. .51 묶음만 넘으므로 부도 100건이 모두 걸리고 정상은 하나도 걸리지 않습니다.",
  },
  {
    label: "Threshold τ = .52",
    summary: "alert 0건 · 놓친 부도 100건",
    tau: 0.52,
    note: "τ를 .52로 올려도 두 묶음의 score와 순서는 그대로이고 action만 바뀝니다. 어느 묶음도 넘지 못해 부도 100건을 모두 놓칩니다(false negative). 정확도는 900/1,000 = 90%, 비용은 100 × 20 / 1,000 = 건당 2.0입니다.",
  },
  {
    label: "Threshold τ = .49",
    summary: "alert 1,000건 · 잘못 울린 정상 900건",
    tau: 0.49,
    note: "τ를 .49로 내리면 두 묶음 모두 alert이고 정상 900건이 잘못 울립니다(false positive). 정확도는 10%로 .52보다 낮지만 비용은 900 × 1 / 1,000 = 건당 0.9로 더 낮습니다. Model A에서는 .50이 정확도와 비용 모두 가장 좋습니다.",
  },
];

const COLOR_DEFAULT = "#dc2626";
const COLOR_NORMAL = "#94a3b8";
const COLOR_TAU = "#d97706";
const COLOR_BAR = "#2563eb";

function xOf(score: number) {
  return 20 + ((score - 0.48) / 0.05) * 280;
}

function Bar({ label, value, scale, text }: { label: string; value: number; scale: number; text: string }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${Math.min(100, (value / scale) * 100)}%`, backgroundColor: COLOR_BAR }} />
      </div>
      <span className="text-right font-mono font-bold">{text}</span>
    </div>
  );
}

function Group({ count, isDefault, tag, alerted }: { count: number; isDefault: boolean; tag: string; alerted: boolean | null }) {
  const cells = Array.from({ length: count / 10 }, (_, index) => index);
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 ${alerted ? "border-amber-600" : "border-border"}`}>
      <p className="text-xs font-bold leading-5">
        score {isDefault ? ".51" : ".49"} · {isDefault ? "부도" : "정상"} {count}건
      </p>
      <p className="min-h-10 text-xs sm:min-h-0 leading-5 text-muted-foreground">{tag}</p>
      <div className="mt-1 grid w-full max-w-[8rem] grid-cols-10 gap-[2px] sm:max-w-[12rem] sm:grid-cols-[repeat(15,minmax(0,1fr))]">
        {cells.map((cell) => (
          <span
            key={cell}
            className="block aspect-square rounded-[2px] border"
            style={{ borderColor: isDefault ? COLOR_DEFAULT : COLOR_NORMAL, backgroundColor: isDefault ? COLOR_DEFAULT : "transparent" }}
          />
        ))}
      </div>
    </div>
  );
}

function tagsFor(active: number) {
  const tau = SCENES[active].tau;
  if (tau === null) {
    return active === 0
      ? { normal: "모두 부도보다 아래", def: "모두 정상보다 위" }
      : { normal: "말한 49% · 실제 부도 0/900", def: "말한 51% · 실제 부도 100/100" };
  }
  const normalAlert = S_NORMAL >= tau;
  const defaultAlert = S_DEFAULT >= tau;
  return {
    normal: normalAlert ? "alert · 잘못 울림 900" : "통과 · 맞게 통과",
    def: defaultAlert ? "alert · 맞게 걸림" : "통과 · 놓친 부도 100",
  };
}

function Outcome({ tau }: { tau: number }) {
  const fn = S_DEFAULT >= tau ? 0 : N_DEFAULT;
  const fp = S_NORMAL >= tau ? N_NORMAL : 0;
  const accuracy = ((N_TOTAL - fn - fp) / N_TOTAL) * 100;
  const cost = (C_FN * fn + C_FP * fp) / N_TOTAL;
  return (
    <div className="space-y-2">
      <Bar label="정확도" value={accuracy} scale={100} text={`${accuracy}%`} />
      <Bar label="건당 비용 (가정 단위)" value={cost} scale={2} text={cost.toFixed(1)} />
    </div>
  );
}

export default function ModelAThresholdViz() {
  return (
    <SceneShell
      eyebrow="Model A · 대출 1,000건"
      title="같은 Model A를 순서·확률·action으로 따로 채점하기"
      description="부도 100건에 .51, 정상 900건에 .49를 준 Model A입니다. 칸 하나는 10건이고, 비용은 false positive 1, false negative 20으로 둡니다(가정 단위)."
      ariaLabel="Model A의 ROC-AUC, Brier score, threshold별 alert와 비용"
      scenes={SCENES}
      render={(active) => {
        const tau = SCENES[active].tau;
        const tags = tagsFor(active);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 320 56" role="img" aria-label="score 축 위의 두 묶음과 threshold" className="mx-auto block h-auto w-full max-w-[24rem]">
              <line x1="20" y1="34" x2="300" y2="34" stroke="#94a3b8" strokeWidth="1" />
              {[0.49, 0.5, 0.51, 0.52].map((s) => (
                <g key={s}>
                  <line x1={xOf(s)} y1="31" x2={xOf(s)} y2="37" stroke="#94a3b8" strokeWidth="1" />
                  <text x={xOf(s)} y="50" textAnchor="middle" className="fill-muted-foreground text-[11px]">
                    {s.toFixed(2).slice(1)}
                  </text>
                </g>
              ))}
              <circle cx={xOf(S_NORMAL)} cy="34" r="5" fill="none" stroke={COLOR_NORMAL} strokeWidth="1.25" />
              <circle cx={xOf(S_DEFAULT)} cy="34" r="5" fill={COLOR_DEFAULT} stroke={COLOR_DEFAULT} strokeWidth="1" />
              <g opacity={tau === null ? 0 : 1}>
                <line x1={xOf(tau ?? 0.5)} y1="8" x2={xOf(tau ?? 0.5)} y2="42" stroke={COLOR_TAU} strokeWidth="1.25" />
                <text x={xOf(tau ?? 0.5)} y="16" dx="5" className="fill-foreground text-[11px] font-bold">
                  τ 이상 → alert
                </text>
              </g>
            </svg>
            <div className="mx-auto mt-2 grid max-w-[30rem] grid-cols-2 gap-2">
              <Group count={N_NORMAL} isDefault={false} tag={tags.normal} alerted={tau === null ? null : S_NORMAL >= tau} />
              <Group count={N_DEFAULT} isDefault tag={tags.def} alerted={tau === null ? null : S_DEFAULT >= tau} />
            </div>
            <StableSceneStack
              active={active}
              className="mt-4"
              scenes={SCENES.map((scene, index) => {
                if (scene.tau !== null) return <Outcome key={index} tau={scene.tau} />;
                if (index === 0) {
                  return (
                    <p key={index} className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                      부도·정상 90,000쌍 모두 부도가 위 → ROC-AUC 1.0
                    </p>
                  );
                }
                return (
                  <div key={index} className="space-y-2">
                    <Bar label="Model A Brier" value={0.2401} scale={0.25} text=".2401" />
                    <Bar label="모두 부도율 .10" value={0.09} scale={0.25} text=".09" />
                  </div>
                );
              })}
            />
          </div>
        );
      }}
    />
  );
}
