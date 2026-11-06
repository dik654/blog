import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mean-gradient — 같은 saw 행을 두 번 읽고, 오차가 평균을 거쳐 그 행으로 돌아오는 길.
 * g_h ≈ (−1.628147, 0.779874, 0.559748), 출현마다 g_h/2 ≈ (−0.814074, 0.389937, 0.279874), 같은 행에 모이면 g_h.
 */
const INK = "#64748b";
const AMBER = "#d97706";
const BLUE = "#2563eb";

const SCENES = [
  { label: "같은 행을 두 번 읽습니다", summary: "저장 위치 하나 · 출현 둘", note: "위치 1과 위치 3의 saw는 입력 표의 같은 행을 가리킵니다. 저장된 줄은 하나지만 계산에는 두 항으로 들어갑니다." },
  { label: "평균으로 합칩니다", summary: "½·[0,1,1] + ½·[0,1,1] = [0,1,1]", note: "각 출현은 평균에 1/C = 1/2만큼 들어갑니다. 이 평균 h로 다섯 후보의 확률과 정답 cat의 손실을 계산합니다." },
  { label: "오차가 평균까지 돌아옵니다", summary: "g_h ≈ (−1.628, 0.780, 0.560)", note: "g_h는 평균 h의 각 수를 바꿀 때 손실이 변하는 비율입니다. 정답과 후보 확률에서 평균까지 거꾸로 온 값입니다." },
  { label: "출현마다 절반씩", summary: "g_h/2 ≈ (−0.814, 0.390, 0.280)", note: "평균에 1/2만큼 들어갔으므로 각 출현에 돌아가는 기울기도 g_h에 1/2을 곱한 값입니다. 입력이 세 행이면 g_h/3이 됩니다." },
  { label: "같은 행에 모입니다", summary: "g_h/2 + g_h/2 = g_h", note: "두 출현이 같은 저장 위치를 가리키므로 마지막에 더해 g_h가 됩니다. 총합이 g_h라고 해서 각 출현의 나눗셈을 생략한 것은 아닙니다." },
] as const;

function Box({ x, y, w, label, on, color = INK }: { x: number; y: number; w: number; label: string; on: boolean; color?: string }) {
  return (
    <g opacity={on ? 1 : 0.35}>
      <rect x={x} y={y} width={w} height={32} rx={6} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + 21} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, on, label, labelX }: { x1: number; y1: number; x2: number; y2: number; color: string; on: boolean; label?: string; labelX?: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = (delta: number) => `${x2 - 6 * Math.cos(angle + delta)} ${y2 - 6 * Math.sin(angle + delta)}`;
  return (
    <g opacity={on ? 1 : color === AMBER ? 0 : 0.2}>
      <path d={`M${x1} ${y1} L${x2} ${y2} M${head(0.5)} L${x2} ${y2} L${head(-0.5)}`} fill="none" stroke={color} strokeWidth={1.25} />
      {on && label && <text x={labelX ?? x1} y={(y1 + y2) / 2 + 4} fontSize={12} fontWeight={700} textAnchor="middle" fill={color}>{label}</text>}
    </g>
  );
}

export default function MeanGradientViz() {
  return (
    <SceneShell
      eyebrow="평균을 거꾸로"
      title="두 번 읽은 saw 행으로 오차가 돌아가는 길"
      description="회색 화살표는 계산이 나아가는 길, 주황 화살표는 오차가 돌아오는 길입니다. C는 평균에 넣은 출현 수로 여기서는 2이고, 표의 값은 가정입니다."
      ariaLabel="같은 입력 행을 두 번 읽어 평균을 만들고 기울기가 절반씩 돌아와 같은 행에 모이는 장면"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 246" className="mx-auto block h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Box x={95} y={4} w={170} label="입력 표의 saw 행 W[3]" on={active === 0 || active === 4} color={active === 4 ? AMBER : INK} />
          <Box x={16} y={78} w={120} label="위치 1의 saw" on={active === 0 || active === 1 || active === 3} />
          <Box x={224} y={78} w={120} label="위치 3의 saw" on={active === 0 || active === 1 || active === 3} />
          <Box x={110} y={146} w={140} label="평균 h = [0,1,1]" on={active >= 1 && active <= 3} color={BLUE} />
          <Box x={110} y={212} w={140} label="정답 cat의 손실" on={active === 1 || active === 2} />

          <Arrow x1={120} y1={36} x2={64} y2={78} color={INK} on={active === 0} />
          <Arrow x1={240} y1={36} x2={296} y2={78} color={INK} on={active === 0} />
          <Arrow x1={64} y1={110} x2={130} y2={146} color={INK} on={active === 1} label="×1/2" labelX={66} />
          <Arrow x1={296} y1={110} x2={230} y2={146} color={INK} on={active === 1} label="×1/2" labelX={294} />
          <Arrow x1={160} y1={178} x2={160} y2={212} color={INK} on={active === 1} />

          <Arrow x1={200} y1={212} x2={200} y2={178} color={AMBER} on={active === 2} label="g_h" labelX={222} />
          <Arrow x1={150} y1={146} x2={96} y2={110} color={AMBER} on={active === 3} label="g_h/2" labelX={150} />
          <Arrow x1={210} y1={146} x2={264} y2={110} color={AMBER} on={active === 3} label="g_h/2" labelX={210} />
          <Arrow x1={96} y1={78} x2={150} y2={36} color={AMBER} on={active === 4} label="g_h/2" labelX={150} />
          <Arrow x1={264} y1={78} x2={210} y2={36} color={AMBER} on={active === 4} label="g_h/2" labelX={210} />
        </svg>
      )}
    />
  );
}
