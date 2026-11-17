import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sharing-cookie-controls 둘째·셋째 문단 — 로그인 유지 같은 필수 저장과
 * analytics·맞춤형 광고를 분리하고, 선택 전 불필요한 tracker가 전송되지 않는지 browser trace로 본다.
 * Release에서 accept·reject·withdraw receipt를 replay하며, backend도 같은 선택을 적용해야 한다.
 * 실패 주입 표: reject 뒤 광고 SDK 전송(C=0 → P=0), 철회 UI만 있고 backend 계속 처리(parity 실패).
 */
type Cell = { mark: string; text: string; tone: "ok" | "off" | "fail" };
type Column = "essential" | "analytics" | "ads";

const COLUMNS: readonly { id: Column; title: string; sub: string }[] = [
  { id: "essential", title: "로그인 유지", sub: "필수 저장" },
  { id: "analytics", title: "analytics SDK", sub: "선택 목적" },
  { id: "ads", title: "맞춤형 광고 cookie·SDK", sub: "선택 목적" },
];

const SCENES = [
  {
    label: "선택 전 첫 화면",
    summary: "필수 저장만",
    browser: {
      essential: { mark: "○", text: "저장", tone: "ok" },
      analytics: { mark: "–", text: "전송 없어야 함", tone: "off" },
      ads: { mark: "–", text: "전송 없어야 함", tone: "off" },
    },
    backend: null,
    note: "이용자가 아직 고르지 않았다면 로그인 유지 같은 필수 저장만 있어야 합니다. Browser trace(브라우저가 실제로 보낸 네트워크 요청 기록)에 analytics나 광고 목적지가 이미 찍혀 있으면 선택보다 전송이 먼저 일어난 것입니다.",
  },
  {
    label: "accept",
    summary: "두 선택 목적 모두 수락(가정)",
    browser: {
      essential: { mark: "○", text: "저장", tone: "ok" },
      analytics: { mark: "○", text: "전송 허용", tone: "ok" },
      ads: { mark: "○", text: "전송 허용", tone: "ok" },
    },
    backend: null,
    note: "두 목적을 모두 수락했다고 가정한 경우입니다. 이때부터 전송이 허용되고, consent receipt에 purpose version·선택·시각·UI version이 남습니다.",
  },
  {
    label: "reject",
    summary: "광고 전송이 찍히면 실패",
    browser: {
      essential: { mark: "○", text: "저장", tone: "ok" },
      analytics: { mark: "–", text: "전송 없어야 함", tone: "off" },
      ads: { mark: "✕", text: "보이면 실패", tone: "fail" },
    },
    backend: null,
    note: "거절했는데 광고 SDK가 호출되면 처리방침 문구가 정확해도 선택이 실제로 지켜졌는지를 뜻하는 선택 enforcement C가 0이고, 뒤의 release 식(P=I∧N∧C∧E)에서 공개 승인 P도 0이 됩니다. 배포를 되돌리고 새 network trace를 만듭니다.",
  },
  {
    label: "withdraw",
    summary: "UI와 backend 둘 다 멈춰야",
    browser: {
      essential: { mark: "○", text: "저장", tone: "ok" },
      analytics: { mark: "–", text: "이후 전송 중단", tone: "off" },
      ads: { mark: "–", text: "이후 전송 중단", tone: "off" },
    },
    backend: { mark: "✕", text: "계속 처리하면 parity 실패", tone: "fail" },
    note: "철회 화면만 바뀌고 서버 쪽(backend)이 그 목적의 처리를 계속하면 공시와 실제 처리가 어긋납니다(parity 실패). 브라우저 trace와 backend의 중단 receipt를 같은 purpose ID로 함께 확인합니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  browser: Record<Column, Cell>;
  backend: Cell | null;
  note: string;
}[];

const TONE: Record<Cell["tone"], string> = {
  ok: "border-border bg-background",
  off: "border-dashed border-border bg-muted/30 text-muted-foreground",
  fail: "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

function CellBox({ cell }: { cell: Cell }) {
  return (
    <div className={`flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center rounded-lg border px-1.5 py-2 text-center ${TONE[cell.tone]}`}>
      <span className="font-mono text-base font-bold leading-5" aria-hidden>
        {cell.mark}
      </span>
      <span className="break-keep text-[11px] font-semibold leading-4 sm:text-xs">{cell.text}</span>
    </div>
  );
}

export default function ConsentNetworkViz() {
  return (
    <SceneShell
      eyebrow="선택과 실제 전송"
      title="화면의 선택이 브라우저 전송과 서버 처리에서 똑같이 지켜지는지 봅니다"
      description="열 하나가 저장·전송 목적지 하나입니다. ○는 허용, –는 전송이 없어야 하는 칸(찍히면 그 자체로 실패), ✕는 그 장면에서 실패 사례로 짚는 칸입니다. 채용 서비스 예의 세 목적지만 그렸습니다."
      ariaLabel="선택 전, accept, reject, withdraw에서 로그인 유지, analytics SDK, 맞춤형 광고 cookie의 전송 허용 여부와 backend 처리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid min-w-0 grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] gap-1.5 sm:grid-cols-[5rem_repeat(3,minmax(0,1fr))] sm:gap-2">
              <span />
              {COLUMNS.map((column) => (
                <div key={column.id} className="min-w-0 text-center">
                  <p className="break-keep text-[11px] font-bold leading-4 sm:text-xs">{column.title}</p>
                  <p className="text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{column.sub}</p>
                </div>
              ))}
              <span className="flex items-center text-[11px] font-semibold text-muted-foreground sm:text-xs">브라우저</span>
              {COLUMNS.map((column) => (
                <CellBox key={column.id} cell={scene.browser[column.id]} />
              ))}
              <span className="flex items-center text-[11px] font-semibold text-muted-foreground sm:text-xs">backend</span>
              <div className="col-span-3 min-w-0">
                {scene.backend ? (
                  <CellBox cell={scene.backend} />
                ) : (
                  <div className="flex min-h-[3.25rem] items-center justify-center rounded-lg border border-dashed border-border/50 px-2 text-center text-[11px] text-muted-foreground sm:text-xs">
                    브라우저와 같은 선택을 적용
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
