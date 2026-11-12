import SceneShell from "./SceneShell";

/**
 * 본문 대응: #labels — 10월 25일 사건 + 30일 관찰 = 11월 24일, + 7일 보고 = 12월 1일 00:00(총 37일).
 * 엄격한 이전 조건(정답 도착 < 시작점)으로 11월 1일·12월 1일 00:00은 제외, 12월 2일 00:00은 통과.
 * 가로축 = 10월 25일부터 지난 날 수(0~40).
 */
const DAYS = 40;
const OBS = 30;
const ARRIVAL = 37;

const W = 360;
const H = 158;
const LEFT = 16;
const RIGHT = 16;
const BAR_Y = 70;
const BAR_H = 16;
const AXIS_Y = 118;
const x = (day: number) => LEFT + (day / DAYS) * (W - LEFT - RIGHT);

const SCENES = [
  { label: "날짜를 더합니다", summary: "10/25 + 30일 + 7일 = 12/1", origin: null, origin_label: "", pass: false, note: "사건 뒤 30일을 끝까지 관찰해야 11월 24일에 결과가 확정되고, 보고가 7일 늦어 12월 1일 00:00에야 정답이 시스템에 도착합니다. 사건부터 모두 37일입니다." },
  { label: "시작점 11월 1일", summary: "12/1 < 11/1 ? 아니요 → 제외", origin: 7, origin_label: "11/1", pass: false, note: "사건 날짜 10월 25일은 이미 과거입니다. 그러나 결과는 아직 관찰 중이고 보고도 오지 않았으므로 이 정답을 학습에 넣을 수 없습니다." },
  { label: "시작점 12월 1일 00:00", summary: "12/1 < 12/1 ? 아니요 → 제외", origin: 37, origin_label: "12/1", pass: false, note: "이 글은 시작점보다 먼저 도착한 정답만 쓰는 엄격한 규칙을 고릅니다(가정). 그래서 같은 시각에 도착한 정답도 제외합니다. 같은 시각 도착을 쓰려면 포함 규칙을 따로 명시해야 합니다." },
  { label: "시작점 12월 2일 00:00", summary: "12/1 < 12/2 → 정답 조건 통과", origin: 38, origin_label: "12/2", pass: true, note: "통과한 것은 정답 가용성 조건 하나입니다. 학습 기간 밖이거나 품질 오류가 있는 행은 여전히 전체 학습 집합에서 빠질 수 있습니다." },
] as const;

const TICKS: readonly (readonly [number, string])[] = [
  [0, "10/25"],
  [OBS, "11/24"],
  [ARRIVAL, "12/1"],
];

export default function LabelArrivalViz() {
  return (
    <SceneShell
      eyebrow="정답 도착 시각"
      title="10월 25일 사건의 정답은 37일 뒤에야 학습에 들어올 수 있습니다"
      description="가로축은 2026년 날짜(모두 UTC 00:00)입니다. 30일 관찰과 7일 보고 지연은 이 글의 가정입니다. 세로선은 예측 시작점, 곧 예측을 냈다고 재현하는 시각입니다."
      ariaLabel="10월 25일 사건의 정답 도착 시각과 세 예측 시작점의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lineColor = scene.pass ? "#16a34a" : "#dc2626";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={x(0)} y={BAR_Y} width={x(OBS) - x(0)} height={BAR_H} rx={3} fill="#f59e0b" opacity={0.75} />
            <text x={(x(0) + x(OBS)) / 2} y={BAR_Y + 12} textAnchor="middle" fontSize={13} fontWeight={700} fill="#78350f">결과 관찰 30일</text>
            <rect x={x(OBS)} y={BAR_Y} width={x(ARRIVAL) - x(OBS)} height={BAR_H} rx={3} fill="#94a3b8" />
            <text x={(x(OBS) + x(ARRIVAL)) / 2} y={BAR_Y - 5} textAnchor="middle" fontSize={13} fill="#475569">보고 7일</text>
            <circle cx={x(0)} cy={BAR_Y + BAR_H / 2} r={4} fill="#0f172a" />
            <path d={`M ${x(ARRIVAL)} ${BAR_Y + 2} l 6 6 l -6 6 l -6 -6 Z`} fill="#2563eb" />
            <text x={x(ARRIVAL) - 8} y={BAR_Y + BAR_H + 15} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563eb">정답 도착</text>
            <text x={x(0)} y={BAR_Y - 5} fontSize={13} fill="#0f172a">사건</text>

            <line x1={x(0)} x2={x(DAYS)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {TICKS.map(([day, text]) => (
              <g key={text}>
                <line x1={x(day)} x2={x(day)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(day)} y={AXIS_Y + 16} textAnchor="middle" fontSize={13} fill="#64748b">{text}</text>
              </g>
            ))}

            {scene.origin !== null && (
              <g>
                <line x1={x(scene.origin)} x2={x(scene.origin)} y1={30} y2={AXIS_Y} stroke={lineColor} strokeWidth={1.25} strokeDasharray="4 3" />
                <text
                  x={x(scene.origin)}
                  y={22}
                  textAnchor={scene.origin > 30 ? "end" : "start"}
                  fontSize={14}
                  fontWeight={700}
                  fill={lineColor}
                >
                  {`시작점 ${scene.origin_label} · ${scene.pass ? "통과" : "제외"}`}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
