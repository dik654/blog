import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — ‘은행’의 후보(나무, 금융기관 지점들) → 지도 링크·통장 이야기·도심이
 * 금융기관을 남김 → 청자가 후보를 비교해 여섯 시에 갈 한 지점을 정함 →
 * 링크가 다른 지점을 가리키면 낱말보다 구체적인 단서와 충돌하므로 확인 질문.
 * 60 : 40은 3절의 설명용 가정. 지점 A·B 두 곳은 그림을 위한 가정.
 */
type CandidateState = "open" | "out" | "picked" | "link" | "conflict";

const CANDIDATES = [
  { key: "tree", name: "은행나무", kind: "나무" },
  { key: "a", name: "금융기관 지점 A", kind: "금융기관" },
  { key: "b", name: "금융기관 지점 B", kind: "금융기관" },
] as const;

const CUES = ["지도 링크", "통장 이야기", "도심이라는 장소"] as const;

const SCENES: readonly { label: string; summary: string; cues: boolean; states: readonly [CandidateState, CandidateState, CandidateState]; bottom: "ratio" | "narrow" | "picked" | "conflict"; note: string }[] = [
  {
    label: "낱말만 있을 때",
    summary: "후보 두 갈래",
    cues: false,
    states: ["open", "open", "open"],
    bottom: "ratio",
    note: "‘은행 앞에서 여섯 시에 만나’만 보면 나무와 금융기관이 모두 후보입니다. 3절의 가정에서는 맥락 없이 본 100명 중 60명이 금융기관, 40명이 나무를 떠올렸습니다. 지점이 A·B 두 곳이라는 것은 그림을 위한 가정입니다.",
  },
  {
    label: "단서가 후보를 지웁니다",
    summary: "금융기관만 남음",
    cues: true,
    states: ["out", "open", "open"],
    bottom: "narrow",
    note: "지도 링크, 통장 이야기, 도심이라는 장소가 함께 ‘은행’의 후보 가운데 금융기관을 남깁니다. 맥락이 해석을 얼마나 옮기는지 수치는 글에 없으므로 비율을 다시 적지 않았습니다.",
  },
  {
    label: "여섯 시에 갈 한 지점",
    summary: "청자가 A를 고름 (가정)",
    cues: true,
    states: ["out", "picked", "open"],
    bottom: "picked",
    note: "청자는 남은 후보를 비교해 여섯 시에 갈 한 지점을 정합니다. 낱말의 뜻을 아는 것과 실제로 갈 장소를 정하는 것은 다른 단계입니다.",
  },
  {
    label: "링크가 다른 지점을 가리키면",
    summary: "확인 질문",
    cues: true,
    states: ["out", "conflict", "link"],
    bottom: "conflict",
    note: "이번에는 링크가 청자가 고른 A가 아닌 B를 가리키는 경우를 가정해 봅니다. 청자가 고른 지점과 지도 링크가 가리키는 지점이 다르면,낱말보다 더 구체적인 단서와 충돌합니다. 이때는 추측으로 정하지 않고 확인 질문이 필요합니다.",
  },
];

const STATE_STYLE: Record<CandidateState, { border: string; bg: string; tag: string; dashed: boolean; dim: boolean }> = {
  open: { border: "#94a3b8", bg: "transparent", tag: "후보", dashed: false, dim: false },
  out: { border: "#94a3b8", bg: "transparent", tag: "단서와 맞지 않아 빠짐", dashed: true, dim: true },
  picked: { border: "#2563eb", bg: "#2563eb1a", tag: "청자가 고름", dashed: false, dim: false },
  link: { border: "#2563eb", bg: "#2563eb1a", tag: "지도 링크가 가리킴", dashed: false, dim: false },
  conflict: { border: "#dc2626", bg: "#dc26260f", tag: "청자가 고른 곳 · 링크와 다름", dashed: true, dim: false },
};

function Bottom({ kind }: { kind: "ratio" | "narrow" | "picked" | "conflict" }) {
  if (kind === "ratio") {
    return (
      <div className="min-w-0">
        <div className="flex h-6 w-full overflow-hidden rounded-md border border-border text-xs font-semibold">
          <div className="flex items-center justify-center" style={{ width: "40%", backgroundColor: "#16a34a26" }}>나무 40</div>
          <div className="flex items-center justify-center border-l border-border" style={{ width: "60%", backgroundColor: "#2563eb26" }}>금융기관 60</div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">맥락 없이 본 100명의 첫 연상 (3절의 가정)</p>
      </div>
    );
  }
  const text =
    kind === "narrow"
      ? "남은 후보: 금융기관. 아직 어느 지점인지는 정해지지 않았습니다."
      : kind === "picked"
        ? "청자: “여섯 시에 지점 A 앞으로 간다.”"
        : "청자: “링크는 B인데, 어느 지점 앞에서 만나?”";
  return (
    <p className={`rounded-lg border px-3 py-2 text-sm leading-6 ${kind === "conflict" ? "border-dashed border-red-600/70 font-semibold" : "border-border"}`}>{text}</p>
  );
}

export default function CandidateNarrowingViz() {
  return (
    <SceneShell
      eyebrow="후보 좁히기"
      title="‘은행 앞’이 한 지점이 되기까지"
      description="위 줄은 대화에 보이는 단서, 가운데 칸은 ‘은행’이 가리킬 수 있는 후보입니다. 지점 A·B 두 곳은 그림을 위한 가정입니다."
      ariaLabel="은행이라는 낱말의 후보가 지도 링크, 통장 이야기, 도심이라는 단서로 금융기관 지점으로 좁혀지고, 링크와 충돌하면 확인 질문을 하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap gap-2 text-xs">
              {CUES.map((cue) => (
                <span
                  key={cue}
                  className={`rounded-md border px-2 py-1 ${scene.cues ? "border-primary/70 font-semibold text-foreground" : "border-dashed border-border text-muted-foreground opacity-50"}`}
                >
                  단서 · {cue}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CANDIDATES.map((candidate, index) => {
                const style = STATE_STYLE[(scene.states as readonly CandidateState[])[index]];
                return (
                  <div
                    key={candidate.key}
                    className={`min-h-[6.5rem] min-w-0 rounded-lg border px-2 py-2 ${style.dim ? "opacity-45" : ""}`}
                    style={{ borderColor: style.border, backgroundColor: style.bg, borderStyle: style.dashed ? "dashed" : "solid" }}
                  >
                    <span className="block text-[11px] text-muted-foreground">{candidate.kind}</span>
                    <span className={`mt-0.5 block text-sm font-semibold leading-5 ${style.dim ? "line-through" : ""}`}>{candidate.name}</span>
                    <span className="mt-1 block text-xs leading-4" style={{ color: style.border === "#94a3b8" ? undefined : style.border }}>{style.tag}</span>
                  </div>
                );
              })}
            </div>
            <Bottom kind={scene.bottom} />
          </div>
        );
      }}
    />
  );
}
