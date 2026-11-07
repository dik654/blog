import SceneShell from "./SceneShell";

/**
 * 본문 대응: #saturation — 포화한 파드를 풀에서 빼면 그 몫이 남은 파드로 가서 연쇄한다. 요청 단위로 다루면 파드는 남는다.
 * (가정) 파드 4개 60·70·80·90, 합 300, 임계 85, 빠진 몫은 고르게 나뉜다.
 * 90 빠짐 → +30: 90·100·110. 110 빠짐 → +55: 145·155. 155 빠짐 → 300. 마지막 빠짐 → 0개.
 * 전체 포화 장면: 파드 한 개 처리량 100, 요청 440 → 40 거절.
 */
type Load = number | null;

interface Scene {
  label: string;
  summary: string;
  note: string;
  loads: readonly [Load, Load, Load, Load];
  ranked?: boolean;
  rejected?: number;
}

const SCENES: readonly Scene[] = [
  { label: "파드 D가 임계를 넘습니다", summary: "90 > 85", loads: [60, 70, 80, 90], note: "(가정) 넷이 함께 300을 처리합니다. D만 임계를 넘었고 이 방식은 D를 준비되지 않은 것으로 표시해 풀에서 뺍니다. 자연스러워 보이는 첫 걸음입니다." },
  { label: "D의 몫이 셋으로 갑니다", summary: "90 ÷ 3 = 30씩", loads: [90, 100, 110, null], note: "요청 합은 그대로 300인데 받을 파드가 셋이 됐습니다. 남은 파드들도 이미 바빴으므로 셋 모두 임계 85를 넘습니다." },
  { label: "C가 빠집니다", summary: "110 ÷ 2 = 55씩", loads: [145, 155, null, null], note: "(가정) 셋 다 임계를 넘었지만 가장 높은 C부터 하나씩 뺀다고 둡니다. 남은 둘이 300을 나눠 받습니다." },
  { label: "B가 빠집니다", summary: "A 혼자 300", loads: [300, null, null, null], note: "마지막 한 파드가 전부를 받습니다. 처음에 60을 처리하던 파드입니다." },
  { label: "전부 빠졌습니다", summary: "남은 파드 0개", loads: [null, null, null, null], note: "처음 300은 넷이 처리하던 양인데 이제 받을 파드가 없습니다. 포화를 장애로 신고하면 포화가 진짜 장애가 됩니다." },
  { label: "파드를 빼지 않으면", summary: "D는 순위만 내림", loads: [60, 70, 80, 90], ranked: true, note: "같은 출발입니다. 파드는 그대로 두고 D의 순위만 내립니다. 프로세스가 살아 있고 모델도 올라와 있으므로 넷이 그대로 남습니다." },
  { label: "전체가 포화일 때", summary: "440 − 400 = 40 거절", loads: [100, 100, 100, 100], rejected: 40, note: "(가정) 파드 하나가 100을 처리하는데 요청이 440이면 낮은 등급 요청부터 40을 거절합니다. 파드 집합이 유지되므로 남은 용량이 어디로 갈지 고를 수 있습니다." },
];

const NAMES = ["A", "B", "C", "D"] as const;
const LIMIT = 85;
const MAX = 300;
const LEFT = 20;
const BAR_W = 50;
const GAP = 20;
const BASE = 172;
const TOP = 22;
const REJECT_X = LEFT + 4 * (BAR_W + GAP);

const yAt = (value: number) => BASE - (value / MAX) * (BASE - TOP);

export default function SaturationCascadeViz() {
  return (
    <SceneShell
      eyebrow="수용량을 준비 상태로 표현하면"
      title="포화한 파드를 하나씩 빼면 남은 파드까지 전부 빠집니다"
      description="막대 하나가 파드이고 높이가 받는 요청 몫이고, 빨간 막대는 임계를 넘은 파드입니다. 파드 수, 몫, 임계 85는 설명용 가정이고 빠진 몫은 고르게 나뉜다고 둡니다(가정)."
      ariaLabel="포화한 파드를 풀에서 빼는 연쇄와 요청 단위로 거절하는 경우의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 204" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT - 6} x2={352} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {scene.loads.map((load, index) => {
              const x = LEFT + index * (BAR_W + GAP);
              const over = load !== null && load > LIMIT;
              const status = load === null ? "빠짐" : scene.ranked && index === 3 ? "순위 내림" : "풀 안";
              return (
                <g key={NAMES[index]}>
                  {load === null ? (
                    <text x={x + BAR_W / 2} y={BASE - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">0</text>
                  ) : (
                    <>
                      <rect x={x} y={yAt(load)} width={BAR_W} height={BASE - yAt(load)} rx={2} fill={over ? "#dc2626" : "#2563eb"} opacity={0.85} />
                      <text x={x + BAR_W / 2} y={over ? yAt(load) - 5 : yAt(load) + 14} textAnchor="middle" fontSize={12} fontWeight={700} fill={over ? "#dc2626" : "#ffffff"}>{load}</text>
                    </>
                  )}
                  <text x={x + BAR_W / 2} y={BASE + 13} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">파드 {NAMES[index]}</text>
                  <text x={x + BAR_W / 2} y={BASE + 27} textAnchor="middle" fontSize={11} fill="#64748b">{status}</text>
                </g>
              );
            })}
            <line x1={LEFT - 6} x2={352} y1={yAt(LIMIT)} y2={yAt(LIMIT)} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
            <text x={352} y={yAt(LIMIT) - 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">임계 {LIMIT}</text>
            {scene.rejected !== undefined && (
              <g>
                <rect x={REJECT_X} y={yAt(scene.rejected)} width={40} height={BASE - yAt(scene.rejected)} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                <text x={REJECT_X + 20} y={BASE + 13} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">거절 {scene.rejected}</text>
                <text x={REJECT_X + 20} y={BASE + 27} textAnchor="middle" fontSize={11} fill="#64748b">낮은 등급</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
