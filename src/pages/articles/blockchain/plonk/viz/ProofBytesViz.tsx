import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-proof — 이번 실행의 압축 증명 520바이트.
 * G₁ 점 9개 = 288바이트(288/9 = 32), 체 원소 7개 = 224바이트(224/7 = 32), 두 배열 길이 표시 8바이트.
 * 점: wire 3 + Z 1 + 몫 조각 3 + 열기 2. 체 원소: 묶은 평가 6 + 이동한 Z 평가 1.
 */
type Block = { bytes: number; group: 0 | 1 | 2; color: string };
const BLOCKS: readonly Block[] = [
  ...Array.from({ length: 7 }, () => ({ bytes: 32, group: 0 as const, color: "#2563eb" })),
  ...Array.from({ length: 2 }, () => ({ bytes: 32, group: 0 as const, color: "#1d4ed8" })),
  ...Array.from({ length: 6 }, () => ({ bytes: 32, group: 1 as const, color: "#059669" })),
  { bytes: 32, group: 1, color: "#047857" },
  { bytes: 8, group: 2, color: "#64748b" },
];
const TOTAL = BLOCKS.reduce<number>((sum, b) => sum + b.bytes, 0);
const OFFSETS = BLOCKS.reduce<number[]>((acc, b, i) => [...acc, i === 0 ? 0 : acc[i - 1] + BLOCKS[i - 1].bytes], []);

const SCENES = [
  { label: "G₁ 점 9개", summary: "9 × 32 = 288바이트", upto: 0, note: "wire 약정 3개, Z 약정 1개, 몫 조각 약정 3개, 묶은 열기와 이동한 Z 열기의 점 2개입니다. 압축 인코딩에서 점 하나는 288÷9=32바이트입니다." },
  { label: "체 원소 7개", summary: "288 + 7 × 32 = 512바이트", upto: 1, note: "ζ에서 묶어 연 여섯 평가값과 ζω에서 연 Z의 평가값 하나입니다. 체 원소도 224÷7=32바이트씩입니다." },
  { label: "길이 표시", summary: "512 + 8 = 520바이트", upto: 2, note: "두 배열의 길이 표시 8바이트를 더하면 실제 관찰한 520바이트입니다. 부가 약정이나 인코딩·버전이 바뀌면 같은 길이를 가정하지 않습니다." },
] as const;

const W = 360;
const H = 150;
const X0 = 8;
const BAR_W = W - 2 * X0;
const sx = (bytes: number) => (bytes / TOTAL) * BAR_W;

export default function ProofBytesViz() {
  return (
    <SceneShell
      eyebrow="증명 520바이트"
      title="점 9개, 체 원소 7개, 길이 표시로 520바이트가 됩니다"
      description="막대 전체가 이번 실행의 압축 증명 520바이트이고, 칸 너비는 바이트 수에 비례합니다. 칸은 종류별로 모은 것이며 실제 직렬화 순서를 나타내지 않습니다."
      ariaLabel="증명 520바이트를 G1 점 9개 288바이트, 체 원소 7개 224바이트, 길이 표시 8바이트로 나눈 그림"
      scenes={SCENES}
      render={(active) => {
        const upto = SCENES[active].upto;
        const groupEnd = (g: number) => BLOCKS.filter((b) => b.group <= g).reduce<number>((s, b) => s + b.bytes, 0);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {BLOCKS.map((b, i) => {
              const on = b.group <= upto;
              const x = X0 + sx(OFFSETS[i]);
              const w = sx(b.bytes);
              return (
                <rect key={i} x={x} y={44} width={w} height={40} fill={on ? b.color : "#f1f5f9"} stroke="#ffffff" strokeWidth={1} opacity={on ? (b.group === upto ? 1 : 0.45) : 1} />
              );
            })}
            <rect x={X0} y={44} width={BAR_W} height={40} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {[0, 1, 2].map((g) => {
              if (g > upto) return null;
              const start = g === 0 ? 0 : groupEnd(g - 1);
              const end = groupEnd(g);
              const mid = X0 + sx((start + end) / 2);
              const label = g === 0 ? "점 9개 · 288" : g === 1 ? "체 원소 7개 · 224" : "8";
              return (
                <g key={g}>
                  <line x1={X0 + sx(start) + 1} x2={X0 + sx(end) - 1} y1={96} y2={96} stroke="#475569" strokeWidth={1} />
                  <text x={g === 2 ? X0 + sx(end) : mid} y={112} textAnchor={g === 2 ? "end" : "middle"} fontSize={12} fontWeight={700} fill="#0f172a">{label}</text>
                </g>
              );
            })}
            <text x={X0} y={30} fontSize={10} fill="#64748b">0</text>
            <text x={X0 + BAR_W} y={30} textAnchor="end" fontSize={10} fill="#64748b">520바이트</text>
            {upto === 0 && <text x={X0} y={136} fontSize={10} fill="#475569">wire 3 · Z 1 · 몫 조각 3 · 열기 2</text>}
            {upto === 1 && <text x={X0} y={136} fontSize={10} fill="#475569">ζ의 묶은 평가 6 · ζω의 Z 평가 1</text>}
            {upto === 2 && <text x={X0} y={136} fontSize={10} fill="#475569">두 배열의 길이 표시 8바이트</text>}
          </svg>
        );
      }}
    />
  );
}
