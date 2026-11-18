import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 행동 전에 통로별 실패를 찾는다(표지 날짜 재확인, 짐에 대한 대안 가설, 같은 규칙인지 비교,
 * 상인이 직접 아는지). 네 통로가 같은 원자료를 되풀이했으면 증거가 독립적으로 네 배 강해진 것이 아니다.
 * 시장이 실제 열렸는지 사후 확인해 어느 통로와 조건에서 오류가 났는지 기록한다.
 * 출처가 넷인 경우와 하나인 경우는 비교를 위한 가정이며, 어떤 원자료인지는 글이 정하지 않는다.
 */
const CHECKS: readonly { name: string; check: string }[] = [
  { name: "지각", check: "표지의 날짜를 다시 봅니다" },
  { name: "추론", check: "짐이 시장 때문인지 다른 이유인지 대안 가설을 묻습니다" },
  { name: "비교", check: "지난 표식과 정말 같은 규칙인지 맞춥니다" },
  { name: "증언", check: "상인이 직접 아는지 전해 들었는지 확인합니다" },
];

const XS: readonly number[] = [45, 135, 225, 315];

const SCENES = [
  { label: "통로마다 실패할 자리를 찾습니다", summary: "검사 4", note: "네 기록을 한 덩어리의 확신으로 합치기 전에, 기록마다 어떻게 틀릴 수 있는지를 따로 묻습니다." },
  { label: "출처가 서로 다를 때 (가정)", summary: "원자료 4 → 기록 4", note: "네 기록이 각각 다른 원자료에서 나왔다고 가정한 그림입니다. 다음 장면과 비교하기 위한 기준 그림이며, 이때 증거가 꼭 네 배 강해진다고 글이 말하지는 않습니다." },
  { label: "같은 원자료를 되풀이할 때 (가정)", summary: "원자료 1 → 기록 4", note: "네 기록이 같은 원자료를 되풀이했다면 기록은 넷이어도 증거가 독립적으로 네 배 강해진 것이 아닙니다." },
  { label: "시장에 다녀와 오류를 기록합니다", summary: "사후 확인 → 다음 판단", note: "시장이 실제로 열렸는지 사후에 확인하고, 틀렸다면 어느 통로와 어떤 조건에서 오류가 났는지 기록합니다." },
] as const;

function SourceMap({ shared }: { shared: boolean }) {
  const originXs = shared ? [180] : XS;
  const stroke = shared ? "#dc2626" : "#2563eb";
  return (
    <svg viewBox="0 0 360 220" className="mx-auto block h-auto w-full max-w-md" role="img" aria-label={shared ? "원자료 하나에서 네 기록이 나와 결론으로 모이는 그림" : "원자료 넷에서 각각 기록이 나와 결론으로 모이는 그림"}>
      {XS.map((x) => (
        <line key={`up-${x}`} x1={shared ? 180 : x} y1={44} x2={x} y2={92} stroke={stroke} strokeWidth={1} />
      ))}
      {XS.map((x) => (
        <line key={`down-${x}`} x1={x} y1={120} x2={180} y2={168} stroke="#94a3b8" strokeWidth={1} />
      ))}
      {originXs.map((x, index) => (
        <g key={`origin-${x}`}>
          <rect x={x - (shared ? 60 : 38)} y={16} width={shared ? 120 : 76} height={28} rx={6} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray={shared ? "4 3" : undefined} />
          <text x={x} y={35} textAnchor="middle" fontSize={14} fill="currentColor">
            {shared ? "같은 원자료" : `원자료 ${index + 1}`}
          </text>
        </g>
      ))}
      {CHECKS.map((item, index) => (
        <g key={item.name}>
          <rect x={XS[index] - 38} y={92} width={76} height={28} rx={6} fill="none" stroke="#64748b" strokeWidth={1} />
          <text x={XS[index]} y={111} textAnchor="middle" fontSize={15} fontWeight={600} fill="currentColor">
            {item.name}
          </text>
        </g>
      ))}
      <rect x={100} y={168} width={160} height={32} rx={6} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={180} y={189} textAnchor="middle" fontSize={14} fill="currentColor">
        내일 시장이 열린다
      </text>
    </svg>
  );
}

function Detail({ index }: { index: number }) {
  if (index === 0) {
    return (
      <ul className="space-y-2">
        {CHECKS.map((item) => (
          <li key={item.name} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-2 rounded-lg border border-border px-3 py-2 text-sm leading-6">
            <span className="font-bold text-primary">{item.name}</span>
            <span>{item.check}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (index === 1 || index === 2) {
    const shared = index === 2;
    return (
      <div className="min-w-0 space-y-2">
        <SourceMap shared={shared} />
        <p className={`rounded-lg border px-3 py-2 text-center text-sm font-semibold ${shared ? "border-dashed border-red-600/70" : "border-border"}`}>
          {shared ? "기록 4 ≠ 네 배 강한 증거" : "원자료 4 · 기록 4"}
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-border px-3 py-2 text-sm leading-6">
        <span className="block text-xs text-muted-foreground">사후 확인</span>
        <span className="font-semibold">시장이 실제로 열렸나?</span>
      </div>
      <p aria-hidden className="text-center text-sm text-primary">↓</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border px-3 py-2 text-sm leading-6">
          <span className="block text-xs text-muted-foreground">적을 것 1</span>
          <span className="font-semibold">어느 통로에서 틀렸나</span>
        </div>
        <div className="rounded-lg border border-border px-3 py-2 text-sm leading-6">
          <span className="block text-xs text-muted-foreground">적을 것 2</span>
          <span className="font-semibold">어떤 조건에서 틀렸나</span>
        </div>
      </div>
      <p aria-hidden className="text-center text-sm text-primary">↓</p>
      <div className="rounded-lg border border-primary/70 px-3 py-2 text-center text-sm font-semibold">다음 판단 기준을 고칩니다</div>
    </div>
  );
}

export default function IndependenceCheckViz() {
  return (
    <SceneShell
      eyebrow="기록 수와 증거의 힘"
      title="기록이 넷이어도 출처가 하나면 네 배가 아닙니다"
      description="가운데 네 칸은 3절의 시장 기록(지각·추론·비교·증언)이고, 위 칸은 그 기록이 나온 원자료입니다. 원자료가 넷인지 하나인지는 비교를 위한 가정입니다."
      ariaLabel="네 기록의 통로별 검사, 출처가 넷일 때와 하나일 때의 비교, 사후 확인으로 오류를 기록하는 네 장면"
      scenes={SCENES}
      render={(active) => <Detail index={active} />}
    />
  );
}
