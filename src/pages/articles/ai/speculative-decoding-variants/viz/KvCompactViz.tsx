import SceneShell from "./SceneShell";

/**
 * 본문 대응: #commit — 기존 길이 4. 저장 번호 [0,1,4] + 4 = KV 위치 [4,5,8].
 * 그 값을 [4,5,6]에 복사하고 current_length를 7로 갱신한다. Y 자리 logits는 남겨 다음 바퀴에 C를 고른다.
 */
const SCENES = [
  { label: "검증 직후", summary: "기존 4칸 + 후보 7칸", note: "기존 네 자리 뒤에 일곱 후보의 기록이 저장 순서대로 놓여 있습니다. 이 순서는 문장 순서가 아니어서 R·A·Y가 떨어져 있습니다." },
  { label: "승인 경로의 위치", summary: "[0, 1, 4] + 4 = [4, 5, 8]", note: "선택 행에서 accept_length+1개, 곧 root를 포함한 2+1개를 꺼낸 [0, 1, 4]에 기존 길이 4를 더해 실제 위치를 얻습니다." },
  { label: "기존 글 바로 뒤로 복사", summary: "[4, 5, 8] → [4, 5, 6]", note: "그 위치의 값을 임시로 읽은 뒤 [4, 5, 6]에 copy_합니다. 4와 5는 제자리이고 8의 Y가 6으로 옮겨 B의 자리를 덮습니다. block table만 바꾸는 방식이 아니라 값을 실제로 모읍니다." },
  { label: "길이를 7로", summary: "글 7 · 유효 기록 7", note: "current_length를 7로 갱신하면 7번 칸 이후는 유효 기록이 아닙니다. 출력 목록에 RAY를 붙인 길이도 7입니다. Y 자리의 점수(logits)를 남겨 C는 다음 바퀴에 고릅니다." },
] as const;

const BEFORE = ["", "", "", "", "R", "A", "B", "X", "Y", "X", "Y"];
const CELL = 30;
const STEP = 32.5;
const X0 = 3;
const Y0 = 40;
const slotX = (slot: number) => X0 + slot * STEP;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const PICKED = new Set([4, 5, 8]);

export default function KvCompactViz() {
  return (
    <SceneShell
      eyebrow="KV 칸 옮기기"
      title="떨어져 있던 R·A·Y의 기록을 기존 글 바로 뒤로 모읍니다"
      description="칸 하나가 한 자리의 KV 기록이고 위 숫자가 실제 위치입니다. 회색 네 칸은 이미 있는 기존 네 자리입니다. 사례의 글자는 설명을 위한 가정입니다."
      ariaLabel="KV 위치 4, 5, 8의 기록을 4, 5, 6으로 복사하고 길이를 7로 갱신하는 과정"
      scenes={SCENES}
      render={(active) => {
        const contents = active >= 2 ? BEFORE.map((token, slot) => (slot === 6 ? "Y" : token)) : BEFORE;
        const target = active >= 2;
        const trimmed = active === 3;
        return (
          <svg viewBox="0 0 364 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={13} fontSize={12} className="fill-muted-foreground">기존 네 자리</text>
            <text x={slotX(4)} y={13} fontSize={12} className="fill-muted-foreground">이번 후보 일곱 자리</text>
            {contents.map((token, slot) => {
              const prefix = slot < 4;
              const selected = (active === 1 && PICKED.has(slot)) || (target && slot >= 4 && slot <= 6);
              const stale = trimmed && slot > 6;
              const stroke = selected ? BLUE : stale ? "#cbd5e1" : "#94a3b8";
              return (
                <g key={slot}>
                  <text x={slotX(slot) + CELL / 2} y={Y0 - 6} textAnchor="middle" fontSize={11} className="fill-muted-foreground">{slot}</text>
                  <rect x={slotX(slot)} y={Y0} width={CELL} height={34} rx={3} fill={prefix ? "#94a3b8" : selected ? BLUE : "none"} fillOpacity={prefix ? 0.45 : 0.2} stroke={stroke} strokeWidth={1} strokeDasharray={stale ? "3 3" : undefined} />
                  <text x={slotX(slot) + CELL / 2} y={Y0 + 23} textAnchor="middle" fontSize={14} fontWeight={700} fill={stale ? "#94a3b8" : undefined} className={stale ? undefined : "fill-foreground"}>{token}</text>
                </g>
              );
            })}
            {active === 2 && (
              <g>
                <path d={`M${slotX(8) + CELL / 2} ${Y0 + 36}Q${slotX(7) + CELL / 2} ${Y0 + 76} ${slotX(6) + CELL / 2 + 3} ${Y0 + 41}`} fill="none" stroke={AMBER} strokeWidth={1.25} />
                <polygon points={`${slotX(6) + CELL / 2},${Y0 + 36} ${slotX(6) + CELL / 2 + 1},${Y0 + 45} ${slotX(6) + CELL / 2 + 8},${Y0 + 41}`} fill={AMBER} />
                <text x={slotX(7) + CELL / 2} y={Y0 + 80} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>8 → 6</text>
              </g>
            )}
            {trimmed && (
              <g>
                <line x1={slotX(0)} x2={slotX(6) + CELL} y1={Y0 + 44} y2={Y0 + 44} stroke={BLUE} strokeWidth={1.25} />
                <text x={slotX(0)} y={Y0 + 62} fontSize={13} fontWeight={700} fill={BLUE}>유효 기록 7칸</text>
                <text x={slotX(7)} y={Y0 + 62} fontSize={13} className="fill-muted-foreground">유효하지 않음</text>
                <text x={slotX(0)} y={Y0 + 86} fontSize={13} className="fill-muted-foreground">다음 입력 준비: Y 자리 logits 보관 → C는 다음 바퀴</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
