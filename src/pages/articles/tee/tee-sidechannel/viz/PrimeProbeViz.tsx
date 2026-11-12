import SceneShell from "./SceneShell";

/**
 * 본문 대응: #leakage-model "Cache attack" 칸 — memory encryption은 cache occupancy를 숨기지 않는다.
 * set 8개, secret이 가리키는 set 5, 반복 4회와 그중 한 번의 잡음은 모두 그림을 위한 가정이다.
 */
const SETS = 8;
const SECRET_SET = 5;
const NOISE = { round: 1, set: 2 } as const;
const ROUNDS = 4;

const W = 360;
const H = 236;
const LEFT = 10;
const GAP = 4;
const CELL = (W - 2 * LEFT - (SETS - 1) * GAP) / SETS;
const cx = (set: number) => LEFT + set * (CELL + GAP);
const CELL_Y = 92;
const CELL_H = 34;
const LOW_Y = 150;

const SLATE = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const LINE = "#94a3b8";
const MUTED = "#64748b";

const SCENES = [
  {
    label: "Prime: 공격자가 먼저 채웁니다",
    summary: "set 8칸 모두 A",
    note: "Prime+Probe는 공유 cache set을 자기 데이터(A)로 먼저 채우고(prime), 피해자 실행 뒤 다시 읽어 느려진 set을 찾는(probe) 방법입니다.",
  },
  {
    label: "Enclave가 secret 위치를 읽습니다",
    summary: "table[secret] → set 5",
    note: "Lookup index가 secret에 따라 달라지면 E가 들어가는 set도 달라집니다. Private page 내용이 암호화돼 있어도 어느 set을 차지했는지는 공유 cache 상태로 남습니다.",
  },
  {
    label: "Probe: 다시 읽으며 시간을 잽니다",
    summary: "set 5만 느림",
    note: "E에 밀려난 set 5의 A만 늦게 돌아옵니다. 공격자가 본 것은 평문이 아니라 ‘어느 set이 느렸는가’입니다.",
  },
  {
    label: "반복해 후보를 좁힙니다",
    summary: "set 5: 4회 중 4회",
    note: "한 번의 측정에는 2회차처럼 noise가 섞입니다(가정). 반복 관측을 후보와 비교해 secret 후보를 좁힐 수 있지만 그 자체가 복구 증명은 아닙니다.",
  },
];

function cellFill(active: number, set: number) {
  if (active >= 1 && set === SECRET_SET) return BLUE;
  return SLATE;
}

export default function PrimeProbeViz() {
  return (
    <SceneShell
      eyebrow="Cache attack · Prime+Probe"
      title="암호화된 메모리도 cache set을 차지한 자리는 드러납니다"
      description="칸 하나가 Enclave와 공격자가 함께 쓰는 cache set입니다. A는 공격자의 데이터, E는 Enclave가 읽은 line입니다."
      ariaLabel="Prime, enclave 접근, Probe, 반복 측정의 네 단계에서 cache set 상태"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={LEFT} y={8} width={164} height={52} rx={8} fill="none" stroke={active === 1 ? BLUE : LINE} strokeWidth={1} />
          <text x={LEFT + 10} y={28} fontSize={13} fontWeight={700} fill={BLUE}>Enclave</text>
          <text x={LEFT + 10} y={47} fontSize={12} fill={MUTED}>table[secret] 읽기</text>
          <rect x={W - LEFT - 164} y={8} width={164} height={52} rx={8} fill="none" stroke={active === 1 ? LINE : SLATE} strokeWidth={1} />
          <text x={W - LEFT - 154} y={28} fontSize={13} fontWeight={700} fill={SLATE}>공격자</text>
          <text x={W - LEFT - 154} y={47} fontSize={12} fill={MUTED}>{active === 0 ? "A로 채우기" : active === 1 ? "기다리기" : "A 다시 읽고 시간 재기"}</text>

          <text x={LEFT} y={CELL_Y - 10} fontSize={12} fill={MUTED}>공유 cache set (8개, 가정)</text>
          {active === 1 && (
            <line x1={LEFT + 82} y1={60} x2={cx(SECRET_SET) + CELL / 2} y2={CELL_Y - 2} stroke={BLUE} strokeWidth={1.25} />
          )}
          {Array.from({ length: SETS }, (_, set) => {
            const fill = cellFill(active, set);
            const isE = active >= 1 && set === SECRET_SET;
            return (
              <g key={set}>
                <rect x={cx(set)} y={CELL_Y} width={CELL} height={CELL_H} rx={4} fill={fill} opacity={isE ? 0.9 : 0.35} stroke={isE ? BLUE : "none"} strokeWidth={1} />
                <text x={cx(set) + CELL / 2} y={CELL_Y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={isE ? "#ffffff" : "#1e293b"}>{isE ? "E" : "A"}</text>
                <text x={cx(set) + CELL / 2} y={CELL_Y + CELL_H + 14} textAnchor="middle" fontSize={11} fill={MUTED}>{set}</text>
              </g>
            );
          })}

          {active === 2 && (
            <g>
              <text x={LEFT} y={LOW_Y + 14} fontSize={12} fill={MUTED}>다시 읽은 시간 (막대가 길수록 느림)</text>
              {Array.from({ length: SETS }, (_, set) => {
                const slow = set === SECRET_SET;
                const h = slow ? 50 : 14;
                return (
                  <g key={set}>
                    <rect x={cx(set) + CELL / 2 - 7} y={H - 6 - h} width={14} height={h} rx={2} fill={slow ? AMBER : SLATE} opacity={slow ? 0.95 : 0.45} />
                    {slow && <text x={cx(set) + CELL / 2 + 11} y={H - 6 - h + 10} fontSize={12} fontWeight={700} fill={AMBER}>느림</text>}
                  </g>
                );
              })}
            </g>
          )}

          {active === 3 && (
            <g>
              <text x={LEFT} y={LOW_Y + 14} fontSize={12} fill={MUTED}>회차별로 느렸던 set (가정)</text>
              {Array.from({ length: ROUNDS }, (_, round) => (
                <g key={round}>
                  <text x={LEFT} y={LOW_Y + 34 + round * 15} fontSize={11} fill={MUTED}>{round + 1}회</text>
                  {Array.from({ length: SETS }, (_, set) => {
                    const slow = set === SECRET_SET || (round === NOISE.round && set === NOISE.set);
                    return slow ? (
                      <rect key={set} x={cx(set) + CELL / 2 - 5} y={LOW_Y + 25 + round * 15} width={10} height={10} rx={2} fill={AMBER} opacity={set === SECRET_SET ? 0.95 : 0.6} />
                    ) : null;
                  })}
                </g>
              ))}
            </g>
          )}
        </svg>
      )}
    />
  );
}
