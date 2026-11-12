import PqSceneShell from "./PqSceneShell";

/**
 * 본문 대응: #migration-release — 같은 nonce 7·0.1 ETH 요청에서 두 서명 검사 결과를 조합하는 정책.
 * AND: ECDSA=1, ML-DSA=0 → 0(거부). OR: 하나만 통과하면 실행.
 * 오류가 났다고 자동으로 ECDSA-only를 허용하면 공격자가 그 전환을 유도할 수 있다.
 */
type Outcome = "run" | "deny";

const SCENES = [
  {
    label: "AND 정책",
    summary: "ECDSA=1, ML-DSA=0 → 0",
    note: "두 서명이 모두 통과해야 실행합니다. 본문의 예처럼 ML-DSA만 실패해도 0.1 ETH 송금은 막힙니다. 한 검증의 실패로도 막히므로 키 백업과 복구 가능성을 함께 시험해야 합니다.",
    cells: [["run", "deny", "deny"], ["deny", "deny", "deny"]] as Outcome[][],
    focus: [0, 1],
  },
  {
    label: "OR 정책",
    summary: "ECDSA=1, ML-DSA=0 → 1",
    note: "어느 하나만 통과하면 실행합니다. 같은 요청, 같은 검사 결과인데 AND와 달리 실행이 허용됩니다. 이 경우 기존 ECDSA 키만으로도 송금할 수 있습니다.",
    cells: [["run", "run", "run"], ["run", "deny", "deny"]] as Outcome[][],
    focus: [0, 1],
  },
  {
    label: "AND + 오류 시 ECDSA-only 허용",
    summary: "오류를 유도하면 ECDSA만으로 실행",
    note: "평소엔 AND여도 ML-DSA 쪽에서 오류가 나면 자동으로 ECDSA-only를 허용한다고 해 봅시다(가정). ML-DSA가 실패(0)한 칸은 여전히 거부되지만, 공격자가 오류를 유도할 수 있다면 ML-DSA 검사를 건너뛰고 기존 키만으로 실행하는 길이 열립니다.",
    cells: [["run", "deny", "run"], ["deny", "deny", "deny"]] as Outcome[][],
    focus: [0, 2],
  },
] as const;

const ECDSA_ROWS = ["통과 (1)", "실패 (0)"] as const;
/** 세 정책 모두 같은 열을 씁니다. 오류 열은 AND·OR에서는 통과하지 못한 결과로 다룹니다. */
const ML_COLUMNS = ["통과 (1)", "실패 (0)", "오류"] as const;

const OUTCOME_STYLE: Record<Outcome, { text: string; bg: string; color: string }> = {
  run: { text: "실행", bg: "#dcfce7", color: "#15803d" },
  deny: { text: "거부", bg: "#f1f5f9", color: "#475569" },
};

export default function DualSignaturePolicyViz() {
  return (
    <PqSceneShell
      eyebrow="두 서명을 묶는 규칙"
      title="같은 검사 결과도 정책에 따라 실행 여부가 갈립니다"
      description="가로줄은 ECDSA 검사, 세로줄은 ML-DSA 검사 결과입니다. 오류는 ML-DSA 검사가 0이나 1을 내지 못한 경우입니다. 굵은 테두리 칸이 각 장면에서 볼 칸으로, 앞의 두 장면은 본문의 예(ECDSA=1, ML-DSA=0)입니다."
      ariaLabel="AND, OR, 오류 시 ECDSA-only 허용 정책에서 두 서명 결과 조합별 실행 여부"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto grid max-w-md grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] gap-2 text-xs sm:text-sm">
            <div className="flex flex-col justify-end text-[11px] leading-4 text-muted-foreground"><span>행: ECDSA</span><span>열: ML-DSA</span></div>
            {ML_COLUMNS.map((head) => (
              <div key={head} className="flex items-end justify-center text-center font-semibold leading-5">{head}</div>
            ))}
            {ECDSA_ROWS.map((row, r) => (
              <div key={row} className="contents">
                <div className="flex items-center font-semibold">{row}</div>
                {scene.cells[r].map((outcome, c) => {
                  const style = OUTCOME_STYLE[outcome];
                  const focused = scene.focus[0] === r && scene.focus[1] === c;
                  return (
                    <div
                      key={c}
                      className="flex h-14 items-center justify-center rounded-md font-bold"
                      style={{ backgroundColor: style.bg, color: style.color, border: focused ? "1.25px solid #0f172a" : "1px solid #cbd5e1" }}
                    >
                      {style.text}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
