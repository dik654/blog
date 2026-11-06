import SceneShell from "./SceneShell";

/**
 * 본문 대응: #placement — mesh 좌표(TP 그룹 a·b의 rank 0–7)를 물리 GPU에 대응시키는 일.
 * 맞는 배치: node 0 = a0–a7, node 1 = b0–b7. 틀린 배치: 두 그룹이 두 node에 네 장씩.
 */
const RANKS = Array.from({ length: 8 }, (_, rank) => rank);
const LABELS_A = RANKS.map((rank) => `a${rank}`);
const LABELS_B = RANKS.map((rank) => `b${rank}`);

const LAYOUTS = {
  unknown: [Array.from({ length: 8 }, () => "?"), Array.from({ length: 8 }, () => "?")],
  gathered: [LABELS_A, LABELS_B],
  scattered: [[...LABELS_A.slice(0, 4), ...LABELS_B.slice(0, 4)], [...LABELS_A.slice(4), ...LABELS_B.slice(4)]],
} as const;

const SCENES = [
  { label: "mesh는 좌표일 뿐입니다", summary: "TP 그룹 둘 × 8 rank", note: "격자에는 어느 GPU인지가 적혀 있지 않습니다. 좌표마다 물리 GPU를 정하는 일이 shard placement입니다.", layout: "unknown", link: "아직 정하지 않음" },
  { label: "한 node에 모으면", summary: "all-reduce는 NVSwitch 안", note: "all-reduce는 그룹 안 GPU가 tensor를 합쳐 나눠 갖는 통신입니다. 그룹마다 한 node에 있으면 이 통신이 node 안에서 끝납니다.", layout: "gathered", link: "all-reduce 안 건넘" },
  { label: "네 장씩 흩어지면", summary: "all-reduce가 InfiniBand로", note: "layer마다의 all-reduce가 InfiniBand를 건넙니다. node마다 replica를 두는 후보 C(TP 8 × DP 2)도 이렇게 걸치면 통신량이 후보 A(TP 16)와 같아집니다.", layout: "scattered", link: "all-reduce가 건넘" },
] as const;

function Cell({ label }: { label: string }) {
  const tone = label.startsWith("a") ? "border-[#2563eb] bg-[#2563eb]/15 text-[#2563eb]" : label.startsWith("b") ? "border-[#d97706] bg-[#d97706]/15 text-[#b45309]" : "border-dashed border-border text-muted-foreground";
  return <span className={`flex h-6 items-center justify-center rounded border font-mono text-xs font-semibold ${tone}`}>{label}</span>;
}

export default function PlacementMapViz() {
  return (
    <SceneShell
      eyebrow="Shard placement"
      title="같은 TP 8 × 2 mesh가 물리 GPU 위에서는 전혀 다른 통신이 됩니다"
      description="a·b는 TP 그룹, 숫자는 그룹 안 번호(rank)입니다. 상자 하나가 8장짜리 node입니다."
      ariaLabel="mesh 좌표를 두 node의 물리 GPU에 모아 놓은 경우와 흩어 놓은 경우"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const layout = LAYOUTS[scene.layout];
        const crossing = scene.layout === "scattered";
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2 sm:gap-6">
              {layout.map((cells, node) => (
                <div key={node} className="rounded-lg border border-border px-2 pb-2 pt-1.5">
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">node {node} · NVSwitch</p>
                  <div className="grid grid-cols-4 gap-1">
                    {cells.map((label, cell) => <Cell key={cell} label={label} />)}
                  </div>
                </div>
              ))}
            </div>
            <p className={`mt-2 rounded-md border px-2 py-1 text-center text-xs font-semibold ${crossing ? "border-[#dc2626] text-[#dc2626]" : "border-border text-muted-foreground"}`}>
              InfiniBand: {scene.link}
            </p>
          </div>
        );
      }}
    />
  );
}
