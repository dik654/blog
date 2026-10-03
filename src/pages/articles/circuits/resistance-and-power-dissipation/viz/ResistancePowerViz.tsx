import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = [
  { label: "오른쪽 2 kΩ", total: "6 mA", node: "6 V", left: "3 mA · 18 mW", right: "3 mA · 18 mW", first: "36 mW", supply: "72 mW" },
  { label: "오른쪽 1 kΩ", total: "7.2 mA", node: "4.8 V", left: "2.4 mA · 11.52 mW", right: "4.8 mA · 23.04 mW", first: "51.84 mW", supply: "86.4 mW" },
] as const;

export default function ResistancePowerViz() {
  const [selected, setSelected] = useState(0);
  const state = CASES[selected];
  return (
    <VizFrame
      eyebrow="앞 글의 12 V 가상 저항망"
      title="한쪽을 쉽게 만들면 다른 길의 전류는 왜 줄까요?"
      description="오른쪽 저항을 바꿔 갈림길 전압, 각 전류와 열을 함께 비교하세요."
      note="12 V 전원·첫 1 kΩ·왼쪽 2 kΩ은 고정한 가상 회로입니다. 실제 부품 정격 비교는 본문의 별도 데이터시트 조건을 따릅니다."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="오른쪽 갈래의 저항 선택">
        {CASES.map((item, index) => (
          <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selected === index ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite">
        <div className="space-y-3 rounded-lg border border-border bg-background p-4 text-sm">
          <p className="font-semibold">전원 12 V · 전체 {state.total}</p>
          <div className="rounded-md border border-border bg-amber-500/10 p-3">첫 1 kΩ <span className="font-semibold">{state.first}</span></div>
          <p className="text-center font-semibold">갈림길 {state.node}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-border bg-blue-500/10 p-3"><p>왼쪽 2 kΩ</p><strong>{state.left}</strong></div>
            <div className="rounded-md border border-border bg-blue-500/10 p-3"><p>{state.label}</p><strong>{state.right}</strong></div>
          </div>
          <p className="text-right">세 부품 합 <strong>{state.supply}</strong></p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 text-sm leading-6">
          <p className="font-semibold">값을 바꿀 때 따라갈 순서</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>두 갈래를 병렬 등가로 줄입니다.</li>
            <li>첫 1 kΩ을 더해 전원 전류를 구합니다.</li>
            <li>첫 부품의 낙차를 빼 갈림길 전압을 구합니다.</li>
            <li>갈림길 전압으로 각 전류와 열을 다시 계산합니다.</li>
          </ol>
          <p className="mt-3 text-muted-foreground">오른쪽을 1 kΩ으로 바꾸면 왼쪽 전류는 3→2.4 mA, 첫 부품의 열은 36→51.84 mW입니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}
