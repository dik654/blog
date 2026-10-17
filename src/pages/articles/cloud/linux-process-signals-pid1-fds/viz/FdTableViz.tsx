import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 프로세스의 fd 표 1,024칸(0~1023)을 32×32로 그리고 칸이 차는 순서를 따라간다.
 * 한 mechanism: alloc_fd는 비어 있는 가장 낮은 번호를 고르고, 그 번호가 RLIMIT_NOFILE soft 값 이상이면 EMFILE.
 */
const SLOTS = 1024;
const SCENES = ["표준 입출력 3칸", "로그·라이브러리·listen 21칸", "연결 1,000개", "1,001번째 연결", "soft를 65,536으로"] as const;

interface Scene {
  std: number;
  base: number;
  conns: number;
  next: string;
  result: string;
  note: string;
}

const STATES: readonly Scene[] = [
  {
    std: 3,
    base: 0,
    conns: 0,
    next: "3",
    result: "—",
    note: "새 프로세스는 부모에게서 0·1·2(표준 입력·출력·오류)를 물려받습니다. fd는 이 표의 칸 번호이고 커널 안의 열린 파일 하나를 가리킵니다.",
  },
  {
    std: 3,
    base: 21,
    conns: 0,
    next: "24",
    result: "—",
    note: "로그 파일, 공유 라이브러리, epoll, listen socket 등이 3~23번을 씁니다. 아직 손님 연결은 없는데 이미 24칸을 썼습니다.",
  },
  {
    std: 3,
    base: 21,
    conns: 1000,
    next: "없음",
    result: "1,024칸 모두 사용",
    note: "accept가 돌려준 연결 socket 하나가 칸 하나입니다. 24번부터 1,023번까지 1,000칸이 차면 표가 꽉 찹니다.",
  },
  {
    std: 3,
    base: 21,
    conns: 1000,
    next: "1024 ≥ 1024",
    result: "accept → EMFILE",
    note: "다음 빈 칸 번호가 1,024이고 soft limit도 1,024라 alloc_fd가 EMFILE을 돌려줍니다. 로그에 Too many open files가 남고, 대기 중인 손님은 listen 대기열에서 기다립니다.",
  },
  {
    std: 3,
    base: 21,
    conns: 1000,
    next: "1024 < 65536",
    result: "accept 성공",
    note: "soft를 hard 이하로 올리면 같은 검사가 통과합니다. 다만 select()는 1,023 위의 fd를 다루지 못하고, 시스템 전체 한도 file-max를 넘으면 ENFILE이 납니다.",
  },
];

function slotColor(i: number, s: Scene): string | undefined {
  if (i < s.std) return "#64748b";
  if (i < s.std + s.base) return "#d97706";
  if (i < s.std + s.base + s.conns) return "#2563eb";
  return undefined;
}

function Stack({ items, active, className = "" }: { items: readonly ReactNode[]; active: number; className?: string }) {
  return (
    <div className={`grid ${className}`}>
      {items.map((item, index) => (
        <div key={index} aria-hidden={index !== active} className={`col-start-1 row-start-1 ${index === active ? "" : "invisible"}`}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default function FdTableViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const state = STATES[scene];
  const used = state.std + state.base + state.conns;

  return (
    <VizFrame
      eyebrow="File descriptor table"
      title="fd 칸이 soft limit에 닿으면 1,001번째 연결부터 EMFILE이 납니다"
      description="작은 네모 하나가 fd 하나이고 32칸이 한 줄입니다. 회색은 0·1·2, 주황은 로그·라이브러리·listen socket, 파랑은 손님 연결입니다."
      note="24칸의 구성과 soft limit 1,024는 설명용 가정입니다. 실제 값은 /proc/PID/fd와 /proc/PID/limits로 확인합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="fd 표가 soft limit까지 차는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <Stack active={scene} className="mt-2" items={SCENES.map((label) => <h4 key={label} className="text-base font-bold">{label}</h4>)} />

          <div className="mt-3 grid gap-4 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-start">
          <div>
          <div className="mx-auto grid w-full max-w-[26rem] grid-cols-32 gap-px rounded-sm border border-border p-px sm:max-w-none">
            {Array.from({ length: SLOTS }, (_, i) => (
              <div key={i} className="aspect-square bg-muted/40" style={slotColor(i, state) ? { backgroundColor: slotColor(i, state) } : undefined} />
            ))}
          </div>
          <div className="mx-auto mt-1 flex w-full max-w-[26rem] justify-between font-mono text-[10px] text-muted-foreground sm:max-w-none">
            <span>fd 0</span>
            <span>fd 1023</span>
          </div>
          </div>

          <div className="min-w-0">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">쓴 칸</dt>
              <dd className="font-bold text-foreground">{used.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">soft limit</dt>
              <dd className="font-bold text-foreground">{scene === 4 ? "65,536" : "1,024"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">다음 번호</dt>
              <dd className="font-bold text-foreground"><Stack active={scene} items={STATES.map((s) => s.next)} /></dd>
            </div>
            <div>
              <dt className="text-muted-foreground">결과</dt>
              <dd className="font-bold text-foreground"><Stack active={scene} items={STATES.map((s) => s.result)} /></dd>
            </div>
          </dl>

          <Stack active={scene} className="mt-3" items={STATES.map((s) => <p key={s.note} className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{s.note}</p>)} />
          </div>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
