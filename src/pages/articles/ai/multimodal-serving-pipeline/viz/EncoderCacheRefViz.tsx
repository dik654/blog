import SceneShell from "./SceneShell";

/**
 * 본문 대응: #encoder-cache — EncoderCacheManager가 mm hash마다 두는 참조 요청 집합과 freeable 목록.
 * check_and_update_cache(참조 추가, 비어 있던 항목은 freeable에서 먼저 뺌) → free_encoder_input(참조 제거,
 * 비면 freeable 끝으로) → can_allocate(자리가 모자라면 참조 0 항목을 오래된 순서로 지움).
 * 마지막 장면의 Q·S와 자리 부족은 설명용 가정이다.
 */
type Entry = { hash: string; refs: readonly string[]; evicted?: boolean } | null;

interface Scene {
  label: string;
  summary: string;
  note: string;
  call: string;
  entries: readonly Entry[];
  freeable: readonly string[];
  incoming?: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "R1이 P를 encode",
    summary: "P → {R1}",
    call: "encode 후 cache에 P 등록",
    entries: [{ hash: "P", refs: ["R1"] }, null, null],
    freeable: [],
    note: "cache에 P가 없어 R1이 사진을 encode했습니다. P 항목에는 이 결과를 지금 쓰는 요청 ID 집합 {R1}이 붙습니다.",
  },
  {
    label: "R2가 같은 P를 찾음",
    summary: "P → {R1, R2}",
    call: "check_and_update_cache → True",
    entries: [{ hash: "P", refs: ["R1", "R2"] }, null, null],
    freeable: [],
    note: "P가 있으므로 R2를 집합에 넣고 True를 돌려줍니다. R2는 encoder를 돌리지 않습니다.",
  },
  {
    label: "R1이 사진 구간을 지남",
    summary: "P → {R2}",
    call: "free_encoder_input(R1)",
    entries: [{ hash: "P", refs: ["R2"] }, null, null],
    freeable: [],
    note: "R1이 계산을 마친 위치가 사진 구간 끝 1,385에 이르면 사진 자리 16–1,384의 KV가 다 써진 것이라 R1은 embedding이 더 필요 없습니다. 집합에서 R1만 지웁니다.",
  },
  {
    label: "R2도 지남: 지우지 않고 대기",
    summary: "P → { } · freeable 끝에 P",
    call: "free_encoder_input(R2)",
    entries: [{ hash: "P", refs: [] }, null, null],
    freeable: ["P"],
    note: "마지막 참조가 사라져도 P를 바로 버리지 않고 freeable 목록 끝에 넣습니다. 자리가 남아 있는 동안 P의 embedding은 cache에 그대로 있습니다.",
  },
  {
    label: "다섯째 요청이 P를 보냄",
    summary: "P → {다섯째} · freeable에서 뺌",
    call: "check_and_update_cache → True",
    entries: [{ hash: "P", refs: ["다섯째"] }, null, null],
    freeable: [],
    note: "R1과 R2가 끝난 뒤에도 P가 남아 있어 다시 씁니다. 집합이 비어 있던 항목이라 freeable 목록에서 먼저 빼낸 뒤 다섯째 요청을 넣습니다.",
  },
  {
    label: "자리가 모자랄 때 (가정)",
    summary: "참조 0인 Q부터 지움 · P는 남김",
    call: "can_allocate(새 사진 V)",
    entries: [{ hash: "P", refs: ["다섯째"] }, { hash: "Q", refs: [], evicted: true }, { hash: "S", refs: [] }],
    freeable: ["Q", "S"],
    incoming: "V",
    note: "(가정) 참조가 0인 Q와 S가 이 순서로 freeable에 들어가 있고, 새 사진 V를 넣기에 빈 자리가 모자라다고 둡니다. 참조가 0인 항목을 오래된 순서로 지우므로 Q가 먼저 나갑니다. 지금 쓰는 요청이 있는 P는 지우지 않습니다.",
  },
];

function Chip({ text, tone }: { text: string; tone: "ref" | "free" | "gone" }) {
  const cls =
    tone === "ref"
      ? "border-blue-600 text-blue-700 dark:text-blue-300"
      : tone === "gone"
        ? "border-dashed border-red-600 text-red-700 line-through dark:text-red-400"
        : "border-amber-600 text-amber-700 dark:text-amber-400";
  return <span className={`inline-block rounded border px-1.5 font-mono text-xs leading-5 ${cls}`}>{text}</span>;
}

export default function EncoderCacheRefViz() {
  return (
    <SceneShell
      eyebrow="encoder cache 참조"
      title="마지막 참조가 사라져도 P는 freeable 목록에서 다음 요청을 기다립니다"
      description="한 줄이 encoder cache의 항목 하나(사진의 mm hash)이고, 파란 칩은 그 결과를 지금 쓰는 요청입니다. 아래 줄의 freeable 목록은 참조가 0이 된 항목이 들어간 순서이며 왼쪽이 먼저 들어간 것입니다."
      note="R1·R2·사진 P와 1,385는 본문 7–8절의 사례입니다. 마지막 장면의 Q·S·V와 자리 부족은 설명용 가정입니다."
      ariaLabel="encoder cache 항목의 참조 요청 집합과 freeable 목록이 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid gap-3">
            <p className="font-mono text-xs text-muted-foreground">
              호출: <span className="font-bold text-foreground">{scene.call}</span>
              {scene.incoming ? <span> · 새로 넣을 사진 {scene.incoming}</span> : null}
            </p>
            <ul className="grid gap-2">
              {scene.entries.map((entry, index) => (
                <li
                  key={index}
                  className={`grid min-h-[2.75rem] grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,auto)] items-center gap-2 rounded-lg border px-3 py-1.5 ${
                    entry ? (entry.evicted ? "border-dashed border-red-600" : "border-border") : "border-dashed border-border/50"
                  }`}
                >
                  <span className="font-mono text-sm font-bold">{entry ? entry.hash : ""}</span>
                  <span className="flex flex-wrap gap-1">
                    {entry ? (
                      entry.refs.length ? (
                        entry.refs.map((ref) => <Chip key={ref} text={ref} tone="ref" />)
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground">{"{ }"}</span>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground/60">빈 줄</span>
                    )}
                  </span>
                  <span className={`text-right text-xs ${entry?.evicted ? "font-bold text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                    {entry ? (entry.evicted ? "지움" : entry.refs.length ? "사용 중" : "남아 있음 · 참조 0") : ""}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex min-h-[2.75rem] flex-wrap items-center gap-2 rounded-lg border border-amber-600/60 px-3 py-1.5">
              <span className="text-xs font-bold">freeable 목록</span>
              {scene.freeable.length ? (
                scene.freeable.map((hash, index) => (
                  <Chip key={hash} text={hash} tone={active === SCENES.length - 1 && index === 0 ? "gone" : "free"} />
                ))
              ) : (
                <span className="font-mono text-xs text-muted-foreground">비어 있음</span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
