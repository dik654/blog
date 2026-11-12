import PqSceneShell from "./PqSceneShell";

/**
 * 본문 대응: #account-abstraction-validation — 7절의 처리 순서와 실패 표.
 * 성공: 예약 0.003, nonce 7→8, A→B 0.1, 청구 0.001·환급 0.002, success=true.
 * 사전 검사 거절: 온체인 포함 전. 검증 실패: 전체 revert면 nonce·deposit 변경 취소.
 * 실행 실패: bundle 성공 시 success=false여도 nonce 8과 시도 비용이 남을 수 있음(금액은 기록에서 읽음).
 */
type Status = "pass" | "fail" | "skip" | "undo";

const STEPS = [
  ["bundler 사전 검사", "온체인 포함 전"],
  ["검증", "validateUserOp"],
  ["실행", "execute"],
  ["비용 정산", "청구·환급"],
  ["요청 결과 기록", "UserOperationEvent"],
] as const;

const STATUS_STYLE: Record<Status, { text: string; border: string; color: string }> = {
  pass: { text: "통과", border: "#16a34a", color: "#15803d" },
  fail: { text: "실패", border: "#dc2626", color: "#b91c1c" },
  skip: { text: "도달 안 함", border: "#cbd5e1", color: "#64748b" },
  undo: { text: "실패 · 변경 취소", border: "#d97706", color: "#b45309" },
};

const SCENES = [
  {
    label: "성공",
    summary: "success=true · nonce 8",
    note: "검증에서 0.003 ETH를 예약하고 nonce를 7에서 8로 바꾼 뒤 A의 execute가 B에게 0.1 ETH를 보냅니다. 정산이 0.001 ETH를 청구하고 0.002 ETH를 예치금에 돌려줍니다.",
    steps: ["pass", "pass", "pass", "pass", "pass"] as Status[],
    state: { a: "0.9", b: "0.1", deposit: "0.019", nonce: "8", result: "success=true" },
  },
  {
    label: "사전 검사 거절",
    summary: "온체인 포함 전의 실패",
    note: "bundler가 제출 전에 거절하면 요청은 체인에 들어가지 않습니다. 요청 결과 기록이 생겼거나 B가 0.1 ETH를 받았다고 표시하지 않습니다.",
    steps: ["fail", "skip", "skip", "skip", "skip"] as Status[],
    state: { a: "1", b: "0", deposit: "0.020", nonce: "7", result: "기록 없음" },
  },
  {
    label: "검증 실패 → 전체 revert",
    summary: "nonce·예치금 변경도 취소",
    note: "잘못된 서명·nonce·prefund처럼 검증에서 실패해 전체 handleOps가 revert하면 예약과 nonce 변경도 되돌아갑니다. 다만 제출자의 체인 거래 gas는 발생할 수 있으며, 이것은 계정 예치금 청구와 다른 비용입니다.",
    steps: ["pass", "undo", "skip", "skip", "skip"] as Status[],
    state: { a: "1", b: "0", deposit: "0.020", nonce: "7", result: "전체 revert" },
  },
  {
    label: "실행 실패 (bundle은 성공)",
    summary: "success=false · nonce 8이 남을 수 있음",
    note: "검증은 통과했지만 수신자 호출이 실패한 경우입니다. bundle이 성공하면 B는 받지 못해도 nonce 8과 실행 시도 비용은 남을 수 있습니다. 이 비용이 성공 사례의 0.001 ETH와 같다고 단정하지 않고 요청별 기록에서 읽습니다.",
    steps: ["pass", "pass", "fail", "pass", "pass"] as Status[],
    state: { a: "1", b: "0", deposit: "0.020 − 시도 비용", nonce: "8", result: "success=false" },
  },
] as const;

const STATE_LABELS = [
  ["a", "A 송금 잔액"],
  ["b", "B"],
  ["deposit", "A 예치금"],
  ["nonce", "다음 순번"],
  ["result", "요청 결과"],
] as const;

export default function HandleOpsBranchViz() {
  return (
    <PqSceneShell
      eyebrow="어디서 멈췄는가"
      title="실패한 단계에 따라 남는 순번과 잔액이 다릅니다"
      description="위 줄은 0.1 ETH 요청이 거치는 순서, 아래 칸은 그 결과로 남는 상태입니다(잔액 단위 ETH). 3절의 설명용 숫자를 씁니다."
      ariaLabel="성공, 사전 검사 거절, 검증 실패, 실행 실패 네 경우의 단계 상태와 남는 잔액·순번"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <ol className="grid grid-cols-1 gap-2 sm:grid-cols-5">
              {STEPS.map(([step, sub], index) => {
                const style = STATUS_STYLE[scene.steps[index]];
                return (
                  <li
                    key={step}
                    className="flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2 text-xs sm:block sm:text-center"
                    style={{ borderColor: style.border, borderStyle: scene.steps[index] === "skip" ? "dashed" : "solid" }}
                  >
                    <span className="block min-w-0">
                      <span className="block font-semibold leading-5">{index + 1}. {step}</span>
                      <span className="block break-all font-mono text-[11px] text-muted-foreground">{sub}</span>
                    </span>
                    <span className="block font-bold sm:mt-1" style={{ color: style.color }}>{style.text}</span>
                  </li>
                );
              })}
            </ol>
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {STATE_LABELS.map(([key, name]) => (
                <div key={key} className="rounded-md border border-border bg-muted/30 px-2 py-1.5 text-xs">
                  <dt className="text-muted-foreground">{name}</dt>
                  <dd className="mt-0.5 font-mono font-bold leading-5">{scene.state[key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      }}
    />
  );
}
