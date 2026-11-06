import SceneShell from "./SceneShell";

/**
 * 본문 대응: #threads — clone()의 네 비트가 주소 공간과 fd 표를 공유할지 복제할지 가른다.
 * 위 칸 = 네 비트의 켬/끔. 아래 그림 = task가 어느 표를 가리키는지.
 */
type Bit = "on" | "off" | "any";
type Diagram = "thread" | "fork" | "chain";

interface Scene {
  label: string;
  summary: string;
  note: string;
  bits: readonly [Bit, Bit, Bit, Bit];
  diagram: Diagram;
  fd7: boolean;
  childClosed?: boolean;
  broken?: 0 | 1;
}

const BITS = [
  { name: "CLONE_VM", value: "0x100", role: "주소 공간" },
  { name: "CLONE_FILES", value: "0x400", role: "열린 파일 표" },
  { name: "CLONE_SIGHAND", value: "0x800", role: "시그널 처리기" },
  { name: "CLONE_THREAD", value: "0x10000", role: "같은 thread group" },
] as const;

const BIT_TEXT: Record<Bit, string> = { on: "켬", off: "끔", any: "—" };

const SCENES: readonly Scene[] = [
  { label: "pthread: 네 비트 모두 켬", summary: "pthread_create · 표는 하나", bits: ["on", "on", "on", "on"], diagram: "thread", fd7: false, note: "CLONE_VM이 켜져 있으면 부모의 mm_struct에 참조 수만 하나 올립니다. CLONE_FILES면 files_struct의 count만 올립니다. T1~T4는 같은 것을 가리킵니다." },
  { label: "T2가 accept로 소켓을 받습니다", summary: "fd 7은 네 스레드 모두의 표에", bits: ["on", "on", "on", "on"], diagram: "thread", fd7: true, note: "표가 하나뿐이라 T2가 받은 소켓 fd 7은 T1·T3·T4의 표에도 바로 있습니다." },
  { label: "fork: 네 비트 모두 끔", summary: "dup_mm · dup_fd로 복제", bits: ["off", "off", "off", "off"], diagram: "fork", fd7: true, note: "CLONE_VM이 꺼져 있으면 dup_mm으로 주소 공간을, CLONE_FILES가 꺼져 있으면 dup_fd로 표를 복사합니다. (가정) fd 7이 열린 뒤 fork했다고 봅니다." },
  { label: "자식이 fd 7을 닫습니다", summary: "부모의 표는 그대로", bits: ["off", "off", "off", "off"], diagram: "fork", fd7: true, childClosed: true, note: "표가 따로이므로 fork한 자식이 fd를 닫아도 부모의 표는 그대로입니다." },
  { label: "막히는 조합 ①", summary: "THREAD 켬 + SIGHAND 끔 → EINVAL", bits: ["any", "any", "off", "on"], diagram: "chain", fd7: false, broken: 0, note: "copy_process 앞머리가 EINVAL을 돌려줍니다. 같은 thread group은 시그널 처리기 표를 공유해야 하기 때문입니다." },
  { label: "막히는 조합 ②", summary: "SIGHAND 켬 + VM 끔 → EINVAL", bits: ["off", "any", "on", "any"], diagram: "chain", fd7: false, broken: 1, note: "처리기 표를 공유하려면 그 표가 놓인 주소 공간도 공유해야 합니다. 결국 스레드는 이 네 비트가 모두 켜진 task입니다." },
];

const BLUE = "#2563eb";
const GRAY = "#64748b";
const RED = "#dc2626";
const AMBER = "#d97706";

function Box({ x, y, w, h, title, sub, color = GRAY, mono = false }: { x: number; y: number; w: number; h: number; title: string; sub?: string; color?: string; mono?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 2 : y + h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={color} fontFamily={mono ? "monospace" : undefined}>
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={10} fill={GRAY}>
          {sub}
        </text>
      )}
    </g>
  );
}

function FdCell({ x, y, closed }: { x: number; y: number; closed: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={40} height={18} rx={3} fill="none" stroke={closed ? RED : AMBER} strokeWidth={1} strokeDasharray={closed ? "3 3" : undefined} />
      <text x={x + 20} y={y + 13} textAnchor="middle" fontSize={10} fontWeight={700} fill={closed ? RED : AMBER}>
        {closed ? "닫힘" : "fd 7"}
      </text>
    </g>
  );
}

function ThreadDiagram({ fd7 }: { fd7: boolean }) {
  const tasks = [
    { id: "T1", x: 20 },
    { id: "T2", x: 110 },
    { id: "T3", x: 200 },
    { id: "T4", x: 290 },
  ];
  return (
    <>
      {tasks.map((task) => (
        <g key={task.id}>
          <line x1={task.x + 25} y1={30} x2={100} y2={74} stroke={BLUE} strokeWidth={1} opacity={0.55} />
          <line x1={task.x + 25} y1={30} x2={260} y2={74} stroke={BLUE} strokeWidth={1} opacity={0.55} />
          <Box x={task.x} y={4} w={50} h={26} title={task.id} color={BLUE} />
        </g>
      ))}
      <Box x={30} y={74} w={140} h={42} title="mm_struct" sub="주소 공간 하나" mono />
      <Box x={190} y={74} w={140} h={42} title="files_struct" sub="열린 파일 표 하나" mono />
      {fd7 && <FdCell x={240} y={122} closed={false} />}
    </>
  );
}

function ForkDiagram({ childClosed }: { childClosed: boolean }) {
  const sides = [
    { name: "부모", x: 10, closed: false },
    { name: "자식", x: 190, closed: childClosed },
  ];
  return (
    <>
      {sides.map((side) => (
        <g key={side.name}>
          <line x1={side.x + 80} y1={30} x2={side.x + 38} y2={74} stroke={BLUE} strokeWidth={1} opacity={0.55} />
          <line x1={side.x + 80} y1={30} x2={side.x + 122} y2={74} stroke={BLUE} strokeWidth={1} opacity={0.55} />
          <Box x={side.x + 50} y={4} w={60} h={26} title={side.name} color={BLUE} />
          <Box x={side.x} y={74} w={76} h={42} title="주소 공간" sub="따로" />
          <Box x={side.x + 84} y={74} w={76} h={42} title="파일 표" sub="따로" />
          <FdCell x={side.x + 102} y={122} closed={side.closed} />
        </g>
      ))}
    </>
  );
}

function ChainDiagram({ broken }: { broken: 0 | 1 }) {
  const items = [
    { name: "CLONE_THREAD", role: "같은 thread group", x: 4 },
    { name: "CLONE_SIGHAND", role: "처리기 표 공유", x: 128 },
    { name: "CLONE_VM", role: "주소 공간 공유", x: 252 },
  ];
  return (
    <>
      {items.map((item) => (
        <Box key={item.name} x={item.x} y={20} w={104} h={50} title={item.name} sub={item.role} mono />
      ))}
      {[0, 1].map((link) => {
        const x1 = items[link].x + 104;
        const isBroken = link === broken;
        const color = isBroken ? RED : GRAY;
        return (
          <g key={link}>
            <line x1={x1 + 2} y1={45} x2={x1 + 18} y2={45} stroke={color} strokeWidth={1} strokeDasharray={isBroken ? "3 2" : undefined} />
            <path d={`M${x1 + 18} 41 L${x1 + 20} 45 L${x1 + 18} 49`} fill="none" stroke={color} strokeWidth={1} />
            {isBroken && (
              <text x={x1 + 10} y={90} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>
                EINVAL
              </text>
            )}
          </g>
        );
      })}
      <text x={180} y={124} textAnchor="middle" fontSize={11} fill={GRAY}>
        화살표: 왼쪽 비트를 켜려면 오른쪽 비트가 필요합니다
      </text>
    </>
  );
}

export default function CloneShareViz() {
  return (
    <SceneShell
      eyebrow="clone()의 네 비트"
      title="비트가 켜지면 같은 표를 가리키고, 꺼지면 복제합니다"
      description="위 네 칸이 clone()에 준 플래그, 아래가 task가 가리키는 표입니다. fd는 열린 파일 번호, thread group은 한 프로세스로 묶인 스레드입니다."
      ariaLabel="pthread_create와 fork의 공유 차이, 허용되지 않는 비트 조합"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
              {BITS.map((bit, i) => {
                const state = s.bits[i];
                const tone = state === "on" ? "border-[#2563eb] bg-[#2563eb]/10" : state === "off" ? "border-border bg-background" : "border-dashed border-border/60";
                return (
                  <div key={bit.name} className={`rounded-sm border px-2 py-1.5 ${tone}`}>
                    <div className="truncate font-mono text-[11px] font-bold">{bit.name}</div>
                    <div className="flex items-baseline justify-between gap-1 text-[11px]">
                      <span className="truncate text-muted-foreground">{bit.role}</span>
                      <span className={`shrink-0 font-bold ${state === "on" ? "text-[#2563eb]" : "text-muted-foreground"}`}>{BIT_TEXT[state]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <svg viewBox="0 0 360 146" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
              {s.diagram === "thread" && <ThreadDiagram fd7={s.fd7} />}
              {s.diagram === "fork" && <ForkDiagram childClosed={Boolean(s.childClosed)} />}
              {s.diagram === "chain" && <ChainDiagram broken={s.broken ?? 0} />}
            </svg>
          </div>
        );
      }}
    />
  );
}
