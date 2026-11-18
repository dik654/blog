import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설명용 장부 100−30−10=60, 지출 40+20=60.
 * 판매가 70으로 줄고 기업·생산 30과 부채 상환 10이 그대로라면(본문의 가정) 가용 30, 지출 60과의 차이 30.
 * 판매는 30% 줄지만(100→70) 가용 수입은 절반(60→30)이 됩니다: 빠지는 40이 줄지 않기 때문입니다.
 */
const CORP = 30;
const DEBT = 10;
const SERVICES = 40;
const INFRA = 20;
const SPEND = SERVICES + INFRA;

const SCENES = [
  { label: "판매 100", summary: "100 − 30 − 10 = 60 → 남는 돈 0", sale: 100, note: "기업·생산 몫 30과 부채 상환 10을 빼면 정부가 쓸 수 있는 돈은 60입니다. 공공서비스 40과 기반시설 20을 쓰면 장부가 딱 맞고 남는 돈은 0입니다." },
  { label: "판매 70", summary: "70 − 30 − 10 = 30 → 부족 30", sale: 70, note: "판매가 70으로 줄고 기업·생산 30과 부채 10이 그대로라면 가용 수입은 30입니다. 지출 60은 판매 막대 끝(70)을 넘어 100까지 뻗고, 넘친 30이 빨간 점선 칸입니다." },
  { label: "왜 절반이 되나", summary: "판매 −30% → 가용 −50%", sale: 70, note: "판매는 100에서 70으로 30% 줄었지만 가용 수입은 60에서 30으로 절반이 됐습니다. 이 가정에서는 앞에서 빠지는 40이 가격을 따라 줄지 않아 감소분 30이 모두 가용 수입에서 나옵니다. 실제 계약·세율·예산이 아니라 가격 의존을 보는 가정입니다." },
] as const;

function Segment({ width, color, label, dashed = false }: { width: number; color: string; label: string; dashed?: boolean }) {
  if (width <= 0) return null;
  return (
    <div
      className={`flex h-full items-center justify-center overflow-hidden font-mono text-xs font-bold transition-[width] duration-300 motion-reduce:transition-none ${dashed ? "border border-dashed text-red-700 dark:text-red-400" : "text-white"}`}
      style={{ width: `${width}%`, backgroundColor: dashed ? "transparent" : color, borderColor: dashed ? "#dc2626" : undefined }}
    >
      {label}
    </div>
  );
}

const LEGEND = [
  { label: "기업·생산", color: "#64748b" },
  { label: "부채 상환", color: "#d97706" },
  { label: "정부 가용", color: "#2563eb" },
  { label: "공공서비스", color: "#0f766e" },
  { label: "기반시설", color: "#0d9488" },
] as const;

export default function OilShockGapViz() {
  return (
    <SceneShell
      eyebrow="가격 충격"
      title="판매가 30 줄면 정부 가용 수입은 절반이 됩니다"
      description="가로축 하나에 0~100을 놓고, 위 막대는 석유 판매가 나뉘는 몫, 아래 막대는 기존 지출입니다. 지출 막대는 가용 수입이 시작하는 40에서 출발합니다. 3절의 설명용 숫자이며 실제 계약·세율·예산이 아닙니다(가정)."
      ariaLabel="석유 판매 100과 70에서 정부 가용 수입과 기존 지출 60의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const avail = scene.sale - CORP - DEBT;
        const gap = SPEND - avail;
        return (
          <div className="min-w-0">
            <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {LEGEND.map((item) => (
                <li key={item.label} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                  {item.label}
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-semibold">석유 판매 {scene.sale}</p>
                <div className="flex h-7 w-full rounded-sm bg-muted/40">
                  <Segment width={CORP} color="#64748b" label="30" />
                  <Segment width={DEBT} color="#d97706" label="10" />
                  <Segment width={avail} color="#2563eb" label={String(avail)} />
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold">기존 지출 {SPEND}</p>
                <div className="flex h-7 w-full rounded-sm bg-muted/40">
                  <div style={{ width: `${CORP + DEBT}%` }} />
                  <Segment width={SERVICES} color="#0f766e" label="40" />
                  <Segment width={INFRA} color="#0d9488" label="20" />
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold">{gap > 0 ? `부족 ${gap}` : "남는 돈 0"}</p>
                <div className="flex h-7 w-full">
                  <div style={{ width: `${scene.sale}%` }} />
                  <Segment width={gap} color="#dc2626" label={String(gap)} dashed />
                </div>
              </div>
            </div>
            <div className="relative mt-1 h-5 text-[11px] text-muted-foreground">
              {[0, 40, 70, 100].map((tick) => (
                <span key={tick} className="absolute font-mono" style={{ left: `${tick}%`, transform: tick === 0 ? "none" : tick === 100 ? "translateX(-100%)" : "translateX(-50%)" }}>
                  {tick}
                </span>
              ))}
            </div>
            <div className={`mt-3 grid grid-cols-2 gap-2 text-xs ${active === 2 ? "opacity-100" : "opacity-0"}`} aria-hidden={active !== 2}>
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-muted-foreground">석유 판매</span>
                <span className="font-mono font-bold">100 → 70<br />−30%</span>
              </div>
              <div className="rounded-lg border border-primary px-3 py-2">
                <span className="block text-muted-foreground">정부 가용 수입</span>
                <span className="font-mono font-bold text-primary">60 → 30<br />−50%</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
