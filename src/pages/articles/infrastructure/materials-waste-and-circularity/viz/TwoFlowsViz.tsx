import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — OECD Figure 6.4의 구분(실선=물질, 점선=돈)을 100kg 사례에 적용한다.
 * 물질: 100 = 60 + 20 + 20kg. 돈: 판매수입 6 + 추가 재원 6 = 처리비 12만원.
 * 이 그림은 OECD 원 그림의 복제가 아니라 글의 가정 사례를 같은 구분으로 그린 것이다.
 */
const SCENES = [
  {
    label: "물건의 길",
    summary: "60 + 20 + 20 = 100kg",
    money: 0,
    note: "100kg에서 80kg이 수거·처리로, 60kg이 재료를 사는 쪽으로 갑니다. 미수거와 처리 잔여의 최종 행선지는 따로 확인합니다.",
  },
  {
    label: "돈의 길: 판매대금",
    summary: "판매 6만원",
    money: 1,
    note: "재료 60kg이 업체로 가고 판매대금 6만원은 반대 방향으로 옵니다. 물건과 돈이 같은 방향일 필요는 없습니다.",
  },
  {
    label: "돈의 길: 추가 재원",
    summary: "6 + 6 = 처리비 12만원",
    money: 2,
    note: "처리비 12만원에서 판매대금을 빼면 6만원이 남습니다. 요금·생산자 부담·세금 등 누가 낼지는 사례에서 정하지 않아 출발점을 미정으로 두었습니다.",
  },
  {
    label: "장부를 섞지 않으면",
    summary: "kg은 kg, 원은 원",
    money: 2,
    note: "생산자가 6만원을 낸다고 실선의 60kg이 100kg으로 늘거나 처리비용 12만원이 사라지지 않습니다.",
  },
] as const;

const SOLID = "#64748b";
const MONEY = "#16a34a";

function Node({ x, y, w, h, lines, muted = false }: { x: number; y: number; w: number; h: number; lines: string[]; muted?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={muted ? "#94a3b8" : SOLID} strokeWidth={1} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={y + h / 2 + (index - (lines.length - 1) / 2) * 15 + 4} textAnchor="middle" fontSize={12} fontWeight={index === 0 ? 700 : 400} fill="currentColor">
          {line}
        </text>
      ))}
    </g>
  );
}

export default function TwoFlowsViz() {
  return (
    <SceneShell
      eyebrow="물건과 돈"
      title="같은 사례를 실선과 점선 두 장부로 나눕니다"
      description="OECD 그림의 구분을 빌려 이 글의 가정 사례를 그렸습니다. kg과 금액은 설명용 가정이며 OECD의 수치가 아닙니다."
      ariaLabel="포장재 100kg의 물질 흐름과 판매대금, 추가 재원의 돈 흐름"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showSale = scene.money >= 1;
        const showExtra = scene.money >= 2;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 348 226" className="mx-auto h-auto w-full max-w-[470px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                <marker id="flow-solid" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 8 4 0 8z" fill={SOLID} />
                </marker>
                <marker id="flow-money" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 8 4 0 8z" fill={MONEY} />
                </marker>
              </defs>

              <Node x={2} y={52} w={78} h={46} lines={["사용 종료", "100kg"]} />
              <Node x={130} y={52} w={88} h={46} lines={["수거·처리"]} />
              <Node x={266} y={52} w={80} h={46} lines={["재료 사는", "업체"]} />
              <Node x={2} y={140} w={78} h={46} lines={["미수거", "20kg"]} muted />
              <Node x={118} y={140} w={72} h={46} lines={["처리 잔여", "20kg"]} muted />

              <line x1={80} y1={75} x2={129} y2={75} stroke={SOLID} strokeWidth={1.25} markerEnd="url(#flow-solid)" />
              <text x={104} y={68} textAnchor="middle" fontSize={11} fill="currentColor">80kg</text>
              <line x1={218} y1={75} x2={265} y2={75} stroke={SOLID} strokeWidth={1.25} markerEnd="url(#flow-solid)" />
              <text x={242} y={68} textAnchor="middle" fontSize={11} fill="currentColor">60kg</text>
              <line x1={41} y1={98} x2={41} y2={139} stroke={SOLID} strokeWidth={1.25} markerEnd="url(#flow-solid)" />
              <line x1={154} y1={98} x2={154} y2={139} stroke={SOLID} strokeWidth={1.25} markerEnd="url(#flow-solid)" />

              <g opacity={showSale ? 1 : 0}>
                <path d="M306 51V24H174V51" fill="none" stroke={MONEY} strokeWidth={1.25} strokeDasharray="4 3" markerEnd="url(#flow-money)" />
                <text x={240} y={17} textAnchor="middle" fontSize={12} fontWeight={700} fill={MONEY}>판매대금 6만원</text>
              </g>
              <g opacity={showExtra ? 1 : 0}>
                <path d="M238 163H204V99" fill="none" stroke={MONEY} strokeWidth={1.25} strokeDasharray="4 3" markerEnd="url(#flow-money)" />
                <text x={212} y={124} fontSize={12} fontWeight={700} fill={MONEY}>추가 재원 6만원</text>
                <rect x={238} y={140} width={108} height={46} rx={6} fill="none" stroke={MONEY} strokeWidth={1} strokeDasharray="4 3" />
                <text x={292} y={159} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">누가 낼지 미정</text>
                <text x={292} y={175} textAnchor="middle" fontSize={11} fill="currentColor">요금·생산자·세금 등</text>
              </g>

              <text x={2} y={214} fontSize={11} fill="currentColor">
                실선 = 물건(kg)
              </text>
              <text x={346} y={214} textAnchor="end" fontSize={11} fill={MONEY}>
                점선 = 돈(원)
              </text>
            </svg>

          </div>
        );
      }}
    />
  );
}
