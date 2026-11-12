import SceneShell from "./SceneShell";

/**
 * 본문 대응: #nesterov — 진입 상태 param 2.71, buf 1.9, grad −1 (가정).
 * 새 buf = 0.9×1.9 − 1 = 0.71. 일반: 2.71 − 0.1×0.71 = 2.639.
 * Nesterov: 방향 = −1 + 0.9×0.71 = −0.361, 2.71 − 0.1×(−0.361) = 2.7461.
 */
const SCENES = [
  { label: "공통: buf 먼저 갱신", summary: "0.9×1.9 + (−1) = 0.71", note: "두 분기 모두 361행에서 buf를 0.71로 먼저 갱신합니다. 진입 상태 param 2.71, buf 1.9, grad −1은 비교를 위해 고정한 가정입니다." },
  { label: "일반 분기", summary: "2.71 − 0.1×0.71 = 2.639", note: "nesterov=False면 갱신한 buf 0.71이 그대로 방향입니다. 0.071을 빼므로 값은 2.639로 줄어듭니다." },
  { label: "Nesterov 분기", summary: "2.71 − 0.1×(−0.361) = 2.7461", note: "nesterov=True면 364행이 이번 grad −1에 0.9×0.71 = 0.639를 더해 −0.361을 방향으로 씁니다. 음수를 빼므로 값은 2.7461로 늘어납니다. 처음부터 Nesterov로 세 번 학습한 경로는 아닙니다." },
] as const;

const W = 360;
const LINE_L = 30;
const LINE_R = 330;
const tx = (theta: number) => LINE_L + ((theta - 2.6) / 0.2) * (LINE_R - LINE_L);
const PLAIN = "#2563eb";
const NEST = "#7c3aed";

function Box({ x, y, w, title, body, color, on }: { x: number; y: number; w: number; title: string; body: string; color: string; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.2}>
      <rect x={x} y={y} width={w} height={40} rx={6} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{title}</text>
      <text x={x + w / 2} y={y + 31} textAnchor="middle" fontSize={10} fill="#475569">{body}</text>
    </g>
  );
}

export default function NesterovBranchViz() {
  return (
    <SceneShell
      eyebrow="세 번째 갱신 직전 상태 (가정)"
      title="같은 buf 0.71에서 두 분기가 반대쪽으로 움직입니다"
      description="위는 고정한 진입 상태에서 갈라지는 두 코드 분기, 아래는 다음 param이 놓이는 수직선입니다. 가운데 2.71이 출발점입니다."
      ariaLabel="같은 진입 상태에서 일반 momentum과 Nesterov 분기가 만드는 다음 param"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 236`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Box x={80} y={6} w={200} title="진입: param 2.71 · buf 1.9 · grad −1" body="새 buf = 0.9×1.9 + (−1) = 0.71" color="#475569" on />
          <line x1={180} y1={46} x2={95} y2={68} stroke={PLAIN} strokeWidth={1} opacity={active >= 1 ? 1 : 0.2} />
          <line x1={180} y1={46} x2={265} y2={68} stroke={NEST} strokeWidth={1} opacity={active >= 2 ? 1 : 0.2} />
          <Box x={10} y={68} w={170} title="nesterov=False" body="방향 = buf = 0.71" color={PLAIN} on={active === 1} />
          <Box x={184} y={68} w={170} title="nesterov=True" body="방향 = −1 + 0.9×0.71 = −0.361" color={NEST} on={active === 2} />
          <line x1={LINE_L} x2={LINE_R} y1={170} y2={170} stroke="#94a3b8" strokeWidth={1} />
          {[2.6, 2.7, 2.8].map((t) => (
            <text key={t} x={tx(t)} y={222} textAnchor="middle" fontSize={9} fill="#94a3b8">{t}</text>
          ))}
          <circle cx={tx(2.71)} cy={170} r={4} fill="#475569" />
          <text x={tx(2.71)} y={190} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">2.71</text>
          <g opacity={active === 1 ? 1 : active === 2 ? 0.3 : 0}>
            <path d={`M${tx(2.71)} 170Q${(tx(2.71) + tx(2.639)) / 2} 142 ${tx(2.639)} 170`} fill="none" stroke={PLAIN} strokeWidth={1.25} />
            <circle cx={tx(2.639)} cy={170} r={4} fill={PLAIN} />
            <text x={tx(2.639)} y={152} textAnchor="middle" fontSize={10} fontWeight={700} fill={PLAIN}>2.639</text>
            <text x={tx(2.639)} y={190} textAnchor="middle" fontSize={9} fill={PLAIN}>감소</text>
          </g>
          <g opacity={active === 2 ? 1 : 0}>
            <path d={`M${tx(2.71)} 170Q${(tx(2.71) + tx(2.7461)) / 2} 142 ${tx(2.7461)} 170`} fill="none" stroke={NEST} strokeWidth={1.25} />
            <circle cx={tx(2.7461)} cy={170} r={4} fill={NEST} />
            <text x={tx(2.7461)} y={152} textAnchor="middle" fontSize={10} fontWeight={700} fill={NEST}>2.7461</text>
            <text x={tx(2.7461)} y={190} textAnchor="middle" fontSize={9} fill={NEST}>증가</text>
          </g>
          <text x={LINE_L} y={208} fontSize={9} fill="#64748b">← 작은 param</text>
          <text x={LINE_R} y={208} textAnchor="end" fontSize={9} fill="#64748b">큰 param →</text>
        </svg>
      )}
    />
  );
}
