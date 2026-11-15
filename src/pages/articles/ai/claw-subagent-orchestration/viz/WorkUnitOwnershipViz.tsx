import OrchestrationSceneShell from "./OrchestrationSceneShell";

/**
 * 본문 대응: #team-lead-workers "병렬성은 dependency와 write ownership으로 제한한다".
 * 1절의 로그인 401 사례를 그대로 쓴다. 읽기 전용 원인 추적(A) → patch·test(B) 의존 1개,
 * src/auth.ts 쓰기 owner 1명. 두 번째 writer는 경계를 보이려는 가정 장면이다.
 */
type UnitState = "ready" | "wait" | "run" | "done";

const STATE_TEXT: Record<UnitState, string> = {
  ready: "준비됨",
  wait: "대기",
  run: "실행 중",
  done: "반환함",
};

const STATE_CLASS: Record<UnitState, string> = {
  ready: "border-border bg-background",
  wait: "border-dashed border-border bg-background",
  run: "border-primary bg-primary/5",
  done: "border-emerald-600 bg-background",
};

const SCENES = [
  {
    label: "계약 정하기",
    summary: "unit 2개 · 의존 1개 · 쓰기 owner 1명",
    a: "ready",
    aNote: "읽기 전용. 쓸 파일 없음",
    b: "wait",
    bNote: "원인 추적 결과가 있어야 시작",
    link: "A의 결과가 B 계약의 입력",
    owner: "patch·test (예정)",
    second: null,
    main: "아직 전달할 것 없음",
    note: "Coordinator는 두 일을 나누면서 무엇이 무엇을 기다리는지, src/auth.ts를 누가 고치는지를 먼저 정합니다. 원인 추적은 파일을 고치지 않으므로 쓰기 owner가 필요 없습니다.",
  },
  {
    label: "준비된 unit만 시작",
    summary: "A 실행 · B 대기",
    a: "run",
    aNote: "file·line evidence를 찾는 중",
    b: "wait",
    bNote: "선행 결과가 아직 없음",
    link: "A 결과 대기 중",
    owner: "patch·test (예정)",
    second: null,
    main: "아직 전달할 것 없음",
    note: "Dependency graph에서 준비된 unit만 시작합니다. Patch·test는 원인 추적 결과가 올 때까지 시작하지 않습니다.",
  },
  {
    label: "선행 결과로 계약 갱신",
    summary: "A 반환 → B 계약 갱신 → B 실행",
    a: "done",
    aNote: "file·line evidence 반환",
    b: "run",
    bNote: "갱신된 계약으로 좁은 patch 작성",
    link: "evidence가 B의 범위를 좁힘",
    owner: "patch·test (실행 중)",
    second: null,
    main: "아직 전달할 것 없음",
    note: "선행 결과가 나오거나 바뀌면 coordinator가 downstream 계약을 갱신한 뒤 시작합니다. 이제 src/auth.ts에는 owner 한 명만 씁니다.",
  },
  {
    label: "같은 파일의 두 번째 writer (가정)",
    summary: "동시 수정 대신 순서 또는 통합",
    a: "done",
    aNote: "file·line evidence 반환",
    b: "run",
    bNote: "src/auth.ts owner",
    link: "evidence가 B의 범위를 좁힘",
    owner: "patch·test (실행 중)",
    second: "다른 worker도 src/auth.ts를 고치려 함 (가정) → 순서를 정하거나 owner가 통합",
    main: "아직 전달할 것 없음",
    note: "같은 file을 건드리는 작업은 순서를 정하거나 한 owner가 통합합니다. 별도 worktree는 충돌을 늦춰 줄 수 있지만 의미 충돌을 없애 주지는 않습니다.",
  },
  {
    label: "artifact 회수",
    summary: "diff·test receipt 확인 후 main으로",
    a: "done",
    aNote: "file·line evidence 반환",
    b: "done",
    bNote: "diff·test receipt 반환",
    link: "evidence가 B의 범위를 좁힘",
    owner: "patch·test (반환함)",
    second: null,
    main: "artifact가 있고 test가 실제 변경을 검증하는지 확인한 뒤 전달",
    note: "“수정 완료”라는 요약이 아니라 diff와 deterministic test receipt를 회수합니다. Coordinator가 그 artifact가 실제로 있고 test가 변경을 검증하는지 본 뒤 main agent에 넘깁니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  a: UnitState;
  aNote: string;
  b: UnitState;
  bNote: string;
  link: string;
  owner: string;
  second: string | null;
  main: string;
  note: string;
}[];

function UnitCard({ tag, title, scope, state, note }: { tag: string; title: string; scope: string; state: UnitState; note: string }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-3 transition-colors duration-300 motion-reduce:transition-none ${STATE_CLASS[state]}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="text-sm font-bold">
          {tag} · {title}
        </span>
        <span className="font-mono text-xs font-bold text-primary">{STATE_TEXT[state]}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{scope}</p>
      <p className="mt-2 text-xs leading-5">{note}</p>
    </div>
  );
}

export default function WorkUnitOwnershipViz() {
  return (
    <OrchestrationSceneShell
      eyebrow="dependency · write ownership"
      title="로그인 401 작업에서 준비된 unit만 시작하고 src/auth.ts는 한 owner가 고칩니다"
      description="글 첫머리의 로그인 401 사례를 그대로 씁니다. Work unit은 worker 한 명에게 맡기는 작업 단위이고, write owner는 그 파일에 쓰기를 허락받은 단 하나의 주체입니다."
      note="이 흐름은 본문이 제시하는 hardening 계약입니다. 고정 commit b71afdd…의 claw-analog agents runner가 병렬 dependency scheduler를 구현했다는 뜻은 아닙니다."
      ariaLabel="원인 추적과 patch·test 두 work unit의 의존 관계와 src/auth.ts 쓰기 owner가 장면마다 바뀌는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
              <UnitCard tag="A" title="원인 추적" scope="읽기 전용" state={scene.a} note={scene.aNote} />
              <div className="flex items-center justify-center text-center text-xs text-muted-foreground sm:w-28">
                <span>
                  <span aria-hidden className="block text-base leading-5 text-primary">
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                  {scene.link}
                </span>
              </div>
              <UnitCard tag="B" title="patch·test" scope="쓰기: src/auth.ts" state={scene.b} note={scene.bNote} />
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5">
                <span className="block font-bold">src/auth.ts 쓰기 owner</span>
                <span className="font-mono">{scene.owner}</span>
              </div>
              <div
                className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${
                  scene.second ? "border-dashed border-amber-600 bg-background" : "border-dashed border-border/50"
                }`}
              >
                <span className="block font-bold">같은 파일의 다른 writer</span>
                <span className={scene.second ? "" : "text-muted-foreground/60"}>{scene.second ?? "없음"}</span>
              </div>
            </div>
            <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5">
              <span className="font-bold">Coordinator → main agent: </span>
              <span>{scene.main}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
