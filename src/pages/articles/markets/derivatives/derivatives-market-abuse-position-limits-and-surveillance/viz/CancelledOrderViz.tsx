import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box 둘째 문단 + #limits — 큰 주문을 냈다가 취소한 같은 기록이 두 가지 이야기로 읽힐 수 있다.
 * 주문행위 장부: 체결 의사, 취소 시점, 가격과 수량, 반복 패턴, 다른 계좌의 이익.
 * 판정 자료(10절): 전체 주문 순서, 계좌 관계, 통신, 현물 노출. 알고리즘은 의도를 직접 읽지 못한다.
 */
const SCENES = [
  { label: "기록에 남는 것", summary: "큰 주문 → 호가에 머묾 → 취소", note: "주문 기록은 언제 어떤 가격과 수량으로 냈고 언제 취소했는지를 보여 줍니다. 이 줄만 보고는 주문을 낸 사람이 체결할 생각이었는지 알 수 없습니다." },
  { label: "읽기 1: 체결할 생각이 있었다", summary: "취소만으로 스푸핑 확정 아님", note: "체결할 생각으로 낸 주문도 취소될 수 있습니다. 시장 충격 때 유동성을 공급한 주문도 평소와 다른 패턴을 보일 수 있다고 10절은 적습니다." },
  { label: "읽기 2: 처음부터 체결 의사가 없었다", summary: "잘못된 시세 신호 → 문제", note: "처음부터 체결할 생각 없이 시세에 잘못된 신호를 주려고 낸 주문이라면 문제가 됩니다. 그래서 주문행위 장부는 반복 패턴과 다른 계좌의 이익까지 함께 봅니다." },
  { label: "둘을 가르는 자료", summary: "주문 순서 · 계좌 관계 · 통신 · 현물 노출", note: "알고리즘은 취소율이나 가격 영향이 큰 거래를 빠르게 찾지만 의도를 직접 읽지는 못합니다. 판정에는 전체 주문 순서, 계좌 관계, 통신과 현물 노출을 함께 봅니다." },
] as const;

const STEPS = [
  { name: "주문 생성", sub: "가격·수량" },
  { name: "호가에 머묾", sub: "취소 전까지" },
  { name: "취소", sub: "취소 시점" },
] as const;

const READINGS = [
  { title: "읽기 1", body: "체결할 생각으로 냈지만 나중에 취소했다", verdict: "취소만으로 스푸핑 확정 아님" },
  { title: "읽기 2", body: "처음부터 체결 의사 없이 시세에 신호만 주려 했다", verdict: "문제가 됨" },
] as const;

const EVIDENCE = ["전체 주문 순서", "계좌 관계", "통신 기록", "현물 노출"] as const;

export default function CancelledOrderViz() {
  return (
    <SceneShell
      eyebrow="주문행위 장부"
      title="같은 취소 기록이 두 가지로 읽힐 수 있습니다"
      description="스푸핑은 체결할 생각 없이 낸 주문으로 시세에 잘못된 신호를 주는 행위입니다. 위 줄은 기록이 보여 주는 사실이고, 아래 두 칸은 그 기록을 설명할 수 있는 서로 다른 의도입니다."
      ariaLabel="큰 주문을 냈다가 취소한 기록이 체결 의사가 있었던 경우와 처음부터 체결 의사가 없었던 경우로 갈리고, 주문 순서·계좌 관계·통신·현물 노출로 가린다는 흐름"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <ol className="grid grid-cols-3 gap-2">
            {STEPS.map((step, index) => (
              <li key={step.name} className={`relative rounded-lg border px-2 py-2 text-center text-xs leading-5 ${active === 0 ? "border-primary/60 bg-background" : "border-border/60"}`}>
                <span className="block font-mono text-[11px] text-muted-foreground">{index + 1}</span>
                <span className="block font-semibold">{step.name}</span>
                <span className="block text-muted-foreground">{step.sub}</span>
              </li>
            ))}
          </ol>
          <div className="grid grid-cols-2 gap-2">
            {READINGS.map((reading, index) => {
              const on = active === index + 1;
              const color = index === 0 ? "#2563eb" : "#dc2626";
              return (
                <div
                  key={reading.title}
                  className={`rounded-lg border px-3 py-2 text-xs leading-5 ${on ? "bg-background" : "border-dashed border-border/60"} ${active === 0 || on ? "" : "opacity-50"}`}
                  style={on ? { borderColor: color } : undefined}
                >
                  <span className="block font-mono font-bold" style={{ color }}>{reading.title}{active === 0 ? " ?" : ""}</span>
                  <span className="block">{reading.body}</span>
                  <span className="mt-1 block font-semibold" style={{ color }}>{reading.verdict}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {EVIDENCE.map((item) => (
              <span key={item} className={`rounded-md border px-2 py-1.5 text-center text-xs leading-5 ${active === 3 ? "border-primary/60 font-semibold" : "border-border/50 text-muted-foreground/60"}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    />
  );
}
