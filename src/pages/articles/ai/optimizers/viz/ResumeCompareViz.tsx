import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #release-boundary — 재개 검증. 중간에 멈추지 않은 실행과 재개한 실행의 다음 이동을 대조한다.
 * 결과가 다르면 마지막으로 일치한 저장 상태로 돌아가 분모·자료 위치·누락된 기록을 확인한다.
 */
const RESTORE = ["같은 parameter", "다음 자료 순서", "누적 중인 gradient와 유효 개수", "이동 크기 일정", "갱신 횟수와 건너뛴 갱신 상태"];

const SCENES: readonly ShellScene[] = [
  { label: "기준 실행", summary: "멈추지 않고 다음 이동까지", note: "중간에 멈추지 않은 실행의 다음 parameter 이동 한 번이 기준입니다." },
  { label: "저장하고 복원", summary: "다섯 가지를 되살림", note: "parameter만이 아니라 아래 다섯 가지를 함께 복원합니다." },
  { label: "다음 이동 대조", summary: "같으면 통과", note: "복원한 실행의 다음 이동 한 번을 멈추지 않은 실행의 이동과 대조합니다." },
  { label: "다르면 되돌아갑니다", summary: "마지막 일치 저장 상태로", note: "결과가 다르면 마지막으로 일치한 저장 상태로 돌아가 분모, 자료 위치, 누락된 기록을 확인합니다." },
];

function Lane({ name, mark, next, active, bad }: { name: string; mark: string; next: string; active: boolean; bad?: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-stretch gap-1 sm:gap-2">
      <div className="flex items-center rounded-lg border border-border bg-background px-2 py-2 text-xs font-semibold leading-5">{name}</div>
      <div className={`flex items-center justify-center rounded-lg border px-2 py-2 text-center text-xs leading-5 ${mark ? "border-border bg-background" : "border-dashed border-border/50 text-muted-foreground/50"}`}>{mark || "진행 중"}</div>
      <div className={`flex items-center justify-center rounded-lg border px-2 py-2 text-center text-xs font-semibold leading-5 ${bad ? "border-red-600 text-red-700 dark:text-red-400" : active ? "border-primary bg-primary/5" : "border-dashed border-border/50 text-muted-foreground/50"}`}>{next}</div>
    </div>
  );
}

export default function ResumeCompareViz() {
  return (
    <SceneShell
      eyebrow="재개 검증"
      title="재개한 실행의 다음 이동을 기준 실행과 대조합니다"
      description="왼쪽에서 오른쪽으로 진행하며 칸 너비는 시간을 재지 않습니다."
      ariaLabel="멈추지 않은 실행과 재개한 실행의 대조 절차"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <Lane name="멈추지 않은 실행" mark="계속 진행" next="다음 이동" active />
          <Lane name="재개한 실행" mark={active === 0 ? "" : "저장 → 복원"} next={active === 3 ? "다음 이동 다름" : active === 2 ? "다음 이동 같음" : "다음 이동 전"} active={active === 2} bad={active === 3} />
          <div className="mt-2 rounded-lg border border-border bg-background px-3 py-1.5">
            {active === 3 ? (
              <>
                <p className="text-sm font-semibold">마지막으로 일치한 저장 상태로 돌아가 확인할 것</p>
                <ul className="mt-1 grid gap-x-3 text-xs leading-5 text-muted-foreground sm:grid-cols-2">
                  {["분모", "자료 위치", "누락된 기록"].map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className={`text-sm font-semibold ${active === 0 ? "text-muted-foreground/50" : ""}`}>복원할 다섯 가지</p>
                <ul className={`mt-1 grid gap-x-3 text-xs leading-5 sm:grid-cols-2 ${active === 0 ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                  {RESTORE.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    />
  );
}
