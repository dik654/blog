import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kernel-timers — tcp_fin_timeout을 60에서 10으로 내렸을 때 세 경우의 타임라인.
 * 서버가 수 ms 안에 FIN: FIN_WAIT_2 짧게 + TIME_WAIT 60초(불변).
 * FIN이 안 옴: FIN_WAIT_2가 설정값만큼 뒤 정리. FIN이 5초 뒤 도착(가정): 그 순간 TIME_WAIT로 바뀌고 60초.
 */
const W = 360;
const H = 192;
const LEFT = 14;
const RIGHT = 346;
const MAX_S = 70;
const AXIS_Y = 164;
const sx = (seconds: number) => LEFT + (seconds / MAX_S) * (RIGHT - LEFT);

const ROW_Y: readonly number[] = [26, 76, 126];
const ROW_LABEL: readonly string[] = ["서버가 수 ms 안에 FIN (3절 사례)", "상대가 FIN을 끝내 보내지 않음", "FIN이 5초 뒤 도착 (가정)"];
const BAR_H = 18;

const SETTING: readonly number[] = [60, 10, 60, 10, 10];
const ACTIVE_ROW: readonly number[] = [0, 0, 1, 1, 2];

const SCENES = [
  { label: "사례의 연결 · 설정 60", summary: "FIN_WAIT_2 수 ms → TIME_WAIT 60초", note: "FIN이 곧바로 오므로 FIN_WAIT_2는 아주 짧게 지나갑니다. 포트를 붙잡는 시간은 거의 전부 TIME_WAIT입니다." },
  { label: "사례의 연결 · 설정 10", summary: "그림이 그대로입니다", note: "설정을 10으로 내려도 TIME_WAIT 타이머는 TCP_TIMEWAIT_LEN 상수 60초입니다. 3절의 사례에서는 TIME_WAIT 수가 달라지지 않습니다." },
  { label: "FIN이 안 오는 연결 · 설정 60", summary: "FIN_WAIT_2로 60초", note: "프로그램이 close()한 뒤 상대가 FIN을 끝내 보내지 않는 고아 연결입니다. tcp_fin_timeout은 이 기다림의 길이입니다." },
  { label: "FIN이 안 오는 연결 · 설정 10", summary: "60초 → 10초로 줄어듦", note: "이 설정이 실제로 줄이는 것입니다. 고아 연결이 더 빨리 정리됩니다." },
  { label: "늦게라도 FIN이 오면", summary: "그 순간 TIME_WAIT · 다시 60초", note: "상대가 FIN을 보내면 그 순간 진짜 TIME_WAIT로 바뀌고 타이머는 다시 60초로 걸립니다. 넘겨받은 시간을 쓰다가도 상태가 TIME_WAIT이면 상수로 덮어씁니다." },
] as const;

interface Segment {
  from: number;
  to: number;
  kind: "wait2" | "timewait";
}

function rowSegments(row: number, setting: number): readonly Segment[] {
  if (row === 0) return [{ from: 0, to: 0.5, kind: "wait2" }, { from: 0.5, to: 60.5, kind: "timewait" }];
  if (row === 1) return [{ from: 0, to: setting, kind: "wait2" }];
  return [{ from: 0, to: 5, kind: "wait2" }, { from: 5, to: 65, kind: "timewait" }];
}

export default function FinTimeoutViz() {
  return (
    <SceneShell
      eyebrow="타이머 두 개"
      title="tcp_fin_timeout을 낮춰도 TIME_WAIT 막대는 짧아지지 않습니다"
      description="가로축은 close() 뒤의 초입니다. 주황 막대가 FIN_WAIT_2, 파란 막대가 TIME_WAIT이고, 세로 점선이 지금의 tcp_fin_timeout 값입니다."
      note="첫 줄의 수 ms는 보이도록 조금 넓혀 그렸습니다."
      ariaLabel="tcp_fin_timeout 값에 따른 FIN_WAIT_2와 TIME_WAIT 길이"
      scenes={SCENES}
      render={(active) => {
        const setting = SETTING[active];
        const focus = ACTIVE_ROW[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={sx(setting)} x2={sx(setting)} y1={14} y2={AXIS_Y} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
            <text
              x={setting === 60 ? sx(setting) - 4 : sx(setting) + 4}
              y={AXIS_Y - 4}
              textAnchor={setting === 60 ? "end" : "start"}
              fontSize={11}
              fontWeight={700}
              fill="#d97706"
            >
              tcp_fin_timeout = {setting}
            </text>

            {ROW_Y.map((y, row) => {
              if (row > focus) return null;
              return (
                <g key={row} opacity={row === focus ? 1 : 0.4}>
                  <text x={LEFT} y={y - 5} fontSize={11} fontWeight={700} fill="currentColor">{ROW_LABEL[row]}</text>
                  {rowSegments(row, setting).map((segment) => {
                    const isTimeWait = segment.kind === "timewait";
                    const width = Math.max(sx(segment.to) - sx(segment.from), 2);
                    return (
                      <g key={segment.kind}>
                        <rect x={sx(segment.from)} y={y} width={width} height={BAR_H} fill={isTimeWait ? "#2563eb" : "#d97706"} />
                        {width > 62 && (
                          <text x={sx(segment.from) + width / 2} y={y + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                            {isTimeWait ? "TIME_WAIT 60초" : "FIN_WAIT_2"}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  {row === 1 && <text x={sx(setting) + 5} y={y + 13} fontSize={11} fill="currentColor">정리됨</text>}
                </g>
              );
            })}

            <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 10, 60].map((tick) => (
              <text key={tick} x={sx(tick)} y={AXIS_Y + 15} textAnchor="middle" fontSize={11} fill="currentColor">{tick}초</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
