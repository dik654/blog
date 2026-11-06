import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 100가구 = 찬성 60 + 반대 40, 반대 40 = 야간 생활 의존 15 + 그 밖의 25.
 * 25는 40 − 15의 산수이며, 글은 25가구가 왜 반대하는지 밝히지 않습니다.
 */
type Kind = "neutral" | "for" | "against" | "night";

const CELL = 22;
const STEP = 25;

const SCENES = [
  { label: "같은 규칙, 100가구", summary: "밤 10시 뒤 상가 영업 금지", note: "칸 하나가 한 가구입니다. 표결 뒤의 규칙은 찬성했든 반대했든 100가구 모두에게 같이 적용됩니다." },
  { label: "표결", summary: "찬성 60 : 반대 40", note: "찬성 가구는 수면 방해를 줄이고 싶습니다. 표결 결과는 여기까지이지만, 판단은 끝나지 않습니다." },
  { label: "반대 40 안의 15", summary: "40 = 15 + 25", note: "15가구는 찬성 60이 아니라 반대 40 안에 있고, 야간 근무 뒤 식료품과 약을 사야 합니다. 나머지 25가구의 사정은 글에 나오지 않습니다." },
] as const;

function kindAt(index: number, active: number): Kind {
  if (active === 0) return "neutral";
  if (index < 60) return "for";
  if (active === 2 && index >= 85) return "night";
  return "against";
}

function Mark({ kind, x, y, size }: { kind: Kind; x: number; y: number; size: number }) {
  if (kind === "for") return <rect x={x} y={y} width={size} height={size} rx={3} fill="#2563eb" />;
  if (kind === "against") return <rect x={x} y={y} width={size} height={size} rx={3} fill="#64748b" />;
  if (kind === "night") {
    return (
      <>
        <rect x={x} y={y} width={size} height={size} rx={3} fill="#d97706" />
        <circle cx={x + size / 2} cy={y + size / 2} r={size / 6} fill="#ffffff" />
      </>
    );
  }
  return <rect x={x} y={y} width={size} height={size} rx={3} fill="#94a3b8" opacity={0.3} />;
}

function Row({ kind, label, value, visible, indent = false, split = false }: { kind: Kind; label: string; value: number; visible: boolean; indent?: boolean; split?: boolean }) {
  return (
    <li className={`flex min-h-6 items-center gap-2 text-sm ${indent ? "pl-5" : ""} ${visible ? "" : "invisible"}`}>
      <svg viewBox="0 0 14 14" width={14} height={14} className="shrink-0" aria-hidden="true">
        {split ? (
          <>
            <path d="M3 0H14L0 14V3A3 3 0 0 1 3 0Z" fill="#64748b" />
            <path d="M14 0V11A3 3 0 0 1 11 14H0Z" fill="#d97706" />
          </>
        ) : (
          <Mark kind={kind} x={0} y={0} size={14} />
        )}
      </svg>
      <span className="min-w-0 flex-1 text-muted-foreground">{label}</span>
      <span className="font-mono font-bold">{value}</span>
    </li>
  );
}

export default function HouseholdVoteViz() {
  return (
    <SceneShell
      eyebrow="100가구"
      title="찬성 60과 반대 40, 그 안의 15가구를 한 판에 셉니다"
      description="모든 숫자는 글이 세운 사례입니다. 칸의 위치에는 뜻이 없고 개수만 읽습니다."
      ariaLabel="100가구가 찬성 60, 반대 40으로 나뉘고 반대 안에 야간 생활 의존 15가구가 있는 모습"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto grid max-w-[640px] gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
          <div className="mx-auto w-[140px] sm:w-[260px]">
            <svg viewBox="0 0 248 248" className="h-auto w-full" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {Array.from({ length: 100 }, (_, index) => (
                <Mark key={index} kind={kindAt(index, active)} x={(index % 10) * STEP} y={Math.floor(index / 10) * STEP} size={CELL} />
              ))}
            </svg>
          </div>
          <ul className="min-w-0 space-y-1">
            <Row kind="for" label="찬성" value={60} visible={active >= 1} />
            <Row kind="against" label="반대" value={40} visible={active >= 1} split={active >= 2} />
            <Row kind="night" label="그중 야간 생활 의존" value={15} visible={active >= 2} indent />
            <Row kind="against" label="그중 나머지" value={25} visible={active >= 2} indent />
          </ul>
        </div>
      )}
    />
  );
}
