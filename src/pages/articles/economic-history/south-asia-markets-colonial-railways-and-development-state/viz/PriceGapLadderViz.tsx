import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — A 매입 10 + 운송 2 + 세금 1 + 손실 1 = B 도착 14, B 가격 16과의 여지 2.
 * 철도로 운송 2 → 1이면 다른 조건이 같을 때 도착 13, 여지 3. 모두 글의 설명용 가정이다.
 */
const BUY = "#64748b";
const SHIP = "#2563eb";
const TAX = "#7c3aed";
const LOSS = "#d97706";
const ROOM = "#16a34a";

const W = 360;
const LEFT = 12;
const MAX = 17;
const x = (price: number) => LEFT + (price / MAX) * (W - 2 * LEFT);
const B_PRICE = 16;

type Part = { key: string; label: string; value: number; color: string };

const before: readonly Part[] = [
  { key: "buy", label: "매입", value: 10, color: BUY },
  { key: "ship", label: "운송", value: 2, color: SHIP },
  { key: "tax", label: "세금", value: 1, color: TAX },
  { key: "loss", label: "손실", value: 1, color: LOSS },
];
const after: readonly Part[] = [
  { key: "buy", label: "매입", value: 10, color: BUY },
  { key: "ship", label: "운송", value: 1, color: SHIP },
  { key: "tax", label: "세금", value: 1, color: TAX },
  { key: "loss", label: "손실", value: 1, color: LOSS },
];

const SCENES = [
  { label: "두 시장의 가격", summary: "16 − 10 = 6", parts: 1, note: "내륙 A시장의 곡물 가격을 10, 항구 B시장을 16으로 놓습니다(가정). 차이 6이 그대로 상인의 몫이 되는 것은 아닙니다. 옮기는 데 드는 값이 먼저 이 사이를 채웁니다." },
  { label: "운송비 2를 더합니다", summary: "10 + 2 = 12", parts: 2, note: "A에서 산 곡물을 B로 보내는 운송비 2를 더하면 B에 닿을 때 12입니다." },
  { label: "세금 1과 손실 1까지", summary: "도착 14 · 여지 2", parts: 4, note: "세금 1과 보관·운송 중 손실 1을 더하면 도착 비용은 14, B 가격 16과의 단순 매매 여지는 2입니다. 세금 1은 국가 수입이 되고, 여지 2는 경쟁·독점·신용 조건에 따라 달라집니다." },
  { label: "철도로 운송비가 1이 되면", summary: "도착 13 · 여지 3", parts: 4, note: "운송비가 2에서 1로 줄고 다른 조건이 같다면 도착 비용은 13, 여지는 3입니다. 철도 자료의 방향을 설명하는 가정이며 실제 지역·연도별 가격과 운임은 아닙니다." },
] as const;

function Row({ parts, shown, top, title, room, on }: { parts: readonly Part[]; shown: number; top: number; title: string; room: boolean; on: boolean }) {
  const visible = parts.slice(0, shown);
  const ends = visible.map((_, index) => visible.slice(0, index + 1).reduce<number>((sum, part) => sum + part.value, 0));
  const total = ends[ends.length - 1] ?? 0;
  if (!on) {
    return (
      <g>
        <rect x={x(0) + 0.5} y={top + 0.5} width={x(B_PRICE) - LEFT - 1} height={27} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
        <text x={x(0) + 8} y={top + 18} fontSize={11} fill="#64748b">철도 후 · 마지막 장면에서 채웁니다</text>
      </g>
    );
  }
  return (
    <g opacity={on ? 1 : 0.15}>
      {visible.map((part, index) => {
        const start = index === 0 ? 0 : ends[index - 1];
        const labelY = top + 42 + (index % 2 === 1 ? 0 : 14);
        return (
          <g key={part.key}>
            <rect x={x(start)} y={top} width={x(part.value) - LEFT - 1} height={28} rx={2} fill={part.color} opacity={0.85} />
            {index > 0 && (
              <>
                <line x1={x(start + part.value / 2)} x2={x(start + part.value / 2)} y1={top + 28} y2={labelY - 10} stroke={part.color} strokeWidth={1} />
                <text x={x(start + part.value / 2)} y={labelY} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={part.color}>{`${part.label} ${part.value}`}</text>
              </>
            )}
          </g>
        );
      })}
      <text x={x(0) + 8} y={top + 18} fontSize={11} fontWeight={700} fill="#ffffff">{title}</text>
      {room && (
        <>
          <rect x={x(total)} y={top} width={x(B_PRICE - total) - LEFT} height={28} fill="none" stroke={ROOM} strokeWidth={1.25} strokeDasharray="4 3" />
          <text x={(x(total) + x(B_PRICE)) / 2} y={top - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={ROOM}>{`여지 ${B_PRICE - total}`}</text>
        </>
      )}
      {shown > 1 && (
        <text x={x(total)} y={top - 6} textAnchor={room ? "end" : "middle"} dx={room ? -4 : 0} fontSize={11} fontWeight={700} fill="currentColor">{`도착 ${total}`}</text>
      )}
    </g>
  );
}

export default function PriceGapLadderViz() {
  return (
    <SceneShell
      eyebrow="가격 차이 6의 내역"
      title="운송비·세금·손실이 가격 차이를 먼저 채웁니다"
      description="가로축은 곡물 한 단위의 가격이고, 세로 실선이 B시장 가격 16입니다. 숫자는 모두 글의 설명용 가정입니다."
      ariaLabel="A시장 가격 10에 운송비, 세금, 손실을 더한 B 도착 비용과 B시장 가격 16의 차이, 철도로 운송비가 줄 때의 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} 232`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={x(B_PRICE)} x2={x(B_PRICE)} y1={22} y2={214} stroke="#334155" strokeWidth={1.25} />
            <text x={x(B_PRICE)} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">B시장 16</text>

            {active === 0 && (
              <>
                <path d={`M${x(10)},40 L${x(10)},34 L${x(B_PRICE)},34`} fill="none" stroke="#dc2626" strokeWidth={1} />
                <text x={(x(10) + x(B_PRICE)) / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">차이 6</text>
              </>
            )}

            <Row parts={before} shown={scene.parts} top={44} title="철도 전 · A 매입 10" room={active >= 2} on />
            <Row parts={after} shown={4} top={142} title="철도 후 · A 매입 10" room on={active === 3} />

            {[0, 5, 10, 15].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={214} y2={218} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={229} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            <line x1={LEFT} x2={W - LEFT} y1={214} y2={214} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
