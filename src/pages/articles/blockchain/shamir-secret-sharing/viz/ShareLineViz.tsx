import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 규칙 5+3×번호로 (1,8)·(2,11)·(3,14)를 만들고 1·2번으로 2×8−11=5를 복원한다.
 * 한 기록 8은 비밀 5(+3×번호)로도, 비밀 0(+8×번호)으로도 만들 수 있다.
 * 그린 값은 모두 17보다 작아 나머지를 취해도 바뀌지 않는다.
 */
const W = 360;
const H = 220;
const X0 = 46;
const STEP = 92;
const BASE = 190;
const UNIT = 9.6;
const px = (x: number) => X0 + x * STEP;
const py = (y: number) => BASE - y * UNIT;

const SHARES = [
  { x: 1, y: 8 },
  { x: 2, y: 11 },
  { x: 3, y: 14 },
] as const;

const SCENES = [
  {
    label: "규칙 하나에서 기록 셋",
    summary: "5 + 3×번호 → 8 · 11 · 14",
    note: "번호가 하나 늘 때마다 결과가 3씩 올라갑니다. 번호 0 자리의 값 5가 비밀이라 0번 기록은 아무에게도 주지 않습니다.",
  },
  {
    label: "1번과 2번만 모이면",
    summary: "8 − (11 − 8) = 2×8 − 11 = 5",
    note: "두 기록의 차이 11 − 8 = 3이 번호 한 칸마다 오르는 양입니다. 1번에서 한 칸 뒤로 가면 8 − 3 = 5이고, 이 계산을 한 줄로 쓰면 2×8 − 11입니다. 3번 기록은 쓰지 않았습니다.",
  },
  {
    label: "1번 하나뿐이면",
    summary: "8 = 5 + 3×1 = 0 + 8×1",
    note: "점 하나를 지나는 규칙은 여러 개입니다. 비밀 5에 3씩 더하는 규칙도, 비밀 0에 8씩 더하는 규칙도 1번에서 8을 냅니다. 기록 8 하나로는 0번 자리의 값을 정할 수 없습니다.",
  },
] as const;

const TICKS = [0, 5, 10, 15] as const;

export default function ShareLineViz() {
  return (
    <SceneShell
      eyebrow="두 기록으로 비밀 찾기"
      title="두 점이 있으면 0번 자리의 값이 하나로 정해집니다"
      description="가로는 보관자 번호, 세로는 계산 결과입니다. 여기 나오는 값은 모두 17보다 작아서 17로 나눈 나머지를 취해도 그대로이므로 곧은 선으로 그렸습니다."
      ariaLabel="규칙 5 더하기 3 곱하기 번호의 세 기록과, 두 기록으로 비밀 5를 되찾는 계산, 한 기록만으로는 비밀이 정해지지 않는 경우"
      scenes={SCENES}
      render={(active) => {
        const showAll = active === 0;
        const pair = active === 1;
        const single = active === 2;
        const used = (x: number) => (showAll ? true : x <= 2);
        const visible = SHARES.filter((share) => !single || share.x === 1);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {TICKS.map((tick) => (
              <g key={tick}>
                <line x1={X0} x2={W - 14} y1={py(tick)} y2={py(tick)} stroke="#cbd5e1" strokeWidth={tick === 0 ? 1 : 0.6} />
                <text x={X0 - 8} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            {[0, 1, 2, 3].map((x) => (
              <text key={x} x={px(x)} y={BASE + 18} textAnchor="middle" fontSize={11} fill="#64748b">{x === 0 ? "0번(안 나눔)" : `${x}번`}</text>
            ))}
            <text x={W - 14} y={py(16.4)} textAnchor="end" fontSize={11} fill="#64748b">결과</text>

            {!single && (
              <line x1={px(0)} y1={py(5)} x2={px(3)} y2={py(14)} stroke="#2563eb" strokeWidth={1.25} strokeDasharray={pair ? "4 3" : undefined} />
            )}
            {single && (
              <>
                <line x1={px(0)} y1={py(5)} x2={px(2)} y2={py(11)} stroke="#2563eb" strokeWidth={1.25} />
                <line x1={px(0)} y1={py(0)} x2={px(2)} y2={py(16)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
                <text x={px(2) + 6} y={py(11) + 4} fontSize={11} fill="#2563eb">비밀 5, +3</text>
                <text x={px(2) + 6} y={py(16) + 4} fontSize={11} fill="#b45309">비밀 0, +8</text>
                <circle cx={px(0)} cy={py(0)} r={5} fill="#ffffff" stroke="#d97706" strokeWidth={1.25} />
              </>
            )}

            {pair && (
              <>
                <line x1={px(1)} y1={py(8)} x2={px(2)} y2={py(8)} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={px(2)} y1={py(8)} x2={px(2)} y2={py(11)} stroke="#16a34a" strokeWidth={1.25} />
                <text x={px(2) + 6} y={py(9.5) + 4} fontSize={11} fontWeight={700} fill="#15803d">+3</text>
                <line x1={px(0)} y1={py(8)} x2={px(1)} y2={py(8)} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={px(0)} y1={py(8)} x2={px(0)} y2={py(5)} stroke="#16a34a" strokeWidth={1.25} />
                <text x={px(0) + 6} y={py(6.5) + 4} fontSize={11} fontWeight={700} fill="#15803d">−3</text>
              </>
            )}

            <circle cx={px(0)} cy={py(5)} r={6} fill={single ? "#ffffff" : "#2563eb"} stroke="#2563eb" strokeWidth={1.25} />
            <text x={px(0) + 10} y={py(5) + 18} fontSize={11} fontWeight={700} fill="#2563eb">{single ? "5?" : "비밀 5"}</text>

            {visible.map((share) => (
              <g key={share.x} opacity={used(share.x) ? 1 : 0.25}>
                <circle cx={px(share.x)} cy={py(share.y)} r={5.5} fill="#0f172a" />
                <text x={px(share.x) - 8} y={py(share.y) - 9} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">{`(${share.x},${share.y})`}</text>
              </g>
            ))}
            {single && <text x={px(0) + 16} y={py(0) + 4} fontSize={11} fontWeight={700} fill="#b45309">0?</text>}
          </svg>
        );
      }}
    />
  );
}
