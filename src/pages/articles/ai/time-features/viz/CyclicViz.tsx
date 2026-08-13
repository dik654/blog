const hours = [0, 6, 12, 18, 23];

export default function CyclicViz() {
  return (
    <figure data-viz="cyclic-boundary-geometry" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Scalar line → cyclic coordinates</p>
        <p className="mt-2 text-lg font-semibold">23시와 0시는 숫자선에서는 멀지만 원 위에서는 이웃입니다</p>
      </figcaption>
      <div className="mt-6 grid min-w-0 gap-8 md:grid-cols-2 md:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold">원래 scalar</p>
          <div className="mt-6 h-px bg-border" />
          <div className="mt-[-7px] flex justify-between">
            {hours.map((hour) => <div key={hour} className="text-center"><span className="mx-auto block h-3 w-3 rounded-full border border-border bg-background"/><p className="mt-2 font-mono text-xs">{hour}</p></div>)}
          </div>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">|23−0| = 23이라 경계 양쪽이 가장 멀게 보입니다.</p>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Unit-circle 좌표</p>
          <div className="mx-auto mt-4 grid h-44 w-44 place-items-center rounded-full border border-border/90">
            <div className="relative h-full w-full">
              {[0,6,12,18,23].map((hour) => {
                const angle = (hour / 24) * Math.PI * 2;
                const left = 50 + 39 * Math.cos(angle);
                const top = 50 - 39 * Math.sin(angle);
                return <span key={hour} className={`absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-background font-mono text-[10px] ${hour === 0 || hour === 23 ? "border-primary text-primary" : "border-border text-muted-foreground"}`} style={{ left: `${left}%`, top: `${top}%` }}>{hour}</span>;
              })}
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">Angle 차이는 2π/24뿐이어서 두 point가 가까이 놓입니다.</p>
        </div>
      </div>
    </figure>
  );
}
