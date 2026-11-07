import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 긴 평가 구간을 여러 증명으로 잇는 n-Wesolowski 경로.
 * 구간별 기본 관계식에 더해 반복 횟수 합과 마지막 출력까지 확인해야 전체 proof가 완성된다.
 * 세 구간과 같은 길이는 설명용 가정이다.
 */
const SCENES = [
  { label: "긴 구간을 나눕니다", summary: "세 구간(가정)", proof: false, sum: false, last: false, note: "긴 평가 구간을 여러 증명으로 잇는 경로가 n-Wesolowski입니다. 세 구간과 같은 길이는 설명용 가정이고, 구간 수는 글에 정해져 있지 않습니다." },
  { label: "구간마다 기본 관계식", summary: "VerifyWesolowskiProof", proof: true, sum: false, last: false, note: "각 구간에 쓰이는 기본 관계식이 이 글에서 확인하는 VerifyWesolowskiProof입니다. 구간별로 통과해도 아직 전체 proof가 완성된 것은 아닙니다." },
  { label: "반복 횟수의 합", summary: "t₁+t₂+t₃ = 전체 iters", proof: true, sum: true, last: false, note: "여러 구간의 반복 횟수 합도 확인합니다. 순서는 설명을 위해 나눈 것입니다." },
  { label: "마지막 출력", summary: "전체 proof 완성", proof: true, sum: true, last: true, note: "마지막 출력까지 확인해야 전체 n-Wesolowski proof가 완성됩니다." },
] as const;

const ACCENT = "#2563eb";
const OK = "#16a34a";
const NODES = [
  { x: 36, name: "x" },
  { x: 132, name: "y₁" },
  { x: 228, name: "y₂" },
  { x: 324, name: "y" },
];
const SEGMENTS = [
  { x: 84, t: "t₁", p: "π₁" },
  { x: 180, t: "t₂", p: "π₂" },
  { x: 276, t: "t₃", p: "π₃" },
];

export default function NWesolowskiViz() {
  return (
    <SceneShell
      eyebrow="여러 구간 잇기 · 구간 수는 가정"
      title="구간별 통과만으로는 전체 증명이 끝나지 않습니다"
      description="동그라미는 구간의 입력과 출력, 그 사이 t는 그 구간의 반복 횟수입니다. 선 길이는 모양만 나타냅니다."
      ariaLabel="세 구간으로 나눈 평가를 구간별 관계식, 반복 횟수 합, 마지막 출력으로 확인하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 168" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {SEGMENTS.map((segment) => (
              <g key={segment.t}>
                <text x={segment.x} y={24} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">{segment.t}</text>
                <line x1={segment.x - 30} x2={segment.x + 30} y1={46} y2={46} stroke={ACCENT} strokeWidth={1.25} />
                <text x={segment.x} y={86} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.proof ? OK : "#cbd5e1"}>{segment.p}</text>
                <text x={segment.x} y={102} textAnchor="middle" fontSize={11} fill={scene.proof ? OK : "#94a3b8"}>{scene.proof ? "관계식 통과" : "검사 전"}</text>
              </g>
            ))}
            {NODES.map((node, index) => {
              const end = index === NODES.length - 1;
              const lit = end && scene.last;
              return (
                <g key={node.name}>
                  <circle cx={node.x} cy={46} r={17} fill={lit ? OK : "#f8fafc"} stroke={lit ? OK : "#94a3b8"} strokeWidth={1} />
                  <text x={node.x} y={51} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="monospace" fill={lit ? "#ffffff" : "#475569"}>{node.name}</text>
                </g>
              );
            })}
            <path d="M54 116V124H306V116" fill="none" stroke={scene.sum ? ACCENT : "#e2e8f0"} strokeWidth={1} />
            <text x={180} y={142} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.sum ? ACCENT : "#cbd5e1"}>t₁+t₂+t₃ = 전체 반복 횟수</text>
            <text x={348} y={160} textAnchor="end" fontSize={12} fontWeight={700} fill={scene.last ? OK : "#cbd5e1"}>마지막 출력 y 확인</text>
          </svg>
        );
      }}
    />
  );
}
