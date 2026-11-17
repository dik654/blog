import SceneShell from "./SceneShell";

/**
 * 본문 대응: #assignment-artifact 첫째 문단과 density 식.
 * 보조 변수 100개 중 A query가 24개만 쓰면 M_A = 24, ρ_A = 24/100 = 0.24.
 * 0인 항은 MSM에 보내지 않고, 빠진 nonzero term은 proof를 깨뜨린다.
 * 어느 칸이 1인지는 설명용 가정이다(i×37 mod 100 < 24인 칸).
 */
const N_AUX = 100;
const ACTIVE = Array.from({ length: N_AUX }, (_, i) => (i * 37) % 100 < 24);
const M_A = ACTIVE.filter(Boolean).length;
const DROPPED = ACTIVE.indexOf(true);

const SCENES = [
  {
    label: "보조 변수 100칸",
    summary: `N_aux = ${N_AUX}`,
    note: "회로를 실행하면 비공개 보조 변수(auxiliary assignment)가 정해진 순서로 채워집니다. 칸 하나가 변수 하나이고, 이 예에서는 100칸입니다.",
  },
  {
    label: "A query가 쓰는 칸",
    summary: `density bit 1 = ${M_A}칸`,
    note: "Density tracker는 A query가 실제로 쓰는 위치에 1을 표시합니다. 어느 칸이 1인지는 회로마다 다르며, 여기 24칸의 위치는 설명용 가정입니다.",
  },
  {
    label: "MSM에는 24항만",
    summary: `M_A = ${M_A} · ρ_A = ${(M_A / N_AUX).toFixed(2)}`,
    note: "0인 76칸은 MSM으로 보내지 않습니다. 결과는 그대로이고 scalar-point 곱 76번을 건너뜁니다. ρ_A=0.24는 성능 입력일 뿐 security parameter가 아닙니다.",
  },
  {
    label: "1인 칸을 빠뜨리면",
    summary: "nonzero 항 누락 → proof 깨짐",
    note: "1인 칸 하나가 MSM에서 빠졌는데 그 칸의 항이 0이 아니었다면, 그 nonzero 항이 사라져 proof가 깨집니다. 그래서 density bit와 query vector index는 같은 circuit synthesis 순서를 써야 합니다.",
  },
] as const;

function Cell({ i, active }: { i: number; active: number }) {
  const on = ACTIVE[i];
  const dropped = active === 3 && i === DROPPED;
  const lit = active >= 1 && on && !dropped;
  const faded = active >= 2 && !on;
  return (
    <div
      className={`flex aspect-square items-center justify-center rounded-[3px] border text-[9px] font-mono ${
        dropped ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : lit ? "border-blue-600 text-white" : "border-border text-muted-foreground"
      } ${faded ? "opacity-25" : ""}`}
      style={lit ? { backgroundColor: "#2563eb" } : undefined}
    >
      {dropped ? "✕" : active >= 1 ? (on ? "1" : "0") : ""}
    </div>
  );
}

export default function DensityMaskViz() {
  return (
    <SceneShell
      eyebrow="Density map"
      title="A query가 쓰는 칸만 골라 MSM에 보냅니다"
      description="MSM(multi-scalar multiplication)은 여러 타원곡선 점에 각각 scalar를 곱해 모두 더하는 계산입니다. 칸 하나가 보조 변수 하나이며, 1인 칸의 위치는 설명용 가정입니다."
      ariaLabel="보조 변수 100칸 중 density bit가 1인 24칸만 MSM에 보내는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_6.5rem] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_10rem] sm:gap-4">
          <div className="mx-auto grid w-full max-w-[15rem] grid-cols-10 gap-1 sm:max-w-[17rem]">
            {ACTIVE.map((_, i) => (
              <Cell key={i} i={i} active={active} />
            ))}
          </div>
          <div className={`min-w-0 rounded-lg border p-2 text-center text-xs leading-5 sm:p-3 ${active === 3 ? "border-red-600" : active === 2 ? "border-primary" : "border-dashed border-border text-muted-foreground"}`}>
            <p className="font-bold">A-query MSM</p>
            <p className="mt-1 font-mono text-base font-bold">{active === 3 ? `${M_A - 1}항` : active === 2 ? `${M_A}항` : "—"}</p>
            <p className="mt-1">{active === 3 ? "한 항 누락 · proof 실패" : active === 2 ? "0인 76칸은 건너뜀" : "아직 보내지 않음"}</p>
          </div>
        </div>
      )}
    />
  );
}
