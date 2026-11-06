import SceneShell from "./SceneShell";

/**
 * 본문 대응: #applications — 호출을 두 배로 늘리는 두 선택.
 * Euler h=.5: 0,.5 → 끝값 .25, 오차 .1179. Euler h=.25: 0,.25,.5,.75 → .31640625, 오차 .0515.
 * Heun h=.5: (0, 예상 .5), (.5, 예상 1) → .390625, 오차 .0227.
 */
const ROWS = [
  { name: "Euler · 간격 0.5", reads: [{ t: 0 }, { t: 0.5 }], result: "호출 2회 · 끝값 0.25 · 오차 ≈0.1179", color: "#64748b" },
  { name: "Euler · 간격 0.25", reads: [{ t: 0 }, { t: 0.25 }, { t: 0.5 }, { t: 0.75 }], result: "호출 4회 · 끝값 ≈0.3164 · 오차 ≈0.0515", color: "#2563eb" },
  { name: "Heun · 간격 0.5", reads: [{ t: 0 }, { t: 0.5, predicted: true }, { t: 0.5 }, { t: 1, predicted: true }], result: "호출 4회 · 끝값 ≈0.3906 · 오차 ≈0.0227", color: "#d97706" },
] as const;

const SCENES = [
  { label: "출발선", summary: "호출 2회 · 오차 ≈0.1179", note: "1초를 간격 0.5의 Euler로 가면 변화율을 두 번 읽습니다. 한 번의 호출이 비싼 신경망 계산이라면 호출 횟수의 차이가 실행 시간에 영향을 줍니다." },
  { label: "간격을 절반으로", summary: "호출 4회 · 오차 ≈0.0515", note: "간격을 절반으로 줄이면 읽는 자리가 시간축에 고르게 늘어 호출이 두 배가 됩니다." },
  { label: "Heun으로 교체", summary: "호출 4회 · 오차 ≈0.0227", note: "호출은 같은 4회이지만 두 번은 예상 끝점에서 읽습니다. 이 매끄러운 감소 사례 하나의 값입니다. 같은 비용에 어느 쪽이 좋은지는 문제의 매끄러움, 안정성 제약, 요구한 오차와 구현에 따라 달라집니다." },
] as const;

const sx = (t: number) => 16 + 316 * t;

export default function CallCostViz() {
  return (
    <SceneShell
      eyebrow="같은 호출 수"
      title="호출을 두 배로 늘리는 두 가지 선택은 읽는 자리가 다릅니다"
      description="점 하나가 변화율 호출 한 번이고 놓인 자리가 읽은 시각입니다. x′=−x, 시작값 1, t=1까지이며 오차는 기준값 약 0.3679와의 차이입니다."
      ariaLabel="Euler와 Heun의 변화율 호출 위치 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 348 216" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {ROWS.map((row, index) => {
            const y = 46 + index * 64;
            const on = index <= active;
            return (
              <g key={row.name} opacity={on ? 1 : 0.25}>
                <text x={16} y={y - 14} fontSize={12.5} fontWeight={700} fill={row.color}>{row.name}</text>
                <line x1={sx(0)} x2={sx(1)} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
                {[0, 0.25, 0.5, 0.75, 1].map((t) => <line key={t} x1={sx(t)} x2={sx(t)} y1={y - 3} y2={y + 3} stroke="#94a3b8" strokeWidth={1} />)}
                {row.reads.map((read, readIndex) => {
                  const predicted = "predicted" in read;
                  const cy = predicted && read.t === 0.5 ? y - 7 : y;
                  return predicted
                    ? <circle key={readIndex} cx={sx(read.t)} cy={cy} r={4} fill="none" stroke={row.color} strokeWidth={1.25} />
                    : <circle key={readIndex} cx={sx(read.t)} cy={y} r={4} fill={row.color} />;
                })}
                {on && <text x={16} y={y + 18} fontSize={12} fill="#64748b">{row.result}</text>}
              </g>
            );
          })}
          <text x={332} y={12} textAnchor="end" fontSize={11.5} fill="#64748b">● 계산한 상태에서 읽음 · ○ 예상 끝점에서 읽음</text>
        </svg>
      )}
    />
  );
}
