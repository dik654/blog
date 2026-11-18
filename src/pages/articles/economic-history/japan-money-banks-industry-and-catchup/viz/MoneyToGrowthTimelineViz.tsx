import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 4절·7절·8절·9절에 흩어진 연도를 한 줄로 모은다.
 * 1871 엔, 1872 국립은행 제도, 1877 전쟁 금융과 인플레이션, 1882 일본은행(8절)
 * 1945~1973 연평균 7.6%, 1947년 1월 우선 생산 시작(1947~1948, 9절), 1949 시장경제·달러당 360엔(4절)
 * 1970년대 이후 조정(7절). 1882~1945 사이는 글이 연표를 주지 않아 끊어 그렸다.
 */
const EVENTS = [
  { group: 0, year: "1871", text: "새 화폐 조례로 엔·전·리를 둡니다" },
  { group: 0, year: "1872", text: "국립은행 제도 — 국영이 아니라 법에 따른 민간은행" },
  { group: 0, year: "1877", text: "전쟁 금융과 인플레이션" },
  { group: 0, year: "1882", text: "여러 은행권이 섞인 문제를 거쳐 일본은행 설립" },
  { group: 1, year: "1947~1948", text: "우선 생산 정책 — 석탄·철강에 물자를 먼저 배정(1947년 1월 시작)" },
  { group: 1, year: "1949", text: "계획·통제 체제에서 시장경제로, 달러당 360엔 고정환율" },
  { group: 2, year: "1970년대 이후", text: "해외 수요 감소·환율 변화·유가 상승으로 조정" },
] as const;

const SCENES = [
  { label: "메이지: 결제와 은행의 기반", summary: "1871 → 1882", note: "공장보다 먼저 공통 화폐 단위와 은행권 정리가 왔습니다. 철도·우편·교육과 관영 사업 일부도 이 무렵 민간 투자의 기반이 됐지만 글은 그 연도를 따로 적지 않습니다." },
  { label: "전후: 복구와 시장경제 전환", summary: "1945 → 1949", note: "전쟁 동원과 식민지 지배가 남긴 파괴 뒤, 우선 생산 정책으로 석탄·철강을 먼저 복구하고 1949년 시장경제와 고정환율로 넘어갑니다. 끊긴 선은 1882년과 1945년 사이를 글이 연표로 다루지 않는다는 표시입니다." },
  { label: "고도성장과 그 뒤", summary: "1945~1973 연평균 7.6%", note: "오카자키 데쓰지에 따르면 1945~1973년 연평균 성장률은 7.6%입니다. 이 평균은 기간 전체의 값이라 해마다 7.6%였다는 뜻은 아닙니다. 1970년대 이후에는 해외 수요·환율·유가 변화가 조정을 요구했습니다." },
] as const;

const ACCENT = "#2563eb";

export default function MoneyToGrowthTimelineViz() {
  return (
    <SceneShell
      eyebrow="연표"
      title="엔 도입에서 고도성장까지 순서를 한 줄로 봅니다"
      description="4·7·8·9절에 흩어진 연도를 모았습니다. 세로 간격은 햇수에 비례하지 않습니다."
      ariaLabel="1871년 엔 도입부터 1970년대 이후 조정까지의 일본 통화·은행·산업 연표"
      scenes={SCENES}
      render={(active) => (
        <ol className="relative space-y-0">
          {EVENTS.map((event, index) => {
            const on = event.group === active;
            const breakBefore = index === 4;
            const spanStart = index === 4;
            return (
              <li key={event.year} className="min-w-0">
                {breakBefore && (
                  <div className="grid grid-cols-[4.75rem_1rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_1rem_minmax(0,1fr)] items-center gap-2 py-1 text-xs text-muted-foreground">
                    <span />
                    <span className="mx-auto block h-6 border-l border-dashed border-border" />
                    <span>1882~1945 · 전쟁 동원과 식민지 지배 (글에서 연표 생략)</span>
                  </div>
                )}
                {spanStart && (
                  <div className={`grid grid-cols-[4.75rem_1rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_1rem_minmax(0,1fr)] items-center gap-2 pb-1 text-xs ${active === 2 ? "font-bold" : "text-muted-foreground"}`} style={{ color: active === 2 ? ACCENT : undefined }}>
                    <span className="text-right font-mono">1945~1973</span>
                    <span className="mx-auto block h-3 w-3 rounded-sm border" style={{ borderColor: active === 2 ? ACCENT : "#94a3b8", backgroundColor: active === 2 ? ACCENT : "transparent" }} />
                    <span>복구·수출·설비투자·도시 이동 — 연평균 성장률 7.6%</span>
                  </div>
                )}
                <div className="grid grid-cols-[4.75rem_1rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_1rem_minmax(0,1fr)] items-start gap-2 py-1.5 text-sm leading-6" style={{ opacity: on ? 1 : 0.45 }}>
                  <span className={`text-right font-mono text-xs leading-6 ${on ? "font-bold" : ""}`} style={{ color: on ? ACCENT : undefined }}>{event.year}</span>
                  <span className="mx-auto mt-2 block h-2.5 w-2.5 rounded-full border" style={{ borderColor: on ? ACCENT : "#94a3b8", backgroundColor: on ? ACCENT : "transparent" }} />
                  <span className={on ? "font-semibold" : ""}>{event.text}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
