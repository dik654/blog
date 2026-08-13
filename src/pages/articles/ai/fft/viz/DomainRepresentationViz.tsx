import VizFrame from "@/components/viz/VizFrame";

const samples = [18, 31, 48, 60, 54, 36, 20, 24, 43, 58, 55, 37, 17, 12, 28, 49];
const bins = [
  ["k = 2", 82, "dominant"],
  ["k = 5", 48, "secondary"],
  ["others", 14, "residual"],
];

export default function DomainRepresentationViz() {
  return (
    <VizFrame
      eyebrow="Same signal, different coordinates"
      title="DFT는 sample을 없애지 않고 회전하는 기저의 계수로 다시 표현합니다"
      description="왼쪽의 16개 값과 오른쪽의 complex coefficients는 같은 정보를 서로 다른 좌표에서 나타냅니다."
      note="Magnitude만 남기면 phase가 사라지므로 일반적으로 원래 signal을 정확히 복원할 수 없습니다."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="rounded-lg border border-border/70 bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">시간·공간 domain · x[n]</p>
          <div className="mt-5 flex h-32 items-end gap-1" aria-label="입력 sample 높이">
            {samples.map((height, index) => (
              <span key={index} className="min-w-0 flex-1 rounded-sm bg-foreground/55" style={{ height: `${height + 16}%` }} />
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">위치 n마다 관측한 amplitude</p>
        </div>

        <div className="hidden px-2 text-center lg:block">
          <p className="font-mono text-xs text-primary">DFT</p>
          <p className="mt-1 text-lg text-muted-foreground">→</p>
        </div>

        <div className="rounded-lg border border-border/70 bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">주파수 domain · X[k]</p>
          <div className="mt-5 space-y-4">
            {bins.map(([name, width, role]) => (
              <div key={name}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-mono text-foreground">{name}</span>
                  <span className="text-muted-foreground">{role}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary/65" style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">각 회전 속도의 magnitude와 phase</p>
        </div>
      </div>
    </VizFrame>
  );
}
