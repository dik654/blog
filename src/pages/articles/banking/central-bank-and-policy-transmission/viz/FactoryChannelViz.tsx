import SceneShell from "./SceneShell";

/**
 * 본문 대응: #transmission-lag — 같은 공장에 닿는 경로들.
 * 위아래 순서는 시간 순서가 아니고, 각 경로는 "할 수 있다"는 조건부 연결이다. 숫자는 이자 경로의 10억 원 사례뿐이다.
 */
const SCENES = [
  { label: "대출 이자", summary: "6,000만 → 6,250만 원", note: "잔액 10억 원의 변동금리 대출이 전액 즉시 재조정된다고 가정합니다. 연 6%에서 6.25%로 바뀌면 잔액이 1년 내내 같을 때 이자가 250만 원 늘어 다른 지출 여력이 줄 수 있습니다. 기존 고정금리 계약이라면 같은 날 청구액은 달라지지 않을 수 있습니다." },
  { label: "설비 주문", summary: "같은 예상 매출, 낮아질 수 있는 현재가치", note: "할인율은 미래의 돈을 오늘 값으로 바꿀 때 쓰는 비율입니다. 차입 비용과 할인율이 오르면 같은 예상 매출의 현재가치는 낮아질 수 있습니다." },
  { label: "수주 예상", summary: "고객의 소비·주택 구입", note: "고객도 소비와 주택 구입을 줄이면 공장의 수주 예상이 바뀝니다. 공장이 직접 빌리지 않아도 닿는 경로입니다." },
  { label: "대출 승인", summary: "가격뿐 아니라 승인 금액", note: "공장의 담보 가치가 내려가거나 은행이 위험을 크게 평가하면 대출의 가격뿐 아니라 승인 금액도 달라질 수 있습니다." },
  { label: "환율과 원가", summary: "방향을 단정할 수 없음", note: "국내 인상만 보고 원화가 반드시 강해진다고 결론 내릴 수는 없습니다. 상대국 금리, 위험 선호, 성장 예상, 이미 가격에 반영된 발표인지가 함께 영향을 줍니다. 재고와 계약 때문에 실제 원가에 반영되는 시점도 다를 수 있습니다." },
  { label: "물가 기대", summary: "뉴스에 곧바로 바뀔 수 있음", note: "기대 물가는 뉴스에 곧바로 바뀔 수 있고 실제 생산·가격 조정은 계약과 경제 상황에 따라 늦거나 빨라집니다. 명목 대출금리가 올라도 예상 물가가 더 크게 오르면 물가를 고려한 차입 비용은 낮아질 수 있습니다." },
] as const;

const ROW_H = 30;
const TOP = 8;
const BOX_X = 118;
const BOX_W = 124;
const rowY = (index: number) => TOP + index * ROW_H + ROW_H / 2 - 1;
const MID = rowY(2.5);
const GRAY = "#94a3b8";
const LABEL = "#64748b";
const BLUE = "#2563eb";

export default function FactoryChannelViz() {
  return (
    <SceneShell
      eyebrow="공장까지의 경로"
      title="같은 공장에 닿는 길은 하나가 아닙니다"
      description="위아래 순서는 시간표가 아닙니다. 경로마다 조건이 있고, 크기와 시차가 같다고 보지 않습니다."
      ariaLabel="금리 조건 변화가 공장의 판단에 닿는 여섯 경로"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={4} y={MID - 26} width={84} height={52} rx={6} fill="none" stroke={LABEL} strokeWidth={1} />
          <text x={46} y={MID - 3} textAnchor="middle" fontSize={12} fontWeight={700} fill={LABEL}>금리·기대</text>
          <text x={46} y={MID + 13} textAnchor="middle" fontSize={12} fill={LABEL}>변화</text>
          <rect x={272} y={MID - 26} width={84} height={52} rx={6} fill="none" stroke={LABEL} strokeWidth={1} />
          <text x={314} y={MID - 3} textAnchor="middle" fontSize={12} fontWeight={700} fill={LABEL}>공장의</text>
          <text x={314} y={MID + 13} textAnchor="middle" fontSize={12} fill={LABEL}>지출·가격 판단</text>
          {SCENES.map((scene, index) => {
            const on = index === active;
            const y = rowY(index);
            return (
              <g key={scene.label}>
                <line x1={88} y1={MID} x2={BOX_X} y2={y} stroke={on ? BLUE : GRAY} strokeWidth={on ? 1.25 : 1} />
                <line x1={BOX_X + BOX_W} y1={y} x2={272} y2={MID} stroke={on ? BLUE : GRAY} strokeWidth={on ? 1.25 : 1} />
                <rect x={BOX_X} y={y - 12} width={BOX_W} height={24} rx={4} fill={BLUE} fillOpacity={on ? 0.14 : 0} stroke={on ? BLUE : GRAY} strokeWidth={on ? 1.25 : 1} />
                <text x={BOX_X + BOX_W / 2} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill={on ? BLUE : LABEL}>{scene.label}</text>
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
