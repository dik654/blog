import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 손상된 채권 등급은 투표한 채권자 기준 허용 청구액의 3분의 2 이상과 인원 과반의 동의를 받아야 수락.
 * 가정한 등급: 청구 50을 A 34, B·C·D·E 각 4가 나눠 가짐(34 + 16 = 50).
 * A만 찬성: 금액 34/50 = 68% ≥ 66.7%, 인원 1/5 = 20% → 불수락.
 * B~E 찬성: 금액 16/50 = 32%, 인원 4/5 = 80% → 불수락.
 * A·B·C 찬성: 금액 42/50 = 84%, 인원 3/5 = 60% → 수락.
 */
const CREDITORS = [
  { name: "A", amount: 34 },
  { name: "B", amount: 4 },
  { name: "C", amount: 4 },
  { name: "D", amount: 4 },
  { name: "E", amount: 4 },
] as const;

const TOTAL = CREDITORS.reduce<number>((sum, c) => sum + c.amount, 0);
const COUNT = CREDITORS.length;

const SCENES = [
  { label: "큰 채권자 하나만 찬성", summary: "금액 통과 · 인원 미달 → 불수락", yes: ["A"], note: "A 혼자 34를 가져 금액은 34÷50=68%로 3분의 2(약 66.7%)를 넘습니다. 그러나 다섯 명 중 한 명이라 인원 과반에 못 미쳐, 이 등급은 수락한 것으로 보지 않습니다." },
  { label: "작은 채권자 넷이 찬성", summary: "인원 통과 · 금액 미달 → 불수락", yes: ["B", "C", "D", "E"], note: "다섯 명 중 넷이라 인원은 과반을 넘지만, 금액은 16÷50=32%로 3분의 2에 한참 못 미칩니다. 머릿수만으로는 수락이 되지 않습니다." },
  { label: "둘 다 넘을 때", summary: "금액 84% · 인원 60% → 수락", yes: ["A", "B", "C"], note: "A·B·C가 찬성하면 금액 42÷50=84%, 인원 3÷5=60%로 두 문턱을 모두 넘어 수락입니다. 다만 수락 문턱을 넘었다고 회수율이 정해지지는 않습니다." },
] as const;

function Gauge({ label, ratio, threshold, thresholdLabel, valueText }: { label: string; ratio: number; threshold: number; thresholdLabel: string; valueText: string }) {
  const pass = threshold === 0.5 ? ratio > threshold : ratio >= threshold;
  return (
    <div>
      <div className="mb-1 flex flex-wrap justify-between gap-x-2 text-xs sm:text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-mono">
          {valueText} · <span className={pass ? "font-bold text-green-700 dark:text-green-400" : "font-bold text-red-700 dark:text-red-400"}>{pass ? "통과" : "미달"}</span>
        </span>
      </div>
      <div className="relative h-5 w-full rounded-md bg-muted/40">
        <div className="absolute inset-y-0 left-0 rounded-md transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${ratio * 100}%`, backgroundColor: pass ? "#16a34a" : "#94a3b8" }} />
        <div className="absolute -inset-y-1 w-px bg-[#0f172a] dark:bg-[#e2e8f0]" style={{ left: `${threshold * 100}%` }} />
      </div>
      <div className="relative mt-1 h-4">
        <span className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] leading-4 text-muted-foreground sm:text-xs" style={{ left: `${threshold * 100}%` }}>
          ↑ {thresholdLabel}
        </span>
      </div>
    </div>
  );
}

export default function VoteThresholdViz() {
  return (
    <SceneShell
      eyebrow="수락 문턱"
      title="금액 3분의 2와 인원 과반, 둘 중 하나만 넘으면 수락이 아닙니다"
      description="손상된 채권 등급은 계획이 원래 지급 조건을 바꾸는 등급입니다. 칸 하나가 채권자 한 명이고 칸 너비가 허용 청구액입니다. 다섯 명이 50을 34·4·4·4·4로 나눠 갖고 모두 찬성 또는 반대로 투표한 등급은 설명용 가정입니다."
      ariaLabel="가정한 채권자 다섯 명의 찬성 조합별로 금액 3분의 2와 인원 과반 문턱 통과 여부"
      scenes={SCENES}
      render={(active) => {
        const yes = new Set<string>(SCENES[active].yes);
        const yesAmount = CREDITORS.filter((c) => yes.has(c.name)).reduce<number>((sum, c) => sum + c.amount, 0);
        const yesCount = CREDITORS.filter((c) => yes.has(c.name)).length;
        return (
          <div className="min-w-0 space-y-4">
            <div className="flex h-14 w-full gap-1">
              {CREDITORS.map((c) => {
                const on = yes.has(c.name);
                return (
                  <div
                    key={c.name}
                    className="flex min-w-0 flex-col items-center justify-center rounded-md border text-xs leading-4"
                    style={{ flexGrow: c.amount, flexBasis: 0, borderColor: on ? "#16a34a" : "#cbd5e1", backgroundColor: on ? "#dcfce7" : "transparent", color: on ? "#14532d" : undefined }}
                  >
                    <span className="font-bold">{c.name}</span>
                    <span>{c.amount}</span>
                    <span className="text-[10px]">{on ? "찬성" : "반대"}</span>
                  </div>
                );
              })}
            </div>
            <Gauge label="허용 청구액" ratio={yesAmount / TOTAL} threshold={2 / 3} thresholdLabel="3분의 2 이상" valueText={`${yesAmount}÷${TOTAL}=${Math.round((yesAmount / TOTAL) * 100)}%`} />
            <Gauge label="인원" ratio={yesCount / COUNT} threshold={0.5} thresholdLabel="과반(절반 초과)" valueText={`${yesCount}÷${COUNT}=${Math.round((yesCount / COUNT) * 100)}%`} />
          </div>
        );
      }}
    />
  );
}
