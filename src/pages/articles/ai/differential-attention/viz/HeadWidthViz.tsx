import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 마지막 문단과 #boundary 의 연산 비용 문단.
 * hidden 3072 · head dim 128 → 표준 24 head(3072/128), differential 12 head(3072/256).
 * differential head 하나는 Q·K 를 128 씩 둘(Q1|Q2, K1|K2)로 나누고 V 는 256 폭 그대로 쓴다.
 * softmax map 수: 표준 24 × 1 = 24, differential 12 × 2 = 24.
 */
const HIDDEN = 3072;
const D = 128;
const STD_HEADS = HIDDEN / D;
const DIFF_HEADS = HIDDEN / (2 * D);

const SCENES = [
  {
    label: "표준: 128 폭 head 24개",
    summary: `${HIDDEN} ÷ ${D} = ${STD_HEADS} head`,
    note: `hidden 폭 ${HIDDEN}을 head 하나가 ${D}씩 나눠 맡습니다. head dim은 head 하나의 query·key 폭입니다. 저자의 3B 표준 Transformer는 이렇게 ${STD_HEADS}개 head를 둡니다.`,
  },
  {
    label: "Differential: 256 폭 head 12개",
    summary: `${HIDDEN} ÷ ${2 * D} = ${DIFF_HEADS} head`,
    note: `head 하나가 값 두 벌을 만들므로 head 하나의 폭이 ${2 * D}이 됩니다. 같은 ${HIDDEN}을 채우면 head는 ${DIFF_HEADS}개로 절반이 됩니다.`,
  },
  {
    label: "head 하나 안: Q·K는 반씩, V는 통째로",
    summary: `Q1·Q2·K1·K2 각 ${D}, V ${2 * D}`,
    note: `${2 * D} 폭 query를 반으로 갈라 Q1·Q2, key를 갈라 K1·K2를 얻습니다. Q1·K1로 signal map A1, Q2·K2로 noise map A2를 만들고, 두 map의 차가 ${2 * D} 폭 V 하나에 곱해집니다.`,
  },
  {
    label: "softmax map 수는 같습니다",
    summary: `${STD_HEADS} × 1 = ${DIFF_HEADS} × 2 = ${STD_HEADS}`,
    note: `head 수는 절반이지만 head마다 QKᵀ·softmax를 두 번 계산하므로 map 수는 ${STD_HEADS}개로 같습니다. 그래서 전체 FLOPs는 표준 attention과 비슷하게 맞춰질 뿐 줄지 않습니다.`,
  },
] as const;

const STD_C = "#64748b";
const DIFF_C = "#2563eb";
const NOISE_C = "#d97706";
const MUTED = "#cbd5e1";
const INK = "#334155";
const LEFT = 12;
const WIDTH = 336;

function Strip({ y, count, color, on, label }: { y: number; count: number; color: string; on: boolean; label: string }) {
  const w = WIDTH / count;
  return (
    <g>
      <text x={LEFT} y={y - 6} fontSize={15} fontWeight={700} fill={on ? color : "#94a3b8"}>
        {label}
      </text>
      {Array.from({ length: count }, (_, i) => (
        <rect key={i} x={LEFT + i * w + 0.75} y={y} width={w - 1.5} height={18} rx={2} fill={on ? color : MUTED} opacity={on ? (i === 0 && count === DIFF_HEADS ? 0.95 : 0.6) : 0.5} />
      ))}
    </g>
  );
}

export default function HeadWidthViz() {
  return (
    <SceneShell
      eyebrow="같은 hidden 폭"
      title="같은 3072 폭을 표준은 24 head로, differential은 12 head로 나눕니다"
      description="가로 막대 전체가 hidden 폭 3072이고, 칸 하나가 head 하나입니다. 숫자는 본문의 3B model 설정입니다."
      ariaLabel="hidden 3072를 표준 24 head와 differential 12 head로 나누고 한 head 안을 Q1, Q2, K1, K2, V로 가르는 그림"
      scenes={SCENES}
      render={(active) => {
        const zoom = active >= 2;
        const half = 120;
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Strip y={26} count={STD_HEADS} color={STD_C} on={active === 0 || active === 3} label={`표준 · ${STD_HEADS} head × ${D}`} />
            <Strip y={76} count={DIFF_HEADS} color={DIFF_C} on={active >= 1} label={`Differential · ${DIFF_HEADS} head × ${2 * D}`} />
            <text x={LEFT + WIDTH} y={20} textAnchor="end" fontSize={13} fill="#64748b">
              합 {HIDDEN}
            </text>
            {active === 2 && (
              <line x1={LEFT + WIDTH / DIFF_HEADS / 2} y1={96} x2={LEFT + 56} y2={110} stroke={DIFF_C} strokeWidth={1} />
            )}
            {active === 2 && (
              <g>
                {[
                  { name: "Q", y: 112 },
                  { name: "K", y: 138 },
                ].map((r) => (
                  <g key={r.name}>
                    <text x={LEFT} y={r.y + 14} fontSize={15} fontWeight={700} fill={INK}>
                      {r.name} {2 * D}
                    </text>
                    <rect x={LEFT + 56} y={r.y} width={half - 2} height={20} rx={3} fill={DIFF_C} opacity={0.75} />
                    <text x={LEFT + 56 + half / 2} y={r.y + 14} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">
                      {r.name}1 · {D}
                    </text>
                    <rect x={LEFT + 56 + half} y={r.y} width={half - 2} height={20} rx={3} fill={NOISE_C} opacity={0.75} />
                    <text x={LEFT + 56 + half * 1.5} y={r.y + 14} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">
                      {r.name}2 · {D}
                    </text>
                  </g>
                ))}
                <text x={LEFT + 56 + half / 2} y={174} textAnchor="middle" fontSize={13} fill={DIFF_C}>
                  ↓ A1 (signal)
                </text>
                <text x={LEFT + 56 + half * 1.5} y={174} textAnchor="middle" fontSize={13} fill={NOISE_C}>
                  ↓ A2 (noise)
                </text>
                <text x={LEFT} y={200} fontSize={15} fontWeight={700} fill={INK}>
                  V {2 * D}
                </text>
                <rect x={LEFT + 56} y={186} width={half * 2 - 2} height={20} rx={3} fill={STD_C} opacity={0.6} />
                <text x={LEFT + 56 + half} y={200} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">
                  V · 나누지 않음
                </text>
                <text x={LEFT + 56} y={226} fontSize={13} fill="#64748b">
                  A1 − λ·A2 하나가 V {2 * D} 전체에 곱해집니다
                </text>
              </g>
            )}
            {active === 3 && (
              <g>
                {[
                  { label: "표준", heads: STD_HEADS, per: 1, color: STD_C, y: 128 },
                  { label: "Differential", heads: DIFF_HEADS, per: 2, color: DIFF_C, y: 176 },
                ].map((r) => (
                  <g key={r.label}>
                    <text x={LEFT} y={r.y - 6} fontSize={15} fontWeight={700} fill={r.color}>
                      {r.label} · {r.heads} head × map {r.per}개 = {r.heads * r.per}
                    </text>
                    {Array.from({ length: r.heads * r.per }, (_, i) => (
                      <rect
                        key={i}
                        x={LEFT + i * (WIDTH / 24) + 0.75}
                        y={r.y}
                        width={WIDTH / 24 - 1.5}
                        height={18}
                        rx={2}
                        fill={r.per === 2 && i % 2 === 1 ? NOISE_C : r.color}
                        opacity={0.7}
                      />
                    ))}
                  </g>
                ))}
                <text x={LEFT} y={222} fontSize={13} fill="#64748b">
                  칸 하나 = softmax map 하나 (주황은 noise map)
                </text>
              </g>
            )}
            {!zoom && (
              <text x={LEFT} y={140} fontSize={13} fill="#64748b">
                {active === 0 ? "head dim = head 하나가 쓰는 query·key 폭" : "진하게 칠한 첫 칸을 다음 장면에서 펼칩니다"}
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
