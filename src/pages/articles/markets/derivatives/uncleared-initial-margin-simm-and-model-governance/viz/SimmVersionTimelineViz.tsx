import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison (#need 포함) — 2.8+2512: 2025년 말까지 자료로 보정 → 2026년 6월 공개 → 7월 11일 적용
 * → 2026년 9월 적어도 반기 보정 원칙을 반영한 지배구조 문서 갱신.
 * 회사 줄(금액 변화·단위시험·승인 관할·계약과 담보 운영 준비)의 시점은 본문에 없어 업계 줄과 맞추지 않는다.
 */
const INDUSTRY = [
  { when: "2025년 말", what: "보정 자료 끝", detail: "2025-12-31까지 자료" },
  { when: "2026년 6월", what: "2.8+2512 공개", detail: "ISDA 발표" },
  { when: "2026년 7월 11일", what: "적용일", detail: "ISDA가 정한 날" },
  { when: "2026년 9월", what: "지배구조 문서 갱신", detail: "적어도 반기마다 보정" },
] as const;

const COMPANY = ["새 버전의 금액 변화", "구현 단위시험", "승인 관할", "계약·담보 운영 준비"] as const;

const SCENES = [
  { label: "자료가 먼저 끝납니다", summary: "보정 자료: 2025년 말까지", industry: 1, company: false, note: "2.8+2512는 2025년 말까지의 자료로 다시 보정됐습니다. 모형이 보는 시장 자료는 공개일보다 앞서 끝납니다." },
  { label: "공개와 적용일", summary: "2026년 6월 공개 → 7월 11일 적용", industry: 3, company: false, note: "ISDA는 2026년 6월 새 버전을 공개하고 7월 11일을 적용일로 정했습니다." },
  { label: "보정 주기의 원칙", summary: "적어도 반기마다 보정", industry: 4, company: false, note: "2026년 9월에는 적어도 반기마다 보정하는 원칙을 반영한 지배구조 문서를 갱신했습니다. 보정이 한 번으로 끝나지 않고 정기적으로 돌아온다는 원칙입니다." },
  { label: "회사 줄은 따로 확인합니다", summary: "파일을 받음 ≠ 사용 승인", industry: 4, company: true, note: "회사는 새 버전의 금액 변화, 구현 단위시험, 승인 관할, 계약과 담보 운영의 준비 상태를 따로 확인해야 합니다. 최신 파일을 내려받았다는 사실만으로 실제 사용 승인이 끝나지 않습니다." },
] as const;

export default function SimmVersionTimelineViz() {
  return (
    <SceneShell
      eyebrow="SIMM 버전의 순서"
      title="업계 표준의 날짜와 회사의 사용 승인은 다른 줄에 있습니다"
      description="위 줄은 ISDA가 정한 날짜이고 칸 간격은 실제 기간이 아닙니다. 아래 줄의 확인 시점은 본문에 없어 위 줄의 날짜와 맞추지 않았습니다."
      ariaLabel="SIMM 2.8+2512의 보정 자료 종료, 공개, 적용일, 지배구조 문서 갱신 순서와 회사별 확인 항목"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold">업계 표준 (ISDA)</p>
              <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
                {INDUSTRY.map((item, index) => {
                  const done = index < scene.industry;
                  const current = !scene.company && done && index >= (active === 1 ? 1 : scene.industry - 1);
                  return (
                    <li key={item.what} className={`min-w-0 rounded-lg border px-2 py-1.5 text-xs leading-5 ${current ? "border-blue-600 bg-background" : done ? "border-border bg-background" : "border-dashed border-border/60 opacity-45"}`}>
                      <span className={`block font-mono text-[11px] ${current ? "text-blue-700 dark:text-blue-300" : "text-muted-foreground"}`}>{item.when}</span>
                      <span className="block font-semibold">{item.what}</span>
                      <span className="block text-muted-foreground">{item.detail}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className={`min-w-0 rounded-lg border px-3 py-2 ${scene.company ? "border-amber-600" : "border-dashed border-border/50 opacity-40"}`}>
              <p className="text-xs font-bold">회사별 확인 <span className="font-normal text-muted-foreground">(시점 미정)</span></p>
              <ul className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {COMPANY.map((item) => (
                  <li key={item} className="rounded border border-border px-1.5 py-1 text-[11px] leading-5">{item}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs leading-5">
                <span className="font-mono">최신 파일 내려받음</span>
                <span className={`mx-1 font-bold ${scene.company ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>≠</span>
                <span className="font-mono">실제 사용 승인</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
