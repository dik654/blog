#!/usr/bin/env python3
"""Refresh the country explorer from UN M49 and World Bank WDI.

Only observed/non-null values are selected. Missing countries stay in the list;
regional aggregates never substitute for a country. Run with --cache to reuse
downloaded responses in a supplied directory for an exact, offline rebuild.
"""
import argparse
import concurrent.futures
import datetime as dt
import html
import json
from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
INDICATORS = {
    "population": ("SP.POP.TOTL", "인구", "명"),
    "income": ("NY.GDP.PCAP.CD", "1인당 국내총생산", "현재 미국 달러"),
    "older": ("SP.POP.65UP.TO.ZS", "65세 이상 인구", "%"),
    "electricity": ("EG.ELC.ACCS.ZS", "전력 접근 인구", "%"),
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cache", type=Path)
    parser.add_argument("--as-of", default=dt.date.today().isoformat())
    args = parser.parse_args()
    end = int(args.as_of[:4]) - 1
    start = end - 5

    def fetch(name, url):
        path = args.cache / name if args.cache else None
        if path and path.exists():
            return path.read_text()
        req = urllib.request.Request(url, headers={"User-Agent": "WorldSystemsBlog/1.0"})
        with urllib.request.urlopen(req, timeout=90) as response:
            value = response.read().decode("utf-8-sig")
        if path:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(value)
        return value

    overview = fetch("m49-overview.html", "https://unstats.un.org/unsd/methodology/m49/overview")
    english = overview.split('id="ENG_Overview"', 1)[1].split("</table>", 1)[0]
    english = re.sub(r"<!--.*?-->", "", english, flags=re.S)
    countries = []
    for row in re.findall(r"<tr[^>]*>(.*?)</tr>", english, re.S):
        cells = [html.unescape(re.sub(r"<[^>]+>", "", x)).strip()
                 for x in re.findall(r"<td[^>]*>(.*?)</td>", row, re.S)]
        if len(cells) < 12 or not re.fullmatch(r"\d{3}", cells[9]):
            continue
        countries.append(dict(id=cells[11], name=cells[8], m49=cells[9],
                              iso2=cells[10], region=cells[3] or "Antarctica",
                              subregion=cells[5], scope="M49"))
    if len(countries) < 240 or len({c["id"] for c in countries}) != len(countries):
        raise ValueError("UN table structure/count changed; inspect before publishing")
    count_m49 = len(countries)
    # The UN M49 FAQ explicitly permits these two additional statistical codes.
    countries.extend([
        dict(id="XKX", name="Kosovo", m49="412", iso2="XK", region="Europe", subregion="Southern Europe", scope="M49 FAQ"),
        dict(id="TWN", name="Taiwan", m49="158", iso2="TW", region="Asia", subregion="Eastern Asia", scope="M49 FAQ"),
    ])
    wb = json.loads(fetch("wb-countries.json", "https://api.worldbank.org/v2/country?format=json&per_page=400"))
    economies = {c["id"]: c for c in wb[1] if c["region"]["id"] != "NA"}

    def series(item):
        key, (code, label, unit) = item
        url = f"https://api.worldbank.org/v2/country/all/indicator/{code}?format=json&per_page=20000&date={start}:{end}"
        result = json.loads(fetch(code + ".json", url))
        if not isinstance(result, list) or len(result) != 2 or result[0]["pages"] != 1:
            raise ValueError(f"Unexpected indicator response: {code}")
        values = {}
        for row in result[1]:
            iso = row["countryiso3code"]
            if iso not in economies or row["value"] is None:
                continue
            candidate = dict(value=row["value"], year=int(row["date"]))
            if iso not in values or candidate["year"] > values[iso]["year"]:
                values[iso] = candidate
        return key, dict(code=code, label=label, unit=unit, url=url,
                         updated=result[0].get("lastupdated")), values

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        series_results = list(pool.map(series, INDICATORS.items()))
    for country in countries:
        eco = economies.get(country["id"])
        country["wbIso2"] = eco["iso2Code"] if eco else None
        country["indicators"] = {key: values.get(country["id"]) for key, _, values in series_results}
    countries.sort(key=lambda c: c["name"].casefold())
    output = dict(checkedAt=args.as_of, period=[start, end], m49Count=count_m49,
                  supplementalCount=2, sources={
                      "m49": "https://unstats.un.org/unsd/methodology/m49/",
                      "wdi": "https://data.worldbank.org/",
                  }, indicators={key: meta for key, meta, _ in series_results}, countries=countries)
    destination = ROOT / "src/content/data/country-explorer.json"
    destination.parent.mkdir(exist_ok=True)
    destination.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"Wrote {len(countries)} areas ({count_m49} M49 + 2 FAQ); {start}–{end}; {destination}")
    print({key: len(values) for key, _, values in series_results})


if __name__ == "__main__":
    main()
