import SceneShell from "./SceneShell";

/**
 * 본문 대응: #recovery-checkpointing — Stripe 문서의 같은 키 재요청 네 경우(2026-10-04 확인, 본문 기준).
 * 결과 저장 시 재사용 / 검증 실패·실행 전 충돌은 저장 안 함 / 다른 인자는 오류 / 최소 24시간 뒤 정리될 수 있음.
 * 24시간 칸은 눈금이 아니다: 정리가 언제 일어나는지는 글에 없다.
 */
const SCENES = [
  { label: "첫 실행 결과가 저장된 경우", summary: "저장된 결과를 돌려받음", note: "첫 실행이 성공했든 실패했든 저장된 상태 코드와 본문을 다시 돌려줍니다.", request: "pay-42 · 같은 인자", store: "첫 실행의 상태 코드와 본문", answer: "저장된 상태 코드와 본문", late: false },
  { label: "결과가 저장되지 않는 경우", summary: "재사용할 결과 없음", note: "파라미터 검증 실패나 실행 전 동시 요청 충돌은 결과를 저장하지 않는다고 구분합니다.", request: "pay-42 · 같은 인자", store: "검증 실패 · 실행 전 충돌 → 저장 없음", answer: "재사용되는 결과 없음", late: false },
  { label: "같은 키에 다른 인자", summary: "오류", note: "같은 키에 다른 인자를 붙이면 재사용이 아니라 오류입니다.", request: "pay-42 · 다른 인자", store: "같은 키 · 인자가 다름", answer: "오류", late: false },
  { label: "키가 정리된 뒤", summary: "새 요청으로 처리될 수 있음", note: "최소 24시간이 지난 키는 정리할 수 있고, 정리 후 같은 키는 새 요청으로 처리될 수 있습니다.", request: "pay-42 · 같은 인자", store: "정리되어 기록 없음", answer: "새 요청으로 처리될 수 있음", late: true },
] as const;

function Step({ title, body, warn = false }: { title: string; body: string; warn?: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border bg-background px-2.5 py-1.5 ${warn ? "border-amber-600" : "border-border"}`}>
      <p className="text-xs font-bold text-muted-foreground">{title}</p>
      <p className="text-sm font-semibold leading-5">{body}</p>
    </div>
  );
}

export default function KeyContractViz() {
  return (
    <SceneShell
      eyebrow="서버의 계약"
      title="같은 키를 다시 보내도 서버의 대답은 네 가지로 갈립니다"
      description="Stripe 문서가 명시한 계약입니다(2026-10-04 확인). 모든 도구에 일반화하지 않습니다."
      note="키 정리 전·후 띠는 시간 눈금이 아닙니다. 24시간은 정리될 수 있게 되는 최소 기간이며, 실제 정리 시점은 그리지 않았습니다. 앞의 세 경우는 키가 아직 정리되지 않았다고 가정합니다."
      ariaLabel="같은 키 재요청이 결과 재사용, 저장 없음, 오류, 새 요청 처리로 갈리는 네 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const warn = active > 0;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <Step title="① 재요청" body={scene.request} />
              <Step title="② 서버에 남은 것" body={scene.store} />
              <Step title="③ 돌려받는 것" body={scene.answer} warn={warn} />
            </div>
            <div className="grid grid-cols-2 gap-1 text-center text-xs leading-5">
              <span className={`rounded border px-1 py-1 ${scene.late ? "border-border text-muted-foreground" : "border-primary font-bold text-primary"}`}>
                {scene.late ? "" : "● "}키 정리 전
              </span>
              <span className={`rounded border border-dashed px-1 py-1 ${scene.late ? "border-amber-600 font-bold text-amber-700 dark:text-amber-400" : "border-border text-muted-foreground"}`}>
                {scene.late ? "● " : ""}키 정리 후 (최소 24시간 뒤부터 가능)
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
