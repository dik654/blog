import SceneShell from "./SceneShell";
import { Arrow, Box } from "./SvgBits";

/**
 * 본문 대응: #limits — Shor는 인수분해·이산로그 가정에, Grover는 검색 문제에 닿으며 영향이 다르다.
 * 셋째 장면은 "초기 설정에서 비밀을 삭제했더라도 공개 군 원소의 이산로그를 계산하는 능력이 생기는 문제는 남는다"를 순서로 그립니다.
 */
const W = 360;
const H = 280;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";

const SCENES = [
  { label: "Shor · 인수분해", summary: "RSA", note: "RSA는 큰 수의 인수분해가 어렵다는 가정에 기댑니다. Shor는 그 가정을 직접 겨냥합니다. 규모는 9절의 2048비트 추정처럼 따로 읽습니다." },
  { label: "Shor · 이산로그", summary: "DH · 타원곡선 → 그 위의 서명 · 증명", note: "Diffie–Hellman과 타원곡선 계열은 이산로그 가정입니다. 이산로그는 거듭제곱한 결과에서 지수를 되찾는 문제입니다. 이 가정 위에 놓인 ECDSA·BLS 서명, 이산로그 기반 증명과 커밋도 각각 검토해야 합니다." },
  { label: "삭제한 비밀", summary: "지워도 공개값에서 다시 계산", note: "초기 설정에서 비밀을 지수로 써서 공개값(공개 군 원소)을 만들고 비밀을 지웠다고 합시다. 공개값은 남으므로, 이산로그를 계산할 수 있으면 공개값에서 다시 구할 수 있습니다." },
  { label: "Grover · 해시", summary: "일률적인 절반이 아님", note: "Grover는 검색 개선입니다. 해시의 원상 찾기와 충돌 찾기는 다른 문제이고 병렬화·메모리·회로 비용도 달라, 보안 수치가 똑같이 절반이 된다고 쓰면 안 됩니다." },
] as const;

function ThreatMap({ active }: { active: number }) {
  const shor = active < 2;
  const grover = active === 3;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Box x={8} y={6} w={214} h={38} text="Shor" color={BLUE} live={shor} />
      <Box x={238} y={6} w={114} h={38} text="Grover" color={AMBER} live={grover} />

      <g opacity={active === 0 ? 1 : 0.4}>
        <Arrow x1={50} y1={44} x2={50} y2={92} color={BLUE} />
      </g>
      <g opacity={active === 1 ? 1 : 0.4}>
        <Arrow x1={170} y1={44} x2={170} y2={92} color={BLUE} />
        <Arrow x1={170} y1={146} x2={170} y2={190} color={BLUE} />
      </g>
      <g opacity={grover ? 1 : 0.4}>
        <Arrow x1={295} y1={44} x2={295} y2={92} color={AMBER} />
      </g>

      <Box x={8} y={92} w={94} h={54} text="인수분해" sub="RSA" color={BLUE} live={active === 0} />
      <Box x={112} y={92} w={110} h={54} text="이산로그" sub="DH · 타원곡선" color={BLUE} live={active === 1} />
      <Box x={238} y={92} w={114} h={54} text="검색 문제" sub="개선 폭이 다름" color={AMBER} live={grover} />

      <Box x={84} y={190} w={138} h={54} text="서명 · 증명 · 커밋" sub="ECDSA · BLS" color={BLUE} live={active === 1} />
      <Box x={238} y={190} w={114} h={36} text="해시 원상 찾기" color={AMBER} live={grover} />
      <Box x={238} y={236} w={114} h={36} text="해시 충돌 찾기" color={AMBER} live={grover} />
      <g opacity={grover ? 1 : 0.4}>
        <Arrow x1={295} y1={146} x2={295} y2={190} color={AMBER} />
      </g>
      {grover && <text x={120} y={272} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>“전부 절반” ≠ 규칙</text>}
    </svg>
  );
}

function Setup({ active }: { active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Box x={20} y={8} w={140} h={52} text="초기 설정의 비밀" color={GRAY} />
      <Arrow x1={160} y1={34} x2={200} y2={34} color={GRAY} />
      <Box x={200} y={8} w={140} h={52} text="공개 군 원소" sub="계속 공개됨" color={BLUE} />

      <Arrow x1={90} y1={60} x2={90} y2={104} color={GRAY} />
      <Box x={20} y={104} w={140} h={52} text="비밀 삭제" sub="여기는 비어 있음" color={GRAY} dashed />
      <Arrow x1={270} y1={60} x2={270} y2={104} color={BLUE} />
      <Box x={200} y={104} w={140} h={52} text="공개값 그대로" color={BLUE} />

      <Arrow x1={270} y1={156} x2={270} y2={200} color={RED} />
      <text x={258} y={184} textAnchor="end" fontSize={13} fontWeight={700} fill={RED}>이산로그 계산 능력</text>
      <Box x={120} y={200} w={220} h={52} text="삭제와 무관하게 다시 구함" color={RED} />
    </svg>
  );
}

export default function AttackBranchViz() {
  return (
    <SceneShell
      eyebrow="영향의 갈래"
      title="공격마다 닿는 가정이 달라 교체 이유도 갈립니다"
      description="위가 양자 알고리즘, 아래가 그것이 닿는 수학 문제와 그 위의 암호입니다."
      ariaLabel="Shor와 Grover가 닿는 암호 가정과, 삭제한 비밀이 이산로그 계산으로 다시 드러나는 순서"
      scenes={SCENES}
      render={(active) => (active === 2 ? <Setup active={active} /> : <ThreatMap active={active} />)}
    />
  );
}
