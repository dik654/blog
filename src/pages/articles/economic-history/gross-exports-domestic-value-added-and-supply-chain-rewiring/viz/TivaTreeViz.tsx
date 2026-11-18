import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 『TiVA 지표 안내서 2025년 판』의 분해를 이 글의 장부에 대응.
 * EXGR 100 = EXGR_DVA 60 + EXGR_FVA 40, EXGR_DVA 60 = EXGR_DDC 20 + EXGR_IDC 40 + EXGR_RIM 0.
 * 재수입분 0은 이 글의 장부일 뿐이고 안내서는 0을 가정하지 않습니다.
 */
type NodeId = "exgr" | "dva" | "fva" | "ddc" | "idc" | "rim";

const NODES: Record<NodeId, { code: string; name: string; value: string; meaning: string; depth: 0 | 1 | 2; color: string }> = {
  exgr: { code: "EXGR", name: "총수출", value: "100", meaning: "국경을 넘을 때 기록한 전체 가격", depth: 0, color: "#64748b" },
  dva: { code: "EXGR_DVA", name: "국내 부가가치", value: "60", meaning: "수출 업종만이 아니라 국내 경제 어디에서든 만들어져 수출된 가치", depth: 1, color: "#0f766e" },
  ddc: { code: "EXGR_DDC", name: "직접", value: "20", meaning: "수출 업종 자신이 더한 가치 (이 글의 조립)", depth: 2, color: "#2563eb" },
  idc: { code: "EXGR_IDC", name: "간접", value: "40", meaning: "그 수출에 들어간 다른 국내 상류 업종의 가치", depth: 2, color: "#0f766e" },
  rim: { code: "EXGR_RIM", name: "재수입", value: "0", meaning: "수출됐다가 외국 중간재에 들어가 수입품으로 돌아와 다시 수출에 쓰인 국내 가치", depth: 2, color: "#7c3aed" },
  fva: { code: "EXGR_FVA", name: "외국 부가가치", value: "40", meaning: "수출에 들어간 수입 중간재의 가치, 상류의 어느 외국 업종에서 왔든 포함", depth: 1, color: "#d97706" },
};

const ORDER: readonly NodeId[] = ["exgr", "dva", "ddc", "idc", "rim", "fva"];

const SCENES = [
  { label: "맨 위는 총수출입니다", summary: "EXGR 100", lit: ["exgr"], rimNote: false, note: "EXGR은 OECD TiVA 자료에서 총수출을 가리키는 이름입니다. 이 글의 장부에서는 100입니다." },
  { label: "국내와 외국으로 한 번 나눕니다", summary: "60 + 40 = 100", lit: ["exgr", "dva", "fva"], rimNote: false, note: "총수출은 국내 부가가치 EXGR_DVA 60과 외국 부가가치 EXGR_FVA 40으로 나뉩니다. 3절의 국내 60·외국 40과 같은 갈림입니다." },
  { label: "국내 몫을 다시 셋으로 나눕니다", summary: "20 + 40 + 0 = 60", lit: ["exgr", "dva", "fva", "ddc", "idc", "rim"], rimNote: false, note: "국내 부가가치는 직접(EXGR_DDC) 20, 간접(EXGR_IDC) 40, 재수입(EXGR_RIM) 0으로 나뉩니다. 2절의 국내 직접가치·국내 간접가치가 앞의 두 칸입니다." },
  { label: "재수입 칸은 이 장부에서만 0입니다", summary: "실제 자료는 따로 확인", lit: ["exgr", "dva", "fva", "ddc", "idc", "rim"], rimNote: true, note: "재수입분은 국내 가치가 나라 밖을 한 바퀴 돌아 다시 수출에 쓰인 몫입니다. 이 글의 장부는 0으로 두었지만 안내서는 0을 가정하지 않으므로 실제 자료에서는 EXGR_RIM도 따로 확인해야 합니다." },
] as const;

export default function TivaTreeViz() {
  return (
    <SceneShell
      eyebrow="지표 이름 대응"
      title="총수출 100이 TiVA 지표 이름으로 갈라지는 모양"
      description="들여쓴 칸은 그보다 덜 들여쓴 가장 가까운 위 칸을 나눈 부분입니다(EXGR_FVA는 EXGR_RIM이 아니라 EXGR을 나눈 칸). 값은 이 글의 설명용 장부이고, 지표 이름과 뜻은 본문이 인용한 OECD 안내서의 것입니다."
      ariaLabel="EXGR 100이 EXGR_DVA 60과 EXGR_FVA 40으로, EXGR_DVA가 EXGR_DDC 20, EXGR_IDC 40, EXGR_RIM 0으로 나뉘는 구조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <ul className="min-w-0 space-y-2">
            {ORDER.map((id) => {
              const node = NODES[id];
              const lit = (scene.lit as readonly string[]).includes(id);
              const indent = node.depth === 0 ? "" : node.depth === 1 ? "ml-3 sm:ml-6" : "ml-6 sm:ml-12";
              const highlight = scene.rimNote && id === "rim";
              return (
                <li
                  key={id}
                  className={`${indent} min-w-0 rounded-lg border-l-2 border-y border-r px-3 py-2 transition-opacity duration-300 motion-reduce:transition-none ${lit ? "opacity-100" : "opacity-25"} ${highlight ? "border-dashed" : ""}`}
                  style={{ borderLeftColor: node.color, borderTopColor: highlight ? "#7c3aed" : "#94a3b866", borderRightColor: highlight ? "#7c3aed" : "#94a3b866", borderBottomColor: highlight ? "#7c3aed" : "#94a3b866" }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="text-sm font-semibold">
                      <span className="font-mono text-xs" style={{ color: node.color }}>{node.code}</span> {node.name}
                    </span>
                    <span className="font-mono text-sm font-bold">{node.value}</span>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">{node.meaning}</p>
                </li>
              );
            })}
          </ul>
        );
      }}
    />
  );
}
