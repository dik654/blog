import SceneShell from "./SceneShell";

/**
 * 본문 대응: #placement — cluster의 block은 같은 GPC에 함께 놓이지만 한 SM에 모두 놓인다는 뜻은 아니다.
 * GPC 2개, GPC당 SM 3개, block 8개, cluster 크기 4는 그림의 가정. portable 최대 8은 본문.
 */
type Layout = readonly (readonly (readonly string[])[])[];

interface ClusterScene {
  label: string;
  summary: string;
  note: string;
  layout: Layout;
}

const SCENES: readonly ClusterScene[] = [
  {
    label: "Cluster를 쓰지 않을 때",
    summary: "gridDim = block 8개",
    note: "Block은 자원에 여유가 있는 SM에 따로따로 배치됩니다. 같은 kernel의 block이어도 두 GPC에 흩어질 수 있습니다.",
    layout: [[["0", "5"], ["3"], ["6"]], [["1"], ["2", "7"], ["4"]]],
  },
  {
    label: "Cluster 크기 4 (가정)",
    summary: "gridDim은 여전히 block 8개",
    note: "같은 cluster의 block들은 같은 GPC에 함께 배치되도록 보장됩니다. 그러나 A 묶음이 GPC 0의 SM 세 곳에 나뉘어 있듯 한 SM에 모두 놓인다는 뜻은 아닙니다. GridDim은 cluster 수가 아니라 block 수입니다.",
    layout: [[["A0", "A2"], ["A1"], ["A3"]], [["B4"], ["B5", "B6"], ["B7"]]],
  },
  {
    label: "Portable 최대 크기",
    summary: "최대 block 8개 · 더 작을 수 있음",
    note: "공식 문서의 portable cluster 크기는 최대 block 8개이며 작은 장치나 분할 설정은 더 작을 수 있어 조회해야 합니다. Compute capability 9.0부터의 선택 기능이므로 모든 CUDA GPU의 기본 능력으로 가정하지 않습니다.",
    layout: [[["C0", "C1", "C2"], ["C3", "C4", "C5"], ["C6", "C7"]], [[], [], []]],
  },
];

const TONE: Record<string, string> = {
  A: "border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100",
  B: "border-amber-600 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  C: "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
};

export default function ClusterPlacementViz() {
  return (
    <SceneShell
      eyebrow="Block cluster의 배치"
      title="Cluster는 같은 GPC를 보장할 뿐 한 SM을 보장하지 않습니다"
      description="Cluster는 block 여러 개를 함께 배치하도록 묶는 선택적 상위 계층이고, GPC는 SM 여러 개를 묶은 상위 처리 구역입니다. 큰 칸이 GPC, 안쪽 줄이 SM, 작은 칸이 block이며 글자는 cluster, 숫자는 block 번호입니다."
      note="GPC 2개, GPC당 SM 3개, block 8개와 배치 위치는 그림의 가정입니다."
      ariaLabel="block cluster가 GPC와 SM에 놓이는 방식"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {scene.layout.map((gpc, gpcIndex) => (
              <div key={gpcIndex} className="min-w-0 rounded-lg border border-border p-2">
                <p className="mb-2 text-xs font-bold">GPC {gpcIndex}</p>
                <div className="space-y-2">
                  {gpc.map((sm, smIndex) => (
                    <div key={smIndex} className="rounded border border-dashed border-border px-1.5 py-1.5">
                      <p className="text-xs text-muted-foreground">SM {smIndex}</p>
                      <div className="mt-1 flex min-h-7 flex-wrap gap-1">
                        {sm.map((block) => (
                          <span key={block} className={`flex h-7 min-w-7 items-center justify-center rounded border px-1 font-mono text-xs font-semibold ${TONE[block.charAt(0)] ?? "border-border"}`}>
                            {block}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
