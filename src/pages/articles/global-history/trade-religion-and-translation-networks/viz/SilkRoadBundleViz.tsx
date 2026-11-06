import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 유네스코의 설명대로 실크로드를 여러 육상 길과 해상로의 묶음으로 그립니다.
 * 지도가 아니라 연결 도식입니다. 막히는 구간과 두 연결선의 자리는 설명을 위한 선택입니다(가정).
 */
const SCENES = [
  { label: "한 줄로 읽으면", summary: "전체가 꺼진 것처럼 읽힘", note: "실크로드를 육상 한 줄로 그리면 어느 구간이든 막히는 순간 전체가 끊긴 것처럼 읽힙니다. 한 왕조가 길을 열고 닫으면 전체가 켜지거나 꺼진다는 읽기가 여기서 나옵니다." },
  { label: "여러 길의 묶음", summary: "육상 여러 길 + 해상로", note: "유네스코는 동유럽·서아시아·중앙아시아·동아시아를 가로지르는 여러 육상 길과, 중국·동남아시아·인도·아프리카를 잇는 해상로의 묶음으로 설명합니다. ‘실크로드’라는 이름도 후대에 생겼습니다." },
  { label: "한 구간이 막히면", summary: "다른 길이 커질 수 있음", note: "전쟁으로 한 구간이 막혀도 전체가 동시에 꺼지지 않습니다. 다른 산길·강·바닷길이 커질 수 있고, 상품마다 유리한 경로도 달랐습니다. 얼마나 커지는지는 글이 정하지 않아 선 굵기로 그리지 않았습니다." },
] as const;

const LAND = [
  { x: 30, name: "동유럽" },
  { x: 130, name: "서아시아" },
  { x: 230, name: "중앙아시아" },
  { x: 330, name: "동아시아" },
] as const;
const SEA = [
  { x: 30, name: "아프리카" },
  { x: 130, name: "인도" },
  { x: 230, name: "동남아시아" },
  { x: 330, name: "중국" },
] as const;
const LAND_Y = 66;
const SEA_Y = 172;
const SPANS = [0, 1, 2] as const;

const curve = (x1: number, x2: number, y: number, bulge: number) => `M${x1} ${y}Q${(x1 + x2) / 2} ${y + bulge} ${x2} ${y}`;

export default function SilkRoadBundleViz() {
  return (
    <SceneShell
      eyebrow="여러 길의 묶음"
      title="한 구간이 막혀도 연결망 전체가 꺼지지는 않습니다"
      description="실제 지도가 아니라 연결 도식입니다. 지역 이름은 유네스코 설명에서 가져왔고, 선의 자리와 막히는 구간은 설명을 위한 선택입니다(가정)."
      ariaLabel="실크로드를 한 줄로 읽을 때와 육상 여러 길과 해상로의 묶음으로 읽을 때의 차이"
      scenes={SCENES}
      render={(index) => {
        const single = index === 0;
        const blocked = index === 2;
        const strandColor = (span: number) => (blocked && span === 1 ? "#2563eb" : "#64748b");
        const seaColor = blocked ? "#2563eb" : "#0891b2";
        return (
          <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <text x={0} y={11} fontSize={11} fontWeight={700} fill="#64748b">{single ? "육상 한 줄" : "육상 여러 길"}</text>
            {single ? (
              <>
                <line x1={LAND[0].x} x2={LAND[1].x} y1={LAND_Y} y2={LAND_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={LAND[1].x} x2={LAND[2].x} y1={LAND_Y} y2={LAND_Y} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 3" />
                <line x1={LAND[2].x} x2={LAND[3].x} y1={LAND_Y} y2={LAND_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <path d={`M174 ${LAND_Y - 6}L186 ${LAND_Y + 6}M186 ${LAND_Y - 6}L174 ${LAND_Y + 6}`} stroke="#dc2626" strokeWidth={1.25} />
                <text x={180} y={LAND_Y + 28} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">한 곳이 막힘</text>
                <text x={180} y={LAND_Y + 44} textAnchor="middle" fontSize={11} fill="#64748b">양쪽 다 끊긴 것처럼 읽힘</text>
              </>
            ) : (
              <>
                {SPANS.map((span) => {
                  const x1 = LAND[span].x;
                  const x2 = LAND[span + 1].x;
                  return (
                    <g key={span} fill="none">
                      <path d={curve(x1, x2, LAND_Y, -30)} stroke={strandColor(span)} strokeWidth={1} />
                      <path d={curve(x1, x2, LAND_Y, 30)} stroke={strandColor(span)} strokeWidth={1} />
                      <line x1={x1} x2={x2} y1={LAND_Y} y2={LAND_Y} stroke={blocked && span === 1 ? "#dc2626" : "#64748b"} strokeWidth={1} strokeDasharray={blocked && span === 1 ? "3 3" : undefined} />
                    </g>
                  );
                })}
                {SPANS.map((span) => (
                  <g key={span} fill="none" stroke={seaColor} strokeWidth={1}>
                    <path d={curve(SEA[span].x, SEA[span + 1].x, SEA_Y, -14)} />
                    <path d={curve(SEA[span].x, SEA[span + 1].x, SEA_Y, 14)} />
                  </g>
                ))}
                {[130, 330].map((x) => (
                  <line key={x} x1={x} x2={x} y1={LAND_Y + 7} y2={SEA_Y - 7} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
                ))}
                {SEA.map((node) => (
                  <g key={node.x}>
                    <circle cx={node.x} cy={SEA_Y} r={5} fill="#0891b2" />
                    <text x={node.x} y={SEA_Y + 25} textAnchor={node.x === 30 ? "start" : node.x === 330 ? "end" : "middle"} dx={node.x === 30 ? -24 : node.x === 330 ? 24 : 0} fontSize={11} fill="currentColor">{node.name}</text>
                  </g>
                ))}
                <text x={0} y={SEA_Y + 46} fontSize={11} fontWeight={700} fill="#0891b2">해상로</text>
                {blocked ? (
                  <>
                    <path d={`M174 ${LAND_Y - 6}L186 ${LAND_Y + 6}M186 ${LAND_Y - 6}L174 ${LAND_Y + 6}`} stroke="#dc2626" strokeWidth={1.25} />
                    <text x={230} y={LAND_Y + 46} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">× 막힌 구간(가정)</text>
                    <text x={230} y={LAND_Y + 62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">곁길과 바닷길이 커질 수 있음</text>
                  </>
                ) : (
                  <text x={230} y={LAND_Y + 54} textAnchor="middle" fontSize={11} fill="#64748b">점선: 길을 갈아타는 자리(도식)</text>
                )}
              </>
            )}
            {LAND.map((node) => (
              <g key={node.x}>
                <circle cx={node.x} cy={LAND_Y} r={5} fill={single ? "#94a3b8" : "#64748b"} />
                <text x={node.x} y={LAND_Y - 32} textAnchor={node.x === 30 ? "start" : node.x === 330 ? "end" : "middle"} dx={node.x === 30 ? -24 : node.x === 330 ? 24 : 0} fontSize={11} fill="currentColor">{node.name}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
