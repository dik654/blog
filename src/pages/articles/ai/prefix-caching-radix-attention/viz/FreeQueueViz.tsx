import SceneShell from "./SceneShell";

/**
 * 본문 대응: #free-queue — R2의 block 목록 [5,9]를 역순으로 다룬다. ref가 0이 된 block만 free queue 후보가 된다.
 * touch는 ref 0인 block을 queue에서 빼고 ref를 올린다. 후보를 다시 쓸 때는 찾기 목록에서 예전 hash를 먼저 뺀다.
 */
interface Scene {
  label: string;
  summary: string;
  note: string;
  ref5: number;
  ref9: number;
  focus: 5 | 9 | null;
  queue: readonly string[];
  /** 앞쪽의 점선 칸: hash 없는 block이 들어갈 자리 */
  ghost?: boolean;
  rewrite?: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "R2가 끝나기 직전", summary: "목록 [5, 9]", note: "참조 수(ref)는 block을 지금 가리키는 수, free queue는 다시 쓸 수 있는 후보의 줄입니다. 5는 다른 요청도 참조한다고 둡니다(가정).", ref5: 2, ref9: 1, focus: null, queue: ["A", "B"] },
  { label: "역순: 9 먼저", summary: "9의 ref 1 → 0", note: "요청 종료는 block 목록을 역순으로 전달하므로 9를 먼저 다룹니다. ref가 0이 되어 후보로 모입니다.", ref5: 2, ref9: 0, focus: 9, queue: ["A", "B"] },
  { label: "그다음 5", summary: "5의 ref 2 → 1 · 반환 안 함", note: "5는 다른 요청이 아직 참조하므로 ref가 1 남습니다. 뒤에서 온 순서만 보고 반환하지 않고, 0이 된 block만 후보가 됩니다.", ref5: 1, ref9: 0, focus: 5, queue: ["A", "B"] },
  { label: "줄의 어디에 넣는가", summary: "hash 있음 → 뒤", note: "현재 원문은 hash 없는 block을 앞에, 있는 block을 뒤에 넣습니다. 9는 hash가 있다고 둡니다(가정). 점선 칸은 hash 없는 block의 자리입니다.", ref5: 1, ref9: 0, focus: 9, queue: ["A", "B", "9"], ghost: true },
  { label: "touch: 다시 hit", summary: "9가 줄에서 빠지고 ref 1", note: "새 요청이 9를 hit한다고 합시다(가정). touch는 ref가 0인 일반 block을 free queue에서 빼고 참조 수를 늘립니다.", ref5: 1, ref9: 1, focus: 9, queue: ["A", "B"] },
  { label: "후보를 다시 쓸 때", summary: "찾기 목록 제거 → 덮어쓰기", note: "A를 다시 쓴다고 합시다(가정). 예전 hash가 새 내용에 hit하지 않게 찾기 목록에서 뺍니다. 이 제거와 공간을 덮어쓸 수 있게 되는 일은 구분합니다.", ref5: 1, ref9: 1, focus: null, queue: ["B"], rewrite: true },
];

function BlockCard({ id, count, focus }: { id: number; count: number; focus: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${focus ? "border-primary" : "border-border"}`}>
      <p className="text-xs text-muted-foreground">block {id}</p>
      <p className="mt-1 font-mono text-base font-bold">ref {count}</p>
      <p className={`mt-1 text-xs ${count === 0 ? "font-semibold text-[#b45309] dark:text-[#fbbf24]" : "text-muted-foreground"}`}>{count === 0 ? "후보" : "사용 중"}</p>
    </div>
  );
}

function Slot({ text, kind }: { text: string; kind: "block" | "ghost" | "empty" }) {
  const cls =
    kind === "block"
      ? "border-[#64748b] font-bold"
      : kind === "ghost"
        ? "border-dashed border-[#64748b] text-[11px] leading-3 text-muted-foreground"
        : "border-dashed border-border/50";
  return <span className={`flex h-10 min-w-0 items-center justify-center rounded-[4px] border px-0.5 text-center font-mono text-xs ${cls}`}>{text}</span>;
}

export default function FreeQueueViz() {
  return (
    <SceneShell
      eyebrow="(가정) block 참조 수"
      title="요청이 끝나도 ref가 0이 된 block만 후보 줄에 섭니다"
      description="위는 R2의 block 목록 [5, 9]의 참조 수, 아래는 free queue입니다. A·B와 ref 값은 설명용 상태입니다."
      ariaLabel="요청 종료, 다시 hit, 재사용 때 참조 수와 free queue가 바뀌는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const slots = [...(scene.ghost ? [""] : []), ...scene.queue];
        return (
          <div>
            <div className="grid grid-cols-2 gap-3">
              <BlockCard id={5} count={scene.ref5} focus={scene.focus === 5} />
              <BlockCard id={9} count={scene.ref9} focus={scene.focus === 9} />
            </div>
            <p className="mt-4 text-xs font-bold">free queue <span className="font-normal text-muted-foreground">(왼쪽이 앞)</span></p>
            <div className="mt-1 grid grid-cols-4 gap-1.5">
              {Array.from({ length: 4 }, (_, i) => (
                <Slot key={i} text={slots[i] === "" ? "hash 없음" : (slots[i] ?? "")} kind={slots[i] === "" ? "ghost" : slots[i] ? "block" : "empty"} />
              ))}
            </div>
            <p className={`mt-3 rounded-sm border px-2 py-1.5 text-center text-xs font-semibold ${scene.rewrite ? "border-[#dc2626] text-[#b91c1c] dark:text-[#fca5a5]" : "border-transparent text-transparent"}`} aria-hidden={!scene.rewrite}>
              A의 예전 hash를 찾기 목록에서 제거
            </p>
          </div>
        );
      }}
    />
  );
}
