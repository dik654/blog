import SceneShell from "./QuantSceneShell";

/**
 * 본문 대응: #floating-point-formats — 같은 4bit라도 INT4는 등간격, NVFP4(E2M1)는
 * 0 근처가 촘촘하고 큰 값 쪽이 성기다.
 * INT4: 부호 있는 code −8…7 중 0…7, scale = 6/7로 최대 code를 6에 맞춤(가정).
 * E2M1: 0, 0.5, 1, 1.5, 2, 3, 4, 6 (부호 bit가 음수 쪽을 대칭으로 만든다).
 * 간격: INT4 6/7 ≈ 0.857 일정, E2M1 0.5 → 1 → 2.
 */
const INT4 = [0, 1, 2, 3, 4, 5, 6, 7].map((code) => (code * 6) / 7);
const E2M1 = [0, 0.5, 1, 1.5, 2, 3, 4, 6];

const SCENES = [
  {
    label: "INT4 · 등간격",
    summary: "간격 6/7 ≈ 0.86",
    note: "INT4의 16개 code 중 0 이상인 8개(0…7)입니다. Scale을 최대 code 7이 6에 오도록 골랐다고 가정하면 모든 칸이 약 0.86으로 같습니다.",
  },
  {
    label: "NVFP4 · E2M1",
    summary: "0 · 0.5 · 1 · 1.5 · 2 · 3 · 4 · 6",
    note: "E2M1 4bit 중 부호를 뺀 여덟 값입니다. 부호 bit가 같은 점을 음수 쪽에도 대칭으로 만듭니다. 0 근처는 0.5 간격으로 촘촘하고 6 쪽으로 갈수록 벌어집니다.",
  },
  {
    label: "겹쳐 보기",
    summary: "0.5 → 1 → 2 vs 0.86 일정",
    note: "E2M1 간격은 0~2에서 0.5, 2~4에서 1, 4~6에서 2로, 2 이상에서는 지수 구간이 하나 올라갈 때마다 2배가 됩니다. 0 근처는 INT4보다 촘촘하고(0.5 < 0.86) 6 근처는 더 성깁니다(2 > 0.86). 0이 아닌 가장 작은 값 대비 최대값은 INT4 7배(6 ÷ 0.86), E2M1 12배(6 ÷ 0.5)라 같은 최대값에서 더 넓은 dynamic range를 얻습니다.",
  },
] as const;

const X0 = 16;
const X1 = 344;
const xOf = (v: number) => X0 + (v / 6) * (X1 - X0);

const E2M1_STEPS = [
  { from: 0, to: 2, label: "간격 0.5" },
  { from: 2, to: 4, label: "간격 1" },
  { from: 4, to: 6, label: "간격 2" },
] as const;

function Line({ y, values, color, labels, dim }: { y: number; values: readonly number[]; color: string; labels: readonly string[]; dim: boolean }) {
  return (
    <g opacity={dim ? 0.2 : 1}>
      <line x1={X0} x2={X1} y1={y} y2={y} stroke="#94a3b8" strokeWidth="1" />
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={xOf(v)} cy={y} r="4.5" fill={color} />
          <text x={xOf(v)} y={y + 20} textAnchor="middle" fontSize="12" fill="currentColor">
            {labels[i]}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function CodeSpacingViz() {
  return (
    <SceneShell
      eyebrow="4bit 값의 배치"
      title="같은 4bit라도 INT4는 등간격, NVFP4는 0 근처가 촘촘하다"
      description="가로축은 0부터 6까지의 실수값이고 점 하나가 4bit code 하나가 나타내는 값입니다. 두 format 모두 0 이상 쪽 점 8개만 그렸습니다."
      note="INT4 scale(6/7)은 두 줄의 최대값을 6으로 맞추려는 가정입니다. 실제 scale은 데이터 range로 정합니다."
      ariaLabel="INT4와 NVFP4 E2M1이 0부터 6 사이에 값을 배치하는 간격 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 176" role="img" aria-label={SCENES[active].label} className="block h-auto w-full text-foreground">
          <text x={X0} y="22" fontSize="12" fontWeight="700" fill="currentColor" opacity={active === 1 ? 0.3 : 1}>
            INT4 (code 0…7, 가정 scale)
          </text>
          <Line y={44} values={INT4} color="#2563eb" labels={INT4.map((v) => (v === 0 ? "0" : v.toFixed(2)))} dim={active === 1} />
          <g opacity={active === 2 ? 1 : 0}>
            <text x={(X0 + X1) / 2} y="82" textAnchor="middle" fontSize="12" fill="#2563eb">
              모든 간격 ≈ 0.86
            </text>
          </g>
          <text x={X0} y="102" fontSize="12" fontWeight="700" fill="currentColor" opacity={active === 0 ? 0.3 : 1}>
            NVFP4 (E2M1 크기 8개)
          </text>
          <Line y={124} values={E2M1} color="#d97706" labels={E2M1.map((v) => String(v))} dim={active === 0} />
          <g opacity={active === 2 ? 1 : 0}>
            {E2M1_STEPS.map((step) => (
              <g key={step.label}>
                <line x1={xOf(step.from) + 3} x2={xOf(step.to) - 3} y1="156" y2="156" stroke="#d97706" strokeWidth="1" />
                <text x={(xOf(step.from) + xOf(step.to)) / 2} y="172" textAnchor="middle" fontSize="12" fill="#d97706">
                  {step.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      )}
    />
  );
}
