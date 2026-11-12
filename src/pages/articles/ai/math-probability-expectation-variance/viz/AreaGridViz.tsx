import SceneShell from "./SceneShell";

/**
 * 본문 대응: #outcomes(7절) — 네 기록을 넓이로 그리면 합집합의 중복과
 * 0.7 사례의 칸별 비중을 셀 수 있다.
 * 공정: 각 칸 1/4, U∪V = 1/2 + 1/2 − 1/4 = 3/4.
 * 0.7(가정): HH 0.49, HT 0.21, TH 0.21, TT 0.09 → 정확히 한 번 0.42.
 */
const SCENES = [
  { label: "네 칸의 넓이가 비중", summary: "4 × 1/4 = 1", p: 0.5, note: "가로는 첫 던짐, 세로는 둘째 던짐입니다. 공정하고 독립인 두 던짐에서는 네 기록이 같은 넓이 1/4을 차지하고 전체 넓이는 1입니다." },
  { label: "U와 V를 따로 칠하면", summary: "1/2 + 1/2 = 1 ?", p: 0.5, note: "U(첫 앞)는 왼쪽 열, V(둘째 앞)는 위쪽 행입니다. 두 넓이를 그냥 더하면 1이 되지만 왼쪽 위 HH 칸을 두 번 칠했습니다." },
  { label: "겹친 칸을 한 번 빼면", summary: "1/2 + 1/2 − 1/4 = 3/4", p: 0.5, note: "둘 중 하나라도 앞면인 칸은 HH·HT·TH 세 칸입니다. 두 번 더한 HH의 1/4을 한 번 빼면 3/4이 남고, 빠지는 칸은 TT뿐입니다." },
  { label: "앞면 확률 0.7 (가정)", summary: "0.21 + 0.21 = 0.42", p: 0.7, note: "각 던짐의 앞면 확률을 0.7로 두고 두 던짐을 독립으로 정하면 칸의 넓이가 달라집니다. 정확히 한 번 앞면인 칸은 여전히 두 칸이지만 넓이 합은 1/2이 아니라 0.42입니다." },
] as const;

const X0 = 64;
const Y0 = 34;
const SIZE = 180;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const INK = "#475569";
const LINE = "#94a3b8";

function fmt(value: number, fair: boolean) {
  if (fair) return "1/4";
  return value.toFixed(2);
}

export default function AreaGridViz() {
  return (
    <SceneShell
      eyebrow="넓이로 세는 확률"
      title="겹친 칸은 한 번만, 칸의 개수가 아니라 넓이를"
      description="정사각형 전체의 넓이가 1입니다. 가로를 첫 던짐, 세로를 둘째 던짐으로 나누면 네 칸이 HH·HT·TH·TT 기록이고 칸의 넓이가 그 기록의 확률입니다."
      ariaLabel="두 번 던진 동전의 네 기록을 넓이로 나타낸 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fair = scene.p === 0.5;
        const w0 = scene.p * SIZE;
        const h0 = scene.p * SIZE;
        const cells = [
          { id: "HH", x: X0, y: Y0, w: w0, h: h0, value: scene.p * scene.p },
          { id: "TH", x: X0 + w0, y: Y0, w: SIZE - w0, h: h0, value: (1 - scene.p) * scene.p },
          { id: "HT", x: X0, y: Y0 + h0, w: w0, h: SIZE - h0, value: scene.p * (1 - scene.p) },
          { id: "TT", x: X0 + w0, y: Y0 + h0, w: SIZE - w0, h: SIZE - h0, value: (1 - scene.p) * (1 - scene.p) },
        ];
        const showUV = active === 1 || active === 2;
        const once = active === 3;
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0 + w0 / 2} y={Y0 - 10} textAnchor="middle" fontSize={12} fill={INK}>첫 앞</text>
            <text x={X0 + w0 + (SIZE - w0) / 2} y={Y0 - 10} textAnchor="middle" fontSize={12} fill={INK}>첫 뒤</text>
            <text x={X0 - 8} y={Y0 + h0 / 2 + 4} textAnchor="end" fontSize={12} fill={INK}>둘째 앞</text>
            <text x={X0 - 8} y={Y0 + h0 + (SIZE - h0) / 2 + 4} textAnchor="end" fontSize={12} fill={INK}>둘째 뒤</text>
            {showUV && (
              <>
                <rect x={X0} y={Y0} width={w0} height={SIZE} fill={BLUE} fillOpacity={0.16} />
                <rect x={X0} y={Y0} width={SIZE} height={h0} fill={AMBER} fillOpacity={0.16} />
              </>
            )}
            {cells.map((cell) => {
              const isOnce = cell.id === "HT" || cell.id === "TH";
              const dim = active === 2 && cell.id === "TT";
              return (
                <g key={cell.id} opacity={dim ? 0.35 : 1}>
                  <rect
                    x={cell.x}
                    y={cell.y}
                    width={cell.w}
                    height={cell.h}
                    fill={once && isOnce ? GREEN : "none"}
                    fillOpacity={once && isOnce ? 0.18 : 0}
                    stroke={once && isOnce ? GREEN : LINE}
                    strokeWidth={once && isOnce ? 1.25 : 1}
                  />
                  <text x={cell.x + cell.w / 2} y={cell.y + cell.h / 2 - 3} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>{cell.id}</text>
                  <text x={cell.x + cell.w / 2} y={cell.y + cell.h / 2 + 12} textAnchor="middle" fontSize={12} fill={INK}>
                    {cell.id === "HH" && active === 1 ? "두 번 칠함" : cell.id === "HH" && active === 2 ? "두 번 → 한 번" : dim ? "제외" : fmt(cell.value, fair)}
                  </text>
                </g>
              );
            })}
            {showUV && (
              <g fontSize={12}>
                <rect x={256} y={Y0 + 6} width={12} height={12} fill={BLUE} fillOpacity={0.3} stroke={BLUE} strokeWidth={1} />
                <text x={274} y={Y0 + 16} fill={INK}>U 첫 앞 1/2</text>
                <rect x={256} y={Y0 + 28} width={12} height={12} fill={AMBER} fillOpacity={0.3} stroke={AMBER} strokeWidth={1} />
                <text x={274} y={Y0 + 38} fill={INK}>V 둘째 앞 1/2</text>
              </g>
            )}
            {once && (
              <g fontSize={12}>
                <rect x={256} y={Y0 + 6} width={12} height={12} fill={GREEN} fillOpacity={0.3} stroke={GREEN} strokeWidth={1} />
                <text x={274} y={Y0 + 16} fill={INK}>정확히 한 번</text>
                <text x={256} y={Y0 + 38} fill={INK}>가로 0.7 | 0.3</text>
                <text x={256} y={Y0 + 54} fill={INK}>세로 0.7 | 0.3</text>
              </g>
            )}
            <text x={X0 + SIZE / 2} y={Y0 + SIZE + 18} textAnchor="middle" fontSize={12} fill={INK}>전체 넓이 = 1</text>
          </svg>
        );
      }}
    />
  );
}
