import CellRow, { type CellTone } from "./CellRow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — ROCm 7.0 HIP 문서의 warpSize: gfx9 = 64, gfx10 이상 = 32. ISA의 wave64와 runtime 지원은 다른 층.
 * 37번 위치: 64단위면 묶음 0·위치 37, 32단위면 37 − 32 = 5이므로 묶음 1·위치 5.
 */
const mark37 = (id: number): CellTone => (id === 37 ? "hot" : "on");

const SCENES = [
  { label: "gfx9", summary: "warpSize 64 → 묶음 0·위치 37", note: "ROCm 7.0의 HIP 문서는 gfx9의 warpSize를 64로 설명합니다. 64개가 한 묶음이므로 37번은 위치 37입니다." },
  { label: "gfx10 이상", summary: "warpSize 32 → 묶음 1·위치 5", note: "같은 문서는 gfx10 이상을 32로 설명합니다. 37 − 32 = 5이므로 같은 37번이 둘째 묶음의 위치 5가 됩니다." },
  { label: "표현과 지원", summary: "ISA ≠ 이 runtime", note: "ISA는 칩의 명령 규격이고 wave64는 64개 묶음입니다. RDNA ISA가 wave64를 표현할 수 있어도, 이 HIP runtime은 gfx10 이상에서 64를 지원하지 않는다고 명시합니다. 두 층을 구별합니다." },
  { label: "이식 코드에서는", summary: "상수 대신 warpSize 확인", note: "어느 target인지에 따라 값이 달라지므로 이식 코드에서는 상수 32나 64를 적지 않고 장치의 warpSize를 확인합니다." },
] as const;

function Target({ name, size, active }: { name: string; size: string; active: boolean }) {
  return (
    <div className={`rounded border px-3 py-2 text-xs leading-5 ${active ? "border-primary bg-primary/15 font-bold" : "border-border text-muted-foreground"}`}>
      <p>{name}</p>
      <p className="font-mono">warpSize {size}</p>
    </div>
  );
}

function Layer({ name, value, ok }: { name: string; value: string; ok: boolean }) {
  return (
    <div className={`flex flex-wrap items-baseline justify-between gap-x-3 rounded border px-3 py-2 text-xs leading-5 ${ok ? "border-border" : "border-dashed border-red-600"}`}>
      <span className="font-bold">{name}</span>
      <span className={ok ? "" : "font-semibold text-red-700 dark:text-red-400"}>{value}</span>
    </div>
  );
}

export default function WarpSizeTargetViz() {
  return (
    <SceneShell
      eyebrow="대상마다 다른 폭"
      title="같은 37번이 target에 따라 어느 묶음에 들어갈까요"
      description="ROCm 7.0의 HIP 문서 기준입니다. warpSize는 함께 진행하는 묶음의 폭이고, gfx9·gfx10은 칩 대상(target)의 이름입니다. 칸 하나가 작업 하나, 표시한 칸이 37번입니다."
      ariaLabel="gfx9와 gfx10 이상의 warpSize에 따른 37번 작업의 위치, ISA와 runtime의 구별, warpSize 확인"
      scenes={SCENES}
      render={(index) => {
        if (index === 2) {
          return (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">gfx10 이상의 wave64</p>
              <Layer name="RDNA ISA" value="wave64 표현 가능" ok />
              <Layer name="ROCm 7.0 HIP runtime" value="64 지원하지 않음" ok={false} />
            </div>
          );
        }
        if (index === 3) {
          return (
            <div className="space-y-2">
              <p className="rounded border border-dashed border-red-600 px-3 py-2 font-mono text-xs text-red-700 dark:text-red-400">묶음 폭 = 32 (상수)</p>
              <p className="rounded border border-primary bg-primary/15 px-3 py-2 font-mono text-xs">묶음 폭 = warpSize (장치 값)</p>
              <div className="grid grid-cols-2 gap-2">
                <Target name="gfx9" size="64" active />
                <Target name="gfx10 이상" size="32" active />
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Target name="gfx9" size="64" active={index === 0} />
              <Target name="gfx10 이상" size="32" active={index === 1} />
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold">{index === 0 ? "묶음 0 · 작업 0–63" : "묶음 0 · 0–31 | 묶음 1 · 32–63"}</p>
              <CellRow count={64} tone={mark37} splitAt={index === 0 ? undefined : 32} height="h-7" />
            </div>
          </div>
        );
      }}
    />
  );
}
