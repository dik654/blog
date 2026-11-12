import SceneShell from "./SceneShell";

/**
 * 본문 대응: #corner 마지막 문단 — ωRC 0.1·1·10 → 출력 비 0.9950·0.7071·0.09950 → ×5 V → 4.98·3.54·0.50 V,
 * 늦는 각도 −arctan(ωRC) = −5.7°·−45°·−84.3°. 가로는 각 속도의 두 주기를 같은 폭으로 늘린 것이다.
 */
const X0 = 56;
const X1 = 464;
const MID = 128;
const VOLT = 18; // 1 V당 세로 px
const PERIOD_PX = (X1 - X0) / 2;

const SCENES = [
  {
    label: "15.915 Hz · ωRC = 0.1",
    summary: "×0.9950 → 4.98 V · 5.7° 늦음",
    ratio: 0.995,
    lag: 5.7,
    note: "출력 비 1/√(1+0.1²) ≈ 0.9950이라 출력 봉우리는 4.98 V로 입력과 거의 겹칩니다. 늦는 각도 arctan(0.1) ≈ 5.7°는 한 주기의 약 1.6%입니다. 한 주기는 약 62.8 ms입니다.",
  },
  {
    label: "159.15 Hz · ωRC = 1",
    summary: "×0.7071 → 3.54 V · 45° 늦음",
    ratio: 0.7071,
    lag: 45,
    note: "출력 비 1/√2 ≈ 0.7071이라 봉우리가 3.54 V로 낮아집니다. 출력 봉우리는 한 주기의 8분의 1(45°)만큼 뒤에 옵니다. 한 주기는 약 6.28 ms입니다.",
  },
  {
    label: "1591.5 Hz · ωRC = 10",
    summary: "×0.09950 → 0.50 V · 84.3° 늦음",
    ratio: 0.0995,
    lag: 84.3,
    note: "출력 비 1/√(1+10²) ≈ 0.09950이라 봉우리가 0.50 V입니다. 출력은 0이 아니고, 늦는 각도는 arctan(10) ≈ 84.3°로 4분의 1주기(90°)에 가깝습니다. 한 주기는 약 0.628 ms입니다.",
  },
] as const;

const wave = (amp: number, lagDeg: number) =>
  Array.from({ length: 161 }, (_, i) => {
    const t = i / 80; // 0~2 주기
    const v = amp * Math.sin(2 * Math.PI * t - (lagDeg * Math.PI) / 180);
    return `${i ? "L" : "M"}${(X0 + t * PERIOD_PX).toFixed(1)} ${(MID - v * VOLT).toFixed(1)}`;
  }).join(" ");

export default function WaveLagViz() {
  return (
    <SceneShell
      eyebrow="세 속도의 시간 파형"
      title="출력 봉우리가 얼마나 낮아지고 얼마나 늦는지 봅니다"
      description="회색은 입력(최대 5 V), 파랑은 축전기 양끝 출력입니다. 가로는 속도마다 두 주기를 같은 폭으로 늘려 그렸으므로 실제 시간 길이는 장면마다 다릅니다. 늦는 각도는 한 주기를 360°로 놓고 잰 봉우리 사이 시차입니다."
      note="1 kΩ·1 µF 무부하 이상 회로가 충분히 오래 반복된 정상 상태를 가정합니다."
      ariaLabel="세 반복 속도에서 입력과 출력 정현파의 진폭과 시차"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const inPeak = X0 + 0.25 * PERIOD_PX;
        const outPeak = inPeak + (s.lag / 360) * PERIOD_PX;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 480 252" className="mx-auto block h-auto w-full max-w-[30rem]" role="img" aria-label={`${s.label}: 입력 5 V, 출력 ${s.summary}`}>
              <path d={`M${X0} ${MID} H${X1}`} stroke="#94a3b8" strokeWidth="1" fill="none" />
              <path d={`M${X0} 30 V226`} stroke="#94a3b8" strokeWidth="1" fill="none" />
              {[5, 0, -5].map((v) => (
                <text key={v} x={X0 - 6} y={MID - v * VOLT + 4} textAnchor="end" fontSize="12" fill="currentColor">
                  {v > 0 ? "+5 V" : v < 0 ? "−5 V" : "0"}
                </text>
              ))}
              {[1, 2].map((k) => (
                <text key={k} x={X0 + k * PERIOD_PX} y={244} textAnchor="end" fontSize="12" fill="currentColor">{k}주기</text>
              ))}
              <path d={wave(5, 0)} stroke="#94a3b8" strokeWidth="1.25" fill="none" />
              <path d={wave(5 * s.ratio, s.lag)} stroke="#2563eb" strokeWidth="1.25" fill="none" />
              <path d={`M${inPeak} ${MID - 5 * VOLT} V${MID}`} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1" fill="none" />
              <path d={`M${outPeak} ${MID - 5 * s.ratio * VOLT} V${MID}`} stroke="#2563eb" strokeDasharray="3 3" strokeWidth="1" fill="none" />
              <path d={`M${inPeak} 24 H${Math.max(outPeak, inPeak + 2)}`} stroke="#d97706" strokeWidth="1.25" fill="none" />
              <text x={inPeak} y={16} fontSize="12" fontWeight="700" fill="#d97706">늦음 {s.lag}°</text>
              <text x={outPeak + 6} y={MID - 5 * s.ratio * VOLT - 6} fontSize="12" fontWeight="700" fill="#2563eb">
                {s.summary.split(" → ")[1].split(" ·")[0]}
              </text>
            </svg>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              <span className="text-slate-500">━ 입력 5 V</span>
              <span className="text-blue-600 dark:text-blue-400">━ 출력</span>
              <span className="text-amber-700 dark:text-amber-400">━ 봉우리 시차</span>
            </div>
          </div>
        );
      }}
    />
  );
}
