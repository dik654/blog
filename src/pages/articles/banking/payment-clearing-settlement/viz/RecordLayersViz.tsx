import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #three-layers — 같은 여섯 지시가 접수 확인, 차이 계산, 계정 처리에서 서로 다른 기록을 남긴다.
 * 고객 화면은 별도 기록이며 표시 시점은 서비스 규칙에 달렸다.
 */
const SCENES: readonly ShellScene[] = [
  { label: "지시를 확인합니다", summary: "여섯 지시 접수", note: "잘못된 지시는 거절할 수 있습니다. 접수 응답과 수락 판단은 다른 메시지일 수 있습니다." },
  { label: "차이를 계산합니다", summary: "A−10 · B 0 · C+10", note: "이 표는 결제할 의무를 설명합니다. 자금이 이미 넘어갔다는 증거는 아닙니다." },
  { label: "계정에서 처리합니다", summary: "계정 처리 + 최종성 조건", note: "정해진 계정에서 처리되고, 규칙과 법적 근거에 따라 이행이 확정되는 최종성 조건까지 충족했는지 봅니다." },
  { label: "고객 화면은 따로 봅니다", summary: "서비스 규칙에 달림", note: "잔액을 기관 결제 전에 보일지 뒤에 보일지는 그 서비스의 규칙에 달렸으므로 한 순서를 모든 송금에 적용할 수 없습니다." },
];

const LAYERS = [
  { name: "지시 기록", shows: "어떤 지시를 받았는가" },
  { name: "대조·계산 기록", shows: "누가 얼마를 결제할 의무인가" },
  { name: "계정 기록", shows: "계정에서 처리됐는가" },
];

export default function RecordLayersViz() {
  return (
    <SceneShell
      eyebrow="기록의 층"
      title="같은 여섯 지시가 층마다 다른 기록을 남깁니다"
      description="단위는 억 원이며, 점선 칸은 위 세 층과 별도인 고객 화면입니다."
      ariaLabel="지시 기록, 대조 계산 기록, 계정 기록과 별도의 고객 화면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          {LAYERS.map((layer, index) => {
            const reached = index <= active;
            const current = index === active;
            return (
              <div
                key={layer.name}
                className={`grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-2 rounded-lg border px-3 py-1 ${current ? "border-primary bg-primary/5" : "border-border bg-background"}`}
              >
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${reached ? "" : "text-muted-foreground/60"}`}>{layer.name}</p>
                  <p className={`text-xs leading-5 ${reached ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{layer.shows}</p>
                </div>
                <span className={`text-right text-xs font-semibold ${current ? "text-primary" : reached ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                  {active === 3 ? "별개" : current ? "지금" : reached ? "지남" : "아직"}
                </span>
              </div>
            );
          })}
          <div className={`mt-2 rounded-lg border border-dashed px-3 py-2 ${active === 3 ? "border-primary bg-primary/5" : "border-border"}`}>
            <p className={`text-sm font-semibold ${active === 3 ? "" : "text-muted-foreground/60"}`}>고객 화면의 이용 가능 잔액</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs leading-5">
              <span className={`rounded border px-2 py-0.5 ${active === 3 ? "border-border bg-background" : "border-border/40 text-muted-foreground/50"}`}>기관 결제 전 표시</span>
              <span className={`rounded border px-2 py-0.5 ${active === 3 ? "border-border bg-background" : "border-border/40 text-muted-foreground/50"}`}>기관 결제 뒤 표시</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
