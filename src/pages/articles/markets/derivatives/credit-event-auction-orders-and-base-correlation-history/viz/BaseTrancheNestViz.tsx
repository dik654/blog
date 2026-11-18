import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 둘째 문단 — 신용지수 손실 0부터 각 끝점까지의 트랜치 가격을 모형에 맞춘 값이 베이스 상관이고,
 * 끝점과 날짜별 값을 나란히 놓은 기록이 베이스 상관 이력이다. 9절: 2005년에서 2008년 사이 곡선이 위로 움직였다.
 * 끝점 3%·7%·15%는 설명용 가정이다. 본문에 상관 값이 없으므로 칸에는 숫자 대신 ①②③만 적는다.
 */
const ENDPOINTS = [3, 7, 15] as const;
const MARKS = ["①", "②", "③"] as const;
const AXIS_MAX = 20;

const SCENES = [
  { label: "0부터 첫 끝점까지", summary: "0~3% 호가 → 값 ①", shown: 1, note: "트랜치는 지수 손실의 한 구간을 떠안는 계약입니다. 베이스 상관은 손실 0에서 시작하는 구간 하나의 호가를 모형에 넣고, 그 호가가 나오도록 맞춘 상관값입니다. 끝점 3%는 설명용 가정입니다." },
  { label: "끝점을 7%로 넓힘", summary: "0~7% 호가 → 값 ②", shown: 2, note: "다음 끝점도 다시 0에서 시작합니다. 0~7% 구간은 0~3% 구간을 안에 품고, 그 호가로 맞춘 값 ②를 따로 얻습니다." },
  { label: "끝점마다 값 하나씩", summary: "①·②·③ = 한 날짜의 곡선", shown: 3, note: "끝점마다 맞춘 값을 이으면 한 날짜의 곡선이 됩니다. 9절은 끝점마다 다른 상관이 필요했다는 사실을 단일 가우시안 모형의 한계로 봅니다. 값이 본문에 없어 숫자는 적지 않았습니다." },
  { label: "날짜를 쌓으면 이력", summary: "같은 끝점, 다른 날짜", shown: 3, note: "같은 끝점의 값을 날짜별로 줄 세운 기록이 베이스 상관 이력입니다. 영란은행 연구는 CDX 곡선이 2005년에서 2008년 사이 위로 움직였다고 보고합니다. 이 칸들은 시장가격을 맞춘 기록이지 자연상수가 아닙니다." },
] as const;

function Nest({ shown }: { shown: number }) {
  return (
    <div className="space-y-2 text-xs sm:text-sm">
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_2rem] gap-2 text-[11px] text-muted-foreground">
        <span>구간</span>
        <div className="relative h-4">
          {[0, 3, 7, 15, 20].map((tick) => (
            <span key={tick} className="absolute -translate-x-1/2 font-mono" style={{ left: `${(tick / AXIS_MAX) * 100}%` }}>
              {tick === AXIS_MAX ? "" : `${tick}%`}
            </span>
          ))}
        </div>
        <span>값</span>
      </div>
      {ENDPOINTS.map((end, index) => {
        const on = index < shown;
        const latest = index === shown - 1;
        return (
          <div key={end} className="grid grid-cols-[4.5rem_minmax(0,1fr)_2rem] items-center gap-2">
            <span className={`font-mono ${on ? "font-bold" : "text-muted-foreground/50"}`}>0~{end}%</span>
            <div className="relative h-5 min-w-0 rounded-sm bg-muted/30">
              <div
                className={`absolute inset-y-0 left-0 rounded-sm border ${on ? "border-[#2563eb]" : "border-dashed border-border"}`}
                style={{ width: `${(end / AXIS_MAX) * 100}%`, backgroundColor: on ? "#2563eb" : "transparent", opacity: on ? (latest ? 0.85 : 0.4) : 1 }}
              />
            </div>
            <span className={`text-center text-base font-bold ${on ? "text-[#2563eb]" : "text-transparent"}`}>{MARKS[index]}</span>
          </div>
        );
      })}
      <p className="pt-1 text-[11px] leading-5 text-muted-foreground">모든 구간이 손실 0에서 시작합니다. 축은 지수의 20%까지만 그렸습니다.</p>
    </div>
  );
}

function History() {
  const rows = [
    { date: "2005년 1월", prime: "" },
    { date: "…", prime: "" },
    { date: "2008년", prime: "′" },
  ];
  return (
    <div className="space-y-2 text-xs sm:text-sm">
      <div className="grid grid-cols-[5.5rem_repeat(3,minmax(0,1fr))] gap-1.5 text-center text-[11px] text-muted-foreground">
        <span className="text-left">날짜 \ 끝점</span>
        {ENDPOINTS.map((end) => (
          <span key={end} className="font-mono">0~{end}%</span>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.date} className="grid grid-cols-[5.5rem_repeat(3,minmax(0,1fr))] items-center gap-1.5 text-center">
          <span className="text-left font-semibold">{row.date}</span>
          {MARKS.map((mark) => (
            <span key={mark} className={`rounded-md border px-1 py-1.5 font-bold ${row.date === "…" ? "border-dashed border-border text-muted-foreground" : "border-[#2563eb] text-[#2563eb]"}`}>
              {row.date === "…" ? "…" : `${mark}${row.prime}`}
            </span>
          ))}
        </div>
      ))}
      <p className="pt-1 text-[11px] leading-5 text-muted-foreground">한 줄이 한 날짜의 곡선입니다. 칸의 실제 값은 본문에 없습니다.</p>
    </div>
  );
}

export default function BaseTrancheNestViz() {
  return (
    <SceneShell
      eyebrow="베이스 상관"
      title="0에서 시작하는 구간마다 상관값이 하나씩 나옵니다"
      description="막대는 신용지수 손실 중 계약이 맡는 구간입니다. 끝점 3%·7%·15%는 설명용 가정이고, 칸의 ①②③은 각 구간 호가로 맞춘 상관값의 자리입니다."
      ariaLabel="0에서 시작하는 손실 구간마다 따로 맞춘 베이스 상관과 날짜별 이력"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) => (index === SCENES.length - 1 ? <History key={scene.label} /> : <Nest key={scene.label} shown={scene.shown} />))}
        />
      )}
    />
  );
}
