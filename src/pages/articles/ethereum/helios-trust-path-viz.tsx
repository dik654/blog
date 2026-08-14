type Mode = "architecture" | "bootstrap" | "consensus";

const CONTENT: Record<Mode, {
  eyebrow: string;
  title: string;
  stages: readonly { step: string; title: string; detail: string; tone: string }[];
  result: string;
}> = {
  architecture: {
    eyebrow: "한 RPC 응답이 신뢰 가능한 값이 되기까지",
    title: "서버를 믿는 대신 응답을 검증 경로에 묶는다",
    stages: [
      { step: "01", title: "신뢰 시작점", detail: "최근 finalized checkpoint · network 설정", tone: "border-amber-500/50" },
      { step: "02", title: "Consensus 검증", detail: "sync committee가 서명한 beacon header", tone: "border-indigo-500/50" },
      { step: "03", title: "Execution 증명", detail: "header의 state root에 묶인 account · storage proof", tone: "border-sky-500/50" },
    ],
    result: "검증된 block identity와 함께 local JSON-RPC 결과 공개",
  },
  bootstrap: {
    eyebrow: "부트스트랩의 신뢰 전달",
    title: "32-byte checkpoint root에서 검증 가능한 store를 만든다",
    stages: [
      { step: "01", title: "Trusted root", detail: "network · epoch · source provenance를 확인", tone: "border-amber-500/50" },
      { step: "02", title: "Bootstrap 응답", detail: "header · current committee · Merkle branch", tone: "border-indigo-500/50" },
      { step: "03", title: "Root 결속", detail: "header root와 checkpoint, committee와 state root를 대조", tone: "border-sky-500/50" },
    ],
    result: "Finalized header와 current committee를 같은 root 아래 store에 초기화",
  },
  consensus: {
    eyebrow: "Light-client update 검증",
    title: "참여 bit가 고른 공개키로 바로 그 header의 서명을 검증한다",
    stages: [
      { step: "01", title: "Context", detail: "network · fork · signature slot · committee period", tone: "border-amber-500/50" },
      { step: "02", title: "Binding", detail: "participant bits ↔ public keys ↔ signing root", tone: "border-indigo-500/50" },
      { step: "03", title: "Apply", detail: "BLS · branch · relevance 통과 뒤 optimistic/finalized 갱신", tone: "border-sky-500/50" },
    ],
    result: "검증 실패는 기존 store를 유지하고, 성공한 update만 원자적으로 적용",
  },
};

export default function HeliosTrustPathViz({ mode }: { mode: Mode }) {
  const content = CONTENT[mode];
  return (
    <figure data-viz className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6">
      <figcaption className="max-w-3xl">
        <p className="text-xs font-semibold tracking-wide text-primary">{content.eyebrow}</p>
        <p className="mt-1 text-base font-bold leading-6 text-foreground">{content.title}</p>
      </figcaption>
      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-6">
        {content.stages.map((stage, index) => (
          <div key={stage.step} className="contents">
            <section className={`min-w-0 rounded-lg border ${stage.tone} bg-muted/15 p-4`}>
              <div className="flex items-center gap-3">
                <span className="shrink-0 font-mono text-xs font-semibold text-muted-foreground">{stage.step}</span>
                <h3 className="min-w-0 break-words text-sm font-bold leading-5">{stage.title}</h3>
              </div>
              <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">{stage.detail}</p>
            </section>
            {index < content.stages.length - 1 ? (
              <div aria-hidden className="flex h-5 items-center justify-center text-muted-foreground lg:h-auto">
                <span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-emerald-500/50 bg-emerald-500/5 px-4 py-3 text-sm font-semibold leading-6 text-foreground">
        {content.result}
      </div>
    </figure>
  );
}
