import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 다른 bridge가 B의 5개를 먼저 지급할 수 있다. 유동성 제공자·메시지 검증·별도 계약을 추가로 검토하고,
 * canonical 절차가 사라졌다고 일반화하지 않는다. 글은 유동성 제공자가 어떻게 돌려받는지 적지 않으므로 그리지 않는다.
 */
const W = 360;
const H = 176;
const SLATE = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";

const SCENES = [
  { label: "Canonical 경로", summary: "인출 시작 → 약 7일 → L1 claim", note: "지금까지 따라온 길입니다. 공식 안내의 약 7일을 거쳐 L1에서 claim해야 B의 수령 5가 기록됩니다." },
  { label: "다른 bridge가 먼저 지급", summary: "먼저 지급받을 수 있음", note: "다른 bridge가 B의 5개를 먼저 지급할 수는 있습니다. 그렇다고 canonical 경로의 이의 제기 절차가 사라졌다고 일반화하지 않습니다. 그래서 위 줄을 지우지 않았습니다." },
  { label: "추가로 보는 조건", summary: "조건 세 가지 + 청구 상대", note: "유동성 제공자(먼저 지급할 자금을 내는 쪽), 메시지 검증, 별도 계약의 조건을 추가로 검토합니다. 급한 지급을 받는 대가와 실패 때 누구에게 청구할지도 확인해야 합니다." },
] as const;

function Step({ x, y, w, label, color, faded = false }: { x: number; y: number; w: number; label: string; color: string; faded?: boolean }) {
  return (
    <g opacity={faded ? 0.4 : 1}>
      <rect x={x} y={y} width={w} height={34} rx={6} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + 21} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function Arrow({ x1, x2, y, color, faded = false }: { x1: number; x2: number; y: number; color: string; faded?: boolean }) {
  return (
    <g stroke={color} strokeWidth={1} fill="none" opacity={faded ? 0.4 : 1}>
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <path d={`M${x2 - 5} ${y - 4}L${x2} ${y}L${x2 - 5} ${y + 4}`} />
    </g>
  );
}

export default function FastBridgeViz() {
  return (
    <SceneShell
      eyebrow="먼저 받는 길"
      title="먼저 지급받는 길에는 검토할 조건이 더 붙습니다"
      description="위 줄은 canonical 경로, 아래 줄은 다른 bridge가 B의 5개를 먼저 지급하는 경우입니다. 간격은 시간에 비례하지 않습니다. 유동성 제공자가 나중에 어떻게 돌려받는지는 글이 다루지 않아 그리지 않았습니다."
      ariaLabel="canonical 인출과 다른 bridge의 선지급, 추가로 검토할 조건"
      scenes={SCENES}
      render={(active) => {
        const fast = active >= 1;
        const faded = active === 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={6} y={12} fontSize={11} fontWeight={700} fill={SLATE}>Canonical</text>
            <g opacity={active === 2 ? 0.55 : 1}>
              <Step x={6} y={20} w={72} label="인출 시작" color={BLUE} />
              <Arrow x1={78} x2={96} y={37} color={SLATE} />
              <Step x={96} y={20} w={72} label="약 7일" color={BLUE} />
              <Arrow x1={168} x2={186} y={37} color={SLATE} />
              <Step x={186} y={20} w={72} label="L1 claim" color={BLUE} />
              <Arrow x1={258} x2={276} y={37} color={SLATE} />
              <Step x={276} y={20} w={78} label="B 수령 5" color={BLUE} />
            </g>
            <text x={6} y={78} fontSize={11} fontWeight={700} fill={SLATE} opacity={faded ? 0.4 : 1}>다른 bridge</text>
            <Step x={6} y={86} w={72} label="B의 5" color={fast ? AMBER : SLATE} faded={!fast} />
            <Arrow x1={78} x2={96} y={103} color={fast ? AMBER : SLATE} faded={!fast} />
            <Step x={96} y={86} w={162} label="다른 bridge가 먼저 지급" color={fast ? AMBER : SLATE} faded={!fast} />
            <Arrow x1={258} x2={276} y={103} color={fast ? AMBER : SLATE} faded={!fast} />
            <Step x={276} y={86} w={78} label="먼저 수령 5" color={fast ? AMBER : SLATE} faded={!fast} />
            {active === 2 && (
              <g>
                {[["유동성 제공자", 6], ["메시지 검증", 126], ["별도 계약", 246]].map(([text, x]) => (
                  <g key={String(text)}>
                    <rect x={Number(x)} y={132} width={108} height={22} rx={6} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                    <text x={Number(x) + 54} y={147} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>{text}</text>
                  </g>
                ))}
                <text x={180} y={171} textAnchor="middle" fontSize={11} fontWeight={700} fill={SLATE}>실패 때 누구에게 청구하는가?</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
