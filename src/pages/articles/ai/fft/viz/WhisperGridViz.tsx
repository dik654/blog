import SceneShell from "./SceneShell";

/**
 * 본문 대응: #paper-whisper-frontend — audio.py의 순서: stft → [..., :-1] → abs()**2 → filters @ → clamp·log10 → max−8 → (x+4)/4.
 * 격자 크기(주파수 5줄, 시간 6칸, Mel 3줄)와 칸 농도는 그림을 위한 가정입니다. 실제 Mel은 80개 또는 128개입니다.
 * Mel 줄의 농도는 FROM_FREQ의 주파수 줄을 평균해 앞 장면에서 이어지게 하고, 올린 하한은 자른 뒤의 장면에도 유지합니다.
 */
const TIMES = 6;
const FREQS = 5;
const MELS = 3;
const SHADE = [0.2, 0.75, 0.45, 0.3, 0.6, 0.25, 0.55, 0.35, 0.8, 0.5, 0.2, 0.65, 0.4, 0.7, 0.25, 0.3, 0.5, 0.75, 0.6, 0.2, 0.45, 0.65, 0.35, 0.55, 0.3, 0.6, 0.2, 0.4, 0.7, 0.5];

const FROM_FREQ = [[0, 1], [1, 2, 3], [3, 4]];
const FLOOR = 0.45;
const freqShade = (row: number, col: number) => SHADE[(row * TIMES + col) % SHADE.length];
const melShade = (row: number, col: number) => FROM_FREQ[row].reduce((sum, freq) => sum + freqShade(freq, col), 0) / FROM_FREQ[row].length;

const SCENES: { label: string; summary: string; note: string; rows: number; dropLast: boolean; glyph: "arrow" | "shade"; band: boolean; floored?: boolean }[] = [
  { label: "torch.stft", summary: "칸마다 복소 계수", rows: FREQS, dropLast: false, glyph: "arrow", band: false, note: "세로가 주파수, 가로가 시간 구간입니다. 칸마다 길이와 방향을 모두 가진 복소 계수가 있습니다. 앞 절의 400과 160으로 만든 구간들입니다." },
  { label: "[..., :-1]", summary: "마지막 시간 구간 제외", rows: FREQS, dropLast: true, glyph: "arrow", band: false, note: "복소 STFT 출력의 마지막 축은 시간 구간입니다. 그래서 지워지는 것은 오른쪽 끝 열이고, 주파수의 마지막 줄은 그대로입니다." },
  { label: "abs() ** 2", summary: "방향을 버리고 길이의 제곱만", rows: FREQS, dropLast: true, glyph: "shade", band: false, note: "칸의 방향 표시가 사라지고 값 하나만 남습니다. 변수 이름은 magnitudes지만 실제 값은 길이의 제곱입니다. 앞의 작은 Hann 결과라면 [36, 10, 0]으로, 뜻을 보인 대입이며 Whisper의 길이는 아닙니다." },
  { label: "filters @", summary: "주파수 줄을 Mel 필터로 합침", rows: MELS, dropLast: true, glyph: "shade", band: false, note: "여러 주파수의 제곱 크기를 Mel 필터별로 합칩니다. 세로 줄 수가 달라지며 원래 주파수별 값을 그대로 보관하지 않습니다." },
  { label: "log10과 자르기", summary: "하한 10⁻¹⁰ · 최댓값−8 아래는 올림", rows: MELS, dropLast: true, glyph: "shade", band: true, floored: true, note: "값의 하한을 10⁻¹⁰으로 놓고 상용로그를 취한 뒤, 최댓값보다 8 이상 낮은 로그값을 잘라 그 경계로 맞춥니다." },
  { label: "(x + 4) / 4", summary: "특징값 완성", rows: MELS, dropLast: true, glyph: "shade", band: false, floored: true, note: "마지막으로 범위를 옮기고 나눕니다. 이런 특징값은 모든 복소 계수를 보관한 배열이 아니므로 일반적으로 파형으로 유일하게 돌아갈 수 없습니다." },
];

const X0 = 44;
const Y0 = 22;
const CELL_W = 34;
const AREA_H = 130;

export default function WhisperGridViz() {
  return (
    <SceneShell
      eyebrow="입력 특징의 축"
      title="Whisper 원문의 연산마다 격자에서 무엇이 사라지는지 봅니다"
      description="고정한 audio.py의 연산 순서입니다. 격자 크기(주파수 5줄·시간 6칸·Mel 3줄)와 칸 농도는 그림을 위한 가정이고, 실행한 값이 아닙니다."
      ariaLabel="STFT 격자에서 시간 열 제외, 제곱 크기, Mel 합치기, 로그와 자르기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cellH = AREA_H / scene.rows;
        return (
          <svg viewBox="0 0 360 186" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={12} y={Y0 + AREA_H / 2} fontSize={10} fill="#64748b" textAnchor="middle" transform={`rotate(-90 12 ${Y0 + AREA_H / 2})`}>{scene.rows === MELS ? "Mel 필터" : "주파수"}</text>
            <text x={X0 + (TIMES * CELL_W) / 2} y={Y0 + AREA_H + 16} textAnchor="middle" fontSize={10} fill="#64748b">시간 구간 →</text>
            {Array.from({ length: scene.rows }, (_, row) =>
              Array.from({ length: TIMES }, (_, col) => {
                const dropped = scene.dropLast && col === TIMES - 1;
                const shade = scene.rows === MELS ? melShade(row, col) : freqShade(row, col);
                const x = X0 + col * CELL_W;
                const y = Y0 + row * cellH;
                const angle = shade * 6.28;
                return (
                  <g key={`${row}-${col}`}>
                    <rect x={x + 1} y={y + 1} width={CELL_W - 2} height={cellH - 2} rx={3} fill={scene.glyph === "shade" && !dropped ? "#2563eb" : "none"} fillOpacity={scene.glyph === "shade" ? (scene.floored ? Math.max(shade, FLOOR) : shade) : 0} stroke={dropped ? "#d97706" : "#94a3b8"} strokeWidth={1} strokeDasharray={dropped ? "3 3" : undefined} opacity={dropped ? 0.7 : 1} />
                    {scene.glyph === "arrow" && !dropped && <line x1={x + CELL_W / 2} y1={y + cellH / 2} x2={x + CELL_W / 2 + Math.cos(angle) * 9} y2={y + cellH / 2 - Math.sin(angle) * 9} stroke="#2563eb" strokeWidth={1.25} />}
                  </g>
                );
              }),
            )}
            {scene.dropLast && <text x={X0 + (TIMES - 0.5) * CELL_W} y={Y0 + AREA_H + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">제외</text>}
            {scene.band && (
              <g>
                <line x1={270} x2={270} y1={Y0} y2={Y0 + AREA_H} stroke="#64748b" strokeWidth={1} />
                <text x={276} y={Y0 + 10} fontSize={10} fontWeight={700} fill="#2563eb">로그값 최대</text>
                <rect x={266} y={Y0 + 100} width={8} height={30} fill="#d97706" fillOpacity={0.3} />
                <text x={278} y={Y0 + 104} fontSize={10} fontWeight={700} fill="#d97706">최댓값−8</text>
                <text x={278} y={Y0 + 124} fontSize={10} fill="#d97706">아래는 올림</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
