import SceneShell from "./QuantSceneShell";

/**
 * 본문 대응: #zero-point-symmetry 예시 문단.
 * [-2, 6] asymmetric: s = 8/255 ≈ 0.0314, z = round(2/0.0314) = 64 → −2↔0, 0↔64, 6↔255.
 * 대조(가정) [-2, 6] symmetric: s = 6/127 ≈ 0.0472, −2 ↔ round(−42.3) = −42 → code −127…−43(85개)는 값이 없는 [−6, −2)에 쓰임.
 * [-3, 3] symmetric: s = 3/127 ≈ 0.0236, z = 0 → −3↔−127, 0↔0, 3↔127.
 */
interface Mark {
  real: number;
  code: number;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  data: readonly [number, number];
  cover: readonly [number, number];
  codes: readonly [number, number];
  marks: readonly Mark[];
  unused?: { real: readonly [number, number]; codes: readonly [number, number]; text: string };
}

const SCENES: readonly Scene[] = [
  {
    label: "Activation [−2, 6] · asymmetric",
    summary: "s ≈ 0.0314 · z = 64",
    note: "8bit code 0…255 전체를 실제 값이 있는 [−2, 6]에 맞춥니다. 실수 0은 code 범위의 가운데(127.5 근처)가 아니라 code 64에 놓입니다. Range 전체를 옮긴 셈입니다.",
    data: [-2, 6],
    cover: [-2, 6],
    codes: [0, 255],
    marks: [
      { real: -2, code: 0 },
      { real: 0, code: 64 },
      { real: 6, code: 255 },
    ],
  },
  {
    label: "대조 (가정) · 같은 [−2, 6]을 symmetric으로",
    summary: "s ≈ 0.0472 · code 85개 빈자리",
    note: "Zero-point를 0으로 묶으면 큰 쪽 6에 맞춰 [−6, 6]을 덮어야 합니다. 값이 없는 [−6, −2) 구간에 code −127…−43, 85개가 쓰이고, 남은 code로 실제 값을 나누니 step이 asymmetric의 약 1.5배(0.0472 ÷ 0.0314)로 넓어집니다.",
    data: [-2, 6],
    cover: [-6, 6],
    codes: [-127, 127],
    marks: [
      { real: -6, code: -127 },
      { real: -2, code: -42 },
      { real: 0, code: 0 },
      { real: 6, code: 127 },
    ],
    unused: { real: [-6, -2], codes: [-127, -43], text: "값 없음 · code 85개" },
  },
  {
    label: "Weight [−3, 3] · symmetric",
    summary: "s ≈ 0.0236 · z = 0",
    note: "원점 대칭인 weight range는 zero-point 0으로 code −127…127의 양쪽을 모두 실제 값에 씁니다. 빈 구간이 생기지 않습니다.",
    data: [-3, 3],
    cover: [-3, 3],
    codes: [-127, 127],
    marks: [
      { real: -3, code: -127 },
      { real: 0, code: 0 },
      { real: 3, code: 127 },
    ],
  },
];

const L = 30;
const R = 390;
const xr = (v: number) => L + ((v + 6) / 12) * (R - L);
const xc = (c: number) => L + ((c + 127) / 382) * (R - L);
const YR = 46;
const YC = 136;

export default function ZeroPointMappingViz() {
  return (
    <SceneShell
      eyebrow="Zero-point와 대칭"
      title="Zero-point는 실수 0을 어느 code에 둘지 정해 range를 옮긴다"
      description="위 줄은 실수값(−6…6), 아래 줄은 8bit 정수 code입니다. 띠는 code가 덮는 실수 구간이고, 진한 부분이 실제 값이 있는 구간입니다. 선은 같은 값을 잇습니다."
      note="Symmetric code 범위 −127…127은 본문의 3/127 계산과 같은 규약입니다. 두 번째 장면은 비교를 위한 가정입니다."
      ariaLabel="실수 range가 8bit code로 옮겨지는 방식: asymmetric과 symmetric 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 420 186" role="img" aria-label={scene.label} className="block h-auto w-full text-foreground">
            <text x={L} y="16" fontSize="13" fontWeight="700" fill="currentColor">실수값</text>
            <text x={R} y={YC + 42} textAnchor="end" fontSize="13" fontWeight="700" fill="currentColor">8bit code</text>
            <line x1={L} x2={R} y1={YR} y2={YR} stroke="#94a3b8" strokeWidth="1" />
            <line x1={L} x2={R} y1={YC} y2={YC} stroke="#94a3b8" strokeWidth="1" />
            <polygon
              points={`${xr(scene.cover[0])},${YR + 6} ${xr(scene.cover[1])},${YR + 6} ${xc(scene.codes[1])},${YC - 6} ${xc(scene.codes[0])},${YC - 6}`}
              fill="#2563eb"
              opacity="0.08"
            />
            <rect x={xr(scene.cover[0])} y={YR - 6} width={xr(scene.cover[1]) - xr(scene.cover[0])} height="12" fill="#2563eb" opacity="0.18" />
            <rect x={xr(scene.data[0])} y={YR - 6} width={xr(scene.data[1]) - xr(scene.data[0])} height="12" fill="#2563eb" opacity="0.55" />
            <rect x={xc(scene.codes[0])} y={YC - 6} width={xc(scene.codes[1]) - xc(scene.codes[0])} height="12" fill="#2563eb" opacity="0.4" />
            {scene.unused && (
              <g>
                <rect x={xr(scene.unused.real[0])} y={YR - 6} width={xr(scene.unused.real[1]) - xr(scene.unused.real[0])} height="12" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 2" />
                <rect x={xc(scene.unused.codes[0])} y={YC - 6} width={xc(scene.unused.codes[1]) - xc(scene.unused.codes[0])} height="12" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 2" />
                <text x={(xc(scene.unused.codes[0]) + xc(scene.unused.codes[1])) / 2} y={YC + 42} textAnchor="middle" fontSize="13" fill="#dc2626">
                  {scene.unused.text}
                </text>
              </g>
            )}
            {scene.marks.map((m) => (
              <g key={`${m.real}-${m.code}`}>
                <line x1={xr(m.real)} y1={YR + 6} x2={xc(m.code)} y2={YC - 6} stroke="#64748b" strokeWidth="1" />
                <text x={xr(m.real)} y={YR - 12} textAnchor="middle" fontSize="13" fill="currentColor">{m.real}</text>
                <text x={xc(m.code)} y={YC + 22} textAnchor="middle" fontSize="13" fill="currentColor">{m.code}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
