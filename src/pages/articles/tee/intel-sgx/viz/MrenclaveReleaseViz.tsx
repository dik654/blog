import SceneShell from "./SceneShell";

/**
 * 본문 대응: #measurement-attestation — D_i = H(D_{i-1} ‖ t_i ‖ a_i ‖ H(P_i)) 공통 모형을
 * SGX lifecycle의 BUILD(ECREATE → EADD → EEXTEND)와 PROVE(report → quote) 위에 놓는다.
 * 실제 SGX encoding이 아니라 글이 밝힌 공통 모형이다. page 두 장은 가정이고 digest는 이름(D1, D2)만 쓴다.
 * MRENCLAVE가 runtime input·OCALL result를 측정하지 않는다는 점, 그리고 failure 표의
 * "Old valid quote replay → fresh nonce 불일치로 key release 0회"를 마지막 장면으로 둔다.
 */
type Scene = {
  label: string;
  summary: string;
  mode: "build" | "swap" | "runtime" | "prove" | "replay";
  note: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "BUILD · page를 순서대로 접습니다",
    summary: "D0 → D1 → D2 = MRENCLAVE",
    mode: "build",
    note: "Page를 넣을 때마다 직전 digest에 t·a·H(P)를 붙여 다시 hash합니다. 마지막 값에 page 내용·위치·순서가 함께 들어갑니다.",
  },
  {
    label: "같은 page, 다른 순서",
    summary: "D2′ ≠ D2",
    mode: "swap",
    note: "Page bytes가 같아도 순서가 바뀌면 hash 입력이 달라집니다. 글의 전제(collision resistance) 아래 다른 identity로 볼 수 있습니다.",
  },
  {
    label: "MRENCLAVE가 측정하지 않는 것",
    summary: "runtime 값이 와도 그대로",
    mode: "runtime",
    note: "Runtime input, OCALL result, side-channel 안전, 업무 정답은 MRENCLAVE에 들어가지 않으므로 따로 확인해야 합니다.",
  },
  {
    label: "PROVE · 네 가지를 모두 확인",
    summary: "payroll key 지급 1회",
    mode: "prove",
    note: "네 항목을 reference policy와 비교해 모두 맞을 때에만 channel-bound secret을 지급합니다.",
  },
  {
    label: "예전에 유효했던 quote를 다시 보냄",
    summary: "nonce 불일치 → 지급 0회",
    mode: "replay",
    note: "서명이 맞는 옛 quote라도 report data의 nonce가 이번 요청과 다르면 freshness에서 떨어지고, 지급은 0회입니다.",
  },
];

const W = 360;
const H = 214;
const ACCENT = "#2563eb";
const ALERT = "#dc2626";
const OK = "#15803d";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const FAINT = "#cbd5e1";

const DW = 40;
const PW = 84;
const GAP = 14;
const X0 = 10;
const XS = [X0, X0 + DW + GAP, X0 + DW + 2 * GAP + PW, X0 + 2 * DW + 3 * GAP + PW, X0 + 2 * DW + 4 * GAP + 2 * PW] as const;

const CHECKS = ["measurement·signer·attribute", "quote 서명·collateral", "TCB·debug 여부", "nonce·workload key"] as const;

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g>
      <line x1={x1} x2={x2 - 3} y1={y} y2={y} stroke={LINE} strokeWidth={1} />
      <path d={`M${x2 - 5} ${y - 3} L${x2} ${y} L${x2 - 5} ${y + 3}`} fill="none" stroke={LINE} strokeWidth={1} />
    </g>
  );
}

function Chain({ y, pages, names, color }: { y: number; pages: readonly [string, string]; names: readonly [string, string]; color: string }) {
  const mid = y + 15;
  const digest = (x: number, label: string, c: string) => (
    <g>
      <rect x={x} y={y} width={DW} height={30} rx={8} fill="none" stroke={c} strokeWidth={1.25} />
      <text x={x + DW / 2} y={y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill={c}>{label}</text>
    </g>
  );
  const page = (x: number, p: string) => {
    const addr = p === "P1" ? "a1" : "a2";
    return (
      <g>
        <rect x={x} y={y} width={PW} height={30} rx={4} fill="none" stroke={color} strokeWidth={1} />
        <text x={x + PW / 2} y={y + 13} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>page {p} @ {addr}</text>
        <text x={x + PW / 2} y={y + 25} textAnchor="middle" fontSize={10} fill={MUTED}>t ‖ {addr} ‖ H({p})</text>
      </g>
    );
  };
  return (
    <g>
      {digest(XS[0], "D0", MUTED)}
      <Arrow x1={XS[0] + DW} x2={XS[1]} y={mid} />
      {page(XS[1], pages[0])}
      <Arrow x1={XS[1] + PW} x2={XS[2]} y={mid} />
      {digest(XS[2], names[0], color)}
      <Arrow x1={XS[2] + DW} x2={XS[3]} y={mid} />
      {page(XS[3], pages[1])}
      <Arrow x1={XS[3] + PW} x2={XS[4]} y={mid} />
      {digest(XS[4], names[1], color)}
    </g>
  );
}

export default function MrenclaveReleaseViz() {
  return (
    <SceneShell
      eyebrow="MRENCLAVE에서 key 지급까지"
      title="초기 page 순서는 MRENCLAVE에 들어가지만, key 지급은 fresh quote 검사까지 통과해야 합니다"
      description="MRENCLAVE는 enclave를 만들 때 넣은 page로 계산한 초기 identity 값입니다. D는 누적 digest(D0은 시작값), t는 event type, a는 page 주소, H(P)는 page 내용의 hash입니다. 아래 식의 공통 모형이며 실제 SGX encoding이 아닙니다. page 두 장은 가정입니다."
      ariaLabel="SGX build measurement가 page 순서대로 누적되어 MRENCLAVE가 되고, runtime 값은 측정되지 않으며, quote 검사 네 가지와 nonce 재사용 거부로 key 지급이 갈리는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const proving = scene.mode === "prove" || scene.mode === "replay";
        const released = scene.mode === "prove" ? 1 : 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={14} fontSize={10} fontWeight={700} fill={MUTED}>BUILD · ECREATE → EADD → EEXTEND</text>
            <Chain y={20} pages={["P1", "P2"]} names={["D1", "D2"]} color={ACCENT} />

            {scene.mode === "swap" && (
              <g>
                <text x={X0} y={70} fontSize={10} fill={MUTED}>다른 build · 같은 page, P2 먼저</text>
                <Chain y={76} pages={["P2", "P1"]} names={["D1′", "D2′"]} color={ALERT} />
                <text x={XS[4] + DW} y={122} textAnchor="end" fontSize={10} fontWeight={700} fill={ALERT}>입력이 달라 D2′ ≠ D2</text>
              </g>
            )}

            {scene.mode === "runtime" && (
              <g>
                <rect x={X0} y={70} width={340} height={56} rx={8} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
                <text x={X0 + 10} y={88} fontSize={10} fontWeight={700} fill={MUTED}>MRENCLAVE에 들어가지 않음 · 따로 확인</text>
                <text x={X0 + 10} y={104} fontSize={10} fill={MUTED}>실행 중 들어오는 값: ECALL runtime input · OCALL result</text>
                <text x={X0 + 10} y={118} fontSize={10} fill={MUTED}>코드의 성질: side-channel 안전 · 업무 정답</text>
              </g>
            )}

            {proving && (
              <g>
                <text x={X0} y={70} fontSize={10} fontWeight={700} fill={MUTED}>PROVE · report → quote → verifier policy</text>
                {CHECKS.map((check, index) => {
                  const fail = scene.mode === "replay" && index === 3;
                  const x = X0 + (index % 2) * 172;
                  const y = 76 + Math.floor(index / 2) * 26;
                  const color = fail ? ALERT : OK;
                  return (
                    <g key={check}>
                      <rect x={x} y={y} width={168} height={22} rx={6} fill="none" stroke={color} strokeWidth={1.25} />
                      <text x={x + 7} y={y + 15} fontSize={10} fontWeight={700} fill={color}>{fail ? "✗" : "✓"} {check}</text>
                    </g>
                  );
                })}
              </g>
            )}

            <rect x={X0} y={140} width={166} height={58} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.25} />
            <text x={X0 + 8} y={156} fontSize={10} fontWeight={700} fill={MUTED}>MRENCLAVE</text>
            <text x={X0 + 8} y={173} fontSize={11} fontWeight={700} fill={ACCENT}>= D2 (첫 줄 build)</text>
            <text x={X0 + 8} y={189} fontSize={10} fill={MUTED}>{scene.mode === "runtime" ? "runtime 값이 와도 그대로" : "초기 page로 정해짐"}</text>

            <rect x={X0 + 174} y={140} width={166} height={58} rx={8} fill="none" stroke={proving ? (released ? OK : ALERT) : FAINT} strokeWidth={1.25} strokeDasharray={proving ? undefined : "3 3"} />
            <text x={X0 + 182} y={156} fontSize={10} fontWeight={700} fill={MUTED}>payroll key 지급</text>
            {proving ? (
              <text x={X0 + 182} y={186} fontSize={22} fontWeight={700} fill={released ? OK : ALERT}>{released}회</text>
            ) : (
              <text x={X0 + 182} y={180} fontSize={10} fill={LINE}>PROVE 장면에서 봅니다</text>
            )}
          </svg>
        );
      }}
    />
  );
}
