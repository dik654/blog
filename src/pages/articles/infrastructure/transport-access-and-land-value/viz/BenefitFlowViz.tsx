import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 통근자는 1,000분을 아끼고 요금 2만·월세 10만을 낸다(가정).
 * 운영자 2만 + 집주인 10만 = 12만. 정부 부담은 본문이 금액을 정하지 않아 숫자 없이 점선으로 둡니다.
 */
const W = 360;
const H = 226;

const SCENES = [
  { label: "통근자가 얻는 시간", summary: "1,000분 · 현금 아님", note: "시간을 쉴 때 쓸지 일을 더 할지는 개인의 선택입니다. 16시간 40분에 시급을 곱한 값이 통장에 자동으로 들어오지는 않습니다." },
  { label: "통근자가 내는 현금", summary: "월 2만 + 10만 = 12만 원", note: "한 달 추가 요금 2만 원은 교통 운영자에게, 월세 인상 10만 원은 집주인에게 갑니다. 금액은 사례의 가정입니다. 화살표 굵기는 금액을 나타내지 않습니다." },
  { label: "정부가 질 수 있는 부담", summary: "금액 미정", note: "정부는 공사비와 운영 지원을 부담할 수 있습니다. 사례는 이 금액을 정하지 않았으므로 점선으로만 표시합니다." },
  { label: "월세를 감당 못 한다면", summary: "절약을 못 누릴 수 있음", note: "기존 임차인이 월세를 감당하지 못해 더 먼 곳으로 이동하면 원래 기대한 시간 절약을 누리지 못할 수 있습니다." },
] as const;

function Box({ x, y, w, h, title, sub, on, dashed = false, tone = "#475569" }: { x: number; y: number; w: number; h: number; title: string; sub?: string; on: boolean; dashed?: boolean; tone?: string }) {
  const opacity = on ? 1 : 0.35;
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={tone} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={tone}>{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={11} fill={tone}>{sub}</text>}
    </g>
  );
}

function Flow({ x1, y1, x2, y2, on, color, dashed = false }: { x1: number; y1: number; x2: number; y2: number; on: boolean; color: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 6;
  const left = [x2 - size * Math.cos(angle - 0.5), y2 - size * Math.sin(angle - 0.5)];
  const right = [x2 - size * Math.cos(angle + 0.5), y2 - size * Math.sin(angle + 0.5)];
  return (
    <g opacity={on ? 1 : 0.2}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${x2} ${y2}L${left[0]} ${left[1]}L${right[0]} ${right[1]}Z`} fill={color} />
    </g>
  );
}

export default function BenefitFlowViz() {
  return (
    <SceneShell
      eyebrow="누가 무엇을 얻고 내는가"
      title="시간은 통근자에게, 현금은 다른 곳으로 흐릅니다"
      description="같은 통근 사례를 장면마다 한 갈래씩 따라갑니다."
      ariaLabel="통근자의 시간 절약과 요금, 월세, 정부 부담의 흐름"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Box x={6} y={64} w={118} h={64} title={active === 3 ? "기존 임차인" : "통근자"} sub={active === 3 ? "기대한 시간 절약" : "시간 1,000분 절약"} on={active !== 2} tone="#2563eb" />
          <Box x={176} y={6} w={178} h={46} title="정부 · 부담할 수 있음" sub="공사비·운영 지원, 금액 미정" on={active === 2} dashed />
          <Box x={236} y={88} w={118} h={46} title="교통 운영자" sub="추가 요금 2만 받음" on={active === 1} tone="#b45309" />
          <Box x={236} y={170} w={118} h={46} title="집주인" sub="월세 인상 10만 받음" on={active === 1} tone="#b45309" />
          <Flow x1={124} y1={92} x2={235} y2={110} on={active === 1} color="#b45309" />
          <text x={176} y={94} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309" opacity={active === 1 ? 1 : 0.25}>2만</text>
          <Flow x1={124} y1={108} x2={235} y2={190} on={active === 1} color="#b45309" />
          <text x={158} y={156} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309" opacity={active === 1 ? 1 : 0.25}>10만</text>
          <Flow x1={65} y1={128} x2={65} y2={169} on={active === 3} color="#dc2626" dashed />
          <Box x={6} y={170} w={118} h={46} title="더 먼 곳으로 이동" sub="절약 못 누릴 수 있음" on={active === 3} dashed tone="#dc2626" />
        </svg>
      )}
    />
  );
}
