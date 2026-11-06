import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 같은 1만100원 매수의 세 결말.
 * ETF 매도 1만1000 → +900. ETN 약정 지급 1만1000 → 비용 전 +900.
 * ETN 부도: 1만1000×40%=4400, 4400−1만100=−5700. 40%는 본문의 별도 가정입니다.
 */
const SCENES = [
  { label: "ETF를 1만1000원에 팝니다", summary: "1만1000 − 1만100 = +900", note: "처음 투자자는 마지막에 1만1000원에 팔아 900원을 받습니다." },
  { label: "ETN이 약정대로 지급하면", summary: "1만1000 − 1만100 = +900", note: "같은 가격에 산 ETN이 약정대로 1만1000원을 지급해도 수익은 비용 전 900원으로 같습니다. 여기까지는 두 상품이 구별되지 않습니다." },
  { label: "발행자가 부도나면", summary: "1만1000 × 40% = 4400", note: "ETN은 발행자의 채무입니다. 계약 청구액의 40%만 회수한다고 가정하면 1만1000원의 40%인 4400원을 받습니다." },
  { label: "매수가와 비교하면", summary: "4400 − 1만100 = −5700", note: "낸 돈 1만100원에 못 미치는 5700원이 손실입니다. 40%는 시장 전망이 아니라 법적 청구권 차이를 드러내는 가정입니다." },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const GRAY = "#64748b";
const RED = "#dc2626";
const LEFT = 76;
const W = (value: number) => (value / 11000) * 170;
const BUY_X = LEFT + W(10100);
const ROWS = [34, 74, 114];

function Row({ y, name, value, text, tone, on, outline = false }: { y: number; name: string; value: number; text: string; tone: string; on: boolean; outline?: boolean }) {
  return (
    <g opacity={on ? 1 : 0.28}>
      <text x={0} y={y + 15} fontSize={11} fontWeight={700} fill="currentColor">{name}</text>
      {outline && <rect x={LEFT} y={y} width={W(11000)} height={22} rx={3} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />}
      <rect x={LEFT} y={y} width={W(value)} height={22} rx={3} fill={tone} opacity={0.85} />
      <text x={340} y={y + 15} textAnchor="end" fontSize={12} fontWeight={700} fill={tone}>{text}</text>
    </g>
  );
}

export default function EtnRecoveryViz() {
  return (
    <SceneShell
      eyebrow="청구권의 차이"
      title="같은 1만100원에 사도 발행자가 무너지면 결말이 갈립니다"
      description="막대 길이는 받는 돈입니다. 세로 점선이 처음 낸 1만100원이고, 막대가 점선을 넘으면 이익, 못 미치면 손실입니다."
      note="한 좌 기준 설명용 가정입니다. ETF의 지분과 ETN의 채무는 청구 대상이 다릅니다."
      ariaLabel="ETF 매도, ETN 약정 지급, ETN 부도 때 받는 금액을 매수가와 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 146" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Row y={ROWS[0]} name="ETF 매도" value={11000} text="1만1000" tone={ACCENT} on={active === 0} />
          <Row y={ROWS[1]} name="ETN 약정대로" value={11000} text="1만1000" tone={ACCENT} on={active === 1} />
          <Row y={ROWS[2]} name="ETN 부도" value={active >= 2 ? 4400 : 0} text={active >= 2 ? "4400" : "?"} tone={RED} on={active >= 2} outline />
          <line x1={BUY_X} x2={BUY_X} y1={24} y2={142} stroke={GRAY} strokeWidth={1} strokeDasharray="4 3" />
          <text x={BUY_X} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>매수가 1만100</text>
          {active === 3 && (
            <g>
              <line x1={LEFT + W(4400)} x2={BUY_X} y1={ROWS[2] + 11} y2={ROWS[2] + 11} stroke={RED} strokeWidth={1.25} />
              <rect x={LEFT + W(4400) + 22} y={ROWS[2] + 2} width={44} height={18} className="fill-background" />
              <text x={(LEFT + W(4400) + BUY_X) / 2} y={ROWS[2] + 15} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>−5700</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
