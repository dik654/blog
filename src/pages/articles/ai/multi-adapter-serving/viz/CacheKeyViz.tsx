import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cache-key — prefix cache가 block을 찾는 key에 무엇이 들어가야 하는가.
 * key = 앞부분 token 열 + 추가 key(LoRA 이름 또는 표를 가리키는 extra id).
 * 추가 key가 없으면 다른 고객의 soft prompt가 같은 가짜 ID 열로 보여 잘못 재사용된다.
 */
interface Row {
  who: string;
  tokens: readonly string[];
  extra: string;
  block: string;
  wrong?: boolean;
  color: string;
}

const SYSTEM = ["t1", "t2", "t3", "t4"] as const;
const FAKE = ["V", "V+1", "V+2", "…"] as const;

const SCENES: readonly { label: string; summary: string; note: string; rows: readonly Row[] }[] = [
  {
    label: "같은 system prompt, 다른 LoRA",
    summary: "key 다름 → block 2개",
    rows: [
      { who: "A 요청", tokens: SYSTEM, extra: "LoRA A", block: "block 1", color: "#0d9488" },
      { who: "B 요청", tokens: SYSTEM, extra: "LoRA B", block: "block 2", color: "#2563eb" },
    ],
    note: "A는 q·k·v 행렬을 바꾸므로 같은 token 열이라도 A로 만든 K·V와 B로 만든 K·V는 다릅니다. vLLM은 adapter 이름을 block hash의 추가 key에 넣어 B 요청이 A의 block을 찾지 못하게 합니다.",
  },
  {
    label: "가상 token을 가짜 ID로만 보면",
    summary: "key 같음 → 잘못된 재사용",
    rows: [
      { who: "고객 X 표", tokens: FAKE, extra: "추가 key 없음", block: "block 1", color: "#0d9488" },
      { who: "고객 Y 표", tokens: FAKE, extra: "추가 key 없음", block: "block 1 (X의 K·V)", wrong: true, color: "#d97706" },
    ],
    note: "TensorRT-LLM의 p-tuning 경로는 가상 token을 vocabulary 크기(V) 이상의 가짜 ID로 표시하고, 다른 고객의 표도 같은 가짜 ID 열을 씁니다. ID만 보면 같은 입력이라 Y 요청이 X의 표로 만든 K·V를 가져다 씁니다.",
  },
  {
    label: "표마다 다른 extra id를 붙이면",
    summary: "key 다름 → 섞이지 않음",
    rows: [
      { who: "고객 X 표", tokens: FAKE, extra: "extra id 1", block: "block 1", color: "#0d9488" },
      { who: "고객 Y 표", tokens: FAKE, extra: "extra id 2", block: "block 2", color: "#d97706" },
    ],
    note: "문서는 일반 token에 extra id 0, 가상 token에는 표마다 다른 양수를 주라고 안내합니다. 1과 2는 그림을 위한 가정값입니다. vLLM은 prompt_embeds가 있으면 그 범위의 embedding 값을 SHA-256으로 묶어 같은 key에 넣습니다.",
  },
  {
    label: "같은 표를 쓰는 요청끼리는",
    summary: "key 같음 → 한 벌 공유",
    rows: [
      { who: "고객 X 요청 1", tokens: FAKE, extra: "extra id 1", block: "block 1", color: "#0d9488" },
      { who: "고객 X 요청 2", tokens: FAKE, extra: "extra id 1", block: "block 1 공유", color: "#0d9488" },
    ],
    note: "같은 표를 쓰는 요청은 key가 같아 앞 20칸의 KV를 한 벌만 남깁니다. 12절의 공유 없는 요청 100개 250 MiB가 2.5 MiB로 줄어드는 조건이 이것입니다.",
  },
];

export default function CacheKeyViz() {
  return (
    <SceneShell
      eyebrow="prefix cache key"
      title="block을 찾는 key에 adapter와 표의 정체가 들어가야 섞이지 않습니다"
      description="한 줄이 요청 하나입니다. 가운데 칸은 앞부분 token 열, 그 오른쪽은 key에 함께 넣는 추가 값, 화살표 끝은 그 요청이 쓰게 되는 KV block입니다. t1–t4는 공통 system prompt token입니다."
      ariaLabel="LoRA 이름과 soft prompt 표 구분값이 prefix cache key에 들어갈 때와 빠질 때 block 재사용 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          {SCENES[active].rows.map((row, index) => (
            <div key={index} className="grid min-w-0 grid-cols-1 items-center gap-2 rounded-lg border border-border p-2 sm:grid-cols-[6.5rem_minmax(0,1fr)_7rem_auto_8.5rem]">
              <span className="text-sm font-bold" style={{ color: row.color }}>
                {row.who}
              </span>
              <div className="grid grid-cols-4 gap-1">
                {row.tokens.map((token, slot) => (
                  <span key={slot} className="rounded-sm border border-border py-1 text-center font-mono text-xs">
                    {token}
                  </span>
                ))}
              </div>
              <span className={`rounded-md border px-2 py-1 text-center text-xs ${row.extra.startsWith("추가") ? "border-dashed text-muted-foreground" : "font-semibold"}`}>
                {row.extra}
              </span>
              <span className="hidden text-center text-muted-foreground sm:block" aria-hidden>
                →
              </span>
              <span
                className={`rounded-md border px-2 py-1 text-center text-xs font-bold ${row.wrong ? "border-red-600 text-red-700 dark:text-red-400" : ""}`}
                style={row.wrong ? undefined : { borderColor: row.color }}
              >
                <span className="sm:hidden">→ </span>
                {row.block}
              </span>
            </div>
          ))}
        </div>
      )}
    />
  );
}
