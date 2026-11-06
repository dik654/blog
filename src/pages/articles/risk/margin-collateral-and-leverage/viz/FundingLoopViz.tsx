import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 매도 → 가격 하락 → 다른 투자자의 담보 가치 하락 → 추가 지급 요구 → 다시 매도.
 * 현금 여유가 있으면 강제 매각을 피할 시간이 생긴다. 크기나 속도는 본문에 없어 그리지 않는다.
 */
const NODES = [
  { x: 8, y: 14, lines: ["여러 사람이", "40억 원씩 매도"] },
  { x: 204, y: 14, lines: ["매수자가 충분치 않은", "가격대로 내릴 수 있음"] },
  { x: 204, y: 98, lines: ["아직 안 판 투자자의", "담보 가치 하락"] },
  { x: 8, y: 98, lines: ["추가 지급 요구", "자금 부족"] },
] as const;
const NODE_W = 148;
const NODE_H = 50;

const SCENES = [
  { label: "1. 매도가 몰림", summary: "매물 증가", note: "7절처럼 내부 매각만으로 비율을 맞추려는 사람이 여럿이면 같은 시기에 매물이 쌓일 수 있습니다." },
  { label: "2. 가격이 내려갈 수 있음", summary: "거래 가격 하락", note: "매수자가 충분하지 않으면 가격이 더 내려갈 수 있습니다. 새 가격은 다른 투자자의 장부에도 반영됩니다." },
  { label: "3. 팔지 않은 사람의 담보도 줄어듦", summary: "담보 가치 하락", note: "한도는 자산 가치에 비례하므로, 아직 아무것도 팔지 않은 투자자의 한도선도 함께 내려옵니다." },
  { label: "4. 추가 지급을 요구받음", summary: "자금 부족 → 다시 매도", note: "추가할 돈이 없으면 자산을 팔아 빚부터 줄입니다. 화살표가 1번으로 돌아가면서 자금 부족과 가격 하락이 서로를 키웁니다." },
  { label: "고리에서 벗어날 시간", summary: "오늘 납부할 현금", note: "만기와 통화가 맞는 현금 여유를 확보하면 강제 매각을 피할 시간이 생깁니다. 장부상 이익·집·장기채를 갖고 있다는 사실은 오늘 납부할 현금과 다릅니다." },
] as const;

function Arrow({ x1, y1, x2, y2, on }: { x1: number; y1: number; x2: number; y2: number; on: boolean }) {
  const color = on ? "#2563eb" : "#94a3b8";
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = (offset: number) => `${x2 - 7 * Math.cos(angle + offset)},${y2 - 7 * Math.sin(angle + offset)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={on ? 1.25 : 1} />
      <polygon points={`${x2},${y2} ${head(0.45)} ${head(-0.45)}`} fill={color} />
    </g>
  );
}

export default function FundingLoopViz() {
  return (
    <SceneShell
      eyebrow="서로를 키우는 고리"
      title="여러 사람의 매각이 아직 팔지 않은 사람의 추가 지급 요구로 돌아올 수 있습니다"
      description="칸은 순서만 나타내며 크기와 속도를 뜻하지 않습니다."
      ariaLabel="매도, 가격 하락, 담보 가치 하락, 추가 지급 요구가 이어지는 고리와 현금 여유"
      scenes={SCENES}
      render={(active) => {
        const exit = active === 4;
        return (
          <svg viewBox="0 0 360 222" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Arrow x1={156} y1={39} x2={204} y2={39} on={active === 1} />
            <Arrow x1={278} y1={64} x2={278} y2={98} on={active === 2} />
            <Arrow x1={204} y1={123} x2={156} y2={123} on={active === 3} />
            <Arrow x1={82} y1={98} x2={82} y2={64} on={active === 3} />
            <Arrow x1={82} y1={148} x2={82} y2={172} on={exit} />
            {NODES.map((node, index) => {
              const on = index === active || (active === 3 && index === 0);
              return (
                <g key={node.lines[0]}>
                  <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx={8} fill={on ? "#2563eb" : "none"} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  {node.lines.map((line, lineIndex) => (
                    <text key={line} x={node.x + NODE_W / 2} y={node.y + 21 + lineIndex * 15} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? "#ffffff" : "#64748b"}>{line}</text>
                  ))}
                </g>
              );
            })}
            <rect x={8} y={172} width={344} height={42} rx={8} fill={exit ? "#15803d" : "none"} stroke={exit ? "#15803d" : "#94a3b8"} strokeWidth={1} strokeDasharray={exit ? undefined : "3 3"} />
            <text x={180} y={190} textAnchor="middle" fontSize={11} fontWeight={exit ? 700 : 400} fill={exit ? "#ffffff" : "#64748b"}>만기와 통화가 맞는 현금 여유가 있으면</text>
            <text x={180} y={205} textAnchor="middle" fontSize={11} fontWeight={exit ? 700 : 400} fill={exit ? "#ffffff" : "#64748b"}>강제 매각을 피할 시간이 생김</text>
          </svg>
        );
      }}
    />
  );
}
