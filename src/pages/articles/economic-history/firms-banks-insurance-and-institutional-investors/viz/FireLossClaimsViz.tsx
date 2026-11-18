import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 조달 30+60+10=100, 화재 −40, 보험 +30 → 자산 90(순손실 10).
 * 대출 60의 청구권은 자동으로 줄지 않으므로 90에서 60을 먼저 갚으면 주주에게 30.
 * 이자·감가상각·세금·보험 자기부담은 뺀 설명용 사례. 축 0~100.
 */
const SCALE = 100;

interface Seg {
  name: string;
  value: number;
  color: string;
  dashed?: boolean;
}

const SCENES = [
  {
    label: "조달: 100을 세 곳에서",
    summary: "30 + 60 + 10 = 100",
    asset: [{ name: "공장 자산", value: 100, color: "#64748b" }],
    claim: [
      { name: "은행대출(5년)", value: 60, color: "#d97706" },
      { name: "주식", value: 30, color: "#2563eb" },
      { name: "유보금(기존 이익)", value: 10, color: "#0891b2" },
    ],
    claimTitle: "돈을 댄 곳",
    note: "기계와 건물에 쓸 100을 주식 30·5년 대출 60·기존 이익 10으로 채웁니다.",
  },
  {
    label: "화재로 자산 40을 잃음",
    summary: "100 − 40 = 60",
    asset: [
      { name: "남은 자산", value: 60, color: "#64748b" },
      { name: "화재 손실", value: 40, color: "#dc2626", dashed: true },
    ],
    claim: [{ name: "은행대출 청구권", value: 60, color: "#d97706" }],
    claimTitle: "은행이 받을 몫",
    note: "자산 40이 불에 타도 은행대출 60의 청구권은 자동으로 줄지 않습니다.",
  },
  {
    label: "보험이 30을 지급",
    summary: "60 + 30 = 90 · 순손실 10",
    asset: [
      { name: "남은 자산", value: 60, color: "#64748b" },
      { name: "보험금", value: 30, color: "#16a34a" },
      { name: "순손실", value: 10, color: "#dc2626", dashed: true },
    ],
    claim: [{ name: "은행대출 청구권", value: 60, color: "#d97706" }],
    claimTitle: "은행이 받을 몫",
    note: "손실 40 가운데 계약상 30을 보험이 지급해 자산은 90, 순손실은 10입니다.",
  },
  {
    label: "90을 누가 먼저 받나",
    summary: "90 − 60 = 주주 몫 30",
    asset: [
      { name: "남은 자산", value: 60, color: "#64748b" },
      { name: "보험금", value: 30, color: "#16a34a" },
      { name: "순손실", value: 10, color: "#dc2626", dashed: true },
    ],
    claim: [
      { name: "① 대출 상환", value: 60, color: "#d97706" },
      { name: "② 주주에게 남는 가치", value: 30, color: "#2563eb" },
    ],
    claimTitle: "90을 나누는 순서",
    note: "90에서 대출 60을 먼저 갚는다고 단순화하면 주주에게 30이 남습니다. 이자·감가상각·세금·자기부담은 뺐습니다.",
  },
] as const;

function Bar({ title, segs }: { title: string; segs: readonly Seg[] }) {
  const starts = segs.map((_, index) => segs.slice(0, index).reduce<number>((acc, seg) => acc + seg.value, 0));
  return (
    <div className="min-w-0">
      <div className="text-xs font-semibold sm:text-sm">{title}</div>
      <div className="relative mt-1 h-7 min-w-0 rounded-sm bg-muted/30">
        {segs.map((seg, index) => (
          <div
            key={seg.name}
            className={`absolute inset-y-0 flex items-center justify-center border font-mono text-[11px] font-bold sm:text-xs ${seg.dashed ? "border-dashed" : "border-background text-white"}`}
            style={{
              left: `${(starts[index] / SCALE) * 100}%`,
              width: `${(seg.value / SCALE) * 100}%`,
              backgroundColor: seg.dashed ? "transparent" : seg.color,
              borderColor: seg.dashed ? seg.color : undefined,
              color: seg.dashed ? seg.color : undefined,
            }}
          >
            {seg.dashed ? `−${seg.value}` : seg.value}
          </div>
        ))}
      </div>
      <ul className="mt-1.5 flex min-h-[2.5rem] flex-wrap content-start gap-x-3 gap-y-0.5 text-[11px] leading-5 sm:text-xs">
        {segs.map((seg) => (
          <li key={seg.name} className="flex items-center gap-1 text-muted-foreground">
            <span className={`inline-block h-2.5 w-2.5 rounded-sm ${seg.dashed ? "border border-dashed" : ""}`} style={{ backgroundColor: seg.dashed ? "transparent" : seg.color, borderColor: seg.color }} />
            {seg.name} {seg.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FireLossClaimsViz() {
  return (
    <SceneShell
      eyebrow="조달 장부와 사고 장부"
      title="보험이 메운 뒤에도 대출 60은 먼저 갚습니다"
      description="두 막대는 같은 눈금(0~100)입니다. 위는 회사가 가진 자산, 아래는 그 자산에 누가 무엇을 청구하는지입니다. 숫자는 모두 3절의 설명용 가정입니다."
      ariaLabel="주식 30·대출 60·기존 이익 10으로 조달한 자산 100이 화재 손실 40과 보험금 30 뒤 90이 되고 대출 60을 먼저 갚아 주주 몫 30이 남는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <Bar title="회사가 가진 자산" segs={scene.asset} />
            <Bar title={scene.claimTitle} segs={scene.claim} />
            <div className="relative h-4 text-[11px] text-muted-foreground">
              {[0, 30, 60, 90].map((tick) => (
                <span key={tick} className={`absolute font-mono ${tick === 0 ? "" : "-translate-x-1/2"}`} style={{ left: `${tick}%` }}>{tick}</span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
