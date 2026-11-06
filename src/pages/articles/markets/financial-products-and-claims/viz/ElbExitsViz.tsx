import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 같은 1000만 원 만기 약속의 세 출구.
 * 만기 보유·발행자 지급 1000만, 급한 중도상환 960만(본문의 설명용 가정), 발행자 실패 시 원금 손실 가능(금액은 본문에 없음).
 */
const SCENES = [
  { label: "만기까지 들고 있으면", summary: "1000만 원", note: "만기에 1000만 원을 약속받습니다. 다만 발행자가 약속대로 지급할 때의 이야기입니다." },
  { label: "만기 전에 급하게 나가면", summary: "960만 원으로 평가될 수 있음", note: "약속은 만기의 약속입니다. 그 전에 현금이 필요하면 960만 원으로 평가될 수 있습니다. 960만 원은 설명용 가정입니다." },
  { label: "발행자가 실패하면", summary: "원금 손실 가능", note: "만기까지 기다려도 지급할 곳이 실패하면 원금 손실이 날 수 있습니다. 손실 크기는 본문에 정해 두지 않아 점선으로만 그렸습니다." },
] as const;

const ACCENT = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const MUTED = "#94a3b8";
const X0 = 30;
const X_MID = 130;
const X_END = 276;
const Y_FULL = 40;
const Y_960 = 84;
const Y_FAIL = 142;

export default function ElbExitsViz() {
  return (
    <SceneShell
      eyebrow="원금 약속의 출구"
      title="만기 원금 약속이 있어도 나가는 길에 따라 받는 돈이 다릅니다"
      description="가로는 시간, 세로는 받는 금액입니다. 세로 간격은 금액에 맞춘 축척이 아닙니다."
      note="발행자 지급불능과 만기 전 현금화 위험을 구분하는 설명이며 금액은 가정입니다."
      ariaLabel="만기 보유, 중도상환, 발행자 실패에 따른 수령액 경로"
      scenes={SCENES}
      render={(active) => {
        const tone = (index: number, color: string) => (active === index ? color : MUTED);
        return (
          <svg viewBox="0 0 340 176" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <circle cx={X0} cy={Y_FULL} r={4} fill={GRAY} />
            <text x={X0 - 12} y={Y_FULL - 12} fontSize={12} fontWeight={700} fill="currentColor">투자 1000만</text>
            <line x1={X0} x2={X_END} y1={Y_FULL} y2={Y_FULL} stroke={tone(0, ACCENT)} strokeWidth={active === 0 ? 1.25 : 1} />
            <circle cx={X_END} cy={Y_FULL} r={4} fill={tone(0, ACCENT)} />
            <text x={X_END + 8} y={Y_FULL + 4} fontSize={13} fontWeight={700} fill={tone(0, ACCENT)}>1000만</text>

            <polyline points={`${X_MID - 50},${Y_FULL} ${X_MID},${Y_960}`} fill="none" stroke={tone(1, AMBER)} strokeWidth={active === 1 ? 1.25 : 1} />
            <circle cx={X_MID} cy={Y_960} r={4} fill={tone(1, AMBER)} />
            <text x={X_MID + 8} y={Y_960 + 4} fontSize={13} fontWeight={700} fill={tone(1, AMBER)}>960만 · 중도 현금화</text>

            <polyline points={`${X_END - 16},${Y_FULL} ${X_END - 16},${Y_FAIL}`} fill="none" stroke={tone(2, RED)} strokeWidth={active === 2 ? 1.25 : 1} strokeDasharray="4 3" />
            <text x={X_END - 22} y={Y_FAIL + 4} textAnchor="end" fontSize={13} fontWeight={700} fill={tone(2, RED)}>발행자 실패 · 원금 손실 가능</text>

            <line x1={X0} x2={X_END} y1={160} y2={160} stroke={MUTED} strokeWidth={0.5} />
            <text x={X0} y={174} textAnchor="middle" fontSize={11} fill={GRAY}>가입</text>
            <text x={X_END} y={174} textAnchor="middle" fontSize={11} fill={GRAY}>만기</text>
          </svg>
        );
      }}
    />
  );
}
