import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 깃대 높이·태양 각도·빛의 직진으로 그림자 길이를 이끌 수 있고, 그 반대도 논리적으로 된다.
 * 그러나 설명 방향은 한쪽뿐이다. 그림의 길이는 수치가 아닌 모양만 나타낸다.
 */
const GIVEN = "#2563eb";
const DERIVED = "#d97706";
const IDLE = "#94a3b8";
const GROUND = 160;
const POLE_X = 250;
const POLE_TOP = 68;
const TIP_X = 90;

const SCENES = [
  { label: "앞으로 이끌기", summary: "높이 + 각도 → 그림자", note: "깃대 높이와 태양 각도, 빛의 직진 법칙에서 그림자 길이를 이끌어 낼 수 있습니다. 이 도출은 설명처럼 보입니다.", from: "깃대 높이 + 태양 각도 + 빛의 직진", to: "그림자 길이" },
  { label: "거꾸로 이끌기", summary: "그림자 + 각도 → 높이", note: "같은 법칙과 그림자 길이로 깃대 높이도 이끌어 낼 수 있습니다. 논리적으로는 앞 장면과 똑같이 맞습니다. 그러나 이 도출은 깃대 높이를 설명하지 못합니다.", from: "그림자 길이 + 태양 각도 + 빛의 직진", to: "깃대 높이" },
  { label: "설명의 방향", summary: "깃대 → 그림자만 설명", note: "깃대가 그림자를 만들지 그림자가 깃대를 만들지는 않습니다. 논리적 도출만으로는 설명 방향을 고르기 어렵고, 원인이 어느 쪽인지가 따로 필요합니다.", from: "깃대가 그림자를 만듦", to: "그림자가 깃대를 만들지는 않음" },
] as const;

export default function FlagpoleAsymmetryViz() {
  return (
    <SceneShell
      eyebrow="깃대와 그림자"
      title="논리는 양쪽으로 통하지만 설명은 한쪽으로만 갑니다"
      description="연역·법칙 모형은 초기 조건과 일반 법칙에서 현상을 논리적으로 이끌어 내려는 설명 틀입니다. 파랑은 주어진 값, 주황 점선은 이끌어 낸 값이고, 그림의 길이는 수치가 아닙니다."
      ariaLabel="깃대 높이와 그림자 길이를 양방향으로 도출할 수 있지만 설명은 한 방향뿐임을 보이는 측면도"
      scenes={SCENES}
      render={(active) => {
        const poleGiven = active !== 1;
        const shadowGiven = active === 1;
        const cause = active === 2;
        const poleColor = poleGiven ? GIVEN : DERIVED;
        const shadowColor = cause ? IDLE : shadowGiven ? GIVEN : DERIVED;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <circle cx={340} cy={16} r={10} fill="none" stroke={cause ? IDLE : GIVEN} strokeWidth={1} />
              <text x={320} y={20} textAnchor="end" fontSize={12} fill="#64748b">태양</text>
              <line x1={TIP_X} y1={GROUND} x2={332} y2={21} stroke={IDLE} strokeWidth={1} strokeDasharray="2 3" />
              <line x1={20} y1={GROUND} x2={340} y2={GROUND} stroke={IDLE} strokeWidth={1} />
              <path d={`M${TIP_X + 36} ${GROUND} A36 36 0 0 0 ${TIP_X + 31} ${GROUND - 18}`} fill="none" stroke={cause ? IDLE : GIVEN} strokeWidth={1.25} />
              <text x={TIP_X + 42} y={GROUND - 7} fontSize={12} fill="#64748b">태양 각도</text>
              <line x1={POLE_X} y1={GROUND} x2={POLE_X} y2={POLE_TOP} stroke={poleColor} strokeWidth={1.25} strokeDasharray={poleGiven ? undefined : "4 3"} />
              <text x={POLE_X + 8} y={110} fontSize={12} fontWeight={700} fill={poleColor}>깃대 높이</text>
              <line x1={TIP_X} y1={GROUND + 3} x2={POLE_X} y2={GROUND + 3} stroke={shadowColor} strokeWidth={1.25} strokeDasharray={shadowGiven || cause ? undefined : "4 3"} />
              <text x={(TIP_X + POLE_X) / 2} y={GROUND + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={shadowColor}>그림자 길이</text>
              {cause && (
                <g>
                  <path d={`M${POLE_X - 6} 118 Q 200 118 186 ${GROUND - 5}`} fill="none" stroke={GIVEN} strokeWidth={1.25} />
                  <polygon points={`186,${GROUND - 3} 181,${GROUND - 11} 190,${GROUND - 11}`} fill={GIVEN} />
                  <text x={POLE_X + 8} y={130} fontSize={12} fontWeight={700} fill={GIVEN}>원인 → 결과</text>
                </g>
              )}
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={SCENES.map((scene, index) => (
                <div key={scene.label} className="grid gap-2 text-xs leading-5 sm:grid-cols-2 sm:text-sm">
                  <div className="rounded-lg border border-border bg-background px-3 py-2">
                    <span className="block font-semibold text-muted-foreground">{index === 2 ? "설명이 되는 쪽" : "전제"}</span>
                    {scene.from}
                  </div>
                  <div className="rounded-lg border border-border bg-background px-3 py-2">
                    <span className="block font-semibold text-muted-foreground">{index === 2 ? "설명이 안 되는 쪽" : "이끌어 낸 것"}</span>
                    {scene.to}
                  </div>
                </div>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
