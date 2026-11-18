import SceneShell from "../../reth-net/viz/SceneShell";

/**
 * 본문 대응: #experiment 마지막 문단 — 각 run은 한 경계만 바꾼다.
 * Discovery 알고리즘·handshake 구현·queue 설정·NIC 조건을 한꺼번에 바꾸면 첫 divergence를 찾을 수 없다.
 * 칸과 변경의 연결은 본문 표에서 온다: Candidate corpus → dial 순서, Handshake → identity·capability·Status,
 * Network config → queue, Runtime(NIC) → timeout·순서. Handshake 칸에서 처음 달라졌다는 설정은 그림용 가정이다.
 */
const STAGES = ["후보·dial", "Handshake", "Active", "자료·queue"] as const;

type Cell = "same" | "diff" | "skip" | "unknown";

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  changes: readonly string[];
  cells: readonly Cell[];
  candidateText: readonly string[];
  causes: readonly (readonly string[])[];
}[] = [
  {
    label: "아무것도 바꾸지 않음",
    summary: "두 trace가 칸마다 같음",
    note: "Base와 candidate에 같은 peer·capability·Status·message 입력을 따로 재생합니다. 아무것도 바꾸지 않았다면 네 칸의 결과가 모두 같아야 합니다.",
    changes: [],
    cells: ["same", "same", "same", "same"],
    candidateText: ["같은 dial", "eth/67 · PASS", "active 1", "같은 accepted"],
    causes: [[], [], [], []],
  },
  {
    label: "한 경계만 바꿈",
    summary: "Capability → 첫 divergence는 Handshake 칸",
    note: "겹치지 않는 eth version 하나만 바꾸면 Handshake 칸에서 NoSharedCapabilities로 끝나고, 뒤 칸은 시작하지 않습니다. 바꾼 입력이 하나뿐이라 달라진 칸의 원인도 하나로 정해집니다.",
    changes: ["겹치지 않는 eth version"],
    cells: ["same", "diff", "skip", "skip"],
    candidateText: ["같은 dial", "NoShared\u200bCapabilities", "Status 시작 안 함", "자료 없음"],
    causes: [[], ["eth version"], [], []],
  },
  {
    label: "네 가지를 한꺼번에",
    summary: "달라진 칸마다 원인 후보가 여럿",
    note: "네 가지를 함께 바꾸면 dial 순서부터 달라질 수 있습니다. Handshake 칸이 처음 달라져도(가정) handshake 구현과 NIC의 timeout·순서 차이가 모두 후보라 원인을 가를 수 없습니다.",
    changes: ["Discovery 알고리즘", "handshake 구현", "queue 설정", "NIC 조건"],
    cells: ["unknown", "unknown", "unknown", "unknown"],
    candidateText: ["다를 수 있음", "다를 수 있음", "다를 수 있음", "다를 수 있음"],
    causes: [["Discovery", "NIC"], ["handshake", "NIC"], ["앞 칸 결과"], ["queue", "NIC"]],
  },
];

const CELL_STYLE: Record<Cell, string> = {
  same: "border-border",
  diff: "border-[#d97706] bg-[#d97706]/10",
  skip: "border-dashed border-border text-muted-foreground",
  unknown: "border-dashed border-[#dc2626]",
};

const CELL_TAG: Record<Cell, string> = {
  same: "같음",
  diff: "첫 divergence",
  skip: "도달 안 함",
  unknown: "원인 불명",
};

export default function FirstDivergenceViz() {
  return (
    <SceneShell
      eyebrow="한 run에 한 경계"
      title="바꾼 입력이 하나여야 처음 달라진 칸의 원인이 보입니다"
      description="위 줄은 기준 구현(base), 아래 줄은 변경판(candidate)이 같은 연결을 재생한 결과입니다. 처음 결과가 달라진 칸을 첫 divergence라고 부릅니다."
      ariaLabel="한 경계만 바꾼 run과 네 가지를 한꺼번에 바꾼 run의 base·candidate trace 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3 text-xs">
            <div className="flex min-h-[3.5rem] flex-wrap content-start items-center gap-1.5">
              <span className="font-bold text-muted-foreground">바꾼 입력</span>
              {scene.changes.length === 0 ? (
                <span className="rounded border border-border px-2 py-0.5 text-muted-foreground">없음</span>
              ) : (
                scene.changes.map((change) => (
                  <span key={change} className="rounded border border-[#d97706] px-2 py-0.5 font-semibold text-amber-800 dark:text-amber-300">{change}</span>
                ))
              )}
            </div>
            <div className="grid grid-cols-[3.4rem_repeat(4,minmax(0,1fr))] gap-1 sm:grid-cols-[5.5rem_repeat(4,minmax(0,1fr))] sm:gap-2">
              <span />
              {STAGES.map((stage) => (
                <span key={stage} className="break-keep text-center text-[10px] font-bold text-muted-foreground sm:text-xs">{stage}</span>
              ))}
              <span className="self-center font-mono text-[9px] font-bold sm:text-[10px]">base</span>
              {STAGES.map((stage, index) => (
                <div key={stage} className="min-w-0 rounded border border-border px-1 py-2 text-center text-[10px] leading-4 sm:text-xs">
                  {["기준 dial", "eth/67 · PASS", "active 1", "accepted"][index]}
                </div>
              ))}
              <span className="self-center font-mono text-[9px] font-bold sm:text-[10px]">candidate</span>
              {STAGES.map((stage, index) => (
                <div key={stage} className={`min-w-0 rounded border px-0.5 py-2 text-center text-[9px] leading-[0.875rem] sm:px-1 sm:text-xs sm:leading-4 ${CELL_STYLE[scene.cells[index]]}`}>
                  <span className="block break-keep">{scene.candidateText[index]}</span>
                  <span className="mt-1 block break-keep text-[8px] font-bold sm:text-[10px]">{CELL_TAG[scene.cells[index]]}</span>
                </div>
              ))}
              <span className="self-start pt-1 text-[10px] font-bold text-muted-foreground">원인 후보</span>
              {STAGES.map((stage, index) => (
                <div key={stage} className="min-h-[2.75rem] min-w-0 space-y-0.5 pt-1 text-center text-[10px] leading-4">
                  {scene.causes[index].map((cause) => (
                    <span key={cause} className={`block break-keep ${scene.causes[index].length > 1 || scene.changes.length > 1 ?"text-red-700 dark:text-red-400" : "text-amber-800 dark:text-amber-300"}`}>{cause}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
