import SceneShell from "./SceneShell";
import { Arrow, Box } from "./SvgParts";

/**
 * 본문 대응: #limits — 실물 ETF, 합성 ETF, ETN의 청구 대상이 어디에 닿는가.
 * 합성 ETF의 스왑 상대방은 펀드 재산 안의 계약을 통해 만납니다. 담보와 한도는 규정·설명서마다 다릅니다.
 */
const SCENES = [
  { label: "실물 방식 ETF", summary: "내 지분 → 펀드 → 기초자산", note: "펀드 재산의 지분을 가지고, 그 재산이 기초자산을 직접 보유합니다." },
  { label: "합성 방식 ETF", summary: "내 지분 → 펀드 → 스왑 계약", note: "여전히 펀드 재산의 지분을 가집니다. 다만 재산 안에 계약 상대방에게 지수 성과를 받는 스왑이 있어, 그 상대방의 위험을 펀드를 거쳐 집니다. 담보와 위험한도는 적용 규정·설명서에 따라 다릅니다." },
  { label: "ETN", summary: "내 채권 → 발행자", note: "펀드 재산이라는 층이 없고 발행자의 채무를 직접 삽니다. 합성 ETF와 동일한 청구권으로 취급할 수 없습니다." },
] as const;

const ACCENT = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const MUTED = "#94a3b8";

export default function ClaimLayersViz() {
  return (
    <SceneShell
      eyebrow="청구가 닿는 곳"
      title="같은 지수를 따라가도 내 권리가 닿는 층이 다릅니다"
      description="왼쪽이 투자자입니다. 큰 틀은 펀드 재산이고, 화살표가 내 권리와 그 재산의 계약이 닿는 곳입니다."
      ariaLabel="실물 ETF, 합성 ETF, ETN에서 투자자의 권리가 닿는 대상 비교"
      scenes={SCENES}
      render={(active) => {
        const isEtn = active === 2;
        return (
          <svg viewBox="0 0 340 158" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={0} y={54} w={60} h={48} lines={["투자자"]} tone={ACCENT} />
            {!isEtn && (
              <g>
                <Arrow x1={60} y1={78} x2={98} y2={78} tone={ACCENT} />
                <text x={79} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>지분</text>
                <rect x={100} y={8} width={124} height={142} rx={8} fill="none" stroke={ACCENT} strokeWidth={1} />
                <text x={162} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">펀드 재산</text>
              </g>
            )}
            {active === 0 && <Box x={112} y={50} w={100} h={68} lines={["기초자산", "직접 보유"]} />}
            {active === 1 && (
              <g>
                <Box x={112} y={50} w={100} h={68} lines={["스왑 계약", "지수 성과를", "받기로 함"]} tone={AMBER} />
                <Arrow x1={212} y1={84} x2={248} y2={84} tone={AMBER} />
                <Box x={250} y={54} w={90} h={60} lines={["계약 상대방", "상대방 위험"]} tone={AMBER} />
              </g>
            )}
            {isEtn && (
              <g>
                <Arrow x1={60} y1={78} x2={118} y2={78} tone={RED} />
                <text x={89} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>채권</text>
                <Box x={120} y={44} w={110} h={68} lines={["발행자", "지급 약속(채무)"]} tone={RED} />
                <rect x={244} y={44} width={96} height={68} rx={8} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                <text x={292} y={74} textAnchor="middle" fontSize={11} fill="#64748b">내 몫의</text>
                <text x={292} y={90} textAnchor="middle" fontSize={11} fill="#64748b">펀드 재산 없음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
