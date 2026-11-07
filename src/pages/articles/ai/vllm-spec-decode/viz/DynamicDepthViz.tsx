import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #dynamic-policy — 배치 크기로 사용자 표를 조회한다.
 * 공식 예 [1,64,3],[65,128,1],[129,512,0] → 64:3, 65:1, 129:0.
 * [1,2,4],[4,6,1], 허용 깊이 3 → 3,3,3,1,1,1,1 (배치 3 빈 구간, 배치 7 마지막 이후).
 */
interface Scene extends ShellScene {
  batch: number | null;
  cells: readonly (number | null)[];
  pick: number | null;
}

const RAW: readonly (number | null)[] = [4, 4, null, 1, 1, 1, null];
const FILLED: readonly (number | null)[] = [4, 4, 4, 1, 1, 1, 1];
const CAPPED: readonly (number | null)[] = [3, 3, 3, 1, 1, 1, 1];

const SCENES: readonly Scene[] = [
  { label: "배치 64", summary: "K=3", batch: 64, cells: RAW, pick: null, note: "이번에 배정한 요청 수로 표를 조회합니다. 최근 수락률을 배워 최적 K를 계산하는 분기가 아닙니다." },
  { label: "배치 65", summary: "K=1", batch: 65, cells: RAW, pick: null, note: "요청 하나가 늘어 다음 구간으로 넘어갔습니다. 이 구간은 사용자가 넣는 정책의 예일 뿐 최적 경계가 아닙니다." },
  { label: "배치 129", summary: "K=0", batch: 129, cells: RAW, pick: null, note: "K=0이면 이 배치에서는 후보를 만들지 않습니다." },
  { label: "빈 자리 채우기", summary: "빈 구간·마지막 뒤 = 직전 K", batch: null, cells: FILLED, pick: null, note: "배치 3은 어느 구간에도 없고 배치 7은 마지막 구간 뒤입니다(가정한 표). 표를 펼치면서 둘 다 직전 K로 채웁니다." },
  { label: "허용 깊이 3 적용", summary: "배치 3 → 3 · 배치 7 → 1", batch: null, cells: CAPPED, pick: 3, note: "더 작은 값을 고르므로 4는 3으로 낮아지고 1은 그대로입니다. 배치 3은 3, 배치 7은 1을 받습니다." },
];

const BANDS = [
  { from: 1, to: 64, k: 3, width: 64, color: "#93c5fd" },
  { from: 65, to: 128, k: 1, width: 64, color: "#bfdbfe" },
  { from: 129, to: 512, k: 0, width: 384, color: "#cbd5e1" },
];
const BATCHES = [1, 2, 3, 4, 5, 6, 7];

export default function DynamicDepthViz() {
  return (
    <SceneShell
      eyebrow="배치 크기 → K 조회표"
      title="현재 배치 크기가 표의 어느 칸에 떨어지는지로 K가 정해집니다"
      description="위 띠는 공식 예제로 길이가 배치 범위에 비례합니다. 아래 칸은 빈 구간이 있는 가정한 표입니다. K는 한 바퀴의 후보 수입니다."
      ariaLabel="배치 크기에 따라 후보 깊이 K를 조회하는 표"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted-foreground">공식 예제 [1,64,3], [65,128,1], [129,512,0]</p>
            <div className={`mt-1.5 flex gap-px ${scene.batch === null ? "opacity-50" : ""}`}>
              {BANDS.map((band) => {
                const on = scene.batch !== null && scene.batch >= band.from && scene.batch <= band.to;
                return (
                  <div key={band.from} className="min-w-0" style={{ flex: `${band.width} 1 0` }}>
                    <div className="flex h-9 items-center justify-center rounded-sm font-mono text-xs font-bold text-[#0f172a]" style={{ backgroundColor: band.color, outline: on ? "1px solid #dc2626" : undefined, outlineOffset: 1 }}>
                      K={band.k}
                    </div>
                    <p className="mt-1 whitespace-nowrap text-center font-mono text-[10px] text-muted-foreground">{band.from}~{band.to}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-1 min-h-5 text-xs font-bold tabular-nums text-red-700 dark:text-red-400">
              {scene.batch === null ? " " : `배치 ${scene.batch} → ${scene.summary}`}
            </p>

            <p className="mt-3 text-xs font-bold text-muted-foreground">가정한 표 [1,2,4], [4,6,1]</p>
            <div className="mt-1.5 grid grid-cols-7 gap-1">
              {BATCHES.map((batch, index) => {
                const value = scene.cells[index];
                const picked = scene.pick !== null && (batch === 3 || batch === 7);
                return (
                  <div key={batch} className="min-w-0 text-center">
                    <span
                      className={`flex h-10 items-center justify-center rounded-md border font-mono text-sm font-bold ${
                        value === null
                          ? "border-dashed border-border text-muted-foreground"
                          : picked
                            ? "border-[#dc2626] bg-[#dc2626]/10"
                            : "border-[#2563eb] bg-[#2563eb]/15"
                      }`}
                    >
                      {value ?? "?"}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] text-muted-foreground">{batch}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">칸 안은 K, 칸 아래는 배치 크기입니다.</p>
          </div>
        );
      }}
    />
  );
}
