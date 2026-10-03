import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = {
  reverse: { voltage: "−0.5 V", current: "약 −1 pA", barrier: "더 높음", width: "더 넓음", explanation: "p형 쪽을 낮게 둡니다. 다수 캐리어가 건너기 어렵고, 이상 모델의 작은 역방향 전류만 남습니다.", accent: "border-blue-500/50 bg-blue-500/10" },
  zero: { voltage: "0 V", current: "0 A", barrier: "평형", width: "평형", explanation: "확산과 전기장에 따른 이동이 서로 맞아 단자 순전류가 0입니다.", accent: "border-border bg-muted/40" },
  forward05: { voltage: "+0.5 V", current: "약 0.251 mA", barrier: "낮음", width: "좁음", explanation: "p형 쪽을 높게 두어 장벽을 낮춥니다. 반대편으로 들어간 캐리어가 전류를 만듭니다.", accent: "border-amber-500/50 bg-amber-500/10" },
  forward06: { voltage: "+0.6 V", current: "약 12.03 mA", barrier: "더 낮음", width: "더 좁음", explanation: "0.1 V만 더해도 이상 모델의 전류가 약 47.9배입니다. 실제 소자에는 직렬 저항 등의 한계가 있습니다.", accent: "border-orange-500/50 bg-orange-500/10" },
} as const;

type CaseKey = keyof typeof CASES;

export default function JunctionBiasViz() {
  const [selected, setSelected] = useState<CaseKey>("zero");
  const value = CASES[selected];
  return (
    <VizFrame
      eyebrow="한 접합의 네 전압"
      title="전압의 방향을 바꾸면 장벽과 전류가 함께 달라집니다"
      description="p형 단자 전위에서 n형 단자 전위를 뺀 전압을 선택하세요. 전류는 순방향을 양수로 셉니다."
      note="전류 수치는 300 K, 이상 계수 1, Is=1 pA의 교육용 가정에서 계산했습니다. 장벽·폭은 방향만 나타내며 실제 길이나 전위를 측정한 축이 아닙니다."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="접합 전압 선택">
        {(Object.keys(CASES) as CaseKey[]).map((key) => (
          <button
            type="button"
            key={key}
            aria-pressed={selected === key}
            onClick={() => setSelected(key)}
            className={`rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selected === key ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}
          >{CASES[key].voltage}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch" aria-live="polite">
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/5 p-4">
          <p className="font-bold">p형 영역</p>
          <p className="mt-1 text-sm leading-6">정공이 많습니다. 경계 가까이에는 음전하 억셉터 이온이 남습니다.</p>
        </div>
        <div className={`flex min-w-28 flex-col items-center justify-center rounded-lg border p-4 text-center ${value.accent}`}>
          <p className="text-xs font-semibold uppercase tracking-wide">공핍 영역</p>
          <p className="mt-2 text-sm">장벽: {value.barrier}</p>
          <p className="text-sm">폭: {value.width}</p>
        </div>
        <div className="rounded-lg border border-blue-500/50 bg-blue-500/5 p-4">
          <p className="font-bold">n형 영역</p>
          <p className="mt-1 text-sm leading-6">전자가 많습니다. 경계 가까이에는 양전하 도너 이온이 남습니다.</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-border bg-background p-4 text-sm leading-6" aria-live="polite">
        <p><strong>단자 전류:</strong> {value.current}</p>
        <p className="mt-1">{value.explanation}</p>
      </div>
    </VizFrame>
  );
}
