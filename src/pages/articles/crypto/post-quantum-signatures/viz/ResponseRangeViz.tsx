import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 공개할 응답의 범위가 비밀에 따라 달라지면 많은 서명이 비밀 정보를 줄 수 있다.
 * z = y + s (c=1), 비밀 성분 s는 3절의 1과 2. 마스크 범위 −5~+5는 그림용 가정이다.
 * s=1: −4~6, s=2: −3~7. 8절의 가정 조건 |z|<4로 거르면 둘 다 −3~3, 7/11개가 남는다.
 */
const INK = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const W = 360;
const H = 176;
const AXIS = Array.from({ length: 12 }, (_, i) => i - 4); // −4 … 7
const LEFT = 56;
const CELL = 25;
const cx = (z: number) => LEFT + (z + 4) * CELL;
const ROWS = [
  { s: 1, y: 46, color: BLUE, min: -4, max: 6 },
  { s: 2, y: 98, color: AMBER, min: -3, max: 7 },
];

const SCENES = [
  { label: "비밀이 응답의 범위를 밉니다", summary: "s=1: −4~6, s=2: −3~7", note: "마스크 y는 비밀을 가리려고 고르는 값이고, 응답은 z=y+s입니다(c=1). y가 −5부터 +5까지라고 놓으면(가정) 칸이 나올 수 있는 응답입니다. 비밀 성분이 1 커지면 범위가 통째로 한 칸 밀립니다." },
  { label: "많은 서명을 모으면", summary: "양 끝 값이 비밀을 구별해 줄 수 있음", note: "−4는 s=1일 때만, 7은 s=2일 때만 나옵니다. 마스크를 더했어도 공개한 응답을 많이 모으면 비밀에 관한 정보를 줄 수 있습니다." },
  { label: "허용 범위를 벗어난 후보를 버립니다", summary: "|z| < 4만 통과", note: "8절에서 쓸 작은 조건처럼 각 성분의 절댓값이 4 미만이어야 한다고 놓습니다(가정). 점선 밖의 후보는 공개하지 않고 버린 뒤 새 후보를 만듭니다." },
  { label: "남은 범위는 두 비밀이 같습니다", summary: "둘 다 −3~3, 11칸 중 7칸", note: "거른 뒤에는 두 줄의 범위가 같아 공개된 범위만으로는 s=1과 s=2를 구별할 수 없습니다. 이 작은 예의 범위 이야기이며, 실제 범위와 상수는 표준과 코드가 정합니다." },
] as const;

export default function ResponseRangeViz() {
  return (
    <SceneShell
      eyebrow="공개값의 분포"
      title="마스크를 더해도 응답의 범위가 비밀을 말할 수 있습니다"
      description="칸 하나가 응답의 한 성분이 가질 수 있는 값입니다. 비밀 성분 1과 2는 3절의 s=[1,2]에서 가져왔고, c=1입니다."
      ariaLabel="비밀 성분에 따라 응답 범위가 밀리는 모습과 범위를 벗어난 후보를 버린 뒤 범위가 같아지는 모습"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {AXIS.map((z) => (
            <text key={z} x={cx(z) + CELL / 2} y={24} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={INK}>{z < 0 ? `−${-z}` : z}</text>
          ))}
          <text x={4} y={24} fontSize={11} fill={INK}>응답 z</text>
          {ROWS.map((row) => (
            <g key={row.s}>
              <text x={4} y={row.y + 24} fontSize={12} fontWeight={700} fill={row.color}>s = {row.s}</text>
              {AXIS.map((z) => {
                const inRange = z >= row.min && z <= row.max;
                const passes = Math.abs(z) < 4;
                const dropped = active >= 2 && inRange && !passes;
                const gone = active === 3 && dropped;
                const tell = active === 1 && (z === -4 || z === 7) && inRange;
                return (
                  <g key={z}>
                    <rect
                      x={cx(z) + 1}
                      y={row.y}
                      width={CELL - 2}
                      height={36}
                      rx={3}
                      fill={!inRange || gone ? "none" : tell ? RED : dropped ? INK : row.color}
                      fillOpacity={!inRange || gone ? 0 : tell ? 0.85 : dropped ? 0.14 : 0.55}
                      stroke={!inRange ? "none" : gone || dropped ? INK : "none"}
                      strokeWidth={1}
                      strokeDasharray={gone ? "2 3" : undefined}
                    />
                    {dropped && !gone && (
                      <path d={`M${cx(z) + 7} ${row.y + 12} L${cx(z) + CELL - 7} ${row.y + 24} M${cx(z) + CELL - 7} ${row.y + 12} L${cx(z) + 7} ${row.y + 24}`} stroke={RED} strokeWidth={1.25} />
                    )}
                  </g>
                );
              })}
            </g>
          ))}
          {active >= 2 && (
            <rect x={cx(-3)} y={38} width={7 * CELL} height={104} rx={4} fill="none" stroke={INK} strokeWidth={1} strokeDasharray="4 3" />
          )}
          {active === 1 && (
            <>
              <text x={cx(-4) + CELL / 2} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>s=1만</text>
              <text x={cx(7) + CELL / 2} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>s=2만</text>
            </>
          )}
          {active >= 2 && (
            <text x={cx(-3) + (7 * CELL) / 2} y={160} textAnchor="middle" fontSize={11} fill={INK}>통과 범위 |z| &lt; 4 (가정)</text>
          )}
        </svg>
      )}
    />
  );
}
