import SceneShell from "./SceneShell";

/**
 * 본문 대응: #benchmarks — typed-decisions 2,000개: 미세조정 0.766, English 0.362, multilingual 0.3515,
 * 무작위 0.318, 다수 class 0.461. 제3자 표(TypeSafe Jev 비교): AG News 0.950 대 0.910, Banking77 0.425 대 0.870.
 */
const SCENES = [
  { label: "typed-decisions 2,000개", summary: "기본 0.362 < 다수 class 0.461", note: "기본 checkpoint 두 개는 무작위 0.318보다 조금 높지만 질문마다 가장 흔한 답을 고르는 기준 0.461보다 낮습니다. 0.766은 이 과제의 학습 분할로 미세조정한 checkpoint입니다." },
  { label: "제3자 표의 두 과제", summary: "AG News 앞섬 · Banking77 뒤집힘", note: "비교 대상 Jev는 카드가 인용한 TypeSafe Jev입니다. AG News에서는 Laya가 0.950으로 Jev 0.910보다 앞서지만, 선택지 77개인 Banking77에서는 0.425로 0.870보다 크게 뒤집니다. 제작사가 직접 잰 값이 아니고 표본과 prompt도 다릅니다." },
] as const;

const W = 360;
const L = 24;
const R = 336;
const ax = (acc: number) => L + acc * (R - L);
const AXIS_Y = 172;

const TYPED = [
  { name: "미세조정", acc: 0.766, y: 70, color: "#2563eb" },
  { name: "English", acc: 0.362, y: 100, color: "#475569" },
  { name: "multilingual", acc: 0.3515, y: 130, color: "#475569" },
] as const;

const PAIRS = [
  { task: "AG News", laya: 0.95, jev: 0.91, y: 76 },
  { task: "Banking77 (선택지 77)", laya: 0.425, jev: 0.87, y: 136 },
] as const;

export default function BenchmarkBaselineViz() {
  return (
    <SceneShell
      eyebrow="정확도 (모델 카드 기준)"
      title="기본 checkpoint는 가장 흔한 답 고르기보다 낮습니다"
      description="가로축은 0부터 1까지의 정확도입니다. 두 장면 모두 같은 축이며 수치는 모델 카드와 카드가 인용한 제3자 표의 값입니다."
      ariaLabel="typed-decisions 정확도와 기준선, 제3자 표의 AG News·Banking77 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 196`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={L} x2={R} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <text key={t} x={ax(t)} y={AXIS_Y + 15} textAnchor="middle" fontSize={9} fill="#94a3b8">{t}</text>
          ))}
          {active === 0 ? (
            <g>
              <line x1={ax(0.318)} x2={ax(0.318)} y1={30} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={ax(0.461)} x2={ax(0.461)} y1={30} y2={AXIS_Y} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
              <text x={ax(0.318) - 4} y={24} textAnchor="end" fontSize={10} fill="#64748b">무작위 0.318</text>
              <text x={ax(0.461) + 4} y={24} fontSize={10} fill="#d97706">다수 class 0.461</text>
              {TYPED.map((row) => (
                <g key={row.name}>
                  <circle cx={ax(row.acc)} cy={row.y} r={5} fill={row.color} />
                  <text x={ax(row.acc) + (row.acc > 0.5 ? -9 : 9)} y={row.y + 4} textAnchor={row.acc > 0.5 ? "end" : "start"} fontSize={10} fontWeight={700} fill={row.color}>
                    {row.name} {row.acc}
                  </text>
                </g>
              ))}
            </g>
          ) : (
            <g>
              {PAIRS.map((pair) => (
                <g key={pair.task}>
                  <text x={L} y={pair.y - 22} fontSize={10} fontWeight={700} fill="#334155">{pair.task}</text>
                  <line x1={ax(pair.laya)} x2={ax(pair.jev)} y1={pair.y} y2={pair.y} stroke="#cbd5e1" strokeWidth={1} />
                  <circle cx={ax(pair.laya)} cy={pair.y} r={5} fill="#2563eb" />
                  <circle cx={ax(pair.jev)} cy={pair.y} r={5} fill="#ffffff" stroke="#475569" strokeWidth={1} />
                  <text x={ax(pair.laya)} y={pair.y - 9} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">Laya {pair.laya.toFixed(3)}</text>
                  <text x={ax(pair.jev)} y={pair.y + 18} textAnchor="middle" fontSize={10} fill="#475569">Jev {pair.jev.toFixed(3)}</text>
                </g>
              ))}
            </g>
          )}
        </svg>
      )}
    />
  );
}
