import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = [
  { label: "멈춤 · 0%", cycles: 0, dynamic: 0, idle: 3.3, total: 3.3 },
  { label: "10%", cycles: 100000, dynamic: 10.89, idle: 3.3, total: 14.19 },
  { label: "매번 · 100%", cycles: 1000000, dynamic: 108.9, idle: 3.3, total: 112.2 },
] as const;

export default function SwitchingEnergyViz() {
  const [selected, setSelected] = useState(1);
  const state = CASES[selected];
  return (
    <VizFrame
      eyebrow="출력 하나의 에너지 장부"
      title="가만히 있을 때도 얼마가 남을까요?"
      description="같은 10 pF·3.3 V·1 MHz 가정에서 완전 출력 주기 비율만 바꾸세요."
      note="10 pF, 3.3 V, 1 MHz와 1 µA는 가상 사례입니다. 활동률은 기준 주기당 완전한 출력 0→1→0 주기의 비율입니다. 단락 전류·내부 노드는 제외합니다."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="완전 출력 주기 활동률 선택">
        {CASES.map((item, index) => (
          <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selected === index ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm font-semibold">완전 출력 주기 {state.cycles.toLocaleString("ko-KR")}회/s</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2 rounded-md bg-blue-500/10 px-3 py-2"><span>출력이 바뀔 때</span><strong>{state.dynamic} µW</strong></div>
            <div className="flex items-center justify-between gap-2 rounded-md bg-amber-500/10 px-3 py-2"><span>대기 누설</span><strong>{state.idle} µW</strong></div>
            <div className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"><span>두 항의 합</span><strong>{state.total} µW</strong></div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 text-sm leading-6">
          <p className="font-semibold">완전한 한 번의 행방</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>공급원이 충전 때 108.9 pJ를 냅니다.</li>
            <li>54.45 pJ는 위쪽 소자에서 열이 되고 54.45 pJ는 잠시 저장됩니다.</li>
            <li>방전 때 저장된 54.45 pJ도 아래쪽 소자에서 열이 됩니다.</li>
          </ol>
          <p className="mt-3 text-muted-foreground">활동률은 이 한 쌍이 1초에 몇 번인지 바꿉니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}
