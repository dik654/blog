import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #checkpoint의 "Resume 가능성은 새 process에서 비교해야 합니다".
 * K=3, M=2는 설명용 가정. 위 줄 = Run(C, K+M), 아래 줄 = Run(Load(S_K), M).
 * 점 하나 = optimizer update 하나. update 4·5에서 두 줄을 대조한다.
 */
const K = 3;
const M = 2;
const TOTAL = K + M;
const UPDATES = Array.from({ length: TOTAL + 1 }, (_, update) => update);

const SCENES = [
  {
    label: "중단 없는 reference",
    summary: `C에서 K+M = ${TOTAL} updates`,
    note: "같은 초기 상태 C(code·data·config·seed·environment)에서 한 process로 끝까지 실행한 기준입니다. 여기서는 K=3, M=2로 가정합니다.",
  },
  {
    label: "K updates 뒤 저장하고 종료",
    summary: "S₃ 저장 → process 종료",
    note: "다른 실행은 update 3 뒤 checkpoint S₃를 저장하고 process를 완전히 종료합니다. S₃에는 model뿐 아니라 optimizer·scheduler·RNG·sampler 상태가 들어갑니다.",
  },
  {
    label: "새 process가 load해 M updates",
    summary: "Load(S₃) → update 4, 5",
    note: "새 process가 S₃를 불러 update 2번을 더 수행해 update 5에 도착합니다.",
  },
  {
    label: "update마다 대조",
    summary: "update 4·5에서 두 실행 일치",
    note: "Update 4·5의 sample ID 순서, learning rate, global update, loss와 최종 parameter가 허용 오차 안에서 맞으면 저장 후 재개가 같은 trajectory를 이어 갔다고 판정합니다.",
  },
  {
    label: "Optimizer moment를 잃었다면",
    summary: "update 4부터 어긋남",
    note: "Weight만 복원하고 momentum·Adam moment를 잃으면 같은 weight에서 시작해도 다음 update가 달라집니다. 이때는 첫 어긋난 update 4의 sample IDs·LR·AMP scale·optimizer buffer·RNG를 차례로 비교합니다.",
  },
] as const;

const W = 360;
const H = 196;
const X0 = 44;
const STEP = 54;
const LANE_A = 52;
const LANE_B = 132;
const MID = (LANE_A + LANE_B) / 2;
const ux = (update: number) => X0 + update * STEP;
const CUT_X = ux(K) + STEP / 2;

const BLUE = "#2563eb";
const PURPLE = "#7c3aed";
const RED = "#dc2626";
const GRAY = "#94a3b8";

function Figure({ sceneIndex }: { sceneIndex: number }) {
  const showSaved = sceneIndex >= 1;
  const showResumed = sceneIndex >= 2;
  const compare = sceneIndex >= 3;
  const broken = sceneIndex === 4;
  const resumedColor = broken ? RED : PURPLE;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[sceneIndex].label}: ${SCENES[sceneIndex].summary}`}>
      <text x={X0} y={24} fontSize={12} fontWeight={700} fill={BLUE}>연속 실행 Run(C, K+M)</text>
      <line x1={ux(0)} x2={ux(TOTAL)} y1={LANE_A} y2={LANE_A} stroke={BLUE} strokeWidth={1.25} />
      {UPDATES.map((update) => (
        <circle key={`a-${update}`} cx={ux(update)} cy={LANE_A} r={4.5} fill={BLUE} />
      ))}

      <text x={X0} y={LANE_B - 34} fontSize={12} fontWeight={700} fill={showSaved ? "#64748b" : GRAY}>저장 후 재개 Run(Load(S₃), M)</text>
      <line x1={ux(0)} x2={ux(K)} y1={LANE_B} y2={LANE_B} stroke={showSaved ? BLUE : GRAY} strokeWidth={1.25} strokeDasharray={showSaved ? undefined : "3 3"} />
      <line x1={ux(K)} x2={ux(TOTAL)} y1={LANE_B} y2={LANE_B} stroke={showResumed ? resumedColor : GRAY} strokeWidth={1.25} strokeDasharray={showResumed ? undefined : "3 3"} />
      {UPDATES.map((update) => {
        const before = update <= K;
        const visible = before ? showSaved : showResumed;
        const color = before ? BLUE : resumedColor;
        return (
          <circle
            key={`b-${update}`}
            cx={ux(update)}
            cy={LANE_B}
            r={4.5}
            fill={visible ? color : "none"}
            stroke={visible ? color : GRAY}
            strokeWidth={1}
          />
        );
      })}

      {showSaved && (
        <g>
          <rect x={ux(K) - 18} y={LANE_B - 22} width={36} height={14} rx={3} fill="none" stroke="#64748b" strokeWidth={1} />
          <text x={ux(K)} y={LANE_B - 11} textAnchor="middle" fontSize={10} fontWeight={700} fill="#64748b">S₃ 저장</text>
          <line x1={CUT_X} x2={CUT_X} y1={LANE_B - 10} y2={LANE_B + 10} stroke="#64748b" strokeWidth={1.25} />
          <text x={CUT_X} y={LANE_B + 24} textAnchor="middle" fontSize={10.5} fill="#64748b">process 종료</text>
        </g>
      )}
      {showResumed && (
        <text x={(ux(K + 1) + ux(TOTAL)) / 2} y={LANE_B + 40} textAnchor="middle" fontSize={10.5} fill={resumedColor}>새 process</text>
      )}

      {compare &&
        UPDATES.filter((update) => update > K).map((update) => (
          <g key={`c-${update}`}>
            <line x1={ux(update)} x2={ux(update)} y1={LANE_A + 8} y2={MID - 20} stroke={broken ? RED : "#16a34a"} strokeWidth={1} strokeDasharray="2 3" />
            <line x1={ux(update)} x2={ux(update)} y1={MID + 2} y2={LANE_B - 8} stroke={broken ? RED : "#16a34a"} strokeWidth={1} strokeDasharray="2 3" />
            <rect x={ux(update) - 9} y={MID - 18} width={18} height={18} rx={3} fill="none" stroke={broken ? RED : "#16a34a"} strokeWidth={1} />
            <text x={ux(update)} y={MID - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={broken ? RED : "#15803d"}>
              {broken ? "≠" : "="}
            </text>
          </g>
        ))}
      {broken && (
        <text x={ux(K + 1) - 14} y={MID - 4} textAnchor="end" fontSize={10.5} fontWeight={700} fill={RED}>첫 어긋남</text>
      )}

      {UPDATES.map((update) => (
        <text key={`t-${update}`} x={ux(update)} y={H - 10} textAnchor="middle" fontSize={11} fill="#64748b">{update}</text>
      ))}
      <text x={4} y={H - 10} fontSize={10} fill="#64748b">update</text>
    </svg>
  );
}

export default function ResumeCompareViz() {
  return (
    <SceneShell
      eyebrow="Resume 검사"
      title="중단 없는 실행과 저장 후 재개한 실행을 update마다 맞대 봅니다"
      description="K는 저장 전까지 수행한 optimizer update 수, M은 재개한 뒤 더 수행하는 update 수입니다. 점 n은 update n이 끝난 직후의 상태이고 점 0은 초기 상태 C입니다. K=3, M=2는 그림을 위한 가정이며 실제 비교 구간은 run마다 정합니다."
      ariaLabel="연속 실행과 저장 후 새 process에서 재개한 실행을 update 4와 5에서 비교하는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) => <Figure key={scene.label} sceneIndex={index} />)}
        />
      )}
    />
  );
}
