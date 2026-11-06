import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #operation-procedure — 중앙은행 관점의 RP매입은 오늘 공급 후 만기 회수, RP매각은 반대.
 * 갱신하면 공급이 이어질 수 있지만 개별 만기는 남는다. 6은 글의 사례 크기를 쓴 설명값.
 */
const SCENES = [
  { label: "RP매입", summary: "오늘 +6 → 만기 0", path: "buy", today: "중앙은행이 증권을 받고 준비금을 공급합니다.", due: "반대 거래로 증권을 돌려주고 준비금을 회수합니다.", note: "RP는 증권을 지금 거래하고 나중에 반대 거래를 하기로 약정합니다. 중앙은행 관점의 RP매입은 오늘 준비금을 공급하고 만기에 회수하는 방향입니다." },
  { label: "RP매각", summary: "오늘 −6 → 만기 0", path: "sell", today: "중앙은행이 증권을 내주고 준비금을 흡수합니다.", due: "반대 거래로 증권을 되찾고 준비금을 돌려줍니다.", note: "RP매각은 그 반대입니다. 같은 ‘증권 거래’라고 해도 매매 방향과 만기가 다르면 오늘과 이후 잔액이 달라집니다." },
  { label: "새 거래로 갱신", summary: "+6이 이어질 수 있음", path: "roll", today: "RP매입으로 준비금을 공급합니다.", due: "회수와 함께 새 RP매입을 시작합니다.", note: "계속 새 거래로 갱신하면 공급이 이어질 수 있지만 개별 거래의 만기 구조가 없어지는 것은 아닙니다." },
] as const;

const X = [78, 200, 322];
const Y0 = 76;
const UP = 28;
const DOWN = 124;
const GRAY = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";

export default function RepoPathViz() {
  return (
    <SceneShell
      eyebrow="RP의 시간표"
      title="RP는 오늘의 거래와 만기의 반대 거래가 한 쌍입니다"
      description="선은 거래 전과 비교한 은행의 준비금 변화입니다. 크기 6은 글의 사례에서 가져온 설명값입니다(가정). 가로 간격은 날짜에 비례하지 않습니다."
      ariaLabel="RP매입, RP매각, 갱신에서 준비금 변화의 시간 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const level = scene.path === "sell" ? DOWN : UP;
        const color = scene.path === "sell" ? AMBER : BLUE;
        const points =
          scene.path === "roll"
            ? `${X[0] - 30},${Y0} ${X[0]},${Y0} ${X[0]},${level} ${X[2]},${level}`
            : `${X[0] - 30},${Y0} ${X[0]},${Y0} ${X[0]},${level} ${X[1]},${level} ${X[1]},${Y0} ${X[2]},${Y0}`;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 160" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={X[0] - 30} x2={X[2]} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
              <text x={X[0] - 36} y={Y0 + 4} textAnchor="end" fontSize={12} fill={GRAY}>0</text>
              {X.map((x, index) => (
                <g key={x}>
                  <line x1={x} x2={x} y1={18} y2={136} stroke="#94a3b8" strokeWidth={1} strokeDasharray="1 3" />
                  <text x={x} y={152} textAnchor="middle" fontSize={11} fill={GRAY}>{["오늘", "만기", "다음 만기"][index]}</text>
                </g>
              ))}
              <polyline points={points} fill="none" stroke={color} strokeWidth={1.25} />
              <text x={X[0] + 8} y={level === UP ? UP - 6 : DOWN - 6} fontSize={13} fontWeight={700} fill={color}>{scene.path === "sell" ? "−6" : "+6"}</text>
              {scene.path === "roll" && (
                <>
                  <circle cx={X[1]} cy={level} r={4} fill="none" stroke={color} strokeWidth={1.25} />
                  <text x={X[1]} y={level + 20} textAnchor="middle" fontSize={11} fill={color}>거래 끝·새 거래</text>
                  <circle cx={X[2]} cy={level} r={4} fill="none" stroke={color} strokeWidth={1.25} />
                </>
              )}
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={SCENES.map((item) => (
                <div key={item.label} className="grid grid-cols-2 gap-2">
                  <p className="rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5"><span className="font-bold">오늘 </span>{item.today}</p>
                  <p className="rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5"><span className="font-bold">만기 </span>{item.due}</p>
                </div>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
