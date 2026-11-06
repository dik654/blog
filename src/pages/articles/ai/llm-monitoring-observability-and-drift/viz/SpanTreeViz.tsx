import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace-tree — “이 코드의 버그를 찾아줘” 요청. 평평한 기록 → parent id로 tree →
 * agent 층의 중첩 → 전체 8초 중 테스트 5초 → 병렬이면 root 시간은 합이 아님.
 * 8초·5초, generation 5번·tool 3번은 본문 예시. 병렬 예의 480·300ms는 가정이며 합 780, wall time 480.
 */
const W = 340;
const H = 196;
const INK = "#475569";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";

const RECORDS = [
  ["request", "—"],
  ["retrieval", "request"],
  ["generation", "request"],
  ["tool", "request"],
  ["generation", "request"],
] as const;

const SCENES = [
  { label: "기록은 줄 단위로 남습니다", summary: "같은 trace id · 각자의 parent", note: "모든 span이 같은 trace id를 공유합니다. 각 줄의 parent span id가 부모를 가리키므로 이 기록은 평평한 목록처럼 보여도 tree 정보를 담고 있습니다." },
  { label: "parent를 따라가면 tree가 됩니다", summary: "request 아래 자식 넷", note: "request span이 루트입니다. 자식 span은 왼쪽부터 관련 파일 검색, 원인 분석 생성, 테스트 실행, 결과 요약 순서입니다." },
  { label: "agent는 한 층을 더 만듭니다", summary: "generation 5번 · tool 3번", note: "Agent span은 여러 generation·tool 호출을 묶는 상위 루프입니다. 코드 수정 agent가 generation 5번과 tool 3번을 반복하면 그 호출들이 agent span의 자식이 됩니다." },
  { label: "시간을 얹으면 원인이 좁혀집니다", summary: "전체 8초 중 테스트 5초", note: "“전체가 8초 걸렸다”가 “테스트 실행에 5초를 썼다”로 바뀝니다. 나머지 3초의 내역은 본문이 나누지 않아 한 덩어리로 두었습니다." },
  { label: "병렬이면 합과 달라집니다", summary: "합 780ms · root 480ms (가정)", note: "글 첫머리의 1,680ms는 네 span이 차례로 이어져 합과 같았습니다. 두 tool span이 동시에 시작한다고 가정하면 겹친 300ms를 뺀 wall time(실제 경과 시간)이 root span의 시간입니다." },
] as const;

function Node({ x, y, w, label, strong = false }: { x: number; y: number; w: number; label: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={26} rx={4} fill="none" stroke={strong ? ACCENT : MUTED} strokeWidth={1} />
      <text x={x} y={y + 17} textAnchor="middle" fontSize={11.5} fontWeight={strong ? 700 : 400} fill={strong ? ACCENT : INK}>{label}</text>
    </g>
  );
}

function Records() {
  return (
    <>
      <text x={16} y={22} fontSize={11.5} fontWeight={700} fill={INK}>span</text>
      <text x={124} y={22} fontSize={11.5} fontWeight={700} fill={INK}>trace id</text>
      <text x={224} y={22} fontSize={11.5} fontWeight={700} fill={ACCENT}>parent span id</text>
      <line x1={10} x2={W - 10} y1={30} y2={30} stroke={MUTED} strokeWidth={1} />
      {RECORDS.map(([span, parent], index) => {
        const y = 52 + index * 28;
        return (
          <g key={index}>
            <text x={16} y={y} fontSize={12} fill={INK}>{span}</text>
            <text x={124} y={y} fontSize={12} fill={MUTED}>t1</text>
            <text x={224} y={y} fontSize={12} fontWeight={700} fill={ACCENT}>{parent}</text>
          </g>
        );
      })}
    </>
  );
}

function Tree() {
  const kids = [
    { x: 44, label: "retrieval" },
    { x: 128, label: "generation" },
    { x: 212, label: "tool" },
    { x: 296, label: "generation" },
  ];
  return (
    <>
      <Node x={W / 2} y={24} w={110} label="request (root)" strong />
      {kids.map((kid) => (
        <g key={kid.x}>
          <path d={`M${W / 2} 50 V76 H${kid.x} V100`} fill="none" stroke={MUTED} strokeWidth={1} />
          <Node x={kid.x} y={100} w={76} label={kid.label} />
        </g>
      ))}
      <text x={W / 2} y={160} textAnchor="middle" fontSize={11.5} fill={MUTED}>왼쪽에서 오른쪽이 실행 순서</text>
    </>
  );
}

function AgentTree() {
  const cells = Array.from({ length: 8 }, (_, i) => ({ x: 22 + i * 42.3, gen: i < 5 }));
  return (
    <>
      <Node x={W / 2} y={10} w={110} label="request (root)" />
      <line x1={W / 2} x2={W / 2} y1={36} y2={58} stroke={MUTED} strokeWidth={1} />
      <Node x={W / 2} y={58} w={110} label="agent" strong />
      {cells.map((cell) => (
        <g key={cell.x}>
          <path d={`M${W / 2} 84 V104 H${cell.x} V122`} fill="none" stroke={MUTED} strokeWidth={1} />
          <rect x={cell.x - 18} y={122} width={36} height={26} rx={4} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray={cell.gen ? undefined : "3 2"} />
          <text x={cell.x} y={139} textAnchor="middle" fontSize={11.5} fill={INK}>{cell.gen ? "gen" : "tool"}</text>
        </g>
      ))}
      <text x={W / 2} y={172} textAnchor="middle" fontSize={11.5} fill={MUTED}>실선 gen = generation 5번, 점선 tool 3번</text>
      <text x={W / 2} y={188} textAnchor="middle" fontSize={11.5} fill={MUTED}>배치 순서는 호출 순서가 아님</text>
    </>
  );
}

const sx = (seconds: number) => 14 + (seconds / 8) * (W - 28);

function EightSeconds() {
  return (
    <>
      <text x={14} y={40} fontSize={12} fontWeight={700} fill={INK}>request span 전체 8초</text>
      <rect x={sx(0)} y={48} width={sx(8) - sx(0)} height={24} rx={3} fill="none" stroke={INK} strokeWidth={1} />
      <text x={14} y={108} fontSize={12} fontWeight={700} fill={ACCENT}>tree로 나눈 뒤</text>
      <rect x={sx(0)} y={116} width={sx(3) - sx(0)} height={30} fill="#94a3b8" opacity={0.3} />
      <rect x={sx(3)} y={116} width={sx(8) - sx(3)} height={30} fill={ACCENT} opacity={0.75} />
      <text x={(sx(0) + sx(3)) / 2} y={136} textAnchor="middle" fontSize={11.5} fill={INK}>나머지 3초</text>
      <text x={(sx(3) + sx(8)) / 2} y={136} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">테스트 실행 5초</text>
      <text x={14} y={168} fontSize={11.5} fill={MUTED}>칸의 앞뒤는 실행 순서가 아니고, 길이만 초에 비례</text>
    </>
  );
}

const mx = (ms: number) => 76 + (ms / 800) * (W - 90);

function Parallel() {
  return (
    <>
      <text x={14} y={30} fontSize={11.5} fontWeight={700} fill={INK}>tool A</text>
      <rect x={mx(0)} y={18} width={mx(480) - mx(0)} height={20} fill={ACCENT} opacity={0.7} />
      <text x={mx(480) + 5} y={33} fontSize={11.5} fill={INK}>480ms</text>
      <text x={14} y={62} fontSize={11.5} fontWeight={700} fill={INK}>tool B</text>
      <rect x={mx(0)} y={50} width={mx(300) - mx(0)} height={20} fill={ACCENT} opacity={0.4} />
      <text x={mx(300) + 5} y={65} fontSize={11.5} fill={INK}>300ms</text>
      <line x1={mx(0)} x2={mx(800)} y1={82} y2={82} stroke={MUTED} strokeWidth={1} />
      <text x={14} y={106} fontSize={11.5} fontWeight={700} fill={ACCENT}>root</text>
      <rect x={mx(0)} y={94} width={mx(480) - mx(0)} height={20} fill="none" stroke={ACCENT} strokeWidth={1.25} />
      <text x={mx(480) + 5} y={109} fontSize={11.5} fontWeight={700} fill={ACCENT}>480ms</text>
      <text x={14} y={146} fontSize={11.5} fill={MUTED}>단순 합</text>
      <rect x={mx(0)} y={134} width={mx(780) - mx(0)} height={20} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
      <text x={mx(780) - 5} y={149} textAnchor="end" fontSize={11.5} fill={INK}>780ms</text>
      <text x={14} y={180} fontSize={11.5} fill={MUTED}>780 − 겹친 300 = 480ms</text>
    </>
  );
}

export default function SpanTreeViz() {
  return (
    <SceneShell
      eyebrow="버그 찾기 요청 하나"
      title="평평해 보이는 span 기록이 parent id로 tree가 되고, 그 위에 시간이 얹힙니다"
      description="“이 코드의 버그를 찾아줘”를 따라갑니다. trace id t1은 설명용 이름입니다."
      ariaLabel="span 기록에서 parent span id로 tree를 만들고 시간을 얹는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Records />}
          {active === 1 && <Tree />}
          {active === 2 && <AgentTree />}
          {active === 3 && <EightSeconds />}
          {active === 4 && <Parallel />}
        </svg>
      )}
    />
  );
}
