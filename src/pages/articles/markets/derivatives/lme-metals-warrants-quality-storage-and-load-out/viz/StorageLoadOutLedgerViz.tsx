import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 둘째 문단 — 보관료는 날마다 쌓이고(톤당 하루 0.50달러), 출고비는 꺼낼 때 한 번 붙는다(톤당 50달러). 모두 가정 요율.
 * 칸 하나 = 하루 보관료 0.50×25.3 = 12.65달러. 본문 numericCase의 계산식($0.50×25.3×20, $50×25.3)을 그대로 따른다.
 * 10일 126.5 · 20일 253 · 출고 1,265 · 합계 1,518.
 */
const RATE_PER_TON_DAY = 0.5;
const TONS = 25.3;
const DAILY = RATE_PER_TON_DAY * TONS;
const LOAD_OUT = 50 * TONS;
const DAYS = 20;
const SCALE = 1518;
const DAY_SLOTS = Array.from({ length: DAYS }, (_, index) => index + 1);

const SCENES = [
  { label: "하루째", days: 1, loadOut: false, summary: "0.50 × 25.3 = 12.65달러", note: "워런트가 살아 있는 동안 보관료가 날마다 붙습니다. 가정 요율 톤당 하루 0.50달러에 실제 로트 25.3톤을 곱하면 칸 하나가 12.65달러입니다." },
  { label: "10일째", days: 10, loadOut: false, summary: "12.65 × 10 = 126.5달러", note: "아무것도 움직이지 않아도 칸이 하루에 하나씩 찹니다. 열흘이면 126.5달러입니다." },
  { label: "20일째", days: 20, loadOut: false, summary: "12.65 × 20 = 253달러", note: "20일이 지나면 보관료는 253달러입니다. 권리를 오래 둘수록 이 줄은 계속 길어집니다." },
  { label: "출고하는 날", days: 20, loadOut: true, summary: "253 + 1,265 = 1,518달러", note: "출고비는 날수와 상관없이 꺼낼 때 한 번 붙습니다. 톤당 50달러 × 25.3톤 = 1,265달러를 더해 1,518달러입니다. 요율은 거래소의 현재 요금이 아닌 가정입니다." },
] as const;

const STORAGE = "#d97706";
const LOAD = "#2563eb";
const TOTAL = "#334155";

function Bar({ label, value, color, strong = false }: { label: string; value: number; color: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_4rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / SCALE) * 100}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value.toLocaleString("en-US")}</span>
    </div>
  );
}

export default function StorageLoadOutLedgerViz() {
  return (
    <SceneShell
      eyebrow="보관료와 출고비"
      title="보관료는 날마다 쌓이고 출고비는 한 번 붙습니다"
      description="칸 하나가 하루치 보관료입니다. 아래 막대는 달러이며 길이는 1,518달러를 끝으로 잡았습니다. 요율 0.50달러·50달러는 본문의 가정이고, 계산은 실제 로트 25.3톤을 곱합니다."
      ariaLabel="20일 동안 하루 12.65달러씩 쌓이는 보관료 253달러와 출고비 1,265달러가 합쳐 1,518달러가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const storage = DAILY * scene.days;
        const loadOut = scene.loadOut ? LOAD_OUT : 0;
        return (
          <div className="min-w-0">
            <p className="mb-1 text-xs text-muted-foreground">보관 날수 20칸 · 칸 하나 = 하루 12.65달러</p>
            <div className="grid grid-cols-10 gap-1 sm:grid-cols-20">
              {DAY_SLOTS.map((day) => (
                <div
                  key={day}
                  className="h-5 rounded-sm border transition-colors duration-300 motion-reduce:transition-none"
                  style={{ backgroundColor: day <= scene.days ? STORAGE : "transparent", borderColor: day <= scene.days ? STORAGE : "#cbd5e1" }}
                  aria-hidden
                />
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <Bar label="보관료" value={storage} color={STORAGE} />
              <Bar label="출고비" value={loadOut} color={LOAD} />
              <Bar label="합계" value={storage + loadOut} color={TOTAL} strong />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">금속가치 7만840달러(가정)와는 별도 장부에 적습니다.</p>
          </div>
        );
      }}
    />
  );
}
