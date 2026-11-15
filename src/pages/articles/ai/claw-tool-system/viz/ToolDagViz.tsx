import ToolSceneShell from "./ToolSceneShell";

/**
 * 본문 대응: #dispatch "병렬화는 tool 이름이 아니라 dependency DAG로 결정합니다".
 * 왼쪽 두 read는 같은 immutable snapshot을 보므로 함께 돌고, edit는 둘 다 끝나야, test는 edit receipt 뒤에만 시작한다.
 * 실패 장면의 "grep 실패"와 "edit 일부 쓰기"는 갈래를 보이려는 가정이다.
 */
type NodeState = "run" | "done" | "wait" | "fail" | "blocked" | "partial" | "skip" | "added" | "hidden";

interface DagScene {
  label: string;
  summary: string;
  note: string;
  read: NodeState;
  grep: NodeState;
  edit: NodeState;
  test: NodeState;
  review: NodeState;
}

const SCENES: readonly DagScene[] = [
  { label: "두 read는 함께 돈다", summary: "병렬 후보 2개", note: "read_file(auth.ts)와 grep_search(401)는 같은 immutable workspace snapshot을 읽습니다. 서로의 결과가 필요 없으므로 병렬 후보입니다.", read: "run", grep: "run", edit: "wait", test: "wait", review: "hidden" },
  { label: "edit는 두 결과를 기다린다", summary: "dependency 2개 충족", note: "edit_file은 두 read 결과를 모두 dependency로 받습니다. 하나라도 끝나지 않으면 시작하지 않습니다.", read: "done", grep: "done", edit: "run", test: "wait", review: "hidden" },
  { label: "test는 edit receipt 뒤", summary: "edit receipt → login test", note: "Login test는 edit receipt가 나온 뒤에만 시작합니다. 그래야 test가 수정 뒤에 실행됐다고 말할 수 있습니다.", read: "done", grep: "done", edit: "done", test: "run", review: "hidden" },
  { label: "하나가 실패하면 (가정: grep 실패)", summary: "dependent call 2개 blocked", note: "이미 끝난 read 결과는 숨기지 않습니다. grep에 기대던 edit와, edit에 기대던 test는 blocked_by_dependency로 끝납니다.", read: "done", grep: "fail", edit: "blocked", test: "blocked", review: "hidden" },
  { label: "Edit가 일부만 썼다면 (가정)", summary: "review node 추가 · test 0회", note: "Partial write가 있었다면 compensation·rollback 또는 사람 review를 별도 node로 만들고 test는 실행하지 않습니다.", read: "done", grep: "done", edit: "partial", test: "skip", review: "added" },
];

const STATE_TEXT: Record<NodeState, string> = {
  run: "실행 중",
  done: "완료 · 결과 유지",
  wait: "대기",
  fail: "실패",
  blocked: "blocked_by_dependency",
  partial: "partial_effect",
  skip: "실행 안 함",
  added: "별도 node로 추가",
  hidden: "",
};

const STROKE: Record<NodeState, string> = {
  run: "#2563eb",
  done: "#64748b",
  wait: "#94a3b8",
  fail: "#dc2626",
  blocked: "#d97706",
  partial: "#dc2626",
  skip: "#94a3b8",
  added: "#2563eb",
  hidden: "#94a3b8",
};

function DagNode({ x, y, w, name, state }: { x: number; y: number; w: number; name: string; state: NodeState }) {
  if (state === "hidden") {
    return <rect x={x} y={y} width={w} height={46} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 4" opacity={0.35} />;
  }
  const strong = state === "run" || state === "added" || state === "fail" || state === "partial" || state === "blocked";
  return (
    <g>
      <rect x={x} y={y} width={w} height={46} rx={8} fill="none" stroke={STROKE[state]} strokeWidth={strong ? 1.25 : 1} strokeDasharray={state === "wait" || state === "skip" ? "4 3" : undefined} />
      <text x={x + 8} y={y + 19} fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700} fill="currentColor">
        {name}
      </text>
      <text x={x + 8} y={y + 36} fontSize={9.5} fill={STROKE[state]} fontWeight={strong ? 700 : 400}>
        {STATE_TEXT[state]}
      </text>
    </g>
  );
}

function Edge({ x1, y1, x2, y2, on, dashed = false }: { x1: number; y1: number; x2: number; y2: number; on: boolean; dashed?: boolean }) {
  const color = on ? "#2563eb" : "#94a3b8";
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const back = (offset: number) => `${x2 - 6 * Math.cos(angle) + offset * Math.sin(angle)} ${y2 - 6 * Math.sin(angle) - offset * Math.cos(angle)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 6 * Math.cos(angle)} y2={y2 - 6 * Math.sin(angle)} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${back(4)} L${x2} ${y2} L${back(-4)}`} fill="none" stroke={color} strokeWidth={1} />
    </g>
  );
}

function SnapshotLabel({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <text x={x} y={y} fontSize={10} fill="#64748b">
        같은 immutable
      </text>
      <text x={x} y={y + 13} fontSize={10} fill="#64748b">
        workspace snapshot
      </text>
    </g>
  );
}

export default function ToolDagViz() {
  return (
    <ToolSceneShell
      eyebrow="Dependency DAG"
      title="로그인 수정 네 call의 실행 순서는 의존 관계가 정합니다"
      description="DAG는 방향이 있고 순환이 없는 의존 그래프입니다. 화살표는 '앞 node의 결과가 있어야 뒤 node가 시작한다'는 뜻이고, 같은 열에 선 node는 서로 기다리지 않습니다."
      ariaLabel="read_file과 grep_search가 병렬로 돌고 edit_file, login test로 이어지는 의존 그래프와 실패 갈래"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active] ?? SCENES[0];
        const editStarted = s.edit === "run" || s.edit === "done" || s.edit === "partial";
        const testStarted = s.test === "run";
        return (
          <>
          <svg viewBox="0 0 300 284" role="img" aria-label={s.label} className="block h-auto w-full text-foreground sm:hidden">
            <rect x={2} y={4} width={296} height={80} rx={10} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 4" />
            <DagNode x={8} y={12} w={138} name="read_file(auth.ts)" state={s.read} />
            <DagNode x={154} y={12} w={138} name="grep_search(401)" state={s.grep} />
            <text x={10} y={75} fontSize={10} fill="#64748b">
              같은 immutable workspace snapshot
            </text>
            <Edge x1={77} y1={84} x2={128} y2={140} on={editStarted} />
            <Edge x1={223} y1={84} x2={172} y2={140} on={editStarted} />
            <DagNode x={80} y={140} w={140} name="edit_file" state={s.edit} />
            <Edge x1={130} y1={186} x2={77} y2={226} on={testStarted} dashed={s.test === "skip"} />
            {s.review !== "hidden" && <Edge x1={170} y1={186} x2={223} y2={226} on />}
            <DagNode x={8} y={226} w={138} name="login test" state={s.test} />
            <DagNode x={154} y={226} w={138} name="rollback·review" state={s.review} />
          </svg>
          <svg viewBox="0 0 420 196" role="img" aria-label={s.label} className="hidden h-auto w-full text-foreground sm:block">
            <rect x={2} y={6} width={140} height={150} rx={10} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 4" />
            <SnapshotLabel x={10} y={174} />
            <DagNode x={8} y={18} w={128} name="read_file(auth.ts)" state={s.read} />
            <DagNode x={8} y={98} w={128} name="grep_search(401)" state={s.grep} />
            <Edge x1={136} y1={41} x2={162} y2={71} on={editStarted} />
            <Edge x1={136} y1={121} x2={162} y2={91} on={editStarted} />
            <DagNode x={162} y={58} w={118} name="edit_file" state={s.edit} />
            <Edge x1={280} y1={81} x2={298} y2={81} on={testStarted} dashed={s.test === "skip"} />
            <DagNode x={298} y={58} w={118} name="login test" state={s.test} />
            {s.review !== "hidden" && <Edge x1={221} y1={104} x2={298} y2={150} on />}
            <DagNode x={298} y={128} w={118} name="rollback·review" state={s.review} />
          </svg>
          </>
        );
      }}
    />
  );
}
