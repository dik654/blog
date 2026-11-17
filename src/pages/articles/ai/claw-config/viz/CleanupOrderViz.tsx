import ClawSceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #bootstrap "부분 초기화에는 역순 cleanup이 필요하다" — MCP process를 시작한 뒤 provider 인증이
 * 실패하면 이미 열린 child process, socket, 임시 callback server를 닫는다. 각 initializer가 cleanup handle을
 * 반환하고 실패 시 생성의 역순으로 정리한다. 세 자원의 생성 순서는 그림을 위한 가정이다.
 */
const RESOURCES = ["MCP child process", "socket", "임시 callback server"] as const;

const SCENES = [
  {
    label: "MCP child process를 시작하고 handle을 받습니다",
    summary: "handle 1개",
    note: "initializer는 자원을 만들면서 그 자원을 닫는 방법(cleanup handle)을 함께 돌려줍니다. 받은 handle은 더미 맨 위에 쌓습니다.",
  },
  {
    label: "socket을 엽니다",
    summary: "handle 2개",
    note: "두 번째 handle이 첫 handle 위에 쌓입니다. 더미의 위아래 순서가 곧 생성 순서의 기록입니다.",
  },
  {
    label: "임시 callback server를 띄웁니다",
    summary: "handle 3개",
    note: "아직 runtime은 Ready가 아닙니다. 지금 실패하면 세 자원이 모두 열린 채 남습니다.",
  },
  {
    label: "provider 인증이 실패합니다",
    summary: "초기화 중단",
    note: "실패나 cancellation이 오면 더 만들지 않고 정리로 넘어갑니다. 이때 credential과 callback code는 진단 로그에 남기지 않습니다.",
  },
  {
    label: "만든 역순으로 닫습니다",
    summary: "server → socket → process",
    note: "더미 맨 위 handle부터 꺼내 실행하면 생성의 역순이 됩니다. 각 initializer가 handle을 반환해 두었기 때문에 이미 열린 자원을 handle로 찾아 닫을 수 있고, 그만큼 누락을 줄일 수 있습니다.",
  },
] as const;

export default function CleanupOrderViz() {
  return (
    <ClawSceneShell
      eyebrow="Partial initialization"
      title="부분 초기화가 실패하면 쌓인 handle을 위에서부터 꺼내 닫습니다"
      description="hardening된 실행기를 가정한 그림입니다. 세 자원을 만드는 순서는 설명을 위한 가정입니다."
      ariaLabel="MCP process, socket, callback server를 만든 뒤 provider 인증 실패로 역순 정리하는 과정"
      scenes={SCENES}
      render={(active) => {
        const created = Math.min(active + 1, RESOURCES.length);
        const failed = active >= 3;
        const cleaning = active === 4;
        const stack = RESOURCES.slice(0, created).map((name, index) => ({ name, order: index + 1 })).reverse();
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted-foreground">시간 순서</p>
              <ol className="mt-2 space-y-2">
                {RESOURCES.map((name, index) => {
                  const made = index < created;
                  const closeOrder = RESOURCES.length - index;
                  return (
                    <li
                      key={name}
                      className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ${
                        !made ? "border-dashed border-border/60 text-muted-foreground/60" : cleaning ? "border-border bg-muted/40 text-muted-foreground" : "border-blue-600/50 bg-blue-500/5"
                      }`}
                    >
                      <span className={`min-w-0 ${made && cleaning ? "line-through" : ""}`}>{index + 1}. {name}</span>
                      <span className="shrink-0 font-mono text-xs">
                        {!made ? "대기" : cleaning ? `닫기 ${closeOrder}번째` : "열림"}
                      </span>
                    </li>
                  );
                })}
                <li
                  className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ${
                    failed ? "border-red-600 bg-red-500/5 font-semibold text-red-700 dark:text-red-400" : "border-dashed border-border/60 text-muted-foreground/60"
                  }`}
                >
                  <span>4. provider 인증</span>
                  <span className="shrink-0 font-mono text-xs">{failed ? "실패" : "대기"}</span>
                </li>
              </ol>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted-foreground">cleanup handle 더미 · 맨 위가 마지막</p>
              <div className="mt-2 flex min-h-[8rem] flex-col justify-end gap-1.5 rounded-lg border border-border/70 bg-background p-2">
                {stack.map((item, position) => (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between gap-2 rounded-md border px-3 py-1.5 text-xs ${
                      cleaning ? "border-red-600/60 text-red-700 dark:text-red-400" : "border-border bg-muted/30"
                    }`}
                  >
                    <span className="min-w-0">close({item.name})</span>
                    <span className="shrink-0 font-mono font-bold">{cleaning ? `${position + 1}번째` : `#${item.order}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
