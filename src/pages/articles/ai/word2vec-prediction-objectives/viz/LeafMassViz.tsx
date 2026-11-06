import SceneShell from "./SceneShell";

/**
 * 본문 대응: #path-probability — 뿌리의 확률 1이 갈림길마다 나뉘어 다섯 잎에 도달합니다.
 * 평균 h=[0,1,1], 내부 3·2·1·0의 점수 0·1·1·0. σ(0)=0.5, σ(1)≈0.731059.
 * 문장 끝 0.5, red 0.134471, cat 0.098306, saw·dog 각 0.133612. 너비는 확률에 비례합니다.
 */
const sigma = (s: number) => 1 / (1 + Math.exp(-s));
const W = 340;
const X0 = 10;
const ROW_H = 26;
const ROW_Y = [18, 58, 98, 138, 178];
const P1 = sigma(0);
const P2 = P1 * sigma(1);
const P3 = P2 * sigma(1);
const P4 = P3 * sigma(0);
const px = (p: number) => p * W;

/* 왼쪽이 주소 0, 오른쪽이 주소 1입니다. */
const SEGMENTS = [
  { row: 0, x: 0, p: 1, text: "뿌리 1", kind: "inner" },
  { row: 1, x: 0, p: P1, text: "0 방향 0.5", kind: "inner" },
  { row: 1, x: P1, p: 1 - P1, text: "문장 끝 0.5", kind: "leaf" },
  { row: 2, x: 0, p: P2, text: "0 방향 0.365529", kind: "inner" },
  { row: 2, x: P2, p: P1 - P2, text: "red", kind: "leaf" },
  { row: 3, x: 0, p: P3, text: "0 방향 0.267224", kind: "inner" },
  { row: 3, x: P3, p: P2 - P3, text: "cat", kind: "answer" },
  { row: 4, x: 0, p: P4, text: "dog", kind: "leaf" },
  { row: 4, x: P4, p: P3 - P4, text: "saw", kind: "leaf" },
] as const;
const FILL = { inner: "#64748b", leaf: "#cbd5e1", answer: "#2563eb" };

const LEAVES = [
  { x: 0, p: P4, value: "0.134" },
  { x: P4, p: P3 - P4, value: "0.134" },
  { x: P3, p: P2 - P3, value: "0.098" },
  { x: P2, p: P1 - P2, value: "0.134" },
  { x: P1, p: 1 - P1, value: "0.5" },
];

const SCENES = [
  { label: "내부 3에서 나뉩니다", summary: "1 → 0.5 + 0.5", note: "뿌리인 내부 3의 점수는 0이라 두 자식에게 0.5씩 갑니다. 주소 1 쪽은 곧바로 잎인 문장 끝입니다." },
  { label: "내부 2에서 나뉩니다", summary: "0.5 → 0.365529 + 0.134471", note: "내부 2의 점수는 1입니다. 주소 0 쪽이 σ(1) ≈ 0.731059의 비율을, 잎 red가 나머지를 가져갑니다. 두 값의 합은 부모의 0.5 그대로입니다." },
  { label: "내부 1에서 나뉩니다", summary: "0.365529 → 0.267224 + 0.098306", note: "내부 1의 점수도 1입니다. cat의 주소 마지막 비트가 1이라 cat은 작은 쪽 약 0.098306을 받습니다. 반올림한 값이라 끝자리 합은 다를 수 있습니다." },
  { label: "내부 0에서 나뉩니다", summary: "0.267224 → 0.133612 × 2", note: "내부 0의 점수는 0이라 dog와 saw가 0.133612씩 나눠 갖습니다. 이제 모든 칸이 잎입니다." },
  { label: "잎을 모두 더합니다", summary: "반올림 전 합 = 1", note: "다섯 잎의 너비가 처음 뿌리의 너비를 빈틈없이 채웁니다. 갈림길마다 부모의 확률을 두 자식이 나눠 가졌기 때문입니다. 표의 수는 11절의 가정한 값입니다." },
] as const;

export default function LeafMassViz() {
  return (
    <SceneShell
      eyebrow="확률이 나뉘는 모양"
      title="뿌리의 확률 1이 갈림길마다 나뉘어 다섯 잎을 채웁니다"
      description="가로 너비가 확률입니다. 한 줄 내려갈 때마다 왼쪽 칸이 주소 0 방향과 1 방향으로 나뉘고, 밝은 칸과 파란 칸(정답 cat)은 더 나뉘지 않는 잎입니다."
      ariaLabel="이진 나무의 각 갈림길에서 확률이 나뉘어 합 1을 유지하는 장면"
      scenes={SCENES}
      render={(active) => {
        const lastRow = Math.min(active + 1, 4);
        return (
          <svg viewBox="0 0 360 226" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {SEGMENTS.filter((s) => s.row <= lastRow).map((s) => {
              const isLeaf = s.kind !== "inner";
              const y = ROW_Y[s.row];
              const height = isLeaf ? ROW_Y[lastRow] + ROW_H - y : ROW_H;
              const width = px(s.p) - 1;
              return (
                <g key={`${s.row}-${s.text}`}>
                  <rect x={X0 + px(s.x)} y={y} width={width} height={height} rx={2} fill={FILL[s.kind]} />
                  <text x={X0 + px(s.x) + width / 2} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill={s.kind === "leaf" ? "#334155" : "#ffffff"}>{s.text}</text>
                </g>
              );
            })}
            {active === 4 && LEAVES.map((leaf) => (
              <text key={leaf.x} x={X0 + px(leaf.x) + px(leaf.p) / 2} y={220} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">{leaf.value}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
