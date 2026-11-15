import SceneShell from "./SceneShell";

/**
 * 본문 대응: #execution-loop — execution timeout 5초 예.
 * Timeout은 sandbox process를 끊지만, 이미 나간 write가 외부에서 committed인지는 timeout 응답만으로 알 수 없다.
 * write를 보낸 3초 시점과 7초 축 길이는 그림을 위한 가정이다.
 */
const W = 360;
const H = 208;
const X0 = 24;
const X1 = 340;
const T_MAX = 7;
const DEADLINE = 5;
const SEND_AT = 3;
const tx = (t: number) => X0 + (t / T_MAX) * (X1 - X0);

const SANDBOX_Y = 46;
const EXTERNAL_Y = 118;

const SCENES = [
  {
    label: "실행 시작과 deadline",
    summary: "timeout 5초",
    note: "Sandbox가 program을 실행하기 시작합니다. 5초 deadline을 넘기면 process를 강제로 끝내도록 한도를 둡니다.",
  },
  {
    label: "write 요청이 나갑니다",
    summary: "3초에 issue.write (가정)",
    note: "실행 도중 program이 외부 service에 write를 보냅니다. 요청은 sandbox를 떠났고, 외부 쪽 처리는 sandbox와 따로 진행됩니다.",
  },
  {
    label: "5초에 강제 종료",
    summary: "model에는 timeout error만",
    note: "Deadline에 닿으면 process를 강제 종료하고 model에는 timeout error만 돌아갑니다. 무한 loop나 느린 호출이 5초 넘게 CPU를 붙잡지는 못하지만, 이 응답은 process tree가 모두 끝났다는 증거도 아닙니다.",
  },
  {
    label: "외부 결과는 아직 모릅니다",
    summary: "committed? → unknown",
    note: "외부 service가 write를 반영했는지는 timeout 응답에 담겨 있지 않습니다. 그래서 이 write는 실패가 아니라 앞 절의 unknown outcome으로 남기고 receipt를 조회해야 합니다.",
  },
] as const;

export default function TimeoutTimelineViz() {
  return (
    <SceneShell
      eyebrow="Timeout이 끊는 것과 못 끊는 것"
      title="Timeout은 sandbox 쪽 실행을 끊지만 이미 나간 write의 결과는 알려 주지 않습니다"
      description="가로축은 실행 시작 뒤 경과 시간(초)입니다. Timeout 5초는 본문의 예이고, write를 보낸 3초 시점은 가정입니다."
      ariaLabel="실행 시작, write 요청, 5초 timeout 강제 종료, 외부 결과 미확정 순서의 시간축"
      scenes={SCENES}
      render={(active) => {
        const runEnd = active >= 2 ? DEADLINE : active === 1 ? 4 : 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={SANDBOX_Y - 14} fontSize={12} fontWeight={700} fill="#2563eb">Sandbox program</text>
            <text x={X0} y={EXTERNAL_Y - 14} fontSize={12} fontWeight={700} fill="#64748b">외부 service</text>
            <line x1={X0} x2={X1} y1={SANDBOX_Y + 6} y2={SANDBOX_Y + 6} stroke="#94a3b8" strokeWidth={0.75} opacity={0.5} />
            <line x1={X0} x2={X1} y1={EXTERNAL_Y + 6} y2={EXTERNAL_Y + 6} stroke="#94a3b8" strokeWidth={0.75} opacity={0.5} />
            <rect x={tx(0)} y={SANDBOX_Y} width={tx(runEnd) - tx(0)} height={12} fill="#2563eb" opacity={0.75} />
            <line x1={tx(DEADLINE)} x2={tx(DEADLINE)} y1={SANDBOX_Y - 26} y2={EXTERNAL_Y + 22} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
            <text x={tx(DEADLINE) + 4} y={SANDBOX_Y - 16} fontSize={11} fontWeight={700} fill="#dc2626">deadline 5초</text>
            <g opacity={active >= 1 ? 1 : 0.15}>
              <line x1={tx(SEND_AT)} x2={tx(SEND_AT)} y1={SANDBOX_Y + 14} y2={EXTERNAL_Y - 4} stroke="#64748b" strokeWidth={1} />
              <path d={`M${tx(SEND_AT) - 4} ${EXTERNAL_Y - 9} L${tx(SEND_AT)} ${EXTERNAL_Y - 2} L${tx(SEND_AT) + 4} ${EXTERNAL_Y - 9}`} fill="none" stroke="#64748b" strokeWidth={1} />
              <text x={tx(SEND_AT) - 4} y={(SANDBOX_Y + EXTERNAL_Y) / 2 + 4} textAnchor="end" fontSize={11} fill="#64748b">write 요청</text>
              <rect x={tx(SEND_AT)} y={EXTERNAL_Y} width={tx(T_MAX) - tx(SEND_AT)} height={12} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="3 2" />
              <text x={tx(SEND_AT) + 4} y={EXTERNAL_Y + 9.5} fontSize={10} fill="#64748b">외부에서 처리 중</text>
            </g>
            <g opacity={active >= 2 ? 1 : 0.15}>
              <text x={tx(DEADLINE)} y={SANDBOX_Y + 10} textAnchor="middle" fontSize={14} fontWeight={700} fill="#dc2626">×</text>
              <text x={tx(DEADLINE) + 10} y={SANDBOX_Y + 10} fontSize={11} fontWeight={700} fill="#dc2626">강제 종료</text>
              <text x={tx(DEADLINE) + 10} y={SANDBOX_Y + 26} fontSize={11} fill="#dc2626">timeout error</text>
            </g>
            <g opacity={active >= 3 ? 1 : 0.15}>
              <rect x={tx(DEADLINE) - 2} y={EXTERNAL_Y + 26} width={tx(T_MAX) - tx(DEADLINE) + 2} height={40} rx={6} fill="none" stroke="#dc2626" strokeWidth={1} />
              <text x={(tx(DEADLINE) + tx(T_MAX)) / 2} y={EXTERNAL_Y + 42} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">committed?</text>
              <text x={(tx(DEADLINE) + tx(T_MAX)) / 2} y={EXTERNAL_Y + 58} textAnchor="middle" fontSize={11} fill="#dc2626">unknown</text>
            </g>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((t) => (
              <text key={t} x={tx(t)} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">{t}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
