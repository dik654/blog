import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·two-sides·velocity 절. 숫자는 Fisher 개정판 16~18쪽 */
const SCENES = [
  "거래 하나는 양쪽이 같은 값입니다",
  "한 해를 다 더해도 양쪽이 같습니다",
  "돈 쪽은 가진 돈에 몇 번 썼는지를 곱합니다",
  "물건 쪽은 값과 수량을 곱해 더합니다",
] as const;

/** Fisher 16쪽의 한 거래 */
const SUGAR_LB = 10;
const SUGAR_CENT = 7;

/** Fisher 17~18쪽: 돈 쪽과 물건 쪽 */
const MONEY = 5_000_000;
const TURNS = 20;
const GOODS = [
  { name: "빵", qty: 200_000_000, unit: "개", price: 0.1 },
  { name: "석탄", qty: 10_000_000, unit: "톤", price: 5 },
  { name: "옷감", qty: 30_000_000, unit: "야드", price: 1 },
] as const;

const total = GOODS.reduce((a, g) => a + g.qty * g.price, 0);
const mv = MONEY * TURNS;

const MONEY_C = "#6366f1";
const GOODS_C = "#0ea5e9";
const MUTED = "#94a3b8";
const INK = "#334155";

const won = (n: number) =>
  n >= 100_000_000 ? `${(n / 100_000_000).toFixed(0)}억` : `${(n / 10_000).toFixed(0)}만`;

export default function ExchangeBalanceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const s = scenes.active;

  const NOTES = [
    `설탕 ${SUGAR_LB}파운드를 파운드당 ${SUGAR_CENT}센트에 사면 ${SUGAR_LB * SUGAR_CENT}센트가 건너가고 설탕 ${SUGAR_LB}파운드가 건너옵니다. 이 거래에서 양쪽은 같은 값입니다. 같다는 것은 발견이 아니라 거래의 정의입니다.`,
    `한 해 동안 일어난 모든 거래를 이렇게 적어 전부 더합니다. 하나하나가 같은 값이었으므로 다 더해도 같습니다. 한 나라에서 한 해 동안 건너간 돈과 건너온 물건은 값으로 같습니다.`,
    `돈 쪽을 셀 때 가진 돈만 세면 모자랍니다. 같은 지폐가 한 해에 여러 번 쓰이기 때문입니다. 가진 돈 ${won(MONEY)} 달러에 한 해 동안 ${TURNS}번 손을 바꾼다는 수를 곱하면 ${won(mv)} 달러가 됩니다.`,
    `물건 쪽은 종류마다 값에 수량을 곱해 더합니다. 빵 ${GOODS[0].qty / 100_000_000}억 개에 ${GOODS[0].price}달러, 석탄 ${GOODS[1].qty / 10_000}만 톤에 ${GOODS[1].price}달러, 옷감 ${GOODS[2].qty / 10_000}만 야드에 ${GOODS[2].price}달러를 곱해 더하면 ${won(total)} 달러입니다. 돈 쪽과 같습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="양쪽이 같다"
      title="한 해 동안 건너간 돈과 건너온 물건은 값으로 같습니다"
      description="거래 하나가 양쪽 같은 값이므로 전부 더해도 같습니다. 이 등식은 관찰이 아니라 셈의 결과입니다."
      note="숫자는 Fisher 『The Purchasing Power of Money』 개정판 16~18쪽의 예시 그대로입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="거래 하나에서 한 해 전체로 넓힌 등식의 양변"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100svh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              {/* 가운데 등호 */}
              <text x={240} y={100} fontSize={22} fontWeight={700} fill={INK} textAnchor="middle">
                =
              </text>

              {/* 왼쪽: 돈 쪽 */}
              <rect x={28} y={40} width={186} height={104} rx={5} fill={MONEY_C} opacity={0.09} stroke={MONEY_C} strokeWidth={1.25} />
              <text x={121} y={34} fontSize={8.5} fontWeight={700} fill={MONEY_C} textAnchor="middle">
                건너간 돈
              </text>
              {s === 0 ? (
                <text x={121} y={96} fontSize={15} fontWeight={700} fill={MONEY_C} textAnchor="middle">
                  {SUGAR_LB * SUGAR_CENT}센트
                </text>
              ) : (
                <g>
                  <text x={121} y={70} fontSize={8.5} fill={INK} textAnchor="middle">
                    가진 돈 {won(MONEY)} 달러
                  </text>
                  <text x={121} y={88} fontSize={8.5} fill={s >= 2 ? INK : MUTED} textAnchor="middle">
                    {s >= 2 ? `한 해 ${TURNS}번 손을 바꿈` : "몇 번 쓰였는지는 아직"}
                  </text>
                  <text x={121} y={118} fontSize={15} fontWeight={700} fill={s >= 2 ? MONEY_C : MUTED} textAnchor="middle">
                    {s >= 2 ? `${won(mv)} 달러` : "?"}
                  </text>
                </g>
              )}

              {/* 오른쪽: 물건 쪽 */}
              <rect x={266} y={40} width={186} height={104} rx={5} fill={GOODS_C} opacity={0.09} stroke={GOODS_C} strokeWidth={1.25} />
              <text x={359} y={34} fontSize={8.5} fontWeight={700} fill={GOODS_C} textAnchor="middle">
                건너온 물건
              </text>
              {s === 0 ? (
                <text x={359} y={96} fontSize={13} fontWeight={700} fill={GOODS_C} textAnchor="middle">
                  설탕 {SUGAR_LB}파운드
                </text>
              ) : s === 1 ? (
                <text x={359} y={96} fontSize={11} fontWeight={700} fill={MUTED} textAnchor="middle">
                  한 해에 오간 모든 물건
                </text>
              ) : (
                <g>
                  {GOODS.map((g, i) => (
                    <text key={g.name} x={359} y={62 + i * 15} fontSize={8} fill={s === 3 ? INK : MUTED} textAnchor="middle">
                      {g.name} {g.qty >= 100_000_000 ? `${g.qty / 100_000_000}억` : `${g.qty / 10_000}만`}
                      {g.unit} × {g.price}달러
                    </text>
                  ))}
                  <text x={359} y={122} fontSize={15} fontWeight={700} fill={s === 3 ? GOODS_C : MUTED} textAnchor="middle">
                    {s === 3 ? `${won(total)} 달러` : "?"}
                  </text>
                </g>
              )}

              <text x={14} y={178} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? `${SUGAR_LB}파운드 × ${SUGAR_CENT}센트 = ${SUGAR_LB * SUGAR_CENT}센트. 이 거래의 양쪽입니다`
                  : s === 1
                    ? "거래마다 같았으므로 전부 더해도 같습니다"
                    : s === 2
                      ? `가진 돈과 손 바뀐 횟수를 곱해야 건너간 돈이 나옵니다`
                      : `${won(mv)} 달러와 ${won(total)} 달러가 같습니다`}
              </text>
              <text x={14} y={192} fontSize={7.5} fill={MUTED}>
                한 해에 오간 물건 종류를 셋으로 줄인 예입니다
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
