import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 차탈회위크 동쪽 언덕의 18개 거주 층(기원전 7400~6200년 사이),
 * 지붕으로 드나든 붙어 있는 집들, 그리고 배치만으로 평등을 증명할 수 없다는 한계.
 * 단면 그림의 집 개수·폭·벽 위치는 모두 도식(가정)이다. 층 두께도 실제 비율이 아니다.
 */
const LAYERS = 18;
const BAND_TOP = 78;
const BAND_H = 11;
const LEFT = 70;
const RIGHT = 430;
const HOUSE_TOP = 26;
const HOUSE_BOTTOM = 72;
const HOUSE_WIDTHS: readonly number[] = [60, 50, 66, 54, 60];
const HOUSE_X0 = 80;
const HOUSE_XS = HOUSE_WIDTHS.map((_, index) => HOUSE_X0 + HOUSE_WIDTHS.slice(0, index).reduce<number>((sum, width) => sum + width, 0));
const WALL_XS = [...HOUSE_XS, HOUSE_X0 + HOUSE_WIDTHS.reduce<number>((sum, width) => sum + width, 0)];
const LAYER_INDEXES = Array.from({ length: LAYERS }, (_, index) => index);

const SCENES = [
  { label: "한 언덕에 거주 층 18개", summary: "기원전 7400~6200년 사이", walls: false, houses: false, caveat: false, note: "단면을 옆에서 본 도식입니다. 띠 하나가 거주 층 하나이고, 층위에서는 아래 층이 먼저 쌓입니다. UNESCO가 설명하는 동쪽 언덕의 18개 층은 기원전 7400~6200년 사이에 쌓였습니다. 띠 두께는 실제 비율이 아닙니다." },
  { label: "같은 자리에 다시 짓습니다", summary: "18개 층이 한 장소에", walls: true, houses: false, caveat: false, note: "세로 짧은 선은 각 층의 벽 자리를 뜻하는 도식입니다(위치는 가정). 사람들이 다른 곳으로 옮기지 않고 같은 장소를 오래 다시 지었기에 층이 위로 겹칩니다. 이 반복이 정착 생활의 증거입니다." },
  { label: "붙어 있는 집, 지붕으로 출입", summary: "벽을 맞댄 집들", walls: true, houses: true, caveat: false, note: "맨 위에 한 시점의 집들을 키워 그렸습니다. 집이 벽을 맞대고 붙어 있고, 화살표처럼 지붕으로 드나들었습니다. 집 개수와 폭은 도식입니다(가정)." },
  { label: "배치가 말하지 않는 것", summary: "평등의 증명은 아님", walls: true, houses: true, caveat: true, note: "붙어 있는 배치는 그 시점의 공간 구성을 보여 줄 뿐, 재산·성별·의례 권력이 모두 같았다는 증명이 아닙니다. 묘지·식생활·도구·인체 자료를 함께 보고, 점선처럼 발굴되지 않은 부분과 보존 편향을 남겨 둬야 합니다." },
] as const;

export default function CatalhoyukLayersViz() {
  return (
    <SceneShell
      eyebrow="정착의 단면"
      title="차탈회위크의 층과 붙어 있는 집을 단면으로 봅니다"
      description="언덕을 세로로 잘라 옆에서 본 도식입니다. 층 수와 연대는 UNESCO 설명을 따르고, 집 개수·폭·벽 위치는 가정입니다."
      ariaLabel="차탈회위크 18개 거주 층의 단면, 같은 자리 재건축, 지붕 출입의 붙어 있는 집, 배치 해석의 한계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 440 300" className="mx-auto h-auto w-full max-w-[500px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {LAYER_INDEXES.map((layer) => (
              <rect key={layer} x={LEFT} y={BAND_TOP + layer * BAND_H} width={RIGHT - LEFT} height={BAND_H} fill={layer % 2 === 0 ? "#d97706" : "#b45309"} fillOpacity={0.16} stroke="#92400e" strokeOpacity={0.35} strokeWidth={0.5} />
            ))}
            <text x={LEFT - 6} y={BAND_TOP + 9} textAnchor="end" fontSize={14} fill="currentColor">가장 위</text>
            <text x={LEFT - 6} y={BAND_TOP + LAYERS * BAND_H - 2} textAnchor="end" fontSize={14} fill="currentColor">가장 아래</text>
            <line x1={LEFT - 30} y1={BAND_TOP + LAYERS * BAND_H - 20} x2={LEFT - 30} y2={BAND_TOP + 22} stroke="currentColor" strokeWidth={1} />
            <path d={`M ${LEFT - 34} ${BAND_TOP + 28} L ${LEFT - 30} ${BAND_TOP + 20} L ${LEFT - 26} ${BAND_TOP + 28}`} fill="none" stroke="currentColor" strokeWidth={1} />
            <text x={LEFT - 36} y={BAND_TOP + 104} textAnchor="middle" fontSize={13} fill="currentColor" transform={`rotate(-90 ${LEFT - 36} ${BAND_TOP + 104})`}>쌓인 순서</text>
            {scene.walls
              ? LAYER_INDEXES.map((layer) =>
                  WALL_XS.map((wallX, wallIndex) => (
                    <line key={`${layer}-${wallIndex}`} x1={wallX + (((layer + wallIndex) * 7) % 9) - 4} x2={wallX + (((layer + wallIndex) * 7) % 9) - 4} y1={BAND_TOP + layer * BAND_H + 2} y2={BAND_TOP + layer * BAND_H + BAND_H - 2} stroke="#7c2d12" strokeWidth={1} />
                  )),
                )
              : null}
            {scene.houses ? (
              <g>
                {HOUSE_XS.map((houseX, index) => {
                  const width = HOUSE_WIDTHS[index];
                  const mid = houseX + width / 2;
                  return (
                    <g key={houseX}>
                      <path d={`M ${houseX} ${HOUSE_BOTTOM} L ${houseX} ${HOUSE_TOP} L ${mid - 7} ${HOUSE_TOP}`} fill="none" stroke="currentColor" strokeWidth={1.25} />
                      <path d={`M ${mid + 7} ${HOUSE_TOP} L ${houseX + width} ${HOUSE_TOP} L ${houseX + width} ${HOUSE_BOTTOM}`} fill="none" stroke="currentColor" strokeWidth={1.25} />
                      <rect x={houseX + 1} y={HOUSE_TOP + 1} width={width - 2} height={HOUSE_BOTTOM - HOUSE_TOP - 1} fill="#d97706" fillOpacity={0.08} />
                      <line x1={mid} y1={HOUSE_TOP - 18} x2={mid} y2={HOUSE_TOP + 12} stroke="#2563eb" strokeWidth={1.25} />
                      <path d={`M ${mid - 4} ${HOUSE_TOP + 6} L ${mid} ${HOUSE_TOP + 12} L ${mid + 4} ${HOUSE_TOP + 6}`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                      {scene.caveat ? <text x={mid} y={HOUSE_BOTTOM - 10} textAnchor="middle" fontSize={14} fontWeight={700} fill="#dc2626">?</text> : null}
                    </g>
                  );
                })}
                <line x1={HOUSE_X0} y1={HOUSE_BOTTOM} x2={WALL_XS[WALL_XS.length - 1]} y2={HOUSE_BOTTOM} stroke="currentColor" strokeWidth={1} />
                <text x={HOUSE_X0 - 6} y={HOUSE_TOP + 4} textAnchor="end" fontSize={14} fill="#2563eb">지붕 출입</text>
              </g>
            ) : null}
            {scene.caveat ? (
              <g>
                <rect x={WALL_XS[WALL_XS.length - 1] + 6} y={BAND_TOP - 50} width={RIGHT - WALL_XS[WALL_XS.length - 1] - 6} height={50 + LAYERS * BAND_H} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <text x={(WALL_XS[WALL_XS.length - 1] + 6 + RIGHT) / 2} y={BAND_TOP - 30} textAnchor="middle" fontSize={13} fill="#dc2626">미발굴</text>
              </g>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
