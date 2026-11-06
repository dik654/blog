import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 편도 60→35분, 20일 출근(가정). 25 × 20 = 500, 왕복 1,000분 = 16시간 40분.
 * 현금은 추가 교통비 2만 + 월세 10만 = 12만 원(가정). 시간과 현금은 다른 칸에 둡니다.
 */
const BEFORE = 60;
const AFTER = 35;
const SAVED = BEFORE - AFTER;
const DAYS = 20;
const ONE_WAY_TOTAL = SAVED * DAYS;
const ROUND_TOTAL = ONE_WAY_TOTAL * 2;
const FARE = 2;
const RENT = 10;
const CASH = FARE + RENT;
const DAY_CELLS = Array.from({ length: DAYS }, (_, index) => index + 1);

const SCENES = [
  { label: "편도 한 번", summary: `${BEFORE} − ${AFTER} = ${SAVED}분`, note: "통근이 편도 60분에서 35분으로 줄었다고 놓습니다(가정). 점선 칸이 줄어든 25분입니다." },
  { label: "하루 왕복", summary: `${SAVED} × 2 = ${SAVED * 2}분`, note: "같은 조건으로 귀가한다면 하루에 25분을 두 번 아낍니다." },
  { label: "한 달 스무 날", summary: `${SAVED}분 × 40칸 = ${ROUND_TOTAL.toLocaleString("en-US")}분`, note: `칸 하나가 25분입니다. 위 줄만 세면 편도 합계 ${ONE_WAY_TOTAL}분, 두 줄을 세면 ${ROUND_TOTAL.toLocaleString("en-US")}분, 약 16시간 40분입니다. 20일 출근은 가정입니다.` },
  { label: "현금은 따로", summary: `+${FARE}만 + ${RENT}만 = ${CASH}만 원`, note: "왕복 추가 교통비 2만 원과 주변 월세 인상 10만 원도 가정입니다. 시간은 줄어도 가구의 현금 지출은 월 12만 원 늘어나므로 두 값을 따로 적습니다." },
] as const;

function MinuteBar({ label, minutes, saved = 0 }: { label: string; minutes: number; saved?: number }) {
  return (
    <div className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] items-center gap-2 text-xs">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <div className="flex h-8 min-w-0">
        <span className="flex items-center justify-center rounded-l-md bg-slate-500 font-mono font-bold text-white" style={{ width: `${(minutes / BEFORE) * 100}%` }}>{minutes}분</span>
        {saved > 0 && (
          <span className="flex items-center justify-center rounded-r-md border border-dashed border-primary font-mono font-bold text-primary" style={{ width: `${(saved / BEFORE) * 100}%` }}>−{saved}분</span>
        )}
      </div>
    </div>
  );
}

export default function CommuteLedgerViz() {
  return (
    <SceneShell
      eyebrow="한 달 장부"
      title="편도 25분이 한 달 1,000분이 되는 길"
      description="모든 수치는 이 글의 사례를 위한 가정입니다."
      ariaLabel="편도 25분 절약이 왕복과 20일을 거쳐 1000분이 되는 계산과 현금 지출"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div className="min-w-0 space-y-3">
              <MinuteBar label="이전" minutes={BEFORE} />
              <MinuteBar label="이후" minutes={AFTER} saved={SAVED} />
            </div>
          );
        }
        if (active === 1) {
          return (
            <div className="grid min-w-0 grid-cols-2 gap-2 text-center text-xs">
              {["출근", "귀가"].map((name) => (
                <div key={name} className="rounded-lg border border-primary bg-primary/10 px-2 py-4">
                  <span className="block font-semibold text-muted-foreground">{name}</span>
                  <span className="mt-1 block font-mono text-base font-bold text-primary">−{SAVED}분</span>
                </div>
              ))}
            </div>
          );
        }
        if (active === 2) {
          return (
            <div className="min-w-0 space-y-2">
              {["출근", "귀가"].map((name) => (
                <div key={name} className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-1 text-xs">
                  <span className="font-semibold text-muted-foreground">{name}</span>
                  <div className="grid min-w-0 grid-cols-[repeat(20,minmax(0,1fr))] gap-px">
                    {DAY_CELLS.map((day) => (
                      <span key={day} className="h-7 rounded-[2px] bg-primary/70" />
                    ))}
                  </div>
                </div>
              ))}
              <p className="pl-10 text-xs text-muted-foreground">1일 → 20일</p>
            </div>
          );
        }
        return (
          <div className="grid min-w-0 grid-cols-2 gap-2">
            <div className="min-w-0 rounded-lg border border-primary bg-background p-3 text-center">
              <p className="text-xs font-bold text-muted-foreground">시간 칸</p>
              <p className="mt-2 font-mono text-base font-bold text-primary">−{ROUND_TOTAL.toLocaleString("en-US")}분</p>
              <p className="text-xs text-muted-foreground">약 16시간 40분</p>
            </div>
            <div className="min-w-0 rounded-lg border border-amber-600 bg-background p-3 text-center">
              <p className="text-xs font-bold text-muted-foreground">현금 칸 · 월</p>
              <p className="mt-2 font-mono text-base font-bold text-amber-700 dark:text-amber-400">+{CASH}만 원</p>
              <p className="text-xs text-muted-foreground">추가 교통비 {FARE}만 + 월세 인상 {RENT}만</p>
            </div>
          </div>
        );
      }}
    />
  );
}
