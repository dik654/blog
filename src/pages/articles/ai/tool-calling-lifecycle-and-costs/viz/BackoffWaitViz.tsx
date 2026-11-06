import SceneShell from "./SceneShell";

/**
 * 본문 대응: #error-handling-and-retry — 시작 0.5초, 상한 2초, 재시도 4회(가정) → 0.5·1·2·2초, 합 5.5초.
 * k=3의 계산값 0.5×2³=4초는 상한 2초로 잘린다. 아래 띠는 대기만 축척으로 그렸고 호출 시간은 길이가 없다.
 */
const BASE = 0.5;
const CAP = 2;
const RAW = [0, 1, 2, 3].map((k) => BASE * 2 ** k);
const WAITS = RAW.map((value) => Math.min(value, CAP));
const SUM = WAITS.reduce<number>((total, value) => total + value, 0);

const BAR_BASE = 124;
const BAR_SCALE = 25;
const BAR_W = 44;
const bx = (k: number) => 58 + k * 74;

const STRIP_LEFT = 20;
const STRIP_W = 320;
const stripX = (seconds: number) => STRIP_LEFT + (seconds / SUM) * STRIP_W;
const STRIP_Y = 168;
const STARTS = WAITS.map((_, index) => WAITS.slice(0, index).reduce<number>((total, value) => total + value, 0));

const SCENES = [
  { label: "실패마다 두 배로", summary: "0.5 → 1 → 2초", note: "k는 0부터 세는 재시도 순번입니다. 재시도 전 대기를 0.5초에서 시작해 실패할 때마다 두 배로 늘립니다(가정)." },
  { label: "상한에서 잘립니다", summary: "4초 → 2초", note: "k=3의 계산값은 0.5×2³=4초지만 상한 2초를 넘을 수 없어 2초만 기다립니다. 상한은 대기 길이를 자를 뿐 재시도를 멈추지는 않습니다." },
  { label: "대기를 이어 붙입니다", summary: `0.5 + 1 + 2 + 2 = ${SUM}초`, note: "아래 띠는 대기만 이어 붙인 것입니다. 호출 시간은 별도이므로 실제 경과 시간은 5.5초보다 깁니다. 눈금 5개는 처음 호출 1번과 재시도 4번이며 길이를 뜻하지 않습니다." },
  { label: "횟수가 차면 멈춥니다", summary: "재시도 4회 → 중단", note: "멈추게 하는 것은 최대 횟수입니다. 네 번째 재시도까지 끝나면 자동 재시도를 멈추고 실행 결과의 확인 여부까지 반환합니다. 혼잡한 환경의 무작위 지연은 이 계산에 넣지 않았습니다." },
] as const;

export default function BackoffWaitViz() {
  return (
    <SceneShell
      eyebrow="대기 간격"
      title="대기는 두 배씩 늘다가 상한에서 멈추고, 합은 5.5초입니다"
      description="대기 시작 0.5초, 최대 2초, 재시도 4회라는 설명용 가정입니다(가정). 막대 하나가 재시도 전 대기 한 번입니다."
      ariaLabel="재시도 순번별 대기 시간과 상한, 대기 합계"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 224" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={20} x2={350} y1={BAR_BASE} y2={BAR_BASE} stroke="#94a3b8" strokeWidth={1} />
          <line x1={20} x2={350} y1={BAR_BASE - CAP * BAR_SCALE} y2={BAR_BASE - CAP * BAR_SCALE} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
          <text x={20} y={BAR_BASE - CAP * BAR_SCALE - 5} fontSize={11} fill="#b45309">상한 2초</text>
          {WAITS.map((wait, k) => {
            const visible = active >= 1 || k < 3;
            return (
              <g key={k}>
                <text x={bx(k) + BAR_W / 2} y={BAR_BASE + 15} textAnchor="middle" fontSize={11} fill="#64748b">k={k}</text>
                {visible && (
                  <>
                    {k === 3 && (
                      <>
                        <rect x={bx(k)} y={BAR_BASE - RAW[k] * BAR_SCALE} width={BAR_W} height={(RAW[k] - CAP) * BAR_SCALE} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                        <text x={bx(k) + BAR_W / 2} y={BAR_BASE - RAW[k] * BAR_SCALE + 15} textAnchor="middle" fontSize={11} fill="#64748b">계산값 4</text>
                      </>
                    )}
                    <rect x={bx(k)} y={BAR_BASE - wait * BAR_SCALE} width={BAR_W} height={wait * BAR_SCALE} rx={2} fill="#2563eb" opacity={0.75} />
                    <text x={bx(k) + BAR_W / 2} y={BAR_BASE - wait * BAR_SCALE + (wait > 0.6 ? 15 : -4)} textAnchor="middle" fontSize={11} fontWeight={700} fill={wait > 0.6 ? "#ffffff" : "#2563eb"}>{wait}</text>
                  </>
                )}
              </g>
            );
          })}
          {active >= 2 && (
            <g>
              {WAITS.map((wait, k) => (
                <g key={k}>
                  <rect x={stripX(STARTS[k])} y={STRIP_Y} width={(wait / SUM) * STRIP_W} height={20} fill="#2563eb" opacity={0.3 + k * 0.12} />
                  <text x={stripX(STARTS[k]) + (wait / SUM) * STRIP_W / 2} y={STRIP_Y + 14} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">{wait}</text>
                </g>
              ))}
              {[0, 1, 2, 3, 4].map((tick) => {
                const x = tick === 4 ? STRIP_LEFT + STRIP_W : stripX(STARTS[tick]);
                const last = tick === 4 && active === 3;
                return <line key={tick} x1={x} x2={x} y1={STRIP_Y - 6} y2={STRIP_Y + 26} stroke={last ? "#dc2626" : "#475569"} strokeWidth={last ? 1.25 : 1} />;
              })}
              <text x={STRIP_LEFT} y={STRIP_Y + 40} fontSize={11} fill="#64748b">눈금 = 호출 한 번(시간 별도)</text>
              {active === 3 && <text x={STRIP_LEFT + STRIP_W} y={STRIP_Y + 40} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">여기서 중단</text>}
            </g>
          )}
        </svg>
      )}
    />
  );
}
