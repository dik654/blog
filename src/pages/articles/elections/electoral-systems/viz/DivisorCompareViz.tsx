import SceneShell from "./SceneShell";
import { PARTY_COLORS, PARTY_NAMES, PARTY_SHORT, WARN_COLOR } from "./parties";

/**
 * 본문 대응: #proportional 알고리즘의 마지막 단계 — 나누는 수를 1·3·5로 바꾸면 무엇이 달라지는가.
 * 득표 396·369·135. 1·2·3: 9석 4·4·1, 10번째 몫 가당 79.2 → 10석 5·4·1.
 * 1·3·5: 9석 4·4·1, 10번째 몫 다당 45 → 10석 4·4·2.
 */
const VOTES: readonly number[] = [396, 369, 135];

interface Quotient {
  party: number;
  divisor: number;
  value: number;
}

const rank = (divisors: readonly number[]): Quotient[] =>
  VOTES.flatMap((votes, party) => divisors.map((divisor) => ({ party, divisor, value: votes / divisor })))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

const COLUMNS: readonly { title: string; list: Quotient[]; nextDivisor: number }[] = [
  { title: "1·2·3…으로 나눌 때", list: rank([1, 2, 3, 4, 5]), nextDivisor: 2 },
  { title: "1·3·5…로 나눌 때", list: rank([1, 3, 5, 7, 9]), nextDivisor: 3 },
];

const tally = (list: Quotient[], k: number) =>
  VOTES.map((_, party) => list.slice(0, k).filter((q) => q.party === party).length).join(" · ");

const fmt = (v: number) => String(Math.round(v * 100) / 100);

const SCENES = [
  {
    label: "첫 몫은 같다",
    summary: "396 · 369 · 135",
    note: "두 방식 모두 첫 몫은 득표를 1로 나눕니다. 아직 의석을 받지 않은 세 정당의 첫 몫은 양쪽에서 같습니다.",
  },
  {
    label: "한 석 뒤부터 갈린다",
    summary: "가당 다음 몫 198 vs 132",
    note: "가당이 한 석을 받은 뒤 다음 몫은 왼쪽에서 396÷2=198, 오른쪽에서 396÷3=132입니다. 이미 의석을 받은 정당의 몫이 오른쪽에서 더 크게 줄어듭니다.",
  },
  {
    label: "아홉 석 결과는 같다",
    summary: "둘 다 4 · 4 · 1",
    note: "이 득표에서는 아홉 석까지 두 방식의 결과가 같습니다. 경계 의석이 실제로 바뀌는지는 득표와 의석 수에 따라 달라집니다.",
  },
  {
    label: "배분선 바로 뒤의 주인",
    summary: "10번째 몫: 가당 vs 다당",
    note: "끊는 자리 바로 뒤의 몫은 왼쪽이 가당 79.2, 오른쪽이 다당 45입니다. 열 석을 나눈다면(가정) 왼쪽은 5·4·1, 오른쪽은 4·4·2가 되어 경계 의석이 작은 정당으로 갑니다.",
  },
] as const;

function List({ title, list, nextDivisor, active }: { title: string; list: Quotient[]; nextDivisor: number; active: number }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold leading-5 text-muted-foreground">{title}</p>
      <div role="list" className="mt-1 space-y-0.5">
        {list.map((q, i) => {
          const isFirst = q.divisor === 1;
          const isNext = q.party === 0 && q.divisor === nextDivisor;
          const tenth = i === 9;
          const lit =
            (active === 0 && isFirst) ||
            (active === 1 && isNext) ||
            (active === 2 && !tenth) ||
            (active === 3 && tenth);
          const color = PARTY_COLORS[q.party];
          return (
            <div role="listitem" key={`${q.party}-${q.divisor}`}>
              {tenth && (
                <div className="my-1 flex items-center gap-1 text-[11px] font-bold leading-4" style={{ color: WARN_COLOR }}>
                  <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: WARN_COLOR }} />
                  9석 배분선
                  <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: WARN_COLOR }} />
                </div>
              )}
              <div
                className={`relative flex h-6 min-w-0 items-center gap-1 overflow-hidden rounded-sm border px-1 font-mono text-[11px] sm:text-xs ${lit ? "font-bold" : "opacity-40"}`}
                style={{ borderColor: lit ? color : "transparent" }}
              >
                <span aria-hidden className="absolute inset-y-0 left-0" style={{ width: `${(q.value / VOTES[0]) * 100}%`, backgroundColor: `${color}22` }} />
                <span className="relative w-5 shrink-0 text-right">{i + 1}</span>
                <span className="relative shrink-0" style={{ color }} aria-label={PARTY_NAMES[q.party]}>
                  {PARTY_SHORT[q.party]}
                </span>
                <span className="relative shrink-0 text-muted-foreground">÷{q.divisor}</span>
                <span className="relative ml-auto">{fmt(q.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs font-bold leading-5">
        {active === 3 ? `10석 ${tally(list, 10)}` : active === 2 ? `9석 ${tally(list, 9)}` : " "}
      </p>
    </div>
  );
}

export default function DivisorCompareViz() {
  return (
    <SceneShell
      eyebrow="나누는 수 비교"
      title="나누는 수를 1·3·5로 바꾸면 경계 의석이 작은 정당으로 갈 가능성이 커집니다"
      description="득표 396·369·135의 몫을 큰 순서로 열 개까지 세웠습니다. 줄 번호가 순위이고, 옅은 막대 길이는 몫의 크기입니다."
      ariaLabel="1·2·3 방식과 1·3·5 방식의 몫 순서 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 grid-cols-2 gap-3">
          {COLUMNS.map((col) => (
            <List key={col.title} title={col.title} list={col.list} nextDivisor={col.nextDivisor} active={active} />
          ))}
        </div>
      )}
    />
  );
}
