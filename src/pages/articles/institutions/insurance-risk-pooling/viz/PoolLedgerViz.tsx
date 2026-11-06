import PoolDots from "./PoolDots";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 1,000명 × 10만 원 = 1억 원, 20명 × 300만 원 = 6천만 원, 차이 4천만 원(모두 가정).
 * 4천만 원 안의 운영비·조사비·미보고 지급 건은 글에 금액이 없어 칸을 나누지 않습니다.
 */
const SCATTER = Array.from({ length: 20 }, (_, k) => (k * 173 + 29) % 1000);
const X0 = 5;
const WIDTH = 350;
const PAID_W = WIDTH * 0.6;

const SCENES = [
  { label: "모두가 조금씩 냅니다", summary: "1,000명 × 10만 원 = 1억 원", note: "회색 칸 하나가 한 사람입니다. 1천 명이 한 해 10만 원씩 내면 막대 전체인 1억 원이 모입니다." },
  { label: "그해 사고가 난 사람이 크게 받습니다", summary: "20명 × 300만 원 = 6천만 원", note: "크고 빨간 칸이 지급받는 20명입니다. 1억 원 가운데 6천만 원이 나갑니다. 20명은 가정이며, 실제 사고 인원이 매년 정확히 20명이라고 보장되지는 않습니다." },
  { label: "남은 차이는 아직 이익이 아닙니다", summary: "1억 − 6천만 = 4천만 원", note: "이 돈으로 운영비와 사고 조사비, 아직 보고되지 않은 지급 건을 처리해야 합니다. 각각 얼마인지는 사례에 정해져 있지 않아 점선 칸을 나누지 않았습니다." },
] as const;

export default function PoolLedgerViz() {
  return (
    <SceneShell
      eyebrow="모으고 나눠 주기"
      title="천 명이 조금씩 내고 스무 명이 크게 받습니다"
      description="위쪽 칸은 가입자 1,000명이고 칸의 위치에는 뜻이 없습니다. 아래 막대는 한 해에 모인 돈이며 폭은 금액에 비례합니다. 숫자는 모두 가정입니다."
      ariaLabel="1천 명이 낸 1억 원에서 20명에게 6천만 원을 지급하고 4천만 원의 차이가 남는 과정"
      scenes={SCENES}
      render={(scene) => (
        <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
          <PoolDots hot={scene === 0 ? [] : SCATTER} />
          {scene === 0 ? (
            <>
              <rect x={X0} y={152} width={WIDTH} height={32} rx={2} fill="#2563eb" />
              <text x={X0 + WIDTH / 2} y={173} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">모인 돈 1억 원</text>
            </>
          ) : (
            <>
              <rect x={X0} y={152} width={PAID_W} height={32} rx={2} fill="#dc2626" />
              <text x={X0 + PAID_W / 2} y={173} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">지급 6천만 원</text>
              <rect x={X0 + PAID_W + 0.5} y={152.5} width={WIDTH - PAID_W - 1} height={31} rx={2} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray={scene === 2 ? "4 3" : undefined} />
              <text x={X0 + PAID_W + (WIDTH - PAID_W) / 2} y={173} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">차이 4천만 원</text>
            </>
          )}
          {scene === 2 && <text x={X0 + WIDTH} y={204} textAnchor="end" fontSize={13} fontWeight={700} fill="#d97706">운영비·조사비·미보고 지급 건 처리 전</text>}
        </svg>
      )}
    />
  );
}
