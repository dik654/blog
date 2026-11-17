import SceneShell from "./SurveillanceSceneShell";

/**
 * 본문 대응: #manipulation-surveillance-case 첫 문단 — spoof/layering 후보는 보이는 주문, 취소,
 * 반대편 체결, 시장영향을 재구성하고, 빠른 취소나 큰 주문 하나는 market making 같은 반례와 구분한다.
 * 주문 크기·체결 수·가격 모양은 모두 가정이며 축에 수치가 없습니다.
 */
const SCENES = [
  { label: "보이는 주문", summary: "매수 쪽 대량 주문 (가정)", note: "spoofing은 체결할 뜻이 없는 주문을 보이게 넣어 다른 참여자의 판단을 흔드는 수법을 말합니다. (가정) 한 계정이 매수 쪽에 큰 주문을 띄웁니다. 가로축은 순서만 나타냅니다." },
  { label: "반대편 체결", summary: "같은 계정의 매도 체결", note: "큰 매수 주문이 보이는 동안 같은 계정의 매도 주문이 체결됩니다. 주문 하나만 보지 않고 반대편에서 실제로 체결된 거래를 같은 시계에 놓습니다." },
  { label: "취소와 시장영향", summary: "취소 · 가격 변화 재구성", note: "(가정) 체결이 끝난 뒤 큰 매수 주문이 취소됩니다. 그 사이의 가격·거래량 변화도 함께 재구성합니다. 가격선은 모양을 보이는 가정이며 크기는 없습니다." },
  { label: "반례: market making", summary: "빠른 취소는 같아 보일 수 있음", note: "market maker는 매수·매도 양쪽에 호가를 내 거래 상대가 되어 주는 참여자이며, 정상 market maker도 호가를 자주 취소할 수 있습니다. 빠른 취소나 큰 주문 하나만으로는 두 경우를 가를 수 없어 analyst가 원 event와 반증을 함께 봅니다. 후보는 법적 결론이 아닙니다." },
] as const;

const W = 360;
const H = 206;
const X0 = 76;
const BUY_Y = 44;
const SELL_Y = 100;
const PRICE_Y = 160;
const PLACE = 100;
const CANCEL = 248;
const FILLS = [138, 166, 194, 222] as const;
const MM_SLOTS = [92, 132, 172, 212, 252, 292] as const;

export default function SpoofReconstructionViz() {
  return (
    <SceneShell
      eyebrow="Order reconstruction"
      title="큰 주문 하나가 아니라 주문·체결·취소·영향을 한 시계에 놓습니다"
      description="세 줄은 같은 종목의 매수 쪽 주문, 매도 쪽 주문·체결, 가격입니다. 크기와 횟수는 모두 가정이며, 마지막 장면만 정상 market making을 같은 틀에 놓습니다."
      ariaLabel="spoofing 후보를 보이는 주문, 반대편 체결, 취소, 가격 변화로 재구성하고 market making 반례와 비교"
      scenes={SCENES}
      render={(active) => {
        const mm = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[["매수 쪽", BUY_Y], ["매도 쪽", SELL_Y], ["가격", PRICE_Y]].map(([name, y]) => (
              <g key={name}>
                <text x={4} y={Number(y) + 4} fontSize={10} fontWeight={700} fill="#334155">{name}</text>
                <line x1={X0} x2={W - 6} y1={Number(y)} y2={Number(y)} stroke="#e2e8f0" strokeWidth={1} />
              </g>
            ))}
            <text x={W - 6} y={H - 4} textAnchor="end" fontSize={9} fill="#94a3b8">순서 → (간격 비례 아님)</text>

            {!mm && (
              <g>
                <rect x={PLACE} y={BUY_Y - 16} width={(active >= 2 ? CANCEL : W - 10) - PLACE} height={32} rx={4} fill="#dbeafe" stroke="#2563eb" strokeWidth={1} />
                <text x={PLACE + 8} y={BUY_Y + 4} fontSize={10} fontWeight={700} fill="#1d4ed8">큰 매수 주문 (보임)</text>
                {active >= 2 && (
                  <>
                    <line x1={CANCEL} x2={CANCEL} y1={BUY_Y - 22} y2={BUY_Y + 22} stroke="#dc2626" strokeWidth={1.25} />
                    <text x={CANCEL + 5} y={BUY_Y - 10} fontSize={10} fontWeight={700} fill="#dc2626">취소</text>
                  </>
                )}
                {FILLS.map((x) => (
                  <g key={x} opacity={active >= 1 ? 1 : 0}>
                    <rect x={x - 9} y={SELL_Y - 8} width={18} height={16} rx={3} fill="#fef3c7" stroke="#d97706" strokeWidth={1} />
                    <text x={x} y={SELL_Y + 4} textAnchor="middle" fontSize={9} fill="#b45309">체결</text>
                  </g>
                ))}
                {active >= 1 && <text x={(FILLS[0] + FILLS[3]) / 2} y={SELL_Y + 24} textAnchor="middle" fontSize={9} fill="#b45309">같은 계정의 매도</text>}
                {active >= 2 && (
                  <>
                    <polyline
                      points={`${X0},${PRICE_Y + 8} ${PLACE},${PRICE_Y + 8} ${CANCEL},${PRICE_Y - 14} ${CANCEL + 40},${PRICE_Y + 6} ${W - 10},${PRICE_Y + 8}`}
                      fill="none"
                      stroke="#475569"
                      strokeWidth={1.25}
                    />
                    <text x={(PLACE + CANCEL) / 2} y={PRICE_Y - 12} textAnchor="middle" fontSize={9} fill="#475569">(가정) 모양만</text>
                  </>
                )}
                {active < 2 && <text x={(X0 + W) / 2} y={PRICE_Y + 4} textAnchor="middle" fontSize={9} fill="#94a3b8">다음 장면에서 재구성</text>}
              </g>
            )}

            {mm && (
              <g>
                {MM_SLOTS.map((x, i) => (
                  <g key={x}>
                    <rect x={x} y={BUY_Y - 8} width={22} height={16} rx={3} fill="#f1f5f9" stroke="#64748b" strokeWidth={1} />
                    <line x1={x + 24} x2={x + 24} y1={BUY_Y - 11} y2={BUY_Y + 11} stroke="#dc2626" strokeWidth={1} />
                    <rect x={x + 6} y={SELL_Y - 8} width={22} height={16} rx={3} fill="#f1f5f9" stroke="#64748b" strokeWidth={1} />
                    {i % 2 === 0 ? (
                      <line x1={x + 30} x2={x + 30} y1={SELL_Y - 11} y2={SELL_Y + 11} stroke="#dc2626" strokeWidth={1} />
                    ) : null}
                  </g>
                ))}
                <text x={X0 + 10} y={BUY_Y - 16} fontSize={9} fill="#475569">(가정) 양쪽 호가 · 잦은 취소 (빨간 선 = 취소)</text>
                <text x={(X0 + W) / 2} y={PRICE_Y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">빠른 취소만 보면 같은 신호 → 원 event·반증 검토</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
