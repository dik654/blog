import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dynamic-schema-cache — 다른 tokenizer에서 만든 transition table을 재사용하면 금지 token을 허용할 수 있고,
 * schema만 같고 tokenizer가 다르면 H=0으로 다시 compile한다.
 * Token ID 17·42와 각 ID가 가리키는 글자, "문자열 시작을 기다리는 상태"는 설명용 가정입니다.
 */
type Row = { id: number; text: string };

const T1: readonly Row[] = [
  { id: 17, text: "\"" },
  { id: 42, text: "}" },
];
const T2: readonly Row[] = [
  { id: 17, text: "}" },
  { id: 42, text: "\"" },
];
const ALLOWED_TEXT = "\"";

const SCENES = [
  {
    label: "compile할 때",
    summary: "tokenizer T₁ 기준 허용표",
    note: "Tokenizer는 글자 조각을 token ID 숫자로 바꾸는 사전입니다. Compiled grammar의 전이표와 mask는 글자가 아니라 이 ID로 적힙니다. 값 자리에서 문자열 시작 \" 를 기다리는 상태라면 T₁에서는 ID 17만 허용됩니다(ID와 글자는 가정).",
  },
  {
    label: "같은 tokenizer로 재사용",
    summary: "세 identity 모두 같음 → cache hit",
    note: "Schema·tokenizer·engine revision이 모두 같으면 ID 17은 여전히 \" 입니다. 저장해 둔 허용표가 그대로 맞으므로 다시 compile하지 않고 재사용합니다.",
  },
  {
    label: "tokenizer만 다르면",
    summary: "같은 표가 } 를 허용",
    note: "Schema text가 같아도 tokenizer T₂에서는 ID 17이 다른 글자를 가리킬 수 있습니다. 여기서는 } 라고 가정했습니다. 옛 표를 그대로 쓰면 이 자리에서 금지해야 할 } 가 통과합니다.",
  },
  {
    label: "identity로 막기",
    summary: "tokenizer 다름 → miss → 다시 compile",
    note: "Compile key에 tokenizer revision이 들어 있으면 T₂ 요청은 cache miss가 됩니다. T₂로 다시 compile한 표는 ID 42를 허용합니다. Engine revision도 compiler와 matcher 동작을 바꾸므로 같은 이유로 key에 들어갑니다.",
  },
] as const;

function Table({ title, rows, allowedId, wrong, dim, blank = false }: { title: string; rows: readonly Row[]; allowedId: number; wrong: boolean; dim: boolean; blank?: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 ${dim ? "border-dashed border-border/60 opacity-50" : wrong ? "border-red-600" : "border-border"}`}>
      <p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">{title}</p>
      <div className="mt-1.5 grid grid-cols-[auto_auto_minmax(0,1fr)] gap-x-3 gap-y-1 font-mono text-xs sm:text-sm">
        <span className="text-[10px] text-muted-foreground sm:text-xs">ID</span>
        <span className="text-[10px] text-muted-foreground sm:text-xs">글자</span>
        <span className="text-[10px] text-muted-foreground sm:text-xs">mask</span>
        {rows.map((row) => {
          const allowed = row.id === allowedId;
          const bad = allowed && row.text !== ALLOWED_TEXT;
          return (
            <div key={row.id} className="contents">
              <span>{blank ? "·" : row.id}</span>
              <span className="font-bold">{blank ? "·" : row.text}</span>
              <span className={allowed ? (bad ? "font-bold text-red-700 dark:text-red-400" : "font-bold text-emerald-700 dark:text-emerald-400") : "text-muted-foreground"}>
                {blank ? "·" : allowed ? (bad ? "허용 ✕ 금지 글자" : "허용") : "막음"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TokenizerMismatchViz() {
  return (
    <SceneShell
      eyebrow="cache identity"
      title="Schema가 같아도 tokenizer가 다르면 같은 표가 틀립니다"
      description="문자열 시작 &quot; 만 허용해야 하는 한 상태의 허용표입니다. ID 17·42와 각 ID의 글자는 설명용 가정입니다."
      ariaLabel="같은 compiled 허용표를 다른 tokenizer에 재사용하면 금지 글자가 허용되는 예"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="mb-3 grid grid-cols-3 gap-2 text-center text-[11px] leading-4 sm:text-xs">
            {[
              { k: "schema", same: true },
              { k: "tokenizer", same: active !== 2 && active !== 3 },
              { k: "engine", same: true },
            ].map((item) => (
              <div
                key={item.k}
                className={`rounded-md border px-2 py-1.5 ${active === 0 ? "border-border" : item.same ? "border-emerald-600" : "border-red-600"}`}
              >
                <p className="text-muted-foreground">{item.k}</p>
                <p className="font-mono font-bold">{active === 0 ? "기록" : item.same ? "같음 1" : "다름 0"}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Table
              title={active >= 2 ? "cache의 옛 표를 T₂ 사전으로 읽으면" : "compiled 표 · T₁"}
              rows={active >= 2 ? T2 : T1}
              allowedId={17}
              wrong={active === 2}
              dim={active === 3}
            />
            <Table
              title={active === 3 ? "T₂로 다시 compile한 표" : "다시 compile한 표 (아직 없음)"}
              rows={T2}
              allowedId={42}
              wrong={false}
              dim={active !== 3}
              blank={active !== 3}
            />
          </div>
        </div>
      )}
    />
  );
}
