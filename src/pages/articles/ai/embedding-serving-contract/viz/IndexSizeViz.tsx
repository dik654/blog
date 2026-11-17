import SceneShell from "./SceneShell";

/**
 * 본문 대응: #index-artifact — 1천만 vector × 1,024 dimension × 2 bytes = raw 20.48GB.
 * scalar 수 = 10,000,000 × 1,024 = 10,240,000,000. FP32=4·FP16=2·int8≈1 byte를 곱하면
 * 40.96 · 20.48 · 약 10.24GB(1GB = 10^9 bytes). ANN graph와 metadata는 글이 크기를 주지 않으므로 폭을 재지 않는다.
 */
const M = 10_000_000;
const D = 1024;
const SCALARS = M * D;
const GB = 1e9;
const DTYPES = [
  { name: "FP32", bytes: 4, approx: false },
  { name: "FP16", bytes: 2, approx: false },
  { name: "int8", bytes: 1, approx: true },
] as const;
const sizeGb = (bytes: number) => (SCALARS * bytes) / GB;
const MAX_GB = sizeGb(4);
const fmt = (value: number) => value.toLocaleString("en-US");

const SCENES = [
  {
    label: "칸 수부터 셉니다",
    summary: `${fmt(M)} × ${fmt(D)} = ${fmt(SCALARS)}`,
    note: "Vector 하나가 한 행, dimension 하나가 한 열입니다. 1천만 행 × 1,024열이면 저장할 scalar가 102억 4천만 개입니다. 그림의 격자는 모양만 보인 축소판입니다.",
  },
  {
    label: "칸마다 byte를 곱합니다",
    summary: `× 2 bytes = ${sizeGb(2)}GB`,
    note: "FP16은 scalar 하나에 2 bytes를 씁니다. 102억 4천만 × 2 = 204억 8천만 bytes이고, 1GB를 10억 bytes로 세면 raw payload는 20.48GB입니다.",
  },
  {
    label: "dtype만 바꾸면",
    summary: `${sizeGb(4)} · ${sizeGb(2)} · ≈${sizeGb(1)}GB`,
    note: "칸 수는 그대로 두고 byte만 바꾼 계산입니다. FP32는 두 배인 40.96GB, int8 payload는 약 1 byte라 약 10.24GB입니다. Quantization 뒤에는 같은 retrieval validation을 다시 해야 합니다.",
  },
  {
    label: "실제 index는 더해서 잽니다",
    summary: "raw + ANN + meta = 실측",
    note: "실제 index에는 ANN graph와 ID·revision·replica 같은 metadata가 더해집니다. 글은 이 둘의 크기를 정하지 않으므로 점선 칸의 폭은 크기가 아닙니다. 실제 RSS와 disk는 raw보다 크거나 compression으로 작을 수 있어 build 결과를 receipt에 실측값으로 남깁니다.",
  },
] as const;

function Grid({ highlight }: { highlight: boolean }) {
  const rows = 6;
  const cols = 12;
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center text-[11px] text-muted-foreground">
        <span className="font-mono font-bold text-foreground">M</span>
        <span>1천만 행</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-center text-[11px] text-muted-foreground"><span className="font-mono font-bold text-foreground">d</span> = 1,024열</div>
        <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} aria-hidden>
          {Array.from({ length: rows * cols }, (_, index) => (
            <span key={index} className="h-3 rounded-[2px] border" style={{ borderColor: "#94a3b8", backgroundColor: highlight ? "#2563eb" : "transparent", opacity: highlight ? 0.75 : 1 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SizeBar({ label, gb, approx, strong }: { label: string; gb: number; approx: boolean; strong: boolean }) {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(gb / MAX_GB) * 100}%`, backgroundColor: strong ? "#2563eb" : "#64748b" }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{approx ? "≈" : ""}{gb}GB</span>
    </div>
  );
}

export default function IndexSizeViz() {
  return (
    <SceneShell
      eyebrow="Index 크기"
      title="1천만 × 1,024 × 2 bytes가 20.48GB가 되는 길"
      description="본문 해석의 예시 값(1천만 vector, 1,024 dimension, FP16)을 행·열 격자와 byte 곱셈으로 따라갑니다."
      ariaLabel="vector 수와 dimension, dtype byte를 곱해 raw index 크기를 구하는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <Grid highlight={active >= 1} />
          <div className="space-y-2">
            {DTYPES.map((dtype) => {
              const shown = active === 2 || (active !== 0 && dtype.bytes === 2);
              return (
                <div key={dtype.name} className={shown ? "" : "invisible"}>
                  <SizeBar label={dtype.name} gb={sizeGb(dtype.bytes)} approx={dtype.approx} strong={dtype.bytes === 2} />
                </div>
              );
            })}
          </div>
          <div className={`grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-center text-xs leading-5 ${active === 3 ? "" : "invisible"}`}>
            <div className="rounded-lg border px-1 py-2" style={{ borderColor: "#2563eb" }}>
              <span className="block font-bold">raw</span>
              <span className="font-mono">{sizeGb(2)}GB</span>
            </div>
            <div className="rounded-lg border border-dashed px-1 py-2" style={{ borderColor: "#94a3b8" }}>
              <span className="block font-bold">+ ANN graph</span>
              <span className="text-muted-foreground">크기 미정</span>
            </div>
            <div className="rounded-lg border border-dashed px-1 py-2" style={{ borderColor: "#94a3b8" }}>
              <span className="block font-bold">+ metadata</span>
              <span className="text-muted-foreground">크기 미정</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
