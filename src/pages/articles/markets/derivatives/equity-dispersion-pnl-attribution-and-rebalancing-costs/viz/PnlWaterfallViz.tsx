import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 하루 손익을 원인별로 쌓아 올립니다(전부 글의 가정, 단위 천 달러).
 * 변동성 변화(6절의 베가 손익): A 4×1.5 = +6, B 8×1.5 = +12 (5·7절의 A 4천·B 8천), 지수 −10×0.5 = −5 → +13.
 * 실제 움직임 +7 → 20, 시간가치 −4 → 16, 주식 재조정 체결 −2 → 14, 수수료 −1 → 13.
 */
const AXIS = 20;
const TICKS = [0, 5, 10, 15, 20] as const;

const ROWS = [
  { key: "a", label: "A 옵션", calc: "1%p당 4천 × 1.5", value: 6, scene: 0 },
  { key: "b", label: "B 옵션", calc: "1%p당 8천 × 1.5", value: 12, scene: 0 },
  { key: "idx", label: "지수 옵션", calc: "1%p당 −1만 × 0.5", value: -5, scene: 1 },
  { key: "gamma", label: "실제 움직임", calc: "곡률·델타 재조정", value: 7, scene: 2 },
  { key: "theta", label: "시간가치", calc: "하루 경과", value: -4, scene: 3 },
  { key: "slip", label: "주식 재조정 체결", calc: "미끄러짐", value: -2, scene: 4 },
  { key: "fee", label: "수수료", calc: "옵션·주식", value: -1, scene: 4 },
] as const;

type Row = (typeof ROWS)[number] & { start: number; end: number };

const PLACED: readonly Row[] = ROWS.reduce<Row[]>((acc, row) => {
  const start = acc.length === 0 ? 0 : acc[acc.length - 1].end;
  return [...acc, { ...row, start, end: start + row.value }];
}, []);

const SCENES = [
  {
    label: "종목 다리: 변동성 1.5%포인트 상승",
    summary: "+6천 + 1만2천 = +1만8천",
    note: "A와 B를 합친 민감도는 변동성 1%포인트당 1만2천 달러이고, 5·7절처럼 A 4천·B 8천으로 나뉩니다(가정). 종목 변동성이 1.5%포인트 오르면 A는 6천, B는 1만2천 달러를 벌어 합계 1만8천 달러입니다.",
  },
  {
    label: "지수 다리: 반대 방향으로 0.5%포인트",
    summary: "1만8천 − 5천 = 1만3천",
    note: "지수 옵션은 반대 방향으로 1%포인트당 1만 달러입니다(가정). 지수 변동성이 0.5%포인트 오르면 5천 달러를 잃습니다. 변동성 변화로 남은 첫 줄은 1만3천 달러입니다.",
  },
  {
    label: "실제 가격 움직임",
    summary: "1만3천 + 7천 = 2만",
    note: "주가가 실제로 움직일 때 옵션의 곡률과 델타 재조정에서 7천 달러를 벌었다고 놓습니다(가정). 다리별로 나눈 숫자는 글에 없어서 한 줄로 둡니다.",
  },
  {
    label: "시간가치",
    summary: "2만 − 4천 = 1만6천",
    note: "하루가 지나며 사라진 선택권의 가치가 4천 달러입니다(가정). 여기까지가 옵션 평가 쪽에서 설명한 손익입니다.",
  },
  {
    label: "집행비용",
    summary: "1만6천 − 3천 = 1만3천",
    note: "주식 재조정 체결에서 2천, 옵션과 주식 수수료에서 1천 달러가 빠져 집행비용은 3천 달러입니다(가정). 막대 끝이 1만3천에서 멈추고, 이 숫자가 회계 장부의 총계와 맞아야 합니다.",
  },
] as const;

const left = (value: number) => `${(value / AXIS) * 100}%`;
const money = (k: number) => {
  const abs = Math.abs(k);
  const text = abs >= 10 ? `${Math.floor(abs / 10)}만${abs % 10 ? `${abs % 10}천` : ""}` : `${abs}천`;
  return `${k < 0 ? "−" : "+"}${text}`;
};

export default function PnlWaterfallViz() {
  return (
    <SceneShell
      eyebrow="하루 손익 쌓기"
      title="1만3천 달러가 원인별로 쌓이고 깎이는 순서"
      description="가로축은 누적 손익(천 달러)입니다. 한 줄이 원인 하나이고, 막대는 앞 줄이 끝난 자리에서 시작합니다. 초록은 이익, 빨강은 손실입니다. 모든 숫자는 글의 가정 장부입니다."
      ariaLabel="종목 옵션 변동성 효과 1만8천, 지수 옵션 변동성 효과 마이너스 5천, 실제 움직임 7천, 시간가치 마이너스 4천, 집행비용 마이너스 3천으로 총 1만3천 달러가 되는 손익 누적 막대"
      scenes={SCENES}
      render={(active) => {
        const shown = PLACED.filter((row) => row.scene <= active);
        const total = shown.length === 0 ? 0 : shown[shown.length - 1].end;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.25rem] gap-x-2 sm:grid-cols-[8.5rem_minmax(0,1fr)_3.75rem]">
              <span />
              <div className="relative mb-1 h-4 text-[11px] text-muted-foreground">
                {TICKS.map((tick) => (
                  <span key={tick} className={`absolute ${tick === 0 ? "" : tick === AXIS ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: left(tick) }}>{tick}</span>
                ))}
              </div>
              <span />
              {PLACED.map((row) => {
                const on = row.scene <= active;
                const lo = Math.min(row.start, row.end);
                return (
                  <div key={row.key} className="contents">
                    <span className={`py-1 text-xs leading-4 ${on ? "" : "text-muted-foreground/45"}`}>
                      <span className="block font-semibold">{row.label}</span>
                      <span className="block text-[11px] text-muted-foreground">{row.calc}</span>
                    </span>
                    <div className="relative min-w-0 border-l border-border">
                      {TICKS.slice(1).map((tick) => (
                        <div key={tick} className="absolute inset-y-0 border-l border-dashed" style={{ left: left(tick), borderColor: "#e2e8f0" }} />
                      ))}
                      {on ? (
                        <div
                          className="absolute top-1/2 h-4 -translate-y-1/2 rounded-sm"
                          style={{ left: left(lo), width: left(Math.abs(row.value)), backgroundColor: row.value >= 0 ? "#16a34a" : "#dc2626" }}
                        />
                      ) : null}
                    </div>
                    <span className={`self-center text-right font-mono text-xs ${on ? (row.value >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400") : "text-muted-foreground/40"}`}>
                      {on ? money(row.value) : "·"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-baseline justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="text-muted-foreground">지금까지 누적</span>
              <span className="font-mono font-bold">{money(total)} 달러</span>
            </div>
          </div>
        );
      }}
    />
  );
}
