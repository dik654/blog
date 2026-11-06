import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 연결된 집의 요금 할인은 많이 쓰는 집에 더 큰 금액으로 닿고
 * 연결되지 않은 집에는 닿지 않는다. 연결비 지원은 다른 문제를 푼다. 금액 수치가 없어 크기를 눈금으로 그리지 않는다.
 */
const BLUE = "#2563eb";
const GREEN = "#15803d";
const SLATE = "#64748b";
const RED = "#dc2626";

const SCENES = [
  { label: "세 집의 위치", summary: "둘은 연결, 하나는 미연결", note: "두 집은 배관에 연결되어 있고 한 집은 연결되어 있지 않습니다. 세 집의 배치는 설명을 위한 가정입니다." },
  { label: "매달 요금을 낮추면", summary: "연결된 집에만 도착", note: "이미 연결된 집의 요금을 낮추면 물을 많이 쓰는 집이 더 큰 금액을 지원받을 수 있습니다. 연결되지 않은 집에는 도착하지 않고, 여전히 다른 판매자에게 더 비싸게 살 수 있습니다." },
  { label: "연결비를 지원하면", summary: "연결이라는 다른 문제", note: "연결비 지원은 관이 없는 집의 문제를 겨냥합니다. 매달 요금 지원과 서로 다른 문제를 풀므로 하나가 다른 하나를 대신하지 않습니다." },
] as const satisfies readonly { label: string; summary: string; note: string }[];

function House({ x, title, sub, fill }: { x: number; title: string; sub: string; fill: string }) {
  return (
    <g>
      <path d={`M${x - 34} 96L${x} 70L${x + 34} 96V130H${x - 34}Z`} fill="none" stroke={fill} strokeWidth={1.25} />
      <text x={x} y={108} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{title}</text>
      <text x={x} y={123} textAnchor="middle" fontSize={11} fill={SLATE}>{sub}</text>
    </g>
  );
}

export default function TariffReachViz() {
  return (
    <SceneShell
      eyebrow="할인이 도착하는 곳"
      title="낮은 요금은 관이 닿은 집에만 도착합니다"
      description="가로선이 배관이고, 세로선이 집과의 연결입니다. 배치와 표시는 모양만 보이는 가정입니다."
      ariaLabel="요금 할인과 연결비 지원이 세 집에 닿는 범위"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          <text x={10} y={18} fontSize={11} fontWeight={700} fill={BLUE}>배관</text>
          <line x1={10} x2={212} y1={28} y2={28} stroke={BLUE} strokeWidth={1.25} />
          <line x1={60} x2={60} y1={28} y2={70} stroke={BLUE} strokeWidth={1.25} />
          <line x1={166} x2={166} y1={28} y2={70} stroke={BLUE} strokeWidth={1.25} />
          {index === 2 ? (
            <>
              <path d="M212 28H298V70" fill="none" stroke={GREEN} strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={292} y={52} textAnchor="end" fontSize={11} fontWeight={700} fill={GREEN}>연결비 지원</text>
            </>
          ) : (
            <text x={298} y={52} textAnchor="middle" fontSize={11} fill={SLATE}>관 없음</text>
          )}
          <House x={60} title="연결된 집" sub="많이 씀" fill={BLUE} />
          <House x={166} title="연결된 집" sub="적게 씀" fill={BLUE} />
          <House x={298} title="미연결 집" sub={index === 2 ? "연결 후보" : "연결 없음"} fill={index === 2 ? GREEN : RED} />
          {index === 1 && (
            <>
              <text x={60} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill={GREEN}>더 큰 금액 가능</text>
              <text x={166} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill={GREEN}>그보다 작을 수 있음</text>
              <text x={298} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>할인 도착 안 함</text>
              <path d="M298 182V160" stroke={SLATE} strokeWidth={1} fill="none" />
              <text x={352} y={196} textAnchor="end" fontSize={11} fill={SLATE}>다른 판매자: 더 비쌀 수 있음</text>
            </>
          )}
          {index === 2 && <text x={180} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={GREEN}>연결비 지원과 매달 요금 지원은 다른 문제를 풉니다</text>}
        </svg>
      )}
    />
  );
}
