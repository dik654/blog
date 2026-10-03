import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

type Case = "equal" | "changed";

const CASES = {
  equal: {
    title: "두 갈래가 모두 2 kΩ",
    node: "6 V",
    source: "6 mA",
    first: "3 mA",
    second: "3 mA",
    secondResistance: "2 kΩ",
    sum: "6 = 3 + 3",
    drop: "12 = 6 + 6",
  },
  changed: {
    title: "오른쪽 갈래만 1 kΩ",
    node: "4.8 V",
    source: "7.2 mA",
    first: "2.4 mA",
    second: "4.8 mA",
    secondResistance: "1 kΩ",
    sum: "7.2 = 2.4 + 4.8",
    drop: "12 = 7.2 + 4.8",
  },
} as const;

/** 숫자는 모두 글에서 선언한 이상 전원·선형 저항의 가정값입니다. */
export default function CircuitWalkViz() {
  const [selected, setSelected] = useState<Case>("equal");
  const values = CASES[selected];

  return (
    <VizFrame
      eyebrow="한 회로를 끝까지 따라가기"
      title="한 갈래를 바꾸면 세 전류와 갈림길 전압이 함께 바뀝니다"
      description="12 V 전원에서 1 kΩ 저항을 지난 뒤 두 갈래로 나뉩니다. 오른쪽 저항을 바꿔 보세요."
      note="모든 숫자는 설명을 위한 가정입니다. 도선·전원은 이상적이고 저항은 일정하다고 둡니다."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="오른쪽 갈래 저항 선택">
        {(["equal", "changed"] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={selected === key}
            onClick={() => setSelected(key)}
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selected === key ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}
          >
            {CASES[key].title}
          </button>
        ))}
      </div>

      <div className="mt-5 hidden overflow-x-auto sm:block" role="img" aria-label={`12볼트 전원, 직렬 1킬로옴에 ${values.source}, 갈림길 ${values.node}, 왼쪽 2킬로옴에 ${values.first}, 오른쪽 ${values.secondResistance}에 ${values.second}`}>
        <svg viewBox="0 0 600 280" className="w-full max-w-3xl" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.25" fill="none" opacity="0.55">
            <path d="M 80 70 H 180 M 300 70 H 400 V 95 M 400 95 H 490 V 120 M 400 95 H 360 V 120 M 360 170 V 210 H 80 V 120 M 490 170 V 210 H 400" />
            <circle cx="400" cy="95" r="5" fill="currentColor" />
          </g>
          <rect x="180" y="50" width="120" height="40" rx="8" fill="#dbeafe" stroke="#2563eb" />
          <rect x="330" y="120" width="60" height="50" rx="8" fill="#dcfce7" stroke="#16a34a" />
          <rect x="460" y="120" width="60" height="50" rx="8" fill="#dcfce7" stroke="#16a34a" />
          <circle cx="80" cy="95" r="25" fill="#fef3c7" stroke="#d97706" strokeWidth="1.25" />
          <g fill="#0f172a" fontFamily="sans-serif" textAnchor="middle">
            <text x="80" y="100" fontSize="15" fontWeight="700">12 V</text>
            <text x="240" y="75" fontSize="15" fontWeight="700">1 kΩ</text>
            <text x="360" y="150" fontSize="15" fontWeight="700">2 kΩ</text>
            <text x="490" y="150" fontSize="15" fontWeight="700">{values.secondResistance}</text>
            <text x="235" y="39" fontSize="14" fontWeight="700">{values.source} →</text>
            <text x="362" y="112" fontSize="13" fontWeight="700">{values.first} ↓</text>
            <text x="492" y="112" fontSize="13" fontWeight="700">{values.second} ↓</text>
            <text x="426" y="77" fontSize="14" fontWeight="700">{values.node}</text>
            <text x="80" y="242" fontSize="13">기준점 0 V</text>
          </g>
        </svg>
      </div>

      <div className="mt-5 space-y-3 sm:hidden" role="img" aria-label={`12볼트 전원에서 1킬로옴 저항을 지난 ${values.source}가 두 갈래로 나뉩니다. 갈림길은 ${values.node}입니다.`}>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <span className="rounded-md border border-amber-600 bg-amber-50 px-2 py-3 text-foreground">전원 12 V</span>
          <span aria-hidden="true">→</span>
          <span className="rounded-md border border-blue-600 bg-blue-50 px-2 py-3 text-foreground">1 kΩ · {values.source}</span>
        </div>
        <p className="text-center text-sm font-bold text-primary">↓ 갈림길 {values.node}</p>
        <div className="grid grid-cols-2 gap-2 text-center text-sm font-semibold">
          <span className="rounded-md border border-green-600 bg-green-50 px-2 py-3 text-foreground">왼쪽 2 kΩ<br />{values.first}</span>
          <span className="rounded-md border border-green-600 bg-green-50 px-2 py-3 text-foreground">오른쪽 {values.secondResistance}<br />{values.second}</span>
        </div>
        <p className="text-center text-xs text-muted-foreground">두 갈래 모두 아래 기준점 0 V로 돌아갑니다.</p>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2" aria-live="polite">
        <p className="rounded-md border border-border bg-background p-3 leading-6">
          <strong className="block text-primary">갈림길: 들어온 전류 = 나간 전류</strong>
          {values.sum} mA
        </p>
        <p className="rounded-md border border-border bg-background p-3 leading-6">
          <strong className="block text-primary">왼쪽 고리: 전원이 준 전압 = 두 저항의 전압강하</strong>
          {values.drop} V
        </p>
      </div>
    </VizFrame>
  );
}
