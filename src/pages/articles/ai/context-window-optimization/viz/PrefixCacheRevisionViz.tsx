import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cache — 공통 instruction·tool schema를 앞에, user-specific content를 뒤에 두면
 * 앞부분 prefill을 재사용할 수 있다. policy-v7로 바뀌었는데 v6 prefix를 유지하면 hit는 나도
 * correctness가 무너진다. Prefix key에 policy·tool schema·model·tokenizer revision을 넣어 바뀌면 invalidate.
 * 칸 길이는 token 수와 무관하다.
 */
type Mark = "same" | "differ" | "stale" | "fresh";

interface Segment {
  text: string;
  mark: Mark;
}

const MARK_STYLE: Record<Mark, { border: string; bg: string; dashed: boolean }> = {
  same: { border: "#2563eb", bg: "#2563eb1f", dashed: false },
  differ: { border: "#94a3b8", bg: "transparent", dashed: true },
  stale: { border: "#dc2626", bg: "#dc26261a", dashed: false },
  fresh: { border: "#16a34a", bg: "#16a34a1a", dashed: false },
};

const MARK_LABEL: Record<Mark, string> = {
  same: "재사용되는 같은 앞부분",
  differ: "재사용 안 됨(새로 계산·폐기)",
  stale: "v6 · 낡은 revision",
  fresh: "v7 · 새 revision",
};

interface CacheScene {
  label: string;
  summary: string;
  note: string;
  rows: readonly { name: string; segments: readonly Segment[] }[];
  verdict: string;
  verdictMark: Mark;
}

const SCENES: readonly CacheScene[] = [
  {
    label: "공통 부분을 앞에 둔 두 요청",
    summary: "앞 두 칸 일치 → 재사용 가능",
    note: "두 요청의 앞 두 칸(policy와 tool schema)이 token 단위로 같습니다. Provider 조건이 맞으면 이 앞부분의 prefill 계산을 다시 쓰고, 사용자마다 다른 뒤 칸만 새로 계산합니다.",
    rows: [
      { name: "요청 A", segments: [{ text: "policy-v6", mark: "same" }, { text: "tool schema", mark: "same" }, { text: "user A 내용", mark: "differ" }] },
      { name: "요청 B", segments: [{ text: "policy-v6", mark: "same" }, { text: "tool schema", mark: "same" }, { text: "user B 내용", mark: "differ" }] },
    ],
    verdict: "판정 · 앞 두 칸 재사용, 뒤 칸만 계산",
    verdictMark: "same",
  },
  {
    label: "user 내용을 앞에 두면",
    summary: "첫 칸부터 다름 → 공통 앞부분 없음",
    note: "같은 세 칸이라도 사용자마다 다른 내용을 맨 앞에 두면 첫 칸부터 두 요청이 갈립니다. Stable prefix는 '같은 앞부분'이므로, 뒤쪽 policy와 schema가 같아도 재사용할 앞부분이 생기지 않습니다.",
    rows: [
      { name: "요청 A", segments: [{ text: "user A 내용", mark: "differ" }, { text: "policy-v6", mark: "differ" }, { text: "tool schema", mark: "differ" }] },
      { name: "요청 B", segments: [{ text: "user B 내용", mark: "differ" }, { text: "policy-v6", mark: "differ" }, { text: "tool schema", mark: "differ" }] },
    ],
    verdict: "판정 · 재사용할 같은 앞부분 없음",
    verdictMark: "differ",
  },
  {
    label: "policy-v7 배포 · key에 revision 없음",
    summary: "hit는 나지만 v6 내용",
    note: "Policy가 v7로 바뀌었는데 cache key가 revision을 담지 않으면 새 요청도 예전 key와 맞아 hit가 납니다. 그 결과 v6 prefix 계산이 그대로 쓰입니다. Hit rate는 높아지지만 현재 policy와 다른 내용으로 답하게 되어 correctness가 무너집니다.",
    rows: [
      { name: "cache", segments: [{ text: "key: prefix", mark: "stale" }, { text: "policy-v6 계산", mark: "stale" }, { text: "tool schema", mark: "stale" }] },
      { name: "새 요청", segments: [{ text: "key: prefix → hit", mark: "same" }, { text: "v6 계산을 받음 (v7이어야 함)", mark: "stale" }, { text: "user C 내용", mark: "differ" }] },
    ],
    verdict: "판정 · key 일치 → v6 재사용 (틀린 hit)",
    verdictMark: "stale",
  },
  {
    label: "key에 revision을 넣으면",
    summary: "revision 다름 → miss → v7로 새로 계산",
    note: "Prefix key에 policy·tool schema·model·tokenizer revision을 함께 넣으면 v6로 만든 key와 v7 요청의 key가 달라 miss가 납니다. 예전 항목은 invalidate되고 v7 prefix를 새로 계산하며, 그 뒤 v7 요청끼리는 다시 재사용합니다. 다만 이때도 hit는 계산 재사용일 뿐 freshness·correctness·권한의 증명은 아닙니다.",
    rows: [
      { name: "cache", segments: [{ text: "key: policy-v6 · schema · model · tokenizer rev", mark: "stale" }, { text: "→ invalidate", mark: "differ" }] },
      { name: "새 요청", segments: [{ text: "key: policy-v7 · schema · model · tokenizer rev", mark: "fresh" }, { text: "→ 새로 계산", mark: "fresh" }] },
    ],
    verdict: "판정 · miss → v7 prefix 계산 후 v7끼리 재사용",
    verdictMark: "fresh",
  },
];

function Cell({ segment }: { segment: Segment }) {
  const style = MARK_STYLE[segment.mark];
  return (
    <span
      className="flex min-h-[2.5rem] min-w-0 items-center justify-center rounded-md border px-1.5 py-1 text-center text-[11px] font-semibold leading-4 break-words sm:text-xs sm:leading-5"
      style={{ borderColor: style.border, backgroundColor: style.bg, borderStyle: style.dashed ? "dashed" : "solid" }}
    >
      {segment.text}
    </span>
  );
}

export default function PrefixCacheRevisionViz() {
  return (
    <SceneShell
      eyebrow="Stable prefix와 revision"
      title="같은 앞부분만 재사용되고, revision이 key에 없으면 낡은 prefix가 재사용됩니다"
      description="한 줄이 요청 하나(또는 cache 항목)이고 칸 하나가 prompt 조각입니다. 칸 길이는 token 수가 아닙니다."
      note="Prefill 재사용 여부는 provider 조건에 따라 달라집니다. 칸 배치와 요청 이름은 설명용 예시(가정)입니다."
      ariaLabel="Stable prefix 순서와 revision 포함 cache key에 따른 재사용 판정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const verdict = MARK_STYLE[scene.verdictMark];
        return (
          <div className="min-w-0 space-y-3">
            {scene.rows.map((row) => (
              <div key={row.name} className="grid min-w-0 gap-1 sm:grid-cols-[3.75rem_minmax(0,1fr)] sm:items-center sm:gap-2">
                <span className="text-xs font-bold text-muted-foreground">{row.name}</span>
                <div className="grid min-w-0 gap-1.5" style={{ gridTemplateColumns: `repeat(${row.segments.length}, minmax(0, 1fr))` }}>
                  {row.segments.map((segment, i) => (
                    <Cell key={`${row.name}-${i}`} segment={segment} />
                  ))}
                </div>
              </div>
            ))}
            <p
              className="rounded-md border px-3 py-2 text-sm font-bold"
              style={{ borderColor: verdict.border, borderStyle: verdict.dashed ? "dashed" : "solid" }}
            >
              {scene.verdict}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              {(Object.keys(MARK_LABEL) as Mark[]).map((mark) => (
                <span key={mark} className="inline-flex items-center gap-1">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm border"
                    style={{ borderColor: MARK_STYLE[mark].border, backgroundColor: MARK_STYLE[mark].bg, borderStyle: MARK_STYLE[mark].dashed ? "dashed" : "solid" }}
                  />
                  {MARK_LABEL[mark]}
                </span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
