import VizFrame from "@/components/viz/VizFrame";

const units = [
  ["사용자", "Grapheme cluster", "cursor·삭제·표시 경계"],
  ["Unicode", "Code point", "U+XXXX 번호 sequence"],
  ["직렬화", "UTF-8 byte", "file·network의 8-bit unit"],
  ["모델", "Token ID", "vocabulary row를 가리키는 정수"],
];

export default function TextUnitStackViz() {
  return (
    <VizFrame
      eyebrow="Text coordinate systems"
      title="같은 text도 계층마다 세는 원소가 다릅니다"
      description="한 층의 offset을 다른 층에 그대로 쓰지 않고, 변환과 alignment를 명시적으로 보존합니다."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {units.map(([scope, unit, role], index) => (
          <div key={unit} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
              <span className="text-xs font-semibold text-muted-foreground">{scope}</span>
            </div>
            <p className="mt-5 break-words text-base font-bold">{unit}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{role}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
