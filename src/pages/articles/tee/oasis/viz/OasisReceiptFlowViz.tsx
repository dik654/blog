import SceneShell from "./OasisSceneShell";

/**
 * 본문 대응: #execution-boundary — ORDER → EXECUTE → COMMIT → RELEASE 네 단계와
 * 실패 주입 표의 "Wrong runtime enclave identity → key release 0".
 * 열 = 네 책임 주체, 줄 = 글이 적은 단계 순서. 앞 단계 상자는 흐리게 남겨
 * 서로 다른 주체가 서로 다른 receipt를 남긴다는 점을 보입니다.
 */
const LANES = [
  { tag: "CONSENSUS", sub: "순서 · registry" },
  { tag: "PARATIME", sub: "compute committee" },
  { tag: "STORAGE", sub: "MKVS data" },
  { tag: "KEY MANAGER", sub: "epoch key policy" },
] as const;

const SCENES = [
  { label: "ORDER", summary: "consensus가 순서를 고정", note: "Consensus가 round·runtime ID·input root(R_in, 실행 전 state 요약)·transaction 묶음을 고정해 compute committee에 넘깁니다. Confidential execution의 plaintext는 consensus가 직접 계산하지 않습니다." },
  { label: "EXECUTE", summary: "R_in → R_out, messages M", note: "Compute committee는 같은 input과 runtime version에서 deterministic transition을 실행해 output root(R_out)와 consensus로 보낼 messages M을 계산합니다." },
  { label: "COMMIT", summary: "commitment + storage receipt", note: "Executor commitment와 storage node의 signed receipt가 consensus 쪽 roothash service로 모입니다. Roothash가 둘과 discrepancy 여부를 검증합니다. Storage receipt가 없으면 root data availability가 확인되기 전이므로 commit을 보류합니다." },
  { label: "RELEASE", summary: "조건이 맞을 때만 key", note: "Key manager는 attested runtime identity·epoch·policy가 맞을 때만 private state key를 제공합니다. Consensus 순서나 state root가 맞았다는 사실이 이 조건을 대신하지 않습니다. 이 key는 runtime이 state를 복호화하는 데 쓰므로 시간상으로는 COMMIT 뒤가 아니며, 별도 receipt라서 마지막 줄에 따로 그렸습니다." },
  { label: "RELEASE 실패", summary: "identity 불일치 → key 0", note: "03절 실패 주입 표의 'Wrong runtime enclave identity' 행입니다. Runtime enclave identity가 policy와 다르면 key manager의 key 지급은 0건이어야 하므로 점선은 보내지 않은 key를 뜻합니다." },
] as const;

const COL = [45, 135, 225, 315] as const;
const ROW = [56, 104, 152, 200] as const;
const BOX_W = 80;
const BOX_H = 36;
const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#475569";
const FAIL = "#dc2626";

function Box({ lane, row, lines, state, tone = ACCENT }: { lane: number; row: number; lines: readonly [string, string]; state: "hidden" | "past" | "active"; tone?: string }) {
  if (state === "hidden") return null;
  const x = COL[lane] - BOX_W / 2;
  const y = ROW[row];
  const active = state === "active";
  return (
    <g opacity={active ? 1 : 0.45}>
      <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={6} fill={active ? tone : "none"} fillOpacity={active ? 0.1 : 0} stroke={active ? tone : MUTED} strokeWidth={active ? 1.25 : 1} />
      <text x={COL[lane]} y={y + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill={active ? tone : TEXT}>{lines[0]}</text>
      <text x={COL[lane]} y={y + 28} textAnchor="middle" fontSize={9} fill={TEXT}>{lines[1]}</text>
    </g>
  );
}

function Arrow({ d, label, lx, ly, state, tone = ACCENT, id, anchor = "middle", dashed = false }: { d: string; label: string; lx: number; ly: number; state: "hidden" | "past" | "active"; tone?: string; id: string; anchor?: "start" | "middle" | "end"; dashed?: boolean }) {
  if (state === "hidden") return null;
  const active = state === "active";
  const color = active ? tone : MUTED;
  return (
    <g opacity={active ? 1 : 0.45}>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0L7 3.5L0 7Z" fill={color} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={active ? 1.25 : 1} strokeDasharray={dashed ? "4 3" : undefined} markerEnd={`url(#${id})`} />
      <text x={lx} y={ly} textAnchor={anchor} fontSize={9} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function OasisReceiptFlowViz() {
  return (
    <SceneShell
      eyebrow="한 payroll transaction"
      title="네 주체가 서로 다른 receipt를 남깁니다"
      description="열은 책임 주체, 줄은 아래 네 receipt입니다. 지난 단계의 상자는 흐리게 남습니다."
      ariaLabel="Oasis에서 consensus, ParaTime, storage, key manager가 단계별로 남기는 receipt"
      scenes={SCENES}
      render={(active) => {
        const st = (step: number): "hidden" | "past" | "active" => (active < step ? "hidden" : active === step ? "active" : "past");
        const releaseFailed = active === 4;
        const release = active >= 3 ? "active" : "hidden";
        return (
          <svg viewBox="0 0 360 246" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {LANES.map((lane, i) => (
              <g key={lane.tag}>
                <text x={COL[i]} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>{lane.tag}</text>
                <text x={COL[i]} y={30} textAnchor="middle" fontSize={8.5} fill={TEXT}>{lane.sub}</text>
                <line x1={COL[i]} x2={COL[i]} y1={40} y2={242} stroke={MUTED} strokeWidth={1} strokeDasharray="2 4" opacity={0.6} />
              </g>
            ))}
            <Box lane={0} row={0} lines={["round · R_in", "tx 순서 고정"]} state={st(0)} />
            <Arrow id="oasis-flow-a" d="M70 92 L108 104" label="batch" lx={100} ly={92} anchor="start" state={st(0)} />
            <Box lane={1} row={1} lines={["R_in → R_out", "messages M"]} state={st(1)} />
            <Arrow id="oasis-flow-b" d="M108 140 L72 152" label="commitment" lx={98} ly={152} anchor="start" state={st(2)} />
            <Box lane={0} row={2} lines={["roothash", "검증 · 보관"]} state={st(2)} />
            <Box lane={2} row={2} lines={["R_out data", "signed receipt"]} state={st(2)} />
            <Arrow id="oasis-flow-c" d="M185 178 L87 178" label="receipt" lx={136} ly={172} state={st(2)} />
            <Box
              lane={3}
              row={3}
              lines={releaseFailed ? ["identity 불일치", "policy와 다름"] : ["identity·epoch", "policy 확인"]}
              state={release}
              tone={releaseFailed ? FAIL : ACCENT}
            />
            {active >= 3 && (
              <Arrow
                id={releaseFailed ? "oasis-flow-x" : "oasis-flow-d"}
                d="M275 218 L177 218"
                label={releaseFailed ? "key 지급 0" : "state key"}
                lx={226}
                ly={209}
                state="active"
                tone={releaseFailed ? FAIL : ACCENT}
                dashed={releaseFailed}
              />
            )}
            {releaseFailed && (
              <g stroke={FAIL} strokeWidth={1.25}>
                <line x1={220} y1={213} x2={232} y2={223} />
                <line x1={232} y1={213} x2={220} y2={223} />
              </g>
            )}
            <Box
              lane={1}
              row={3}
              lines={releaseFailed ? ["private state", "key 없음"] : ["private state", "key 받음"]}
              state={release}
              tone={releaseFailed ? FAIL : ACCENT}
            />
          </svg>
        );
      }}
    />
  );
}
