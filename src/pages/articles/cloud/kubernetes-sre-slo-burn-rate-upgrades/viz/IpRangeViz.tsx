import SceneShell from "./SceneShell";

/**
 * 본문 대응: #symptom-cause — /16(65,536개)를 노드당 /24(256개)씩 미리 떼어 주면 65,536 ÷ 256 = 256노드가 상한.
 * 팀의 기대는 65,536 ÷ 110 ≈ 595노드. 한 칸에서 Pod 110개를 다 써도 256 − 110 = 146개가 남는다.
 */
const SCENES = [
  { label: "IP 범위를 칸으로 나눕니다", summary: "65,536 ÷ 256 = 256칸", note: "Pod용 범위 /16은 IP 65,536개입니다. 규칙은 이것을 /24, 곧 256개 묶음으로 자릅니다. 그림의 칸 하나가 IP 256개입니다." },
  { label: "노드마다 한 칸을 통째로", summary: "노드 1대 = IP 256개", note: "노드가 생기면 Pod 수와 상관없이 한 칸을 미리 가져갑니다. 칠해진 40칸은 진행 모습을 보이려는 가정입니다." },
  { label: "칸이 다 차면", summary: "256노드에서 멈춤", note: "256칸이 다 차면 새 노드에 줄 칸이 없습니다. Pod의 Event가 적은 0/256의 256과 같은 숫자입니다. 자원 지표는 부족을 말해도 이 상한을 말해 주지 않습니다." },
  { label: "팀이 기대한 계산과의 차이", summary: "기대 595 vs 실제 256", note: "팀은 노드당 Pod 110개로 65,536 ÷ 110 ≈ 595노드를 기대했습니다. 그러나 한 칸에서 110개를 다 써도 146개가 남고, 그 몫은 다른 노드가 쓰지 못합니다." },
] as const;

const BLOCK = 10;
const CELL = 8;
const X0 = 8;
const Y0 = 26;
const BLUE = "#2563eb";
const INDEXES = Array.from({ length: 256 }, (_, index) => index);

export default function IpRangeViz() {
  return (
    <SceneShell
      eyebrow="Pod IP 할당"
      title="노드마다 256개씩 떼어 주면 256번째 노드에서 끝납니다"
      description="왼쪽 격자의 칸 하나가 IP 256개이며 16 × 16칸이 /16 전체입니다. /16과 /24는 IP 범위의 크기를 적는 표기로, 여기서는 각각 65,536개와 256개입니다."
      ariaLabel="Pod IP 범위를 노드당 묶음으로 나눌 때의 노드 상한"
      scenes={SCENES}
      render={(active) => {
        const filled = active === 0 ? 0 : active === 1 ? 40 : 256;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={17} fontSize={11} fontWeight={700} className="fill-foreground">/16 · IP 65,536개</text>
            {INDEXES.map((index) => (
              <rect key={index} x={X0 + (index % 16) * BLOCK} y={Y0 + Math.floor(index / 16) * BLOCK} width={BLOCK - 1} height={BLOCK - 1} fill={index < filled ? BLUE : "#94a3b8"} fillOpacity={index < filled ? 0.7 : 0.22} />
            ))}
            {active === 0 && (
              <>
                <rect x={X0} y={Y0} width={BLOCK - 1} height={BLOCK - 1} fill="none" stroke="#dc2626" strokeWidth={1.25} />
                <text x={186} y={62} fontSize={12} fontWeight={700} className="fill-foreground">한 칸 = /24 = IP 256개</text>
                <text x={186} y={84} fontSize={12} className="fill-foreground">가로 16 × 세로 16 = 256칸</text>
                <text x={186} y={106} fontSize={12} className="fill-foreground">256칸 × 256개 = 65,536개</text>
              </>
            )}
            {active === 1 && (
              <>
                <text x={186} y={62} fontSize={12} fontWeight={700} fill={BLUE}>칠한 칸 = 노드 1대</text>
                <text x={186} y={84} fontSize={12} className="fill-foreground">Pod가 적어도 한 칸 전체</text>
                <text x={186} y={106} fontSize={12} fill="#64748b">노드 40대 (가정)</text>
              </>
            )}
            {active === 2 && (
              <>
                <rect x={194} y={52} width={144} height={44} rx={6} fill="#dc2626" fillOpacity={0.1} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                <text x={266} y={71} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">257번째 노드</text>
                <text x={266} y={87} textAnchor="middle" fontSize={11} fill="#dc2626">줄 칸 없음</text>
                <text x={186} y={122} fontSize={12} className="fill-foreground">256칸 = 노드 상한 256</text>
              </>
            )}
            {active === 3 && (
              <>
                <line x1={X0 + BLOCK * 16} y1={Y0} x2={196} y2={Y0} stroke="#94a3b8" strokeWidth={0.5} />
                <text x={196} y={17} fontSize={11} fontWeight={700} className="fill-foreground">노드 한 칸 · IP 256개</text>
                {INDEXES.map((index) => (
                  <rect key={index} x={196 + (index % 16) * CELL} y={Y0 + Math.floor(index / 16) * CELL} width={CELL - 1} height={CELL - 1} fill={index < 110 ? BLUE : "#d97706"} fillOpacity={index < 110 ? 0.75 : 0.4} />
                ))}
                <text x={196} y={170} fontSize={11} fontWeight={700} fill={BLUE}>Pod 110개</text>
                <text x={324} y={170} textAnchor="end" fontSize={11} fontWeight={700} fill="#d97706">남는 146개</text>
                <text x={196} y={188} fontSize={10.5} fill="#64748b">65,536 ÷ 110 ≈ 595 (기대)</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
