import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 향신료는 100→80→50묶음으로 줄고, 안내서는 1권이 필사본 10권이 될 수 있습니다.
 * 위 칸 = 묶음 하나가 칸 하나. 아래 칸 = 안내서와 기억에 남는 지식. 두 칸의 단위는 서로 다릅니다.
 * 100−20=80, 80−30=50. 숫자는 3절의 가정 장부입니다.
 */
const SCENES = [
  { label: "향신료는 줄어듭니다", summary: "100 → 80 → 50묶음", note: "20묶음이 현지 소비와 세금으로 빠지고, 인도 항구에서 30묶음이 팔립니다. 각 항구에서 가격이 붙지만 장부에 금액은 없습니다." },
  { label: "안내서는 늘어날 수 있습니다", summary: "1권 → 필사본 10권 가능", note: "한 항해 안내서는 선장 한 명에게 전달된 뒤 필사본 열 권이 될 수 있습니다. 위 칸과 달리 베껴서 늘어날 수 있습니다." },
  { label: "번역이 없으면 멈춥니다", summary: "권수와 쓰임은 다릅니다", note: "필사본이 열 권이어도 번역되지 않으면 다른 언어권 선원에게 쓰이지 못합니다." },
  { label: "물건이 사라진 뒤", summary: "같은 단위로 재지 않습니다", note: "물건이 사라진 뒤에도 종교 이야기와 계산법은 사람의 기억과 학교에 남습니다. 그래서 물질 흐름과 문화 영향의 크기를 같은 단위로 재지 않습니다." },
] as const;

const GRIDS = [
  { x: 8, name: "출발 항구", count: 100 },
  { x: 135, name: "인도 항구", count: 80 },
  { x: 262, name: "서아시아 항구", count: 50 },
] as const;
const CELLS = Array.from({ length: 100 }, (_, i) => i);
const BOOK_XS = Array.from({ length: 10 }, (_, i) => 172 + i * 18);

function Book({ x, y }: { x: number; y: number }) {
  return <rect x={x} y={y} width={14} height={18} rx={2} fill="#2563eb" fillOpacity={0.2} stroke="#2563eb" strokeWidth={1} />;
}

function Right({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g stroke="#94a3b8" strokeWidth={1} fill="none">
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <path d={`M${x2 - 5} ${y - 4}L${x2} ${y}L${x2 - 5} ${y + 4}`} />
    </g>
  );
}

export default function GoodsVsBookViz() {
  return (
    <SceneShell
      eyebrow="다른 단위, 다른 모양"
      title="같은 길에서 향신료는 줄고 필사본은 늘 수 있습니다"
      description="위 칸 하나가 향신료 한 묶음입니다. 3절의 장부 숫자이며 특정 항해의 실측값이 아닙니다(가정). 아래는 권과 사람으로 세므로 위아래 크기를 비교하지 않습니다."
      ariaLabel="향신료 묶음이 줄어드는 경로와 안내서 필사, 번역, 기억에 남는 지식의 비교"
      scenes={SCENES}
      render={(index) => {
        const goodsOn = index === 0;
        const goodsGone = index === 3;
        return (
          <svg viewBox="0 0 360 258" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <text x={0} y={11} fontSize={11} fontWeight={700} fill="#b45309">향신료 · 단위: 묶음</text>
            {GRIDS.map((grid) => (
              <g key={grid.x}>
                <text x={grid.x + 45} y={29} textAnchor="middle" fontSize={11} fill="currentColor">{grid.name}</text>
                {CELLS.map((cell) => {
                  const kept = !goodsGone && cell < grid.count;
                  return (
                    <rect
                      key={cell}
                      x={grid.x + 5 + (cell % 10) * 8}
                      y={36 + Math.floor(cell / 10) * 8}
                      width={7}
                      height={7}
                      rx={1}
                      fill={kept ? "#d97706" : "none"}
                      fillOpacity={kept ? (goodsOn ? 0.85 : 0.3) : 0}
                      stroke={kept ? "#d97706" : "#94a3b8"}
                      strokeOpacity={kept ? (goodsOn ? 1 : 0.4) : 0.6}
                      strokeWidth={1}
                    />
                  );
                })}
                <text x={grid.x + 45} y={130} textAnchor="middle" fontSize={12} fontWeight={700} fill={goodsOn ? "currentColor" : "#64748b"}>
                  {goodsGone ? "사라짐" : `${grid.count}묶음`}
                </text>
              </g>
            ))}
            <Right x1={102} x2={131} y={75} />
            <Right x1={229} x2={258} y={75} />
            {goodsOn && (
              <>
                <text x={116} y={145} textAnchor="middle" fontSize={11} fill="#64748b">−20 현지 소비·세금</text>
                <text x={245} y={145} textAnchor="middle" fontSize={11} fill="#64748b">−30 판매</text>
              </>
            )}

            <line x1={0} x2={360} y1={152} y2={152} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={0} y={168} fontSize={11} fontWeight={700} fill="#2563eb">
              {goodsGone ? "종교 이야기·계산법" : "항해 안내서 · 단위: 권"}
            </text>

            {!goodsGone && (
              <>
                <Book x={8} y={176} />
                <text x={15} y={208} textAnchor="middle" fontSize={11} fill="currentColor">1권</text>
                <Right x1={28} x2={62} y={185} />
                <text x={92} y={189} textAnchor="middle" fontSize={11} fill="currentColor">선장 1명</text>
              </>
            )}
            {(index === 1 || index === 2) && (
              <>
                <Right x1={122} x2={164} y={185} />
                {BOOK_XS.map((x) => <Book key={x} x={x} y={176} />)}
                <text x={259} y={208} textAnchor="middle" fontSize={11} fill="currentColor">필사본 10권이 될 수 있음</text>
              </>
            )}
            {index === 2 && (
              <g>
                <rect x={8} y={218} width={136} height={38} rx={8} fill="#dc2626" fillOpacity={0.08} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                <text x={76} y={241} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">번역되지 않으면</text>
                <Right x1={150} x2={176} y={237} />
                <rect x={182} y={218} width={170} height={38} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <text x={267} y={234} textAnchor="middle" fontSize={11} fill="currentColor">다른 언어권 선원에게</text>
                <text x={267} y={249} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">쓰이지 못함</text>
              </g>
            )}
            {goodsGone && (
              <g>
                <rect x={8} y={180} width={136} height={56} rx={8} fill="#2563eb" fillOpacity={0.1} stroke="#2563eb" strokeWidth={1} />
                <text x={76} y={204} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">종교 이야기</text>
                <text x={76} y={221} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">계산법</text>
                <Right x1={150} x2={210} y={208} />
                <rect x={216} y={180} width={136} height={56} rx={8} fill="none" stroke="#2563eb" strokeWidth={1} />
                <text x={284} y={204} textAnchor="middle" fontSize={12} fill="currentColor">사람의 기억</text>
                <text x={284} y={221} textAnchor="middle" fontSize={12} fill="currentColor">학교에 남음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
