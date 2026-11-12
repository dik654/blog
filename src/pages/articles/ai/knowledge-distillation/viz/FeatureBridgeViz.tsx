import KdSceneShell from "./KdSceneShell";

/**
 * 본문 대응: #feature-alignment — (가정) teacher 24층·1024 channel, student 12층·384 channel.
 * 층 쌍(ℓt, ℓs)을 고르고, 학습되는 projection r_φ가 384를 1024로 보낸 뒤, 같은 position끼리 빼서
 * 제곱 차이를 B·L·C_t로 나눠 평균합니다. 그림의 층 위치는 예시이며 본문은 어느 층인지 정하지 않습니다.
 */
const SCENES = [
  { label: "좌표계가 다른 두 모델", summary: "24층 × 1024 vs 12층 × 384", note: "막대 하나가 한 층이고 막대 폭이 그 층의 channel 수입니다(가정 규모). 층 수도 폭도 달라 같은 번호의 층을 그대로 짝지을 수 없습니다." },
  { label: "층 쌍 고르기", summary: "ℓt ↔ ℓs 를 선언", note: "어느 teacher 층(ℓt)을 어느 student 층(ℓs)과 비교할지 먼저 정합니다. 강조한 위치는 예시일 뿐이고, 본문은 특정 층을 정하지 않습니다. Token·위치도 같은 방식으로 맞춥니다." },
  { label: "폭이 달라 뺄 수 없음", summary: "384 − 1024 → shape 불일치", note: "한 position에서 student hidden은 384개 값, teacher hidden은 1024개 값입니다. 원소 수가 달라 두 벡터를 그대로 뺄 수 없습니다." },
  { label: "Projection r_φ", summary: "384 → 1024", note: "학습되는 projection r_φ가 student 벡터를 1024개 값으로 보냅니다. 이제 뺄셈은 가능하지만, shape가 같아졌다는 것이 두 값의 의미가 같다는 증명은 아닙니다." },
  { label: "차이를 평균", summary: "‖Δ‖² ÷ (B·L·C_t)", note: "대응한 모든 example(B)·position(L)·teacher channel(C_t)에서 제곱 차이를 더하고 원소 수로 나눕니다. Padding position은 mask로 뺍니다. 결과는 output metric과 ablation으로 다시 확인합니다." },
] as const;

const TEACHER_LAYERS = 24;
const STUDENT_LAYERS = 12;
const T_PICK = 15;
const S_PICK = 7;
const W = 360;
const H = 200;
const ROW_T = H / TEACHER_LAYERS;
const ROW_S = H / STUDENT_LAYERS;
const T_W = 120;
const S_W = (T_W * 384) / 1024;
const T_X = 20;
const S_X = W - 20 - S_W;

function Stacks({ active }: { active: number }) {
  const showPair = active >= 1;
  const ty = (TEACHER_LAYERS - 1 - T_PICK) * ROW_T;
  const sy = (STUDENT_LAYERS - 1 - S_PICK) * ROW_S;
  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="teacher 24층과 student 12층의 층 수와 폭 비교">
      {Array.from({ length: TEACHER_LAYERS }, (_, i) => (
        <rect key={`t${i}`} x={T_X} y={i * ROW_T + 1} width={T_W} height={ROW_T - 2} rx={1.5} fill={showPair && i === TEACHER_LAYERS - 1 - T_PICK ? "#16a34a" : "#cbd5e1"} />
      ))}
      {Array.from({ length: STUDENT_LAYERS }, (_, i) => (
        <rect key={`s${i}`} x={S_X} y={i * ROW_S + 1} width={S_W} height={ROW_S - 3} rx={1.5} fill={showPair && i === STUDENT_LAYERS - 1 - S_PICK ? "#2563eb" : "#cbd5e1"} />
      ))}
      {showPair && (
        <>
          <line x1={T_X + T_W + 4} y1={ty + ROW_T / 2} x2={S_X - 4} y2={sy + ROW_S / 2} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
          <text x={T_X + T_W + 8} y={ty + ROW_T / 2 - 6} fontSize={11} fontWeight={700} fill="#16a34a">ℓt</text>
          <text x={S_X - 8} y={sy + ROW_S / 2 - 6} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">ℓs</text>
        </>
      )}
      <text x={T_X} y={H + 20} fontSize={11} fill="#64748b">teacher 24층 · 폭 1024</text>
      <text x={W - 20} y={H + 20} textAnchor="end" fontSize={11} fill="#64748b">student 12층 · 폭 384</text>
    </svg>
  );
}

function VectorRow({ label, width, color, note }: { label: string; width: number; color: string; note: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2 text-xs">
      <span className="font-semibold">{label}</span>
      <div className="min-w-0">
        <div className="h-4 rounded-sm" style={{ width: `${(width / 1024) * 100}%`, backgroundColor: color }} />
        <span className="font-mono text-[11px] text-muted-foreground">{note}</span>
      </div>
    </div>
  );
}

function Vectors({ active }: { active: number }) {
  const projected = active >= 3;
  return (
    <div className="mx-auto max-w-[460px] space-y-4 py-4">
      <VectorRow label="teacher H_t(ℓt)" width={1024} color="#16a34a" note="position 하나 · 1024개 값" />
      <VectorRow
        label={projected ? "r_φ(H_s(ℓs))" : "student H_s(ℓs)"}
        width={projected ? 1024 : 384}
        color="#2563eb"
        note={projected ? "projection 뒤 · 1024개 값" : "position 하나 · 384개 값"}
      />
      <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5">
        {active === 2 && <span className="font-semibold text-red-700 dark:text-red-400">원소 수가 달라 뺄셈이 정의되지 않습니다.</span>}
        {active === 3 && <span className="font-semibold">Δ = H_t − r_φ(H_s) 를 계산할 수 있습니다. 의미 일치는 아직 모릅니다.</span>}
        {active === 4 && (
          <span className="font-mono">
            L_feat = Σ Δ² ÷ (B × L × 1024)
          </span>
        )}
      </div>
    </div>
  );
}

export default function FeatureBridgeViz() {
  return (
    <KdSceneShell
      eyebrow="Feature bridge"
      title="층을 짝짓고 폭을 맞춘 뒤에야 hidden feature를 뺄 수 있습니다"
      description="Hidden feature는 층 하나가 position마다 내는 값의 묶음이고, 그 개수가 channel 수입니다. 규모는 본문의 (가정) teacher 24층·1024 channel과 student 12층·384 channel입니다."
      ariaLabel="Teacher와 student hidden feature를 층 쌍 선택과 projection으로 비교하는 순서"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 [grid-template-areas:'stage']">
          <div className={`min-w-0 [grid-area:stage] ${active <= 1 ? "" : "invisible"}`} aria-hidden={active > 1}>
            <Stacks active={Math.min(active, 1)} />
          </div>
          <div className={`min-w-0 self-center [grid-area:stage] ${active <= 1 ? "invisible" : ""}`} aria-hidden={active <= 1}>
            <Vectors active={Math.max(active, 2)} />
          </div>
        </div>
      )}
    />
  );
}
