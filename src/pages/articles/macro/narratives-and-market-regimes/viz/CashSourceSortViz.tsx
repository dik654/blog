import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 첫해 실제 현금 105와 증자로 들어온 200. 105+200=305는 합쳐 볼 때의 착시를 보이는 산술입니다.
 * 105가 판매에서 남았는지 자산 매각인지는 글이 정하지 않으므로 둘째 장면에서 칸을 정하지 않습니다.
 */
const SCENES = [
  { label: "한 덩어리로 보면", summary: "105 + 200 = 305 > 150", note: "늘어난 현금만 보면 매년 150이라는 가설을 넘어선 듯 보입니다. 305는 두 가정값을 더해 착시를 보이려는 숫자입니다(가정)." },
  { label: "활동별로 나누면", summary: "200은 조달 · 105는 확인 대상", note: "새 투자자에게 받은 200은 조달 칸입니다. 105는 제품 판매에서 남았는지 자산을 팔았는지 확인해야 하며, 어느 쪽이냐에 따라 미래의 반복 가능성이 다릅니다." },
  { label: "105가 판매에서 남았다면", summary: "비교 대상은 105 < 150", note: "이 경우에도 가설과 견줄 값은 105이고 200을 더하지 않습니다. 또한 105는 영업현금흐름 표를 그대로 옮긴 값이 아닐 수 있어 유지 투자·이자·세금·부채 상환과 새 차입의 처리 범위를 함께 적습니다." },
] as const;

const BASE_Y = 152;
const PX = 0.42;
const BAR_W = 76;
const COLUMNS = [
  { key: "영업", x: 24 },
  { key: "투자", x: 142 },
  { key: "조달", x: 260 },
] as const;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const LINE_Y = BASE_Y - 150 * PX;

function Block({ x, bottom, value, color, label, dashed = false }: { x: number; bottom: number; value: number; color: string; label: string; dashed?: boolean }) {
  const height = value * PX;
  return (
    <g>
      <rect x={x} y={bottom - height} width={BAR_W} height={height} fill={dashed ? "none" : color} opacity={dashed ? 1 : 0.8} stroke={dashed ? color : "none"} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + BAR_W / 2} y={bottom - height / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={dashed ? color : "#ffffff"}>{label}</text>
    </g>
  );
}

export default function CashSourceSortViz() {
  return (
    <SceneShell
      eyebrow="현금의 출처"
      title="늘어난 현금을 활동별로 나누면 150 가설의 근거가 달라집니다"
      description="막대 높이는 같은 축척의 금액이고, 점선은 매년 150이라는 전망입니다. 105와 200은 이 글의 가정값입니다."
      ariaLabel="첫해 현금 105와 증자 200을 영업, 투자, 조달 칸으로 나누는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 178" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={10} x2={350} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
          <line x1={10} x2={350} y1={LINE_Y} y2={LINE_Y} stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
          <text x={10} y={LINE_Y - 5} fontSize={11} fontWeight={700} fill={AMBER}>전망 150</text>
          {active === 0 ? (
            <>
              <Block x={142} bottom={BASE_Y} value={200} color={GRAY} label="200" />
              <Block x={142} bottom={BASE_Y - 200 * PX} value={105} color={GRAY} label="105" />
              <text x={180} y={BASE_Y + 16} textAnchor="middle" fontSize={12} fill={GRAY}>구분 없는 현금 305</text>
            </>
          ) : (
            <>
              {COLUMNS.map((column) => (
                <text key={column.key} x={column.x + BAR_W / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>{column.key}</text>
              ))}
              <Block x={260} bottom={BASE_Y} value={200} color={GRAY} label="200" />
              {active === 1 ? (
                <Block x={83} bottom={BASE_Y} value={105} color={BLUE} label="105 어느 칸?" dashed />
              ) : (
                <Block x={24} bottom={BASE_Y} value={105} color={BLUE} label="105" />
              )}
            </>
          )}
        </svg>
      )}
    />
  );
}
