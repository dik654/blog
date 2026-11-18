import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 네 저장 방식은 받아 주는 연산의 단위가 다릅니다.
 * 블록: 붙은 실행 자원이 작은 블록을 갱신 / 파일: 여러 실행 자원이 경로로 공유
 * 객체: 키로 객체 전체를 넣고 받음 / 데이터베이스: 질의·인덱스·동시 갱신(거래).
 * 왼쪽 칸 = 요청하는 쪽, 가운데 선 = 오가는 단위, 오른쪽 칸 = 저장소.
 */
const SCENES = [
  {
    label: "블록 저장소",
    summary: "작은 블록 하나를 갱신",
    note: "블록 저장소는 실행 자원 하나에 디스크처럼 붙습니다. 그 위의 파일시스템이나 데이터베이스가 필요한 작은 블록만 골라 덮어씁니다.",
  },
  {
    label: "파일 저장소",
    summary: "여러 실행 자원이 같은 경로를 공유",
    note: "파일 저장소는 경로와 파일 이름으로 찾습니다. 실행 자원 두 대가 같은 경로를 열면 같은 파일을 봅니다.",
  },
  {
    label: "객체 저장소",
    summary: "키로 객체 전체를 넣고 받음",
    note: "객체 저장소는 키 하나로 큰 객체 전체를 넣고 받습니다. 본문의 판단표처럼 전체 파일을 키로 넣고 받고 거의 덮어쓰지 않는 데이터, 곧 상품 사진이 이 입구에 맞습니다.",
  },
  {
    label: "데이터베이스",
    summary: "질의 · 인덱스 · 거래",
    note: "데이터베이스는 자료형, 인덱스, 질의와 동시 갱신 방법을 정합니다. 거래(transaction)는 여러 기록의 변경을 함께 확정하거나 함께 되돌리는 단위이며, 관계형은 이를 강하게 다룹니다. 1절의 재고와 결제 기록이 이 묶음이 필요한 경우입니다.",
  },
] as const;

const ACCENT = "#2563eb";
const LINE = "#64748b";
const TEXT = "#475569";
const MUTED = "#94a3b8";

function Box({ x, y, w, h, title, sub }: { x: number; y: number; w: number; h: number; title: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4)} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={10} fill={LINE}>{sub}</text>}
    </g>
  );
}

function Flow({ x1, y1, x2, y2, label, ly }: { x1: number; y1: number; x2: number; y2: number; label: string; ly: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ACCENT} strokeWidth={1.25} />
      <polygon points={`${x2},${y2} ${x2 - 6},${y2 - 3.5} ${x2 - 6},${y2 + 3.5}`} fill={ACCENT} />
      <text x={(x1 + x2) / 2} y={ly} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>{label}</text>
    </g>
  );
}

function BlockScene() {
  return (
    <g>
      <Box x={8} y={66} w={108} h={60} title="실행 자원" sub="파일시스템·DB" />
      <Flow x1={116} y1={96} x2={206} y2={96} label="블록 하나" ly={88} />
      <rect x={208} y={46} width={144} height={100} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={280} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>디스크</text>
      {Array.from({ length: 8 }, (_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const hit = i === 5;
        return (
          <rect
            key={i}
            x={218 + col * 32}
            y={58 + row * 40}
            width={28}
            height={34}
            rx={3}
            fill={hit ? ACCENT : MUTED}
            fillOpacity={hit ? 0.85 : 0.25}
            stroke={hit ? ACCENT : MUTED}
            strokeWidth={1}
          />
        );
      })}
      <text x={280} y={166} textAnchor="middle" fontSize={10} fill={LINE}>한 실행 자원에 붙음</text>
    </g>
  );
}

function FileScene() {
  return (
    <g>
      <Box x={8} y={30} w={108} h={50} title="실행 자원 A" />
      <Box x={8} y={112} w={108} h={50} title="실행 자원 B" />
      <Flow x1={116} y1={55} x2={206} y2={86} label="같은 경로" ly={62} />
      <Flow x1={116} y1={137} x2={206} y2={106} label="같은 경로" ly={142} />
      <rect x={208} y={56} width={144} height={80} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={280} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>공유 파일 저장소</text>
      <text x={218} y={84} fontSize={10} fill={LINE}>/공유/상품/</text>
      <rect x={226} y={92} width={112} height={24} rx={3} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeWidth={1} />
      <text x={234} y={108} fontSize={10} fontWeight={700} fill={ACCENT}>a.jpg</text>
    </g>
  );
}

function ObjectScene() {
  return (
    <g>
      <Box x={8} y={66} w={108} h={60} title="앱" sub="키를 앎" />
      <Flow x1={116} y1={96} x2={206} y2={96} label="키 → 객체 전체" ly={88} />
      <rect x={208} y={36} width={144} height={120} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={280} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>객체 저장소</text>
      {[0, 1, 2].map((i) => {
        const hit = i === 1;
        return (
          <g key={i}>
            <rect x={218 + i * 44} y={66} width={38} height={60} rx={3} fill={hit ? ACCENT : MUTED} fillOpacity={hit ? 0.85 : 0.25} stroke={hit ? ACCENT : MUTED} strokeWidth={1} />
            <text x={237 + i * 44} y={142} textAnchor="middle" fontSize={9} fill={hit ? ACCENT : LINE}>{`키 ${i + 1}`}</text>
          </g>
        );
      })}
      <text x={280} y={174} textAnchor="middle" fontSize={10} fill={LINE}>일부 칸이 아니라 통째로</text>
    </g>
  );
}

function DatabaseScene() {
  const tables = [
    { name: "주문", hit: false },
    { name: "재고", hit: true },
    { name: "결제", hit: true },
  ];
  return (
    <g>
      <Box x={8} y={66} w={108} h={60} title="앱" sub="질의를 보냄" />
      <Flow x1={116} y1={96} x2={206} y2={96} label="질의" ly={88} />
      <rect x={208} y={26} width={144} height={150} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={280} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>데이터베이스</text>
      <text x={218} y={46} fontSize={10} fill={LINE}>인덱스로 행을 찾음</text>
      {tables.map((table, i) => (
        <g key={table.name}>
          <rect x={218} y={56 + i * 36} width={86} height={28} rx={3} fill={table.hit ? ACCENT : MUTED} fillOpacity={table.hit ? 0.18 : 0.15} stroke={table.hit ? ACCENT : MUTED} strokeWidth={1} />
          <text x={228} y={74 + i * 36} fontSize={10} fontWeight={700} fill={table.hit ? ACCENT : TEXT}>{`${table.name} 표`}</text>
        </g>
      ))}
      <path d="M 310 92 h 8 v 56 h -8" fill="none" stroke={ACCENT} strokeWidth={1.25} />
      <text x={322} y={116} fontSize={10} fontWeight={700} fill={ACCENT}>거래</text>
      <text x={322} y={130} fontSize={9} fill={ACCENT}>함께</text>
      <text x={280} y={192} textAnchor="middle" fontSize={10} fill={LINE}>두 표를 한 번에 확정·취소</text>
    </g>
  );
}

export default function AccessUnitViz() {
  return (
    <SceneShell
      eyebrow="저장소의 입구"
      title="네 저장 방식은 한 번에 오가는 단위가 다릅니다"
      description="왼쪽은 요청하는 쪽, 가운데 파란 선은 한 번에 오가는 단위, 오른쪽은 저장소입니다. 칸 수와 이름은 그림용입니다(가정)."
      ariaLabel="블록, 파일, 객체, 데이터베이스 저장소가 받는 연산 단위 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <BlockScene />}
          {active === 1 && <FileScene />}
          {active === 2 && <ObjectScene />}
          {active === 3 && <DatabaseScene />}
        </svg>
      )}
    />
  );
}
