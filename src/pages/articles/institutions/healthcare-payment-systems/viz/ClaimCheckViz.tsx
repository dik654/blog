import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 청구 → 자격·보장 대상·정한 가격 확인 → 8만 원 지급, 또는 조정·거절.
 * 조정·거절의 금액은 본문에 없으므로 숫자를 적지 않는다.
 */
const CHECK = "#2563eb";
const OK = "#16a34a";
const ALT = "#d97706";

const SCENES = [
  { label: "병원이 청구를 보냅니다", summary: "진료 기록 + 청구 내역", note: "진료가 끝나면 병원이 진료 기록과 청구 내역을 지급자에게 보냅니다. 환자는 이미 창구에서 2만 원을 냈습니다(가정)." },
  { label: "지급자가 세 가지를 확인합니다", summary: "자격 · 보장 대상 · 정한 가격", note: "지급자는 이 사람이 자격이 있는지, 이 진료가 보장 대상인지, 정한 가격에 맞는지 봅니다." },
  { label: "그대로 인정되면", summary: "2 + 8 = 10만 원", note: "지급자가 별도로 8만 원을 보내 병원 총수입이 10만 원이 됩니다(가정)." },
  { label: "조정되거나 거절되면", summary: "총지급 ≠ 10만 원일 수 있음", note: "청구가 조정되거나 거절되면 실제 총지급이 10만 원과 달라질 수 있습니다. 얼마가 되는지는 글에 수치가 없어 적지 않았습니다." },
] as const;

export default function ClaimCheckViz() {
  return (
    <SceneShell
      eyebrow="지급 전 확인"
      title="청구는 확인을 거친 뒤에 돈이 됩니다"
      description="지급자는 공동 재원에서 병원으로 돈을 보내는 쪽입니다. 금액은 앞 절의 가정입니다."
      ariaLabel="병원 청구가 지급자 확인을 거쳐 인정, 조정, 거절로 갈리는 분기"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 180" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Box x={4} y={62} w={76} h={56} title="병원" sub="기록·청구" on={active === 0} />
          <Arrow x1={82} y1={90} x2={108} y2={90} color={CHECK} on={active === 0} />
          <g opacity={active === 1 ? 1 : 0.55}>
            <rect x={110} y={28} width={92} height={124} rx={8} fill={CHECK} fillOpacity={active === 1 ? 0.12 : 0.04} stroke={CHECK} strokeWidth={1} />
            <text x={156} y={48} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">지급자</text>
            {["자격", "보장 대상", "정한 가격"].map((item, index) => (
              <text key={item} x={156} y={76 + index * 24} textAnchor="middle" fontSize={11.5} fill="currentColor">{item}</text>
            ))}
          </g>
          <Arrow x1={204} y1={72} x2={236} y2={38} color={OK} on={active === 2} />
          <Arrow x1={204} y1={90} x2={236} y2={90} color={ALT} on={active === 3} />
          <Arrow x1={204} y1={108} x2={236} y2={142} color={ALT} on={active === 3} />
          <Box x={238} y={14} w={118} h={48} title="인정" sub="8만 원 지급" color={OK} on={active === 2} />
          <Box x={238} y={70} w={118} h={40} title="조정" color={ALT} on={active === 3} dashed />
          <Box x={238} y={122} w={118} h={40} title="거절" color={ALT} on={active === 3} dashed />
        </svg>
      )}
    />
  );
}
