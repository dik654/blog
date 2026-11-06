import SceneShell from "./SceneShell";

/**
 * 본문 대응: #unlink-trace — rm과 close가 각각 어느 카운터를 바꾸는지 호출 순서로 따라간다.
 * 참조 수는 본문 6절처럼 i_count를 단순화한 값이다: fd 1 → rm이 잠깐 +1 = 2 → iput 1 → close 뒤 iput 0.
 */
const STEPS = [
  { group: "rm app.log", items: ["do_unlinkat · 참조 하나 더 잡기", "__ext4_unlink · 이름 줄 삭제", "d_delete · dentry 처리", "iput · 잡았던 참조 놓기"] },
  { group: "java가 fd 7을 닫음", items: ["__fput → dput → iput", "iput_final → evict"] },
  { group: "갈래 · 이름이 남은 파일", items: ["iput_final → cache에 남김"] },
];

const STATES = [
  { name: true, nlink: 1, ref: 1, find: "들어 있음", blocks: "30GiB 붙잡힘", df: "95GiB", step: -1 },
  { name: true, nlink: 1, ref: 2, find: "들어 있음", blocks: "30GiB 붙잡힘", df: "95GiB", step: 0 },
  { name: false, nlink: 0, ref: 2, find: "들어 있음", blocks: "30GiB 붙잡힘", df: "95GiB", step: 1 },
  { name: false, nlink: 0, ref: 2, find: "빠짐", blocks: "30GiB 붙잡힘", df: "95GiB", step: 2 },
  { name: false, nlink: 0, ref: 1, find: "빠짐", blocks: "30GiB 붙잡힘", df: "95GiB", step: 3 },
  { name: false, nlink: 0, ref: 0, find: "빠짐", blocks: "30GiB 붙잡힘", df: "95GiB", step: 4 },
  { name: false, nlink: 0, ref: 0, find: "빠짐", blocks: "0 · 빈칸으로 반환", df: "65GiB", step: 5 },
  { name: true, nlink: 1, ref: 0, find: "−", blocks: "그대로", df: "변화 없음", step: 6 },
];

const SCENES = [
  { label: "rm 직전", summary: "링크 1 · 참조 1", note: "java가 fd 7로 app.log를 열어 둔 사례 A입니다. 이름 하나와 열린 참조 하나가 inode 1311을 붙들고 있습니다." },
  { label: "참조를 잠깐 더 잡음", summary: "참조 1 → 2", note: "do_unlinkat이 경로를 찾은 뒤 inode에 참조를 하나 더 잡습니다. 이 참조는 이 함수 끝에서 놓습니다." },
  { label: "이름 줄을 지움", summary: "링크 1 → 0", note: "디렉터리에서 \"app.log → 1311\" 줄이 사라지고 drop_nlink가 링크 수를 내립니다. 0이 되면 orphan 목록(이름은 없지만 아직 지우지 못한 inode의 기록)에 올립니다. 블록은 아직 그대로입니다." },
  { label: "dentry는 미룸", summary: "이름으로 못 찾음", note: "java의 fd 7이 같은 dentry를 쥐고 있어 inode를 떼지 못하고, 이름 검색용 해시에서만 뺍니다. inode는 붙어 있습니다." },
  { label: "rm이 끝남", summary: "참조 2 → 1 · 돌려준 블록 0", note: "iput은 참조 수를 1 내린 결과가 0일 때만 다음 단계로 갑니다. fd 7이 남아 1이므로 rm은 블록을 하나도 돌려주지 않고 끝납니다. df가 그대로인 이유입니다." },
  { label: "마지막 fd가 닫힘", summary: "참조 1 → 0", note: "__fput이 dput으로 dentry를 놓고, 해시에서 빠져 있던 dentry가 사라지면서 dentry_unlink_inode가 iput을 부릅니다. 이번에는 참조 수가 0이 됩니다." },
  { label: "블록이 돌아옴", summary: "df Used 95 → 65GiB", note: "iput_final이 버릴지 묻고, generic_drop_inode는 링크 수가 0이므로 참을 돌려줍니다. evict가 블록 30GiB와 inode 번호 1311을 돌려주고, 다음 df에서 Used가 내려갑니다." },
  { label: "이름이 남아 있었다면", summary: "링크 1 · 참조 0", note: "지우지 않은 파일을 닫는 갈래입니다. 참조 수는 0이어도 generic_drop_inode가 거짓을 돌려줘 inode는 메모리 cache에만 남고 블록은 그대로입니다. 6절의 두 조건이 이렇게 두 곳의 검사로 나뉩니다." },
];

function Stat({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 text-xs">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value}</dd>
    </div>
  );
}

export default function UnlinkTraceViz() {
  return (
    <SceneShell
      eyebrow="호출 순서"
      title="사례 A에서 rm은 링크 수를, close는 참조 수를 0으로 만듭니다"
      description="호출 순서는 Linux 6.12 기준이고 칠한 줄이 지금 실행 중인 함수입니다. 상태표는 그 순간 inode 1311의 값입니다. 참조 수는 i_count를 단순화한 값이고, dentry는 이름과 inode를 잇는 커널 메모리 객체입니다."
      ariaLabel="rm과 close의 호출 순서에 따른 링크 수, 참조 수, 블록 변화"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        const activeGroup = state.step < 4 ? 0 : state.step < 6 ? 1 : 2;
        const lineOffsets = STEPS.map((_, index) => STEPS.slice(0, index).reduce<number>((sum, item) => sum + item.items.length, 0));
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-3">
              {STEPS.map((group, groupIndex) => (
                <div key={group.group} className={groupIndex === activeGroup ? "" : "hidden sm:block"}>
                  <p className="text-[11px] font-bold text-foreground">{group.group}</p>
                  <ol className="mt-1 space-y-0.5 border-l border-border pl-2 font-mono text-[11px] leading-5">
                    {group.items.map((item, itemIndex) => {
                      const lineIndex = lineOffsets[groupIndex] + itemIndex;
                      const passed = state.step < 6 && lineIndex < state.step;
                      return (
                        <li key={item} className={lineIndex === state.step ? "bg-primary/10 font-bold text-foreground" : passed ? "text-foreground" : "text-muted-foreground/60"}>
                          {item}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
            <dl className="min-w-0">
              <Stat label="디렉터리 줄" value={state.name ? "app.log → 1311" : "없음"} />
              <Stat label="링크 수" value={String(state.nlink)} strong />
              <Stat label="참조 수" value={String(state.ref)} strong />
              <Stat label="dentry 이름 검색표" value={state.find} />
              <Stat label="블록" value={state.blocks} strong />
              <Stat label="df Used" value={state.df} />
            </dl>
          </div>
        );
      }}
    />
  );
}
