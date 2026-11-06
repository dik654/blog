import SceneShell from "./SceneShell";

/**
 * 본문 대응: #derivation-heads — L1 reorg 때 높이 몇 개를 지우지 않고, 현재 L1 origin과 새 canonical chain의
 * 공통 조상을 찾아 그 origin까지 derivation을 되감아 batch를 다시 읽는다.
 * L1 block 이름 a·b·c·d·c′·d′와 L2 높이와의 1:1 대응은 설명용 가정이다.
 */
const W = 340;
const H = 176;
const INK = "#475569";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";
const BW = 44;
const BH = 26;
const X = [62, 126, 190, 254];
const Y_NEW = 58;
const Y_OLD = 14;
const Y_L2 = 128;

const SCENES = [
  { label: "reorg 전", summary: "L1 origin a·b·c·d", note: "L2 block마다 어느 L1 block에서 나왔는지(L1 origin)가 있습니다. 아래 줄의 L2 높이가 위 줄의 L1 block을 가리킵니다." },
  { label: "L1 reorg", summary: "c·d가 canonical에서 빠짐", note: "L1 reorg는 L1의 최신 block이 다른 갈래로 바뀌는 일입니다. 여기서는 c·d 대신 c′·d′가 canonical(정본 갈래)이 되었습니다." },
  { label: "공통 조상까지 되감기", summary: "“최근 높이 몇 개 삭제”가 아님", note: "op-node는 현재 L1 origin과 새 canonical chain의 공통 조상을 찾습니다. 여기서는 b입니다. Derivation을 그 origin까지 되감습니다." },
  { label: "batch를 다시 읽기", summary: "높이 + block hash + L1 origin", note: "새 갈래의 batch를 다시 읽어 119·120을 다시 만듭니다. 그래서 운영 로그에는 L2 높이뿐 아니라 block hash와 L1 origin을 함께 남깁니다." },
] as const;

function Box({ x, y, label, stroke, fill = "none", color = INK, dash, bold = false }: { x: number; y: number; label: string; stroke: string; fill?: string; color?: string; dash?: string; bold?: boolean }) {
  return (
    <g>
      <rect x={x - BW / 2} y={y} width={BW} height={BH} rx={4} fill={fill} stroke={stroke} strokeWidth={1} strokeDasharray={dash} />
      <text x={x} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={bold ? 700 : 400} fill={color}>{label}</text>
    </g>
  );
}

export default function ReorgRewindViz() {
  return (
    <SceneShell
      eyebrow="L1 reorg 뒤 복구"
      title="되감는 기준은 L2 높이가 아니라 L1의 공통 조상입니다"
      description="위쪽이 L1 block, 아래쪽이 L2 block이고 선은 L1 origin입니다. L1 block 이름과 1:1 대응은 설명용(가정)입니다."
      ariaLabel="L1 reorg가 일어난 뒤 공통 조상까지 derivation을 되감아 L2 block을 다시 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const forked = active >= 1;
        const rewound = active >= 2;
        const rebuilt = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={4} y={Y_NEW + 17} fontSize={12} fontWeight={700} fill={INK}>L1</text>
            <text x={4} y={Y_L2 + 17} fontSize={12} fontWeight={700} fill={INK}>L2</text>

            {/* 기존 c·d는 reorg 전에는 아래 줄(canonical)에, 뒤에는 위 줄(밀려난 갈래)에 그린다. */}
            {["a", "b"].map((name, i) => (
              <Box key={name} x={X[i]} y={Y_NEW} label={name} stroke={i === 1 && rewound ? ACCENT : MUTED} color={i === 1 && rewound ? ACCENT : INK} bold={i === 1 && rewound} />
            ))}
            <line x1={X[0] + BW / 2} x2={X[1] - BW / 2} y1={Y_NEW + BH / 2} y2={Y_NEW + BH / 2} stroke={MUTED} strokeWidth={1} />
            {!forked && (
              <>
                <line x1={X[1] + BW / 2} x2={X[2] - BW / 2} y1={Y_NEW + BH / 2} y2={Y_NEW + BH / 2} stroke={MUTED} strokeWidth={1} />
                <line x1={X[2] + BW / 2} x2={X[3] - BW / 2} y1={Y_NEW + BH / 2} y2={Y_NEW + BH / 2} stroke={MUTED} strokeWidth={1} />
                <Box x={X[2]} y={Y_NEW} label="c" stroke={MUTED} />
                <Box x={X[3]} y={Y_NEW} label="d" stroke={MUTED} />
              </>
            )}
            {forked && (
              <>
                <path d={`M${X[1] + BW / 2} ${Y_NEW + 8} L${X[2] - BW / 2} ${Y_OLD + BH / 2}`} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
                <line x1={X[2] + BW / 2} x2={X[3] - BW / 2} y1={Y_OLD + BH / 2} y2={Y_OLD + BH / 2} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
                <Box x={X[2]} y={Y_OLD} label="c" stroke={RED} dash="3 3" color={RED} />
                <Box x={X[3]} y={Y_OLD} label="d" stroke={RED} dash="3 3" color={RED} />
                <text x={X[3] + BW / 2 + 4} y={Y_OLD + 17} fontSize={11} fill={RED}>빠짐</text>
                <line x1={X[1] + BW / 2} x2={X[2] - BW / 2} y1={Y_NEW + BH / 2} y2={Y_NEW + BH / 2} stroke={ACCENT} strokeWidth={1} />
                <line x1={X[2] + BW / 2} x2={X[3] - BW / 2} y1={Y_NEW + BH / 2} y2={Y_NEW + BH / 2} stroke={ACCENT} strokeWidth={1} />
                <Box x={X[2]} y={Y_NEW} label="c′" stroke={ACCENT} color={ACCENT} />
                <Box x={X[3]} y={Y_NEW} label="d′" stroke={ACCENT} color={ACCENT} />
              </>
            )}

            {rewound && <text x={X[1]} y={Y_NEW - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>공통 조상</text>}

            {["117", "118", "119", "120"].map((height, i) => {
              const stale = i >= 2 && forked && !rebuilt;
              const fresh = i >= 2 && rebuilt;
              const removed = i >= 2 && rewound && !rebuilt;
              const stroke = fresh ? ACCENT : stale ? (removed ? MUTED : RED) : MUTED;
              return (
                <g key={height}>
                  {!stale && <line x1={X[i]} x2={X[i]} y1={Y_NEW + BH} y2={Y_L2} stroke={fresh ? ACCENT : MUTED} strokeWidth={1} />}
                  <Box x={X[i]} y={Y_L2} label={height} stroke={stroke} dash={stale ? "3 3" : undefined} color={fresh ? ACCENT : removed ? MUTED : stale ? RED : INK} bold={fresh} />
                </g>
              );
            })}
            {active === 1 && <text x={(X[2] + X[3]) / 2} y={Y_L2 + BH + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>119·120의 origin c·d가 빠짐</text>}
            {active === 2 && (
              <path d={`M${X[3] + BW / 2 + 2} ${Y_L2 + BH + 6} H${X[1]} V${Y_L2 + BH + 1}`} fill="none" stroke={AMBER} strokeWidth={1.25} />
            )}
            {active === 2 && <text x={X[3]} y={Y_L2 + BH + 18} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>derivation 되감기</text>}
            {rebuilt && <text x={(X[2] + X[3]) / 2} y={Y_L2 + BH + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>c′·d′의 batch로 다시 만듦</text>}
          </svg>
        );
      }}
    />
  );
}
