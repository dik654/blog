import SceneShell from "./SceneShell";

/**
 * 본문 대응: #committee-branch — r₀=HTR(K)에서 시작해 sibling b_i를 g_i가 정한 쪽에 두고
 * 다섯 번 hash해 r₅를 만들고 header의 R_state와 비교한다. 깊이 5는 본문의 작은 예이고,
 * 방향 bit 0·1·1·0·1과 "0이면 r_i가 왼쪽"이라는 표기는 그림을 위한 가정이다.
 * 마지막 장면은 한 단계(i=2)의 좌우만 뒤집었을 때 그 위 root가 모두 달라지는 모습이다.
 */
const BITS = [0, 1, 1, 0, 1] as const;
const DEPTH = BITS.length;
const FLIPPED = 2;
const SUB: readonly string[] = ["₀", "₁", "₂", "₃", "₄", "₅"];
const C = { r: "#2563eb", b: "#64748b", ok: "#059669", bad: "#dc2626", text: "#334155", line: "#cbd5e1", root: "#7c3aed" };

const SCENES = [
  {
    label: "재료 세 가지",
    summary: "HTR(K) · sibling 5개 · R_state",
    note: "아래쪽 r₀는 받은 committee K를 SSZ로 hash한 값(hash-tree-root)입니다. 오른쪽 b₀…b₄는 응답이 함께 보낸 Merkle branch의 sibling hash이고, 위쪽 R_state는 이미 C와 대조한 header H가 약속한 state root입니다.",
  },
  {
    label: "첫 번째 접기",
    summary: "g₀=0 → H(r₀, b₀) = r₁",
    note: "Generalized index에서 읽은 방향 bit g₀가 r₀를 sibling의 왼쪽에 둘지 오른쪽에 둘지 정합니다. 여기서는 0이면 r₀가 왼쪽이라고 표기했습니다(가정). 두 값을 붙여 hash한 결과가 한 층 위의 r₁입니다.",
  },
  {
    label: "다섯 층을 차례로 접기",
    summary: "r₁ → r₂ → … → r₅",
    note: "같은 규칙을 깊이 5까지 반복합니다. 매 층의 결과가 다음 층의 입력이 되고, bit에 따라 sibling이 왼쪽에 오기도 오른쪽에 오기도 합니다. bit 0·1·1·0·1은 그림을 위한 가정입니다.",
  },
  {
    label: "Root 대조",
    summary: "r₅ = R_state → K 포함",
    note: "마지막 r₅가 header의 state root와 같을 때만 K가 그 header의 state에 들어 있다고 판정합니다. 같다는 사실은 inclusion을 보장할 뿐, 이 위원회가 이후 모든 update에 충분히 참여한다는 뜻은 아닙니다.",
  },
  {
    label: "Sibling 하나를 반대로 두면",
    summary: "r₅′ ≠ R_state → 거부",
    note: "세 번째 층에서 sibling의 위치만 바꿔도 그 층의 hash가 r₃′로 달라지고, 그 위 r₄′·r₅′도 연달아 달라집니다. 최종 root가 R_state와 다르므로 K를 다음 서명 검증 key로 쓰지 않습니다.",
  },
] as const;

function Box({ x, y, w, label, color, dashed = false }: { x: number; y: number; w: number; label: string; color: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={22} rx={5} fill="none" stroke={color} strokeWidth={1.1} strokeDasharray={dashed ? "3 2" : undefined} />
      <text x={x + w / 2} y={y + 15} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function BranchFoldViz() {
  return (
    <SceneShell
      eyebrow="Merkle branch 접기"
      title="Committee leaf를 sibling과 다섯 번 접어 header의 state root와 맞춥니다"
      description="한 줄이 tree의 한 층입니다. 아래에서 위로 올라가며, 각 줄의 결과가 바로 위 줄의 입력이 됩니다. 실제 hash 값이 아니라 위치만 보입니다."
      ariaLabel="committee root와 branch sibling 다섯 개를 방향 bit에 따라 접어 state root와 비교하는 과정"
      scenes={SCENES}
      render={(active) => {
        const shownRows = active === 0 ? 0 : active === 1 ? 1 : DEPTH;
        const flipped = active === 4;
        const rowY = (level: number) => 196 - level * 32;
        const finalOk = active === 3;
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={250} y={22} textAnchor="middle" fontSize={10} fill="#64748b">header H가 약속한 값</text>
            <Box x={210} y={28} w={80} label="R_state" color={C.root} />
            {active >= 3 && (
              <text x={300} y={44} fontSize={11} fontWeight={700} fill={finalOk ? C.ok : C.bad}>{finalOk ? "= 일치" : "≠ 거부"}</text>
            )}
            {BITS.map((bit, level) => {
              const y = rowY(level);
              const visible = level < shownRows;
              const changed = flipped && level >= FLIPPED;
              const effectiveBit = flipped && level === FLIPPED ? 1 - bit : bit;
              const mark = changed && level > FLIPPED ? "′" : "";
              const inLabel = `r${SUB[level]}${mark}`;
              const sibLabel = `b${SUB[level]}`;
              const outLabel = `r${SUB[level + 1]}${changed ? "′" : ""}`;
              const left = effectiveBit === 0 ? inLabel : sibLabel;
              const right = effectiveBit === 0 ? sibLabel : inLabel;
              const inColor = mark ? C.bad : C.r;
              return (
                <g key={level}>
                  <text x={8} y={y + 15} fontSize={9.5} fill="#64748b">g{SUB[level]}={effectiveBit}</text>
                  {visible ? (
                    <>
                      <Box x={52} y={y} w={44} label={left} color={left === sibLabel ? C.b : inColor} />
                      <Box x={100} y={y} w={44} label={right} color={right === sibLabel ? C.b : inColor} />
                      <line x1={146} y1={y + 11} x2={176} y2={y + 11} stroke={C.line} strokeWidth={1} />
                      <text x={161} y={y + 7} textAnchor="middle" fontSize={9} fill="#64748b">hash</text>
                      <Box x={178} y={y} w={44} label={outLabel} color={changed ? C.bad : C.r} />
                      {level < DEPTH - 1 && (
                        <text x={230} y={y + 15} fontSize={9} fill="#64748b">→ 다음 줄 입력</text>
                      )}
                      {flipped && level === FLIPPED && (
                        <text x={300} y={y + 15} fontSize={9.5} fontWeight={700} fill={C.bad}>좌우 뒤집음</text>
                      )}
                    </>
                  ) : (
                    <>
                      {level === 0 && <Box x={52} y={y} w={92} label="r₀ = HTR(K)" color={C.r} />}
                      <Box x={level === 0 ? 178 : 100} y={y} w={44} label={sibLabel} color={C.b} dashed />
                    </>
                  )}
                </g>
              );
            })}
            {shownRows === DEPTH && (
              <line x1={200} y1={rowY(DEPTH - 1)} x2={240} y2={50} stroke={active === 4 ? C.bad : active === 3 ? C.ok : C.line} strokeWidth={1.1} strokeDasharray="3 3" />
            )}
            <text x={8} y={230} fontSize={9.5} fill="#64748b">g = 방향 bit (가정) · 0이면 r이 왼쪽 · 깊이 5</text>
          </svg>
        );
      }}
    />
  );
}
