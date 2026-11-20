import BranchSceneShell from "./BranchSceneShell";

/**
 * 본문 대응: #indexer — event에 subtype·version·bytes·block 안의 순서를 붙여 transient store에 모으고,
 * EndBlocker의 ProduceBlock이 block 묶음을 만들어 message sender가 indexer로 보낸다.
 * 전달 경로의 지연·중복·순서 역전은 height/hash·tx index·event index·version으로 통제하고,
 * 파생 장부는 보존된 원본 event로 다시 만들며, 분쟁은 commit된 chain state와 event로 대조한다.
 * block 41·42, event 세 개, version v1, 도착 순서는 모두 설명용 가정이다.
 */
type Tone = "idle" | "active" | "warn" | "done";
type Line = { text: string; tone: Tone };

const L = (text: string, tone: Tone = "idle"): Line => ({ text, tone });

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  protocol: readonly Line[];
  wire: readonly Line[];
  indexer: readonly Line[];
  focus: 0 | 1 | 2;
}[] = [
  {
    label: "event에 좌표 붙이기",
    summary: "block 41 · transient store",
    note: "Block 41(가정)을 실행하는 동안 transaction event마다 subtype, version, bytes와 block 안의 순서(tx index, event index)가 붙고 transient store(block을 commit할 때 비워지는 임시 저장소)에 모입니다.",
    protocol: [L("tx 0 · ev 0 · 주문 · v1", "active"), L("tx 0 · ev 1 · 체결 · v1", "active"), L("tx 1 · ev 0 · 계정 · v1", "active")],
    wire: [L("—"), L(""), L("")],
    indexer: [L("—"), L(""), L("")],
    focus: 0,
  },
  {
    label: "EndBlocker가 block 묶음 생성",
    summary: "ProduceBlock → message sender",
    note: "EndBlocker에서 ProduceBlock이 block 41의 event를 한 묶음으로 만들고 message sender가 indexer 쪽으로 보냅니다. 여기서부터는 chain 밖의 전달 경로입니다.",
    protocol: [L("block 41 묶음 · event 3개", "done"), L("ProduceBlock 완료", "done"), L("")],
    wire: [L("block 41 묶음 전송 중", "active"), L(""), L("")],
    indexer: [L("—"), L(""), L("")],
    focus: 1,
  },
  {
    label: "전달 중 지연·중복·역전",
    summary: "도착: 42 → 41 → 41",
    note: "가정한 도착 순서입니다. block 41 묶음이 늦어 42가 먼저 오고, 41은 두 번 전달됩니다. 도착 순서만 믿으면 같은 체결을 두 번 쌓거나 순서를 뒤집을 수 있습니다.",
    protocol: [L("block 41 · 42 생성 순서", "done"), L(""), L("")],
    wire: [L("① block 42 먼저 도착 (역전)", "warn"), L("② block 41 (지연)", "warn"), L("③ block 41 다시 (중복)", "warn")],
    indexer: [L("받은 그대로 쌓으면?", "warn"), L("41의 체결을 두 번 쌓을 수 있음", "warn"), L("42를 41보다 앞에 둘 수 있음", "warn")],
    focus: 1,
  },
  {
    label: "저장 key로 식별",
    summary: "height/hash · tx · event · version",
    note: "각 event를 block height/hash, tx index, event index, version과 함께 저장하면 다시 온 41 묶음은 이미 있는 key와 같아 같은 event로 식별할 수 있고, height로 41이 42보다 앞이라는 것도 알 수 있습니다. 어디까지 처리했는지가 재시작 지점이 됩니다.",
    protocol: [L("block 41 · 42 event", "done"), L(""), L("")],
    wire: [L("③ block 41 다시", "idle"), L("→ key가 이미 있음", "done"), L("")],
    indexer: [L("41 · tx 0 · ev 0 · v1", "done"), L("41 · tx 0 · ev 1 · v1", "done"), L("41 · tx 1 · ev 0 · v1 … 42", "done")],
    focus: 2,
  },
  {
    label: "비우고 다시 만들기",
    summary: "보존된 event → 같은 view",
    note: "파생 장부를 비워도 보존된 원본 event를 height와 index 순서대로 다시 넣으면 주문·체결·계정 조회 화면이 같은 결과로 다시 만들어져야 합니다.",
    protocol: [L("보존된 원본 event", "active"), L("block 41 · 42", "active"), L("")],
    wire: [L("재생(replay)", "active"), L(""), L("")],
    indexer: [L("조회 화면 비움 → 재구성", "active"), L("주문 · 체결 · 계정 · 시세", "done"), L("")],
    focus: 2,
  },
  {
    label: "분쟁이 생기면",
    summary: "기준은 commit된 chain",
    note: "Indexer API 응답과 chain이 어긋나면 commit된 chain state와 event를 기준으로 대조합니다. API가 느리거나 틀려도 settlement의 주인은 chain입니다.",
    protocol: [L("commit된 state · event", "done"), L("← 대조 기준", "done"), L("")],
    wire: [L("—"), L(""), L("")],
    indexer: [L("API 응답", "warn"), L("파생 장부 · 비교 대상", "idle"), L("")],
    focus: 0,
  },
];

const COLS = [
  ["PROTOCOL", "block 실행 · transient store"],
  ["전달 경로", "message sender → indexer"],
  ["INDEXER", "저장 key · 조회 화면"],
] as const;

const LINE_TONE: Record<Tone, string> = {
  idle: "text-muted-foreground",
  active: "text-primary",
  warn: "text-amber-700 dark:text-amber-400",
  done: "text-foreground",
};

export default function IndexerReplayViz() {
  return (
    <BranchSceneShell
      eyebrow="Block event가 조회 화면이 되기까지"
      title="Indexer는 도착 순서가 아니라 block 안의 좌표로 event를 식별합니다"
      description="왼쪽은 chain 안, 가운데는 chain 밖의 전달 경로, 오른쪽은 indexer의 저장 key와 조회 화면입니다. Block 번호, event 개수와 도착 순서는 설명용 가정입니다."
      ariaLabel="dYdX indexer가 block event를 받고 중복·역전을 식별하며 다시 만드는 여섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const columns = [scene.protocol, scene.wire, scene.indexer];
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {COLS.map(([name, sub], col) => (
              <div key={name} className={`min-w-0 rounded-lg border p-3 ${scene.focus === col ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                <span className="block font-mono text-[10px] font-bold text-primary">{name}</span>
                <span className="block break-keep text-[11px] leading-5 text-muted-foreground">{sub}</span>
                <div className="mt-2 space-y-1">
                  {columns[col].map((line, index) => (
                    <span key={index} className={`${line.text ? "block" : "hidden sm:block"} min-h-5 break-keep font-mono text-xs leading-5 ${LINE_TONE[line.tone]} ${line.tone === "idle" ? "" : "font-bold"}`}>
                      {line.text}
                    </span>
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
