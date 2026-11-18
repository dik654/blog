import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 첫째·둘째 문단 — 연방준비제도 역사 자료의 순서.
 * 유가 충격 → 산유국 흑자·라틴아메리카 적자 → 미국 머니센터 은행이 예치받아 재대출 → 1970년대 말 긴축·금리 상승·상환 기간 단축
 * → 1982년 8월 멕시코 외채 800억 달러 상환 불가 통보. 라틴아메리카 외채(모든 원천): 1970년 말 290억, 1978년 말 1,590억, 1982년 3,270억 달러.
 * 금리 수준은 본문에 숫자가 없어 그리지 않는다. 막대 축: 0~3,400억.
 */
const DEBT = [
  { year: "1970년 말", value: 290 },
  { year: "1978년 말", value: 1590 },
  { year: "1982년", value: 3270 },
] as const;
const DEBT_MAX = 3400;

const SCENES = [
  {
    label: "1970년대 두 차례 유가 충격",
    summary: "산유국 흑자 · 라틴아메리카 적자",
    oil: "경상수지 흑자",
    bank: "",
    latam: "여러 나라가 경상수지 적자",
    deposit: false,
    lend: "",
    cut: false,
    debt: 1,
    note: "유가가 오르자 산유국에는 경상수지 흑자가, 라틴아메리카 여러 나라에는 적자가 생겼습니다. 아래 막대의 출발점인 1970년 말 라틴아메리카 외채는 290억 달러였습니다.",
  },
  {
    label: "은행이 산유국 돈을 다시 빌려 줍니다",
    summary: "외채 290억 → 1,590억 달러",
    oil: "흑자를 은행에 예치",
    bank: "미국 정부의 권장 아래 중개",
    latam: "적자를 대출로 메움",
    deposit: true,
    lend: "대출",
    cut: false,
    debt: 2,
    note: "대형 미국 머니센터 은행이 산유국 자금을 예치받아 라틴아메리카에 다시 빌려 주는 중개자가 됐습니다. 1970년대 초에는 단기 대출의 실질금리가 0에 가까웠고, 외채는 1978년 말 1,590억 달러로 늘었습니다.",
  },
  {
    label: "1970년대 말 긴축",
    summary: "외채 1,590억 → 3,270억 달러",
    oil: "",
    bank: "명목금리 상승, 상환 기간 단축",
    latam: "갚으려면 수출로 달러를 벌어야 함",
    deposit: true,
    lend: "더 높은 금리·짧은 만기",
    cut: false,
    debt: 3,
    note: "미국과 유럽이 물가를 잡으려 긴축하자 명목금리가 올랐고, 상업은행은 상환 기간을 줄이고 더 높은 금리를 매겼습니다. 외채는 1982년 3,270억 달러가 됐습니다. 금리 수준은 본문에 숫자가 없어 그리지 않았습니다.",
  },
  {
    label: "1982년 8월 멕시코",
    summary: "외채 800억 달러 상환 불가 통보",
    oil: "",
    bank: "",
    latam: "멕시코의 지급 곤란이 지역 위기로",
    deposit: true,
    lend: "대출 중단",
    cut: true,
    debt: 3,
    note: "멕시코가 더는 갚을 수 없다고 통보한 외채는 800억 달러였고, 지급 곤란은 지역 위기로 번졌습니다. 9절 제목대로 가격 하락·금리 상승에 대출 중단이 함께 왔습니다. 이후 채권국은 1985년 베이커 플랜, 1989년 원금을 영구히 줄이는 브래디 플랜으로 대응했습니다.",
  },
] as const;

function Node({ title, status }: { title: ReactNode; status: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
      <div className="w-full break-keep rounded-lg border border-border bg-background px-1 py-2 text-xs font-semibold leading-5 sm:text-sm">{title}</div>
      <p className={`min-h-[3.75rem] break-keep text-[11px] leading-5 text-muted-foreground sm:text-xs ${status ? "" : "invisible"}`}>{status || "−"}</p>
    </div>
  );
}

function Arrow({ label, shown, cut = false }: { label: string; shown: boolean; cut?: boolean }) {
  return (
    <div className={`flex flex-col items-center pt-2 transition-opacity duration-300 motion-reduce:transition-none ${shown ? "" : "opacity-0"}`} aria-hidden={!shown}>
      <svg viewBox="0 0 40 12" className="h-3 w-8 sm:w-12" aria-hidden="true">
        <line x1={1} y1={6} x2={33} y2={6} stroke={cut ? "#dc2626" : "#2563eb"} strokeWidth={1.25} strokeDasharray={cut ? "3 3" : undefined} />
        <path d="M32 2 L38 6 L32 10" fill="none" stroke={cut ? "#dc2626" : "#2563eb"} strokeWidth={1.25} />
      </svg>
      <span className="mt-1 max-w-[4.5rem] text-center text-[10px] leading-4 sm:text-[11px]" style={{ color: cut ? "#dc2626" : "#2563eb" }}>{label || "−"}</span>
    </div>
  );
}

export default function PetrodollarLoopViz() {
  return (
    <SceneShell
      eyebrow="돈이 돈 길"
      title="산유국 흑자가 은행을 거쳐 라틴아메리카 외채가 됩니다"
      description="경상수지는 수출입과 이자 등 대외 거래로 들어오고 나간 돈의 차이입니다. 머니센터 은행은 여러 나라의 정부·대기업·은행과 거래하는 대형 은행입니다. 아래 막대는 모든 원천을 합친 라틴아메리카 외채입니다(연방준비제도 역사 자료)."
      ariaLabel="1970년대 유가 충격부터 1982년 멕시코 지급 곤란까지 산유국, 미국 은행, 라틴아메리카 사이의 자금 흐름과 외채 증가"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-1 sm:gap-2">
              <Node title="산유국" status={scene.oil} />
              <Arrow label="예치" shown={scene.deposit} />
              <Node title="미국 머니센터 은행" status={scene.bank} />
              <Arrow label={scene.lend} shown={scene.lend !== ""} cut={scene.cut} />
              <Node title={<>라틴<wbr />아메리카</>} status={scene.latam} />
            </div>
            <div className="mt-4 space-y-2">
              {DEBT.map((row, index) => {
                const shown = index < scene.debt;
                return (
                  <div key={row.year} className={`grid grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs transition-opacity duration-300 motion-reduce:transition-none sm:text-sm ${shown ? "" : "opacity-20"}`} aria-hidden={!shown}>
                    <span className="text-muted-foreground">{row.year}</span>
                    <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                      <div className="h-full rounded-sm" style={{ width: shown ? `${(row.value / DEBT_MAX) * 100}%` : "0%", backgroundColor: index === scene.debt - 1 ? "#2563eb" : "#94a3b8" }} />
                    </div>
                    <span className="text-right font-mono font-semibold">{shown ? `${row.value.toLocaleString("en-US")}억` : "−"}</span>
                  </div>
                );
              })}
              <p className="text-right text-[11px] text-muted-foreground">단위: 달러</p>
            </div>
          </div>
        );
      }}
    />
  );
}
