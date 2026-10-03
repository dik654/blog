import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = [
  { label: "100 rad/s", omega: 100, amplitude: "4.98 V", ratio: 0.995, phase: "−5.7°", lag: 5.7 },
  { label: "1000 rad/s", omega: 1000, amplitude: "3.54 V", ratio: 0.707, phase: "−45°", lag: 45 },
  { label: "10000 rad/s", omega: 10000, amplitude: "0.50 V", ratio: 0.0995, phase: "−84.3°", lag: 84.3 },
] as const;

const wavePath = (ratio: number, lagDegrees: number) => Array.from({ length: 61 }, (_, index) => {
  const x = index * 5;
  const y = 60 - 40 * ratio * Math.cos(2 * Math.PI * x / 240 - lagDegrees * Math.PI / 180);
  return `${index ? "L" : "M"}${x} ${y.toFixed(2)}`;
}).join(" ");

export default function ImpedanceViz() {
  const [selected, setSelected] = useState(1);
  const state = CASES[selected];
  return (
    <VizFrame
      eyebrow="같은 1 kΩ·1 µF 회로"
      title="빨리 흔들수록 얼마나 작고 늦어질까요?"
      description="각주파수를 바꾸고 축전기 출력의 최대 진폭과 위상 지연을 함께 보세요."
      note="입력 5 V는 최대 진폭입니다. 표시한 파형은 선택마다 같은 주기 눈금을 적용해 비교한 그림이며, 실제 시간축 길이는 서로 다릅니다. 가정한 이상 회로입니다."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="각주파수 선택">
        {CASES.map((item, index) => (
          <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selected === index ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite">
        <div className="rounded-lg border border-border bg-background p-4 text-sm">
          <p className="font-semibold">입력 최대 진폭 5 V</p>
          <div className="mt-3 rounded-md bg-blue-500/10 p-3">축전기 출력 <strong>{state.amplitude}</strong></div>
          <div className="mt-2 rounded-md bg-amber-500/10 p-3">입력보다 늦는 각도 <strong>{state.phase}</strong></div>
          <p className="mt-3 text-muted-foreground">ωRC={state.omega / 1000}입니다. 한 번의 스위치 응답과 달리 계속 흔들리는 부분을 봅니다.</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs font-semibold">같은 주기 눈금으로 놓고 비교</p>
          <svg className="mt-2 h-auto w-full" viewBox="0 0 300 120" role="img" aria-label={`입력 5볼트 파형과 출력 ${state.amplitude}, 입력보다 ${state.phase} 늦는 파형`}>
            <path d="M0 60 H300" stroke="#94a3b8" strokeWidth="1" fill="none" />
            <path d={wavePath(1, 0)} stroke="#2563eb" strokeWidth="1.2" fill="none" />
            <path d={wavePath(state.ratio, state.lag)} stroke="#d97706" strokeWidth="1.2" fill="none" />
          </svg>
          <div className="mt-2 flex flex-wrap gap-3 text-xs"><span className="text-blue-600 dark:text-blue-400">━ 입력</span><span className="text-amber-600 dark:text-amber-400">━ 축전기 출력</span></div>
        </div>
      </div>
    </VizFrame>
  );
}
