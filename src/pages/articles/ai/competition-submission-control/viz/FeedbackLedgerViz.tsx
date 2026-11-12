import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case, #feedback — 네 번의 전송과 선택 변경 표식 [0,1,1,0].
 * 표식은 "그 전송의 결과가 다음 선택을 바꿨는가"를 사람이 기록한 값입니다.
 * 누적 0 → 1 → 2 → 2, 한도 2에 세 번째 결과 뒤 도달해 후보를 동결합니다. 모든 수치는 본문의 가정입니다.
 */
const BUDGET = 2;

const SENDS = [
  { file: "형식 오류 파일", result: "거절 · 필수 열 이름 오류", next: "예측값 그대로 형식만 수정", mark: 0 },
  { file: "후보 A", result: "점수 0.74", next: "B를 시험하기로 함", mark: 1 },
  { file: "후보 B", result: "점수 0.76", next: "B를 최종 후보로 고정", mark: 1 },
  { file: "같은 B 파일 재전송", result: "결과는 기록만", next: "새 후보 선택에 쓰지 않음", mark: 0 },
] as const;

const MARKS: readonly number[] = SENDS.map((send) => send.mark);
const cumulative = (upto: number) => MARKS.slice(0, upto + 1).reduce<number>((sum, mark) => sum + mark, 0);

const SCENES = [
  { label: "1번째 전송", summary: "표식 0 · 누적 0 / 한도 2", note: "열 이름 오류로 거절됐고 예측값은 바꾸지 않고 형식만 고쳤습니다. 결과가 후보 선택을 바꾸지 않았으므로 표식은 0입니다." },
  { label: "2번째 전송", summary: "표식 1 · 누적 1 / 한도 2", note: "후보 A의 점수 0.74를 보고 B를 시험하기로 했습니다. 관측한 점수가 다음 선택을 바꿨으므로 표식은 1입니다." },
  { label: "3번째 전송", summary: "표식 1 · 누적 2 = 한도 2 → 동결", note: "B의 0.76을 보고 A에서 B로 최종 선택했습니다. 누적 2가 미리 정한 한도 2에 도달했으므로 이 결과 뒤 후보를 동결합니다." },
  { label: "4번째 전송", summary: "표식 0 · 누적 2 그대로", note: "동결된 B 파일을 그대로 다시 보냈습니다. 전송 횟수는 4로 늘었지만 선택 변경 수는 2에 머뭅니다. 돌아온 결과는 그래도 기록합니다." },
] as const;

export default function FeedbackLedgerViz() {
  return (
    <SceneShell
      eyebrow="전송 횟수와 선택 변경 수"
      title="네 번 보냈지만 선택을 바꾼 결과는 두 번입니다"
      description="칸 하나가 전송 한 번입니다. 아래 표식은 그 전송의 결과가 다음 선택을 바꿨으면 1, 아니면 0이며 사람이 기록합니다. 숫자는 본문의 가정입니다."
      ariaLabel="네 번의 전송과 선택 변경 표식 0, 1, 1, 0의 누적과 변경 한도 2"
      scenes={SCENES}
      render={(active) => {
        const used = cumulative(active);
        const frozen = used >= BUDGET;
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SENDS.map((send, index) => {
                const seen = index <= active;
                const current = index === active;
                const afterFreeze = index > 0 && cumulative(index - 1) >= BUDGET;
                return (
                  <li
                    key={send.file + index}
                    className={`min-w-0 rounded-lg border px-2.5 py-2 text-xs leading-5 ${
                      current ? "border-primary bg-background" : seen ? "border-border bg-background" : "border-dashed border-border/50 text-muted-foreground/50"
                    }`}
                  >
                    <span className="block font-mono text-[11px] text-muted-foreground">전송 {index + 1}</span>
                    <span className="block font-semibold">{send.file}</span>
                    <span className="block">{seen ? send.result : "아직"}</span>
                    <span className="mt-1 block border-t border-border/60 pt-1 text-muted-foreground">{seen ? send.next : " "}</span>
                    <span className="mt-1 flex items-center justify-between gap-1">
                      <span className="text-muted-foreground">표식</span>
                      <span className={`font-mono text-sm font-bold ${seen ? (send.mark ? "text-primary" : "") : "opacity-0"}`}>{send.mark}</span>
                    </span>
                    <span className={`block text-[11px] font-semibold ${afterFreeze && seen ? "text-amber-700 dark:text-amber-400" : "opacity-0"}`}>동결 뒤 전송</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-5 grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 text-xs sm:text-sm">
              <span className="font-semibold">선택 변경 수</span>
              <div className="grid grid-cols-2 gap-1.5">
                {Array.from({ length: BUDGET }, (_, slot) => (
                  <div
                    key={slot}
                    className={`h-6 rounded-sm border text-center font-mono text-xs leading-6 ${
                      slot < used ? "border-primary bg-primary/15 font-bold text-primary" : "border-dashed border-border"
                    }`}
                  >
                    {slot < used ? `변경 ${slot + 1}` : "빈 칸"}
                  </div>
                ))}
              </div>
              <span className="font-semibold">전송 수</span>
              <span className="font-mono">{active + 1}회 · 표식 합 {MARKS.slice(0, active + 1).join("+")} = {used}</span>
              <span className="font-semibold">후보</span>
              <span className={frozen ? "font-bold text-amber-700 dark:text-amber-400" : "text-muted-foreground"}>
                {frozen ? "한도 2 도달 → B로 동결" : "아직 바꿀 수 있음"}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
