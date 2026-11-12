import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release — 직접 호출만 막으면 재시도·위임·확장 기능·저장된 승인 경로가 열려 있을 수 있다.
 * 모든 경로가 같은 검사(현재 대상·권한)를 거쳐야 하고, 승인은 특정 대상·변경에 묶여야 한다.
 * 어느 경로에 검사가 빠졌는지는 그림용 가정이다.
 */
const PATHS = ["직접 호출", "재시도", "다른 작업자 위임", "확장 기능", "저장해 둔 승인"] as const;

const SCENES = [
  {
    label: "직접 호출만 검사를 거칠 때",
    summary: "1경로 막힘 · 나머지는 미확인",
    result: "직접만 거부",
    note: "7절에서 막은 것은 직접 호출 하나입니다. 같은 전송에 닿는 다른 경로가 검사를 거치는지는 아직 모릅니다.",
    checked: [true, false, false, false, false],
    leak: -1,
  },
  {
    label: "한 경로라도 검사를 건너뛰면",
    summary: "재시도 → 전송 (우회점)",
    result: "실행 가능",
    note: "재시도 경로가 정책 검사를 건너뛴다면(가정) 직접 호출을 막아도 같은 전송이 그 길로 실행될 수 있습니다. 빠진 경로가 우회점입니다.",
    checked: [true, false, false, false, false],
    leak: 1,
  },
  {
    label: "모든 경로가 같은 검사로",
    summary: "다섯 길 → 한 검사 → 거부",
    result: "거부",
    note: "재시도·위임·확장 기능·저장해 둔 승인에서도 현재 대상과 권한을 확인하면, 어느 길로 와도 요약 전용 사용자의 전송은 거부됩니다.",
    checked: [true, true, true, true, true],
    leak: -1,
  },
  {
    label: "승인은 대상과 변경에 묶입니다",
    summary: "다른 대상이면 다시 검사",
    result: "거부",
    note: "승인은 특정 대상과 변경에 연결됩니다. 이번 요청의 대상·변경이 승인 내용(가정)과 다르면 그 승인으로 통과하지 못합니다.",
    checked: [true, true, true, true, true],
    leak: -1,
  },
] as const;

const W = 360;
const H = 250;
const ACCENT = "#2563eb";
const DENY = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const ROW_Y = (index: number) => 14 + index * 40;

export default function ExecutionPathsViz() {
  return (
    <SceneShell
      eyebrow="같은 100건 전송 · 여러 실행 경로"
      title="검사를 거치지 않는 경로 하나가 경계를 엽니다"
      description="왼쪽은 같은 전송에 닿을 수 있는 실행 경로, 가운데 칸은 현재 대상·권한 검사, 오른쪽은 실제 전송입니다. 어느 경로가 비었는지는 그림용 가정입니다."
      ariaLabel="직접 호출, 재시도, 위임, 확장 기능, 저장된 승인 경로가 같은 검사를 거쳐야 전송을 막는 구조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const approval = active === 3;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[380px]"
            role="img"
            aria-label={`${scene.label}: ${scene.summary}`}
          >
            {/* 검사 칸 */}
            <rect x={160} y={10} width={86} height={196} rx={8} fill={ACCENT} fillOpacity={0.06} stroke={ACCENT} strokeWidth={1.25} />
            <text x={203} y={100} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">현재 대상</text>
            <text x={203} y={116} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">· 권한 검사</text>

            {/* 전송 칸 */}
            <rect x={286} y={86} width={66} height={44} rx={6} fill="none" stroke={scene.leak >= 0 ? DENY : LINE} strokeWidth={scene.leak >= 0 ? 1.25 : 1} />
            <text x={319} y={104} textAnchor="middle" fontSize={10} fill={MUTED}>실제 전송</text>
            <text x={319} y={121} textAnchor="middle" fontSize={11} fontWeight={700} fill={scene.leak >= 0 ? DENY : MUTED}>
              {scene.result}
            </text>

            {PATHS.map((name, index) => {
              const y = ROW_Y(index);
              const checked = (scene.checked as readonly boolean[])[index];
              const leaking = scene.leak === index;
              const highlighted = approval && index === 4;
              const color = leaking ? DENY : checked ? ACCENT : LINE;
              return (
                <g key={name}>
                  <rect x={8} y={y} width={132} height={30} rx={6} fill={highlighted ? ACCENT : "none"} fillOpacity={highlighted ? 0.08 : 0} stroke={color} strokeWidth={leaking || highlighted ? 1.25 : 1} />
                  <text x={18} y={y + 19} fontSize={11} fill="currentColor">{name}</text>
                  {checked && (
                    <line x1={140} y1={y + 15} x2={160} y2={y + 15} stroke={ACCENT} strokeWidth={1.25} />
                  )}
                  {!checked && !leaking && (
                    <text x={150} y={y + 19} textAnchor="middle" fontSize={11} fill={MUTED}>?</text>
                  )}
                  {leaking && (
                    <path d={`M140 ${y + 15} H150 V3 H319 V86`} fill="none" stroke={DENY} strokeWidth={1.25} strokeDasharray="4 3" />
                  )}
                </g>
              );
            })}
            {scene.leak >= 0 && (
              <text x={256} y={58} fontSize={10} fontWeight={700} fill={DENY}>검사 건너뜀</text>
            )}
            {/* 검사 → 전송 화살표: 거부면 끊어진 선 */}
            <line x1={246} y1={108} x2={286} y2={108} stroke={LINE} strokeWidth={1} strokeDasharray="2 4" />
            <text x={266} y={146} textAnchor="middle" fontSize={10} fill={MUTED}>{scene.leak >= 0 ? "검사 쪽은 막힘" : "검사 통과 못함"}</text>

            {/* 하단: 승인 대조 (4장면만 표시, 다른 장면은 같은 자리를 비워 둠) */}
            <g opacity={approval ? 1 : 0}>
              <rect x={8} y={214} width={160} height={30} rx={6} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
              <text x={18} y={233} fontSize={10} fill="currentColor">승인: 대상 A · 변경 X (가정)</text>
              <rect x={188} y={214} width={164} height={30} rx={6} fill="none" stroke={DENY} strokeWidth={1.25} />
              <text x={198} y={233} fontSize={10} fill="currentColor">요청: outside.example · 100건</text>
              <text x={178} y={234} textAnchor="middle" fontSize={12} fontWeight={700} fill={DENY}>≠</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
