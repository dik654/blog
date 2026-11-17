import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pair-contract의 Chosen odds·Rejected odds·λ와 이어지는 #orpo objective.
 * 설명용 확률(가정): chosen p+=0.20, rejected p−=0.10. 로그는 자연로그.
 * odds 0.25·0.111 → log odds −1.386·−2.197 → Δ=0.811 → −log σ(Δ)=0.368.
 * 뒤집힌 pair Δ=−0.811 → 1.179. chosen만 0.30, rejected 0.16으로 함께 오르면 Δ는 그대로 0.811.
 * L_SFT를 −ln p+ = 1.609로 단순화하면 λ=0.1 → 1.646, λ=1 → 1.977.
 */
const P_CHOSEN = 0.2;
const P_REJECTED = 0.1;
const P_CHOSEN_UP = 0.3;
const P_REJECTED_UP = 0.16;

const odds = (p: number) => p / (1 - p);
const logOdds = (p: number) => Math.log(odds(p));
const penalty = (delta: number) => Math.log(1 + Math.exp(-delta));

const DELTA = logOdds(P_CHOSEN) - logOdds(P_REJECTED);
const DELTA_UP = logOdds(P_CHOSEN_UP) - logOdds(P_REJECTED_UP);
const L_SFT = -Math.log(P_CHOSEN);
const LAMBDAS = [0.1, 1] as const;

const f2 = (value: number) => value.toFixed(2);
const f3 = (value: number) => value.toFixed(3);

const CHOSEN = "#2563eb";
const REJECTED = "#d97706";
const MUTED = "#94a3b8";
const INK = "#64748b";
const LOSS = "#dc2626";

const SCENES = [
  {
    label: "같은 prompt의 두 응답",
    summary: `p+ = ${f2(P_CHOSEN)} · p− = ${f2(P_REJECTED)}`,
    note: "p는 model이 prompt x에서 그 응답 전체를 낼 확률(sequence likelihood)입니다. 같은 prompt의 두 응답에 하나씩 있으며, 0.20과 0.10은 가정입니다.",
  },
  {
    label: "확률을 odds로 바꿉니다",
    summary: `${f3(odds(P_CHOSEN))} · ${f3(odds(P_REJECTED))}`,
    note: "그 응답이 나올 확률(색칠한 칸)을 나머지 확률(회색 칸)로 나눈 값이 odds입니다. 0.20 / 0.80 = 0.25, 0.10 / 0.90 = 0.111.",
  },
  {
    label: "log odds의 차이가 간격입니다",
    summary: `Δ = ${f3(DELTA)}`,
    note: `Odds의 비 0.25 / 0.111 = 2.25에 log를 씌우면 두 log odds의 차이가 됩니다. 두 점 사이 거리 Δ = ${f3(DELTA)}이며, Δ가 클수록 chosen이 rejected보다 앞서 있습니다.`,
  },
  {
    label: "간격이 좁을수록 벌점이 큽니다",
    summary: `−log σ(${f2(DELTA)}) = ${f3(penalty(DELTA))}`,
    note: `σ는 값을 0~1로 누르는 sigmoid입니다. Δ가 클수록 벌점은 0에 가깝고, 순위가 뒤집힌 Δ = −${f2(DELTA)}이면 ${f3(penalty(-DELTA))}로 커집니다.`,
  },
  {
    label: "Chosen 모방만 할 때",
    summary: `Δ ${f3(DELTA)} → ${f3(DELTA_UP)}`,
    note: `Chosen 모방 항은 rejected를 명시적으로 낮추지 않습니다. Rejected도 함께 오르면(가정) odds 비 2.25가 그대로라 Δ도 ${f3(DELTA_UP)}입니다.`,
  },
  {
    label: "한 objective로 더합니다",
    summary: `L = ${f3(L_SFT)} + λ × ${f3(penalty(DELTA))}`,
    note: `Chosen NLL을 −ln 0.20 = ${f3(L_SFT)}로 단순화하면(가정) λ = 0.1에서 L = ${f3(L_SFT + LAMBDAS[0] * penalty(DELTA))}, λ = 1에서 ${f3(L_SFT + LAMBDAS[1] * penalty(DELTA))}입니다. λ는 두 항의 상대 scale이며 두 값 모두 가정입니다.`,
  },
] as const;

const W = 360;
const H = 196;
const X0 = 84;
const X1 = 336;

function ProbabilityBars({ active }: { active: number }) {
  const px = (p: number) => X0 + p * (X1 - X0);
  const rows = [
    { name: "chosen y+", p: P_CHOSEN, up: P_CHOSEN_UP, color: CHOSEN, y: 54 },
    { name: "rejected y−", p: P_REJECTED, up: P_REJECTED_UP, color: REJECTED, y: 118 },
  ];
  const showOdds = active === 1;
  const showUp = active === 4;
  return (
    <>
      {[0, 0.5, 1].map((tick) => (
        <g key={tick}>
          <line x1={px(tick)} x2={px(tick)} y1={26} y2={160} stroke={MUTED} strokeWidth={0.75} strokeDasharray={tick === 0 ? undefined : "2 3"} />
          <text x={px(tick)} y={176} textAnchor="middle" fontSize={11} fill={INK}>{tick}</text>
        </g>
      ))}
      <text x={X1} y={192} textAnchor="end" fontSize={10} fill={INK}>sequence 확률 p</text>
      {rows.map((row) => {
        const p = showUp ? row.up : row.p;
        return (
          <g key={row.name}>
            <text x={8} y={row.y + 5} fontSize={12} fontWeight={700} fill={row.color}>{row.name}</text>
            {showOdds && <rect x={px(p)} y={row.y - 10} width={px(1) - px(p)} height={20} fill={MUTED} opacity={0.35} />}
            <rect x={X0} y={row.y - 10} width={px(p) - X0} height={20} fill={row.color} opacity={showUp ? 0.35 : 0.85} />
            {showUp && <rect x={X0} y={row.y - 10} width={px(row.p) - X0} height={20} fill={row.color} opacity={0.85} />}
            {showOdds ? (
              <>
                <text x={(X0 + px(p)) / 2} y={row.y - 15} textAnchor="middle" fontSize={11} fill={row.color}>p {f2(p)}</text>
                <text x={(px(p) + px(1)) / 2} y={row.y - 15} textAnchor="middle" fontSize={11} fill={INK}>1−p {f2(1 - p)}</text>
                <text x={(px(p) + px(1)) / 2} y={row.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">odds = {f3(odds(p))}</text>
              </>
            ) : (
              <text x={px(p) + 6} y={row.y + 4} fontSize={12} fontWeight={700} fill={row.color}>
                {showUp ? `${f2(row.p)} → ${f2(p)}` : f2(p)}
              </text>
            )}
          </g>
        );
      })}
      {showUp && (
        <text x={X1} y={30} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">
          odds 비 {f3(odds(P_CHOSEN_UP))} / {f3(odds(P_REJECTED_UP))} = 2.25 → Δ {f3(DELTA_UP)}
        </text>
      )}
    </>
  );
}

function LogOddsLine() {
  const lo = -2.6;
  const hi = -0.9;
  const lx = (value: number) => 30 + ((value - lo) / (hi - lo)) * 300;
  const a = lx(logOdds(P_REJECTED));
  const b = lx(logOdds(P_CHOSEN));
  return (
    <>
      <line x1={30} x2={330} y1={110} y2={110} stroke={MUTED} strokeWidth={1} />
      {[-2.5, -2, -1.5, -1].map((tick) => (
        <g key={tick}>
          <line x1={lx(tick)} x2={lx(tick)} y1={106} y2={114} stroke={MUTED} strokeWidth={1} />
          <text x={lx(tick)} y={130} textAnchor="middle" fontSize={11} fill={INK}>{tick}</text>
        </g>
      ))}
      <text x={330} y={150} textAnchor="end" fontSize={10} fill={INK}>log odds (ln)</text>
      <circle cx={a} cy={110} r={6} fill={REJECTED} />
      <circle cx={b} cy={110} r={6} fill={CHOSEN} />
      <text x={a} y={94} textAnchor="middle" fontSize={12} fontWeight={700} fill={REJECTED}>rejected {f3(logOdds(P_REJECTED))}</text>
      <text x={b} y={94} textAnchor="middle" fontSize={12} fontWeight={700} fill={CHOSEN}>chosen {f3(logOdds(P_CHOSEN))}</text>
      <line x1={a} x2={b} y1={62} y2={62} stroke="#334155" strokeWidth={1.25} />
      <line x1={a} x2={a} y1={56} y2={68} stroke="#334155" strokeWidth={1} />
      <line x1={b} x2={b} y1={56} y2={68} stroke="#334155" strokeWidth={1} />
      <text x={(a + b) / 2} y={50} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">Δ = {f3(DELTA)}</text>
      <text x={(a + b) / 2} y={176} textAnchor="middle" fontSize={11} fill={INK}>ln(0.25 / 0.111) = ln 2.25</text>
    </>
  );
}

function PenaltyCurve() {
  const dx = (d: number) => 40 + ((d + 3) / 6) * 290;
  const dy = (v: number) => 160 - (v / 3.2) * 135;
  const points = Array.from({ length: 61 }, (_, i) => -3 + i * 0.1)
    .map((d) => `${dx(d).toFixed(1)},${dy(penalty(d)).toFixed(1)}`)
    .join(" ");
  const marks = [
    { d: DELTA, color: CHOSEN, text: `Δ ${f2(DELTA)} → ${f3(penalty(DELTA))}`, anchor: "start" as const, dxText: 8 },
    { d: -DELTA, color: LOSS, text: `뒤집힘 Δ −${f2(DELTA)} → ${f3(penalty(-DELTA))}`, anchor: "end" as const, dxText: -8 },
  ];
  return (
    <>
      <line x1={40} x2={330} y1={160} y2={160} stroke={MUTED} strokeWidth={1} />
      <line x1={dx(0)} x2={dx(0)} y1={20} y2={160} stroke={MUTED} strokeWidth={0.75} strokeDasharray="2 3" />
      {[-3, -2, -1, 0, 1, 2, 3].map((tick) => (
        <text key={tick} x={dx(tick)} y={176} textAnchor="middle" fontSize={11} fill={INK}>{tick}</text>
      ))}
      <text x={330} y={192} textAnchor="end" fontSize={10} fill={INK}>Δ (chosen − rejected log odds)</text>
      <text x={44} y={26} fontSize={11} fill={INK}>벌점 −log σ(Δ)</text>
      <polyline points={points} fill="none" stroke="#334155" strokeWidth={1.25} />
      {marks.map((mark) => (
        <g key={mark.text}>
          <line x1={dx(mark.d)} x2={dx(mark.d)} y1={160} y2={dy(penalty(mark.d))} stroke={mark.color} strokeWidth={1} strokeDasharray="3 2" />
          <circle cx={dx(mark.d)} cy={dy(penalty(mark.d))} r={5} fill={mark.color} />
          <text x={dx(mark.d) + mark.dxText} y={dy(penalty(mark.d)) - 8} textAnchor={mark.anchor} fontSize={11} fontWeight={700} fill={mark.color}>{mark.text}</text>
        </g>
      ))}
    </>
  );
}

function TotalBars() {
  const bx = (v: number) => 92 + (v / 2.1) * 236;
  const sep = penalty(DELTA);
  return (
    <>
      {LAMBDAS.map((lambda, index) => {
        const y = 52 + index * 64;
        const extra = lambda * sep;
        return (
          <g key={lambda}>
            <text x={8} y={y + 5} fontSize={12} fontWeight={700} fill="#334155">λ = {lambda}</text>
            <rect x={bx(0)} y={y - 11} width={bx(L_SFT) - bx(0)} height={22} fill={CHOSEN} opacity={0.85} />
            <rect x={bx(L_SFT)} y={y - 11} width={bx(L_SFT + extra) - bx(L_SFT)} height={22} fill={LOSS} opacity={0.85} />
            <text x={bx(L_SFT) / 2 + bx(0) / 2} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">NLL {f3(L_SFT)}</text>
            <text x={bx(L_SFT + extra) + 5} y={y + 4} fontSize={11} fontWeight={700} fill={LOSS}>+{f3(extra)}</text>
            <text x={bx(0)} y={y + 26} fontSize={11} fill={INK}>합계 L = {f3(L_SFT + extra)}</text>
          </g>
        );
      })}
      <rect x={92} y={170} width={10} height={10} fill={CHOSEN} opacity={0.85} />
      <text x={106} y={179} fontSize={11} fill={INK}>chosen 모방</text>
      <rect x={180} y={170} width={10} height={10} fill={LOSS} opacity={0.85} />
      <text x={194} y={179} fontSize={11} fill={INK}>λ × pair 분리 벌점</text>
    </>
  );
}

export default function OrpoOddsGapViz() {
  return (
    <SceneShell
      eyebrow="ORPO objective를 숫자로 따라가기"
      title="두 응답의 odds 간격이 벌점으로 바뀌고 chosen 모방 항에 더해집니다"
      description="Pair 하나를 확률 → odds → log odds 차이 → 벌점 → 전체 loss 순서로 계산합니다. 0.20·0.10과 λ 값은 가정이며 로그는 자연로그입니다."
      note="실제 sequence 확률은 훨씬 작을 수 있어 구현은 log-space에서 계산합니다. 숫자는 계산 순서를 보이기 위한 것이며 어느 model의 측정값도 아닙니다."
      ariaLabel="ORPO의 확률, odds, log odds 차이, 벌점, 전체 loss를 여섯 장면으로 계산"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 12 ${W} ${H - 12}`} className="mx-auto h-auto w-full max-w-[360px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {(active === 0 || active === 1 || active === 4) && <ProbabilityBars active={active} />}
          {active === 2 && <LogOddsLine />}
          {active === 3 && <PenaltyCurve />}
          {active === 5 && <TotalBars />}
        </svg>
      )}
    />
  );
}
