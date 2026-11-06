import SceneShell from "./SceneShell";

/**
 * 본문 대응: economics 절의 계산표(X_SLO 400, 100 대 1, 적중 95%, 3년, 가동률 50%).
 * 3,125초 = 2,500 + 625 · 47,304,000 ÷ 3,125 = 15,137.28묶음 · ×19.25 = 291,393달러
 * − 27,752 = 263,641 · ÷ 1.15 = 229,253(유지보수 몫 34,388) · (229k − 45k) ÷ 8 = 23k.
 */
const SCALE = 291_393;
const pct = (value: number) => `${(value / SCALE) * 100}%`;

const SCENES = [
  { label: "묶음 하나의 시간", summary: "2,500 + 625 = 3,125초", note: "출력 100만 개가 한 묶음입니다. 400 tok/s로 출력을 만드는 2,500초에, 묶음에 딸린 입력 가운데 캐시에 없어 새로 계산할(미적중) 500만 개(1억 개의 5퍼센트)를 추정값 8,000 tok/s로 계산하는 625초가 더해집니다." },
  { label: "3년의 묶음 수와 API 값", summary: "15,137.28묶음 × 19.25달러", note: "3년의 초 94,608,000에 가동률 50퍼센트를 적용한 47,304,000초를 3,125초로 나눕니다. 출력 100만 개당 API 단가 19.25달러를 곱하면 같은 출력을 API로 샀을 때의 금액 약 291,393달러가 나옵니다." },
  { label: "전기료 빼기", summary: "291,393 − 27,752 = 263,641달러", note: "자체 운영에서 드는 3년 전기료 추정치 약 27,752달러를 뺍니다. 남은 돈이 구입비와 유지보수에 쓸 수 있는 전부입니다." },
  { label: "유지보수 나누기", summary: "263,641 ÷ 1.15 ≈ 229k달러", note: "유지보수가 3년간 구입비의 15퍼센트만큼 더 붙으므로 1.15로 나눕니다. 구입비 상한 약 229k달러와 유지보수 약 34k달러로 갈립니다." },
  { label: "GPU 한 장으로", summary: "(229k − 45k) ÷ 8 ≈ 23k달러", note: "섀시와 네트워크를 약 45k달러로 추정해 빼고 8장으로 나눕니다. 장당 가격이 이보다 높으면 API가 쌉니다. 지금 사도 되는 가격으로 읽으면 안 됩니다." },
] as const;

function Bar({ label, value, parts, show }: { label: string; value: string; parts: readonly { width: string; color: string; offset?: string }[]; show: boolean }) {
  return (
    <div className={show ? "" : "invisible"}>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-semibold">{label}</span>
        <span className="shrink-0 font-mono font-bold">{value}</span>
      </div>
      <div className="mt-1 flex h-4 w-full rounded-sm bg-muted/40">
        {parts.map((part, i) => (
          <span key={i} className="h-full" style={{ width: part.width, marginLeft: part.offset, backgroundColor: part.color }} />
        ))}
      </div>
    </div>
  );
}

export default function BundleBudgetViz() {
  return (
    <SceneShell
      eyebrow="거꾸로 구하기"
      title="시간에서 시작해 API 값을 거쳐 장비 구입비 상한에 닿습니다"
      description="X_SLO는 약속을 지키는 총 출력 속도이고, 여기서는 400 tok/s로 둡니다(가정). 부하는 입력 대 출력 100 대 1, 입력 적중률 95퍼센트로 둡니다. 둘째 줄부터 막대 길이는 모두 같은 달러 눈금입니다."
      note="400은 측정이 아니라 3절 표에서 어림한 가정입니다. API 단가는 2026-11-02 조회값이고 전기·환율·유지보수·섀시 금액은 추정이며, 인건비와 상면 비용은 넣지 않았습니다."
      ariaLabel="묶음 시간, API 금액, 전기료, 유지보수, GPU 한 장 상한으로 이어지는 역산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div>
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-semibold">묶음 하나 <span className="font-normal text-muted-foreground">(초, 다른 눈금)</span></span>
              <span className="shrink-0 font-mono font-bold">3,125초</span>
            </div>
            <div className="mt-1 flex h-6 w-full overflow-hidden rounded-sm text-[11px] font-semibold text-white">
              <span className="flex items-center justify-center" style={{ width: "80%", backgroundColor: "#2563eb" }}>출력 2,500</span>
              <span className="flex items-center justify-center" style={{ width: "20%", backgroundColor: "#b45309" }}>입력 625</span>
            </div>
          </div>
          <Bar show={active >= 1} label="같은 출력을 API로 산 돈" value="291,393" parts={[{ width: "100%", color: "#64748b" }]} />
          <Bar show={active >= 2} label="전기료(주황)를 뺀 돈" value="263,641" parts={[{ width: pct(263_641), color: "#64748b" }, { width: pct(27_752), color: "#d97706" }]} />
          <Bar show={active >= 3} label="구입비 상한(파랑)과 유지보수(회색)" value="약 229k" parts={[{ width: pct(229_253), color: "#2563eb" }, { width: pct(34_388), color: "#94a3b8" }]} />
          <div className={active >= 4 ? "" : "invisible"}>
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-semibold">섀시·네트워크 45k + GPU 8장</span>
              <span className="shrink-0 font-mono font-bold">장당 약 23k</span>
            </div>
            <div className="mt-1 flex h-4 w-full gap-[2px]">
              <span className="h-full rounded-sm" style={{ width: pct(45_000), backgroundColor: "#94a3b8" }} />
              {Array.from({ length: 8 }, (_, gpu) => (
                <span key={gpu} className="h-full rounded-sm" style={{ width: `calc(${pct(23_000)} - 2px)`, backgroundColor: "#2563eb" }} />
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
