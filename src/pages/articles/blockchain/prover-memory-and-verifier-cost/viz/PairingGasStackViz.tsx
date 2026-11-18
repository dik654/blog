import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — EIP-1108 요율(2026-10-04 확인)로 원시 연산 gas만 쌓는다.
 * 페어링 검사 34,000k + 45,000, k = 4 → 181,000.
 * 공개 입력마다 ECMUL 6,000 + ECADD 150 = 6,150(검증기 구성 가정).
 * 입력 3개: +18,450 → 199,450. 입력 8개: +49,200 → 230,200(3개보다 +30,750).
 */
const BASE = 45000;
const PER_PAIR = 34000;
const PAIRS = 4;
const PER_INPUT = 6150;
const SCALE = 240000;

type Block = { key: string; gas: number; color: string };

const SCENES = [
  {
    label: "페어링 검사 k = 4",
    summary: "45,000 + 4 × 34,000 = 181,000gas",
    inputs: 0,
    rest: false,
    note: "회색 칸은 쌍 수와 무관한 고정분 45,000gas, 파란 칸 하나가 페어링쌍 하나의 34,000gas입니다. 네 쌍이면 181,000gas입니다.",
  },
  {
    label: "공개 입력 3개",
    summary: "+ 3 × 6,150 = 199,450gas",
    inputs: 3,
    rest: false,
    note: "공개 입력 하나마다 스칼라곱(6,000) 1회와 점덧셈(150) 1회를 하는 검증기 구성을 가정했습니다. 주황 칸 세 개가 18,450gas입니다.",
  },
  {
    label: "공개 입력 8개",
    summary: "+ 8 × 6,150 = 230,200gas",
    inputs: 8,
    rest: false,
    note: "페어링 칸은 그대로이고 주황 칸만 다섯 개 늘어 30,750gas가 추가됩니다. 증거의 군 원소 수가 같아도 공개 입력이 늘면 이 부분이 커질 수 있습니다.",
  },
  {
    label: "막대 밖의 비용",
    summary: "199,450gas ≠ 전체 거래 가스",
    inputs: 3,
    rest: true,
    note: "막대는 두 원시 연산만 셉니다. 호출·메모리·입력검사·ABI·calldata·기본 거래 비용과 구현상의 추가 연산은 크기를 정하지 않았으므로 축 위에 그리지 않았습니다.",
  },
] as const;

const blocksFor = (inputs: number): Block[] => [
  { key: "base", gas: BASE, color: "#94a3b8" },
  ...Array.from({ length: PAIRS }, (_, i) => ({ key: `pair-${i}`, gas: PER_PAIR, color: "#2563eb" })),
  ...Array.from({ length: inputs }, (_, i) => ({ key: `input-${i}`, gas: PER_INPUT, color: "#d97706" })),
];

const LEGEND = [
  { color: "#94a3b8", label: "고정분 45,000" },
  { color: "#2563eb", label: "페어링쌍 1개 34,000" },
  { color: "#d97706", label: "공개 입력 1개 6,150" },
] as const;

export default function PairingGasStackViz() {
  return (
    <SceneShell
      eyebrow="원시 연산 gas"
      title="페어링 칸은 고정되고 공개 입력 칸만 늘어납니다"
      description="gas는 Ethereum 실행 규칙이 정한 비용 단위입니다. 회색과 파란 칸은 페어링 검사 한 번의 고정분과 쌍마다 붙는 몫이고, 주황 칸은 공개 입력 하나의 연산 요율입니다. 2026-10-04에 확인한 EIP-1108 BN254 요율표를 썼습니다. 다른 체인·곡선·이후 요율에는 그대로 적용되지 않습니다."
      ariaLabel="페어링 4쌍과 공개 입력 3개 또는 8개의 원시 연산 gas 누적 막대"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const blocks = blocksFor(scene.inputs);
        const sum = blocks.reduce<number>((acc, block) => acc + block.gas, 0);
        return (
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {LEGEND.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>
            <div className="flex h-9 min-w-0 overflow-hidden rounded-sm bg-muted/40">
              {blocks.map((block) => (
                <div
                  key={block.key}
                  className="h-full border-r border-white"
                  style={{ width: `${(block.gas / SCALE) * 100}%`, backgroundColor: block.color }}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>0</span>
              <span>120,000</span>
              <span>240,000gas</span>
            </div>
            <p className="mt-3 text-right font-mono text-sm font-bold">합계 {sum.toLocaleString("en-US")}gas</p>
            <div
              className={`mt-3 rounded-md border border-dashed px-3 py-2 text-xs leading-5 ${
                scene.rest ? "border-red-600 text-red-700 dark:text-red-400" : "border-border/50 text-muted-foreground/50"
              }`}
            >
              축 밖: 호출·메모리·입력검사·ABI·calldata·기본 거래 비용 — 크기 미정
            </div>
          </div>
        );
      }}
    />
  );
}
