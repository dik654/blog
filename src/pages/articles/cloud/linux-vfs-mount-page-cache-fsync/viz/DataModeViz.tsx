import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fsync — ext4 data 모드 셋. 같은 쓰기에서 데이터와 메타데이터가 내려가는 순서가 무엇을 바꾸는가.
 * ordered: 데이터 먼저 → commit. writeback: 순서 안 지킴(크기는 늘었는데 내용은 옛 블록일 수 있음). journal: 데이터도 저널에, 두 번.
 */
interface Block {
  text: string;
  kind: "data" | "meta" | "both";
}

const SCENES: readonly {
  label: string;
  summary: string;
  blocks: readonly Block[];
  crashAfter: number | null;
  result: string;
  note: string;
}[] = [
  { label: "data=ordered (기본)", summary: "데이터 먼저, commit 나중", blocks: [{ text: "데이터 블록", kind: "data" }, { text: "메타데이터 commit", kind: "meta" }], crashAfter: 1, result: "commit 전이라 늘어난 크기가 없음 → 쓰레기 데이터가 안 보임", note: "데이터를 저널에 쓰지 않는데도 크래시 뒤 쓰레기 데이터가 안 보이는 이유는 메타데이터 트랜잭션을 commit하기 전에 관련 데이터 블록을 먼저 쓰기 때문입니다. 저널은 크기·블록 위치 같은 메타데이터를 복구용으로 먼저 적어 두는 기록입니다. 크래시 위치는 설명용입니다(가정)." },
  { label: "data=writeback", summary: "이 순서를 지키지 않음", blocks: [{ text: "메타데이터 commit", kind: "meta" }, { text: "데이터 블록", kind: "data" }], crashAfter: 1, result: "크기는 늘었는데 내용이 옛 블록인 파일이 생길 수 있음", note: "data=writeback은 이 순서를 지키지 않습니다. 메타데이터가 먼저 닿은 순간에 크래시가 나면 크기는 늘었는데 내용은 옛 블록인 파일이 생길 수 있습니다. 그림은 그런 경우의 한 순서입니다(가정)." },
  { label: "data=journal", summary: "데이터까지 저널에 · 두 번 씀", blocks: [{ text: "저널에 데이터·메타데이터", kind: "both" }, { text: "제자리에 데이터", kind: "data" }], crashAfter: null, result: "데이터를 두 번 쓰는 만큼 가장 느림", note: "data=journal은 데이터까지 저널에 적으므로 같은 데이터를 두 번 씁니다. 세 모드 가운데 가장 느립니다." },
];

const KIND_CLASS: Record<Block["kind"], string> = {
  data: "border-amber-600 text-amber-800 dark:text-amber-300",
  meta: "border-blue-600 text-blue-800 dark:text-blue-300",
  both: "border-violet-600 text-violet-800 dark:text-violet-300",
};

export default function DataModeViz() {
  return (
    <SceneShell
      eyebrow="ext4 data 모드"
      title="데이터와 메타데이터 중 무엇이 먼저 디스크에 닿는가"
      description="왼쪽부터 시간순입니다. 빨간 줄이 있는 장면은 그 지점에서 크래시가 난 경우이고, 아래 칸이 재부팅 뒤의 파일입니다."
      ariaLabel="ordered, writeback, journal 모드의 쓰기 순서와 크래시 결과"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] items-stretch">
              <div className={`flex min-h-14 items-center justify-center rounded-lg border px-2 py-2 text-center text-xs font-bold leading-5 ${KIND_CLASS[s.blocks[0].kind]}`}>
                <span><span className="block font-mono font-normal">먼저</span>{s.blocks[0].text}</span>
              </div>
              <div className="relative flex items-center justify-center">
                {s.crashAfter !== null && <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-red-600" />}
              </div>
              <div className={`flex min-h-14 items-center justify-center rounded-lg border px-2 py-2 text-center text-xs font-bold leading-5 ${s.crashAfter !== null ? "border-dashed" : ""} ${KIND_CLASS[s.blocks[1].kind]}`}>
                <span><span className="block font-mono font-normal">다음</span>{s.blocks[1].text}{s.crashAfter !== null ? " (못 닿음)" : ""}</span>
              </div>
            </div>
            <p className={`mt-1 text-center text-xs font-bold leading-5 text-red-700 dark:text-red-400 ${s.crashAfter !== null ? "" : "invisible"}`}>빨간 줄에서 크래시 (가정)</p>
            <div className="mt-2 rounded-lg border border-border px-3 py-2">
              <span className="block text-xs text-muted-foreground">{s.crashAfter !== null ? "재부팅 뒤의 파일" : "치르는 값"}</span>
              <span className="block text-sm font-bold leading-6">{s.result}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
