import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 행동도 행동을 피하는 선택도 결과를 남긴다. 그래서 물음은 행위 자체에서
 * 그 행위를 보상받을 성취로 붙잡는 동기와 동일시로 옮겨 간다. 되풀이의 정의는 #names의 문장을 따른다.
 */
const SCENES = [
  { label: "행동하면", summary: "먹고 돌보고 말하고 선택 → 결과", note: "살아 있는 동안 이런 일을 완전히 멈출 수 없습니다. 결과는 다시 다음 행위를 낳습니다. 이 절 제목의 ‘업의 사슬’을 여기서는 이 되풀이로 읽습니다.", step: 0 },
  { label: "행동을 피하면", summary: "피하는 선택 → 역시 결과", note: "행동을 피하려는 선택도 가족·공동체와 자기 마음에 결과를 남깁니다. 그래서 『기타』는 행위와 무행동을 단순히 선과 악으로 나누지 않습니다.", step: 1 },
  { label: "문제가 옮겨 가는 자리", summary: "행위 그 자체만이 아니라 동기와 동일시", note: "두 갈래 모두에서 묻는 곳은 ‘보상받아야 할 성취로 붙잡는가’입니다. 맡은 일을 공동 질서와 더 큰 목적에 바치며 수행하면, 집착을 줄이면서 책임 있는 행동을 계속할 수 있다는 길을 제시합니다.", step: 2 },
] as const;

function Node({ x, y, w, h = 36, label, on, tone = "#475569" }: { x: number; y: number; w: number; h?: number; label: string; on: boolean; tone?: string }) {
  return (
    <g opacity={on ? 1 : 0.28}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={tone} strokeWidth={1.25} />
      <text x={x + w / 2} y={y + h / 2 + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{label}</text>
    </g>
  );
}

export default function NoExitByStoppingViz() {
  return (
    <SceneShell
      eyebrow="두 갈래"
      title="아무것도 하지 않으면 벗어날 수 있을까요"
      description="두 갈래의 끝이 같은 칸으로 모입니다. 아래로 도는 점선은 결과가 다시 행위를 낳는 되풀이입니다."
      ariaLabel="행동과 행동 회피가 모두 결과로 이어지고 다시 행위로 돌아오는 갈래"
      scenes={SCENES}
      render={(active) => {
        const { step } = SCENES[active];
        const act = step !== 1;
        const avoid = step !== 0;
        return (
          <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Node x={30} y={14} w={128} label="행동한다" on={act} tone="#2563eb" />
            <Node x={30} y={86} w={128} label="행동을 피한다" on={avoid} tone="#d97706" />
            <g opacity={act ? 1 : 0.28}>
              <path d="M158 32 H198 V52 H220" fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <path d="M226 52 L219 48 L219 56 Z" fill="#2563eb" />
            </g>
            <g opacity={avoid ? 1 : 0.28}>
              <path d="M158 104 H198 V68 H220" fill="none" stroke="#d97706" strokeWidth={1.25} />
              <path d="M226 68 L219 64 L219 72 Z" fill="#d97706" />
            </g>
            <Node x={226} y={40} w={126} h={40} label="결과가 남음" on />
            <path d="M289 80 V146 H12 V32 H24 M12 104 H24" fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
            <path d="M30 32 L23 28 L23 36 Z M30 104 L23 100 L23 108 Z" fill="#64748b" />
            <text x={196} y={140} textAnchor="middle" fontSize={12} fill="#64748b">결과가 다시 행위를 낳음</text>
            {step === 2 && (
              <g>
                <rect x={8} y={162} width={344} height={38} rx={8} fill="none" stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={180} y={186} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">묻는 곳: 보상받아야 할 성취로 붙잡는가</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
