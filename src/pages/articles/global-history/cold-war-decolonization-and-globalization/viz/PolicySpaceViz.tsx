import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 차관 20 → 외화 지출 증가 → 수출 수입 감소 시 상환 칸 15 초과,
 * 그리고 공동 구매·지역 시장·원자재 협정이 의존을 낮추고 선택 가능한 계약을 늘리는 길.
 * 초과 크기는 본문에 수치가 없어 점선과 물음표로만 나타낸다. 대안의 선 개수는 가정이다.
 */
const STEPS = [
  "개발 차관 20 → 전력과 도로를 빨리 지음",
  "수입 기계·외국 기술자에 의존하면 → 외화 지출도 늘어남",
  "수출 수입이 줄면 → 원금과 이자가 상환 칸 15를 넘어섬",
  "반대 방향: 공동 구매·지역 시장·원자재 협정 → 계약 대안이 늘어남",
] as const;

const SCENES = [
  { label: "차관 20이 더해지면", summary: "예산 100 + 차관 20", note: "정부는 전력과 도로를 빨리 지을 수 있습니다. 아래 칸은 예산 100 가운데 외채 상환과 필수 수입에 둔 15이며, 지금은 넘친다는 표시가 없습니다." },
  { label: "기계와 기술자를 사 오면", summary: "외화 지출 증가", note: "사업이 수입 기계와 외국 기술자에 의존하면 외화 지출도 함께 늘어납니다. 얼마나 늘지는 글에 수치가 없습니다." },
  { label: "수출 수입이 줄 때", summary: "원금과 이자 > 상환 칸 15", note: "칸 15를 넘어선 부분을 점선으로 그렸습니다. 넘는 크기는 글에 수치가 없어 물음표로 두었습니다." },
  { label: "여러 나라가 함께 맺으면", summary: "의존을 낮출 수 있음", note: "한 공급자와 한 수출 시장에 대한 의존을 낮출 수 있고, 선택 가능한 계약의 수가 늘어납니다. 협상력이 자동으로 생기는 것은 아닙니다. 그림의 선 개수는 가정입니다." },
] as const;

function RepaymentSlot({ over }: { over: boolean }) {
  return (
    <svg viewBox="0 0 360 96" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={over ? "원금과 이자가 상환 칸 15를 넘어선 상태" : "예산 100 가운데 상환 칸 15"}>
      <text x={14} y={18} fontSize={13} fontWeight={700} fill="currentColor">상환 칸 15 (외채 상환·필수 수입)</text>
      <rect x={14} y={30} width={170} height={36} rx={4} fill={over ? "#d97706" : "none"} stroke="#d97706" strokeWidth={1.25} />
      {over && (
        <>
          <rect x={184} y={30} width={110} height={36} fill="none" stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
          <text x={239} y={53} textAnchor="middle" fontSize={15} fontWeight={700} fill="#dc2626">?</text>
          <text x={99} y={53} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">원금과 이자</text>
          <text x={239} y={85} textAnchor="middle" fontSize={12} fill="#dc2626">칸을 넘어선 부분</text>
        </>
      )}
    </svg>
  );
}

function Spokes({ x, count, label }: { x: number; count: number; label: string }) {
  const ys = count === 1 ? [46] : [20, 46, 72];
  return (
    <g>
      <text x={x + 62} y={106} textAnchor="middle" fontSize={12} fill="currentColor">{label}</text>
      {ys.map((y) => (
        <g key={`supply-${y}`}>
          <line x1={x + 12} y1={y} x2={x + 62} y2={46} stroke="#475569" strokeWidth={1} />
          <circle cx={x + 8} cy={y} r={5} fill="#64748b" />
          <line x1={x + 112} y1={y} x2={x + 62} y2={46} stroke="#475569" strokeWidth={1} />
          <circle cx={x + 116} cy={y} r={5} fill="#16a34a" />
        </g>
      ))}
      <circle cx={x + 62} cy={46} r={9} fill="#2563eb" />
    </g>
  );
}

function Alternatives() {
  return (
    <div className="min-w-0">
      <svg viewBox="0 0 360 116" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label="공급자와 수출 시장이 하나일 때와 여럿일 때의 연결">
        <Spokes x={22} count={1} label="공급자 1 · 시장 1" />
        <Spokes x={214} count={3} label="여럿 (개수는 가정)" />
      </svg>
      <p className="mt-1 text-center text-xs leading-5 text-muted-foreground">회색 = 공급자 · 파랑 = 정부 · 초록 = 수출 시장</p>
    </div>
  );
}

export default function PolicySpaceViz() {
  return (
    <SceneShell
      eyebrow="정책 공간"
      title="같은 예산에서 선택지가 좁아지는 길과 넓어지는 길"
      description="위 1~3줄은 원인의 순서이고 4줄은 그 반대 방향의 길이며, 아래 그림은 현재 줄의 상태입니다. 예산 100과 차관 20은 3절의 가정이고, 상환 칸 그림의 폭은 축척이 아닙니다."
      ariaLabel="차관에서 상환 칸 초과까지의 순서와 공동 구매 같은 대안으로 늘어나는 계약 선택지"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <ol className="space-y-1 text-sm leading-6">
            {STEPS.map((step, index) => (
              <li key={step} className={`grid grid-cols-[1.5rem_minmax(0,1fr)] ${index === active ? "font-bold" : index < active && active < 3 ? "text-foreground/80" : "text-muted-foreground/60"}`}>
                <span className="font-mono">{index === active ? "▶" : `${index + 1}`}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 border-t border-border/70 pt-3">
            {active < 3 ? <RepaymentSlot over={active === 2} /> : <Alternatives />}
          </div>
        </div>
      )}
    />
  );
}
