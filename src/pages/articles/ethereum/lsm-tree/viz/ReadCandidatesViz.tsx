import LsmSceneShell from "./LsmSceneShell";

/**
 * 본문 대응: #read-path — 조회는 memtable, immutable memtable, SSTable 후보를 합쳐
 * snapshot sequence 이하에서 가장 큰 항목을 고릅니다. Bloom filter negative는 그 파일의 data block을 건너뛰고,
 * positive는 index·data를 계속 확인합니다. Tombstone을 지나쳐 오래된 항목을 반환하면 삭제한 값이 되살아납니다.
 * (이 배치에서는 tombstone 바로 아래가 A@52=9라 잘못된 결과가 A=9가 됩니다. A@41=7만 남았다면 본문 예처럼 A=7.)
 * 항목이 어느 위치에 있는지는 설명용 가정입니다.
 */
type Place = {
  name: string;
  sst: boolean;
  entry: { seq: number; text: string } | null;
};

const PLACES: readonly Place[] = [
  { name: "memtable", sst: false, entry: { seq: 60, text: "A@60 tombstone" } },
  { name: "immutable memtable", sst: false, entry: { seq: 52, text: "A@52 = 9" } },
  { name: "SST-1", sst: true, entry: { seq: 41, text: "A@41 = 7" } },
  { name: "SST-2", sst: true, entry: null },
];

type RowState = "plain" | "skip" | "check" | "pick" | "hidden" | "passed" | "wrong";

const SCENES = [
  {
    label: "흩어진 후보",
    summary: "같은 키 A가 세 곳에",
    states: ["plain", "plain", "plain", "plain"] as readonly RowState[],
    bloom: false,
    result: "아직 고르지 않음",
    tone: "neutral",
    note: "키 A의 내부 항목이 현재 memtable, immutable memtable, SSTable에 나뉘어 있다고 가정합니다. SST-2에는 A가 없고 다른 키만 있습니다. 조회는 이 위치들의 후보를 합쳐서 비교해야 합니다.",
  },
  {
    label: "Bloom filter로 파일 거르기",
    summary: "negative면 data block 생략",
    states: ["check", "check", "check", "skip"] as readonly RowState[],
    bloom: true,
    result: "후보 A@60 · A@52 · A@41",
    tone: "neutral",
    note: "Bloom filter는 SSTable마다 붙은 작은 요약입니다. SST-2의 negative는 그 파일에 A가 없다는 뜻이라 data block 읽기를 건너뜁니다. SST-1의 positive는 ‘있을 수도 있음’이므로 index와 data를 계속 확인해 A@41을 찾습니다.",
  },
  {
    label: "snapshot 61의 선택",
    summary: "61 이하 최댓값 = A@60",
    states: ["pick", "hidden", "hidden", "skip"] as readonly RowState[],
    bloom: true,
    result: "A@60 tombstone → 없음",
    tone: "good",
    note: "세 후보가 모두 61 이하이므로 가장 큰 sequence인 A@60이 선택됩니다. 이 항목이 tombstone이라 결과는 ‘없음’이고, 그 아래의 A@52와 A@41은 가려집니다. Bloom filter는 이 선택에 관여하지 않습니다.",
  },
  {
    label: "tombstone을 지나치면",
    summary: "삭제한 값이 되살아남",
    states: ["passed", "wrong", "hidden", "skip"] as readonly RowState[],
    bloom: true,
    result: "잘못된 결과 A = 9",
    tone: "bad",
    note: "Tombstone을 확인하고도 그 아래의 오래된 항목을 반환하면 삭제한 값이 되살아납니다. 이 배치에서는 tombstone 바로 아래의 A@52=9가 먼저 나오고, 본문 예의 A=7도 같은 방식으로 되살아날 수 있습니다. Tombstone은 빈 값이 아니라 그 시점부터 이전 값을 보이지 않게 하는 항목입니다.",
  },
] as const;

const ROW = {
  plain: "border-border bg-background",
  check: "border-border bg-background",
  skip: "border-dashed border-border/70 text-muted-foreground",
  pick: "border-primary bg-background",
  hidden: "border-border bg-background text-muted-foreground",
  passed: "border-border bg-background text-muted-foreground",
  wrong: "border-rose-600 bg-background",
} as const;

const TAG: Record<RowState, string> = {
  plain: "",
  check: "확인",
  skip: "건너뜀",
  pick: "선택",
  hidden: "가려짐",
  passed: "지나침",
  wrong: "잘못 반환",
};

const TONE = {
  neutral: "border-border text-muted-foreground",
  good: "border-primary text-primary",
  bad: "border-rose-600 text-rose-700 dark:text-rose-300",
} as const;

export default function ReadCandidatesViz() {
  return (
    <LsmSceneShell
      eyebrow="읽기 경로 · 후보 모으기"
      title="조회는 여러 위치의 후보를 모은 뒤 snapshot 기준으로 하나를 고릅니다"
      description="한 줄이 항목이 머무는 위치 하나입니다. 어느 항목이 어느 위치에 있는지는 설명용 가정이며, sequence 41·52·60은 본문의 예를 그대로 씁니다."
      ariaLabel="memtable, immutable memtable, 두 SSTable에 흩어진 키 A의 항목을 Bloom filter로 거르고 snapshot 61에서 tombstone을 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="space-y-2">
              {PLACES.map((place, index) => {
                const state = scene.states[index];
                const bloomText = !place.sst || !scene.bloom ? "—" : place.entry ? "positive" : "negative";
                return (
                  <div key={place.name} className={`grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 rounded-lg border px-3 py-2 sm:grid-cols-[9.5rem_5.5rem_minmax(0,1fr)_4.5rem] ${ROW[state]}`}>
                    <strong className="min-w-0 break-keep text-xs">{place.name}</strong>
                    <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">Bloom {bloomText}</span>
                    <span
                      className={`col-start-1 row-start-2 min-w-0 font-mono text-xs sm:col-start-auto sm:row-start-auto ${state === "wrong" ? "font-bold text-rose-700 dark:text-rose-300" : ""} ${state === "pick" ? "font-bold text-primary" : ""}`}
                    >
                      <span className={state === "hidden" ? "line-through" : ""}>{place.entry ? place.entry.text : "A 없음 (다른 키만)"}</span>
                      <span className="ml-2 font-mono text-[10px] font-normal text-muted-foreground sm:hidden">{place.sst && scene.bloom ? `Bloom ${bloomText}` : ""}</span>
                    </span>
                    <span className={`row-span-2 text-right text-[10px] font-bold sm:row-span-1 ${state === "wrong" ? "text-rose-700 dark:text-rose-300" : state === "pick" ? "text-primary" : "text-muted-foreground"}`}>
                      {TAG[state]}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className={`mt-3 rounded-lg border px-3 py-2 text-center font-mono text-sm font-bold ${TONE[scene.tone]}`}>{scene.result}</p>
          </div>
        );
      }}
    />
  );
}
