import Arrow from "./Arrow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 불씨와 솜의 연소를 관찰·자연 인과·필연성·신의 행위 네 층에서 말합니다.
 * 10번은 1절의 사례입니다. 그림의 사건은 그대로이고 그 위에 올리는 주장만 바뀝니다.
 */
const LAYERS = ["관찰", "자연 인과", "필연성", "신의 행위"] as const;

const SCENES = [
  { label: "관찰 층", summary: "되풀이됐다는 기록", note: "불씨와 솜이 만날 때 연소가 되풀이됐다는 기록입니다. 점선은 두 사건이 함께 일어났다는 뜻일 뿐, 왜 그런지는 말하지 않습니다." },
  { label: "자연 인과 층", summary: "열과 성질이 만들어 낸다는 설명", note: "같은 사건에 설명이 붙습니다. 불의 열과 솜의 성질이 연소를 만들어 낸다는 화살표입니다." },
  { label: "필연성 층", summary: "다르게 될 수 없다는 주장", note: "화살표의 뜻이 더 세집니다. 필요한 조건이 모두 같다면 연소하지 않는 일이 불가능하다는 주장입니다." },
  { label: "신의 행위 층", summary: "함께 가능한지 묻는 자리", note: "사건 바깥에서 묻습니다. 자연 사물의 힘이 신의 창조와 어떻게 함께 가능한가입니다. 같은 전통 안에서도 답이 같지 않았습니다." },
] as const;

const ACCENT = "#2563eb";
const LINE = "#94a3b8";
const MUTED = "#64748b";

export default function FourLayersViz() {
  return (
    <SceneShell
      eyebrow="네 층"
      title="같은 연소 위에 서로 다른 네 가지 말이 얹힙니다"
      description="그림의 사건은 그대로입니다. 장면을 넘기면 불씨와 연소 사이에 얹는 말만 바뀝니다. 10번은 1절의 사례입니다."
      ariaLabel="불씨와 솜의 연소 사건에 관찰, 자연 인과, 필연성, 신의 행위 네 층의 주장을 차례로 얹는 그림"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={active === 3 ? 1 : 0}>
              <rect x={128} y={4} width={104} height={32} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={180} y={25} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>신의 창조</text>
              <line x1={180} x2={180} y1={36} y2={92} stroke={ACCENT} strokeWidth={1} strokeDasharray="3 3" />
              <text x={192} y={62} fontSize={15} fontWeight={700} fill={ACCENT}>?</text>
            </g>
            <rect x={10} y={76} width={90} height={36} rx={8} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={55} y={99} textAnchor="middle" fontSize={12} fontWeight={600} fill="currentColor">불씨와 솜</text>
            <rect x={268} y={76} width={82} height={36} rx={8} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={309} y={99} textAnchor="middle" fontSize={12} fontWeight={600} fill="currentColor">연소</text>
            {active === 0 ? (
              <line x1={100} x2={268} y1={94} y2={94} stroke={LINE} strokeWidth={1} strokeDasharray="4 3" />
            ) : (
              <Arrow x1={100} y1={94} x2={268} y2={94} color={active === 1 ? ACCENT : active === 2 ? "#dc2626" : LINE} />
            )}
            {active === 0 && <text x={184} y={86} textAnchor="middle" fontSize={11} fill={MUTED}>함께 일어남</text>}
            {active === 1 && <text x={184} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>불의 열 · 솜의 성질</text>}
            {active === 2 && <text x={184} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">달리 될 수 없음</text>}
            {Array.from({ length: 10 }, (_, i) => (
              <rect key={i} x={70 + i * 22} y={130} width={16} height={16} rx={3} fill={active === 0 ? ACCENT : LINE} opacity={active === 0 ? 0.8 : 0.35} />
            ))}
            <text x={180} y={166} textAnchor="middle" fontSize={11} fill={MUTED}>기록: 10번 모두 연소</text>
          </svg>
          <ol className="mt-3 grid grid-cols-4 gap-1 text-center text-[11px] leading-4 sm:text-xs">
            {LAYERS.map((layer, i) => (
              <li key={layer} className={`rounded border px-1 py-1.5 ${i === active ? "border-primary font-bold text-primary" : "border-border text-muted-foreground"}`}>{layer}</li>
            ))}
          </ol>
        </div>
      )}
    />
  );
}
