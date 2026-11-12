import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — PING 32개를 공백 하나로 연결한 출력의 검산.
 * 문자열 4×32=128, 사이 공백 32−1=31, 합계 159. 끝에 공백 하나를 더하면 160으로 형식이 달라진다.
 */
const COUNT = 32;
const WORD = 4;
const LETTERS = WORD * COUNT;
const GAPS = COUNT - 1;
const TOTAL = LETTERS + GAPS;

const SCENES = [
  { label: "PING 32개", summary: `4 × 32 = ${LETTERS}글자`, note: "칸 하나가 PING 한 개입니다. 문자열 부분만 세면 4글자씩 32개라 128글자입니다." },
  { label: "사이의 공백", summary: `32 − 1 = ${GAPS}개`, note: "공백은 이웃한 두 PING 사이에만 들어갑니다. 칸이 32개면 사이는 31군데라 공백도 31개입니다. 맨 앞과 맨 뒤에는 공백이 없습니다." },
  { label: "전체 길이", summary: `${LETTERS} + ${GAPS} = ${TOTAL}글자`, note: "문자열 128글자와 공백 31개를 더한 159글자가 요청한 형식의 길이입니다. 개수만이 아니라 문자열과 구분 방식까지 이 수에 들어 있습니다." },
  { label: "끝에 공백 하나", summary: `${TOTAL} + 1 = ${TOTAL + 1} → 형식 불일치`, note: "PING 개수는 여전히 32개지만 마지막에 공백 하나가 붙으면 160글자가 됩니다. 설명 문장을 덧붙여도 마찬가지로 형식과 달라집니다." },
] as const;

const TILE = 11;
const GAP = 3.6;
const X0 = 8;
const tileX = (i: number) => X0 + i * (TILE + GAP);

export default function PingCountViz() {
  return (
    <SceneShell
      eyebrow="반복 출력 검산"
      title="PING 32개 사이에는 공백이 31개뿐입니다"
      description="한 줄로 이어 쓴 출력을 그렸습니다. 회색 칸이 PING 한 개(4글자), 칸 사이의 파란 눈금이 공백 한 칸, 빨간 눈금은 형식에 없는 추가 글자입니다."
      ariaLabel="PING 32개, 공백 31개, 전체 159글자, 끝 공백을 붙이면 160글자"
      scenes={SCENES}
      render={(active) => {
        const showGaps = active >= 1;
        const extra = active === 3;
        const endX = tileX(COUNT - 1) + TILE;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 480 56" role="img" aria-label={SCENES[active].summary} className="block h-auto w-full">
              {Array.from({ length: COUNT }, (_, i) => (
                <rect key={i} x={tileX(i)} y={12} width={TILE} height={22} rx={2} fill="#e2e8f0" stroke="#64748b" strokeWidth={1} />
              ))}
              {Array.from({ length: GAPS }, (_, i) => (
                <line
                  key={i}
                  x1={tileX(i) + TILE + GAP / 2}
                  x2={tileX(i) + TILE + GAP / 2}
                  y1={36}
                  y2={44}
                  stroke="#2563eb"
                  strokeWidth={1.25}
                  opacity={showGaps ? 1 : 0}
                />
              ))}
              <line x1={endX + GAP / 2} x2={endX + GAP / 2} y1={36} y2={44} stroke="#dc2626" strokeWidth={1.25} opacity={extra ? 1 : 0} />
              <text x={X0} y={9} fontSize={12} fill="#64748b">1</text>
              <text x={endX} y={9} fontSize={12} fill="#64748b" textAnchor="end">32</text>
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { k: "문자열", v: `${LETTERS}`, on: true },
                { k: "공백", v: showGaps ? `${GAPS + (extra ? 1 : 0)}` : "?", on: showGaps },
                { k: "전체", v: active >= 2 ? `${TOTAL + (extra ? 1 : 0)}` : "?", on: active >= 2 },
              ].map((c) => (
                <div key={c.k} className="rounded-lg border border-border px-2 py-2">
                  <span className="block text-[11px] text-muted-foreground">{c.k}</span>
                  <span className="font-mono text-base font-bold" style={{ color: extra && c.k !== "문자열" ? "#dc2626" : c.on ? "#2563eb" : "#94a3b8" }}>
                    {c.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
