import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rules-or-discretion — 체크리스트만 두면 목록 밖 결함이 통과하고,
 * 예외 통로·근거 기록·재량 확대·무작위 재검사가 경로를 어떻게 바꾸는지 차량 세 대(가정)로 따라간다.
 * 실선 = 판정 경로, 점선 = 검사관에 따라 갈 수도 있는 경로.
 */
const W = 360;
const H = 240;
const CAR_X = 6;
const CAR_W = 122;
const CHECK_X = 146;
const CHECK_W = 60;
const OUT_X = 236;
const OUT_W = 118;
const ROW_Y = [44, 116, 188] as const;
const OUT_Y = { fail: 44, pass: 116, deep: 188 } as const;

type Outcome = keyof typeof OUT_Y;

const CARS = [
  { letter: "A", name: "차량 A", detail: "배선 손상(목록 안)" },
  { letter: "B", name: "차량 B", detail: "수치 통과·새 개조 흔적" },
  { letter: "C", name: "차량 C", detail: "이상 없음" },
] as const;

const OUTCOMES: readonly { key: Outcome; label: string }[] = [
  { key: "fail", label: "불합격" },
  { key: "pass", label: "통과" },
  { key: "deep", label: "정밀 점검" },
];

interface Route {
  car: number;
  to: Outcome;
  maybe: boolean;
}

const BASE: readonly Route[] = [
  { car: 0, to: "fail", maybe: false },
  { car: 2, to: "pass", maybe: false },
];
const B_PASS: Route = { car: 1, to: "pass", maybe: false };
const B_DEEP: Route = { car: 1, to: "deep", maybe: false };
const C_MAYBE: Route = { car: 2, to: "deep", maybe: true };

const SCENES: readonly {
  label: string;
  summary: string;
  routes: readonly Route[];
  record: boolean;
  recheck: boolean;
  note: string;
}[] = [
  { label: "체크리스트만", summary: "B는 위험한데 통과", routes: [...BASE, B_PASS], record: false, recheck: false, note: "목록의 수치만 보면 A는 불합격, C는 통과입니다. B는 모든 수치를 통과하므로 위험한 흔적이 있어도 통과합니다." },
  { label: "예외 통로를 둡니다", summary: "B → 정밀 점검", routes: [...BASE, B_DEEP], record: false, recheck: false, note: "목록 밖 징후를 보면 정밀 점검으로 넘길 수 있게 합니다. 이 통로가 없으면 검사관이 새 결함을 알아차려도 통과시킬 수밖에 없습니다." },
  { label: "넘긴 이유를 남깁니다", summary: "사진·측정값·문장", routes: [...BASE, B_DEEP], record: true, recheck: false, note: "정밀 점검으로 넘긴 차량마다 이유를 기록합니다. 다른 검사관과 사후 검토자가 그 판단을 다시 볼 수 있습니다." },
  { label: "재량이 넓어지면", summary: "검사관마다 갈림", routes: [...BASE, B_DEEP, C_MAYBE], record: true, recheck: false, note: "‘수상하면 더 보라’는 재량이 넓을수록 새 위험을 잡을 수 있지만, 검사관에 따라 이상 없는 C도 정밀 점검으로 보낼 수 있습니다(점선, 가정). 편견이 끼어들 여지도 커집니다." },
  { label: "무작위로 다시 봅니다", summary: "두 오류를 따로 셈", routes: [...BASE, B_DEEP, C_MAYBE], record: true, recheck: true, note: "표본을 다시 검사해 위험한데 통과한 경우(통과 오류)와 이상 없는데 정밀 점검으로 간 경우(과잉 검사 오류)를 따로 셉니다. 그래야 어느 쪽 경계를 옮길지 알 수 있습니다." },
];

const routeColor = (route: Route) =>
  route.car === 1 && route.to === "pass" ? "#dc2626" : route.to === "deep" ? "#2563eb" : "#64748b";

export default function ChecklistBranchViz() {
  return (
    <SceneShell
      eyebrow="체크리스트와 현장 판단의 경계"
      title="목록 밖 결함은 어느 길로 가나요?"
      description="차량 세 대를 같은 점검에 넣고 규칙을 하나씩 더합니다. 차량과 결함은 설명용 가정입니다. 실선은 판정 경로, 점선은 검사관에 따라 갈 수도 있는 경로입니다."
      note="통과 오류는 위험한 차량이 통과한 경우, 과잉 검사 오류는 위험하지 않은 차량이 정밀 점검으로 넘어간 경우입니다. 차량 수와 오류 수는 정하지 않았습니다."
      ariaLabel="체크리스트, 예외 통로, 근거 기록, 재량 확대, 무작위 재검사에 따라 차량 세 대의 판정 경로가 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const passError = scene.routes.some((route) => route.car === 1 && route.to === "pass");
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={CHECK_X} y={20} width={CHECK_W} height={192} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={CHECK_X + CHECK_W / 2} y={112} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">체크</text>
            <text x={CHECK_X + CHECK_W / 2} y={127} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">리스트</text>

            {CARS.map((car, index) => (
              <g key={car.name}>
                <rect x={CAR_X} y={ROW_Y[index] - 20} width={CAR_W} height={40} rx={8} fill="none" stroke={index === 1 ? "#dc2626" : "#94a3b8"} strokeWidth={1} />
                <text x={CAR_X + 8} y={ROW_Y[index] - 4} fontSize={12} fontWeight={700} fill="#334155">{car.name}</text>
                <text x={CAR_X + 8} y={ROW_Y[index] + 11} fontSize={11} fill="#64748b">{car.detail}</text>
                <line x1={CAR_X + CAR_W} x2={CHECK_X} y1={ROW_Y[index]} y2={ROW_Y[index]} stroke="#94a3b8" strokeWidth={1} />
              </g>
            ))}

            {scene.routes.map((route) => {
              const color = routeColor(route);
              return (
                <g key={`${route.car}-${route.to}`}>
                  <line
                    x1={CHECK_X + CHECK_W}
                    y1={ROW_Y[route.car]}
                    x2={OUT_X - 3}
                    y2={OUT_Y[route.to]}
                    stroke={color}
                    strokeWidth={route.maybe ? 1 : 1.25}
                    strokeDasharray={route.maybe ? "4 3" : undefined}
                  />
                  <circle cx={OUT_X - 3} cy={OUT_Y[route.to]} r={2.5} fill={color} />
                </g>
              );
            })}

            {OUTCOMES.map((outcome) => {
              const letters = scene.routes
                .filter((route) => route.to === outcome.key)
                .map((route) => CARS[route.car].letter + (route.maybe ? "?" : ""))
                .join(" · ");
              const red = outcome.key === "pass" && passError;
              return (
                <g key={outcome.key}>
                  <rect x={OUT_X} y={OUT_Y[outcome.key] - 16} width={OUT_W} height={32} rx={8} fill="none" stroke={red ? "#dc2626" : "#94a3b8"} strokeWidth={1} />
                  <text x={OUT_X + 8} y={OUT_Y[outcome.key] + 4} fontSize={12} fontWeight={700} fill="#334155">{outcome.label}</text>
                  <text x={OUT_X + OUT_W - 8} y={OUT_Y[outcome.key] + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={red ? "#dc2626" : "#475569"}>{letters}</text>
                </g>
              );
            })}

            {passError && <text x={OUT_X} y={OUT_Y.pass + 30} fontSize={11} fontWeight={700} fill="#dc2626">B: 위험한데 통과</text>}
            {scene.record && <text x={OUT_X} y={OUT_Y.deep + 30} fontSize={11} fill="#2563eb">근거: 사진·측정값·문장</text>}
            {scene.recheck && (
              <>
                <text x={OUT_X} y={OUT_Y.pass + 30} fontSize={11} fontWeight={700} fill="#475569">↺ 재검사 → 통과 오류 셈</text>
                <text x={OUT_X} y={OUT_Y.deep + 44} fontSize={11} fontWeight={700} fill="#475569">↺ 재검사 → 과잉 검사 셈</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
