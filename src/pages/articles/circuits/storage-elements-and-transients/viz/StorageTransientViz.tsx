import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = [
  { label: "직후 · 0 ms", voltage: "0 V", rcCurrent: "5 mA", rlCurrent: "0 mA", coilVoltage: "5 V", percent: "0%" },
  { label: "1 ms", voltage: "3.16 V", rcCurrent: "1.84 mA", rlCurrent: "3.16 mA", coilVoltage: "1.84 V", percent: "63.2%" },
  { label: "3 ms", voltage: "4.75 V", rcCurrent: "0.25 mA", rlCurrent: "4.75 mA", coilVoltage: "0.25 V", percent: "95.0%" },
  { label: "5 ms", voltage: "4.97 V", rcCurrent: "0.03 mA", rlCurrent: "4.97 mA", coilVoltage: "0.03 V", percent: "99.3%" },
] as const;

export default function StorageTransientViz() {
  const [selected, setSelected] = useState(1);
  const state = CASES[selected];
  return (
    <VizFrame
      eyebrow="두 개의 가상 5 V 회로"
      title="같은 1 ms 동안 무엇이 남고 무엇이 늘까요?"
      description="시간을 눌러 RC의 전압과 RL의 전류를 같은 변화 비율로 비교하세요."
      note="RC는 1 kΩ·1 µF, RL은 1 kΩ·1 H로 따로 만든 가상 회로입니다. 둘 다 시간 상수 1 ms가 되도록 골랐습니다. 값은 반올림했으며 이상 부품을 가정합니다."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="스위치를 닫은 뒤 경과 시간 선택">
        {CASES.map((item, index) => (
          <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selected === index ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite">
        <div className="rounded-lg border border-border bg-background p-4 text-sm">
          <p className="font-semibold">전하를 담는 RC</p>
          <p className="mt-2 text-muted-foreground">5 V 전원 → 1 kΩ → 1 µF</p>
          <div className="mt-4 rounded-md bg-blue-500/10 p-3">축전기 전압 <strong>{state.voltage}</strong></div>
          <div className="mt-2 rounded-md border border-border p-3">저항·축전기 전류 <strong>{state.rcCurrent}</strong></div>
          <p className="mt-3 text-muted-foreground">축전기 전압은 0 V에서 출발해 5 V에 다가갑니다.</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 text-sm">
          <p className="font-semibold">자기장을 만드는 RL</p>
          <p className="mt-2 text-muted-foreground">5 V 전원 → 1 kΩ → 1 H</p>
          <div className="mt-4 rounded-md bg-amber-500/10 p-3">인덕터 전류 <strong>{state.rlCurrent}</strong></div>
          <div className="mt-2 rounded-md border border-border p-3">인덕터 양끝 전압 <strong>{state.coilVoltage}</strong></div>
          <p className="mt-3 text-muted-foreground">인덕터 전류는 0 mA에서 출발해 5 mA에 다가갑니다.</p>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium" aria-live="polite">이 시각의 도착 비율은 약 {state.percent}입니다. 나머지는 시간이 지나며 더 줄어듭니다.</p>
    </VizFrame>
  );
}
