import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview·#case — 임금 100·장바구니 100에서 다음 해 임금 108·장바구니 114.
 * 실질임금 지수 108÷114×100≈94.7(약 5.3% 감소). 고정 빚 100의 실질가치 100÷1.14≈87.7.
 * 세 줄은 같은 축척(0~120)을 씁니다.
 */
const SCALE = 120;

const SCENES = [
  {
    label: "기준연도",
    summary: "월급 100 · 장바구니 100",
    rows: [
      { name: "장바구니 가격", value: 100 },
      { name: "월급(명목)", value: 100 },
      { name: "기준연도 장바구니로 센 월급", value: 100 },
    ],
    note: "기준연도에는 월급 100으로 장바구니 하나를 꼭 맞게 삽니다. 이때의 구매력을 100으로 둡니다. 숫자는 설명용 가정입니다.",
  },
  {
    label: "다음 해, 둘 다 오릅니다",
    summary: "월급 108 · 장바구니 114",
    rows: [
      { name: "장바구니 가격", value: 114 },
      { name: "월급(명목)", value: 108 },
      { name: "기준연도 장바구니로 센 월급", value: null },
    ],
    note: "명목임금은 8% 올랐습니다. 명목은 돈에 적힌 금액 그대로라는 뜻입니다. 그런데 같은 장바구니가 114가 되어 월급 막대가 장바구니 막대에 6만큼 못 미칩니다.",
  },
  {
    label: "살 수 있는 양으로 바꿉니다",
    summary: "108÷114×100 ≈ 94.7",
    rows: [
      { name: "장바구니 가격", value: 114 },
      { name: "월급(명목)", value: 108 },
      { name: "기준연도 장바구니로 센 월급", value: 94.7 },
    ],
    note: "월급 108을 새 장바구니 114로 나누면 0.947, 곧 기준연도 장바구니의 약 94.7%를 삽니다. 이것이 실질임금 지수입니다. 월급이 8 늘었어도 구매력은 약 5.3% 줄었습니다.",
  },
  {
    label: "고정금리 빚 100은 반대로 움직입니다",
    summary: "100÷1.14 ≈ 87.7",
    rows: [
      { name: "장바구니 가격", value: 114 },
      { name: "고정금리 빚(명목)", value: 100 },
      { name: "기준연도 장바구니로 센 빚", value: 87.7 },
    ],
    note: "갚을 금액 100은 그대로인데 물가가 1.14배가 되어, 새 물가에서 100으로 살 수 있는 양은 기준연도 장바구니의 약 87.7%입니다(100÷1.14). 세금·품목별 물가·이자와 계약 갱신을 뺀 설명용 가정이며, 인플레이션이 채무자 모두에게 이롭다는 결론이 아닙니다.",
  },
] as const;

const COLORS = ["#64748b", "#2563eb", "#16a34a"] as const;

function Bar({ name, value, color, strong }: { name: string; value: number | null; color: string; strong: boolean }) {
  const width = value === null ? 0 : (value / SCALE) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={strong ? "font-semibold" : "text-muted-foreground"}>{name}</span>
        <span className="font-mono font-bold">{value === null ? "?" : value}</span>
      </div>
      <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${width}%`, backgroundColor: color, opacity: 0.75 }} />
        <div className="absolute inset-y-[-3px] border-l border-dashed border-foreground/60" style={{ left: `${(100 / SCALE) * 100}%` }} aria-hidden />
      </div>
    </div>
  );
}

export default function PurchasingPowerViz() {
  return (
    <SceneShell
      eyebrow="명목과 실질"
      title="월급 108로 장바구니 114의 얼마를 살 수 있나"
      description="세 막대는 같은 눈금입니다. 점선은 기준연도의 100입니다. 숫자는 이 글의 설명용 가정입니다."
      ariaLabel="명목임금 108과 장바구니 114로 실질임금 94.7을, 고정 빚 100으로 실질가치 87.7을 계산하는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          {SCENES[active].rows.map((row, index) => (
            <Bar key={index} name={row.name} value={row.value} color={COLORS[index]} strong={index === 2} />
          ))}
          <div className="relative h-4 text-xs text-muted-foreground" aria-hidden>
            <span className="absolute left-0">0</span>
            <span className="absolute -translate-x-1/2" style={{ left: `${(100 / SCALE) * 100}%` }}>100</span>
          </div>
        </div>
      )}
    />
  );
}
