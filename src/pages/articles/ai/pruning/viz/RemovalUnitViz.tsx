import PruningSceneShell from "./PruningSceneShell";

/**
 * 본문 대응: #removal-unit — individual weight · N:M group · channel이 지우는 모양.
 * 4×8 행렬과 두 mask, 다음 layer의 3×4 크기는 설명용 가정입니다.
 * 임의 mask: 16/32 = 50%, 네 칸 묶음별 남은 수 3·1·2·3·1·3·2·1.
 * 2:4 mask: 모든 묶음 2/4, 전체 16/32 = 50%.
 * Channel 2 제거: 현재 layer 4×8 → 3×8(24칸), 다음 layer 3×4 → 3×3(9칸).
 */
const ARBITRARY: readonly string[] = ["11101000", "01010111", "10001101", "00110001"];
const TWO_FOUR: readonly string[] = ["11001010", "01100101", "10011100", "01010011"];
const count = (bits: string) => bits.split("").filter((bit) => bit === "1").length;
const TOTAL_KEPT = ARBITRARY.reduce<number>((sum, row) => sum + count(row), 0);
const REMOVED_CHANNEL = 2;
const NEXT_ROWS = 3;

const SCENES = [
  { label: "Individual weight · 아무 자리나 50%", summary: `${TOTAL_KEPT}/32 = 50%`, note: "행렬 전체로는 절반을 지웠지만 네 칸 묶음마다 남은 수가 3, 1, 2, 3, 1, 3, 2, 1로 들쭉날쭉합니다. 이런 불규칙한 자리를 계산에서 빼려면 value뿐 아니라 index와 sparse kernel이 필요합니다." },
  { label: "N:M group · 2:4", summary: "모든 묶음 2/4 · 전체 16/32", note: "2:4는 네 자리마다 정확히 두 자리를 남깁니다. 전체 비율은 앞 장면과 같은 50%지만, 앞의 mask는 이 규칙을 지키지 않으므로 2:4 mask가 아닙니다." },
  { label: "Channel · 연결된 dimension 전체", summary: "출력 4→3 · 다음 layer 입력 4→3", note: "현재 layer의 출력 channel 2를 지우면 그 channel을 입력으로 받던 다음 layer의 열 2도 함께 사라집니다. 남은 두 행렬은 3×8과 3×3의 더 작은 dense 행렬입니다. Residual·projection 경로가 같은 dimension을 쓰면 그 shape도 맞춰야 합니다." },
] as const;

function Cell({ on, dashed = false }: { on: boolean; dashed?: boolean }) {
  return (
    <div
      className={`h-6 min-w-0 rounded-sm border ${on ? "border-[#2563eb] bg-[#2563eb]/15" : dashed ? "border-dashed border-[#d97706]/70" : "border-dashed border-border"}`}
    />
  );
}

function GroupedMask({ rows }: { rows: readonly string[] }) {
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)_2.25rem] gap-x-1.5 text-[10px] text-muted-foreground">
        <span>열 0–3</span>
        <span />
        <span>열 4–7</span>
        <span />
      </div>
      {rows.map((row, r) => (
        <div key={r} className="grid grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)_2.25rem] items-center gap-x-1.5">
          {[0, 4].map((start) => {
            const group = row.slice(start, start + 4);
            const kept = count(group);
            const ok = kept === 2;
            return [
              <div key={`g${start}`} className="grid grid-cols-4 gap-1">
                {group.split("").map((bit, c) => (
                  <Cell key={c} on={bit === "1"} />
                ))}
              </div>,
              <span
                key={`c${start}`}
                className={`text-center font-mono text-xs font-bold ${ok ? "text-[#2563eb]" : "text-[#d97706]"}`}
              >
                {kept}/4
              </span>,
            ];
          })}
        </div>
      ))}
    </div>
  );
}

function ChannelCut() {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold">현재 layer · 행 = 출력 channel</p>
        <div className="space-y-1">
          {[0, 1, 2, 3].map((r) => (
            <div key={r} className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-1.5">
              <span className={`font-mono text-[10px] ${r === REMOVED_CHANNEL ? "font-bold text-[#d97706]" : "text-muted-foreground"}`}>ch{r}</span>
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 8 }, (_, c) => (
                  <Cell key={c} on={r !== REMOVED_CHANNEL} dashed={r === REMOVED_CHANNEL} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-1.5 font-mono text-xs font-bold text-[#2563eb]">4×8 → 3×8</p>
      </div>
      <div>
        <p className="mb-1.5 text-[11px] font-semibold">다음 layer · 열 = 입력</p>
        <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-1.5">
          <span />
          <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
            {[0, 1, 2, 3].map((c) => (
              <span key={c} className={c === REMOVED_CHANNEL ? "font-bold text-[#d97706]" : "text-muted-foreground"}>ch{c}</span>
            ))}
          </div>
        </div>
        <div className="mt-1 space-y-1">
          {Array.from({ length: NEXT_ROWS }, (_, r) => (
            <div key={r} className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-1.5">
              <span className="font-mono text-[10px] text-muted-foreground">out{r}</span>
              <div className="grid grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((c) => (
                  <Cell key={c} on={c !== REMOVED_CHANNEL} dashed={c === REMOVED_CHANNEL} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-1.5 font-mono text-xs font-bold text-[#2563eb]">3×4 → 3×3</p>
      </div>
    </div>
  );
}

function Picture({ active }: { active: number }) {
  return (
    <div role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {active === 0 && <GroupedMask rows={ARBITRARY} />}
      {active === 1 && <GroupedMask rows={TWO_FOUR} />}
      {active === 2 && <ChannelCut />}
    </div>
  );
}

export default function RemovalUnitViz() {
  return (
    <PruningSceneShell
      eyebrow="제거 단위"
      title="무엇을 한 단위로 지웠는지에 따라 남는 모양이 다릅니다"
      description="칸 하나가 weight 하나이고, 파란 칸은 남긴 weight, 점선 칸은 지운 weight입니다. 행렬 크기와 지운 자리는 설명용 가정입니다."
      ariaLabel="임의 50퍼센트 mask, 2:4 mask, channel 제거가 행렬에 남기는 모양 비교"
      scenes={SCENES}
      render={(active) => <Picture active={active} />}
    />
  );
}
