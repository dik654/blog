import SceneShell from "./SceneShell";

/**
 * 본문 대응: #schema — "Cursor가 lower bound와 range를 올바르게 걸으려면 byte 정렬이 논리적인 key 순서와 같아야 합니다."
 * 블록 번호 255·256·1000을 2 byte로 쓰는 두 방식을 비교한다. 255=0x00FF, 256=0x0100, 1000=0x03E8.
 * 두 방식과 2 byte 폭은 설명용 가정이며 Reth의 실제 codec을 말하지 않는다.
 */
interface Entry {
  key: number;
  bytes: string;
}

const LOGICAL: readonly Entry[] = [
  { key: 255, bytes: "" },
  { key: 256, bytes: "" },
  { key: 1000, bytes: "" },
];
/** 작은 자리 byte를 앞에 쓰면 byte 사전순 정렬: 00 01 < E8 03 < FF 00 */
const LOW_FIRST: readonly Entry[] = [
  { key: 256, bytes: "00 01" },
  { key: 1000, bytes: "E8 03" },
  { key: 255, bytes: "FF 00" },
];
/** 큰 자리 byte를 앞에 쓰면: 00 FF < 01 00 < 03 E8 */
const HIGH_FIRST: readonly Entry[] = [
  { key: 255, bytes: "00 FF" },
  { key: 256, bytes: "01 00" },
  { key: 1000, bytes: "03 E8" },
];

interface SceneDef {
  label: string;
  short: string;
  summary: string;
  note: string;
  showLow: boolean;
  showHigh: boolean;
  walk: boolean;
}

const SCENES: readonly SceneDef[] = [
  {
    short: "논리",
    label: "논리적인 key 순서",
    summary: "255 < 256 < 1000",
    note: "블록 번호 key 세 개를 숫자로 비교하면 255, 256, 1000 순서입니다. 디스크에는 이 숫자가 아니라 bytes가 저장되고, 정렬도 bytes를 앞에서부터 비교해 정해집니다.",
    showLow: false, showHigh: false, walk: false,
  },
  {
    short: "A",
    label: "(가정) 작은 자리 byte를 앞에",
    summary: "256 · 1000 · 255",
    note: "2 byte 중 작은 자리를 앞에 쓰는 방식이라면 255는 FF 00, 256은 00 01, 1000은 E8 03입니다. 첫 byte부터 비교하면 256, 1000, 255 순서가 되어 논리 순서와 어긋납니다.",
    showLow: true, showHigh: false, walk: false,
  },
  {
    short: "B",
    label: "(가정) 큰 자리 byte를 앞에",
    summary: "255 · 256 · 1000",
    note: "큰 자리를 앞에 쓰면 00 FF, 01 00, 03 E8이 되어 byte 순서가 숫자 순서와 같습니다. 본문이 말하는 “byte 정렬이 논리적인 key 순서와 같은” 경우입니다.",
    showLow: true, showHigh: true, walk: false,
  },
  {
    short: "걷기",
    label: "256부터 걷기",
    summary: "A: 256·1000·255 / B: 256·1000",
    note: "Lower bound는 찾는 key 이상인 첫 위치입니다. 256에서 시작해 정렬 순서대로 다음 key를 읽으면, 작은 자리 먼저 방식에서는 256보다 작은 255가 뒤늦게 나옵니다. 큰 자리 먼저 방식은 256, 1000만 읽습니다.",
    showLow: true, showHigh: true, walk: true,
  },
];

function Column({
  title,
  entries,
  visible,
  walkFrom,
}: {
  title: string;
  entries: readonly Entry[];
  visible: boolean;
  walkFrom: number | null;
}) {
  return (
    <div className="min-w-0">
      <p className="min-h-8 break-keep text-[11px] font-bold leading-4 text-muted-foreground">{title}</p>
      <ol className="mt-1 grid gap-1">
        {entries.map((entry, index) => {
          const walked = walkFrom !== null && index >= walkFrom;
          const wrong = walked && entry.key < 256;
          const border = !visible ? "#cbd5e1" : wrong ? "#ef4444" : walked ? "#6366f1" : "#94a3b8";
          return (
            <li
              key={entry.key}
              className="flex h-12 min-w-0 flex-col items-center justify-center rounded border text-center"
              style={{ borderColor: border, borderStyle: visible ? "solid" : "dashed" }}
            >
              {visible ? (
                <>
                  <span className="font-mono text-sm font-bold" style={{ color: wrong ? "#dc2626" : undefined }}>
                    {entry.key}
                    {walked ? <span className="ml-1 text-[10px]">{wrong ? "✕" : "→"}</span> : null}
                  </span>
                  {entry.bytes ? <span className="font-mono text-[10px] text-muted-foreground">{entry.bytes}</span> : null}
                </>
              ) : (
                <span className="text-[10px] text-muted-foreground">?</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function KeyByteOrderViz() {
  return (
    <SceneShell
      eyebrow="Key 인코딩 · 정렬 순서"
      title="bytes를 쓰는 순서가 디스크의 key 정렬을 정합니다"
      description="세 칸은 위에서 아래로 정렬된 위치입니다. 같은 블록 번호 세 개를 2 byte로 쓰는 두 방식을 견줘, byte 정렬과 숫자 순서가 언제 갈라지는지 봅니다."
      note="두 인코딩 방식과 2 byte 폭은 설명용 가정입니다. 이 그림은 Reth가 실제로 어떤 codec을 쓰는지 말하지 않습니다."
      ariaLabel="블록 번호 key를 작은 자리 먼저와 큰 자리 먼저로 인코딩했을 때 정렬 순서와 lower bound 걷기 결과 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 grid-cols-3 gap-3 sm:gap-6">
            <Column title="논리 순서 (숫자)" entries={LOGICAL} visible walkFrom={null} />
            <Column title="A · 작은 자리 먼저" entries={LOW_FIRST} visible={scene.showLow} walkFrom={scene.walk ? 0 : null} />
            <Column title="B · 큰 자리 먼저" entries={HIGH_FIRST} visible={scene.showHigh} walkFrom={scene.walk ? 1 : null} />
          </div>
        );
      }}
    />
  );
}
