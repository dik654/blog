import SceneShell from "./SceneShell";

/**
 * 본문 대응: #graph-vs-megakernel — graph·megakernel 하나·경계 일부 남기기를 같은 operator 열에서 비교.
 * operator 열과 register 요구(128·96·128·40·40·40)는 그림용 가정. 각 kernel 의 register = 묶음 최대값.
 * warp = floor(65,536 ÷ (register × 32)): 128 → 16, 96 → 21, 40 → 51.
 */
const OPS: readonly { name: string; need: number }[] = [
  { name: "GEMM", need: 128 },
  { name: "attention", need: 96 },
  { name: "GEMM", need: 128 },
  { name: "norm", need: 40 },
  { name: "norm", need: 40 },
  { name: "norm", need: 40 },
];

const warps = (registers: number) => Math.floor(65536 / (registers * 32));

const SCENES: readonly { label: string; summary: string; note: string; groups: readonly (readonly number[])[] }[] = [
  { label: "CUDA graph", summary: "kernel 6개 · 경계 5개", groups: [[0], [1], [2], [3], [4], [5]], note: "Operator 마다 자기 register 를 그대로 씁니다. Launch 는 2.1 µs 에서 1.3 µs 로 줄지만 0 은 아니고, 경계마다의 tail 과 경계를 넘는 overlap 불가는 그대로입니다." },
  { label: "megakernel 하나", summary: "kernel 1개 · 경계 0개", groups: [[0, 1, 2, 3, 4, 5]], note: "Launch 는 forward 당 한 번이고 tail 은 마지막 task 에만 남습니다. 대신 norm 까지 128 을 잡아 warp 가 51개에서 16개로 줄고, counter 동기화와 code 크기 비용도 함께 집니다." },
  { label: "경계 하나 남김", summary: "kernel 2개 · 경계 1개", groups: [[0, 1, 2], [3, 4, 5]], note: "자원 모양이 다른 곳에서 자르면 뒤쪽 kernel 은 40 으로 launch 되어 norm 의 warp 51개가 돌아옵니다. 그 대가로 경계 하나만큼의 launch·tail 과 그 경계를 넘는 overlap 불가가 생깁니다." },
  { label: "자를지 판정", summary: "늘어난 비용 < 줄어든 손실 → 자름", groups: [[0, 1, 2], [3, 4, 5]], note: "늘어난 launch·tail 보다 줄어든 sync·register·shared-memory·code 손실이 크면 자르는 편이 낫습니다. 두 값의 크기는 측정으로만 얻으므로 막대로 그리지 않았습니다." },
];

export default function CutPointViz() {
  return (
    <SceneShell
      eyebrow="Cut point"
      title="경계를 남기면 kernel 마다 register 예산이 달라집니다"
      description="Cut point 는 kernel 경계를 남겨 자르는 자리입니다. 막대는 그 operator 가 실제로 필요한 register, 붉은 점선은 그 kernel 이 thread 마다 잡는 register, 아래 숫자는 SM 당 올라갈 수 있는 warp 수입니다."
      note="Operator 여섯 개와 register 값은 계산을 보여 주는 가정입니다. Warp 수는 register file 65,536 과 warp 당 thread 32개로 계산했습니다."
      ariaLabel="operator 여섯 개를 kernel 로 묶는 세 방식에서 register 예산과 warp 수가 달라지는 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="flex gap-1">
              {scene.groups.map((group, groupIndex) => {
                const budget = Math.max(...group.map((op) => OPS[op].need));
                return (
                  <div key={group[0]} className="min-w-0 rounded-md border border-primary/60 px-0.5 pb-1 pt-0.5" style={{ flex: group.length }}>
                    <p className="truncate text-center font-mono text-[10px] leading-4 text-primary">{scene.groups.length === 6 ? `K${groupIndex + 1}` : `kernel ${groupIndex + 1} · ${budget}`}</p>
                    <div className="flex gap-0.5">
                      {group.map((op) => (
                        <div key={op} className="min-w-0 flex-1">
                          <div className="flex h-20 flex-col justify-end rounded-sm border border-border/50">
                            <div className="relative" style={{ height: `${(budget / 128) * 100}%` }}>
                              <div className="absolute inset-x-0 bottom-0 rounded-sm" style={{ height: `${(OPS[op].need / budget) * 100}%`, backgroundColor: "#2563eb66" }} />
                              <div className="absolute inset-0 border-t border-dashed" style={{ borderColor: "#dc2626" }} />
                            </div>
                          </div>
                          <p className="mt-1 truncate text-center text-[10px] leading-3">{OPS[op].name}</p>
                          <p className="text-center font-mono text-[11px] font-bold leading-5">{warps(budget)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`mt-3 grid grid-cols-2 gap-2 text-center text-xs leading-5 ${active === 3 ? "" : "invisible"}`}>
              <div className="rounded-md border border-dashed px-2 py-1" style={{ borderColor: "#d97706" }}>
                <span className="font-bold">늘어난 비용</span><br />경계 1개의 launch·tail
              </div>
              <div className="rounded-md border border-dashed px-2 py-1" style={{ borderColor: "#059669" }}>
                <span className="font-bold">줄어든 손실</span><br />sync·register<br />shared memory·code
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
