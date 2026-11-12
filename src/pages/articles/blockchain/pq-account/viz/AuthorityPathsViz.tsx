import PqSceneShell from "./PqSceneShell";

/**
 * 본문 대응: #ml-dsa-signature-boundary, #migration-release — SimpleAccount의 _validateSignature는 ECDSA.recover,
 * owner는 execute를 직접 호출할 수 있고 업그레이드도 owner 권한에 연결된다.
 * 서명 함수만 ML-DSA로 바꿔도 옛 owner 직접 실행·복구·업그레이드 경로가 남으면 계정 전체가 바뀐 것이 아니다.
 */
type PathState = "old" | "new" | "review";

const PATHS = [
  { id: "userop", name: "UserOperation 검증", via: "EntryPoint → validateUserOp → _validateSignature" },
  { id: "direct", name: "owner의 직접 execute", via: "owner가 계정을 직접 호출" },
  { id: "upgrade", name: "업그레이드", via: "owner 권한에 연결" },
  { id: "recovery", name: "복구 (기존 키로 할 수 있다면)", via: "잃어버린 키를 대신하는 권한" },
] as const;

const STATE_STYLE: Record<PathState, { tag: string; border: string; color: string }> = {
  old: { tag: "기존 키(ECDSA)로 열림", border: "#dc2626", color: "#b91c1c" },
  new: { tag: "ML-DSA 서명 검사", border: "#16a34a", color: "#15803d" },
  review: { tag: "다시 판단할 경로", border: "#d97706", color: "#b45309" },
};

const SCENES = [
  {
    label: "지금의 SimpleAccount",
    summary: "모든 문이 기존 키에 걸림",
    note: "UserOperation 서명 검사는 ECDSA.recover를 쓰고, owner는 execute를 직접 부를 수 있으며 업그레이드도 owner 권한에 연결됩니다. 돈으로 가는 문이 하나가 아닙니다.",
    states: ["old", "old", "old", "old"] as PathState[],
    verdict: "기존 키 하나로 송금 잔액을 움직일 수 있음",
  },
  {
    label: "서명 함수만 교체",
    summary: "한 문만 ML-DSA",
    note: "_validateSignature만 ML-DSA로 바꾸면 UserOperation 경로는 새 서명을 요구합니다. 그래도 owner 직접 실행·업그레이드·복구 경로가 기존 키에 남아 있으면 계정 전체가 양자내성으로 바뀐 것이 아닙니다.",
    states: ["new", "old", "old", "old"] as PathState[],
    verdict: "남은 기존 경로로 여전히 돈을 움직일 수 있음",
  },
  {
    label: "기존 서명이 안전하지 않다면",
    summary: "남은 경로를 모두 다시 판단",
    note: "기존 서명을 더 이상 믿을 수 없는 상황이라면 그 키만으로 실행·업그레이드·복구하는 모든 경로를 다시 판단해야 합니다. 이 그림은 각 경로를 어떻게 바꿀지 정하지 않습니다.",
    states: ["new", "review", "review", "review"] as PathState[],
    verdict: "경로마다 누가 무엇으로 열 수 있는지 다시 정해야 함",
  },
] as const;

export default function AuthorityPathsViz() {
  return (
    <PqSceneShell
      eyebrow="송금 잔액으로 가는 문"
      title="서명 함수 하나를 바꿔도 다른 문은 그대로 남습니다"
      description="왼쪽 줄 하나가 계정의 송금 잔액을 움직이거나 계정 코드를 바꿀 수 있는 경로입니다. 테두리 색과 꼬리표가 그 경로를 여는 권한을 나타냅니다."
      ariaLabel="SimpleAccount에서 송금 잔액으로 이어지는 네 경로가 서명 교체 전후에 어떤 권한으로 열리는지"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-center">
            <ul className="min-w-0 space-y-2">
              {PATHS.map((path, index) => {
                const style = STATE_STYLE[scene.states[index]];
                return (
                  <li
                    key={path.id}
                    className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg border bg-background px-3 py-2"
                    style={{ borderColor: style.border, borderStyle: scene.states[index] === "review" ? "dashed" : "solid" }}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{path.name}</span>
                      <span className="block break-words text-xs text-muted-foreground">{path.via}</span>
                    </span>
                    <span className="text-xs font-bold" style={{ color: style.color }}>{style.tag}</span>
                  </li>
                );
              })}
            </ul>
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-3 text-center">
              <p className="text-sm font-bold">A의 송금 잔액</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">1 ETH</p>
              <p className="mt-2 text-xs leading-5">{scene.verdict}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
