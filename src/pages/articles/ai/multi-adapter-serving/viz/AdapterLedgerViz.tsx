import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * rank 16 LoRA 하나의 크기를 행렬 → 층 → 모델 → adapter 1,000개로 키워 가며 센다.
 * 한 mechanism: adapter 크기 = Σ(입력 폭 × r + r × 출력 폭) × 층 수 × 원소 byte.
 */
const SCENES = ["행렬 하나", "한 층의 네 행렬", "32층과 BF16", "adapter 1,000개"] as const;

interface MatrixRow {
  name: string;
  input: number;
  output: number;
}

const MATRICES: readonly MatrixRow[] = [
  { name: "q", input: 4096, output: 4096 },
  { name: "k", input: 4096, output: 1024 },
  { name: "v", input: 4096, output: 1024 },
  { name: "o", input: 4096, output: 4096 },
];
const RANK = 16;

function params(row: MatrixRow) {
  return row.input * RANK + RANK * row.output;
}

const NOTES = [
  "q 행렬의 A는 4,096×16, B는 16×4,096입니다. 두 장을 더하면 131,072개이고 원래 q 행렬 16,777,216개의 128분의 1입니다.",
  "k·v는 KV head 8개라 출력 폭이 1,024입니다. 그래서 B가 16×1,024로 작아지고 네 행렬 합은 한 층에 425,984개입니다.",
  "32층을 곱하면 13,631,488개, BF16 2 byte를 곱하면 27,262,976 byte입니다. 정확히 26 MiB입니다.",
  "base 16.0 GB(14.9 GiB) 옆에 adapter 하나는 0.17%입니다. 그러나 1,000개를 모두 올리면 26,000 MiB, 약 25.4 GiB가 되어 base보다 커집니다.",
] as const;

const BASE_BYTES = 16.0e9;
const ADAPTER_BYTES = 27_262_976;

export default function AdapterLedgerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const visibleRows = scene === 0 ? MATRICES.slice(0, 1) : MATRICES;
  const layerTotal = MATRICES.reduce((sum, row) => sum + params(row), 0);

  const bars = [
    { label: "base 8B · BF16", bytes: BASE_BYTES, color: "#64748b" },
    { label: "adapter 1개", bytes: ADAPTER_BYTES, color: "#0d9488" },
    { label: "adapter 1,000개", bytes: ADAPTER_BYTES * 1000, color: "#d97706" },
  ];
  const maxBytes = ADAPTER_BYTES * 1000;

  return (
    <VizFrame
      eyebrow="Adapter size ledger"
      title="adapter 하나는 작지만 고객 수만큼 곱하면 base를 넘습니다"
      description="1~3장면의 표는 한 층의 LoRA 행렬, 마지막 장면의 막대는 같은 눈금의 byte입니다."
      note="Llama 3 8B와 같은 모양(hidden 4,096, 32층, KV head 8)과 q·k·v·o에만 rank 16을 붙인 경우를 가정했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="LoRA adapter 크기 계산"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 min-h-[12.5rem]">
            {scene < 3 ? (
              <table className="w-full table-fixed border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="w-10 py-1.5 font-semibold">행렬</th>
                    <th className="py-1.5 font-semibold">A 모양</th>
                    <th className="py-1.5 font-semibold">B 모양</th>
                    <th className="py-1.5 text-right font-semibold">원소 수</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr key={row.name} className="border-b border-border/50">
                      <td className="py-1.5 font-bold text-foreground">{row.name}</td>
                      <td className="py-1.5">{row.input.toLocaleString()}×{RANK}</td>
                      <td className="py-1.5">{RANK}×{row.output.toLocaleString()}</td>
                      <td className="py-1.5 text-right text-foreground">{params(row).toLocaleString()}</td>
                    </tr>
                  ))}
                  {scene >= 1 ? (
                    <tr>
                      <td className="py-1.5 font-bold text-primary" colSpan={3}>
                        {scene === 1 ? "한 층 합" : "× 32층 × 2 B"}
                      </td>
                      <td className="py-1.5 text-right font-bold text-primary">
                        {scene === 1
                          ? layerTotal.toLocaleString()
                          : "26 MiB"}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            ) : (
              <ol className="space-y-4">
                {bars.map((bar) => (
                  <li key={bar.label} className="min-w-0">
                    <div className="flex items-baseline justify-between gap-3 text-xs">
                      <span className="font-bold" style={{ color: bar.color }}>
                        {bar.label}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {bar.bytes >= 1e9
                          ? `${(bar.bytes / 2 ** 30).toFixed(1)} GiB`
                          : `${(bar.bytes / 2 ** 20).toFixed(0)} MiB`}
                      </span>
                    </div>
                    <div className="mt-1 h-5 rounded-sm bg-muted/60">
                      <div
                        className="h-full rounded-sm transition-[width] duration-500"
                        style={{
                          width: `${Math.max((bar.bytes / maxBytes) * 100, 0.8)}%`,
                          backgroundColor: bar.color,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
