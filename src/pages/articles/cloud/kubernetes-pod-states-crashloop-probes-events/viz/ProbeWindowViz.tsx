import SceneShell from "./SceneShell";

/**
 * 본문 대응: #probes — 기본값 probe(1초 timeout, 10초 주기, 실패 3회)의 시간표와 startupProbe 30×10.
 * 첫 검사가 컨테이너 시작 직후 돈다고 본다(7절 계산의 범위). 실패 3회는 t=0·10·20, 재시작 결정은 20+1=21초.
 * startupProbe 성공 시각 120초는 그림을 위한 가정이다.
 */
type Mark = "fail" | "ok";

interface Band { from: number; to: number; label: string; above?: string; color: string; text: string }

interface Scene {
  label: string;
  summary: string;
  max: number;
  ticks: readonly number[];
  probe: string;
  checks: readonly (readonly [number, Mark])[];
  counts: readonly string[] | null;
  lane: string;
  bands: readonly Band[];
  note: string;
}

const RUNNING = "#dcfce7";
const RUN_TEXT = "#166534";
const BAD = "#b91c1c";
const QUIET = "#e2e8f0";
const QUIET_TEXT = "#475569";

const every10 = Array.from({ length: 30 }, (_, i) => i * 10);

const SCENES: readonly Scene[] = [
  { label: "liveness · 세 번 연속 실패", summary: "20 + 1초에 재시작 결정", max: 36, ticks: [0, 10, 20, 30], probe: "liveness", checks: [[0, "fail"], [10, "fail"], [20, "fail"]], counts: ["1", "2", "3"], lane: "컨테이너", bands: [{ from: 0, to: 21, label: "실행 중", color: RUNNING, text: RUN_TEXT }, { from: 21, to: 36, label: "재시작", color: BAD, text: "#ffffff" }], note: "1초 안에 답이 없으면 실패 1회이고 10초 뒤 다시 검사합니다. 세 번째 실패가 20초 시점에 1초 timeout을 넘기면 재시작이 결정됩니다. 본문은 이 창을 3 × 10으로 잡아 '최대 약 30초'라고 적습니다." },
  { label: "liveness · 중간에 한 번 성공", summary: "카운터가 0으로", max: 36, ticks: [0, 10, 20, 30], probe: "liveness", checks: [[0, "fail"], [10, "ok"], [20, "fail"], [30, "fail"]], counts: ["1", "0", "1", "2"], lane: "컨테이너", bands: [{ from: 0, to: 36, label: "실행 중", color: RUNNING, text: RUN_TEXT }], note: "세는 것은 연속 실패입니다. 사이에 한 번이라도 성공하면 카운터가 0으로 돌아가 다시 처음부터 셉니다. 실패 횟수의 합이 3이어도 연속 3회가 아니면 재시작은 없습니다." },
  { label: "readiness · 같은 창, 다른 결과", summary: "죽이지 않고 endpoint에서 뺌", max: 36, ticks: [0, 10, 20, 30], probe: "readiness", checks: [[0, "fail"], [10, "fail"], [20, "fail"], [30, "ok"]], counts: ["1", "2", "3", "복귀"], lane: "Service", bands: [{ from: 0, to: 21, label: "포함", color: RUNNING, text: RUN_TEXT }, { from: 21, to: 30, label: "빠짐", color: QUIET, text: QUIET_TEXT }, { from: 30, to: 36, label: "포함", color: RUNNING, text: RUN_TEXT }], note: "readinessProbe는 같은 기본값으로 같은 검사를 하지만 실패해도 죽이지 않고 Ready를 false로 바꿔 Service의 EndpointSlice에서 뺍니다. 이 장면의 0초는 이미 Service에 들어 있던 Pod가 실패하기 시작한 시각으로 잡았습니다(가정). 성공 한 번이면 돌아오고(30초의 성공도 가정), 이 동안 liveness는 따로 돕니다." },
  { label: "startupProbe · 30×10 안에 성공", summary: "성공 순간 liveness 시작", max: 320, ticks: [0, 100, 200, 300], probe: "startup", checks: [...every10.filter((t) => t < 120).map((t) => [t, "fail"] as const), [120, "ok"]], counts: null, lane: "liveness", bands: [{ from: 0, to: 120, label: "꺼짐", color: QUIET, text: QUIET_TEXT }, { from: 120, to: 320, label: "liveness가 넘겨받음", color: RUNNING, text: RUN_TEXT }], note: "startupProbe는 liveness를 미루는 장치입니다. failureThreshold 30 · periodSeconds 10이면 최대 300초를 기다려 줍니다. 이 그림은 120초에 성공한다고 가정했고, 성공한 순간부터 liveness가 돕니다." },
  { label: "startupProbe · 300초 동안 성공 0회", summary: "컨테이너 종료 → restartPolicy", max: 320, ticks: [0, 100, 200, 300], probe: "startup", checks: every10.map((t) => [t, "fail"] as const), counts: null, lane: "컨테이너", bands: [{ from: 0, to: 300, label: "liveness 꺼진 채 기다림", color: QUIET, text: QUIET_TEXT }, { from: 300, to: 320, label: "", above: "종료", color: BAD, text: BAD }], note: "300초 안에 한 번도 성공하지 못하면 컨테이너가 죽고 재시작이면 3절의 backoff 시계를 탑니다. 빨간 칸이 종료 지점입니다. 본문처럼 30 × 10 = 300초에서 끊어 그렸고, 첫 장면과 같은 방식으로 세면 마지막 검사는 290초입니다. 뜨는 데 6분 걸리는 앱은 이 설정으로는 끝내 뜨지 못합니다." },
];

const W = 340;
const LEFT = 62;
const AXIS_W = W - LEFT - 10;
const CHECK_Y = 22;
const COUNT_Y = 62;
const BAND_Y = 76;
const AXIS_Y = 110;

export default function ProbeWindowViz() {
  return (
    <SceneShell
      eyebrow="probe 시간표"
      title="기본값 probe는 10초 간격의 세 번으로 판정합니다"
      description="칸 하나가 한 번의 검사이고, 칸 왼쪽 끝이 검사 시각입니다(칸 폭은 시간이 아닙니다). ×는 1초 안에 답이 없는 실패, ○는 성공입니다. probe는 kubelet이 컨테이너 상태를 주기적으로 검사하는 일이고, 첫 검사는 시작 직후 돈다고 봅니다."
      ariaLabel="liveness, readiness, startup probe의 검사 시각과 결과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sx = (sec: number) => LEFT + (sec / scene.max) * AXIS_W;
        const fine = scene.max > 100;
        return (
          <svg viewBox={`0 0 ${W} 140`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={0} y={CHECK_Y + 12} fontSize={11} fontWeight={700} className="fill-foreground">{scene.probe}</text>
            {scene.checks.map(([time, mark], index) => {
              const color = mark === "fail" ? "#b91c1c" : "#16a34a";
              return (
                <g key={time}>
                  {fine ? (
                    <>
                      <rect x={sx(time) + 0.5} y={CHECK_Y} width={Math.max(3, sx(10) - sx(0) - 2)} height={16} rx={1} fill={color} opacity={mark === "fail" ? 0.55 : 1} />
                      {mark === "ok" && <text x={sx(time) + 4} y={CHECK_Y - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#15803d">{time}초 성공</text>}
                    </>
                  ) : (
                    <>
                      <rect x={sx(time)} y={CHECK_Y} width={18} height={16} rx={2} fill="none" stroke={color} strokeWidth={1} />
                      <text x={sx(time) + 9} y={CHECK_Y + 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{mark === "fail" ? "×" : "○"}</text>
                    </>
                  )}
                  {scene.counts && (
                    <text x={sx(time) + 9} y={COUNT_Y - 6} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">{scene.counts[index]}</text>
                  )}
                </g>
              );
            })}
            {scene.counts && <text x={0} y={COUNT_Y - 6} fontSize={11} className="fill-muted-foreground">연속 실패</text>}
            {fine && <text x={0} y={COUNT_Y - 6} fontSize={11} className="fill-muted-foreground">막대 하나 = 10초 주기의 검사 1회 · 연한 빨강 실패 · 초록 성공</text>}
            <text x={0} y={BAND_Y + 14} fontSize={11} fontWeight={700} className="fill-foreground">{scene.lane}</text>
            {scene.bands.map((band) => (
              <g key={band.from}>
                <rect x={sx(band.from)} y={BAND_Y} width={sx(band.to) - sx(band.from)} height={20} fill={band.color} stroke="#94a3b8" strokeWidth={1} />
                {band.above && (
                  <text x={sx(band.to)} y={BAND_Y - 3} textAnchor="end" fontSize={11} fontWeight={700} fill={band.text}>{band.above}</text>
                )}
                {band.label && (
                  <text x={(sx(band.from) + sx(band.to)) / 2} y={BAND_Y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={band.text}>{band.label}</text>
                )}
              </g>
            ))}
            <line x1={LEFT} x2={W - 10} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {scene.ticks.map((tick) => (
              <g key={tick}>
                <line x1={sx(tick)} x2={sx(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={sx(tick)} y={AXIS_Y + 17} textAnchor="middle" fontSize={11} className="fill-muted-foreground">{tick}</text>
              </g>
            ))}
            <text x={W - 10} y={AXIS_Y + 30} textAnchor="end" fontSize={11} className="fill-muted-foreground">초</text>
          </svg>
        );
      }}
    />
  );
}
