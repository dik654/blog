import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory — "단순히 false로 바꿨다가 true로 고정하는 방식과 달리 중첩 호출 … 에서도 원래 상태를 보존".
 * 시작 true → 바깥 no_grad 진입 → 안쪽 no_grad 진입 → 안쪽 종료 → 바깥 종료.
 * guard: 들어갈 때 이전 값을 저장해 나갈 때 그 값으로 복원. 고정 방식: 나갈 때 무조건 true.
 */
const STEPS = ["시작", "바깥 no_grad 진입", "안쪽 no_grad 진입", "안쪽 종료", "바깥 종료"] as const;
const GUARD = [true, false, false, false, true] as const;
const FIXED = [true, false, false, true, true] as const;
const SAVED = ["—", "true 저장", "false 저장", "false 복원", "true 복원"] as const;

const SCENES = [
  { label: "시작", summary: "Recording = true", note: "기본 상태에서는 연산을 실행할 때마다 backward용 그래프를 기록합니다." },
  { label: "바깥 no_grad 진입", summary: "false", note: "바깥 guard는 지금 값 true를 기억해 두고 기록을 끕니다. 고정 방식도 false로 바꿉니다." },
  { label: "안쪽 no_grad 진입", summary: "false", note: "안쪽 guard는 지금 값 false를 기억합니다. 이미 꺼져 있으므로 두 방식 모두 겉으로는 같습니다." },
  { label: "안쪽 종료", summary: "guard: false · 고정: true", note: "여기서 갈라집니다. guard는 기억해 둔 false로 되돌려 아직 바깥 no_grad 안이라는 사실을 지킵니다. 고정 방식은 무조건 true로 켜서 바깥 구간의 남은 연산까지 기록해 버립니다." },
  { label: "바깥 종료", summary: "둘 다 true", note: "바깥 guard가 처음 기억한 true로 복원합니다. 결과 값은 같아도 고정 방식은 직전 구간 동안 틀린 상태였습니다. panic으로 스코프를 빠져나갈 때도 guard는 같은 복원을 실행합니다." },
] as const;

function Cell({ on, current, wrong }: { on: boolean; current: boolean; wrong: boolean }) {
  return (
    <div
      className={`flex h-9 min-w-0 items-center justify-center rounded-md border font-mono text-[11px] font-bold sm:text-xs ${
        current ? "border-[#2563eb]" : "border-border"
      } ${wrong ? "bg-[#fee2e2] text-[#b91c1c]" : on ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-muted/40 text-muted-foreground"}`}
    >
      {on ? "true" : "false"}
      {wrong && <span className="ml-0.5" aria-label="틀림">✕</span>}
    </div>
  );
}

export default function GuardNestViz() {
  return (
    <SceneShell
      eyebrow="no_grad 중첩"
      title="나갈 때 true로 고정하면 바깥 no_grad가 먼저 풀립니다"
      description="칸은 각 시점의 Recording 값(그래프 기록 여부)이고, ✕는 guard와 달라진 틀린 값입니다. 위 줄은 들어갈 때 이전 값을 기억했다가 나갈 때 되돌리는 RAII guard, 아래 줄은 나갈 때 무조건 true로 바꾸는 방식입니다."
      ariaLabel="중첩된 no_grad에서 guard 복원과 true 고정 방식의 Recording 값 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <div className="grid grid-cols-[3.25rem_repeat(5,minmax(0,1fr))] items-end gap-1 sm:gap-1.5 text-[10px] leading-4 text-muted-foreground sm:text-xs">
            <span />
            {STEPS.map((step, i) => (
              <span key={step} className={`text-center ${i === active ? "font-bold text-foreground" : ""}`}>{step}</span>
            ))}
          </div>
          <div className="grid grid-cols-[3.25rem_repeat(5,minmax(0,1fr))] items-center gap-1 sm:gap-1.5">
            <span className="text-xs font-bold">guard</span>
            {GUARD.map((on, i) => (
              <div key={i} className={i <= active ? "" : "opacity-25"}>
                <Cell on={on} current={i === active} wrong={false} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[3.25rem_repeat(5,minmax(0,1fr))] items-center gap-1 sm:gap-1.5">
            <span className="text-[10px] text-muted-foreground sm:text-xs">기억/복원</span>
            {SAVED.map((saved, i) => (
              <span key={i} className={`text-center text-[10px] sm:text-xs ${i <= active ? "text-muted-foreground" : "opacity-25"}`}>{saved}</span>
            ))}
          </div>
          <div className="grid grid-cols-[3.25rem_repeat(5,minmax(0,1fr))] items-center gap-1 sm:gap-1.5">
            <span className="text-xs font-bold">true 고정</span>
            {FIXED.map((on, i) => (
              <div key={i} className={i <= active ? "" : "opacity-25"}>
                <Cell on={on} current={i === active} wrong={on !== GUARD[i]} />
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
