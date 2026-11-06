import SceneShell from "./SceneShell";

/**
 * 본문 대응: #paper-fnet — 숨은 축 DFT, 위치 축 DFT, 그다음 실수 부분. 격자 크기(위치 4·숨은 3)는 가정입니다.
 * 4×1 사례: [1,2,3,4] → [10,−2+2i,−2,−2−2i] → Re → [10,−2,−2,−2] → IDFT → [1,3,3,3].
 */
const SCENES: { label: string; summary: string; note: string; axis: "hidden" | "seq" | "real" | "case" }[] = [
  { label: "숨은 축", summary: "세로 방향 DFT", axis: "hidden", note: "각 위치의 숨은 값들을 세로로 변환합니다. 입력에 따라 달라지는 attention 가중치를 계산하지 않습니다." },
  { label: "위치 축", summary: "가로 방향 DFT", axis: "seq", note: "이어서 위치 방향으로 변환합니다. 이 단계에서 서로 다른 위치의 값이 한 칸으로 섞입니다." },
  { label: "실수 부분", summary: "두 변환을 끝낸 다음 Re", axis: "real", note: "두 변환을 모두 끝낸 다음에 실수 부분만 남깁니다. 이 순서는 원문에 명시되어 있고, 이 선택은 변환과 별개의 정보 손실 연산입니다." },
  { label: "4×1로 계산", summary: "[1,2,3,4] → … → [1,3,3,3]", axis: "case", note: "숨은 차원이 1이면 숨은 축 변환은 항등입니다. 허수 성분을 버린 뒤 0으로 채워 역변환해도 입력을 되찾지 못합니다. 식 (3)의 mixer만 계산한 가정이며 전체 FNet 블록의 정보 보존이나 품질을 단정하지 않습니다." },
];

const POS = 4;
const HID = 3;
const X0 = 70;
const Y0 = 22;
const CW = 52;
const CH = 40;

const ROWS: { name: string; values: string[]; color: string }[] = [
  { name: "입력 x", values: ["1", "2", "3", "4"], color: "#64748b" },
  { name: "DFT", values: ["10", "−2+2i", "−2", "−2−2i"], color: "#64748b" },
  { name: "Re 뒤 y", values: ["10", "−2", "−2", "−2"], color: "#d97706" },
  { name: "역변환", values: ["1", "3", "3", "3"], color: "#2563eb" },
];

export default function FnetMixerViz() {
  return (
    <SceneShell
      eyebrow="두 축과 실수 부분"
      title="FNet의 섞기는 두 축을 변환한 뒤 허수 부분을 버립니다"
      description="가로가 위치, 세로가 숨은 차원입니다. 앞 세 장면의 격자 크기(위치 4·숨은 3)는 그림을 위한 가정입니다."
      ariaLabel="FNet 섞기의 두 축 변환과 실수 부분 선택, 네 값 사례"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        if (scene.axis === "case") {
          return (
            <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {ROWS.map((row, r) => (
                <g key={row.name}>
                  <text x={6} y={28 + r * 40} fontSize={11} fontWeight={700} fill={row.color}>{row.name}</text>
                  {row.values.map((value, c) => {
                    const wrong = r === 3 && c > 0 && value !== ROWS[0].values[c];
                    return (
                      <g key={c}>
                        <rect x={70 + c * 70} y={8 + r * 40} width={64} height={32} rx={6} fill="none" stroke={wrong ? "#d97706" : "#94a3b8"} strokeWidth={1} />
                        <text x={102 + c * 70} y={29 + r * 40} textAnchor="middle" fontSize={value.length > 3 ? 12 : 14} fontWeight={700} fill={wrong ? "#d97706" : row.color}>{value}</text>
                      </g>
                    );
                  })}
                </g>
              ))}
            </svg>
          );
        }
        const real = scene.axis === "real";
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0 + (POS * CW) / 2} y={14} textAnchor="middle" fontSize={11} fill="#64748b">위치 →</text>
            <text x={X0 - 8} y={Y0 + (HID * CH) / 2} textAnchor="end" fontSize={11} fill="#64748b">숨은 ↓</text>
            {Array.from({ length: HID }, (_, row) =>
              Array.from({ length: POS }, (_, col) => (
                <g key={`${row}-${col}`}>
                  <rect x={X0 + col * CW + 2} y={Y0 + row * CH + 2} width={CW - 4} height={CH - 4} rx={4} fill="#2563eb" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={1} />
                  <text x={X0 + col * CW + CW / 2} y={Y0 + row * CH + CH / 2 + 4} textAnchor="middle" fontSize={11} fill={real ? "#d97706" : "#64748b"}>{real ? "실수만" : "a+bi"}</text>
                </g>
              )),
            )}
            {scene.axis === "hidden" && Array.from({ length: POS }, (_, col) => (
              <line key={col} x1={X0 + col * CW + 8} x2={X0 + col * CW + 8} y1={Y0 + 6} y2={Y0 + HID * CH - 6} stroke="#2563eb" strokeWidth={1.25} />
            ))}
            {scene.axis === "seq" && Array.from({ length: HID }, (_, row) => (
              <line key={row} x1={X0 + 6} x2={X0 + POS * CW - 6} y1={Y0 + row * CH + 8} y2={Y0 + row * CH + 8} stroke="#2563eb" strokeWidth={1.25} />
            ))}
            <text x={X0 + (POS * CW) / 2} y={Y0 + HID * CH + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={real ? "#d97706" : "#2563eb"}>
              {scene.axis === "hidden" ? "파란 선 방향으로 변환 ①" : scene.axis === "seq" ? "파란 선 방향으로 변환 ②" : "③ 칸마다 실수 부분만 남김"}
            </text>
          </svg>
        );
      }}
    />
  );
}
