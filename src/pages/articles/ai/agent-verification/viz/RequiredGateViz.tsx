import VerificationSceneShell from "./VerificationSceneShell";

/**
 * 본문 대응: #small-case, #plan-execute-verify, #trajectory-effect — 26/27 → 수정 → 27/27, AND로 묶은 필수 조건.
 * 장면 1: 산출물 0, 나머지 1 → 0∧1∧1∧1 = 0
 * 장면 2: 평가자 0.6·0.7·0.8 → 평균 0.7, 필수 판정과 별도
 * 장면 3: 27/27, 나머지 통과(가정) → 1
 * 장면 4: 27/27이지만 외부 변경 중복 → 외부 변경 0 → 0
 * 모든 수치는 글의 가정 사례입니다.
 */
const TOTAL_TESTS = 27;
const GATE_NAMES = [
  { name: "산출물", detail: "필수 테스트" },
  { name: "경로", detail: "허용 파일만 변경" },
  { name: "외부 변경", detail: "의도한 횟수" },
  { name: "예산", detail: "비용 한도 안" },
] as const;
const RATERS = [0.6, 0.7, 0.8] as const;
const RATER_MEAN = RATERS.reduce<number>((sum, value) => sum + value, 0) / RATERS.length;

const STATES = [
  { passed: 26, gates: [0, 1, 1, 1], effect: "1회" },
  { passed: 26, gates: [0, 1, 1, 1], effect: "1회" },
  { passed: 27, gates: [1, 1, 1, 1], effect: "1회" },
  { passed: 27, gates: [1, 1, 0, 1], effect: "2회 (중복)" },
] as const;

const SCENES = [
  { label: "첫 실행", summary: "0 ∧ 1 ∧ 1 ∧ 1 = 0 · 실패", note: "테스트 27개 중 1개가 실패해 산출물 조건이 0입니다. 경로·외부 변경·예산이 모두 1이어도 AND(하나라도 0이면 전체 0)로 묶었으므로 전체 판정은 0입니다." },
  { label: "설명 점수는 다른 줄", summary: "평균 0.7 · 필수 판정에 안 들어감", note: "평가자 세 명의 0.6·0.7·0.8은 평균 0.7이지만, 이 평균으로 실패한 필수 테스트를 메우지 않습니다. 평균만 남기지 않고 0.6과 0.8 사이의 의견 차이와 기준·원문을 함께 남깁니다." },
  { label: "고친 뒤 같은 27개 재검사", summary: "1 ∧ 1 ∧ 1 ∧ 1 = 1 · 통과", note: "실패 위치를 고치고 같은 조건에서 다시 검사해 27/27이 되면 산출물 조건이 1이 됩니다. 나머지 세 조건도 각각 따로 통과해야 전체가 1이며, 여기서는 통과했다고 둡니다." },
  { label: "외부 변경이 두 번", summary: "1 ∧ 1 ∧ 0 ∧ 1 = 0 · 실패", note: "27/27이어도 같은 외부 변경이 두 번 실행됐다면 외부 변경 조건이 0입니다. 테스트 통과가 이 중복을 상쇄하지 않으므로 전체 판정은 다시 0입니다." },
] as const;

export default function RequiredGateViz() {
  return (
    <VerificationSceneShell
      eyebrow="필수 조건과 품질 점수"
      title="네 필수 조건은 AND로 묶고, 설명 점수는 따로 둡니다"
      description="칸 하나가 테스트 하나입니다. 아래 네 칸은 필수 조건이고, 하나라도 0이면 전체가 0입니다(AND). 설명 품질 점수는 그 계산 밖의 별도 줄입니다."
      note="27개 테스트, 평가자 점수 0.6·0.7·0.8, 각 조건의 통과 여부는 모두 이 글의 가정 사례입니다. 27/27도 그 27개 검사에 관한 관측이지 제품 전체의 정확도가 아닙니다."
      ariaLabel="테스트 26/27과 27/27, 네 필수 조건의 AND 판정, 별도로 둔 설명 품질 점수"
      scenes={SCENES}
      render={(active) => {
        const state = (STATES as readonly (typeof STATES)[number][])[active];
        const gates: readonly number[] = state.gates;
        const qualityFocus = active === 1;
        return (
          <div className="min-w-0 space-y-4">
            <div className={qualityFocus ? "opacity-40" : ""}>
              <p className="text-xs font-semibold">
                테스트 <span className="font-mono">{state.passed}/{TOTAL_TESTS}</span>
              </p>
              <div className="mt-2 grid max-w-sm grid-cols-9 gap-1" aria-hidden>
                {Array.from({ length: TOTAL_TESTS }, (_, index) => {
                  const failed = index >= state.passed;
                  return (
                    <span
                      key={index}
                      className="flex h-5 min-w-0 items-center justify-center rounded-sm border text-[10px] font-bold"
                      style={{ borderColor: failed ? "#dc2626" : "#16a34a", color: failed ? "#dc2626" : "#16a34a" }}
                    >
                      {failed ? "✗" : "✓"}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className={qualityFocus ? "opacity-40" : ""}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {GATE_NAMES.map((gate, index) => {
                  const value = gates[index];
                  return (
                    <div key={gate.name} className="min-w-0 rounded-lg border bg-background px-2 py-1.5 text-center" style={{ borderColor: value ? "#16a34a" : "#dc2626" }}>
                      <span className="block text-xs font-semibold">{gate.name}</span>
                      <span className="block text-[10px] leading-4 text-muted-foreground">{index === 2 ? `실행 ${state.effect}` : gate.detail}</span>
                      <span className="block font-mono text-base font-bold" style={{ color: value ? "#16a34a" : "#dc2626" }}>
                        {value} {value ? "✓" : "✗"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`rounded-lg border border-dashed px-3 py-2 ${qualityFocus ? "border-primary" : "border-border opacity-60"}`}>
              <p className="text-xs font-semibold">설명 품질 · 평가자 3명 <span className="font-normal text-muted-foreground">(필수 판정 밖)</span></p>
              <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-sm">
                {RATERS.map((score, index) => (
                  <span key={index} className="rounded-sm border border-border px-2 py-0.5">{score.toFixed(1)}</span>
                ))}
                <span className="text-muted-foreground">→ 평균 {RATER_MEAN.toFixed(1)} · 범위 0.6–0.8</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
