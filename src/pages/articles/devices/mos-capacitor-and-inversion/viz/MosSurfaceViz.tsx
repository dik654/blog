import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = {
  accumulation: { voltage: "−1.0 V", state: "정공 축적", gate: "음전하", surface: "정공이 표면으로 모임", fixed: "고정 억셉터 이온은 정공에 가려짐", charge: "계산 사례 밖", color: "border-amber-500/50 bg-amber-500/10" },
  flat: { voltage: "0 V", state: "평탄띠 (가정)", gate: "전하 없음", surface: "추가로 모인 전하 없음", fixed: "벌크와 비슷한 상태", charge: "0", color: "border-border bg-muted/40" },
  depletion: { voltage: "+0.2 V", state: "정공 공핍", gate: "양전하", surface: "정공이 밀려남", fixed: "음전하 억셉터 이온이 드러남", charge: "강한 반전식 적용 전", color: "border-blue-500/50 bg-blue-500/10" },
  inversion: { voltage: "+1.0 V", state: "전자 반전", gate: "양전하", surface: "전자 층이 표면에 모임", fixed: "그 아래에 공핍층이 남음", charge: "추가 전자 약 108만 개", color: "border-violet-500/50 bg-violet-500/10" },
} as const;

type CaseKey = keyof typeof CASES;

export default function MosSurfaceViz() {
  const [selected, setSelected] = useState<CaseKey>("flat");
  const current = CASES[selected];
  return (
    <VizFrame
      eyebrow="절연층 너머에서"
      title="전극 전압이 표면의 전하를 바꿉니다"
      description="p형 실리콘 위 전극 전압을 선택하고 정공·고정 이온·전자의 상태를 비교하세요."
      note="평탄띠 0 V와 문턱 0.5 V, 10 nm·100 µm²는 교육용 가정입니다. −1 V·+0.2 V의 상태 구분은 이상 모델의 개념도이며 실제 소자 값이 아닙니다."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="MOS 전극 전압 선택">
        {(Object.keys(CASES) as CaseKey[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={selected === key}
            onClick={() => setSelected(key)}
            className={`rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selected === key ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}
          >{CASES[key].voltage}</button>
        ))}
      </div>
      <div className="mt-5 space-y-2 text-center text-sm" aria-live="polite">
        <div className="rounded-lg border border-border bg-background p-3"><strong>금속 전극:</strong> {current.gate}</div>
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3"><strong>10 nm 산화막:</strong> 직류 통로를 막고 전기장을 전달</div>
        <div className={`rounded-lg border p-4 ${current.color}`}>
          <p className="font-bold">p형 실리콘 표면 · {current.state}</p>
          <p className="mt-2">{current.surface}</p>
          <p>{current.fixed}</p>
          <p className="mt-2 font-semibold">{current.charge}</p>
        </div>
      </div>
    </VizFrame>
  );
}
