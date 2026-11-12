import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-exceptions, #scope-test — 프로필 A의 기록 12개에 들어오는 4가지 입력(가정)을
 * 세 가지 규칙에 통과시켜 본다. 숫자만 보는 두 규칙은 실제로 같은 판정(0이면 막고 양수면 통과)을 내므로
 * 두 장면 모두 네 칸을 다 채운다. 본문(5절)이 각 규칙에서 짚은 실패는 장면 설명이 짚는다.
 * 경로를 먼저 나눈 규칙은 같은 0을 실패(보존)와 정상 삭제(0개 기록)로 갈라 놓는다.
 */
type Mark = "ok" | "bad" | "skip";
interface Cell {
  verdict: string;
  mark: Mark;
}

const INPUTS = [
  { path: "정리 경로", result: "실패 결과 0개", expected: "12개 유지" },
  { path: "정리 경로", result: "부분 결과 5개", expected: "12개 유지" },
  { path: "정리 경로", result: "전체 결과 12개", expected: "검증 뒤 교체" },
  { path: "삭제 경로", result: "요청한 삭제 0개", expected: "0개 기록" },
] as const;

const SCENES = [
  {
    label: "규칙 ① 빈 결과는 저장하지 않는다",
    summary: "0이면 모두 막음",
    note: "결과 길이 0만 보고 막으면 실패한 정리 결과는 막지만, 사용자가 요청하고 권한을 확인한 삭제도 같이 막힙니다. 두 경우의 숫자는 둘 다 0입니다. 0만 막는 규칙이라 양수인 부분 결과 5개는 그대로 통과합니다.",
    cells: [
      { verdict: "막음 → 12개 유지", mark: "ok" },
      { verdict: "통과 → 5개로 바뀔 수 있음", mark: "bad" },
      { verdict: "통과 → 개수만 보고 교체", mark: "bad" },
      { verdict: "막음 → 정상 삭제 실패", mark: "bad" },
    ] as Cell[],
  },
  {
    label: "규칙 ② 0보다 크면 저장한다",
    summary: "양수면 모두 통과",
    note: "양수만 보고 통과시키면 12개 중 5개만 남은 불완전한 결과를 정상으로 받아들일 수 있습니다. 개수가 0이 아니라는 사실은 결과가 빠짐없다는 뜻이 아닙니다. 0은 저장하지 않으므로 네 칸의 판정이 규칙 ①과 같고, 둘을 함께 써도 고쳐지지 않습니다.",
    cells: [
      { verdict: "저장 안 함 → 12개 유지", mark: "ok" },
      { verdict: "통과 → 5개로 바뀔 수 있음", mark: "bad" },
      { verdict: "통과 → 개수만 보고 교체", mark: "bad" },
      { verdict: "저장 안 함 → 정상 삭제 실패", mark: "bad" },
    ] as Cell[],
  },
  {
    label: "교체 경로: 완전성부터 확인",
    summary: "실패·부분이면 이전 상태 보존",
    note: "완전성은 새 결과가 빠짐없는지를 뜻합니다. 실패 0개는 오류로 기록하고, 부분 5개는 완전성이 확인되지 않아 교체하지 않습니다. 전체 12개도 개수만으로 승인하지 않고 내용·형식·버전을 검증한 뒤 교체합니다. (가정)",
    cells: [
      { verdict: "오류 기록 → 12개 유지", mark: "ok" },
      { verdict: "완전성 미확인 → 12개 유지", mark: "ok" },
      { verdict: "내용·형식·버전 검증 → 교체", mark: "ok" },
      { verdict: "교체 경로가 아님", mark: "skip" },
    ] as Cell[],
  },
  {
    label: "교체 경로 옆에 삭제 경로를 따로 둠",
    summary: "같은 0, 다른 행동",
    note: "위 세 칸은 앞 장면 그대로이고 넷째 칸만 삭제 경로가 맡습니다. 명시적 삭제는 정리 경로의 예외가 아니라 별도로 허용된 경로로 처리합니다. 대상 A·권한·의도와 실제 삭제 결과를 확인하고 0개 상태를 기록합니다. 이 검사는 빈 실패 결과를 정상 삭제로 잘못 분류하지 않는지도 봅니다. (가정)",
    cells: [
      { verdict: "삭제로 분류하지 않음 → 12개 유지", mark: "ok" },
      { verdict: "완전성 미확인 → 12개 유지", mark: "ok" },
      { verdict: "내용·형식·버전 검증 → 교체", mark: "ok" },
      { verdict: "대상·권한·의도 확인 → 0개 기록", mark: "ok" },
    ] as Cell[],
  },
] as const;

const MARK_TEXT: Record<Mark, string> = { ok: "✓", bad: "✗", skip: "–" };
const MARK_LABEL: Record<Mark, string> = { ok: "기대와 같음", bad: "기대와 다름", skip: "판정 없음" };
const MARK_COLOR: Record<Mark, string> = { ok: "#15803d", bad: "#b91c1c", skip: "#94a3b8" };

export default function LessonRuleBranchViz() {
  return (
    <SceneShell
      eyebrow="같은 숫자, 다른 경로"
      title="결과 개수만 보는 규칙과 경로를 먼저 나누는 규칙"
      description="프로필 A에는 기록 12개가 있습니다(가정). 한 칸이 3절의 검사 하나이며, ‘기대’는 그 입력에서 기대하는 상태, 아래(넓은 화면에서는 오른쪽)는 지금 장면의 규칙이 실제로 하는 일입니다. ✓는 기대와 같음, ✗는 기대와 다름입니다."
      ariaLabel="네 가지 입력을 세 가지 규칙에 통과시킨 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <ul className="m-0 list-none space-y-2 p-0">
            {INPUTS.map((input, index) => {
              const cell = scene.cells[index];
              const dim = cell.mark === "skip";
              return (
                <li
                  key={input.result}
                  className="grid grid-cols-1 gap-x-3 gap-y-1 rounded-lg border px-3 py-1.5 text-xs leading-5 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:text-sm"
                  style={{ borderColor: dim ? "#cbd5e1" : MARK_COLOR[cell.mark] }}
                >
                  <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 sm:block">
                    <span className="font-semibold sm:block">
                      <span className="text-muted-foreground">{input.path} · </span>
                      {input.result}
                    </span>
                    <span className="text-muted-foreground sm:block">기대: {input.expected}</span>
                  </div>
                  <div className="min-w-0 sm:text-right">
                    <span className="mr-1.5 font-mono font-bold" style={{ color: MARK_COLOR[cell.mark] }} aria-label={MARK_LABEL[cell.mark]}>
                      {MARK_TEXT[cell.mark]}
                    </span>
                    <span className={dim ? "text-muted-foreground/70" : "font-semibold"}>{cell.verdict}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        );
      }}
    />
  );
}
