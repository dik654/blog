import SceneShell from "./SceneShell";

/**
 * 본문 대응: names 절의 P25 출력 속도·P95 TTFT — 평균과 분포 지점의 차이, 기록이 지워진 턴의 비율에 따른 움직임.
 * 요청 20개의 속도는 그림용 가정: 합 500, 평균 25.0(3절의 동시 16개 평균과 맞춤), 느린 순 6번째 = 17.
 * TTFT: 기록이 남은 턴은 1.0 + 0.13i초(가정), 지워진 턴은 128K ÷ 4,700 = 약 27초(4절 계산).
 */
const SPEEDS = [8, 10, 12, 13, 15, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 44, 52];
const MEAN = SPEEDS.reduce((sum, value) => sum + value, 0) / SPEEDS.length;
const P25 = SPEEDS[5];
const hitTurns = (count: number) => Array.from({ length: count }, (_, i) => 1 + 0.13 * i);
const WIPED = 27;
const P95_ONE = hitTurns(19)[18];

const SCENES = [
  { label: "평균으로 재면", summary: `평균 ${MEAN.toFixed(1)} ≥ 20`, note: "요청 20개의 속도를 느린 순으로 세웠습니다(가정). 평균선은 하한 20 위에 있어 평균으로만 보면 약속을 지킨 것처럼 보입니다." },
  { label: "느린 4분의 1로 재면", summary: `P25 ${P25} < 20`, note: "느린 쪽 다섯 개(20개의 4분의 1)를 뺀 나머지 중 가장 느린 값 17이 하위 25퍼센트 지점, 곧 P25입니다. 이 값이 하한 20에 못 미치므로 같은 요청들인데 판정이 뒤집힙니다." },
  { label: "지워진 턴 1번", summary: `P95 약 ${P95_ONE.toFixed(1)}초 ≤ 10초`, note: "이번에는 첫 토큰까지의 기다림(TTFT)입니다. 길수록 나쁘므로 위쪽 지점을 봅니다. 긴 쪽에서 한 칸을 뺀 19번째가 상위 95퍼센트 지점, 곧 P95이고, 20번 중 한 번만 앞부분 기록이 지워져 27초를 기다렸다면 P95는 그대로 낮습니다." },
  { label: "지워진 턴 2번", summary: "P95 약 27초 > 10초", note: "지워진 턴이 한 번 늘었을 뿐인데 19번째가 27초로 뛰어 상한 10초를 넘습니다. 기록이 남은 턴과 지워진 턴의 비율이 바뀌면 같은 서버에서도 P95가 크게 움직입니다." },
] as const;

const W = 360;
const H = 176;
const LEFT = 28;
const RIGHT = 8;
const BASE = 152;
const TOP = 16;
const N = 20;
const SLOT = (W - LEFT - RIGHT) / N;

export default function TailPercentileViz() {
  return (
    <SceneShell
      eyebrow="느린 쪽을 재는 법"
      title="평균이 통과해도 느린 4분의 1은 약속을 깰 수 있습니다"
      description="막대 하나가 요청 하나이고 왼쪽부터 값이 작은 순서입니다. 앞 두 장면은 요청별 출력 속도와 하한 20 tok/s, 뒤 두 장면은 요청을 보낸 뒤 첫 토큰까지의 기다림(TTFT)과 상한 10초입니다."
      note="요청 20개의 값은 지표의 방향을 보이려고 만든 가정입니다. 평균 25.0만 3절의 동시 16개 평균에 맞췄습니다. 지워진 턴의 27초는 128K 입력을 초당 약 4,700토큰으로 다시 읽는 4절의 계산이고, 남은 턴의 기다림은 가정입니다."
      ariaLabel="요청 20개의 출력 속도와 첫 토큰 기다림을 정렬해 평균, P25, P95 판정을 비교"
      scenes={SCENES}
      render={(active) => {
        const isSpeed = active < 2;
        const wiped = active === 2 ? 1 : 2;
        const values = isSpeed ? SPEEDS : [...hitTurns(N - wiped), ...Array.from({ length: wiped }, () => WIPED)];
        const max = isSpeed ? 60 : 30;
        const y = (value: number) => BASE - (value / max) * (BASE - TOP);
        const limit = isSpeed ? 20 : 10;
        const markIndex = isSpeed ? 5 : 18;
        const failed = active === 1 || active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={10} fontSize={11} fill="#64748b">{isSpeed ? "tok/s" : "초"}</text>
            {values.map((value, i) => {
              const isSlowQuarter = active === 1 && i < 5;
              const isWiped = !isSpeed && i >= N - wiped;
              const isMark = active !== 0 && i === markIndex;
              const fill = isMark ? (failed ? "#b45309" : "#2563eb") : isSlowQuarter || isWiped ? "#d97706" : "#94a3b8";
              return (
                <rect
                  key={i}
                  x={LEFT + i * SLOT + 1.5}
                  y={y(value)}
                  width={SLOT - 3}
                  height={BASE - y(value)}
                  rx={1.5}
                  fill={fill}
                  opacity={isMark ? 1 : isSlowQuarter || isWiped ? 0.75 : 0.6}
                />
              );
            })}
            <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={W - RIGHT} y1={y(limit)} y2={y(limit)} stroke="#b45309" strokeWidth={1} strokeDasharray="4 3" />
            <text x={LEFT - 4} y={y(limit) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">{limit}</text>
            {active === 0 && (
              <>
                <line x1={LEFT} x2={W - RIGHT} y1={y(MEAN)} y2={y(MEAN)} stroke="#2563eb" strokeWidth={1.25} />
                <text x={LEFT + 2} y={y(MEAN) - 5} fontSize={11} fontWeight={700} fill="#2563eb">평균 25.0</text>
              </>
            )}
            {active === 1 && (
              <text x={LEFT + 5.5 * SLOT} y={y(limit) - 7} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">P25 = 17</text>
            )}
            {active >= 2 && (
              <text x={LEFT + 18.5 * SLOT - 12} y={active === 2 ? y(limit) - 7 : TOP + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={failed ? "#b45309" : "#2563eb"}>
                {active === 2 ? `P95 약 ${P95_ONE.toFixed(1)}초` : "P95 약 27초"}
              </text>
            )}
            <text x={LEFT} y={BASE + 15} fontSize={11} fill="#64748b">작은 값</text>
            <text x={W - RIGHT} y={BASE + 15} textAnchor="end" fontSize={11} fill="#64748b">큰 값</text>
          </svg>
        );
      }}
    />
  );
}
