import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 2026-01-19 공고에서 상한 계산 앞뒤로 걸러지는 조건. 사례 점포는 2025-09-30 폐업, 33㎡(가정).
 * 상한 200만 원 = 33 ÷ 3.3 × 20만, min(600만, 200만).
 */
const GATES = [
  { pass: "2023-01-01 이후 폐업", fail: "그 전에 폐업" },
  { pass: "점포철거비를 처음 받음", fail: "주민등록번호 기준 이미 1회 받음" },
  { pass: "사업자등록된 업체가 철거", fail: "점주가 스스로 철거" },
  { pass: "상한 계산: min(600만, 200만) = 200만 원", warn: "신청 상한일 뿐 지급액 아님" },
  { pass: "공사내역서·세금계산서 또는 카드전표·지급 확인 자료·철거 전후 사진 등", fail: "임대인의 600만 원 공제 정산서만 있음" },
  { pass: "심사 결과로 지급액 결정", warn: "대상과 인정 비용을 따로 심사" },
] as const;

const SCENES = [
  { label: "폐업일", summary: "2025-09-30은 통과", note: "상한을 계산하기 전에 먼저 걸러집니다. 사례 점포는 2025-09-30 폐업을 가정합니다." },
  { label: "1회 한정", summary: "주민등록번호 기준", note: "점포철거비는 주민등록번호 기준 1회만 받을 수 있습니다." },
  { label: "철거 주체", summary: "업체 철거만", note: "국세청에 사업자등록이 된 업체를 통해 철거해야 하며 점주가 스스로 철거하면 지원하지 않습니다." },
  { label: "상한 계산", summary: "33㎡ → 200만 원", note: "앞의 조건을 지난 뒤에야 두 한도 중 작은 값을 봅니다. 33㎡면 면적 한도 200만 원이 상한입니다." },
  { label: "정산 서류", summary: "공제 정산서만으론 부족", note: "임대인이 보증금에서 600만 원을 공제한 정산서만으로 이 조건을 갖췄다고 볼 수 없습니다. 직접 지급한 경로도 대상과 인정 비용을 따로 심사받습니다." },
  { label: "심사", summary: "여기서 금액이 정해집니다", note: "받은 뒤에는 지원금을 받은 날부터 3년 동안 같은 장소에서 다시 창업하는 것이 제한됩니다. 2026-01-19 공고를 2026-10-09에 확인한 내용이며 이후 변경과 남은 예산은 따로 확인합니다." },
] as const;

export default function SupportGateViz() {
  return (
    <SceneShell
      eyebrow="지원금의 관문"
      title="상한을 계산하기 전과 뒤에 무엇이 걸러낼까요"
      description="왼쪽 줄을 따라 내려가면 지급에 가까워지고, ✕는 그 단계에서 막히는 예, !는 주의할 점입니다. 사례 점포는 2025-09-30 폐업, 인정 면적 33㎡입니다."
      note="2026-01-19 공고를 읽는 예이며 폐업일과 면적은 (가정)입니다. 공고의 조건 전부를 옮긴 그림이 아닙니다."
      ariaLabel="폐업일, 1회 한정, 철거 주체, 상한 계산, 정산 서류, 심사를 차례로 지나는 지원금 조건"
      scenes={SCENES}
      render={(active) => (
        <ol className="mx-auto m-0 w-full max-w-[660px] list-none p-0 text-sm">
          {GATES.map((gate, index) => {
            const state = index === active ? "now" : index < active ? "done" : "later";
            return (
              <li key={gate.pass} className="m-0 grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-2 p-0">
                <span className="flex flex-col items-center">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs ${state === "now" ? "border-primary bg-primary text-primary-foreground" : state === "done" ? "border-primary text-primary" : "border-muted-foreground/50 text-muted-foreground"}`}>{index + 1}</span>
                  {index < GATES.length - 1 && <span className={`w-0 flex-1 border-l ${state === "done" ? "border-primary" : "border-dashed border-muted-foreground/50"}`} />}
                </span>
                <div className="mb-2 grid gap-x-3 gap-y-0.5 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                  <span className={`leading-6 ${state === "now" ? "font-bold text-primary" : state === "done" ? "font-medium" : "text-muted-foreground"}`}>{gate.pass}</span>
                  <span className={`text-xs leading-6 ${state === "now" ? "font-semibold text-red-700 dark:text-red-400" : "text-muted-foreground/70"}`}>{"fail" in gate ? `✕ ${gate.fail}` : `! ${gate.warn}`}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
