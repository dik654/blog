import { choices } from "../model";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 안에 들인 개수별 합계의 모양.
 * 설립비 0: 24·21·19·18·18·19·21, 설립비 5: 24·26·24·23·23·24·26,
 * 안이 항상 5: 24+n, 안이 항상 3: 24−n (뒤의 둘은 밖 4, 설립비 없이 그림).
 */
const COUNTS = [0, 1, 2, 3, 4, 5, 6] as const;
const NO_SETUP = choices(4).totals;

const SCENES = [
  { label: "설립비 0", summary: "24 → 21 → … 최저 18", totals: NO_SETUP, ghost: false, note: "밖 4에서 첫 작업을 들이면 합계가 3 줄고, 세 개와 네 개에서 18로 가장 낮습니다." },
  { label: "설립비 5", summary: "24 → 26 → … 최저 23", totals: choices(4, 5).totals, ghost: true, note: "점선은 설립비 0일 때입니다. 하나라도 들이면 5가 더해져 첫 작업에서 24가 26으로 오르지만, 세 개나 네 개면 23으로 전부 밖의 24보다 낮습니다." },
  { label: "안이 항상 5", summary: "24 → 25 → … → 30", totals: COUNTS.map((n) => 24 + n), ghost: false, note: "안 5, 밖 4이면 하나 들일 때마다 1씩 늘어 전부 밖이 가장 쌉니다. 내부 비용이 올라가지 않아도 그렇습니다. 설립비 없이 그렸고(가정), 설립비 5를 더해도 최저는 전부 밖입니다." },
  { label: "안이 항상 3", summary: "24 → 23 → … → 18", totals: COUNTS.map((n) => 24 - n), ghost: false, note: "안 3, 밖 4이면 이 사례의 여섯 일은 모두 안으로 들어옵니다. 여섯 일 안의 계산일 뿐 세상의 모든 거래가 한 기업에 들어간다는 결론은 아닙니다. 설립비 5를 더해도 23으로 전부 안이 최저입니다." },
] as const;

const xOf = (n: number) => 36 + n * 50;
const yOf = (v: number) => 172 - (v - 16) * 9;
const path = (values: readonly number[]) => values.map((v, n) => `${xOf(n)},${yOf(v)}`).join(" ");

export default function SetupCurveViz() {
  return (
    <SceneShell
      eyebrow="합계의 모양"
      title="첫 작업에서 오른다고 그 뒤까지 오르는 것은 아닙니다"
      description="가로는 안에 들인 일의 수, 세로는 여섯 일 전체의 합계입니다. 세로축은 16부터 그렸습니다. 모든 수는 본문의 (가정)입니다."
      ariaLabel="안에 들인 개수별 합계를 설립비와 안쪽 비용 조건별로 비교한 선 그래프"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const totals: readonly number[] = scene.totals;
        const minimum = Math.min(...totals);
        const first = totals[1] - totals[0];
        const lowest = COUNTS.filter((n) => totals[n] === minimum);
        return (
          <svg viewBox="0 0 368 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: 안 0개부터 6개까지 합계 ${totals.join(", ")}`}>
            <text x={12} y={14} fontSize={12} fontWeight={700} fill={first > 0 ? "#d97706" : "#16a34a"}>첫 작업 {first > 0 ? `+${first}` : `−${Math.abs(first)}`}</text>
            <text x={356} y={14} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">최저 {minimum} · 안 {lowest.join("개·")}개</text>
            <line x1={20} x2={352} y1={172} y2={172} stroke="#94a3b8" strokeWidth={1} />
            {scene.ghost && <polyline points={path(NO_SETUP)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />}
            <line x1={xOf(0)} y1={yOf(totals[0])} x2={xOf(1)} y2={yOf(totals[1])} stroke={first > 0 ? "#d97706" : "#16a34a"} strokeWidth={1.25} />
            <polyline points={totals.slice(1).map((v, i) => `${xOf(i + 1)},${yOf(v)}`).join(" ")} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            {totals.map((v, n) => {
              const isLow = lowest.includes(n as (typeof COUNTS)[number]);
              return (
                <g key={n}>
                  <circle cx={xOf(n)} cy={yOf(v)} r={isLow ? 5 : 3} fill={isLow ? "#2563eb" : "#64748b"} />
                  <text x={xOf(n)} y={yOf(v) - 9} textAnchor="middle" fontSize={12} fontWeight={isLow ? 700 : 400} fill={isLow ? "#2563eb" : "#64748b"}>{v}</text>
                  <text x={xOf(n)} y={188} textAnchor="middle" fontSize={11} fill="#64748b">{n}개</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
