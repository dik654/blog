import SceneShell from "./SceneShell";

/**
 * 본문 대응: #independence-boundary(11절) 마지막 문단 — 각 던짐이 반반이어도
 * HH·HT·TH·TT = 3/8·1/8·1/8·3/8(가정)이면 P(HH)=3/8 ≠ 1/4, P(V|U)=3/4.
 * 열 = 첫 던짐(각 1/2), 열 안의 높이 = 그 열 안에서 둘째 던짐의 몫.
 */
const SCENES = [
  { label: "원래 모형: 칸마다 1/4", summary: "P(HH) = 1/4 = 1/2 × 1/2", topH: 0.5, topT: 0.5, note: "왼쪽 열이 U(첫 앞), 위쪽 칸들이 V(둘째 앞)입니다. 두 열 모두 가운데에서 나뉘므로 첫 결과를 알아도 둘째 앞의 몫은 1/2 그대로입니다." },
  { label: "비중만 바꾸면 (가정)", summary: "P(HH) = 3/8 ≠ 1/4", topH: 0.75, topT: 0.25, note: "HH·HT·TH·TT에 3/8·1/8·1/8·3/8을 줍니다. 왼쪽 열은 여전히 1/2이고 위쪽 칸의 합도 3/8+1/8=1/2이지만, HH는 곱 1/4이 아니라 3/8입니다." },
  { label: "첫 H를 알면", summary: "(3/8) ÷ (1/2) = 3/4", topH: 0.75, topT: 0.25, note: "오른쪽 열을 지우고 왼쪽 열을 새 전체로 봅니다. 그 안에서 HH가 높이의 3/4을 차지하므로 둘째 앞의 비율이 1/2에서 3/4로 올라갑니다." },
] as const;

const X0 = 64;
const Y0 = 34;
const SIZE = 180;
const COL = SIZE / 2;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const INK = "#475569";
const LINE = "#94a3b8";

export default function DependenceMosaicViz() {
  return (
    <SceneShell
      eyebrow="곱이 맞는지 넓이로 확인"
      title="각 던짐이 반반이어도 두 던짐은 서로 정보를 줄 수 있습니다"
      description="정사각형 전체가 확률 1입니다. 두 열은 첫 던짐의 앞·뒤(각 1/2)이고, 열 안의 가로선 위치는 그 열에서 둘째가 앞일 몫입니다. 칸의 넓이가 그 기록의 확률입니다."
      ariaLabel="첫 던짐과 둘째 던짐의 결합확률을 넓이로 나타낸 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fair = active === 0;
        const hH = scene.topH * SIZE;
        const hT = scene.topT * SIZE;
        const cells = [
          { id: "HH", x: X0, y: Y0, h: hH, value: fair ? "1/4" : "3/8", left: true },
          { id: "HT", x: X0, y: Y0 + hH, h: SIZE - hH, value: fair ? "1/4" : "1/8", left: true },
          { id: "TH", x: X0 + COL, y: Y0, h: hT, value: fair ? "1/4" : "1/8", left: false },
          { id: "TT", x: X0 + COL, y: Y0 + hT, h: SIZE - hT, value: fair ? "1/4" : "3/8", left: false },
        ];
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0 + COL / 2} y={Y0 - 10} textAnchor="middle" fontSize={12} fill={INK}>U 첫 앞 1/2</text>
            <text x={X0 + COL * 1.5} y={Y0 - 10} textAnchor="middle" fontSize={12} fill={INK} opacity={active === 2 ? 0.35 : 1}>첫 뒤 1/2</text>
            {cells.map((cell) => {
              const dim = active === 2 && !cell.left;
              const isV = cell.id === "HH" || cell.id === "TH";
              return (
                <g key={cell.id} opacity={dim ? 0.25 : 1}>
                  <rect x={cell.x} y={cell.y} width={COL} height={cell.h} fill={isV ? AMBER : "none"} fillOpacity={isV ? 0.16 : 0} stroke={cell.id === "HH" && active === 2 ? BLUE : LINE} strokeWidth={cell.id === "HH" && active === 2 ? 1.25 : 1} />
                  <text x={cell.x + COL / 2} y={cell.y + cell.h / 2 - 2} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>{cell.id}</text>
                  <text x={cell.x + COL / 2} y={cell.y + cell.h / 2 + 13} textAnchor="middle" fontSize={12} fill={INK}>{dim ? "제외" : cell.value}</text>
                </g>
              );
            })}
            {active === 2 && (
              <g>
                <line x1={X0 - 10} x2={X0 - 10} y1={Y0} y2={Y0 + hH} stroke={BLUE} strokeWidth={1.25} />
                <text x={X0 - 14} y={Y0 + hH / 2 + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={BLUE}>3/4</text>
                <line x1={X0 - 10} x2={X0 - 10} y1={Y0 + hH} y2={Y0 + SIZE} stroke={LINE} strokeWidth={1} />
                <text x={X0 - 14} y={Y0 + hH + (SIZE - hH) / 2 + 4} textAnchor="end" fontSize={12} fill={INK}>1/4</text>
              </g>
            )}
            <g fontSize={12}>
              <rect x={256} y={Y0 + 6} width={12} height={12} fill={AMBER} fillOpacity={0.3} stroke={AMBER} strokeWidth={1} />
              <text x={274} y={Y0 + 16} fill={INK}>V 둘째 앞</text>
              <text x={256} y={Y0 + 40} fill={INK}>{active === 2 ? "왼쪽 열 안에서" : "위쪽 칸 합"}</text>
              <text x={256} y={Y0 + 56} fontWeight={700} fill={INK}>{active === 0 ? "1/4+1/4 = 1/2" : active === 1 ? "3/8+1/8 = 1/2" : "V의 몫 3/4"}</text>
            </g>
            <text x={X0 + SIZE / 2} y={Y0 + SIZE + 18} textAnchor="middle" fontSize={12} fill={INK}>전체 넓이 = 1</text>
          </svg>
        );
      }}
    />
  );
}
