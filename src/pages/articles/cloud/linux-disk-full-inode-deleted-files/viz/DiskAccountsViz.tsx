import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 100GiB ext4 하나의 블록 장부와 inode 장부를 같은 화면에 그린다.
 * 블록 막대는 1GiB를 한 칸으로 100칸이고, 칸 색이 그 블록을 붙잡은 계정이다.
 * inode 막대는 6,553,600개를 100칸으로 나눠 칸 하나가 65,536개다.
 * 오른쪽 숫자는 df.c와 ext4_statfs의 식으로 계산한 값이다.
 */
const SCENES = ["로그가 30GiB까지 자람", "rm app.log 직후", "프로세스가 fd를 닫음", "다른 서버 · inode 고갈"] as const;

type Cell = "named" | "deleted" | "free" | "reserved";

interface Scene {
  named: number;
  deleted: number;
  inodeCells: number;
  dfUsed: number;
  dfAvail: number;
  usePct: number;
  du: number;
  iusePct: number;
  userWrite: string;
  rootWrite: string;
  note: string;
}

const INODES = 6553600;

const STATES: readonly Scene[] = [
  {
    named: 95,
    deleted: 0,
    inodeCells: 4,
    dfUsed: 95,
    dfAvail: 0,
    usePct: 100,
    du: 95,
    iusePct: 4,
    userWrite: "ENOSPC",
    rootWrite: "5GiB까지 됨",
    note: "이름이 있는 파일이 95GiB입니다. 빈 5GiB는 전부 예약 블록이라 일반 사용자의 Avail은 0이고, Use%는 95 ÷ (95 + 0)이라 100%입니다.",
  },
  {
    named: 65,
    deleted: 30,
    inodeCells: 4,
    dfUsed: 95,
    dfAvail: 0,
    usePct: 100,
    du: 65,
    iusePct: 4,
    userWrite: "ENOSPC",
    rootWrite: "5GiB까지 됨",
    note: "이름은 사라져 du는 65GiB를 셉니다. 로그를 쓰던 프로세스가 fd를 열어 두었으므로 30GiB 블록은 그대로라 df는 여전히 95GiB입니다.",
  },
  {
    named: 65,
    deleted: 0,
    inodeCells: 4,
    dfUsed: 65,
    dfAvail: 30,
    usePct: 69,
    du: 65,
    iusePct: 4,
    userWrite: "됨",
    rootWrite: "됨",
    note: "마지막 fd가 닫히는 순간 inode가 evict되고 30GiB가 빈칸으로 돌아옵니다. Use%는 65 ÷ 95를 올림해 69%입니다.",
  },
  {
    named: 40,
    deleted: 0,
    inodeCells: 100,
    dfUsed: 40,
    dfAvail: 55,
    usePct: 43,
    du: 40,
    iusePct: 100,
    userWrite: "새 파일 ENOSPC",
    rootWrite: "새 파일 ENOSPC",
    note: "작은 세션 파일 수백만 개가 inode 6,553,600개를 다 썼습니다. 블록은 43%뿐이지만 새 파일에 줄 inode 번호가 없어 root도 새 파일을 못 만듭니다. 기존 파일에 덧붙이기는 됩니다.",
  },
];

const CELL_COLOR: Record<Cell, string> = {
  named: "#2563eb",
  deleted: "#dc2626",
  free: "#e5e7eb",
  reserved: "#f59e0b",
};

const LEGEND: readonly { cell: Cell; label: string }[] = [
  { cell: "named", label: "이름 있는 파일" },
  { cell: "deleted", label: "지웠지만 열린 파일" },
  { cell: "free", label: "누구나 쓰는 빈칸" },
  { cell: "reserved", label: "예약 5%" },
];

function cellsFor(state: Scene): Cell[] {
  return Array.from({ length: 100 }, (_, index) => {
    if (index < state.named) return "named";
    if (index < state.named + state.deleted) return "deleted";
    if (index >= 95) return "reserved";
    return "free";
  });
}

export default function DiskAccountsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  const state = STATES[scene];
  const cells = cellsFor(state);

  return (
    <VizFrame
      eyebrow="Four accounts"
      title="같은 100GiB에서 블록과 inode는 따로 바닥납니다"
      description="위 막대는 블록 100칸(칸 하나 1GiB), 아래 막대는 inode 100칸(칸 하나 65,536개)입니다. 아래 표는 같은 순간 df·du가 보여 주는 값입니다."
      note="100GiB ext4, 블록 4KiB, 예약 5%, inode 비율 16,384 byte는 설명용 가정입니다. 파일시스템 메타데이터 몫은 0으로 두었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="블록과 inode 장부"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-1 text-base font-bold">{SCENES[scene]}</h4>

          <p className="mt-3 text-xs font-bold text-foreground">블록 · 100GiB</p>
          <div className="mt-1 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[2px] sm:grid-cols-[repeat(50,minmax(0,1fr))]">
            {cells.map((cell, index) => (
              <span
                key={index}
                className="h-3 rounded-[1px] transition-colors duration-500"
                style={{ backgroundColor: CELL_COLOR[cell] }}
              />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            {LEGEND.map((item) => (
              <li key={item.cell} className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-[1px]" style={{ backgroundColor: CELL_COLOR[item.cell] }} />
                {item.label}
              </li>
            ))}
          </ul>

          <p className="mt-3 text-xs font-bold text-foreground">inode · {INODES.toLocaleString()}개</p>
          <div className="mt-1 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[2px] sm:grid-cols-[repeat(50,minmax(0,1fr))]">
            {Array.from({ length: 100 }, (_, index) => (
              <span
                key={index}
                className="h-3 rounded-[1px] transition-colors duration-500"
                style={{ backgroundColor: index < state.inodeCells ? "#7c3aed" : "#e5e7eb" }}
              />
            ))}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">df -h Used · Avail</dt>
              <dd className="min-h-[2rem] font-bold text-foreground sm:min-h-0">
                {state.dfUsed}G · {state.dfAvail}G
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">df Use% · du</dt>
              <dd className="min-h-[2rem] font-bold text-foreground sm:min-h-0">
                {state.usePct}% · {state.du}G
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">df -i IUse%</dt>
              <dd className="min-h-[2rem] font-bold text-foreground sm:min-h-0">{state.iusePct}%</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">일반 · root 쓰기</dt>
              <dd className="min-h-[2rem] font-bold text-foreground sm:min-h-0">
                {state.userWrite} · {state.rootWrite}
              </dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[11.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
