import SceneShell from "./SceneShell";

/**
 * 본문 대응: #expectation — 같은 값 목록에 비중을 바꾸면 평균이 움직인다.
 * 공정: 1/4·1/2·1/4 → 1. 앞면 0.7: 0.09·0.42·0.49 → 0.42+2×0.49 = 1.4, 최빈값 2. U: 1/2·1/2 → 1/2.
 */
const INK = "#64748b";
const ACCENT = "#2563eb";
const BASE = 150;
const HEIGHT_PER_ONE = 220;
const xAt = (value: number) => 70 + value * 110;

const CASES = [
  { bars: [{ x: 0, p: 0.25, text: "1/4" }, { x: 1, p: 0.5, text: "1/2", mode: true }, { x: 2, p: 0.25, text: "1/4" }], mean: 1, meanText: "기댓값 1" },
  { bars: [{ x: 0, p: 0.09, text: "0.09" }, { x: 1, p: 0.42, text: "0.42" }, { x: 2, p: 0.49, text: "0.49", mode: true }], mean: 1.4, meanText: "기댓값 1.4" },
  { bars: [{ x: 0, p: 0.5, text: "1/2" }, { x: 1, p: 0.5, text: "1/2" }], mean: 0.5, meanText: "기댓값 1/2" },
] as const;

const SCENES = [
  { label: "공정한 두 던짐", summary: "기댓값 1 = 최빈값 1", note: "처음 사례에서는 기댓값과 최빈값이 우연히 모두 1로 같습니다." },
  { label: "앞면 확률 0.7", summary: "기댓값 1.4 ≠ 최빈값 2", note: "각 던짐의 앞면 확률을 0.7로 바꾸고 두 던짐이 독립이라고 정합니다(가정). 값 목록 0·1·2는 같은데 비중이 달라져 평균이 0.42+2×0.49 = 1.4로 옮겨 갑니다. 1.4는 한 번의 실행에서 나올 수 있는 앞면 개수가 아닙니다." },
  { label: "첫 결과만 보는 변수 U", summary: "E[U] = 1/2 · 실현값은 0 또는 1", note: "첫 결과가 H이면 1, T이면 0입니다. 공정한 던짐에서 평균은 1/2이지만 한 실행의 U는 0이나 1입니다. 기댓값은 다음 값을 맞히는 예언으로 정의하지 않습니다." },
] as const;

export default function PmfMeanViz() {
  return (
    <SceneShell
      eyebrow="값별 비중과 평균의 자리"
      title="기댓값은 가장 높은 막대도, 나올 수 있는 값도 아닐 수 있습니다"
      description="막대 높이가 그 값의 비중이고 아래 삼각형이 기댓값의 자리입니다. 최빈값은 비중이 가장 큰 값입니다."
      ariaLabel="세 분포에서 값별 비중과 기댓값의 위치 비교"
      scenes={SCENES}
      render={(index) => {
        const item = CASES[index];
        return (
          <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            {item.bars.map((bar) => {
              const height = bar.p * HEIGHT_PER_ONE;
              const mode = "mode" in bar && bar.mode;
              return (
                <g key={bar.x}>
                  <rect x={xAt(bar.x) - 26} y={BASE - height} width={52} height={height} rx={2} fill={mode ? ACCENT : "#94a3b8"} opacity={mode ? 0.9 : 0.7} />
                  <text x={xAt(bar.x)} y={BASE - height - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={mode ? ACCENT : INK}>
                    {bar.text}{mode ? " · 최빈값" : ""}
                  </text>
                  <text x={xAt(bar.x)} y={BASE + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>{bar.x}</text>
                </g>
              );
            })}
            <line x1={24} x2={336} y1={BASE} y2={BASE} stroke={INK} strokeWidth={1} />
            <path d={`M${xAt(item.mean)} ${BASE + 22} l-6 10 h12 z`} fill="#d97706" />
            <text x={xAt(item.mean)} y={BASE + 48} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">{item.meanText}</text>
          </svg>
        );
      }}
    />
  );
}
