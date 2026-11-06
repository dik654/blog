import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 8000만 달러 연장 → 2000만 달러 × 1200원 = 240억, 현금 200억 → 부족 40억.
 * 칸 하나 = 1000만 달러. 막대 1억 원당 1.2px.
 */
const CELLS = Array.from({ length: 10 }, (_, i) => i);
const ROLLED = 8;
const SX = 1.2;

const SCENES = [
  { label: "연장되지 않는 몫", summary: "1억 − 8000만 = 2000만 달러", note: "차환은 만기가 된 빚을 새 빚으로 바꾸는 것입니다. 은행이 8000만 달러만 연장하겠다고 하면 나머지 두 칸은 회사가 구해야 합니다." },
  { label: "환율을 곱합니다", summary: "2000만 달러 × 1200원 = 240억", note: "회사는 원화로 벌기 때문에 이 달러를 원화로 사야 합니다. 여기에 연 이자 72억 원의 지급 일정도 맞춰야 하지만 아래 막대에는 넣지 않았습니다." },
  { label: "현금과 맞댑니다", summary: "240억 − 200억 = 40억 부족", note: "사용 가능한 현금이 200억 원이면 원금 차환 공백만으로 40억 원이 모자랍니다. 이자 72억 원을 빼기 전의 숫자입니다." },
  { label: "회사 밖으로 번질 수 있는 길", summary: "가능한 경로 · 단정 아님", note: "설비투자를 미루거나 자산을 팔 수 있고, 여러 회사가 동시에 움직이면 관련 산업의 수요와 자산가격이 변할 수 있습니다. 모든 금리 인상의 실제 결과를 단정한 것은 아닙니다." },
  { label: "같은 날 달러가 들어온다면", summary: "달러 수입 2000만 = 원금 공백", note: "확실한 달러 수입 2000만 달러가 같은 날 들어온다면 두 칸을 메울 수 있습니다. 빚의 합계가 같아도 순위험이 다른 까닭이며, 국가 전체의 외화 부채 합계만으로 이를 알 수 없습니다." },
] as const;

function Chain({ x, title, sub }: { x: number; title: string; sub: string }) {
  return (
    <g>
      <rect x={x} y={84} width={102} height={70} rx={6} fill="#2563eb" fillOpacity={0.08} stroke="#2563eb" strokeWidth={1} />
      <text x={x + 51} y={112} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">{title}</text>
      <text x={x + 51} y={131} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">{sub}</text>
    </g>
  );
}

export default function RolloverGapViz() {
  return (
    <SceneShell
      eyebrow="차환 공백"
      title="1억 달러 빚의 일부가 연장되지 않으면 얼마가 모자랄까요"
      description="칸 하나가 1000만 달러입니다. 연장액·환율 1200원·현금 200억 원은 모두 이 글의 가정입니다."
      ariaLabel="1억 달러 중 2000만 달러가 연장되지 않아 240억 원이 필요하고 현금 200억 원으로 40억 원이 부족한 계산"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={8} y={12} fontSize={10.5} fontWeight={700} fill="#2563eb">연장 8000만 달러</text>
          <text x={352} y={12} textAnchor="end" fontSize={10.5} fontWeight={700} fill={active === 4 ? "#15803d" : "#b45309"}>{active === 4 ? "달러 수입 2000만" : "구할 몫 2000만"}</text>
          {CELLS.map((i) => {
            const rolled = i < ROLLED;
            const color = rolled ? "#2563eb" : active === 4 ? "#16a34a" : "#d97706";
            return <rect key={i} x={8 + i * 34.6} y={20} width={32} height={30} rx={3} fill={color} fillOpacity={rolled ? 0.25 : 0.5} stroke={color} strokeWidth={1} strokeDasharray={rolled || active === 4 ? undefined : "3 2"} />;
          })}
          {active === 3 ? (
            <>
              <Chain x={6} title="투자 미룸" sub="또는 자산 매각" />
              <text x={114} y={123} textAnchor="middle" fontSize={11} fill="#64748b">→</text>
              <Chain x={129} title="여러 회사가" sub="동시에 움직이면" />
              <text x={237} y={123} textAnchor="middle" fontSize={11} fill="#64748b">→</text>
              <Chain x={252} title="수요 · 자산가격" sub="변할 수 있음" />
            </>
          ) : active === 4 ? (
            <>
              <text x={180} y={104} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">확실한 달러 수입이면 원금 공백을 메울 수 있음</text>
              <text x={180} y={124} textAnchor="middle" fontSize={10.5} fill="#64748b">연 이자 72억 원의 지급 일정은 따로 맞춰야 함</text>
            </>
          ) : (
            <>
              <g opacity={active >= 1 ? 1 : 0.2} className="transition-opacity duration-300 motion-reduce:transition-none">
                <text x={8} y={78} fontSize={10.5} className="fill-foreground">필요한 원화 240억</text>
                <rect x={8} y={84} width={240 * SX} height={22} rx={2} fill="#d97706" fillOpacity={0.45} stroke="#d97706" strokeWidth={1} />
              </g>
              <g opacity={active >= 2 ? 1 : 0.2} className="transition-opacity duration-300 motion-reduce:transition-none">
                <text x={8} y={124} fontSize={10.5} className="fill-foreground">사용 가능한 현금 200억</text>
                <rect x={8} y={130} width={200 * SX} height={22} rx={2} fill="#64748b" fillOpacity={0.4} stroke="#64748b" strokeWidth={1} />
                <rect x={8 + 200 * SX} y={130} width={40 * SX} height={22} rx={2} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                <text x={8 + 240 * SX + 6} y={145} fontSize={10.5} fontWeight={700} fill="#dc2626">−40억</text>
              </g>
            </>
          )}
        </svg>
      )}
    />
  );
}
