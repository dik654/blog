import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 초마다 몇 개가 포트를 받는지 120초를 그린다.
 * 1~47초 600개, 48초 32개, 49~60초 0개. 칸은 60초 뒤 풀리므로 61초부터 같은 모양이 되풀이된다.
 * 47 × 600 + 32 = 28,232, 실패 568 + 12 × 600 = 7,768, 평균 28,232 ÷ 60 ≈ 470.
 */
const W = 360;
const H = 186;
const LEFT = 34;
const RIGHT = 350;
const TOP = 26;
const BASE = 150;
const SECONDS = 120;
const barW = (RIGHT - LEFT) / SECONDS;
const px = (second: number) => LEFT + (second - 1) * barW;
const py = (value: number) => BASE - (value / 600) * (BASE - TOP);

function opened(second: number) {
  const inCycle = ((second - 1) % 60) + 1;
  if (inCycle <= 47) return 600;
  return inCycle === 48 ? 32 : 0;
}

const SHOW_UNTIL: readonly number[] = [47, 48, 60, 120, 120];

const SCENES = [
  { label: "1~47초", summary: "600개 모두 포트를 받음", note: "아직 풀린 칸이 없지만 풀에 남은 칸이 있으므로 초당 600개가 모두 열립니다. 47초까지 28,200칸이 묶입니다." },
  { label: "48번째 초", summary: "32개 성공 · 568개 실패", note: "남은 32칸이 먼저 나가고 나머지 connect()는 EADDRNOTAVAIL을 받습니다." },
  { label: "49~60번째 초", summary: "12초 동안 전부 실패", note: "어느 초에 열 수 있는 수는 60초 전 그 초에 연 수와 같습니다. 이 구간의 60초 전에는 아직 연결을 열기 전이라 풀리는 칸이 없습니다." },
  { label: "61번째 초부터", summary: "같은 모양이 60초마다 되풀이", note: "첫 초에 묶인 600칸이 풀리면서 다시 47초 동안 600개씩 열립니다. 요청률을 낮추기 전까지 이 주기가 계속됩니다." },
  { label: "평균과 실제 모습", summary: "평균 ≈ 470개/초 · 약 13초 막힘", note: "점선이 평균입니다. 평균으로는 초당 약 470개가 열리고 약 130개가 실패하지만, 실패는 매 60초 가운데 약 13초에 몰립니다." },
] as const;

const X_TICKS: readonly number[] = [1, 48, 61, 108];

export default function PortCycleViz() {
  return (
    <SceneShell
      eyebrow="초별 connect 결과"
      title="평균은 470개지만 실제로는 47초 열리고 약 13초 막힙니다"
      description="가로축은 초, 막대 높이는 그 초에 포트를 받은 연결 수입니다. 채운 막대가 성공이고, 막대 위 600까지의 빈 구간이 그 초의 실패입니다."
      note="이 절의 가정(같은 목적지, 초당 600개, 클라이언트가 먼저 끊음, TIME_WAIT 60초, TIME_WAIT 소켓 총수 상한이 28,232보다 큰 호스트)에서 나온 계산이며 측정값이 아닙니다."
      ariaLabel="120초 동안 초별로 포트를 받은 연결 수"
      scenes={SCENES}
      render={(active) => {
        const until = SHOW_UNTIL[active];
        const blockedBands = until >= 108 ? [48, 108] : until >= 48 ? [48] : [];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={py(600)} y2={py(600)} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT - 5} y={py(600) + 4} textAnchor="end" fontSize={11} fill="currentColor">600</text>
            <text x={LEFT - 5} y={BASE + 4} textAnchor="end" fontSize={11} fill="currentColor">0</text>

            {Array.from({ length: until }, (_, index) => {
              const second = index + 1;
              const value = opened(second);
              return value > 0 ? <rect key={second} x={px(second)} y={py(value)} width={Math.max(barW - 0.4, 1)} height={BASE - py(value)} fill="#2563eb" /> : null;
            })}

            {blockedBands.map((start) => {
              const end = start === 48 ? Math.min(until, 60) : Math.min(until, 120);
              return (
                <g key={start}>
                  <rect x={px(start)} y={TOP} width={(end - start + 1) * barW} height={BASE - TOP} fill="#dc2626" fillOpacity={0.1} stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />
                  {end - start >= 6 && (
                    <text x={px(start) + ((end - start + 1) * barW) / 2} y={TOP - 7} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">막힘</text>
                  )}
                </g>
              );
            })}

            {until < SECONDS && (
              <text x={(px(until + 1) + RIGHT) / 2} y={(TOP + BASE) / 2 + 4} textAnchor="middle" fontSize={11} fill="#64748b">다음 장면에서 그립니다</text>
            )}

            {active === 4 && (
              <g>
                <line x1={LEFT} x2={RIGHT} y1={py(470)} y2={py(470)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
                <text x={LEFT - 5} y={py(470) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#d97706">470</text>
              </g>
            )}

            <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {X_TICKS.map((second) => (
              <g key={second}>
                <line x1={px(second)} x2={px(second)} y1={BASE} y2={BASE + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={px(second)} y={BASE + 17} textAnchor="middle" fontSize={11} fill="currentColor">{second}</text>
              </g>
            ))}
            <text x={RIGHT} y={BASE + 32} textAnchor="end" fontSize={11} fill="#64748b">초</text>
          </svg>
        );
      }}
    />
  );
}
