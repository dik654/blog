import SceneShell from "./SceneShell";

/**
 * 본문 대응: #weak-subjectivity — 같은 시간축에 서로 다른 세 경계를 놓는다.
 * sync committee 교체: 8,192 slots × 12초 = 98,304초 ≈ 27.3시간 ≈ 1.14일.
 * checkpoint 나이 예: 86,400 slots × 12초 = 12일 ≈ 10.5번 교체.
 * Helios strict two-week check: 확인한 구현 snapshot의 운영 정책 14일.
 * Weak-subjectivity period는 validator set·churn·spec으로 계산하므로 축 위에 위치를 두지 않는다.
 */
const SLOT_SECONDS = 12;
const PERIOD_SLOTS = 8192;
const PERIOD_DAYS = (PERIOD_SLOTS * SLOT_SECONDS) / 86400;
const PERIOD_HOURS = PERIOD_DAYS * 24;
const AGE_SLOTS = 86400;
const AGE_DAYS = (AGE_SLOTS * SLOT_SECONDS) / 86400;
const POLICY_DAYS = 14;
const AXIS_DAYS = 16;
const ROTATIONS = Math.floor(AXIS_DAYS / PERIOD_DAYS);

const X0 = 24;
const X1 = 340;
const sx = (days: number) => X0 + (days / AXIS_DAYS) * (X1 - X0);
const C = { rot: "#7c3aed", age: "#2563eb", policy: "#d97706", muted: "#64748b", text: "#334155", line: "#cbd5e1" };

const SCENES = [
  {
    label: "Committee 교체 주기",
    summary: `8,192 slot ≈ ${PERIOD_HOURS.toFixed(1)}시간`,
    note: `Mainnet preset에서 sync committee는 256 epochs, 즉 8,192 slots마다 바뀝니다. 12초 slot이면 ${PERIOD_HOURS.toFixed(1)}시간이고, 16일 축 위에 촘촘한 눈금으로 찍힙니다.`,
  },
  {
    label: "Checkpoint 나이 계산",
    summary: `86,400 slot × 12초 = ${AGE_DAYS}일`,
    note: `Checkpoint 이후 86,400 slots가 지났다면 경과 초를 하루 86,400초로 나눠 ${AGE_DAYS}일입니다. 그 사이 committee는 약 ${(AGE_SLOTS / PERIOD_SLOTS).toFixed(1)}번 바뀌었습니다.`,
  },
  {
    label: "Helios의 14일 정책",
    summary: `${AGE_DAYS}일 < ${POLICY_DAYS}일 → 정책 통과`,
    note: "확인한 Helios 구현 snapshot은 strict two-week check를 둡니다. 12일은 이 선 안쪽이지만, 그렇다고 checkpoint 출처가 악의적이지 않다는 보장은 없습니다. 이 14일은 모든 light client의 protocol 상수가 아닙니다.",
  },
  {
    label: "Weak-subjectivity 기간은 따로",
    summary: "27.3시간 눈금 ≠ WS 기간",
    note: "Weak-subjectivity period는 validator set·churn과 spec/config로 계산하므로 이 축에 고정 위치가 없습니다. Committee 교체 눈금이나 Helios의 14일을 그 기간으로 바꿔 읽으면 서로 다른 경계를 합치게 됩니다.",
  },
] as const;

export default function WsTimelineViz() {
  return (
    <SceneShell
      eyebrow="세 개의 시간 경계"
      title="Committee 교체 27.3시간과 checkpoint 나이, Helios의 14일은 서로 다른 선입니다"
      description="가로축은 checkpoint 이후 경과 일수이며 0부터 16일까지 같은 비율입니다. 12초 slot과 86,400 slots는 본문의 예를 그대로 씁니다. 교체 눈금을 0일에서 시작한 것은 그림을 위한 정렬이며, 실제 교체 시점은 checkpoint와 맞지 않을 수 있습니다."
      ariaLabel="sync committee 교체 주기, checkpoint 나이 12일, Helios 14일 정책을 한 시간축에 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0} y={22} fontSize={10.5} fontWeight={700} fill={C.rot}>sync committee 교체 (≈{PERIOD_HOURS.toFixed(1)}시간마다)</text>
          {Array.from({ length: ROTATIONS + 1 }, (_, index) => (
            <line key={index} x1={sx(index * PERIOD_DAYS)} x2={sx(index * PERIOD_DAYS)} y1={32} y2={52} stroke={C.rot} strokeWidth={active === 0 || active === 3 ? 1.25 : 1} strokeOpacity={active === 0 || active === 3 ? 1 : 0.45} />
          ))}
          <line x1={X0} x2={X1} y1={52} y2={52} stroke={C.rot} strokeWidth={1} strokeOpacity={0.45} />

          {active >= 1 && (
            <>
              <rect x={X0} y={78} width={sx(AGE_DAYS) - X0} height={20} rx={3} fill={C.age} fillOpacity={0.18} stroke={C.age} strokeWidth={1} />
              <text x={X0 + 6} y={92} fontSize={10.5} fontWeight={700} fill={C.age}>checkpoint 나이 {AGE_DAYS}일</text>
              <text x={sx(AGE_DAYS)} y={112} textAnchor="middle" fontSize={9.5} fill={C.age}>지금</text>
            </>
          )}
          {active >= 2 && (
            <>
              <line x1={sx(POLICY_DAYS)} x2={sx(POLICY_DAYS)} y1={68} y2={114} stroke={C.policy} strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={sx(POLICY_DAYS)} y={128} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.policy}>Helios 정책</text>
              <text x={sx(POLICY_DAYS)} y={142} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.policy}>{POLICY_DAYS}일</text>
            </>
          )}
          {active === 3 && (
            <>
              <rect x={X0} y={154} width={X1 - X0} height={22} rx={4} fill="none" stroke={C.muted} strokeWidth={1} strokeDasharray="3 3" />
              <text x={(X0 + X1) / 2} y={169} textAnchor="middle" fontSize={10} fill={C.text}>WS period · validator churn 등으로 계산 · 고정 위치 없음</text>
            </>
          )}

          <line x1={X0} x2={X1} y1={180} y2={180} stroke={C.line} strokeWidth={1} />
          {[0, 4, 8, 12, 16].map((day) => (
            <g key={day}>
              <line x1={sx(day)} x2={sx(day)} y1={180} y2={184} stroke={C.line} strokeWidth={1} />
              <text x={sx(day)} y={196} textAnchor="middle" fontSize={9.5} fill={C.muted}>{day}일</text>
            </g>
          ))}
        </svg>
      )}
    />
  );
}
