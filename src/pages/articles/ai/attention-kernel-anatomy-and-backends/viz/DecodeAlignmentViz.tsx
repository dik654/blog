import SceneShell from "./SceneShell";

/**
 * 본문 대응: #causal (8절) — decode 한 행의 로컬 번호 0을 원래 위치 7에 맞추는 길이 차이.
 * key 길이 8 − query 길이 1 = 7. 바른 정렬: key 0~7 여덟 개, 평균 36÷8=4.5.
 * 로컬 번호끼리만 비교: key 0만 남음(값 1 하나의 평균 1).
 * 큰 예 N=4,096, B=128 → 32×32=1,024조각, 처리 528 = 아래 496 + 대각선 32, 건너뜀 496.
 */
const SCENES = [
  {
    label: "여덟 행을 한꺼번에",
    summary: "행 i는 key 0~i",
    note: "query와 key의 길이가 같으면 행 번호가 곧 원래 위치입니다. 행 i는 key 0부터 i까지 읽어 삼각형이 됩니다.",
  },
  {
    label: "decode 한 행 · 길이 차이 7",
    summary: "로컬 0 + 7 = 원래 위치 7",
    note: "decode에서 마지막 한 위치만 새로 계산하면 query 배열은 한 행뿐이라 그 행의 배열 안 번호는 0입니다. key 길이 8에서 query 길이 1을 뺀 7을 더하면 원래 위치 7에 놓이고, key 여덟 개를 모두 읽어 4.5를 냅니다.",
  },
  {
    label: "로컬 번호끼리만 비교",
    summary: "key 0만 남는 잘못된 마스크",
    note: "길이 차이를 더하지 않으면 로컬 0이 맨 위 행처럼 취급되어 첫 key만 허용합니다. 값 1 하나의 평균인 1이 나와 원래 답 4.5와 다릅니다.",
  },
  {
    label: "N=4,096 · B=128",
    summary: "1,024조각 중 528조각 처리",
    note: "한 변이 4,096÷128=32조각입니다. 대각선 32조각과 그 아래 496조각을 처리하고 위쪽 496조각은 건너뜁니다. 대각선 조각만 칸별로 가립니다.",
  },
] as const;

const VALUES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const C = 22;
const X0 = 62;
const Y0 = 44;
const OUT_X = X0 + 8 * C + 10;

function SmallGrid({ active }: { active: number }) {
  // active 0: 전체 8행, 1: 행 7만, 2: 행 0만(로컬 번호 오해)
  const queryRow = active === 1 ? 7 : active === 2 ? 0 : -1;
  return (
    <>
      <text x={X0 + 4 * C} y={18} textAnchor="middle" fontSize={11} fill="#64748b">key의 값 (위치 0 → 7)</text>
      {VALUES.map((v, c) => (
        <text key={v} x={X0 + c * C + C / 2} y={Y0 - 6} textAnchor="middle" fontSize={11} fill="#64748b">{v}</text>
      ))}
      <text x={X0 - 8} y={Y0 - 6} textAnchor="end" fontSize={10} fill="#64748b">위치</text>
      <text x={OUT_X} y={Y0 - 6} fontSize={10} fill="#64748b">출력</text>
      {VALUES.map((_, r) => {
        const on = active === 0 || r === queryRow;
        return (
          <g key={r} opacity={on ? 1 : 0.22}>
            <text x={X0 - 8} y={Y0 + r * C + 15} textAnchor="end" fontSize={11} fill="#64748b">{r}</text>
            {VALUES.map((__, c) => {
              const allowed = c <= r;
              return (
                <rect
                  key={c}
                  x={X0 + c * C}
                  y={Y0 + r * C}
                  width={C}
                  height={C}
                  fill={on && allowed ? (active === 2 ? "#fecaca" : "#bfdbfe") : "none"}
                  stroke="#94a3b8"
                  strokeWidth={1}
                />
              );
            })}
            {on && (
              <text x={OUT_X} y={Y0 + r * C + 15} fontSize={11} fontWeight={700} fill={active === 2 ? "#dc2626" : "#2563eb"}>
                {active === 0 ? (r + 2) / 2 : active === 1 ? "4.5" : "1"}
              </text>
            )}
          </g>
        );
      })}
      {queryRow >= 0 && (
        <rect x={X0 - 1} y={Y0 + queryRow * C - 1} width={8 * C + 2} height={C + 2} fill="none" stroke={active === 2 ? "#dc2626" : "#2563eb"} strokeWidth={1.25} />
      )}
      {queryRow >= 0 && (
        <text x={X0 + 4 * C} y={Y0 + 8 * C + 20} textAnchor="middle" fontSize={11} fill={active === 2 ? "#dc2626" : "#2563eb"}>
          {active === 1 ? "배열 안 번호 0 → 원래 위치 7" : "배열 안 번호 0을 위치 0으로 읽음"}
        </text>
      )}
    </>
  );
}

function BigGrid() {
  const n = 32;
  const s = 5.5;
  const x0 = 30;
  const y0 = 26;
  return (
    <>
      {Array.from({ length: n * n }, (_, i) => {
        const r = Math.floor(i / n);
        const c = i % n;
        const fill = c < r ? "#bfdbfe" : c === r ? "#fde68a" : "none";
        return <rect key={i} x={x0 + c * s} y={y0 + r * s} width={s} height={s} fill={fill} stroke="#cbd5e1" strokeWidth={0.5} />;
      })}
      <text x={x0 + n * s + 10} y={y0 + 40} fontSize={11} fill="#64748b">위 496</text>
      <text x={x0 + n * s + 10} y={y0 + 56} fontSize={11} fill="#64748b">건너뜀</text>
      <text x={x0 + n * s + 10} y={y0 + 110} fontSize={11} fill="#b45309">대각선 32</text>
      <text x={x0 + n * s + 10} y={y0 + 150} fontSize={11} fill="#2563eb">아래 496</text>
      <text x={x0 + (n * s) / 2} y={y0 + n * s + 20} textAnchor="middle" fontSize={11} fill="#64748b">처리 528 = 496 + 32</text>
    </>
  );
}

export default function DecodeAlignmentViz() {
  return (
    <SceneShell
      eyebrow="위치 정렬"
      title="한 행만 남아도 그 행은 원래 위치 7에 맞춰 가립니다"
      description="가정한 여덟 위치의 마스크입니다. 파란 칸은 허용한 연결, 빈 칸은 가린 미래입니다. 마지막 장면은 같은 삼각형을 128×128 조각 단위로 센 것입니다."
      ariaLabel="decode 한 행의 위치 정렬과 큰 입력의 조각 수"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 300 260" className="mx-auto block h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 ? <SmallGrid active={active} /> : <BigGrid />}
        </svg>
      )}
    />
  );
}
