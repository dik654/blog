import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hostile-witness — 서문 4절의 주장(책임은 내부 폭군)과 증인 티투스,
 * 그리고 ProgressiveDetail의 읽기(주장의 방향·저자의 당시 자리를 나란히 놓기).
 * 왼쪽 칸 = 유대 쪽, 오른쪽 칸 = 로마 쪽. 셋을 나란히 놓는 판단은 이 글이 더한 읽기다.
 */
const SCENES = [
  {
    label: "적장을 증인으로",
    summary: "같은 편의 말이 아님",
    note: "자기 편의 증언이면 같은 편의 말이라 깎입니다. 저자는 책임이 내부 폭군들에게 있다는 주장에 그 성을 무너뜨린 로마 사령관 티투스를 증인으로 댑니다.",
  },
  {
    label: "주장이 가리키는 쪽",
    summary: "책임: 로마 → 내부 폭군",
    note: "주장의 방향을 따지는 이 판단은 저자가 적어 둔 것이 아니라 이 글이 더한 읽기입니다.",
  },
  {
    label: "저자가 서 있던 자리",
    summary: "증인·유리한 쪽·저자 모두 오른쪽",
    note: "저자는 처음에 로마와 맞서 싸웠고 서문을 쓰던 때는 로마 진영에 있었습니다. 적장이라는 사실만으로는 적대 증언(증인 자기 쪽 이해와 반대로 하는 말)으로 셀 수 없습니다.",
  },
  {
    label: "두 겹으로 적기",
    summary: "제기된 주장 + 같은 방향",
    note: "두 겹은 서로를 부정하지 않고 함께 적을 수 있습니다.",
  },
] as const;

const W = 360;
const H = 240;
const MID = W / 2;
const LANE_L = 6;
const LANE_R = MID + 6;
const LANE_W = MID - 12;
const INK = "#334155";
const MUTED = "#94a3b8";
const ROME = "#b45309";
const JUDEA = "#0369a1";
const READ = "#7c3aed";

function Box({ x, y, title, sub, color, faded = false, dashed = false }: { x: number; y: number; title: string; sub: string; color: string; faded?: boolean; dashed?: boolean }) {
  return (
    <g opacity={faded ? 0.4 : 1}>
      <rect x={x} y={y} width={LANE_W} height={38} rx={8} fill="none" stroke={color} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + LANE_W / 2} y={y + 16} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={color}>
        {title}
      </text>
      <text x={x + LANE_W / 2} y={y + 31} textAnchor="middle" fontSize={11} fill={INK}>
        {sub}
      </text>
    </g>
  );
}

export default function WitnessDirectionViz() {
  return (
    <SceneShell
      eyebrow="증인의 방향"
      title="적장이 증인이어도 그 증언이 어느 쪽에 유리한지는 따로 봅니다"
      description="왼쪽 칸은 유대 쪽, 오른쪽 칸은 로마 쪽입니다. 저자가 적어 둔 셋(양쪽을 거쳤다는 말, 책임이 내부에 있다는 주장, 증인 티투스)을 나란히 놓고 방향을 보는 일은 이 글이 더한 읽기입니다."
      note="주장과 증인은 요세푸스 『유대 전쟁사』 서문 4절, 저자의 자기 소개는 본문에 인용한 서문 1절의 것입니다. Whiston 영역본으로 읽었습니다."
      ariaLabel="티투스 증언, 책임을 옮기는 주장의 방향, 저자의 당시 자리를 유대 쪽과 로마 쪽 두 칸에 놓아 보는 그림"
      scenes={SCENES}
      render={(active) => {
        const moved = active >= 1;
        const authorRome = active >= 2;
        const allRight = active === 2;
        const bottom =
          active === 0
            ? ["적장의 말이니 같은 편의 쏠림은 피한 듯 보입니다"]
            : active === 1
              ? ["책임이 내부로 옮겨 가면 로마 쪽에 유리합니다", "(이 글이 더한 읽기)"]
              : active === 2
                ? ["증인·유리한 쪽·저자의 당시 자리가 한 칸에", "이해가 같은 쪽을 세운 것일 수도 있습니다"]
                : ["① 그 주장이 제기됐고 근거로 티투스가 거론됨", "② 주장의 방향은 저자의 당시 처지와 같은 쪽"];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {allRight && <rect x={LANE_R - 4} y={26} width={LANE_W + 8} height={170} rx={10} fill="none" stroke={READ} strokeWidth={1.25} strokeDasharray="4 3" />}
            <text x={LANE_L + LANE_W / 2} y={16} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={JUDEA}>
              유대 쪽
            </text>
            <text x={LANE_R + LANE_W / 2} y={16} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={ROME}>
              로마 쪽
            </text>
            <line x1={MID} x2={MID} y1={24} y2={180} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />

            {/* 증인 */}
            <Box x={LANE_R} y={32} title="티투스 카이사르" sub="성을 무너뜨린 사령관" color={ROME} />

            {/* 저자 */}
            <Box x={LANE_L} y={84} title="저자 요셉" sub="처음: 로마와 맞서 싸움" color={JUDEA} faded={authorRome} />
            {authorRome && (
              <>
                <Box x={LANE_R} y={84} title="저자 요셉" sub="서문 쓸 때: 로마 진영" color={ROME} />
                <line x1={LANE_L + LANE_W + 2} x2={LANE_R - 4} y1={103} y2={103} stroke={INK} strokeWidth={1} />
                <path d={`M ${LANE_R - 4} 103 l -5 -3 v 6 z`} fill={INK} />
              </>
            )}

            {/* 주장: 전쟁의 책임 */}
            {moved && <Box x={LANE_R} y={136} title="전쟁의 책임" sub="옮기기 전 자리: 로마" color={MUTED} faded dashed />}
            <Box x={LANE_L} y={136} title="책임: 내부 폭군들" sub="로마는 마음에 없이 공격" color={JUDEA} />
            {moved && (
              <>
                {/* 두 칸 사이 틈이 좁아 곧은 화살표는 보이지 않으므로, 두 상자 아래로 휘어 옮김을 그립니다. */}
                <path d={`M ${LANE_R + 24} 175 Q ${MID} 196 ${LANE_L + LANE_W - 24} 178`} fill="none" stroke={READ} strokeWidth={1.25} />
                <path d={`M ${LANE_L + LANE_W - 24} 176 l 6 -2 l -1 6 z`} fill={READ} />
                <text x={LANE_L + LANE_W - 30} y={190} textAnchor="end" fontSize={10} fill={READ}>
                  책임을 옮김
                </text>
              </>
            )}

            {/* 증언 연결 */}
            <line x1={LANE_R} x2={LANE_L + LANE_W} y1={58} y2={136} stroke={INK} strokeWidth={1} strokeDasharray="2 2" />
            {active < 2 && (
              <text x={MID + 6} y={124} textAnchor="start" fontSize={10} fill={INK}>
                증언
              </text>
            )}

            {moved && (
              <text x={LANE_R + LANE_W / 2} y={192} textAnchor="middle" fontSize={11} fontWeight={700} fill={READ}>
                유리한 쪽: 로마
              </text>
            )}

            {bottom.map((line, index) => (
              <text key={line} x={W / 2} y={214 + index * 17} textAnchor="middle" fontSize={12} fontWeight={index === 0 ? 700 : 400} fill={active === 3 || index === 0 ? INK : READ}>
                {line}
              </text>
            ))}
          </svg>
        );
      }}
    />
  );
}
