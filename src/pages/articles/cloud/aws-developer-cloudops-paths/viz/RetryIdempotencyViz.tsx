import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단 — 일시 오류 뒤 재시도하면 성공률은 높아지지만 같은 결제를 두 번 처리할 수 있다.
 * 작업에 고유 키를 두고 이미 끝난 결과를 다시 쓰지 않는다(멱등성). 6절 용어: 같은 결제 이벤트 ID가 다시 오면 기존 결과를 돌려준다.
 * 첫 시도가 처리된 뒤 응답 단계에서 오류가 났다는 설정과 키 이름 pay-123은 그림을 위한 가정이다.
 */
type Row = { who: string; text: string; tone: "plain" | "bad" | "good" };

const SCENES = [
  {
    label: "첫 시도: 처리됐지만 일시 오류를 받음",
    summary: "결제 기록 1건 · 호출자는 실패로 봄",
    rows: [
      { who: "호출자", text: "결제 요청", tone: "plain" },
      { who: "결제 처리", text: "결제를 기록함", tone: "plain" },
      { who: "호출자", text: "응답 대신 일시 오류를 받음", tone: "bad" },
    ] as Row[],
    ledger: ["결제 1"],
    note: "(가정) 결제는 이미 기록됐는데 응답이 돌아오는 길에 일시 오류가 났습니다. 호출자 쪽에서는 실패처럼 보입니다.",
  },
  {
    label: "키 없이 재시도: 같은 결제가 두 번",
    summary: "성공 응답 · 결제 기록 2건",
    rows: [
      { who: "호출자", text: "같은 결제를 다시 요청", tone: "plain" },
      { who: "결제 처리", text: "새 결제로 보고 또 기록함", tone: "bad" },
      { who: "호출자", text: "성공 응답을 받음", tone: "good" },
    ] as Row[],
    ledger: ["결제 1", "결제 2 (같은 결제)"],
    note: "재시도 덕분에 호출자는 성공을 받았지만, 처리 쪽은 이것이 같은 요청인지 모르므로 같은 결제를 두 번 처리했습니다.",
  },
  {
    label: "(첫 요청부터 고유 키를 붙였다면) 재시도",
    summary: "성공 응답 · 결제 기록 1건",
    rows: [
      { who: "호출자", text: "첫 요청에 붙인 키 pay-123으로 다시 요청", tone: "plain" },
      { who: "결제 처리", text: "이미 끝난 키 → 다시 쓰지 않음", tone: "good" },
      { who: "호출자", text: "기존 결과를 성공으로 받음", tone: "good" },
    ] as Row[],
    ledger: ["pay-123 · 결제 1"],
    note: "첫 요청부터 작업에 고유 키(가정: pay-123)를 붙였다면, 처리 쪽은 키로 이미 끝난 작업을 알아보고 기존 결과를 돌려줍니다. 멱등성은 같은 요청을 여러 번 처리해도 결과가 한 번 처리한 것과 같게 만드는 성질입니다. 다만 모든 외부 부수 효과가 자동으로 중복 제거되지는 않습니다(6절).",
  },
] as const;

const TONE: Record<Row["tone"], string> = {
  plain: "border-border",
  bad: "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]",
  good: "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]",
};

export default function RetryIdempotencyViz() {
  return (
    <SceneShell
      eyebrow="재시도와 멱등성"
      title="재시도는 성공을 늘리지만, 키가 없으면 결제가 두 번 남습니다"
      description="번호 목록은 시간 순서대로 일어난 일, 결제 기록 상자는 그 결과 남은 결제입니다. 호출자는 요청을 보내는 쪽, 결제 처리는 요청을 받아 기록하는 쪽입니다."
      ariaLabel="일시 오류 뒤 재시도할 때 고유 키가 없으면 결제가 두 번 기록되고, 키가 있으면 한 번만 남는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <ol className="min-w-0 space-y-2">
              {scene.rows.map((row, index) => (
                <li key={index} className={`grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-3 py-2 text-sm ${TONE[row.tone]}`}>
                  <span className="text-xs font-semibold text-muted-foreground">{index + 1}. {row.who}</span>
                  <span className="min-w-0 break-keep">{row.text}</span>
                </li>
              ))}
            </ol>
            <div className="min-w-0 rounded-md border border-border p-3">
              <p className="text-xs font-semibold text-muted-foreground">결제 기록</p>
              <ul className="mt-2 space-y-1.5">
                {(scene.ledger as readonly string[]).map((entry, index) => (
                  <li key={entry} className={`rounded border px-2 py-1 text-sm ${index > 0 ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-border"}`}>
                    {entry}
                  </li>
                ))}
              </ul>
              <p className={`mt-2 text-sm font-bold ${scene.ledger.length > 1 ? "text-[#b91c1c] dark:text-[#f87171]" : ""}`}>{scene.ledger.length}건</p>
            </div>
          </div>
        );
      }}
    />
  );
}
