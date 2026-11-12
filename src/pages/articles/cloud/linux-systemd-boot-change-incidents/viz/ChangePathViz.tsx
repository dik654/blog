import SceneShell from "./SceneShell";

/**
 * 본문 대응: #change-path — 평소 변경은 실험 cluster → staging → 가장 작은 지역의 한 zone → 그다음 지역으로
 * 단계 사이 1주~1달을 두고 퍼진다. 기본 OS 이미지의 예전 보안 업데이트 경로는 배포 도구를 거치지 않고
 * 모든 노드에 같은 시각에 패키지를 설치했다. 사고 뒤 그 경로를 껐고, 글의 판단 규칙은 패키지 업데이트도
 * 같은 단계적 도구에 태우는 것이다. 가로 간격은 순서만 보이는 가정이다.
 */
const STAGES: readonly (readonly string[])[] = [["실험 cluster"], ["staging"], ["가장 작은 지역의", "한 zone"], ["그다음 지역"]];
const ROW_Y = [44, 80, 116, 152] as const;
const STAGE_X = [132, 192, 252, 312] as const;
const ROWS: readonly number[] = ROW_Y;
const XS: readonly number[] = STAGE_X;
const W = 360;
const H = 184;
const BYPASS_X = 216;

const SCENES = [
  {
    label: "평소 경로",
    summary: "단계마다 1주~1달",
    note: "Datadog은 평소 변경을 실험 cluster에서 시작해 staging, 가장 작은 지역의 한 zone, 그다음 지역으로 넓히고 단계 사이에 1주에서 한 달을 기다립니다. 노드는 제자리에서 고치지 않고 새 노드로 바꿉니다.",
  },
  {
    label: "두 번째 경로",
    summary: "모든 노드에 같은 시각",
    note: "기본 OS 이미지에 켜져 있던 예전 보안 업데이트 경로는 배포 도구를 거치지 않고 모든 노드에서 같은 시각에 패키지를 설치했습니다. 설치는 데몬을 실행 중에 재시작시키고, 그것은 부팅 시험이 한 번도 지나가지 않은 경로입니다.",
  },
  {
    label: "사고 뒤와 판단 규칙",
    summary: "업데이트도 단계를 따라",
    note: "사고 뒤 Datadog은 그 업데이트 경로를 모든 지역에서 껐습니다. 글의 판단 규칙은 패키지 업데이트를 배포로 세어 같은 단계적 도구에 태우고, 시험에 일하고 있는 노드에서 데몬만 재시작하는 경우를 넣는 것입니다.",
  },
] as const;

export default function ChangePathViz() {
  return (
    <SceneShell
      eyebrow="Change paths"
      title="같은 노드에 변경이 들어오는 길이 둘이었습니다"
      description="가로 줄 하나가 배포 단계이고 오른쪽으로 갈수록 나중입니다. 파란 사선은 배포 도구가 단계마다 기다리며 넓히는 길, 빨간 세로선은 배포 도구 밖에서 모든 단계에 한꺼번에 들어온 길입니다. 가로 간격은 순서만 보이는 가정입니다."
      ariaLabel="단계적 배포 경로와 자동 보안 업데이트 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const stagedOn = active !== 1;
        const bypassOn = active === 1;
        const bypassOff = active === 2;
        const stagedColor = stagedOn ? "#2563eb" : "#cbd5e1";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {STAGES.map((lines, index) => (
              <g key={lines[0]}>
                <line x1={110} x2={W - 6} y1={ROWS[index]} y2={ROWS[index]} stroke="#e2e8f0" strokeWidth={1} />
                <text x={4} y={ROWS[index] + (lines.length > 1 ? -2 : 4)} fontSize={12} fill="#334155">
                  {lines.map((part, i) => (
                    <tspan key={part} x={4} dy={i === 0 ? 0 : 14}>{part}</tspan>
                  ))}
                </text>
              </g>
            ))}
            {active === 2 && (
              <text x={110} y={18} fontSize={12} fontWeight={700} fill="#2563eb">업데이트도 같은 단계로 (글의 판단)</text>
            )}
            {active === 0 && (
              <text x={110} y={18} fontSize={12} fontWeight={700} fill="#2563eb">배포 도구 · 새 노드로 교체</text>
            )}
            <polyline
              points={XS.map((x, i) => `${x},${ROWS[i]}`).join(" ")}
              fill="none"
              stroke={stagedColor}
              strokeWidth={1.25}
            />
            {XS.map((x, i) => (
              <circle key={x} cx={x} cy={ROWS[i]} r={4.5} fill={stagedColor} />
            ))}
            {XS.slice(1).map((x, i) => (
              <text key={x} x={(XS[i] + x) / 2 + 6} y={(ROWS[i] + ROWS[i + 1]) / 2 + 2} fontSize={11} fill={stagedOn ? "#1e40af" : "#94a3b8"}>
                1주~1달
              </text>
            ))}
            {bypassOn && (
              <g>
                <text x={BYPASS_X} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">OS 이미지의 업데이트 · 같은 시각</text>
                <line x1={BYPASS_X} x2={BYPASS_X} y1={28} y2={ROWS[3] + 10} stroke="#dc2626" strokeWidth={1.25} />
                {ROWS.map((y) => (
                  <circle key={y} cx={BYPASS_X} cy={y} r={4.5} fill="#dc2626" />
                ))}
              </g>
            )}
            {bypassOff && (
              <g>
                <line x1={BYPASS_X} x2={BYPASS_X} y1={28} y2={ROWS[3] + 10} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={BYPASS_X + 5} y={H - 6} fontSize={11} fill="#64748b">자동 경로 끔</text>
              </g>
            )}
            <text x={W - 6} y={H - 6} textAnchor="end" fontSize={11} fill="#64748b">시간 →</text>
          </svg>
        );
      }}
    />
  );
}
