import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

type Material = "pure" | "donor" | "acceptor";

const CASES = {
  pure: {
    label: "순수 실리콘",
    added: "넣은 불순물 없음",
    electron: "10¹⁰",
    hole: "10¹⁰",
    fixed: "고정 이온 없음",
    relation: "전자와 빈자리가 짝으로 생깁니다.",
    check: "10¹⁰ × 10¹⁰ = 10²⁰",
  },
  donor: {
    label: "도너를 넣음",
    added: "도너 10¹⁶ cm⁻³ (가정)",
    electron: "10¹⁶",
    hole: "10⁴",
    fixed: "고정된 양전하 도너 이온 약 10¹⁶ cm⁻³",
    relation: "풀린 전자와 고정 이온이 전하를 맞춥니다.",
    check: "10¹⁶ × 10⁴ = 10²⁰",
  },
  acceptor: {
    label: "억셉터를 넣음",
    added: "억셉터 10¹⁶ cm⁻³ (가정)",
    electron: "10⁴",
    hole: "10¹⁶",
    fixed: "고정된 음전하 억셉터 이온 약 10¹⁶ cm⁻³",
    relation: "풀린 빈자리와 고정 이온이 전하를 맞춥니다.",
    check: "10⁴ × 10¹⁶ = 10²⁰",
  },
} as const;

export default function CarrierCountViz() {
  const [material, setMaterial] = useState<Material>("pure");
  const values = CASES[material];

  return (
    <VizFrame
      eyebrow="1 cm³를 세기"
      title="한쪽이 늘어도 두 농도의 곱은 같습니다"
      description="300 K의 열평형 실리콘을 가정합니다. 각 버튼을 눌러 움직이는 전자와 정공의 수를 비교하세요."
      note="순수 실리콘의 약 10¹⁰ cm⁻³는 MIT 6.012 Lecture 2의 300 K 기준값입니다. 도너·억셉터 10¹⁶ cm⁻³는 이 글의 가정이며 거의 전부 이온화한다고 둡니다."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="실리콘의 도핑 상태 선택">
        {(["pure", "donor", "acceptor"] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={material === key}
            onClick={() => setMaterial(key)}
            className={`rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${material === key ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}
          >
            {CASES[key].label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4" aria-live="polite">
        <p className="text-sm font-semibold text-foreground">{values.added}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-blue-500/50 bg-blue-500/5 p-4">
            <p className="text-sm text-muted-foreground">움직이는 전자</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{values.electron} <span className="text-base font-medium">cm⁻³</span></p>
          </div>
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/5 p-4">
            <p className="text-sm text-muted-foreground">움직이는 정공</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{values.hole} <span className="text-base font-medium">cm⁻³</span></p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 text-sm leading-6">
          <p><strong>전하 장부:</strong> {values.fixed}. {values.relation}</p>
          <p className="mt-2"><strong>농도 곱:</strong> {values.check} cm⁻⁶</p>
        </div>
      </div>
    </VizFrame>
  );
}
