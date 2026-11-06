import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 위치 −1, 0, 1을 모두 z=0으로 바꾸면 예측 오차는 0이지만 구별이 사라진다.
 * 정상 사상은 이 글의 가정 z=x. 붕괴에서는 목표 표현도 0이므로 네 후보 비용이 모두 0.
 */
const INK = "#64748b";
const BLUE = "#2563eb";
const RED = "#dc2626";
const SRC_X = 66;
const DST_X = 256;
const rowY = (index: number) => 44 + index * 50;
const POS = [1, 0, -1] as const;
const label = (x: number) => (x > 0 ? `+${x}` : x < 0 ? `−${-x}` : "0");

const SCENES = [
  { label: "구별이 남은 표현", summary: "z = x · 값 3개", note: "서로 다른 위치가 서로 다른 표현으로 갑니다. 이 글의 가정 z=x입니다." },
  { label: "모두 0으로 보내면", summary: "z = 0 · 값 1개", note: "서로 다른 위치 −1, 0, 1을 encoder가 모두 z=0으로 바꿉니다. 표현 붕괴라고 부르는 실패입니다." },
  { label: "그래도 예측 오차는 0", summary: "(0 − 0)² = 0", note: "predictor도 0을 내면 다음 표현의 예측 오차는 0입니다. 예측 loss만 최소화하면 이런 쉬운 해법이 생길 수 있습니다." },
  { label: "그러나 고를 수 없습니다", summary: "네 후보 비용이 모두 0", note: "목표도 0으로 바뀌므로 네 후보의 비용이 모두 같아집니다. 앞에서 16, 4, 4, 0으로 갈렸던 차이가 사라져 어느 행동과 목표도 구별할 수 없습니다." },
] as const;

export default function CollapseMapViz() {
  return (
    <SceneShell
      eyebrow="표현 붕괴"
      title="모든 위치가 같은 표현이 되면 오차는 0이어도 고를 것이 없습니다"
      description="왼쪽은 실제 위치, 오른쪽은 encoder가 만든 표현 z입니다. 위치와 비용은 이 글의 1차원 가정입니다."
      ariaLabel="위치를 표현으로 옮기는 대응과 표현 붕괴 시 비용이 사라지는 과정"
      scenes={SCENES}
      render={(active) => {
        const collapsed = active > 0;
        return (
          <div>
            <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={SRC_X} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>위치 x</text>
              <text x={DST_X} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>표현 z</text>
              {POS.map((x, index) => {
                const y = rowY(index);
                const toY = collapsed ? rowY(1) : y;
                return (
                  <g key={x}>
                    <circle cx={SRC_X} cy={y} r={14} fill="none" stroke={INK} strokeWidth={1} />
                    <text x={SRC_X} y={y + 4} textAnchor="middle" fontSize={12} fill={INK}>{label(x)}</text>
                    <line x1={SRC_X + 16} y1={y} x2={DST_X - 18} y2={toY} stroke={collapsed ? RED : BLUE} strokeWidth={1} />
                    {!collapsed && (
                      <>
                        <circle cx={DST_X} cy={y} r={14} fill="none" stroke={BLUE} strokeWidth={1} />
                        <text x={DST_X} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>{label(x)}</text>
                      </>
                    )}
                  </g>
                );
              })}
              {collapsed && (
                <>
                  <circle cx={DST_X} cy={rowY(1)} r={14} fill="none" stroke={RED} strokeWidth={1.25} />
                  <text x={DST_X} y={rowY(1) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>0</text>
                </>
              )}
              {active >= 2 && (
                <text x={DST_X + 22} y={rowY(1) + 4} fontSize={12} fontWeight={700} fill={RED}>예측도 0</text>
              )}
            </svg>
            <div className={`mt-2 grid grid-cols-4 gap-1 text-center ${active === 3 ? "" : "invisible"}`}>
              {[["[−1,−1]", 16], ["[−1,+1]", 4], ["[+1,−1]", 4], ["[+1,+1]", 0]].map(([name, before]) => (
                <div key={String(name)} className="min-w-0 rounded border border-border px-0.5 py-1 text-xs leading-5">
                  <span className="block font-mono">{name}</span>
                  <span className="block text-muted-foreground">3절 {before}</span>
                  <strong className="block text-red-700 dark:text-red-400">지금 0</strong>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
