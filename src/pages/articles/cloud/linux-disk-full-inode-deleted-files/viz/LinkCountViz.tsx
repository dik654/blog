import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 이름(디렉터리 항목) → inode → 데이터 블록의 세 층을 그린다.
 * inode는 이름 수(i_nlink)와 열린 참조 수를 따로 세고, 둘 다 0일 때만 블록을 돌려준다.
 * 마지막 장면은 symbolic link가 inode가 아니라 경로 문자열을 가리킨다는 점을 보인다.
 */
const SCENES = ["열고 쓰는 중", "ln으로 이름 추가", "rm app.log.1", "rm app.log", "fd 7 닫힘", "ln -s와 끊긴 링크"] as const;

interface Scene {
  names: readonly string[];
  nlink: number;
  opens: number;
  blocks: "held" | "freed";
  symlink: boolean;
  lsof: string;
  note: string;
}

const STATES: readonly Scene[] = [
  {
    names: ["app.log"],
    nlink: 1,
    opens: 1,
    blocks: "held",
    symlink: false,
    lsof: "lsof → java 812 FD 7w /var/log/app.log",
    note: "java(PID 812)가 fd 7로 app.log를 열어 30GiB를 썼습니다. 이름 하나, 열린 참조 하나입니다.",
  },
  {
    names: ["app.log", "app.log.1"],
    nlink: 2,
    opens: 1,
    blocks: "held",
    symlink: false,
    lsof: "lsof → java 812 FD 7w /var/log/app.log",
    note: "hard link는 같은 inode 번호를 가리키는 두 번째 이름입니다. 블록은 복사되지 않아 30GiB 그대로이고 링크 수만 2가 됩니다.",
  },
  {
    names: ["app.log"],
    nlink: 1,
    opens: 1,
    blocks: "held",
    symlink: false,
    lsof: "lsof → java 812 FD 7w /var/log/app.log",
    note: "이름 하나를 지우면 링크 수가 1 줄어듭니다. 다른 이름이 남아 있으므로 블록은 움직이지 않습니다.",
  },
  {
    names: [],
    nlink: 0,
    opens: 1,
    blocks: "held",
    symlink: false,
    lsof: "lsof +L1 → java 812 FD 7w NLINK 0 /var/log/app.log (deleted)",
    note: "마지막 이름이 사라져 링크 수는 0입니다. 그래도 fd 7이 inode를 붙잡고 있어 블록 30GiB는 그대로입니다. lsof +L1이 찾는 상태입니다.",
  },
  {
    names: [],
    nlink: 0,
    opens: 0,
    blocks: "freed",
    symlink: false,
    lsof: "lsof +L1 → (출력 없음)",
    note: "프로세스가 fd를 닫거나 끝나면 마지막 참조가 놓입니다. 링크 수 0, 참조 0이라 inode가 evict되고 블록이 빈칸으로 돌아옵니다.",
  },
  {
    names: ["app.log"],
    nlink: 1,
    opens: 0,
    blocks: "held",
    symlink: true,
    lsof: "current.log → \"app.log\"",
    note: "ln -s app.log current.log는 경로 문자열 app.log를 담은 새 inode 2001을 만듭니다. inode 1311의 링크 수는 1 그대로이고, 나중에 app.log를 지우면 current.log는 없는 경로를 가리키는 끊긴 링크가 됩니다.",
  },
];

function Box({ title, children, tone }: { title: string; children: ReactNode; tone: string }) {
  return (
    <div className="min-w-0 rounded-md border px-3 py-2" style={{ borderColor: tone }}>
      <p className="text-[11px] font-black" style={{ color: tone }}>
        {title}
      </p>
      <div className="mt-1 text-xs text-foreground">{children}</div>
    </div>
  );
}

export default function LinkCountViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  const state = STATES[scene];
  const freed = state.blocks === "freed";

  return (
    <VizFrame
      eyebrow="Name · inode · blocks"
      title="이름과 열린 fd가 모두 사라져야 블록이 풀립니다"
      description="왼쪽은 디렉터리에 적힌 이름, 가운데는 inode의 두 카운터, 오른쪽은 데이터 블록입니다. 화살표 대신 같은 inode 번호 1311로 연결을 표시했습니다."
      note="inode 번호 1311, PID 812, fd 7, 30GiB는 설명용 가정입니다. 열린 참조 수는 커널의 i_count를 단순화한 값입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="링크 수와 열린 참조"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-1 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Box title="디렉터리 /var/log" tone="#2563eb">
              <ul className="min-h-[3.25rem] space-y-1 font-mono">
                {state.names.length === 0 ? (
                  <li className="text-muted-foreground">이름 없음</li>
                ) : (
                  state.names.map((name) => <li key={name}>{name} → 1311</li>)
                )}
                {state.symlink ? <li className="text-muted-foreground">current.log → 2001</li> : null}
              </ul>
            </Box>
            <Box title="inode 1311" tone="#7c3aed">
              <dl className="grid grid-cols-2 gap-1 font-mono">
                <dt className="text-muted-foreground">링크 수</dt>
                <dd className="font-bold">{state.nlink}</dd>
                <dt className="text-muted-foreground">열린 참조</dt>
                <dd className="font-bold">{state.opens}</dd>
              </dl>
              <p aria-hidden={!state.symlink} className={`mt-1 font-mono text-muted-foreground ${state.symlink ? "" : "invisible"}`}>inode 2001: &quot;app.log&quot;</p>
            </Box>
            <Box title="데이터 블록" tone={freed ? "#16a34a" : "#dc2626"}>
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 rounded-sm bg-muted/60">
                  <div
                    className="h-full rounded-sm transition-[width] duration-500"
                    style={{ width: freed ? "0%" : "100%", backgroundColor: "#dc2626" }}
                  />
                </div>
                <span className="font-mono font-bold">{freed ? "0" : "30GiB"}</span>
              </div>
              <p className="mt-1 text-muted-foreground">{freed ? "빈칸으로 반환" : "붙잡힘"}</p>
            </Box>
          </div>

          <p className="mt-3 min-h-[2.4rem] break-all font-mono text-[11px] text-muted-foreground sm:min-h-0">{state.lsof}</p>

          <p className="mt-3 min-h-[12rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10.5rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
