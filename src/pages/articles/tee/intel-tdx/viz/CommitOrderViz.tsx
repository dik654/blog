import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-lifecycle — input copy → bounds/schema 검증 → protected computation → private commit → 최소 output copy.
 * crash 위치가 commit 앞인지 뒤인지, 기록(operation ID·page identity·generation·result digest)이 있는지에 따라
 * 재시작 뒤 중복 commit이나 바뀐 page 적용이 생기는지 본다. op#7과 generation 3·4는 설명용 가정이다.
 */
const STEPS = ["입력 복사", "검증", "계산", "private commit", "출력 복사"] as const;

type Cell = "done" | "commit" | "crash" | "idle" | "dup" | "check" | "deny";

const SCENES = [
  {
    label: "정상 순서",
    summary: "commit 1회 · 기록 남김",
    first: ["done", "done", "done", "commit", "done"],
    second: null,
    ledger: ["op#7 · page gen 3", "commit 완료 · result digest"],
    counterLabel: "private commit",
    counter: 1,
    retryNote: "",
    note: "입력을 먼저 안쪽으로 복사하고 검사한 뒤 계산합니다. private commit은 한 번이고, 밖으로 내보내는 출력은 마지막에 최소한만 복사합니다.",
  },
  {
    label: "commit 앞에서 crash",
    summary: "commit 0회",
    first: ["done", "done", "crash", "idle", "idle"],
    second: null,
    ledger: ["op#7 · page gen 3", "계산 중 멈춤 · commit 없음"],
    counterLabel: "private commit",
    counter: 0,
    retryNote: "",
    note: "순서상 private commit 전에 멈췄으므로 이 실행이 commit한 것은 없습니다. 기록에는 어느 단계에서 멈췄는지가 남습니다.",
  },
  {
    label: "commit 뒤 crash, 기록 없이 재시도",
    summary: "commit 2회 · 중복",
    first: ["done", "done", "done", "commit", "crash"],
    second: ["done", "done", "done", "dup", "done"],
    ledger: ["기록 없음", "commit 여부를 알 수 없음"],
    counterLabel: "private commit",
    counter: 2,
    retryNote: "무조건 재시도",
    note: "출력 복사 단계에서 멈췄어도 commit은 이미 끝났습니다. 이를 일시 오류로 보고 무조건 다시 실행하면 같은 operation이 두 번 commit됩니다.",
  },
  {
    label: "기록이 있으면",
    summary: "commit 1회 유지",
    first: ["done", "done", "done", "commit", "crash"],
    second: ["idle", "idle", "idle", "check", "idle"],
    ledger: ["op#7 · page gen 3", "commit 완료 · result digest"],
    counterLabel: "private commit",
    counter: 1,
    retryNote: "기록부터 확인",
    note: "operation ID와 result digest가 commit 완료를 알려 주므로 재시작 뒤 같은 operation을 다시 commit하지 않습니다.",
  },
  {
    label: "page가 바뀐 뒤의 오래된 재시도",
    summary: "gen 3 ≠ 4 → 적용 안 함",
    first: ["done", "done", "crash", "idle", "idle"],
    second: ["idle", "idle", "idle", "deny", "idle"],
    ledger: ["op#7 · page gen 3", "현재 page gen 4 (재할당)"],
    counterLabel: "바뀐 page에 적용",
    counter: 0,
    retryNote: "op#7 재시도",
    note: "그 사이 page가 다른 용도로 다시 할당됐다면 오래된 operation을 그대로 적용하면 안 됩니다. 기록의 generation과 현재 상태를 다시 검사해 맞지 않으면 적용하지 않습니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  first: readonly Cell[];
  second: readonly Cell[] | null;
  ledger: readonly [string, string];
  counterLabel: string;
  counter: number;
  retryNote: string;
  note: string;
}[];

const W = 360;
const H = 236;
const BW = 62;
const BG = 7;
const X0 = 11;
const BH = 34;

const STYLE: Record<Cell, { stroke: string; fill: string; text: string; tag: string; dashed: boolean }> = {
  done: { stroke: "#2563eb", fill: "none", text: "#2563eb", tag: "", dashed: false },
  commit: { stroke: "#16a34a", fill: "#dcfce7", text: "#15803d", tag: "1회째", dashed: false },
  crash: { stroke: "#dc2626", fill: "none", text: "#dc2626", tag: "crash", dashed: false },
  idle: { stroke: "#cbd5e1", fill: "none", text: "#94a3b8", tag: "", dashed: true },
  dup: { stroke: "#dc2626", fill: "#fee2e2", text: "#b91c1c", tag: "2회째", dashed: false },
  check: { stroke: "#16a34a", fill: "none", text: "#15803d", tag: "기록 확인", dashed: false },
  deny: { stroke: "#d97706", fill: "none", text: "#b45309", tag: "gen 불일치", dashed: false },
};

function Row({ y, cells, title }: { y: number; cells: readonly Cell[]; title: string }) {
  return (
    <g>
      <text x={X0} y={y - 6} fontSize={10} fontWeight={700} fill="#64748b">{title}</text>
      {STEPS.map((step, index) => {
        const cell = STYLE[cells[index]];
        const x = X0 + index * (BW + BG);
        return (
          <g key={step}>
            <rect x={x} y={y} width={BW} height={BH} rx={6} fill={cell.fill} stroke={cell.stroke} strokeWidth={1.25} strokeDasharray={cell.dashed ? "3 3" : undefined} />
            <text x={x + BW / 2} y={y + (cell.tag ? 14 : 21)} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={cell.text}>
              {step === "private commit" ? "commit" : step}
            </text>
            {cell.tag && (
              <text x={x + BW / 2} y={y + 27} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={cell.text}>{cell.tag}</text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function CommitOrderViz() {
  return (
    <SceneShell
      eyebrow="Commit 순서와 재시작"
      title="crash가 commit 앞이냐 뒤냐에 따라 재시작이 달라집니다"
      description="칸 하나가 한 단계입니다. 아래 기록은 글이 말하는 operation ID·page identity·generation·result digest이며, op#7과 generation 3·4는 설명용 가정입니다."
      ariaLabel="입력 복사, 검증, 계산, private commit, 출력 복사 순서에서 crash 위치와 기록 유무에 따른 재시작 결과 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const counterColor = scene.counter === 1 ? "#15803d" : scene.counter === 0 ? "#64748b" : "#b91c1c";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Row y={22} cells={scene.first} title="1차 실행" />
            {scene.second ? (
              <Row y={90} cells={scene.second} title={`재시작 · ${scene.retryNote}`} />
            ) : (
              <g>
                <text x={X0} y={84} fontSize={10} fontWeight={700} fill="#94a3b8">재시작</text>
                <rect x={X0} y={90} width={338} height={BH} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                <text x={X0 + 169} y={111} textAnchor="middle" fontSize={10} fill="#94a3b8">이 장면에서는 재시작하지 않음</text>
              </g>
            )}
            <rect x={X0} y={148} width={212} height={72} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={X0 + 10} y={166} fontSize={9} fontWeight={700} fill="#64748b">기록</text>
            <text x={X0 + 10} y={186} fontSize={11.5} fontWeight={700} fill={scene.ledger[0] === "기록 없음" ? "#dc2626" : "#2563eb"}>{scene.ledger[0]}</text>
            <text x={X0 + 10} y={205} fontSize={10} fill="#64748b">{scene.ledger[1]}</text>
            <rect x={X0 + 222} y={148} width={116} height={72} rx={8} fill="none" stroke={counterColor} strokeWidth={1.25} />
            <text x={X0 + 280} y={168} textAnchor="middle" fontSize={10} fontWeight={700} fill="#64748b">{scene.counterLabel}</text>
            <text x={X0 + 280} y={202} textAnchor="middle" fontSize={24} fontWeight={700} fill={counterColor}>{scene.counter}회</text>
          </svg>
        );
      }}
    />
  );
}
