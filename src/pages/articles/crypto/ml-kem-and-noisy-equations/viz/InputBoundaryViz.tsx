import SceneShell from "./SceneShell";
import { Arrow, Box } from "./SvgBits";

/**
 * 본문 대응: #source — 정상 길이의 부정한 캡슐은 내부에서 암묵적 거절, 길이·키 검사 실패는 바깥의 입력 경계.
 * 이 C 함수는 길이 인자를 받지 않으며 FIPS 203 §7.3의 검사는 호출부나 라이브러리에서 충족합니다.
 */
const W = 360;
const H = 276;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";

const SCENES = [
  { label: "길이가 틀림", summary: "바깥에서 검사 실패", note: "캡슐·복호 키 길이와 키 안의 공개 키 해시 검사는 호출부나 라이브러리의 입력 경계에서 합니다. 여기서 걸리면 안쪽 함수로 들어가지 않습니다." },
  { label: "길이는 맞고 부정", summary: "안쪽에서 대체 키", note: "길이가 맞는 부정한 캡슐은 안쪽 비교에서 다르게 나오고, 대체 키로 끝납니다. 불일치를 그대로 알려 주지 않는 이 처리가 암묵적 거절입니다." },
  { label: "정상 캡슐", summary: "안쪽에서 후보 키", note: "재생성한 캡슐이 같으면 정상 후보 키를 선택합니다. 세 경우의 처리 위치가 다르므로 모두 같은 오류라고 뭉뚱그리지 않습니다." },
] as const;

function Path({ active }: { active: number }) {
  const outer = active === 0;
  const fake = active === 1;
  const good = active === 2;
  const main = outer ? RED : good ? BLUE : AMBER;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Box x={8} y={4} w={220} h={36} text="받은 캡슐 · 복호 키" color={main} />
      <Arrow x1={118} y1={40} x2={118} y2={62} color={main} />
      <Box x={8} y={62} w={220} h={52} text="입력 경계" sub="길이 · 공개 키 해시 검사" color={main} />
      <g opacity={outer ? 1 : 0.35}>
        <Arrow x1={228} y1={88} x2={256} y2={88} color={RED} />
        <Box x={256} y={62} w={98} h={52} text="검사 실패" sub="여기서 끝" color={RED} live={outer} dashed />
      </g>
      <g opacity={outer ? 0.35 : 1}>
        <Arrow x1={118} y1={114} x2={118} y2={138} color={outer ? GRAY : main} />
        <rect x={2} y={132} width={356} height={140} rx={8} fill="none" stroke={GRAY} strokeWidth={1} strokeDasharray="4 3" />
        <text x={352} y={150} textAnchor="end" fontSize={12} fontWeight={700} fill={GRAY}>kem.c 함수 안</text>
        <Box x={8} y={156} w={220} h={38} text="재암호화 비교" color={outer ? GRAY : main} />
      </g>
      <g opacity={fake ? 1 : 0.35}>
        <Arrow x1={60} y1={194} x2={60} y2={222} color={AMBER} />
        <Box x={8} y={222} w={150} h={42} text="다름 → 대체 키" color={AMBER} live={fake} />
      </g>
      <g opacity={good ? 1 : 0.35}>
        <Arrow x1={200} y1={194} x2={240} y2={222} color={BLUE} />
        <Box x={172} y={222} w={180} h={42} text="같음 → 후보 키" color={BLUE} live={good} />
      </g>
    </svg>
  );
}

export default function InputBoundaryViz() {
  return (
    <SceneShell
      eyebrow="검사가 일어나는 자리"
      title="바깥 입력 검사와 안쪽 거절은 다른 자리에서 일어납니다"
      description="점선 안이 고정한 kem.c의 복원 함수입니다. 앞 그림은 안쪽만 보였고, 이 그림은 그 바깥까지 넣었습니다."
      ariaLabel="입력 길이 검사 실패, 부정한 캡슐의 암묵적 거절, 정상 캡슐의 처리 위치 비교"
      scenes={SCENES}
      render={(active) => <Path active={active} />}
    />
  );
}
