import SceneShell from "./SceneShell";

/**
 * 본문 대응: #authenticated-transcript — Mallory가 19를 10(=5³)으로, 8을 17(=5⁷)로 바꿉니다.
 * Alice 구간: 10⁶ = 8³ = 6. Bob 구간: 17¹⁵ = 19⁷ = 15. mod 23.
 */
const ALICE = "#2563eb";
const BOB = "#b45309";
const ATTACK = "#b91c1c";
const INK = "#64748b";

const SCENES = [
  { label: "끼어들기 전", summary: "양쪽 결과 2", note: "4절의 교환입니다. Alice의 8과 Bob의 19가 그대로 건너가 양쪽이 공유값 2를 얻습니다. Mallory는 연결망에서 값을 바꿔치기할 수 있는 중간자입니다(가정)." },
  { label: "Alice에게 10을 보냅니다", summary: "10⁶ = 8³ = 6", note: "Bob의 19를 막고 자기 비밀 3으로 만든 10=5³을 Alice에게 보냅니다. Alice는 10⁶으로, Mallory는 Alice의 8로 8³을 계산해 나머지 6을 함께 얻습니다." },
  { label: "Bob에게 17을 보냅니다", summary: "17¹⁵ = 19⁷ = 15", note: "Alice의 8 대신 자기 비밀 7로 만든 17=5⁷을 Bob에게 보냅니다. Bob의 17¹⁵와 Mallory의 19⁷은 나머지 15로 같습니다." },
  { label: "두 구간, 두 공유값", summary: "Alice 6 · Bob 15", note: "등식은 어디서도 깨지지 않았고 공유값만 둘로 갈라졌습니다. Mallory는 둘을 모두 알며, 각 구간에서 같은 열쇠를 가졌는지 확인하는 절차까지 성공할 수 있습니다. 이 6·15는 Alice·Bob의 비밀 지수 6·15와 숫자만 같습니다." },
  { label: "기록을 인증하면", summary: "19를 10으로 바꾼 기록은 탈락", note: "신뢰할 수 있는 인증 키로 A·B가 들어간 대화 기록을 서명하거나 MAC으로 확인합니다. Alice가 본 기록의 B는 10, Bob이 보낸 B는 19이므로 같은 승인을 통과하지 못합니다." },
] as const;

function Box({ x, y, title, sub, color, dashed = false }: { x: number; y: number; title: string; sub: string; color: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={92} height={46} rx={8} fill={color} fillOpacity={0.08} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + 46} y={y + 19} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{title}</text>
      <text x={x + 46} y={y + 36} textAnchor="middle" fontSize={11} fill={INK}>{sub}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, label, lx, ly }: { x1: number; y1: number; x2: number; y2: number; color: string; label: string; lx: number; ly: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = [0.45, -0.45].map((offset) => `${x2 - 8 * Math.cos(angle + offset)},${y2 - 8 * Math.sin(angle + offset)}`).join(" ");
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
      <polygon points={`${x2},${y2} ${head}`} fill={color} />
      <text x={lx} y={ly} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function Lines({ x, anchor, lines, color }: { x: number; anchor: "start" | "end" | "middle"; lines: readonly string[]; color: string }) {
  return (
    <>
      {lines.map((line, index) => (
        <text key={line} x={x} y={134 + index * 18} textAnchor={anchor} fontSize={12} fontWeight={index === lines.length - 1 ? 700 : 500} fill={index === lines.length - 1 ? color : INK}>{line}</text>
      ))}
    </>
  );
}

const LEFT = [
  ["받은 값 19", "19⁶ → 공유값 2"],
  ["받은 값 10", "10⁶ → 공유값 6"],
  ["받은 값 10", "10⁶ → 공유값 6"],
  ["Alice 쪽", "공유값 6"],
  ["본 기록 A=8", "B=10"],
] as const;
const RIGHT = [
  ["받은 값 8", "8¹⁵ → 공유값 2"],
  ["아직 받지 못함", " "],
  ["받은 값 17", "17¹⁵ → 공유값 15"],
  ["Bob 쪽", "공유값 15"],
  ["본 기록 A=17", "B=19"],
] as const;
const BELOW = ["아직 값을 바꾸지 않음", "8³ → 6", "8³ → 6 · 19⁷ → 15", "둘 다 앎: 6과 15", "서명·MAC 검증에서 걸림"] as const;

export default function MitmSplitViz() {
  return (
    <SceneShell
      eyebrow="중간자"
      title="한 번의 교환이 Mallory를 사이에 둔 두 번의 교환으로 갈라집니다"
      description="위쪽 직선은 Alice와 Bob 사이의 직접 전달, 가운데로 꺾인 선은 Mallory를 거친 전달입니다. 모든 계산은 23으로 나눈 나머지이며 Mallory의 비밀 3·7은 가정입니다."
      ariaLabel="Alice와 Bob 사이에 Mallory가 끼어들어 공유값이 6과 15로 갈라지는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Box x={6} y={8} title="Alice" sub="비밀 6" color={ALICE} />
          <Box x={262} y={8} title="Bob" sub="비밀 15" color={BOB} />
          <Box x={134} y={170} title="Mallory" sub="비밀 3·7 (가정)" color={ATTACK} dashed={active === 0} />
          {active === 0 && (
            <>
              <Arrow x1={98} y1={22} x2={260} y2={22} color={ALICE} label="8" lx={180} ly={17} />
              <Arrow x1={262} y1={42} x2={100} y2={42} color={BOB} label="19" lx={180} ly={60} />
            </>
          )}
          {active >= 1 && (
            <>
              <Arrow x1={82} y1={54} x2={150} y2={168} color={ALICE} label="8" lx={100} ly={112} />
              <Arrow x1={170} y1={168} x2={102} y2={56} color={ATTACK} label="10" lx={152} ly={108} />
              <Arrow x1={278} y1={54} x2={210} y2={168} color={BOB} label="19" lx={262} ly={112} />
            </>
          )}
          {active >= 2 && <Arrow x1={190} y1={168} x2={258} y2={56} color={ATTACK} label="17" lx={210} ly={108} />}
          {active === 4 && <text x={180} y={34} textAnchor="middle" fontSize={13} fontWeight={700} fill={ATTACK}>기록 불일치</text>}
          <Lines x={6} anchor="start" lines={LEFT[active]} color={ALICE} />
          <Lines x={354} anchor="end" lines={RIGHT[active]} color={BOB} />
          <text x={180} y={228} textAnchor="middle" fontSize={12} fontWeight={700} fill={ATTACK}>{BELOW[active]}</text>
        </svg>
      )}
    />
  );
}
