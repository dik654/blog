import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 같은 사람의 전후 변화와, 선발이 섞인 졸업자·비졸업자 평균 차이를 나눕니다.
 * 점 하나가 한 사람입니다. 12명과 그 나뉨(학교 4+1, 그 밖 2+5)은 설명을 위한 가정입니다.
 */
const SCENES = [
  { label: "같은 사람의 전후", summary: "능력 변화를 볼 단서", note: "수업 전에는 못 풀던 작업을 수업 뒤에 풀면 실제 능력의 변화를 볼 단서가 됩니다. 비교 상대가 같은 사람이라 입학 전 능력 차이가 끼어들지 않습니다." },
  { label: "입학 전의 사람들", summary: "(가정) 높음 6 · 낮음 6", note: "이제 여러 사람의 평균을 봅니다. 점이 채워진 사람은 수업을 듣기 전부터 능력이 높은 사람입니다. 12명이라는 숫자는 설명을 위해 정했습니다." },
  { label: "더 많이 선발됐다면", summary: "수업 전에 이미 평균이 다름", note: "입학 전부터 능력이 높은 사람이 더 많이 선발됐다고 놓으면, 수업을 한 번도 듣기 전에 두 무리의 평균이 벌써 다릅니다. 선발이 이렇지 않다면 이 차이는 없습니다." },
  { label: "졸업 뒤의 평균 임금", summary: "수업 효과만이 아닐 수 있음", note: "이렇게 선발됐다면 졸업자와 비졸업자의 평균 임금 차이에는 수업으로 달라진 몫에 입학 전부터 있던 차이도 섞입니다. 칸 크기는 양을 뜻하지 않으며 글은 그 비율을 정하지 않았습니다. 임금에 영향을 주는 다른 요인은 7절에서 봅니다." },
] as const;

const SCHOOL = [true, true, true, true, false] as const;
const OTHER = [true, true, false, false, false, false, false] as const;
const POOL = [true, false, true, false, true, false, true, false, true, false, true, false] as const;

function Person({ x, y, high }: { x: number; y: number; high: boolean }) {
  return <circle cx={x} cy={y} r={8} fill={high ? "#2563eb" : "none"} stroke="#2563eb" strokeWidth={1} />;
}

function Group({ x, width, name, people, y = 44 }: { x: number; width: number; name: string; people: readonly boolean[]; y?: number }) {
  const step = (width - 8) / people.length;
  return (
    <g>
      <rect x={x} y={y} width={width} height={62} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
      <text x={x + width / 2} y={y + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{name}</text>
      {people.map((high, i) => <Person key={i} x={x + 4 + step * (i + 0.5)} y={y + 42} high={high} />)}
    </g>
  );
}

function Legend() {
  return (
    <g>
      <Person x={84} y={16} high />
      <text x={97} y={20} fontSize={11} fill="currentColor">입학 전 능력 높음</text>
      <Person x={208} y={16} high={false} />
      <text x={221} y={20} fontSize={11} fill="currentColor">낮음</text>
    </g>
  );
}

export default function SelectionMixViz() {
  return (
    <SceneShell
      eyebrow="학습과 선발"
      title="졸업자 평균이 높아도 수업 효과만은 아닐 수 있습니다"
      description="점 하나가 한 사람입니다. 사람 수와 나뉨은 설명을 위해 정한 값이며(가정), 어떤 학교나 학위의 실측이 아닙니다."
      ariaLabel="같은 사람의 전후 비교와, 선발이 섞인 졸업자와 비졸업자 평균 비교"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox="0 0 360 204" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          {index === 0 && (
            <g>
              {[{ x: 14, name: "수업 전", mark: "작업: 못 풂", tone: "#64748b" }, { x: 206, name: "수업 뒤", mark: "작업: 풂", tone: "#2563eb" }].map((box) => (
                <g key={box.x}>
                  <rect x={box.x} y={36} width={140} height={92} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  <text x={box.x + 70} y={60} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{box.name}</text>
                  <circle cx={box.x + 70} cy={82} r={8} fill="none" stroke="#2563eb" strokeWidth={1} />
                  <text x={box.x + 70} y={114} textAnchor="middle" fontSize={12} fontWeight={700} fill={box.tone}>{box.mark}</text>
                </g>
              ))}
              <g stroke="#94a3b8" strokeWidth={1} fill="none">
                <line x1={160} x2={200} y1={82} y2={82} />
                <path d="M195 78L200 82L195 86" />
              </g>
              <text x={180} y={158} textAnchor="middle" fontSize={12} fill="#64748b">같은 사람 한 명을 수업 앞뒤로 봅니다</text>
            </g>
          )}
          {index === 1 && (
            <g>
              <Legend />
              <rect x={40} y={44} width={280} height={84} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
              {POOL.map((high, i) => <Person key={i} x={70 + (i % 6) * 44} y={68 + Math.floor(i / 6) * 34} high={high} />)}
              <text x={180} y={158} textAnchor="middle" fontSize={12} fill="#64748b">아직 아무도 수업을 듣지 않았습니다</text>
            </g>
          )}
          {index >= 2 && <Legend />}
          {index === 2 && (
            <g>
              <Group x={6} width={144} name="학교로 선발 5명" people={SCHOOL} />
              <Group x={160} width={194} name="그 밖 7명" people={OTHER} />
              <text x={78} y={128} textAnchor="middle" fontSize={11} fill="currentColor">높음 4 · 낮음 1</text>
              <text x={257} y={128} textAnchor="middle" fontSize={11} fill="currentColor">높음 2 · 낮음 5</text>
              <text x={180} y={158} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">수업 전인데 두 무리가 이미 다릅니다</text>
            </g>
          )}
          {index === 3 && (
            <g>
              <Group x={6} width={144} name="졸업자" people={SCHOOL} />
              <Group x={160} width={194} name="비졸업자" people={OTHER} />
              <text x={180} y={128} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">평균 임금 차이 하나 안에</text>
              <rect x={6} y={138} width={170} height={52} rx={8} fill="#d97706" fillOpacity={0.1} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
              <text x={91} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">입학 전부터 있던</text>
              <text x={91} y={176} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">능력 차이 (크기 ?)</text>
              <rect x={184} y={138} width={170} height={52} rx={8} fill="#2563eb" fillOpacity={0.1} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
              <text x={269} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">수업으로 달라진</text>
              <text x={269} y={176} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">능력 (크기 ?)</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
