import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — 같은 세 측정점(15.915·159.15·1591.5 Hz)을 Hz 차이 눈금과 배수 눈금에 놓아 본다.
 * 점의 값은 바뀌지 않고 눈금만 바뀐다. 출력 비 0.9950·0.7071·0.0995, 출력 4.98·3.54·0.50 V.
 */
const POINTS = [
  { key: "A", hz: 15.915, ratio: 0.995, text: "15.9 Hz · 비 0.995 · 4.98 V" },
  { key: "B", hz: 159.15, ratio: 0.7071, text: "159 Hz · 비 0.707 · 3.54 V" },
  { key: "C", hz: 1591.5, ratio: 0.0995, text: "1592 Hz · 비 0.0995 · 0.50 V" },
] as const;

const X0 = 64;
const X1 = 456;
const Y0 = 24;
const Y1 = 206;
const LIN_X_MAX = 1700;
const LOG_X_MIN = Math.log10(15.915) - 0.35;
const LOG_X_SPAN = 2.7;
const LOG_Y_MIN = Math.log10(0.005);
const LOG_Y_SPAN = Math.log10(1.5) - LOG_Y_MIN;

const xLin = (hz: number) => X0 + (hz / LIN_X_MAX) * (X1 - X0);
const xLog = (hz: number) => X0 + ((Math.log10(hz) - LOG_X_MIN) / LOG_X_SPAN) * (X1 - X0);
const yLin = (r: number) => Y1 - (r / 1.05) * (Y1 - Y0);
const yLog = (r: number) => Y1 - ((Math.log10(r) - LOG_Y_MIN) / LOG_Y_SPAN) * (Y1 - Y0);

const SCENES = [
  {
    label: "가로를 Hz 차이로 놓기",
    summary: "A→B 143 Hz, B→C 1432 Hz",
    logX: false,
    logY: false,
    note: "둘 다 열 배 증가인데 Hz 차이로 거리를 정하면 B→C가 A→B보다 열 배 길어집니다. A와 B는 왼쪽 끝에 몰려 느린 쪽 변화를 읽기 어렵습니다.",
  },
  {
    label: "가로를 배수로 놓기",
    summary: "×10마다 같은 거리",
    logX: true,
    logY: false,
    note: "같은 배수를 같은 거리에 두면 A·B·C가 고르게 놓입니다. 세로는 아직 비 그대로라 1, 0.1, 0.01 눈금이 바닥에 겹치듯 모여 있습니다.",
  },
  {
    label: "세로도 배수로 놓기",
    summary: "1·0.1·0.01이 같은 간격",
    logX: true,
    logY: true,
    note: "같은 배율의 감소를 같은 세로 간격으로 놓으면 작은 값도 보입니다. 점마다 적힌 출력 전압은 세 장면 내내 같습니다. 바뀐 것은 눈금뿐입니다.",
  },
] as const;

const Y_TICKS = [1, 0.1, 0.01] as const;
const LIN_X_TICKS = [0, 500, 1000, 1500] as const;

export default function LogAxisViz() {
  return (
    <SceneShell
      eyebrow="눈금 바꾸기"
      title="같은 세 점을 Hz 차이 눈금과 배수 눈금에 놓아 봅니다"
      description="가로는 반복 빈도(Hz), 세로는 출력÷입력 진폭 비입니다. A·B·C는 3절의 세 속도에서 잰 값이며, 장면이 바뀌어도 점의 값은 그대로입니다."
      note="1 kΩ·1 µF 무부하 회로와 5 V 최대 진폭 입력은 이 글의 가정입니다."
      ariaLabel="세 측정점을 선형 눈금과 로그 눈금에 배치한 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const xOf = scene.logX ? xLog : xLin;
        const yOf = scene.logY ? yLog : yLin;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 480 262" className="mx-auto block h-auto w-full max-w-[30rem]" role="img" aria-label={`${scene.label}: 세 측정점의 위치`}>
              <path d={`M${X0} ${Y0 - 8} V${Y1} H${X1 + 8}`} stroke="#94a3b8" strokeWidth="1" fill="none" />
              {Y_TICKS.map((t) => (
                <g key={t}>
                  <path d={`M${X0 - 4} ${yOf(t)} H${X1}`} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" fill="none" />
                  <text x={X0 - 8} y={yOf(t) + 4} textAnchor="end" fontSize="12" fill="currentColor">{t}</text>
                </g>
              ))}
              {scene.logX
                ? POINTS.map((p) => (
                    <text key={p.key} x={xOf(p.hz)} y={Y1 + 20} textAnchor="middle" fontSize="12" fill="currentColor">
                      {p.hz < 100 ? "15.9" : p.hz < 1000 ? "159" : "1592"}
                    </text>
                  ))
                : LIN_X_TICKS.map((t) => (
                    <text key={t} x={xOf(t)} y={Y1 + 20} textAnchor="middle" fontSize="12" fill="currentColor">{t}</text>
                  ))}
              <text x={(X0 + X1) / 2} y={Y1 + 44} textAnchor="middle" fontSize="12" fill="#64748b">
                {scene.logX ? "반복 빈도 Hz (열 배마다 같은 거리)" : "반복 빈도 Hz (같은 Hz 차이마다 같은 거리)"}
              </text>
              {POINTS.map((p) => (
                <g key={p.key}>
                  <circle cx={xOf(p.hz)} cy={yOf(p.ratio)} r="5" fill="#2563eb" />
                  <text x={xOf(p.hz) + 8} y={yOf(p.ratio) - 8} fontSize="13" fontWeight="700" fill="#2563eb">{p.key}</text>
                </g>
              ))}
            </svg>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs">
              {POINTS.map((p) => (
                <li key={p.key} className="whitespace-nowrap font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{p.key}</span> {p.text}
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
