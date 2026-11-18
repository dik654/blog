import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — A 기준 현재가치 +5·+4·−2·−5(백만 달러).
 * 받을 9, 줄 7, 총액 16, 상계 뒤 +2, 현금담보 1.5 뒤 0.5.
 * 상계가 집행되지 않으면 7은 먼저 내고 9는 파산절차에서 기다릴 수 있다(회수액은 본문에 없어 칸만 점선).
 */
const W = 360;
const H = 196;
const MID = 196;
const UNIT = 15;
const LABEL_X = 8;
const ROW_H = 40;
const TOP = 22;
const BAR_H = 20;

type Kind = "receive" | "pay" | "net" | "collateral" | "pending";

interface Seg {
  from: number;
  to: number;
  kind: Kind;
}

interface Row {
  label: string;
  segs: readonly Seg[];
  value: string;
}

const COLORS: Readonly<Record<Kind, { fill: string; stroke: string; dash?: string; opacity: number }>> = {
  receive: { fill: "#16a34a", stroke: "#16a34a", opacity: 0.75 },
  pay: { fill: "#dc2626", stroke: "#dc2626", opacity: 0.75 },
  net: { fill: "#2563eb", stroke: "#2563eb", opacity: 0.85 },
  collateral: { fill: "none", stroke: "#2563eb", dash: "3 2", opacity: 1 },
  pending: { fill: "none", stroke: "#16a34a", dash: "4 3", opacity: 1 },
};

const SCENES = [
  {
    label: "네 거래를 따로 보면",
    summary: "5 + 4 + 2 + 5 = 총액 16",
    note: "A 기준으로 오른쪽은 받을 가치, 왼쪽은 줄 가치입니다. 크기만 더하면 16이 장부에 걸려 있는 셈입니다.",
    rows: [
      { label: "거래 +5", segs: [{ from: 0, to: 5, kind: "receive" }], value: "+5" },
      { label: "거래 +4", segs: [{ from: 0, to: 4, kind: "receive" }], value: "+4" },
      { label: "거래 −2", segs: [{ from: -2, to: 0, kind: "pay" }], value: "−2" },
      { label: "거래 −5", segs: [{ from: -5, to: 0, kind: "pay" }], value: "−5" },
    ],
  },
  {
    label: "방향별로 모으면",
    summary: "받을 9 · 줄 7",
    note: "+5와 +4를 모으면 A가 받을 금액 9, −2와 −5를 모으면 줄 금액 7입니다. 아직 서로 상쇄하지 않았습니다.",
    rows: [
      { label: "받을 금액", segs: [{ from: 0, to: 5, kind: "receive" }, { from: 5, to: 9, kind: "receive" }], value: "+9" },
      { label: "줄 금액", segs: [{ from: -2, to: 0, kind: "pay" }, { from: -7, to: -2, kind: "pay" }], value: "−7" },
    ],
  },
  {
    label: "일괄상계로 한 금액",
    summary: "9 − 7 = +2",
    note: "네 거래가 모두 같은 유효한 일괄계약 아래 있고 상계가 집행된다면, 종료 때 A가 받을 한 금액 +2로 줄어듭니다.",
    rows: [
      { label: "받을 금액", segs: [{ from: 0, to: 9, kind: "receive" }], value: "+9" },
      { label: "줄 금액", segs: [{ from: -7, to: 0, kind: "pay" }], value: "−7" },
      { label: "순액", segs: [{ from: 0, to: 2, kind: "net" }], value: "+2" },
    ],
  },
  {
    label: "담보 1.5를 빼면",
    summary: "2 − 1.5 = 0.5",
    note: "B가 이미 낸 현금담보 1.5를 바로 쓸 수 있다면 단순 잔여노출은 0.5입니다. 담보 가치가 떨어지거나 종료까지 며칠 걸리면 손실이 0.5보다 커질 수 있습니다.",
    rows: [
      { label: "순액", segs: [{ from: 0, to: 2, kind: "net" }], value: "+2" },
      { label: "담보로 덮임", segs: [{ from: 0, to: 1.5, kind: "collateral" }], value: "1.5" },
      { label: "남은 노출", segs: [{ from: 1.5, to: 2, kind: "net" }], value: "0.5" },
    ],
  },
  {
    label: "상계가 집행되지 않으면",
    summary: "7은 먼저 내고 9는 기다림",
    note: "상계가 집행되지 않으면 A는 B에게 줄 7을 먼저 내면서, 받을 9는 파산절차에서 기다릴 수 있습니다. 9 가운데 얼마를 돌려받을지는 본문에 없어 점선 칸으로만 둡니다.",
    rows: [
      { label: "먼저 지급", segs: [{ from: -7, to: 0, kind: "pay" }], value: "−7" },
      { label: "파산절차 대기", segs: [{ from: 0, to: 9, kind: "pending" }], value: "9?" },
    ],
  },
] as const satisfies readonly { label: string; summary: string; note: string; rows: readonly Row[] }[];

const x = (value: number) => MID + value * UNIT;

export default function NettingCollateralViz() {
  return (
    <SceneShell
      eyebrow="상계와 담보"
      title="받을 9와 줄 7이 한 금액 2가 되고, 담보 뒤 0.5가 남습니다"
      description="A 기준이며 단위는 백만 달러입니다(본문 3절). 가운데 세로선이 0이고, 오른쪽 초록은 A가 받을 가치, 왼쪽 빨강은 줄 가치, 파랑은 상계한 순액입니다. 일괄상계는 같은 계약 아래 거래를 종료 때 하나의 지급액으로 줄이는 장치입니다."
      ariaLabel="네 거래의 현재가치가 받을 9와 줄 7로 모이고, 상계 뒤 2, 담보 1.5 뒤 0.5가 되며, 상계가 안 되면 7을 먼저 내는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rows: readonly Row[] = scene.rows;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={x(-3.5)} y={12} textAnchor="middle" fontSize={12} fill="#b91c1c">← 줄 가치</text>
            <text x={x(4.5)} y={12} textAnchor="middle" fontSize={12} fill="#15803d">받을 가치 →</text>
            <line x1={MID} x2={MID} y1={TOP - 4} y2={H - 4} stroke="#94a3b8" strokeWidth={1} />
            {rows.map((row, index) => {
              const y = TOP + index * ROW_H + (ROW_H - BAR_H) / 2;
              const right = Math.max(...row.segs.map((seg) => seg.to));
              const left = Math.min(...row.segs.map((seg) => seg.from));
              const valueX = right > 0 ? x(right) + 4 : x(left) - 4;
              return (
                <g key={`${active}-${row.label}`}>
                  <text x={LABEL_X} y={y + BAR_H / 2 + 4} fontSize={13} fontWeight={600} fill="#64748b">{row.label}</text>
                  {row.segs.map((seg, segIndex) => {
                    const color = COLORS[seg.kind];
                    return (
                      <rect
                        key={segIndex}
                        x={x(seg.from) + 0.5}
                        y={y + 0.5}
                        width={(seg.to - seg.from) * UNIT - 1}
                        height={BAR_H - 1}
                        rx={2}
                        fill={color.fill}
                        fillOpacity={color.opacity}
                        stroke={color.stroke}
                        strokeWidth={1}
                        strokeDasharray={color.dash}
                      />
                    );
                  })}
                  <text x={valueX} y={y + BAR_H / 2 + 4} textAnchor={right > 0 ? "start" : "end"} fontSize={13} fontWeight={700} fill="#64748b">{row.value}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
