import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release 두 문단 — 같은 하위 실패에서 Proxy가 실패를 처리하는 가지와 전파하는 가지.
 * 사례는 글 첫 그림과 같습니다: Alice → P(1 ETH) → DELEGATECALL I → STATICCALL C.
 * 가지 A는 첫 그림의 결말, 가지 B는 "Proxy까지 실패를 전파하면 바깥 checkpoint까지 되돌아간다"는 문장입니다.
 */
type Cell = { text: string; tone: "ok" | "fail" | "muted" };

const ok = (text: string): Cell => ({ text, tone: "ok" });
const fail = (text: string): Cell => ({ text, tone: "fail" });
const muted = (text: string): Cell => ({ text, tone: "muted" });

const FRAMES = ["F0 · Proxy P", "F1 · I 코드 (P 상태)", "F2 · Checker C"] as const;
const LEDGER = ["receipt status", "F1 success", "P의 slot 0", "Alice → P 1 ETH"] as const;

const SCENES = [
  {
    label: "공통 시작",
    summary: "F2 예외 → F1 REVERT",
    frames: [muted("결과 대기"), fail("REVERT"), fail("예외 종료")],
    ledger: [muted("아직 없음"), fail("0"), muted("7 → 0 복구"), muted("F0 안에서 기록")],
    note: "Checker의 금지된 SSTORE가 F2를 예외 종료시키고, Implementation 코드가 그 실패를 REVERT로 전파합니다. F1이 임시로 쓴 slot 0=7은 F1 checkpoint까지 되돌아갑니다. 이제 P가 success=0을 받아 다음 길을 고릅니다.",
  },
  {
    label: "가지 A · P가 처리",
    summary: "status = 1 · 내부 success = 0",
    frames: [ok("정상 종료"), fail("실패 처리됨"), fail("종료")],
    ledger: [ok("1"), fail("0"), muted("0"), ok("남음")],
    note: "P가 실패를 처리하고 정상 반환하면 F0의 변경은 남고 receipt status는 1입니다. 그런데 내부 위임 호출은 실패했고 slot 0도 바뀌지 않았습니다. status 하나로 모든 내부 호출의 성공을 결론 내릴 수 없는 이유입니다.",
  },
  {
    label: "가지 B · P가 전파",
    summary: "바깥 checkpoint까지 되돌림",
    frames: [fail("실패 전파"), fail("REVERT"), fail("종료")],
    ledger: [fail("0 · 실패"), fail("0"), muted("0"), fail("되돌아감")],
    note: "P도 실패를 전파하면 Proxy 프레임 안에서 이뤄진 값 이전과 상태 변경이 바깥 checkpoint까지 되돌아갑니다. Alice가 보낸 1 ETH의 이전도 남지 않고, 거래 전체가 실패로 끝납니다.",
  },
  {
    label: "무엇을 함께 볼까",
    summary: "status만으로는 가지를 못 가립니다",
    frames: [muted("A: 정상 / B: 실패"), fail("두 가지 모두 실패"), fail("두 가지 모두 실패")],
    ledger: [muted("A: 1 / B: 0"), fail("두 가지 모두 0"), muted("두 가지 모두 0"), muted("A: 남음 / B: 되돌아감")],
    note: "두 가지 모두 내부 프레임은 실패했지만 바깥 결과는 다릅니다. 무슨 일이 있었는지 알려면 receipt status와 함께 내부 success 값·return data·logs·최종 storage를 봐야 합니다.",
  },
] as const satisfies readonly { label: string; summary: string; frames: readonly Cell[]; ledger: readonly Cell[]; note: string }[];

const TONE: Record<Cell["tone"], string> = {
  ok: "text-emerald-700 dark:text-emerald-400",
  fail: "text-red-700 dark:text-red-400",
  muted: "text-muted-foreground",
};
const MARK: Record<Cell["tone"], string> = { ok: "●", fail: "✕", muted: "○" };

export default function FailurePropagationBranchViz() {
  return (
    <SceneShell
      eyebrow="실패의 두 갈래"
      title="같은 하위 실패라도 상위 프레임의 선택에 따라 거래 결과가 갈립니다"
      description="글 첫 그림의 거래(Alice → Proxy P 1 ETH → DELEGATECALL I → STATICCALL C)를 그대로 씁니다. 위 칸은 프레임별 종료, 아래 칸은 거래 뒤에 남는 값입니다. ●는 성공·남음, ✕는 실패·되돌림, ○는 변화 없음이나 대기입니다."
      note="checkpoint는 프레임을 열기 전에 남긴 상태 경계입니다. 실패한 프레임의 변경은 그 경계까지만 되돌아가므로, 상위 프레임이 실패를 전파하는지에 따라 되돌림 범위가 달라집니다."
      ariaLabel="Proxy가 하위 실패를 처리하는 경우와 전파하는 경우의 거래 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="space-y-1.5">
              {FRAMES.map((frame, index) => (
                <div
                  key={frame}
                  className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm"
                  style={{ marginLeft: `${index * 0.9}rem` }}
                >
                  <span className="min-w-0 break-keep font-mono font-semibold">{frame}</span>
                  <span className={`min-w-0 break-keep text-right font-semibold ${TONE[scene.frames[index].tone]}`}>
                    {MARK[scene.frames[index].tone]} {scene.frames[index].text}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border text-xs sm:grid-cols-4">
              {LEDGER.map((key, index) => (
                <div key={key} className="min-w-0 bg-background px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">{key}</p>
                  <p className={`mt-0.5 break-keep font-mono font-semibold ${TONE[scene.ledger[index].tone]}`}>
                    {MARK[scene.ledger[index].tone]} {scene.ledger[index].text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
