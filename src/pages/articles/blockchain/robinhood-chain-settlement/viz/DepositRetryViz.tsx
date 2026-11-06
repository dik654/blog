import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 3문단 — 입금은 retryable ticket을 쓸 수 있고, L2 실행 실패 시 공식 안내의 7일 안에 재실행 경로를 확인한다.
 * 입금 재실행 기한과 출금 challenge period는 같은 숫자 7일이 보이는 다른 절차다.
 */
const W = 360;
const H = 142;
const SLATE = "#64748b";
const BLUE = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";

const SCENES = [
  { label: "입금 · L2 실행 성공", summary: "L1 처리 → L2 실행", note: "입금은 인출과 반대로 L1에서 L2로 갑니다. retryable ticket은 이 메시지가 L2에서 실패해도 다시 실행할 수 있게 하는 방식으로, 입금에 사용할 수 있습니다." },
  { label: "입금 · L2 실행 실패", summary: "7일 안에 재실행 경로 확인", note: "L1 처리가 끝난 뒤 L2 실행이 gas 부족 등으로 실패할 수 있습니다. 이때는 공식 안내의 7일 안에 재실행하는 경로를 확인합니다." },
  { label: "인출의 7일과 나란히", summary: "숫자는 같아도 다른 절차", note: "위는 실패한 입금을 재실행하는 기한이고, 아래는 주장에 이의를 제기할 시간(challenge period)입니다. 방향도, 무엇을 위한 7일인지도 다르므로 같은 대기로 묶지 않습니다." },
] as const;

function End({ x, label }: { x: number; label: string }) {
  return (
    <g>
      <rect x={x} y={8} width={62} height={126} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} />
      <text x={x + 31} y={75} textAnchor="middle" fontSize={12} fontWeight={700} fill={SLATE}>{label}</text>
    </g>
  );
}

export default function DepositRetryViz() {
  return (
    <SceneShell
      eyebrow="반대 방향"
      title="입금의 7일과 인출의 7일은 방향도 쓰임도 다릅니다"
      description="왼쪽이 Ethereum(L1), 오른쪽이 L2입니다. 위 화살표가 입금, 아래 화살표가 인출입니다."
      ariaLabel="입금 실행 성공과 실패, 재실행 기한과 인출 이의 제기 기간의 비교"
      scenes={SCENES}
      render={(active) => {
        const failed = active === 1;
        const both = active === 2;
        const depositColor = failed ? RED : BLUE;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <End x={4} label="L1" />
            <End x={294} label="L2" />
            <g stroke={depositColor} strokeWidth={1.25} fill="none">
              <path d="M70 44H288M282 40L288 44L282 48" />
            </g>
            <text x={180} y={36} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={depositColor}>
              {active === 0 ? "입금 메시지 → L2 실행 성공" : failed ? "입금 메시지 → L2 실행 실패" : "입금"}
            </text>
            {(failed || both) && (
              <text x={180} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>재실행 기한 · 공식 안내 7일</text>
            )}
            {failed && <path d="M278 52L286 60M286 52L278 60" stroke={RED} strokeWidth={1.25} />}
            {both && (
              <g>
                <g stroke={AMBER} strokeWidth={1.25} fill="none">
                  <path d="M288 104H70M76 100L70 104L76 108" />
                </g>
                <text x={180} y={96} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={AMBER}>인출</text>
                <text x={180} y={122} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>이의 제기 기간 · 약 7일</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
