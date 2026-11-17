import Hs2SceneShell from "./Hs2SceneShell";

/**
 * 본문 대응: #view-sync — 느린 진입에서 주 노드가 Ppc + Δ를 기다리는 이유.
 * 본문 값: Ppc = 2Δ(RareSync·Lewis-Pye 예), 메시지 지연 ≤ Δ(GST 뒤), 정족수 2t+1 = 3(n=4).
 * 진입 시각·지연·lock 값은 설명용 가정: 주 노드 R0가 0에 가장 먼저 진입,
 * R1 0.4Δ→1.0Δ, R2 0.7Δ→1.4Δ, R3 2Δ→3Δ. R3만 C21로 잠겼다고 가정.
 * 가장 늦은 보고 도착 ≤ Ppc + Δ = 2Δ + Δ = 3Δ.
 */
const SCENES = [
  { label: "같은 view에 들어오는 시각이 다릅니다", summary: "진입 차이 ≤ Ppc = 2Δ", note: "Ppc는 pacemaker가 정상 복제본을 같은 view 22로 모으는 데 허용하는 시간 차이입니다. 본문의 예처럼 Ppc = 2Δ로 두고, 주 노드 R0가 가장 먼저 들어오고 R3이 2Δ에 가장 늦게 들어왔다고 가정했습니다." },
  { label: "잠금 보고는 Δ 안에 도착합니다", summary: "각 보고 지연 ≤ Δ", note: "각 복제본은 들어오자마자 자신이 가진 가장 높은 잠금 인증서를 주 노드에게 보냅니다. Δ는 GST 뒤 메시지 지연의 상한입니다. R3만 view 21의 더 높은 인증서 C21로 잠겼다고 가정했습니다." },
  { label: "첫 3개에서 멈추면", summary: "1.4Δ에 3개 · C21 빠짐", note: "1.4Δ(가정)에 R0 자신을 포함해 2t+1 = 3개가 모였지만 R3은 아직 들어오지도 않았습니다. 여기서 C20을 부모로 제안하면, 복제본은 제안의 인증서가 자기 lock보다 낮으면 투표하지 않으므로 C21로 잠긴 R3은 투표하지 않습니다. 이 그림에서는 R0~R2가 3표를 채우지만, 그중 t = 1대가 잘못 행동해 표를 내지 않으면 2표뿐이라 2t+1 = 3에 못 미칩니다." },
  { label: "Ppc + Δ까지 기다리면", summary: "2Δ + Δ = 3Δ · 가장 높은 C21", note: "가장 늦은 정상 복제본도 2Δ 안에 들어오고 그 보고는 Δ 안에 오므로 3Δ에는 네 보고가 모두 도착합니다. 주 노드는 그중 가장 높은 C21 하나만 제안에 넣습니다. GST 전에는 이 시간이 전달을 보장하지 않아 진행이 멈출 수 있습니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const IDLE = "#94a3b8";
const SUB = "#64748b";

const X0 = 64;
const UNIT = 88;
const tx = (t: number) => X0 + t * UNIT;
const ROW_Y: readonly number[] = [56, 92, 128, 164];
const AXIS_Y = 184;

const ROWS = [
  { name: "R0", sub: "주 노드 22", enter: 0, arrive: 0, lock: "C20" },
  { name: "R1", sub: "", enter: 0.4, arrive: 1.0, lock: "C20" },
  { name: "R2", sub: "", enter: 0.7, arrive: 1.4, lock: "C20" },
  { name: "R3", sub: "가장 늦음", enter: 2.0, arrive: 3.0, lock: "C21" },
] as const;

const CUT: readonly number[] = [Infinity, Infinity, 1.4, 3.0];

function Picture({ active }: { active: number }) {
  const cut = CUT[active];
  return (
    <svg viewBox="0 0 360 206" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {active === 0 && (
        <g>
          <path d={`M${tx(0)} 36 v-6 H${tx(2)} v6`} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <text x={(tx(0) + tx(2)) / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>Ppc = 2Δ</text>
        </g>
      )}
      {active >= 2 && (
        <g>
          <line x1={tx(cut)} x2={tx(cut)} y1={34} y2={AXIS_Y} stroke={active === 3 ? BLUE : AMBER} strokeWidth={1.25} strokeDasharray="4 3" />
          <text x={active === 3 ? 356 : tx(cut)} y={24} textAnchor={active === 3 ? "end" : "middle"} fontSize={11} fontWeight={700} fill={active === 3 ? BLUE : AMBER}>
            {active === 3 ? "Ppc + Δ = 3Δ" : "3개 = 2t+1"}
          </text>
        </g>
      )}
      {ROWS.map((row, i) => {
        const y = ROW_Y[i];
        const entered = row.enter <= cut;
        const arrived = active >= 1 && row.arrive <= cut;
        const high = row.lock === "C21";
        const color = high ? AMBER : BLUE;
        const chosen = active === 3 && high;
        return (
          <g key={row.name}>
            <text x={4} y={y + 4} fontSize={12} fontWeight={700} fill="currentColor">{row.name}</text>
            {row.sub && <text x={4} y={y + 17} fontSize={10} fill={SUB}>{row.sub}</text>}
            <line x1={X0} x2={tx(3.2)} y1={y} y2={y} stroke={IDLE} strokeWidth={1} strokeOpacity={0.4} />
            {entered ? (
              <>
                <rect x={tx(row.enter) - 1} y={y - 7} width={2} height={14} fill={SUB} />
                {active >= 1 && arrived && row.arrive > row.enter && (
                  <line x1={tx(row.enter)} x2={tx(row.arrive)} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
                )}
                {arrived && (
                  <>
                    <circle cx={tx(row.arrive)} cy={y} r={chosen ? 6 : 4.5} fill={color} />
                    <text x={tx(row.arrive) + (row.arrive === 0 ? 10 : 0)} y={y - 9} textAnchor={row.arrive === 0 ? "start" : "middle"} fontSize={11} fontWeight={700} fill={color}>
                      {chosen ? "C21 선택" : row.lock}
                    </text>
                  </>
                )}
              </>
            ) : (
              <text x={tx(cut) + 8} y={y + 4} fontSize={11} fill={SUB}>아직 진입 전 · 보고 없음</text>
            )}
          </g>
        );
      })}
      <line x1={X0} x2={tx(3.2)} y1={AXIS_Y} y2={AXIS_Y} stroke={IDLE} strokeWidth={1} />
      {[0, 1, 2, 3].map((t) => (
        <g key={t}>
          <line x1={tx(t)} x2={tx(t)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke={IDLE} strokeWidth={1} />
          <text x={tx(t)} y={AXIS_Y + 16} textAnchor="middle" fontSize={11} fill={SUB}>{t === 0 ? "0" : t === 1 ? "Δ" : `${t}Δ`}</text>
        </g>
      ))}
    </svg>
  );
}

export default function LockWaitViz() {
  return (
    <Hs2SceneShell
      eyebrow="느린 진입 · 시간 경계"
      title="첫 3개 보고가 아니라 Ppc + Δ가 지나야 가장 높은 lock이 보입니다"
      description="가로축은 주 노드 R0가 view 22에 들어온 때부터 흐른 시간입니다. 세로 막대는 각 복제본이 view에 들어온 시각, 점은 그 잠금 보고가 주 노드에 도착한 시각입니다. 진입 시각과 지연, 어느 복제본이 C21로 잠겼는지는 설명용 가정입니다."
      ariaLabel="HotStuff-2 느린 진입에서 잠금 보고 도착 시각과 Ppc 더하기 델타 대기"
      scenes={SCENES}
      render={(active) => <Picture active={active} />}
    />
  );
}
