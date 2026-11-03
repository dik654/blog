import StepViz from "@/components/ui/step-viz";

const BLUE = "#2563eb";
const GREEN = "#059669";
const AMBER = "#d97706";
const RED = "#dc2626";
const MUTED = "var(--muted-foreground)";

const RECEIPT_STEPS = [
  {
    label: "Bob은 root CID A만 알고 있습니다.",
    body: "CID A는 어떤 bytes를 원하는지 정하지만, 어느 peer가 지금 그 block을 갖고 있는지는 말하지 않습니다.",
  },
  {
    label: "먼저 Bob의 local blockstore를 확인합니다.",
    body: "A가 없으면 local miss입니다. CID가 틀렸다는 뜻이 아니라, 이제 외부 후보를 찾아야 한다는 뜻입니다.",
  },
  {
    label: "Provider 탐색은 물어볼 후보 P1·P2를 만듭니다.",
    body: "광고는 재고 증명서가 아닙니다. P1은 이미 offline일 수 있고 P2만 실제 block을 갖고 있을 수 있습니다.",
  },
  {
    label: "P1이 응답하지 않으면 같은 CID를 P2에 요청합니다.",
    body: "Kubo의 기본 최대 provider 수 10과 provider search delay 1초는 설정 기본값입니다. 정확히 10명을 찾거나 1초 뒤 성공한다는 보장은 아닙니다.",
  },
  {
    label: "받은 A를 검증한 뒤 link B·C를 같은 방식으로 가져옵니다.",
    body: "Root block 하나를 받았다는 사실과 UnixFS DAG 전체가 완성됐다는 사실은 다릅니다. A의 link를 읽고 B와 C까지 검증해야 합니다.",
  },
  {
    label: "Recursive pin은 완성된 A·B·C를 이 저장소의 GC에서 보호합니다.",
    body: "Pin은 local 보존 약속입니다. 다른 노드의 복제본, 디스크 장애 복구, 영구 보관을 자동으로 보장하지 않습니다.",
  },
] as const;

const GC_STEPS = [
  {
    label: "GC 시작 시 local block key 집합 B를 봅니다.",
    body: "고정 사례의 blockstore에는 A·B·C·D·E가 있습니다. 여기서 D는 다른 요청이 남긴 캐시 block입니다.",
  },
  {
    label: "Pin·MFS·internal root에서 link를 따라갑니다.",
    body: "Recursive pin A는 A·B·C를, 별도의 MFS/internal root는 E를 보호합니다.",
  },
  {
    label: "도달한 block을 보호 집합 R={A,B,C,E}로 표시합니다.",
    body: "하나의 block이 여러 root에서 공유돼도 한 번만 남깁니다. Codec이 달라도 같은 multihash의 block을 보존하도록 raw CID key로 비교합니다.",
  },
  {
    label: "B에서 R을 뺀 D만 sweep합니다.",
    body: "단, mark 중 child link를 못 읽으면 Kubo v0.43.1은 sweep 전에 GC를 중단합니다. 삭제 하나가 실패하면 다른 후보는 계속 처리하고 마지막에 incomplete 오류를 냅니다.",
  },
] as const;

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = BLUE,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  id: string;
}) {
  return (
    <>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd={`url(#${id})`} />
    </>
  );
}

function Card({
  x,
  y,
  width,
  height,
  title,
  lines = [],
  color = BLUE,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  lines?: readonly string[];
  color?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={10} fill="var(--card)" stroke={color} strokeWidth={1.1} />
      <text x={x + width / 2} y={y + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        {title}
      </text>
      {lines.map((line, index) => (
        <text key={line} x={x + width / 2} y={y + 39 + index * 15} textAnchor="middle" fontSize={9} fill={MUTED}>
          {line}
        </text>
      ))}
    </g>
  );
}

function Block({ x, y, label, color = BLUE }: { x: number; y: number; label: string; color?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={40} height={34} rx={7} fill={`${color}12`} stroke={color} />
      <text x={x + 20} y={y + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

function ReceiptScene({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 360 270" role="img" aria-label={RECEIPT_STEPS[step].label}>
      {step === 0 && (
        <>
          <Card x={25} y={84} width={124} height={72} title="payroll-report-v1" lines={["원하는 사용자 파일"]} />
          <Arrow x1={151} y1={120} x2={201} y2={120} id="receipt-0" />
          <Card x={208} y={72} width={126} height={96} title="root CID A" lines={["bytes의 이름·검증 기준", "위치는 들어 있지 않음"]} color={GREEN} />
          <text x={180} y={211} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">CID를 안다 ≠ 위치를 안다</text>
          <text x={180} y={231} textAnchor="middle" fontSize={9.5} fill={MUTED}>identity와 availability는 서로 다른 질문입니다</text>
        </>
      )}

      {step === 1 && (
        <>
          <Card x={24} y={91} width={104} height={66} title="요청 CID A" />
          <Arrow x1={130} y1={124} x2={187} y2={124} id="receipt-1" />
          <Card x={194} y={72} width={140} height={104} title="Bob blockstore" lines={["A 없음", "B·C도 아직 없음"]} color={AMBER} />
          <circle cx={264} cy={136} r={15} fill={`${AMBER}16`} stroke={AMBER} />
          <text x={264} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>MISS</text>
          <text x={180} y={211} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">local miss → 외부 탐색 시작</text>
          <text x={180} y={231} textAnchor="middle" fontSize={9.5} fill={MUTED}>“내 창고에 없음”을 “CID가 틀림”으로 바꾸지 않습니다</text>
        </>
      )}

      {step === 2 && (
        <>
          <Card x={18} y={92} width={88} height={62} title="Bob" lines={["Find providers"]} />
          <Arrow x1={108} y1={123} x2={160} y2={123} id="receipt-2a" />
          <Card x={167} y={73} width={94} height={100} title="routing" lines={["CID A의 후보", "목록 반환"]} color={AMBER} />
          <Arrow x1={263} y1={105} x2={299} y2={81} id="receipt-2b" color={AMBER} />
          <Arrow x1={263} y1={141} x2={299} y2={165} id="receipt-2c" color={GREEN} />
          <circle cx={322} cy={68} r={20} fill={`${RED}10`} stroke={RED} />
          <text x={322} y={65} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>P1</text>
          <text x={322} y={78} textAnchor="middle" fontSize={8} fill={RED}>stale</text>
          <circle cx={322} cy={178} r={20} fill={`${GREEN}10`} stroke={GREEN} />
          <text x={322} y={175} textAnchor="middle" fontSize={10} fontWeight={700} fill={GREEN}>P2</text>
          <text x={322} y={188} textAnchor="middle" fontSize={8} fill={GREEN}>Alice</text>
          <text x={180} y={223} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--foreground)">후보 목록 ≠ 현재 보유 증명</text>
        </>
      )}

      {step === 3 && (
        <>
          <Card x={18} y={94} width={90} height={62} title="Bob" lines={["WANT CID A"]} />
          <Arrow x1={110} y1={112} x2={171} y2={76} id="receipt-3a" color={RED} />
          <Arrow x1={110} y1={139} x2={171} y2={176} id="receipt-3b" color={GREEN} />
          <Card x={178} y={43} width={156} height={65} title="P1 · 응답 없음" lines={["timeout · 다음 후보"]} color={RED} />
          <Card x={178} y={151} width={156} height={65} title="P2 · block A 보유" lines={["libp2p 또는 HTTP retrieval"]} color={GREEN} />
          <text x={180} y={244} textAnchor="middle" fontSize={10} fill={MUTED}>실패 이유를 남기고 같은 CID로 bounded retry합니다</text>
        </>
      )}

      {step === 4 && (
        <>
          <Block x={25} y={100} label="A bytes" color={GREEN} />
          <Arrow x1={67} y1={117} x2={113} y2={117} id="receipt-4a" color={GREEN} />
          <Card x={120} y={79} width={112} height={76} title="CID 검증" lines={["hash(bytes)=A", "일치해야 admit"]} color={GREEN} />
          <Arrow x1={234} y1={105} x2={268} y2={82} id="receipt-4b" color={BLUE} />
          <Arrow x1={234} y1={129} x2={268} y2={153} id="receipt-4c" color={BLUE} />
          <Block x={276} y={64} label="B" color={BLUE} />
          <Block x={276} y={137} label="C" color={BLUE} />
          <text x={180} y={205} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--foreground)">A 수신 → B·C link 발견 → 다시 fetch·verify</text>
          <text x={180} y={225} textAnchor="middle" fontSize={9.5} fill={MUTED}>root receipt 하나는 DAG completeness receipt가 아닙니다</text>
        </>
      )}

      {step === 5 && (
        <>
          <Card x={25} y={83} width={106} height={78} title="recursive pin A" lines={["local GC root"]} color={GREEN} />
          <Arrow x1={133} y1={122} x2={174} y2={122} id="receipt-5" color={GREEN} />
          <Card x={181} y={57} width={154} height={130} title="보호된 DAG" lines={["A · root block", "B · child block", "C · child block"]} color={GREEN} />
          <text x={180} y={221} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--foreground)">local retention ≠ remote replication</text>
          <text x={180} y={240} textAnchor="middle" fontSize={9.5} fill={MUTED}>백업·복제·디스크 내구성은 별도 계약입니다</text>
        </>
      )}
    </svg>
  );
}

function GcScene({ step }: { step: number }) {
  const positions = [42, 99, 156, 213, 270];
  return (
    <svg viewBox="0 0 360 250" role="img" aria-label={GC_STEPS[step].label}>
      {step === 0 && (
        <>
          <text x={180} y={44} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">local blockstore B</text>
          {positions.map((x, index) => <Block key={x} x={x} y={87} label={String.fromCharCode(65 + index)} />)}
          <text x={180} y={159} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">B = {"{A, B, C, D, E}"}</text>
          <text x={180} y={181} textAnchor="middle" fontSize={9.5} fill={MUTED}>저장 용량을 회수하기 전, 무엇이 보호 대상인지 먼저 찾습니다</text>
        </>
      )}

      {step === 1 && (
        <>
          <Card x={22} y={58} width={104} height={74} title="recursive pin" lines={["root A"]} color={GREEN} />
          <Arrow x1={128} y1={95} x2={174} y2={95} id="gc-1a" color={GREEN} />
          <Block x={181} y={78} label="A" color={GREEN} />
          <line x1={222} y1={95} x2={267} y2={70} stroke={GREEN} strokeWidth={1.1} />
          <line x1={222} y1={95} x2={267} y2={122} stroke={GREEN} strokeWidth={1.1} />
          <Block x={274} y={53} label="B" color={GREEN} />
          <Block x={274} y={105} label="C" color={GREEN} />
          <Card x={86} y={161} width={188} height={54} title="MFS · internal root" lines={["별도로 E를 보호"]} color={AMBER} />
        </>
      )}

      {step === 2 && (
        <>
          <text x={180} y={37} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">protected set R</text>
          {positions.map((x, index) => {
            const label = String.fromCharCode(65 + index);
            return <Block key={x} x={x} y={79} label={label} color={label !== "D" ? GREEN : MUTED} />;
          })}
          <text x={180} y={151} textAnchor="middle" fontSize={11} fontWeight={700} fill={GREEN}>R = {"{A, B, C, E}"}</text>
          <text x={180} y={174} textAnchor="middle" fontSize={9.5} fill={MUTED}>D만 어떤 root에서도 도달하지 못했습니다</text>
          <text x={180} y={197} textAnchor="middle" fontSize={9.5} fill={MUTED}>비교할 때 codec을 떼고 raw multihash key로 맞춥니다</text>
        </>
      )}

      {step === 3 && (
        <>
          <Card x={18} y={48} width={144} height={81} title="mark 성공" lines={["B ∖ R = {D}", "D만 delete"]} color={GREEN} />
          <Arrow x1={164} y1={89} x2={196} y2={89} id="gc-3a" color={GREEN} />
          <Block x={204} y={72} label="D" color={RED} />
          <line x1={208} y1={76} x2={240} y2={102} stroke={RED} strokeWidth={1.2} />
          <line x1={240} y1={76} x2={208} y2={102} stroke={RED} strokeWidth={1.2} />
          <Card x={18} y={154} width={316} height={60} title="mark 중 child link를 못 읽으면" lines={["sweep 시작 전 전체 GC 중단 · 보수적으로 남김"]} color={AMBER} />
          <text x={289} y={94} textAnchor="middle" fontSize={9.5} fill={MUTED}>삭제 실패는 기록 후 계속</text>
        </>
      )}
    </svg>
  );
}

export function KuboReceiptViz() {
  return (
    <figure data-viz="kubo-receipt-flow" className="not-prose my-8 min-w-0">
      <figcaption className="mb-3 text-sm font-semibold text-foreground">payroll-report-v1 하나가 local miss에서 recursive pin까지 가는 길</figcaption>
      <StepViz steps={RECEIPT_STEPS}>{(step) => <ReceiptScene step={step} />}</StepViz>
    </figure>
  );
}

export function KuboGcViz() {
  return (
    <figure data-viz="kubo-gc-flow" className="not-prose my-8 min-w-0">
      <figcaption className="mb-3 text-sm font-semibold text-foreground">A·B·C·D·E 중 D만 지우기까지의 mark-and-sweep</figcaption>
      <StepViz steps={GC_STEPS}>{(step) => <GcScene step={step} />}</StepViz>
    </figure>
  );
}
