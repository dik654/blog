import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bits — 1011과 0110, 오른쪽 끝이 0번 자리.
 * 기록 배열: A=[1,1,0,1], B=[0,1,1,0]. XOR [1,0,1,1]=1101, AND [0,1,0,0]=0010.
 * 정수 덧셈 11+6=17=10001: 1번 자리에서 생긴 올림이 2·3·4번 자리로 이어집니다.
 * 칸은 쓰는 모양(왼쪽이 높은 자리)으로 놓고 맨 왼쪽 칸은 4번 자리(정수 합의 올림)입니다.
 */
const A = [1, 1, 0, 1] as const; // 배열 인덱스 = 자리 번호
const B = [0, 1, 1, 0] as const;
const XOR = A.map((bit, i) => bit ^ B[i]);
const AND = A.map((bit, i) => bit & B[i]);
// 정수 합 11+6=17의 자리별 결과와 각 자리로 들어오는 올림(1번→2번, 2번→3번, 3번→4번)
const SUM = [1, 0, 0, 0, 1] as const;
const CARRY_IN = [0, 0, 1, 1, 1] as const;

const CELL = 40;
const GAP = 8;
const LEFT = 96;
const colX = (pos: number) => LEFT + (4 - pos) * (CELL + GAP);

const SCENES = [
  { label: "자리 번호", summary: "1011 → [1,1,0,1]", note: "오른쪽 끝을 0번 자리로 정합니다. 그래서 쓴 모양 1011을 0번 자리부터 적으면 [1,1,0,1]이 되어 순서가 뒤집혀 보입니다. 0110은 같은 방식으로 [0,1,1,0]입니다." },
  { label: "XOR", summary: "[1,0,1,1] = 1101", note: "XOR는 같은 자리끼리만 봅니다. 두 비트가 다르면 1이므로 0·2·3번 자리가 1이고, 쓴 모양으로는 1101입니다. 옆 자리로 넘어가는 값이 없습니다." },
  { label: "AND", summary: "[0,1,0,0] = 0010", note: "AND도 같은 자리끼리만 봅니다. 둘 다 1인 곳은 1번 자리 하나뿐이라 결과는 0010입니다." },
  { label: "정수 덧셈", summary: "11 + 6 = 17 = 10001", note: "같은 입력을 정수 11과 6으로 읽고 더하면 1번 자리의 1+1에서 올림이 생겨 왼쪽 자리로 이어집니다. 결과 10001은 XOR의 1101과 다릅니다. 자리별 연산에는 이 올림이 없습니다." },
] as const;

function Cell({ pos, y, value, tone }: { pos: number; y: number; value: number | string; tone: "plain" | "hit" | "accent" | "muted" }) {
  const fill = tone === "hit" ? "#2563eb" : tone === "accent" ? "#d97706" : "none";
  const stroke = tone === "muted" ? "#cbd5e1" : tone === "hit" ? "#2563eb" : tone === "accent" ? "#d97706" : "#64748b";
  const text = tone === "hit" || tone === "accent" ? "#ffffff" : tone === "muted" ? "#94a3b8" : "#334155";
  return (
    <g>
      <rect x={colX(pos)} y={y} width={CELL} height={30} rx={4} fill={fill} fillOpacity={tone === "plain" || tone === "muted" ? 0 : 0.9} stroke={stroke} strokeWidth={1} />
      <text x={colX(pos) + CELL / 2} y={y + 20} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="ui-monospace, monospace" fill={text}>{value}</text>
    </g>
  );
}

function RowLabel({ y, text }: { y: number; text: string }) {
  return <text x={6} y={y + 20} fontSize={12} fontWeight={700} fill="#475569">{text}</text>;
}

export default function BitPositionViz() {
  return (
    <SceneShell
      eyebrow="자리별 계산"
      title="오른쪽 끝이 0번 자리이고, 연산은 같은 자리끼리만 일어납니다"
      description="칸 위의 숫자가 자리 번호입니다. 칸은 쓰는 모양대로 왼쪽이 높은 자리이고, 맨 왼쪽 4번 칸은 정수 덧셈의 올림을 받을 자리입니다."
      ariaLabel="1011과 0110의 자리 번호, XOR, AND, 정수 덧셈 비교"
      scenes={SCENES}
      render={(active) => {
        const rowA = 34;
        const rowB = 72;
        const rowOut = 128;
        return (
          <svg viewBox="0 0 340 200" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[4, 3, 2, 1, 0].map((pos) => (
              <text key={pos} x={colX(pos) + CELL / 2} y={22} textAnchor="middle" fontSize={11} fill="#64748b">{`${pos}번`}</text>
            ))}
            <RowLabel y={rowA} text="1011" />
            {A.map((bit, pos) => <Cell key={`a${pos}`} pos={pos} y={rowA} value={bit} tone={active === 2 && AND[pos] === 1 ? "hit" : "plain"} />)}
            {active !== 0 && (
              <g>
                <RowLabel y={rowB} text="0110" />
                {B.map((bit, pos) => <Cell key={`b${pos}`} pos={pos} y={rowB} value={bit} tone={active === 2 && AND[pos] === 1 ? "hit" : "plain"} />)}
              </g>
            )}
            {active === 0 && (
              <g>
                <RowLabel y={rowOut} text="배열" />
                {A.map((bit, index) => {
                  const slotX = LEFT + index * (CELL + GAP) + (CELL + GAP);
                  return (
                    <g key={`arr${index}`}>
                      <line x1={colX(index) + CELL / 2} y1={rowA + 30} x2={slotX + CELL / 2} y2={rowOut} stroke="#2563eb" strokeWidth={1} strokeOpacity={0.7} />
                      <rect x={slotX} y={rowOut} width={CELL} height={30} rx={4} fill="none" stroke="#2563eb" strokeWidth={1} />
                      <text x={slotX + CELL / 2} y={rowOut + 20} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="ui-monospace, monospace" fill="#2563eb">{bit}</text>
                      <text x={slotX + CELL / 2} y={rowOut + 46} textAnchor="middle" fontSize={10} fill="#2563eb">{`[${index}]`}</text>
                    </g>
                  );
                })}
              </g>
            )}
            {(active === 1 || active === 2) && (
              <g>
                <line x1={LEFT + CELL + GAP} x2={334} y1={rowOut - 10} y2={rowOut - 10} stroke="#94a3b8" strokeWidth={1} />
                <RowLabel y={rowOut} text={active === 1 ? "XOR" : "AND"} />
                {(active === 1 ? XOR : AND).map((bit, pos) => (
                  <Cell key={`o${pos}`} pos={pos} y={rowOut} value={bit} tone={bit === 1 ? "hit" : "plain"} />
                ))}
                <text x={334} y={rowOut + 52} textAnchor="end" fontSize={11} fill="#64748b">옆 자리로 넘어가는 값 없음</text>
              </g>
            )}
            {active === 3 && (
              <g>
                {CARRY_IN.map((carry, pos) =>
                  carry === 1 ? (
                    <text key={`c${pos}`} x={colX(pos) + CELL / 2} y={rowOut - 7} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">+올림</text>
                  ) : null,
                )}
                <RowLabel y={rowOut} text="정수 합" />
                {SUM.map((bit, pos) => <Cell key={`s${pos}`} pos={pos} y={rowOut} value={bit} tone={bit === 1 ? "accent" : "plain"} />)}
                <text x={334} y={rowOut + 52} textAnchor="end" fontSize={11} fill="#64748b">11 + 6 = 17 → 10001</text>
              </g>
            )}
            {(active === 1 || active === 2) && <Cell pos={4} y={rowOut} value="" tone="muted" />}
          </svg>
        );
      }}
    />
  );
}
