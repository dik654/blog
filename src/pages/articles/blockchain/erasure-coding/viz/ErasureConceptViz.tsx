import VizFrame from "@/components/viz/VizFrame";

type Mode = "overview" | "reed-solomon" | "two-dimensional" | "comparison";

const FLOW = [
  ["Source", "k개의 source symbol과 위치를 고정합니다.", "source digest"],
  [
    "Encode",
    "field와 generator profile로 n개 symbol을 만듭니다.",
    "code profile",
  ],
  ["Lose", "위치를 아는 erasure가 최대 n-k개 생깁니다.", "missing indices"],
  ["Decode", "충분한 독립 symbol을 모아 원문을 복원합니다.", "decode receipt"],
] as const;

const RS_POINTS = [
  [0, 2, "source"],
  [1, 5, "source"],
  [2, 1, "repair"],
  [3, 4, "repair"],
] as const;

const SCHEMES = [
  ["Reed–Solomon", "정확히 k개", "고밀도 field 연산", "고정 block·MDS"],
  ["RaptorQ", "충분히 큰 집합", "sparse/XOR 중심", "수신 수가 유동적인 전송"],
  [
    "LDPC",
    "profile별 근접",
    "iterative sparse graph",
    "큰 block·정해진 channel",
  ],
] as const;

function Ledger({
  rows,
}: {
  rows: readonly (readonly [string, string, string])[];
}) {
  return (
    <ol className="grid min-w-0 gap-4 lg:grid-cols-4">
      {rows.map(([label, detail, receipt], index) => (
        <li key={label} className="min-w-0 border-t border-border pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="min-w-0 break-words text-sm font-bold leading-5 text-foreground">
              {label}
            </p>
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
            {detail}
          </p>
          <p className="mt-3 break-words border-l border-primary/50 pl-3 text-xs leading-5 text-foreground/75">
            receipt · {receipt}
          </p>
        </li>
      ))}
    </ol>
  );
}

function OverviewCanvas() {
  return <Ledger rows={FLOW} />;
}

function ReedSolomonCanvas() {
  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="min-w-0 border-t border-border pt-4">
        <p className="font-mono text-xs font-bold text-primary">
          GF(7) · p(x)=2+3x
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          서로 다른 x에서 얻은 두 점이면 차수 1 다항식을 복원합니다.
          덧셈·곱셈·나눗셈은 모두 modulo 7의 field 연산입니다.
        </p>
      </div>
      <ol className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
        {RS_POINTS.map(([x, y, role]) => (
          <li key={x} className="min-w-0 border-t border-border pt-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {role}
            </p>
            <p className="mt-2 font-mono text-lg font-semibold text-foreground">
              ({x}, {y})
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              evaluation index {x}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TwoDimensionalCanvas() {
  const cells = Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const original = row < 4 && col < 4;
    const rowParity = row < 4 && col >= 4;
    const sample = [5, 18, 35, 60].includes(index);
    return { index, original, rowParity, sample };
  });
  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-center">
      <div
        className="grid aspect-square w-full max-w-[18rem] grid-cols-8 gap-1"
        aria-label="4 by 4 source matrix extended to 8 by 8"
      >
        {cells.map(({ index, original, rowParity, sample }) => (
          <span
            key={index}
            className={`aspect-square border ${sample ? "border-primary bg-primary/15" : "border-border"} ${original ? "bg-foreground/10" : rowParity ? "bg-muted" : "bg-muted/45"}`}
            title={
              sample ? "sampled cell" : original ? "source cell" : "parity cell"
            }
          />
        ))}
      </div>
      <div className="min-w-0 space-y-3 text-sm leading-6 text-muted-foreground">
        <p>
          <strong className="text-foreground">4×4 source</strong>를 행 방향으로
          4×8, 다시 열 방향으로 8×8까지 확장합니다.
        </p>
        <p>
          <strong className="text-foreground">회색 농도</strong>는 source·row
          parity·column/parity-of-parity 영역을 구분합니다.
        </p>
        <p>
          <strong className="text-foreground">테두리가 진한 cell</strong>은 light
          client의 sample 예시입니다. sample 성공은 commitment 일치와 sampling
          전제가 함께 있을 때만 availability evidence가 됩니다.
        </p>
      </div>
    </div>
  );
}

function ComparisonCanvas() {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-3">
      {SCHEMES.map(([name, recovery, work, fit], index) => (
        <article key={name} className="min-w-0 border-t border-border pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] font-bold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="break-words text-sm font-bold text-foreground">
              {name}
            </h3>
          </div>
          <dl className="mt-3 grid gap-2 text-xs leading-5">
            <div>
              <dt className="font-semibold text-foreground">복원</dt>
              <dd className="text-muted-foreground">{recovery}</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">계산</dt>
              <dd className="text-muted-foreground">{work}</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">적합</dt>
              <dd className="text-muted-foreground">{fit}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

const META = {
  overview: {
    eyebrow: "Redundancy with a recovery contract",
    title:
      "Erasure coding은 복사본 수가 아니라 복원 가능한 독립 symbol 수를 설계합니다",
    description:
      "고정된 (n,k) profile에서 source·repair·missing position·decoder outcome을 한 흐름으로 봅니다.",
    note: "‘임의의 k개’는 MDS code와 올바른 symbol identity를 전제로 합니다. 손상 위치를 모르는 error와 위치를 아는 erasure는 같은 예산을 쓰지 않습니다.",
    canvas: <OverviewCanvas />,
  },
  "reed-solomon": {
    eyebrow: "Evaluation code over a finite field",
    title:
      "Reed–Solomon은 k개의 값을 차수 k-1 이하 다항식의 n개 평가값으로 바꿉니다",
    description:
      "작은 GF(7) 예제로 evaluation·interpolation·field division을 한 화면에서 추적합니다.",
    note: "실제 codec의 systematic matrix·field·symbol packing은 profile마다 다릅니다. Ethereum PeerDAS를 GF(2^8) packet code로 일반화하지 않습니다.",
    canvas: <ReedSolomonCanvas />,
  },
  "two-dimensional": {
    eyebrow: "2D extension and sampling",
    title:
      "2D 확장은 행과 열에 복원 경로를 만들고, DAS는 일부 cell만 요청합니다",
    description:
      "4×4 source가 8×8 extended square가 되는 구조와 sampled cell의 의미를 분리합니다.",
    note: "Celestia 계열의 2D construction과 Ethereum PeerDAS의 1D row extension은 같은 구현이 아닙니다. protocol profile을 확인해야 합니다.",
    canvas: <TwoDimensionalCanvas />,
  },
  comparison: {
    eyebrow: "Choose by guarantee, channel, and decoder",
    title:
      "RS·RaptorQ·LDPC는 하나의 속도 순위가 아니라 서로 다른 복원 계약입니다",
    description:
      "MDS threshold, rateless delivery, sparse iterative decoding을 같은 축에서 비교합니다.",
    note: "Complexity 표기만으로 implementation을 선택하지 않습니다. Symbol size·loss pattern·block size·SIMD·memory·corruption model을 같은 fixture에서 측정합니다.",
    canvas: <ComparisonCanvas />,
  },
} as const;

export default function ErasureConceptViz({ mode }: { mode: Mode }) {
  const meta = META[mode];
  return (
    <VizFrame
      eyebrow={meta.eyebrow}
      title={meta.title}
      description={meta.description}
      note={meta.note}
    >
      {meta.canvas}
    </VizFrame>
  );
}
