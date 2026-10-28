const GAS_PER_BLOB = 131_072n;
const UPDATE_FRACTION = 11_684_671n;

function fakeExponential(excessBlobs: number) {
  const numerator = BigInt(excessBlobs) * GAS_PER_BLOB;
  let output = 0n;
  let accum = UPDATE_FRACTION;
  let i = 1n;

  while (accum > 0n) {
    output += accum;
    accum = (accum * numerator) / UPDATE_FRACTION / i;
    i += 1n;
  }

  return Number(output / UPDATE_FRACTION);
}

const WIDTH = 720;
const HEIGHT = 250;
const PAD = { left: 54, right: 24, top: 20, bottom: 42 };
const X_MAX = 140;
const Y_MAX = 5;
const xScale = (value: number) =>
  PAD.left + (value / X_MAX) * (WIDTH - PAD.left - PAD.right);
const yScale = (value: number) =>
  HEIGHT - PAD.bottom - (value / Y_MAX) * (HEIGHT - PAD.top - PAD.bottom);

const actualPath = Array.from({ length: X_MAX + 1 }, (_, excess) => ({
  excess,
  fee: fakeExponential(excess),
})).reduce((path, point, index, points) => {
  const x = xScale(point.excess);
  const y = yScale(point.fee);
  if (index === 0) return `M ${x} ${y}`;
  const previousY = yScale(points[index - 1].fee);
  return `${path} L ${x} ${previousY} L ${x} ${y}`;
}, "");

const idealPath = Array.from({ length: 71 }, (_, index) => {
  const excess = index * 2;
  const ideal = Math.exp((excess * Number(GAS_PER_BLOB)) / Number(UPDATE_FRACTION));
  return `${index === 0 ? "M" : "L"} ${xScale(excess)} ${yScale(Math.min(ideal, Y_MAX))}`;
}).join(" ");

const thresholds = [
  ["0–61", "1 wei / blob gas"],
  ["62–97", "2 wei / blob gas"],
  ["98–123", "3 wei / blob gas"],
  ["124–143", "4 wei / blob gas"],
] as const;

export default function BlobFeeCurveChart() {
  return (
    <figure className="not-prose border-y border-border py-5">
      <figcaption className="font-semibold">BPO2 정수 기본료의 첫 네 계단</figcaption>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        가로축은 excess를 Blob 개수 상당으로 바꾼 값이고, 세로축은 1 blob gas당 wei입니다.
        실선은 Geth와 같은 정수 계산, 점선은 비교용 실수 지수 곡선입니다.
      </p>

      <div className="mt-4 grid gap-px bg-border p-px sm:hidden">
        {thresholds.map(([range, fee]) => (
          <div key={range} className="grid grid-cols-[5rem_minmax(0,1fr)] bg-background px-3 py-2 text-xs leading-5">
            <strong className="text-primary">{range}</strong>
            <span className="text-muted-foreground">{fee}</span>
          </div>
        ))}
        <div className="grid grid-cols-[5rem_minmax(0,1fr)] border-t border-primary/40 bg-primary/5 px-3 py-2 text-xs leading-5">
          <strong className="text-primary">현재 8</strong>
          <span>첫 구간에 있으므로 1 wei / blob gas</span>
        </div>
      </div>

      <svg
        className="mt-4 hidden h-auto w-full sm:block"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="BPO2 excess가 62개분과 98개분을 지날 때 정수 Blob 기본료가 1에서 2, 3으로 오르는 계단 그래프"
      >
        {[1, 2, 3, 4, 5].map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yScale(tick)} y2={yScale(tick)} className="stroke-border" strokeWidth="1" />
            <text x={PAD.left - 10} y={yScale(tick) + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">{tick}</text>
          </g>
        ))}
        {[0, 62, 98, 124, 140].map((tick) => (
          <g key={tick}>
            <line x1={xScale(tick)} x2={xScale(tick)} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="stroke-border" strokeWidth="1" />
            <text x={xScale(tick)} y={HEIGHT - 18} textAnchor="middle" className="fill-muted-foreground text-[10px]">{tick}</text>
          </g>
        ))}
        <path d={idealPath} fill="none" className="stroke-muted-foreground/60" strokeWidth="1.2" strokeDasharray="6 5" />
        <path d={actualPath} fill="none" className="stroke-primary" strokeWidth="1.25" strokeLinejoin="round" />
        <line x1={xScale(8)} x2={xScale(8)} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="stroke-amber-600" strokeWidth="1.25" />
        <circle cx={xScale(8)} cy={yScale(1)} r="5" className="fill-amber-600" />
        <text x={xScale(8) + 8} y={yScale(1) - 10} className="fill-foreground text-[11px] font-bold">현재 fixture · excess 8 → fee 1</text>
        <text x={(PAD.left + WIDTH - PAD.right) / 2} y={HEIGHT - 2} textAnchor="middle" className="fill-muted-foreground text-[10px]">excess · Blob 개수 상당</text>
        <text transform={`translate(13 ${(PAD.top + HEIGHT - PAD.bottom) / 2}) rotate(-90)`} textAnchor="middle" className="fill-muted-foreground text-[10px]">wei / blob gas</text>
      </svg>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        현재 fixture의 excess 8은 첫 구간에 있습니다. “excess 증가”와 “정수 기본료 증가”는
        같은 사건이 아니며, 이 경계값은 BPO2 fraction을 바꾸면 함께 달라집니다.
      </p>
    </figure>
  );
}
