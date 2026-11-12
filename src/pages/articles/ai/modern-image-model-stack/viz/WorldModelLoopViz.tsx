import SceneShell from "./SceneShell";

/**
 * 본문 대응: #world-model-boundary — text-to-image는 c → x 한 번, 월드모델은 (sₜ, aₜ) → sₜ₊₁을 반복하고
 * 1-step과 32-step rollout 오차를 나눠 보며, 실제 controller·sensor 관측으로 닫힌 고리를 만든다.
 * 닫힌 고리의 숫자는 본문이 소개한 정본 글 사례(위치 0 → 목표 2, 예측 1.0, 관측 0.8)이며 차이 0.2는 그 뺄셈이다.
 * 정본 글(world-model-latent-planning #4)은 차이 자체가 아니라 관측 0.8을 새 출발점으로 다시 계획하므로 되먹임 화살표는 관측에서 계획으로 간다.
 */
const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#64748b";
const WARN = "#d97706";

const SCENES = [
  { label: "Text-to-image: 한 번 생성하고 끝", summary: "c → x", note: "조건 c에 맞는 sample x 한 장을 만들면 일이 끝납니다. 그 x가 다음 입력으로 다시 들어가지 않으므로, 한 장이 사실적이어도 다음 frame에서 물체가 남아 있다는 보장은 없습니다." },
  { label: "월드모델: 행동을 받아 다음 상태를 예측", summary: "(sₜ, aₜ) → sₜ₊₁", note: "월드모델은 현재 상태 sₜ와 행동 aₜ가 주어졌을 때 다음 상태 sₜ₊₁의 분포를 예측합니다. 그래서 appearance는 같고 action만 다른 쌍으로 action sensitivity를 따로 확인합니다." },
  { label: "Rollout: 예측이 다음 입력이 됩니다", summary: "1-step vs 32-step", note: "길게 굴리면 앞 step의 예측 ŝ가 다음 step의 입력이 됩니다. 그래서 rollout이 길어질 때 error가 누적되는지를 1-step error와 32-step error로 나눠 확인합니다." },
  { label: "Closed loop: 관측으로 다시 닫습니다", summary: "1.0 − 0.8 = 0.2", note: "Physical AI에서는 계획한 행동을 실제 controller가 실행하고 sensor 관측과 예측을 비교합니다. 정본 글의 예에서 예측 1.0과 관측 0.8은 0.2만큼 어긋나고, 다음 계획은 예측 1.0이 아니라 관측 0.8에서 다시 시작합니다." },
] as const;

function Box({ x, y, w, title, sub, on = false }: { x: number; y: number; w: number; title: string; sub?: string; on?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={sub ? 40 : 30} rx={8} fill="none" stroke={on ? ACCENT : MUTED} strokeWidth={on ? 1.25 : 1} />
      <text x={x + w / 2} y={y + (sub ? 17 : 19)} textAnchor="middle" fontSize={13} fontWeight={700} fill={on ? ACCENT : TEXT}>
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + 32} textAnchor="middle" fontSize={11} fill={TEXT}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = MUTED }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 6;
  const left = `${x2 - head * Math.cos(angle - 0.45)},${y2 - head * Math.sin(angle - 0.45)}`;
  const right = `${x2 - head * Math.cos(angle + 0.45)},${y2 - head * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${left} ${right}`} fill={color} />
    </g>
  );
}

function OneShot() {
  return (
    <g>
      <Box x={20} y={80} w={70} title="조건 c" />
      <Arrow x1={90} y1={95} x2={132} y2={95} />
      <Box x={134} y={75} w={92} title="생성 모델" sub="한 번 sampling" on />
      <Arrow x1={226} y1={95} x2={268} y2={95} />
      <Box x={270} y={80} w={70} title="image x" />
      <text x={305} y={136} textAnchor="middle" fontSize={12} fill={TEXT}>
        여기서 끝
      </text>
      <text x={180} y={170} textAnchor="middle" fontSize={12} fill={TEXT}>
        x는 다음 입력으로 돌아가지 않음
      </text>
    </g>
  );
}

function OneStep() {
  return (
    <g>
      <Box x={14} y={50} w={78} title="상태 sₜ" />
      <Box x={14} y={120} w={78} title="행동 aₜ" on />
      <Arrow x1={92} y1={65} x2={132} y2={88} />
      <Arrow x1={92} y1={135} x2={132} y2={110} />
      <Box x={134} y={80} w={92} title="월드모델" sub="전이 예측" on />
      <Arrow x1={226} y1={100} x2={262} y2={100} />
      <Box x={264} y={80} w={84} title="sₜ₊₁ 분포" sub="다음 상태" />
      <text x={180} y={186} textAnchor="middle" fontSize={12} fill={TEXT}>
        aₜ만 바꾼 쌍으로 sₜ₊₁ 변화를 확인
      </text>
    </g>
  );
}

const CHAIN = [
  { x: 10, label: "s₀" },
  { x: 82, label: "ŝ₁" },
  { x: 154, label: "ŝ₂" },
  { x: 290, label: "ŝ₃₂" },
] as const;

function Rollout() {
  return (
    <g>
      {CHAIN.map((node, index) => (
        <g key={node.label}>
          <rect x={node.x} y={70} width={60} height={30} rx={8} fill="none" stroke={index === 0 ? MUTED : ACCENT} strokeWidth={1} />
          <text x={node.x + 30} y={90} textAnchor="middle" fontSize={13} fontWeight={700} fill={index === 0 ? TEXT : ACCENT}>
            {node.label}
          </text>
          {index < 3 && <text x={node.x + 30} y={58} textAnchor="middle" fontSize={11} fill={TEXT}>a{["₀", "₁", "₂"][index]}</text>}
        </g>
      ))}
      <Arrow x1={70} y1={85} x2={80} y2={85} color={ACCENT} />
      <Arrow x1={142} y1={85} x2={152} y2={85} color={ACCENT} />
      <line x1={214} y1={85} x2={276} y2={85} stroke={ACCENT} strokeWidth={1} strokeDasharray="3 3" />
      <Arrow x1={276} y1={85} x2={288} y2={85} color={ACCENT} />
      <text x={250} y={78} textAnchor="middle" fontSize={12} fill={TEXT}>
        …
      </text>
      <line x1={40} y1={112} x2={112} y2={112} stroke={WARN} strokeWidth={1} />
      <text x={76} y={128} textAnchor="middle" fontSize={12} fontWeight={700} fill={WARN}>
        1-step error
      </text>
      <line x1={40} y1={150} x2={320} y2={150} stroke={WARN} strokeWidth={1} />
      <text x={180} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={WARN}>
        32-step rollout error
      </text>
      <text x={180} y={190} textAnchor="middle" fontSize={11} fill={TEXT}>
        ŝ는 실제 관측이 아니라 모델의 앞선 예측
      </text>
    </g>
  );
}

function ClosedLoop() {
  return (
    <g>
      <Box x={14} y={24} w={96} title="계획" sub="위치 0 → 목표 2" on />
      <Arrow x1={110} y1={44} x2={142} y2={44} />
      <Box x={144} y={24} w={88} title="controller" sub="행동 실행" />
      <Arrow x1={232} y1={44} x2={262} y2={44} />
      <Box x={264} y={24} w={84} title="실제 세계" />
      <Arrow x1={306} y1={64} x2={306} y2={104} />
      <Box x={252} y={106} w={96} title="sensor 관측" sub="관측값 0.8" on />
      <Box x={124} y={106} w={100} title="월드모델 예측" sub="예측값 1.0" />
      <Arrow x1={92} y1={64} x2={150} y2={104} />
      <line x1={196} y1={146} x2={226} y2={156} stroke={WARN} strokeWidth={1} />
      <line x1={278} y1={146} x2={248} y2={156} stroke={WARN} strokeWidth={1} />
      <text x={237} y={168} textAnchor="middle" fontSize={12} fontWeight={700} fill={WARN}>
        차이 0.2
      </text>
      <polyline points="330,146 330,178 34,178 34,70" fill="none" stroke={ACCENT} strokeWidth={1} />
      <Arrow x1={34} y1={80} x2={34} y2={66} color={ACCENT} />
      <text x={182} y={194} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>
        다음 계획은 관측 0.8에서 시작
      </text>
    </g>
  );
}

export default function WorldModelLoopViz() {
  return (
    <SceneShell
      eyebrow="생성에서 전이로"
      title="월드모델은 자기 예측을 다시 입력으로 받고, 결국 관측으로 고리를 닫습니다"
      description="왼쪽에서 오른쪽은 처리 순서입니다. s는 상태(state), a는 행동(action), ŝ는 모델이 예측한 상태입니다."
      ariaLabel="text-to-image 한 번 생성, 월드모델 한 step, rollout 누적, closed loop 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <OneShot />}
          {active === 1 && <OneStep />}
          {active === 2 && <Rollout />}
          {active === 3 && <ClosedLoop />}
        </svg>
      )}
    />
  );
}
