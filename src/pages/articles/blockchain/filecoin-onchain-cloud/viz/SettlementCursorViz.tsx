import SceneShell from "./SceneShell";

/**
 * 본문 대응: #proof-settlement — P(a,b] = Σ r_e·v_e. proven period는 rate만큼 기여, faulted는 0원으로 cursor만 전진,
 * open period 앞에서 정산이 멈춘다. settledUpTo=120이면 다음 후보는 121 (본문 Payment rail 표의 예).
 * rate 2 × proven 10 epochs = 20도 본문 예. period 길이 10 epoch와 네 period의 판정 순서는 설명용 가정.
 */
const RATE = 2;
const START = 120;
const LEN = 10;

type Verdict = "proven" | "faulted" | "open";
const PERIODS: readonly Verdict[] = ["proven", "faulted", "proven", "open"];

const COLOR: Record<Verdict, string> = { proven: "#16a34a", faulted: "#dc2626", open: "#94a3b8" };
const NAME: Record<Verdict, string> = { proven: "proven", faulted: "faulted", open: "open" };

const SCENES = [
  { label: "출발점", summary: `settledUpTo ${START} · 누적 0`, done: 0, note: "settledUpTo가 120이면 120까지는 이미 정산이 끝났습니다. 다음 지급 후보는 121이고, 120을 다시 계산하지 않습니다." },
  { label: "121–130 proven", summary: `+${RATE} × ${LEN} = +${RATE * LEN} · cursor 130`, done: 1, note: "이 period는 proof를 통과했으므로 epoch 10개가 rate 2씩 기여해 20이 쌓이고 cursor가 130으로 갑니다." },
  { label: "131–140 faulted", summary: "+0 · cursor 140", done: 2, note: "deadline까지 유효한 proof가 없어 실패가 확정된 period입니다. 지급 기여는 0이지만 판정은 끝났으므로 cursor는 140으로 전진합니다." },
  { label: "141–150 proven", summary: `+${RATE * LEN} · 누적 ${2 * RATE * LEN} · cursor 150`, done: 3, note: "다시 proven이라 20이 더해집니다. faulted period를 건너뛴 것이 아니라 0원으로 지나왔기 때문에 순서가 이어집니다." },
  { label: "151–160 open", summary: `멈춤 · 121–150 정산액 ${2 * RATE * LEN}`, done: 3, note: "deadline이 아직 지나지 않은 period는 실패가 아니므로 0으로 처리하지 않고, 정산 끝점을 그 앞 150에 둡니다. 정산은 121부터 150까지를 한 번에 더하며, 장면은 그 합을 period별로 나눠 보인 것입니다." },
] as const;

const W = 360;
const H = 150;
const LEFT = 14;
const PW = (W - 2 * LEFT) / PERIODS.length;
const BAR_Y = 52;
const BAR_H = 28;
const xEpoch = (epoch: number) => LEFT + ((epoch - START) / LEN) * PW;

export default function SettlementCursorViz() {
  return (
    <SceneShell
      eyebrow="settledUpTo cursor"
      title="proven은 금액을 더하고, faulted는 0원으로 지나가고, open 앞에서 멈춥니다"
      description="칸 하나가 proving period 하나입니다. settledUpTo는 어느 epoch까지 정산을 끝냈는지 가리키는 cursor이고, rate는 proven epoch 하나당 쌓이는 지급액입니다. rate 2와 settledUpTo 120은 본문 예이고, period 길이 10 epoch와 네 period의 판정 순서는 설명용 가정입니다."
      ariaLabel="proof 판정이 섞인 period를 따라 settledUpTo cursor와 누적 정산액이 움직이는 모습"
      scenes={SCENES}
      render={(active) => {
        const done = SCENES[active].done;
        const cursor = START + done * LEN;
        const total = PERIODS.slice(0, done).reduce<number>((sum, v) => sum + (v === "proven" ? RATE * LEN : 0), 0);
        const stopped = active === SCENES.length - 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {PERIODS.map((verdict, i) => {
              const settled = i < done;
              const focus = i === done - 1 || (stopped && verdict === "open");
              const x = LEFT + i * PW;
              return (
                <g key={i}>
                  <rect
                    x={x + 1}
                    y={BAR_Y}
                    width={PW - 2}
                    height={BAR_H}
                    rx={4}
                    fill={settled || (stopped && verdict === "open") ? COLOR[verdict] : "#ffffff"}
                    fillOpacity={settled ? 0.22 : stopped && verdict === "open" ? 0.18 : 1}
                    stroke={COLOR[verdict]}
                    strokeWidth={focus ? 1.25 : 1}
                    strokeDasharray={verdict === "open" ? "4 3" : undefined}
                  />
                  <text x={x + PW / 2} y={BAR_Y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLOR[verdict] === "#94a3b8" ? "#475569" : COLOR[verdict]}>
                    {NAME[verdict]}
                  </text>
                  <text x={x + PW / 2} y={BAR_Y - 8} textAnchor="middle" fontSize={11} fill="#64748b">
                    {START + i * LEN + 1}–{START + (i + 1) * LEN}
                  </text>
                  {settled && (
                    <text x={x + PW / 2} y={BAR_Y + BAR_H + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={verdict === "proven" ? "#16a34a" : "#dc2626"}>
                      {verdict === "proven" ? `+${RATE * LEN}` : "+0"}
                    </text>
                  )}
                </g>
              );
            })}
            <line x1={xEpoch(cursor)} x2={xEpoch(cursor)} y1={BAR_Y - 4} y2={BAR_Y + BAR_H + 30} stroke="#0f172a" strokeWidth={1.25} />
            <path d={`M ${xEpoch(cursor)} ${BAR_Y + BAR_H + 30} l -4 7 h 8 z`} fill="#0f172a" />
            <text
              x={xEpoch(cursor)}
              y={BAR_Y + BAR_H + 50}
              textAnchor={cursor === START ? "start" : cursor >= START + 3 * LEN ? "end" : "middle"}
              fontSize={12}
              fontWeight={700}
              fill="#0f172a"
            >
              settledUpTo {cursor}
            </text>
            <text x={W - LEFT} y={20} textAnchor="end" fontSize={12} fontWeight={700} fill="#0f172a">
              누적 정산액 {total}
            </text>
            {stopped && (
              <text x={LEFT} y={20} fontSize={11} fontWeight={700} fill="#475569">
                150에서 정지
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
