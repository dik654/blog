import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-lifecycle — (복사 전 length·pointer 범위 검사) input copy → bounds/schema 검증 → protected computation → private commit → 최소 output copy.
 * SGX 설정의 ENTER(ECALL)·LEAVE(OCALL)와 failure 표의 "Oversized ECALL length"(복사 전 거부, commit 0회),
 * "Host가 OCALL response 변조"(schema·operation ID 검증 실패로 rollback)를 같은 다섯 칸 위에 놓는다.
 * 마지막 두 장면은 operation ID·result digest 기록 유무에 따른 재시작. op#7은 설명용 가정이다.
 */
const STEPS = ["입력 복사", "검증", "계산", "commit", "출력 복사"] as const;

type Cell = "done" | "commit" | "idle" | "deny" | "rollback" | "crash";

type Scene = {
  label: string;
  summary: string;
  cells: readonly Cell[];
  host: string;
  inArrow: "ok" | "blocked" | "none";
  outArrow: boolean;
  ocall: "none" | "tampered";
  ledger: readonly [string, string];
  counter: number;
  /** counter가 확정값이 아니라 가능한 최댓값일 때(기록 없이 재시작) 붙이는 hedge */
  possible?: boolean;
  note: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "정상 ECALL",
    summary: "commit 1회",
    cells: ["done", "done", "done", "commit", "done"],
    host: "EDL entry로 ECALL · pointer와 length 제시",
    inArrow: "ok",
    outArrow: true,
    ocall: "none",
    ledger: ["op#7", "commit 완료 · result digest"],
    counter: 1,
    note: "밖에서 온 pointer·length의 size·range·alias·integer overflow를 복사 전에 검사하고, 안쪽 복사본을 다시 검사합니다. 출력은 commit 뒤에 최소만 내보냅니다.",
  },
  {
    label: "length가 너무 큰 ECALL",
    summary: "복사 전 거부 · commit 0회",
    cells: ["deny", "idle", "idle", "idle", "idle"],
    host: "ECALL length를 허용 범위보다 크게 제시",
    inArrow: "blocked",
    outArrow: false,
    ocall: "none",
    ledger: ["op#7", "length 검사 실패 · 복사하지 않음"],
    counter: 0,
    note: "Pointer와 length는 신뢰하지 않는 입력입니다. 범위를 넘는 length는 복사하기 전에 거부하므로 enclave state commit은 0회입니다.",
  },
  {
    label: "Host가 OCALL 응답을 바꿈",
    summary: "검증 실패 → rollback · commit 0회",
    cells: ["done", "done", "rollback", "idle", "idle"],
    host: "OCALL로 I/O 처리 · 돌려주는 응답을 변조",
    inArrow: "ok",
    outArrow: false,
    ocall: "tampered",
    ledger: ["op#7", "response schema·operation ID 불일치"],
    counter: 0,
    note: "나가는 OCALL 메시지는 최소로 줄이고, 돌아온 응답은 다시 신뢰하지 않는 입력으로 검사합니다. Schema·operation ID가 맞지 않으면 rollback합니다.",
  },
  {
    label: "commit 뒤 crash, 기록 없이 재시작",
    summary: "같은 operation이 2회 commit될 수 있음",
    cells: ["done", "done", "done", "commit", "crash"],
    host: "출력 복사 중 crash → 처음부터 다시 ECALL",
    inArrow: "ok",
    outArrow: false,
    ocall: "none",
    ledger: ["기록 없음", "재시작이 commit을 한 번 더 실행할 수 있음"],
    counter: 2,
    possible: true,
    note: "Commit은 이미 끝났는데 기록 없이 일시 오류처럼 다시 실행하면 같은 operation이 두 번 commit될 수 있습니다.",
  },
  {
    label: "기록이 있으면",
    summary: "commit 1회 유지",
    cells: ["done", "done", "done", "commit", "crash"],
    host: "출력 복사 중 crash → 같은 op#7로 재시작",
    inArrow: "ok",
    outArrow: false,
    ocall: "none",
    ledger: ["op#7", "commit 완료 확인 → 다시 commit 안 함"],
    counter: 1,
    note: "Operation ID와 result digest가 commit 완료를 알려 주므로 재시작한 실행은 같은 operation을 다시 commit하지 않습니다.",
  },
];

const W = 360;
const H = 240;
const BW = 62;
const BG = 7;
const X0 = 11;
const CY = 100;
const BH = 36;
const ACCENT = "#2563eb";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const FAINT = "#cbd5e1";
const ALERT = "#dc2626";

const STYLE: Record<Cell, { stroke: string; fill: string; text: string; tag: string; dashed: boolean }> = {
  done: { stroke: ACCENT, fill: "none", text: ACCENT, tag: "", dashed: false },
  commit: { stroke: "#16a34a", fill: "#dcfce7", text: "#15803d", tag: "완료", dashed: false },
  idle: { stroke: FAINT, fill: "none", text: LINE, tag: "", dashed: true },
  deny: { stroke: ALERT, fill: "none", text: ALERT, tag: "복사 전 거부", dashed: false },
  rollback: { stroke: ALERT, fill: "none", text: ALERT, tag: "rollback", dashed: false },
  crash: { stroke: ALERT, fill: "none", text: ALERT, tag: "crash", dashed: false },
};

function cx(index: number) {
  return X0 + index * (BW + BG) + BW / 2;
}

function VArrow({ x, from, to, color, dashed = false }: { x: number; from: number; to: number; color: string; dashed?: boolean }) {
  const dir = to > from ? 1 : -1;
  return (
    <g>
      <line x1={x} x2={x} y1={from} y2={to - dir * 3} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 3" : undefined} />
      <path d={`M${x - 3} ${to - dir * 5} L${x} ${to} L${x + 3} ${to - dir * 5}`} fill="none" stroke={color} strokeWidth={1.25} />
    </g>
  );
}

export default function EnclaveCallOrderViz() {
  return (
    <SceneShell
      eyebrow="Enclave 경계와 commit 순서"
      title="밖에서 온 값은 복사·검사한 뒤에만 private state에 commit됩니다"
      description="위 띠는 신뢰하지 않는 host process, 점선 아래가 enclave입니다. 칸 하나가 한 단계이고, commit은 enclave private state를 확정하는 단계입니다. op#7은 설명용 가정입니다."
      ariaLabel="ECALL 입력 복사, 검증, 계산, commit, 출력 복사 순서에서 length 초과, OCALL 응답 변조, commit 뒤 crash와 재시작을 비교하는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const counterColor = scene.counter === 1 ? "#15803d" : scene.counter === 0 ? MUTED : "#b91c1c";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={X0} y={6} width={338} height={42} rx={8} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={X0 + 10} y={22} fontSize={10.5} fontWeight={700} fill={MUTED}>HOST process · 신뢰하지 않음</text>
            <text x={X0 + 10} y={39} fontSize={10.5} fontWeight={700} fill={MUTED}>{scene.host}</text>

            <line x1={X0} x2={X0 + 338} y1={70} y2={70} stroke={MUTED} strokeWidth={1} strokeDasharray="5 4" />
            <text x={X0 + 338} y={84} textAnchor="end" fontSize={10.5} fontWeight={700} fill={MUTED}>enclave 경계 안쪽</text>

            {scene.inArrow !== "none" && (
              <VArrow x={cx(0)} from={48} to={CY} color={scene.inArrow === "blocked" ? ALERT : ACCENT} dashed={scene.inArrow === "blocked"} />
            )}
            {scene.inArrow === "blocked" && (
              <g>
                <line x1={cx(0) - 6} x2={cx(0) + 6} y1={64} y2={76} stroke={ALERT} strokeWidth={1.25} />
                <line x1={cx(0) + 6} x2={cx(0) - 6} y1={64} y2={76} stroke={ALERT} strokeWidth={1.25} />
              </g>
            )}
            {scene.outArrow && <VArrow x={cx(4)} from={CY} to={48} color={ACCENT} />}
            {scene.ocall === "tampered" && (
              <g>
                <VArrow x={cx(2) - 9} from={CY} to={48} color={ACCENT} />
                <VArrow x={cx(2) + 9} from={48} to={CY} color={ALERT} />
                <text x={cx(2) - 14} y={63} textAnchor="end" fontSize={10.5} fill={ACCENT}>최소 메시지</text>
                <text x={cx(2) + 14} y={63} fontSize={10.5} fill={ALERT}>변조된 응답</text>
              </g>
            )}

            {STEPS.map((step, index) => {
              const cell = STYLE[scene.cells[index]];
              const x = X0 + index * (BW + BG);
              return (
                <g key={step}>
                  <rect x={x} y={CY} width={BW} height={BH} rx={6} fill={cell.fill} stroke={cell.stroke} strokeWidth={1.25} strokeDasharray={cell.dashed ? "3 3" : undefined} />
                  <text x={x + BW / 2} y={CY + (cell.tag ? 15 : 22)} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={cell.text}>{step}</text>
                  {cell.tag && <text x={x + BW / 2} y={CY + 29} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={cell.text}>{cell.tag}</text>}
                </g>
              );
            })}

            <rect x={X0} y={154} width={212} height={72} rx={8} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={X0 + 10} y={172} fontSize={9.5} fontWeight={700} fill={MUTED}>기록</text>
            <text x={X0 + 10} y={192} fontSize={11.5} fontWeight={700} fill={scene.ledger[0] === "기록 없음" ? ALERT : ACCENT}>{scene.ledger[0]}</text>
            <text x={X0 + 10} y={211} fontSize={10} fill={MUTED}>{scene.ledger[1]}</text>
            <rect x={X0 + 222} y={154} width={116} height={72} rx={8} fill="none" stroke={counterColor} strokeWidth={1.25} />
            <text x={X0 + 280} y={174} textAnchor="middle" fontSize={10} fontWeight={700} fill={MUTED}>private commit</text>
            <text x={X0 + 280} y={scene.possible ? 202 : 208} textAnchor="middle" fontSize={24} fontWeight={700} fill={counterColor}>{scene.counter}회</text>
            {scene.possible && <text x={X0 + 280} y={218} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={counterColor}>될 수 있음</text>}
          </svg>
        );
      }}
    />
  );
}
