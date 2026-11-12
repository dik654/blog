import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary 의 grouped differential attention 문단.
 * 기본형은 head 마다 signal map 1 · noise map 1. grouped 는 signal 을 더 많이, 공유 noise 를 적게 둔다.
 * 그림의 개수(기본형 4쌍, grouped 2 group × signal 3 + noise 1)는 비율을 보이려는 가정이다.
 */
const PAIRS = 4;
const GROUPS = 2;
const SIG_PER_GROUP = 3;

const SCENES = [
  {
    label: "기본형: signal 하나에 noise 하나",
    summary: `signal ${PAIRS} · noise ${PAIRS}`,
    note: "head마다 signal map과 noise map을 같은 수만큼 둡니다. 그러면 noise를 추정하는 데 signal만큼의 계산을 씁니다.",
  },
  {
    label: "grouped: noise를 group이 나눠 씁니다",
    summary: `signal ${GROUPS * SIG_PER_GROUP} · noise ${GROUPS}`,
    note: "signal map을 더 많이 두고 noise map은 적게 두어 group 안에서 함께 씁니다. 개수와 비율은 그림을 위한 가정입니다.",
  },
  {
    label: "첫 group에서 뺍니다",
    summary: `공유 noise 1 → signal ${SIG_PER_GROUP}`,
    note: "첫 group의 signal map 셋이 모두 같은 noise map을 뺍니다. noise map 하나가 여러 signal map의 공통 성분 추정을 맡는 셈입니다.",
  },
  {
    label: "group 단위로 반복합니다",
    summary: `group ${GROUPS}개에서 같은 방식`,
    note: "다음 group도 자기 공유 noise map으로 같은 뺄셈을 합니다. 이 변형은 differential attention의 signal·noise 축을 재사용하고 head 비율을 다시 설계한 것입니다.",
  },
] as const;

const SIG_C = "#2563eb";
const NOISE_C = "#d97706";
const DIM = "#cbd5e1";
const BOX_W = 40;
const BOX_H = 30;
const SIG_Y = 34;
const NOISE_Y = 146;

function Box({ x, y, label, color, on }: { x: number; y: number; label: string; color: string; on: boolean }) {
  return (
    <g>
      <rect x={x - BOX_W / 2} y={y} width={BOX_W} height={BOX_H} rx={4} fill={on ? color : DIM} opacity={on ? 0.85 : 0.6} />
      <text x={x} y={y + 20} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, x2, on }: { x1: number; x2: number; on: boolean }) {
  const color = on ? NOISE_C : DIM;
  const dx = x2 - x1;
  const dy = SIG_Y + BOX_H - NOISE_Y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const tipX = x2 - ux * 2;
  const tipY = SIG_Y + BOX_H + 2;
  return (
    <g>
      <line x1={x1} y1={NOISE_Y} x2={tipX} y2={tipY} stroke={color} strokeWidth={on ? 1.25 : 1} />
      <polygon
        points={`${tipX},${tipY} ${tipX - ux * 8 - uy * 4},${tipY - uy * 8 + ux * 4} ${tipX - ux * 8 + uy * 4},${tipY - uy * 8 - ux * 4}`}
        fill={color}
      />
    </g>
  );
}

export default function GroupedNoiseViz() {
  return (
    <SceneShell
      eyebrow="grouped differential attention"
      title="noise map을 group이 공유하면 signal map을 더 많이 둘 수 있습니다"
      description="위 칸 S는 signal map, 아래 칸 N은 noise map입니다. 화살표는 그 noise map을 signal map에서 빼는 방향입니다."
      note="map 개수(기본형 4쌍, grouped 2 group × signal 3 · noise 1)는 비율을 보이려는 가정이며, 본문은 정확한 개수를 적지 않았습니다."
      ariaLabel="head마다 signal과 noise를 하나씩 두는 기본형과 noise를 group이 공유하는 grouped 형태의 비교"
      scenes={SCENES}
      render={(active) => {
        const grouped = active >= 1;
        const groupOn = (g: number) => active === 1 || (active === 2 && g === 0) || (active === 3 && g === 1);
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {!grouped &&
              Array.from({ length: PAIRS }, (_, i) => {
                const cx = 45 + i * 90;
                return (
                  <g key={i}>
                    <Arrow x1={cx} x2={cx} on />
                    <Box x={cx} y={SIG_Y} label="S" color={SIG_C} on />
                    <Box x={cx} y={NOISE_Y} label="N" color={NOISE_C} on />
                  </g>
                );
              })}
            {grouped &&
              Array.from({ length: GROUPS }, (_, g) => {
                const left = 8 + g * 176;
                const on = groupOn(g);
                const noiseX = left + 84;
                return (
                  <g key={g}>
                    <rect x={left} y={SIG_Y - 8} width={168} height={NOISE_Y + BOX_H - SIG_Y + 16} rx={8} fill="none" stroke={on ? "#94a3b8" : "#e2e8f0"} strokeWidth={1} strokeDasharray="4 3" />
                    <text x={left + 168} y={SIG_Y - 14} textAnchor="end" fontSize={13} fill={on ? "#334155" : "#94a3b8"}>
                      group {g + 1}
                    </text>
                    {Array.from({ length: SIG_PER_GROUP }, (_, k) => {
                      const sx = left + 28 + k * 56;
                      return <Arrow key={`a${k}`} x1={noiseX} x2={sx} on={on} />;
                    })}
                    {Array.from({ length: SIG_PER_GROUP }, (_, k) => (
                      <Box key={`s${k}`} x={left + 28 + k * 56} y={SIG_Y} label="S" color={SIG_C} on={on} />
                    ))}
                    <Box x={noiseX} y={NOISE_Y} label="N" color={NOISE_C} on={on} />
                  </g>
                );
              })}
          </svg>
        );
      }}
    />
  );
}
