import VizFrame from "@/components/viz/VizFrame";

const checkpoints = [
  ["0", "1", "0", "오른쪽"],
  ["π/2", "0", "1", "위"],
  ["π", "−1", "0", "왼쪽"],
  ["3π/2", "0", "−1", "아래"],
];

export default function UnitCircleViz() {
  return (
    <VizFrame
      eyebrow="One motion, two coordinates"
      title="Cosine과 sine은 같은 원운동을 두 축에서 읽습니다"
      description="각도가 바뀔 때 두 값은 따로 움직이는 것이 아니라 단위원 위 한 점의 가로·세로 좌표로 함께 변합니다."
    >
      <div className="overflow-x-auto">
        <div className="min-w-[520px] rounded-lg border border-border/70 bg-background">
          <div className="grid grid-cols-[1fr_1fr_1fr_1.2fr] border-b border-border/70 px-4 py-3 text-xs font-bold text-muted-foreground">
            <span>θ</span><span>cos θ</span><span>sin θ</span><span>점의 위치</span>
          </div>
          {checkpoints.map((row) => (
            <div key={row[0]} className="grid grid-cols-[1fr_1fr_1fr_1.2fr] border-b border-border/50 px-4 py-3 text-sm last:border-b-0">
              {row.map((value, index) => <span key={`${row[0]}-${index}`} className={index < 3 ? "font-mono" : "text-muted-foreground"}>{value}</span>)}
            </div>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}
