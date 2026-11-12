import SceneShell from "./SceneShell";

/**
 * 본문 대응: #health-and-drain 접힘 설명 — 민감한 판정이 만드는 흔들림과 "빼는 조건과 되돌리는 조건을 다르게".
 * 멀쩡한 서버 한 대의 검사 16회(가정) 중 3회가 일시 실패.
 * 조건 A: 1회 실패로 빼고 1회 성공으로 되돌림(가정) → 상태 전환 6번, 빠진 칸 3.
 * 조건 B: 1회 실패로 빼고 연속 4회 성공 뒤 되돌림(가정) → 상태 전환 2번, 빠진 칸 9.
 */
const PROBES = [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1] as const;
const PROBE_LIST: readonly number[] = PROBES;
const RESTORE_AFTER = 4;

type Track = { states: boolean[]; inService: boolean; streak: number };

const SYMMETRIC: readonly boolean[] = PROBE_LIST.map((ok) => ok === 1);
const ASYMMETRIC: readonly boolean[] = PROBE_LIST.reduce<Track>(
  (acc, ok) => {
    const streak = ok === 1 ? acc.streak + 1 : 0;
    const inService = ok === 1 ? acc.inService || streak >= RESTORE_AFTER : false;
    return { states: [...acc.states, inService], inService, streak };
  },
  { states: [], inService: true, streak: 0 },
).states;

const transitions = (states: readonly boolean[]) =>
  states.reduce<number>((count, state, i) => count + ((i === 0 ? true : states[i - 1]) !== state ? 1 : 0), 0);
const outCells = (states: readonly boolean[]) => states.filter((state) => !state).length;
const FAILS = PROBE_LIST.filter((ok) => ok === 0).length;

const SCENES = [
  {
    label: "검사 결과",
    summary: `16회 중 ${FAILS}회 일시 실패`,
    note: "서버는 멀쩡하지만 순간적인 지연이나 검사 패킷 유실로 검사 몇 번이 실패했다고 둡니다. 아래 두 줄은 같은 검사 결과를 서로 다른 조건으로 판정한 결과입니다.",
  },
  {
    label: "1회 실패로 빼고 1회 성공으로 되돌리기",
    summary: `상태 전환 ${transitions(SYMMETRIC)}번`,
    note: "실패할 때마다 빠지고 다음 검사에서 돌아옵니다. 빠질 때마다 그 몫이 남은 서버로 가므로, 아래 접힘 설명처럼 그쪽이 느려져 다시 빠지는 흔들림으로 번질 수 있습니다.",
  },
  {
    label: "빼기는 빠르게, 되돌리기는 오래",
    summary: `상태 전환 ${transitions(ASYMMETRIC)}번`,
    note: `빼는 조건은 그대로 두고 되돌리는 조건만 연속 ${RESTORE_AFTER}회 성공으로 늘리면 첫 실패에서 한 번 빠지고 안정이 확인된 뒤 한 번 돌아옵니다. 대신 이 가정에서는 빠져 있는 칸이 ${outCells(SYMMETRIC)}칸에서 ${outCells(ASYMMETRIC)}칸으로 늘어납니다.`,
  },
] as const;

const W = 320;
const H = 176;
const CELL = W / PROBES.length;
const ROW_PROBE = 40;
const ROW_A = 86;
const ROW_B = 136;
const IN = "#2563eb";
const FAIL = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";

function StateRow({ y, states, dim }: { y: number; states: readonly boolean[]; dim: boolean }) {
  return (
    <g opacity={dim ? 0.15 : 1}>
      {states.map((inService, i) => (
        <rect
          key={i}
          x={i * CELL + 1}
          y={y - 10}
          width={CELL - 2}
          height={20}
          rx={2}
          fill={inService ? IN : "none"}
          fillOpacity={inService ? 0.75 : 0}
          stroke={inService ? IN : LINE}
          strokeWidth={1}
          strokeDasharray={inService ? undefined : "2 2"}
        />
      ))}
    </g>
  );
}

export default function FlapViz() {
  return (
    <SceneShell
      eyebrow="판정 조건과 흔들림"
      title="되돌리는 조건을 더 엄하게 두면 같은 일시 실패에도 들락날락이 줄어듭니다"
      description="칸 하나가 검사 한 번입니다. 검사 결과와 두 판정 조건(1회 실패로 빼기, 1회 또는 연속 4회 성공으로 되돌리기)은 설명을 위한 가정이며 권고값이 아닙니다."
      ariaLabel="같은 검사 결과를 두 판정 조건으로 읽을 때 서버가 빠지고 돌아오는 횟수 비교"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          <text x={0} y={ROW_PROBE - 16} fontSize={12} fontWeight={700} fill={MUTED}>
            검사 결과
          </text>
          <text x={W} y={ROW_PROBE - 16} textAnchor="end" fontSize={11} fill={MUTED}>
            ○ 성공 · × 일시 실패
          </text>
          {PROBE_LIST.map((ok, i) => {
            const cx = i * CELL + CELL / 2;
            return ok === 1 ? (
              <circle key={i} cx={cx} cy={ROW_PROBE} r={4.5} fill="none" stroke={MUTED} strokeWidth={1} />
            ) : (
              <g key={i} stroke={FAIL} strokeWidth={1.25}>
                <line x1={cx - 4.5} x2={cx + 4.5} y1={ROW_PROBE - 4.5} y2={ROW_PROBE + 4.5} />
                <line x1={cx - 4.5} x2={cx + 4.5} y1={ROW_PROBE + 4.5} y2={ROW_PROBE - 4.5} />
              </g>
            );
          })}

          <text x={0} y={ROW_A - 16} fontSize={12} fontWeight={700} fill={MUTED} opacity={active >= 1 ? 1 : 0.15}>
            1회 실패로 빼기 · 1회 성공으로 복귀
          </text>
          <StateRow y={ROW_A} states={SYMMETRIC} dim={active < 1} />

          <text x={0} y={ROW_B - 16} fontSize={12} fontWeight={700} fill={MUTED} opacity={active >= 2 ? 1 : 0.15}>
            1회 실패로 빼기 · 연속 {RESTORE_AFTER}회 성공으로 복귀
          </text>
          <StateRow y={ROW_B} states={ASYMMETRIC} dim={active < 2} />

          <rect x={0} y={H - 13} width={12} height={11} rx={2} fill={IN} fillOpacity={0.75} />
          <text x={17} y={H - 3} fontSize={11} fill={MUTED}>
            트래픽 받음
          </text>
          <rect x={100} y={H - 13} width={12} height={11} rx={2} fill="none" stroke={LINE} strokeDasharray="2 2" />
          <text x={117} y={H - 3} fontSize={11} fill={MUTED}>
            빠짐
          </text>
        </svg>
      )}
    />
  );
}
