import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hybrid-cost — 60%: 10ms·4개, 40%: 20ms·2개, 단독 25ms(가정). 10회로 환산해 칸으로 그린다.
 * 합계 시간 6×10+4×20=140ms, 합계 토큰 6×4+4×2=32개, 단독 32×25=800ms, 800/140≈5.7143.
 * 회차별 비 10·2.5의 비중 평균 .6×10+.4×2.5=7은 합산 비와 다르다.
 */
const SCENES = [
  { label: "회차 10번을 줄 세웁니다", summary: "빠른 6번 · 느린 4번", note: "60%와 40%를 보기 쉽게 10회로 환산했습니다. 칸 너비가 시간이고 칸 안의 숫자가 그 회차에 확정한 토큰 수입니다." },
  { label: "합을 냅니다", summary: "32개 · 140ms", note: "평균으로 나누면 회차당 3.2개와 14ms입니다. 토큰 합은 6×4+4×2=32개, 시간 합은 6×10+4×20=140ms입니다." },
  { label: "같은 32개를 단독으로", summary: "800 / 140 ≈ 5.7143배", note: "32개를 25ms씩 단독 생성하면 800ms입니다. 같은 일을 140ms에 했으므로 전체 개선 비는 약 5.7143입니다." },
  { label: "비를 평균하면 7이 나옵니다", summary: ".6 × 10 + .4 × 2.5 = 7", note: "회차별 개선 비 10과 2.5를 비중대로 평균한 7은 전체 처리 시간의 비와 다릅니다. 느린 4번이 140ms 중 80ms를 차지하는데 이 평균에는 횟수 비중만 들어갑니다. 실제 합산 시간과 확정 수를 비교합니다." },
] as const;

const ROUNDS = [...Array.from({ length: 6 }, () => ({ ms: 10, tokens: 4 })), ...Array.from({ length: 4 }, () => ({ ms: 20, tokens: 2 }))];
const STARTS = ROUNDS.map((_, index) => ROUNDS.slice(0, index).reduce<number>((sum, round) => sum + round.ms, 0));
const TOTAL_MS = 140;
const SOLO_MS = 800;
const W = 356;
const STRIP = W - 4;
const zoom = (ms: number) => 2 + (ms / TOTAL_MS) * STRIP;
const same = (ms: number) => 56 + (ms / SOLO_MS) * (W - 60);
const FAST = "#2563eb";
const SLOW = "#d97706";

export default function HybridAverageViz() {
  return (
    <SceneShell
      eyebrow="평균의 함정"
      title="회차별 배율을 평균하지 말고 시간과 토큰을 먼저 더합니다"
      description="빠른 회차는 10ms에 4개, 느린 회차는 20ms에 2개, 단독 생성은 한 토큰 25ms로 둡니다. 수치와 10회 환산은 모두 설명을 위한 가정입니다."
      ariaLabel="두 종류 회차의 합산 시간과 토큰으로 계산한 개선 비"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 152`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {ROUNDS.map((round, index) => (
            <g key={index}>
              <rect x={zoom(STARTS[index]) + 0.5} y={4} width={zoom(round.ms) - 2 - 1} height={34} rx={2} fill={round.ms === 10 ? FAST : SLOW} fillOpacity={0.2} stroke={round.ms === 10 ? FAST : SLOW} strokeWidth={1} />
              <text x={zoom(STARTS[index]) + (zoom(round.ms) - 2) / 2} y={26} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{round.tokens}</text>
            </g>
          ))}
          <text x={zoom(30)} y={54} textAnchor="middle" fontSize={12} fill={FAST}>10ms × 6</text>
          <text x={zoom(100)} y={54} textAnchor="middle" fontSize={12} fill={SLOW}>20ms × 4</text>
          {active === 1 && <text x={W / 2} y={82} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-foreground">토큰 24 + 8 = 32개 · 시간 60 + 80 = 140ms</text>}
          {active === 2 && (
            <g>
              <text x={2} y={87} fontSize={12} className="fill-muted-foreground">단독</text>
              <rect x={56} y={73} width={same(SOLO_MS) - 56} height={22} rx={2} fill="#64748b" />
              <text x={same(SOLO_MS) - 6} y={89} textAnchor="end" fontSize={13} fontWeight={700} fill="#ffffff">32 × 25 = 800ms</text>
              <text x={2} y={119} fontSize={12} className="fill-muted-foreground">이 방식</text>
              <rect x={56} y={105} width={same(TOTAL_MS) - 56} height={22} rx={2} fill={FAST} />
              <text x={same(TOTAL_MS) + 6} y={121} fontSize={13} fontWeight={700} fill={FAST}>140ms</text>
            </g>
          )}
          {active === 3 && (
            <g>
              <text x={W / 2} y={82} textAnchor="middle" fontSize={13} className="fill-muted-foreground">빠른 회차 4 × 25 / 10 = 10배 · 느린 회차 2 × 25 / 20 = 2.5배</text>
              <text x={2} y={112} fontSize={14} fontWeight={700} fill="#dc2626">비의 평균 7</text>
              <text x={W - 2} y={112} textAnchor="end" fontSize={14} fontWeight={700} fill={FAST}>합의 비 5.7143</text>
              <text x={W / 2} y={136} textAnchor="middle" fontSize={13} className="fill-muted-foreground">느린 회차: 횟수 40% · 시간 80 / 140</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
