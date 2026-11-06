import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 부채 220 중 외화 몫이 있으면 자국 통화 약세에 같은 외화 원금의 자국 통화 부담이 늘 수 있다.
 * 외화 원금 10, 환율 10 → 12는 이 그림의 가정: 10×10=100, 10×12=120, 120+120=240.
 */
const FX_PRINCIPAL = 10;
const DOMESTIC = 120;
const SCENES = [
  { label: "같은 부채 220", summary: "두 나라 모두 220", rate: 10, note: "자국 통화로 환산하면 두 나라의 부채가 똑같이 220입니다. 한 나라는 그중 외화 원금 10을 환율 10으로 환산한 100이 외화 몫이라고 둡니다(가정)." },
  { label: "자국 통화가 약해지면", summary: "10 × 12 = 120 → 합계 240", rate: 12, note: "환율이 12가 되면(가정) 외화 원금은 그대로 10인데 자국 통화 부담은 120입니다. 다른 조건이 그대로라면 합계는 240이 될 수 있습니다." },
  { label: "그렇다고 자국 통화가 안전하지는 않습니다", summary: "220도 다른 제약을 받음", rate: 12, note: "전액 자국 통화인 나라의 막대가 그대로라고 위험이 없다는 뜻은 아닙니다. 자국 통화 부채도 물가, 금리와 차환 조건의 제약을 받습니다." },
] as const;

const SCALE = 260;

function Segment({ value, color, text }: { value: number; color: string; text: string }) {
  return (
    <div className="flex h-full items-center justify-center overflow-hidden whitespace-nowrap text-[11px] font-bold text-white transition-[width] duration-300 motion-reduce:transition-none sm:text-xs" style={{ width: `${(value / SCALE) * 100}%`, backgroundColor: color }}>
      {text}
    </div>
  );
}

function Country({ name, total, children }: { name: string; total: number; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs sm:text-sm">
        <span className="font-semibold">{name}</span>
        <span className="font-mono font-bold">{total}</span>
      </div>
      <div className="flex h-8 min-w-0 gap-px overflow-hidden rounded-sm bg-muted/40">{children}</div>
    </div>
  );
}

export default function ForeignDebtViz() {
  return (
    <SceneShell
      eyebrow="같은 220, 다른 위험 (가정)"
      title="외화 원금은 그대로인데 자국 통화 부담이 커지는 곱셈"
      description="막대 길이는 자국 통화로 환산한 부채이며 두 나라에 같은 눈금을 씁니다. 외화 원금 10과 환율 10·12는 이 그림의 가정입니다."
      ariaLabel="환율이 10에서 12로 오를 때 외화 몫이 있는 나라의 부채만 220에서 240으로 늘어나는 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fxValue = FX_PRINCIPAL * scene.rate;
        return (
          <div className="min-w-0">
            <div className="mb-4 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 text-center">
              <div className="rounded-lg border border-border px-1 py-2"><span className="block text-xs text-muted-foreground">외화 원금</span><span className="font-mono font-bold">{FX_PRINCIPAL}</span></div>
              <span className="font-bold text-muted-foreground">×</span>
              <div className="rounded-lg border border-border px-1 py-2"><span className="block text-xs text-muted-foreground">환율(외화 1당)</span><span className="font-mono font-bold">{scene.rate}</span></div>
              <span className="font-bold text-muted-foreground">=</span>
              <div className="rounded-lg border border-border px-1 py-2"><span className="block text-xs text-muted-foreground">자국 통화 부담</span><span className="font-mono font-bold">{fxValue}</span></div>
            </div>
            <div className="space-y-3">
              <Country name="외화 몫이 있는 나라" total={fxValue + DOMESTIC}>
                <Segment value={fxValue} color="#d97706" text={`외화 몫 ${fxValue}`} />
                <Segment value={DOMESTIC} color="#64748b" text={`자국 통화 ${DOMESTIC}`} />
              </Country>
              <Country name="전액 자국 통화인 나라" total={220}>
                <Segment value={220} color="#64748b" text="자국 통화 220" />
              </Country>
            </div>
          </div>
        );
      }}
    />
  );
}
