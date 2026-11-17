import SceneShell from "./SceneShell";

/**
 * 본문 대응: #measurement-attestation — D_i = H(D_{i-1} ‖ t_i ‖ a_i ‖ H(P_i)) 공통 모형을
 * TDX lifecycle(BUILD → FINALIZE → RUN → ATTEST)의 시간 순서 위에 놓는다.
 * 실제 TDX encoding이 아니라 글이 밝힌 공통 모형이며, digest 값은 이름(D1, D2)만 쓴다.
 */
const STAGES = ["BUILD", "FINALIZE", "RUN", "ATTEST"] as const;

const SCENES = [
  {
    label: "BUILD · page를 순서대로 접습니다",
    summary: "D0 → D1 → D2",
    stage: 0,
    note: "Page를 추가할 때마다 직전 digest에 t, a, H(P)를 붙여 다시 hash합니다. 그래서 D2에는 page 내용뿐 아니라 주소와 순서도 들어갑니다.",
  },
  {
    label: "같은 page, 다른 순서",
    summary: "D2′ ≠ D2",
    stage: 0,
    note: "Page bytes는 같아도 순서가 바뀌면 hash 입력이 달라집니다. 글의 전제(collision resistance) 아래에서 이 build는 다른 identity로 읽힙니다.",
  },
  {
    label: "FINALIZE · MRTD를 닫습니다",
    summary: "MRTD = D2 · 고정",
    stage: 1,
    note: "MR.FINALIZE가 construction measurement를 닫아 실행 identity를 고정합니다. 이후의 mutable runtime state와 섞지 않습니다.",
  },
  {
    label: "RUN · runtime extend register",
    summary: "MRTD 그대로 · runtime 값만 갱신",
    stage: 2,
    note: "실행 중 갱신은 runtime extend register 쪽에서 일어납니다. MRTD와는 목적과 갱신 시점이 다릅니다.",
  },
  {
    label: "ATTEST · report → quote",
    summary: "measurement · TCB · REPORTDATA",
    stage: 3,
    note: "Measurement·TCB·REPORTDATA를 DCAP collateral과 relying-party policy로 평가합니다. Application의 논리적 정답이나 device confidentiality는 자동으로 증명되지 않습니다.",
  },
] as const;

const W = 360;
const H = 200;
const ACCENT = "#2563eb";
const ALERT = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const FAINT = "#cbd5e1";

const DW = 40;
const PW = 84;
const GAP = 14;
const X0 = 10;
const xs = {
  d0: X0,
  p1: X0 + DW + GAP,
  d1: X0 + DW + GAP + PW + GAP,
  p2: X0 + 2 * DW + 3 * GAP + PW,
  d2: X0 + 2 * DW + 4 * GAP + 2 * PW,
};

function Digest({ x, y, label, color, dashed = false }: { x: number; y: number; label: string; color: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={DW} height={30} rx={8} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + DW / 2} y={y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function Page({ x, y, page, addr, color }: { x: number; y: number; page: string; addr: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={PW} height={30} rx={4} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + PW / 2} y={y + 13} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{page} @ {addr}</text>
      <text x={x + PW / 2} y={y + 25} textAnchor="middle" fontSize={9} fill={MUTED}>t ‖ {addr} ‖ H({page})</text>
    </g>
  );
}

function Arrow({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  return (
    <g>
      <line x1={x1} x2={x2 - 3} y1={y} y2={y} stroke={color} strokeWidth={1} />
      <path d={`M${x2 - 5} ${y - 3} L${x2} ${y} L${x2 - 5} ${y + 3}`} fill="none" stroke={color} strokeWidth={1} />
    </g>
  );
}

function Chain({ y, first, second, labels, color }: { y: number; first: readonly [string, string]; second: readonly [string, string]; labels: readonly [string, string]; color: string }) {
  const mid = y + 15;
  return (
    <g>
      <Digest x={xs.d0} y={y} label="D0" color={MUTED} />
      <Arrow x1={xs.d0 + DW} x2={xs.p1} y={mid} color={LINE} />
      <Page x={xs.p1} y={y} page={first[0]} addr={first[1]} color={color} />
      <Arrow x1={xs.p1 + PW} x2={xs.d1} y={mid} color={LINE} />
      <Digest x={xs.d1} y={y} label={labels[0]} color={color} />
      <Arrow x1={xs.d1 + DW} x2={xs.p2} y={mid} color={LINE} />
      <Page x={xs.p2} y={y} page={second[0]} addr={second[1]} color={color} />
      <Arrow x1={xs.p2 + PW} x2={xs.d2} y={mid} color={LINE} />
      <Digest x={xs.d2} y={y} label={labels[1]} color={color} />
    </g>
  );
}

function Register({ x, y, w, title, value, sub, color, dashed }: { x: number; y: number; w: number; title: string; value: string; sub: string; color: string; dashed: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={50} rx={8} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + 8} y={y + 15} fontSize={10} fontWeight={700} fill={MUTED}>{title}</text>
      <text x={x + 8} y={y + 31} fontSize={11} fontWeight={700} fill={color}>{value}</text>
      <text x={x + 8} y={y + 44} fontSize={10} fill={MUTED}>{sub}</text>
    </g>
  );
}

export default function MeasurementTimelineViz() {
  return (
    <SceneShell
      eyebrow="Measurement가 쌓이고 닫히는 시점"
      title="Build 순서가 MRTD에 들어가고, FINALIZE 뒤에는 runtime register만 바뀝니다"
      description="MRTD는 build 단계의 construction measurement를 담는 register입니다. D는 누적 digest, t는 event type(code·data 등), a는 page 주소, H(P)는 page 내용의 hash입니다. 아래 식의 공통 모형이며 실제 TDX encoding이 아닙니다. page 두 장은 가정입니다."
      ariaLabel="TDX build measurement가 page 순서대로 누적되고 FINALIZE로 고정된 뒤 runtime register와 attestation으로 이어지는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const finalized = scene.stage >= 1;
        const running = scene.stage >= 2;
        const attesting = scene.stage === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {STAGES.map((stage, index) => {
              const on = index === scene.stage;
              const done = index < scene.stage;
              return (
                <g key={stage}>
                  <rect x={10 + index * 86} y={4} width={80} height={22} rx={6} fill={on ? "#dbeafe" : "none"} stroke={on ? ACCENT : FAINT} strokeWidth={1} />
                  <text x={50 + index * 86} y={19} textAnchor="middle" fontSize={10} fontWeight={700} fill={on ? ACCENT : done ? MUTED : LINE}>
                    {index + 1}. {stage}
                  </text>
                </g>
              );
            })}

            <text x={10} y={40} fontSize={10} fill={MUTED}>build A · P1 먼저</text>
            <Chain y={44} first={["P1", "a1"]} second={["P2", "a2"]} labels={["D1", "D2"]} color={ACCENT} />

            {active === 1 && (
              <g>
                <text x={10} y={88} fontSize={10} fill={MUTED}>build B · 같은 page, P2 먼저</text>
                <Chain y={92} first={["P2", "a2"]} second={["P1", "a1"]} labels={["D1′", "D2′"]} color={ALERT} />
                <text x={xs.d2 + DW} y={136} textAnchor="end" fontSize={10} fontWeight={700} fill={ALERT}>입력이 달라 D2′ ≠ D2</text>
              </g>
            )}

            {attesting && (
              <g>
                <rect x={10} y={88} width={340} height={44} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                <text x={20} y={105} fontSize={10} fontWeight={700} fill={ACCENT}>TDREPORT → quote</text>
                <text x={20} y={122} fontSize={10} fill={MUTED}>MRTD · runtime 값 · TCB · REPORTDATA(nonce·key) → verifier policy</text>
              </g>
            )}

            <Register
              x={10}
              y={146}
              w={166}
              title="MRTD (construction)"
              value={finalized ? "= D2 · 고정" : "누적 중 …"}
              sub={finalized ? "FINALIZE 뒤 더 extend 안 함" : "page 추가마다 갱신"}
              color={finalized ? ACCENT : MUTED}
              dashed={!finalized}
            />
            <Register
              x={184}
              y={146}
              w={166}
              title="runtime extend register"
              value={running ? "실행 중 갱신" : "RUN 장면에서 봅니다"}
              sub={running ? "MRTD와 갱신 시점이 다름" : "MRTD와 목적이 다름"}
              color={running ? "#d97706" : LINE}
              dashed={!running}
            />
            {attesting && (
              <g>
                <line x1={93} x2={93} y1={146} y2={132} stroke={LINE} strokeWidth={1} />
                <line x1={267} x2={267} y1={146} y2={132} stroke={LINE} strokeWidth={1} />
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
