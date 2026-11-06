import ArrowPath from "./ArrowPath";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #formal-simplification — 검사기 통과와 "명제가 원하는 기능과 맞는가"는 별도 관문이다.
 * 잘못된 명제 "10월 6일 이후에는 모두 새 규칙"은 본문의 예시이고, Sepolia·메인넷 칸은 3·4절의 2026-10-04 상태다.
 */
const SCENES = [
  { label: "관문이 둘입니다", summary: "검사기 통과 + 별도 검토", note: "AI나 사람이 만든 증명 후보는 검사기를 통과해야 합니다. 통과한 뒤에도 명세가 실제 원하는 기능과 일치하는지는 별도로 검토합니다.", proposition: "명제: 아직 정하지 않음" },
  { label: "잘못 적은 명제", summary: "완벽히 검사해도 오류는 남음", note: "운영자가 이렇게 잘못 적고 완벽히 검사했다고 해도, 메인넷과 Sepolia를 구분하지 못한 오류는 그대로 남습니다. 검사기는 적힌 명제만 봅니다.", proposition: "명제: 10월 6일 이후에는 모두 새 규칙" },
  { label: "조건을 붙인 명제", summary: "네트워크 + 버전 + 활성화 조건", note: "올바른 명제에는 네트워크, 버전, 활성화 조건이 들어갑니다. 그래야 메인넷처럼 날짜가 없는 칸을 명제가 잘못 덮지 않습니다.", proposition: "명제: Sepolia · 이 버전 · 활성화 조건 후 새 규칙" },
] as const;

const ACCENT = "#2563eb";
const GREEN = "#16a34a";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const CLAIMS = [
  ["—", "—"],
  ["새 규칙", "새 규칙"],
  ["조건 충족 후 새 규칙", "이 명제의 범위 밖"],
];
const ACTUAL = ["10월 6일 예정", "날짜 없음"];
const NETWORKS = ["Sepolia", "메인넷"];

export default function SpecGapViz() {
  return (
    <SceneShell
      eyebrow="증명이 답하지 않는 것"
      title="검사기 통과와 명제가 맞는지는 다른 관문입니다"
      description="형식 검증은 정한 가정 아래 어떤 성질이 유지되는지를 기계로 확인하는 일입니다. 잘못된 명제는 본문의 예시이고, 원문 칸은 2026-10-04에 읽은 일정입니다."
      ariaLabel="검사기 통과와 별도 검토의 차이, 잘못된 명제와 조건을 붙인 명제의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const third = active === 1 ? { color: RED, text: "아니오: 메인넷을 덮음" } : active === 2 ? { color: ACCENT, text: "네트워크별로 대조" } : { color: TEXT, text: "통과 후 별도 검토" };
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={4} y={6} width={84} height={36} rx={8} fill="#64748b" fillOpacity={0.1} stroke={TEXT} strokeWidth={1} />
            <text x={46} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>증명 후보</text>
            <text x={46} y={34} textAnchor="middle" fontSize={10} fill={TEXT}>AI·사람</text>
            <ArrowPath points={[[88, 24], [111, 24]]} color={MUTED} />
            <rect x={112} y={6} width={76} height={36} rx={8} fill={GREEN} fillOpacity={active === 1 ? 0.12 : 0.04} stroke={active === 1 ? GREEN : TEXT} strokeWidth={1} />
            <text x={150} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>검사기</text>
            <text x={150} y={34} textAnchor="middle" fontSize={10} fill={active === 1 ? GREEN : TEXT}>{active === 1 ? "통과(예시)" : "통과해야 함"}</text>
            <ArrowPath points={[[188, 24], [211, 24]]} color={MUTED} />
            <rect x={212} y={6} width={144} height={36} rx={8} fill={third.color} fillOpacity={0.1} stroke={third.color} strokeWidth={1} strokeDasharray={active === 1 ? "3 3" : undefined} />
            <text x={284} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>원하는 기능과 맞나?</text>
            <text x={284} y={34} textAnchor="middle" fontSize={10} fontWeight={active > 0 ? 700 : 400} fill={third.color}>{third.text}</text>

            <rect x={4} y={54} width={352} height={28} rx={6} fill="none" stroke={MUTED} strokeWidth={1} />
            <text x={180} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill={active === 1 ? RED : active === 2 ? ACCENT : TEXT}>{scene.proposition}</text>

            <text x={70} y={102} fontSize={11} fontWeight={700} fill={TEXT}>명제가 말하는 것</text>
            <text x={236} y={102} fontSize={11} fontWeight={700} fill={TEXT}>원문 일정</text>
            {NETWORKS.map((network, row) => {
              const y = 112 + row * 38;
              const wrong = active === 1 && row === 1;
              return (
                <g key={network}>
                  <text x={4} y={y + 20} fontSize={11} fontWeight={700} fill={TEXT}>{network}</text>
                  <rect x={66} y={y} width={156} height={30} rx={6} fill={wrong ? RED : "#64748b"} fillOpacity={wrong ? 0.12 : 0.06} stroke={wrong ? RED : MUTED} strokeWidth={1} />
                  <text x={144} y={y + 19} textAnchor="middle" fontSize={11} fontWeight={wrong ? 700 : 400} fill={wrong ? RED : TEXT}>{CLAIMS[active][row]}</text>
                  <rect x={230} y={y} width={126} height={30} rx={6} fill="#64748b" fillOpacity={0.06} stroke={MUTED} strokeWidth={1} strokeDasharray={row === 1 ? "3 3" : undefined} />
                  <text x={293} y={y + 19} textAnchor="middle" fontSize={11} fill={TEXT}>{ACTUAL[row]}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
