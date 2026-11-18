import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 법적 보류는 정한 범위 안의 예정된 삭제만 멈춘다(영구 보관 아님).
 * 칸 = 자료원 × 사람(가정). 7절의 범위 항목(기간·사람·계정·자료원), 10절의 너무 넓을 때·좁을 때,
 * 범위 변경과 해제의 승인 기록을 차례로 보인다. 1절의 대화가 직원 A의 메신저에 있다는 배치는 가정이다.
 */
const SOURCES = ["주문 기록", "메신저", "전화", "이메일"] as const;
const PEOPLE = ["직원 A", "직원 B", "직원 C"] as const;
const ACCENT = "#2563eb";
const LOSS = "#b91c1c";

type Cell = readonly [number, number];
const ALL: readonly Cell[] = SOURCES.flatMap((_, row) => PEOPLE.map((_person, col) => [row, col] as const));
const CHAT: Cell = [1, 0];

const SCENES = [
  { label: "평소 삭제 일정", summary: "보존 기간이 지나면 삭제", held: [] as readonly Cell[], lost: false, released: false, note: "보류가 없을 때는 회사의 평소 보존 일정에 따라 기한이 지난 자료가 자동으로 지워집니다. 대화 기록도 예외가 아닙니다." },
  { label: "범위를 정해 보류", summary: "4칸 멈춤 · 8칸 평소대로", held: ALL.filter(([row, col]) => row <= 1 && col <= 1), lost: false, released: false, note: "기간·사람·계정·자료원을 적은 보류 범위를 승인받으면 그 칸의 자동 삭제만 멈춥니다. 범위 밖 칸은 평소 일정대로 지워지므로 회사 자료 전체를 영구 보관하라는 뜻이 아닙니다." },
  { label: "너무 넓히면", summary: "12칸 전부 멈춤", held: ALL, lost: false, released: false, note: "범위를 지나치게 넓혀 모든 칸의 삭제를 멈추면 개인정보와 비용 위험이 커집니다." },
  { label: "너무 좁히면", summary: "1칸만 멈춤 → 대화는 삭제 대상", held: ALL.filter(([row, col]) => row === 0 && col === 0), lost: true, released: false, note: "주문 기록만 묶으면 메신저의 10초 전 대화는 평소 일정대로 지워질 수 있습니다. 너무 좁히면 자료를 잃습니다." },
  { label: "변경과 해제도 기록", summary: "승인 → 변경 → 해제", held: [] as readonly Cell[], lost: false, released: true, note: "보류는 예정된 삭제를 잠시 멈추는 지시입니다. 범위를 바꾼 시점과 해제한 시점도 누가 승인했는지와 함께 기록으로 남겨야 합니다." },
] as const;

const has = (cells: readonly Cell[], [row, col]: Cell) => cells.some(([r, c]) => r === row && c === col);

function Grid({ index }: { index: number }) {
  const scene = SCENES[index];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] gap-1 text-[11px] leading-4 sm:text-xs">
        <span />
        {PEOPLE.map((person) => <span key={person} className="text-center font-semibold text-muted-foreground">{person}</span>)}
        {SOURCES.map((source, row) => (
          <div key={source} className="contents">
            <span className="self-center font-semibold">{source}</span>
            {PEOPLE.map((person, col) => {
              const held = has(scene.held, [row, col]);
              const chat = row === CHAT[0] && col === CHAT[1];
              const lost = chat && scene.lost;
              return (
                <div
                  key={person}
                  className={`flex min-h-[3rem] flex-col items-center justify-center rounded-md border px-1 py-1 text-center ${held ? "" : "border-dashed"}`}
                  style={{ borderColor: lost ? LOSS : held ? ACCENT : "#cbd5e1" }}
                >
                  <span className="font-semibold" style={{ color: lost ? LOSS : held ? ACCENT : "#64748b" }}>
                    {lost ? "삭제 대상" : held ? "삭제 멈춤" : "평소 일정"}
                  </span>
                  {chat && <span className="text-[10px] leading-4" style={{ color: lost ? LOSS : "#64748b" }}>대화 09:59:50</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border align-middle" style={{ borderColor: ACCENT }} />실선 칸 = 보류 범위</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-dashed align-middle" style={{ borderColor: "#94a3b8" }} />점선 칸 = 평소 삭제 일정</span>
        <span>대상 기간: 사건 전후 (가정)</span>
      </div>
      <ol className="grid grid-cols-3 gap-1.5 text-center text-[11px] leading-5" style={scene.released ? undefined : { visibility: "hidden" }}>
        {["범위 승인", "범위 변경", "보류 해제"].map((step) => (
          <li key={step} className="rounded border px-1 py-1" style={{ borderColor: ACCENT, color: ACCENT }}>
            <span className="block font-semibold">{step}</span>
            <span className="block text-muted-foreground">시점 · 승인자 기록</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function LegalHoldScopeViz() {
  return (
    <SceneShell
      eyebrow="법적 보류의 범위"
      title="보류는 정한 칸의 삭제만 멈춥니다"
      description="법적 보류는 조사·소송과 관련해 정한 범위의 예정된 삭제를 멈추는 지시입니다. 칸 하나가 한 사람의 한 자료원이며, 사람 셋과 보류 범위의 모양은 설명을 위한 가정입니다."
      ariaLabel="자료원과 사람 칸 가운데 보류 범위 안만 삭제가 멈추고, 범위가 넓거나 좁을 때의 결과와 해제 기록을 보이는 장면"
      scenes={SCENES}
      render={(active) => <Grid index={active} />}
    />
  );
}
