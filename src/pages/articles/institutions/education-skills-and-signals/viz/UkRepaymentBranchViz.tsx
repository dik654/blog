import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 영국 해당 학자금 상환은 소득 기준과 연결되므로 200만 원만으로는 상환액을 못 구합니다.
 * "?"는 글이 값을 주지 않은 칸입니다. 어떤 금액도 임의로 넣지 않았습니다.
 */
const SCENES = [
  { label: "아는 값은 200만 원뿐", summary: "상환액 계산 불가", path: "none", note: "사례의 연 임금 증가 200만 원만 알아서는 상환액을 계산할 수 없습니다. 증가 전 총소득, 해당 계획의 기준과 비율을 더 알아야 합니다." },
  { label: "소득이 기준을 넘지 않으면", summary: "아직 상환 시작 전", path: "below", note: "영국 정부 안내는 소득이 최소 금액을 넘을 때 상환을 시작한다고 적습니다. 같은 200만 원이 늘어도 증가 전 소득과 계획의 기준에 따라 이쪽일 수 있습니다." },
  { label: "소득이 기준을 넘으면", summary: "계획의 비율까지 필요", path: "above", note: "2026-10-04에 확인한 영국 해당 학자금의 규칙입니다. 다른 나라의 학비 대출이나 일반 대출에 같은 규칙을 적용할 수 없습니다." },
] as const;

const SKY = "#2563eb";
const AMBER = "#b45309";

function Box({ x, y, w, h, lines, on = false, known = false }: { x: number; y: number; w: number; h: number; lines: readonly string[]; on?: boolean; known?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={on || known ? SKY : "none"} fillOpacity={on || known ? 0.12 : 0} stroke={on || known ? SKY : "#94a3b8"} strokeWidth={1} strokeDasharray={known || on ? undefined : "3 3"} />
      {lines.map((line, i) => (
        <text key={line} x={x + w / 2} y={y + h / 2 + 4 + (i - (lines.length - 1) / 2) * 15} textAnchor="middle" fontSize={11} fontWeight={known || on ? 700 : 400} fill={line.includes("?") ? AMBER : "currentColor"}>{line}</text>
      ))}
    </g>
  );
}

function Down({ x, y1, y2, on }: { x: number; y1: number; y2: number; on: boolean }) {
  const color = on ? SKY : "#94a3b8";
  return (
    <g stroke={color} strokeWidth={1} fill="none">
      <line x1={x} x2={x} y1={y1} y2={y2} />
      <path d={`M${x - 4} ${y2 - 5}L${x} ${y2}L${x + 4} ${y2 - 5}`} />
    </g>
  );
}

export default function UkRepaymentBranchViz() {
  return (
    <SceneShell
      eyebrow="소득 연계 상환"
      title="늘어난 소득 200만 원만으로는 어느 길인지 정해지지 않습니다"
      description="소득 연계 상환은 대출 잔액만이 아니라 소득이 기준을 넘는지에 따라 현금 지급이 달라지는 방식입니다. 물음표는 글이 값을 주지 않은 칸입니다."
      ariaLabel="증가 전 총소득과 계획의 기준에 따라 상환 여부가 갈리는 분기"
      scenes={SCENES}
      render={(index) => {
        const { path } = SCENES[index];
        const below = path === "below";
        const above = path === "above";
        return (
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <Box x={2} y={4} w={118} h={44} lines={["증가 전 총소득", "?"]} />
            <text x={130} y={31} textAnchor="middle" fontSize={14} fontWeight={700} fill="#64748b">+</text>
            <Box x={140} y={4} w={80} h={44} lines={["연 임금 증가", "200만 원"]} known />
            <text x={230} y={31} textAnchor="middle" fontSize={14} fontWeight={700} fill="#64748b">=</text>
            <Box x={240} y={4} w={118} h={44} lines={["총소득", "?"]} />
            <path d="M299 48V60H180" stroke="#94a3b8" strokeWidth={1} fill="none" />
            <Down x={180} y1={60} y2={74} on={false} />
            <Box x={70} y={74} w={220} h={44} lines={["해당 계획의 소득 기준 ?", "총소득이 이 기준을 넘는지 봅니다"]} />
            <path d={`M130 118V130H90`} stroke={below ? SKY : "#94a3b8"} strokeWidth={1} fill="none" />
            <Down x={90} y1={130} y2={150} on={below} />
            <path d={`M230 118V130H270`} stroke={above ? SKY : "#94a3b8"} strokeWidth={1} fill="none" />
            <Down x={270} y1={130} y2={150} on={above} />
            <text x={108} y={144} fontSize={11} fontWeight={700} fill={below ? SKY : "#64748b"}>아니오</text>
            <text x={250} y={144} textAnchor="end" fontSize={11} fontWeight={700} fill={above ? SKY : "#64748b"}>예</text>
            <Box x={2} y={150} w={172} h={44} lines={["아직 상환을", "시작하지 않음"]} on={below} />
            <Box x={186} y={150} w={172} h={44} lines={["상환 시작", "해당 계획의 비율 ?"]} on={above} />
            <text x={180} y={218} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">
              {below ? "소득이 기준을 넘을 때 상환이 시작됩니다" : above ? "비율까지 알아야 상환액을 구합니다" : "지금은 어느 길인지 정할 수 없습니다"}
            </text>
          </svg>
        );
      }}
    />
  );
}
