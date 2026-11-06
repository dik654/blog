import CellRow, { type CellTone } from "./CellRow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — i = y×width + x와 i < width×height 검사가 축별 검사와 달라지는 자리.
 * 숫자는 본문의 64×1, 1024×1024, block 16뿐입니다. 비정렬 폭은 본문에 값이 없어 width·k 기호로 적고,
 * 칸 수는 설명용입니다. (width+k, 0)과 (k, 1)은 모두 i = width + k입니다.
 */
const WIDTH_CELLS = 37;
const RUN_CELLS = 48;
const TOTAL_CELLS = 74;
const K = 3;
const OUTSIDE = WIDTH_CELLS + K;

interface Scene {
  label: string;
  summary: string;
  note: string;
  kind: "single" | "grid";
  run: number;
  a?: boolean;
  b?: boolean;
  axis?: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "64×1", summary: "0 × 64 + 37 = 37", kind: "single", run: 64, note: "width 64·height 1, block 64×1로 놓으면 37번은 x=37·y=0입니다. 번호와 위치가 같고 폭 밖의 칸도 없습니다. i는 2차원 번호를 한 줄로 편 주소입니다." },
  { label: "줄이 둘이면", summary: "1 × width + k = width + k", kind: "grid", run: WIDTH_CELLS, b: true, note: "둘째 줄의 x=k는 윗줄 width칸을 지나 주소 width + k가 됩니다. k는 작은 x 값을 가리키는 기호입니다." },
  { label: "폭이 안 떨어지면", summary: "x = width + k, y = 0 → 같은 식", kind: "grid", run: RUN_CELLS, a: true, note: "비정렬 폭은 block 폭의 배수가 아닌 폭입니다. launch는 block을 통째로 세므로 x가 width를 넘는 회색 칸이 생길 수 있습니다. 그 i = width + k는 width×height보다 작아 원본 검사를 통과합니다." },
  { label: "같은 칸으로 모임", summary: "(width + k, 0)과 (k, 1) → 같은 i", kind: "grid", run: RUN_CELLS, a: true, b: true, note: "폭 밖의 작업과 둘째 줄의 작업이 같은 출력 칸을 가리킵니다. 이 덧셈은 i로만 배열을 고르므로 같은 값을 다시 씁니다." },
  { label: "축별로 검사하면", summary: "x ≥ width → 제외", kind: "grid", run: RUN_CELLS, a: true, b: true, axis: true, note: "x<width와 y<height를 각각 검사하면 폭 밖의 칸은 제외되고 그 출력 칸은 (k, 1)만 씁니다. 크기를 바꿔 실제로 수정할 때는 축별 경계와 launch를 함께 검증합니다." },
];

function gridTone(scene: Scene, row: number) {
  return (x: number): CellTone => {
    if (x >= RUN_CELLS) return "off";
    if (row === 0 && x === OUTSIDE && scene.a) return scene.axis ? "bad" : "hot";
    if (row === 1 && x === K && scene.b) return "hot";
    if (x >= WIDTH_CELLS) return scene.run === RUN_CELLS ? "dim" : "off";
    return "on";
  };
}

export default function BoundsCheckViz() {
  return (
    <SceneShell
      eyebrow="2차원 번호와 경계"
      title="i < width×height 검사는 언제 축별 검사와 달라질까요"
      description="칸 하나가 작업 하나이고 칸 수와 줄 2개는 설명용 가정입니다. 회색 칸은 폭 밖이지만 block 때문에 생기는 칸입니다."
      ariaLabel="1차원 주소 계산과 비정렬 폭에서 원본 검사와 축별 검사의 차이"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        if (scene.kind === "single") {
          return (
            <div className="space-y-1">
              <p className="text-xs font-semibold">y=0 · x 0–63</p>
              <CellRow count={64} tone={(x) => (x === 37 ? "hot" : "on")} height="h-7" />
              <p className="pt-2 font-mono text-xs">a[37] = b[37] + c[37]</p>
            </div>
          );
        }
        return (
          <div className="min-w-0 space-y-1">
            <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-1 font-mono text-xs">
              <span />
              <div className="relative h-4 text-muted-foreground">
                <span className="absolute left-0">x=0</span>
                <span className="absolute -translate-x-1/2" style={{ left: `${(WIDTH_CELLS / RUN_CELLS) * 100}%` }}>width</span>
              </div>
              <span>y=0</span>
              <CellRow count={RUN_CELLS} tone={gridTone(scene, 0)} height="h-6" />
              <span>y=1</span>
              <CellRow count={RUN_CELLS} tone={gridTone(scene, 1)} height="h-6" />
            </div>
            <p className="pt-2 text-xs font-semibold">1차원 출력 배열 a · width×height칸</p>
            <CellRow count={TOTAL_CELLS} tone={(i) => (i === OUTSIDE && (scene.a || scene.b) ? "hot" : "soft")} height="h-5" />
            <p className="pt-1 font-mono text-xs font-bold">
              {scene.axis ? "x<width && y<height → (k, 1)만" : scene.a && scene.b ? "a[width + k] ← 두 작업" : scene.a ? "a[width + k] ← (width + k, 0)" : "a[width + k] ← (k, 1)"}
            </p>
          </div>
        );
      }}
    />
  );
}
