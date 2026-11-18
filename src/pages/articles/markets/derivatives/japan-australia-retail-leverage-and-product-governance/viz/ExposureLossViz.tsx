import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 현금 100을 고정하고 배수가 노출과 충격 손실을 어떻게 바꾸는지 본다.
 * 노출 = 100 × 배수, 손실 = 노출 × 이동.
 * 일본 개인 장외 FX: 100 ÷ 4% = 2,500 → 1% 25, 5% 125.
 * 호주 소매 CFD 30배(설명용 최대): 3,000 → 1% 30, 5% 150. 2배(낮은 한도 상품): 200 → 1% 2, 5% 10.
 * 5% 충격은 7절의 "1%와 5% 충격" 계산을 배수만 곱해 보인 것이며 청산·비용·가격 틈은 뺐다.
 */
const CASH = 100;
const ROWS = [
  { key: "jp", label: "일본 FX 25배", multiple: 25 },
  { key: "au30", label: "호주 CFD 30배", multiple: 30 },
  { key: "au2", label: "호주 CFD 2배", multiple: 2 },
] as const;

const SCENES = [
  {
    label: "증거금 4% = 최대 25배",
    summary: "100 ÷ 4% = 2,500",
    shown: 1,
    move: 0,
    note: "노출(명목금액)은 손익 계산의 기준이 되는 거래금액입니다. 일본 개인 장외 FX는 거래금액의 4% 이상을 증거금으로 유지하므로 현금 100으로 잡는 노출은 최대 100÷4%=2,500, 곧 25배입니다. 칸 하나가 100입니다.",
  },
  {
    label: "일본: 1% 불리한 이동",
    summary: "2,500 × 1% = 25",
    shown: 1,
    move: 1,
    note: "손실은 넣은 현금이 아니라 노출 2,500에 붙습니다. 환율이 1% 불리하게 움직이면 손실은 25로, 현금 100의 4분의 1입니다. 환전·스프레드·조달비용은 뺀 설명용 계산입니다.",
  },
  {
    label: "호주: 주요 통화 30배",
    summary: "3,000 × 1% = 30",
    shown: 2,
    move: 1,
    note: "호주 소매 CFD는 기초자산에 따라 30대 1에서 2대 1입니다. 주요 통화처럼 높은 쪽 30배를 설명용 최대로 잡으면 같은 현금 100의 노출은 3,000이고 1% 손실은 30입니다.",
  },
  {
    label: "호주: 낮은 한도 2배",
    summary: "200 × 1% = 2",
    shown: 3,
    move: 1,
    note: "암호자산 같은 낮은 한도 상품의 2배라면 노출은 200이고 1% 손실은 2입니다. 같은 나라, 같은 현금이라도 기초자산이 바뀌면 손실 속도가 15배 차이 납니다.",
  },
  {
    label: "5% 충격으로 다시 계산",
    summary: "125 · 150 · 10",
    shown: 3,
    move: 5,
    note: "7절처럼 5% 충격을 넣으면 배수만 곱한 손실은 125·150·10이고, 앞의 둘은 현금 100을 넘습니다. 로스컷·강제 청산·음수 잔액 보호·비용·가격 틈을 뺀 단순 곱셈이라 실제 손실액은 아니며, 7절은 이것들을 계좌 단위로 함께 계산합니다.",
  },
] as const;

const LX = 104;
const RX = 344;
const EXPO_MAX = 3000;
const LOSS_MAX = 150;
const ex = (value: number) => LX + (value / EXPO_MAX) * (RX - LX);
const lx = (value: number) => LX + (value / LOSS_MAX) * (RX - LX);
const EXPO_Y = [40, 72, 104] as const;
const LOSS_Y = [178, 206, 234] as const;
const BAR_H = 12;

export default function ExposureLossViz() {
  return (
    <SceneShell
      eyebrow="현금 100의 노출과 손실"
      title="같은 현금 100이 배수에 따라 다른 손실을 맞는 길"
      description="위는 현금 100이 잡는 노출(명목금액), 아래는 불리한 이동의 손실을 넣은 현금 100과 견준 것입니다. 3절처럼 통화와 가격 단위를 100으로 맞춘 설명용 단위이며 비용·청산·가격 틈은 뺐습니다."
      ariaLabel="일본 개인 장외 FX 25배, 호주 소매 CFD 30배와 2배의 노출과 충격 손실 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lastShown = scene.shown - 1;
        return (
          <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={14} fontSize={11} fontWeight={700} fill="#334155">노출(명목금액)</text>
            {[0, 1000, 2000, 3000].map((tick) => (
              <g key={`e${tick}`}>
                <line x1={ex(tick)} x2={ex(tick)} y1={26} y2={122} stroke="#e2e8f0" strokeWidth={1} />
                <text x={ex(tick)} y={134} textAnchor={tick === 0 ? "start" : tick === EXPO_MAX ? "end" : "middle"} fontSize={9} fill="#64748b">{tick.toLocaleString("ko-KR")}</text>
              </g>
            ))}
            {ROWS.map((row, index) => {
              const shown = index < scene.shown;
              const strong = index === lastShown && active < 4;
              const exposure = CASH * row.multiple;
              const y = EXPO_Y[index];
              const ticks = Array.from({ length: exposure / CASH - 1 }, (_, n) => n + 1);
              return (
                <g key={row.key}>
                  <text x={4} y={y + 10} fontSize={10} fontWeight={strong ? 700 : 400} fill={shown ? "#334155" : "#94a3b8"}>{row.label}</text>
                  {shown ? (
                    <g>
                      <rect x={ex(0)} y={y} width={ex(exposure) - ex(0)} height={BAR_H} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
                      {ticks.map((n) => (
                        <line key={n} x1={ex(n * CASH)} x2={ex(n * CASH)} y1={y} y2={y + BAR_H} stroke="#94a3b8" strokeWidth={0.75} />
                      ))}
                      <rect x={ex(0)} y={y} width={ex(CASH) - ex(0)} height={BAR_H} fill="#2563eb" />
                      <text
                        x={exposure > 600 ? ex(exposure) - 2 : ex(exposure) + 4}
                        y={y - 3}
                        textAnchor={exposure > 600 ? "end" : "start"}
                        fontSize={10}
                        fontWeight={700}
                        fill="#334155"
                      >
                        {exposure.toLocaleString("ko-KR")}
                      </text>
                    </g>
                  ) : (
                    <rect x={ex(0)} y={y} width={RX - ex(0)} height={BAR_H} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
                  )}
                </g>
              );
            })}
            {active === 0 && (
              <text x={ex(CASH) + 4} y={EXPO_Y[0] + 26} fontSize={10} fontWeight={700} fill="#1d4ed8">파란 칸 = 현금 100 = 2,500의 4%</text>
            )}

            <text x={4} y={160} fontSize={11} fontWeight={700} fill="#334155">{scene.move === 0 ? "불리한 이동의 손실" : `${scene.move}% 불리한 이동의 손실`}</text>
            <line x1={lx(CASH)} x2={lx(CASH)} y1={166} y2={246} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
            <text x={lx(CASH)} y={258} textAnchor="middle" fontSize={9} fontWeight={700} fill="#1d4ed8">넣은 현금 100</text>
            <text x={LX} y={258} fontSize={9} fill="#64748b">0</text>
            <text x={RX} y={258} textAnchor="end" fontSize={9} fill="#64748b">150</text>
            {ROWS.map((row, index) => {
              const shown = index < scene.shown && scene.move > 0;
              const loss = (CASH * row.multiple * scene.move) / 100;
              const y = LOSS_Y[index];
              const over = loss > CASH;
              return (
                <g key={`l${row.key}`}>
                  <text x={4} y={y + 10} fontSize={10} fill={shown ? "#334155" : "#94a3b8"}>{row.label}</text>
                  <rect x={lx(0)} y={y} width={RX - lx(0)} height={BAR_H} fill="none" stroke="#e2e8f0" strokeWidth={1} />
                  {shown && (
                    <g>
                      <rect x={lx(0)} y={y} width={Math.max(lx(loss) - lx(0), 1.5)} height={BAR_H} fill={over ? "#dc2626" : "#f87171"} />
                      <text
                        x={over ? lx(loss) - 4 : lx(loss) + 4}
                        y={y + 10}
                        textAnchor={over ? "end" : "start"}
                        fontSize={10}
                        fontWeight={700}
                        fill={over ? "#ffffff" : "#b91c1c"}
                      >
                        {over ? `${loss} (100 초과)` : loss}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
