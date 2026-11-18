import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 첫 감상 호감 60·비호감 40(설명용) → 세 번 듣고 악보·연주 전통을 살핀 뒤
 * 75명이 리듬 변화를 구체적으로 말할 수 있게 됐다고 가정 → 75는 가치 증명이 아님 →
 * 중요한 것은 이유의 해상도: '그냥 좋다'에서 '두 번째 반복에서 박자가 늦어져 앞의 주제가 불안하게 들린다'로.
 * 반복 뒤 호감 분포는 본문에 없으므로 칸에 칠하지 않습니다.
 */
const CELLS = Array.from({ length: 100 }, (_, index) => index);
const LIKED = 60;
const CAN_EXPLAIN = 75;
const SEGMENTS = ["주제", "반복 1", "반복 2"] as const;

const SCENES = [
  {
    label: "첫 감상: 표가 갈립니다",
    summary: `호감 ${LIKED} : 비호감 ${100 - LIKED}`,
    note: "칸 하나가 한 사람입니다. 60대 40은 인기를 보여 주지만, 공연이 왜 좋거나 나쁜지와 소수의 판단이 틀렸는지는 알려 주지 않습니다.",
  },
  {
    label: "반복 뒤: 다른 축을 셉니다",
    summary: `리듬 변화를 말함 ${CAN_EXPLAIN}명 (가정)`,
    note: "세 번 듣고 악보와 연주 전통을 살핀 뒤 75명이 리듬 변화를 구체적으로 말할 수 있게 됐다는 가정입니다. 이 75는 호감 수가 아니고, 반복 뒤 호감이 몇 명인지는 본문이 정하지 않아 칠하지 않았습니다. 75라는 수가 작품의 가치를 증명하지도 않습니다.",
  },
  {
    label: "‘그냥 좋다’는 가리키는 곳이 없습니다",
    summary: "확인할 지점 없음",
    note: "‘그냥 좋다’는 반응의 보고로는 솔직하지만, 곡의 어느 구간을 들으라는 말이 없어 다른 사람이 같은 지점을 찾아 확인하거나 반박하기 어렵습니다.",
  },
  {
    label: "구체적인 이유는 구간을 가리킵니다",
    summary: "반복 2의 늦어진 박자 → 앞의 주제",
    note: "이유가 구간을 가리키면 다른 사람이 그 지점을 다시 듣고 확인하거나 반박할 수 있습니다. 이것이 이유의 해상도가 높아졌다는 뜻입니다. 반복 감상이 반드시 호감을 높여야 하는 것은 아닙니다. 구간 길이는 그림을 위한 가정입니다.",
  },
] as const;

function Grid({ mode }: { mode: "vote" | "reason" }) {
  return (
    <div className="space-y-3">
      <div className="mx-auto grid w-full max-w-[16rem] grid-cols-10 gap-1" aria-hidden="true">
        {CELLS.map((cell) => {
          if (mode === "vote") {
            const liked = cell < LIKED;
            return <span key={cell} className={`aspect-square rounded-[3px] border ${liked ? "border-[#2563eb] bg-[#2563eb]" : "border-[#94a3b8] bg-transparent"}`} />;
          }
          const explains = cell < CAN_EXPLAIN;
          return (
            <span key={cell} className="relative flex aspect-square items-center justify-center rounded-[3px] border border-[#94a3b8]">
              {explains ? <span className="h-1/2 w-1/2 rounded-full bg-[#d97706]" /> : null}
            </span>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {mode === "vote" ? (
          <>
            <span><span className="mr-1 inline-block h-3 w-3 rounded-[3px] bg-[#2563eb] align-middle" />호감 60</span>
            <span><span className="mr-1 inline-block h-3 w-3 rounded-[3px] border border-[#94a3b8] align-middle" />비호감 40</span>
          </>
        ) : (
          <>
            <span><span className="mr-1 inline-block h-3 w-3 rounded-full bg-[#d97706] align-middle" />리듬 변화를 말함 75 (가정)</span>
            <span className="text-muted-foreground">호감 여부: 본문에 없음</span>
          </>
        )}
      </div>
    </div>
  );
}

function Timeline({ pointed }: { pointed: boolean }) {
  return (
    <div className="space-y-2">
      <span className="block text-xs text-muted-foreground">곡의 흐름 (왼쪽에서 오른쪽)</span>
      <div className="grid grid-cols-3 gap-2">
        {SEGMENTS.map((segment, index) => {
          const slow = pointed && index === 2;
          const echoed = pointed && index === 0;
          return (
            <div
              key={segment}
              className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 sm:text-sm ${slow ? "border-[#d97706] font-semibold" : echoed ? "border-dashed border-[#2563eb] font-semibold" : "border-border"}`}
            >
              <span className="block">{segment}</span>
              <span className={`block text-xs ${slow ? "text-amber-700 dark:text-amber-400" : echoed ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground/60"}`}>
                {slow ? "박자가 늦어짐" : echoed ? "불안하게 들림" : "—"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center font-mono text-sm" aria-hidden="true">
        <span className={pointed ? "text-[#2563eb]" : "text-transparent"}>▲</span>
        <span />
        <span className={pointed ? "text-[#d97706]" : "text-transparent"}>▲</span>
      </div>
      <div className={`rounded-lg border px-3 py-2 text-sm leading-6 ${pointed ? "border-border" : "border-dashed border-border"}`}>
        <span className="mr-2 text-xs text-muted-foreground">감상자의 말</span>
        {pointed ? "“두 번째 반복에서 박자가 늦어져 앞의 주제가 불안하게 들린다”" : "“그냥 좋다”"}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs leading-5">
        <span className={`rounded-md border px-2 py-1.5 ${pointed ? "border-[#16a34a] font-semibold text-emerald-700 dark:text-emerald-400" : "border-dashed border-border/60 text-muted-foreground/70"}`}>
          {pointed ? "다른 사람: 반복 2를 다시 듣고 확인" : "다른 사람: 어디를 들을지 모름"}
        </span>
        <span className={`rounded-md border px-2 py-1.5 ${pointed ? "border-[#16a34a] font-semibold text-emerald-700 dark:text-emerald-400" : "border-dashed border-border/60 text-muted-foreground/70"}`}>
          {pointed ? "같은 지점을 두고 반박 가능" : "반박할 지점이 없음"}
        </span>
      </div>
    </div>
  );
}

export default function VoteAndReasonViz() {
  return (
    <SceneShell
      eyebrow="3절 설명용 사례"
      title="표의 수와 이유의 해상도는 다른 것을 셉니다"
      description="숫자는 실제 조사 결과가 아니라 3절의 설명용 가정입니다. 앞의 두 장면은 100명을 칸으로, 뒤의 두 장면은 이유가 곡의 어느 구간을 가리키는지를 그립니다."
      ariaLabel="첫 감상 호감 60 비호감 40, 반복 뒤 리듬 변화를 말할 수 있는 75명, 그리고 이유가 곡의 구간을 가리키는지 비교"
      scenes={SCENES}
      render={(active) => (active < 2 ? <Grid mode={active === 0 ? "vote" : "reason"} /> : <Timeline pointed={active === 3} />)}
    />
  );
}
