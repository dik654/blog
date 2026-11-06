import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 물건은 앞으로 가고, 대금은 동시에 움직이지 않을 수 있으며,
 * 반품 허용 여부에 따라 안 팔린 물건의 손실을 떠안을 사람이 바뀝니다. 간격과 위치에 수치 뜻은 없습니다.
 */
const NODES = ["농가", "중간 사업자", "가게", "손님"] as const;
const NODE_W = 72;
const GAP = (330 - NODES.length * NODE_W) / (NODES.length - 1);
const nx = (index: number) => 15 + index * (NODE_W + GAP);
const cx = (index: number) => nx(index) + NODE_W / 2;

const SCENES = [
  { label: "물건은 앞으로 갑니다", summary: "농가 → 중간 사업자 → 가게 → 손님", note: "농가가 내놓은 원물을 중간 사업자가 모아 보관하고 가공해 옮기고, 가게가 손님이 살 때까지 진열합니다." },
  { label: "돈은 늦게 올 수 있습니다", summary: "납품 먼저, 대금 나중", note: "대금은 물건과 동시에 움직이지 않을 수 있습니다. 먼저 납품하고 나중에 돈을 받으면 그 사이의 임금과 보관비를 누군가 먼저 냅니다." },
  { label: "안 팔린 물건, 반품이 안 되면", summary: "손실이 가게에 남을 수 있음", note: "반품이 허용되지 않는 계약이라면 안 팔린 물건의 손실은 가게 쪽에 남을 수 있습니다." },
  { label: "안 팔린 물건, 반품이 되면", summary: "손실이 이전 단계로 갈 수 있음", note: "반품이 허용되면 안 팔린 물건이 이전 단계로 되돌아가 손실을 떠안을 사람도 바뀝니다. 어디까지 넘어가는지는 계약마다 다를 수 있습니다." },
] as const;

/** 아래에서 위 상자로 올라가는 U자 반품 경로입니다. */
function ReturnPath({ from, to }: { from: number; to: number }) {
  return (
    <g>
      <path d={`M${from} 41V70H${to}V49`} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
      <path d={`M${to} 43l-4 7h8z`} fill="#dc2626" />
    </g>
  );
}

function Arrow({ x1, x2, y, color, dashed = false }: { x1: number; x2: number; y: number; color: string; dashed?: boolean }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} x2={x2 - dir * 5} y1={y} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${x2} ${y}l${-dir * 7} -4v8z`} fill={color} />
    </g>
  );
}

export default function GoodsMoneyFlowViz() {
  return (
    <SceneShell
      eyebrow="세 가지 길"
      title="물건과 돈과 반품 책임은 따로 움직일 수 있습니다"
      description="상자는 거래 단계이고 화살표는 움직이는 방향입니다. 거리와 위치에 수치 뜻은 없습니다."
      ariaLabel="농가에서 손님까지 물건의 이동, 늦게 오는 대금, 반품 여부에 따른 손실 위치"
      scenes={SCENES}
      render={(scene) => (
        <svg viewBox="0 0 360 136" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
          {NODES.map((name, index) => (
            <g key={name}>
              <rect x={nx(index) + 0.5} y={8.5} width={NODE_W - 1} height={33} rx={6} fill="none" stroke="#64748b" strokeWidth={1} />
              <text x={cx(index)} y={30} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">{name}</text>
            </g>
          ))}
          {[0, 1, 2].map((index) => (
            <Arrow key={index} x1={nx(index) + NODE_W + 2} x2={nx(index + 1) - 2} y={25} color={scene === 0 ? "#2563eb" : "#94a3b8"} />
          ))}
          {scene === 0 && <text x={180} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">물건의 방향 →</text>}
          {scene === 1 && (
            <>
              {[0, 1, 2].map((index) => (
                <Arrow key={index} x1={cx(index + 1)} x2={cx(index)} y={52} color="#16a34a" />
              ))}
              <text x={345} y={70} textAnchor="end" fontSize={13} fontWeight={700} fill="#16a34a">← 대금의 방향</text>
              <text x={15} y={70} fontSize={13} fontWeight={700} fill="#64748b">한 거래 안의 시간 →</text>
              <circle cx={60} cy={100} r={4} fill="#2563eb" />
              <circle cx={300} cy={100} r={4} fill="#16a34a" />
              <line x1={66} x2={294} y1={100} y2={100} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
              <text x={60} y={122} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">납품</text>
              <text x={300} y={122} textAnchor="middle" fontSize={13} fontWeight={700} fill="#16a34a">대금</text>
              <text x={180} y={92} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">임금·보관비를 누군가 먼저 냄</text>
            </>
          )}
          {scene === 2 && (
            <>
              <rect x={nx(2) + 0.5} y={62.5} width={NODE_W - 1} height={38} rx={6} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
              <text x={cx(2)} y={86} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">안 팔린 물건</text>
              <line x1={cx(2)} x2={cx(2)} y1={41} y2={62} stroke="#dc2626" strokeWidth={1} />
              <text x={cx(2)} y={124} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">손실이 가게에 남을 수 있음</text>
            </>
          )}
          {scene === 3 && (
            <>
              <ReturnPath from={cx(2)} to={cx(1) + 8} />
              <ReturnPath from={cx(1) - 8} to={cx(0)} />
              <text x={(cx(0) + cx(2)) / 2} y={92} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">반품: 이전 단계로 되돌아갈 수 있음</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
