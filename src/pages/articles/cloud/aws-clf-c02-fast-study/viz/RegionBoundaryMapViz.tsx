import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 첫 문단 — 리전 ⊃ 가용 영역, Security Group(자원 경계·상태 기반) vs
 * Network ACL(서브넷 경계·양방향 규칙), S3 객체 · EBS 한 실행 자원 · EFS 공유 파일.
 * 가용 영역 2개·실행 자원 2대는 그림을 위한 가정이다.
 */
const SCENES = [
  {
    label: "리전 안에 가용 영역",
    short: "리전·AZ",
    summary: "지리 단위 ⊃ 장애 분리 단위",
    note: "리전은 자원을 어느 지역에 둘지 정하는 지리적 단위이고, 가용 영역은 그 리전 안에서 장애를 나눠 담는 단위입니다. 그림에는 가용 영역을 두 개만 그렸습니다(가정).",
  },
  {
    label: "한 가용 영역에 장애",
    short: "AZ 장애",
    summary: "A 장애 · B는 영향 밖",
    note: "장애 분리 단위라는 말은 A에 문제가 생겨도 같은 리전의 B까지 함께 끌려가지 않도록 나눴다는 뜻입니다. 그래서 같은 리전 안에서도 가용 영역을 나눠 배치하는 선택이 생깁니다.",
  },
  {
    label: "Security Group · 자원 경계",
    short: "SG",
    summary: "들어올 때 검사 · 응답은 자동 허용",
    note: "Security Group은 실행 자원 하나를 감싸는 규칙입니다. ‘상태 기반’은 들어온 요청을 기억해 두었다가 그 요청의 응답이 나갈 때는 따로 규칙을 묻지 않고 통과시킨다는 뜻입니다.",
  },
  {
    label: "Network ACL · 서브넷 경계",
    short: "NACL",
    summary: "들어올 때 검사 · 나갈 때 또 검사",
    note: "Network ACL은 서브넷 전체의 경계에 걸리는 규칙입니다. ‘양방향 규칙’은 요청을 기억하지 않아 들어오는 규칙과 나가는 규칙을 각각 따로 맞춰야 응답까지 통과한다는 뜻입니다.",
  },
  {
    label: "S3 · EBS · EFS",
    short: "저장소",
    summary: "객체 · 한 자원의 블록 · 공유 파일",
    note: "EBS는 한 실행 자원에 붙는 블록, EFS는 여러 자원이 함께 여는 공유 파일입니다. S3는 어디에도 붙지 않고 키로 객체를 넣고 꺼냅니다.",
  },
] as const;

const INK = "#64748b";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";
const WARN = "#dc2626";
const OK = "#16a34a";

function Instance({ x, label, dim, active }: { x: number; label: string; dim?: boolean; active?: boolean }) {
  return (
    <g opacity={dim ? 0.3 : 1}>
      <rect x={x} y={114} width={64} height={34} rx={4} fill="none" stroke={active ? ACCENT : INK} strokeWidth={active ? 1.25 : 1} />
      <text x={x + 32} y={135} textAnchor="middle" fontSize={10} fill={INK}>{label}</text>
    </g>
  );
}

function Check({ x, y, mark, color }: { x: number; y: number; mark: string; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="#ffffff" stroke={color} strokeWidth={1.25} />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{mark}</text>
    </g>
  );
}

function BoundaryMap({ active }: { active: number }) {
  const azFocus = active === 0;
  const failA = active === 1;
  const sg = active === 2;
  const nacl = active === 3;
  const storage = active === 4;
  const traffic = sg || nacl;
  return (
    <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {traffic ? (
        <>
          <text x={137} y={14} textAnchor="middle" fontSize={10} fill={INK}>외부 요청 ↓ · 응답 ↑</text>
          <polyline points="128,20 128,124 114,124" fill="none" stroke={INK} strokeWidth={1.25} />
          <polygon points="114,120 108,124 114,128" fill={INK} />
          <polyline points="112,138 146,138 146,26" fill="none" stroke={INK} strokeWidth={1.25} strokeDasharray="4 3" />
          <polygon points="142,26 146,20 150,26" fill={INK} />
        </>
      ) : null}

      <rect x={6} y={36} width={346} height={218} rx={8} fill="none" stroke={INK} strokeWidth={1} />
      <text x={14} y={51} fontSize={11} fontWeight={700} fill={INK}>리전</text>

      {[0, 1].map((index) => {
        const x = 14 + index * 170;
        const failed = failA && index === 0;
        const spared = failA && index === 1;
        return (
          <g key={index}>
            <rect
              x={x}
              y={60}
              width={162}
              height={146}
              rx={6}
              fill={failed ? WARN : "none"} fillOpacity={failed ? 0.08 : 1}
              stroke={failed ? WARN : azFocus || spared ? ACCENT : MUTED}
              strokeWidth={azFocus || failA ? 1.25 : 1}
            />
            <text x={x + 8} y={75} fontSize={10} fontWeight={700} fill={failed ? WARN : azFocus || spared ? ACCENT : INK}>
              가용 영역 {index === 0 ? "A" : "B"}{failed ? " · 장애" : spared ? " · 영향 밖" : ""}
            </text>
            <rect x={x + 12} y={84} width={146} height={82} rx={4} fill="none" stroke={nacl ? ACCENT : MUTED} strokeWidth={nacl ? 1.25 : 1} strokeDasharray="5 3" opacity={failed ? 0.4 : 1} />
            <text x={x + 18} y={97} fontSize={9} fill={nacl ? ACCENT : "#64748b"}>{nacl && index === 0 ? "서브넷 · Network ACL" : "서브넷"}</text>
            <rect x={x + 26} y={106} width={124} height={50} rx={4} fill="none" stroke={sg ? ACCENT : MUTED} strokeWidth={sg ? 1.25 : 1} opacity={failed ? 0.4 : 1} />
            {sg && index === 0 ? <text x={x + 32} y={163} fontSize={9} fill={ACCENT}>Security Group</text> : null}
            <Instance x={x + 34} label={`실행 자원 ${index === 0 ? "A" : "B"}`} dim={failed} active={storage || spared} />
          </g>
        );
      })}

      {sg ? (
        <>
          <Check x={128} y={106} mark="✓" color={OK} />
          <Check x={146} y={106} mark="↺" color={ACCENT} />
        </>
      ) : null}
      {nacl ? (
        <>
          <Check x={128} y={84} mark="✓" color={OK} />
          <Check x={146} y={84} mark="✓" color={OK} />
        </>
      ) : null}

      <g opacity={storage ? 1 : 0.35}>
        <line x1={91} y1={148} x2={91} y2={178} stroke={storage ? ACCENT : MUTED} strokeWidth={1} />
        <rect x={70} y={178} width={42} height={22} rx={4} fill="none" stroke={storage ? ACCENT : MUTED} strokeWidth={1} />
        <text x={91} y={193} textAnchor="middle" fontSize={10} fill={INK}>EBS</text>

        <line x1={54} y1={148} x2={54} y2={218} stroke={storage ? ACCENT : MUTED} strokeWidth={1} />
        <polyline points="230,148 230,231 150,231" fill="none" stroke={storage ? ACCENT : MUTED} strokeWidth={1} />
        <rect x={40} y={218} width={110} height={26} rx={4} fill="none" stroke={storage ? ACCENT : MUTED} strokeWidth={1} />
        <text x={95} y={235} textAnchor="middle" fontSize={10} fill={INK}>EFS · 공유 파일</text>

        <line x1={270} y1={148} x2={270} y2={218} stroke={storage ? ACCENT : MUTED} strokeWidth={1} strokeDasharray="4 3" />
        <rect x={244} y={218} width={98} height={26} rx={4} fill="none" stroke={storage ? ACCENT : MUTED} strokeWidth={1} />
        <text x={293} y={235} textAnchor="middle" fontSize={10} fill={INK}>S3 · 키 → 객체</text>
      </g>
    </svg>
  );
}

const LEGEND: Record<number, readonly (readonly [string, string, string])[]> = {
  2: [
    ["✓", OK, "들어오는 요청: 규칙 검사 통과"],
    ["↺", ACCENT, "나가는 응답: 기억해 둔 요청이라 자동 허용"],
  ],
  3: [
    ["✓", OK, "들어오는 요청: 들어오는 규칙 검사"],
    ["✓", OK, "나가는 응답: 나가는 규칙을 따로 검사"],
  ],
  4: [
    ["─", ACCENT, "실선: 실행 자원에 붙음 (EBS는 한 대, EFS는 두 대)"],
    ["┄", ACCENT, "점선: 붙지 않고 키로 요청 (S3)"],
  ],
};

export default function RegionBoundaryMapViz() {
  return (
    <SceneShell
      eyebrow="자주 틀리는 쌍"
      title="리전·가용 영역·두 방화벽 규칙·세 저장소를 한 지도에 놓습니다"
      description="바깥 상자가 안쪽 상자를 담습니다. 점선 상자는 서브넷, 실행 자원을 바로 감싼 상자는 Security Group입니다. 가용 영역 두 개와 실행 자원 두 대는 그림용 가정입니다."
      ariaLabel="리전 안 가용 영역, 서브넷 경계의 Network ACL, 자원 경계의 Security Group, 그리고 EBS·EFS·S3가 연결되는 범위"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <BoundaryMap active={active} />
          <ul className="mt-3 min-h-[3.25rem] space-y-1 text-xs leading-5 text-muted-foreground sm:text-sm">
            {(LEGEND[active] ?? []).map(([mark, color, text]) => (
              <li key={text} className="flex min-w-0 items-start gap-2">
                <span className="w-4 shrink-0 text-center font-bold" style={{ color }}>{mark}</span>
                <span className="min-w-0 break-keep">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    />
  );
}
