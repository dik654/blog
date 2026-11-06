import SceneShell from "./SceneShell";

/**
 * 본문 대응: #window — Hann은 side lobe를 낮추고 main lobe를 넓힙니다.
 * 길이 32(가정)의 직사각 창과 주기형 Hann의 스펙트럼 길이를 합 정의 그대로 계산해 중심값으로 나눴습니다.
 * 세로축은 로그, 가로축은 bin 간격 단위입니다.
 */
const LENGTH = 32;
const hannWeight = (n: number) => 0.5 * (1 - Math.cos((2 * Math.PI * n) / LENGTH));
const spectrum = (weight: (n: number) => number, offset: number) => {
  const parts = Array.from({ length: LENGTH }, (_, n) => {
    const angle = (2 * Math.PI * offset * n) / LENGTH;
    return [weight(n) * Math.cos(angle), weight(n) * Math.sin(angle)];
  });
  const re = parts.reduce<number>((sum, part) => sum + part[0], 0);
  const im = parts.reduce<number>((sum, part) => sum + part[1], 0);
  return Math.hypot(re, im);
};

const W = 360;
const H = 196;
const LEFT = 34;
const RIGHT = W - 10;
const TOP = 12;
const BOTTOM = 166;
const SPAN = 8; // bin ±8
const DECADES = 4; // 1 ~ 0.0001
const px = (offset: number) => LEFT + ((offset + SPAN) / (2 * SPAN)) * (RIGHT - LEFT);
const py = (ratio: number) => TOP + (-Math.log10(Math.max(ratio, 10 ** -DECADES)) / DECADES) * (BOTTOM - TOP);
const OFFSETS = Array.from({ length: 641 }, (_, i) => -SPAN + (i * 2 * SPAN) / 640);
const toPath = (weight: (n: number) => number) => {
  const peak = spectrum(weight, 0);
  return OFFSETS.map((offset, i) => `${i === 0 ? "M" : "L"}${px(offset).toFixed(1)} ${py(spectrum(weight, offset) / peak).toFixed(1)}`).join(" ");
};
const RECT_PATH = toPath(() => 1);
const HANN_PATH = toPath(hannWeight);

const SCENES: { label: string; summary: string; note: string; rect: boolean; hann: boolean }[] = [
  { label: "직사각 창", summary: "가운데 좁고 주변이 높음", rect: true, hann: false, note: "구간 밖을 0으로 만들기만 한 창입니다. 가운데 큰 봉우리가 main lobe, 주변 작은 봉우리들이 side lobe입니다. 한 진동의 값이 이 모양을 따라 여러 bin에 퍼져 보이는 것이 spectral leakage입니다." },
  { label: "Hann 창", summary: "주변이 낮고 가운데 넓음", rect: false, hann: true, note: "양 끝의 비중을 줄이면 먼 쪽으로 새는 봉우리가 크게 낮아집니다. 대신 가운데 봉우리의 폭이 넓어집니다." },
  { label: "겹쳐 보기", summary: "약한 성분 vs 가까운 두 진동", rect: true, hann: true, note: "가까운 두 진동을 구별하는 능력과 약한 성분을 보는 능력이 함께 달라집니다. 창을 바꿨다면 진폭 보정도 따로 확인합니다." },
];

export default function WindowLobesViz() {
  return (
    <SceneShell
      eyebrow="main lobe와 side lobe"
      title="Hann 창은 먼 쪽 봉우리를 낮추는 대신 가운데 봉우리를 넓힙니다"
      description="길이 32(가정)의 두 창에서 스펙트럼 길이를 식대로 계산해 중심값 1로 맞췄습니다. 세로축은 눈금마다 10배씩 줄어드는 로그 눈금입니다."
      ariaLabel="직사각 창과 Hann 창의 스펙트럼 모양 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {["1", "0.1", "0.01", "0.001", "0.0001"].map((label, i) => (
              <g key={label}>
                <line x1={LEFT} x2={RIGHT} y1={py(10 ** -i)} y2={py(10 ** -i)} stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.35} />
                <text x={LEFT - 4} y={py(10 ** -i) + 3} textAnchor="end" fontSize={9} fill="#64748b">{label}</text>
              </g>
            ))}
            {[-8, -4, 0, 4, 8].map((tick) => (
              <text key={tick} x={px(tick)} y={BOTTOM + 13} textAnchor="middle" fontSize={10} fill="#64748b">{tick === 0 ? "중심" : `${tick < 0 ? "−" : "+"}${Math.abs(tick)}`}</text>
            ))}
            <text x={(LEFT + RIGHT) / 2} y={H - 3} textAnchor="middle" fontSize={10} fill="#64748b">중심에서 떨어진 거리 (bin 간격)</text>
            {scene.rect && <path d={RECT_PATH} fill="none" stroke="#64748b" strokeWidth={1} />}
            {scene.hann && <path d={HANN_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />}
            {scene.rect && <text x={RIGHT} y={TOP + 12} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">회색: 직사각</text>}
            {scene.hann && <text x={RIGHT} y={TOP + 26} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">파랑: Hann</text>}
          </svg>
        );
      }}
    />
  );
}
