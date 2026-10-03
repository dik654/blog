import { useMemo, useState } from "react";
import snapshot from "@/content/data/country-explorer.json";

type Country = (typeof snapshot.countries)[number];
type IndicatorKey = keyof typeof snapshot.indicators;
const keys = Object.keys(snapshot.indicators) as IndicatorKey[];
const names = new Intl.DisplayNames(["ko"], { type: "region" });
const regionNames: Record<string, string> = {
  Africa: "아프리카", Americas: "아메리카", Asia: "아시아",
  Europe: "유럽", Oceania: "오세아니아", Antarctica: "남극",
};
const koreanName = (country: Country) => names.of(country.iso2) || country.name;
const sorted = [...snapshot.countries].sort((a, b) => koreanName(a).localeCompare(koreanName(b), "ko"));
const number = new Intl.NumberFormat("ko", { maximumFractionDigits: 1 });

function CountryReadout({ country }: { country: Country }) {
  return (
    <div className="min-w-0 border-t border-neutral-300 pt-4 dark:border-neutral-600">
      <h4 className="text-xl font-bold">{koreanName(country)}</h4>
      <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{country.name} · {country.id} · {country.scope} {country.m49}</p>
      <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-700">
        {keys.map((key) => {
          const observation = country.indicators[key];
          const indicator = snapshot.indicators[key];
          return (
            <div key={key} className="py-3">
              <dt className="text-sm">{indicator.label}</dt>
              <dd className="mt-1 font-semibold tabular-nums">
                {observation ? `${number.format(observation.value)} ${indicator.unit}` : "자료 없음"}
                <span className="ml-2 text-sm font-normal text-neutral-600 dark:text-neutral-300">{observation ? `${observation.year}년` : `${snapshot.period[0]}–${snapshot.period[1]}년 범위`}</span>
              </dd>
              {country.wbIso2 && (
                <a className="mt-1 inline-block text-sm text-sky-700 underline dark:text-sky-300" href={`https://data.worldbank.org/indicator/${indicator.code}?locations=${country.wbIso2}`} target="_blank" rel="noreferrer">지표 정의·시계열</a>
              )}
            </div>
          );
        })}
      </dl>
      <a className="mt-2 inline-block text-sm text-sky-700 underline dark:text-sky-300" href={country.wbIso2 ? `https://data.worldbank.org/?locations=${country.wbIso2}` : snapshot.sources.m49} target="_blank" rel="noreferrer">{country.wbIso2 ? "World Bank 국가 자료" : "UN 국가·지역 목록과 주석"}</a>
    </div>
  );
}

/** A dated statistical universe, not a list of diplomatic recognition. */
export default function CountryExplorer() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [page, setPage] = useState(0);
  const [leftId, setLeftId] = useState("KOR");
  const [rightId, setRightId] = useState("USA");
  const filtered = useMemo(() => sorted.filter((country) => (
    (!region || country.region === region)
    && `${koreanName(country)} ${country.name} ${country.id} ${country.iso2} ${country.m49}`.toLowerCase().includes(query.trim().toLowerCase())
  )), [query, region]);
  const pageSize = 12;
  const lastPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const left = sorted.find((country) => country.id === leftId)!;
  const right = sorted.find((country) => country.id === rightId)!;
  const control = "min-w-0 rounded-lg border border-neutral-400 bg-white px-3 py-2 text-base dark:border-neutral-500 dark:bg-neutral-900";
  return (
    <figure data-viz="country-explorer" className="my-8 border-y border-neutral-300 py-6 dark:border-neutral-600">
      <figcaption className="text-lg font-semibold">같은 네 질문으로 국가·지역 비교하기</figcaption>
      <p className="mt-2 text-sm leading-7">{snapshot.checkedAt} 확인 · UN M49 {snapshot.m49Count}개 + FAQ의 별도 통계 지역 {snapshot.supplementalCount}개. 각 지표는 {snapshot.period[0]}–{snapshot.period[1]}년 중 가장 최근의 값입니다. 서로 다른 연도는 직접적인 같은 해 비교가 아닙니다.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex min-w-0 flex-col gap-2 text-sm">국가·지역 이름 또는 코드
          <input className={control} value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="예: 한국, Kenya, TW" />
        </label>
        <label className="flex min-w-0 flex-col gap-2 text-sm">통계상 지역
          <select className={control} value={region} onChange={(event) => { setRegion(event.target.value); setPage(0); }}>
            <option value="">전체 지역</option>
            {Object.entries(regionNames).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
      </div>
      <p aria-live="polite" className="my-4 text-sm">{snapshot.countries.length}개 중 {filtered.length}개 · 아래 이름을 누르면 왼쪽 비교 대상이 바뀝니다.</p>
      <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {visible.map((country) => <li key={country.id}><button type="button" aria-pressed={country.id === leftId} onClick={() => setLeftId(country.id)} className={`w-full rounded-lg border px-3 py-2 text-left text-sm leading-6 ${country.id === leftId ? "border-sky-700 bg-sky-50 font-semibold dark:bg-sky-950/30" : "border-neutral-300 dark:border-neutral-600"}`}>{koreanName(country)} <span className="text-neutral-500 dark:text-neutral-400">{country.id}</span></button></li>)}
      </ul>
      {!filtered.length && <p className="py-4 text-sm">일치하는 이름이 없습니다. 영어 이름이나 코드를 입력해 보세요.</p>}
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <button type="button" className={`${control} disabled:opacity-40`} disabled={page === 0} onClick={() => setPage((value) => value - 1)}>이전 목록</button>
        <span>{page + 1} / {lastPage + 1}</span>
        <button type="button" className={`${control} disabled:opacity-40`} disabled={page >= lastPage} onClick={() => setPage((value) => value + 1)}>다음 목록</button>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {[{ label: "첫 번째 비교 대상", value: leftId, change: setLeftId, country: left }, { label: "두 번째 비교 대상", value: rightId, change: setRightId, country: right }].map((selection) => (
          <div key={selection.label} className="min-w-0">
            <label className="mb-4 flex min-w-0 flex-col gap-2 text-sm">{selection.label}
              <select className={control} value={selection.value} onChange={(event) => selection.change(event.target.value)}>
                {sorted.map((country) => <option key={country.id} value={country.id}>{koreanName(country)} ({country.id})</option>)}
              </select>
            </label>
            <CountryReadout country={selection.country} />
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">현재 달러로 표시한 생산액은 물가·환율의 영향을 받으며 개인의 실수령 소득이 아닙니다. 전력 접근은 공급 시간·정전·요금 품질까지 말해 주지 않습니다. 자료 없음은 0이 아닙니다. 통계 분류는 국가 승인 여부를 판정하지 않습니다.</p>
    </figure>
  );
}
