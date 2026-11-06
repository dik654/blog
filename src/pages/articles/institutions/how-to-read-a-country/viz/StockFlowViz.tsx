import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 둘째 문단 — (가정) 100·60·5는 1년 동안의 흐름, 30은 연말 한 시점의 잔액.
 * 100 − 60 = 40, 100 + 30 + 5 = 135는 소득이라고 부를 수 없는 합.
 */
const X0 = 16;
const X1 = 344;
const ROWS = [
  { key: "export", y: 44, label: "외국에 판 물건 100", kind: "band", color: "#2563eb" },
  { key: "parts", y: 84, label: "그 물건의 외국산 부품값 60", kind: "band", color: "#2563eb" },
  { key: "debt", y: 124, label: "기업들의 연말 외화 부채 잔액 30", kind: "point", color: "#dc2626" },
  { key: "gov", y: 164, label: "정부가 수입보다 더 쓴 지출 5", kind: "band", color: "#2563eb" },
] as const;

const VISIBLE: readonly (readonly string[])[] = [
  ["export", "parts"],
  ["export", "parts", "debt"],
  ["export", "parts", "debt", "gov"],
  ["export", "parts", "debt", "gov"],
];

const SCENES = [
  { label: "한 해 동안의 흐름", summary: "100 − 60 = 40", note: "100과 60은 1년 내내 오간 돈을 모은 값입니다. 뺀 40이 이 생산 사슬 안에서 나눌 잔액입니다." },
  { label: "한 시점의 빚", summary: "연말에 찍은 점 하나, 30", note: "잔액은 어느 날 현재 남아 있는 금액입니다. 30은 1년 동안 흐른 돈이 아니라 연말 시점의 빚이라서 띠가 아니라 점으로 그렸습니다." },
  { label: "정부의 한 해 부족액", summary: "한 해 동안 모자란 5", note: "5도 1년에 걸친 값이지만 대상이 다릅니다. 생산 사슬이 아니라 정부의 수입과 지출 차이입니다." },
  { label: "더해 보면", summary: "135는 소득이 아닙니다", note: "셈은 되지만 소득이라고 부를 수 없습니다. 판매액, 한 시점의 빚, 한 해의 부족액은 서로 다른 대상을 셉니다." },
] as const;

export default function StockFlowViz() {
  return (
    <SceneShell
      eyebrow="네 숫자가 세는 것"
      title="1년에 걸친 값과 연말 한 점의 값은 더할 수 없습니다"
      description="(가정) A국의 숫자이며 단위는 모두 같은 외화 금액 단위입니다. 가로축은 1년이고, 띠의 길이는 금액이 아니라 기간입니다. 파란 띠는 1년에 걸친 값, 빨간 점은 연말 한 시점의 값입니다."
      ariaLabel="연간 흐름 100, 60, 5와 연말 잔액 30을 1년 시간축에 놓은 그림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0} y={14} fontSize={11} fill="#64748b">연초</text>
          <text x={X1} y={14} textAnchor="end" fontSize={11} fill="#64748b">연말</text>
          <line x1={X1} x2={X1} y1={20} y2={182} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
          {ROWS.map((row) => {
            const on = VISIBLE[active].includes(row.key);
            return (
              <g key={row.key} opacity={on ? 1 : 0.15}>
                <text x={X0} y={row.y - 4} fontSize={12} fontWeight={600} fill="currentColor">{row.label}</text>
                {row.kind === "band" ? (
                  <rect x={X0} y={row.y} width={X1 - X0} height={10} rx={2} fill={row.color} opacity={0.75} />
                ) : (
                  <circle cx={X1} cy={row.y + 5} r={5.5} fill={row.color} />
                )}
              </g>
            );
          })}
          <g opacity={active === 3 ? 1 : 0}>
            <text x={180} y={210} textAnchor="middle" fontSize={15} fontWeight={700} fill="#dc2626">100 + 30 + 5 = 135</text>
            <line x1={104} x2={256} y1={205} y2={205} stroke="#dc2626" strokeWidth={1.25} />
          </g>
        </svg>
      )}
    />
  );
}
