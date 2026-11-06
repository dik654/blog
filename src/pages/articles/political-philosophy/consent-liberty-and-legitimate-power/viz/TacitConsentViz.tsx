import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 로크 §119의 묵시적 동의 범위가 넓어지는 순서.
 * 칸의 크기는 인원 수가 아니라 범위가 넓어지는 순서만 나타냅니다.
 * 3·4번은 2번 기준에 포함되는 예이고(글: "까지 포함되고"), 2번 바깥의 별도 기준이 아닙니다.
 */
const RINGS = [
  { w: 64, h: 40, label: "말이나 서명으로 밝힌 동의" },
  { w: 118, h: 76, label: "영토 어느 부분이든 소유하거나 누림" },
  { w: 172, h: 112, label: "그 예: 일주일 묵는 숙소" },
  { w: 226, h: 148, label: "그 예: 큰길을 자유롭게 지나감" },
  { w: 288, h: 188, label: "결국 영토 안에 있다는 것 자체" },
] as const;

const SCENES = [
  { label: "명시적 동의", summary: "직접 밝힌 동의", note: "로크는 §119에서 둘을 나눕니다. 명시적 동의는 말이나 서명으로 밝히는 것, 묵시적 동의는 그런 표시 없이 동의한 것으로 치는 것입니다." },
  { label: "소유하거나 누림", summary: "여기부터 묵시적 동의", note: "그 정부 영토의 어느 부분이든 소유하거나 누리는 사람은 묵시적 동의를 한 것이라고 로크는 답합니다." },
  { label: "일주일 묵는 숙소", summary: "머무는 일까지", note: "2번 기준에는 일주일 묵는 숙소도 포함됩니다. 잠시 머무는 사람까지 동의한 사람으로 세어집니다." },
  { label: "큰길을 지나감", summary: "지나가는 일까지", note: "100가구 사례로 옮기면 동네 길을 한 번 지나간 방문자도 영업시간 규칙에 동의한 사람으로 세어지는 셈입니다." },
  { label: "영토 안에 있음", summary: "영토 안에 있는 것까지", note: "로크의 “the very being”은 영토 안에 있는 것까지 닿습니다. 글의 비판: 바깥 자리가 없으면 동의는 권력을 제한하는 힘을 잃습니다." },
] as const;

const CX = 150;
const CY = 100;

export default function TacitConsentViz() {
  return (
    <SceneShell
      eyebrow="로크 §119"
      title="묵시적 동의를 넓히면 ‘동의 안 한 사람’의 자리가 사라집니다"
      description="바깥 틀이 그 정부의 영토입니다. 칸의 크기는 인원 수가 아니라 범위가 넓어지는 순서만 나타냅니다."
      ariaLabel="명시적 동의에서 영토 안에 있는 것 자체까지 동의로 세는 범위가 넓어지는 모습"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto grid max-w-[720px] gap-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:items-center">
          <div className="mx-auto w-[240px] sm:w-full">
          <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={6.5} y={6.5} width={287} height={187} rx={6} fill="none" stroke="#64748b" strokeWidth={1} />
            {[4, 3, 2, 1, 0].map((index) => {
              if (index > active) return null;
              const ring = RINGS[index];
              const isExplicit = index === 0;
              const inset = index === RINGS.length - 1 ? 0.5 : 0;
              return (
                <rect
                  key={ring.label}
                  x={CX - ring.w / 2 + inset}
                  y={CY - ring.h / 2 + inset}
                  width={ring.w - inset * 2}
                  height={ring.h - inset * 2}
                  rx={6}
                  fill={isExplicit ? "#2563eb" : "#d97706"}
                  fillOpacity={isExplicit ? 1 : 0.16}
                  stroke={isExplicit ? "#2563eb" : "#d97706"}
                  strokeWidth={1}
                />
              );
            })}
            {RINGS.map((ring, index) => {
              if (index > active || index === 0) return null;
              return <text key={ring.label} x={CX} y={CY - ring.h / 2 + 15} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">{index + 1}</text>;
            })}
            <text x={CX} y={CY + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">1</text>
            {active < RINGS.length - 1 && <text x={CX} y={188} textAnchor="middle" fontSize={11} fill="#64748b">아직 동의로 세지 않는 자리</text>}
            {active === 3 && (
              <>
                <circle cx={CX - 26} cy={165} r={4} fill="#b45309" />
                <text x={CX - 18} y={169} fontSize={11} fontWeight={700} fill="#b45309">방문자</text>
              </>
            )}
          </svg>
          </div>
          <ol className="min-w-0 space-y-1">
            {RINGS.map((ring, index) => (
              <li key={ring.label} className={`flex items-start gap-2 text-xs leading-4 sm:text-sm sm:leading-5 ${index === active ? "font-bold text-foreground" : index < active ? "text-foreground" : "text-muted-foreground/50"}`}>
                <span className="w-4 shrink-0 text-right font-mono">{index + 1}</span>
                <span className="min-w-0">{ring.label}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    />
  );
}
