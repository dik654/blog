import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cache-key-ttl-staleness — 조회 12번과 5번째 조회 직전의 원본 변경(가정)을
 * 짧은 TTL, 긴 TTL, 긴 TTL+명시적 invalidation에 적용해 hit·miss·오래된 값을 실제로 센다.
 * 저장 후 TTL칸까지 hit이고, 그 뒤 조회는 miss가 되어 그때의 원본을 저장한다.
 */
type Lookup = "miss" | "hit" | "stale";

const LOOKUPS = 12;
const CHANGE_AT = 5;

function simulate(ttl: number, invalidate: boolean): Lookup[] {
  return Array.from({ length: LOOKUPS }, (_, index) => index + 1).reduce<{ out: Lookup[]; storedAt: number | null }>(
    (state, time) => {
      const wiped = invalidate && time === CHANGE_AT;
      const valid = state.storedAt !== null && !wiped && time - state.storedAt <= ttl;
      if (!valid) return { out: [...state.out, "miss"], storedAt: time };
      const stale = state.storedAt !== null && state.storedAt < CHANGE_AT && time >= CHANGE_AT;
      return { out: [...state.out, stale ? "stale" : "hit"], storedAt: state.storedAt };
    },
    { out: [], storedAt: null },
  ).out;
}

const CASES = [
  { ttl: 2, invalidate: false },
  { ttl: 8, invalidate: false },
  { ttl: 8, invalidate: true },
] as const;

const RUNS = CASES.map((item) => simulate(item.ttl, item.invalidate));
const count = (run: readonly Lookup[], kind: Lookup) => run.filter((value) => value === kind).length;
const summary = (run: readonly Lookup[]) => `miss ${count(run, "miss")} · 오래된 값 ${count(run, "stale")}`;

const SCENES = [
  { label: "TTL 2칸", summary: summary(RUNS[0]), note: "수명이 짧으면 자주 miss가 나서 다시 계산합니다. 대신 오래된 값을 돌려주는 조회는 2번으로 짧게 끝납니다." },
  { label: "TTL 8칸", summary: summary(RUNS[1]), note: "수명을 늘리면 miss가 줄어 hit rate는 오르지만, 원본이 바뀐 뒤에도 옛 값을 5번 돌려줍니다. 이 위험이 staleness입니다." },
  { label: "TTL 8칸 + invalidation", summary: summary(RUNS[2]), note: "원본이 바뀔 때 저장된 값을 명시적으로 지우면 그 다음 조회가 새 값을 받아 옵니다. TTL만으로는 수명이 끝나기 전의 변경을 막지 못해 함께 씁니다." },
] as const;

const X0 = 16;
const CELL = 27;
const SIZE = 22;
const cellX = (index: number) => X0 + index * CELL;

const STYLE: Record<Lookup, { fill: string; stroke: string; text: string; letter: string }> = {
  miss: { fill: "none", stroke: "#64748b", text: "#64748b", letter: "M" },
  hit: { fill: "#2563eb", stroke: "#2563eb", text: "#ffffff", letter: "H" },
  stale: { fill: "#d97706", stroke: "#d97706", text: "#ffffff", letter: "!" },
};

export default function TtlTimelineViz() {
  return (
    <SceneShell
      eyebrow="수명과 원본 변경"
      title="TTL을 늘리면 miss가 줄고 옛 값을 돌려주는 구간이 늘어납니다"
      description="TTL은 값이 유효하다고 보는 최대 시간입니다. 칸 하나가 조회 한 번이고, TTL n칸은 저장 뒤 n번째 조회까지 유효하다는 뜻입니다. 5번째 조회 직전에 원본이 바뀝니다. 조회 간격과 TTL 길이는 모두 설명용입니다(가정)."
      ariaLabel="조회 12번에서 TTL 길이와 invalidation에 따른 hit, miss, 오래된 값의 분포"
      scenes={SCENES}
      render={(active) => {
        const run = RUNS[active];
        const changeX = cellX(CHANGE_AT - 1) - 2.5;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 112" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={X0} y={14} fontSize={11} fontWeight={700} fill="#64748b">원본</text>
              <rect x={X0} y={20} width={changeX - X0 - 1} height={14} fill="#94a3b8" fillOpacity={0.45} />
              <text x={(X0 + changeX) / 2} y={31} textAnchor="middle" fontSize={12} fill="#475569">옛 값</text>
              <rect x={changeX + 1} y={20} width={cellX(LOOKUPS - 1) + SIZE - changeX - 1} height={14} fill="#16a34a" fillOpacity={0.3} />
              <text x={(changeX + cellX(LOOKUPS - 1) + SIZE) / 2} y={31} textAnchor="middle" fontSize={12} fill="#15803d">새 값</text>
              <line x1={changeX} x2={changeX} y1={16} y2={84} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
              <text x={X0} y={52} fontSize={11} fontWeight={700} fill="#64748b">조회</text>
              {run.map((kind, index) => (
                <g key={index}>
                  <rect x={cellX(index)} y={58} width={SIZE} height={SIZE} rx={3} fill={STYLE[kind].fill} stroke={STYLE[kind].stroke} strokeWidth={1} />
                  <text x={cellX(index) + SIZE / 2} y={73} textAnchor="middle" fontSize={12} fontWeight={700} fill={STYLE[kind].text}>{STYLE[kind].letter}</text>
                  <text x={cellX(index) + SIZE / 2} y={98} textAnchor="middle" fontSize={11} fill="#64748b">{index + 1}</text>
                </g>
              ))}
            </svg>
            <p className="mt-2 text-center text-xs leading-5 text-muted-foreground">M miss(저장값 없음·수명 끝) · H hit · ! hit이지만 오래된 값</p>
          </div>
        );
      }}
    />
  );
}
