import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 두 번째 문단 — 사업주 부담으로 적힌 보험료도 임금·가격·고용을 통해 일부가 다른 사람에게
 * 옮겨 갈 수 있다. 법적 납부자·실제 경제적 부담·급여를 받는 사람을 따로 적는다.
 * 옮겨 가는 몫의 크기는 글에 없어 칸 크기와 화살표 굵기를 모두 같게 그렸다.
 */
const ACCENT = "#2563eb";
const SHIFT = "#d97706";
const BENEFIT = "#16a34a";

const CHANNELS = ["임금을 통해", "가격을 통해", "고용을 통해"] as const;

const LEDGER = [
  { head: "법적 납부자", body: "사업주", color: ACCENT },
  { head: "실제 경제적 부담", body: "사업주와, 옮겨 간 만큼 다른 사람 (몫은 글에 없음)", color: SHIFT },
  { head: "급여를 받는 사람", body: "정해진 위험을 겪은 사람", color: BENEFIT },
] as const;

const SCENES = [
  { label: "법에 적힌 납부", summary: "사업주 → 보험 기금", note: "법이 정한 납부자는 사업주입니다. 고지서와 장부에는 사업주가 낸 돈으로 적힙니다." },
  { label: "옮겨 갈 수 있는 세 길", summary: "임금 · 가격 · 고용", note: "그 보험료의 일부는 임금·가격·고용을 통해 다른 사람에게 옮겨 갈 수 있습니다. 반드시 옮겨 간다는 뜻은 아니고, 얼마나 옮겨 가는지도 글에 수치가 없습니다." },
  { label: "세 줄로 따로 적기", summary: "납부자 · 부담 · 수급자", note: "그래서 법적 납부자, 실제 경제적 부담, 급여를 받는 사람을 한 칸에 묶지 않고 따로 적습니다." },
] as const;

export default function IncidenceViz() {
  return (
    <SceneShell
      eyebrow="누가 실제로 내는가"
      title="사업주가 낸 보험료가 다른 사람의 부담이 될 수 있는 길"
      description="칸 크기와 화살표는 몫의 크기가 아닙니다. 글은 옮겨 가는 비율을 정하지 않습니다."
      ariaLabel="사업주 보험료가 임금, 가격, 고용을 통해 다른 사람에게 옮겨 갈 수 있는 경로와 세 칸 장부"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4 text-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-center gap-2">
            <div className="rounded-lg border px-3 py-2 text-center" style={{ borderColor: ACCENT }}>
              <span className="block font-bold" style={{ color: ACCENT }}>사업주</span>
              <span className="block text-xs text-muted-foreground">법적 납부자</span>
            </div>
            <span className="text-center text-xs font-semibold" style={{ color: ACCENT }}>보험료 →</span>
            <div className="rounded-lg border border-border px-3 py-2 text-center">
              <span className="block font-bold">보험 기금</span>
              <span className="block text-xs text-muted-foreground">급여의 재원</span>
            </div>
          </div>

          <div className="rounded-lg border border-dashed px-3 py-2" style={{ borderColor: SHIFT, opacity: active >= 1 ? 1 : 0.35 }}>
            <div className="grid grid-cols-3 gap-2">
              {CHANNELS.map((via) => (
                <span key={via} className="rounded-md border px-1 py-1 text-center text-xs font-bold" style={{ borderColor: SHIFT, color: SHIFT }}>{via}</span>
              ))}
            </div>
            <p className="mt-2 text-center leading-6">사업주 부담으로 적힌 보험료의 일부가 다른 사람에게 옮겨 갈 수 있음</p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" style={{ opacity: active === 2 ? 1 : 0.35 }}>
            {LEDGER.map((row) => (
              <div key={row.head} className="rounded-lg border-l-2 bg-background/60 px-3 py-2" style={{ borderColor: row.color }}>
                <span className="block text-xs font-bold" style={{ color: row.color }}>{row.head}</span>
                <span className="block leading-6">{row.body}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
