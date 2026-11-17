import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release — 일반 path gateway의 파일 body, Trustless Gateway의 raw block과 CAR stream,
 * Bob의 두 층 release gate. 고정 사례 DAG는 root A → child B·C.
 */
const SCENES = [
  { label: "일반 path gateway", summary: "HTTP 200 · 파일 bytes", note: "Gateway가 A·B·C를 풀어 만든 파일 bytes를 body로 줍니다. 그런데 root CID A는 보통 UnixFS root DAG block을 가리키므로, 이 파일 전체를 hash해 A와 비교하는 것은 서로 다른 대상을 비교하는 일입니다. HTTP 200은 요청에 응답했다는 뜻일 뿐입니다." },
  { label: "Raw block", summary: "/ipfs/{cid} 한 block", note: "Raw 응답은 block 하나만 돌려줍니다. Body의 multihash를 요청 CID와 직접 비교할 수 있지만, path를 따라가거나 DAG 전체를 받는 데는 쓰지 않습니다." },
  { label: "CAR stream", summary: "block마다 CID 확인 + traversal", note: "Path나 전체 UnixFS DAG가 필요하면 CAR stream을 받습니다. 들어온 block마다 CID를 확인한 뒤, 요청한 root A에서 link를 따라 B·C까지 원하는 결과가 만들어졌는지 다시 확인합니다." },
  { label: "Bob의 release gate", summary: "두 층을 모두 통과해야 공개", note: "첫 층은 block별 CID 확인, 둘째 층은 A→B,C traversal 완성과 size·codec·authorization 정책입니다. 둘을 통과하기 전의 임시 파일이나 CAR는 payroll 시스템에 공개하지 않습니다." },
] as const;

const GREEN = "#059669";
const AMBER = "#d97706";
const BLUE = "#2563eb";
const SLATE = "#475569";
const MUTED = "#94a3b8";

function Box({ x, y, w, h, title, sub, color }: { x: number; y: number; w: number; h: number; title: string; sub?: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={9.5} fill={SLATE}>{sub}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 6;
  const p1 = `${x2 - head * Math.cos(angle - 0.45)},${y2 - head * Math.sin(angle - 0.45)}`;
  const p2 = `${x2 - head * Math.cos(angle + 0.45)},${y2 - head * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${p1} ${p2}`} fill={color} />
    </g>
  );
}

function Mini({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={26} height={22} rx={5} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + 13} y={y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function Scene({ active }: { active: number }) {
  if (active === 0) {
    return (
      <>
        <Mini x={20} y={40} label="A" color={MUTED} />
        <Mini x={52} y={40} label="B" color={MUTED} />
        <Mini x={84} y={40} label="C" color={MUTED} />
        <text x={66} y={80} textAnchor="middle" fontSize={9.5} fill={SLATE}>gateway가 풀어 합침</text>
        <Arrow x1={116} y1={51} x2={150} y2={51} color={SLATE} />
        <Box x={154} y={28} w={100} h={46} title="파일 bytes" sub="HTTP 200 body" color={SLATE} />
        <Box x={20} y={106} w={130} h={46} title="hash(파일 bytes)" color={AMBER} />
        <Box x={210} y={106} w={130} h={46} title="root CID A" sub="UnixFS root block" color={BLUE} />
        <text x={180} y={133} textAnchor="middle" fontSize={14} fontWeight={700} fill={AMBER}>≠</text>
        <text x={180} y={182} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={AMBER}>비교 대상이 다름 · 이 방식으로는 검증 불가</text>
      </>
    );
  }
  if (active === 1) {
    return (
      <>
        <Box x={20} y={30} w={120} h={46} title="GET /ipfs/{A}" sub="raw block 요청" color={SLATE} />
        <Arrow x1={140} y1={53} x2={186} y2={53} color={SLATE} />
        <Mini x={192} y={42} label="A" color={GREEN} />
        <text x={250} y={57} fontSize={10} fill={SLATE}>block 하나</text>
        <Box x={20} y={106} w={130} h={46} title="hash(body)" color={GREEN} />
        <Box x={210} y={106} w={130} h={46} title="CID A의 multihash" color={GREEN} />
        <text x={180} y={134} textAnchor="middle" fontSize={14} fontWeight={700} fill={GREEN}>=</text>
        <text x={180} y={182} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={GREEN}>직접 비교 가능 · 단, path·DAG 전체에는 안 씀</text>
      </>
    );
  }
  if (active === 2) {
    return (
      <>
        <Box x={20} y={30} w={96} h={46} title="CAR stream" sub="block 여러 개" color={SLATE} />
        <Arrow x1={116} y1={53} x2={146} y2={53} color={SLATE} />
        {(["A", "B", "C"] as const).map((label, index) => (
          <g key={label}>
            <Mini x={152 + index * 62} y={42} label={label} color={GREEN} />
            <text x={152 + index * 62 + 32} y={57} fontSize={11} fontWeight={700} fill={GREEN}>✓</text>
          </g>
        ))}
        <text x={246} y={88} textAnchor="middle" fontSize={9.5} fill={SLATE}>block마다 hash = 자기 CID</text>
        <Mini x={167} y={112} label="A" color={BLUE} />
        <Arrow x1={193} y1={118} x2={232} y2={108} color={BLUE} />
        <Arrow x1={193} y1={129} x2={232} y2={140} color={BLUE} />
        <Mini x={236} y={96} label="B" color={BLUE} />
        <Mini x={236} y={130} label="C" color={BLUE} />
        <text x={20} y={128} fontSize={10.5} fontWeight={700} fill={BLUE}>root A에서</text>
        <text x={20} y={142} fontSize={10.5} fontWeight={700} fill={BLUE}>link를 따라 확인</text>
        <text x={180} y={182} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={GREEN}>block 검증 + 요청한 root·path 결과 검증</text>
      </>
    );
  }
  return (
    <>
      <Box x={14} y={50} w={74} h={52} title="수신" sub="A·B·C" color={SLATE} />
      <Arrow x1={88} y1={76} x2={104} y2={76} color={SLATE} />
      <Box x={106} y={44} w={74} h={64} title="1층" sub="block별 CID" color={GREEN} />
      <Arrow x1={180} y1={76} x2={196} y2={76} color={SLATE} />
      <Box x={198} y={44} w={74} h={64} title="2층" sub="traversal·정책" color={GREEN} />
      <Arrow x1={272} y1={76} x2={288} y2={76} color={SLATE} />
      <Box x={290} y={50} w={58} h={52} title="공개" sub="payroll" color={BLUE} />
      <text x={235} y={124} textAnchor="middle" fontSize={9.5} fill={SLATE}>A→B,C 완성 · size · codec · authorization</text>
      <rect x={14} y={142} width={334} height={30} rx={8} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
      <text x={181} y={161} textAnchor="middle" fontSize={10.5} fill={AMBER}>통과 전 임시 파일·CAR는 공개하지 않음</text>
    </>
  );
}

export default function GatewayVerifyViz() {
  return (
    <SceneShell
      eyebrow="Gateway 응답 검증"
      title="HTTP body를 CID와 비교할 수 있는지는 응답 표현이 정합니다"
      description="고정 사례의 root block A는 child block B·C를 가리킵니다. Raw block과 CAR는 Trustless Gateway 규격이 정한 검증 가능한 응답 표현입니다. CAR는 여러 block을 한 stream에 담아 보내는 형식입니다."
      ariaLabel="일반 gateway 응답, raw block, CAR stream, 두 층 release gate의 검증 방식 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Scene active={active} />
        </svg>
      )}
    />
  );
}
