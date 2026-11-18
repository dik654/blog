import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #prove-path — 행마다 0인 제약이 왜 "Z_H로 나누어떨어짐" 하나로 바뀌는가.
 * 8행 domain 점 h0..h7에서 제약 잔차 → 섞은 값 C_α(h) → Z_H(h)를 나란히 놓는다.
 * 섞는 순서는 C_α = C0 + α·C1 + α²·C2 + α³·C3 (시작·이동·덧셈·끝, 가정).
 * 변조 표는 앞 Viz와 같은 row 3=(2,4): h2 잔차 (0,1) → α², h3 잔차 (−1,−1) → −α−α².
 */
const W = 330;
const H = 212;
const X0 = 76;
const STEP = 28;
const ZETA_X = 308;
const px = (i: number) => X0 + i * STEP;

const ROW_Y = { residual: 66, mixed: 106, vanish: 136, axis: 164 } as const;
const LINE = 11;

const HONEST_RESIDUALS = ["0,0,0", "0,0", "0,0", "0,0", "0,0", "0,0", "0,0", "0"];
const TAMPERED_RESIDUALS = ["0,0,0", "0,0", "0,1", "−1,−1", "0,0", "0,0", "0,0", "0"];
const HONEST_MIXED = ["0", "0", "0", "0", "0", "0", "0", "0"];
const TAMPERED_MIXED = ["0", "0", "α²", "−α−α²", "0", "0", "0", "0"];

const SCENES = [
  {
    label: "정상 trace",
    summary: "8점 모두 C_α=0 → Q가 있음",
    note: "정상 8행에서는 모든 점의 잔차가 0이라 섞은 값 C_α도 여덟 점에서 모두 0입니다. Z_H도 바로 그 여덟 점에서 0이므로 C_α는 Z_H로 나머지 없이 나뉘고 몫 Q가 생깁니다.",
  },
  {
    label: "row 3을 바꾼 trace (가정)",
    summary: "h₂에서 C_α=α² ≠ 0",
    note: "앞 그림의 변조 표입니다. h₂에서는 덧셈 잔차 1 하나만 남아 C_α(h₂)=α²이고, α가 0이 아니면 0이 아닙니다. Z_H(h₂)는 0이므로 C_α=Z_H·Q를 만족하는 다항식 Q가 없습니다. h₃의 −α−α²는 α 값에 따라 달라 근거로 쓰지 않았습니다.",
  },
  {
    label: "검증자는 ζ 한 점에서 대조",
    summary: "C_α(ζ) = Z_H(ζ)·Q(ζ)",
    note: "ζ는 quotient commitment 뒤 transcript가 정하는, 8행 domain 밖의 점입니다. 검증자는 여덟 행의 제약을 하나씩 받지 않고 ζ에서 연 값으로 이 항등식 하나를 대조합니다.",
  },
] as const;

const COLORS = { ink: "#334155", muted: "#94a3b8", ok: "#15803d", bad: "#b91c1c", accent: "#2563eb" } as const;

function cellColor(value: string, dim: boolean) {
  if (dim) return COLORS.muted;
  return value === "0" || /^0(,0)*$/.test(value) ? COLORS.ok : COLORS.bad;
}

function Figure({ active }: { active: number }) {
  const tampered = active === 1;
  const zetaScene = active === 2;
  const residuals = tampered ? TAMPERED_RESIDUALS : HONEST_RESIDUALS;
  const mixed = tampered ? TAMPERED_MIXED : HONEST_MIXED;
  const verdict = tampered
    ? "h₂: Z_H=0인데 C_α≠0 → 나누어떨어지지 않음"
    : zetaScene
      ? "여덟 점 대신 바깥점 ζ 하나에서 항등식 대조"
      : "여덟 점 모두 C_α=0 = Z_H의 근 → Q = C_α / Z_H";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${(SCENES as readonly { label: string }[])[active].label}: ${verdict}`}>
      <text x={4} y={20} fontSize={11} fontWeight={700} fill={tampered ? COLORS.bad : COLORS.ink}>
        {verdict}
      </text>
      {[
        ["잔차", ROW_Y.residual],
        ["C_α(h)", ROW_Y.mixed],
        ["Z_H(h)", ROW_Y.vanish],
      ].map(([name, y]) => (
        <text key={String(name)} x={4} y={Number(y) + 4} fontSize={11} fill={COLORS.ink} fontWeight={600}>
          {name}
        </text>
      ))}
      <text x={4} y={40} fontSize={9.5} fill={COLORS.muted}>
        잔차 순서 — h0: 시작·이동·덧셈 / h1–h6: 이동·덧셈 / h7: 끝
      </text>
      {residuals.map((value, i) => (
        <g key={i}>
          {tampered && (i === 2 || i === 3) && (
            <rect x={px(i) - 14} y={ROW_Y.residual - 22} width={28} height={ROW_Y.vanish - ROW_Y.residual + 32} rx={4} fill="none" stroke={i === 2 ? COLORS.bad : COLORS.muted} strokeWidth={i === 2 ? 1.25 : 1} strokeDasharray={i === 2 ? undefined : "3 2"} />
          )}
          {value.split(",").map((part, k, parts) => (
            <text key={k} x={px(i)} y={ROW_Y.residual + 4 + (k - (parts.length - 1) / 2) * LINE} textAnchor="middle" fontSize={10.5} fill={cellColor(part, zetaScene)} fontFamily="ui-monospace, monospace">
              {part}
            </text>
          ))}
          <text x={px(i)} y={ROW_Y.mixed + 4} textAnchor="middle" fontSize={mixed[i].length > 3 ? 10 : 11.5} fontWeight={700} fill={cellColor(mixed[i], zetaScene)} fontFamily="ui-monospace, monospace">
            {mixed[i]}
          </text>
          <text x={px(i)} y={ROW_Y.vanish + 4} textAnchor="middle" fontSize={11} fill={zetaScene ? COLORS.muted : COLORS.ink} fontFamily="ui-monospace, monospace">
            0
          </text>
          <circle cx={px(i)} cy={ROW_Y.axis} r={4} fill={zetaScene ? "#cbd5e1" : COLORS.ink} />
          <text x={px(i)} y={ROW_Y.axis + 18} textAnchor="middle" fontSize={11} fill={COLORS.ink}>
            h<tspan fontSize={8} dy={3}>{i}</tspan>
          </text>
        </g>
      ))}
      <line x1={px(0) - 12} x2={px(7) + 12} y1={ROW_Y.axis} y2={ROW_Y.axis} stroke={COLORS.muted} strokeWidth={1} />
      <text x={(px(0) + px(7)) / 2} y={H - 4} textAnchor="middle" fontSize={10} fill={COLORS.muted}>
        8행 trace domain H
      </text>
      <line x1={px(7) + 14} x2={px(7) + 14} y1={ROW_Y.residual - 20} y2={ROW_Y.axis + 8} stroke={COLORS.muted} strokeWidth={1} strokeDasharray="3 3" />
      <circle cx={ZETA_X} cy={ROW_Y.axis} r={5} fill={zetaScene ? COLORS.accent : "none"} stroke={zetaScene ? COLORS.accent : COLORS.muted} strokeWidth={1} />
      <text x={ZETA_X} y={ROW_Y.axis + 18} textAnchor="middle" fontSize={12} fontWeight={zetaScene ? 700 : 400} fill={zetaScene ? COLORS.accent : COLORS.muted}>
        ζ
      </text>
      {zetaScene && (
        <>
          <text x={ZETA_X} y={ROW_Y.mixed + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.accent}>
            C_α(ζ)
          </text>
          <text x={ZETA_X} y={(ROW_Y.mixed + ROW_Y.vanish) / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.accent}>
            =
          </text>
          <text x={ZETA_X} y={ROW_Y.vanish + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.accent}>
            Z_H(ζ)
          </text>
          <text x={ZETA_X} y={ROW_Y.vanish + 17} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.accent}>
            ×Q(ζ)
          </text>
        </>
      )}
    </svg>
  );
}

export default function QuotientPointsViz() {
  return (
    <StepSceneShell
      eyebrow="행마다 0 → 나눗셈 하나"
      title="여덟 행의 제약이 몫 Q 하나로 바뀌는 조건"
      description="h₀…h₇은 trace 8행에 대응하는 domain 점입니다. 잔차는 그 점에서 검사하는 제약 값, C_α는 제약들을 α의 거듭제곱으로 섞은 값(섞는 순서 시작·이동·덧셈·끝은 가정), Z_H는 여덟 점 모두에서 0인 다항식입니다."
      ariaLabel="trace domain 여덟 점의 제약 잔차와 C_α, Z_H 값 및 바깥점 ζ 대조"
      scenes={SCENES}
      render={(active) => <Figure active={active} />}
    />
  );
}
