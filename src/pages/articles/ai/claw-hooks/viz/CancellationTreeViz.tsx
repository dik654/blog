import SceneShell from "./HookSceneShell";

/**
 * 본문 대응: #cancellation — runner는 direct child에 kill을 요청하고 wait한다.
 * shell이 띄운 descendant, 외부 effect, stdout 일부는 그와 별개로 확인해야 한다.
 * 마지막 장면은 본문 목록의 process identity·effect reconciliation 제안이다.
 */
type Tone = "run" | "off" | "done" | "unknown" | "plan";

interface Row {
  text: string;
  tone: Tone;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  runner: Row;
  child: Row;
  descendant: Row;
  effect: Row;
  stdout: Row;
}

const SCENES: readonly Scene[] = [
  {
    label: "Hook 실행",
    summary: "runner → sh -lc",
    note: "Runner가 hook command를 sh -lc로 넘겨 shell이 direct child로 뜹니다. Runner가 직접 붙잡고 있는 process는 이 하나입니다.",
    runner: { text: "abort signal을 주기적으로 확인", tone: "run" },
    child: { text: "실행 중", tone: "run" },
    descendant: { text: "아직 없음", tone: "off" },
    effect: { text: "아직 없음", tone: "off" },
    stdout: { text: "쓰는 중", tone: "run" },
  },
  {
    label: "Background 시작 (가정)",
    summary: "shell이 descendant를 띄움",
    note: "Hook command 안에서 shell이 background process를 시작했다고 가정합니다. 이 process는 runner가 아니라 shell이 만든 자손이고, file이나 network 작업을 진행할 수 있습니다.",
    runner: { text: "abort signal을 주기적으로 확인", tone: "run" },
    child: { text: "실행 중", tone: "run" },
    descendant: { text: "실행 중", tone: "run" },
    effect: { text: "진행 중 (가정)", tone: "run" },
    stdout: { text: "쓰는 중", tone: "run" },
  },
  {
    label: "취소 요청",
    summary: "direct child에 kill → wait",
    note: "Runner가 abort를 확인하고 direct child에 kill을 요청한 뒤 wait합니다. 이 요청이 직접 향하는 대상은 shell 하나뿐입니다.",
    runner: { text: "kill 요청 후 wait", tone: "run" },
    child: { text: "kill 받음", tone: "run" },
    descendant: { text: "직접 대상 아님 · 함께 끝나는지 미확인", tone: "unknown" },
    effect: { text: "진행 중일 수 있음", tone: "unknown" },
    stdout: { text: "중간에 끊김", tone: "unknown" },
  },
  {
    label: "wait 반환 뒤",
    summary: "child 회수 ≠ 전체 job 종료",
    note: "Direct child는 종료되고 wait로 회수돼 zombie child가 줄어듭니다. 그러나 descendant가 같은 process group으로 묶였는지, file·network effect가 끝났는지, stdout 일부가 남았는지는 이 결과만으로 알 수 없습니다.",
    runner: { text: "wait 반환", tone: "done" },
    child: { text: "종료·회수됨", tone: "done" },
    descendant: { text: "남아 있을 수 있음", tone: "unknown" },
    effect: { text: "완료 여부 별도 확인", tone: "unknown" },
    stdout: { text: "일부만 남았을 수 있음", tone: "unknown" },
  },
  {
    label: "보강 절차 (본문 목록)",
    summary: "그룹으로 묶고 결과를 남김",
    note: "본문이 제안하는 보강입니다. Process group이나 job object로 descendant 범위를 묶어 TERM→KILL→wait 결과를 receipt로 남기고, 외부 변경은 따로 조회하며, retry가 같은 effect를 반복하지 않게 operation identity를 씁니다.",
    runner: { text: "deadline·출력 제한 적용", tone: "plan" },
    child: { text: "그룹 단위 TERM→KILL→wait", tone: "plan" },
    descendant: { text: "같은 그룹으로 정리·receipt", tone: "plan" },
    effect: { text: "외부 변경 조회·operation identity", tone: "plan" },
    stdout: { text: "출력 크기 제한", tone: "plan" },
  },
];

const TONE: Record<Tone, { box: string; tag: string }> = {
  run: { box: "border-border bg-background", tag: "진행" },
  off: { box: "border-dashed border-border/50 text-muted-foreground/60", tag: "없음" },
  done: { box: "border-emerald-600 bg-background", tag: "확인됨" },
  unknown: { box: "border-dashed border-amber-600 bg-background", tag: "미확인" },
  plan: { box: "border-primary bg-background", tag: "보강" },
};

function Node({ title, row, indent }: { title: string; row: Row; indent: number }) {
  const tone = TONE[row.tone];
  const pad = ["", "ml-4 sm:ml-8", "ml-8 sm:ml-16"][indent];
  return (
    <div className={`${pad} min-w-0 rounded-lg border px-3 py-2 ${tone.box}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
        <span className="font-mono font-semibold">{title}</span>
        <span className="text-muted-foreground">{tone.tag}</span>
      </div>
      <p className="mt-1 break-keep text-sm font-semibold">{row.text}</p>
    </div>
  );
}

export default function CancellationTreeViz() {
  return (
    <SceneShell
      eyebrow="취소와 process tree"
      title="Direct child를 회수해도 shell이 띄운 자손은 따로 남을 수 있다"
      description="들여쓴 칸일수록 아래 단계 process입니다. direct child는 runner가 직접 띄운 process, descendant는 그 shell이 다시 띄운 자손 process입니다. effect·stdout 칸은 process 밖에 남는 결과입니다."
      note="Background process를 띄우는 hook은 설명을 위한 가정입니다. 회색 실선은 진행 중, 초록 실선은 wait 반환으로 확인된 상태, 주황 점선은 kill→wait 절차만으로 확인되지 않는 상태, 파란 실선은 본문이 제안하는 보강입니다. 각 칸 오른쪽 글자로도 구분합니다."
      ariaLabel="hook 취소 시 direct child와 descendant, 외부 effect의 상태"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="min-w-0 space-y-2">
              <Node title="hook runner" row={scene.runner} indent={0} />
              <Node title="direct child · sh -lc" row={scene.child} indent={1} />
              <Node title="descendant · background" row={scene.descendant} indent={2} />
            </div>
            <div className="min-w-0 space-y-2">
              <Node title="file·network effect" row={scene.effect} indent={0} />
              <Node title="stdout" row={scene.stdout} indent={0} />
            </div>
          </div>
        );
      }}
    />
  );
}
