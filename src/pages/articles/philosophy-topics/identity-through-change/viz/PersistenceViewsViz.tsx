import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 지속을 그리는 두 그림.
 * 견해 1: 자전거 전체가 매 순간 존재하고 성질만 바뀐다.
 * 견해 2: 자전거는 여러 시간 부분을 가진 긴 존재이고, 1년 차와 10년 차는 서로 다른 부분이다.
 * 체인 예시는 6절 용어 예("낡은 체인이 새 체인으로")를 빌린 설명용 문장이다.
 */
const W = 360;
const H = 206;
const x = (year: number) => 40 + year * 27;
const MARKS = [1, 5, 10] as const;
const ACCENT = "#2563eb";
const LINE = "#64748b";

const SCENES = [
  { label: "견해 1 · 매 순간 전체", summary: "같은 한 대가 시점마다 통째로 있음", note: "1년 차에도, 5년 차에도, 10년 차에도 자전거 전체가 통째로 있습니다. 바뀌는 것은 그 한 대가 가진 성질입니다." },
  { label: "견해 2 · 시간 부분", summary: "자전거 = 시간으로 길게 이어진 전체", note: "자전거는 시간 축을 따라 길게 이어진 존재이고, 1년 차와 10년 차는 그 긴 존재의 서로 다른 부분입니다. 어느 한 시점에 보이는 것은 전체가 아니라 한 조각입니다." },
  { label: "변화를 말하는 문법", summary: "누가 성질을 갖는가가 다름", note: "같은 교체를 말해도 견해 1은 '그 자전거가 시점마다 다른 성질을 가진다'고, 견해 2는 '서로 다른 시간 부분이 서로 다른 성질을 가진다'고 말합니다. 이 구분만으로 A와 B 가운데 어느 것이 처음 자전거인지가 정해지지는 않습니다." },
] as const;

const SENTENCES = [
  { view: "견해 1", text: "그 자전거가 1년 차에는 옛 체인을, 10년 차에는 새 체인을 가진다." },
  { view: "견해 2", text: "1년 차 부분은 옛 체인을, 10년 차 부분은 새 체인을 가진다." },
] as const;

export default function PersistenceViewsViz() {
  return (
    <SceneShell
      eyebrow="지속을 그리는 두 그림"
      title="통째로 이어지는가, 조각들이 이어진 긴 전체인가"
      description="가로축은 교체가 진행된 10년입니다. 위는 매 순간 자전거 전체가 존재한다는 견해, 아래는 자전거가 시간 부분을 가진 긴 존재라는 견해입니다. 시간 부분은 긴 존재를 시간 축에서 잘라 낸 한 토막을 뜻합니다."
      ariaLabel="매 순간 전체가 존재한다는 견해와 시간 부분으로 이루어진 긴 존재라는 견해의 비교"
      scenes={SCENES}
      render={(active) => {
        const topOn = active !== 1;
        const bottomOn = active !== 0;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <g opacity={topOn ? 1 : 0.3} style={{ transition: "opacity 300ms" }}>
                <text x={8} y={14} fontSize={11} fontWeight={700} fill="currentColor">견해 1 · 매 순간 전체가 있음</text>
                {/* 칸 사이 빈자리를 '그때는 없음'으로 읽지 않도록 같은 한 대가 끊기지 않고 이어짐을 선으로 잇는다. */}
                <line x1={x(1) + 13.5} x2={x(5) - 40.5} y1={44} y2={44} stroke={ACCENT} strokeWidth={1} />
                <line x1={x(5) + 13.5} x2={x(10) - 40.5} y1={44} y2={44} stroke={ACCENT} strokeWidth={1} />
                <text x={(x(5) + 13.5 + x(10) - 40.5) / 2} y={38} textAnchor="middle" fontSize={10} fill={ACCENT}>같은 한 대</text>
                {MARKS.map((year) => (
                  <g key={year}>
                    <rect x={x(year) - 40.5} y={26} width={54} height={36} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                    <text x={x(year) - 13.5} y={41} textAnchor="middle" fontSize={11} fill="currentColor">자전거</text>
                    <text x={x(year) - 13.5} y={54} textAnchor="middle" fontSize={11} fill="currentColor">전체</text>
                    <text x={x(year) - 13.5} y={76} textAnchor="middle" fontSize={11} fill={LINE}>{year}년 차</text>
                  </g>
                ))}
              </g>
              <g opacity={bottomOn ? 1 : 0.3} style={{ transition: "opacity 300ms" }}>
                <text x={8} y={104} fontSize={11} fontWeight={700} fill="currentColor">견해 2 · 자전거 = 시간 부분이 이어진 긴 전체</text>
                {Array.from({ length: 10 }, (_, index) => {
                  const year = index + 1;
                  const marked = (MARKS as readonly number[]).includes(year);
                  return (
                    <rect key={year} x={x(index)} y={114} width={27} height={30} fill={marked ? ACCENT : "none"} fillOpacity={marked ? 0.18 : 0} stroke={marked ? ACCENT : LINE} strokeWidth={marked ? 1.25 : 1} />
                  );
                })}
                {MARKS.map((year) => (
                  <text key={year} x={x(year) - 13.5} y={158} textAnchor="middle" fontSize={11} fill={LINE}>{year}년 차 부분</text>
                ))}
              </g>
              <line x1={x(0)} x2={x(10)} y1={184} y2={184} stroke={LINE} strokeWidth={1} />
              {[0, 5, 10].map((year) => (
                <g key={year}>
                  <line x1={x(year)} x2={x(year)} y1={181} y2={187} stroke={LINE} strokeWidth={1} />
                  <text x={x(year)} y={200} textAnchor="middle" fontSize={11} fill={LINE}>{year}년</text>
                </g>
              ))}
            </svg>
            <div className="mt-3 space-y-2">
              {SENTENCES.map((sentence, index) => {
                const on = active === 2 || active === index;
                return (
                  <p key={sentence.view} className={`rounded-lg border px-3 py-2 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${on ? "border-border opacity-100" : "border-dashed border-border/60 opacity-35"}`}>
                    <span className="mr-2 font-bold" style={{ color: ACCENT }}>{sentence.view}</span>
                    {sentence.text}
                    <span className="ml-1 text-muted-foreground">(설명용 문장)</span>
                  </p>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
