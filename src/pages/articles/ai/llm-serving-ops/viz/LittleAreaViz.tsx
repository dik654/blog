import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #paper-little-law — request-time 면적을 시간별 in-flight 수의 합으로도,
 * 완료 요청의 체류 시간 합으로도 셀 수 있다. 요청 다섯 개와 10초 구간은 가정.
 * 요청 [0,4) [1,3) [2,7) [5,6) [6,10) → 체류 4+2+5+1+4 = 16.
 * 초별 in-flight 1,2,3,2,1,2,2,1,1,1 → 합 16.
 * L = 16/10 = 1.6, λ = 5/10 = 0.5/초, W = 16/5 = 3.2초, λW = 1.6.
 * 마지막 장면: 8초에 시작해 구간 끝까지 끝나지 않은 요청을 더하면 세로 합 18, 완료 요청 가로 합 16.
 */
const WINDOW = 10;
const DONE: ReadonlyArray<readonly [number, number]> = [
  [0, 4],
  [1, 3],
  [2, 7],
  [5, 6],
  [6, 10],
];
const OPEN_START = 8;

const SCENES = [
  { label: "요청 다섯 개", summary: "관측 10초 · 완료 5건", note: "막대 하나가 요청 하나입니다. 왼쪽 끝이 들어온 시각, 오른쪽 끝이 끝난 시각이라 막대 길이가 그 요청의 체류 시간입니다." },
  { label: "세로로 세기", summary: "초마다 in-flight 수의 합 = 16", note: "1초 칸마다 그 순간 안에 있던 요청 수를 셉니다. 열 칸을 더하면 막대들이 덮은 칸 수, 곧 request-time 면적 16(요청·초)입니다." },
  { label: "가로로 세기", summary: "체류 시간의 합 = 16", note: "같은 면적을 이번에는 막대마다 셉니다. 4 + 2 + 5 + 1 + 4 = 16으로 세로로 센 값과 같습니다. 같은 칸을 두 방향으로 센 것이기 때문입니다." },
  { label: "세 평균으로 나누기", summary: "1.6 = 0.5 × 3.2", note: "면적을 구간 길이 10초로 나누면 평균 in-flight L, 완료 수 5를 구간 길이로 나누면 도착률 λ, 면적을 완료 수로 나누면 평균 체류 W입니다. 같은 16에서 나왔으니 L = λW가 맞습니다." },
  { label: "끝에 걸린 요청", summary: "세로 18 ≠ 완료 요청 가로 16", note: "구간 끝까지 끝나지 않은 요청을 빼고 체류 시간을 세면, 초별 in-flight 합에는 들어간 2칸이 가로 합에서는 빠집니다. 이런 데이터에 L = λW를 그대로 쓰면 안 되는 이유입니다." },
] as const;

const BAR = "#2563eb";
const OPEN = "#d97706";
const GRID = "#cbd5e1";
const TEXT = "#475569";
const STRONG = "#0f172a";

const X0 = 34;
const PX = 36;
const ROW_Y = 14;
const ROW_H = 24;
const xAt = (t: number) => X0 + t * PX;

function inflight(second: number, withOpen: boolean) {
  const done = DONE.filter(([s, e]) => s <= second && second < e).length;
  return done + (withOpen && second >= OPEN_START ? 1 : 0);
}

const SECONDS = Array.from({ length: WINDOW }, (_, i) => i);

const MATH = [
  "구간 10초 동안 요청 다섯 개가 들어와 모두 끝났습니다.",
  "1 + 2 + 3 + 2 + 1 + 2 + 2 + 1 + 1 + 1 = 16",
  "4 + 2 + 5 + 1 + 4 = 16",
  "L = 16 ÷ 10 = 1.6 · λ = 5 ÷ 10 = 0.5/초 · W = 16 ÷ 5 = 3.2초",
  "세로: 1 + 2 + 3 + 2 + 1 + 2 + 2 + 1 + 2 + 2 = 18 · 완료 요청만 가로: 16",
] as const;

export default function LittleAreaViz() {
  return (
    <SceneShell
      eyebrow="Request-time area"
      title="같은 면적을 시간 방향과 요청 방향으로 두 번 셉니다"
      description="요청 다섯 개가 10초 동안 들어오고 나간 예입니다(가정). 막대들이 덮은 칸 수를 request-time 면적이라 부르고, in-flight는 그 순간 시스템 안에 머무는 요청 수입니다. 가로축 아래 숫자가 1초 칸마다의 in-flight 수입니다."
      ariaLabel="요청 막대가 덮은 면적을 초별 in-flight 합과 체류 시간 합으로 세어 L = λW를 확인하는 그림"
      scenes={SCENES}
      render={(active) => {
        const showCols = active === 1 || active === 3 || active === 4;
        const showRows = active === 2 || active === 3 || active === 4;
        const withOpen = active === 4;
        const rows = 6;
        const axisY = ROW_Y + rows * ROW_H + 6;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 400 230" className="w-full max-w-md" role="img" aria-label={SCENES[active].summary}>
              {SECONDS.map((s) => (
                <rect
                  key={`col-${s}`}
                  x={xAt(s)}
                  y={ROW_Y - 4}
                  width={PX}
                  height={rows * ROW_H + 4}
                  fill={showCols && s % 2 === 0 ? "#f1f5f9" : "none"}
                  stroke={GRID}
                  strokeWidth="1"
                />
              ))}
              {DONE.map(([s, e], i) => {
                const y = ROW_Y + i * ROW_H;
                return (
                  <g key={`r-${i}`}>
                    <text x={X0 - 8} y={y + 12} fontSize="13" textAnchor="end" fill={TEXT}>
                      #{i + 1}
                    </text>
                    <rect x={xAt(s) + 1} y={y} width={(e - s) * PX - 2} height={16} rx="3" fill={BAR} fillOpacity="0.25" stroke={BAR} strokeWidth="1" />
                    {showRows ? (
                      <text x={xAt(s) + ((e - s) * PX) / 2} y={y + 12} fontSize="13" fontWeight="700" textAnchor="middle" fill={STRONG}>
                        {e - s}
                      </text>
                    ) : null}
                  </g>
                );
              })}
              <g opacity={withOpen ? 1 : 0}>
                <text x={X0 - 8} y={ROW_Y + 5 * ROW_H + 12} fontSize="13" textAnchor="end" fill={OPEN}>
                  #6
                </text>
                <rect
                  x={xAt(OPEN_START) + 1}
                  y={ROW_Y + 5 * ROW_H}
                  width={(WINDOW - OPEN_START) * PX - 1}
                  height={16}
                  fill={OPEN}
                  fillOpacity="0.2"
                  stroke={OPEN}
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
                <text x={xAt(OPEN_START) + PX} y={ROW_Y + 5 * ROW_H + 12} fontSize="12" fontWeight="700" textAnchor="middle" fill={OPEN}>
                  안 끝남
                </text>
              </g>
              <line x1={X0} x2={xAt(WINDOW)} y1={axisY} y2={axisY} stroke={TEXT} strokeWidth="1" />
              {[0, 2, 4, 6, 8, 10].map((t) => (
                <text key={`t-${t}`} x={xAt(t)} y={axisY + 16} fontSize="12" textAnchor={t === WINDOW ? "end" : t === 0 ? "start" : "middle"} fill={TEXT}>
                  {t}초
                </text>
              ))}
              
              {SECONDS.map((s) => (
                <text
                  key={`n-${s}`}
                  x={xAt(s) + PX / 2}
                  y={axisY + 40}
                  fontSize="14"
                  fontWeight="700"
                  textAnchor="middle"
                  fill={showCols ? (withOpen && s >= OPEN_START ? OPEN : STRONG) : "none"}
                >
                  {inflight(s, withOpen)}
                </text>
              ))}
            </svg>
            <StableSceneStack
              active={active}
              className="mt-2"
              scenes={MATH.map((line) => (
                <p key={line} className="font-mono text-xs leading-6 text-foreground sm:text-sm">
                  {line}
                </p>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
