import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #seccomp — 필터는 호출 번호와 인자 값을 보고 동작을 고른다.
 * openat의 경로 인자는 포인터 값이라 Seccomp가 파일 경로 정책을 대신하지 않는다.
 * 허용된 호출은 공유 호스트 커널이 처리하고 경로 허용 범위는 Mount·DAC·LSM이 따로 정한다.
 * 주소 0x7ffd…a0은 그림을 위한 가정 값이다.
 */
const SCENES = [
  {
    label: "호출이 넘기는 값",
    summary: "번호 1개 + 인자 3개",
    note: "openat이 커널에 넘기는 것은 호출 번호와 인자 값입니다. 두 번째 인자에는 경로 글자가 아니라 포인터, 곧 그 글자가 놓인 메모리 위치를 가리키는 숫자가 들어 있습니다.",
  },
  {
    label: "필터가 보는 값",
    summary: "판정 입력 = 번호와 인자 값",
    note: "Seccomp BPF는 호출 번호와 인자를 보고 동작을 고르는 작은 검사 프로그램입니다. 경로 인자에서 필터가 받는 것은 주소 숫자이므로 Seccomp가 파일 경로 정책을 대신하지 않습니다.",
  },
  {
    label: "판정과 그 뒤",
    summary: "허용 → 공유 호스트 커널",
    note: "필터는 실행·오류 반환·로그·프로세스 종료 같은 동작을 고릅니다. RuntimeDefault 프로필이 ptrace 같은 일부 호출을 막아도 허용된 openat은 호스트 커널로 들어가고, 어느 경로를 열 수 있는지는 Mount·DAC·LSM 같은 경계가 따로 정합니다.",
  },
] as const;

const ARGS = [
  { name: "호출 번호", value: "openat", kind: "number" },
  { name: "인자 1", value: "AT_FDCWD", kind: "number" },
  { name: "인자 2", value: "0x7ffd…a0 (가정)", kind: "pointer" },
  { name: "인자 3", value: "O_RDONLY", kind: "number" },
] as const;

const ACTIONS = [
  { name: "실행", code: "ALLOW", hit: true },
  { name: "오류 반환", code: "ERRNO", hit: false },
  { name: "로그", code: "LOG", hit: false },
  { name: "프로세스 종료", code: "KILL", hit: false },
] as const;

function ArgRows({ dimMemory, filterBox }: { dimMemory: boolean; filterBox: boolean }) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className={`min-w-0 rounded-lg border p-3 ${filterBox ? "border-[#2563eb]" : "border-border"}`}>
        <p className="text-xs font-bold text-muted-foreground">
          {filterBox ? "Seccomp 필터에 들어가는 값" : "커널에 넘기는 값"}
        </p>
        <ul className="mt-2 space-y-1.5">
          {ARGS.map((a) => (
            <li key={a.name} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">{a.name}</span>
              <span
                className={`min-w-0 break-all rounded border px-2 py-1 font-mono ${
                  a.kind === "pointer" ? "border-[#d97706] font-bold" : "border-border"
                }`}
              >
                {a.value}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          openat·AT_FDCWD·O_RDONLY는 읽기 쉽게 붙인 이름이고, 실제로 넘어가는 것은 각 이름에 해당하는 숫자 값입니다.
        </p>
      </div>
      <div className={`min-w-0 rounded-lg border border-dashed p-3 ${dimMemory ? "border-border/60 opacity-50" : "border-[#d97706]"}`}>
        <p className="text-xs font-bold text-muted-foreground">프로세스 메모리 · 0x7ffd…a0 위치 (가정)</p>
        <p className="mt-2 break-all rounded border border-border px-2 py-1 font-mono text-xs sm:text-sm">/workspace/report-91.md</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {dimMemory
            ? "인자 값에 들어 있는 것은 이 위치의 주소입니다. 경로 글자는 판정 입력이 아닙니다."
            : "인자 2의 숫자가 가리키는 곳에 경로 글자가 있습니다."}
        </p>
      </div>
    </div>
  );
}

function Verdict() {
  return (
    <div className="min-w-0 space-y-4">
      <p className="text-xs font-bold text-muted-foreground">openat에 고르는 동작 · 이 예에서는 허용했다고 가정</p>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
        {ACTIONS.map((a) => (
          <div
            key={a.code}
            className={`min-w-0 rounded-lg border px-2 py-2 text-center text-xs leading-5 ${
              a.hit ? "border-[#2563eb] font-bold" : "border-border text-muted-foreground"
            }`}
          >
            <span className="block">{a.name}</span>
            <span className="block font-mono">{a.code}</span>
          </div>
        ))}
      </div>
      <div className="grid min-w-0 gap-2 text-xs leading-5 sm:text-sm">
        <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-2">
          <span className="font-mono text-muted-foreground">ptrace</span>
          <span className="min-w-0 rounded border border-dashed border-[#dc2626] px-2 py-1">RuntimeDefault(Kubernetes가 고르는 런타임 기본 프로필)가 막는 호출의 예 · 실행되지 않음</span>
        </div>
        <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-2">
          <span className="font-mono font-bold">openat</span>
          <span className="min-w-0 rounded border border-[#2563eb] px-2 py-1 font-bold">허용 → 공유 호스트 커널이 실제로 처리</span>
        </div>
      </div>
      <div className="rounded-lg border border-border p-3 text-xs leading-5 sm:text-sm">
        <p className="font-bold">이 경로를 열어도 되는가는 필터 밖에서</p>
        <p className="mt-1 text-muted-foreground">
          Mount(프로세스에 보이는 파일시스템 배치) · DAC(파일 소유자와 권한 비트) · LSM(커널 보안 모듈의 정책)
        </p>
      </div>
    </div>
  );
}

export default function SeccompArgumentViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const labels = SCENES.map((s) => s.label);

  return (
    <VizFrame
      eyebrow="Seccomp가 보는 것"
      title="필터는 경로 글자가 아니라 인자 값을 봅니다"
      description="같은 openat 호출을 Seccomp 필터 입장에서 봅니다. 경로 인자는 메모리 주소를 담은 포인터라서, 필터가 고르는 것은 그 호출에 대한 동작까지입니다."
      note="주소 0x7ffd…a0은 설명을 위한 가정 값입니다. 필터의 실제 허용 목록은 프로필과 런타임 릴리스에 따라 다릅니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="openat의 인자 값과 Seccomp 필터 판정, 허용 뒤 경로 검사 위치"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={[
            <ArgRows key="args" dimMemory={false} filterBox={false} />,
            <ArgRows key="filter" dimMemory filterBox />,
            <Verdict key="verdict" />,
          ]}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((s) => s.note)} />
      </div>
    </VizFrame>
  );
}
