import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 망·웹·호스팅·검색과 플랫폼·광고와 구독의 층, 층마다 다른 통제점,
 * 그리고 글을 올려도 검색·추천에서 빠지면 거의 보이지 않는 경우.
 * 층 높이는 중요도나 규모가 아니다.
 */
const LAYER = "#2563eb";
const CONTROL = "#d97706";
const POST = "#16a34a";
const DROP = "#dc2626";

const LAYERS = [
  { name: "광고·구독", role: "정렬의 사업 비용을 댐" },
  { name: "검색·플랫폼", role: "수많은 문서 가운데 순서를 정함" },
  { name: "호스팅", role: "페이지를 보관함" },
  { name: "웹", role: "주소·하이퍼텍스트·전송 규칙으로 문서를 연결" },
  { name: "인터넷", role: "장치와 망 사이에 데이터를 보냄" },
] as const;

const SCENES = [
  { label: "층을 나눕니다", summary: "다섯 층", note: "인터넷은 장치와 망 사이에 데이터를 보내는 기반이고, 웹은 그 위에서 문서를 연결하는 서비스입니다. 하이퍼텍스트는 다른 문서로 건너가는 링크를 품은 글입니다. 호스팅이 페이지를 보관하고, 검색과 플랫폼이 순서를 정하며, 광고와 구독이 그 비용을 댑니다." },
  { label: "국가나 통신사가 접속을 제한합니다", summary: "통제점 ① 아래층", note: "국가나 통신사는 접속을 제한합니다. 이 통제점은 데이터를 보내는 가장 아래층에 걸립니다." },
  { label: "앱 마켓과 플랫폼이 규칙을 바꿉니다", summary: "통제점 ② 위층", note: "앱 마켓과 플랫폼은 배포·계정·추천 규칙을 바꿉니다. 접속을 막는 통제점과는 다른 층에 있는 통제점입니다." },
  { label: "올렸는데 거의 보이지 않는 글", summary: "발행 ≠ 발견", note: "이용자는 글을 올려도 검색이나 추천에서 빠질 수 있습니다. 글은 망·웹·호스팅을 지나 보관되어 있지만, 실제 공론장에서는 거의 보이지 않습니다." },
] as const;

const ROW_H = 36;
const ROW_GAP = 6;
const TOP = 8;

export default function LayerControlViz() {
  return (
    <SceneShell
      eyebrow="층과 통제점"
      title="층마다 통제점이 다르고, 올린 글도 위층에서 빠질 수 있습니다"
      description="연결에서 노출까지를 다섯 층으로 나눈 단순 모형입니다. 띠의 높이는 규모나 중요도를 뜻하지 않습니다."
      ariaLabel="인터넷, 웹, 호스팅, 검색과 플랫폼, 광고와 구독 다섯 층과 각 층의 통제점, 검색과 추천에서 빠진 게시물"
      scenes={SCENES}
      render={(active) => {
        const rowY = (index: number) => TOP + index * (ROW_H + ROW_GAP);
        const postOn = active === 3;
        return (
          <svg viewBox="0 0 360 222" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {LAYERS.map((layer, index) => {
              const y = rowY(index);
              const controlled = (active === 1 && index === 4) || (active === 2 && index === 1);
              const passed = postOn && index >= 2;
              const blocked = postOn && index === 1;
              const color = blocked ? DROP : controlled ? CONTROL : LAYER;
              return (
                <g key={layer.name}>
                  <rect x={8} y={y} width={252} height={ROW_H} rx={6} fill={color} fillOpacity={controlled || blocked ? 0.16 : 0.07} stroke={color} strokeWidth={controlled || blocked ? 1.25 : 1} strokeOpacity={active === 0 || controlled || passed || blocked ? 1 : 0.45} />
                  <text x={18} y={y + 15} fontSize={12.5} fontWeight={700} fill="currentColor">{layer.name}</text>
                  <text x={18} y={y + 29} fontSize={10.5} fill="currentColor" opacity={0.8}>{layer.role}</text>
                  {passed && <text x={252} y={y + 23} textAnchor="end" fontSize={11} fontWeight={700} fill={POST}>통과</text>}
                  {blocked && <text x={252} y={y + 23} textAnchor="end" fontSize={11} fontWeight={700} fill={DROP}>빠짐</text>}
                </g>
              );
            })}

            {active === 1 && (
              <g>
                <line x1={262} y1={rowY(4) + ROW_H / 2} x2={276} y2={rowY(4) + ROW_H / 2} stroke={CONTROL} strokeWidth={1.25} />
                <text x={280} y={rowY(4) + 15} fontSize={11} fontWeight={700} fill={CONTROL}>국가·통신사</text>
                <text x={280} y={rowY(4) + 29} fontSize={10.5} fill="currentColor">접속 제한</text>
              </g>
            )}
            {active === 2 && (
              <g>
                <line x1={262} y1={rowY(1) + ROW_H / 2} x2={276} y2={rowY(1) + ROW_H / 2} stroke={CONTROL} strokeWidth={1.25} />
                <text x={280} y={rowY(1) + 12} fontSize={11} fontWeight={700} fill={CONTROL}>앱 마켓·플랫폼</text>
                <text x={280} y={rowY(1) + 26} fontSize={10.5} fill="currentColor">배포·계정·</text>
                <text x={280} y={rowY(1) + 39} fontSize={10.5} fill="currentColor">추천 규칙</text>
              </g>
            )}
            {postOn && (
              <g>
                <rect x={280} y={rowY(4) + 6} width={66} height={24} rx={4} fill={POST} fillOpacity={0.15} stroke={POST} strokeWidth={1} />
                <text x={313} y={rowY(4) + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={POST}>올린 글</text>
                <line x1={313} y1={rowY(4) + 4} x2={313} y2={rowY(2) + 4} stroke={POST} strokeWidth={1.25} />
                <polygon points={`313,${rowY(2)} 309,${rowY(2) + 7} 317,${rowY(2) + 7}`} fill={POST} />
                <line x1={313} y1={rowY(2) - 2} x2={313} y2={rowY(1) + ROW_H / 2 + 4} stroke={DROP} strokeWidth={1} strokeDasharray="3 2" />
                <g stroke={DROP} strokeWidth={1.25}>
                  <line x1={306} y1={rowY(1) + 12} x2={320} y2={rowY(1) + 26} />
                  <line x1={306} y1={rowY(1) + 26} x2={320} y2={rowY(1) + 12} />
                </g>
                <text x={313} y={rowY(0) + 16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={DROP}>공론장에서</text>
                <text x={313} y={rowY(0) + 30} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={DROP}>거의 안 보임</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
