import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — Stock Token은 RHJ가 발행한 채무증권이며 기초 주식·ETF에 대한 경제적 노출을 제공하고,
 * 기초 증권 발행자에 대한 직접 법적·수익적 권리는 주지 않는다.
 * uiMultiplier 예시의 비율 1 → 2와 표시 20은 가정이다(10 × 2 = 20).
 */
const W = 360;
const H = 176;
const SLATE = "#64748b";
const BLUE = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";

const SCENES = [
  { label: "전송 결과", summary: "Stock Token 10개 수령", note: "가상 TOK 대신 Stock Token 10개를 받았다고 합시다. 체인이 알려 주는 것은 토큰 잔액이 옮겨 왔다는 결과까지입니다. 이 결과만으로 기초 회사 주식 10주의 법적 소유권을 얻었다고 적지 않습니다." },
  { label: "권리의 상대방", summary: "RHJ가 발행한 채무증권", note: "RHJ는 Robinhood Assets (Jersey) Limited입니다. 보유자가 확인할 것은 이 발행자의 채무증권(발행자가 갚을 의무를 지는 증권) 조건입니다. 상품별 권리와 국가별 제한은 투자설명서와 최종 조건을 따릅니다." },
  { label: "기초 자산과의 관계", summary: "경제적 노출 · 직접 권리 없음", note: "토큰은 기초 주식·ETF에 대한 경제적 노출(손익이 그 가격을 따르는 관계)을 제공합니다. 그러나 기초 증권 발행자에 대한 직접 법적·수익적 권리는 주지 않는다고 공식 설명이 명시합니다." },
  { label: "수량과 표시 비율", summary: "raw balance 10은 그대로", note: "raw balance는 계약에 기록된 수량이고 uiMultiplier는 주식당 비율을 바꾸는 값입니다. 배당·분할 처리로 비율이 1에서 2가 됐다고 가정하면 10은 그대로인데 표시는 20입니다. 그래서 10토큰을 언제나 10주로 고정하지 않습니다." },
] as const;

function Box({ x, y, w, h, label, sub, color, faded = false, dashed = false }: { x: number; y: number; w: number; h: number; label: string; sub?: string; color: string; faded?: boolean; dashed?: boolean }) {
  return (
    <g opacity={faded ? 0.45 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={10.5} fill={SLATE}>{sub}</text>}
    </g>
  );
}

export default function StockTokenRightsViz() {
  return (
    <SceneShell
      eyebrow="토큰과 권리"
      title="토큰의 권리를 확인할 상대는 기초 회사가 아니라 RHJ입니다"
      description="왼쪽이 Stock Token을 받은 사람입니다. 파란 실선은 권리를 확인할 상대방, 주황 점선은 경제적 노출, ✕를 친 빨간 선은 직접 권리가 없음을 뜻합니다. 수량 10은 앞 사례를 옮긴 가정입니다."
      ariaLabel="Stock Token 보유자와 발행자, 기초 자산, 기초 증권 발행자의 관계"
      scenes={SCENES}
      render={(active) => {
        if (active === 3) {
          return (
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[3].label}: ${SCENES[3].summary}`}>
              <text x={10} y={22} fontSize={11} fontWeight={700} fill={SLATE}>배당·분할 처리 전</text>
              <Box x={10} y={32} w={112} h={46} label="raw balance 10" color={BLUE} />
              <Box x={144} y={32} w={72} h={46} label="비율 1" sub="(가정)" color={SLATE} />
              <Box x={238} y={32} w={112} h={46} label="표시 10" sub="(가정)" color={SLATE} />
              <text x={10} y={106} fontSize={11} fontWeight={700} fill={SLATE}>처리 후</text>
              <Box x={10} y={116} w={112} h={46} label="raw balance 10" color={BLUE} />
              <Box x={144} y={116} w={72} h={46} label="비율 2" sub="(가정)" color={AMBER} />
              <Box x={238} y={116} w={112} h={46} label="표시 20" sub="(가정)" color={AMBER} />
              <g fontSize={13} fill={SLATE} textAnchor="middle">
                <text x={133} y={60}>×</text>
                <text x={227} y={60}>=</text>
                <text x={133} y={144}>×</text>
                <text x={227} y={144}>=</text>
              </g>
            </svg>
          );
        }
        const showIssuer = active >= 1;
        const showUnderlying = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={6} y={62} w={92} h={52} label="보유자" sub="토큰 10개" color={BLUE} />
            <Box x={210} y={6} w={144} h={46} label="RHJ" sub="채무증권 발행자" color={showIssuer ? BLUE : SLATE} faded={!showIssuer} />
            <Box x={210} y={66} w={144} h={46} label="기초 주식·ETF" sub="경제적 노출의 대상" color={showUnderlying ? AMBER : SLATE} faded={!showUnderlying} />
            <Box x={210} y={126} w={144} h={46} label="기초 증권 발행자" sub="기초 회사" color={showUnderlying ? RED : SLATE} faded={!showUnderlying} dashed={showUnderlying} />
            {showIssuer && <path d="M98 76L210 30" stroke={BLUE} strokeWidth={1.25} fill="none" />}
            {showIssuer && <text x={154} y={40} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={BLUE}>조건 확인</text>}
            {showUnderlying && (
              <>
                <path d="M98 88H210" stroke={AMBER} strokeWidth={1.25} strokeDasharray="4 3" fill="none" />
                <text x={154} y={82} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={AMBER}>경제적 노출</text>
                <path d="M98 100L210 148" stroke={RED} strokeWidth={1} strokeDasharray="2 3" fill="none" />
                <path d="M148 117L160 129M160 117L148 129" stroke={RED} strokeWidth={1.25} />
                <text x={118} y={146} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={RED}>직접 권리 없음</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
