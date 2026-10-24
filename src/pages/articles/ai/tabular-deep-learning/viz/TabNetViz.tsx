const rows = [
  {
    name: "고객 A",
    values: [
      [0.78, 0.16, 0.06, 0],
      [0.08, 0.14, 0.22, 0.56],
    ],
  },
  {
    name: "고객 B",
    values: [
      [0.04, 0.11, 0.73, 0.12],
      [0.61, 0.27, 0.08, 0.04],
    ],
  },
];
const features = ["소득", "부채", "연체", "직업"];

function MaskRow({ values }: { values: number[] }) {
  return (
    <div className="grid min-w-0 grid-cols-4 gap-2">
      {values.map((value, index) => (
        <div key={`${index}-${value}`} className="min-w-0">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/75"
              style={{ width: `${value * 100}%` }}
            />
          </div>
          <p className="mt-1 text-center font-mono text-[11px] text-muted-foreground">
            {value.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function TabNetViz() {
  return (
    <figure
      data-viz="tabnet-instance-mask"
      className="min-w-0 border-y border-border bg-background py-5 sm:py-6"
    >
      <figcaption>
        <p className="text-xs font-bold text-primary">
          행마다 다른 특성 마스크
        </p>
        <p className="mt-2 text-lg font-semibold">
          같은 열도 행과 판단 단계에 따라 다른 비중으로 선택됩니다
        </p>
      </figcaption>
      <div className="mt-6 min-w-0 overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[5rem_1fr_1fr] gap-5 border-b border-border/70 pb-3 text-xs font-semibold text-muted-foreground">
            <span>행</span>
            <div className="grid grid-cols-4 gap-2 text-center">
              {features.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {features.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[5rem_1fr_1fr] gap-5 border-b border-border/70 py-2 text-xs font-semibold text-foreground">
            <span /> <span>1단계 마스크</span>
            <span>2단계 마스크</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-[5rem_1fr_1fr] items-center gap-5 border-b border-border/60 py-4 last:border-0"
            >
              <p className="text-sm font-semibold">{row.name}</p>
              <MaskRow values={row.values[0]} />
              <MaskRow values={row.values[1]} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-3 border-t border-border/70 pt-4 text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <p>
          <span className="font-semibold">이전 선택량</span>
          <br />
          <span className="text-muted-foreground">앞 단계의 사용 이력</span>
        </p>
        <span className="hidden text-muted-foreground sm:block">→</span>
        <p>
          <span className="font-semibold">희소 마스크 × 행</span>
          <br />
          <span className="text-muted-foreground">현재 입력에서 열 선택</span>
        </p>
        <span className="hidden text-muted-foreground sm:block">→</span>
        <p>
          <span className="font-semibold">판단값 + 다음 문맥</span>
          <br />
          <span className="text-muted-foreground">예측 기여와 다음 단계</span>
        </p>
      </div>
    </figure>
  );
}
