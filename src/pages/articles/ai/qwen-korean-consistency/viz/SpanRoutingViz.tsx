import SceneShell from "./SceneShell";

/**
 * 본문 대응: #runtime-guard — 같은 Han span이라도 field에 따라 경로가 갈린다.
 * translation의 首尔은 allow rule로 통과, rationale의 因此는 judge로, judge가 retry를 내면
 * 제한된 횟수만 재시도하고 상한 뒤에는 degrade·review·명시적 실패로 끝난다(임의 pass 아님).
 * rationale 문장은 본문의 "계산 설명 중 因此가 끼는" 사례를 그림용으로 적은 것이다.
 */
type Tone = "idle" | "flag" | "pass" | "fail" | "route";

const FIELDS = [
  { field: "rationale", text: ["9,600을 3으로 나누면 3,200이다. ", "因此", " …"] },
  { field: "final_answer", text: ["한 사람 몫은 3,200원입니다", "", ""] },
  { field: "translation", text: ["", "首尔", ""] },
] as const;

const STAGES = ["출력", "checker", "allow rule", "judge", "retry 상한"] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  stage: number;
  results: readonly [string, Tone][];
  note: string;
}[] = [
  {
    label: "한 응답, 세 출력 field",
    summary: "Han 문자 두 곳",
    stage: 0,
    results: [["", "idle"], ["", "idle"], ["", "idle"]],
    note: "계산 설명(rationale)에 因此가 끼어 있고, 번역 field에는 사용자가 요청한 首尔이 있습니다. 둘 다 Han 문자입니다.",
  },
  {
    label: "Checker는 사실만 표시합니다",
    summary: "hanSpans 2개",
    stage: 1,
    results: [["Han span: 因此", "flag"], ["span 없음", "idle"], ["Han span: 首尔", "flag"]],
    note: "결정적 checker는 어느 field의 몇 번째 글자에 Han span이 있는지만 반환합니다. 이것이 오류인지는 여기서 정하지 않습니다.",
  },
  {
    label: "Checker 결과만으로 실패시키면",
    summary: "首尔 = false positive",
    stage: 1,
    results: [["실패", "fail"], ["통과", "pass"], ["실패 ← 정답을 막음", "fail"]],
    note: "Span이 있다는 사실만으로 실패시키면 사용자가 요청한 번역 首尔까지 막습니다. 이것이 false positive(정상을 위반으로 잘못 판단)입니다.",
  },
  {
    label: "허용 field면 allow rule로 통과",
    summary: "首尔 통과 · 因此 → judge",
    stage: 2,
    results: [["허용 field 밖 → judge로", "route"], ["통과", "pass"], ["허용 예외 → 통과", "pass"]],
    note: "같은 Han span이라도 translation에 있으면 allow rule로 통과시키고, rationale에 있으면 judge 대상으로 보냅니다. 판단 기준은 문자 목록이 아니라 위치와 요청입니다.",
  },
  {
    label: "Judge가 요청을 읽고 판정합니다",
    summary: "판정 예: retry",
    stage: 3,
    results: [["판정 예: unexpected_script → retry", "flag"], ["통과", "pass"], ["통과", "pass"]],
    note: "Judge는 원래 요청·출력 field·checker findings·허용 예외를 함께 받아 정해진 schema로 판정합니다. 이 사례는 예상하지 않은 전환으로 판정될 수 있습니다. Schema를 채우지 못한 결과는 pass로 치지 않습니다.",
  },
  {
    label: "재시도는 상한에서 끝납니다",
    summary: "degrade · review · 실패",
    stage: 4,
    results: [["제한 횟수 재시도 · 상한에 닿으면 degrade·review·실패", "route"], ["통과", "pass"], ["통과", "pass"]],
    note: "위반 field와 허용 예외를 짧게 피드백해 제한된 횟수만 다시 생성합니다. 상한에 닿으면 최종 답변만 주는 축약 응답(degrade), 사람 검토(review), 명시적 실패 중 하나로 끝냅니다. 마지막 후보를 그냥 통과시키지 않습니다.",
  },
];

const TONE_CLASS: Record<Tone, string> = {
  idle: "text-muted-foreground",
  flag: "font-semibold text-amber-700 dark:text-amber-400",
  pass: "font-semibold text-green-700 dark:text-green-400",
  fail: "font-semibold text-red-700 dark:text-red-400",
  route: "font-semibold text-primary",
};

export default function SpanRoutingViz() {
  return (
    <SceneShell
      eyebrow="같은 문자, 다른 경로"
      title="因此와 首尔은 같은 Han 문자지만 field에 따라 다른 길로 갑니다"
      description="행 하나가 출력 field 하나입니다. 오른쪽 칸은 각 단계에서 그 field가 받는 처리입니다. rationale 문장은 그림용 예시입니다."
      ariaLabel="checker, allow rule, judge, bounded retry를 거치는 두 Han span의 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-5 gap-1 text-center text-[11px] leading-4 sm:text-xs">
              {STAGES.map((stage, index) => (
                <li
                  key={stage}
                  className={`min-w-0 rounded-md border px-1 py-1.5 [overflow-wrap:anywhere] ${
                    index === scene.stage ? "border-primary font-bold text-primary" : index < scene.stage ? "border-border text-foreground" : "border-border/40 text-muted-foreground/60"
                  }`}
                >
                  {stage}
                </li>
              ))}
            </ol>
            <div className="mt-4 divide-y divide-border/70">
              {FIELDS.map((row, index) => {
                const [result, tone] = scene.results[index];
                return (
                  <div key={row.field} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)_12rem] sm:items-baseline sm:gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{row.field}</span>
                    <span className="min-w-0 text-sm [overflow-wrap:anywhere]">
                      {row.text[0]}
                      {row.text[1] && (
                        <span className={`rounded px-0.5 ${scene.stage >= 1 ? "border border-amber-600 font-bold" : ""}`}>{row.text[1]}</span>
                      )}
                      {row.text[2]}
                    </span>
                    <span className={`min-h-5 min-w-0 text-xs leading-5 [overflow-wrap:anywhere] sm:text-right ${TONE_CLASS[tone]}`}>
                      {result ? `→ ${result}` : " "}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
