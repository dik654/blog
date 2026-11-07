import SceneShell from "./SceneShell";

/**
 * 본문 대응: #recovery-checkpointing의 복구 의사코드 — unknown 저장 → 실제 결과 조회 → 보장 확인 순서와 세 출구.
 */
type Lit = "save" | "query" | "exitDone" | "guarantee" | "exitRetry" | "exitStop";

const SCENES: readonly ({ label: string; summary: string; note: string; lit: readonly Lit[] })[] = [
  { label: "먼저 저장하고 조회합니다", summary: "unknown → 조회", note: "응답 없음과 실행 실패를 구분해 저장한 뒤, 원래 업무의 실제 결과를 조회합니다. 재시도는 이 뒤에 옵니다.", lit: ["save", "query"] },
  { label: "실행 증거가 있으면", summary: "대상·금액 검증 → 완료", note: "실제 대상과 금액이 맞을 때만 완료로 판정합니다. 다시 보낼 이유가 없습니다.", lit: ["save", "query", "exitDone"] },
  { label: "증거는 없고 세 조건이 맞으면", summary: "같은 요청 · 같은 키", note: "서버 보장과 키 범위·유효 기간을 확인하고 재시도 횟수가 남았을 때만 같은 요청을 다시 보냅니다.", lit: ["save", "query", "guarantee", "exitRetry"] },
  { label: "증거도 없고 조건도 어긋나면", summary: "새 효과 중단 · 인계", note: "보장·키 유효·남은 횟수 가운데 하나라도 어긋나면 여기로 옵니다. 빈 조회 결과만으로 새 키를 만들거나 미실행이라고 단정하지 않습니다. 미확인 상태를 그대로 담아 넘깁니다.", lit: ["save", "query", "guarantee", "exitStop"] },
];

function Box({ on, kind, children }: { on: boolean; kind: "step" | "exit"; children: string }) {
  const off = "border-border text-muted-foreground";
  const lit = kind === "exit" ? "border-primary bg-primary/[0.06] font-bold text-foreground" : "border-primary font-semibold text-foreground";
  return (
    <div className={`min-w-0 rounded-lg border bg-background px-2.5 py-1.5 text-xs leading-5 ${on ? lit : off} ${kind === "exit" ? "border-dashed" : ""}`}>
      {children}
    </div>
  );
}

function BranchLabel({ on, children }: { on: boolean; children: string }) {
  return <span className={`text-center text-xs font-bold ${on ? "text-primary" : "text-muted-foreground"}`}>{children}</span>;
}

export default function RecoveryBranchViz() {
  return (
    <SceneShell
      eyebrow="복구의 순서"
      title="결과가 불명확한 요청은 세 출구 중 하나로 나갑니다"
      description="아래 의사코드와 같은 순서입니다. 점선 칸이 출구이고, 실선 칸은 그 전에 거치는 확인입니다."
      ariaLabel="결과 미확인 요청을 저장, 조회, 보장 확인 순서로 판정해 완료, 같은 키 재시도, 중단과 인계로 나누는 분기"
      scenes={SCENES}
      render={(active) => {
        const lit = SCENES[active].lit;
        const on = (key: Lit) => lit.includes(key);
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,1.15fr)_2.5rem_minmax(0,1fr)] items-center gap-x-1 gap-y-2">
            <Box on={on("save")} kind="step">unknown으로 저장</Box>
            <span />
            <span />
            <Box on={on("query")} kind="step">실제 결과 조회: 실행 증거가 있는가?</Box>
            <BranchLabel on={on("exitDone")}>예 →</BranchLabel>
            <Box on={on("exitDone")} kind="exit">대상·금액 검증 뒤 완료</Box>
            <Box on={on("guarantee")} kind="step">아니오 ↓ 서버 보장·키 유효·횟수 남음?</Box>
            <BranchLabel on={on("exitRetry")}>예 →</BranchLabel>
            <Box on={on("exitRetry")} kind="exit">같은 요청을 같은 키로 재시도</Box>
            <span className={`text-right text-xs font-bold ${on("exitStop") ? "text-primary" : "text-muted-foreground"}`}>아니오</span>
            <BranchLabel on={on("exitStop")}>→</BranchLabel>
            <Box on={on("exitStop")} kind="exit">새 효과 중단, 미확인 상태로 인계</Box>
          </div>
        );
      }}
    />
  );
}
