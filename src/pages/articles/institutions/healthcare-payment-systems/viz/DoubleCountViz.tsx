import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits 첫 문단 — 2 + 8 = 10을 병원 입구에서 한 번만 센다.
 * 보험료의 크기는 본문에 없으므로 금액을 적지 않는다.
 */
const POOL = "#2563eb";
const PATIENT = "#d97706";
const BAD = "#dc2626";

const SCENES = [
  { label: "병원 입구에서 한 번 셉니다", summary: "2 + 8 = 10만 원", note: "환자 부담과 전체 의료비를 비교하려면 창구 지출 2만 원과 공동 지급 8만 원을 합쳐 10만 원으로 봅니다." },
  { label: "8만 원은 어디서 왔나", summary: "보험료 → 공동 재원 → 8만 원", note: "공동 지급 8만 원은 이미 모은 보험료 쪽에서 온 돈입니다. 같은 돈이 시점을 달리해 두 번 눈에 띌 뿐입니다." },
  { label: "보험료를 또 더하면", summary: "2 + 8 + 보험료 → 중복", note: "이미 모은 보험료를 같은 진료비에 또 더하면 지급과 재원을 중복해 세게 됩니다. 그래서 더해서는 안 됩니다." },
] as const;

export default function DoubleCountViz() {
  return (
    <SceneShell
      eyebrow="세는 자리"
      title="같은 돈을 두 번 세지 않습니다"
      description="금액은 사례의 가정입니다. 보험료의 크기는 글에 없어 숫자를 적지 않았습니다."
      ariaLabel="환자 지출과 공동 지급을 합친 10만 원, 보험료를 더할 때 생기는 중복"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Box x={4} y={18} w={76} h={46} title="보험료" sub="이미 모음" color={POOL} on={active >= 1} />
          <Arrow x1={82} y1={41} x2={106} y2={41} color={POOL} on={active === 1} />
          <Box x={108} y={18} w={76} h={46} title="공동 재원" color={POOL} on={active === 1} />
          <Arrow x1={186} y1={41} x2={246} y2={72} color={POOL} on={active === 0 || active === 1} />
          <text x={212} y={42} fontSize={12} fontWeight={700} fill={POOL} opacity={active === 2 ? 0.5 : 1}>8만 원</text>
          <Box x={4} y={100} w={76} h={46} title="환자" sub="창구" color={PATIENT} on={active === 0} />
          <Arrow x1={82} y1={123} x2={246} y2={92} color={PATIENT} on={active === 0} />
          <text x={150} y={130} fontSize={12} fontWeight={700} fill={PATIENT} opacity={active === 0 ? 1 : 0.5}>2만 원</text>
          <Box x={248} y={56} w={108} h={52} title={active === 2 ? "10만 원 + ?" : "10만 원"} sub="병원에서 셈" color={active === 2 ? BAD : "#16a34a"} on />
          {active === 2 && (
            <g>
              <path d="M42 16 L42 6 L302 6 L302 50" fill="none" stroke={BAD} strokeWidth={1.25} strokeDasharray="4 3" />
              <polygon points="302,55 298,47 306,47" fill={BAD} />
              <text x={172} y={160} textAnchor="middle" fontSize={12} fontWeight={700} fill={BAD}>같은 돈을 두 번 셈</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
